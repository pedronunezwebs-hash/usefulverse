const REVIEW_DUE = '2026-12-01';
const ROWS = Object.freeze([
  { upper: 920, rate: 0, abate: 0 },
  { upper: 1042, rate: 0.125, abate: (r) => 0.125 * 2.6 * (1273.85 - r) },
  { upper: 1108, rate: 0.157, abate: (r) => 0.157 * 1.35 * (1554.83 - r) },
  { upper: 1154, rate: 0.157, abate: 94.71 },
  { upper: 1212, rate: 0.212, abate: 158.18 },
  { upper: 1819, rate: 0.241, abate: 193.33 },
  { upper: 2119, rate: 0.311, abate: 320.66 },
  { upper: 2499, rate: 0.349, abate: 401.19 },
  { upper: 3305, rate: 0.3836, abate: 487.66 },
  { upper: 5547, rate: 0.3969, abate: 531.62 },
  { upper: 20221, rate: 0.4495, abate: 823.40 },
  { upper: Infinity, rate: 0.4717, abate: 1272.31 },
]);
const cents = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

export function estimatePortugalNetSalary2026(grossMonthly, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf < '2026-01-01' || asOf >= '2027-01-01' || asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const gross = Number(grossMonthly);
  if (!Number.isFinite(gross) || gross < 0 || gross > 1_000_000) throw Object.assign(new Error('invalid-income'), { code: 'invalid-income' });
  const row = ROWS.find(({ upper }) => gross <= upper) ?? ROWS.at(-1);
  const withholding = cents(Math.max(0, gross * row.rate - (typeof row.abate === 'function' ? row.abate(gross) : row.abate)));
  const socialSecurity = cents(gross * 0.11);
  return Object.freeze({ grossMonthly: gross, irsWithholding: withholding, socialSecurity, netMonthly: cents(gross - withholding - socialSecurity), marginalRate: row.rate, taxYear: '2026', reviewDue: REVIEW_DUE });
}
