/** Official Norwegian child-support reference amounts, effective 1 July 2026. */
export const norwayChildSupportRates2026 = Object.freeze({
  rulesYear: 2026,
  effectiveFrom: '2026-07-01',
  checkedAt: '2026-10-17',
  source: 'https://lovdata.no/nav/rundskriv/v1-55-02',
  navGuidance: 'https://www.nav.no/barnebidrag',
  consumptionMonthlyNok: Object.freeze([5870, 7523, 8789, 9764]),
  housingMonthlyNok: 3811,
  ordinaryChildBenefitMonthlyNok: 2012,
  visitationMonthlyNok: Object.freeze([
    Object.freeze([0, 386, 1277, 3249, 4078]),
    Object.freeze([0, 510, 1690, 3825, 4801]),
    Object.freeze([0, 627, 2078, 4366, 5481]),
    Object.freeze([0, 696, 2306, 4684, 5880]),
  ]),
  maxCostShare: 5 / 6,
  maxIncomeShare: 0.25,
});

const finite = (value, name, { min = 0, max = 100000000 } = {}) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} must be from ${min} to ${max}.`);
  return number;
};

/**
 * Creates a simplified one-child Norwegian private-agreement scenario.
 * It does not model NAV's full income definition, documented child-care relief,
 * capacity-to-pay deductions, child income, multiple-child allocation or cross-border cases.
 */
export function estimateNorwayChildSupport({
  ageBand = 0,
  payerAnnualIncomeNok,
  otherParentAnnualIncomeNok,
  childcareMonthlyNok = 0,
  childBenefitMonthlyNok = norwayChildSupportRates2026.ordinaryChildBenefitMonthlyNok,
  residence = 'oneHome',
  visitationClass = 0,
} = {}) {
  const rates = norwayChildSupportRates2026;
  if (!Number.isInteger(ageBand) || ageBand < 0 || ageBand > 3) throw new RangeError('Choose one of the four age bands.');
  if (!['oneHome', 'shared'].includes(residence)) throw new RangeError('Choose one primary home or shared residence.');
  if (!Number.isInteger(visitationClass) || visitationClass < 0 || visitationClass > 4) throw new RangeError('Visitation class must be from 0 to 4.');
  const payerAnnual = finite(payerAnnualIncomeNok, 'Payer income');
  const otherAnnual = finite(otherParentAnnualIncomeNok, 'Other parent income');
  const childcare = finite(childcareMonthlyNok, 'Eligible childcare amount');
  const childBenefit = finite(childBenefitMonthlyNok, 'Ordinary child benefit', { max: 1000000 });
  const totalIncome = payerAnnual + otherAnnual;
  if (totalIncome <= 0) throw new RangeError('Enter a positive annual income for at least one parent.');

  const consumption = rates.consumptionMonthlyNok[ageBand];
  const housing = rates.housingMonthlyNok;
  const costBeforeBenefit = consumption + housing + childcare;
  const maintenanceCost = Math.max(0, costBeforeBenefit - childBenefit);
  const payerIncomeShare = payerAnnual / totalIncome;
  const otherIncomeShare = otherAnnual / totalIncome;
  let uncappedShare;
  let payer = 'payer';
  if (residence === 'shared') {
    const higherShare = Math.max(payerIncomeShare, otherIncomeShare);
    payer = payerIncomeShare === otherIncomeShare ? 'equal' : payerIncomeShare > otherIncomeShare ? 'payer' : 'otherParent';
    uncappedShare = Math.max(0, (higherShare - 0.5) * maintenanceCost);
  } else {
    uncappedShare = payerIncomeShare * maintenanceCost;
  }
  const costCap = maintenanceCost * rates.maxCostShare;
  const incomeCapAnnual = residence === 'shared' ? Math.max(payerAnnual, otherAnnual) : payerAnnual;
  const incomeCap = incomeCapAnnual * rates.maxIncomeShare / 12;
  const beforeVisitation = Math.min(uncappedShare, costCap, incomeCap);
  const visitationCredit = residence === 'oneHome' ? rates.visitationMonthlyNok[ageBand][visitationClass] : 0;
  const unroundedEstimate = Math.max(0, beforeVisitation - visitationCredit);
  const monthlyEstimate = Math.max(0, Math.round(unroundedEstimate / 10) * 10);
  return Object.freeze({
    rulesYear: rates.rulesYear,
    effectiveFrom: rates.effectiveFrom,
    checkedAt: rates.checkedAt,
    ageBand,
    residence,
    payer,
    consumptionMonthlyNok: consumption,
    housingMonthlyNok: housing,
    childcareMonthlyNok: childcare,
    childBenefitMonthlyNok: childBenefit,
    maintenanceCostMonthlyNok: maintenanceCost,
    payerIncomeShare,
    uncappedShareMonthlyNok: uncappedShare,
    costCapMonthlyNok: costCap,
    incomeCapMonthlyNok: incomeCap,
    amountBeforeVisitationMonthlyNok: beforeVisitation,
    visitationClass: residence === 'oneHome' ? visitationClass : 0,
    visitationCreditMonthlyNok: visitationCredit,
    unroundedEstimateMonthlyNok: unroundedEstimate,
    monthlyEstimateNok: monthlyEstimate,
    annualEstimateNok: monthlyEstimate * 12,
    isSharedResidenceOffset: residence === 'shared',
    notes: Object.freeze([
      'One child at a time; use official NAV guidance for multiple-child capacity allocation.',
      'Income is a simplified user-entered annual gross figure, not NAV’s full income definition or capacity-to-pay calculation.',
      'Childcare is included only as the eligible net monthly amount supplied by the user.',
      'No visitation discount is applied for shared residence.',
    ]),
  });
}
