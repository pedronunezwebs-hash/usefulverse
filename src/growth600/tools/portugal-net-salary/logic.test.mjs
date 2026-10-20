import test from 'node:test';
import assert from 'node:assert/strict';
import { estimatePortugalNetSalary2026 } from './logic.mjs';

test('estimates a 2026 mainland monthly wage using Table I and employee Social Security', () => {
  const result = estimatePortugalNetSalary2026(2000, '2026-10-20');
  assert.equal(result.irsWithholding, 301.34); assert.equal(result.socialSecurity, 220); assert.equal(result.netMonthly, 1478.66);
});
test('respects the table zero-withholding band and progressive-table thresholds', () => {
  assert.equal(estimatePortugalNetSalary2026(920, '2026-10-20').irsWithholding, 0);
  assert.equal(estimatePortugalNetSalary2026(2000, '2026-10-20').marginalRate, 0.311);
});
test('rejects invalid values and expires its 2026 table', () => {
  assert.throws(() => estimatePortugalNetSalary2026(-1, '2026-10-20'), { code: 'invalid-income' });
  assert.throws(() => estimatePortugalNetSalary2026(2000, '2026-12-01'), { code: 'rules-review-due' });
});
