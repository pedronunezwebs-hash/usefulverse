const MAX_MEASUREMENT = 500;

function measurement(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > MAX_MEASUREMENT) {
    throw new RangeError(`${name} must be greater than 0 and no more than ${MAX_MEASUREMENT}.`);
  }
  return number;
}

/** Returns a dimensionless ratio. Inputs must use one shared unit. */
export function calculateWaistHipRatio({ waist, hip, unit }) {
  if (!['cm', 'in'].includes(unit)) throw new RangeError('Choose centimeters or inches.');
  const waistValue = measurement(waist, 'Waist');
  const hipValue = measurement(hip, 'Hip');
  return Object.freeze({ waist: waistValue, hip: hipValue, unit, ratio: waistValue / hipValue });
}
