import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRlcCircuit } from './logic.mjs';

test('series resonance returns real resonant frequency, impedance R, zero phase and Q bandwidth relationship', () => {
  const f0 = 1 / (2 * Math.PI * Math.sqrt(0.01 * 1e-6));
  const result = calculateRlcCircuit({ mode: 'series', resistance: 10, inductance: 10, inductanceUnit: 'mH', capacitance: 1, capacitanceUnit: 'uF', frequency: f0, voltage: 5 });
  assert.ok(result.resonanceHz > 0);
  assert.ok(Math.abs(result.impedanceMagnitudeOhms - 10) < 1e-10);
  assert.equal(result.impedancePhaseDegrees, 0);
  assert.equal(result.q, 10);
  assert.ok(Math.abs(result.bandwidthHz - result.resonanceHz / result.q) < 1e-9);
  assert.equal(result.currentRmsA, 0.5);
});

test('parallel resonance has resistance magnitude, zero phase and topology-specific Q', () => {
  const f0 = 1 / (2 * Math.PI * Math.sqrt(0.01 * 1e-6));
  const result = calculateRlcCircuit({ mode: 'parallel', resistance: 1000, inductance: 10, inductanceUnit: 'mH', capacitance: 1, capacitanceUnit: 'uF', frequency: f0 });
  assert.ok(Math.abs(result.impedanceMagnitudeOhms - 1000) < 1e-8);
  assert.equal(result.impedancePhaseDegrees, 0);
  assert.equal(result.q, 10);
  assert.ok(Math.abs(result.bandwidthHz - result.resonanceHz / result.q) < 1e-9);
});

test('unit scaling and both frequency-response sweeps are finite and bounded', () => {
  const metric = calculateRlcCircuit({ resistance: 33, inductance: 0.01, inductanceUnit: 'H', capacitance: 0.000001, capacitanceUnit: 'F', frequency: 1000 });
  const scaled = calculateRlcCircuit({ resistance: 33, inductance: 10, inductanceUnit: 'mH', capacitance: 1, capacitanceUnit: 'uF', frequency: 1000 });
  assert.equal(metric.resonanceHz, scaled.resonanceHz);
  assert.equal(metric.impedanceMagnitudeOhms, scaled.impedanceMagnitudeOhms);
  assert.equal(metric.impedanceMagnitudeOhms, calculateRlcCircuit({ resistance: 33, inductance: 10, inductanceUnit: 'mH', capacitance: 1, capacitanceUnit: 'uF', frequency: 1, frequencyUnit: 'kHz' }).impedanceMagnitudeOhms);
  assert.equal(metric.sweep.length, 61);
  assert.ok(metric.sweep.every(({ frequencyHz, impedanceOhms }) => frequencyHz > 0 && impedanceOhms > 0 && Number.isFinite(impedanceOhms)));
  const parallel = calculateRlcCircuit({ mode: 'parallel', resistance: 33, inductance: 10, inductanceUnit: 'mH', capacitance: 1, capacitanceUnit: 'uF', frequency: 1000 });
  assert.equal(parallel.sweep.length, 61);
});

test('rejects invalid modes, missing/passive values, units, voltage and excessive ranges', () => {
  const base = { resistance: 10, inductance: 10, capacitance: 1, frequency: 1000 };
  for (const patch of [{ mode: 'unknown' }, { resistance: 0 }, { inductance: 0 }, { capacitance: 0 }, { frequency: 0 }, { voltage: -1 }, { voltage: Infinity }, { inductanceUnit: 'kH' }, { capacitanceUnit: 'mF' }, { resistance: 1e13 }]) {
    assert.throws(() => calculateRlcCircuit({ ...base, ...patch }));
  }
});
