import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatePulley } from './logic.mjs';

test('estimates open-belt length, output speed and belt speed for a reduction', () => {
  const result = calculatePulley({ driverDiameter: 100, drivenDiameter: 200, centerDistance: 500, inputRpm: 1500 });
  assert.ok(Math.abs(result.beltLengthMm - 1476) < 1e-9);
  assert.equal(result.outputRpm, 750);
  assert.ok(Math.abs(result.beltSpeedMetersPerSecond - (Math.PI * 0.1 * 1500 / 60)) < 1e-12);
  assert.ok(result.smallWrapDegrees > 150 && result.smallWrapDegrees < 180);
});

test('equal pulley diameters preserve RPM and have a half-turn wrap', () => {
  const result = calculatePulley({ driverDiameter: 80, drivenDiameter: 80, centerDistance: 400, inputRpm: 900 });
  assert.equal(result.outputRpm, 900);
  assert.equal(result.beltLengthMm, 1051.2);
  assert.equal(result.smallWrapDegrees, 180);
  assert.equal(result.isEqualPulleyDrive, true);
});

test('a larger driver correctly increases output speed', () => {
  const result = calculatePulley({ driverDiameter: 200, drivenDiameter: 100, centerDistance: 500, inputRpm: 600 });
  assert.equal(result.outputRpm, 1200);
  assert.equal(result.speedRatio, 2);
});

test('converts inch input into the same physical belt length', () => {
  const metric = calculatePulley({ driverDiameter: 100, drivenDiameter: 200, centerDistance: 500, inputRpm: 1500 });
  const imperial = calculatePulley({ driverDiameter: 100 / 25.4, drivenDiameter: 200 / 25.4, centerDistance: 500 / 25.4, inputRpm: 1500, unit: 'in' });
  assert.ok(Math.abs(metric.beltLengthMm - imperial.beltLengthMm) < 1e-9);
  assert.ok(Math.abs(imperial.beltLength - metric.beltLengthMm / 25.4) < 1e-10);
});

test('rejects invalid geometry, too-short centers and invalid values', () => {
  assert.throws(() => calculatePulley({ driverDiameter: 0, drivenDiameter: 20, centerDistance: 20, inputRpm: 100 }), RangeError);
  assert.throws(() => calculatePulley({ driverDiameter: 40, drivenDiameter: 80, centerDistance: 19, inputRpm: 100 }), /too short/u);
  assert.throws(() => calculatePulley({ driverDiameter: 80, drivenDiameter: 40, centerDistance: 50, inputRpm: 100, unit: 'cm' }), /millimeters or inches/u);
  assert.throws(() => calculatePulley({ driverDiameter: 40, drivenDiameter: 80, centerDistance: 100, inputRpm: -1 }), RangeError);
});
