import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCentripetal } from './logic.mjs';

test('2 kg moving at 4 m/s around a 0.5 m radius has 32 m/s² and 64 N centripetal force', () => {
  const result = calculateCentripetal({ mode: 'speed', mass: 2, massUnit: 'kg', radius: 0.5, radiusUnit: 'm', speed: 4, speedUnit: 'm/s' });
  assert.equal(result.accelerationMs2, 32);
  assert.equal(result.forceN, 64);
  assert.ok(Math.abs(result.frequencyHz - 4 / Math.PI) < 1e-12);
});

test('doubling linear speed quadruples acceleration and centripetal force', () => {
  const input = { mode: 'speed', mass: 5, radius: 2, speedUnit: 'm/s', radiusUnit: 'm', massUnit: 'kg' };
  const first = calculateCentripetal({ ...input, speed: 10 });
  const second = calculateCentripetal({ ...input, speed: 20 });
  assert.equal(second.accelerationMs2 / first.accelerationMs2, 4);
  assert.equal(second.forceN / first.forceN, 4);
});

test('rotation-frequency mode derives speed, acceleration, force, period and RPM', () => {
  const result = calculateCentripetal({ mode: 'frequency', mass: 2, radius: 0.5, radiusUnit: 'm', massUnit: 'kg', frequency: 2, frequencyUnit: 'Hz' });
  assert.ok(Math.abs(result.speedMs - 2 * Math.PI) < 1e-12);
  assert.ok(Math.abs(result.accelerationMs2 - 8 * Math.PI ** 2) < 1e-10);
  assert.ok(Math.abs(result.forceN - 16 * Math.PI ** 2) < 1e-10);
  assert.equal(result.periodS, 0.5);
  assert.equal(result.rpm, 120);
});

test('customary units and RPM agree with equivalent metric inputs', () => {
  const metric = calculateCentripetal({ mode: 'speed', mass: 70, massUnit: 'kg', radius: 1, radiusUnit: 'm', speed: 10, speedUnit: 'm/s' });
  const imperial = calculateCentripetal({ mode: 'speed', mass: 70 / 0.45359237, massUnit: 'lb', radius: 1 / 0.3048, radiusUnit: 'ft', speed: 10 / 0.44704, speedUnit: 'mph' });
  const rpm = calculateCentripetal({ mode: 'frequency', mass: 70, massUnit: 'kg', radius: 1, radiusUnit: 'm', frequency: metric.rpm, frequencyUnit: 'rpm' });
  assert.ok(Math.abs(metric.forceN - imperial.forceN) < 1e-8);
  assert.ok(Math.abs(metric.forceN - rpm.forceN) < 1e-8);
});

test('rejects invalid modes, units, zero inputs and values outside safe limits', () => {
  for (const input of [
    { mode: 'unknown', mass: 1, radius: 1, speed: 1 },
    { mass: 0, radius: 1, speed: 1 },
    { mass: 1, radius: 0, speed: 1 },
    { mass: 1, radius: 1, speed: 0 },
    { mass: 1, radius: 1, speed: 1, massUnit: 'stone' },
    { mode: 'frequency', mass: 1, radius: 1, frequency: 1, frequencyUnit: 'kHz' },
    { mode: 'frequency', mass: 1, radius: 1, frequency: 0, frequencyUnit: 'Hz' },
  ]) assert.throws(() => calculateCentripetal(input), RangeError);
});
