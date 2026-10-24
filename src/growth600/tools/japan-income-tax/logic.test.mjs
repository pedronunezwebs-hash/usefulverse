import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateJapanIncomeTax2026 } from './logic.mjs';

test('matches the NTA 2026 quick-calculation example', () => {
  const result = estimateJapanIncomeTax2026(7000000, '2026-01-01');
  assert.equal(result.taxableIncome, 7000000); assert.equal(result.baseIncomeTax, 974000);
  assert.equal(result.reconstructionTax, 20454); assert.equal(result.nationalTaxDue, 994400);
});
test('truncates taxable income below JPY 1,000 and rounds total national tax down to JPY 100', () => {
  const result = estimateJapanIncomeTax2026(1950999, '2026-01-01');
  assert.equal(result.taxableIncome, 1950000); assert.equal(result.marginalRate, 0.05);
  assert.equal(result.nationalTaxDue % 100, 0);
});
test('rejects invalid income and estimates outside the 2026 calendar year', () => {
  assert.throws(() => estimateJapanIncomeTax2026(-1, '2026-01-01'), { code: 'invalid-income' });
  assert.throws(() => estimateJapanIncomeTax2026(2000000, '2027-01-01'), { code: 'tax-year-unavailable' });
});
