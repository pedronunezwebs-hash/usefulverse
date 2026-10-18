/**
 * Norway's 2026 earnings-based disability-benefit scenario.
 * This deliberately does not decide eligibility or reproduce NAV's full award.
 */
export const norwayDisabilityBenefitRules2026 = Object.freeze({
  year: 2026,
  checkedAt: '2026-10-17',
  basicAmountNok: 136549,
  maximumIncomeBasisNok: 819294,
  replacementRate: 0.66,
  source: 'https://www.nav.no/uforetrygd',
  basicAmountSource: 'https://www.nav.no/grunnbelopet',
  ruleChangesSource: 'https://www.nav.no/regelendring-uforetrygd',
  officialCalculator: 'https://www.nav.no/uforetrygd',
});

function finite(value, name, { min = 0, max = 1e9 } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    throw new RangeError(`${name} must be from ${min} to ${max}.`);
  }
  return number;
}

/**
 * Takes five pensionable-income figures already adjusted to current value by
 * NAV or the user. Each year is capped at 6G; the best three are averaged.
 * The optional minimum is the user's own NAV-confirmed annual minimum for the
 * same disability degree and insurance-time fraction, never a guessed default.
 */
export function estimateNorwayDisabilityBenefit({
  adjustedPensionableIncomesNok = [],
  approvedDisabilityDegreePct = 100,
  approvedInsuranceTimePct = 100,
  navConfirmedMinimumAnnualNok = null,
} = {}) {
  if (!Array.isArray(adjustedPensionableIncomesNok) || adjustedPensionableIncomesNok.length !== 5) {
    throw new RangeError('Enter exactly five annual income amounts, one for each of the five years before the illness or injury.');
  }
  const rules = norwayDisabilityBenefitRules2026;
  const incomes = adjustedPensionableIncomesNok.map((value, index) => finite(value, `Income for year ${index + 1}`));
  const degree = finite(approvedDisabilityDegreePct, 'Approved disability degree', { max: 100 });
  const insuranceTime = finite(approvedInsuranceTimePct, 'Insurance-time fraction', { max: 100 });
  const minimum = navConfirmedMinimumAnnualNok === null || navConfirmedMinimumAnnualNok === ''
    ? null
    : finite(navConfirmedMinimumAnnualNok, 'NAV-confirmed minimum annual amount');
  const cappedIncomes = incomes.map((income) => Math.min(income, rules.maximumIncomeBasisNok));
  const bestThree = [...cappedIncomes].sort((a, b) => b - a).slice(0, 3);
  const averageBestThreeNok = bestThree.reduce((sum, income) => sum + income, 0) / 3;
  const fullRateAnnualNok = averageBestThreeNok * rules.replacementRate;
  const beforeInsuranceTimeAnnualNok = fullRateAnnualNok * degree / 100;
  const earningsBasedAnnualNok = beforeInsuranceTimeAnnualNok * insuranceTime / 100;
  const estimatedAnnualNok = minimum === null ? earningsBasedAnnualNok : Math.max(earningsBasedAnnualNok, minimum);
  return Object.freeze({
    rulesYear: rules.year,
    checkedAt: rules.checkedAt,
    basicAmountNok: rules.basicAmountNok,
    maximumIncomeBasisNok: rules.maximumIncomeBasisNok,
    replacementRate: rules.replacementRate,
    enteredIncomesNok: Object.freeze([...incomes]),
    cappedIncomesNok: Object.freeze(cappedIncomes),
    bestThreeIncomesNok: Object.freeze(bestThree),
    averageBestThreeNok,
    approvedDisabilityDegreePct: degree,
    approvedInsuranceTimePct: insuranceTime,
    earningsBasedAnnualNok,
    navConfirmedMinimumAnnualNok: minimum,
    minimumApplied: minimum !== null && minimum > earningsBasedAnnualNok,
    estimatedAnnualNok,
    estimatedMonthlyNok: estimatedAnnualNok / 12,
  });
}
