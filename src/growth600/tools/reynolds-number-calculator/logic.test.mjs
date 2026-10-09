import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateReynoldsNumber } from './logic.mjs';

const waterPipe = { velocity: 1, characteristicLength: 0.05, density: 998.2, dynamicViscosity: 0.001002 };

test('calculates Reynolds number using dynamic viscosity and gives a pipe-flow estimate', () => {
  const result = calculateReynoldsNumber(waterPipe);
  assert.ok(Math.abs(result.reynoldsNumber - 49810.37924) < 0.001);
  assert.equal(result.regime, 'turbulent');
  assert.ok(Math.abs(result.kinematicViscosityM2s - 0.001002 / 998.2) < 1e-15);
});

test('calculates equivalent input through kinematic viscosity, including common units', () => {
  const result = calculateReynoldsNumber({ velocity: 100, velocityUnit: 'cm/s', characteristicLength: 50, lengthUnit: 'mm', viscosityType: 'kinematic', kinematicViscosity: 1, kinematicViscosityUnit: 'cSt' });
  assert.ok(Math.abs(result.reynoldsNumber - 50000) < 1e-8);
  assert.equal(result.regime, 'turbulent');
  assert.equal(result.dynamicViscosityPas, null);
});

test('zero velocity is valid and produces Re = 0 as specified by the plan', () => {
  const result = calculateReynoldsNumber({ ...waterPipe, velocity: 0 });
  assert.equal(result.reynoldsNumber, 0);
  assert.equal(result.regime, 'laminar');
});

test('pipe thresholds use conventional approximate laminar, transition and turbulent bands', () => {
  const at = (reynoldsNumber) => calculateReynoldsNumber({ velocity: 1, characteristicLength: 1, viscosityType: 'kinematic', kinematicViscosity: 1 / reynoldsNumber }).regime;
  assert.equal(at(2299), 'laminar');
  assert.equal(at(2300), 'transitional');
  assert.equal(at(4000), 'transitional');
  assert.equal(at(4001), 'turbulent');
});

test('uses pipe-regime conventions only for pipe flow and bounds invalid inputs', () => {
  const result = calculateReynoldsNumber({ ...waterPipe, geometry: 'external' });
  assert.equal(result.regime, 'context-dependent');
  for (const patch of [{ velocity: -1 }, { characteristicLength: 0 }, { dynamicViscosity: 0 }, { density: '' }, { geometry: 'anything' }, { dynamicViscosityUnit: 'unknown' }]) {
    assert.throws(() => calculateReynoldsNumber({ ...waterPipe, ...patch }));
  }
});
