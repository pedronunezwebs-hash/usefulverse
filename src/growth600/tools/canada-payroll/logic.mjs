const TABLE = Object.freeze({ year: 2026, ympe: 74600, basicExemption: 3500, yampe: 85000, cppBaseRate: 0.0495, cppFirstAdditionalRate: 0.01, cppSecondAdditionalRate: 0.04, eiMaximum: 68900, eiEmployeeRate: 0.0163, eiEmployerRate: 0.02282 });
const cents = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export function estimateCanadaCppEi(annualEmploymentIncome, age, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf >= '2027-01-01') throw Object.assign(new Error('table-expired'), { code: 'table-expired' });
  const income = Number(annualEmploymentIncome); const years = Number(age);
  if (!Number.isFinite(income) || income < 0 || income > 10_000_000) throw Object.assign(new Error('invalid-income'), { code: 'invalid-income' });
  if (!Number.isInteger(years) || years < 18 || years > 69) throw Object.assign(new Error('unsupported-age'), { code: 'unsupported-age' });
  const pensionable = Math.min(Math.max(income - TABLE.basicExemption, 0), TABLE.ympe - TABLE.basicExemption);
  const cppBase = cents(pensionable * TABLE.cppBaseRate);
  const cppFirstAdditional = cents(pensionable * TABLE.cppFirstAdditionalRate);
  const cppSecondAdditional = cents(Math.min(Math.max(income - TABLE.ympe, 0), TABLE.yampe - TABLE.ympe) * TABLE.cppSecondAdditionalRate);
  const cppEmployee = cents(cppBase + cppFirstAdditional + cppSecondAdditional);
  const eiInsurable = Math.min(income, TABLE.eiMaximum);
  const eiEmployee = cents(eiInsurable * TABLE.eiEmployeeRate);
  const eiEmployer = cents(eiInsurable * TABLE.eiEmployerRate);
  return Object.freeze({ income, age: years, pensionable, cppBase, cppFirstAdditional, cppSecondAdditional, cppEmployee, cppEmployer: cppEmployee, eiInsurable, eiEmployee, eiEmployer, employeeTotal: cents(cppEmployee + eiEmployee), employerTotal: cents(cppEmployee + eiEmployer), combinedTotal: cents(cppEmployee * 2 + eiEmployee + eiEmployer), tableYear: TABLE.year });
}
