const REVIEW_DUE = '2027-04-06';
const WORK_ALLOWANCES = Object.freeze({ none: 0, housing: 427, 'no-housing': 710 });

export function estimateUkUniversalCreditEarningsTaper(maximumAward, netEarnings, workAllowanceType, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf < '2026-04-06' || asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const award = Number(maximumAward); const earnings = Number(netEarnings);
  if (!Number.isFinite(award) || award < 0 || award > 1_000_000 || !Number.isFinite(earnings) || earnings < 0 || earnings > 1_000_000 || !(workAllowanceType in WORK_ALLOWANCES)) {
    throw Object.assign(new Error('invalid-input'), { code: 'invalid-input' });
  }
  const allowance = WORK_ALLOWANCES[workAllowanceType];
  const earningsAboveAllowance = Math.max(0, earnings - allowance);
  const earningsReduction = Math.round((earningsAboveAllowance * 0.55 + Number.EPSILON) * 100) / 100;
  const estimatedPayment = Math.max(0, Math.round((award - earningsReduction + Number.EPSILON) * 100) / 100);
  return Object.freeze({ maximumAward: award, netEarnings: earnings, workAllowance: allowance, taperRate: 0.55, earningsReduction, estimatedPayment, reviewDue: REVIEW_DUE });
}
