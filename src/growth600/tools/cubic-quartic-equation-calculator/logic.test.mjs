import assert from 'node:assert/strict';
import test from 'node:test';
import { solveRealPolynomial } from './logic.mjs';

const solve = (degree, coefficients) => solveRealPolynomial({ degree, coefficients });

test('cubic acceptance: x^3 - 1 has the real root 1', () => {
  const result = solve(3, [1, 0, 0, -1]);
  assert.equal(result.roots.length, 1);
  assert.ok(Math.abs(result.roots[0].value - 1) < 1e-10);
  assert.equal(result.roots[0].multiplicity, 1);
  assert.ok(result.roots[0].residual < 1e-10);
  assert.equal(result.hasNonRealRoots, true);
});

test('quartic finds four distinct real roots in sorted order', () => {
  const result = solve(4, [1, 0, -5, 0, 4]);
  assert.deepEqual(result.roots.map(({ value }) => Math.round(value)), [-2, -1, 1, 2]);
  assert.deepEqual(result.roots.map(({ multiplicity }) => multiplicity), [1, 1, 1, 1]);
  assert.equal(result.hasNonRealRoots, false);
});

test('repeated roots are reported with multiplicity and a small polynomial residual', () => {
  const quartic = solve(4, [1, 0, -2, 0, 1]);
  assert.deepEqual(quartic.roots.map(({ value }) => Math.round(value)), [-1, 1]);
  assert.deepEqual(quartic.roots.map(({ multiplicity }) => multiplicity), [2, 2]);
  assert.ok(quartic.roots.every(({ residual }) => residual < 1e-8));

  const cubic = solve(3, [1, -6, 12, -8]);
  assert.ok(Math.abs(cubic.roots[0].value - 2) < 1e-8);
  assert.equal(cubic.roots[0].multiplicity, 3);
});

test('polynomials without real roots return an explicit empty real-root list', () => {
  const result = solve(4, [1, 0, 0, 0, 1]);
  assert.deepEqual(result.roots, []);
  assert.equal(result.hasNonRealRoots, true);
});

test('invalid degree, missing values, zero leading terms and ill-conditioned inputs are rejected', () => {
  const cases = [
    [{ degree: 2, coefficients: [1, 2, 3] }, 'invalidDegree'],
    [{ degree: 3, coefficients: [1, 2, 3] }, 'missingCoefficient'],
    [{ degree: 3, coefficients: [0, 1, 2, 3] }, 'zeroLeadingCoefficient'],
    [{ degree: 3, coefficients: [1e-14, 1, 2, 3] }, 'illConditioned'],
    [{ degree: 4, coefficients: [1, 0, 0, 0, ''] }, 'missingCoefficient'],
    [{ degree: 4, coefficients: [1, 0, 0, 0, '1e20'] }, 'coefficientOutOfRange'],
  ];
  for (const [input, code] of cases) assert.throws(() => solveRealPolynomial(input), (error) => error.code === code);
});
