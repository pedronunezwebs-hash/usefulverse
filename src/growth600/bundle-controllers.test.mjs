import assert from 'node:assert/strict';
import test from 'node:test';
import { bundleGrowthControllers } from './bundle-controllers.mjs';
import { growthPilotTools } from './catalog.mjs';
import { assertLocalController } from './build.mjs';

test('growth controllers bundle locally under budget without network or dynamic code', async () => {
  const bundles = await bundleGrowthControllers();
  assert.deepEqual(Object.keys(bundles).sort(), growthPilotTools.map(({ id }) => id).sort());
  for (const [id, source] of Object.entries(bundles)) {
    assert.doesNotMatch(source, /\bimport\s*\(/u, `${id} should not use a dynamic import`);
    assert.doesNotMatch(source, /\bimport\s/u, `${id} should have no unresolved imports`);
    assertLocalController(id, source, id === 'chess-opening-trainer' ? 48 * 1024 : 24 * 1024);
  }
});
