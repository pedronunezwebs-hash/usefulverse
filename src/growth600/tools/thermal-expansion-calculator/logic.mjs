const DIMENSION_UNITS = Object.freeze({
  length: Object.freeze({ m: 1, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048 }),
  area: Object.freeze({ 'm²': 1, 'cm²': 0.0001, 'ft²': 0.09290304, 'in²': 0.00064516 }),
  volume: Object.freeze({ 'm³': 1, 'cm³': 1e-6, L: 0.001, 'ft³': 0.028316846592, 'in³': 0.000016387064 }),
});
const BASE_UNITS = Object.freeze({ length: 'm', area: 'm²', volume: 'm³' });

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateThermalExpansion({ mode = 'linear', initialDimension, dimensionUnit, coefficient, coefficientTemperatureUnit = 'C', deltaTemperature, temperatureUnit = 'C' } = {}) {
  const unitDimension = mode === 'linear' ? 'length' : mode;
  const modeUnits = DIMENSION_UNITS[unitDimension];
  if (!modeUnits) throw new TypeError('Choose linear, area, or volume expansion.');
  const unitFactor = modeUnits[dimensionUnit];
  if (!unitFactor) throw new TypeError('Choose a dimension unit that matches the selected expansion mode.');
  if (!['C', 'F'].includes(coefficientTemperatureUnit) || !['C', 'F'].includes(temperatureUnit)) throw new TypeError('Choose Celsius or Fahrenheit.');
  const initial = bounded('Initial dimension', initialDimension, 0, 1e12);
  const alpha = bounded('Expansion coefficient', coefficient, -0.01, 0.01);
  const deltaInput = bounded('Temperature change', deltaTemperature, -10000, 10000);
  const deltaC = temperatureUnit === 'F' ? deltaInput / 1.8 : deltaInput;
  const coefficientPerC = coefficientTemperatureUnit === 'F' ? alpha * 1.8 : alpha;
  const relativeChange = coefficientPerC * deltaC;
  const finalRatio = 1 + relativeChange;
  if (finalRatio < 0) throw new RangeError('The entered coefficient and temperature change produce a negative final dimension.');
  const change = initial * relativeChange;
  const finalDimension = initial + change;
  const changeBase = change * unitFactor;
  const finalBase = finalDimension * unitFactor;
  if (![change, finalDimension, changeBase, finalBase].every(Number.isFinite)) throw new RangeError('The result is outside the supported numeric range.');
  return Object.freeze({ mode, initialDimension: initial, dimensionUnit, coefficientPerInputUnit: alpha, coefficientTemperatureUnit, coefficientPerC, deltaTemperature: deltaInput, temperatureUnit, deltaCelsius: deltaC, relativeChange, change, finalDimension, changeBase, finalBase, baseUnit: BASE_UNITS[unitDimension], finalRatio });
}
