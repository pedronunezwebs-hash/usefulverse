import assert from 'node:assert/strict';
import test from 'node:test';
import { bundleGrowthControllers } from './bundle-controllers.mjs';
import { growthPilotTools } from './catalog.mjs';
import { assertLocalController } from './build.mjs';

test('growth controllers bundle locally under budget without network or dynamic code', async () => {
  const bundles = await bundleGrowthControllers();
  assert.deepEqual(Object.keys(bundles).sort(), growthPilotTools.map(({ id }) => id).sort());
  for (const [id, source] of Object.entries(bundles)) {
    if (id === 'openapi-editor') {
      assert.match(source, /import\(new URL\("\/assets\/vendor\/js-yaml-4\.3\.2\.mjs",location\.origin\)\.href\)/u, 'YAML parser may load lazily from the same-origin static asset');
      assert.equal((source.match(/\bimport\s*\(/gu) ?? []).length, 1, 'OpenAPI editor has exactly one lazy local import');
    } else if (id === 'graphql-formatter') {
      assert.match(source, /import\(new URL\("\/assets\/vendor\/prettier-graphql-3\.9\.9\.mjs",location\.origin\)\.href\)/u, 'GraphQL formatter may load lazily from its same-origin static asset');
      assert.equal((source.match(/\bimport\s*\(/gu) ?? []).length, 1, 'GraphQL formatter has exactly one lazy local import');
    } else {
      assert.doesNotMatch(source, /\bimport\s*\(/u, `${id} should not use a dynamic import`);
    }
    assert.doesNotMatch(source, /\bimport\s/u, `${id} should have no unresolved imports`);
    assertLocalController(id, source, ['chess-opening-trainer', 'chess-puzzles', 'chess-analysis-board'].includes(id) ? 48 * 1024 : 24 * 1024);
  }
});
