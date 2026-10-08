const LENGTH_TO_M = Object.freeze({ m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 });

function finiteRange(value, label, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} must be between ${min} and ${max}.`);
  return number;
}

function ceilWithoutFloatingPointNoise(value) {
  return Math.ceil(value - (Number.EPSILON * 16 * Math.max(1, Math.abs(value))));
}

export function calculateDeck({
  length, width, unit = 'ft', boardWidth, boardUnit = unit, gap = 0, stockBoardLength, joistSpacing,
  wastePercent = 10, fastenersPerIntersection = 2, pricePerBoard = null,
}) {
  const factor = LENGTH_TO_M[unit];
  const boardFactor = LENGTH_TO_M[boardUnit];
  if (!factor) throw new TypeError('Choose a supported length unit.');
  if (!boardFactor) throw new TypeError('Choose a supported board measurement unit.');
  const lengthM = finiteRange(length, 'Deck length', 0.1, 100_000) * factor;
  const widthM = finiteRange(width, 'Deck width', 0.1, 100_000) * factor;
  const boardWidthM = finiteRange(boardWidth, 'Board width', 0.01 / boardFactor, 2 / boardFactor) * boardFactor;
  const gapM = finiteRange(gap, 'Gap', 0, 0.05 / boardFactor) * boardFactor;
  const stockBoardLengthM = finiteRange(stockBoardLength, 'Stock board length', 0.1, 25_000) * factor;
  const joistSpacingM = finiteRange(joistSpacing, 'Joist spacing', 0.1 / boardFactor, 1_500 / boardFactor) * boardFactor;
  const waste = finiteRange(wastePercent, 'Waste', 0, 30);
  const fasteners = finiteRange(fastenersPerIntersection, 'Fasteners per intersection', 1, 20);
  if (!Number.isInteger(fasteners)) throw new RangeError('Fasteners per intersection must be a whole number.');
  const price = pricePerBoard === null || pricePerBoard === '' ? null : finiteRange(pricePerBoard, 'Price per board', 0, 1_000_000);

  const rows = ceilWithoutFloatingPointNoise(widthM / (boardWidthM + gapM));
  const coveredWidthM = rows * boardWidthM + Math.max(0, rows - 1) * gapM;
  const boardLinearMetres = rows * lengthM;
  const orderLinearMetres = boardLinearMetres * (1 + waste / 100);
  const piecesPerRow = ceilWithoutFloatingPointNoise(lengthM / stockBoardLengthM);
  // Without a cut map, do not assume short offcuts from one row can cover another.
  const boards = ceilWithoutFloatingPointNoise(rows * piecesPerRow * (1 + waste / 100));
  const supportLines = ceilWithoutFloatingPointNoise(lengthM / joistSpacingM) + 1;
  const estimatedFasteners = rows * supportLines * fasteners;
  const jointsPerRow = Math.max(0, Math.ceil(lengthM / stockBoardLengthM) - 1);

  return Object.freeze({
    lengthM, widthM, boardWidthM, gapM, stockBoardLengthM, joistSpacingM,
    areaM2: lengthM * widthM, rows, coveredWidthM, boardLinearMetres, orderLinearMetres,
    piecesPerRow, boards, supportLines, estimatedFasteners, jointsPerRow, totalJoints: rows * jointsPerRow,
    wastePercent: waste, estimatedCost: price === null ? null : boards * price,
  });
}

export { LENGTH_TO_M as DECK_LENGTH_TO_M };
