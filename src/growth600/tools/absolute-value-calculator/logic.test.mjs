import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAbsoluteValue } from './logic.mjs';

test('absolute value mode handles positive, negative and negative zero', () => {
  assert.equal(calculateAbsoluteValue({ mode: 'number', value: -12.5 }).result, 12.5);
  assert.equal(calculateAbsoluteValue({ mode: 'number', value: 0 }).result, 0);
  assert.equal(calculateAbsoluteValue({ mode: 'number', value: -0 }).result, 0);
});

test('|x| = 3 returns the two ordered roots and |x| = 0 returns one root', () => {
  assert.deepEqual(calculateAbsoluteValue({ mode: 'equation', a: 1, b: 0, relation: '=', c: 3 }).solution, { kind: 'points', points: [-3, 3] });
  assert.deepEqual(calculateAbsoluteValue({ mode: 'equation', a: 2, b: -4, relation: '=', c: 0 }).solution, { kind: 'point', points: [2] });
});

test('linear absolute equations account for negative coefficients, offsets and impossible targets', () => {
  assert.deepEqual(calculateAbsoluteValue({ mode: 'equation', a: -2, b: 4, relation: '=', c: 6 }).solution, { kind: 'points', points: [-1, 5] });
  assert.deepEqual(calculateAbsoluteValue({ mode: 'equation', a: 1, b: 0, relation: '=', c: -1 }).solution, { kind: 'empty' });
});

test('strict and inclusive absolute inequalities return correct intervals and exterior rays', () => {
  assert.deepEqual(calculateAbsoluteValue({ mode: 'inequality', a: 1, b: 0, relation: '<', c: 3 }).solution, { kind: 'interval', intervals: [{ lower: -3, upper: 3, lowerInclusive: false, upperInclusive: false }] });
  assert.deepEqual(calculateAbsoluteValue({ mode: 'inequality', a: 2, b: -4, relation: '<=', c: 6 }).solution, { kind: 'interval', intervals: [{ lower: -1, upper: 5, lowerInclusive: true, upperInclusive: true }] });
  assert.deepEqual(calculateAbsoluteValue({ mode: 'inequality', a: 1, b: 0, relation: '>', c: 3 }).solution, { kind: 'intervals', intervals: [{ lower: -Infinity, upper: -3, lowerInclusive: false, upperInclusive: false }, { lower: 3, upper: Infinity, lowerInclusive: false, upperInclusive: false }] });
  assert.deepEqual(calculateAbsoluteValue({ mode: 'inequality', a: 1, b: 0, relation: '>=', c: 3 }).solution.intervals.map(({ upperInclusive }) => upperInclusive), [true, false]);
});

test('zero targets, negative targets and constant expressions handle every inequality boundary', () => {
  assert.equal(calculateAbsoluteValue({ mode: 'inequality', a: 1, b: 2, relation: '<=', c: 0 }).solution.kind, 'point');
  assert.equal(calculateAbsoluteValue({ mode: 'inequality', a: 1, b: 2, relation: '<', c: 0 }).solution.kind, 'empty');
  assert.equal(calculateAbsoluteValue({ mode: 'inequality', a: 1, b: 2, relation: '>', c: 0 }).solution.kind, 'all-except-point');
  assert.equal(calculateAbsoluteValue({ mode: 'inequality', a: 1, b: 2, relation: '>=', c: 0 }).solution.kind, 'all');
  assert.equal(calculateAbsoluteValue({ mode: 'equation', a: 0, b: -4, relation: '=', c: 4 }).solution.kind, 'all');
  assert.equal(calculateAbsoluteValue({ mode: 'inequality', a: 0, b: 2, relation: '>', c: 3 }).solution.kind, 'empty');
  assert.equal(calculateAbsoluteValue({ mode: 'inequality', a: 0, b: -4, relation: '<=', c: 4 }).solution.kind, 'all');
});

test('invalid modes, relations and non-finite or excessive inputs are rejected', () => {
  assert.throws(() => calculateAbsoluteValue({ mode: 'equation', a: 1, b: 0, relation: '<', c: 2 }), RangeError);
  assert.throws(() => calculateAbsoluteValue({ mode: 'inequality', a: 1, b: 0, relation: '≈', c: 2 }), RangeError);
  assert.throws(() => calculateAbsoluteValue({ mode: 'number', value: Infinity }), RangeError);
  assert.throws(() => calculateAbsoluteValue({ mode: 'equation', a: 1e15, b: 0, relation: '=', c: 2 }), RangeError);
  assert.throws(() => calculateAbsoluteValue({ mode: 'equation', a: 1e-296, b: 1e12, relation: '=', c: 1e12 }), /supported numeric range/u);
  assert.throws(() => calculateAbsoluteValue({ mode: 'unknown', value: 1 }), RangeError);
});
