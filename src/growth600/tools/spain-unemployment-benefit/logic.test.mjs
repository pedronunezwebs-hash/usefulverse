import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateSpainContributoryBenefit2026 } from './logic.mjs';

test('uses 70% rate before and on day 180, with 2026 caps', () => {
  assert.equal(estimateSpainContributoryBenefit2026(1800, 180, 'none', '2026-10-20').monthlyAmount, 1225);
  assert.equal(estimateSpainContributoryBenefit2026(1800, 181, 'none', '2026-10-20').monthlyAmount, 1080);
});
test('applies the official minimums and child-based maximums', () => {
  assert.equal(estimateSpainContributoryBenefit2026(500, 1, 'one', '2026-10-20').monthlyAmount, 749);
  assert.equal(estimateSpainContributoryBenefit2026(4000, 181, 'two-plus', '2026-10-20').monthlyAmount, 1575);
});
test('rejects invalid inputs and disables the rule set at review', () => {
  assert.throws(() => estimateSpainContributoryBenefit2026(0, 1, 'none', '2026-10-20'), { code: 'invalid-input' });
  assert.throws(() => estimateSpainContributoryBenefit2026(1800, 181, 'none', '2027-01-10'), { code: 'rules-review-due' });
});
