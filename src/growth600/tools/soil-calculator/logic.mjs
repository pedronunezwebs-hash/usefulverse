const LENGTH_TO_M = Object.freeze({ m: 1, cm: 0.01, ft: 0.3048, in: 0.0254 });
const BAG_TO_M3 = Object.freeze({ l: 0.001, ft3: 0.028316846592 });

function finiteRange(value, label, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} must be between ${min} and ${max}.`);
  return number;
}

export function calculateSoil({ shape = 'rectangle', length, width, diameter, depth, dimensionUnit = 'm', containerCount = 1, wastePercent = 0, bagVolume = null, bagUnit = 'l' }) {
  const lengthFactor = LENGTH_TO_M[dimensionUnit];
  const bagFactor = BAG_TO_M3[bagUnit];
  if (!lengthFactor || !bagFactor) throw new TypeError('Choose supported units.');
  const fillDepthM = finiteRange(depth, 'Fill depth', 0.001, 100) * lengthFactor;
  const count = finiteRange(containerCount, 'Container count', 1, 10_000);
  if (!Number.isInteger(count)) throw new RangeError('Container count must be a whole number.');
  if (!['rectangle', 'circle'].includes(shape)) throw new TypeError('Choose a supported container shape.');

  let footprintM2;
  if (shape === 'rectangle') {
    footprintM2 = finiteRange(length, 'Length', 0.01, 10_000) * lengthFactor
      * finiteRange(width, 'Width', 0.01, 10_000) * lengthFactor;
  } else {
    const radiusM = finiteRange(diameter, 'Diameter', 0.01, 10_000) * lengthFactor / 2;
    footprintM2 = Math.PI * radiusM ** 2;
  }

  const waste = finiteRange(wastePercent, 'Waste', 0, 50);
  const bagM3 = bagVolume === '' || bagVolume == null ? null : finiteRange(bagVolume, 'Bag volume', 0.01, 100_000) * bagFactor;
  const volumePerContainerM3 = footprintM2 * fillDepthM;
  const totalVolumeM3 = volumePerContainerM3 * count;
  const orderVolumeM3 = totalVolumeM3 * (1 + waste / 100);
  return Object.freeze({
    shape, dimensionUnit, containerCount: count, wastePercent: waste, bagUnit,
    footprintM2, fillDepthM, volumePerContainerM3, totalVolumeM3, orderVolumeM3,
    bagVolumeM3: bagM3,
    bagsToBuy: bagM3 == null ? null : Math.ceil(orderVolumeM3 / bagM3),
  });
}
