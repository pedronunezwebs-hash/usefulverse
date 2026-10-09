import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRepeatingDecimal } from './logic.mjs';

test('converts pure and prefixed repeating decimals exactly', () => {
  assert.deepEqual(
    (({ numerator, denominator }) => [numerator, denominator])(parseRepeatingDecimal('0.(3)')),
    ['1', '3'],
  );
  assert.deepEqual(
    (({ numerator, denominator }) => [numerator, denominator])(parseRepeatingDecimal('0.1(6)')),
    ['1', '6'],
  );
  assert.deepEqual(
    (({ numerator, denominator }) => [numerator, denominator])(parseRepeatingDecimal('1.2(34)')),
    ['611', '495'],
  );
});

test('handles signed values, zero periods, and repeating nines without approximation', () => {
  assert.deepEqual(
    (({ numerator, denominator }) => [numerator, denominator])(parseRepeatingDecimal('-2.(3)')),
    ['-7', '3'],
  );
  assert.deepEqual(
    (({ numerator, denominator, isInteger }) => [numerator, denominator, isInteger])(parseRepeatingDecimal('0.(9)')),
    ['1', '1', true],
  );
  assert.deepEqual(
    (({ numerator, denominator }) => [numerator, denominator])(parseRepeatingDecimal('0.(0)')),
    ['0', '1'],
  );
});

test('returns exact subtraction components for the algebraic proof', () => {
  const result = parseRepeatingDecimal('0.1(6)');
  assert.deepEqual([result.upper, result.lower, result.rawNumerator, result.rawDenominator], ['16', '1', '15', '90']);
  assert.equal(result.nonrepeatingDigits, 1);
  assert.equal(result.repeatingDigits, 1);
});

test('accepts Unicode minus and trims surrounding whitespace', () => {
  assert.equal(parseRepeatingDecimal('  −0.(3)  ').numerator, '-1');
});

test('accepts Arabic-Indic and Persian digits and normalizes their exact result', () => {
  assert.deepEqual(
    (({ numerator, denominator }) => [numerator, denominator])(parseRepeatingDecimal('٠.(٣)')),
    ['1', '3'],
  );
  assert.deepEqual(
    (({ numerator, denominator }) => [numerator, denominator])(parseRepeatingDecimal('۰.۱(۶)')),
    ['1', '6'],
  );
});

test('rejects finite decimals, malformed notation, and excessive components', () => {
  for (const value of ['', '0.333', '0.()', '0.(3)extra', '0.1(2)(3)', '1,2(3)', '0.1234567890123456789(3)', '0.1(1234567890123456789)', '1234567890123.(3)']) {
    assert.throws(() => parseRepeatingDecimal(value), RangeError, value);
  }
});
