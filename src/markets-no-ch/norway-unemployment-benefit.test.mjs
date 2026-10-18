import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNorwayUnemploymentBenefit, norwayUnemploymentBenefitRules2026 } from './norway-unemployment-benefit.mjs';

const base = {
  minimumIncomeLast12MonthsNok: 500000,
  minimumIncomeLast36MonthsNok: 1500000,
  benefitIncomeLast12MonthsNok: 500000,
  benefitIncomeLast36MonthsNok: 1500000,
  durationIncomeLast12MonthsNok: 500000,
  durationIncomeLast36MonthsNok: 1500000,
};

test('2026 official rate constants match NAV basic amount and 6G cap', () => {
  assert.equal(norwayUnemploymentBenefitRules2026.basicAmountNok, 136549);
  assert.equal(norwayUnemploymentBenefitRules2026.maximumBasisNok, 819294);
});

test('benefit amount chooses the better of 12-month basis and 36-month annual average', () => {
  const result = calculateNorwayUnemploymentBenefit({ ...base, benefitIncomeLast12MonthsNok: 180000, benefitIncomeLast36MonthsNok: 900000 });
  assert.equal(result.averageBenefitIncome36MonthsNok, 300000);
  assert.equal(result.selectedBenefitIncomeNok, 300000);
});

test('minimum-income eligibility and duration use their own separate NAV income bases', () => {
  const result = calculateNorwayUnemploymentBenefit({
    ...base,
    minimumIncomeLast12MonthsNok: 204824,
    minimumIncomeLast36MonthsNok: 0,
    benefitIncomeLast12MonthsNok: 0,
    benefitIncomeLast36MonthsNok: 0,
    durationIncomeLast12MonthsNok: 100000,
    durationIncomeLast36MonthsNok: 0,
  });
  assert.equal(result.qualifiesIncomeThreshold, true);
  assert.equal(result.durationWeeks, 52);
  assert.equal(result.benefitBasisNok, 0);
});

test('caps the benefit basis at 6G and calculates daily, weekly and monthly amounts', () => {
  const result = calculateNorwayUnemploymentBenefit({ ...base, benefitIncomeLast12MonthsNok: 1200000, benefitIncomeLast36MonthsNok: 3600000 });
  assert.equal(result.benefitBasisNok, 819294);
  assert.equal(result.basisCappedAt6G, true);
  assert.equal(result.dailyBasicEstimateNok, 819294 * 0.624 / 260);
  assert.equal(result.monthlyEquivalentEstimateNok, 819294 * 0.624 / 12);
});

test('models proportional work-hour loss and the child supplement separately', () => {
  const result = calculateNorwayUnemploymentBenefit({ ...base, workHoursLostPct: 60, supportedEligibleChildren: 2 });
  assert.equal(result.dailyChildSupplementNok, 76);
  assert.equal(result.dailyBasicEstimateNok, 500000 * 0.624 / 260 * 0.6);
  assert.equal(result.weeklyEstimateNok, (result.dailyBasicEstimateNok + 76) * 5);
});

test('duration uses the best of its own 12-month basis and 36-month annual average', () => {
  const below = calculateNorwayUnemploymentBenefit({ ...base, durationIncomeLast12MonthsNok: 273097, durationIncomeLast36MonthsNok: 0 });
  const aboveBy36MonthAverage = calculateNorwayUnemploymentBenefit({ ...base, durationIncomeLast12MonthsNok: 0, durationIncomeLast36MonthsNok: 819294 });
  assert.equal(below.durationWeeks, 52);
  assert.equal(aboveBy36MonthAverage.durationWeeks, 104);
});

test('recent military exception compares 3G with the benefit-amount 12-month income only', () => {
  const military = calculateNorwayUnemploymentBenefit({
    ...base,
    benefitIncomeLast12MonthsNok: 250000,
    benefitIncomeLast36MonthsNok: 1500000,
    recentlyDischargedMilitary: true,
    militaryServiceMonths: 3,
  });
  assert.equal(military.benefitBasisNok, 409647);
  assert.equal(military.durationWeeks, 26);
});

test('eligibility conditions remain self-reported and never become a NAV decision', () => {
  const result = calculateNorwayUnemploymentBenefit({
    ...base,
    minimumIncomeLast12MonthsNok: 0,
    minimumIncomeLast36MonthsNok: 0,
    workHoursLostPct: 50,
  });
  assert.equal(result.qualifiesIncomeThreshold, false);
  assert.deepEqual(result.missingSelfReportedConditions, ['incomeThreshold', 'under67', 'norwegianResidenceAndInsurance', 'registeredAndGenuineJobSeeker']);
});

test('rejects invalid hours, fractions of a child and invalid flags', () => {
  assert.throws(() => calculateNorwayUnemploymentBenefit({ ...base, workHoursLostPct: 49 }), /50%/u);
  assert.throws(() => calculateNorwayUnemploymentBenefit({ ...base, supportedEligibleChildren: 1.5 }), /whole|valid/u);
  assert.throws(() => calculateNorwayUnemploymentBenefit({ ...base, under67: 'yes' }), /true or false/u);
});
