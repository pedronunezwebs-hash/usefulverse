import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { localeEntries } from '../src/locales.mjs';
import { openBuildSource } from './packed-build.mjs';
import { attribute, inspectHTML, parseSitemap, TARGET } from './compose-sites-metadata.mjs';

export async function verifyDraftPreview(input) {
  const plan = JSON.parse(await readFile(new URL('../docs/planning/usefulverse-1000-2026-10-19/implementation-progress.json', import.meta.url)));
  const ids = plan.tools.map(t => t.slug), locales = [...localeEntries, { key: 'nb', prefix: '/nb' }];
  assert.equal(new Set(ids).size, 300); assert.equal(locales.length, 37);
  const source = await openBuildSource(input);
  try {
    const read = async path => { const f = source.files.get(path); assert.ok(f, `Missing ${path}`); return (f.read ? await f.read() : await readFile(f.source)).toString('utf8'); };
    const expected = new Set(); let routes = 0, sourceFallbacks = 0;
    for (const id of ids) {
      const english = JSON.parse((await read(`tools/${id}/index.html`)).match(/data-tool-copy>([\s\S]*?)<\/script>/u)[1]);
      for (const locale of locales) {
        const path = `${locale.prefix.replace(/^\//u, '')}${locale.prefix ? '/' : ''}tools/${id}/index.html`, html = await read(path);
        expected.add(path); const info = inspectHTML(html);
        assert.equal(info.canonical, `${TARGET}${locale.prefix}/tools/${id}/`);
        assert.equal(info.noindex, true); assert.ok(info.title && info.description); assert.equal(info.alternates.length, 0);
        const copy = JSON.parse(html.match(/data-tool-copy>([\s\S]*?)<\/script>/u)[1]);
        if (locale.key === 'nb') {
          assert.equal(info.language, 'en'); assert.equal(copy.copyLanguage, 'en'); assert.equal(copy.previewFallbackFor, 'nb');
          assert.equal(copy.releaseApproved, false); assert.equal(copy.localizationStatus, 'source-fallback');
          assert.deepEqual(copy.fields, english.fields); assert.deepEqual(copy.messages, english.messages);
          assert.ok(!html.includes('href="/nb/"')); sourceFallbacks++;
          const schema = JSON.parse(html.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/u)[1]); assert.equal(schema.inLanguage, 'en');
        } else assert.equal(copy.copyLanguage, locale.key);
        routes++;
      }
    }
    let homes = 0;
    for (const path of source.files.keys()) {
      if (/(?:^|\/)tools\/[^/]+\/index\.html$/u.test(path)) assert.ok(expected.has(path), `Unexpected draft route: ${path}`);
      if (/^(?:[a-z\d-]+\/)?index\.html$/u.test(path)) {
        assert.notEqual(path, 'nb/index.html'); assert.equal(inspectHTML(await read(path)).noindex, true); homes++;
      }
    }
    assert.equal(parseSitemap(await read('sitemap.xml')).records.length, 0);
    assert.ok(!/^\s*Disallow:\s*\S+/imu.test(await read('robots.txt')));
    return { tools: 300, routeLocales: 37, toolRoutes: routes, noindexHomes: homes, nbSourceFallbacks: sourceFallbacks, nbTranslationsApproved: 0,
      indexedSitemapURLs: 0, unexpectedToolRoutes: 0, allPayloadsChecked: true, releaseApproved: false };
  } finally { await source.close(); }
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) console.log(JSON.stringify(await verifyDraftPreview(process.argv[2])));
