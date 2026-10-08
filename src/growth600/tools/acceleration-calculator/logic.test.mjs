import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAcceleration } from './logic.mjs';

test('acceleration from a velocity change matches the acceptance example and derives displacement', () => {
  const result = calculateAcceleration({ mode: 'acceleration', initialVelocity: 0, finalVelocity: 20, timeSeconds: 5 });
  assert.equal(result.acceleration, 4);
  assert.equal(result.displacement, 50);
  assert.equal(result.finalPosition, 50);
});

test('solves time, final velocity, and displacement from the constant-acceleration equations', () => {
  assert.equal(calculateAcceleration({ mode: 'time', initialVelocity: 0, finalVelocity: 20, acceleration: 4 }).timeSeconds, 5);
  const velocity = calculateAcceleration({ mode: 'final-velocity', initialVelocity: 0, acceleration: 4, timeSeconds: 5, initialPosition: 3 });
  assert.equal(velocity.finalVelocity, 20);
  assert.equal(velocity.finalPosition, 53);
  assert.equal(calculateAcceleration({ mode: 'displacement', initialVelocity: 0, acceleration: 4, timeSeconds: 5 }).displacement, 50);
});

test('imperial values remain in ft/s, ft/s² and ft after internal conversion', () => {
  const result = calculateAcceleration({ mode: 'acceleration', units: 'imperial', initialVelocity: 0, finalVelocity: 65.61679790026247, timeSeconds: 5 });
  assert.ok(Math.abs(result.acceleration - 13.123359580052494) < 1e-10);
  assert.ok(Math.abs(result.displacement - 164.04199475065616) < 1e-9);
});

test('rejects invalid modes, units, zero/negative duration, zero acceleration for time, and unsafe results', () => {
  assert.throws(() => calculateAcceleration({ mode: 'speed' }), /supported value/);
  assert.throws(() => calculateAcceleration({ units: 'mph' }), /metric or imperial/);
  assert.throws(() => calculateAcceleration({ mode: 'acceleration', timeSeconds: 0 }), /greater than zero/);
  assert.throws(() => calculateAcceleration({ mode: 'acceleration', timeSeconds: -2 }), /greater than zero/);
  assert.throws(() => calculateAcceleration({ mode: 'time', initialVelocity: 0, finalVelocity: 2, acceleration: 0 }), /non-zero/);
  assert.throws(() => calculateAcceleration({ mode: 'time', initialVelocity: 20, finalVelocity: 0, acceleration: 4 }), /positive time/);
  assert.throws(() => calculateAcceleration({ mode: 'final-velocity', initialVelocity: 1e9, acceleration: 1e9, timeSeconds: 1e9 }), /supported range/);
});
