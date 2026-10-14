import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateInductor } from './logic.mjs';

test('Wheeler single-layer air-core example returns about 1.36 microhenries', () => {
  const result = calculateInductor({ mode: 'airCore', turns: 10, coilDiameter: 20, coilLength: 20, dimensionUnit: 'mm' });
  assert.equal(result.method, 'wheeler-single-layer-air-core');
  assert.ok(Math.abs(result.inductanceH * 1e6 - 1.361) < 0.01);
  assert.equal(result.withinWheelerRange, true);
});

test('doubling turns quadruples inductance and target-turn estimate rounds upward', () => {
  const one = calculateInductor({ mode: 'airCore', turns: 10, coilDiameter: 20, coilLength: 20, dimensionUnit: 'mm' });
  const two = calculateInductor({ mode: 'airCore', turns: 20, coilDiameter: 20, coilLength: 20, dimensionUnit: 'mm', targetInductance: '5.4', targetUnit: 'uH' });
  assert.ok(Math.abs(two.inductanceH / one.inductanceH - 4) < 1e-12);
  assert.equal(two.targetTurns, 20);
});

test('toroid uses the manufacturer AL factor, including target-turn calculation', () => {
  const result = calculateInductor({ mode: 'toroid', turns: 10, alValue: 100, targetInductance: 10, targetUnit: 'uH' });
  assert.equal(result.inductanceH, 10e-6);
  assert.equal(result.method, 'manufacturer-core-al');
  assert.equal(result.targetTurns, 10);
});

test('accepts supported geometry units and checks out-of-range Wheeler geometry without hiding the estimate', () => {
  const metric = calculateInductor({ turns: 10, coilDiameter: 20, coilLength: 20, dimensionUnit: 'mm' });
  const imperial = calculateInductor({ turns: 10, coilDiameter: 20 / 25.4, coilLength: 20 / 25.4, dimensionUnit: 'in' });
  assert.ok(Math.abs(metric.inductanceH - imperial.inductanceH) < 1e-15);
  const stubby = calculateInductor({ turns: 10, coilDiameter: 40, coilLength: 10, dimensionUnit: 'mm' });
  assert.equal(stubby.withinWheelerRange, false);
});

test('rejects invalid mode, geometry, turns, AL values and impossible targets', () => {
  for (const input of [
    { mode: 'unknown', turns: 10 },
    { turns: 0, coilDiameter: 20, coilLength: 20 },
    { turns: 2.5, coilDiameter: 20, coilLength: 20 },
    { turns: 100001, coilDiameter: 20, coilLength: 20 },
    { turns: 10, coilDiameter: 0, coilLength: 20 },
    { mode: 'toroid', turns: 10, alValue: 0 },
    { mode: 'toroid', turns: 10, alValue: 100, targetInductance: 1e12, targetUnit: 'H' },
  ]) assert.throws(() => calculateInductor(input), RangeError);
});
