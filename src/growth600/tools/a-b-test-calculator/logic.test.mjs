import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAbTest, AB_TEST_LIMITS } from './logic.mjs';

test('equal groups show zero difference and no evidence of a winner', () => {
  const result = calculateAbTest({ visitorsA: 1000, conversionsA: 80, visitorsB: 1000, conversionsB: 80 });
  assert.equal(result.rateA, result.rateB);
  assert.equal(result.difference, 0);
  assert.equal(result.percentagePointDifference, 0);
  assert.equal(result.pValue, 1);
  assert.equal(result.significantAtFivePercent, false);
  assert.ok(result.differenceInterval.lower <= 0 && result.differenceInterval.upper >= 0);
});

test('conversion rates, relative lift, and 95% intervals are bounded', () => {
  const result = calculateAbTest({ visitorsA: 500, conversionsA: 30, visitorsB: 500, conversionsB: 40 });
  assert.equal(result.rateA, 0.06);
  assert.equal(result.rateB, 0.08);
  assert.ok(Math.abs(result.percentagePointDifference - 2) < 1e-12);
  assert.ok(result.relativeLift > 0.33 && result.relativeLift < 0.34);
  for (const interval of [result.intervalA, result.intervalB]) {
    assert.ok(interval.lower >= 0 && interval.upper <= 1 && interval.lower < interval.upper);
  }
});

test('clearly separated large samples can cross the fixed 5% threshold', () => {
  const result = calculateAbTest({ visitorsA: 10000, conversionsA: 500, visitorsB: 10000, conversionsB: 650 });
  assert.ok(result.pValue < 0.05);
  assert.equal(result.significantAtFivePercent, true);
});

test('zero baseline conversion leaves relative lift undefined, not infinite', () => {
  const result = calculateAbTest({ visitorsA: 100, conversionsA: 0, visitorsB: 100, conversionsB: 2 });
  assert.equal(result.relativeLift, null);
});

test('rejects invalid, fractional, unsafe, and impossible counts', () => {
  const valid = { visitorsA: 100, conversionsA: 10, visitorsB: 100, conversionsB: 12 };
  for (const patch of [
    { visitorsA: 0 }, { visitorsB: -1 }, { conversionsA: -1 }, { conversionsB: 101 },
    { conversionsA: 10.5 }, { visitorsA: '' }, { visitorsB: AB_TEST_LIMITS.maxCount + 1 },
  ]) assert.throws(() => calculateAbTest({ ...valid, ...patch }), RangeError);
});
