import { createHash } from 'node:crypto';
import { lstat, mkdir, mkdtemp, readFile, realpath, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { brotliCompressSync } from 'node:zlib';
import { openBuildSource } from './packed-build.mjs';
import { checkResources } from './local-resources.mjs';
import { attribute, hasOldHost, inspectHTML, mergeHeaders, mergeRedirects, normalizeURL, parseSitemap, rewriteOrigins, sitemapXML, TARGET, unescape, xml } from './compose-sites-metadata.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const roles = ['main', 'hub', 'preview'];
const sha = data => createHash('sha256').update(data).digest('hex');
const inside = (parent, child) => { const p = relative(parent, child); return !p || !isAbsolute(p) && p !== '..' && !p.startsWith('../'); };
const toolRoute = path => path.match(/^(?:([a-z\d-]+)\/)?tools\/([a-z\d-]+)\/index\.html$/iu);
const homeRoute = path => /^(?:[a-z\d-]+\/)?index\.html$/iu.test(path);
const llmsRoute = path => /^(?:[a-z\d-]+\/)?llms\.txt$/iu.test(path);
const generated = path => ['_headers', '_redirects', 'robots.txt'].includes(path) || /^sitemap(?:-[\w-]+)?\.xml$/u.test(path);
const routeFile = url => { const p = new URL(url).pathname.slice(1); return p.endsWith('/') || !p ? p + 'index.html' : p; };
const fileURL = path => TARGET + '/' + path.replace(/index\.html$/u, '');

function primaryCards(primary) {
  return new Map((primary.match(/<a\b[^>]*class="tool-card"[^>]*>/gu) ?? []).map(tag => [attribute(tag, 'href'), { category: attribute(tag, 'data-category'), search: attribute(tag, 'data-search') }]));
}
export function homeSearchIndex(primary, tools) {
  const old = primaryCards(primary);
  return Object.fromEntries([...tools].sort((a, b) => a.url < b.url ? -1 : a.url > b.url ? 1 : 0).map(tool => {
    const path = new URL(tool.url).pathname;
    return [path, [old.get(path)?.search, tool.title, tool.id, tool.description].filter(Boolean).join(' ')];
  }));
}
export function compactHome(primary, tools, { indexURL, runtimeURL } = {}) {
  if (inspectHTML(primary).noindex) throw Error('The primary home must remain indexable');
  // The live hub already has an indexed nb directory; main has no nb home.
  // Preserve this existing template and its language rather than inventing one.
  if (!primary.includes('id="tool-grid"') && primary.includes('<ul class="tool-directory">')) {
    const directory = /<ul class="tool-directory">[\s\S]*?<\/ul>/gu;
    if ([...primary.matchAll(directory)].length !== 1) throw Error('Existing hub directory contract changed');
    const links = [...tools].sort((a, b) => a.id < b.id ? -1 : 1).map(tool => `<li><a href="${xml(new URL(tool.url).pathname)}"${tool.language ? ` lang="${xml(tool.language)}"` : ''}><h2>${xml(tool.title)}</h2></a></li>`).join('');
    return primary.replace(directory, `<ul class="tool-directory tool-directory--composed">${links}</ul>`).replace('</head>', '<style>.tool-directory--composed li a{min-height:44px;overflow-wrap:anywhere}.tool-directory--composed h2{margin:0}</style></head>');
  }
  const all = attribute(primary.match(/<button\b[^>]*data-category-filter=[^>]*>/u)?.[0] ?? '', 'data-category-filter');
  if (!all) throw Error('Primary home has no category/search contract');
  const oldCards = primaryCards(primary);
  const cards = [...tools].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0).map(tool => {
    const path = new URL(tool.url).pathname;
    const previous = oldCards.get(path), category = previous?.category ?? all;
    const search = tool.title + ' ' + tool.id;
    return `<a class="tool-card tool-card--compact" href="${xml(path)}" data-category="${xml(category)}" data-search="${xml(search)}"><h3>${xml(tool.title)}</h3></a>`;
  }).join('\n');
  const grid = /<div class="tool-grid" id="tool-grid">[\s\S]*?<\/div>(?=<p class="empty-state")/gu;
  if ([...primary.matchAll(grid)].length !== 1) throw Error('Primary home grid contract changed; review its merger');
  const style = '<style>.tool-card--compact{min-height:0;gap:.5rem}.tool-card--compact h3{margin:0;font-size:1rem}</style>';
  const index = indexURL ? ` data-search-index="${xml(indexURL)}"` : '';
  const runtime = runtimeURL ? `<script type="module" src="${xml(runtimeURL)}"></script>` : '';
  return primary.replace(grid, `<div class="tool-grid" id="tool-grid"${index}>${cards}</div>`).replace('</head>', style + runtime + '</head>');
}

async function readEntry(entry) {
  const bytes = entry.read ? await entry.read() : await readFile(entry.source);
  if (sha(bytes) !== entry.sha256) throw Error(`Build input changed after inventory: ${entry.path}`);
  return bytes;
}

/** Compose only already-built local files. Never deploy, activate or edit inputs. */
export async function composeSites(options) {
  const sources = {};
  try {
    for (const role of roles) sources[role] = await openBuildSource(options[role]);
    return await composeSources({ ...options, sources });
  } finally { for (const source of Object.values(sources)) await source.close(); }
}
async function composeSources({ sources, output, existingIds, draftIds, draftPrefixes,
  write = false, maxFiles = 80_000, maxAssetBytes = 25 * 1024 * 1024, maxOutputBytes = 1_500_000_000,
  maxHomeBrotliBytes = 25 * 1024,
  workingRoot, maxWorkingBytes = 2_000_000_000, minFreeBytes = 10_000_000_000,
  renderHome = compactHome, scope = 'partial-test' }) {
  if (!Array.isArray(existingIds) || !Array.isArray(draftIds) || !Array.isArray(draftPrefixes) || !draftPrefixes.length) throw Error('Explicit catalog IDs/locales are required');
  const existing = new Set(existingIds), drafts = new Set(draftIds);
  if (![...existing, ...drafts].every(id => /^[a-z\d]+(?:-[a-z\d]+)*$/u.test(id)) || new Set(draftPrefixes).size !== draftPrefixes.length || !draftPrefixes.every(p => /^(?:[a-z\d]+(?:-[a-z\d]+)*)?$/u.test(p))) throw Error('Invalid catalog IDs/locales');
  if (existing.size !== existingIds.length || drafts.size !== draftIds.length || [...drafts].some(id => existing.has(id))) throw Error('Catalog IDs overlap or repeat');
  const inputs = Object.fromEntries(roles.map(role => [role, sources[role].root]));
  const roots = Object.values(inputs);
  for (let i = 0; i < roots.length; i++) for (let j = i + 1; j < roots.length; j++) if (inside(roots[i], roots[j]) || inside(roots[j], roots[i])) throw Error('Input trees overlap');
  const parent = await realpath(dirname(resolve(output))), target = join(parent, basename(output));
  if (roots.some(root => inside(root, target) || inside(target, root))) throw Error('Output overlaps a build input');
  const workRoot = await realpath(workingRoot ?? parent);
  if (![...roots, target].every(path => inside(workRoot, path))) throw Error('All builds/output must be inside the accounted working tree');
  try { await lstat(target); throw Error('Refusing to overwrite an existing output'); } catch (error) { if (error.code !== 'ENOENT') throw error; }

  const maps = {}, files = new Map(), homes = new Map(), llms = new Map(), toolsByPrefix = new Map();
  const normalizedRecords = new Map(), sourceRecords = [], draftRoutes = new Set(), existingRoutes = new Set();
  let sameFiles = 0, homeConflicts = 0, llmsConflicts = 0, inputBytes = 0;
  for (const role of roles) {
    maps[role] = sources[role].files;
    for (const [path, file] of maps[role]) {
      if (file.bytes > maxAssetBytes) throw Error(`Input asset exceeds budget: ${path}`);
      inputBytes += file.bytes;
      const entry = { ...file, path, role };
      if (generated(path)) continue;
      if (llmsRoute(path)) { const list = llms.get(path) ?? []; if (list.length) llmsConflicts++; list.push(entry); llms.set(path, list); continue; }
      if (homeRoute(path)) { const list = homes.get(path) ?? []; if (list.length) homeConflicts++; list.push(entry); homes.set(path, list); continue; }
      const match = toolRoute(path);
      if (match) {
        const [, prefix = '', id] = match, isDraft = role === 'preview';
        if (isDraft && !draftPrefixes.includes(prefix)) throw Error(`Unexpected draft locale: ${prefix}`);
        if (!(isDraft ? drafts : existing).has(id)) throw Error(`Unexpected ${role} tool: ${id}`);
        if (files.has(path)) throw Error(`Two builds claim the same tool route: ${path}`);
        const text = (await readEntry(entry)).toString('utf8'), info = inspectHTML(text), url = fileURL(path);
        if (info.canonical !== url || !info.title || !info.description) throw Error(`Missing/mismatched tool metadata: ${path}`);
        if (info.noindex !== isDraft) throw Error(`Wrong noindex for ${role}: ${path}`);
        if (isDraft) draftRoutes.add(url); else existingRoutes.add(url);
        const list = toolsByPrefix.get(prefix) ?? []; list.push({ id, title: info.title, description: info.description, language: info.language, url }); toolsByPrefix.set(prefix, list);
      }
      const previous = files.get(path);
      if (previous) {
        if (previous.sha256 !== entry.sha256 || previous.bytes !== entry.bytes) throw Error(`Unreviewed file collision: ${path}`);
        sameFiles++;
      } else files.set(path, entry);
    }
  }
  for (const id of existing) if (!existingRoutes.has(`${TARGET}/tools/${id}/`)) throw Error(`Existing English tool missing: ${id}`);
  for (const id of drafts) for (const prefix of draftPrefixes) {
    if (!draftRoutes.has(`${TARGET}/${prefix ? prefix + '/' : ''}tools/${id}/`)) throw Error(`Draft locale missing: ${prefix}/${id}`);
  }

  const readRole = async (role, path, required = true) => {
    const entry = maps[role].get(path);
    if (!entry) { if (required) throw Error(`Missing ${role} metadata: ${path}`); return ''; }
    return (await readEntry({ ...entry, path })).toString('utf8');
  };
  for (const role of roles) {
    const visited = new Set();
    async function sitemap(path) {
      if (visited.has(path)) throw Error('Repeated/cyclic sitemap reference'); visited.add(path);
      const parsed = parseSitemap(await readRole(role, path));
      for (const record of parsed.records) {
        const loc = normalizeURL(record.loc);
        if (parsed.type === 'sitemapindex') { await sitemap(routeFile(loc)); continue; }
        if (role === 'preview') throw Error('Draft URLs must not be in a sitemap');
        const file = routeFile(loc);
        if (!maps[role].has(file)) throw Error(`Sitemap URL has no source page: ${loc}`);
        const info = inspectHTML(await readRole(role, file));
        if (info.noindex || info.canonical !== loc) throw Error(`Indexable sitemap page is noindex or has the wrong canonical: ${loc}`);
        sourceRecords.push(loc);
        if (!normalizedRecords.has(loc)) normalizedRecords.set(loc, { ...record, loc });
      }
    }
    await sitemap('sitemap.xml');
    const robots = await readRole(role, 'robots.txt');
    if (/^\s*Disallow:\s*\S+/imu.test(robots)) throw Error('Robots restrictions require a manual review');
  }
  for (const url of existingRoutes) if (!normalizedRecords.has(url)) throw Error(`Existing tool missing from sitemaps: ${url}`);
  for (const [path, entry] of files) if (path.endsWith('.html')) {
    const info = inspectHTML((await readEntry(entry)).toString('utf8'));
    if (!info.noindex && info.alternates.some(url => draftRoutes.has(url))) throw Error(`Indexable hreflang points to a draft: ${path}`);
  }
  const headerText = mergeHeaders(await readRole('main', '_headers'), await readRole('hub', '_headers'), await readRole('preview', '_headers'));
  const redirectText = mergeRedirects(await Promise.all(roles.map(role => readRole(role, '_redirects', false))));
  if (!files.has('404.html') || files.get('404.html').role !== 'main') throw Error('The primary 404.html is required');

  const metadata = new Map([['_headers', headerText], ['robots.txt', `User-agent: *\nAllow: /\nSitemap: ${TARGET}/sitemap.xml\n`]]);
  if (redirectText) metadata.set('_redirects', redirectText);
  const prefixes = [...new Set([...draftPrefixes, ...toolsByPrefix.keys()])].sort((a, b) => b.length - a.length);
  const byLanguage = new Map();
  for (const record of [...normalizedRecords.values()].sort((a, b) => a.loc < b.loc ? -1 : 1)) {
    const path = new URL(record.loc).pathname;
    const prefix = prefixes.find(p => p && path.startsWith('/' + p + '/')) ?? '';
    const list = byLanguage.get(prefix) ?? []; list.push(record); byLanguage.set(prefix, list);
  }
  const index = [];
  for (const [prefix, records] of [...byLanguage].sort()) {
    const name = `sitemap-${prefix || 'en'}.xml`; metadata.set(name, sitemapXML(records)); index.push({ loc: `${TARGET}/${name}` });
  }
  metadata.set('sitemap.xml', sitemapXML(index, true));
  const homeBudgets = [];
  const searchRuntime = await readFile(new URL('../src/composed-home-search.mjs', import.meta.url), 'utf8');
  const runtimePath = `assets/composed-search.${sha(searchRuntime).slice(0, 12)}.mjs`;
  metadata.set(runtimePath, searchRuntime);
  for (const [path, entries] of homes) {
    const primary = entries.find(e => e.role === 'main') ?? entries.find(e => e.role === 'hub' && normalizedRecords.has(fileURL(path)));
    if (!primary) throw Error(`Home without a primary template: ${path}`);
    const prefix = path === 'index.html' ? '' : path.split('/')[0];
    const template = rewriteOrigins((await readEntry(primary)).toString('utf8')), links = toolsByPrefix.get(prefix) ?? [];
    const searchIndex = JSON.stringify(homeSearchIndex(template, links));
    const indexPath = `assets/search-index-${prefix || 'en'}.${sha(searchIndex).slice(0, 12)}.json`;
    metadata.set(indexPath, searchIndex);
    const text = renderHome(template, links, { indexURL: '/' + indexPath, runtimeURL: '/' + runtimePath });
    const info = inspectHTML(text);
    if (info.noindex || info.canonical !== fileURL(path) || info.alternates.some(url => draftRoutes.has(url)) || hasOldHost(text)) throw Error('Unified home metadata is unsafe');
    for (const tool of toolsByPrefix.get(prefix) ?? []) if (!text.includes(`href="${new URL(tool.url).pathname}"`)) throw Error(`Home lost a tool link: ${tool.id}`);
    const brotliBytes = brotliCompressSync(text).length;
    if (brotliBytes > maxHomeBrotliBytes) throw Error(`Home exceeds Brotli budget: ${path}`);
    homeBudgets.push({ path, bytes: Buffer.byteLength(text), brotliBytes });
    metadata.set(path, text);
  }
  for (const [path, text] of metadata) {
    if (files.has(path)) throw Error(`Generated metadata collides with an asset: ${path}`);
    if (Buffer.byteLength(text) > maxAssetBytes || hasOldHost(text)) throw Error(`Unsafe/oversized generated asset: ${path}`);
  }
  // Dry runs enforce the same content rules as writes; only the filesystem
  // mutation differs. Hashed scripts/styles must be rebuilt, never rewritten.
  for (const [path, entry] of files) if (/\.(?:html?|m?js|css|json|svg)$/iu.test(path)) {
    let text = (await readEntry(entry)).toString('utf8');
    if (/\.html?$/iu.test(path)) text = rewriteOrigins(text);
    if (hasOldHost(text)) throw Error(`Rebuild old-host asset in its source before composing: ${path}`);
  }
  for (const [path, entries] of llms) {
    const lines = [];
    for (const entry of entries) for (const line of rewriteOrigins((await readEntry(entry)).toString('utf8')).split('\n')) if (!lines.includes(line)) lines.push(line);
    metadata.set(path, lines.join('\n') + '\n');
  }
  const estimatedBytes = [...files.values()].reduce((n, f) => n + f.bytes, 0) + [...metadata.values()].reduce((n, t) => n + Buffer.byteLength(t), 0);
  if (files.size + metadata.size > maxFiles || estimatedBytes > maxOutputBytes) throw Error('Unified output exceeds its project budget');
  const resources = await checkResources(workRoot, estimatedBytes, { maxWorkingBytes, minFreeBytes });
  const report = { scope, existingTools: existing.size, draftTools: drafts.size, existingToolRoutes: existingRoutes.size,
    draftToolRoutes: draftRoutes.size, requiredDraftLocales: draftPrefixes.length, inputSitemapURLs: sourceRecords.length, outputSitemapURLs: normalizedRecords.size,
    deduplicatedFiles: sameFiles, resolvedHomeCollisions: homeConflicts, resolvedLlmsCollisions: llmsConflicts,
    files: files.size + metadata.size, estimatedBytes, inputBytes, sitemapLanguages: byLanguage.size, homeBudgets,
    resources,
    homePolicy: 'primary-template-compact-directory-all-links-search-index-on-first-query',
    categoryPolicy: 'preserve-primary-categories-other-tools-searchable-under-existing-all-label',
    deployments: 0, toolsActivated: 0, deploymentApproved: false, cloudflarePlanVerified: false, written: false };
  if (!write) return report;
  const stage = await mkdtemp(join(parent, '.compose-sites-'));
  try {
    for (const [path, entry] of files) {
      let bytes = await readEntry(entry);
      if (/\.html?$/iu.test(path)) bytes = Buffer.from(rewriteOrigins(bytes.toString('utf8')));
      else if (/\.(?:m?js|css|json|svg)$/iu.test(path) && hasOldHost(bytes.toString('utf8'))) throw Error(`Rebuild old-host asset in its source before composing: ${path}`);
      if (hasOldHost(path)) throw Error('Legacy host in output path');
      if (/\.html?$/iu.test(path) && hasOldHost(bytes.toString('utf8'))) throw Error(`Unconverted legacy host in HTML: ${path}`);
      const dest = join(stage, path); await mkdir(dirname(dest), { recursive: true }); await writeFile(dest, bytes);
    }
    for (const [path, text] of metadata) {
      if (Buffer.byteLength(text) > maxAssetBytes) throw Error(`Generated asset exceeds budget: ${path}`);
      const dest = join(stage, path); await mkdir(dirname(dest), { recursive: true }); await writeFile(dest, text);
    }
    await rename(stage, target); report.written = true;
  } finally { await rm(stage, { recursive: true, force: true }); }
  return report;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const values = {}; let write = false;
  for (let i = 2; i < process.argv.length; i++) {
    const key = process.argv[i];
    if (key === '--write') write = true;
    else if (['--main', '--hub', '--preview', '--output'].includes(key) && process.argv[i + 1] && !Object.hasOwn(values, key.slice(2))) values[key.slice(2)] = process.argv[++i];
    else throw Error(`Unknown/repeated option: ${key}`);
  }
  const { tools: mainTools } = await import('../src/catalog.mjs');
  const { growthPilotTools } = await import('../src/growth600/catalog.mjs');
  const { marketTools } = await import('../src/markets-no-ch/catalog.mjs');
  const { localeEntries } = await import('../src/locales.mjs');
  const progress = JSON.parse(await readFile(join(ROOT, 'docs/planning/usefulverse-1000-2026-10-19/implementation-progress.json')));
  const recovered = JSON.parse(await readFile(join(ROOT, 'src/growth600/live-only-106.manifest.json')));
  const drafts = progress.tools.map(t => t.slug), candidate = new Set(drafts);
  const existing = [...mainTools, ...growthPilotTools.filter(t => !candidate.has(t.id)), ...marketTools, ...recovered.tools].map(t => t.id);
  if (existing.length !== 700 || drafts.length !== 300) throw Error('Expected the frozen 700 + 300 catalog');
  console.log(JSON.stringify(await composeSites({ ...values, existingIds: existing, draftIds: drafts,
    draftPrefixes: [...new Set([...localeEntries.map(l => l.prefix.replace(/^\//u, '')), 'nb'])], workingRoot: ROOT, write, scope: 'full-catalog-draft-not-deployment-approved' }), null, 2));
}
