import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRingComparison, parseRingChart } from './ring-size.mjs';

test('converts inner diameter, circumference and user units without assuming a size system', () => {
  const result = calculateRingComparison({ value: '2', unit: 'cm', basis: 'diameter' });
  assert.equal(result.diameterMm, 20);
  assert.ok(Math.abs(result.circumferenceMm - 62.831853) < 0.00001);
  assert.equal(result.nearest, null);
});

test('compares to a user supplied diameter chart and accepts decimal commas', () => {
  const result = calculateRingComparison({
    value: '20', unit: 'mm', basis: 'diameter',
    chart: 'Size; inner diameter\n9; 18,9\n10; 20,0\n11; 20,6',
    chartUnit: 'mm', chartBasis: 'diameter',
  });
  assert.equal(result.nearest.label, '10');
  assert.equal(result.outside, false);
});

test('does not invent a match outside the supplied chart range', () => {
  const result = calculateRingComparison({ value: '22', unit: 'mm', basis: 'diameter', chart: '9;18,9\n10;20,0', chartUnit: 'mm', chartBasis: 'diameter' });
  assert.equal(result.nearest, null);
  assert.equal(result.outside, true);
});

test('accepts an empty chart for measurement-only use', () => {
  const result = calculateRingComparison({ value: '62.8', basis: 'circumference' });
  assert.equal(result.nearest, null);
  assert.equal(result.outside, false);
  assert.equal(result.chartRows.length, 0);
});

test('rejects descending, malformed and out-of-range chart data', () => {
  assert.throws(() => parseRingChart('Large; 22\nSmall; 18'), /increase/u);
  assert.throws(() => parseRingChart('Same; 20\nDuplicate; 20'), /increase/u);
  assert.throws(() => parseRingChart('Only one cell'), /one label/u);
  assert.throws(() => parseRingChart(Array.from({ length: 101 }, (_, i) => `S${i}; ${15 + i}`).join('\n')), /100 rows/u);
  assert.throws(() => calculateRingComparison({ value: '10', unit: 'mm', basis: 'diameter' }), /35–90/u);
  assert.throws(() => calculateRingComparison({ value: '2', unit: 'foo', basis: 'diameter' }), /supported unit/u);
});
