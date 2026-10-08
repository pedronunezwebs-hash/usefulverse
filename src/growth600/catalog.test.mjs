import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from '../catalog.mjs';
import { assertGrowthCatalogIsAdditive, growthPilotTools } from './catalog.mjs';

test('the current growth IDs are unique and additive to the protected catalog', () => {
  assert.equal(growthPilotTools.length, 96);
  assert.equal(new Set(growthPilotTools.map(({ id }) => id)).size, 96);
  assert.equal(assertGrowthCatalogIsAdditive(tools), true);
});

test('Hashi is a distinct no-crossing connected-island puzzle, not a duplicate Futoshiki or Kakuro page', () => {
  const hashi = growthPilotTools.find(({ id }) => id === 'hashi-puzzle');
  assert.ok(hashi);
  assert.equal(hashi.primaryIntent, 'hashi puzzle');
  assert.match(hashi.functions.join(' '), /one or two bridges/iu);
  assert.match(hashi.acceptance, /connected graph/u);
  assert.deepEqual(hashi.relatedExistingIds, ['futoshiki', 'kakuro']);
});

test('the additive catalog rejects protected-ID collisions, duplicate IDs and incomplete contracts', () => {
  const base = growthPilotTools[0];
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, id: tools[0].id }]), /protected UsefulVerse ID/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [base, base]), /Duplicate new tool ID/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, acceptance: '' }]), /Incomplete product contract/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, relatedExistingIds: ['not-real'] }]), /missing related tool/);
});
