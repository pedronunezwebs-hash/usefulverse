const TO_METERS = Object.freeze({ m: 1, ft: 0.3048 });
const SPACING_TO_METERS = Object.freeze({ m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 });

function bounded(name, value, min, max, integer = false) {
  if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateWallFraming({ wallLength, wallHeight, wallUnit = 'ft', spacing, spacingUnit = wallUnit, openings = [], topPlateRows = 2, bottomPlateRows = 1 } = {}) {
  const wallFactor = TO_METERS[wallUnit];
  const spacingFactor = SPACING_TO_METERS[spacingUnit];
  if (!wallFactor || !spacingFactor) throw new TypeError('Choose supported wall and spacing units.');
  const wallLengthM = bounded('Wall length', wallLength, 0.1, 100_000) * wallFactor;
  const wallHeightM = bounded('Wall height', wallHeight, 0.1, 100) * wallFactor;
  const spacingM = bounded('Stud spacing', spacing, 0.01, 100_000) * spacingFactor;
  if (spacingM > 10) throw new RangeError('Stud spacing is too large.');
  const topRows = bounded('Top plate rows', topPlateRows, 1, 5, true);
  const bottomRows = bounded('Bottom plate rows', bottomPlateRows, 0, 3, true);
  if (!Array.isArray(openings) || openings.length > 3) throw new RangeError('Use up to three openings.');
  const sortedOpenings = openings.map((opening, index) => {
    if (!opening || opening.start === null || opening.start === undefined || opening.start === '' || opening.width === null || opening.width === undefined || opening.width === '') {
      if (opening && ((opening.start !== null && opening.start !== undefined && opening.start !== '') || (opening.width !== null && opening.width !== undefined && opening.width !== ''))) throw new RangeError('Enter both the start and width for each opening.');
      return null;
    }
    const startM = bounded(`Opening ${index + 1} start`, opening.start, 0, 100_000) * wallFactor;
    const widthM = bounded(`Opening ${index + 1} width`, opening.width, 0.01, 100_000) * wallFactor;
    if (startM <= 0 || startM + widthM >= wallLengthM) throw new RangeError('Each opening must leave wall at both ends.');
    return { startM, endM: startM + widthM, widthM, breaksBottomPlate: opening.breaksBottomPlate === true };
  }).filter(Boolean).sort((a, b) => a.startM - b.startM);
  for (let index = 1; index < sortedOpenings.length; index += 1) {
    if (sortedOpenings[index].startM <= sortedOpenings[index - 1].endM) throw new RangeError('Openings must not overlap or touch.');
  }

  const boundaries = [0, ...sortedOpenings.flatMap(({ startM, endM }) => [startM, endM]), wallLengthM];
  const studPositionsM = [];
  for (let index = 0; index < boundaries.length - 1; index += 2) {
    const start = boundaries[index];
    const end = boundaries[index + 1];
    const intervals = Math.ceil((end - start) / spacingM - 1e-12);
    for (let step = 0; step <= intervals; step += 1) {
      const position = start + (end - start) * step / intervals;
      if (!studPositionsM.some((existing) => Math.abs(existing - position) < 1e-9)) studPositionsM.push(position);
    }
  }
  const bottomPlateBreakM = sortedOpenings.reduce((sum, opening) => sum + (opening.breaksBottomPlate ? opening.widthM : 0), 0);
  const convertLength = (meters) => meters / wallFactor;
  const studPositions = Object.freeze(studPositionsM.map((position) => Number(convertLength(position).toFixed(9))));
  const studLinearLength = studPositions.length * convertLength(wallHeightM);
  const topPlateLength = convertLength(wallLengthM * topRows);
  const bottomPlateLength = convertLength(Math.max(0, wallLengthM - bottomPlateBreakM) * bottomRows);
  return Object.freeze({
    wallUnit, wallLength, wallHeight, spacing, spacingUnit, studCount: studPositions.length, studPositions,
    studLinearLength, topPlateRows: topRows, bottomPlateRows: bottomRows,
    topPlateLength, bottomPlateLength, totalPlateLength: topPlateLength + bottomPlateLength,
    openingCount: sortedOpenings.length, openingWidthTotal: convertLength(sortedOpenings.reduce((sum, opening) => sum + opening.widthM, 0)),
    maxActualSpacing: sortedOpenings.length ? null : convertLength(wallLengthM / Math.max(1, studPositions.length - 1)),
  });
}
