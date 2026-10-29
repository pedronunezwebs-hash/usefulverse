import { readSitemapRecords } from '../../scripts/language-sitemaps.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { growthPilotTools } from './catalog.mjs';
import { localeEntries, localePath } from '../locales.mjs';
import { tools as currentTools } from '../catalog.mjs';
import { renderGrowthToolPage } from './render.mjs';
import { buildGrowthStaticSite } from './build.mjs';
import pendingCopies from './locales/pending-tools-final.mjs';
import english from './locales/en.mjs';

const candidates = JSON.parse(await readFile(new URL('../../docs/planning/usefulverse-1000-2026-10-19/implementation-progress.json', import.meta.url))).tools.map(({ slug }) => slug);
const candidateIds = new Set(candidates);
const newTools = growthPilotTools.filter(({ id }) => candidateIds.has(id));

test('all 300 imported candidates are explicitly non-indexable; all 217 existing hub tools retain indexability', () => {
  assert.equal(candidateIds.size, 300);
  assert.equal(newTools.length, 300);
  assert.equal(growthPilotTools.length, 517);
  for (const tool of growthPilotTools) {
    assert.equal(tool.indexable === false, candidateIds.has(tool.id), tool.id);
  }
});

test('catalog noindex cannot be disabled by renderer defaults or an explicit false, across 37 route locales', () => {
  const entries = [...localeEntries, { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål' }];
  assert.equal(entries.length, 37);
  for (const tool of newTools) {
    for (const locale of entries) {
      // SEO contract only: this does not certify translated wording or the tool UI.
      const html = renderGrowthToolPage({ tool, locale, localeEntries: entries,
        copy: { ...english._home, ...pendingCopies.en[tool.id] },
        origin: 'https://tools.usefulverse.com', formHtml: '<form></form>', noindex: false,
        pathForLocale: (key, id = '') => key === 'nb' ? `/nb/${id ? `tools/${id}/` : ''}` : localePath(key, id) });
      assert.match(html, /<meta name="robots" content="noindex,\s*follow">/u, `${locale.key}/${tool.id}`);
      assert.doesNotMatch(html, /rel="alternate"[^>]*hreflang=/u, `${locale.key}/${tool.id}`);
      if (locale.key === 'nb') assert.ok(html.includes(`rel="canonical" href="https://tools.usefulverse.com/nb/tools/${tool.id}/"`));
    }
  }
});

test('mixed build excludes catalog noindex pages from sitemap without blocking crawling or deindexing existing pages', async () => {
  const root = await mkdtemp(join(tmpdir(), 'usefulverse-noindex-test-'));
  try {
    const tools = [growthPilotTools.find(({ id }) => id === 'gravel-calculator'), newTools.find(({ id }) => id === 'text-translator')];
    const locales = localeEntries.filter(({ key }) => ['en', 'es'].includes(key));
    const copyByLocale = Object.fromEntries(locales.map(({ key }) => [key, {
      _home: { ...english._home, copyLanguage: key },
      ...Object.fromEntries(tools.map(({ id }) => [id, { ...(id === 'gravel-calculator' ? english[id] : pendingCopies.en[id]), copyLanguage: key, localizationStatus: 'approved' }])),
    }]));
    await buildGrowthStaticSite({ outputDir: join(root, 'site'), origin: 'https://tools.usefulverse.com',
      tools, currentTools, localeEntries: locales, copyByLocale, styles: 'body{margin:16px}',
      faviconSvg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
      controllerBundles: Object.fromEntries(tools.map(({ id }) => [id, 'document.documentElement.dataset.ready="yes";'])) });
    const records = await readSitemapRecords(join(root, 'site'), 'https://tools.usefulverse.com');
    const sitemap = JSON.stringify(records);
    assert.doesNotMatch(sitemap, /text-translator/u);
    assert.match(sitemap, /\/es\/tools\/gravel-calculator\//u);
    assert.equal(records.length, 4);
    const oldPage = await readFile(join(root, 'site/tools/gravel-calculator/index.html'), 'utf8');
    assert.doesNotMatch(oldPage, /noindex|rel="alternate"[^>]*text-translator/u);
    const draftPage = await readFile(join(root, 'site/es/tools/text-translator/index.html'), 'utf8');
    assert.match(draftPage, /noindex,\s*follow/u);
    assert.doesNotMatch(draftPage, /rel="alternate"[^>]*hreflang=/u);
    assert.doesNotMatch(await readFile(join(root, 'site/robots.txt'), 'utf8'), /Disallow:/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('unapproved copy exemption cannot be used on an indexable tool', async () => {
  const root = await mkdtemp(join(tmpdir(), 'usefulverse-noindex-test-'));
  try {
    const tool = growthPilotTools.find(({ id }) => id === 'gravel-calculator');
    await assert.rejects(buildGrowthStaticSite({ outputDir: join(root, 'site'), origin: 'https://tools.usefulverse.com',
      tools: [tool], currentTools, localeEntries: [localeEntries[0]], copyByLocale: { en: english },
      styles: 'body{margin:16px}', faviconSvg: '<svg></svg>', controllerBundles: { [tool.id]: 'void 0;' },
      allowUnapprovedToolIds: [tool.id] }), /Unapproved copy.*noindex/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
