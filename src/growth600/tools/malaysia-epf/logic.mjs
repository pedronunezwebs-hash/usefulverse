const REVIEW_DUE = '2027-04-20';
export function estimateMalaysiaForeignEmployeeEpf(monthlyWages, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf < '2025-10-01' || asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const wages = Number(monthlyWages);
  if (!Number.isFinite(wages) || wages < 0 || wages > 100_000_000) throw Object.assign(new Error('invalid-wages'), { code: 'invalid-wages' });
  const employeeShare = Math.round((wages * 0.02 + Number.EPSILON) * 100) / 100;
  const employerShare = employeeShare;
  const exactTotal = employeeShare + employerShare;
  return Object.freeze({ monthlyWages: wages, employeeRate: 0.02, employerRate: 0.02, employeeShare, employerShare, exactTotal, payableTotal: Math.ceil(exactTotal), reviewDue: REVIEW_DUE });
}
