const MILLIMETRES_PER_UNIT = Object.freeze({ mm: 1, cm: 10, m: 1000, km: 1_000_000, in: 25.4, ft: 304.8 });

const finite = (value, label) => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) throw new RangeError(`${label} must be a finite number.`);
  const number = Number(value);
  if (!Number.isFinite(number)) throw new RangeError(`${label} must be a finite number.`);
  return number;
};

const positiveScale = (value, label) => {
  const result = finite(value, label);
  if (result < 1 || result > 1_000_000_000) throw new RangeError(`${label} must be between 1 and 1,000,000,000.`);
  return result;
};

const unitFactor = (unit) => {
  const factor = MILLIMETRES_PER_UNIT[unit];
  if (!factor) throw new RangeError('Choose a supported length unit.');
  return factor;
};

/** Convert one drawing measurement to its real-world length and proposed-scale paper length. */
export function calculateScale({ sourceDenominator, targetDenominator = sourceDenominator, drawingDistance, drawingUnit = 'mm' } = {}) {
  const source = positiveScale(sourceDenominator, 'Source scale denominator');
  const target = positiveScale(targetDenominator, 'Target scale denominator');
  const factor = unitFactor(drawingUnit);
  const distance = finite(drawingDistance, 'Drawing distance');
  if (distance <= 0 || distance > 1_000_000_000) throw new RangeError('Drawing distance must be greater than zero and within range.');
  const drawingLengthMm = distance * factor;
  const realLengthMm = drawingLengthMm * source;
  const targetDrawingLengthMm = realLengthMm / target;
  if (![drawingLengthMm, realLengthMm, targetDrawingLengthMm].every(Number.isFinite)) throw new RangeError('The result is outside the supported range.');
  return Object.freeze({ sourceDenominator: source, targetDenominator: target, drawingLengthMm, realLengthMm, targetDrawingLengthMm, printScalePercent: (source / target) * 100 });
}

/** Make a bounded table of real distances and their lengths on a drawing at two scales. */
export function calculateScaleTable({ sourceDenominator, targetDenominator = sourceDenominator, distances = [], realUnit = 'm' } = {}) {
  const source = positiveScale(sourceDenominator, 'Source scale denominator');
  const target = positiveScale(targetDenominator, 'Target scale denominator');
  const realFactor = unitFactor(realUnit);
  if (!Array.isArray(distances) || distances.length > 100) throw new RangeError('Enter no more than 100 distances.');
  return Object.freeze(distances.map((value, index) => {
    const distance = finite(value, `Distance ${index + 1}`);
    if (distance <= 0 || distance > 1_000_000_000) throw new RangeError(`Distance ${index + 1} must be greater than zero and within range.`);
    const realLengthMm = distance * realFactor;
    return Object.freeze({ index: index + 1, realDistance: distance, realUnit, sourceDrawingMm: realLengthMm / source, targetDrawingMm: realLengthMm / target });
  }));
}

/** Return a self-contained, physically dimensioned SVG scale bar for printing. */
export function createScaleBarSvg({ denominator, realDistance, realUnit = 'm' } = {}) {
  const scale = positiveScale(denominator, 'Scale denominator');
  const distance = finite(realDistance, 'Scale-bar real distance');
  if (distance <= 0 || distance > 1_000_000_000) throw new RangeError('Scale-bar distance must be greater than zero and within range.');
  const drawnMm = (distance * unitFactor(realUnit)) / scale;
  if (!Number.isFinite(drawnMm) || drawnMm < 1 || drawnMm > 250) throw new RangeError('Choose a real distance that draws between 1 mm and 250 mm at this scale.');
  const width = Number(drawnMm.toFixed(3));
  const label = `${distance} ${realUnit} at 1:${scale}`;
  return Object.freeze({ widthMm: width, label, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="18mm" viewBox="0 0 ${width} 18" role="img" aria-label="${label}"><title>${label}</title><rect x="0.2" y="4" width="${Math.max(0, width - 0.4)}" height="2" fill="#142a3b"/><path d="M0.2 2v6 M${Math.max(0.2, width - 0.2)} 2v6" stroke="#142a3b" stroke-width="0.4"/><text x="${width / 2}" y="14" text-anchor="middle" font-family="Arial,sans-serif" font-size="4" fill="#142a3b">${label}</text></svg>` });
}

export function scaleTableCsv(rows = []) {
  if (!Array.isArray(rows) || rows.length > 100) throw new RangeError('Enter no more than 100 table rows.');
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const lines = [['row', 'real_distance', 'unit', 'current_drawing_mm', 'target_drawing_mm'], ...rows.map((row) => [row.index, row.realDistance, row.realUnit, row.sourceDrawingMm, row.targetDrawingMm])];
  return `\uFEFF${lines.map((line) => line.map(quote).join(',')).join('\r\n')}`;
}
