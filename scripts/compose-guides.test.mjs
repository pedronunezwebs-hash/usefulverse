import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { composeSites, homeDirectoryPages, placeDirectoryNavigation } from './compose-sites.mjs';
import { sitemapXML, inspectHTML } from './compose-sites-metadata.mjs';
test('a guides index stays a guide, preserving its bytes and sitemap entry', async () => {
  const root = await mkdtemp(join(import.meta.dirname, '.guides-test-'));
  const page = (route, noindex = false) => `<html><head><meta name="description" content="Description"><link rel="canonical" href="https://usefulverse.com${route}">${noindex ? '<meta name="robots" content="noindex,follow">' : ''}</head><body><h1>Useful page</h1></body></html>`;
  const put = async (role, path, value) => { const dest = join(root, role, path); await mkdir(dirname(dest), { recursive: true }); await writeFile(dest, value); };
  try {
    for (const [role, id] of [['main', 'alpha'], ['hub', 'beta'], ['preview', 'gamma']]) {
      await put(role, `tools/${id}/index.html`, page(`/tools/${id}/`, role === 'preview'));
      await put(role, '_headers', '/*\n  X-Content-Type-Options: nosniff\n');
      await put(role, 'robots.txt', 'User-agent: *\nAllow: /\n');
      const records = role === 'preview' ? [] : [{ loc: `https://usefulverse.com/tools/${id}/` }];
      if (role === 'main') records.push({ loc: 'https://usefulverse.com/' }, { loc: 'https://usefulverse.com/guides/' });
      await put(role, 'sitemap.xml', sitemapXML(records));
    }
    await put('main', 'index.html', page('/')); await put('main', '404.html', page('/404.html', true));
    const guide = page('/guides/'); await put('main', 'guides/index.html', guide);
    const output = join(root, 'out');
    const report = await composeSites({ main: join(root, 'main'), hub: join(root, 'hub'), preview: join(root, 'preview'), output,
      existingIds: ['alpha', 'beta'], draftIds: ['gamma'], draftPrefixes: [''], write: true,
      renderHome: (html, tools) => html.replace('</body>', tools.map(t => `<a href="${new URL(t.url).pathname}">${t.title}</a>`).join('') + '</body>') });
    assert.deepEqual(report.homeBudgets.map(r => r.path), ['index.html']);
    assert.equal(await readFile(join(output, 'guides/index.html'), 'utf8'), guide);
    assert.ok((await readFile(join(output, 'sitemap-en.xml'), 'utf8')).includes('/guides/'));
  } finally { await rm(root, { recursive: true, force: true }); }
});
test('pagination follows its results before unrelated home sections', () => {
  const nav = '<nav>Pages</nav>';
  const main = '<main><section><p class="empty-state" id="empty-state" hidden>Empty</p></section><section>Why</section></main>';
  assert.equal(placeDirectoryNavigation(main, nav), main.replace('</p>', '</p>' + nav));
  const hub = '<main><ul class="tool-directory tool-directory--composed" id="tools"><li>Tool</li></ul><aside>Other</aside></main>';
  assert.equal(placeDirectoryNavigation(hub, nav), hub.replace('</ul>', '</ul>' + nav));
});
test('static pagination preserves every tool link and keeps auxiliary pages out of indexation', () => {
  const template = '<html><head><link rel="canonical" href="https://usefulverse.com/"><link rel="alternate" hreflang="en" href="https://usefulverse.com/"></head><body><main><h1>Tools</h1></main></body></html>';
  const tools = Array.from({ length: 205 }, (_, n) => ({ id: `tool-${n}`, title: `Tool ${n}`, url: `https://usefulverse.com/tools/tool-${n}/` }));
  const pages = homeDirectoryPages(template, tools, 'index.html', {}, (html, chunk) => html.replace('</main>', chunk.map(t => `<a href="${new URL(t.url).pathname}">${t.title}</a>`).join('') + '</main>'));
  assert.deepEqual(pages.map(p => p.path), ['index.html', 'directory/2/index.html', 'directory/3/index.html']);
  const links = pages.flatMap(p => [...p.html.matchAll(/href="(\/tools\/[^"]+)"/gu)].map(m => m[1]));
  assert.equal(new Set(links).size, 205); assert.equal(links.length, 205);
  assert.equal(inspectHTML(pages[0].html).noindex, false);
  assert.equal(inspectHTML(pages[1].html).noindex, true); assert.equal(inspectHTML(pages[1].html).alternates.length, 0);
  assert.equal(inspectHTML(pages[1].html).canonical, 'https://usefulverse.com/directory/2/');
  assert.match(pages[1].html, /href="\/directory\/2\/#tools" aria-current="page"/u);
});
