export const SSS_TABLE = Object.freeze({ year: 2025, effectiveFrom: '2025-01-01', checkedAt: '2026-10-20', minimumMsc: 5000, regularMaxMsc: 20000, maximumMsc: 35000, ecThresholdMsc: 15000, ecLow: 10, ecHigh: 30 });

export function estimatePhilippinesSss(monthlyCompensation) {
  const salary = Number(monthlyCompensation);
  if (!Number.isFinite(salary) || salary < 0 || salary > 1_000_000_000) throw Object.assign(new Error('invalid-salary'), { code: 'invalid-salary' });
  const msc = Math.min(SSS_TABLE.maximumMsc, Math.max(SSS_TABLE.minimumMsc, Math.floor((salary + 250) / 500) * 500));
  const regularMsc = Math.min(msc, SSS_TABLE.regularMaxMsc);
  const mpfMsc = Math.max(0, msc - SSS_TABLE.regularMaxMsc);
  const employerRegular = regularMsc * 0.10;
  const employerMpf = mpfMsc * 0.10;
  const employeeRegular = regularMsc * 0.05;
  const employeeMpf = mpfMsc * 0.05;
  const ecEmployer = msc <= 14500 ? SSS_TABLE.ecLow : SSS_TABLE.ecHigh;
  const employerTotal = employerRegular + employerMpf + ecEmployer;
  const employeeTotal = employeeRegular + employeeMpf;
  return Object.freeze({ salary, msc, regularMsc, mpfMsc, employerRegular, employerMpf, ecEmployer, employerTotal, employeeRegular, employeeMpf, employeeTotal, combinedTotal: employerTotal + employeeTotal, tableYear: SSS_TABLE.year, effectiveFrom: SSS_TABLE.effectiveFrom });
}
