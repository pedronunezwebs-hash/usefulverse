const MAX_PRICE = 1e9;
const MAX_YEARS = 50;
const MAX_DISTANCE = 1e7;

function finite(value, label, min, max, integer = false) {
  const n = typeof value === 'number' ? value : Number(String(value ?? '').trim());
  if (!Number.isFinite(n) || n < min || n > max || (integer && !Number.isInteger(n))) throw new RangeError(`${label} is outside the supported range.`);
  return Object.is(n, -0) ? 0 : n;
}

function depreciationFactor(percent, units) {
  const fraction = percent / 100;
  return units === 0 ? 1 : (1 - fraction) ** units;
}

/** User-assumption scenario only; it is not a vehicle appraisal or market quote. */
export function calculateCarDepreciation({
  purchasePrice, yearsOwned, odometerAtPurchase, currentDistance, annualDistance,
  annualDepreciationPercent, distanceDepreciationPercent, projectionYears,
  distanceUnit = 'mi', currency = 'USD',
} = {}) {
  const price = finite(purchasePrice, 'Purchase price', 0.01, MAX_PRICE);
  const age = finite(yearsOwned, 'Years owned', 0, MAX_YEARS);
  const startingOdometer = finite(odometerAtPurchase, 'Odometer at purchase', 0, MAX_DISTANCE);
  const odometer = finite(currentDistance, 'Current distance', 0, MAX_DISTANCE);
  if (odometer < startingOdometer) throw new RangeError('Current odometer must not be below the odometer at purchase.');
  const yearlyDistance = finite(annualDistance, 'Annual distance', 0, MAX_DISTANCE);
  const annualRate = finite(annualDepreciationPercent, 'Annual depreciation', 0, 100);
  const distanceRate = finite(distanceDepreciationPercent, 'Distance depreciation', 0, 100);
  const term = finite(projectionYears, 'Projection years', 0, MAX_YEARS, true);
  if (!['km', 'mi'].includes(distanceUnit)) throw new RangeError('Choose km or mi.');
  if (!/^[A-Z]{3}$/u.test(currency) || !['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL', 'MXN', 'CHF', 'NZD'].includes(currency)) throw new RangeError('Choose a supported display currency.');

  const annualFactor = 1 - annualRate / 100;
  const distanceSincePurchase = odometer - startingOdometer;
  const distanceFactor = depreciationFactor(distanceRate, distanceSincePurchase / 10000);
  let value = price * depreciationFactor(annualRate, age) * distanceFactor;
  if (!Number.isFinite(value)) throw new RangeError('The estimated value is outside the supported range.');
  const currentValue = value;
  const schedule = [{ year: 0, age, distance: odometer, value }];
  for (let year = 1; year <= term; year += 1) {
    value *= annualFactor * depreciationFactor(distanceRate, yearlyDistance / 10000);
    if (!Number.isFinite(value)) throw new RangeError('The projected value is outside the supported range.');
    schedule.push({ year, age: age + year, distance: odometer + yearlyDistance * year, value });
  }
  const projectedLoss = currentValue - value;
  return Object.freeze({
    purchasePrice: price, yearsOwned: age, odometerAtPurchase: startingOdometer, currentDistance: odometer, distanceSincePurchase, annualDistance: yearlyDistance,
    annualDepreciationPercent: annualRate, distanceDepreciationPercent: distanceRate,
    projectionYears: term, distanceUnit, currency, currentValue, projectedValue: value,
    lossSincePurchase: price - currentValue, projectedLoss,
    projectedLossPercent: currentValue === 0 ? 0 : projectedLoss / currentValue * 100,
    schedule: Object.freeze(schedule.map((point) => Object.freeze(point))),
  });
}

export const CAR_DEPRECIATION_LIMITS = Object.freeze({ maxPrice: MAX_PRICE, maxYears: MAX_YEARS, maxDistance: MAX_DISTANCE });
