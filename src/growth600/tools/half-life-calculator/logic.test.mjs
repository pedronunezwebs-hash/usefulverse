import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHalfLife } from './logic.mjs';

const closeTo = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);

test('one half-life leaves half the initial amount', () => {
  const result = calculateHalfLife({ mode: 'remaining', initialAmount: 100, halfLife: 5730, elapsedTime: 5730 });
  closeTo(result.remainingAmount, 50);
  closeTo(result.remainingPercent, 50);
  assert.equal(result.halfLivesElapsed, 1);
});

test('solves initial quantity, elapsed time and half-life from the other three values', () => {
  closeTo(calculateHalfLife({ mode: 'initial', remainingAmount: 25, halfLife: 10, elapsedTime: 20 }).initialAmount, 100);
  closeTo(calculateHalfLife({ mode: 'elapsed', initialAmount: 100, remainingAmount: 25, halfLife: 10 }).elapsedTime, 20);
  closeTo(calculateHalfLife({ mode: 'halfLife', initialAmount: 100, remainingAmount: 25, elapsedTime: 20 }).halfLife, 10);
});

test('zero elapsed time retains the initial amount and reversed amount solves to zero elapsed', () => {
  assert.equal(calculateHalfLife({ mode: 'remaining', initialAmount: 12, halfLife: 3, elapsedTime: 0 }).remainingAmount, 12);
  assert.equal(calculateHalfLife({ mode: 'elapsed', initialAmount: 12, remainingAmount: 12, halfLife: 3 }).elapsedTime, 0);
});

test('rejects invalid modes, non-positive quantities and invalid decay assumptions', () => {
  assert.throws(() => calculateHalfLife({ mode: 'dose', initialAmount: 10, halfLife: 2, elapsedTime: 1 }));
  assert.throws(() => calculateHalfLife({ mode: 'remaining', initialAmount: 0, halfLife: 2, elapsedTime: 1 }));
  assert.throws(() => calculateHalfLife({ mode: 'remaining', initialAmount: 10, halfLife: 0, elapsedTime: 1 }));
  assert.throws(() => calculateHalfLife({ mode: 'elapsed', initialAmount: 10, remainingAmount: 11, halfLife: 2 }));
  assert.throws(() => calculateHalfLife({ mode: 'halfLife', initialAmount: 10, remainingAmount: 10, elapsedTime: 2 }));
  assert.throws(() => calculateHalfLife({ mode: 'halfLife', initialAmount: 10, remainingAmount: 5, elapsedTime: 0 }));
});

test('rejects non-finite and out-of-range values instead of returning misleading results', () => {
  assert.throws(() => calculateHalfLife({ mode: 'remaining', initialAmount: 'Infinity', halfLife: 2, elapsedTime: 1 }));
  assert.throws(() => calculateHalfLife({ mode: 'remaining', initialAmount: 10, halfLife: 1e-300, elapsedTime: 1e100 }));
  assert.throws(() => calculateHalfLife({ mode: 'initial', remainingAmount: 1e100, halfLife: 1e-300, elapsedTime: 1e100 }));
});
