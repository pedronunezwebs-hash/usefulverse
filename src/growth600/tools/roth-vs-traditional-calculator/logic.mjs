export const ROTH_TRADITIONAL_LIMITS = Object.freeze({
  annualContribution: 1_000_000,
  years: 80,
  taxRatePercent: 60,
  annualReturnPercent: 30,
});

function boundedNumber(value, label, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) {
    throw new RangeError(`${label} is outside the supported range.`);
  }
  return number;
}

export function futureValueFactor(annualReturnPercent, years) {
  const rate = boundedNumber(annualReturnPercent, 'Annual return', -50, ROTH_TRADITIONAL_LIMITS.annualReturnPercent) / 100;
  const periods = boundedNumber(years, 'Years', 1, ROTH_TRADITIONAL_LIMITS.years);
  if (!Number.isInteger(periods)) throw new RangeError('Years must be a whole number.');
  if (Math.abs(rate) < 1e-12) return periods;
  return ((1 + rate) ** periods - 1) / rate;
}

export function compareRothTraditional({ annualContribution, currentTaxRatePercent, futureTaxRatePercent, annualReturnPercent, years }) {
  const contribution = boundedNumber(annualContribution, 'Annual contribution', 0, ROTH_TRADITIONAL_LIMITS.annualContribution);
  const currentTaxRate = boundedNumber(currentTaxRatePercent, 'Current tax rate', 0, ROTH_TRADITIONAL_LIMITS.taxRatePercent) / 100;
  const futureTaxRate = boundedNumber(futureTaxRatePercent, 'Future tax rate', 0, ROTH_TRADITIONAL_LIMITS.taxRatePercent) / 100;
  const returnRate = boundedNumber(annualReturnPercent, 'Annual return', -50, ROTH_TRADITIONAL_LIMITS.annualReturnPercent) / 100;
  const periodCount = boundedNumber(years, 'Years', 1, ROTH_TRADITIONAL_LIMITS.years);
  if (!Number.isInteger(periodCount)) throw new RangeError('Years must be a whole number.');

  const growthFactor = Math.abs(returnRate) < 1e-12 ? periodCount : ((1 + returnRate) ** periodCount - 1) / returnRate;
  const totalPretaxBudget = contribution * periodCount;
  const rothAnnualDeposit = contribution * (1 - currentTaxRate);
  const traditionalPretaxBalance = contribution * growthFactor;
  const rothAfterTaxBalance = rothAnnualDeposit * growthFactor;
  const traditionalAfterTaxBalance = traditionalPretaxBalance * (1 - futureTaxRate);
  const traditionalEstimatedTax = traditionalPretaxBalance * futureTaxRate;

  return {
    years: periodCount,
    annualContribution: contribution,
    totalPretaxBudget,
    growthFactor,
    rothAnnualDeposit,
    rothAfterTaxBalance,
    traditionalPretaxBalance,
    traditionalAfterTaxBalance,
    traditionalEstimatedTax,
    currentTaxPaidOnRothContributions: totalPretaxBudget * currentTaxRate,
    estimatedDifference: rothAfterTaxBalance - traditionalAfterTaxBalance,
    assumptions: Object.freeze({ currentTaxRatePercent: currentTaxRate * 100, futureTaxRatePercent: futureTaxRate * 100, annualReturnPercent: returnRate * 100, contributionsAtYearEnd: true }),
  };
}
