const LINEAR_TO_METERS = Object.freeze({ m: 1, ft: 0.3048 });
const MODULE_TO_METERS = Object.freeze({ cm: 0.01, in: 0.0254 });
const DEPTH_TO_METERS = Object.freeze({ cm: 0.01, in: 0.0254, mm: 0.001 });

function bounded(name, value, minimum, maximum) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be from ${minimum} to ${maximum}.`);
  }
  return value;
}

function ceilStable(value) {
  return Math.ceil(value - Math.max(1, Math.abs(value)) * 1e-12);
}

export function calculatePavers({
  length, width, surfaceUnit = 'm', moduleLength, moduleWidth, moduleUnit = 'cm', paversPerModule = 1,
  baseDepth = 0, baseDepthUnit = 'cm', baseWastePercent = 0, paverWastePercent = 0,
  pricePerPaver = null, basePricePerM3 = null, currency = 'USD',
} = {}) {
  const surfaceFactor = LINEAR_TO_METERS[surfaceUnit];
  const moduleFactor = MODULE_TO_METERS[moduleUnit];
  const depthFactor = DEPTH_TO_METERS[baseDepthUnit];
  if (!surfaceFactor || !moduleFactor || !depthFactor) throw new RangeError('Choose supported measurement units.');

  const lengthM = bounded('Surface length', length, 0.01, 100_000) * surfaceFactor;
  const widthM = bounded('Surface width', width, 0.01, 100_000) * surfaceFactor;
  const moduleLengthM = bounded('Module length', moduleLength, 1, 100_000) * moduleFactor;
  const moduleWidthM = bounded('Module width', moduleWidth, 1, 100_000) * moduleFactor;
  bounded('Pavers per repeat module', paversPerModule, 1, 1000);
  if (!Number.isInteger(paversPerModule)) throw new RangeError('Pavers per repeat module must be a whole number.');
  const depthM = bounded('Base depth', baseDepth, 0, 100) * depthFactor;
  bounded('Paver allowance', paverWastePercent, 0, 50);
  bounded('Base allowance', baseWastePercent, 0, 50);

  const validatePrice = (name, value) => value === null ? null : bounded(name, value, 0, 1_000_000);
  const paverPrice = validatePrice('Price per paver', pricePerPaver);
  const basePrice = validatePrice('Base price per cubic metre', basePricePerM3);
  if ((paverPrice !== null || basePrice !== null) && !/^[A-Z]{3}$/u.test(currency)) {
    throw new RangeError('Currency must be a 3-letter code.');
  }

  const areaM2 = lengthM * widthM;
  bounded('Surface area', areaM2, 0.0001, 10_000_000_000);
  // Count complete repeat modules in a fixed orientation; edge offcuts may be reusable.
  const modulesAlongLength = ceilStable(lengthM / moduleLengthM);
  const modulesAlongWidth = ceilStable(widthM / moduleWidthM);
  const repeatModules = modulesAlongLength * modulesAlongWidth;
  const paversBeforeWaste = repeatModules * paversPerModule;
  const paversToBuy = ceilStable(paversBeforeWaste * (1 + paverWastePercent / 100));
  if (![modulesAlongLength, modulesAlongWidth, repeatModules, paversBeforeWaste, paversToBuy].every(Number.isSafeInteger)) {
    throw new RangeError('The requested layout is too large to represent accurately.');
  }
  const perimeterM = 2 * (lengthM + widthM);
  const baseVolumeM3 = areaM2 * depthM;
  const baseOrderVolumeM3 = baseVolumeM3 * (1 + baseWastePercent / 100);
  const paverCost = paverPrice === null ? null : paversToBuy * paverPrice;
  const baseCost = basePrice === null ? null : baseOrderVolumeM3 * basePrice;
  for (const [name, total] of [['Paver cost', paverCost], ['Base cost', baseCost]]) {
    if (total !== null && (!Number.isFinite(total) || total > Number.MAX_SAFE_INTEGER)) {
      throw new RangeError(`${name} is too large to represent accurately.`);
    }
  }

  return Object.freeze({
    areaM2, areaFt2: areaM2 / 0.09290304, perimeterM, perimeterFt: perimeterM / 0.3048,
    moduleAreaM2: moduleLengthM * moduleWidthM, modulesAlongLength, modulesAlongWidth, repeatModules,
    paversBeforeWaste, paversToBuy, paverWastePercent, depthM, baseVolumeM3, baseOrderVolumeM3,
    baseWastePercent, paverCost, baseCost, estimatedCost: paverCost === null && baseCost === null ? null : (paverCost ?? 0) + (baseCost ?? 0),
    currency: paverPrice === null && basePrice === null ? null : currency,
  });
}
