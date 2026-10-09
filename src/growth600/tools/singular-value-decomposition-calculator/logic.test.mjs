import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSvd, parseSvdMatrix } from './logic.mjs';

function assertOrthonormalColumns(matrix) {
  const columns = matrix[0].length;
  for (let left = 0; left < columns; left += 1) for (let right = 0; right < columns; right += 1) {
    const dot = matrix.reduce((sum, row) => sum + row[left] * row[right], 0);
    assert.ok(Math.abs(dot - Number(left === right)) < 1e-10, `columns ${left}, ${right} dot to ${dot}`);
  }
}

test('reconstructs a diagonal matrix and orders singular values descending', () => {
  const result = calculateSvd('3 0\n0 2');
  assert.deepEqual(result.singularValues, [3, 2]);
  assert.equal(result.rank, 2);
  assert.ok(result.relativeReconstructionError < 1e-12);
  assert.deepEqual(result.reconstruction.map((row) => row.map((value) => Number(value.toFixed(10)))), [[3, 0], [0, 2]]);
});

test('reconstructs rectangular tall and wide matrices in compact form', () => {
  for (const input of ['1 2\n3 4\n5 6', '1 2 3\n4 5 6']) {
    const result = calculateSvd(input);
    assert.equal(result.reconstruction.length, result.rows);
    assert.equal(result.reconstruction[0].length, result.columns);
    assert.ok(result.relativeReconstructionError < 1e-12);
    assert.equal(result.singularValues.length, Math.min(result.rows, result.columns));
  }
});

test('reports numerical rank for a dependent matrix and handles the zero matrix', () => {
  const dependent = calculateSvd('1 2\n2 4\n3 6');
  assert.equal(dependent.rank, 1);
  assert.ok(dependent.relativeReconstructionError < 1e-12);
  assertOrthonormalColumns(dependent.u);
  assertOrthonormalColumns(dependent.vt[0].map((_, column) => dependent.vt.map((row) => row[column])));
  const zero = calculateSvd('0 0\n0 0');
  assert.equal(zero.rank, 0);
  assert.equal(zero.relativeReconstructionError, 0);
  assertOrthonormalColumns(zero.u);
});

test('parses comma, space and scientific notation, and rejects malformed matrices', () => {
  assert.deepEqual(parseSvdMatrix('1, 2e1\n-3.5 .25'), [[1, 20], [-3.5, 0.25]]);
  for (const invalid of ['', '1 2', '1 2\n3', '1 2\n3 nope', '1 2\n3 1e999', '1 2\n3 1000001']) assert.throws(() => calculateSvd(invalid));
});

test('normalizes Arabic and Persian digits and accepts Arabic comma separators', () => {
  assert.deepEqual(parseSvdMatrix('٣، ٠\n٠، ٢'), [[3, 0], [0, 2]]);
  assert.deepEqual(parseSvdMatrix('۳ ۰\n۰ ۲'), [[3, 0], [0, 2]]);
});

test('enforces supported dimensions and bounded finite entries', () => {
  assert.throws(() => calculateSvd([[1], [2]]));
  assert.throws(() => calculateSvd(Array.from({ length: 9 }, () => [1, 2])));
  assert.throws(() => calculateSvd([[1, Number.POSITIVE_INFINITY], [0, 1]]));
});
