const WALL_TO_M = Object.freeze({ m: 1, ft: 0.3048 });
const BLOCK_TO_M = Object.freeze({ cm: 0.01, in: 0.0254 });
const M3_TO_FT3 = 35.3146667215;

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateRetainingWall({
  wallLength, wallHeight, wallUnit = 'ft', blockLength, blockHeight, blockDepth,
  blockUnit = 'in', joint = 0.25, baseWidth, baseDepth, backfillThickness,
  wastePercent = 0,
} = {}) {
  const wallFactor = WALL_TO_M[wallUnit];
  const blockFactor = BLOCK_TO_M[blockUnit];
  if (!wallFactor || !blockFactor) throw new TypeError('Choose supported wall and block units.');
  const lengthM = bounded('Wall length', wallLength, 0.01, 100_000) * wallFactor;
  const heightM = bounded('Wall height', wallHeight, 0, 10_000) * wallFactor;
  const blockLengthM = bounded('Block length', blockLength, 0.1, 100_000) * blockFactor;
  const blockHeightM = bounded('Block height', blockHeight, 0.1, 100_000) * blockFactor;
  const blockDepthM = bounded('Block depth', blockDepth, 0.1, 100_000) * blockFactor;
  const jointM = bounded('Block joint', joint, 0, 1_000) * blockFactor;
  const baseWidthM = bounded('User-entered base width', baseWidth, 0, 10_000) * wallFactor;
  const baseDepthM = bounded('User-entered base depth', baseDepth, 0, 10_000) * wallFactor;
  const backfillThicknessM = bounded('User-entered backfill thickness', backfillThickness, 0, 10_000) * wallFactor;
  const extra = bounded('Extra material percentage', wastePercent, 0, 50);

  const courses = heightM === 0 ? 0 : Math.ceil(heightM / (blockHeightM + jointM));
  const blocksPerCourse = heightM === 0 ? 0 : Math.ceil(lengthM / (blockLengthM + jointM));
  const blocksBeforeWaste = courses * blocksPerCourse;
  const blocksToOrder = Math.ceil(blocksBeforeWaste * (1 + extra / 100));
  const baseVolumeM3 = heightM === 0 ? 0 : lengthM * baseWidthM * baseDepthM;
  const backfillVolumeM3 = heightM === 0 ? 0 : lengthM * heightM * backfillThicknessM;
  const baseOrderM3 = baseVolumeM3 * (1 + extra / 100);
  const backfillOrderM3 = backfillVolumeM3 * (1 + extra / 100);
  if (![blocksToOrder, baseVolumeM3, backfillVolumeM3, baseOrderM3, backfillOrderM3].every(Number.isFinite) || !Number.isSafeInteger(blocksToOrder)) {
    throw new RangeError('The requested wall is too large to estimate accurately.');
  }
  return Object.freeze({
    wallLengthM: lengthM, wallHeightM: heightM, blockLengthM, blockHeightM, blockDepthM,
    courses, blocksPerCourse, blocksBeforeWaste, blocksToOrder, wastePercent: extra,
    baseVolumeM3, baseOrderM3, backfillVolumeM3, backfillOrderM3,
    baseVolumeFt3: baseVolumeM3 * M3_TO_FT3, baseOrderFt3: baseOrderM3 * M3_TO_FT3,
    backfillVolumeFt3: backfillVolumeM3 * M3_TO_FT3, backfillOrderFt3: backfillOrderM3 * M3_TO_FT3,
  });
}
