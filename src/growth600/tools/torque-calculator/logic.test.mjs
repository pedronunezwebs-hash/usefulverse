import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateTorque, convertTorqueValue } from './logic.mjs';

test('10 N at 2 m perpendicular gives 20 N·m counterclockwise', () => {
  const result = calculateTorque({ force: 10, arm: 2, angle: 90 });
  assert.equal(result.torqueNm, 20);
  assert.equal(result.direction, 'counterclockwise');
  assert.equal(result.perpendicularForceN, 10);
});

test('torque scales by the sine of the force angle', () => {
  const result = calculateTorque({ force: 10, arm: 2, angle: 30, direction: 'clockwise' });
  assert.ok(Math.abs(result.torqueNm + 10) < 1e-12);
  assert.ok(Math.abs(result.momentArmM - 1) < 1e-12);
});

test('solves force and lever arm from the inverse relationship', () => {
  assert.ok(Math.abs(calculateTorque({ mode: 'solve-force', force: '', arm: 2, angle: 30, torque: 20 }).forceN - 20) < 1e-12);
  assert.ok(Math.abs(calculateTorque({ mode: 'solve-arm', force: 10, arm: '', angle: 30, torque: 20 }).armM - 4) < 1e-12);
});

test('supports an explicit zero torque when force acts through the pivot', () => {
  const result = calculateTorque({ force: 100, arm: 0.5, angle: 0 });
  assert.equal(result.torqueNm, 0);
  assert.equal(result.momentArmM, 0);
});

test('converts force, distance and torque units without changing physical values', () => {
  assert.ok(Math.abs(convertTorqueValue(1, 'force', 'lbf', 'N') - 4.4482216152605) < 1e-12);
  assert.ok(Math.abs(convertTorqueValue(1, 'arm', 'ft', 'm') - 0.3048) < 1e-12);
  assert.ok(Math.abs(convertTorqueValue(1, 'torque', 'lb·ft', 'N·m') - 1.3558179483314) < 1e-12);
});

test('rejects degenerate inverse angles, invalid units, inconsistent blanks and unsafe values', () => {
  assert.throws(() => calculateTorque({ mode: 'solve-force', force: '', arm: 2, angle: 0, torque: 5 }), /zero perpendicular/u);
  assert.throws(() => calculateTorque({ force: 10, arm: 2, angle: 181 }), /Angle/u);
  assert.throws(() => calculateTorque({ force: 10, arm: '', angle: 90, torque: '' }), /Enter force/u);
  assert.throws(() => calculateTorque({ force: 10, arm: 2, angle: 90, forceUnit: 'J' }), /supported force/u);
  assert.throws(() => calculateTorque({ force: Infinity, arm: 2 }), /supported range/u);
});
