import test from 'node:test';
import assert from 'node:assert/strict';
import { getPregnancyWeightGainGuide } from './logic.mjs';

test('singleton total ranges follow CDC BMI bands', () => {
  assert.deepEqual([17, 18.5, 25, 30].map((bmi) => {
    const { minLb, maxLb, category } = getPregnancyWeightGainGuide(bmi);
    return [category, minLb, maxLb];
  }), [['underweight', 28, 40], ['normal', 25, 35], ['overweight', 15, 25], ['obesity', 11, 20]]);
});

test('twin ranges and converted kilograms are returned', () => {
  const result = getPregnancyWeightGainGuide(22, 'twins');
  assert.equal(result.minLb, 37);
  assert.equal(result.maxLb, 54);
  assert.ok(Math.abs(result.minKg - 16.7829) < 0.001);
  assert.ok(Math.abs(result.maxKg - 24.4939) < 0.001);
});

test('unsupported cases return no range', () => {
  assert.equal(getPregnancyWeightGainGuide(22, 'three-or-more').supported, false);
  assert.equal(getPregnancyWeightGainGuide(40).reason, 'bmi-outside-published-bands');
});

test('invalid BMI and pregnancy type are rejected', () => {
  assert.throws(() => getPregnancyWeightGainGuide(0), { code: 'invalid-bmi' });
  assert.throws(() => getPregnancyWeightGainGuide(22, 'quadruplets'), { code: 'invalid-pregnancy-type' });
});
