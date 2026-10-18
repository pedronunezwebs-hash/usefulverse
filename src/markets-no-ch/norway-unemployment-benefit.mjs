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
  // Legacy UI fields remain accepted; newer callers can enter the three NAV
  // income bases independently because eligibility, amount and duration differ.
  incomeLast12MonthsNok,
  incomeLast36MonthsNok,
  minimumIncomeLast12MonthsNok,
  minimumIncomeLast36MonthsNok,
  benefitIncomeLast12MonthsNok,
  benefitIncomeLast36MonthsNok,
  durationIncomeLast12MonthsNok,
  durationIncomeLast36MonthsNok,
  workHoursLostPct = 100,
  supportedEligibleChildren = 0,
  under67 = false,
  norwegianResidenceAndInsurance = false,
  registeredAndGenuineJobSeeker = false,
  recentlyDischargedMilitary = false,
  militaryServiceMonths = 0,
} = {}) {
  const rules = norwayUnemploymentBenefitRules2026;
  const legacy12 = incomeLast12MonthsNok ?? 0;
  const legacy36 = incomeLast36MonthsNok ?? 0;
  const minimum12 = finite(minimumIncomeLast12MonthsNok ?? legacy12, '12-month minimum-income basis');
  const minimum36 = finite(minimumIncomeLast36MonthsNok ?? legacy36, '36-month minimum-income basis');
  const benefit12 = finite(benefitIncomeLast12MonthsNok ?? legacy12, '12-month benefit basis');
  const benefit36 = finite(benefitIncomeLast36MonthsNok ?? legacy36, '36-month benefit basis');
  const duration12 = finite(durationIncomeLast12MonthsNok ?? legacy12, '12-month duration basis');
  const duration36 = finite(durationIncomeLast36MonthsNok ?? legacy36, '36-month duration basis');
  const lostPct = finite(workHoursLostPct, 'Lost work-hours percentage', { min: 0, max: 100 });
  const children = finite(supportedEligibleChildren, 'Children', { max: 20 });
  const serviceMonths = finite(militaryServiceMonths, 'Military service months', { max: 60 });
  for (const [value, name] of [[under67, 'Age flag'], [norwegianResidenceAndInsurance, 'Residence and insurance flag'], [registeredAndGenuineJobSeeker, 'Job seeker flag'], [recentlyDischargedMilitary, 'Military discharge flag']]) {
    if (typeof value !== 'boolean') throw new TypeError(`${name} must be true or false.`);
  }
  if (![minimum12, minimum36, benefit12, benefit36, duration12, duration36, lostPct, children, serviceMonths].every(Number.isFinite) || !Number.isInteger(children) || !Number.isInteger(serviceMonths)) throw new RangeError('Income, hours, child count and service months must be valid values.');
  if (lostPct < 50) throw new RangeError('At least 50% of normal working hours must be lost for the standard rules modeled here.');

  const averageBenefit36 = benefit36 / 3;
  const selectedIncomeNok = Math.max(benefit12, averageBenefit36);
  const regularEligibleIncome = selectedIncomeNok;
  const militarySpecialApplies = recentlyDischargedMilitary && serviceMonths >= 3;
  const basisBeforeCapNok = militarySpecialApplies
    ? Math.max(benefit12, rules.dischargedMilitaryMinimumBasisNok)
    : regularEligibleIncome;
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
  const qualifiesIncomeThreshold = minimum12 >= rules.minimumIncome12MonthsNok || minimum36 >= rules.minimumIncome36MonthsNok;
  const averageDuration36 = duration36 / 3;
  const durationIncome = Math.max(duration12, averageDuration36);
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
    incomeLast12MonthsNok: benefit12,
    incomeLast36MonthsNok: benefit36,
    minimumIncomeLast12MonthsNok: minimum12,
    minimumIncomeLast36MonthsNok: minimum36,
    benefitIncomeLast12MonthsNok: benefit12,
    benefitIncomeLast36MonthsNok: benefit36,
    durationIncomeLast12MonthsNok: duration12,
    durationIncomeLast36MonthsNok: duration36,
    average36MonthsNok: averageBenefit36,
    averageBenefitIncome36MonthsNok: averageBenefit36,
    selectedBenefitIncomeNok: selectedIncomeNok,
    averageDurationIncome36MonthsNok: averageDuration36,
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
