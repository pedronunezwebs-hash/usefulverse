const SPEED_OF_LIGHT_M_S = 299_792_458;
const FREQUENCY_TO_HZ = Object.freeze({ Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 });
const MODES = Object.freeze({ dipole: 0.5, monopole: 0.25 });

function positive(value, name, max = 1e12) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > max) throw new RangeError(`Enter a positive ${name} within the supported range.`);
  return number;
}

/** Estimate free-space half-wave dipole or quarter-wave monopole dimensions. */
export function calculateAntennaLength({ frequency, frequencyUnit = 'MHz', mode = 'dipole', shorteningFactor = 0.95 } = {}) {
  if (!Object.hasOwn(MODES, mode)) throw new RangeError('Choose a supported antenna type.');
  const factor = FREQUENCY_TO_HZ[frequencyUnit];
  if (!Number.isFinite(factor)) throw new RangeError('Choose a supported frequency unit.');
  const frequencyHz = positive(frequency, 'frequency') * factor;
  if (frequencyHz < 1e-3 || frequencyHz > 1e12) throw new RangeError('Frequency is outside the supported antenna range.');
  const shortening = Number(shorteningFactor);
  if (!Number.isFinite(shortening) || shortening < 0.7 || shortening > 1) throw new RangeError('The shortening factor must be between 0.70 and 1.00.');
  const wavelengthM = SPEED_OF_LIGHT_M_S / frequencyHz;
  const fraction = MODES[mode];
  const idealLengthM = wavelengthM * fraction;
  const adjustedLengthM = idealLengthM * shortening;
  const result = {
    mode,
    frequencyHz,
    wavelengthM,
    fraction,
    shorteningFactor: shortening,
    idealLengthM,
    adjustedLengthM,
    elementLengthM: mode === 'dipole' ? adjustedLengthM / 2 : adjustedLengthM,
    idealLengthFeet: idealLengthM / 0.3048,
    adjustedLengthFeet: adjustedLengthM / 0.3048,
  };
  if (!Object.values(result).filter((value) => typeof value === 'number').every(Number.isFinite)) throw new RangeError('The result is outside the supported numeric range.');
  return result;
}

export const ANTENNA_FREQUENCY_UNITS = Object.freeze(Object.keys(FREQUENCY_TO_HZ));
