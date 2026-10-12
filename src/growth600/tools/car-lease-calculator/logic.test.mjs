import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCarLease } from './logic.mjs';

test('matches the plan acceptance depreciation example before rent charge and tax', () => {
  const result = calculateCarLease({ capitalizedCost: 12000, residualValue: 0, termMonths: 36, moneyFactor: 0 });
  assert.equal(result.monthlyDepreciation, 12000 / 36);
  assert.equal(result.monthlyDepreciation.toFixed(2), '333.33');
});

test('calculates a full illustrative payment with reduction, rent charge and manually entered tax', () => {
  const result = calculateCarLease({ capitalizedCost: 30000, residualValue: 18000, termMonths: 36, moneyFactor: 0.002, capCostReduction: 2000, taxPercent: 8 });
  assert.equal(result.adjustedCapitalizedCost, 28000);
  assert.equal(result.monthlyDepreciation, 10000 / 36);
  assert.equal(result.monthlyRentCharge, 92);
  assert.equal(result.monthlyPretaxPayment, 10000 / 36 + 92);
  assert.equal(result.estimatedMonthlyPayment, result.monthlyPretaxPayment * 1.08);
  assert.equal(result.estimatedPaymentsPlusCapReduction, result.estimatedMonthlyPayment * 36 + 2000);
});

test('zero-interest factor, zero tax and zero cap reduction remain valid', () => {
  const result = calculateCarLease({ capitalizedCost: 12000, residualValue: 3000, termMonths: 36, moneyFactor: 0, capCostReduction: 0, taxPercent: 0 });
  assert.equal(result.estimatedMonthlyPayment, 250);
  assert.equal(result.estimatedPaymentsPlusCapReduction, 9000);
});

test('rejects blank, negative, non-finite, implausible and inconsistent values', () => {
  for (const input of [
    { capitalizedCost: '', residualValue: 0, termMonths: 36, moneyFactor: 0 },
    { capitalizedCost: -1, residualValue: 0, termMonths: 36, moneyFactor: 0 },
    { capitalizedCost: 12000, residualValue: 0, termMonths: 0, moneyFactor: 0 },
    { capitalizedCost: 12000, residualValue: 0, termMonths: 36.5, moneyFactor: 0 },
    { capitalizedCost: 12000, residualValue: 0, termMonths: 36, moneyFactor: Infinity },
    { capitalizedCost: 12000, residualValue: 0, termMonths: 36, moneyFactor: 1.01 },
    { capitalizedCost: 12000, residualValue: 0, termMonths: 36, moneyFactor: 0, capCostReduction: 12001 },
    { capitalizedCost: 12000, residualValue: 11000, termMonths: 36, moneyFactor: 0, capCostReduction: 2000 },
    { capitalizedCost: 12000, residualValue: 0, termMonths: 36, moneyFactor: 0, taxPercent: 101 },
  ]) assert.throws(() => calculateCarLease(input), RangeError);
});
