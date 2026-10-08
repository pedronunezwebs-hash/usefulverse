const TO_METERS = Object.freeze({ m: 1, ft: 0.3048 });

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculatePond({ shape = 'rectangle', length, width, diameter, dimensionUnit = 'm', averageDepth, maximumDepth, edgeOverlap = 0.3, fillPercent = 100 } = {}) {
  const factor = TO_METERS[dimensionUnit];
  if (!factor) throw new TypeError('Choose meters or feet.');
  if (!['rectangle', 'circle', 'oval'].includes(shape)) throw new TypeError('Choose a rectangular, circular or oval pond.');
  const averageDepthM = bounded('Average water depth', averageDepth, 0.01, 100_000) * factor;
  const maximumDepthM = bounded('Maximum pond depth', maximumDepth, 0.01, 100_000) * factor;
  if (maximumDepthM < averageDepthM) throw new RangeError('Maximum pond depth cannot be less than average water depth.');
  const overlapM = bounded('Edge overlap', edgeOverlap, 0, 100_000) * factor;
  const fill = bounded('Fill percentage', fillPercent, 1, 100) / 100;
  let footprintM2;
  let linerLengthM;
  let linerWidthM;
  if (shape === 'circle') {
    const diameterM = bounded('Pond diameter', diameter, 0.1, 100_000) * factor;
    footprintM2 = Math.PI * diameterM ** 2 / 4;
    linerLengthM = diameterM + 2 * (maximumDepthM + overlapM);
    linerWidthM = linerLengthM;
  } else {
    const lengthM = bounded('Pond length', length, 0.1, 100_000) * factor;
    const widthM = bounded('Pond width', width, 0.1, 100_000) * factor;
    footprintM2 = shape === 'oval' ? Math.PI * lengthM * widthM / 4 : lengthM * widthM;
    linerLengthM = lengthM + 2 * (maximumDepthM + overlapM);
    linerWidthM = widthM + 2 * (maximumDepthM + overlapM);
  }
  const geometricCapacityM3 = footprintM2 * averageDepthM;
  const filledVolumeM3 = geometricCapacityM3 * fill;
  const linerAreaM2 = linerLengthM * linerWidthM;
  const fromMeters = (value) => value / factor;
  return Object.freeze({
    shape, dimensionUnit, footprintM2, averageDepth: fromMeters(averageDepthM), maximumDepth: fromMeters(maximumDepthM), edgeOverlap: fromMeters(overlapM), fillPercent: fillPercent,
    geometricCapacityM3, filledVolumeM3,
    liters: filledVolumeM3 * 1000,
    usGallons: filledVolumeM3 * 264.172052,
    imperialGallons: filledVolumeM3 * 219.969248,
    linerLength: fromMeters(linerLengthM), linerWidth: fromMeters(linerWidthM),
    linerArea: linerAreaM2 / (factor ** 2),
  });
}
