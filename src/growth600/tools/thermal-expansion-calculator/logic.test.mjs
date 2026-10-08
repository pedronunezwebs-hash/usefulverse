import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateThermalExpansion } from './logic.mjs';

test('zero temperature change preserves a linear dimension', () => {
  const result = calculateThermalExpansion({ initialDimension: 10, dimensionUnit: 'm', coefficient: 12e-6, deltaTemperature: 0 });
  assert.equal(result.change, 0);
  assert.equal(result.finalDimension, 10);
});

test('calculates linear expansion in the entered unit', () => {
  const result = calculateThermalExpansion({ initialDimension: 10, dimensionUnit: 'm', coefficient: 12e-6, deltaTemperature: 50 });
  assert.equal(result.change, 0.006);
  assert.equal(result.finalDimension, 10.006);
});

test('converts Fahrenheit temperature difference and per-F coefficients consistently', () => {
  const celsius = calculateThermalExpansion({ initialDimension: 100, dimensionUnit: 'cm', coefficient: 12e-6, deltaTemperature: 10, temperatureUnit: 'C' });
  const fahrenheit = calculateThermalExpansion({ initialDimension: 100, dimensionUnit: 'cm', coefficient: 12e-6 / 1.8, coefficientTemperatureUnit: 'F', deltaTemperature: 18, temperatureUnit: 'F' });
  assert.ok(Math.abs(celsius.change - fahrenheit.change) < 1e-12);
});

test('supports direct area and volume coefficients with their own dimensions', () => {
  const area = calculateThermalExpansion({ mode: 'area', initialDimension: 100, dimensionUnit: 'm²', coefficient: 24e-6, deltaTemperature: 50 });
  const volume = calculateThermalExpansion({ mode: 'volume', initialDimension: 1000, dimensionUnit: 'L', coefficient: 36e-6, deltaTemperature: 50 });
  assert.ok(Math.abs(area.change - 0.12) < 1e-12);
  assert.equal(volume.change, 1.8);
  assert.equal(area.baseUnit, 'm²');
  assert.equal(volume.baseUnit, 'm³');
});

test('converts entered dimensions to the matching SI base unit without changing displayed units', () => {
  const result = calculateThermalExpansion({ initialDimension: 100, dimensionUnit: 'cm', coefficient: 1e-5, deltaTemperature: 10 });
  assert.equal(result.dimensionUnit, 'cm');
  assert.equal(result.baseUnit, 'm');
  assert.equal(result.change, 0.01);
  assert.equal(result.changeBase, 0.0001);
  assert.equal(result.finalBase, 1.0001);
});

test('allows negative expansion but never negative final dimensions', () => {
  const result = calculateThermalExpansion({ initialDimension: 2, dimensionUnit: 'm', coefficient: -1e-5, deltaTemperature: 100 });
  assert.equal(result.finalDimension, 1.998);
  assert.throws(() => calculateThermalExpansion({ initialDimension: 1, dimensionUnit: 'm', coefficient: -0.01, deltaTemperature: 101 }), /negative final dimension/u);
});

test('rejects mismatched units, invalid modes, and out-of-range values', () => {
  assert.throws(() => calculateThermalExpansion({ mode: 'linear', initialDimension: 1, dimensionUnit: 'm²', coefficient: 1e-5, deltaTemperature: 10 }), /dimension unit/u);
  assert.throws(() => calculateThermalExpansion({ mode: 'unsupported', initialDimension: 1, dimensionUnit: 'm', coefficient: 1e-5, deltaTemperature: 10 }), /linear, area, or volume/u);
  assert.throws(() => calculateThermalExpansion({ initialDimension: -1, dimensionUnit: 'm', coefficient: 1e-5, deltaTemperature: 10 }), /Initial dimension/u);
});
