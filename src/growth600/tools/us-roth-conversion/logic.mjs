export const US_ROTH_CONVERSION_LIMITS = Object.freeze({ amount: 100_000_000, years: 80, ratePercent: 60, returnPercent: 30 });

function bounded(value, name, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

export function estimateRothConversion({ amount, currentRatePercent, futureRatePercent, annualReturnPercent, years } = {}) {
  const principal = bounded(amount, 'Amount', 0.01, US_ROTH_CONVERSION_LIMITS.amount);
  const currentRate = bounded(currentRatePercent, 'Current tax rate', 0, US_ROTH_CONVERSION_LIMITS.ratePercent) / 100;
  const futureRate = bounded(futureRatePercent, 'Future tax rate', 0, US_ROTH_CONVERSION_LIMITS.ratePercent) / 100;
  const annualReturn = bounded(annualReturnPercent, 'Annual return', -50, US_ROTH_CONVERSION_LIMITS.returnPercent) / 100;
  const periodCount = bounded(years, 'Years', 1, US_ROTH_CONVERSION_LIMITS.years);
  if (!Number.isInteger(periodCount)) throw new RangeError('Years must be a whole number.');
  const growthFactor = (1 + annualReturn) ** periodCount;
  if (!Number.isFinite(growthFactor)) throw new RangeError('Growth assumption is too large.');
  const cents = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
  const taxDueNow = cents(principal * currentRate);
  const valueBeforeWithdrawalTax = cents(principal * growthFactor);
  return Object.freeze({
    taxDueNow,
    rothIfTaxPaidOutside: valueBeforeWithdrawalTax,
    rothIfTaxWithheld: cents((principal - taxDueNow) * growthFactor),
    traditionalAfterTax: cents(valueBeforeWithdrawalTax * (1 - futureRate)),
    valueBeforeWithdrawalTax,
    growthFactor,
    years: periodCount,
    assumptions: Object.freeze({ currentRatePercent: currentRate * 100, futureRatePercent: futureRate * 100, annualReturnPercent: annualReturn * 100 }),
  });
}
