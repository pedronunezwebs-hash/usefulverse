import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from '../catalog.mjs';
import { assertGrowthCatalogIsAdditive, growthPilotTools } from './catalog.mjs';

test('the current growth IDs are unique and additive to the protected catalog', () => {
  assert.equal(growthPilotTools.length, 101);
  assert.equal(new Set(growthPilotTools.map(({ id }) => id)).size, 101);
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

test('chess opening trainer adds repertoire practice rather than another free-play or tactics page', () => {
  const trainer = growthPilotTools.find(({ id }) => id === 'chess-opening-trainer');
  assert.ok(trainer);
  assert.equal(trainer.primaryIntent, 'chess openings practice');
  assert.match(trainer.acceptance, /standard starting position/u);
  assert.deepEqual(trainer.relatedExistingIds, ['chess-game', 'chess-clock']);
});

test('decibel calculator does logarithmic ratios and incoherent-level sums, not SPL measurement', () => {
  const calculator = growthPilotTools.find(({ id }) => id === 'decibel-calculator');
  assert.ok(calculator);
  assert.equal(calculator.primaryIntent, 'decibel calculator');
  assert.match(calculator.boundary, /does not measure SPL/u);
  assert.match(calculator.functions.join(' '), /sum 2 to 20 incoherent sound levels/u);
});

test('OpenAPI editor stays a local contract editor and does not duplicate request-builder intent', () => {
  const editor = growthPilotTools.find(({ id }) => id === 'openapi-editor');
  assert.ok(editor);
  assert.equal(editor.primaryIntent, 'swagger editor online');
  assert.match(editor.boundary, /never fetched/u);
  assert.match(editor.functions.join(' '), /without making API requests/u);
  assert.deepEqual(editor.relatedExistingIds, ['api-request-builder', 'json-yaml-converter', 'schema-markup-validator']);
});

test('font pairing compares type hierarchy without duplicating single-file font testing', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'font-pairing-tool');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'font pair generator');
  assert.match(tool.boundary, /not a font-file tester/u);
  assert.match(tool.acceptance, /initial page makes no font requests/u);
  assert.deepEqual(tool.relatedExistingIds, ['font-tester', 'color-palette-generator']);
});

test('Roth vs traditional compares user-entered tax scenarios without giving tax or account advice', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'roth-vs-traditional-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'roth ira vs traditional ira calculator');
  assert.match(tool.boundary, /not tax, investment, eligibility or account advice/u);
  assert.match(tool.acceptance, /equal pretax budgets produce equal after-tax balances/u);
  assert.deepEqual(tool.relatedExistingIds, ['compound-interest-calculator']);
});

test('the additive catalog rejects protected-ID collisions, duplicate IDs and incomplete contracts', () => {
  const base = growthPilotTools[0];
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, id: tools[0].id }]), /protected UsefulVerse ID/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [base, base]), /Duplicate new tool ID/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, acceptance: '' }]), /Incomplete product contract/);
  assert.throws(() => assertGrowthCatalogIsAdditive(tools, [{ ...base, relatedExistingIds: ['not-real'] }]), /missing related tool/);
});
