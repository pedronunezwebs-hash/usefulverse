import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMortgagePoints } from './logic.mjs';

const compare = (overrides = {}) => calculateMortgagePoints({ principal: 200000, termMonths: 360, rateWithoutPoints: 7, rateWithPoints: 6.75, pointsPercent: 1, horizonMonths: 60, ...overrides });

test('compares point cost, scheduled payments, amortized balances and lifetime interest', () => {
  const result = compare();
  assert.equal(result.upfrontCost, 2000);
  assert.ok(result.paymentWithPoints < result.paymentWithoutPoints);
  assert.ok(result.monthlyPaymentSavings > 0);
  assert.ok(result.balanceWithPointsAtHorizon < result.balanceWithoutPointsAtHorizon);
  assert.ok(result.lifetimeInterestSavings > 0);
  assert.equal(result.horizonMonths, 60);
  assert.ok(Number.isFinite(result.netBenefitAtHorizon));
  assert.ok(result.netBreakEvenMonth > 0);
});

test('positive point cost with no payment or interest savings has no break-even', () => {
  const result = compare({ rateWithPoints: 7, pointsPercent: 1 });
  assert.equal(result.monthlyPaymentSavings, 0);
  assert.equal(result.lifetimeInterestSavings, 0);
  assert.equal(result.paymentOnlyBreakEvenMonths, null);
  assert.equal(result.netBreakEvenMonth, null);
  assert.equal(result.netBenefitAtHorizon, -2000);
});

test('zero-rate amortization and zero-cost points remain finite', () => {
  const result = compare({ principal: 12000, termMonths: 12, rateWithoutPoints: 0, rateWithPoints: 0, pointsPercent: 0, horizonMonths: 12 });
  assert.equal(result.paymentWithoutPoints, 1000);
  assert.equal(result.paymentWithPoints, 1000);
  assert.equal(result.paymentOnlyBreakEvenMonths, 0);
  assert.equal(result.netBreakEvenMonth, 0);
  assert.equal(result.netBenefitAtHorizon, 0);
});

test('the comparison horizon accepts zero and is capped by the selected term', () => {
  assert.equal(compare({ horizonMonths: 0 }).netBenefitAtHorizon, -2000);
  assert.equal(compare({ termMonths: 24, horizonMonths: 60 }).horizonMonths, 24);
});

test('rejects impossible rates, invalid ranges and non-finite inputs', () => {
  assert.throws(() => compare({ rateWithPoints: 7.1 }), /cannot be higher/u);
  assert.throws(() => compare({ termMonths: 0 }));
  assert.throws(() => compare({ principal: 'Infinity' }));
  assert.throws(() => compare({ rateWithoutPoints: 101 }));
  assert.throws(() => compare({ pointsPercent: -1 }));
  assert.equal(compare({ horizonMonths: 361 }).horizonMonths, 360);
});
