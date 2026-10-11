import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate529Plan } from './logic.mjs';

const base = { currentSavings: 0, monthlyContribution: 0, yearsUntilCollege: 0, annualCostToday: 10_000, collegeYears: 1, tuitionInflationPercent: 0, annualReturnPercent: 0, scholarshipPerYear: 0 };

test('zero years means the target is needed now and returns no monthly contribution estimate', () => {
  const result = calculate529Plan(base);
  assert.equal(result.targetAtEnrollment, 10_000);
  assert.equal(result.amountNeededNow, 10_000);
  assert.equal(result.monthlyContributionNeeded, null);
});

test('inflates each academic year and caps the scholarship at that year tuition', () => {
  const result = calculate529Plan({ ...base, yearsUntilCollege: 2, collegeYears: 2, tuitionInflationPercent: 10, scholarshipPerYear: 12_000 });
  const expected = [[12_100, 12_000, 100], [13_310, 12_000, 1_310]];
  result.projectedCosts.forEach(({ gross, scholarship, net }, index) => {
    [gross, scholarship, net].forEach((value, column) => assert.ok(Math.abs(value - expected[index][column]) < 1e-8));
  });
  assert.ok(Math.abs(result.targetAtEnrollment - 1_410) < 1e-8);
});

test('discounts later study years to the enrollment date using the assumed annual return', () => {
  const result = calculate529Plan({ ...base, yearsUntilCollege: 5, collegeYears: 2, annualCostToday: 10_000, annualReturnPercent: 10 });
  assert.ok(Math.abs(result.targetAtEnrollment - (10_000 + 10_000 / 1.1)) < 1e-8);
});

test('solves the required end-of-month contribution and respects existing balance', () => {
  const noGrowth = calculate529Plan({ ...base, yearsUntilCollege: 10, annualCostToday: 12_000, collegeYears: 1 });
  assert.equal(noGrowth.monthlyContributionNeeded, 100);
  const balanced = calculate529Plan({ ...base, yearsUntilCollege: 10, annualCostToday: 12_000, collegeYears: 1, currentSavings: 12_000 });
  assert.equal(balanced.monthlyContributionNeeded, 0);
});

test('monthly deposits and savings compound at a monthly equivalent of the annual effective rate', () => {
  const result = calculate529Plan({ ...base, currentSavings: 1_000, monthlyContribution: 100, yearsUntilCollege: 1, annualCostToday: 0, annualReturnPercent: 12 });
  const monthly = 1.12 ** (1 / 12) - 1;
  assert.ok(Math.abs(result.projectedSavings - (1_000 * 1.12 + 100 * ((1 + monthly) ** 12 - 1) / monthly)) < 1e-8);
});

test('returns reject invalid rates, ranges and fractional year counts', () => {
  assert.throws(() => calculate529Plan({ ...base, tuitionInflationPercent: -1 }), RangeError);
  assert.throws(() => calculate529Plan({ ...base, annualReturnPercent: 31 }), RangeError);
  assert.throws(() => calculate529Plan({ ...base, yearsUntilCollege: 1.5 }), RangeError);
  assert.throws(() => calculate529Plan({ ...base, collegeYears: 0 }), RangeError);
  assert.throws(() => calculate529Plan({ ...base, scholarshipPerYear: -5 }), RangeError);
  assert.throws(() => calculate529Plan({ ...base, annualCostToday: '' }), RangeError);
  assert.throws(() => calculate529Plan({ ...base, annualCostToday: null }), RangeError);
  assert.throws(() => calculate529Plan({ ...base, yearsUntilCollege: true }), RangeError);
});
