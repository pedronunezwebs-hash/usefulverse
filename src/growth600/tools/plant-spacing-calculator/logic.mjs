export const PLANT_LENGTH_TO_METERS = Object.freeze({ mm: 0.001, cm: 0.01, m: 1, in: 0.0254, ft: 0.3048 });
const MAX_DIMENSION = 1_000_000;
const MAX_ROWS = 100_000;
const MAX_PLANTS = 1_000_000;

function bounded(name, value, min = Number.EPSILON, max = MAX_DIMENSION) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

function countCenters(dimension, spacing, offset = 0) {
  const first = spacing / 2 + offset;
  const last = dimension - spacing / 2;
  if (first > last + 1e-12) return 0;
  return Math.floor((last - first) / spacing + 1e-12) + 1;
}

export function calculatePlantSpacing({ bedLength, bedWidth, inRowSpacing, rowSpacing, unit = 'm', pattern = 'grid' } = {}) {
  const factor = PLANT_LENGTH_TO_METERS[unit];
  if (!factor) throw new TypeError('Choose a supported length unit.');
  const lengthM = bounded('Bed length', bedLength) * factor;
  const widthM = bounded('Bed width', bedWidth) * factor;
  const plantSpacingM = bounded('In-row spacing', inRowSpacing) * factor;
  const rowSpacingM = bounded('Row spacing', rowSpacing) * factor;
  if (!['grid', 'triangular'].includes(pattern)) throw new TypeError('Choose grid or triangular layout.');
  const rows = countCenters(widthM, rowSpacingM);
  if (rows > MAX_ROWS) throw new RangeError(`The layout needs more than ${MAX_ROWS.toLocaleString('en')} rows.`);
  const plantsPerEvenRow = countCenters(lengthM, plantSpacingM);
  const plantsPerOddRow = pattern === 'triangular' ? countCenters(lengthM, plantSpacingM, plantSpacingM / 2) : plantsPerEvenRow;
  const evenRows = Math.ceil(rows / 2);
  const oddRows = Math.floor(rows / 2);
  const totalPlants = evenRows * plantsPerEvenRow + oddRows * plantsPerOddRow;
  if (totalPlants > MAX_PLANTS) throw new RangeError(`The layout exceeds ${MAX_PLANTS.toLocaleString('en')} plants; increase the spacing or use a smaller bed.`);
  const areaM2 = lengthM * widthM;
  return Object.freeze({
    pattern, unit, bedLength, bedWidth, inRowSpacing, rowSpacing,
    rowCount: rows, plantsPerEvenRow, plantsPerOddRow, totalPlants,
    areaM2, densityPerM2: areaM2 === 0 ? 0 : totalPlants / areaM2,
    areaInSelectedUnit: bedLength * bedWidth,
    densityPerSelectedArea: (totalPlants / areaM2) * factor * factor,
  });
}
