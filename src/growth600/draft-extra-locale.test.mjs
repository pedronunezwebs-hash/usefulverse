import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { buildGrowthStaticSite } from './build.mjs';
import { growthPilotTools } from './catalog.mjs';
import english from './locales/en.mjs';
import pending from './locales/pending-tools-final.mjs';
import { tools as core } from '../catalog.mjs';

const nb = { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false };
const en = { key: 'en', code: 'en', name: 'English', prefix: '' };
async function fixture(run) {
  const root = await mkdtemp(join(import.meta.dirname, '.draft-locale-test-'));
  const tool = growthPilotTools.find(t => t.id === 'grammar-checker');
  const fallback = { ...structuredClone(pending.en[tool.id]), copyLanguage: 'en', localizationStatus: 'source-fallback', previewFallbackFor: 'nb', releaseApproved: false };
  const options = { outputDir: join(root, 'site'), origin: 'https://tools.usefulverse.com', localeEntries: [en], extraToolLocales: [nb],
    copyByLocale: { en: { _home: english._home, [tool.id]: pending.en[tool.id] }, nb: { _home: english._home, [tool.id]: fallback } },
    tools: [tool], currentTools: [...core, ...growthPilotTools.filter(t => t.id !== tool.id)],
    controllerBundles: { [tool.id]: 'document.documentElement.dataset.ready="yes";' }, styles: 'body{margin:16px}',
    faviconSvg: '<svg xmlns="http://www.w3.org/2000/svg"/>', noindexHome: true, noindexToolIds: [tool.id], allowUnapprovedToolIds: [tool.id] };
  try { await run({ root, options, tool, fallback }); }
  finally { await rm(root, { recursive: true, force: true }); }
}
test('nb draft route preserves honest English fallback, noindex and home without inventing an indexed nb directory', () => fixture(async ({ options, fallback }) => {
  await buildGrowthStaticSite(options);
  const html = await readFile(join(options.outputDir, 'nb/tools/grammar-checker/index.html'), 'utf8');
  assert.match(html, /<html lang="en"/u);
  assert.match(html, /name="robots" content="noindex,follow"/u);
  assert.match(html, /rel="canonical" href="https:\/\/tools.usefulverse.com\/nb\/tools\/grammar-checker\/"/u);
  assert.ok(!html.includes('hreflang=')); assert.ok(!html.includes('href="/nb/"'));
  const payload = JSON.parse(html.match(/data-tool-copy>([\s\S]*?)<\/script>/u)[1]);
  assert.equal(payload.copyLanguage, 'en'); assert.equal(payload.previewFallbackFor, 'nb');
  assert.equal(payload.releaseApproved, false); assert.deepEqual(payload.fields, fallback.fields);
  const schema = JSON.parse(html.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/u)[1]);
  assert.equal(schema.inLanguage, 'en');
  assert.equal((await readFile(join(options.outputDir, 'sitemap.xml'), 'utf8')).match(/<loc>/gu), null);
  await assert.rejects(stat(join(options.outputDir, 'nb/index.html')), { code: 'ENOENT' });
}));
test('fallback exemption requires an explicit noindex draft, source language and matching route', () => fixture(async ({ options, tool }) => {
  for (const mutation of [
    o => { o.allowUnapprovedToolIds = []; },
    o => { o.tools = [{ ...tool, indexable: true }]; o.noindexToolIds = []; o.allowUnapprovedToolIds = []; },
    o => { delete o.copyByLocale.nb[tool.id].previewFallbackFor; },
    o => { o.copyByLocale.nb[tool.id].copyLanguage = 'es'; },
    o => { o.copyByLocale.nb[tool.id].releaseApproved = true; },
  ]) {
    const o = { ...options, copyByLocale: structuredClone(options.copyByLocale) }; mutation(o);
    await assert.rejects(buildGrowthStaticSite(o));
    await assert.rejects(stat(o.outputDir), { code: 'ENOENT' });
  }
}));
