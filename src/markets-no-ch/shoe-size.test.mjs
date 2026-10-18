import test from 'node:test';
import assert from 'node:assert/strict';
import { compareFootLengths, parseFootwearChart, toMillimeters } from './shoe-size.mjs';

test('foot measurement units normalize to millimetres and reject unsupported lengths', () => {
  assert.equal(toMillimeters(254, 'mm'), 254);
  assert.equal(toMillimeters(25.4, 'cm'), 254);
  assert.equal(toMillimeters(10, 'in'), 254);
  assert.throws(() => toMillimeters(0, 'mm'), RangeError);
  assert.throws(() => toMillimeters(41, 'cm'), RangeError);
  assert.throws(() => toMillimeters(25, 'points'), RangeError);
});

test('a user chart accepts optional localized headings, tabs and repeated lengths without importing a size table', () => {
  const chart = parseFootwearChart('Taille\tLongueur (mm)\n39\t250\n40\t258\n40 wide\t258');
  assert.equal(chart.length, 3);
  assert.equal(chart[0].lengthMm, 250);
  assert.equal(chart[2].lengthMm, 258);
});

test('comparison uses the longer foot and applies toe allowance only to interior-length charts', () => {
  const chart = '39; 250\n40; 258\n41; 266';
  const foot = compareFootLengths({ left: 25.2, right: 25.8, unit: 'cm', chartText: chart, chartUnit: 'mm' });
  assert.equal(foot.longerFootMm, 258);
  assert.equal(foot.mondopointLengthMm, 258);
  assert.equal(foot.match.label, '40');
  const interior = compareFootLengths({ left: 258, right: 250, chartText: '40; 265\n41; 273\n42; 281', chartBasis: 'inside', allowanceMm: 10 });
  assert.equal(interior.targetMm, 268);
  assert.equal(interior.match.label, '40');
  assert.equal(interior.allowanceMm, 10);
});

test('chart validation reports descending, malformed, overlong and out-of-range data', () => {
  assert.throws(() => parseFootwearChart('40; 258\n39; 250'), /must not decrease/u);
  assert.throws(() => parseFootwearChart('40; bad\n41; 270'), RangeError);
  assert.throws(() => parseFootwearChart('40; 258'), RangeError);
  assert.throws(() => parseFootwearChart('x'.repeat(20_001)), RangeError);
  assert.throws(() => compareFootLengths({ left: 280, right: 310, chartText: '39; 250\n40; 258' , allowanceMm: 31 }), RangeError);
  const outside = compareFootLengths({ left: 300, right: 310, chartText: '39; 250\n40; 258' });
  assert.equal(outside.outsideChartRange, true);
});
