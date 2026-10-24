const REVIEW_DUE = '2027-04-20';
const BRACKETS = Object.freeze([
  { upper: 610_000, rate: 0.05, difference: 0 },
  { upper: 1_380_000, rate: 0.12, difference: 42_700 },
  { upper: 2_770_000, rate: 0.20, difference: 153_100 },
  { upper: 5_190_000, rate: 0.30, difference: 430_100 },
  { upper: Infinity, rate: 0.40, difference: 949_100 },
]);
export function estimateTaiwanResidentIncomeTax2026(netTaxableIncome, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf < '2026-01-01' || asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const income = Number(netTaxableIncome);
  if (!Number.isFinite(income) || income < 0 || income > 1_000_000_000) throw Object.assign(new Error('invalid-income'), { code: 'invalid-income' });
  const bracket = BRACKETS.find(({ upper }) => income <= upper) ?? BRACKETS.at(-1);
  const tax = Math.max(0, Math.round((income * bracket.rate - bracket.difference + Number.EPSILON) * 100) / 100);
  return Object.freeze({ netTaxableIncome: income, tax, marginalRate: bracket.rate, effectiveRate: income === 0 ? 0 : tax / income, taxYear: '2026', reviewDue: REVIEW_DUE });
}
