const MAX_DIMENSION_MM = 1_000_000;
const MAX_RPM = 1_000_000_000;

function positive(value, label, maximum = Number.MAX_SAFE_INTEGER, { allowZero = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < (allowZero ? 0 : Number.MIN_VALUE) || number > maximum) {
    throw new RangeError(`${label} must be ${allowZero ? 'at least zero' : 'greater than zero'} and no more than ${maximum}.`);
  }
  return number;
}

/** Estimate an ideal two-sheave open-belt drive using a common pitch-length approximation. */
export function calculatePulley({ driverDiameter, drivenDiameter, centerDistance, inputRpm, unit = 'mm' }) {
  if (!['mm', 'in'].includes(unit)) throw new RangeError('Choose millimeters or inches.');
  const scaleToMm = unit === 'mm' ? 1 : 25.4;
  const driver = positive(driverDiameter, 'Driver pulley diameter', MAX_DIMENSION_MM / scaleToMm) * scaleToMm;
  const driven = positive(drivenDiameter, 'Driven pulley diameter', MAX_DIMENSION_MM / scaleToMm) * scaleToMm;
  const centers = positive(centerDistance, 'Center distance', MAX_DIMENSION_MM / scaleToMm) * scaleToMm;
  const rpm = positive(inputRpm, 'Input RPM', MAX_RPM, { allowZero: true });
  const small = Math.min(driver, driven);
  const large = Math.max(driver, driven);
  if (centers <= (large - small) / 2) throw new RangeError('Center distance is too short for this open-belt geometry.');

  // Gates approximation: L ≈ 2C + 1.57(D+d) + (D-d)^2/(4C), dimensions in one unit.
  const beltLengthMm = 2 * centers + 1.57 * (large + small) + ((large - small) ** 2) / (4 * centers);
  const outputRpm = rpm * driver / driven;
  const beltSpeedMetersPerSecond = Math.PI * (driver / 1000) * rpm / 60;
  const smallWrapRadians = Math.PI - 2 * Math.asin((large - small) / (2 * centers));
  if (![beltLengthMm, outputRpm, beltSpeedMetersPerSecond, smallWrapRadians].every(Number.isFinite)) {
    throw new RangeError('The result is too large to represent safely.');
  }

  return Object.freeze({
    driverDiameterMm: driver, drivenDiameterMm: driven, smallDiameterMm: small, largeDiameterMm: large,
    centerDistanceMm: centers, beltLengthMm, beltLength: beltLengthMm / scaleToMm,
    centerDistance: centers / scaleToMm, unit, inputRpm, outputRpm,
    speedRatio: driver / driven, beltSpeedMetersPerSecond,
    beltSpeedFeetPerMinute: beltSpeedMetersPerSecond * 196.8503937007874,
    smallWrapDegrees: smallWrapRadians * 180 / Math.PI, isEqualPulleyDrive: driver === driven,
  });
}
