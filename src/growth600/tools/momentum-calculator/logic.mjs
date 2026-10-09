const MASS_FACTORS = Object.freeze({ kg: 1, g: 0.001, tonne: 1000 });
const SPEED_FACTORS = Object.freeze({ 'm/s': 1, 'km/h': 1 / 3.6, 'ft/s': 0.3048 });
const MAX_MASS_KG = 1e12;
const MAX_SPEED_MPS = 1e6;

function finiteRange(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}.`);
  }
  return value;
}

function convertMass(value, unit, name) {
  const factor = MASS_FACTORS[unit];
  if (!Number.isFinite(factor)) throw new TypeError('Choose a supported mass unit.');
  const massKg = finiteRange(name, value, Number.MIN_VALUE, MAX_MASS_KG / factor) * factor;
  return finiteRange(name, massKg, Number.MIN_VALUE, MAX_MASS_KG);
}

function convertVelocity(value, unit, name) {
  const factor = SPEED_FACTORS[unit];
  if (!Number.isFinite(factor)) throw new TypeError('Choose a supported speed unit.');
  const velocityMps = finiteRange(name, value, -MAX_SPEED_MPS / factor, MAX_SPEED_MPS / factor) * factor;
  return finiteRange(name, velocityMps, -MAX_SPEED_MPS, MAX_SPEED_MPS);
}

function checkedResult(result) {
  if (!Object.values(result).filter((value) => typeof value === 'number').every(Number.isFinite)) {
    throw new RangeError('Result is outside the supported range.');
  }
  return Object.freeze(result);
}

/** One-dimensional classical momentum and two-body collision estimate; no rotation or external impulse. */
export function calculateMomentum({
  mode = 'collision', mass1, mass2, massUnit = 'kg', velocity1, velocity2, speedUnit = 'm/s', restitution = 1,
} = {}) {
  if (!['momentum', 'collision'].includes(mode)) throw new TypeError('Choose momentum or collision mode.');
  const m1 = convertMass(mass1, massUnit, 'Mass 1');
  const m2 = convertMass(mass2, massUnit, 'Mass 2');
  const u1 = convertVelocity(velocity1, speedUnit, 'Velocity 1');
  const u2 = convertVelocity(velocity2, speedUnit, 'Velocity 2');
  const momentumBefore = m1 * u1 + m2 * u2;
  const kineticEnergyBeforeJ = 0.5 * m1 * u1 ** 2 + 0.5 * m2 * u2 ** 2;
  if (!Number.isFinite(momentumBefore) || !Number.isFinite(kineticEnergyBeforeJ)) throw new RangeError('Initial result is outside the supported range.');

  if (mode === 'momentum') return checkedResult({ mode, mass1Kg: m1, mass2Kg: m2, velocity1Mps: u1, velocity2Mps: u2, momentumBeforeKgMps: momentumBefore, kineticEnergyBeforeJ });

  const e = finiteRange('Coefficient of restitution', restitution, 0, 1);
  const totalMass = m1 + m2;
  const v1 = ((m1 - e * m2) * u1 + (1 + e) * m2 * u2) / totalMass;
  const v2 = ((m2 - e * m1) * u2 + (1 + e) * m1 * u1) / totalMass;
  const momentumAfter = m1 * v1 + m2 * v2;
  const kineticEnergyAfterJ = 0.5 * m1 * v1 ** 2 + 0.5 * m2 * v2 ** 2;
  const kineticEnergyLossJ = Math.max(0, kineticEnergyBeforeJ - kineticEnergyAfterJ);
  return checkedResult({
    mode, mass1Kg: m1, mass2Kg: m2, velocity1Mps: u1, velocity2Mps: u2, restitution: e,
    finalVelocity1Mps: v1, finalVelocity2Mps: v2,
    momentumBeforeKgMps: momentumBefore, momentumAfterKgMps: momentumAfter,
    kineticEnergyBeforeJ, kineticEnergyAfterJ, kineticEnergyLossJ,
  });
}
