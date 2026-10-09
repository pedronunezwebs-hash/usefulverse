import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePcbTraceWidth, PCB_TRACE_WIDTH_MODEL } from './logic.mjs';

test('IPC-2221 estimate returns a positive width and both common units', () => {
  const result = calculatePcbTraceWidth({ currentA: 2, copperWeightOz: 1, temperatureRiseC: 10, conductor: 'external' });
  assert.ok(result.widthMil > 0);
  assert.ok(Math.abs(result.widthMm - result.widthMil * 0.0254) < 1e-12);
  assert.ok(result.areaMil2 > 0);
  assert.equal(result.modelK, 0.048);
  assert.equal(PCB_TRACE_WIDTH_MODEL, 'I = k × ΔT^0.44 × A^0.725');
});

test('current-capacity mode inverts the width calculation and converts mm to mil', () => {
  const width = calculatePcbTraceWidth({ currentA: 3, copperWeightOz: 2, temperatureRiseC: 20 });
  const capacity = calculatePcbTraceWidth({ mode: 'current-capacity', conductor: 'external', currentA: 999, copperWeightOz: 2, temperatureRiseC: 20, width: width.widthMm, widthUnit: 'mm' });
  assert.ok(Math.abs(capacity.currentA - 3) < 1e-10);
  assert.ok(Math.abs(capacity.widthMil - width.widthMil) < 1e-10);
});

test('internal conductor coefficient yields a wider estimate than external', () => {
  const external = calculatePcbTraceWidth({ currentA: 2, conductor: 'external' });
  const internal = calculatePcbTraceWidth({ currentA: 2, conductor: 'internal' });
  assert.equal(internal.modelK, 0.024);
  assert.ok(internal.widthMil > external.widthMil);
});

test('zero current is not treated as a dimensionable trace', () => {
  assert.throws(() => calculatePcbTraceWidth({ currentA: 0 }), RangeError);
  assert.throws(() => calculatePcbTraceWidth({ mode: 'current-capacity', width: 0 }), RangeError);
});

test('unsupported modes, conductor types, units, non-finite and excessive inputs are rejected', () => {
  assert.throws(() => calculatePcbTraceWidth({ mode: 'impedance' }), TypeError);
  assert.throws(() => calculatePcbTraceWidth({ conductor: 'flex' }), TypeError);
  assert.throws(() => calculatePcbTraceWidth({ mode: 'current-capacity', widthUnit: 'inch' }), TypeError);
  assert.throws(() => calculatePcbTraceWidth({ temperatureRiseC: Number.NaN }), RangeError);
  assert.throws(() => calculatePcbTraceWidth({ copperWeightOz: 21 }), RangeError);
});
