const MAX_MONEY = 1e12;
const MAX_MONTHS = 60 * 12;

function bounded(value, min, max, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} is outside the supported range.`);
  return number;
}

/**
 * Illustrative 401(k) projection. Contributions are level monthly amounts,
 * credited at month-end; the opening balance is assumed fully vested. The
 * entered vesting percentage applies uniformly to all projected employer match.
 */
export function calculate401kProjection(input) {
  const salary = bounded(input.annualSalary, 0, MAX_MONEY, 'Annual salary');
  const currentBalance = bounded(input.currentBalance, 0, MAX_MONEY, 'Current balance');
  const employeePercent = bounded(input.employeeContributionPercent, 0, 100, 'Employee contribution');
  const matchPercent = bounded(input.employerMatchPercent, 0, 500, 'Employer match');
  const matchLimitPercent = bounded(input.matchLimitPercent, 0, 100, 'Match limit');
  const vestingPercent = bounded(input.vestingPercent, 0, 100, 'Vesting');
  const years = bounded(input.years, 0, 60, 'Projection years');
  const annualReturnPercent = bounded(input.annualReturnPercent, -99.99, 100, 'Annual return');
  if (!Number.isInteger(years)) throw new RangeError('Projection years must be a whole number.');

  const eligiblePercent = Math.min(employeePercent, matchLimitPercent);
  const annualEmployeeContribution = salary * employeePercent / 100;
  const annualEmployerMatch = salary * eligiblePercent / 100 * matchPercent / 100;
  const annualVestedMatch = annualEmployerMatch * vestingPercent / 100;
  const monthlyReturn = annualReturnPercent / 1200;
  const monthlyEmployeeContribution = annualEmployeeContribution / 12;
  const monthlyEmployerMatch = annualEmployerMatch / 12;
  const monthlyVestedMatch = annualVestedMatch / 12;
  let accountBalance = currentBalance;
  let vestedBalance = currentBalance;
  let employeeContributions = 0;
  let employerContributions = 0;
  const yearly = [];

  if (years * 12 > MAX_MONTHS) throw new RangeError('Projection is too long.');
  for (let month = 1; month <= years * 12; month += 1) {
    accountBalance = accountBalance * (1 + monthlyReturn) + monthlyEmployeeContribution + monthlyEmployerMatch;
    vestedBalance = vestedBalance * (1 + monthlyReturn) + monthlyEmployeeContribution + monthlyVestedMatch;
    employeeContributions += monthlyEmployeeContribution;
    employerContributions += monthlyEmployerMatch;
    if (![accountBalance, vestedBalance, employeeContributions, employerContributions].every(Number.isFinite)
      || accountBalance > MAX_MONEY * 1e100) throw new RangeError('The projection exceeds the supported numeric range.');
    if (month % 12 === 0) yearly.push(Object.freeze({ year: month / 12, accountBalance, vestedBalance }));
  }

  return Object.freeze({
    annualEmployeeContribution,
    annualEmployerMatch,
    annualVestedMatch,
    totalAnnualContribution: annualEmployeeContribution + annualEmployerMatch,
    employeeContributions,
    employerContributions,
    vestedEmployerContributions: annualVestedMatch * years,
    accountBalance,
    vestedBalance,
    yearly: Object.freeze(yearly),
  });
}
