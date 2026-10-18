import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateNorwayChildSupport, norwayChildSupportRates2026 } from './norway-child-support.mjs';

test('2026 reference figures have a visible effective date and official NAV/Lovdata source', () => {
  assert.equal(norwayChildSupportRates2026.effectiveFrom, '2026-07-01');
  assert.deepEqual(norwayChildSupportRates2026.consumptionMonthlyNok, [5870, 7523, 8789, 9764]);
  assert.equal(norwayChildSupportRates2026.housingMonthlyNok, 3811);
  assert.equal(norwayChildSupportRates2026.ordinaryChildBenefitMonthlyNok, 2012);
  assert.equal(norwayChildSupportRates2026.visitationMonthlyNok[0][4], 4078);
});

test('one-home estimate uses age cost, housing, child benefit, income share and visitation class', () => {
  const result = estimateNorwayChildSupport({ ageBand: 1, payerAnnualIncomeNok: 600000, otherParentAnnualIncomeNok: 400000, visitationClass: 2 });
  assert.equal(result.maintenanceCostMonthlyNok, 7523 + 3811 - 2012);
  assert.equal(result.payerIncomeShare, 0.6);
  assert.equal(result.visitationCreditMonthlyNok, 1690);
  assert.equal(result.unroundedEstimateMonthlyNok, 3903.2);
  assert.equal(result.monthlyEstimateNok, 3900);
});

test('care costs are user supplied and the scenario stays below both statutory caps', () => {
  const result = estimateNorwayChildSupport({ ageBand: 3, payerAnnualIncomeNok: 1000000, otherParentAnnualIncomeNok: 300000, childcareMonthlyNok: 800, childBenefitMonthlyNok: 0 });
  assert.equal(result.maintenanceCostMonthlyNok, 9764 + 3811 + 800);
  assert.ok(result.amountBeforeVisitationMonthlyNok <= result.uncappedShareMonthlyNok);
  assert.ok(result.amountBeforeVisitationMonthlyNok <= result.incomeCapMonthlyNok);
  assert.ok(result.amountBeforeVisitationMonthlyNok <= result.costCapMonthlyNok);
});

test('shared residence offsets equal halves by the income ratio and skips visitation credit', () => {
  const result = estimateNorwayChildSupport({ ageBand: 0, payerAnnualIncomeNok: 600000, otherParentAnnualIncomeNok: 400000, residence: 'shared', visitationClass: 4 });
  const cost = 5870 + 3811 - 2012;
  assert.ok(Math.abs(result.uncappedShareMonthlyNok - cost * 0.1) < 1e-9);
  assert.equal(result.payer, 'payer');
  assert.equal(result.visitationCreditMonthlyNok, 0);
  const reversed = estimateNorwayChildSupport({ ageBand: 0, payerAnnualIncomeNok: 400000, otherParentAnnualIncomeNok: 600000, residence: 'shared' });
  assert.equal(reversed.payer, 'otherParent');
  assert.equal(reversed.monthlyEstimateNok, result.monthlyEstimateNok);
});

test('visitation credit cannot make the monthly estimate negative', () => {
  const result = estimateNorwayChildSupport({ ageBand: 0, payerAnnualIncomeNok: 500000, otherParentAnnualIncomeNok: 500000, visitationClass: 4 });
  assert.equal(result.monthlyEstimateNok, 0);
});

test('invalid bands, income, custody and visitation classes are rejected', () => {
  assert.throws(() => estimateNorwayChildSupport({ ageBand: 4, payerAnnualIncomeNok: 100, otherParentAnnualIncomeNok: 100 }), /age bands/u);
  assert.throws(() => estimateNorwayChildSupport({ ageBand: 0, payerAnnualIncomeNok: 0, otherParentAnnualIncomeNok: 0 }), /positive annual income/u);
  assert.throws(() => estimateNorwayChildSupport({ ageBand: 0, payerAnnualIncomeNok: 100, otherParentAnnualIncomeNok: 100, visitationClass: 5 }), /from 0 to 4/u);
  assert.throws(() => estimateNorwayChildSupport({ ageBand: 0, payerAnnualIncomeNok: 100, otherParentAnnualIncomeNok: 100, residence: 'international' }), /residence/u);
});
