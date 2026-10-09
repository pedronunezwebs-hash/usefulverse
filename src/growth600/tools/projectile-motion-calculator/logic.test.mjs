import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProjectileMotion, projectilePositionAt, sampleProjectilePath } from './logic.mjs';

test('45-degree launch from ground matches ideal range and apex', () => {
  const result = calculateProjectileMotion({ speed: 20, angleDegrees: 45 });
  assert.ok(Math.abs(result.range - 40.78865) < 0.001);
  assert.ok(Math.abs(result.maxHeight - 10.19716) < 0.001);
  assert.ok(Math.abs(result.timeOfFlight - 2.884) < 0.001);
  assert.ok(Math.abs(projectilePositionAt(result, result.apexTime).y - result.maxHeight) < 1e-12);
});

test('vertical launch has zero horizontal range and a valid landing time', () => {
  const result = calculateProjectileMotion({ speed: 12, angleDegrees: 90 });
  assert.equal(result.range, 0);
  assert.equal(result.horizontalVelocityMps, 0);
  assert.ok(result.timeOfFlight > 0);
  assert.equal(projectilePositionAt(result, result.timeOfFlight).y, 0);
});

test('initial height extends flight time and range; the projectile lands at the zero reference', () => {
  const ground = calculateProjectileMotion({ speed: 20, angleDegrees: 30, initialHeight: 0 });
  const elevated = calculateProjectileMotion({ speed: 20, angleDegrees: 30, initialHeight: 5 });
  assert.ok(elevated.timeOfFlight > ground.timeOfFlight);
  assert.ok(elevated.range > ground.range);
  assert.equal(projectilePositionAt(elevated, elevated.timeOfFlight).y, 0);
});

test('speed and length units convert consistently', () => {
  const metric = calculateProjectileMotion({ speed: 36, speedUnit: 'km/h', angleDegrees: 45, initialHeight: 3, lengthUnit: 'm' });
  const imperial = calculateProjectileMotion({ speed: 22.3693629, speedUnit: 'mph', angleDegrees: 45, initialHeight: 9.8425197, lengthUnit: 'ft' });
  assert.ok(Math.abs(metric.rangeM - imperial.rangeM) < 1e-6);
  assert.ok(Math.abs(metric.maxHeightM - imperial.maxHeightM) < 1e-6);
});

test('trajectory samples are bounded, ordered and include both endpoints', () => {
  const result = calculateProjectileMotion({ speed: 10, angleDegrees: 30, initialHeight: 2 });
  const points = sampleProjectilePath(result, 5);
  assert.equal(points.length, 5);
  assert.equal(points[0].time, 0);
  assert.equal(points.at(-1).time, result.timeOfFlight);
  assert.equal(points.at(-1).y, 0);
  assert.ok(points[1].x < points[2].x && points[2].x < points[3].x);
  assert.throws(() => sampleProjectilePath(result, 1), RangeError);
});

test('invalid units and out-of-range, non-finite or negative inputs are rejected', () => {
  assert.throws(() => calculateProjectileMotion({ speed: -1 }), RangeError);
  assert.throws(() => calculateProjectileMotion({ angleDegrees: 91 }), RangeError);
  assert.throws(() => calculateProjectileMotion({ initialHeight: Number.NaN }), RangeError);
  assert.throws(() => calculateProjectileMotion({ gravity: 0 }), RangeError);
  assert.throws(() => calculateProjectileMotion({ speedUnit: 'knots' }), TypeError);
  assert.throws(() => calculateProjectileMotion({ lengthUnit: 'yards' }), TypeError);
});
