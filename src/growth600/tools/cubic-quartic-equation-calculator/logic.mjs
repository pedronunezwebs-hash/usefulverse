const MAX_COEFFICIENT = 1_000_000;
const MIN_LEADING_RATIO = 1e-12;
const ZERO_TOLERANCE = 1e-10;
const MAX_ROOT_BOUND = 1_000_000_000_002;

function equationError(code) {
  const error = new RangeError(code);
  error.code = code;
  return error;
}

function evaluate(coefficients, x) {
  return coefficients.reduce((value, coefficient) => value * x + coefficient, 0);
}

function evaluationScale(coefficients, x) {
  const absoluteX = Math.abs(x);
  return coefficients.reduce((value, coefficient) => value * absoluteX + Math.abs(coefficient), 0);
}

function isNearZero(coefficients, x) {
  const value = evaluate(coefficients, x);
  const scale = evaluationScale(coefficients, x);
  return Number.isFinite(value) && Number.isFinite(scale) && Math.abs(value) <= Math.max(Number.MIN_VALUE, scale * ZERO_TOLERANCE);
}

function normalize(coefficients) {
  const maximum = Math.max(...coefficients.map(Math.abs));
  return coefficients.map((coefficient) => coefficient / maximum);
}

function derivative(coefficients) {
  const degree = coefficients.length - 1;
  return coefficients.slice(0, -1).map((coefficient, index) => coefficient * (degree - index));
}

function cauchyBound(coefficients) {
  const leading = Math.abs(coefficients[0]);
  const bound = 1 + Math.max(0, ...coefficients.slice(1).map((coefficient) => Math.abs(coefficient) / leading));
  if (!Number.isFinite(bound) || bound > MAX_ROOT_BOUND) throw equationError('rangeTooWide');
  return bound;
}

function bisectRoot(coefficients, leftEdge, rightEdge) {
  let left = leftEdge;
  let right = rightEdge;
  let leftValue = evaluate(coefficients, left);
  for (let iteration = 0; iteration < 128; iteration += 1) {
    const midpoint = left + (right - left) / 2;
    if (midpoint === left || midpoint === right) return midpoint;
    const middleValue = evaluate(coefficients, midpoint);
    if (!Number.isFinite(middleValue)) throw equationError('calculationFailed');
    if (middleValue === 0) return midpoint;
    if ((leftValue < 0) !== (middleValue < 0)) right = midpoint;
    else {
      left = midpoint;
      leftValue = middleValue;
    }
    if (right - left <= 1e-12 * Math.max(1, Math.abs(left), Math.abs(right))) break;
  }
  return left + (right - left) / 2;
}

function deduplicate(roots) {
  return roots.sort((a, b) => a - b).filter((root, index, all) => index === 0 || Math.abs(root - all[index - 1]) > 1e-8 * Math.max(1, Math.abs(root), Math.abs(all[index - 1])));
}

function findDistinctRealRoots(sourceCoefficients) {
  const coefficients = normalize(sourceCoefficients);
  const degree = coefficients.length - 1;
  if (degree === 1) return [-coefficients[1] / coefficients[0]];

  const bound = cauchyBound(coefficients);
  const criticalPoints = findDistinctRealRoots(derivative(coefficients)).filter((root) => root > -bound && root < bound);
  const points = [-bound, ...criticalPoints, bound];
  const roots = criticalPoints.filter((root) => isNearZero(coefficients, root));

  for (let index = 0; index < points.length - 1; index += 1) {
    const left = points[index];
    const right = points[index + 1];
    const leftValue = evaluate(coefficients, left);
    const rightValue = evaluate(coefficients, right);
    if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue)) throw equationError('calculationFailed');
    if (isNearZero(coefficients, left) || isNearZero(coefficients, right)) continue;
    if ((leftValue < 0) !== (rightValue < 0)) roots.push(bisectRoot(coefficients, left, right));
  }
  return deduplicate(roots);
}

function rootMultiplicity(coefficients, root) {
  let current = coefficients;
  for (let order = 0; order < coefficients.length - 1; order += 1) {
    if (!isNearZero(current, root)) return Math.max(1, order);
    current = derivative(current);
  }
  return coefficients.length - 1;
}

export function solveRealPolynomial({ degree, coefficients }) {
  const order = Number(degree);
  if (![3, 4].includes(order)) throw equationError('invalidDegree');
  if (!Array.isArray(coefficients) || coefficients.length !== order + 1) throw equationError('missingCoefficient');
  const values = coefficients.map((value) => {
    const text = String(value ?? '').trim();
    if (!text) throw equationError('missingCoefficient');
    const number = Number(text);
    if (!Number.isFinite(number) || Math.abs(number) > MAX_COEFFICIENT) throw equationError('coefficientOutOfRange');
    return number;
  });
  const maximum = Math.max(...values.map(Math.abs));
  if (maximum === 0 || Math.abs(values[0]) === 0) throw equationError('zeroLeadingCoefficient');
  if (Math.abs(values[0]) / maximum < MIN_LEADING_RATIO) throw equationError('illConditioned');

  const roots = findDistinctRealRoots(values).map((value) => Object.freeze({
    value,
    multiplicity: rootMultiplicity(values, value),
    residual: Math.abs(evaluate(values, value)),
  }));
  if (!roots.every(({ value, residual }) => Number.isFinite(value) && Number.isFinite(residual))) throw equationError('calculationFailed');
  const rootCountWithMultiplicity = roots.reduce((sum, root) => sum + root.multiplicity, 0);
  return Object.freeze({
    degree: order,
    roots: Object.freeze(roots),
    rootCountWithMultiplicity,
    hasNonRealRoots: rootCountWithMultiplicity < order,
  });
}
