import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWaveRelation, WAVE_UNITS } from './logic.mjs';

test('solves the plan acceptance case: 100 MHz in vacuum travels 3 m', () => {
  assert.deepEqual(calculateWaveRelation({ frequency: 100, frequencyUnit: 'MHz', wavelength: '', wavelengthUnit: 'm', speed: 300000000, speedUnit: 'm/s' }), {
    variable: 'wavelength', value: 3, frequencyHz: 100000000, wavelengthM: 3, speedMps: 300000000,
  });
});

test('solves frequency and speed in alternate units', () => {
  const result = calculateWaveRelation({ frequency: '', frequencyUnit: 'GHz', wavelength: 30, wavelengthUnit: 'cm', speed: 0.3, speedUnit: 'km/s' });
  assert.equal(result.variable, 'frequency');
  assert.equal(result.value, 1000);
  assert.equal(result.wavelengthM, 0.3);
  assert.equal(result.speedMps, 300);
});

test('solves speed and retains the wavelength-frequency relation', () => {
  const result = calculateWaveRelation({ frequency: 2, frequencyUnit: 'kHz', wavelength: 75, wavelengthUnit: 'cm', speed: '', speedUnit: 'm/s' });
  assert.equal(result.variable, 'speed');
  assert.equal(result.value, 1500);
  assert.equal(result.frequencyHz * result.wavelengthM, result.speedMps);
});

test('rejects no missing value, multiple missing values, unsupported units and nonpositive inputs', () => {
  assert.throws(() => calculateWaveRelation({ frequency: 1, wavelength: 1, speed: 1 }), /exactly one/);
  assert.throws(() => calculateWaveRelation({ frequency: 1, wavelength: '', speed: '' }), /exactly one/);
  assert.throws(() => calculateWaveRelation({ frequency: 1, frequencyUnit: 'rpm', wavelength: '', speed: 1 }), /unit/);
  assert.throws(() => calculateWaveRelation({ frequency: 0, wavelength: 1, speed: '' }), /range/);
});

test('rejects values outside physical numeric bounds and non-finite results', () => {
  assert.throws(() => calculateWaveRelation({ frequency: 1e30, wavelength: 1, speed: '' }), /range/);
  assert.throws(() => calculateWaveRelation({ frequency: 1e24, wavelength: 1e18, speed: '' }), /range/);
  assert.deepEqual(WAVE_UNITS.frequency, ['Hz', 'kHz', 'MHz', 'GHz', 'THz']);
});
