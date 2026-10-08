const WALL_TO_METERS = Object.freeze({ m: 1, ft: 0.3048 });
const BRICK_TO_METERS = Object.freeze({ cm: 0.01, in: 0.0254 });

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} must be from ${min} to ${max}.`);
  return value;
}

export function calculateBrickMaterials({
  wallLength, wallHeight, wallUnit = 'ft', brickLength, brickHeight, brickDepth, brickUnit = 'in',
  joint = 0.375, jointUnit = brickUnit, openingWidth = 0, openingHeight = 0, openingCount = 0,
  wythes = 1, wastePercent = 5, bagYieldLiters = null,
} = {}) {
  const wallFactor = WALL_TO_METERS[wallUnit];
  const brickFactor = BRICK_TO_METERS[brickUnit];
  const jointFactor = BRICK_TO_METERS[jointUnit];
  if (!wallFactor || !brickFactor || !jointFactor) throw new RangeError('Choose supported measurement units.');
  const lengthM = bounded('Wall length', wallLength, 0.01, 10_000) * wallFactor;
  const heightM = bounded('Wall height', wallHeight, 0.01, 10_000) * wallFactor;
  const brickLengthM = bounded('Brick length', brickLength, 1, 100_000) * brickFactor;
  const brickHeightM = bounded('Brick height', brickHeight, 1, 100_000) * brickFactor;
  const brickDepthM = bounded('Brick depth', brickDepth, 1, 100_000) * brickFactor;
  const jointM = bounded('Mortar joint', joint, 0, 1000) * jointFactor;
  const openingW = bounded('Opening width', openingWidth, 0, 100_000) * wallFactor;
  const openingH = bounded('Opening height', openingHeight, 0, 100_000) * wallFactor;
  bounded('Opening count', openingCount, 0, 1000);
  if (!Number.isInteger(openingCount)) throw new RangeError('Opening count must be a whole number.');
  bounded('Wall wythes', wythes, 1, 4);
  if (!Number.isInteger(wythes)) throw new RangeError('Wall wythes must be a whole number.');
  const extra = bounded('Waste percentage', wastePercent, 0, 50);
  if ((openingWidth === 0) !== (openingHeight === 0) && openingCount > 0) throw new RangeError('Enter both opening dimensions.');

  const grossAreaM2 = lengthM * heightM;
  const openingAreaM2 = openingCount * openingW * openingH;
  if (openingAreaM2 > grossAreaM2) throw new RangeError('Openings cannot exceed the wall area.');
  const netAreaM2 = grossAreaM2 - openingAreaM2;
  const moduleLengthM = brickLengthM + jointM;
  const moduleHeightM = brickHeightM + jointM;
  const courses = Math.ceil(heightM / moduleHeightM);
  const bricksPerWythe = Math.ceil(netAreaM2 / (moduleLengthM * moduleHeightM));
  const bricksBeforeWaste = bricksPerWythe * wythes;
  const bricksToOrder = Math.ceil(bricksBeforeWaste * (1 + extra / 100));
  const mortarPerBrickM3 = Math.max(0, moduleLengthM * moduleHeightM * brickDepthM - brickLengthM * brickHeightM * brickDepthM);
  const mortarLiters = bricksToOrder * mortarPerBrickM3 * 1000;
  const yieldLiters = bagYieldLiters === null ? null : bounded('Bag yield', bagYieldLiters, 0.1, 100_000);
  const mortarBags = yieldLiters === null ? null : Math.ceil(mortarLiters / yieldLiters);
  if (![grossAreaM2, netAreaM2, bricksToOrder, mortarLiters].every(Number.isFinite) || !Number.isSafeInteger(bricksToOrder)) {
    throw new RangeError('The requested wall is too large to estimate accurately.');
  }
  return Object.freeze({
    grossAreaM2, netAreaM2, grossAreaFt2: grossAreaM2 / 0.09290304, netAreaFt2: netAreaM2 / 0.09290304,
    openingAreaM2, courses, bricksPerCourse: Math.ceil(bricksBeforeWaste / courses), wythes,
    bricksBeforeWaste, bricksToOrder, wastePercent: extra, mortarLiters, mortarCubicFeet: mortarLiters / 28.316846592,
    mortarBags, bagYieldLiters: yieldLiters,
  });
}
