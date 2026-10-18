const WATER = Object.freeze({ a: 17.62, b: 243.12, min: -45, max: 60, phase: 'water' });
const ICE = Object.freeze({ a: 22.46, b: 272.62, min: -45, max: 0, phase: 'ice' });

function finite(value, name) {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) throw new RangeError(`${name} must be a finite number.`);
  const number = Number(value);
  if (!Number.isFinite(number)) throw new RangeError(`${name} must be a finite number.`);
  return number;
}

function phaseFor(temperatureC) {
  const phase = temperatureC < 0 ? ICE : WATER;
  if (temperatureC < phase.min || temperatureC > phase.max) throw new RangeError(`Temperature must be between ${phase.min} °C and ${phase.max} °C.`);
  return phase;
}

export function saturationVapourPressureHpa(temperatureC) {
  const temperature = finite(temperatureC, 'Temperature');
  const phase = phaseFor(temperature);
  return 6.112 * Math.exp((phase.a * temperature) / (phase.b + temperature));
}

function saturationForPhase(temperatureC, phase) {
  return 6.112 * Math.exp((phase.a * temperatureC) / (phase.b + temperatureC));
}

export function calculateDewPoint({ temperatureC, relativeHumidity } = {}) {
  const temperature = finite(temperatureC, 'Temperature');
  const humidity = finite(relativeHumidity, 'Relative humidity');
  const phase = phaseFor(temperature);
  if (humidity < 1 || humidity > 100) throw new RangeError('Relative humidity must be between 1% and 100%.');

  const saturatedHpa = saturationVapourPressureHpa(temperature);
  const actualHpa = saturatedHpa * (humidity / 100);
  const gamma = Math.log(actualHpa / 6.112);
  const pointC = (phase.b * gamma) / (phase.a - gamma);
  const kelvin = temperature + 273.15;
  if (!(kelvin > 0) || ![saturatedHpa, actualHpa, pointC, kelvin].every(Number.isFinite) || pointC < phase.min) throw new RangeError('The calculated dew or frost point is outside the supported formula range.');

  // WMO vapour concentration definition; ideal-gas form with hPa and kelvin.
  const absoluteHumidityGm3 = (216.7 * actualHpa) / kelvin;
  return Object.freeze({ temperatureC: temperature, relativeHumidity: humidity, saturationVapourPressureHpa: saturatedHpa, actualVapourPressureHpa: actualHpa, dewPointC: pointC, absoluteHumidityGm3, phase: phase.phase });
}

export function compareSurfaceToDewPoint({ temperatureC, relativeHumidity, surfaceTemperatureC } = {}) {
  const surface = finite(surfaceTemperatureC, 'Surface temperature');
  phaseFor(surface);
  const air = calculateDewPoint({ temperatureC, relativeHumidity });
  return Object.freeze({ surfaceTemperatureC: surface, dewPointC: air.dewPointC, differenceC: surface - air.dewPointC, condensationPossible: surface <= air.dewPointC, phase: air.phase });
}

export function humidityCurve({ temperatureC } = {}) {
  const temperature = finite(temperatureC, 'Temperature');
  const phase = phaseFor(temperature);
  const minimumHumidity = Math.max(1, (100 * saturationForPhase(phase.min, phase)) / saturationForPhase(temperature, phase));
  const relativeHumidities = [...new Set([minimumHumidity, ...Array.from({ length: 10 }, (_, index) => (index + 1) * 10).filter((value) => value > minimumHumidity)])];
  return Object.freeze(relativeHumidities.map((relativeHumidity) => {
    const result = calculateDewPoint({ temperatureC: temperature, relativeHumidity });
    return Object.freeze({ relativeHumidity, absoluteHumidityGm3: result.absoluteHumidityGm3 });
  }));
}
