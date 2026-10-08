export const POLYGON_LIMITS = Object.freeze({ sides: 1000, dimension: 1e9 });

function positive(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > POLYGON_LIMITS.dimension) {
    throw new RangeError(`${name} must be greater than zero and within the supported range.`);
  }
  return number;
}

export function calculateRegularPolygon({ sides, mode = 'side', dimension }) {
  const n = Number(sides);
  if (!Number.isInteger(n) || n < 4 || n > POLYGON_LIMITS.sides) {
    throw new RangeError(`Sides must be a whole number from 4 to ${POLYGON_LIMITS.sides}.`);
  }
  const x = positive(dimension, 'Dimension');
  const halfCentralAngle = Math.PI / n;
  let side;
  let apothem;
  let circumradius;
  if (mode === 'side') {
    side = x;
    circumradius = side / (2 * Math.sin(halfCentralAngle));
    apothem = side / (2 * Math.tan(halfCentralAngle));
  } else if (mode === 'apothem') {
    apothem = x;
    side = 2 * apothem * Math.tan(halfCentralAngle);
    circumradius = apothem / Math.cos(halfCentralAngle);
  } else if (mode === 'circumradius') {
    circumradius = x;
    side = 2 * circumradius * Math.sin(halfCentralAngle);
    apothem = circumradius * Math.cos(halfCentralAngle);
  } else {
    throw new RangeError('Choose side length, apothem or circumradius.');
  }
  const perimeter = side * n;
  const area = perimeter * apothem / 2;
  const result = { sides: n, side, apothem, circumradius, perimeter, area, interiorAngleDegrees: (n - 2) * 180 / n, centralAngleDegrees: 360 / n };
  if (Object.values(result).some((value) => !Number.isFinite(value))) throw new RangeError('The result is outside the supported numeric range.');
  return result;
}
