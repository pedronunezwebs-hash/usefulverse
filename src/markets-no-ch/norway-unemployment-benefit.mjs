/** Norway's 2026 standard unemployment-benefit estimate. Not an eligibility decision. */
export const norwayUnemploymentBenefitRules2026 = Object.freeze({
  year: 2026,
  ratesAsOf: '2026-10-16',
  effectiveBasicAmountDate: '2026-05-01',
  basicAmountNok: 136549,
  minimumIncome12MonthsNok: 204824,
  minimumIncome36MonthsNok: 409647,
  durationIncomeThresholdNok: 273098,
  maximumBasisNok: 819294,
  replacementRatePct: 62.4,
  childSupplementPerDayNok: 38,
  daysPerYear: 260,
  daysPerWeek: 5,
  deductibleDays: 3,
  ordinaryDurationBelow2GWeeks: 52,
  ordinaryDurationAtOrAbove2GWeeks: 104,
  dischargedMilitaryMinimumBasisNok: 409647,
  dischargedMilitaryDurationWeeks: 26,
  source: 'https://www.nav.no/dagpenger/en',
  calculatorSource: 'https://www.nav.no/dagpenger/kalkulator',
  ratesSource: 'https://www.nav.no/grunnbelopet',
});

const finite = (value, name, { min = 0, max = 1e12 } = {}) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > max) throw new RangeError(`${name} is outside the supported range.`);
  return n;
};

/**
 * Uses the greater of the supplied last-12-month income or annualized last-36-month income,
 * caps the basis at 6G, then estimates NAV's 62.4% daily rate. Self-reported checks are
 * context only; cross-border, fisheries, repeated claims and special cases need NAV.
 */
export function calculateNorwayUnemploymentBenefit({
  incomeLast12MonthsNok,
  incomeLast36MonthsNok,
  workHoursLostPct = 100,
  supportedEligibleChildren = 0,
  under67 = false,
  norwegianResidenceAndInsurance = false,
  registeredAndGenuineJobSeeker = false,
  recentlyDischargedMilitary = false,
  militaryServiceMonths = 0,
} = {}) {
  const rules = norwayUnemploymentBenefitRules2026;
  const income12 = finite(incomeLast12MonthsNok, '12-month income');
  const income36 = finite(incomeLast36MonthsNok, '36-month income');
  const lostPct = finite(workHoursLostPct, 'Lost work-hours percentage', { min: 0, max: 100 });
  const children = finite(supportedEligibleChildren, 'Children', { max: 20 });
  const serviceMonths = finite(militaryServiceMonths, 'Military service months', { max: 60 });
  for (const [value, name] of [[under67, 'Age flag'], [norwegianResidenceAndInsurance, 'Residence and insurance flag'], [registeredAndGenuineJobSeeker, 'Job seeker flag'], [recentlyDischargedMilitary, 'Military discharge flag']]) {
    if (typeof value !== 'boolean') throw new TypeError(`${name} must be true or false.`);
  }
  if (![income12, income36, lostPct, children, serviceMonths].every(Number.isFinite) || !Number.isInteger(children) || !Number.isInteger(serviceMonths)) throw new RangeError('Income, hours, child count and service months must be valid values.');
  if (lostPct < 50) throw new RangeError('At least 50% of normal working hours must be lost for the standard rules modeled here.');

  const average36 = income36 / 3;
  const selectedIncomeNok = Math.max(income12, average36);
  const regularEligibleIncome = selectedIncomeNok;
  const militarySpecialApplies = recentlyDischargedMilitary && serviceMonths >= 3;
  const basisBeforeCapNok = militarySpecialApplies ? Math.max(regularEligibleIncome, rules.dischargedMilitaryMinimumBasisNok) : regularEligibleIncome;
  const benefitBasisNok = Math.min(basisBeforeCapNok, rules.maximumBasisNok);
  const fullAnnualBenefitNok = benefitBasisNok * rules.replacementRatePct / 100;
  const dailyBenefitNok = fullAnnualBenefitNok / rules.daysPerYear;
  const hourlyLossFactor = lostPct / 100;
  const dailyBasicEstimateNok = dailyBenefitNok * hourlyLossFactor;
  const dailyChildSupplementNok = children * rules.childSupplementPerDayNok;
  const dailyTotalEstimateNok = dailyBasicEstimateNok + dailyChildSupplementNok;
  const weeklyEstimateNok = dailyTotalEstimateNok * rules.daysPerWeek;
  const monthlyEquivalentEstimateNok = weeklyEstimateNok * 52 / 12;
  const estimatedAnnualNok = weeklyEstimateNok * 52;
  const firstPaymentDeductibleNok = dailyTotalEstimateNok * rules.deductibleDays;
  const qualifiesIncomeThreshold = income12 >= rules.minimumIncome12MonthsNok || income36 >= rules.minimumIncome36MonthsNok;
  const durationIncome = Math.max(income12, average36);
  const durationWeeks = militarySpecialApplies
    ? rules.dischargedMilitaryDurationWeeks
    : durationIncome >= rules.durationIncomeThresholdNok ? rules.ordinaryDurationAtOrAbove2GWeeks : rules.ordinaryDurationBelow2GWeeks;
  const selfReportedConditions = Object.freeze({
    incomeThreshold: qualifiesIncomeThreshold,
    lostAtLeastHalfHours: lostPct >= 50,
    under67,
    norwegianResidenceAndInsurance,
    registeredAndGenuineJobSeeker,
  });
  const missingSelfReportedConditions = Object.entries(selfReportedConditions).filter(([, yes]) => !yes).map(([name]) => name);

  return Object.freeze({
    rulesYear: rules.year,
    ratesAsOf: rules.ratesAsOf,
    effectiveBasicAmountDate: rules.effectiveBasicAmountDate,
    basicAmountNok: rules.basicAmountNok,
    incomeLast12MonthsNok: income12,
    incomeLast36MonthsNok: income36,
    average36MonthsNok: average36,
    selectedIncomeNok,
    benefitBasisNok,
    basisCappedAt6G: basisBeforeCapNok > rules.maximumBasisNok,
    workHoursLostPct: lostPct,
    dailyBasicEstimateNok,
    dailyChildSupplementNok,
    dailyTotalEstimateNok,
    weeklyEstimateNok,
    monthlyEquivalentEstimateNok,
    estimatedAnnualNok,
    firstPaymentDeductibleNok,
    supportedEligibleChildren: children,
    qualifiesIncomeThreshold,
    durationIncome,
    durationWeeks,
    militarySpecialApplies,
    selfReportedConditions,
    missingSelfReportedConditions,
  });
}
