const BRACKETS = Object.freeze([
  { upper: 1950000, rate: 0.05, deduction: 0 },
  { upper: 3300000, rate: 0.10, deduction: 97500 },
  { upper: 6950000, rate: 0.20, deduction: 427500 },
  { upper: 9000000, rate: 0.23, deduction: 636000 },
  { upper: 18000000, rate: 0.33, deduction: 1536000 },
  { upper: 40000000, rate: 0.40, deduction: 2796000 },
  { upper: Infinity, rate: 0.45, deduction: 4796000 },
]);

export function estimateJapanIncomeTax2026(taxableIncome, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf < '2026-01-01' || asOf >= '2027-01-01') throw Object.assign(new Error('tax-year-unavailable'), { code: 'tax-year-unavailable' });
  const rawIncome = Number(taxableIncome);
  if (!Number.isFinite(rawIncome) || rawIncome < 0 || rawIncome > 330_000_000) throw Object.assign(new Error('invalid-income'), { code: 'invalid-income' });
  const income = Math.floor(rawIncome / 1000) * 1000;
  const bracket = BRACKETS.find(({ upper }) => income <= upper) ?? BRACKETS.at(-1);
  const baseIncomeTax = Math.max(0, Math.floor(income * bracket.rate - bracket.deduction));
  const reconstructionTax = Math.floor(baseIncomeTax * 0.021);
  const combinedBeforeRounding = baseIncomeTax + reconstructionTax;
  const nationalTaxDue = Math.floor(combinedBeforeRounding / 100) * 100;
  return Object.freeze({ rawIncome, taxableIncome: income, baseIncomeTax, reconstructionTax, combinedBeforeRounding, nationalTaxDue, marginalRate: bracket.rate, effectiveRate: income === 0 ? 0 : nationalTaxDue / income, taxYear: '2026' });
}
