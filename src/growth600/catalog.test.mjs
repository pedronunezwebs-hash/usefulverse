import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from '../catalog.mjs';
import { assertGrowthCatalogIsAdditive, growthPilotTools } from './catalog.mjs';

test('the current growth IDs are unique and additive to the protected catalog', () => {
  assert.equal(growthPilotTools.length, 122);
  assert.equal(new Set(growthPilotTools.map(({ id }) => id)).size, 122);
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

test('Spearman calculator handles rank ties and stays distinct from Pearson linear regression', () => {
  const calculator = growthPilotTools.find(({ id }) => id === 'spearman-correlation-calculator');
  assert.ok(calculator);
  assert.equal(calculator.primaryIntent, 'spearman correlation calculator');
  assert.deepEqual(calculator.relatedExistingIds, ['linear-regression-calculator']);
  assert.match(calculator.functions.join(' '), /tied values by assigning their average ranks/u);
  assert.match(calculator.boundary, /does not calculate a p-value/u);
});

test('Wilcoxon signed-rank calculator handles paired differences, zeros, ties and exact/approximate thresholds', () => {
  const calculator = growthPilotTools.find(({ id }) => id === 'wilcoxon-signed-rank-test-calculator');
  assert.equal(calculator.primaryIntent, 'wilcoxon signed rank test calculator');
  assert.match(calculator.acceptance, /every before\/after pair is identical/u);
  assert.match(calculator.boundary, /after minus before/u);
  assert.match(calculator.boundary, /symmetric differences/u);
  assert.deepEqual(calculator.relatedExistingIds, []);
});

test('JSON Diff compares structure rather than source lines and stays distinct from text diff', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'json-diff');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'json diff');
  assert.deepEqual(tool.relatedExistingIds, ['text-diff-checker', 'json-formatter']);
  assert.match(tool.acceptance, /key order/u);
  assert.match(tool.functions.join(' '), /match object records/u);
  assert.match(tool.boundary, /array indexes/u);
});

test('text/binary conversion preserves UTF-8 and stays distinct from numeric base conversion', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'text-to-binary-converter');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'binary to text converter');
  assert.deepEqual(tool.relatedExistingIds, ['binary-converter', 'base64-encoder-decoder', 'text-diff-checker']);
  assert.match(tool.acceptance, /ñ produces UTF-8 bytes/u);
  assert.match(tool.boundary, /not integers between numeric bases/u);
  assert.match(tool.boundary, /strictly valid UTF-8/u);
});

test('X.509 decoder reads local PEM/DER fields without claiming trust verification', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'certificate-decoder');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'certificate decoder');
  assert.deepEqual(tool.relatedExistingIds, ['jwt-decoder', 'json-ld-generator']);
  assert.match(tool.functions.join(' '), /subject alternative names/u);
  assert.match(tool.acceptance, /fixture.example.invalid/u);
  assert.match(tool.boundary, /does not verify/u);
});

test('JSON/XML converter is bidirectional with explicit lossy mappings and blocked DTDs', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'json-to-xml-converter');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'xml to json converter');
  assert.deepEqual(tool.relatedExistingIds, ['json-yaml-converter', 'xml-formatter']);
  assert.match(tool.acceptance, /repeated item elements/u);
  assert.match(tool.boundary, /DTD and entity declarations are blocked/u);
  assert.match(tool.boundary, /not guaranteed to round-trip/u);
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

test('polygon calculator covers regular N-gons without competing with the triangle calculator', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'polygon-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'polygon calculator');
  assert.deepEqual(tool.relatedExistingIds, ['triangle-calculator']);
  assert.match(tool.boundary, /4–1,000 sides/u);
  assert.match(tool.acceptance, /perimeter 6/u);
});

test('friction calculator models Coulomb friction and incline motion without duplicating net-force calculations', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'friction-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'friction calculator');
  assert.deepEqual(tool.relatedExistingIds, ['force-calculator']);
  assert.match(tool.acceptance, /μs=0.*friction force is 0/u);
  assert.match(tool.boundary, /Coulomb/u);
});

test('thermal expansion calculator requires dimension-matched coefficients and has a zero-temperature acceptance case', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'thermal-expansion-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'thermal expansion calculator');
  assert.match(tool.functions.join(' '), /linear, area, or volume/u);
  assert.match(tool.acceptance, /zero temperature change preserves/u);
  assert.match(tool.boundary, /does not infer material properties/u);
  assert.deepEqual(tool.relatedExistingIds, ['unit-converter', 'heat-loss-calculator']);
});

test('Hijri calendar converter declares its fixed tabular method and distinction from observation', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'hijri-calendar-converter');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'hijri calendar converter');
  assert.match(tool.boundary, /not Umm al-Qura or a local moon-sighting decision/u);
  assert.match(tool.acceptance, /same tabular method/u);
  assert.deepEqual(tool.relatedExistingIds, ['date-calculator']);
});

test('capacitor calculator combines ideal capacitor networks and distinguishes component energy from resistor tools', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'capacitor-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'capacitor calculator');
  assert.deepEqual(tool.relatedExistingIds, ['ohms-law-calculator']);
  assert.match(tool.functions.join(' '), /stored energy/u);
  assert.match(tool.boundary, /no voltage-rating, tolerance, leakage or ESR model/u);
  assert.match(tool.acceptance, /200 μF/u);
});

test('body-water estimate names its adult source model and avoids hydration advice', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'body-water-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'body water calculator');
  assert.match(tool.functions.join(' '), /Watson equation/u);
  assert.match(tool.boundary, /does not measure hydration/u);
  assert.match(tool.boundary, /No minors/u);
  assert.match(tool.acceptance, /41\.9212 L/u);
});

test('555 timer calculator keeps astable and monostable circuit timing distinct from a user timer', () => {
  const tool = growthPilotTools.find(({ id }) => id === '555-timer-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, '555 timer calculator');
  assert.match(tool.functions.join(' '), /astable high time, low time, period, frequency/u);
  assert.match(tool.boundary, /does not simulate a specific manufacturer/u);
  assert.deepEqual(tool.relatedExistingIds, ['online-timer']);
});

test('Fourier series calculator uses sampled periodic data, not audio uploads or symbolic expressions', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'fourier-series-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'fourier series calculator');
  assert.match(tool.functions.join(' '), /4–128 equally spaced numeric samples/u);
  assert.match(tool.acceptance, /constant input.*DC = 5/su);
  assert.match(tool.boundary, /not an audio player/u);
  assert.deepEqual(tool.relatedExistingIds, ['audio-spectrogram', 'function-grapher']);
});

test('modular inverse calculator distinguishes inverse existence from modulo remainder', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'modular-inverse-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'modular inverse calculator');
  assert.match(tool.acceptance, /inverse of 3 modulo 7 is 5/u);
  assert.match(tool.functions.join(' '), /greatest common divisor/u);
  assert.match(tool.boundary, /not a remainder calculator/u);
  assert.deepEqual(tool.relatedExistingIds, ['gcd-lcm-calculator']);
});

test('A/B test calculator estimates between-group evidence, not a single conversion rate', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'a-b-test-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'a b test calculator');
  assert.ok(tool.functions.some((entry) => entry.includes('Newcombe')));
  assert.match(tool.boundary, /false positives|false-positive|sequential/iu);
  assert.deepEqual(tool.relatedExistingIds, ['percentage-calculator']);
});

test('investment allocation calculator applies user-set targets without recommending securities', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'investment-allocation-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'portfolio allocation calculator');
  assert.match(tool.acceptance, /6,000 and 4,000/u);
  assert.match(tool.boundary, /does not recommend an allocation/u);
  assert.deepEqual(tool.relatedExistingIds, ['compound-interest-calculator']);
});

test('repeating decimal converter handles periodic notation without competing with finite fraction arithmetic', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'repeating-decimal-to-fraction');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'repeating decimal to fraction calculator');
  assert.match(tool.acceptance, /0\.\(3\).*1\/3/u);
  assert.match(tool.boundary, /not finite decimals/u);
  assert.deepEqual(tool.relatedExistingIds, ['fraction-calculator']);
});

test('SVD calculator handles compact rectangular reconstruction, distinct from basic matrix operations', () => {
  const tool = growthPilotTools.find(({ id }) => id === 'singular-value-decomposition-calculator');
  assert.ok(tool);
  assert.equal(tool.primaryIntent, 'svd calculator');
  assert.match(tool.acceptance, /diagonal matrix.*3 and 2/su);
  assert.match(tool.functions.join(' '), /rectangular matrix/u);
  assert.match(tool.boundary, /floating-point tolerance/u);
  assert.deepEqual(tool.relatedExistingIds, ['matrix-calculator']);
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
