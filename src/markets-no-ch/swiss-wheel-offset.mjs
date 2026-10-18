const finite = (value, label) => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) throw new RangeError(`${label} must be a finite number.`);
  const number = Number(value);
  if (!Number.isFinite(number)) throw new RangeError(`${label} must be a finite number.`);
  return number;
};

const positiveWidthMm = (value, unit, label) => {
  const width = finite(value, label) * (unit === 'in' ? 25.4 : 1);
  if (width < 50 || width > 1000) throw new RangeError(`${label} must be between 50 and 1,000 mm.`);
  return width;
};

const millimetres = (value, unit, label, maximum = 1000) => {
  const result = finite(value, label) * (unit === 'in' ? 25.4 : 1);
  if (Math.abs(result) > maximum) throw new RangeError(`${label} is outside the supported range.`);
  return result;
};

/**
 * Compare wheel-rim edge movement from width, ET and spacer inputs.
 * Positive innerMovementMm means closer to suspension; positive outerMovementMm means farther outward.
 * This is geometry only and cannot determine actual vehicle fitment or remaining clearance without measured baselines.
 */
export function compareWheelOffset({
  currentWidth, newWidth, widthUnit = 'in', currentEt, newEt,
  currentSpacer = 0, newSpacer = 0, offsetUnit = 'mm',
  currentInnerClearance = null, currentOuterClearance = null, clearanceUnit = 'mm',
} = {}) {
  if (!['in', 'mm'].includes(widthUnit) || !['in', 'mm'].includes(offsetUnit) || !['in', 'mm'].includes(clearanceUnit)) {
    throw new RangeError('Choose inches or millimetres for each measurement group.');
  }
  const currentWidthMm = positiveWidthMm(currentWidth, widthUnit, 'Current rim width');
  const newWidthMm = positiveWidthMm(newWidth, widthUnit, 'New rim width');
  const currentEtMm = millimetres(currentEt, offsetUnit, 'Current ET', 500);
  const newEtMm = millimetres(newEt, offsetUnit, 'New ET', 500);
  const currentSpacerMm = millimetres(currentSpacer, offsetUnit, 'Current spacer', 100);
  const newSpacerMm = millimetres(newSpacer, offsetUnit, 'New spacer', 100);
  const widthHalfChange = (newWidthMm - currentWidthMm) / 2;
  const effectiveEtChange = (newEtMm - newSpacerMm) - (currentEtMm - currentSpacerMm);
  const innerMovementMm = widthHalfChange + effectiveEtChange;
  const outerMovementMm = widthHalfChange - effectiveEtChange;
  const centerlineMovementMm = -effectiveEtChange;
  const clearance = (value, movement, label) => {
    if (value === null || value === undefined || value === '') return null;
    const mm = millimetres(value, clearanceUnit, label, 5000);
    if (mm < 0) throw new RangeError(`${label} cannot be negative.`);
    return mm - movement;
  };
  const remainingInnerClearanceMm = clearance(currentInnerClearance, innerMovementMm, 'Current inner clearance');
  const remainingOuterClearanceMm = clearance(currentOuterClearance, outerMovementMm, 'Current outer clearance');
  return Object.freeze({
    currentWidthMm, newWidthMm, currentEtMm, newEtMm, currentSpacerMm, newSpacerMm,
    effectiveEtChangeMm: effectiveEtChange,
    widthHalfChangeMm: widthHalfChange,
    innerMovementMm,
    outerMovementMm,
    centerlineMovementMm,
    remainingInnerClearanceMm,
    remainingOuterClearanceMm,
    isInnerClearanceNegative: remainingInnerClearanceMm !== null && remainingInnerClearanceMm < 0,
    isOuterClearanceNegative: remainingOuterClearanceMm !== null && remainingOuterClearanceMm < 0,
  });
}

export function wheelMovementCsv(result) {
  if (!result) throw new TypeError('Calculate a comparison before exporting.');
  const rows = [
    ['measurement', 'millimetres'],
    ['inner rim movement (+ toward suspension)', result.innerMovementMm],
    ['outer rim movement (+ outward)', result.outerMovementMm],
    ['wheel centerline movement (+ outward)', result.centerlineMovementMm],
    ['remaining inner clearance estimate', result.remainingInnerClearanceMm ?? ''],
    ['remaining outer clearance estimate', result.remainingOuterClearanceMm ?? ''],
  ];
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  return `\uFEFF${rows.map((row) => row.map(quote).join(',')).join('\r\n')}`;
}
