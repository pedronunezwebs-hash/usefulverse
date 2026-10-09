import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateMomentum } from './logic.mjs';

test('equal masses exchange velocities in a one-dimensional elastic collision', () => {
  const result = calculateMomentum({ mass1: 1, mass2: 1, velocity1: 2, velocity2: -1, restitution: 1 });
  assert.equal(result.finalVelocity1Mps, -1);
  assert.equal(result.finalVelocity2Mps, 2);
  assert.equal(result.momentumBeforeKgMps, 1);
  assert.equal(result.momentumAfterKgMps, 1);
  assert.equal(result.kineticEnergyBeforeJ, 2.5);
  assert.equal(result.kineticEnergyAfterJ, 2.5);
  assert.equal(result.kineticEnergyLossJ, 0);
});

test('perfectly inelastic collision shares one final velocity and reports lost kinetic energy', () => {
  const result = calculateMomentum({ mass1: 1, mass2: 3, velocity1: 4, velocity2: 0, restitution: 0 });
  assert.equal(result.finalVelocity1Mps, 1);
  assert.equal(result.finalVelocity2Mps, 1);
  assert.equal(result.momentumBeforeKgMps, 4);
  assert.equal(result.momentumAfterKgMps, 4);
  assert.equal(result.kineticEnergyBeforeJ, 8);
  assert.equal(result.kineticEnergyAfterJ, 2);
  assert.equal(result.kineticEnergyLossJ, 6);
});

test('momentum-only mode retains signed direction and accepts converted units', () => {
  const result = calculateMomentum({ mode: 'momentum', mass1: 1000, mass2: 1000, massUnit: 'g', velocity1: 36, velocity2: -36, speedUnit: 'km/h' });
  assert.ok(Math.abs(result.momentumBeforeKgMps - 0) < 1e-12);
  assert.equal(result.mass1Kg, 1);
  assert.equal(result.velocity1Mps, 10);
  assert.equal(result.velocity2Mps, -10);
});

test('rejects invalid modes, non-positive masses, unsupported units, out-of-range speeds and restitution', () => {
  const valid = { mass1: 1, mass2: 1, velocity1: 0, velocity2: 0 };
  assert.throws(() => calculateMomentum({ ...valid, mode: 'unknown' }), /mode/u);
  assert.throws(() => calculateMomentum({ ...valid, mass1: 0 }), /Mass 1/u);
  assert.throws(() => calculateMomentum({ ...valid, massUnit: 'lb' }), /mass unit/u);
  assert.throws(() => calculateMomentum({ ...valid, speedUnit: 'mph' }), /speed unit/u);
  assert.throws(() => calculateMomentum({ ...valid, velocity1: Number.NaN }), /Velocity 1/u);
  assert.throws(() => calculateMomentum({ ...valid, velocity1: 1_000_001 }), /Velocity 1/u);
  assert.throws(() => calculateMomentum({ ...valid, restitution: 1.01 }), /Coefficient/u);
});
