import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateUkUniversalCreditEarningsTaper } from './logic.mjs';

test('applies the 55% taper after the 2026/27 lower work allowance', () => {
  const result = estimateUkUniversalCreditEarningsTaper(800, 1200, 'housing', '2026-10-20');
  assert.equal(result.workAllowance, 427); assert.equal(result.earningsReduction, 425.15); assert.equal(result.estimatedPayment, 374.85);
});
test('caps the reduction at the maximum award and supports zero allowance', () => {
  assert.equal(estimateUkUniversalCreditEarningsTaper(100, 1000, 'none', '2026-10-20').estimatedPayment, 0);
  assert.equal(estimateUkUniversalCreditEarningsTaper(500, 200, 'no-housing', '2026-10-20').estimatedPayment, 500);
});
test('rejects invalid input and expires the rules snapshot', () => {
  assert.throws(() => estimateUkUniversalCreditEarningsTaper(-1, 500, 'none', '2026-10-20'), { code: 'invalid-input' });
  assert.throws(() => estimateUkUniversalCreditEarningsTaper(800, 500, 'none', '2027-04-06'), { code: 'rules-review-due' });
});
