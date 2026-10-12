const MIN_HEIGHT_CM = 50;
const MAX_HEIGHT_CM = 250;
const MIN_WEIGHT_KG = 10;
const MAX_WEIGHT_KG = 500;
const INCH_TO_CM = 2.54;
const LB_TO_KG = 0.45359237;

function checked(value, min, max, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} is outside the supported range.`);
  return number;
}

/** Estimate adult BSA; this is not a measurement or a dosing recommendation. */
export function calculateBodySurfaceArea({ height, heightUnit = 'cm', weight, weightUnit = 'kg' } = {}) {
  if (!['cm', 'in'].includes(heightUnit) || !['kg', 'lb'].includes(weightUnit)) throw new RangeError('Choose supported height and weight units.');
  const enteredHeight = checked(height, 1, 1_000, 'Height');
  const enteredWeight = checked(weight, 1, 2_000, 'Weight');
  const heightCm = heightUnit === 'in' ? enteredHeight * INCH_TO_CM : enteredHeight;
  const weightKg = weightUnit === 'lb' ? enteredWeight * LB_TO_KG : enteredWeight;
  if (heightCm < MIN_HEIGHT_CM || heightCm > MAX_HEIGHT_CM || weightKg < MIN_WEIGHT_KG || weightKg > MAX_WEIGHT_KG) throw new RangeError('Converted measurements are outside the supported adult estimate range.');
  const mosteller = Math.sqrt((heightCm * weightKg) / 3_600);
  const duBois = 0.007184 * weightKg ** 0.425 * heightCm ** 0.725;
  if (![mosteller, duBois].every(Number.isFinite)) throw new RangeError('Could not calculate an estimate from these measurements.');
  return Object.freeze({ heightCm, weightKg, mosteller, duBois, difference: mosteller - duBois });
}

export const BODY_SURFACE_AREA_LIMITS = Object.freeze({ minHeightCm: MIN_HEIGHT_CM, maxHeightCm: MAX_HEIGHT_CM, minWeightKg: MIN_WEIGHT_KG, maxWeightKg: MAX_WEIGHT_KG });
