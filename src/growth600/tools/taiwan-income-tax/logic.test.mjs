import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateTaiwanResidentIncomeTax2026 } from './logic.mjs';

test('uses the official 2026 progressive difference table', () => {
  const result = estimateTaiwanResidentIncomeTax2026(1_000_000, '2026-10-20');
  assert.equal(result.tax, 77_300); assert.equal(result.marginalRate, 0.12);
});
test('handles bracket thresholds and the 40 percent marginal rate', () => {
  assert.equal(estimateTaiwanResidentIncomeTax2026(610_000, '2026-10-20').tax, 30_500);
  assert.equal(estimateTaiwanResidentIncomeTax2026(6_000_000, '2026-10-20').marginalRate, 0.40);
});
test('rejects invalid income and expires the schedule', () => {
  assert.throws(() => estimateTaiwanResidentIncomeTax2026(-1, '2026-10-20'), { code: 'invalid-income' });
  assert.throws(() => estimateTaiwanResidentIncomeTax2026(1_000_000, '2027-04-20'), { code: 'rules-review-due' });
});
