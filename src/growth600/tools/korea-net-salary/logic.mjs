const PENSION_MINIMUM = 410_000;
const PENSION_MAXIMUM = 6_590_000;
const PENSION_EMPLOYEE_RATE = 0.0475;
const HEALTH_EMPLOYEE_RATE = 0.03595;
const LONG_TERM_CARE_RATE = 0.9448 / 7.19;
const EMPLOYMENT_EMPLOYEE_RATE = 0.009;
const CHILD_WITHHOLDING_REDUCTION = [0, 12_500, 29_160];

const fail = (code) => { throw Object.assign(new Error(code), { code }); };

function findWithholdingRow(monthlySalary, table) {
  const salaryThousands = Math.floor(monthlySalary / 1_000);
  let low = 0;
  let high = table.length - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const row = table[middle];
    if (salaryThousands < row[0]) high = middle - 1;
    else if (salaryThousands >= row[1]) low = middle + 1;
    else return row;
  }
  return null;
}

function roundDownToTen(value) {
  return Math.floor(value / 10) * 10;
}

function roundWon(value) {
  return Math.round(value);
}

export function estimateKoreaNetSalary(monthlyTaxableSalary, eligibleFamilyMembers, eligibleChildren, withholdingRatio = 100, asOf = new Date().toISOString().slice(0, 10), withholdingTable = []) {
  if (asOf < '2026-07-01' || asOf >= '2027-01-01') fail('table-unavailable');
  const salary = Number(monthlyTaxableSalary);
  const familyCount = Number(eligibleFamilyMembers);
  const childCount = Number(eligibleChildren);
  const ratio = Number(withholdingRatio);
  if (!Number.isSafeInteger(salary) || salary < 1_000_000 || salary >= 10_000_000) fail('invalid-salary');
  if (!Number.isInteger(familyCount) || familyCount < 1 || familyCount > 11) fail('invalid-family-count');
  if (!Number.isInteger(childCount) || childCount < 0 || childCount > familyCount) fail('invalid-child-count');
  if (![80, 100, 120].includes(ratio)) fail('invalid-withholding-ratio');

  if (!Array.isArray(withholdingTable) || !withholdingTable.length) fail('table-load-failed');
  const row = findWithholdingRow(salary, withholdingTable);
  if (!row) fail('table-unavailable');
  const baseWithholdingTax = row[familyCount + 1];
  const childReduction = childCount <= 2
    ? CHILD_WITHHOLDING_REDUCTION[childCount]
    : CHILD_WITHHOLDING_REDUCTION[2] + (childCount - 2) * 25_000;
  const nationalIncomeTax = roundDownToTen(Math.max(0, baseWithholdingTax - childReduction) * ratio / 100);
  const localIncomeTax = roundDownToTen(nationalIncomeTax * 0.1);

  const pensionableSalary = Math.min(Math.max(salary, PENSION_MINIMUM), PENSION_MAXIMUM);
  const nationalPension = roundWon(pensionableSalary * PENSION_EMPLOYEE_RATE);
  const healthInsurance = roundWon(salary * HEALTH_EMPLOYEE_RATE);
  const longTermCare = roundWon(healthInsurance * LONG_TERM_CARE_RATE);
  const employmentInsurance = roundWon(salary * EMPLOYMENT_EMPLOYEE_RATE);
  const employeeDeductions = nationalPension + healthInsurance + longTermCare + employmentInsurance + nationalIncomeTax + localIncomeTax;

  return Object.freeze({
    monthlyTaxableSalary: salary,
    eligibleFamilyMembers: familyCount,
    eligibleChildren: childCount,
    withholdingRatio: ratio,
    pensionableSalary,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    baseWithholdingTax,
    childReduction,
    nationalIncomeTax,
    localIncomeTax,
    employeeDeductions,
    estimatedNetSalary: salary - employeeDeductions,
    tableYear: 2026,
    effectiveFrom: '2026-07-01',
  });
}
