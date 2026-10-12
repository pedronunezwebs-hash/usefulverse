const MAX_AMOUNT = 1e12;

function boundedNumber(value, min, max, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} is outside the supported range.`);
  return number;
}

function simulate({ startingBalance, monthlyContribution, yearsToRetirement, yearsInRetirement, annualReturnPercent, annualWithdrawal, annualInflationPercent }) {
  const monthlyReturn = annualReturnPercent / 1200;
  const inflationFactor = 1 + annualInflationPercent / 100;
  let balanceAtRetirement = startingBalance;
  const monthsAccumulating = yearsToRetirement * 12;
  for (let month = 0; month < monthsAccumulating; month += 1) {
    balanceAtRetirement = balanceAtRetirement * (1 + monthlyReturn) + monthlyContribution;
    if (!Number.isFinite(balanceAtRetirement) || balanceAtRetirement > MAX_AMOUNT * 1e100) throw new RangeError('The projection exceeds the supported numeric range.');
  }

  let endingBalance = balanceAtRetirement;
  let depletedAtAge = endingBalance <= 0 ? 0 : null;
  for (let month = 0; month < yearsInRetirement * 12 && depletedAtAge === null; month += 1) {
    endingBalance *= 1 + monthlyReturn;
    const annualWithdrawalThisYear = annualWithdrawal * inflationFactor ** Math.floor(month / 12);
    endingBalance -= annualWithdrawalThisYear / 12;
    if (!Number.isFinite(endingBalance)) throw new RangeError('The projection exceeds the supported numeric range.');
    if (endingBalance <= 0) {
      endingBalance = 0;
      depletedAtAge = (month + 1) / 12;
      break;
    }
  }
  return Object.freeze({ balanceAtRetirement, endingBalance, depletedAtAge });
}

export function calculateRetirementProjection(input) {
  const currentAge = boundedNumber(input.currentAge, 18, 99, 'Current age');
  const retirementAge = boundedNumber(input.retirementAge, currentAge + 1, 100, 'Retirement age');
  const planThroughAge = boundedNumber(input.planThroughAge, retirementAge + 1, 110, 'Planning age');
  if (![currentAge, retirementAge, planThroughAge].every(Number.isInteger)) throw new RangeError('Ages must be whole numbers.');
  const currentSavings = boundedNumber(input.currentSavings, 0, MAX_AMOUNT, 'Current savings');
  const monthlyContribution = boundedNumber(input.monthlyContribution, 0, MAX_AMOUNT, 'Monthly contribution');
  const annualWithdrawal = boundedNumber(input.annualWithdrawal, 0, MAX_AMOUNT, 'Annual withdrawal');
  const annualInflationPercent = boundedNumber(input.annualInflationPercent, -20, 100, 'Inflation assumption');
  const annualReturnPercent = boundedNumber(input.annualReturnPercent, -99.99, 100, 'Expected return');
  const conservativeReturnPercent = boundedNumber(input.conservativeReturnPercent, -99.99, 100, 'Conservative return');
  if (conservativeReturnPercent > annualReturnPercent) throw new RangeError('The conservative return cannot exceed the base return.');
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = planThroughAge - retirementAge;
  const common = { startingBalance: currentSavings, monthlyContribution, yearsToRetirement, yearsInRetirement, annualWithdrawal, annualInflationPercent };
  const base = simulate({ ...common, annualReturnPercent });
  const conservative = simulate({ ...common, annualReturnPercent: conservativeReturnPercent });
  const todayPurchasingPowerFactor = (1 + annualInflationPercent / 100) ** yearsToRetirement;

  return Object.freeze({
    currentAge,
    retirementAge,
    planThroughAge,
    yearsToRetirement,
    yearsInRetirement,
    totalContributions: currentSavings + monthlyContribution * yearsToRetirement * 12,
    annualWithdrawal,
    annualInflationPercent,
    annualReturnPercent,
    conservativeReturnPercent,
    purchasingPowerFactor: todayPurchasingPowerFactor,
    base: Object.freeze({
      ...base,
      balanceAtRetirementInTodayMoney: base.balanceAtRetirement / todayPurchasingPowerFactor,
      depletedAtAge: base.depletedAtAge === null ? null : retirementAge + base.depletedAtAge,
    }),
    conservative: Object.freeze({
      ...conservative,
      balanceAtRetirementInTodayMoney: conservative.balanceAtRetirement / todayPurchasingPowerFactor,
      depletedAtAge: conservative.depletedAtAge === null ? null : retirementAge + conservative.depletedAtAge,
    }),
  });
}
