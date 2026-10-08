import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCapacitorNetwork, parseCapacitanceLines } from './logic.mjs';

test('parallel capacitors add capacitance and distribute the same voltage', () => {
  const result = calculateCapacitorNetwork({ values: [100, 100], unit: 'uF', connection: 'parallel', voltage: 5 });
  assert.ok(Math.abs(result.equivalentFarads - 200e-6) < 1e-18);
  assert.ok(Math.abs(result.chargeCoulombs - 1e-3) < 1e-15);
  assert.ok(Math.abs(result.energyJoules - 0.0025) < 1e-15);
  assert.deepEqual(result.components, [{ voltageVolts: 5, chargeCoulombs: 0.0005 }, { voltageVolts: 5, chargeCoulombs: 0.0005 }]);
});

test('series capacitors use reciprocal sum and divide voltage inversely to capacitance', () => {
  const result = calculateCapacitorNetwork({ values: [100, 200], unit: 'uF', connection: 'series', voltage: 12 });
  assert.ok(Math.abs(result.equivalentFarads - (200 / 3) * 1e-6) < 1e-18);
  assert.ok(Math.abs(result.components[0].voltageVolts - 8) < 1e-12);
  assert.ok(Math.abs(result.components[1].voltageVolts - 4) < 1e-12);
  assert.ok(Math.abs(result.components[0].chargeCoulombs - result.chargeCoulombs) < 1e-15);
});

test('supports a single capacitor and leaves charge and energy absent without voltage', () => {
  const result = calculateCapacitorNetwork({ values: [47], unit: 'nF' });
  assert.ok(Math.abs(result.equivalentFarads - 47e-9) < 1e-20);
  assert.equal('chargeCoulombs' in result, false);
});

test('accepts zero volts while returning zero charge and energy', () => {
  const result = calculateCapacitorNetwork({ values: [10], unit: 'uF', voltage: 0 });
  assert.equal(result.chargeCoulombs, 0);
  assert.equal(result.energyJoules, 0);
});

test('rejects bad topology, empty, excessive, zero and non-finite component values', () => {
  for (const options of [
    { values: [] }, { values: [0] }, { values: [Number.NaN] },
    { values: Array(21).fill(1) }, { values: [1], connection: 'mixed' },
    { values: [1], unit: 'mH' }, { values: [1], voltage: -1 },
  ]) assert.throws(() => calculateCapacitorNetwork(options), RangeError);
});

test('parses up to twenty non-empty localized lines through the supplied number parser', () => {
  assert.deepEqual(parseCapacitanceLines('  100\n\n200\r\n', Number), [100, 200]);
  assert.throws(() => parseCapacitanceLines(''), RangeError);
  assert.throws(() => parseCapacitanceLines(Array(21).fill('1').join('\n'), Number), RangeError);
  assert.throws(() => parseCapacitanceLines('bad', Number), RangeError);
});
