import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCentripetalForce } from './logic.mjs';

const base = { mass: 2, massUnit: 'kg', radius: 3, lengthUnit: 'm', mode: 'speed', speed: 4, speedUnit: 'm/s' };

test('centripetal force example returns m v²/r and acceleration', () => {
  const result = calculateCentripetalForce(base);
  assert.equal(result.accelerationMetersPerSecondSquared, 16 / 3);
  assert.equal(result.forceNewtons, 32 / 3);
});

test('doubling speed quadruples force and doubling mass doubles it', () => {
  const original = calculateCentripetalForce(base).forceNewtons;
  assert.equal(calculateCentripetalForce({ ...base, speed: 8 }).forceNewtons / original, 4);
  assert.equal(calculateCentripetalForce({ ...base, mass: 4 }).forceNewtons / original, 2);
});

test('rotation frequency converts to the same tangential speed and force', () => {
  const speedMode = calculateCentripetalForce(base);
  const rotationMode = calculateCentripetalForce({ ...base, mode: 'rotation', frequency: speedMode.rotationalFrequencyHz, frequencyUnit: 'hz' });
  assert.ok(Math.abs(rotationMode.speedMetersPerSecond - speedMode.speedMetersPerSecond) < 1e-12);
  assert.ok(Math.abs(rotationMode.forceNewtons - speedMode.forceNewtons) < 1e-11);
});

test('equivalent units match and invalid, empty or over-limit inputs fail', () => {
  const metric = calculateCentripetalForce(base);
  const imperial = calculateCentripetalForce({ mass: 4.40924524, massUnit: 'lb', radius: 118.110236, lengthUnit: 'in', mode: 'speed', speed: 14.4, speedUnit: 'km/h' });
  assert.ok(Math.abs(imperial.forceNewtons - metric.forceNewtons) < 0.002);
  assert.throws(() => calculateCentripetalForce({ ...base, speed: '' }), RangeError);
  assert.throws(() => calculateCentripetalForce({ ...base, radius: 0 }), RangeError);
  assert.throws(() => calculateCentripetalForce({ ...base, mass: -1 }), RangeError);
  assert.throws(() => calculateCentripetalForce({ ...base, mode: 'rotation', frequency: 1e9, frequencyUnit: 'hz' }), RangeError);
});
