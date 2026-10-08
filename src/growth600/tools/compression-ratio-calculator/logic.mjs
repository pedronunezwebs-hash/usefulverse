const MM_PER_INCH = 25.4;
const CC_PER_CUBIC_INCH = 16.387064;
const MAX_CYLINDERS = 16;

function finite(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be a finite number.`);
  return number;
}

function positive(value, label, max = 1e9) {
  const number = finite(value, label);
  if (number <= 0 || number > max) throw new RangeError(`${label} must be greater than zero and at most ${max}.`);
  return number;
}

function optional(value, fallback = 0) {
  return value === '' || value === null || value === undefined ? fallback : Number(value);
}

function toMillimeters(value, unit, label, { allowZero = false, allowSigned = false } = {}) {
  const number = finite(value, label);
  if (Math.abs(number) > 10_000 || (allowSigned ? false : allowZero ? number < 0 : number <= 0)) {
    throw new RangeError(`${label} is outside the supported range.`);
  }
  return unit === 'mm' ? number : number * MM_PER_INCH;
}

function toCubicCentimeters(value, volumeUnit, label, allowSigned = false) {
  const number = finite(value, label);
  if ((!allowSigned && number < 0) || Math.abs(number) > 1e9) throw new RangeError(`${label} is outside the supported range.`);
  return volumeUnit === 'in3' ? number * CC_PER_CUBIC_INCH : number;
}

export function compressionRatioFromVolumes(sweptVolumeCc, clearanceVolumeCc) {
  const swept = positive(sweptVolumeCc, 'Swept volume');
  const clearance = positive(clearanceVolumeCc, 'Clearance volume');
  const ratio = (swept + clearance) / clearance;
  if (!Number.isFinite(ratio) || ratio <= 1 || ratio > 1000) throw new RangeError('The static compression ratio must be greater than 1:1 and no more than 1000:1.');
  return ratio;
}

export function calculateEngineCompression({
  unit = 'mm', volumeUnit = 'cc', bore, stroke, chamberVolume, gasketBore = '', gasketThickness = '',
  deckClearance = '', pistonCrownVolume = '', cylinders = 1,
} = {}) {
  if (!['mm', 'in'].includes(unit)) throw new TypeError('Choose millimeters or inches.');
  if (!['cc', 'in3'].includes(volumeUnit)) throw new TypeError('Choose cubic centimeters or cubic inches.');

  const boreMm = toMillimeters(bore, unit, 'Bore');
  const strokeMm = toMillimeters(stroke, unit, 'Stroke');
  const chamberCc = toCubicCentimeters(positive(chamberVolume, 'Chamber volume'), volumeUnit, 'Chamber volume');
  const gasketBoreMm = gasketBore === '' || gasketBore === null || gasketBore === undefined
    ? boreMm
    : toMillimeters(gasketBore, unit, 'Gasket bore');
  const gasketThicknessMm = toMillimeters(optional(gasketThickness), unit, 'Gasket thickness', { allowZero: true });
  const deckClearanceMm = toMillimeters(optional(deckClearance), unit, 'Deck clearance', { allowZero: true, allowSigned: true });
  const pistonCrownCc = toCubicCentimeters(optional(pistonCrownVolume), volumeUnit, 'Piston dish/dome volume', true);
  const cylinderCount = Number(cylinders);
  if (!Number.isSafeInteger(cylinderCount) || cylinderCount < 1 || cylinderCount > MAX_CYLINDERS) {
    throw new RangeError(`Cylinder count must be a whole number from 1 to ${MAX_CYLINDERS}.`);
  }

  const boreAreaMm2 = (Math.PI * boreMm ** 2) / 4;
  const sweptVolumeCc = (boreAreaMm2 * strokeMm) / 1000;
  const gasketVolumeCc = ((Math.PI * gasketBoreMm ** 2) / 4 * gasketThicknessMm) / 1000;
  const deckVolumeCc = (boreAreaMm2 * deckClearanceMm) / 1000;
  const clearanceVolumeCc = chamberCc + gasketVolumeCc + deckVolumeCc + pistonCrownCc;
  const compressionRatio = compressionRatioFromVolumes(sweptVolumeCc, clearanceVolumeCc);
  const totalDisplacementCc = sweptVolumeCc * cylinderCount;
  if (![sweptVolumeCc, gasketVolumeCc, deckVolumeCc, clearanceVolumeCc, totalDisplacementCc].every(Number.isFinite)) {
    throw new RangeError('Calculated volumes are outside the supported range.');
  }

  return Object.freeze({
    unit,
    volumeUnit,
    boreMm,
    strokeMm,
    chamberVolumeCc: chamberCc,
    gasketBoreMm,
    gasketThicknessMm,
    deckClearanceMm,
    pistonCrownVolumeCc: pistonCrownCc,
    cylinderCount,
    sweptVolumeCc,
    gasketVolumeCc,
    deckVolumeCc,
    clearanceVolumeCc,
    compressionRatio,
    totalDisplacementCc,
    totalDisplacementLiters: totalDisplacementCc / 1000,
    boreStrokeRatio: boreMm / strokeMm,
  });
}
