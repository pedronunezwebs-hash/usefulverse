const MAX_INPUT = 1_000_000_000_000;
const RELATIONS = new Set(['=', '<', '<=', '>', '>=']);

function finiteInput(value, name) {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) throw new RangeError(`${name} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || Math.abs(number) > MAX_INPUT) {
    throw new RangeError(`${name} must be finite and within ±${MAX_INPUT}.`);
  }
  return Object.is(number, -0) ? 0 : number;
}

function relationHolds(left, relation, right) {
  if (relation === '=') return left === right;
  if (relation === '<') return left < right;
  if (relation === '<=') return left <= right;
  if (relation === '>') return left > right;
  if (relation === '>=') return left >= right;
  throw new RangeError('Choose a supported comparison.');
}

function normalizePoint(value) { return Object.is(value, -0) ? 0 : value; }

function constantSolution(value, relation, target) {
  return Object.freeze({ kind: relationHolds(value, relation, target) ? 'all' : 'empty' });
}

function interval(lower, upper, inclusive) {
  return Object.freeze({ kind: 'interval', intervals: Object.freeze([Object.freeze({ lower, upper, lowerInclusive: inclusive, upperInclusive: inclusive })]) });
}

function outsideInterval(lower, upper, inclusive) {
  return Object.freeze({
    kind: 'intervals',
    intervals: Object.freeze([
      Object.freeze({ lower: -Infinity, upper: lower, lowerInclusive: false, upperInclusive: inclusive }),
      Object.freeze({ lower: upper, upper: Infinity, lowerInclusive: inclusive, upperInclusive: false }),
    ]),
  });
}

function solveAbsoluteRelation(a, b, relation, c) {
  if (!RELATIONS.has(relation)) throw new RangeError('Choose =, <, ≤, > or ≥.');
  if (a === 0) return constantSolution(Math.abs(b), relation, c);
  const center = -b / a;
  if (!Number.isFinite(center)) throw new RangeError('The solution is outside the supported numeric range.');

  if (relation === '=') {
    if (c < 0) return Object.freeze({ kind: 'empty' });
    const normalizedCenter = normalizePoint(center);
    if (c === 0) return Object.freeze({ kind: 'point', points: Object.freeze([normalizedCenter]) });
    const radius = c / Math.abs(a);
    const lower = center - radius;
    const upper = center + radius;
    if (!Number.isFinite(radius) || !Number.isFinite(lower) || !Number.isFinite(upper)) throw new RangeError('The solution is outside the supported numeric range.');
    return Object.freeze({ kind: 'points', points: Object.freeze([normalizePoint(lower), normalizePoint(upper)]) });
  }

  if (relation === '<') {
    if (c <= 0) return Object.freeze({ kind: 'empty' });
    const radius = c / Math.abs(a);
    if (!Number.isFinite(radius) || !Number.isFinite(center - radius) || !Number.isFinite(center + radius)) throw new RangeError('The solution is outside the supported numeric range.');
    return interval(normalizePoint(center - radius), normalizePoint(center + radius), false);
  }
  if (relation === '<=') {
    if (c < 0) return Object.freeze({ kind: 'empty' });
    if (c === 0) return Object.freeze({ kind: 'point', points: Object.freeze([normalizePoint(center)]) });
    const radius = c / Math.abs(a);
    if (!Number.isFinite(radius) || !Number.isFinite(center - radius) || !Number.isFinite(center + radius)) throw new RangeError('The solution is outside the supported numeric range.');
    return interval(normalizePoint(center - radius), normalizePoint(center + radius), true);
  }
  if (relation === '>') {
    if (c < 0) return Object.freeze({ kind: 'all' });
    if (c === 0) return Object.freeze({ kind: 'all-except-point', points: Object.freeze([normalizePoint(center)]) });
    const radius = c / Math.abs(a);
    if (!Number.isFinite(radius) || !Number.isFinite(center - radius) || !Number.isFinite(center + radius)) throw new RangeError('The solution is outside the supported numeric range.');
    return outsideInterval(normalizePoint(center - radius), normalizePoint(center + radius), false);
  }
  if (c <= 0) return Object.freeze({ kind: 'all' });
  const radius = c / Math.abs(a);
  if (!Number.isFinite(radius) || !Number.isFinite(center - radius) || !Number.isFinite(center + radius)) throw new RangeError('The solution is outside the supported numeric range.');
  return outsideInterval(normalizePoint(center - radius), normalizePoint(center + radius), true);
}

/** Solves |a·x + b| relation c, or calculates the absolute value of one number. */
export function calculateAbsoluteValue({ mode, value, a, b, relation, c }) {
  if (mode === 'number') {
    const input = finiteInput(value, 'Value');
    return Object.freeze({ mode, value: input, result: Math.abs(input) });
  }
  if (!['equation', 'inequality'].includes(mode)) throw new RangeError('Choose a calculation mode.');
  if (mode === 'equation' && relation !== '=') throw new RangeError('An equation must use the equals sign.');
  const coefficient = finiteInput(a, 'Coefficient a');
  const offset = finiteInput(b, 'Offset b');
  const target = finiteInput(c, 'Target c');
  const comparison = mode === 'equation' ? '=' : relation;
  if (!RELATIONS.has(comparison)) throw new RangeError('Choose a supported comparison.');
  return Object.freeze({ mode, a: coefficient, b: offset, relation: comparison, c: target, solution: solveAbsoluteRelation(coefficient, offset, comparison, target) });
}
