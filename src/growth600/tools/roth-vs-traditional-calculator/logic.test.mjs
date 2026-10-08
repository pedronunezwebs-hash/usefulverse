import assert from 'node:assert/strict';
import test from 'node:test';
import { compareRothTraditional, futureValueFactor } from './logic.mjs';

test('equal current and future tax rates produce equal after-tax values from an equal pretax budget', () => {
  const result = compareRothTraditional({ annualContribution: 6000, currentTaxRatePercent: 22, futureTaxRatePercent: 22, annualReturnPercent: 6, years: 25 });
  assert.ok(Math.abs(result.estimatedDifference) < 1e-8);
  assert.equal(result.totalPretaxBudget, 150000);
  assert.equal(result.rothAnnualDeposit, 4680);
  assert.ok(result.traditionalEstimatedTax > 0);
});

test('zero return uses one equal year-end contribution per year', () => {
  assert.equal(futureValueFactor(0, 10), 10);
  const result = compareRothTraditional({ annualContribution: 1000, currentTaxRatePercent: 20, futureTaxRatePercent: 10, annualReturnPercent: 0, years: 10 });
  assert.equal(result.rothAfterTaxBalance, 8000);
  assert.equal(result.traditionalAfterTaxBalance, 9000);
  assert.equal(result.estimatedDifference, -1000);
});

test('future tax-rate changes affect only the traditional after-tax estimate', () => {
  const lowerFutureTax = compareRothTraditional({ annualContribution: 10000, currentTaxRatePercent: 25, futureTaxRatePercent: 10, annualReturnPercent: 5, years: 20 });
  const higherFutureTax = compareRothTraditional({ annualContribution: 10000, currentTaxRatePercent: 25, futureTaxRatePercent: 35, annualReturnPercent: 5, years: 20 });
  assert.equal(lowerFutureTax.rothAfterTaxBalance, higherFutureTax.rothAfterTaxBalance);
  assert.ok(lowerFutureTax.traditionalAfterTaxBalance > higherFutureTax.traditionalAfterTaxBalance);
});

test('negative return and contribution boundaries remain finite', () => {
  const result = compareRothTraditional({ annualContribution: 0, currentTaxRatePercent: 0, futureTaxRatePercent: 60, annualReturnPercent: -50, years: 80 });
  assert.equal(result.rothAfterTaxBalance, 0);
  assert.equal(result.traditionalAfterTaxBalance, 0);
  assert.ok(Number.isFinite(result.growthFactor));
});

test('rejects non-finite values, fractional years and unsupported rates or amounts', () => {
  for (const patch of [
    { annualContribution: Infinity }, { annualContribution: -1 }, { annualContribution: 1_000_001 },
    { currentTaxRatePercent: 61 }, { futureTaxRatePercent: -1 }, { annualReturnPercent: -51 },
    { annualReturnPercent: 31 }, { years: 0 }, { years: 1.5 }, { years: 81 },
  ]) assert.throws(() => compareRothTraditional({ annualContribution: 5000, currentTaxRatePercent: 22, futureTaxRatePercent: 22, annualReturnPercent: 6, years: 20, ...patch }), RangeError);
});
