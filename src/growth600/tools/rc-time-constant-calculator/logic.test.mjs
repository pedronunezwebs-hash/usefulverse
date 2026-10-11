import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRcTimeConstant, calculateRcTransient } from './logic.mjs';

test('1000 ohm and 100 microfarad produce a 0.1 second time constant', () => {
  const result = calculateRcTimeConstant({ resistance: 1000, capacitance: 100, capacitanceUnit: 'uF' });
  assert.ok(Math.abs(result.tauSeconds - 0.1) < 1e-14);
  assert.ok(Math.abs(result.rise10To90Seconds - 0.21972245773362195) < 1e-14);
});

test('charging reaches about 63.2 percent of the voltage step after one tau', () => {
  const result = calculateRcTransient({ resistance: 1000, capacitance: 100, capacitanceUnit: 'uF', initialVoltage: 0, finalVoltage: 5, time: 0.1 });
  assert.equal(result.mode, 'voltage');
  assert.ok(Math.abs(result.voltage - 3.1606027941427883) < 1e-12);
  assert.ok(Math.abs(result.ratio - Math.exp(-1)) < 1e-14);
});

test('discharging from 10 V to 1 V takes tau times ln(10)', () => {
  const result = calculateRcTransient({ resistance: 1000, capacitance: 100, capacitanceUnit: 'uF', initialVoltage: 10, finalVoltage: 0, targetVoltage: 1 });
  assert.equal(result.mode, 'time');
  assert.ok(Math.abs(result.timeSeconds - 0.1 * Math.log(10)) < 1e-14);
});

test('supports descending and offset responses and unit conversion', () => {
  const result = calculateRcTransient({ resistance: 1, resistanceUnit: 'kohm', capacitance: 100, capacitanceUnit: 'nF', initialVoltage: 8, finalVoltage: 2, time: 0.0001 });
  assert.ok(Math.abs(result.tauSeconds - 0.0001) < 1e-16);
  assert.ok(Math.abs(result.voltage - (2 + 6 * Math.exp(-1))) < 1e-12);
});

test('at time zero output equals the initial value and equal voltages are rejected', () => {
  assert.equal(calculateRcTransient({ resistance: 1, capacitance: 1, initialVoltage: 4, finalVoltage: 0, time: 0 }).voltage, 4);
  assert.throws(() => calculateRcTransient({ resistance: 1, capacitance: 1, initialVoltage: 4, finalVoltage: 4, time: 1 }), RangeError);
});

test('rejects invalid units, non-positive components, invalid target thresholds and out-of-range values', () => {
  for (const options of [
    { resistance: 0, capacitance: 1 }, { resistance: 1, resistanceUnit: 'mΩ', capacitance: 1 },
    { resistance: 1, capacitance: 1, capacitanceUnit: 'mH' }, { resistance: Infinity, capacitance: 1 },
    { resistance: 1, capacitance: 1, initialVoltage: 0, finalVoltage: 5, targetVoltage: 5 },
    { resistance: 1, capacitance: 1, initialVoltage: 0, finalVoltage: 5, targetVoltage: -1 },
    { resistance: 1, capacitance: 1, initialVoltage: 0, finalVoltage: 5, time: -1 },
  ]) assert.throws(() => options.targetVoltage !== undefined || options.time !== undefined ? calculateRcTransient(options) : calculateRcTimeConstant(options), RangeError);
});
