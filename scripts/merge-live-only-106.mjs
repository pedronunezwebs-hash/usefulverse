import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const target = resolve(process.env.GROWTH600_DIST ?? 'dist-growth600');
const manifestPath = resolve(root, 'src/growth600/live-only-106.manifest.json');
const sourceDir = resolve(root, 'src/growth600/live-only-106-source');
const sourceInventoryPath = join(sourceDir, 'source-inventory.json');
const origin = 'https://tools.usefulverse.com';
const expectedPages = 106 * 36;
const maxFiles = 18_500;
const maxFileBytes = 25 * 1024 * 1024;

function decodeEntities(value) {
  const named = { amp: '&', apos: "'", gt: '>', lt: '<', nbsp: '\u00a0', quot: '"' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/giu, (whole, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()] ?? whole;
    const hex = entity[1]?.toLowerCase() === 'x';
    const point = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
    return Number.isFinite(point) && point <= 0x10ffff ? String.fromCodePoint(point) : whole;
  });
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function safeRelativePath(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || path.split('/').includes('..') || path.includes('\\')) {
    throw new Error(`Unsafe snapshot path: ${path}`);
  }
  return path.slice(1);
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'isu'));
  return match ? decodeEntities(match[2]) : null;
}

function pageMetadata(page) {
  const h1 = page.html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/iu)?.[1];
  const descriptionTag = page.html.match(/<meta\b[^>]*name=["']description["'][^>]*>/iu)?.[0];
  const description = descriptionTag ? getAttribute(descriptionTag, 'content') : null;
  const name = h1 ? decodeEntities(h1.replace(/<[^>]*>/gu, '').replace(/\s+/gu, ' ').trim()) : '';
  const normalizedDescription = description?.replace(/\s+/gu, ' ').trim();
  if (!name || !normalizedDescription) throw new Error(`Missing localized home-card copy: ${page.url}`);
  return { name, description: normalizedDescription };
}

async function walkFiles(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walkFiles(path, files);
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

if (!(await stat(target).then(() => true, () => false))) throw new Error(`Staged hub build is missing: ${target}`);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const expectedIds = new Set(manifest.tools.map(({ id }) => id));
if (manifest.schemaVersion !== 1 || manifest.origin !== origin || expectedIds.size !== 106 || manifest.tools.length !== 106) {
  throw new Error('The live-only recovery manifest is invalid or incomplete.');
}

const sourceInventory = JSON.parse(await readFile(sourceInventoryPath, 'utf8'));
if (sourceInventory.schemaVersion !== 1 || sourceInventory.origin !== origin || sourceInventory.pageCount !== expectedPages || sourceInventory.toolIds?.length !== 106) {
  throw new Error(`Editable recovery source must contain exactly ${expectedPages} localized routes for 106 tools.`);
}
if (!Array.isArray(sourceInventory.routes) || sourceInventory.routes.length !== sourceInventory.sourceSitemapUrlCount || new Set(sourceInventory.routes).size !== sourceInventory.sourceSitemapUrlCount) {
  throw new Error('Editable recovery source is missing its complete, unique source sitemap inventory.');
}

const pages = await Promise.all(sourceInventory.routes
  .filter((url) => {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/^\/(?:[a-z0-9-]+\/)?tools\/([a-z0-9-]+)\/$/u);
    return parsed.origin === origin && match && expectedIds.has(match[1]);
  })
  .map(async (url) => {
    const parsed = new URL(url);
    const route = safeRelativePath(parsed.pathname);
    const file = join(sourceDir, 'pages', `${route}index.html`);
    return { url, path: parsed.pathname, html: await readFile(file, 'utf8') };
  }));
if (pages.length !== expectedPages) throw new Error(`Editable source contains ${pages.length} tool pages, expected ${expectedPages}.`);
const snapshot = { sourceSitemapUrls: sourceInventory.routes, pages };

const pageByUrl = new Map();
const routesById = new Map([...expectedIds].map((id) => [id, new Set()]));
const homeCards = new Map();
const sitemapUrls = new Set();
for (const page of snapshot.pages) {
  if (typeof page.url !== 'string' || typeof page.path !== 'string' || typeof page.html !== 'string') throw new Error('Malformed page entry in live-only snapshot.');
  const url = new URL(page.url);
  if (url.origin !== origin || url.search || url.hash || page.path !== url.pathname) throw new Error(`Page URL/path mismatch: ${page.url}`);
  const match = url.pathname.match(/^\/(?:([a-z0-9-]+)\/)?tools\/([a-z0-9-]+)\/$/u);
  if (!match || !expectedIds.has(match[2])) throw new Error(`Unexpected route in recovery snapshot: ${page.url}`);
  const localePrefix = match[1] ?? '';
  pageByUrl.set(page.url, page);
  sitemapUrls.add(page.url);
  routesById.get(match[2]).add(localePrefix);

  const canonicalTag = page.html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/iu)?.[0];
  const canonical = canonicalTag ? getAttribute(canonicalTag, 'href') : null;
  if (canonical !== page.url) throw new Error(`Canonical mismatch in captured route: ${page.url}`);
  if (/name=["']robots["'][^>]*content=["'][^"']*noindex/iu.test(page.html)) throw new Error(`Captured route is marked noindex: ${page.url}`);

  const card = pageMetadata(page);
  const list = homeCards.get(localePrefix) ?? [];
  const href = `${localePrefix ? `/${localePrefix}` : ''}/tools/${match[2]}/`;
  list.push({ id: match[2], href, ...card });
  homeCards.set(localePrefix, list);
}
if (pageByUrl.size !== expectedPages) throw new Error(`Recovery snapshot has ${pageByUrl.size} unique routes, expected ${expectedPages}.`);
const localePrefixes = new Set(homeCards.keys());
if (localePrefixes.size !== 36 || [...localePrefixes].some((prefix) => homeCards.get(prefix).length !== 106)) {
  throw new Error('The snapshot must provide exactly 106 routes in each of 36 locale homes.');
}
for (const [id, locales] of routesById) if (locales.size !== 36) throw new Error(`${id} has ${locales.size} localized pages, expected 36.`);

const assetMap = new Map();
for (const urlPath of sourceInventory.assetPaths ?? []) {
  const rel = safeRelativePath(urlPath);
  if (!(rel === 'favicon.svg' || rel.startsWith('assets/'))) throw new Error(`Invalid recovered asset path: ${urlPath}`);
  const sourcePath = join(sourceDir, rel);
  const bytes = await readFile(sourcePath);
  if (!bytes.length) throw new Error(`Invalid or empty recovered asset: ${urlPath}`);
  assetMap.set(rel, bytes);
}
if (assetMap.size < 1) throw new Error('Editable recovery source contains no static assets.');

const stagedSitemapPath = join(target, 'sitemap.xml');
const stagedSitemap = await readFile(stagedSitemapPath, 'utf8');
const beforeUrls = [...stagedSitemap.matchAll(/<loc>(.*?)<\/loc>/gu)].map((match) => decodeEntities(match[1]));
const beforeSet = new Set(beforeUrls);
if (beforeSet.size !== beforeUrls.length) throw new Error('Staged sitemap already contains duplicate URLs.');
for (const url of sitemapUrls) if (beforeSet.has(url)) throw new Error(`Recovery route already exists in build output: ${url}`);
for (const record of manifest.tools) {
  const existing = beforeUrls.some((url) => url.includes(`/tools/${record.id}/`));
  if (existing) throw new Error(`Live-only ID conflicts with an existing catalog route: ${record.id}`);
}

// Verify all references needed by the captured pages are present before writing.
for (const page of snapshot.pages) {
  const refs = [...page.html.matchAll(/<(?:script|link)\b[^>]*>/giu)].map((match) => match[0]);
  for (const tag of refs) {
    const tagName = tag.match(/^<([a-z]+)/iu)?.[1]?.toLowerCase();
    const rel = (getAttribute(tag, 'rel') ?? '').toLowerCase().split(/\s+/u);
    const ref = tagName === 'script' ? getAttribute(tag, 'src') : tagName === 'link' && (rel.includes('stylesheet') || rel.includes('icon')) ? getAttribute(tag, 'href') : null;
    if (!ref || !ref.startsWith('/')) continue;
    const assetRel = safeRelativePath(ref.split(/[?#]/u)[0]);
    if ((assetRel === 'favicon.svg' || assetRel.startsWith('assets/')) && !assetMap.has(assetRel)) throw new Error(`Snapshot route references uncaptured asset ${ref}: ${page.url}`);
  }
}

let copiedAssets = 0;
for (const [rel, bytes] of assetMap) {
  const destination = join(target, rel);
  if (await stat(destination).then(() => true, () => false)) {
    const existing = await readFile(destination);
    if (!existing.equals(bytes)) throw new Error(`Captured asset conflicts with a different staged asset: ${rel}`);
    continue;
  }
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, bytes, { flag: 'wx' });
  copiedAssets += 1;
}

for (const page of snapshot.pages) {
  const rel = `${safeRelativePath(page.path)}/index.html`;
  const destination = join(target, rel);
  if (await stat(destination).then(() => true, () => false)) throw new Error(`Refusing to replace a staged route: ${rel}`);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, page.html, { flag: 'wx' });
}

for (const [prefix, cards] of homeCards) {
  const homePath = join(target, prefix, 'index.html');
  let home = await readFile(homePath, 'utf8');
  if (!home.includes('class="tool-directory"')) throw new Error(`Missing tool directory on ${prefix || 'en'} home page.`);
  const cardsHtml = cards.map(({ href, name, description }) => `<li><a href="${escapeHtml(href)}"><h2>${escapeHtml(name)}</h2><p>${escapeHtml(description)}</p></a></li>`);
  const missingCards = cardsHtml.filter((card) => {
    const href = card.match(/href="([^"]+)"/u)?.[1];
    return href && !home.includes(`href="${href}"`);
  });
  if (missingCards.length !== 106) throw new Error(`${prefix || 'en'} home already has a conflicting subset of legacy entries.`);
  home = home.replace(/(<ul class="tool-directory">[\s\S]*?)(<\/ul>)/u, (_match, list, closing) => `${list}${missingCards.join('')}${closing}`);
  await writeFile(homePath, home);

  const llmsPath = join(target, prefix, 'llms.txt');
  let llms = await readFile(llmsPath, 'utf8');
  const llmsLines = cards.map(({ href, name, description }) => `- [${name.replace(/[\[\]]/gu, '\\$&')}](${new URL(href, origin)}): ${description}`);
  const absentLines = llmsLines.filter((line) => !llms.includes(line));
  if (absentLines.length !== 106) throw new Error(`${prefix || 'en'} llms.txt has partial/conflicting legacy entries.`);
  llms = llms.replace(/\n- \[Sitemap\]/u, `\n\n${absentLines.join('\n')}\n\n- [Sitemap]`);
  await writeFile(llmsPath, llms);

  const updatedHome = await readFile(homePath, 'utf8');
  const allLegacyLinks = cards.filter(({ href }) => updatedHome.includes(`href="${href}"`)).length;
  if (allLegacyLinks !== 106) throw new Error(`${prefix || 'en'} directory has ${allLegacyLinks}/106 recovered tool links.`);
  if (absentLines.some((line) => !llms.includes(line))) throw new Error(`${prefix || 'en'} llms.txt was not fully updated.`);
}

const mergedUrls = new Set([...beforeUrls, ...sitemapUrls]);
const expectedUrls = new Set(snapshot.sourceSitemapUrls);
if (mergedUrls.size !== expectedUrls.size || [...expectedUrls].some((url) => !mergedUrls.has(url))) {
  const missing = [...expectedUrls].filter((url) => !mergedUrls.has(url));
  const extra = [...mergedUrls].filter((url) => !expectedUrls.has(url));
  throw new Error(`Merged sitemap differs from the captured public sitemap: ${missing.length} missing, ${extra.length} extra.`);
}
const newEntries = [...sitemapUrls].map((url) => `  <url><loc>${url}</loc></url>`).join('\n');
await writeFile(stagedSitemapPath, stagedSitemap.replace('</urlset>', `${newEntries}\n</urlset>`));

const files = await walkFiles(target);
if (files.length > maxFiles) throw new Error(`Recovered output exceeds ${maxFiles} files: ${files.length}.`);
let totalBytes = 0;
for (const file of files) {
  const bytes = (await stat(file)).size;
  if (bytes > maxFileBytes) throw new Error(`Recovered output has an asset over 25 MiB: ${relative(target, file)} (${bytes}).`);
  totalBytes += bytes;
}
const finalSitemap = await readFile(stagedSitemapPath, 'utf8');
const finalCount = finalSitemap.match(/<loc>/gu)?.length ?? 0;
if (finalCount !== sourceInventory.sourceSitemapUrlCount) throw new Error(`Final sitemap has ${finalCount} URLs; captured public sitemap has ${sourceInventory.sourceSitemapUrlCount}.`);

console.log(`Restored ${expectedIds.size} live-only tools and ${expectedPages} localized pages; copied ${copiedAssets}/${assetMap.size} assets.`);
console.log(`Homepage directories and llms.txt now include all ${expectedIds.size} recovered tools in ${localePrefixes.size} locales.`);
console.log(`Sitemap exactly matches captured public inventory (${finalCount} URLs); build contains ${files.length} files (${totalBytes} bytes).`);
