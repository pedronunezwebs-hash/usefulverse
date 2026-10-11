import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSpecificHeat } from './logic.mjs';

test('Q = m·c·ΔT matches the plan acceptance case and converts energy units', () => {
  assert.equal(calculateSpecificHeat({ mass: 1, specificHeat: 1000, temperatureChange: 10 }).value, 10000);
  assert.equal(calculateSpecificHeat({ mass: 1, specificHeat: 1, specificHeatUnit: 'kJ/kg°C', temperatureChange: 10, energyUnit: 'kJ' }).value, 10000);
  assert.equal(calculateSpecificHeat({ mass: 1, specificHeat: 1, specificHeatUnit: 'cal/g°C', temperatureChange: 1, energyUnit: 'cal' }).value, 4184);
});

test('solves for mass, specific heat, and signed temperature change', () => {
  assert.equal(calculateSpecificHeat({ solveFor: 'mass', heatEnergy: 10000, specificHeat: 1000, temperatureChange: 10 }).value, 1);
  assert.equal(calculateSpecificHeat({ solveFor: 'specificHeat', heatEnergy: 10000, mass: 1, temperatureChange: 10 }).value, 1000);
  assert.equal(calculateSpecificHeat({ solveFor: 'temperatureChange', heatEnergy: -10000, mass: 1, specificHeat: 1000 }).value, -10);
});

test('mass, BTU specific heat, and Fahrenheit temperature differences convert consistently', () => {
  const result = calculateSpecificHeat({ mass: 1, massUnit: 'kg', specificHeat: 1, specificHeatUnit: 'BTU/lb°F', temperatureChange: 18, temperatureUnit: '°F' });
  assert.ok(Math.abs(result.value - 41868) < 0.1);
});

test('ideal two-material mixing weights each body by heat capacity', () => {
  const result = calculateSpecificHeat({ mode: 'mixing', mass1: 1, specificHeat1: 1000, temperature1: 80, mass2: 1, specificHeat2: 1000, temperature2: 20 });
  assert.equal(result.finalTemperatureC, 50);
});

test('manual heat loss and external heat input shift the mixed equilibrium predictably', () => {
  const shared = { mode: 'mixing', mass1: 1, specificHeat1: 1000, temperature1: 80, mass2: 1, specificHeat2: 1000, temperature2: 20 };
  assert.equal(calculateSpecificHeat({ ...shared, heatLoss: 10000 }).finalTemperatureC, 45);
  assert.equal(calculateSpecificHeat({ ...shared, heatLoss: -10000 }).finalTemperatureC, 55);
});

test('mixing converts absolute Fahrenheit temperatures and rejects below absolute zero', () => {
  const result = calculateSpecificHeat({ mode: 'mixing', massUnit: 'lb', specificHeatUnit: 'BTU/lb°F', temperatureUnit: '°F', mass1: 1, specificHeat1: 1, temperature1: 212, mass2: 1, specificHeat2: 1, temperature2: 32, energyUnit: 'BTU' });
  assert.ok(Math.abs(result.finalTemperatureC - 50) < 1e-10);
  assert.throws(() => calculateSpecificHeat({ mode: 'mixing', mass1: 1, specificHeat1: 1, temperature1: 0, mass2: 1, specificHeat2: 1, temperature2: 0, heatLoss: 1000000 }), /supported range/u);
});

test('invalid modes, units, zero denominators, and numerical extremes are rejected', () => {
  assert.throws(() => calculateSpecificHeat({ solveFor: 'temperatureChange', heatEnergy: 1, mass: 1, specificHeat: 0 }), /Invalid specific heat/u);
  assert.throws(() => calculateSpecificHeat({ solveFor: 'mass', heatEnergy: 1, specificHeat: 1, temperatureChange: 0 }), /non-zero/u);
  assert.throws(() => calculateSpecificHeat({ mass: 1, specificHeat: 1, temperatureChange: 1, massUnit: 'stone' }), /Unsupported/u);
  assert.throws(() => calculateSpecificHeat({ mass: 1e20, specificHeat: 1, temperatureChange: 1 }), /Invalid mass/u);
  assert.throws(() => calculateSpecificHeat({ mass: '', specificHeat: 1, temperatureChange: 1 }), /Invalid mass/u);
  assert.throws(() => calculateSpecificHeat({ mode: 'unsupported' }), /supported calculation mode/u);
});
