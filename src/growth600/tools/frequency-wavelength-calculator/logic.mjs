const FREQUENCY_TO_HZ = Object.freeze({ Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9, THz: 1e12 });
const LENGTH_TO_M = Object.freeze({ nm: 1e-9, 'μm': 1e-6, mm: 1e-3, cm: 1e-2, m: 1, km: 1e3 });
const SPEED_TO_M_S = Object.freeze({ 'm/s': 1, 'km/s': 1e3 });
const LIMITS = Object.freeze({ frequency: [1e-12, 1e24], wavelength: [1e-18, 1e18], speed: [1e-9, 1e12] });

function readPositive(value, name, [min, max]) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

function unitFactor(units, unit, name) {
  const factor = units[unit];
  if (!Number.isFinite(factor)) throw new TypeError(`Choose a supported ${name} unit.`);
  return factor;
}

/** Solve exactly one missing value in v = f × λ. The SI constants keep units explicit. */
export function calculateWaveRelation({ frequency, frequencyUnit = 'Hz', wavelength, wavelengthUnit = 'm', speed, speedUnit = 'm/s' } = {}) {
  const missing = [frequency, wavelength, speed].filter((value) => value === '' || value === null || value === undefined).length;
  if (missing !== 1) throw new TypeError('Leave exactly one of frequency, wavelength, or speed blank.');

  const frequencyFactor = unitFactor(FREQUENCY_TO_HZ, frequencyUnit, 'frequency');
  const wavelengthFactor = unitFactor(LENGTH_TO_M, wavelengthUnit, 'wavelength');
  const speedFactor = unitFactor(SPEED_TO_M_S, speedUnit, 'speed');
  const supplied = {};
  if (frequency !== '' && frequency !== null && frequency !== undefined) supplied.frequencyHz = readPositive(Number(frequency) * frequencyFactor, 'Frequency', LIMITS.frequency);
  if (wavelength !== '' && wavelength !== null && wavelength !== undefined) supplied.wavelengthM = readPositive(Number(wavelength) * wavelengthFactor, 'Wavelength', LIMITS.wavelength);
  if (speed !== '' && speed !== null && speed !== undefined) supplied.speedMps = readPositive(Number(speed) * speedFactor, 'Wave speed', LIMITS.speed);

  let solved;
  if (!('frequencyHz' in supplied)) solved = { variable: 'frequency', value: supplied.speedMps / supplied.wavelengthM };
  else if (!('wavelengthM' in supplied)) solved = { variable: 'wavelength', value: supplied.speedMps / supplied.frequencyHz };
  else solved = { variable: 'speed', value: supplied.frequencyHz * supplied.wavelengthM };
  if (!Number.isFinite(solved.value) || solved.value <= 0) throw new RangeError('The result is outside the supported range.');
  const range = LIMITS[solved.variable];
  if (solved.value < range[0] || solved.value > range[1]) throw new RangeError('The result is outside the supported range.');
  return { ...solved, frequencyHz: solved.variable === 'frequency' ? solved.value : supplied.frequencyHz, wavelengthM: solved.variable === 'wavelength' ? solved.value : supplied.wavelengthM, speedMps: solved.variable === 'speed' ? solved.value : supplied.speedMps };
}

export const WAVE_UNITS = Object.freeze({ frequency: Object.keys(FREQUENCY_TO_HZ), wavelength: Object.keys(LENGTH_TO_M), speed: Object.keys(SPEED_TO_M_S) });
