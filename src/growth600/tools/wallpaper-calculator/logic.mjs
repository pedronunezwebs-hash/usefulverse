export const WALLPAPER_LENGTH_TO_M = Object.freeze({ m: 1, ft: 0.3048 });
const TRIM_ALLOWANCE_M = 0.1;

function bounded(name, value, { minimum, maximum }) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be from ${minimum} to ${maximum}.`);
  }
  return value;
}

function whole(value) {
  return Math.ceil(value - Math.max(1, Math.abs(value)) * 1e-12);
}

export function calculateWallpaper({
  perimeter,
  wallHeight,
  openingsArea = 0,
  rollWidth,
  rollLength,
  patternRepeat = 0,
  wastePercent = 10,
  unit = 'm',
} = {}) {
  const factor = WALLPAPER_LENGTH_TO_M[unit];
  if (!factor) throw new RangeError('Choose metres or feet.');

  const perimeterM = bounded('Wall perimeter', perimeter, { minimum: 0.1, maximum: 100_000 }) * factor;
  const wallHeightM = bounded('Wall height', wallHeight, { minimum: 0.1, maximum: 100 }) * factor;
  const openingsAreaM2 = bounded('Door and window area', openingsArea, { minimum: 0, maximum: 1_000_000 }) * factor ** 2;
  const rollWidthM = bounded('Roll width', rollWidth, { minimum: 0.05, maximum: 20 }) * factor;
  const rollLengthM = bounded('Roll length', rollLength, { minimum: 0.1, maximum: 200 }) * factor;
  const patternRepeatM = bounded('Pattern repeat', patternRepeat, { minimum: 0, maximum: 10 }) * factor;
  bounded('Extra material', wastePercent, { minimum: 0, maximum: 50 });

  const grossWallAreaM2 = perimeterM * wallHeightM;
  if (openingsAreaM2 >= grossWallAreaM2) throw new RangeError('Door and window area must be smaller than the gross wall area.');
  const netWallAreaM2 = grossWallAreaM2 - openingsAreaM2;
  const unroundedDropLengthM = wallHeightM + TRIM_ALLOWANCE_M;
  const dropLengthM = patternRepeatM > 0
    ? whole(unroundedDropLengthM / patternRepeatM) * patternRepeatM
    : unroundedDropLengthM;
  const dropsPerRoll = Math.floor((rollLengthM + 1e-10) / dropLengthM);
  if (dropsPerRoll < 1) throw new RangeError('Roll length must fit at least one trimmed wall drop.');

  // Opening area is converted into equivalent full-height width; individual wall layouts are unknown.
  const equivalentCoveredRunM = netWallAreaM2 / wallHeightM;
  const stripsNeeded = whole(equivalentCoveredRunM / rollWidthM);
  const stripsToOrder = whole(stripsNeeded * (1 + wastePercent / 100));
  const rollsNeeded = whole(stripsToOrder / dropsPerRoll);

  return Object.freeze({
    perimeterM,
    wallHeightM,
    grossWallAreaM2,
    openingsAreaM2,
    netWallAreaM2,
    rollWidthM,
    rollLengthM,
    patternRepeatM,
    dropLengthM,
    dropsPerRoll,
    stripsNeeded,
    stripsToOrder,
    rollsNeeded,
    wastePercent,
  });
}
