const MUHENRY_PER_HENRY = 1_000_000;
const INCHES_PER_METER = 39.37007874015748;
const MAX_TURNS = 50_000;
const MAX_LENGTH_METERS = 2;

function finite(input, key, min, max) {
  const value = typeof input?.[key] === 'string' && input[key].trim() === '' ? NaN : Number(input?.[key]);
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${key} is outside the supported range.`);
  return value;
}

function validateGeometry({ diameterMeters, lengthMeters, wireDiameterMeters }) {
  if (diameterMeters > MAX_LENGTH_METERS || lengthMeters > MAX_LENGTH_METERS) throw new RangeError('Coil dimensions exceed the supported range.');
  if (wireDiameterMeters > 0 && lengthMeters + 1e-12 < wireDiameterMeters) throw new RangeError('The winding length must fit at least one wire diameter.');
}

function wheelerMicrohenries(turns, diameterMeters, lengthMeters) {
  // Wheeler's single-layer air-core formula; dimensions are converted to inches.
  const radiusInches = diameterMeters * INCHES_PER_METER / 2;
  const lengthInches = lengthMeters * INCHES_PER_METER;
  return radiusInches ** 2 * turns ** 2 / (9 * radiusInches + 10 * lengthInches);
}

export function calculateInductor(input = {}) {
  const mode = input.mode ?? 'inductance';
  if (!['inductance', 'turns'].includes(mode)) throw new TypeError('Choose a supported calculation mode.');
  const diameterMeters = finite(input, 'diameterMeters', 0.0001, MAX_LENGTH_METERS);
  const lengthMeters = finite(input, 'lengthMeters', 0.0001, MAX_LENGTH_METERS);
  const wireDiameterMeters = finite(input, 'wireDiameterMeters', 0, 0.1);
  validateGeometry({ diameterMeters, lengthMeters, wireDiameterMeters });

  if (mode === 'inductance') {
    const turns = finite(input, 'turns', 1, MAX_TURNS);
    if (!Number.isInteger(turns)) throw new RangeError('Turns must be a whole number.');
    if (wireDiameterMeters > 0 && turns * wireDiameterMeters > lengthMeters + 1e-12) throw new RangeError('The requested turns do not fit in one layer at the selected wire diameter.');
    const inductanceMicrohenries = wheelerMicrohenries(turns, diameterMeters, lengthMeters);
    return Object.freeze({ mode, turns, diameterMeters, lengthMeters, wireDiameterMeters, inductanceMicrohenries, inductanceHenries: inductanceMicrohenries / MUHENRY_PER_HENRY });
  }

  const targetMicrohenries = finite(input, 'targetMicrohenries', 1e-12, 1e12);
  const radiusInches = diameterMeters * INCHES_PER_METER / 2;
  const lengthInches = lengthMeters * INCHES_PER_METER;
  const turns = Math.ceil(Math.sqrt(targetMicrohenries * (9 * radiusInches + 10 * lengthInches) / radiusInches ** 2));
  if (!Number.isSafeInteger(turns) || turns < 1 || turns > MAX_TURNS) throw new RangeError('The target requires more turns than this calculator supports.');
  if (wireDiameterMeters > 0 && turns * wireDiameterMeters > lengthMeters + 1e-12) throw new RangeError('The target does not fit in one layer at the selected wire diameter.');
  const inductanceMicrohenries = wheelerMicrohenries(turns, diameterMeters, lengthMeters);
  return Object.freeze({ mode, turns, targetMicrohenries, diameterMeters, lengthMeters, wireDiameterMeters, inductanceMicrohenries, inductanceHenries: inductanceMicrohenries / MUHENRY_PER_HENRY });
}

export const INDUCTOR_LIMITS = Object.freeze({ maxTurns: MAX_TURNS, maxDimensionMeters: MAX_LENGTH_METERS, maxWireDiameterMeters: 0.1, maxTargetMicrohenries: 1e12 });
