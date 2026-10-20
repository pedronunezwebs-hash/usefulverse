const REVIEW_DUE = '2027-01-11';
export function estimateBrazilSeguroDesemprego2026(averageWage, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf < '2026-01-11' || asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const wage = Number(averageWage);
  if (!Number.isFinite(wage) || wage < 0 || wage > 100_000_000) throw Object.assign(new Error('invalid-wage'), { code: 'invalid-wage' });
  const raw = wage <= 2222.17 ? wage * 0.8 : wage <= 3703.99 ? (wage - 2222.17) * 0.5 + 1777.74 : 2518.65;
  const installment = Math.round((Math.max(1621, Math.min(2518.65, raw)) + Number.EPSILON) * 100) / 100;
  return Object.freeze({ averageWage: wage, installment, floor: 1621, cap: 2518.65, taxYear: '2026', reviewDue: REVIEW_DUE });
}
