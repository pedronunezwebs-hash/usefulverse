const MAX_RENT = 1_000_000;
const MAX_RATE = 5;
const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

function amount(value, name, { min = 0, max = MAX_RENT } = {}) {
  if (typeof value === 'string' && !value.trim()) throw new TypeError(`${name} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

/** Reference-rate-only Swiss residential-rent scenario, excluding other legal factors. */
export function calculateSwissRentReferenceScenario(input) {
  const monthlyRent = amount(input?.monthlyRent, 'Monthly net rent', { min: 0.01 });
  const leaseRate = amount(input?.leaseRate, 'Rate stated in the lease', { max: MAX_RATE });
  const currentRate = amount(input?.currentRate, 'Current official reference rate', { max: MAX_RATE });
  const stepCount = Math.round((currentRate - leaseRate) / 0.25);
  if (Math.abs(currentRate - leaseRate - stepCount * 0.25) > 1e-8) throw new RangeError('Reference rates must differ in quarter-point increments.');
  const multiplier = stepCount >= 0 ? (1.03 ** stepCount) : ((1 / 1.03) ** Math.abs(stepCount));
  const changePercent = (multiplier - 1) * 100;
  const monthlyChange = round(monthlyRent * changePercent / 100);
  return Object.freeze({
    monthlyRent: round(monthlyRent), leaseRate,
    currentRate, stepCount, changePercent: round(changePercent),
    monthlyReferenceEffect: monthlyChange,
    scenarioMonthlyRent: round(monthlyRent + monthlyChange),
    annualReferenceEffect: round(monthlyChange * 12),
  });
}

export const swissRentAdjustmentScope = Object.freeze({ maximumReferenceRate: MAX_RATE, referenceStep: 0.25, increasePerStepPercent: 3, decreasePerStepPercent: 1 - 1 / 1.03 });
