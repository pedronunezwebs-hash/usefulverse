import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateVectorOperation } from './logic.mjs';

const calculate = (dimension, operation, a, b = [0, 0, 0]) => calculateVectorOperation({ dimension, operation, vectorA: a, vectorB: b });

test('vector acceptance: perpendicular x and y axes have zero dot product and a z cross product', () => {
  assert.equal(calculate(3, 'dot', [1, 0, 0], [0, 1, 0]).result[0], 0);
  assert.deepEqual(calculate(3, 'cross', [1, 0, 0], [0, 1, 0]).result, [0, 0, 1]);
});

test('2D vector arithmetic and cross product report the signed z component', () => {
  assert.deepEqual(calculate(2, 'add', [2, 3], [4, -1]).result, [6, 2]);
  assert.deepEqual(calculate(2, 'subtract', [2, 3], [4, -1]).result, [-2, 4]);
  assert.equal(calculate(2, 'cross', [1, 0], [0, 1]).kind, 'z-component');
  assert.equal(calculate(2, 'cross', [1, 0], [0, 1]).result[0], 1);
});

test('magnitudes, normalized vectors, angle and projection are mathematically consistent', () => {
  assert.equal(calculate(3, 'magnitudeA', [3, 4, 0]).result[0], 5);
  assert.deepEqual(calculate(2, 'normalizeA', [3, 4]).result, [0.6, 0.8]);
  assert.equal(calculate(2, 'angle', [1, 0], [0, 1]).result[0], 90);
  assert.deepEqual(calculate(2, 'projection', [3, 4], [1, 0]).result, [3, 0]);
});

test('zero vectors, invalid dimensions and out-of-range components are rejected where undefined', () => {
  for (const [run, code] of [
    [() => calculate(2, 'normalizeA', [0, 0]), 'zeroNormalize'],
    [() => calculate(2, 'angle', [0, 0], [1, 0]), 'zeroAngle'],
    [() => calculate(3, 'projection', [1, 2, 3], [0, 0, 0]), 'zeroProjection'],
    [() => calculate(4, 'dot', [1, 2, 3, 4], [1, 2, 3, 4]), 'invalidDimension'],
    [() => calculate(2, 'dot', ['1e20', 0], [1, 0]), 'componentOutOfRange'],
    [() => calculate(3, 'dot', [1, 2], [3, 4, 5]), 'missingComponent'],
    [() => calculate(2, 'unknown', [1, 2]), 'invalidOperation'],
  ]) {
    assert.throws(run, (error) => error.code === code);
  }
});
