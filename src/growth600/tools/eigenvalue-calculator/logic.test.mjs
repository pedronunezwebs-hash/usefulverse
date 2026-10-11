import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateEigenpairs, parseSymmetricMatrix } from './logic.mjs';

test('diagonal matrix returns sorted eigenvalues and unit eigenvectors', () => {
  const result = calculateEigenpairs('2, 0\n0, 3');
  assert.deepEqual(result.eigenpairs.map((pair) => pair.eigenvalue), [2, 3]);
  assert.deepEqual(result.eigenpairs[0].eigenvector, [1, 0]);
  assert.deepEqual(result.eigenpairs[1].eigenvector, [0, 1]);
  assert.ok(result.eigenpairs.every(({ residual }) => residual < 1e-10));
});

test('computes eigenpairs for a symmetric matrix with off-diagonal values', () => {
  const matrix = [[2, 1], [1, 2]];
  const result = calculateEigenpairs(matrix);
  assert.ok(Math.abs(result.eigenpairs[0].eigenvalue - 1) < 1e-10);
  assert.ok(Math.abs(result.eigenpairs[1].eigenvalue - 3) < 1e-10);
  for (const { eigenvalue, eigenvector, residual } of result.eigenpairs) {
    assert.ok(Math.abs(Math.hypot(...eigenvector) - 1) < 1e-10);
    assert.ok(residual < 1e-10);
    assert.ok(Math.abs(matrix[0][0] * eigenvector[0] + matrix[0][1] * eigenvector[1] - eigenvalue * eigenvector[0]) < 1e-10);
  }
});

test('converges on a coupled 3x3 matrix and reports small residuals', () => {
  const result = calculateEigenpairs('2 1 0\n1 2 1\n0 1 2');
  const expected = [2 - Math.SQRT2, 2, 2 + Math.SQRT2];
  assert.equal(result.dimension, 3);
  result.eigenpairs.forEach((pair, index) => {
    assert.ok(Math.abs(pair.eigenvalue - expected[index]) < 1e-10);
    assert.ok(Math.abs(Math.hypot(...pair.eigenvector) - 1) < 1e-10);
    assert.ok(pair.residual < 1e-10);
  });
});

test('handles repeated eigenvalues and scale without unstable overflow', () => {
  assert.deepEqual(calculateEigenpairs('4 0\n0 4').eigenpairs.map((pair) => pair.eigenvalue), [4, 4]);
  const result = calculateEigenpairs('1000000 0\n0 -1000000');
  assert.deepEqual(result.eigenpairs.map((pair) => pair.eigenvalue), [-1_000_000, 1_000_000]);
});

test('parses commas, semicolons and whitespace as separators', () => {
  assert.deepEqual(parseSymmetricMatrix('1; 0\n0 2'), [[1, 0], [0, 2]]);
});

test('rejects empty, non-square, non-symmetric, non-finite, out-of-range and oversized input', () => {
  for (const [input, code] of [['', 'emptyMatrix'], ['1 2\n3', 'notSquare'], ['1 2\n0 1', 'notSymmetric'], ['1 NaN\nNaN 1', 'invalidEntry'], ['1000001 0\n0 1', 'invalidEntry'], ['1 0 0 0 0 0 0 0 0\n0 1 0 0 0 0 0 0 0\n0 0 1 0 0 0 0 0 0\n0 0 0 1 0 0 0 0 0\n0 0 0 0 1 0 0 0 0\n0 0 0 0 0 1 0 0 0\n0 0 0 0 0 0 1 0 0\n0 0 0 0 0 0 0 1 0\n0 0 0 0 0 0 0 0 1', 'invalidSize']]) {
    assert.throws(() => calculateEigenpairs(input), (error) => error.code === code);
  }
});
