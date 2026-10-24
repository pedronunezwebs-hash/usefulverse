import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateGermanAlgIMonthlyPayment } from './logic.mjs';

test('applies the 60% general rate and a 30-day month', () => {
  assert.equal(estimateGermanAlgIMonthlyPayment(60, 'none', '2026-10-20').monthlyPayment, 1080);
});
test('applies 67% for a qualifying child', () => {
  const result = estimateGermanAlgIMonthlyPayment(60, 'qualifying', '2026-10-20');
  assert.equal(result.dailyPayment, 40.2); assert.equal(result.monthlyPayment, 1206);
});
test('rejects invalid inputs and disables on the review date', () => {
  assert.throws(() => estimateGermanAlgIMonthlyPayment(-1, 'none', '2026-10-20'), { code: 'invalid-input' });
  assert.throws(() => estimateGermanAlgIMonthlyPayment(60, 'none', '2027-04-20'), { code: 'rules-review-due' });
});
