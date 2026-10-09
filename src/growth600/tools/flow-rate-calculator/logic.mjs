const FACTORS = Object.freeze({
  area: Object.freeze({ 'm²': 1, 'cm²': 1e-4, 'ft²': 0.09290304, 'in²': 0.00064516 }),
  velocity: Object.freeze({ 'm/s': 1, 'cm/s': 0.01, 'm/min': 1 / 60, 'ft/s': 0.3048 }),
  flow: Object.freeze({ 'm³/s': 1, 'L/s': 1e-3, 'L/min': 1e-3 / 60, 'm³/h': 1 / 3600, 'US gal/min': 0.003785411784 / 60 }),
  volume: Object.freeze({ 'm³': 1, L: 1e-3, 'US gal': 0.003785411784 }),
  time: Object.freeze({ s: 1, min: 60, h: 3600 }),
});
const MAX = 1e12;
const missing = (value) => value === '' || value === null || value === undefined;

function factor(dimension, unit) {
  const multiplier = FACTORS[dimension]?.[unit];
  if (!Number.isFinite(multiplier)) throw new TypeError(`Choose a supported ${dimension} unit.`);
  return multiplier;
}

function positive(value, name) {
  const number = Number(value);
  if (missing(value) || !Number.isFinite(number) || number <= 0 || number > MAX) throw new RangeError(`${name} must be positive and within the supported range.`);
  return number;
}

function bounded(value, name) {
  if (!Number.isFinite(value) || value <= 0 || value > 1e18) throw new RangeError(`${name} is outside the supported range.`);
  return value;
}

/** Convert a displayed area, velocity, flow, volume or duration without changing its physical quantity. */
export function convertFlowValue(value, dimension, fromUnit, toUnit) {
  const number = positive(value, 'Value');
  return number * factor(dimension, fromUnit) / factor(dimension, toUnit);
}

/** Calculate Q = A·v, solve any one of Q/A/v, or estimate a tank fill duration. */
export function calculateFlowRate({ mode = 'flow', area, areaUnit = 'm²', velocity, velocityUnit = 'm/s', flowRate, flowUnit = 'm³/s', volume, volumeUnit = 'm³', timeUnit = 'min' } = {}) {
  if (!['flow', 'area', 'velocity', 'fill-time'].includes(mode)) throw new TypeError('Choose a supported calculation.');
  let areaM2 = null;
  let velocityMps = null;
  let flowM3s = null;
  let volumeM3 = null;

  if (mode === 'flow') {
    areaM2 = positive(area, 'Cross-sectional area') * factor('area', areaUnit);
    velocityMps = positive(velocity, 'Flow velocity') * factor('velocity', velocityUnit);
    flowM3s = bounded(areaM2 * velocityMps, 'Flow rate');
  } else if (mode === 'area') {
    flowM3s = positive(flowRate, 'Flow rate') * factor('flow', flowUnit);
    velocityMps = positive(velocity, 'Flow velocity') * factor('velocity', velocityUnit);
    areaM2 = bounded(flowM3s / velocityMps, 'Cross-sectional area');
  } else if (mode === 'velocity') {
    flowM3s = positive(flowRate, 'Flow rate') * factor('flow', flowUnit);
    areaM2 = positive(area, 'Cross-sectional area') * factor('area', areaUnit);
    velocityMps = bounded(flowM3s / areaM2, 'Flow velocity');
  } else {
    flowM3s = positive(flowRate, 'Flow rate') * factor('flow', flowUnit);
    volumeM3 = positive(volume, 'Tank volume') * factor('volume', volumeUnit);
  }

  if (mode !== 'fill-time' && !missing(volume)) volumeM3 = positive(volume, 'Tank volume') * factor('volume', volumeUnit);
  const fillTimeSeconds = volumeM3 === null ? null : bounded(volumeM3 / flowM3s, 'Fill duration');
  let primaryValue;
  let primaryUnit;
  if (mode === 'flow') { primaryValue = flowM3s / factor('flow', flowUnit); primaryUnit = flowUnit; }
  else if (mode === 'area') { primaryValue = areaM2 / factor('area', areaUnit); primaryUnit = areaUnit; }
  else if (mode === 'velocity') { primaryValue = velocityMps / factor('velocity', velocityUnit); primaryUnit = velocityUnit; }
  else { primaryValue = fillTimeSeconds / factor('time', timeUnit); primaryUnit = timeUnit; }

  return Object.freeze({ mode, areaM2, velocityMps, flowM3s, volumeM3, fillTimeSeconds, primaryValue: bounded(primaryValue, 'Result'), primaryUnit });
}

export const FLOW_RATE_UNITS = Object.freeze(Object.fromEntries(Object.entries(FACTORS).map(([dimension, units]) => [dimension, Object.keys(units)])));
