import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFriction } from './logic.mjs';

test('zero coefficients and no applied force produce zero friction', () => {
  const result = calculateFriction({ mode: 'normal', normalForce: 100, staticCoefficient: 0, kineticCoefficient: 0, appliedForce: 0 });
  assert.equal(result.frictionForceN, 0);
  assert.equal(result.maximumStaticFrictionN, 0);
  assert.equal(result.netForceN, 0);
});

test('static friction adjusts below its maximum and holds a 30-degree incline example', () => {
  const result = calculateFriction({ mode: 'incline', mass: 10, angleDegrees: 30, staticCoefficient: 0.6, kineticCoefficient: 0.4, appliedForce: 0 });
  assert.equal(result.regime, 'static');
  assert.ok(Math.abs(result.normalForceN - 84.9292) < 0.1);
  assert.ok(Math.abs(result.frictionForceN + 49.03325) < 1e-9);
  assert.equal(result.netForceN, 0);
  assert.equal(result.accelerationMps2, 0);
});

test('a steep incline exceeds the static limit and uses kinetic friction in the downhill direction', () => {
  const result = calculateFriction({ mode: 'incline', mass: 10, angleDegrees: 30, staticCoefficient: 0.4, kineticCoefficient: 0.3, appliedForce: 0 });
  assert.equal(result.regime, 'startsDownhill');
  assert.ok(Math.abs(result.frictionForceN + 25.47876) < 0.1);
  assert.ok(result.netForceN > 0);
  assert.ok(result.accelerationMps2 > 0);
});

test('kinetic friction opposes a block already moving uphill or downhill', () => {
  const base = { mode: 'normal', normalForce: 100, staticCoefficient: 0.5, kineticCoefficient: 0.25, appliedForce: 0 };
  assert.equal(calculateFriction({ ...base, motionState: 'uphill' }).frictionForceN, 25);
  assert.equal(calculateFriction({ ...base, motionState: 'downhill' }).frictionForceN, -25);
});

test('converts lbf and pounds while retaining SI calculation results', () => {
  const result = calculateFriction({ mode: 'incline', mass: 10, massUnit: 'lb', angleDegrees: 0, staticCoefficient: 0.5, kineticCoefficient: 0.3, appliedForce: 1, forceUnit: 'lbf' });
  assert.ok(Math.abs(result.normalForceN - 44.48) < 0.1);
  assert.ok(Math.abs(result.appliedForceN - 4.44822) < 1e-5);
});

test('rejects invalid modes, coefficients, units, and values outside physical input bounds', () => {
  const base = { mode: 'normal', normalForce: 100, staticCoefficient: 0.5, kineticCoefficient: 0.4, appliedForce: 0 };
  assert.throws(() => calculateFriction({ ...base, kineticCoefficient: 0.6 }), /must not exceed/u);
  assert.throws(() => calculateFriction({ ...base, mode: 'incline', mass: 10, angleDegrees: 91 }), /Incline angle/u);
  assert.throws(() => calculateFriction({ ...base, forceUnit: 'watts' }), /Choose N/u);
  assert.throws(() => calculateFriction({ ...base, staticCoefficient: -1 }), /outside/u);
});
