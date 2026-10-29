import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateUkCapitalGains } from './logic.mjs';

test('matches HMRC 2026-27 example 1', () => {
  assert.equal(estimateUkCapitalGains({ netGainsAfterLosses: 12600, taxableIncome: 20000 }, '2026-04-06').estimatedTax, 1728);
});
test('matches HMRC 2026-27 example 2 across the basic-rate boundary', () => {
  const result = estimateUkCapitalGains({ netGainsAfterLosses: 52600, taxableIncome: 20000 }, '2026-04-06');
  assert.equal(result.basicRateGains, 17700); assert.equal(result.higherRateGains, 31900); assert.equal(result.estimatedTax, 10842);
});
test('deducts the annual exemption and rejects invalid input', () => {
  assert.equal(estimateUkCapitalGains({ netGainsAfterLosses: 2500, taxableIncome: 0 }, '2026-04-06').estimatedTax, 0);
  assert.throws(() => estimateUkCapitalGains({ netGainsAfterLosses: -1, taxableIncome: 0 }, '2026-04-06'), { code: 'invalid-amount' });
});
test('does not estimate outside 2026-27', () => { assert.throws(() => estimateUkCapitalGains({ netGainsAfterLosses: 10000, taxableIncome: 0 }, '2027-04-06'), { code: 'tax-year-unavailable' }); });
