import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateIdealGasLaw, convertIdealGasValue, IDEAL_GAS_UNITS } from './logic.mjs';

test('solves the volume for one mole at 1 atm and 273.15 K', () => {
  const result = calculateIdealGasLaw({ pressure: 1, pressureUnit: 'atm', volume: '', volumeUnit: 'L', amount: 1, amountUnit: 'mol', temperature: 273.15, temperatureUnit: 'K' });
  assert.equal(result.variable, 'volume');
  assert.ok(Math.abs(result.value / 1e-3 - 22.413969545) < 1e-8);
});

test('solves each unknown and returns the complete SI state', () => {
  const volume = calculateIdealGasLaw({ pressure: 101325, pressureUnit: 'Pa', volume: '', volumeUnit: 'm³', amount: 1, amountUnit: 'mol', temperature: 273.15, temperatureUnit: 'K' });
  assert.equal(volume.variable, 'volume');
  assert.ok(Math.abs(volume.value - 0.022413969545) < 1e-12);
  const pressure = calculateIdealGasLaw({ pressure: '', pressureUnit: 'kPa', volume: 22.413969545, volumeUnit: 'L', amount: 1, amountUnit: 'mol', temperature: 273.15, temperatureUnit: 'K' });
  assert.ok(Math.abs(pressure.value / 101325 - 1) < 1e-8);
  const amount = calculateIdealGasLaw({ pressure: 1, pressureUnit: 'atm', volume: 22.413969545, volumeUnit: 'L', amount: '', amountUnit: 'mol', temperature: 0, temperatureUnit: '°C' });
  assert.ok(Math.abs(amount.value - 1) < 1e-8);
  const temperature = calculateIdealGasLaw({ pressure: 1, pressureUnit: 'atm', volume: 22.413969545, volumeUnit: 'L', amount: 1, amountUnit: 'mol', temperature: '', temperatureUnit: 'K' });
  assert.ok(Math.abs(temperature.value - 273.15) < 1e-7);
});

test('keeps physical values when converting display units', () => {
  assert.equal(convertIdealGasValue(1, 'pressure', 'atm', 'kPa'), 101.325);
  assert.ok(Math.abs(convertIdealGasValue(22.413969545, 'volume', 'L', 'm³') - 0.022413969545) < 1e-16);
  assert.equal(convertIdealGasValue(1000, 'amount', 'mmol', 'mol'), 1);
  assert.equal(convertIdealGasValue(0, 'temperature', '°C', 'K'), 273.15);
  assert.equal(convertIdealGasValue(273.15, 'temperature', 'K', '°C'), 0);
});

test('rejects zero kelvin, below absolute zero, non-positive inputs, and bad units', () => {
  assert.throws(() => calculateIdealGasLaw({ pressure: 1, pressureUnit: 'atm', volume: '', volumeUnit: 'L', amount: 1, amountUnit: 'mol', temperature: 0, temperatureUnit: 'K' }), /positive/u);
  assert.throws(() => calculateIdealGasLaw({ pressure: 1, pressureUnit: 'atm', volume: '', amount: 1, temperature: -273.15, temperatureUnit: '°C' }), /positive/u);
  assert.throws(() => calculateIdealGasLaw({ pressure: 0, pressureUnit: 'atm', volume: 1, volumeUnit: 'L', amount: '', amountUnit: 'mol', temperature: 273.15 }), /positive/u);
  assert.throws(() => calculateIdealGasLaw({ pressure: 1, pressureUnit: 'atm', volume: '', volumeUnit: 'cup', amount: 1, temperature: 273.15 }), /unit/u);
  assert.throws(() => convertIdealGasValue(-273.15, 'temperature', '°C', 'K'), /absolute zero/u);
  assert.deepEqual(IDEAL_GAS_UNITS.temperature, ['K', '°C']);
});

test('requires exactly one blank and checks physical result bounds', () => {
  assert.throws(() => calculateIdealGasLaw({}), /exactly one/u);
  assert.throws(() => calculateIdealGasLaw({ pressure: 1, volume: 1, amount: 1, temperature: 300 }), /exactly one/u);
  assert.throws(() => calculateIdealGasLaw({ pressure: 1e300, pressureUnit: 'atm', volume: '', amount: 1, temperature: 273.15 }), /range/u);
  assert.throws(() => calculateIdealGasLaw({ pressure: 1, pressureUnit: 'atm', volume: 1e300, volumeUnit: 'L', amount: '', temperature: 273.15 }), /range/u);
});
