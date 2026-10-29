const REVIEW_DUE = '2027-04-20';
export function estimateIndiaHraExemption(basicSalary, eligibleDearnessAllowance, hraReceived, rentPaid, cityType, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const values = [basicSalary, eligibleDearnessAllowance, hraReceived, rentPaid].map(Number);
  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 100_000_000) || !['metro', 'other'].includes(cityType)) {
    throw Object.assign(new Error('invalid-input'), { code: 'invalid-input' });
  }
  const [basic, da, hra, rent] = values; const salary = basic + da;
  const candidates = Object.freeze({ actualHra: hra, rentLessTenPercent: Math.max(0, rent - salary * 0.1), citySalaryLimit: salary * (cityType === 'metro' ? 0.5 : 0.4) });
  const exemption = Math.round(Math.min(...Object.values(candidates)) * 100) / 100;
  return Object.freeze({ salary, candidates, exemption, taxableHra: Math.round((hra - exemption) * 100) / 100, cityType, reviewDue: REVIEW_DUE });
}
