const MAX_MONTHS = 12;
const MAX_VALUE = 1_000_000_000;
const AREA_TO_M2 = Object.freeze({ m2: 1, ft2: 0.09290304 });
const RAIN_TO_MM = Object.freeze({ mm: 1, in: 25.4 });
const VOLUME_TO_L = Object.freeze({ L: 1, gal: 3.785411784 });

function bounded(name, value, min = 0, max = MAX_VALUE) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function parseMonthlyValues(text, name = 'Monthly values', { max = 1_000_000_000 } = {}) {
  if (typeof text !== 'string') throw new TypeError(`${name} must be entered as 12 lines.`);
  const lines = text.split(/\r?\n/u).map((line) => line.trim());
  if (lines.length !== MAX_MONTHS || lines.some((line) => !line)) throw new TypeError(`${name} must contain exactly 12 numbers, one per month.`);
  return Object.freeze(lines.map((line, index) => {
    if (!/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/u.test(line)) throw new TypeError(`Check ${name.toLowerCase()} on line ${index + 1}.`);
    return bounded(`${name} month ${index + 1}`, Number(line.replace(',', '.')), 0, max);
  }));
}

export function calculateRainwaterHarvesting({ catchmentArea, areaUnit = 'm2', rainfallValues, rainfallUnit = 'mm', runoffPercent = 80, tankCapacity, tankUnit = 'L', startingStorage = 0, monthlyDemandValues } = {}) {
  const areaFactor = AREA_TO_M2[areaUnit];
  const rainFactor = RAIN_TO_MM[rainfallUnit];
  const volumeFactor = VOLUME_TO_L[tankUnit];
  if (!areaFactor || !rainFactor || !volumeFactor) throw new TypeError('Choose supported area, rainfall and volume units.');
  const areaM2 = bounded('Catchment area', catchmentArea, Number.EPSILON, MAX_VALUE) * areaFactor;
  const tankLiters = bounded('Tank capacity', tankCapacity, Number.EPSILON, MAX_VALUE) * volumeFactor;
  const startingLiters = bounded('Starting storage', startingStorage, 0, tankCapacity) * volumeFactor;
  const runoff = bounded('Runoff coefficient', runoffPercent, 0, 100) / 100;
  if (!Array.isArray(rainfallValues) || rainfallValues.length !== MAX_MONTHS || rainfallValues.some((value) => !Number.isFinite(value) || value < 0 || value > 100_000)) throw new TypeError('Enter 12 valid monthly rainfall values.');
  if (!Array.isArray(monthlyDemandValues) || monthlyDemandValues.length !== MAX_MONTHS || monthlyDemandValues.some((value) => !Number.isFinite(value) || value < 0 || value > MAX_VALUE)) throw new TypeError('Enter 12 valid monthly demand values.');
  let storage = startingLiters;
  const months = rainfallValues.map((rainfall, index) => {
    const demandLiters = monthlyDemandValues[index] * volumeFactor;
    const collectedLiters = rainfall * rainFactor / 1000 * areaM2 * 1000 * runoff;
    const availableLiters = storage + collectedLiters;
    const overflowLiters = Math.max(0, availableLiters - tankLiters);
    const afterHarvestLiters = Math.min(tankLiters, availableLiters);
    const servedDemandLiters = Math.min(afterHarvestLiters, demandLiters);
    const unmetDemandLiters = demandLiters - servedDemandLiters;
    storage = afterHarvestLiters - servedDemandLiters;
    return Object.freeze({ month: index + 1, rainfall, collectedLiters, demandLiters, overflowLiters, servedDemandLiters, unmetDemandLiters, endingStorageLiters: storage });
  });
  const total = (key) => months.reduce((sum, month) => sum + month[key], 0);
  return Object.freeze({
    areaUnit, rainfallUnit, tankUnit, areaM2, tankLiters, startingStorageLiters: startingLiters,
    totalCollectedLiters: total('collectedLiters'), totalDemandLiters: total('demandLiters'),
    totalOverflowLiters: total('overflowLiters'), totalServedLiters: total('servedDemandLiters'),
    totalUnmetDemandLiters: total('unmetDemandLiters'), endingStorageLiters: storage,
    months: Object.freeze(months),
  });
}
