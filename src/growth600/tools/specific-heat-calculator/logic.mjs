const MASS_TO_KG = Object.freeze({ kg: 1, g: 0.001, lb: 0.45359237, oz: 0.028349523125 });
const SPECIFIC_HEAT_TO_J_KG_C = Object.freeze({
  'J/kg°C': 1,
  'kJ/kg°C': 1000,
  'J/g°C': 1000,
  'cal/g°C': 4184,
  'BTU/lb°F': 4186.8,
});
const ENERGY_TO_J = Object.freeze({ J: 1, kJ: 1000, cal: 4.184, kcal: 4184, BTU: 1055.05585262 });
const MAX_MASS_KG = 1e9;
const MAX_SPECIFIC_HEAT = 1e8;
const MAX_ENERGY_J = 1e15;
const MAX_TEMPERATURE_CHANGE_C = 1e6;
const MAX_ABSOLUTE_TEMPERATURE_C = 1e6;

function number(value, name, { min = -Infinity, max = Infinity } = {}) {
  const text = typeof value === 'string' ? value.trim() : value;
  if (text === '' || text === null || text === undefined) throw new RangeError(`Invalid ${name}.`);
  const parsed = typeof text === 'number' ? text : Number(text);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) throw new RangeError(`Invalid ${name}.`);
  return parsed;
}

function unitFactor(map, unit, name) {
  const factor = map[unit];
  if (!Number.isFinite(factor)) throw new TypeError(`Unsupported ${name} unit.`);
  return factor;
}

function massKg(value, unit, name) {
  return number(value, name, { min: Number.MIN_VALUE, max: MAX_MASS_KG / unitFactor(MASS_TO_KG, unit, 'mass') })
    * unitFactor(MASS_TO_KG, unit, 'mass');
}

function specificHeatSI(value, unit, name) {
  return number(value, name, { min: Number.MIN_VALUE, max: MAX_SPECIFIC_HEAT / unitFactor(SPECIFIC_HEAT_TO_J_KG_C, unit, 'specific heat') })
    * unitFactor(SPECIFIC_HEAT_TO_J_KG_C, unit, 'specific heat');
}

function energyJ(value, unit, name) {
  return number(value, name, { min: -MAX_ENERGY_J / unitFactor(ENERGY_TO_J, unit, 'energy'), max: MAX_ENERGY_J / unitFactor(ENERGY_TO_J, unit, 'energy') })
    * unitFactor(ENERGY_TO_J, unit, 'energy');
}

function deltaC(value, unit, name) {
  const parsed = number(value, name, { min: -MAX_TEMPERATURE_CHANGE_C * (unit === '°F' ? 9 / 5 : 1), max: MAX_TEMPERATURE_CHANGE_C * (unit === '°F' ? 9 / 5 : 1) });
  if (unit === '°C') return parsed;
  if (unit === '°F') return parsed * 5 / 9;
  throw new TypeError('Unsupported temperature-difference unit.');
}

function absoluteC(value, unit, name) {
  const parsed = number(value, name, { min: unit === '°F' ? -459.67 : -273.15, max: unit === '°F' ? (MAX_ABSOLUTE_TEMPERATURE_C * 9 / 5 + 32) : MAX_ABSOLUTE_TEMPERATURE_C });
  if (unit === '°C') return parsed;
  if (unit === '°F') return (parsed - 32) * 5 / 9;
  throw new TypeError('Unsupported temperature unit.');
}

function finiteResult(value, name, { min = -Infinity, max = Infinity } = {}) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`The ${name} is outside the supported range.`);
  return value;
}

export function calculateSpecificHeat({
  mode = 'single', solveFor = 'energy',
  mass, massUnit = 'kg', specificHeat, specificHeatUnit = 'J/kg°C',
  temperatureChange, temperatureUnit = '°C', heatEnergy, energyUnit = 'J',
  mass1, specificHeat1, temperature1, mass2, specificHeat2, temperature2,
  heatLoss = 0,
} = {}) {
  if (mode === 'mixing') {
    const m1 = massKg(mass1, massUnit, 'mass 1');
    const m2 = massKg(mass2, massUnit, 'mass 2');
    const c1 = specificHeatSI(specificHeat1, specificHeatUnit, 'specific heat 1');
    const c2 = specificHeatSI(specificHeat2, specificHeatUnit, 'specific heat 2');
    const t1 = absoluteC(temperature1, temperatureUnit, 'temperature 1');
    const t2 = absoluteC(temperature2, temperatureUnit, 'temperature 2');
    const lossJ = energyJ(heatLoss, energyUnit, 'heat loss');
    const capacity = m1 * c1 + m2 * c2;
    finiteResult(capacity, 'combined heat capacity', { min: Number.MIN_VALUE, max: 1e18 });
    const finalTemperatureC = finiteResult((m1 * c1 * t1 + m2 * c2 * t2 - lossJ) / capacity, 'final temperature', { min: -273.15, max: MAX_ABSOLUTE_TEMPERATURE_C });
    return Object.freeze({ mode, mass1Kg: m1, mass2Kg: m2, specificHeat1SI: c1, specificHeat2SI: c2, temperature1C: t1, temperature2C: t2, heatLossJ: lossJ, finalTemperatureC, temperatureUnit });
  }
  if (mode !== 'single') throw new TypeError('Choose a supported calculation mode.');

  const solved = solveFor;
  if (!['energy', 'mass', 'specificHeat', 'temperatureChange'].includes(solved)) throw new TypeError('Choose a supported value to solve for.');
  const supplied = {};
  if (solved !== 'mass') supplied.massKg = massKg(mass, massUnit, 'mass');
  if (solved !== 'specificHeat') supplied.specificHeatSI = specificHeatSI(specificHeat, specificHeatUnit, 'specific heat');
  if (solved !== 'temperatureChange') supplied.temperatureChangeC = deltaC(temperatureChange, temperatureUnit, 'temperature change');
  if (solved !== 'energy') supplied.heatEnergyJ = energyJ(heatEnergy, energyUnit, 'heat energy');

  let value;
  if (solved === 'energy') value = supplied.massKg * supplied.specificHeatSI * supplied.temperatureChangeC;
  else if (solved === 'mass') {
    const denominator = supplied.specificHeatSI * supplied.temperatureChangeC;
    if (denominator === 0) throw new RangeError('A non-zero specific heat and temperature change are required to solve for mass.');
    value = supplied.heatEnergyJ / denominator;
  } else if (solved === 'specificHeat') {
    const denominator = supplied.massKg * supplied.temperatureChangeC;
    if (denominator === 0) throw new RangeError('A non-zero mass and temperature change are required to solve for specific heat.');
    value = supplied.heatEnergyJ / denominator;
  } else {
    const denominator = supplied.massKg * supplied.specificHeatSI;
    if (denominator === 0) throw new RangeError('A non-zero mass and specific heat are required to solve for temperature change.');
    value = supplied.heatEnergyJ / denominator;
  }
  const bounds = solved === 'mass' ? { min: Number.MIN_VALUE, max: MAX_MASS_KG }
    : solved === 'specificHeat' ? { min: Number.MIN_VALUE, max: MAX_SPECIFIC_HEAT }
      : solved === 'temperatureChange' ? { min: -MAX_TEMPERATURE_CHANGE_C, max: MAX_TEMPERATURE_CHANGE_C }
        : { min: -MAX_ENERGY_J, max: MAX_ENERGY_J };
  value = finiteResult(value, solved, bounds);
  const result = { mode, solved, value, massUnit, specificHeatUnit, temperatureUnit, energyUnit, ...supplied };
  if (solved === 'mass') result.massKg = value;
  if (solved === 'specificHeat') result.specificHeatSI = value;
  if (solved === 'temperatureChange') result.temperatureChangeC = value;
  if (solved === 'energy') result.heatEnergyJ = value;
  return Object.freeze(result);
}

export const SPECIFIC_HEAT_UNITS = Object.freeze({
  mass: Object.keys(MASS_TO_KG),
  specificHeat: Object.keys(SPECIFIC_HEAT_TO_J_KG_C),
  energy: Object.keys(ENERGY_TO_J),
  temperature: ['°C', '°F'],
});
