import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFlowRate, convertFlowValue } from './logic.mjs';

test('calculates the plan acceptance flow rate Q = A × v', () => {
  const result = calculateFlowRate({ area: 2, velocity: 3 });
  assert.equal(result.flowM3s, 6);
  assert.equal(result.primaryValue, 6);
  assert.equal(result.primaryUnit, 'm³/s');
});

test('solves an unknown area or velocity from flow and converts units', () => {
  const area = calculateFlowRate({ mode: 'area', flowRate: 12, flowUnit: 'L/s', velocity: 3, velocityUnit: 'm/s' });
  assert.equal(area.areaM2, 0.004);
  const velocity = calculateFlowRate({ mode: 'velocity', flowRate: 6, flowUnit: 'm³/h', area: 2, areaUnit: 'm²', velocityUnit: 'cm/s' });
  assert.ok(Math.abs(velocity.velocityMps - (6 / 3600 / 2)) < 1e-15);
  assert.ok(Math.abs(velocity.primaryValue - velocity.velocityMps * 100) < 1e-12);
});

test('estimates tank fill time for metric and US customary quantities', () => {
  const acceptance = calculateFlowRate({ mode: 'fill-time', flowRate: 1, flowUnit: 'L/s', volume: 1, volumeUnit: 'm³' });
  assert.ok(Math.abs(acceptance.primaryValue - (1000 / 60)) < 1e-12);
  assert.equal(acceptance.primaryUnit, 'min');
  const metric = calculateFlowRate({ mode: 'fill-time', flowRate: 60, flowUnit: 'L/min', volume: 1, volumeUnit: 'm³' });
  assert.equal(metric.fillTimeSeconds, 1000);
  assert.ok(Math.abs(metric.primaryValue - (1000 / 60)) < 1e-12);
  assert.equal(metric.primaryUnit, 'min');
  const imperial = calculateFlowRate({ mode: 'fill-time', flowRate: 10, flowUnit: 'US gal/min', volume: 100, volumeUnit: 'US gal', timeUnit: 'min' });
  assert.equal(imperial.fillTimeSeconds, 600);
});

test('optional fill estimate and physical unit conversion work for the base flow mode', () => {
  const result = calculateFlowRate({ area: 2, areaUnit: 'm²', velocity: 3, velocityUnit: 'm/s', flowUnit: 'L/min', volume: 1, volumeUnit: 'm³' });
  assert.ok(Math.abs(result.primaryValue - 360000) < 1e-8);
  assert.equal(result.fillTimeSeconds, 1 / 6);
  assert.ok(Math.abs(convertFlowValue(1, 'flow', 'm³/h', 'L/min') - (1000 / 60)) < 1e-12);
});

test('rejects missing, impossible, unsupported and out-of-range inputs', () => {
  assert.throws(() => calculateFlowRate({ area: 2 }), /positive/u);
  assert.throws(() => calculateFlowRate({ area: 0, velocity: 3 }), /positive/u);
  assert.throws(() => calculateFlowRate({ mode: 'area', flowRate: 3, flowUnit: 'bad', velocity: 2 }), /supported flow unit/u);
  assert.throws(() => calculateFlowRate({ mode: 'fill-time', flowRate: 1, volume: -5 }), /positive/u);
  assert.throws(() => calculateFlowRate({ mode: 'bad' }), /supported calculation/u);
});
