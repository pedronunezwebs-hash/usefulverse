export function estimateUkCapitalGains({ netGainsAfterLosses, taxableIncome }, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf < '2026-04-06' || asOf >= '2027-04-06') throw Object.assign(new Error('tax-year-unavailable'), { code: 'tax-year-unavailable' });
  const gains = Number(netGainsAfterLosses); const income = Number(taxableIncome);
  if (![gains, income].every((amount) => Number.isFinite(amount) && amount >= 0 && amount <= 100_000_000)) throw Object.assign(new Error('invalid-amount'), { code: 'invalid-amount' });
  const allowance = 3000;
  const chargeableGains = Math.max(0, gains - allowance);
  const basicBandRemaining = Math.max(0, 37700 - income);
  const basicRateGains = Math.min(chargeableGains, basicBandRemaining);
  const higherRateGains = chargeableGains - basicRateGains;
  const basicTax = basicRateGains * 0.18;
  const higherTax = higherRateGains * 0.24;
  return Object.freeze({ netGainsAfterLosses: gains, taxableIncome: income, allowance, chargeableGains, basicBandRemaining, basicRateGains, higherRateGains, basicTax, higherTax, estimatedTax: basicTax + higherTax, effectiveFrom: '2026-04-06', taxYear: '2026-27' });
}
