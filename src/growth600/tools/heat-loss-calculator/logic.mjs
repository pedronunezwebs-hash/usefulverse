const AREA_TO_M2 = Object.freeze({ m2: 1, ft2: 0.09290304 });
const TEMPERATURE_TO_K = Object.freeze({ K: 1, F: 5 / 9 });
const VOLUME_TO_M3 = Object.freeze({ m3: 1, ft3: 0.028316846592 });
const COMPONENTS = Object.freeze(['walls', 'roof', 'windows', 'floor']);
const WATT_TO_BTU_PER_HOUR = 3.412141633;

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateHeatLoss({ areaUnit = 'm2', temperatureUnit = 'K', volumeUnit = 'm3', temperatureDifference, wallArea, wallUValue, roofArea, roofUValue, windowArea, windowUValue, floorArea, floorUValue, roomVolume, airChangesPerHour } = {}) {
  const areaFactor = AREA_TO_M2[areaUnit];
  const temperatureFactor = TEMPERATURE_TO_K[temperatureUnit];
  const volumeFactor = VOLUME_TO_M3[volumeUnit];
  if (!areaFactor || !temperatureFactor || !volumeFactor) throw new TypeError('Choose supported area, volume and temperature-difference units.');
  const deltaK = bounded('Temperature difference', temperatureDifference, 0, 1000) * temperatureFactor;
  const components = Object.fromEntries(COMPONENTS.map((name) => {
    const area = bounded(`${name} area`, { walls: wallArea, roof: roofArea, windows: windowArea, floor: floorArea }[name], 0, 100_000_000) * areaFactor;
    const uValue = bounded(`${name} U-value`, { walls: wallUValue, roof: roofUValue, windows: windowUValue, floor: floorUValue }[name], 0, 1000);
    return [name, Object.freeze({ areaM2: area, uValue, watts: area * uValue * deltaK })];
  }));
  const volumeM3 = bounded('Room volume', roomVolume, 0, 1_000_000_000) * volumeFactor;
  const airChanges = bounded('Air changes per hour', airChangesPerHour, 0, 100);
  const ventilationWatts = 0.33 * volumeM3 * airChanges * deltaK;
  const transmissionWatts = COMPONENTS.reduce((sum, name) => sum + components[name].watts, 0);
  const totalWatts = transmissionWatts + ventilationWatts;
  return Object.freeze({ areaUnit, temperatureUnit, volumeUnit, temperatureDifference, deltaK, components, volumeM3, airChangesPerHour: airChanges, transmissionWatts, ventilationWatts, totalWatts, totalBtuPerHour: totalWatts * WATT_TO_BTU_PER_HOUR });
}
