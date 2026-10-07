const TO_METERS = Object.freeze({ m: 1, cm: 0.01, ft: 0.3048, in: 0.0254 });
const LITERS_PER_M3 = 1000;
const US_GALLONS_PER_M3 = 264.172052;
const IMPERIAL_GALLONS_PER_M3 = 219.969248;
const POUNDS_PER_KILOGRAM = 2.20462262185;

function bounded(value, label, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${label} must be from ${min} to ${max}.`);
  return value;
}

export function calculateAquarium({ length, width, height, unit = 'cm', substrateDepth = 0, substrateSolidPercent = 50, airGap = 0 } = {}) {
  const factor = TO_METERS[unit];
  if (!factor) throw new TypeError('Choose a supported dimension unit.');
  const lengthM = bounded(length, 'Length', 0.01, 100_000) * factor;
  const widthM = bounded(width, 'Width', 0.01, 100_000) * factor;
  const heightM = bounded(height, 'Height', 0.01, 100_000) * factor;
  const substrateDepthM = bounded(substrateDepth, 'Substrate depth', 0, 100_000) * factor;
  const airGapM = bounded(airGap, 'Air gap', 0, 100_000) * factor;
  const solidPercent = bounded(substrateSolidPercent, 'Substrate solid fraction', 0, 100);
  if (substrateDepthM + airGapM >= heightM) throw new RangeError('Substrate depth and air gap must be less than tank height.');

  const footprintM2 = lengthM * widthM;
  const tankVolumeM3 = footprintM2 * heightM;
  const substrateDisplacementM3 = footprintM2 * substrateDepthM * solidPercent / 100;
  const airSpaceM3 = footprintM2 * airGapM;
  const waterVolumeM3 = tankVolumeM3 - substrateDisplacementM3 - airSpaceM3;
  if (!(waterVolumeM3 > 0)) throw new RangeError('The entered substrate and air space leave no water volume.');
  const liters = waterVolumeM3 * LITERS_PER_M3;
  const waterMassKg = liters;
  return Object.freeze({
    unit, lengthM, widthM, heightM, substrateDepthM, substrateSolidPercent, airGapM, footprintM2,
    tankVolumeLiters: tankVolumeM3 * LITERS_PER_M3,
    substrateDisplacementLiters: substrateDisplacementM3 * LITERS_PER_M3,
    airSpaceLiters: airSpaceM3 * LITERS_PER_M3,
    waterLiters: liters,
    usGallons: waterVolumeM3 * US_GALLONS_PER_M3,
    imperialGallons: waterVolumeM3 * IMPERIAL_GALLONS_PER_M3,
    waterMassKg,
    waterMassLb: waterMassKg * POUNDS_PER_KILOGRAM,
  });
}
