import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createSources } from '../../scripts/localization/autopilot-source.mjs';

const root = new URL('../../', import.meta.url);
const sha = text => createHash('sha256').update(text).digest('hex');
const manifest = JSON.parse(await readFile(new URL('src/growth600/live-only-106.manifest.json', root)));
const restore = (text, data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
  const result = { ...text };
  for (const [key, value] of Object.entries(data)) result[key] = value && typeof value === 'object' && !Array.isArray(value)
    ? restore(result[key], value) : value;
  return result;
};

test('all 106 recovered owners expose the captured English UI, without inheriting approval', async t => {
  const corpus = await createSources();
  for (const tool of manifest.tools) {
    await t.test(tool.id, async () => {
      const document = corpus.documents.find(d => d.toolId === tool.id);
      assert.equal(document?.coverage, 'improved-source', `${tool.id}: metadata alone is not UI coverage`);
      const source = JSON.parse(await readFile(new URL(`translation-sources/${tool.id}.json`, root)));
      assert.equal(source.toolId, tool.id);
      assert.deepEqual(document.sourceCopy, source.sourceCopy);
      assert.equal(source.provenance.status, 'recovered-ui-not-quality-approved');
      assert.equal(source.provenance.sourceLocale, 'en');
      assert.ok(!Object.hasOwn(source.sourceCopy, 'localizationStatus'));
      assert.ok(!Object.hasOwn(source.sourceCopy, 'copyLanguage'));
      assert.equal(source.provenance.htmlPath,
        `src/growth600/live-only-106-source/pages/tools/${tool.id}/index.html`);
      assert.ok(['.js', '.controller.js'].some(suffix => source.provenance.controllerPath ===
        `src/growth600/live-only-106-source/assets/recovered-live-only-106/controllers/${tool.id}${suffix}`));
      const html = await readFile(new URL(source.provenance.htmlPath, root), 'utf8');
      assert.equal(sha(html), source.provenance.htmlSha256);
      const original = JSON.parse(html.match(/<script type="application\/json" data-tool-copy>([\s\S]*?)<\/script>/u)[1]);
      for (const key of source.provenance.discardedMetadata) delete original[key];
      assert.deepEqual(restore(source.sourceCopy, source.nonTranslatableCopy), original,
        'all English copy and technical data must round-trip without rewriting formulas or examples');
      const controller = await readFile(new URL(source.provenance.controllerPath, root));
      assert.equal(sha(controller), source.provenance.controllerSha256);
      const units = corpus.units.filter(u => u.key.startsWith(`${tool.id}.`));
      assert.ok(units.length > 10);
      for (const field of ['fields', 'actions', 'messages']) {
        assert.ok(units.some(u => u.key.startsWith(`${tool.id}.copy.${field}.`)), `${tool.id}: ${field} missing`);
      }
      if (original.category) {
        assert.equal(units.find(u => u.key === `${tool.id}.copy.category`)?.source, original.category,
          'visible category labels are UI prose, unlike internal example.category values');
      }
      assert.ok(!units.some(u => /\.copy\.(?:puzzles|exampleXml|exampleCsv|exampleText)(?:\.|$)|\.copy\.example\.(?:values|category|pattern)(?:\.|$)/u.test(u.key)),
        'game datasets, executable examples and internal option values must stay outside translation');
    });
  }
  assert.equal(corpus.coverage.recoveredMetadataOnly.length, 0);
  assert.equal(corpus.coverage.metadataOnly.length, 0);
});
