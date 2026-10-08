const MASS_FACTORS = Object.freeze({ kg: 1, lb: 0.45359237 });
const FORCE_FACTORS = Object.freeze({ N: 1, kN: 1000, lbf: 4.4482216152605 });
const GRAVITY = 9.80665;

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateFriction({ mode = 'normal', normalForce, mass, massUnit = 'kg', angleDegrees = 0, gravity = GRAVITY, staticCoefficient, kineticCoefficient, appliedForce = 0, forceUnit = 'N', motionState = 'rest' } = {}) {
  const forceFactor = FORCE_FACTORS[forceUnit];
  if (!forceFactor) throw new TypeError('Choose N, kN or lbf.');
  if (!['normal', 'incline'].includes(mode)) throw new TypeError('Choose a supported calculation mode.');
  if (!['rest', 'uphill', 'downhill'].includes(motionState)) throw new TypeError('Choose a supported motion state.');

  let massKg = null;
  let angle = 0;
  let normalN;
  let gravityAlongSurfaceN = 0;
  if (mode === 'normal') {
    normalN = bounded('Normal force', normalForce, 0, 1_000_000_000) * forceFactor;
  } else {
    const massFactor = MASS_FACTORS[massUnit];
    if (!massFactor) throw new TypeError('Choose kilograms or pounds.');
    massKg = bounded('Mass', mass, 0.000001, 1_000_000_000) * massFactor;
    angle = bounded('Incline angle', angleDegrees, 0, 90) * Math.PI / 180;
    const gravityMps2 = bounded('Gravity', gravity, 0.000001, 100);
    const weightN = massKg * gravityMps2;
    normalN = Math.max(0, weightN * Math.cos(angle));
    if (normalN < 1e-12) normalN = 0;
    gravityAlongSurfaceN = weightN * Math.sin(angle);
  }

  const muStatic = bounded('Static friction coefficient', staticCoefficient, 0, 10);
  const muKinetic = bounded('Kinetic friction coefficient', kineticCoefficient, 0, 10);
  if (muKinetic > muStatic) throw new RangeError('Kinetic coefficient must not exceed the static coefficient.');
  const appliedForceN = bounded('Applied force', appliedForce, -1_000_000_000, 1_000_000_000) * forceFactor;
  const externalAlongSurfaceN = gravityAlongSurfaceN + appliedForceN;
  const maximumStaticFrictionN = muStatic * normalN;
  const requiredStaticFrictionN = Math.abs(externalAlongSurfaceN);
  let frictionForceN;
  let regime;

  if (motionState === 'rest' && requiredStaticFrictionN <= maximumStaticFrictionN + 1e-10) {
    frictionForceN = externalAlongSurfaceN === 0 ? 0 : -externalAlongSurfaceN;
    regime = 'static';
  } else {
    let motionDirection = motionState === 'uphill' ? -1 : motionState === 'downhill' ? 1 : Math.sign(externalAlongSurfaceN);
    frictionForceN = motionDirection === 0 ? 0 : -motionDirection * muKinetic * normalN;
    regime = motionState === 'rest' ? (motionDirection >= 0 ? 'startsDownhill' : 'startsUphill') : motionState;
  }

  const netForceN = externalAlongSurfaceN + frictionForceN;
  const accelerationMps2 = massKg === null ? null : netForceN / massKg;
  return Object.freeze({
    mode,
    massKg,
    angleDegrees: angle * 180 / Math.PI,
    forceUnit,
    normalForceN: normalN,
    gravityAlongSurfaceN,
    appliedForceN,
    externalAlongSurfaceN,
    staticCoefficient: muStatic,
    kineticCoefficient: muKinetic,
    maximumStaticFrictionN,
    requiredStaticFrictionN,
    kineticFrictionN: muKinetic * normalN,
    frictionForceN,
    frictionMagnitudeN: Math.abs(frictionForceN),
    frictionDirection: Math.sign(frictionForceN),
    netForceN,
    accelerationMps2,
    regime,
  });
}

export const frictionUnits = Object.freeze({ force: FORCE_FACTORS, mass: MASS_FACTORS });
