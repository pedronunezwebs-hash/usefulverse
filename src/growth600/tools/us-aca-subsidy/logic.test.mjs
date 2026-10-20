import test from 'node:test';
import assert from 'node:assert/strict';
import { acaApplicablePercentage, estimateAcaPremiumTaxCredit, getAcaFpl } from './logic.mjs';

test('uses the 2025 contiguous-state FPL table for 2026 coverage and adds people over eight', () => {
  assert.equal(getAcaFpl(1, 'contiguous'), 15650);
  assert.equal(getAcaFpl(4, 'alaska'), 40190);
  assert.equal(getAcaFpl(9, 'hawaii'), 68630);
});

test('interpolates the 2026 applicable percentage at band boundaries', () => {
  assert.equal(acaApplicablePercentage(100), 2.1);
  assert.equal(acaApplicablePercentage(133), 3.14);
  assert.equal(acaApplicablePercentage(141.5), 3.665);
  assert.equal(acaApplicablePercentage(150), 4.19);
  assert.equal(acaApplicablePercentage(300), 9.96);
});

test('estimates annual credit and monthly net premium, capped at the enrollment premium', () => {
  const result = estimateAcaPremiumTaxCredit({
    householdIncome: 23475,
    familySize: 1,
    benchmarkPremium: 9000,
    enrollmentPremium: 8500,
    asOf: '2026-10-20',
  });
  assert.equal(result.fplPercent, 150);
  assert.equal(result.annualCredit, 7516.4);
  assert.equal(result.monthlyCredit, 626.37);
  assert.equal(result.monthlyNetPremium, 81.97);
});

test('does not estimate credit below 100% or above 400% FPL', () => {
  const below = estimateAcaPremiumTaxCredit({ householdIncome: 10000, familySize: 1, benchmarkPremium: 9000, enrollmentPremium: 6000, asOf: '2026-10-20' });
  const above = estimateAcaPremiumTaxCredit({ householdIncome: 70000, familySize: 1, benchmarkPremium: 9000, enrollmentPremium: 6000, asOf: '2026-10-20' });
  assert.equal(below.eligibilityBand, 'belowRange');
  assert.equal(below.annualCredit, 0);
  assert.equal(above.eligibilityBand, 'overRange');
  assert.equal(above.annualCredit, 0);
});

test('rejects invalid values and turns off the dated estimate after review', () => {
  assert.throws(() => estimateAcaPremiumTaxCredit({ householdIncome: 20000, familySize: 1, benchmarkPremium: -1, enrollmentPremium: 6000, asOf: '2026-10-20' }), { code: 'invalid-benchmark-premium' });
  assert.throws(() => estimateAcaPremiumTaxCredit({ householdIncome: 20000, familySize: 1.5, benchmarkPremium: 9000, enrollmentPremium: 6000, asOf: '2026-10-20' }), { code: 'invalid-family-size' });
  assert.throws(() => estimateAcaPremiumTaxCredit({ householdIncome: 20000, familySize: 1, benchmarkPremium: 9000, enrollmentPremium: 6000, asOf: '2027-01-01' }), { code: 'rules-review-due' });
});
