const MAX_AMOUNT = 1_000_000_000_000;
const MAX_MONTHS = 1_200;
const MAX_ANNUAL_RATE_PERCENT = 100;

function finiteAmount(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > MAX_AMOUNT) throw new RangeError(`${name} must be between 0 and ${MAX_AMOUNT}.`);
  return number;
}

function finiteInteger(value, name, min, max) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new RangeError(`${name} must be an integer from ${min} to ${max}.`);
  return number;
}

function futureBalance(startingBalance, monthlyContribution, monthlyRate, months, timing) {
  const growth = (1 + monthlyRate) ** months;
  const annuity = monthlyRate === 0
    ? months
    : (growth - 1) / monthlyRate;
  const contributionGrowth = timing === 'beginning' ? annuity * (1 + monthlyRate) : annuity;
  return startingBalance * growth + monthlyContribution * contributionGrowth;
}

export function calculateSavingsGoal({
  mode = 'required-contribution',
  startingBalance,
  targetAmount,
  annualRatePercent = 0,
  months,
  monthlyContribution,
  contributionTiming = 'end',
}) {
  const start = finiteAmount(startingBalance, 'Starting balance');
  const target = finiteAmount(targetAmount, 'Target amount');
  const annualRate = Number(annualRatePercent);
  if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > MAX_ANNUAL_RATE_PERCENT) {
    throw new RangeError(`Annual rate must be between 0 and ${MAX_ANNUAL_RATE_PERCENT} percent.`);
  }
  if (!['required-contribution', 'months-to-goal'].includes(mode)) throw new RangeError('Choose a supported goal mode.');
  if (!['end', 'beginning'].includes(contributionTiming)) throw new RangeError('Choose beginning or end of month contributions.');
  const rate = annualRate / 1_200;

  if (mode === 'required-contribution') {
    const periodCount = finiteInteger(months, 'Months', 1, MAX_MONTHS);
    const zeroContributionBalance = futureBalance(start, 0, rate, periodCount, contributionTiming);
    const annuityFactor = futureBalance(0, 1, rate, periodCount, contributionTiming);
    const required = Math.max(0, (target - zeroContributionBalance) / annuityFactor);
    const projected = futureBalance(start, required, rate, periodCount, contributionTiming);
    return {
      mode,
      months: periodCount,
      requiredMonthlyContribution: required,
      projectedBalance: projected,
      totalContributions: required * periodCount,
      estimatedInterest: projected - start - required * periodCount,
      goalAlreadyReachedByDeadline: zeroContributionBalance >= target,
      horizonCapped: false,
      unreachable: false,
      contributionTiming,
      monthlyRatePercent: rate * 100,
    };
  }

  const payment = finiteAmount(monthlyContribution, 'Monthly contribution');
  if (futureBalance(start, payment, rate, 0, contributionTiming) >= target) {
    return {
      mode,
      months: 0,
      monthlyContribution: payment,
      projectedBalance: start,
      totalContributions: 0,
      estimatedInterest: 0,
      goalAlreadyReachedByDeadline: true,
      horizonCapped: false,
      unreachable: false,
      contributionTiming,
      monthlyRatePercent: rate * 100,
    };
  }
  if (payment === 0 && (start === 0 || rate === 0)) {
    return {
      mode,
      months: null,
      monthlyContribution: 0,
      projectedBalance: start,
      totalContributions: 0,
      estimatedInterest: 0,
      goalAlreadyReachedByDeadline: false,
      horizonCapped: false,
      unreachable: true,
      contributionTiming,
      monthlyRatePercent: rate * 100,
    };
  }

  if (futureBalance(start, payment, rate, MAX_MONTHS, contributionTiming) < target) {
    return {
      mode,
      months: null,
      monthlyContribution: payment,
      projectedBalance: futureBalance(start, payment, rate, MAX_MONTHS, contributionTiming),
      totalContributions: payment * MAX_MONTHS,
      estimatedInterest: futureBalance(start, payment, rate, MAX_MONTHS, contributionTiming) - start - payment * MAX_MONTHS,
      goalAlreadyReachedByDeadline: false,
      horizonCapped: true,
      unreachable: false,
      contributionTiming,
      monthlyRatePercent: rate * 100,
    };
  }

  let low = 1;
  let high = MAX_MONTHS;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (futureBalance(start, payment, rate, middle, contributionTiming) >= target) high = middle;
    else low = middle + 1;
  }
  const projected = futureBalance(start, payment, rate, low, contributionTiming);
  return {
    mode,
    months: low,
    monthlyContribution: payment,
    projectedBalance: projected,
    totalContributions: payment * low,
    estimatedInterest: projected - start - payment * low,
    goalAlreadyReachedByDeadline: false,
    horizonCapped: false,
    unreachable: false,
    contributionTiming,
    monthlyRatePercent: rate * 100,
  };
}
