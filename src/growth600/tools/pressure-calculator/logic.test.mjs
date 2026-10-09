import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatePressure } from './logic.mjs';
test('force divided by area returns pressure in SI and chosen units', () => {
  assert.equal(calculatePressure({ force: 100, area: 2 }).pressurePa, 50);
  assert.equal(calculatePressure({ force: 1, forceUnit: 'kN', area: 10000, areaUnit: 'cm2', pressureUnit: 'kPa' }).pressure, 1);
  assert.ok(Math.abs(calculatePressure({ force: 1, forceUnit: 'lbf', area: 1, areaUnit: 'in2', pressureUnit: 'psi' }).pressure - 1) < 1e-10);
});
test('hydrostatic pressure is gauge pressure from density, gravity and depth', () => {
  assert.equal(calculatePressure({ mode: 'hydrostatic', density: 1000, depth: 1 }).pressurePa, 9806.65);
  assert.ok(Math.abs(calculatePressure({ mode: 'hydrostatic', density: 62.42796, densityUnit: 'lbft3', depth: 3.28084, depthUnit: 'ft', pressureUnit: 'psi' }).pressure - 1.4223) < 0.002);
  assert.equal(calculatePressure({ mode: 'hydrostatic', depth: 0 }).pressurePa, 0);
});
test('rejects invalid modes, units, nonfinite input and zero area or density', () => {
  for (const input of [{ mode: 'absolute' }, { forceUnit: 'kg' }, { areaUnit: 'acre' }, { area: 0 }, { force: NaN }, { mode: 'hydrostatic', density: 0 }, { mode: 'hydrostatic', depth: -1 }, { mode: 'hydrostatic', gravity: 0 }, { mode: 'hydrostatic', densityUnit: 'g/L' }, { mode: 'hydrostatic', depthUnit: 'yard' }, { pressureUnit: 'mmHg' }]) assert.throws(() => calculatePressure(input));
});
test('area and pressure conversions preserve equivalent physical results', () => {
  const metric = calculatePressure({ force: 100, area: 2, pressureUnit: 'Pa' });
  const imperial = calculatePressure({ force: 22.4809, forceUnit: 'lbf', area: 3100.0062, areaUnit: 'in2', pressureUnit: 'psi' });
  assert.ok(Math.abs(metric.pressurePa - imperial.pressurePa) < 0.02);
});
