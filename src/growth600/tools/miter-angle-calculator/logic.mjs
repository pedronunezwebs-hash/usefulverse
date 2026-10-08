function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

const toRadians = (degrees) => degrees * Math.PI / 180;
const toDegrees = (radians) => radians * 180 / Math.PI;

/**
 * Calculates symmetric trim-cut settings for an inside corner.
 * Compound mode assumes flat crown molding and a spring angle measured from
 * the wall/back side of the molding, as in common compound-miter saw charts.
 */
export function calculateMiterAngles({ cornerAngle, mode = 'simple', springAngle = 38 } = {}) {
  const corner = bounded('Corner angle', cornerAngle, 1, 179);
  if (!['simple', 'compound'].includes(mode)) throw new TypeError('Choose simple or compound mode.');
  const halfCorner = corner / 2;
  if (mode === 'simple') return Object.freeze({ mode, cornerAngle: corner, halfCornerAngle: halfCorner, miterSawAngle: halfCorner, bevelSawAngle: 0 });

  const spring = bounded('Spring angle', springAngle, 0, 90);
  const halfRadians = toRadians(halfCorner);
  const springRadians = toRadians(spring);
  const miterRadians = Math.atan(Math.sin(springRadians) * Math.tan(halfRadians));
  const bevelInput = Math.cos(springRadians) * Math.sin(halfRadians);
  const bevelRadians = Math.asin(Math.max(-1, Math.min(1, bevelInput)));
  return Object.freeze({
    mode,
    cornerAngle: corner,
    springAngle: spring,
    halfCornerAngle: halfCorner,
    miterSawAngle: toDegrees(miterRadians),
    bevelSawAngle: toDegrees(bevelRadians),
  });
}
