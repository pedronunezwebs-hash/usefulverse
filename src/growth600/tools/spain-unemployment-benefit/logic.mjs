const REVIEW_DUE = '2027-01-10';
const AMOUNTS = Object.freeze({
  none: { minimum: 560, maximum: 1225 },
  one: { minimum: 749, maximum: 1400 },
  'two-plus': { minimum: 749, maximum: 1575 },
});
export function estimateSpainContributoryBenefit2026(regulatoryBase, benefitDay, dependentChildren, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf < '2026-01-01' || asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const base = Number(regulatoryBase); const day = Number(benefitDay); const amounts = AMOUNTS[dependentChildren];
  if (!Number.isFinite(base) || base <= 0 || base > 100_000 || !Number.isInteger(day) || day < 1 || day > 720 || !amounts) {
    throw Object.assign(new Error('invalid-input'), { code: 'invalid-input' });
  }
  const rate = day <= 180 ? 0.70 : 0.60;
  const uncapped = base * rate;
  const monthlyAmount = Math.round(Math.min(amounts.maximum, Math.max(amounts.minimum, uncapped)) * 100) / 100;
  return Object.freeze({ regulatoryBase: base, benefitDay: day, dependentChildren, rate, uncapped, minimum: amounts.minimum, maximum: amounts.maximum, monthlyAmount, reviewDue: REVIEW_DUE });
}
