import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateIndiaHraExemption } from './logic.mjs';

test('uses the lowest HRA limit for an eligible metropolitan city', () => {
  const result = estimateIndiaHraExemption(600000, 0, 240000, 240000, 'metro', '2026-10-20');
  assert.equal(result.exemption, 180000); assert.equal(result.taxableHra, 60000);
});
test('uses the 40 percent limit outside the four listed metro cities', () => {
  const result = estimateIndiaHraExemption(600000, 0, 400000, 400000, 'other', '2026-10-20');
  assert.equal(result.exemption, 240000);
});
test('returns no exemption when rent does not exceed 10 percent of salary', () => {
  assert.equal(estimateIndiaHraExemption(600000, 0, 100000, 50000, 'metro', '2026-10-20').exemption, 0);
});
test('rejects invalid values and disables after the review date', () => {
  assert.throws(() => estimateIndiaHraExemption(-1, 0, 0, 0, 'metro', '2026-10-20'), { code: 'invalid-input' });
  assert.throws(() => estimateIndiaHraExemption(600000, 0, 200000, 200000, 'metro', '2027-04-20'), { code: 'rules-review-due' });
});
