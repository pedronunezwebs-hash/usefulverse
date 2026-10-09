import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAntennaLength, ANTENNA_FREQUENCY_UNITS } from './logic.mjs';

test('100 MHz free-space half-wave dipole is about 1.5 m before shortening', () => {
  const result = calculateAntennaLength({ frequency: 100, frequencyUnit: 'MHz', mode: 'dipole', shorteningFactor: 1 });
  assert.ok(Math.abs(result.idealLengthM - 1.49896229) < 1e-7);
  assert.ok(Math.abs(result.elementLengthM - 0.749481145) < 1e-7);
});

test('editable shortening factor changes total wire and per-leg length', () => {
  const result = calculateAntennaLength({ frequency: 100, frequencyUnit: 'MHz', shorteningFactor: 0.95 });
  assert.ok(Math.abs(result.adjustedLengthM - result.idealLengthM * 0.95) < 1e-12);
  assert.equal(result.elementLengthM, result.adjustedLengthM / 2);
});

test('quarter-wave monopole is half the ideal half-wave dipole length', () => {
  const dipole = calculateAntennaLength({ frequency: 100, mode: 'dipole', shorteningFactor: 1 });
  const monopole = calculateAntennaLength({ frequency: 100, mode: 'monopole', shorteningFactor: 1 });
  assert.equal(monopole.idealLengthM, dipole.idealLengthM / 2);
  assert.equal(monopole.elementLengthM, monopole.adjustedLengthM);
});

test('converts frequency units and length units without changing the physical result', () => {
  const hz = calculateAntennaLength({ frequency: 100e6, frequencyUnit: 'Hz' });
  const mhz = calculateAntennaLength({ frequency: 100, frequencyUnit: 'MHz' });
  assert.equal(hz.adjustedLengthM, mhz.adjustedLengthM);
  assert.equal(mhz.adjustedLengthFeet, mhz.adjustedLengthM / 0.3048);
  assert.deepEqual(ANTENNA_FREQUENCY_UNITS, ['Hz', 'kHz', 'MHz', 'GHz']);
});

test('rejects invalid modes, units, frequency, factor and non-finite results', () => {
  assert.throws(() => calculateAntennaLength({ frequency: 100, mode: 'fullwave' }), /antenna type/u);
  assert.throws(() => calculateAntennaLength({ frequency: 100, frequencyUnit: 'rpm' }), /frequency unit/u);
  assert.throws(() => calculateAntennaLength({ frequency: 0 }), /positive frequency/u);
  assert.throws(() => calculateAntennaLength({ frequency: 100, shorteningFactor: 0.69 }), /shortening factor/u);
  assert.throws(() => calculateAntennaLength({ frequency: 1e-200 }), /supported antenna range/u);
});
