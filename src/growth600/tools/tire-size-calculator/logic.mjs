const finiteRange = (value, label, min, max) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    throw new RangeError(`${label} must be between ${min} and ${max}.`);
  }
  return number;
};

export function parseMetricTireSize(value) {
  const match = String(value ?? '').trim().match(/^(\d{2,3})\s*\/\s*(\d{2})\s*R\s*(\d{2}(?:\.\d)?)$/iu);
  if (!match) throw new TypeError('Use metric tire format such as 205/55R16.');
  const widthMm = finiteRange(match[1], 'Width', 80, 500);
  const aspectRatio = finiteRange(match[2], 'Aspect ratio', 20, 100);
  const rimInches = finiteRange(match[3], 'Rim diameter', 8, 30);
  const sidewallMm = widthMm * aspectRatio / 100;
  const rimMm = rimInches * 25.4;
  const diameterMm = rimMm + 2 * sidewallMm;
  return {
    widthMm,
    aspectRatio,
    rimInches,
    sidewallMm,
    rimMm,
    diameterMm,
    circumferenceMm: Math.PI * diameterMm,
    revolutionsPerKm: 1_000_000 / (Math.PI * diameterMm),
  };
}

export function compareMetricTireSizes(originalInput, replacementInput, indicatedSpeed = 100, speedUnit = 'km/h') {
  if (!['km/h', 'mph'].includes(speedUnit)) throw new TypeError('Speed unit must be km/h or mph.');
  const original = parseMetricTireSize(originalInput);
  const replacement = parseMetricTireSize(replacementInput);
  const displayedSpeed = finiteRange(indicatedSpeed, 'Indicated speed', 1, speedUnit === 'mph' ? 200 : 300);
  const diameterDifferenceMm = replacement.diameterMm - original.diameterMm;
  const diameterChangePercent = diameterDifferenceMm / original.diameterMm * 100;
  const actualSpeed = displayedSpeed * replacement.diameterMm / original.diameterMm;
  return {
    original,
    replacement,
    diameterDifferenceMm,
    circumferenceDifferenceMm: replacement.circumferenceMm - original.circumferenceMm,
    diameterChangePercent,
    groundClearanceChangeMm: diameterDifferenceMm / 2,
    indicatedSpeed: displayedSpeed,
    estimatedActualSpeed: actualSpeed,
    speedUnit,
    identicalSize: original.widthMm === replacement.widthMm
      && original.aspectRatio === replacement.aspectRatio
      && original.rimInches === replacement.rimInches,
  };
}
