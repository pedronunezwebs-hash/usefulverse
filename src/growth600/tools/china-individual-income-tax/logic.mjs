const REVIEW_DUE = '2027-04-20';
const BRACKETS = Object.freeze([
  { upper: 36_000, rate: 0.03, quickDeduction: 0 },
  { upper: 144_000, rate: 0.10, quickDeduction: 2520 },
  { upper: 300_000, rate: 0.20, quickDeduction: 16_920 },
  { upper: 420_000, rate: 0.25, quickDeduction: 31_920 },
  { upper: 660_000, rate: 0.30, quickDeduction: 52_920 },
  { upper: 960_000, rate: 0.35, quickDeduction: 85_920 },
  { upper: Infinity, rate: 0.45, quickDeduction: 181_920 },
]);
export function estimateChinaResidentComprehensiveTax2026(annualTaxableIncome, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf < '2026-01-01' || asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const income = Number(annualTaxableIncome);
  if (!Number.isFinite(income) || income < 0 || income > 1_000_000_000) throw Object.assign(new Error('invalid-income'), { code: 'invalid-income' });
  const bracket = BRACKETS.find(({ upper }) => income <= upper) ?? BRACKETS.at(-1);
  const tax = Math.max(0, Math.round((income * bracket.rate - bracket.quickDeduction + Number.EPSILON) * 100) / 100);
  return Object.freeze({ annualTaxableIncome: income, tax, marginalRate: bracket.rate, quickDeduction: bracket.quickDeduction, effectiveRate: income === 0 ? 0 : tax / income, taxYear: '2026', reviewDue: REVIEW_DUE });
}
