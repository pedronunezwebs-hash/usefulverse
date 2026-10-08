import assert from 'node:assert/strict';
import test from 'node:test';
import { checkDivisibility, commonDivisorList } from './logic.mjs';

test('the plan acceptance case explains 123 by remainder and exact quotient', () => {
  const result = checkDivisibility({ integer: '123', divisors: '2, 3' });
  assert.deepEqual(result.results.map(({ divisor, divisible, remainder, quotient }) => ({ divisor, divisible, remainder, quotient })), [
    { divisor: '2', divisible: false, remainder: '1', quotient: null },
    { divisor: '3', divisible: true, remainder: '0', quotient: '41' },
  ]);
  assert.equal(result.divisibleCount, 1);
});

test('common rule divisors cover composites, repeated-digit rules and large exact integers', () => {
  const result = checkDivisibility({ integer: '1001', divisors: '7 11 13 25 1000 7' });
  assert.deepEqual(result.results.map(({ divisor, divisible }) => [divisor, divisible]), [
    ['7', true], ['11', true], ['13', true], ['25', false], ['1000', false],
  ]);
  assert.equal(result.results[0].quotient, '143');
  assert.equal(result.results[1].quotient, '91');
  const huge = checkDivisibility({ integer: '123456789012345678901234567890', divisors: '3, 9, 10' });
  assert.equal(huge.results[0].divisible, true);
  assert.equal(huge.results[1].divisible, true);
  assert.equal(huge.results[2].remainder, '0');
});

test('negative numbers use a non-negative remainder and preserve the signed quotient', () => {
  const result = checkDivisibility({ integer: '-123', divisors: '2,3' });
  assert.equal(result.results[0].remainder, '1');
  assert.equal(result.results[1].quotient, '-41');
});

test('zero is divisible by every positive divisor, while one is always divisible', () => {
  const result = checkDivisibility({ integer: '0', divisors: '1, 2, 97' });
  assert.ok(result.results.every(({ divisible, quotient }) => divisible && quotient === '0'));
  assert.equal(checkDivisibility({ integer: '-123', divisors: '1' }).results[0].divisible, true);
});

test('the common divisors button provides a stable, deduplicated teaching set', () => {
  assert.equal(commonDivisorList(), '2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 25, 100, 1000');
  assert.equal(checkDivisibility({ integer: '123', divisors: commonDivisorList() }).results.length, 15);
});

test('invalid values, zero divisors, oversized inputs and too many divisors are rejected', () => {
  assert.throws(() => checkDivisibility({ integer: '1.5', divisors: '2' }), /whole integer/u);
  assert.throws(() => checkDivisibility({ integer: '1', divisors: '0' }), /greater than zero/u);
  assert.throws(() => checkDivisibility({ integer: '1', divisors: '2, -3' }), /positive whole integers/u);
  assert.throws(() => checkDivisibility({ integer: '1', divisors: Array.from({ length: 31 }, (_, index) => index + 1).join(',') }), /no more than 30/u);
  assert.throws(() => checkDivisibility({ integer: `1${'0'.repeat(150)}`, divisors: '2' }), /at most 150 digits/u);
});
