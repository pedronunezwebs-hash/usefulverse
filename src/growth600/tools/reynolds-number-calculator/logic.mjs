const FACTORS = Object.freeze({
  density: Object.freeze({ 'kg/m³': 1, 'g/cm³': 1000, 'lb/ft³': 16.01846337396 }),
  velocity: Object.freeze({ 'm/s': 1, 'cm/s': 0.01, 'ft/s': 0.3048, 'km/h': 1 / 3.6 }),
  length: Object.freeze({ m: 1, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048 }),
  dynamicViscosity: Object.freeze({ 'Pa·s': 1, 'mPa·s': 0.001, cP: 0.001, 'lb/(ft·s)': 1.48816394357 }),
  kinematicViscosity: Object.freeze({ 'm²/s': 1, 'mm²/s': 1e-6, cSt: 1e-6, 'ft²/s': 0.09290304 }),
});
const missing = (value) => value === '' || value === null || value === undefined;

function factor(dimension, unit) {
  const multiplier = FACTORS[dimension]?.[unit];
  if (!Number.isFinite(multiplier)) throw new TypeError(`Choose a supported ${dimension} unit.`);
  return multiplier;
}

function positive(value, name) {
  const number = Number(value);
  if (missing(value) || !Number.isFinite(number) || number <= 0 || number > 1e12) throw new RangeError(`${name} must be positive and within the supported range.`);
  return number;
}

function nonNegative(value, name) {
  const number = Number(value);
  if (missing(value) || !Number.isFinite(number) || number < 0 || number > 1e12) throw new RangeError(`${name} must be zero or positive and within the supported range.`);
  return number;
}

/** Calculate Re = rho*v*L/mu or Re = v*L/nu. Pipe regimes are conventional approximations only. */
export function calculateReynoldsNumber({
  velocity, velocityUnit = 'm/s', characteristicLength, lengthUnit = 'm',
  viscosityType = 'dynamic', dynamicViscosity, dynamicViscosityUnit = 'Pa·s', density, densityUnit = 'kg/m³',
  kinematicViscosity, kinematicViscosityUnit = 'm²/s', geometry = 'pipe',
} = {}) {
  if (!['dynamic', 'kinematic'].includes(viscosityType)) throw new TypeError('Choose dynamic or kinematic viscosity.');
  if (!['pipe', 'external'].includes(geometry)) throw new TypeError('Choose pipe or external-flow context.');
  const velocityMps = nonNegative(velocity, 'Velocity') * factor('velocity', velocityUnit);
  const lengthM = positive(characteristicLength, 'Characteristic length') * factor('length', lengthUnit);
  let densityKgM3 = null;
  let dynamicViscosityPas;
  let kinematicViscosityM2s;
  if (viscosityType === 'dynamic') {
    densityKgM3 = positive(density, 'Density') * factor('density', densityUnit);
    dynamicViscosityPas = positive(dynamicViscosity, 'Dynamic viscosity') * factor('dynamicViscosity', dynamicViscosityUnit);
    kinematicViscosityM2s = dynamicViscosityPas / densityKgM3;
  } else {
    kinematicViscosityM2s = positive(kinematicViscosity, 'Kinematic viscosity') * factor('kinematicViscosity', kinematicViscosityUnit);
    dynamicViscosityPas = null;
  }
  const reynoldsNumber = velocityMps * lengthM / kinematicViscosityM2s;
  if (!Number.isFinite(reynoldsNumber) || reynoldsNumber > 1e30) throw new RangeError('Reynolds number is outside the supported range.');
  let regime;
  if (geometry === 'external') regime = 'context-dependent';
  else if (reynoldsNumber < 2300) regime = 'laminar';
  else if (reynoldsNumber <= 4000) regime = 'transitional';
  else regime = 'turbulent';
  return Object.freeze({ reynoldsNumber, velocityMps, lengthM, densityKgM3, dynamicViscosityPas, kinematicViscosityM2s, viscosityType, geometry, regime });
}

export const REYNOLDS_NUMBER_UNITS = Object.freeze(Object.fromEntries(Object.entries(FACTORS).map(([dimension, units]) => [dimension, Object.keys(units)])));
