import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateSavingsGoal } from './logic.mjs';

test('required contribution reaches a 1,200 target in 12 months with no interest', () => {
  const result = calculateSavingsGoal({ mode: 'required-contribution', startingBalance: 0, targetAmount: 1_200, annualRatePercent: 0, months: 12 });
  assert.equal(result.requiredMonthlyContribution, 100);
  assert.equal(result.projectedBalance, 1_200);
  assert.equal(result.totalContributions, 1_200);
  assert.equal(result.estimatedInterest, 0);
});

test('months-to-goal returns the first month the balance reaches the target', () => {
  const result = calculateSavingsGoal({ mode: 'months-to-goal', startingBalance: 0, targetAmount: 1_200, annualRatePercent: 0, monthlyContribution: 100 });
  assert.equal(result.months, 12);
  assert.equal(result.projectedBalance, 1_200);
  const previousMonth = calculateSavingsGoal({ mode: 'months-to-goal', startingBalance: 0, targetAmount: 1_100, annualRatePercent: 0, monthlyContribution: 100 });
  assert.equal(previousMonth.months, 11);
  assert.ok(previousMonth.projectedBalance < 1_200);
});

test('monthly compounding and beginning-of-month deposits are distinguished', () => {
  const end = calculateSavingsGoal({ mode: 'required-contribution', startingBalance: 0, targetAmount: 12_000, annualRatePercent: 12, months: 12, contributionTiming: 'end' });
  const beginning = calculateSavingsGoal({ mode: 'required-contribution', startingBalance: 0, targetAmount: 12_000, annualRatePercent: 12, months: 12, contributionTiming: 'beginning' });
  assert.ok(beginning.requiredMonthlyContribution < end.requiredMonthlyContribution);
  assert.ok(end.estimatedInterest > 0);
});

test('an existing balance that grows past the target requires no contribution', () => {
  const result = calculateSavingsGoal({ mode: 'required-contribution', startingBalance: 1_000, targetAmount: 1_050, annualRatePercent: 12, months: 12 });
  assert.equal(result.requiredMonthlyContribution, 0);
  assert.equal(result.goalAlreadyReachedByDeadline, true);
});

test('zero contribution with no interest reports that the goal cannot be reached', () => {
  const result = calculateSavingsGoal({ mode: 'months-to-goal', startingBalance: 50, targetAmount: 100, annualRatePercent: 0, monthlyContribution: 0 });
  assert.equal(result.months, null);
});

test('horizons beyond the 100-year limit are reported instead of implying a finite answer', () => {
  const result = calculateSavingsGoal({ mode: 'months-to-goal', startingBalance: 0, targetAmount: 100, annualRatePercent: 0, monthlyContribution: 0.001 });
  assert.equal(result.months, null);
  assert.equal(result.horizonCapped, true);
  assert.equal(result.unreachable, false);
  assert.equal(result.projectedBalance, 1.2);
});

test('invalid input ranges and unsupported modes fail instead of producing misleading estimates', () => {
  assert.throws(() => calculateSavingsGoal({ startingBalance: -1, targetAmount: 100, months: 12 }), /Starting balance/u);
  assert.throws(() => calculateSavingsGoal({ startingBalance: 0, targetAmount: 100, annualRatePercent: 101, months: 12 }), /Annual rate/u);
  assert.throws(() => calculateSavingsGoal({ startingBalance: 0, targetAmount: 100, months: 0 }), /Months/u);
  assert.throws(() => calculateSavingsGoal({ mode: 'unknown', startingBalance: 0, targetAmount: 100 }), /goal mode/u);
});
