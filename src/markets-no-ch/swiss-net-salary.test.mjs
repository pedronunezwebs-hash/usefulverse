import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSwissNetSalary, swissPayrollRules2026 } from './swiss-net-salary.mjs';

test('2026 employee rates and ALV ceiling calculate separately from annual gross', () => {
  const result = calculateSwissNetSalary({ grossPerPayPeriod: 12_000, paymentsPerYear: 13 });
  assert.equal(result.annualGross, 156_000);
  assert.equal(result.ahvIvEo, 8_268);
  assert.equal(result.unemploymentBase, 148_200);
  assert.equal(result.unemployment, 1_630.2);
  assert.equal(result.employerAhvIvEo, 8_268);
  assert.equal(result.employerUnemployment, 1_630.2);
  assert.equal(result.totalKnownDeductions, result.ahvIvEo + result.unemployment);
  assert.equal(result.annualNet, 146_101.8);
});

test('12 and 13 payments use the same annual salary basis and split it by payment count', () => {
  const monthly = calculateSwissNetSalary({ grossPerPayPeriod: 10_000, paymentsPerYear: 12 });
  const thirteenth = calculateSwissNetSalary({ grossPerPayPeriod: 120_000 / 13, paymentsPerYear: 13 });
  assert.equal(monthly.annualGross, 120_000);
  assert.equal(thirteenth.annualGross, 120_000);
  assert.equal(monthly.ahvIvEo, thirteenth.ahvIvEo);
  assert.equal(monthly.unemployment, thirteenth.unemployment);
  assert.equal(thirteenth.averageNetPerPayment, Math.round(monthly.annualNet / 13 * 100) / 100);
});

test('plan-dependent deductions and source tax are passed in as annual amounts', () => {
  const result = calculateSwissNetSalary({ grossPerPayPeriod: 8_000, paymentsPerYear: 13, pensionDeductionAnnual: 9_000, accidentDeductionAnnual: 800, sourceTaxAnnual: 4_200, otherDeductionsAnnual: 100 });
  assert.equal(result.pension, 9_000);
  assert.equal(result.accident, 800);
  assert.equal(result.sourceTax, 4_200);
  assert.equal(result.annualNet, 83_244);
});

test('under contribution age and post-reference-age allowance scenarios are explicit', () => {
  const underAge = calculateSwissNetSalary({ grossPerPayPeriod: 5_000, contributionStatus: 'underContributionAge' });
  assert.equal(underAge.ahvIvEo, 0);
  assert.equal(underAge.unemployment, 0);
  const postReference = calculateSwissNetSalary({ grossPerPayPeriod: 5_000, contributionStatus: 'postReferenceAge', postReferenceAgeAllowance: true });
  assert.equal(postReference.ahvAllowance, 16_800);
  assert.equal(postReference.ahvIvEo, Math.round((60_000 - 16_800) * 0.053 * 100) / 100);
  assert.equal(postReference.unemployment, 0);
});

test('invalid salary, ages, payment schedule, statuses and excessive deductions are rejected', () => {
  assert.throws(() => calculateSwissNetSalary({ grossPerPayPeriod: -1 }), RangeError);
  assert.throws(() => calculateSwissNetSalary({ grossPerPayPeriod: 1, paymentsPerYear: 14 }), RangeError);
  assert.throws(() => calculateSwissNetSalary({ grossPerPayPeriod: 1, age: 17.5 }), RangeError);
  assert.throws(() => calculateSwissNetSalary({ grossPerPayPeriod: 1, contributionStatus: 'unknown' }), TypeError);
  assert.throws(() => calculateSwissNetSalary({ grossPerPayPeriod: 1_000, sourceTaxAnnual: 20_000 }), RangeError);
  assert.equal(swissPayrollRules2026.unemploymentAnnualCap, 148_200);
});
