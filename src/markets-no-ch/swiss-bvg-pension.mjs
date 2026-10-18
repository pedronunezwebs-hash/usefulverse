const LIMITS = Object.freeze({
  2026: Object.freeze({ entryThreshold: 22_680, coordinationDeduction: 26_460, minimumCoordinatedSalary: 3_780, maximumSalary: 90_720 }),
  2027: Object.freeze({ entryThreshold: 23_040, coordinationDeduction: 26_880, minimumCoordinatedSalary: 3_840, maximumSalary: 92_160 }),
});
const MAX_CHF = 1_000_000_000;
function amount(value, name, { min = 0, max = MAX_CHF } = {}) {
  if (typeof value === 'string' && !value.trim()) throw new TypeError(`${name} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}
function creditedRate(age) {
  if (age < 25 || age > 65) return 0;
  if (age <= 34) return 0.07;
  if (age <= 44) return 0.10;
  if (age <= 54) return 0.15;
  return 0.18;
}
export const swissBvgParameters = LIMITS;

/** A dated BVG compulsory-minimum scenario. Plan-specific extra-mandatory terms are not inferred. */
export function calculateSwissBvgScenario({ year, annualSalary, age, retirementAge, currentMandatoryBalance, annualSalaryGrowth = 0, interestRate = 1.25, conversionRate = 6.8 }) {
  const taxYear = Number(year);
  const limits = LIMITS[taxYear];
  if (!limits) throw new RangeError('Choose 2026 or 2027.');
  const salary = amount(annualSalary, 'Annual salary');
  const currentAge = amount(age, 'Age', { min: 17, max: 69 });
  const endAge = amount(retirementAge, 'Retirement age', { min: 58, max: 70 });
  if (!Number.isInteger(currentAge) || !Number.isInteger(endAge)) throw new RangeError('Ages must be whole years.');
  if (endAge <= currentAge) throw new RangeError('Retirement age must be later than current age.');
  const balance = amount(currentMandatoryBalance, 'Current mandatory BVG balance');
  const growth = amount(annualSalaryGrowth, 'Annual salary growth', { min: 0, max: 20 }) / 100;
  const interest = amount(interestRate, 'Interest assumption', { min: 0, max: 20 }) / 100;
  const annuityRate = amount(conversionRate, 'Conversion-rate assumption', { min: 0, max: 20 }) / 100;
  const insuredSalary = salary < limits.entryThreshold ? 0 : Math.min(limits.maximumSalary, Math.max(limits.minimumCoordinatedSalary, Math.min(salary, limits.maximumSalary) - limits.coordinationDeduction));
  const currentAgeRate = creditedRate(currentAge);
  let projectedBalance = balance;
  let projectedSalary = salary;
  let totalCredits = 0;
  const annualCredits = [];
  for (let contributionAge = Math.ceil(currentAge); contributionAge < endAge; contributionAge += 1) {
    const rate = creditedRate(contributionAge);
    const insured = projectedSalary < limits.entryThreshold ? 0 : Math.min(limits.maximumSalary, Math.max(limits.minimumCoordinatedSalary, Math.min(projectedSalary, limits.maximumSalary) - limits.coordinationDeduction));
    const credit = Math.round(insured * rate * 100) / 100;
    totalCredits += credit;
    annualCredits.push({ age: contributionAge, insuredSalary: insured, rate, credit });
    projectedBalance = (projectedBalance + credit) * (1 + interest);
    projectedSalary *= 1 + growth;
  }
  projectedBalance = Math.round(projectedBalance * 100) / 100;
  const estimatedAnnualPension = Math.round(projectedBalance * annuityRate * 100) / 100;
  return Object.freeze({
    year: taxYear, annualSalary: salary, age: currentAge, retirementAge: endAge,
    entryThreshold: limits.entryThreshold, coordinationDeduction: limits.coordinationDeduction,
    minimumCoordinatedSalary: limits.minimumCoordinatedSalary, maximumSalary: limits.maximumSalary,
    insuredSalary, currentAgeAccrualRate: currentAgeRate,
    currentAgeAnnualCredit: Math.round(insuredSalary * currentAgeRate * 100) / 100,
    currentMandatoryBalance: balance, totalFutureCreditsBeforeInterest: Math.round(totalCredits * 100) / 100,
    projectedMandatoryBalance: projectedBalance, assumedInterestRate: interest,
    assumedAnnualSalaryGrowth: growth, assumedConversionRate: annuityRate,
    estimatedAnnualPension, estimatedMonthlyPension: Math.round(estimatedAnnualPension / 12 * 100) / 100,
    contributionYears: annualCredits.filter(({ credit }) => credit > 0).length,
  });
}
