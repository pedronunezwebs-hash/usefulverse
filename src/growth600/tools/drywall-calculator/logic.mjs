const LENGTH_TO_M = Object.freeze({ m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 });

function finiteRange(value, label, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} must be between ${min} and ${max}.`);
  return number;
}

function seamsForRectangle(width, height, boardWidth, boardHeight) {
  const layouts = [
    { columns: Math.ceil(width / boardWidth), rows: Math.ceil(height / boardHeight), boardArea: boardWidth * boardHeight },
    { columns: Math.ceil(width / boardHeight), rows: Math.ceil(height / boardWidth), boardArea: boardWidth * boardHeight },
  ].map((layout) => ({
    ...layout,
    boards: layout.columns * layout.rows,
    seamLength: (layout.columns - 1) * height + (layout.rows - 1) * width,
  }));
  layouts.sort((a, b) => a.boards - b.boards || a.seamLength - b.seamLength);
  return layouts[0];
}

export function calculateDrywall({
  roomLength, roomWidth, wallHeight, openingArea = 0, roomCount = 1, includeCeiling = true,
  boardWidth = 1.2, boardHeight = 2.4, wastePercent = 10, screwsPerBoard = 32, pricePerBoard = null, unit = 'm',
}) {
  const factor = LENGTH_TO_M[unit];
  if (!factor) throw new TypeError('Choose a supported unit.');
  const lengthM = finiteRange(roomLength, 'Room length', 0.1, 10_000) * factor;
  const widthM = finiteRange(roomWidth, 'Room width', 0.1, 10_000) * factor;
  const heightM = finiteRange(wallHeight, 'Wall height', 0.1, 10_000) * factor;
  const boardWidthM = finiteRange(boardWidth, 'Board width', 0.1, 100) * factor;
  const boardHeightM = finiteRange(boardHeight, 'Board height', 0.1, 100) * factor;
  const count = finiteRange(roomCount, 'Room count', 1, 100);
  if (!Number.isInteger(count)) throw new RangeError('Room count must be a whole number.');
  const waste = finiteRange(wastePercent, 'Waste', 0, 30);
  const screws = finiteRange(screwsPerBoard, 'Screws per board', 1, 200);
  if (!Number.isInteger(screws)) throw new RangeError('Screws per board must be a whole number.');

  const grossWallAreaPerRoomM2 = 2 * (lengthM + widthM) * heightM;
  const openingsM2 = finiteRange(openingArea, 'Opening area per room', 0, grossWallAreaPerRoomM2 / (factor ** 2)) * (factor ** 2);
  const ceilingAreaPerRoomM2 = includeCeiling === true || includeCeiling === 'true' ? lengthM * widthM : 0;
  const wallAreaM2 = (grossWallAreaPerRoomM2 - openingsM2) * count;
  const ceilingAreaM2 = ceilingAreaPerRoomM2 * count;
  const totalAreaM2 = wallAreaM2 + ceilingAreaM2;
  const boardAreaM2 = boardWidthM * boardHeightM;
  const boardsBeforeWaste = Math.ceil(totalAreaM2 / boardAreaM2);
  const boards = Math.ceil(totalAreaM2 * (1 + waste / 100) / boardAreaM2);

  const wallSeamsPerRoomM = 2 * seamsForRectangle(lengthM, heightM, boardWidthM, boardHeightM).seamLength
    + 2 * seamsForRectangle(widthM, heightM, boardWidthM, boardHeightM).seamLength;
  const ceilingSeamsPerRoomM = ceilingAreaPerRoomM2
    ? seamsForRectangle(lengthM, widthM, boardWidthM, boardHeightM).seamLength
    : 0;
  const price = pricePerBoard === null || pricePerBoard === '' ? null : finiteRange(pricePerBoard, 'Price per board', 0, 1_000_000);

  return Object.freeze({
    grossWallAreaPerRoomM2, openingsM2, wallAreaM2, ceilingAreaM2, totalAreaM2, boardAreaM2,
    boardsBeforeWaste, boards, boardCoverageM2: boards * boardAreaM2, wastePercent: waste,
    estimatedScrews: boards * screws, approximateJointSeamLengthM: wallSeamsPerRoomM * count + ceilingSeamsPerRoomM * count,
    estimatedCost: price === null ? null : boards * price,
  });
}

export { LENGTH_TO_M as DRYWALL_LENGTH_TO_M };
