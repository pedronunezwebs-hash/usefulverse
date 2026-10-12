import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateRetirementProjection } from './logic.mjs';

const scenario = (overrides = {}) => calculateRetirementProjection({
  currentAge: 35,
  retirementAge: 65,
  planThroughAge: 90,
  currentSavings: 10000,
  monthlyContribution: 500,
  annualReturnPercent: 6,
  conservativeReturnPercent: 3,
  annualWithdrawal: 30000,
  annualInflationPercent: 2,
  ...overrides,
});

test('projection separates accumulation from retirement and includes end-of-month contributions', () => {
  const result = scenario();
  assert.equal(result.yearsToRetirement, 30);
  assert.equal(result.yearsInRetirement, 25);
  assert.equal(result.totalContributions, 190000);
  assert.ok(result.base.balanceAtRetirement > result.conservative.balanceAtRetirement);
});

test('zero retirement withdrawal never reduces the balance during decumulation', () => {
  const result = scenario({ annualWithdrawal: 0, annualInflationPercent: 0 });
  assert.ok(result.base.endingBalance >= result.base.balanceAtRetirement);
  assert.ok(result.conservative.endingBalance >= result.conservative.balanceAtRetirement);
  assert.equal(result.base.depletedAtAge, null);
});

test('an empty retirement balance is reported as depleted at retirement', () => {
  const result = scenario({ currentSavings: 0, monthlyContribution: 0, annualReturnPercent: 0, conservativeReturnPercent: 0, annualWithdrawal: 12000, annualInflationPercent: 0 });
  assert.equal(result.base.endingBalance, 0);
  assert.equal(result.base.depletedAtAge, 65);
});

test('higher inflation reduces the present purchasing power of the projected retirement balance', () => {
  const lower = scenario({ annualInflationPercent: 0 });
  const higher = scenario({ annualInflationPercent: 5 });
  assert.equal(lower.base.balanceAtRetirement, higher.base.balanceAtRetirement);
  assert.ok(higher.base.balanceAtRetirementInTodayMoney < lower.base.balanceAtRetirementInTodayMoney);
});

test('zero years and no contributions remain mathematically valid', () => {
  const result = scenario({ currentAge: 64, retirementAge: 65, planThroughAge: 66, currentSavings: 0, monthlyContribution: 0, annualReturnPercent: 0, conservativeReturnPercent: 0, annualWithdrawal: 0 });
  assert.equal(result.base.balanceAtRetirement, 0);
  assert.equal(result.base.endingBalance, 0);
});

test('zero withdrawals do not imply that a zero retirement balance contains funds', () => {
  const result = scenario({ currentSavings: 0, monthlyContribution: 0, annualReturnPercent: 0, conservativeReturnPercent: 0, annualWithdrawal: 0 });
  assert.equal(result.base.endingBalance, 0);
  assert.equal(result.base.depletedAtAge, 65);
});

test('rejects fractional ages, inverted horizons, negative money and non-finite inputs', () => {
  assert.throws(() => scenario({ currentAge: 35.5 }), RangeError);
  assert.throws(() => scenario({ retirementAge: 30 }), RangeError);
  assert.throws(() => scenario({ planThroughAge: 65 }), RangeError);
  assert.throws(() => scenario({ currentSavings: -1 }), RangeError);
  assert.throws(() => scenario({ monthlyContribution: Number.NaN }), RangeError);
  assert.throws(() => scenario({ annualInflationPercent: -100 }), RangeError);
  assert.throws(() => scenario({ annualInflationPercent: -20.01 }), RangeError);
  assert.throws(() => scenario({ annualReturnPercent: 101 }), RangeError);
  assert.throws(() => scenario({ annualReturnPercent: 3, conservativeReturnPercent: 6 }), RangeError);
});
