import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateSpainNationalIncomeTax2025 } from './logic.mjs';

test('applies the 2025 statutory national progressive scale', () => {
  const result = estimateSpainNationalIncomeTax2025(30000, '2026-10-20');
  assert.equal(result.tax, 3582.75); assert.equal(result.marginalRate, 0.15);
});
test('returns zero tax at zero and evaluates upper brackets', () => {
  assert.equal(estimateSpainNationalIncomeTax2025(0, '2026-10-20').tax, 0);
  assert.equal(estimateSpainNationalIncomeTax2025(350000, '2026-10-20').marginalRate, 0.245);
});
test('rejects invalid income and disables rules on review date', () => {
  assert.throws(() => estimateSpainNationalIncomeTax2025(-1, '2026-10-20'), { code: 'invalid-income' });
  assert.throws(() => estimateSpainNationalIncomeTax2025(30000, '2027-01-15'), { code: 'rules-review-due' });
});
