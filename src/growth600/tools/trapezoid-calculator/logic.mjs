const MAX_DIMENSION = 1e9;

function dimension(value, label, { min = 0 } = {}) {
  const raw = String(value ?? '').trim();
  const number = Number(raw);
  if (!raw || !Number.isFinite(number) || number < min || number > MAX_DIMENSION) {
    throw new RangeError(`${label} must be between ${min} and ${MAX_DIMENSION}.`);
  }
  return number;
}

export function calculateTrapezoid({ baseA, baseB, height, topOffset }) {
  const lowerBase = dimension(baseA, 'Base A', { min: Number.MIN_VALUE });
  const upperBase = dimension(baseB, 'Base B', { min: Number.MIN_VALUE });
  const perpendicularHeight = dimension(height, 'Height', { min: Number.MIN_VALUE });
  const offset = dimension(topOffset, 'Top-base offset', { min: -MAX_DIMENSION });
  if (offset <= -upperBase || offset >= lowerBase) {
    throw new RangeError('The parallel bases and side edges must form a convex trapezoid.');
  }

  const leftSide = Math.hypot(perpendicularHeight, offset);
  const rightRun = lowerBase - offset - upperBase;
  const rightSide = Math.hypot(perpendicularHeight, rightRun);
  const area = ((lowerBase + upperBase) / 2) * perpendicularHeight;
  const perimeter = lowerBase + upperBase + leftSide + rightSide;
  if (![leftSide, rightSide, area, perimeter].every(Number.isFinite)) {
    throw new RangeError('The result is outside the supported numeric range.');
  }
  return Object.freeze({ baseA: lowerBase, baseB: upperBase, height: perpendicularHeight, topOffset: offset, leftSide, rightSide, area, perimeter });
}
