import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateFranceAreMonthlyPayment } from './logic.mjs';

test('selects the more favorable ordinary ARE daily formula and multiplies by calendar days', () => {
  const result = estimateFranceAreMonthlyPayment(100, 31, 1, '2026-10-20');
  assert.equal(result.formula406, 53.58);
  assert.equal(result.formula57, 57);
  assert.equal(result.dailyGross, 57);
  assert.equal(result.monthlyGross, 1767);
});
test('applies the part-time factor to the fixed portion and minimum', () => {
  const result = estimateFranceAreMonthlyPayment(30, 30, 0.5, '2026-10-20');
  assert.equal(result.formula406, 18.71);
  assert.equal(result.dailyGross, 18.71);
});
test('caps the daily allowance at 75% of SJR', () => {
  const result = estimateFranceAreMonthlyPayment(20, 30, 1, '2026-10-20');
  assert.equal(result.dailyGross, 15);
});
test('rejects invalid input and disables after review date', () => {
  assert.throws(() => estimateFranceAreMonthlyPayment(0, 30, 1, '2026-10-20'), { code: 'invalid-input' });
  assert.throws(() => estimateFranceAreMonthlyPayment(100, 30, 1, '2027-01-01'), { code: 'rules-review-due' });
});
