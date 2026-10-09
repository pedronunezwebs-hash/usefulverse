const GAS_CONSTANT = 8.31446261815324;
const PRESSURE_TO_PA = Object.freeze({ Pa: 1, kPa: 1e3, MPa: 1e6, bar: 1e5, atm: 101325, torr: 133.32236842105263, psi: 6894.757293168 });
const VOLUME_TO_M3 = Object.freeze({ 'm³': 1, L: 1e-3, mL: 1e-6, 'ft³': 0.028316846592 });
const AMOUNT_TO_MOL = Object.freeze({ mol: 1, mmol: 1e-3, kmol: 1e3 });
const LIMITS = Object.freeze({ pressure: [1e-15, 1e15], volume: [1e-18, 1e12], amount: [1e-18, 1e15], temperature: [1e-9, 1e9] });
const FACTORS = Object.freeze({ pressure: PRESSURE_TO_PA, volume: VOLUME_TO_M3, amount: AMOUNT_TO_MOL });
const missing = (value) => value === '' || value === null || value === undefined;

function unitFactor(dimension, unit) {
  const factor = FACTORS[dimension]?.[unit];
  if (!Number.isFinite(factor)) throw new TypeError(`Choose a supported ${dimension} unit.`);
  return factor;
}

function positiveSI(value, name, [minimum, maximum]) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new RangeError(`${name} must be positive and within the supported range.`);
  return value;
}

function toKelvin(value, unit) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new RangeError('Temperature must be a finite number.');
  if (unit === '°C') return number + 273.15;
  if (unit === 'K') return number;
  throw new TypeError('Choose kelvin or degrees Celsius.');
}

/** Convert a displayed value when a unit selector changes, preserving the physical quantity. */
export function convertIdealGasValue(value, dimension, fromUnit, toUnit) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError('Enter a finite value before converting units.');
  if (dimension === 'temperature') {
    const kelvin = toKelvin(number, fromUnit);
    if (kelvin <= 0) throw new RangeError('Temperature must be above absolute zero.');
    if (toUnit === 'K') return kelvin;
    if (toUnit === '°C') return kelvin - 273.15;
    throw new TypeError('Choose kelvin or degrees Celsius.');
  }
  return number * unitFactor(dimension, fromUnit) / unitFactor(dimension, toUnit);
}

/** Solve one blank variable in PV = nRT using SI units internally. */
export function calculateIdealGasLaw({ pressure, pressureUnit = 'atm', volume, volumeUnit = 'L', amount, amountUnit = 'mol', temperature, temperatureUnit = 'K' } = {}) {
  const entries = { pressure, volume, amount, temperature };
  const blanks = Object.entries(entries).filter(([, value]) => missing(value)).map(([key]) => key);
  if (blanks.length !== 1) throw new TypeError('Leave exactly one of pressure, volume, amount or temperature blank.');

  const supplied = {};
  for (const [key, dimension, unit, limits] of [
    ['pressure', 'pressure', pressureUnit, LIMITS.pressure],
    ['volume', 'volume', volumeUnit, LIMITS.volume],
    ['amount', 'amount', amountUnit, LIMITS.amount],
  ]) {
    const factor = unitFactor(dimension, unit);
    if (!missing(entries[key])) supplied[`${key}SI`] = positiveSI(Number(entries[key]) * factor, key, limits);
  }
  if (!['K', '°C'].includes(temperatureUnit)) throw new TypeError('Choose kelvin or degrees Celsius.');
  if (!missing(temperature)) supplied.temperatureK = positiveSI(toKelvin(temperature, temperatureUnit), 'temperature', LIMITS.temperature);

  const R = GAS_CONSTANT;
  let variable; let value;
  if (!('pressureSI' in supplied)) { variable = 'pressure'; value = supplied.amountSI * R * supplied.temperatureK / supplied.volumeSI; }
  else if (!('volumeSI' in supplied)) { variable = 'volume'; value = supplied.amountSI * R * supplied.temperatureK / supplied.pressureSI; }
  else if (!('amountSI' in supplied)) { variable = 'amount'; value = supplied.pressureSI * supplied.volumeSI / (R * supplied.temperatureK); }
  else { variable = 'temperature'; value = supplied.pressureSI * supplied.volumeSI / (supplied.amountSI * R); }

  value = positiveSI(value, 'result', LIMITS[variable]);
  const result = {
    variable,
    value,
    pressurePa: variable === 'pressure' ? value : supplied.pressureSI,
    volumeM3: variable === 'volume' ? value : supplied.volumeSI,
    amountMol: variable === 'amount' ? value : supplied.amountSI,
    temperatureK: variable === 'temperature' ? value : supplied.temperatureK,
  };
  if (['value', 'pressurePa', 'volumeM3', 'amountMol', 'temperatureK'].some((key) => !Number.isFinite(result[key]) || result[key] <= 0)) throw new RangeError('The result is outside the supported calculation range.');
  return Object.freeze(result);
}

export const IDEAL_GAS_UNITS = Object.freeze({ pressure: Object.keys(PRESSURE_TO_PA), volume: Object.keys(VOLUME_TO_M3), amount: Object.keys(AMOUNT_TO_MOL), temperature: ['K', '°C'] });
