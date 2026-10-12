import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateDividendProjection, DIVIDEND_CALCULATOR_LIMITS } from './logic.mjs';

test('calculates annual dividend income, payout amount and both yield views', () => {
  const result = calculateDividendProjection({ shares: 100, sharePrice: 40, annualDividendPerShare: 2, paymentsPerYear: 4, years: 1 });
  assert.equal(result.startingInvestment, 4_000);
  assert.equal(result.currentAnnualIncome, 200);
  assert.equal(result.currentIncomePerPayment, 50);
  assert.equal(result.currentYield, 5);
  assert.equal(result.yieldOnCost, 5);
  assert.equal(result.projectedAnnualIncome, 200);
  assert.equal(result.projectedPortfolioValue, 4_000);
});

test('models growing dividends and share price without dividend reinvestment', () => {
  const result = calculateDividendProjection({ shares: 10, sharePrice: 50, annualDividendPerShare: 2, paymentsPerYear: 1, dividendGrowthPercent: 10, priceGrowthPercent: 5, years: 2 });
  assert.equal(result.currentAnnualIncome, 20);
  assert.ok(Math.abs(result.projectedAnnualIncome - 24.2) < 1e-10);
  assert.ok(Math.abs(result.projectedSharePrice - 55.125) < 1e-10);
  assert.equal(result.annualRows[0].incomePaid, 20);
  assert.equal(result.totalReinvested, 0);
});

test('reinvests each payout into fractional shares at that payment price', () => {
  const result = calculateDividendProjection({ shares: 100, sharePrice: 10, annualDividendPerShare: 1, paymentsPerYear: 4, years: 1, reinvestDividends: true });
  assert.ok(Math.abs(result.projectedShares - 110.381) < 0.001);
  assert.ok(result.totalReinvested > 100, 'fractional share purchases also receive later quarterly payouts');
  assert.equal(result.annualRows[0].incomePaid, 0);
});

test('accepts zero dividend and bounded horizon, rejects unsafe or ambiguous inputs', () => {
  const zero = calculateDividendProjection({ shares: 1, sharePrice: 2, annualDividendPerShare: 0, paymentsPerYear: 12, years: 50 });
  assert.equal(zero.projectedAnnualIncome, 0);
  assert.equal(zero.annualRows.length, 50);
  assert.throws(() => calculateDividendProjection({ shares: 0, sharePrice: 2, annualDividendPerShare: 1 }), /Shares/);
  assert.throws(() => calculateDividendProjection({ shares: 10, sharePrice: 0, annualDividendPerShare: 1 }), /Share price/);
  assert.throws(() => calculateDividendProjection({ shares: 10, sharePrice: 1, annualDividendPerShare: 1, paymentsPerYear: 3 }), /Choose annual/);
  assert.throws(() => calculateDividendProjection({ shares: 10, sharePrice: 1, annualDividendPerShare: 1, years: 0 }), /Projection years/);
  assert.throws(() => calculateDividendProjection({ shares: 10, sharePrice: 1, annualDividendPerShare: 1, dividendGrowthPercent: -100 }), /Dividend growth/);
  assert.deepEqual(DIVIDEND_CALCULATOR_LIMITS, { maxShares: 1_000_000_000, maxSharePrice: 1_000_000_000, maxYears: 50, maxGrowthPercent: 1_000 });
});
