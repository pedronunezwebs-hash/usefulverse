import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatePolynomialLongDivision } from './logic.mjs';

test('x squared minus one divided by x minus one produces x plus one and zero remainder', () => {
  const result = calculatePolynomialLongDivision('x^2 - 1', 'x - 1');
  assert.equal(result.quotient, 'x + 1');
  assert.equal(result.remainder, '0');
  assert.deepEqual(result.steps.map(({ remainder }) => remainder), ['x - 1', '0']);
});

test('division preserves exact fractional quotient and remainder', () => {
  const result = calculatePolynomialLongDivision('x^2', '2x + 1');
  assert.equal(result.quotient, '1/2x - 1/4');
  assert.equal(result.remainder, '1/4');
});

test('combines like powers and canonicalizes signed, sparse terms', () => {
  const result = calculatePolynomialLongDivision('2x^2 + 3x^2 - x + 4', 'x + 1');
  assert.equal(result.quotient, '5x - 6');
  assert.equal(result.remainder, '10');
});

test('supports a lower-degree dividend and zero dividend', () => {
  assert.deepEqual(calculatePolynomialLongDivision('x + 2', 'x^2 + 1').steps, []);
  assert.equal(calculatePolynomialLongDivision('0', 'x + 1').quotient, '0');
  assert.equal(calculatePolynomialLongDivision('0', 'x + 1').remainder, '0');
});

test('rejects a zero divisor, malformed expressions and unsupported coefficient syntax', () => {
  for (const divisor of ['0', 'x - x', '']) assert.throws(() => calculatePolynomialLongDivision('x^2 + 1', divisor));
  for (const expression of ['x^2 +', 'x**2', 'x^2 + 1.5', 'x^2 + y', 'x^2x', 'x^-1']) {
    assert.throws(() => calculatePolynomialLongDivision(expression, 'x + 1'));
  }
});

test('bounds degree, term count, expression length and coefficient size', () => {
  assert.throws(() => calculatePolynomialLongDivision('x^21', 'x'), /degree/u);
  assert.throws(() => calculatePolynomialLongDivision('x+'.repeat(64) + 'x', 'x'), /terms/u);
  assert.throws(() => calculatePolynomialLongDivision(`${'x+'.repeat(128)}x`, 'x'), /256/u);
  assert.throws(() => calculatePolynomialLongDivision('1234567890123x + 1', 'x'), /integer coefficients/u);
});
