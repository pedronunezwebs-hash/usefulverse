import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateSpainDismissalCompensation } from './logic.mjs';

test('estimates objective dismissal compensation with the 12-month cap', () => {
  const result = estimateSpainDismissalCompensation(36500, 240, 'objective', '2026-10-20');
  assert.equal(result.compensationDays, 365); assert.equal(result.amount, 36500);
});
test('prorates service by months and uses the unfair dismissal rate', () => {
  const result = estimateSpainDismissalCompensation(36500, 6, 'unfair', '2026-10-20');
  assert.equal(result.accruedDays, 16.5); assert.equal(result.amount, 1650);
});
test('rejects invalid input and disables when review is due', () => {
  assert.throws(() => estimateSpainDismissalCompensation(0, 12, 'objective', '2026-10-20'), { code: 'invalid-input' });
  assert.throws(() => estimateSpainDismissalCompensation(36500, 12, 'objective', '2027-01-15'), { code: 'rules-review-due' });
});
