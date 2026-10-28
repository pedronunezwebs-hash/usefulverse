import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { composeSites, compactHome, homeSearchIndex } from './compose-sites.mjs';
import { inventory } from './release-capacity.mjs';
import { attribute, inspectHTML, mergeHeaders, mergeRedirects, normalizeURL, parseSitemap, sitemapXML, TARGET } from './compose-sites-metadata.mjs';
import { renderHome } from '../src/template.mjs';
import { tools, categories } from '../src/catalog.mjs';
import { brotliCompressSync } from 'node:zlib';
import { createSources } from './localization/autopilot-source.mjs';
import { packBuild } from './packed-build.mjs';

const hubOrigin = 'https://tools.usefulverse.com', draftOrigin = 'https://draft-300-noindex.usefulverse-tools.pages.dev';
const page = (origin, path, noindex = false, extra = '') => `<!doctype html><html><head><link rel="canonical" href="${origin}${path}"><meta name="description" content="Useful local tool"><meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">${extra}</head><body><h1>Tool ${path.split('/').at(-2)}</h1></body></html>`;
const headers = '/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Cache-Control: public, max-age=0, must-revalidate\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n';
async function fixture(run) {
  const root = await mkdtemp(join(import.meta.dirname, '.compose-test-'));
  const dirs = Object.fromEntries(['main', 'hub', 'preview'].map(role => [role, join(root, role)]));
  const put = async (role, path, text) => { const file = join(dirs[role], path); await mkdir(join(file, '..'), { recursive: true }); await writeFile(file, text); };
  try {
    for (const [role, origin, id] of [['main', TARGET, 'alpha'], ['hub', hubOrigin, 'beta'], ['preview', draftOrigin, 'gamma']]) {
      await mkdir(dirs[role]);
      const records = [];
      for (const prefix of ['', 'es/']) {
        const home = renderHome([tools[0]], ['All', tools[0].category], 'fixture', prefix ? 'es' : 'en');
        await put(role, `${prefix}index.html`, home.replaceAll(TARGET, origin).replace('</head>', role === 'preview' ? '<meta name="robots" content="noindex, follow"></head>' : '</head>'));
        await put(role, `${prefix}llms.txt`, `# UsefulVerse\n${origin}/${prefix}tools/${id}/\n`);
        const path = `/${prefix}tools/${id}/`;
        await put(role, `${prefix}tools/${id}/index.html`, page(origin, path, role === 'preview'));
        if (role !== 'preview') records.push({ loc: `${origin}/${prefix}`, lastmod: '2026-10-28' }, { loc: `${origin}${path}` });
      }
      await put(role, '_headers', role === 'main' ? (await readFile(new URL('../public/_headers', import.meta.url), 'utf8')) : headers + (role === 'preview' ? '\n/draft-only/*\n  X-Robots-Tag: noindex, follow\n' : ''));
      // The real preview adds HTTP noindex to an existing rule, not a new rule.
      if (role === 'preview') await put(role, '_headers', headers.replace('/*\n', '/*\n  X-Robots-Tag: noindex, follow\n'));
      await put(role, 'robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
      await put(role, 'sitemap.xml', sitemapXML(records));
      await put(role, 'assets/shared.js', 'console.log("shared")');
    }
    await put('main', '404.html', page(TARGET, '/404.html', true));
    const options = { ...dirs, output: join(root, 'out'), existingIds: ['alpha', 'beta'], draftIds: ['gamma'], draftPrefixes: ['', 'es'] };
    await run({ root, dirs, put, options });
  } finally { await rm(root, { recursive: true, force: true }); }
}

test('composes every route, preserves inputs, noindex, metadata and asset bytes', () => fixture(async ({ dirs, options }) => {
  const before = await Promise.all(Object.values(dirs).map(inventory));
  const dry = await composeSites(options);
  assert.equal(dry.written, false);
  assert.equal(dry.existingToolRoutes, 4); assert.equal(dry.draftToolRoutes, 2);
  assert.equal(dry.outputSitemapURLs, 6); assert.equal(dry.sitemapLanguages, 2);
  assert.equal(dry.deploymentApproved, false); assert.equal(dry.toolsActivated, 0);
  assert.equal((await composeSites({ ...options, write: true })).written, true);
  assert.deepEqual(await Promise.all(Object.values(dirs).map(inventory)), before);
  const read = path => readFile(join(options.output, path), 'utf8');
  for (const prefix of ['', 'es/']) {
    for (const [id, noindex] of [['alpha', false], ['beta', false], ['gamma', true]]) {
      const info = inspectHTML(await read(`${prefix}tools/${id}/index.html`));
      assert.equal(info.noindex, noindex); assert.equal(info.canonical, `${TARGET}/${prefix}tools/${id}/`);
      assert.ok((await read(`${prefix}index.html`)).includes(`href="/${prefix}tools/${id}/"`));
    }
    const sitemap = parseSitemap(await read(`sitemap-${prefix ? 'es' : 'en'}.xml`));
    assert.equal(sitemap.records.length, 3); assert.ok(sitemap.records.every(r => !r.loc.includes('gamma')));
    assert.equal(sitemap.records.find(r => r.loc.endsWith(`/${prefix}`)).lastmod, '2026-10-28');
  }
  assert.equal(parseSitemap(await read('sitemap.xml')).type, 'sitemapindex');
  assert.ok(!(await read('_headers')).includes('noindex'));
  assert.match(await read('_headers'), /:locale\/tools\/local-ai-chat\/\*/u);
  assert.match(await read('_headers'), /! permissions-policy/u);
  assert.ok(!(await read('robots.txt')).includes('Disallow'));
  assert.equal(await read('assets/shared.js'), 'console.log("shared")');
}));

for (const [name, mutate, error] of [
  ['asset collision', c => c.put('preview', 'assets/shared.js', 'different'), /file collision/u],
  ['duplicate tool route', c => c.put('hub', 'tools/alpha/index.html', page(hubOrigin, '/tools/alpha/')), /same tool route/u],
  ['draft loses noindex', c => c.put('preview', 'tools/gamma/index.html', page(draftOrigin, '/tools/gamma/')), /Wrong noindex/u],
  ['existing tool noindex', c => c.put('hub', 'tools/beta/index.html', page(hubOrigin, '/tools/beta/', true)), /Wrong noindex/u],
  ['draft in sitemap', c => c.put('preview', 'sitemap.xml', sitemapXML([{ loc: `${draftOrigin}/tools/gamma/` }])), /Draft URLs/u],
  ['tool absent from sitemap', c => c.put('hub', 'sitemap.xml', sitemapXML([])), /missing from sitemaps/u],
  ['sitemap references absent page', c => c.put('hub', 'sitemap.xml', sitemapXML([{ loc: `${hubOrigin}/missing/` }])), /no source page/u],
  ['bad canonical', c => c.put('hub', 'tools/beta/index.html', page(hubOrigin, '/wrong/')), /tool metadata/u],
  ['indexable hreflang to draft', c => c.put('hub', 'tools/beta/index.html', page(hubOrigin, '/tools/beta/', false, `<link rel="alternate" hreflang="es" href="${draftOrigin}/es/tools/gamma/">`)), /hreflang points to a draft/u],
  ['global noindex', c => c.put('hub', '_headers', headers.replace('/*\n', '/*\n  X-Robots-Tag: noindex\n')), /Global noindex/u],
  ['robots block', c => c.put('main', 'robots.txt', 'User-agent: *\nDisallow: /tools/\n'), /Robots restrictions/u],
  ['hashed legacy-host asset', c => c.put('hub', 'assets/old.123.js', `fetch('${hubOrigin}/x')`), /Rebuild old-host asset/u],
  ['redirect rewrite', c => c.put('hub', '_redirects', '/old /new 200'), /Unsupported redirect/u],
  ['sitemap cycle', c => c.put('hub', 'sitemap.xml', sitemapXML([{ loc: `${hubOrigin}/sitemap.xml` }], true)), /cyclic/u],
  ['missing draft locale', c => rm(join(c.dirs.preview, 'es/tools/gamma/index.html')), /Draft locale missing/u],
  ['unknown draft locale', c => c.put('preview', 'fr/tools/gamma/index.html', page(draftOrigin, '/fr/tools/gamma/', true)), /Unexpected draft locale/u],
]) test(`rejects ${name} without creating output`, () => fixture(async c => {
  await mutate(c); await assert.rejects(composeSites(c.options), error);
  assert.ok(!(await readdir(c.root)).includes('out'));
}));

test('rejects linked files, overlapping trees, existing outputs and budget violations', () => fixture(async c => {
  await assert.rejects(composeSites({ ...c.options, output: join(c.dirs.main, 'out') }), /overlaps/u);
  await assert.rejects(composeSites({ ...c.options, hub: c.dirs.main }), /overlap/u);
  await mkdir(c.options.output); await assert.rejects(composeSites(c.options), /overwrite/u); await rm(c.options.output, { recursive: true });
  for (const limit of [{ maxFiles: 1 }, { maxAssetBytes: 1 }, { maxOutputBytes: 1 }, { maxHomeBrotliBytes: 1 }, { maxWorkingBytes: 1 }, { minFreeBytes: Number.MAX_SAFE_INTEGER }]) await assert.rejects(composeSites({ ...c.options, ...limit }), /budget/u);
  await symlink(join(c.dirs.main, '404.html'), join(c.dirs.hub, 'linked.html'));
  await assert.rejects(composeSites(c.options), /Symlinks/u);
}));

test('rejects a renderer which loses tools without leaving output or staging files', () => fixture(async c => {
  let changed = false;
  await assert.rejects(composeSites({ ...c.options, write: true, renderHome: (html, links) => {
    // A removed tool link fails before any write, despite a valid source tree.
    changed = links.length > 0; return html;
  } }), /lost a tool link/u);
  assert.ok(changed); assert.ok(!(await readdir(c.root)).some(n => n === 'out' || n.startsWith('.compose-sites-')));
}));

test('strict sitemap/URL parsing and header conflict handling', () => {
  for (const source of ['<!DOCTYPE x><urlset/>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><x/></urlset>']) assert.throws(() => parseSitemap(source));
  for (const url of ['https://evil.example/tools/x/', `${TARGET}/../tools/x/`, `${TARGET}/%2e%2e/x/`, `${TARGET}/x/?secret=x`, `${TARGET}/x/#y`]) assert.throws(() => normalizeURL(url));
  assert.throws(() => mergeHeaders('/*\n  Referrer-Policy: no-referrer\n', headers, headers), /header conflict/u);
  assert.throws(() => mergeHeaders('/tools/alpha/*\n  X-Robots-Tag: noindex\n', headers, headers), /HTTP noindex/u);
  assert.throws(() => mergeRedirects(['/x /a 301', '/x /b 301']), /Conflicting redirects/u);
  assert.equal(mergeRedirects(['/x https://tools.usefulverse.com/a 301', '/x https://tools.usefulverse.com/a 301']), `/x ${TARGET}/a 301\n`);
});

test('a required nb destination cannot be silently omitted from the release', () => fixture(async c => {
  await assert.rejects(composeSites({ ...c.options, draftPrefixes: ['', 'es', 'nb'] }), /Draft locale missing: nb\/gamma/u);
}));

test('packed and ordinary builds compose to identical output with all inputs preserved', () => fixture(async c => {
  await composeSites({ ...c.options, write: true });
  const packed = {};
  for (const role of ['main', 'hub', 'preview']) {
    packed[role] = join(c.root, role + '.uvpack');
    await packBuild({ input: c.dirs[role], output: packed[role], workingRoot: c.root });
  }
  const before = await inventory(c.root);
  const output = join(c.root, 'from-packed');
  await composeSites({ ...c.options, ...packed, output, write: true });
  assert.deepEqual(await inventory(output), await inventory(c.options.output));
  const after = await inventory(c.root);
  for (const [path, file] of before) assert.deepEqual(after.get(path), file);
}));

test('preserves an already-indexed nb hub directory when the main build has no nb home', () => fixture(async c => {
  await c.put('hub', 'nb/tools/beta/index.html', page(hubOrigin, '/nb/tools/beta/').replace('<html>', '<html lang="nb-NO">'));
  await c.put('hub', 'nb/index.html', page(hubOrigin, '/nb/').replace('<html>', '<html lang="nb-NO">').replace('</body>', '<ul class="tool-directory"><li><a href="/nb/tools/beta/">Beta</a></li></ul></body>'));
  const records = parseSitemap(await readFile(join(c.dirs.hub, 'sitemap.xml'), 'utf8')).records;
  await c.put('hub', 'sitemap.xml', sitemapXML([...records, { loc: hubOrigin + '/nb/' }, { loc: hubOrigin + '/nb/tools/beta/' }]));
  await composeSites({ ...c.options, write: true });
  const html = await readFile(join(c.options.output, 'nb/index.html'), 'utf8');
  assert.equal(inspectHTML(html).canonical, TARGET + '/nb/'); assert.equal(inspectHTML(html).noindex, false);
  assert.match(html, /lang="nb-NO"/u); assert.match(html, /href="\/nb\/tools\/beta\/"/u);
}));
test('cannot invent an indexed nb home from a draft-only template', () => fixture(async c => {
  await c.put('preview', 'nb/index.html', page(draftOrigin, '/nb/', true));
  await assert.rejects(composeSites(c.options), /Home without/u);
}));

test('real primary home remains within 25 KiB Brotli with 1000 directory links', () => fixture(async c => {
  const ids = Array.from({ length: 997 }, (_, n) => `tool-${n}`);
  for (const id of ids) await c.put('preview', `tools/${id}/index.html`, page(draftOrigin, `/tools/${id}/`, true));
  // Keep the test small: only English is required for these synthetic drafts.
  await rm(join(c.dirs.preview, 'es'), { recursive: true });
  const report = await composeSites({ ...c.options, draftIds: ['gamma', ...ids], draftPrefixes: [''] });
  assert.equal(report.draftTools, 998);
  assert.ok(report.homeBudgets.every(h => h.brotliBytes <= 25 * 1024));
}));

test('home keeps primary search vocabulary and current English titles of all 1000 owners', async t => {
  const source = await createSources();
  const documents = source.documents.filter(d => !['site-shared', 'market-shared'].includes(d.tool_id ?? d.toolId));
  const links = documents.map(document => {
    const id = document.tool_id ?? document.toolId;
    const value = name => document.sourceCopy[name];
    return { id, url: `${TARGET}/tools/${id}/`, title: value('name') ?? value('shortTitle') ?? value('title') ?? id, description: value('description') ?? '' };
  });
  assert.equal(links.length, 1000);
  const tool = tools[0], home = renderHome(tools, categories);
  const html = compactHome(home, links, { indexURL: '/assets/search-index-en.0123456789ab.json', runtimeURL: '/assets/composed-search.0123456789ab.mjs' });
  assert.equal((html.match(/class="tool-card tool-card--compact"/gu) ?? []).length, 1000);
  const oldCard = home.match(/<a\b[^>]*class="tool-card"[^>]*>/u)[0];
  assert.ok(homeSearchIndex(home, links)[`/tools/${tool.id}/`].includes(attribute(oldCard, 'data-search')));
  const bytes = brotliCompressSync(html).length;
  t.diagnostic(`Real 1000-owner English directory: ${bytes} Brotli bytes; search vocabulary is separate`);
  assert.ok(bytes <= 25 * 1024, `Home is ${bytes} Brotli bytes`);
});
