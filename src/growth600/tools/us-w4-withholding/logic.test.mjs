import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateUsW4Withholding } from './logic.mjs';

test('applies 2026 single standard schedule and Step 2 deduction', () => {
  const result = estimateUsW4Withholding({ wagesPerPeriod: 60000/26, frequency: 'biweekly', filingStatus: 'single' });
  assert.equal(result.adjustedAnnualWages, 51400); assert.ok(Math.abs(result.withholding - 5020/26) < 1e-9);
});
test('uses the Step 2 checkbox schedule without the standard wage adjustment', () => {
  const result = estimateUsW4Withholding({ wagesPerPeriod: 60000/26, frequency: 'biweekly', filingStatus: 'single', step2: true });
  assert.equal(result.adjustedAnnualWages, 60000); assert.ok(Math.abs(result.withholding - 8785/26) < 1e-9);
});
test('applies annualized other income, deductions, credits, and extra withholding', () => {
  const result = estimateUsW4Withholding({ wagesPerPeriod: 1000, frequency: 'weekly', filingStatus: 'married', step4aOtherIncome: 5200, step4bDeductions: 2600, step3Credits: 5200, step4cExtra: 10 });
  assert.equal(result.adjustedAnnualWages, 41700); assert.equal(result.afterCredits, 0); assert.equal(result.withholding, 10);
});
test('validates numeric and option inputs, then expires after 2026', () => {
  assert.throws(() => estimateUsW4Withholding({ wagesPerPeriod: 500, frequency: 'daily', filingStatus: 'single' }), { code: 'invalid-options' });
  assert.throws(() => estimateUsW4Withholding({ wagesPerPeriod: -1, frequency: 'weekly', filingStatus: 'single' }), { code: 'invalid-amount' });
  assert.throws(() => estimateUsW4Withholding({ wagesPerPeriod: 500, frequency: 'weekly', filingStatus: 'single' }, '2027-01-01'), { code: 'table-expired' });
});
