export const UK_PAY_TAX_YEAR = '2026-27';
const ALLOWANCE = 12570, TAPER_START = 100000, NI_PRIMARY = 12570, NI_UPPER = 50270;
function taxByBands(taxable, bands) { let left = Math.max(0, taxable), tax = 0; for (const [width, rate] of bands) { const part = Math.min(left, width); tax += part * rate; left -= part; if (left <= 0) break; } return tax + left * bands.at(-1)[1]; }
export function estimateUkTakeHome({ annualSalary, territory = 'england', pensionPercent = 0 }) {
  const salary = Number(annualSalary), pensionRate = Number(pensionPercent);
  if (!Number.isFinite(salary) || salary < 0 || salary > 10000000 || !Number.isFinite(pensionRate) || pensionRate < 0 || pensionRate > 100 || !['england','scotland','wales','northern-ireland'].includes(territory)) throw new RangeError('Check salary, territory and pension percentage.');
  const qualifying = Math.max(0, Math.min(salary, 50270) - 6240);
  const pension = qualifying * pensionRate / 100;
  const adjustedIncome = Math.max(0, salary - pension);
  const personalAllowance = Math.max(0, ALLOWANCE - Math.max(0, adjustedIncome - TAPER_START) / 2);
  const taxable = Math.max(0, adjustedIncome - personalAllowance);
  const ukBands = [[37700,.20],[74870,.40],[Infinity,.45]];
  const scotlandBands = [[3967,.19],[12989,.20],[14136,.21],[31338,.42],[50140,.45],[Infinity,.48]];
  const incomeTax = taxByBands(taxable, territory === 'scotland' ? scotlandBands : ukBands);
  const nationalInsurance = Math.max(0, Math.min(salary, NI_UPPER) - NI_PRIMARY) * .08 + Math.max(0, salary - NI_UPPER) * .02;
  const annualTakeHome = salary - incomeTax - nationalInsurance - pension;
  return Object.freeze({ taxYear: UK_PAY_TAX_YEAR, territory, annualSalary: salary, personalAllowance, pensionableEarnings: qualifying, pension, taxableIncome: taxable, incomeTax, nationalInsurance, annualTakeHome, monthlyTakeHome: annualTakeHome / 12, weeklyTakeHome: annualTakeHome / 52 });
}
