const LIMIT = 1_000_000_000_000;
const MAX_PERIODS = 1_200;
const MAX_COUPON_PERCENT = 1_000;
const MAX_YIELD_PERCENT = 1_000_000;
const FREQUENCIES = Object.freeze({ annual: 1, semiannual: 2, quarterly: 4, monthly: 12 });

function number(value, name, { min = 0, max = LIMIT, exclusiveMin = false } = {}) {
  const result = Number(value);
  if (!Number.isFinite(result) || (exclusiveMin ? result <= min : result < min) || result > max) {
    throw new RangeError(`${name} is outside the supported range.`);
  }
  return result;
}

function terms(input) {
  const faceValue = number(input.faceValue, 'Face value', { min: 0, exclusiveMin: true });
  const couponPercent = number(input.couponPercent, 'Coupon rate', { max: MAX_COUPON_PERCENT });
  const years = number(input.years, 'Years to maturity', { min: 0, max: 100, exclusiveMin: true });
  const frequency = typeof input.frequency === 'number'
    ? input.frequency
    : FREQUENCIES[input.frequency];
  if (![1, 2, 4, 12].includes(frequency)) throw new RangeError('Choose a supported coupon frequency.');
  const periods = years * frequency;
  const roundedPeriods = Math.round(periods);
  if (roundedPeriods < 1 || roundedPeriods > MAX_PERIODS || Math.abs(periods - roundedPeriods) > 1e-8) {
    const error = new RangeError('Maturity must contain a whole number of coupon periods, up to 1,200.');
    error.code = 'invalidPeriods';
    throw error;
  }
  const coupon = faceValue * couponPercent / 100 / frequency;
  return { faceValue, couponPercent, years, frequency, periods: roundedPeriods, coupon };
}

export function bondPriceAtYield({ faceValue, couponPercent, years, frequency }, annualYieldPercent) {
  const bond = terms({ faceValue, couponPercent, years, frequency });
  const annualYield = number(annualYieldPercent, 'Yield', { min: -bond.frequency * 99.999999, max: MAX_YIELD_PERCENT });
  const periodRate = annualYield / 100 / bond.frequency;
  if (periodRate <= -1) throw new RangeError('Yield must keep each discount period above −100%.');
  const denominator = 1 + periodRate;
  let price = 0;
  for (let period = 1; period <= bond.periods; period += 1) {
    price += bond.coupon / denominator ** period;
    if (period === bond.periods) price += bond.faceValue / denominator ** period;
    if (!Number.isFinite(price) || price > LIMIT) throw new RangeError('The resulting price exceeds the supported range.');
  }
  return price;
}

export function solveBondYield(input) {
  const bond = terms(input);
  const marketPrice = number(input.marketPrice, 'Market price', { min: 0, exclusiveMin: true });
  const priceForPeriodRate = (periodRate) => {
    let result = 0;
    for (let period = 1; period <= bond.periods; period += 1) {
      const discounted = (bond.coupon + (period === bond.periods ? bond.faceValue : 0)) / (1 + periodRate) ** period;
      result += discounted;
      if (!Number.isFinite(result)) return Infinity;
    }
    return result;
  };

  let low = -0.999999999;
  const maxPeriodicRate = MAX_YIELD_PERCENT / 100 / bond.frequency;
  let high = Math.min(1, maxPeriodicRate);
  if (priceForPeriodRate(low) < marketPrice) {
    const error = new RangeError('The entered price has no supported yield in the numerical range.');
    error.code = 'yieldOutOfRange';
    throw error;
  }
  while (priceForPeriodRate(high) > marketPrice && high < maxPeriodicRate) high = Math.min(high * 2 + 1, maxPeriodicRate);
  if (priceForPeriodRate(high) > marketPrice) {
    const error = new RangeError('The entered price has no supported yield in the numerical range.');
    error.code = 'yieldOutOfRange';
    throw error;
  }
  for (let iteration = 0; iteration < 120; iteration += 1) {
    const mid = (low + high) / 2;
    if (priceForPeriodRate(mid) > marketPrice) low = mid;
    else high = mid;
  }
  const periodicYield = (low + high) / 2;
  return Object.freeze({
    ...bond,
    marketPrice,
    yieldPercent: periodicYield * bond.frequency * 100,
    couponPayment: bond.coupon,
    currentYieldPercent: bond.coupon / marketPrice * 100,
    priceAtYield: marketPrice,
    periods: bond.periods,
  });
}

export function calculateBondPrice(input) {
  const bond = terms(input);
  const yieldPercent = number(input.yieldPercent, 'Yield', { min: -bond.frequency * 99.999999, max: MAX_YIELD_PERCENT });
  const price = bondPriceAtYield(bond, yieldPercent);
  const difference = price - bond.faceValue;
  const premiumDiscount = Math.abs(difference) <= Number.EPSILON * Math.max(price, bond.faceValue) * 4 ? 0 : difference;
  return Object.freeze({
    ...bond,
    yieldPercent,
    price,
    couponPayment: bond.coupon,
    totalCouponPayments: bond.coupon * bond.periods,
    premiumDiscount,
  });
}

export function buildBondYieldCurve(input, centerYieldPercent) {
  const bond = terms(input);
  const center = number(centerYieldPercent, 'Yield', { min: -bond.frequency * 99.999999, max: MAX_YIELD_PERCENT });
  const spread = Math.max(2, Math.min(20, Math.abs(center) * 0.35));
  const minYield = Math.max(-bond.frequency * 99.999999, center - spread);
  const maxYield = Math.min(MAX_YIELD_PERCENT, center + spread);
  const points = Array.from({ length: 41 }, (_, index) => {
    const yieldPercent = minYield + (maxYield - minYield) * index / 40;
    let price;
    try { price = bondPriceAtYield(bond, yieldPercent); } catch { price = null; }
    return Object.freeze({ yieldPercent, price });
  });
  return Object.freeze(points);
}
