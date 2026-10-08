import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from '../catalog.mjs';
import { assertGrowthCatalogIsAdditive, growthPilotTools } from './catalog.mjs';

test('the current growth IDs are unique and additive to the protected catalog', () => {
  assert.equal(growthPilotTools.length, 67);
  assert.equal(new Set(growthPilotTools.map(({ id }) => id)).size, 67);
  assert.equal(assertGrowthCatalogIsAdditive(tools), true);
});

test('the additive catalog rejects protected-ID collisions, duplicate IDs and incomplete contracts', () => {
  const base = growthPilotTools[0];
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, id: tools[0].id }]), /protected UsefulVerse ID/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [base, base]), /Duplicate new tool ID/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, acceptance: '' }]), /Incomplete product contract/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, relatedExistingIds: ['not-real'] }]), /missing related tool/);
});
