const G0 = 9.80665;
const TWO_PI = 2 * Math.PI;
const MAX_MASS_KG = 1e9;
const MAX_RADIUS_M = 1e6;
const MAX_SPEED_MPS = 100_000;

function read(input, key, min, max) {
  const raw = input?.[key];
  const value = typeof raw === 'string' && raw.trim() === '' ? NaN : Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${key} is outside the supported range.`);
  return value;
}

const MASS_TO_KG = Object.freeze({ kg: 1, g: 0.001, lb: 0.45359237 });
const LENGTH_TO_M = Object.freeze({ m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 });
const SPEED_TO_MPS = Object.freeze({ 'm/s': 1, 'km/h': 1 / 3.6, mph: 0.44704 });

export function calculateCentripetalForce(input = {}) {
  const massUnit = input.massUnit ?? 'kg';
  const lengthUnit = input.lengthUnit ?? 'm';
  const mode = input.mode ?? 'speed';
  if (!Object.hasOwn(MASS_TO_KG, massUnit) || !Object.hasOwn(LENGTH_TO_M, lengthUnit) || !['speed', 'rotation'].includes(mode)) throw new TypeError('Choose supported units and input mode.');
  const massKg = read(input, 'mass', 1e-12, MAX_MASS_KG) * MASS_TO_KG[massUnit];
  const radiusMeters = read(input, 'radius', 1e-9, MAX_RADIUS_M) * LENGTH_TO_M[lengthUnit];
  let speedMetersPerSecond;
  let rotationalFrequencyHz;
  if (mode === 'speed') {
    const speedUnit = input.speedUnit ?? 'm/s';
    if (!Object.hasOwn(SPEED_TO_MPS, speedUnit)) throw new TypeError('Choose a supported speed unit.');
    speedMetersPerSecond = read(input, 'speed', 0, MAX_SPEED_MPS / SPEED_TO_MPS[speedUnit]) * SPEED_TO_MPS[speedUnit];
    rotationalFrequencyHz = speedMetersPerSecond / (TWO_PI * radiusMeters);
  } else {
    const frequencyUnit = input.frequencyUnit ?? 'rpm';
    if (!['rpm', 'hz'].includes(frequencyUnit)) throw new TypeError('Choose rpm or hertz.');
    const frequency = read(input, 'frequency', 0, frequencyUnit === 'rpm' ? 1e9 : 1e7);
    rotationalFrequencyHz = frequencyUnit === 'rpm' ? frequency / 60 : frequency;
    speedMetersPerSecond = TWO_PI * radiusMeters * rotationalFrequencyHz;
    if (speedMetersPerSecond > MAX_SPEED_MPS) throw new RangeError('The implied speed exceeds the supported non-relativistic range.');
  }
  const accelerationMetersPerSecondSquared = speedMetersPerSecond ** 2 / radiusMeters;
  const forceNewtons = massKg * accelerationMetersPerSecondSquared;
  const gForce = accelerationMetersPerSecondSquared / G0;
  if (![accelerationMetersPerSecondSquared, forceNewtons, gForce, rotationalFrequencyHz].every(Number.isFinite)) throw new RangeError('The result exceeds the supported numeric range.');
  return Object.freeze({ mode, massKg, radiusMeters, speedMetersPerSecond, rotationalFrequencyHz, accelerationMetersPerSecondSquared, forceNewtons, forcePoundForce: forceNewtons / 4.4482216152605, gForce });
}

export const CENTRIPETAL_FORCE_LIMITS = Object.freeze({ maxMassKg: MAX_MASS_KG, maxRadiusMeters: MAX_RADIUS_M, maxSpeedMetersPerSecond: MAX_SPEED_MPS, standardGravity: G0 });
