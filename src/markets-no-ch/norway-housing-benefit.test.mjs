import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateNorwayHousingBenefit } from './norway-housing-benefit.mjs';

test('uses the published 2026 standard household, own contribution, cap and coverage formula', () => {
  const result = estimateNorwayHousingBenefit({ monthlyIncomeBasisNok: 0, monthlyApprovedHousingCostsNok: 20000 });
  assert.equal(result.ownContributionAnnualNok, 26576);
  assert.equal(result.annualHousingCapNok, 92234);
  assert.equal(result.approvedHousingCostsUsedMonthlyNok, 92234 / 12);
  assert.equal(result.estimatedMonthlyBenefitNok, 4032);
});

test('applies composition weights, income tiers and municipality cap supplements', () => {
  const result = estimateNorwayHousingBenefit({ monthlyIncomeBasisNok: 30000, monthlyApprovedHousingCostsNok: 20000, adults: 2, minors: 1, municipalityGroup: 'oslo' });
  assert.equal(result.householdWeight, 1.28);
  assert.equal(result.weightedAnnualIncomeNok, 281250);
  assert.ok(result.ownContributionAnnualNok > 26576);
  assert.equal(result.annualHousingCapNok, 125977 + 27982);
  assert.equal(result.approvedHousingCostsUsedMonthlyNok, (125977 + 27982) / 12);
});

test('caps benefit at zero and rejects invalid inputs', () => {
  const result = estimateNorwayHousingBenefit({ monthlyIncomeBasisNok: 100000, monthlyApprovedHousingCostsNok: 1000 });
  assert.equal(result.estimatedMonthlyBenefitNok, 0);
  assert.throws(() => estimateNorwayHousingBenefit({ monthlyIncomeBasisNok: -1, monthlyApprovedHousingCostsNok: 1000 }), RangeError);
  assert.throws(() => estimateNorwayHousingBenefit({ monthlyIncomeBasisNok: 1, monthlyApprovedHousingCostsNok: 1000, adults: 0 }), RangeError);
  assert.throws(() => estimateNorwayHousingBenefit({ monthlyIncomeBasisNok: 1, monthlyApprovedHousingCostsNok: 1000, municipalityGroup: 'unknown' }), RangeError);
});
