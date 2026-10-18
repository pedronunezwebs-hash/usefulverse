const MAX_MONTHLY_INSURED_SALARY = 12_350;
const WORKDAYS_PER_MONTH = 21.7;
export function estimateSwissUnemploymentAllowance({ insuredMonthlySalary, replacementRate }) {
  const salary = Number(insuredMonthlySalary);
  const percent = Number(replacementRate);
  if (!Number.isFinite(salary) || salary <= 0 || salary > 1_000_000) throw new RangeError('Enter a positive monthly insured salary.');
  if (![70, 80].includes(percent)) throw new RangeError('Replacement rate must be 70% or 80%.');
  const insuredSalary = Math.min(salary, MAX_MONTHLY_INSURED_SALARY);
  const daily = insuredSalary * percent / 100 / WORKDAYS_PER_MONTH;
  return Object.freeze({ enteredMonthlySalary: salary, insuredMonthlySalary: insuredSalary, capped: salary > MAX_MONTHLY_INSURED_SALARY, replacementRate: percent, dailyAllowance: daily, monthlyLow: daily * 20, monthlyTypical: daily * WORKDAYS_PER_MONTH, monthlyHigh: daily * 23 });
}
