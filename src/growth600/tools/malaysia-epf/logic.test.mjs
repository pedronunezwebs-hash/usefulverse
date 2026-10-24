import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateMalaysiaForeignEmployeeEpf } from './logic.mjs';

test('applies the current 2% employee and employer contribution rates', () => {
  const result = estimateMalaysiaForeignEmployeeEpf(6710, '2026-10-20');
  assert.equal(result.employeeShare, 134.2); assert.equal(result.employerShare, 134.2); assert.equal(result.payableTotal, 269);
});
test('rounds combined contribution up to the next ringgit', () => {
  assert.equal(estimateMalaysiaForeignEmployeeEpf(3000, '2026-10-20').payableTotal, 120);
  assert.equal(estimateMalaysiaForeignEmployeeEpf(0, '2026-10-20').payableTotal, 0);
});
test('rejects invalid wages and expires for a scheduled rules review', () => {
  assert.throws(() => estimateMalaysiaForeignEmployeeEpf(-1, '2026-10-20'), { code: 'invalid-wages' });
  assert.throws(() => estimateMalaysiaForeignEmployeeEpf(3000, '2027-04-20'), { code: 'rules-review-due' });
});
