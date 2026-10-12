import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateFireTarget } from './logic.mjs';

test('matches the plan target example: 40,000 annual spending at 4% needs 1,000,000', () => {
  assert.equal(calculateFireTarget({ annualSpending: 40000, withdrawalRatePercent: 4 }).targetAmount, 1_000_000);
});

test('returns zero months when the current portfolio has already reached the target', () => {
  const result = calculateFireTarget({ annualSpending: 40000, withdrawalRatePercent: 4, currentPortfolio: 1_000_000 });
  assert.equal(result.monthsToTarget, 0);
  assert.equal(result.yearsToTarget, 0);
});

test('projects end-of-month contributions with return and inflation in real terms', () => {
  const result = calculateFireTarget({ annualSpending: 1000, withdrawalRatePercent: 4, currentPortfolio: 10000, monthlyContribution: 1000, expectedAnnualReturnPercent: 0, inflationPercent: 0 });
  assert.equal(result.monthsToTarget, 15);
  assert.equal(result.projectedBalance, 25000);
  assert.equal(result.realAnnualGrowthPercent, 0);
});

test('uses the exact real annual growth relation instead of simply subtracting inflation', () => {
  const result = calculateFireTarget({ annualSpending: 40000, withdrawalRatePercent: 4, expectedAnnualReturnPercent: 7, inflationPercent: 3 });
  assert.ok(Math.abs(result.realAnnualGrowthPercent - (((1.07 / 1.03) - 1) * 100)) < 1e-12);
});

test('reports an unreachable target when a no-growth projection has no contributions', () => {
  const result = calculateFireTarget({ annualSpending: 40000, withdrawalRatePercent: 4, currentPortfolio: 10000, monthlyContribution: 0, expectedAnnualReturnPercent: 0, inflationPercent: 0 });
  assert.equal(result.monthsToTarget, null);
  assert.equal(result.yearsToTarget, null);
});

test('rejects blank, negative, out-of-range and non-finite inputs', () => {
  for (const input of [
    { annualSpending: '', withdrawalRatePercent: 4 },
    { annualSpending: -1, withdrawalRatePercent: 4 },
    { annualSpending: 40000, withdrawalRatePercent: 0 },
    { annualSpending: 40000, withdrawalRatePercent: 101 },
    { annualSpending: 40000, withdrawalRatePercent: 4, monthlyContribution: -1 },
    { annualSpending: 40000, withdrawalRatePercent: 4, expectedAnnualReturnPercent: 101 },
    { annualSpending: 40000, withdrawalRatePercent: 4, inflationPercent: -100 },
    { annualSpending: 40000, withdrawalRatePercent: 4, inflationPercent: Infinity },
  ]) assert.throws(() => calculateFireTarget(input), RangeError);
});
