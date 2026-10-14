import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLeanBodyMass } from './logic.mjs';

test('direct body-fat method matches the plan acceptance example', () => {
  const result = calculateLeanBodyMass({ weight: 80, bodyFatPercent: 20 });
  assert.equal(result.leanMass, 64);
  assert.equal(result.fatMass, 16);
  assert.equal(result.leanPercent, 80);
});

test('Boer equation sets use kg/cm and report the chosen method', () => {
  const male = calculateLeanBodyMass({ method: 'boer', equation: 'male', weight: 70, height: 175 });
  const female = calculateLeanBodyMass({ method: 'boer', equation: 'female', weight: 60, height: 165 });
  assert.equal(male.leanMass, 56.015);
  assert.ok(Math.abs(female.leanMass - 44.865) < 1e-9);
  assert.equal(male.formula, 'boer-male');
});

test('imperial inputs convert consistently and output mass in pounds', () => {
  const metric = calculateLeanBodyMass({ weight: 80, bodyFatPercent: 20 });
  const imperial = calculateLeanBodyMass({ weight: 80 / 0.45359237, bodyFatPercent: 20, unitSystem: 'imperial' });
  assert.equal(imperial.unit, 'lb');
  assert.ok(Math.abs(imperial.leanMass * 0.45359237 - metric.leanMass) < 1e-9);
  const boerMetric = calculateLeanBodyMass({ method: 'boer', equation: 'male', weight: 70, height: 175 });
  const boerImperial = calculateLeanBodyMass({ method: 'boer', equation: 'male', weight: 70 / 0.45359237, height: 175 / 2.54, unitSystem: 'imperial' });
  assert.ok(Math.abs(boerImperial.leanMass * 0.45359237 - boerMetric.leanMass) < 1e-9);
});

test('rejects unsupported methods, units, body fat, height, weight and implausible equation results', () => {
  for (const options of [
    { weight: 0, bodyFatPercent: 20 }, { weight: 80, bodyFatPercent: 76 }, { weight: 80, method: 'boer', height: 99 },
    { weight: 80, method: 'boer', height: 180, equation: 'other' }, { weight: 80, method: 'other' },
    { weight: 80, bodyFatPercent: 20, unitSystem: 'stones' }, { weight: 3500, bodyFatPercent: 20 },
    { weight: 44.1, method: 'boer', height: 98.5, unitSystem: 'imperial', equation: 'female' },
  ]) assert.throws(() => calculateLeanBodyMass(options), RangeError);
});
