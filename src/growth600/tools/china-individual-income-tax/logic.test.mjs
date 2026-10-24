import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateChinaResidentComprehensiveTax2026 } from './logic.mjs';

test('applies the annual resident comprehensive-income rate and quick deduction', () => {
  const result = estimateChinaResidentComprehensiveTax2026(200000, '2026-10-20');
  assert.equal(result.tax, 23080); assert.equal(result.marginalRate, 0.20); assert.equal(result.quickDeduction, 16920);
});
test('handles bracket thresholds and highest rate', () => {
  assert.equal(estimateChinaResidentComprehensiveTax2026(36000, '2026-10-20').tax, 1080);
  assert.equal(estimateChinaResidentComprehensiveTax2026(1_000_000, '2026-10-20').marginalRate, 0.45);
});
test('rejects negative income and disables after the review date', () => {
  assert.throws(() => estimateChinaResidentComprehensiveTax2026(-1, '2026-10-20'), { code: 'invalid-income' });
  assert.throws(() => estimateChinaResidentComprehensiveTax2026(200000, '2027-04-20'), { code: 'rules-review-due' });
});
