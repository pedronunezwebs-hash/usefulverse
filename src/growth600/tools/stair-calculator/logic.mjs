const MM_PER_UNIT = Object.freeze({ m: 1000, cm: 10, mm: 1, in: 25.4, ft: 304.8 });

function finiteRange(value, label, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} must be between ${min} and ${max}.`);
  return number;
}

export function calculateStairGeometry(totalRise, riserCount, treadDepth, unit = 'm') {
  const mmPerUnit = MM_PER_UNIT[unit];
  if (!mmPerUnit) throw new TypeError('Choose a supported length unit.');
  const riseMm = finiteRange(totalRise, 'Total rise', 300 / mmPerUnit, 10_000 / mmPerUnit) * mmPerUnit;
  const count = finiteRange(riserCount, 'Riser count', 2, 100);
  if (!Number.isInteger(count)) throw new RangeError('Riser count must be a whole number.');
  const treadMm = finiteRange(treadDepth, 'Tread depth', 100 / mmPerUnit, 1_500 / mmPerUnit) * mmPerUnit;
  const treadCount = count - 1;
  const riserHeightMm = riseMm / count;
  const totalRunMm = treadMm * treadCount;
  return Object.freeze({
    unit,
    totalRise: riseMm / mmPerUnit,
    riserCount: count,
    riserHeight: riserHeightMm / mmPerUnit,
    treadCount,
    treadDepth: treadMm / mmPerUnit,
    totalRun: totalRunMm / mmPerUnit,
    angleDegrees: Math.atan2(riserHeightMm, treadMm) * 180 / Math.PI,
    stringerLength: Math.hypot(riseMm, totalRunMm) / mmPerUnit,
  });
}
