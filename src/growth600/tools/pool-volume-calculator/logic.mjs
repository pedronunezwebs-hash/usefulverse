const LENGTH_TO_M = Object.freeze({ m: 1, cm: 0.01, ft: 0.3048, in: 0.0254 });
const LITERS_PER_M3 = 1000;
const US_GALLONS_PER_M3 = 264.172052;
const IMPERIAL_GALLONS_PER_M3 = 219.969248;

function finiteRange(value, label, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} must be between ${min} and ${max}.`);
  return number;
}

export function calculatePoolVolume({ shape = 'rectangle', length, width, diameter, floor = 'flat', shallowDepth, deepDepth = shallowDepth, dimensionUnit = 'm' }) {
  const factor = LENGTH_TO_M[dimensionUnit];
  if (!factor) throw new TypeError('Choose a supported unit.');
  if (!['rectangle', 'circle', 'oval'].includes(shape)) throw new TypeError('Choose a supported pool shape.');
  if (!['flat', 'sloped'].includes(floor)) throw new TypeError('Choose a supported floor type.');

  let areaM2;
  if (shape === 'circle') {
    const radius = finiteRange(diameter, 'Diameter', 0.01, 100_000) * factor / 2;
    areaM2 = Math.PI * radius ** 2;
  } else {
    const lengthM = finiteRange(length, 'Length', 0.01, 100_000) * factor;
    const widthM = finiteRange(width, 'Width', 0.01, 100_000) * factor;
    areaM2 = shape === 'oval' ? Math.PI * lengthM * widthM / 4 : lengthM * widthM;
  }

  const shallowM = finiteRange(shallowDepth, 'Shallow depth', 0.01, 100_000) * factor;
  const deepM = floor === 'flat' ? shallowM : finiteRange(deepDepth, 'Deep depth', 0.01, 100_000) * factor;
  const averageDepthM = (shallowM + deepM) / 2;
  const volumeM3 = areaM2 * averageDepthM;
  return Object.freeze({ shape, floor, dimensionUnit, areaM2, shallowDepthM: shallowM, deepDepthM: deepM, averageDepthM, volumeM3,
    liters: volumeM3 * LITERS_PER_M3, usGallons: volumeM3 * US_GALLONS_PER_M3, imperialGallons: volumeM3 * IMPERIAL_GALLONS_PER_M3 });
}
