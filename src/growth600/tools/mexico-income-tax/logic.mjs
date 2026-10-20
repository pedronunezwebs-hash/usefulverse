const REVIEW_DUE = '2027-01-01';
const BRACKETS = Object.freeze([
  { lower: 0, upper: 10135.11, fixed: 0, rate: 0.0192 },
  { lower: 10135.12, upper: 86022.11, fixed: 194.59, rate: 0.064 },
  { lower: 86022.12, upper: 151176.19, fixed: 5051.37, rate: 0.1088 },
  { lower: 151176.20, upper: 175735.66, fixed: 12140.13, rate: 0.16 },
  { lower: 175735.67, upper: 210403.69, fixed: 16069.64, rate: 0.1792 },
  { lower: 210403.70, upper: 424353.97, fixed: 22282.14, rate: 0.2136 },
  { lower: 424353.98, upper: 668840.14, fixed: 67981.92, rate: 0.2352 },
  { lower: 668840.15, upper: 1276925.98, fixed: 125485.07, rate: 0.30 },
  { lower: 1276925.99, upper: 1702567.97, fixed: 307910.81, rate: 0.32 },
  { lower: 1702567.98, upper: 5107703.92, fixed: 444116.23, rate: 0.34 },
  { lower: 5107703.93, upper: Infinity, fixed: 1601862.46, rate: 0.35 },
]);
export function estimateMexicoIndividualIsr2026(annualTaxableIncome, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf < '2026-01-01' || asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const income = Number(annualTaxableIncome);
  if (!Number.isFinite(income) || income < 0 || income > 1_000_000_000) throw Object.assign(new Error('invalid-income'), { code: 'invalid-income' });
  const bracket = BRACKETS.find(({ upper }) => income <= upper) ?? BRACKETS.at(-1);
  const tax = Math.max(0, Math.round((bracket.fixed + Math.max(0, income - bracket.lower) * bracket.rate + Number.EPSILON) * 100) / 100);
  return Object.freeze({ annualTaxableIncome: income, tax, marginalRate: bracket.rate, fixedQuota: bracket.fixed, effectiveRate: income === 0 ? 0 : tax / income, taxYear: '2026', reviewDue: REVIEW_DUE });
}
