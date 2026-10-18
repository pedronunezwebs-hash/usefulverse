/** Simplified Norwegian housing-benefit scenario using Husbanken's 2026 rates. */
export const norwayHousingBenefitRules2026 = Object.freeze({
  rulesYear: 2026,
  checkedAt: '2026-10-17',
  effectiveFrom: '2026-01-01',
  coverageRate: 0.737,
  minimumAnnualOwnContributionNok: 26576,
  firstIncomeThresholdAnnualNok: 137462,
  firstContributionRate: 0.1644,
  secondIncomeThresholdAnnualNok: 245278,
  secondContributionRate: 0.6356,
  householdWeight: Object.freeze({ first: 1, additionalAdult: 0.13, additionalMinor: 0.15 }),
  annualHousingCapsNok: Object.freeze([92234, 113774, 125977, 138182, 150385]),
  municipalityIncrementsAnnualNok: Object.freeze({
    standard: 0,
    oslo: 27982,
    groupB: 19079,
    groupC: 12720,
  }),
  sourceCalculation: 'https://www.husbanken.no/person/bostotte/beregning-av-bostotte/',
  sourceIncome: 'https://www.husbanken.no/person/bostotte/inntektsgrunnlaget/',
  sourceRates: 'https://www.husbanken.no/kommune/bostotte/veileder-i-regelverk-for-bostotte/saksbehandle-ny-soknad/opplysninger-om-boligen-og-boutgiftene/egenandel-av-boutgiftene/',
  sourceHousingCaps: 'https://www.husbanken.no/kommune/bostotte/veileder-i-regelverk-for-bostotte/saksbehandle-ny-soknad/opplysninger-om-boligen-og-boutgiftene/ovre-grense-for-boutgifter/',
  officialCalculator: 'https://tjenester.husbanken.no/bostotte-kalkulator/index.html',
});

const finite = (value, name, { min = 0, max = 100000000 } = {}) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} must be from ${min} to ${max}.`);
  return number;
};

/**
 * Estimates a standard-case monthly scenario. Income must be the household's
 * monthly Husbanken income basis before household weighting, including any
 * wealth supplement and rental income that applies. This does not decide
 * eligibility or reproduce Husbanken's full casework.
 */
export function estimateNorwayHousingBenefit({
  monthlyIncomeBasisNok,
  monthlyApprovedHousingCostsNok,
  adults = 1,
  minors = 0,
  municipalityGroup = 'standard',
} = {}) {
  const rules = norwayHousingBenefitRules2026;
  const income = finite(monthlyIncomeBasisNok, 'Monthly household income', { max: 10000000 });
  const housingCosts = finite(monthlyApprovedHousingCostsNok, 'Monthly approved housing costs', { max: 1000000 });
  if (!Number.isInteger(adults) || adults < 1 || adults > 20) throw new RangeError('Enter 1–20 household members aged 18 or older.');
  if (!Number.isInteger(minors) || minors < 0 || minors > 20 || adults + minors > 20) throw new RangeError('Enter up to 20 household members in total.');
  if (!Object.hasOwn(rules.municipalityIncrementsAnnualNok, municipalityGroup)) throw new RangeError('Choose a listed 2026 municipality group.');

  const householdWeight = (100 + Math.max(0, adults - 1) * 13 + minors * 15) / 100;
  const householdMonthlyIncomeNok = income;
  const weightedMonthlyIncomeNok = householdMonthlyIncomeNok / householdWeight;
  const weightedAnnualIncomeNok = weightedMonthlyIncomeNok * 12;
  const ownContributionAnnualNok = rules.minimumAnnualOwnContributionNok
    + Math.max(0, weightedAnnualIncomeNok - rules.firstIncomeThresholdAnnualNok) * rules.firstContributionRate
    + Math.max(0, weightedAnnualIncomeNok - rules.secondIncomeThresholdAnnualNok) * rules.secondContributionRate;
  const householdSize = adults + minors;
  const baseAnnualHousingCapNok = rules.annualHousingCapsNok[Math.min(householdSize, 5) - 1];
  const annualHousingCapNok = baseAnnualHousingCapNok + rules.municipalityIncrementsAnnualNok[municipalityGroup];
  const approvedHousingCostsUsedMonthlyNok = Math.min(housingCosts, annualHousingCapNok / 12);
  const ownContributionMonthlyNok = ownContributionAnnualNok / 12;
  const eligibleDifferenceMonthlyNok = Math.max(0, approvedHousingCostsUsedMonthlyNok - ownContributionMonthlyNok);
  const estimatedMonthlyBenefitNok = Math.round(eligibleDifferenceMonthlyNok * rules.coverageRate);

  return Object.freeze({
    rulesYear: rules.rulesYear,
    checkedAt: rules.checkedAt,
    municipalityGroup,
    adults,
    minors,
    householdWeight,
    householdMonthlyIncomeNok,
    weightedMonthlyIncomeNok,
    weightedAnnualIncomeNok,
    ownContributionAnnualNok,
    ownContributionMonthlyNok,
    monthlyApprovedHousingCostsNok: housingCosts,
    annualHousingCapNok,
    approvedHousingCostsUsedMonthlyNok,
    eligibleDifferenceMonthlyNok,
    coverageRate: rules.coverageRate,
    estimatedMonthlyBenefitNok,
    notes: Object.freeze([
      'Norway 2026 standard-case scenario; use the official Husbanken calculator for current eligibility and individual rules.',
      'Enter approved housing costs as Husbanken counts them, not simply every housing bill.',
      'Income must follow Husbanken’s monthly income basis; include applicable wealth supplement and tax-free rental income.',
      'Special own-contribution thresholds, special-adapted housing, transition rules, the separate household income ceiling and minimum payout rules are not modelled.',
    ]),
  });
}
