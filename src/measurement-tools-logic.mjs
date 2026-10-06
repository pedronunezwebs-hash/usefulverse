export function rulerDistance(start, end) {
  if (![start, end].every((value) => Number.isInteger(value) && value >= 0 && value <= 500)) throw new RangeError('Ruler positions must be whole CSS pixels from 0 to 500.');
  return Math.abs(end - start);
}

export function calibrateRuler(distancePx, referencePixels, referenceMillimeters) {
  if (!Number.isFinite(distancePx) || distancePx < 0 || distancePx > 500) throw new RangeError('Measurement must be from 0 to 500 pixels.');
  if (!Number.isFinite(referencePixels) || referencePixels <= 0 || referencePixels > 10000) throw new RangeError('Calibration pixels must be greater than 0 and at most 10000.');
  if (!Number.isFinite(referenceMillimeters) || referenceMillimeters <= 0 || referenceMillimeters > 10000) throw new RangeError('Calibration length must be greater than 0 and at most 10000 mm.');
  const millimeters = distancePx * referenceMillimeters / referencePixels;
  return { millimeters, inches: millimeters / 25.4 };
}

export function angleBetweenRays(first, second) {
  if (![first, second].every((value) => Number.isInteger(value) && value >= 0 && value <= 180)) throw new RangeError('Ray angles must be whole degrees from 0 to 180.');
  return Math.abs(second - first);
}

export function protractorPoint(angle, radius = 140) {
  if (!Number.isInteger(angle) || angle < 0 || angle > 180 || !Number.isFinite(radius) || radius <= 0) throw new RangeError('Use an angle from 0 to 180 degrees and a positive radius.');
  const radians = angle * Math.PI / 180;
  return { x: 160 + radius * Math.cos(radians), y: 160 - radius * Math.sin(radians) };
}
