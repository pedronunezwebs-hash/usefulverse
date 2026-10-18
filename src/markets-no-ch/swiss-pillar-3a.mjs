const MAX_CHF = 1_000_000_000;
export const swissPillar3aLimits = Object.freeze({
  2026: Object.freeze({ withSecondPillar: 7_258, withoutSecondPillar: 36_288 }),
  2027: Object.freeze({ withSecondPillar: 7_373, withoutSecondPillar: 36_864 }),
});

function amount(value, name) {
  if (typeof value === 'string' && !value.trim()) throw new TypeError(`${name} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > MAX_CHF) throw new RangeError(`${name} must be between CHF 0 and CHF ${MAX_CHF}.`);
  return Math.round(number * 100) / 100;
}

/** Calculates 3a contribution eligibility limits and compares user-entered ESTV tax results. */
export function calculateSwissPillar3aScenario({ year, secondPillarStatus, qualifyingEarnedIncome, contribution, eligibleIncomeConfirmed, taxBefore, taxAfter, location, profile }) {
  const taxYear = Number(year);
  const limits = swissPillar3aLimits[taxYear];
  if (!limits) throw new RangeError('Choose 2026 or 2027.');
  if (!['withSecondPillar', 'withoutSecondPillar'].includes(secondPillarStatus)) throw new TypeError('Choose your second-pillar situation.');
  const earned = amount(qualifyingEarnedIncome, 'Qualifying Swiss earned income');
  const paid = amount(contribution, 'Planned or paid pillar 3a contribution');
  const before = amount(taxBefore, 'ESTV tax before the contribution');
  const after = amount(taxAfter, 'ESTV tax after the contribution');
  const municipality = String(location ?? '').trim().slice(0, 100);
  const householdProfile = String(profile ?? '').trim().slice(0, 100);
  if (!municipality || !householdProfile) throw new TypeError('Enter the municipality and household profile used in both ESTV calculations.');
  const eligible = eligibleIncomeConfirmed === true || eligibleIncomeConfirmed === 'true';
  const maximumDeduction = !eligible ? 0 : secondPillarStatus === 'withSecondPillar'
    ? limits.withSecondPillar
    : Math.min(limits.withoutSecondPillar, earned * 0.2);
  const deductibleContribution = Math.round(Math.min(paid, maximumDeduction) * 100) / 100;
  const taxSavings = Math.round((before - after) * 100) / 100;
  return Object.freeze({
    year: taxYear,
    location: municipality,
    profile: householdProfile,
    secondPillarStatus,
    qualifyingEarnedIncome: earned,
    eligibleIncomeConfirmed: eligible,
    contribution: paid,
    maximumDeduction,
    deductibleContribution,
    contributionAboveLimit: Math.round(Math.max(0, paid - deductibleContribution) * 100) / 100,
    taxBefore: before,
    taxAfter: after,
    estimatedTaxSavings: taxSavings,
    taxSavingsAsShareOfContribution: paid > 0 ? taxSavings / paid : null,
    effectiveSavingsOnDeduction: deductibleContribution > 0 ? taxSavings / deductibleContribution : null,
  });
}
