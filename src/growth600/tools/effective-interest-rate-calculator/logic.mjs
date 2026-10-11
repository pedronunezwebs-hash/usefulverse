export const COMPOUNDING_FREQUENCIES = Object.freeze({
  annual: 1,
  semiannual: 2,
  quarterly: 4,
  monthly: 12,
  twiceMonthly: 24,
  biweekly: 26,
  weekly: 52,
  daily: 365,
  continuous: 'continuous',
});

const MAX_RATE_PERCENT = 1_000_000;

function validRate(value, name) {
  const rate = Number(value);
  if (!Number.isFinite(rate) || rate < 0 || rate > MAX_RATE_PERCENT) {
    throw new RangeError(`${name} must be between 0 and ${MAX_RATE_PERCENT} percent.`);
  }
  return rate / 100;
}

function validFrequency(value) {
  if (!Object.hasOwn(COMPOUNDING_FREQUENCIES, value)) throw new RangeError('Choose a supported compounding frequency.');
  return COMPOUNDING_FREQUENCIES[value];
}

function boundedPercent(rate, name) {
  const percent = rate * 100;
  if (!Number.isFinite(percent) || percent > MAX_RATE_PERCENT) throw new RangeError(`${name} is outside the supported numeric range.`);
  return percent;
}

export function calculateEffectiveInterest({ mode, ratePercent, frequency }) {
  const compounds = validFrequency(frequency);
  const inputRate = validRate(ratePercent, mode === 'apr-to-apy' ? 'APR' : 'APY');
  if (!['apr-to-apy', 'apy-to-apr'].includes(mode)) throw new RangeError('Choose APR to APY or APY to APR.');

  let apr;
  let apy;
  let periodicRate;
  if (mode === 'apr-to-apy') {
    apr = inputRate;
    periodicRate = compounds === 'continuous' ? null : apr / compounds;
    apy = compounds === 'continuous' ? Math.expm1(apr) : Math.expm1(compounds * Math.log1p(periodicRate));
  } else {
    apy = inputRate;
    const logGrowth = Math.log1p(apy);
    periodicRate = compounds === 'continuous' ? null : Math.expm1(logGrowth / compounds);
    apr = compounds === 'continuous' ? logGrowth : compounds * periodicRate;
  }

  return Object.freeze({
    mode,
    frequency,
    aprPercent: boundedPercent(apr, 'APR'),
    apyPercent: boundedPercent(apy, 'APY'),
    periodicRatePercent: periodicRate === null ? null : boundedPercent(periodicRate, 'Periodic rate'),
    compoundsPerYear: compounds,
  });
}
