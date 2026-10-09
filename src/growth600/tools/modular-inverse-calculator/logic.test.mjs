import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateModularInverse } from './logic.mjs';

test('acceptance: inverse of 3 modulo 7 is 5', () => {
  const result = calculateModularInverse(3, 7);
  assert.equal(result.inverse, 5);
  assert.equal((3 * result.inverse) % 7, 1);
  assert.equal(result.gcd, 1);
});

test('normalizes negative and oversized residues', () => {
  assert.equal(calculateModularInverse(-3, 7).inverse, 2);
  assert.equal(calculateModularInverse(10, 7).inverse, 5);
});

test('reports when an inverse does not exist and gives the gcd', () => {
  const result = calculateModularInverse(6, 9);
  assert.equal(result.exists, false);
  assert.equal(result.gcd, 3);
  assert.equal(result.inverse, null);
});

test('Euclidean steps and Bezout identity are consistent', () => {
  const result = calculateModularInverse(17, 43);
  assert.equal(result.bezoutA * result.residue + result.bezoutModulus * result.modulus, result.gcd);
  for (const step of result.steps) assert.equal(step.dividend, step.quotient * step.divisor + step.remainder);
});

test('rejects fractional, unsafe, and invalid modulus input', () => {
  for (const [a, modulus] of [[1.5, 7], [Number.MAX_SAFE_INTEGER + 1, 7], [1, 1], [1, 0], [1, -7], [1, 1e13], [NaN, 7], ['', 7], [1, '']]) {
    assert.throws(() => calculateModularInverse(a, modulus));
  }
});

test('handles the smallest modulus and zero residue safely', () => {
  assert.equal(calculateModularInverse(1, 2).inverse, 1);
  const result = calculateModularInverse(0, 11);
  assert.equal(result.gcd, 11);
  assert.equal(result.inverse, null);
});
