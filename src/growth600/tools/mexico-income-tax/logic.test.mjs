import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateMexicoIndividualIsr2026 } from './logic.mjs';

test('applies the official 2026 annual tariff fixed quota and marginal rate', () => {
  const result = estimateMexicoIndividualIsr2026(500000, '2026-10-20');
  assert.equal(result.tax, 85773.86); assert.equal(result.marginalRate, 0.2352); assert.equal(result.fixedQuota, 67981.92);
});
test('handles zero and the highest rate bracket', () => {
  assert.equal(estimateMexicoIndividualIsr2026(0, '2026-10-20').tax, 0);
  assert.equal(estimateMexicoIndividualIsr2026(6000000, '2026-10-20').marginalRate, 0.35);
});
test('rejects invalid taxable income and expires the annual tariff', () => {
  assert.throws(() => estimateMexicoIndividualIsr2026(-1, '2026-10-20'), { code: 'invalid-income' });
  assert.throws(() => estimateMexicoIndividualIsr2026(500000, '2027-01-01'), { code: 'rules-review-due' });
});
