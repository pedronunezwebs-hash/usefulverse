const MAX_BALANCE = 1e10;
const MAX_RATE_PERCENT = 100;
const MAX_MONTHS = 600;

function number(value, label, min, max) {
  const text = String(value ?? '').trim();
  const parsed = Number(text);
  if (!text || !Number.isFinite(parsed) || parsed < min || parsed > max) throw new RangeError(`${label} is outside the supported range.`);
  return parsed;
}

/**
 * Educational reverse-mortgage balance scenario. Monthly draws and fees are
 * added after monthly interest. Upfront fees are financed at month zero.
 * This is not a lender quote, legal loan estimate, or program eligibility model.
 */
export function calculateReverseMortgage({
  startingBalance, upfrontFees = 0, monthlyAdvance = 0, monthlyFee = 0,
  annualRatePercent = 0, years, homeValue = 0, annualHomeChangePercent = 0,
} = {}) {
  const opening = number(startingBalance, 'Starting balance', 0, MAX_BALANCE);
  const upfront = number(upfrontFees, 'Upfront fees', 0, MAX_BALANCE);
  const advance = number(monthlyAdvance, 'Monthly advance', 0, MAX_BALANCE);
  const fee = number(monthlyFee, 'Monthly fee', 0, MAX_BALANCE);
  const apr = number(annualRatePercent, 'Annual rate', 0, MAX_RATE_PERCENT);
  const termYears = number(years, 'Projection years', 0, MAX_MONTHS / 12);
  const property = number(homeValue, 'Home value', 0, MAX_BALANCE);
  const propertyChange = number(annualHomeChangePercent, 'Annual home-value change', -100, 100);
  const months = Math.round(termYears * 12);
  if (Math.abs(months - termYears * 12) > 1e-9) throw new RangeError('The projection must resolve to whole months.');

  const monthlyRate = apr / 1200;
  let balance = opening + upfront;
  if (!Number.isFinite(balance) || balance > MAX_BALANCE) throw new RangeError('The starting balance is outside the supported range.');
  let interestAccrued = 0;
  let totalAdvances = 0;
  let totalMonthlyFees = 0;
  const schedule = [{ month: 0, balance, homeValue: property, estimatedEquity: property - balance }];
  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    balance += interest + advance + fee;
    interestAccrued += interest;
    totalAdvances += advance;
    totalMonthlyFees += fee;
    if (![balance, interestAccrued, totalAdvances, totalMonthlyFees].every(Number.isFinite) || balance > MAX_BALANCE) {
      throw new RangeError('The projected balance is outside the supported range.');
    }
    if (month % 12 === 0 || month === months) {
      const elapsedYears = month / 12;
      const projectedHomeValue = property * ((1 + propertyChange / 100) ** elapsedYears);
      schedule.push({ month, balance, homeValue: projectedHomeValue, estimatedEquity: projectedHomeValue - balance });
    }
  }
  return Object.freeze({
    openingBalance: opening, upfrontFees: upfront, startingBalance: opening + upfront,
    monthlyAdvance: advance, monthlyFee: fee, annualRatePercent: apr, years: termYears,
    months, interestAccrued, totalAdvances, totalMonthlyFees, endingBalance: balance,
    homeValue: property, hasHomeValueScenario: property > 0, annualHomeChangePercent: propertyChange,
    projectedHomeValue: schedule.at(-1).homeValue,
    estimatedEquity: schedule.at(-1).estimatedEquity,
    schedule: Object.freeze(schedule.map((point) => Object.freeze(point))),
  });
}

export const REVERSE_MORTGAGE_LIMITS = Object.freeze({ maxBalance: MAX_BALANCE, maxRatePercent: MAX_RATE_PERCENT, maxMonths: MAX_MONTHS });
