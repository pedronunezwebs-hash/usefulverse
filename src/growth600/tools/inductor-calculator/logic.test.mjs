import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateInductor } from './logic.mjs';

const coil = { mode: 'inductance', turns: 40, diameterMeters: 0.02, lengthMeters: 0.05, wireDiameterMeters: 0.0008 };

test('Wheeler estimate is positive and scales with the square of turns', () => {
  const base = calculateInductor(coil);
  const doubled = calculateInductor({ ...coil, turns: 80, wireDiameterMeters: 0.0004 });
  assert.ok(Math.abs(base.inductanceMicrohenries - 10.6766315) < 1e-6);
  assert.ok(Math.abs(doubled.inductanceMicrohenries / base.inductanceMicrohenries - 4) < 1e-12);
});

test('inverse mode chooses whole turns that meet or exceed the requested inductance', () => {
  const result = calculateInductor({ ...coil, mode: 'turns', targetMicrohenries: 20 });
  assert.ok(result.inductanceMicrohenries >= 20);
  assert.equal(Number.isInteger(result.turns), true);
});

test('coil dimensions and wire fit are validated before calculation', () => {
  assert.throws(() => calculateInductor({ ...coil, turns: '' }), RangeError);
  assert.throws(() => calculateInductor({ ...coil, turns: 40.5 }), RangeError);
  assert.throws(() => calculateInductor({ ...coil, turns: 100 }), /do not fit/u);
  assert.throws(() => calculateInductor({ ...coil, diameterMeters: 0 }), RangeError);
  assert.throws(() => calculateInductor({ ...coil, mode: 'turns', targetMicrohenries: 1e12 }), /supports/u);
});
