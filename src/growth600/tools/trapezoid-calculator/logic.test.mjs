import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTrapezoid } from './logic.mjs';

const closeTo = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);

test('calculates trapezoid area, both legs and perimeter from bases, height and offset', () => {
  const result = calculateTrapezoid({ baseA: 6, baseB: 4, height: 3, topOffset: 1 });
  assert.equal(result.area, 15);
  closeTo(result.leftSide, Math.sqrt(10));
  closeTo(result.rightSide, Math.sqrt(10));
  closeTo(result.perimeter, 10 + (2 * Math.sqrt(10)));
});

test('area is independent of the top-base horizontal offset', () => {
  const centered = calculateTrapezoid({ baseA: 8, baseB: 4, height: 3, topOffset: 2 });
  const shifted = calculateTrapezoid({ baseA: 8, baseB: 4, height: 3, topOffset: 1 });
  assert.equal(centered.area, 18);
  assert.equal(shifted.area, 18);
  assert.notEqual(centered.leftSide, shifted.leftSide);
});

test('accepts negative offset when the parallel bases still form a convex quadrilateral', () => {
  const result = calculateTrapezoid({ baseA: 5, baseB: 6, height: 2, topOffset: -2 });
  assert.equal(result.area, 11);
  assert.ok(result.leftSide > 2);
  assert.ok(result.rightSide > 2);
});

test('rejects zero dimensions, crossing side edges and non-finite/out-of-range values', () => {
  assert.throws(() => calculateTrapezoid({ baseA: 0, baseB: 4, height: 3, topOffset: 0 }));
  assert.throws(() => calculateTrapezoid({ baseA: 6, baseB: 4, height: 0, topOffset: 1 }));
  assert.throws(() => calculateTrapezoid({ baseA: 6, baseB: 4, height: 3, topOffset: 6 }));
  assert.throws(() => calculateTrapezoid({ baseA: 6, baseB: 4, height: 3, topOffset: -4 }));
  assert.throws(() => calculateTrapezoid({ baseA: 'Infinity', baseB: 4, height: 3, topOffset: 1 }));
  assert.throws(() => calculateTrapezoid({ baseA: 6, baseB: 4, height: 3, topOffset: 1e10 }));
});
