const FORCE_TO_N = Object.freeze({ N: 1, kN: 1000, lbf: 4.4482216152605 });
const DISTANCE_TO_M = Object.freeze({ m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 });
const TORQUE_TO_NM = Object.freeze({ 'N·m': 1, 'kN·m': 1000, 'lb·ft': 1.3558179483314, 'lb·in': 0.1129848290276 });
const FACTORS = Object.freeze({ force: FORCE_TO_N, arm: DISTANCE_TO_M, torque: TORQUE_TO_NM });
const LIMIT = 1e12;
const missing = (value) => value === '' || value === null || value === undefined;

function factor(dimension, unit) {
  const result = FACTORS[dimension]?.[unit];
  if (!Number.isFinite(result)) throw new TypeError(`Choose a supported ${dimension} unit.`);
  return result;
}

function finite(value, name, { min = 0, max = LIMIT } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

function checked(value) {
  if (!Number.isFinite(value) || Math.abs(value) > 1e18) throw new RangeError('The result is outside the supported range.');
  return value;
}

/** Convert a displayed force, arm length or torque while preserving its physical value. */
export function convertTorqueValue(value, dimension, fromUnit, toUnit) {
  const number = finite(value, dimension, { min: -LIMIT });
  return number * factor(dimension, fromUnit) / factor(dimension, toUnit);
}

/** Calculate torque magnitude from τ = rF sin(θ), or solve its force/arm inverse. */
export function calculateTorque({ mode = 'solve-torque', force, forceUnit = 'N', arm, distanceUnit = 'm', angle = 90, torque, torqueUnit = 'N·m', direction = 'counterclockwise' } = {}) {
  if (!['solve-torque', 'solve-force', 'solve-arm'].includes(mode)) throw new TypeError('Choose a supported calculation.');
  const angleDeg = finite(angle, 'Angle', { max: 180 });
  const radians = angleDeg * Math.PI / 180;
  const sine = Math.sin(radians);
  let forceN = missing(force) ? null : finite(force, 'Force') * factor('force', forceUnit);
  let armM = missing(arm) ? null : finite(arm, 'Lever arm') * factor('arm', distanceUnit);
  let torqueNm = missing(torque) ? null : finite(torque, 'Torque') * factor('torque', torqueUnit);
  const selectedDirection = direction === 'clockwise' ? 'clockwise' : direction === 'counterclockwise' ? 'counterclockwise' : null;
  if (!selectedDirection) throw new TypeError('Choose clockwise or counterclockwise.');

  if (mode === 'solve-torque') {
    if (forceN === null || armM === null || torqueNm !== null) throw new TypeError('Enter force and lever arm, leaving torque blank.');
    forceN = finite(forceN, 'Force', { min: Number.MIN_VALUE, max: LIMIT });
    armM = finite(armM, 'Lever arm', { min: Number.MIN_VALUE, max: LIMIT });
    torqueNm = checked(forceN * armM * sine * (selectedDirection === 'clockwise' ? -1 : 1));
  } else {
    if (forceN !== null && armM !== null && torqueNm !== null) throw new TypeError('Leave the value being solved blank.');
    if (torqueNm === null) throw new TypeError('Enter a torque to solve for force or lever arm.');
    if (Math.abs(sine) < 1e-12) throw new RangeError('A zero perpendicular component cannot determine force or lever arm.');
    torqueNm = finite(torqueNm, 'Torque', { min: Number.MIN_VALUE, max: LIMIT }) * (direction === 'clockwise' ? -1 : 1);
    if (mode === 'solve-force') {
      if (forceN !== null || armM === null) throw new TypeError('Enter lever arm and torque, leaving force blank.');
      armM = finite(armM, 'Lever arm', { min: Number.MIN_VALUE, max: LIMIT });
      forceN = checked(Math.abs(torqueNm) / (armM * Math.abs(sine)));
    } else {
      if (armM !== null || forceN === null) throw new TypeError('Enter force and torque, leaving lever arm blank.');
      forceN = finite(forceN, 'Force', { min: Number.MIN_VALUE, max: LIMIT });
      armM = checked(Math.abs(torqueNm) / (forceN * Math.abs(sine)));
    }
  }
  forceN = finite(forceN, 'Force', { min: Number.MIN_VALUE, max: LIMIT });
  armM = finite(armM, 'Lever arm', { min: Number.MIN_VALUE, max: LIMIT });
  const perpendicularForceN = checked(forceN * Math.abs(sine));
  const momentArmM = checked(armM * Math.abs(sine));
  return Object.freeze({
    mode, forceN, armM, angleDeg, torqueNm,
    force: forceN / factor('force', forceUnit),
    arm: armM / factor('arm', distanceUnit),
    torque: Math.abs(torqueNm) / factor('torque', torqueUnit),
    torqueUnit, forceUnit, distanceUnit,
    direction: torqueNm < 0 ? 'clockwise' : torqueNm > 0 ? 'counterclockwise' : selectedDirection,
    perpendicularForceN, momentArmM,
  });
}
