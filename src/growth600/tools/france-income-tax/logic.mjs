const BANDS = Object.freeze([
  { upper: 11600, rate: 0 },
  { upper: 29579, rate: 0.11 },
  { upper: 84577, rate: 0.30 },
  { upper: 181917, rate: 0.41 },
  { upper: Infinity, rate: 0.45 },
]);

export function estimateFranceIncomeTax2025(taxableIncomePerPart) {
  const rawIncome = Number(taxableIncomePerPart);
  if (!Number.isFinite(rawIncome) || rawIncome < 0 || rawIncome > 100_000_000) throw Object.assign(new Error('invalid-income'), { code: 'invalid-income' });
  const income = Math.floor(rawIncome + 0.5);
  let lower = 0; let tax = 0; let marginalRate = 0;
  const breakdown = [];
  for (const band of BANDS) {
    const taxableInBand = Math.max(0, Math.min(income, band.upper) - lower);
    if (taxableInBand > 0) { tax += taxableInBand * band.rate; marginalRate = band.rate; breakdown.push(Object.freeze({ amount: taxableInBand, rate: band.rate })); }
    if (income <= band.upper) break;
    lower = band.upper;
  }
  tax = Math.floor(tax + 0.5);
  return Object.freeze({ taxableIncomePerPart: income, tax, marginalRate, effectiveRate: income === 0 ? 0 : tax / income, taxYear: '2025', assessmentYear: '2026', breakdown: Object.freeze(breakdown) });
}
