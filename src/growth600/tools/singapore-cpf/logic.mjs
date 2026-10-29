const RATES_2026 = Object.freeze([
  { maxAge: 55, employer: 17, employee: 20 },
  { maxAge: 60, employer: 16, employee: 18 },
  { maxAge: 65, employer: 12.5, employee: 12.5 },
  { maxAge: 70, employer: 9, employee: 7.5 },
  { maxAge: Infinity, employer: 7.5, employee: 5 },
]);

export function estimateSingaporeCpf2026(age, ordinaryWage, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf >= '2027-01-01') throw Object.assign(new Error('table-expired'), { code: 'table-expired' });
  const years = Number(age); const wage = Number(ordinaryWage);
  if (!Number.isInteger(years) || years < 16 || years > 100) throw Object.assign(new Error('invalid-age'), { code: 'invalid-age' });
  if (!Number.isFinite(wage) || wage <= 750 || wage > 1_000_000) throw Object.assign(new Error('unsupported-wage'), { code: 'unsupported-wage' });
  const wageSubjectToCpf = Math.min(wage, 8000);
  const rate = RATES_2026.find(({ maxAge }) => years <= maxAge);
  const exactTotal = wageSubjectToCpf * (rate.employer + rate.employee) / 100;
  const total = Math.floor(exactTotal + 0.5);
  const employee = Math.floor(wageSubjectToCpf * rate.employee / 100);
  return Object.freeze({ age: years, ordinaryWage: wage, wageSubjectToCpf, employerRate: rate.employer, employeeRate: rate.employee, employer: total - employee, employee, total, tableYear: 2026, effectiveFrom: '2026-01-01' });
}
