import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateReverseMortgage } from './logic.mjs';

test('zero advance and zero interest preserve the opening balance', () => {
  const result = calculateReverseMortgage({ startingBalance: 10000, years: 10 });
  assert.equal(result.endingBalance, 10000);
  assert.equal(result.interestAccrued, 0);
  assert.equal(result.totalAdvances, 0);
});

test('adds financed upfront fees at month zero and monthly draws after interest', () => {
  const result = calculateReverseMortgage({ startingBalance: 10000, upfrontFees: 500, monthlyAdvance: 100, monthlyFee: 30, annualRatePercent: 6, years: 1 });
  assert.equal(result.startingBalance, 10500);
  assert.ok(Math.abs(result.schedule[1].balance - (10500 * (1.005 ** 12) + 130 * ((1.005 ** 12 - 1) / 0.005))) < 1e-9);
  assert.equal(result.totalAdvances, 1200);
  assert.equal(result.totalMonthlyFees, 360);
});

test('projects simple home value scenario and reports estimated equity transparently', () => {
  const result = calculateReverseMortgage({ startingBalance: 50000, years: 2, homeValue: 200000, annualHomeChangePercent: 5 });
  assert.equal(result.projectedHomeValue, 220500);
  assert.equal(result.estimatedEquity, 170500);
  assert.deepEqual(result.schedule.map(({ month }) => month), [0, 12, 24]);
});

test('supports zero months and validates ranges, blanks, and overflow', () => {
  assert.equal(calculateReverseMortgage({ startingBalance: 10000, years: 0 }).endingBalance, 10000);
  for (const patch of [
    { startingBalance: '' }, { startingBalance: -1 }, { years: 51 }, { annualRatePercent: 101 },
    { annualHomeChangePercent: -101 }, { years: 1, startingBalance: 1e10, annualRatePercent: 100 },
  ]) assert.throws(() => calculateReverseMortgage({ startingBalance: 100, years: 1, ...patch }), RangeError);
});
