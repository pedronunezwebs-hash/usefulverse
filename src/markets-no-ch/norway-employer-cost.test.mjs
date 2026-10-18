import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateNorwayEmployerCost, norwayEmployerCostRates2026 } from './norway-employer-cost.mjs';

test('2026 Norwegian zone rates match the official ordinary and agriculture/fishing schedule', () => {
  assert.deepEqual(Object.fromEntries(Object.entries(norwayEmployerCostRates2026.zones).map(([zone, rates]) => [zone, [rates.ordinary, rates.agricultureFishing]])), {
    I: [14.1, 14.1], Ia: [14.1, 10.6], II: [10.6, 10.6], III: [6.4, 6.4], IV: [5.1, 5.1], IVa: [7.9, 5.1], V: [0, 0],
  });
  assert.equal(norwayEmployerCostRates2026.zones.Ia.allowanceNok, 850000);
});

test('annual estimate includes holiday pay, pension and taxable pay in the employer contribution basis', () => {
  const result = estimateNorwayEmployerCost({
    annualPayrollNok: 1000000, holidayPayBaseNok: 1000000, holidayPayRatePct: 12,
    taxableOtherPayNok: 50000, pensionablePayrollNok: 1000000, pensionRatePct: 2,
    zone: 'I',
  });
  assert.equal(result.holidayPayNok, 120000);
  assert.equal(result.pensionContributionNok, 20000);
  assert.equal(result.contributionBasisNok, 1190000);
  assert.equal(result.employerContributionNok, 167790);
  assert.equal(result.totalEmployerCostNok, 1357790);
  assert.equal(result.costPerMonthNok, 1357790 / 12);
});

test('zone Ia ordinary activity consumes only remaining per-enterprise differential allowance', () => {
  const result = estimateNorwayEmployerCost({ annualPayrollNok: 30000000, holidayPayBaseNok: 0, zone: 'Ia', differentialAllowanceUsedNok: 500000 });
  const reducedBasis = 350000 / 0.035;
  assert.ok(Math.abs(result.reducedBasisNok - reducedBasis) < 1e-7);
  assert.ok(Math.abs(result.allowanceConsumedNok - 350000) < 1e-7);
  assert.ok(Math.abs(result.employerContributionNok - (reducedBasis * 0.106 + (30000000 - reducedBasis) * 0.141)) < 1e-7);
});

test('zone Ia agriculture/fishing uses its listed rate and does not apply the ordinary-activity allowance rule', () => {
  const result = estimateNorwayEmployerCost({ annualPayrollNok: 1000000, holidayPayBaseNok: 0, zone: 'Ia', sector: 'agricultureFishing', differentialAllowanceUsedNok: 0 });
  assert.equal(result.headlineRatePct, 10.6);
  assert.equal(result.employerContributionNok, 106000);
  assert.equal(result.allowanceConsumedNok, 0);
});

test('invalid zones, activities, negative or excessive amounts and rates are rejected', () => {
  assert.throws(() => estimateNorwayEmployerCost({ annualPayrollNok: 100, zone: 'IIIa' }), /zone/u);
  assert.throws(() => estimateNorwayEmployerCost({ annualPayrollNok: 100, sector: 'retail' }), /activity/u);
  assert.throws(() => estimateNorwayEmployerCost({ annualPayrollNok: -1 }), /Annual payroll/u);
  assert.throws(() => estimateNorwayEmployerCost({ annualPayrollNok: 100, pensionRatePct: 50 }), /Pension rate/u);
  assert.throws(() => estimateNorwayEmployerCost({ annualPayrollNok: 100, zone: 'Ia', differentialAllowanceUsedNok: 850001 }), /Differential allowance/u);
});
