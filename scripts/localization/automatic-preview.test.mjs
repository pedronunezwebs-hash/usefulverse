import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { prepareAutomaticPreview, verifyAutomaticPreview } from './automatic-preview.mjs';
import { extractToolCopyUnits } from './extract-tool-copy-units.mjs';
import { localeEntries, localePath } from '../../src/locales.mjs';
import { growthPilotTools } from '../../src/growth600/catalog.mjs';
import { pendingToolEnglishCopy } from '../../src/growth600/locales/pending-tools.en.mjs';
import pendingToolsCopies from '../../src/growth600/locales/pending-tools-final.mjs';
import english from '../../src/growth600/locales/en.mjs';
import { renderGrowthForm } from '../../src/growth600/forms.mjs';
import { renderGrowthToolPage } from '../../src/growth600/render.mjs';

const semanticPolicy = 'a'.repeat(64), qualityPolicy = 'b'.repeat(64), sourceDigest = 'c'.repeat(64);
const hash = source => createHash('sha256').update(source).digest('hex');
const tool = growthPilotTools.find(tool => tool.indexable === false && pendingToolEnglishCopy[tool.id]);
const source = pendingToolEnglishCopy[tool.id];
const locales = localeEntries.filter(locale => ['en', 'es', 'ar', 'pt', 'zh', 'zh_tw', 'tl'].includes(locale.key));
const entry = (path, translation) => {
  const unit = extractToolCopyUnits(source, tool.id).units.find(unit => unit.key === `${tool.id}.copy.${path}`);
  assert.ok(unit, path);
  return { source_hash: hash(unit.source), context: unit.context, translation };
};

async function fixture(run) {
  const directory = await mkdtemp(resolve(tmpdir(), 'uv-automatic-preview-'));
  const copyByLocale = Object.fromEntries(locales.map(locale => [locale.key, {
    _home: english._home, [tool.id]: pendingToolsCopies[locale.key][tool.id],
    'existing-tool': { name: 'Keep the existing translation' },
  }]));
  const report = { schemaVersion: 1, approved: false, native_review: false,
    semantic_policy: semanticPolicy, quality_policy: qualityPolicy, source_digest: sourceDigest };
  const pack = { schemaVersion: 1, toolId: tool.id, locale: 'es', semantic_policy: semanticPolicy,
    quality_policy: qualityPolicy, source_digest: sourceDigest, release_approved: false, native_review: false, entries: {} };
  const save = async (pack, locale = pack.locale) => {
    await mkdir(resolve(directory, 'packages', locale), { recursive: true });
    await writeFile(resolve(directory, 'packages', locale, `${tool.id}.json`), JSON.stringify(pack));
  };
  const options = { directory, semanticPolicy, qualityPolicy, previewOnly: true, tools: [tool],
    candidateIds: new Set([tool.id]), locales, rawEnglish: { [tool.id]: source }, copyByLocale };
  try { await writeFile(resolve(directory, 'report.json'), JSON.stringify(report)); await run({ directory, options, report, pack, save }); }
  finally { await rm(directory, { recursive: true, force: true }); }
}

test('verified leaves reach the real form and page; missing entries use normalized English without changing existing tools', async () => fixture(async ({ directory, options, pack, save }) => {
  pack.entries[`${tool.id}.copy.name`] = entry('name', 'Herramienta comprobada <archivo>');
  pack.entries[`${tool.id}.copy.title`] = entry('title', 'X'.repeat(61));
  await save(pack);
  const before = structuredClone(options.copyByLocale);
  const result = await prepareAutomaticPreview(options);
  const copy = result.copyByLocale.es[tool.id];
  assert.equal(copy.name, 'Herramienta comprobada <archivo>');
  assert.equal(copy.title, options.copyByLocale.en[tool.id].title);
  assert.equal(copy.intro, options.copyByLocale.en[tool.id].intro);
  assert.equal(copy.copyLanguage, 'es'); assert.equal(copy.localizationStatus, 'machine-draft');
  assert.equal(copy.localizationAcceptedBy, undefined);
  assert.equal(result.summary.translatedEntries, 1); assert.equal(result.summary.overBudgetEntries, 1);
  assert.deepEqual(options.copyByLocale, before);
  assert.equal(result.copyByLocale.es['existing-tool'], options.copyByLocale.es['existing-tool']);
  for (const locale of locales) {
    const copy = result.copyByLocale[locale.key][tool.id];
    const html = renderGrowthToolPage({ tool, locale, localeEntries: locales,
      copy: { ...english._home, ...copy }, origin: 'https://tools.usefulverse.com', assetVersion: 'test',
      formHtml: renderGrowthForm(tool.id, copy), noindex: true });
    if (locale.key === 'es') assert.match(html, /<h1>Herramienta comprobada &lt;archivo&gt;<\/h1>/u);
    const route = resolve(directory, 'rendered', localePath(locale.key, tool.id).replace(/^\/+|\/+$/gu, ''));
    await mkdir(route, { recursive: true }); await writeFile(resolve(route, 'index.html'), html);
  }
  const verify = () => verifyAutomaticPreview({ outputDir: resolve(directory, 'rendered'), tools: [tool], locales, localePath, copyByLocale: result.copyByLocale });
  assert.equal(await verify(), locales.length);
  const esPath = resolve(directory, 'rendered', localePath('es', tool.id).replace(/^\/+|\/+$/gu, ''), 'index.html');
  await writeFile(esPath, (await readFile(esPath, 'utf8')).replace('noindex,follow', 'index,follow'));
  await assert.rejects(verify, /render differs/u);
}));

test('stale hash or context and titles without the brand fall back; locale aliases and RTL survive', async () => fixture(async ({ options, pack, save }) => {
  pack.entries[`${tool.id}.copy.name`] = { ...entry('name', 'Old translation'), source_hash: '0'.repeat(64) };
  pack.entries[`${tool.id}.copy.intro`] = { ...entry('intro', 'Wrong context'), context: 'other' };
  pack.entries[`${tool.id}.copy.title`] = entry('title', 'Marca perdida');
  await save(pack);
  for (const language of ['ar', 'pt-BR', 'zh-CN', 'zh-TW', 'fil'])
    await save({ ...pack, locale: language, entries: { [`${tool.id}.copy.name`]: entry('name', 'اسم مفهوم') } });
  const result = await prepareAutomaticPreview(options);
  assert.equal(result.copyByLocale.es[tool.id].name, options.copyByLocale.en[tool.id].name);
  assert.equal(result.copyByLocale.es[tool.id].intro, options.copyByLocale.en[tool.id].intro);
  assert.equal(result.summary.staleEntries, 2);
  for (const route of ['ar', 'pt', 'zh', 'zh_tw', 'tl']) assert.equal(result.copyByLocale[route][tool.id].name, 'اسم مفهوم');
}));

test('wrong policies, source snapshot or release provenance fail closed', async () => fixture(async ({ options, pack, save }) => {
  for (const change of [{ quality_policy: 'd'.repeat(64) }, { semantic_policy: 'd'.repeat(64) },
    { source_digest: 'd'.repeat(64) }, { release_approved: true }, { native_review: true }]) {
    await save({ ...pack, ...change }); await assert.rejects(() => prepareAutomaticPreview(options));
  }
}));

test('overlay cannot run in a live build or touch an indexable/noncandidate tool', async () => fixture(async ({ options }) => {
  for (const change of [{ previewOnly: false }, { tools: [{ ...tool, indexable: true }] }, { candidateIds: new Set() }, { qualityPolicy: undefined }])
    await assert.rejects(() => prepareAutomaticPreview({ ...options, ...change }));
}));
