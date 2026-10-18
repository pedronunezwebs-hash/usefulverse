const rules = Object.freeze({
  2026: Object.freeze({ minimumMonthly: 1_260, maximumMonthly: 2_520 }),
  2027: Object.freeze({ minimumMonthly: 1_280, maximumMonthly: 2_560 }),
});

const CHF_MAX = 1_000_000_000;
function finiteAmount(value, field) {
  if (typeof value === 'string' && !value.trim()) throw new TypeError(`${field} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > CHF_MAX) throw new RangeError(`${field} must be between CHF 0 and CHF ${CHF_MAX}.`);
  return number;
}

/** Indicative normal-retirement AHV estimate from official user-provided RAM and years. */
export function estimateSwissAhvPension({ year, determiningAverageAnnualIncome, creditedContributionYears, fullContributionYears }) {
  const taxYear = Number(year);
  const yearRules = rules[taxYear];
  if (!yearRules) throw new RangeError('Choose 2026 or 2027, the years currently supported.');
  const average = finiteAmount(determiningAverageAnnualIncome, 'Determining average annual income');
  const creditedYears = Number(creditedContributionYears);
  const fullYears = Number(fullContributionYears);
  if (!Number.isFinite(creditedYears) || creditedYears < 1 || creditedYears > 44 || Math.abs(creditedYears * 4 - Math.round(creditedYears * 4)) > 1e-8) throw new RangeError('Credited contribution years must be from 1 to 44 in quarter-year steps.');
  if (![43, 43.25, 43.5, 43.75, 44].includes(fullYears) || creditedYears > fullYears) throw new RangeError('Choose a supported full contribution duration from 43 to 44 years, and do not exceed it.');

  const { minimumMonthly, maximumMonthly } = yearRules;
  const incomeStep = minimumMonthly * 1.2;
  const tableMaximumIncome = minimumMonthly * 72;
  const roundedAverageAnnualIncome = Math.min(tableMaximumIncome, Math.max(minimumMonthly * 12, Math.ceil(average / incomeStep) * incomeStep));
  const threshold = minimumMonthly * 36;
  const fullMonthlyUnrounded = roundedAverageAnnualIncome <= threshold
    ? 0.74 * minimumMonthly + (13 / 600) * roundedAverageAnnualIncome
    : 1.04 * minimumMonthly + (8 / 600) * roundedAverageAnnualIncome;
  const fullMonthly = Math.floor(Math.min(maximumMonthly, Math.max(minimumMonthly, fullMonthlyUnrounded)) + 0.5);
  const contributionRatio = 1 - ((fullYears - creditedYears) / 44);
  const monthlyPension = Math.floor(fullMonthly * contributionRatio + 0.5);
  const regularAnnual = monthlyPension * 12;
  const thirteenthPayment = monthlyPension;
  return Object.freeze({
    year: taxYear,
    determiningAverageAnnualIncome: average,
    roundedDeterminingAverageAnnualIncome: roundedAverageAnnualIncome,
    creditedContributionYears: creditedYears,
    fullContributionYears: fullYears,
    contributionRatio,
    fullScaleMonthlyPension: fullMonthly,
    monthlyPension,
    regularAnnual,
    thirteenthPayment,
    estimatedAnnualTotal: regularAnnual + thirteenthPayment,
    minimumMonthly,
    maximumMonthly,
    formulaThreshold: threshold,
    limitation: 'Indicative normal-retirement estimate. The official AHV account and compensation office determine credited earnings, years, splitting, education/care credits, transition supplements, spouse caps, and early/deferral adjustments.',
  });
}

export const swissAhvPensionRules = rules;
