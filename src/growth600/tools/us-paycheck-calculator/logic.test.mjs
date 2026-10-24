import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePaycheck } from './logic.mjs';

test('paycheck scenario subtracts only entered deductions and annualizes each period', () => {
  const result = calculatePaycheck({ gross: '100.01', frequency: 'biweekly', federal: '10.13', fica: '7.65', stateLocal: '0', benefits: '2.25', other: '0' });
  assert.equal(result.currency, 'USD');
  assert.equal(result.periods, 26);
  assert.equal(result.grossPerPay, 100.01);
  assert.equal(result.deductionsPerPay, 20.03);
  assert.equal(result.netPerPay, 79.98);
  assert.equal(result.annualGross, 2600.26);
  assert.equal(result.annualDeductions, 520.78);
  assert.equal(result.annualNet, 2079.48);
  assert.equal(result.deductionRate, 20.03 / 100.01);
  assert.equal(result.breakdown.benefits, 2.25);
});

test('annualization uses the declared pay frequency without inferring tax rules', () => {
  const expectedPeriods = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
  for (const [frequency, periods] of Object.entries(expectedPeriods)) {
    const result = calculatePaycheck({ gross: 1000, frequency });
    assert.equal(result.periods, periods);
    assert.equal(result.annualGross, 1000 * periods);
    assert.equal(result.annualDeductions, 0);
    assert.equal(result.annualNet, 1000 * periods);
    assert.equal(result.deductionRate, 0);
  }
});

test('paycheck validation rejects invalid amounts, frequencies and excessive deductions', () => {
  assert.throws(() => calculatePaycheck({ gross: 0, frequency: 'weekly' }), RangeError);
  assert.throws(() => calculatePaycheck({ gross: 10, frequency: 'daily' }), RangeError);
  assert.throws(() => calculatePaycheck({ gross: 10, frequency: 'weekly', fica: -1 }), RangeError);
  assert.throws(() => calculatePaycheck({ gross: Infinity, frequency: 'weekly' }), RangeError);
  assert.throws(() => calculatePaycheck({ gross: 10, frequency: 'weekly', federal: 10, other: 0.01 }), RangeError);
});
