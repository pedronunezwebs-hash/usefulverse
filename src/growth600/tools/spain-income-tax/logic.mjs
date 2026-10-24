const REVIEW_DUE = '2027-01-15';
const BRACKETS = Object.freeze([
  { upper: 12_450, rate: 0.095, baseTax: 0 },
  { upper: 20_200, rate: 0.12, baseTax: 1182.75 },
  { upper: 35_200, rate: 0.15, baseTax: 2112.75 },
  { upper: 60_000, rate: 0.185, baseTax: 4362.75 },
  { upper: 300_000, rate: 0.225, baseTax: 8950.75 },
  { upper: Infinity, rate: 0.245, baseTax: 62_950.75 },
]);

export function estimateSpainNationalIncomeTax2025(taxableBaseAfterMinimum, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const raw = Number(taxableBaseAfterMinimum);
  if (!Number.isFinite(raw) || raw < 0 || raw > 100_000_000) throw Object.assign(new Error('invalid-income'), { code: 'invalid-income' });
  const bracket = BRACKETS.find(({ upper }) => raw <= upper) ?? BRACKETS.at(-1);
  const previousUpper = BRACKETS[BRACKETS.indexOf(bracket) - 1]?.upper ?? 0;
  const tax = Math.round((bracket.baseTax + (raw - previousUpper) * bracket.rate + Number.EPSILON) * 100) / 100;
  return Object.freeze({ taxableBaseAfterMinimum: raw, tax, marginalRate: bracket.rate, effectiveRate: raw === 0 ? 0 : tax / raw, taxYear: '2025', reviewDue: REVIEW_DUE });
}
