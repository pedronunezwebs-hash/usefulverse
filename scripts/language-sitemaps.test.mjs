import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSitemapRecords, writeLanguageSitemaps } from './language-sitemaps.mjs';
import { parseSitemap, sitemapXML } from './compose-sites-metadata.mjs';
const origin = 'https://tools.usefulverse.com';
const root = fileURLToPath(new URL('../', import.meta.url));
async function fixture(t) {
  const dir = await mkdtemp(join(root, '.qa-sitemap-test-'));
  t.after(() => rm(dir, { recursive: true, force: true })); return dir;
}
test('language indexes preserve all canonical URLs, dates and locale prefixes on either host', async t => {
  for (const host of [origin, 'https://usefulverse.com']) {
    const dir = await fixture(t), records = [];
    for (const prefix of ['', '/es', '/pt-br', '/zh-tw', '/nb']) {
      records.push({ loc: host + prefix + '/', lastmod: '2026-10-18' });
      for (let i = 0; i < 100; i++) records.push({ loc: `${host}${prefix}/tools/example-${i}/` });
    }
    const result = await writeLanguageSitemaps(dir, host, records);
    assert.deepEqual(result, { urls: 505, languages: 5 });
    const index = parseSitemap(await readFile(join(dir, 'sitemap.xml'), 'utf8'));
    assert.equal(index.type, 'sitemapindex'); assert.equal(index.records.length, 5);
    assert.ok(index.records.every(r => !r.lastmod), 'mixed unknown dates do not invent a child lastmod');
    assert.deepEqual((await readSitemapRecords(dir, host)).sort((a, b) => a.loc.localeCompare(b.loc)), records.sort((a, b) => a.loc.localeCompare(b.loc)));
    assert.ok((await readSitemapRecords(dir, host, 'sitemap-pt-br.xml')).every(r => r.loc.includes('/pt-br/')));
    const before = await readFile(join(dir, 'sitemap-en.xml'));
    await writeLanguageSitemaps(dir, host, records.reverse());
    assert.deepEqual(await readFile(join(dir, 'sitemap-en.xml')), before, 'rebuild/order changes must not change dates');
  }
});
test('draft-only sitemap stays empty and contains no language feeds', async t => {
  const dir = await fixture(t);
  assert.deepEqual(await writeLanguageSitemaps(dir, origin, []), { urls: 0, languages: 0 });
  assert.deepEqual(parseSitemap(await readFile(join(dir, 'sitemap.xml'), 'utf8')), { type: 'urlset', records: [] });
});
test('only actual known modification dates are propagated to the index', async t => {
  const dir = await fixture(t);
  await writeLanguageSitemaps(dir, origin, [{ loc: origin + '/', lastmod: '2026-10-18' }, { loc: origin + '/tools/a/', lastmod: '2026-10-20' }]);
  assert.equal(parseSitemap(await readFile(join(dir, 'sitemap.xml'), 'utf8')).records[0].lastmod, '2026-10-20');
});
test('unsafe, cross-host, duplicate and impossible-date records fail closed', async t => {
  const dir = await fixture(t);
  for (const loc of ['https://evil.invalid/tools/a/', origin + '/es/../tools/a/', origin + '/%2e%2e/a/', origin + '/tools/a/?x=1', origin + '/tools/a/#x', origin + '/../../a']) {
    await assert.rejects(writeLanguageSitemaps(dir, origin, [{ loc }]));
  }
  for (const lastmod of ['2026-02-30', '2026-13-01', 'now', '2026-10-29T00:00:00Z']) await assert.rejects(writeLanguageSitemaps(dir, origin, [{ loc: origin + '/', lastmod }]));
  await assert.rejects(writeLanguageSitemaps(dir, origin, [{ loc: origin + '/' }, { loc: origin + '/' }]), /Duplicate/u);
});
test('reader accepts legacy staging but rejects cycles, traversal and duplicate children', async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, 'sitemap.xml'), sitemapXML([{ loc: origin + '/tools/a/' }]));
  assert.equal((await readSitemapRecords(dir, origin)).length, 1);
  for (const loc of [origin + '/sitemap.xml', origin + '/nested/sitemap.xml', 'https://evil.invalid/sitemap.xml']) {
    await writeFile(join(dir, 'sitemap.xml'), sitemapXML([{ loc }], true));
    await assert.rejects(readSitemapRecords(dir, origin));
  }
  await writeFile(join(dir, 'sitemap-en.xml'), sitemapXML([{ loc: origin + '/' }]));
  await writeFile(join(dir, 'sitemap.xml'), sitemapXML([{ loc: origin + '/sitemap-en.xml' }, { loc: origin + '/sitemap-en.xml' }], true));
  await assert.rejects(readSitemapRecords(dir, origin), /repeated/u);
});
