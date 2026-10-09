import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateTransformer } from './logic.mjs';

test('transformer calculator solves secondary voltage from turns ratio', () => {
  const result = calculateTransformer({ mode: 'voltage', primaryVoltage: 120, primaryTurns: 100, secondaryTurns: 50 });
  assert.equal(result.secondaryVoltage, 60);
  assert.equal(result.turnsRatio, 0.5);
  assert.equal(result.direction, 'step-down');
});

test('transformer calculator finds turns ratio from voltage ratio', () => {
  assert.equal(calculateTransformer({ mode: 'ratio', primaryVoltage: 120, secondaryVoltage: 60 }).turnsRatio, 0.5);
  assert.equal(calculateTransformer({ mode: 'ratio', primaryVoltage: 120, secondaryVoltage: 240 }).direction, 'step-up');
});

test('transformer calculator estimates inverse current ratio with efficiency', () => {
  const result = calculateTransformer({ mode: 'current', primaryCurrent: 2, primaryTurns: 100, secondaryTurns: 50, efficiencyPercent: 90 });
  assert.equal(result.secondaryCurrent, 3.6);
  assert.equal(result.efficiencyPercent, 90);
});

test('transformer calculator rejects invalid modes, nonpositive inputs and invalid efficiency', () => {
  assert.throws(() => calculateTransformer({ mode: 'other' }), /Choose voltage/u);
  assert.throws(() => calculateTransformer({ mode: 'voltage', primaryVoltage: 0, primaryTurns: 100, secondaryTurns: 50 }), /Primary voltage/u);
  assert.throws(() => calculateTransformer({ mode: 'voltage', primaryVoltage: 120, primaryTurns: 100, secondaryTurns: 1e13 }), /supported range/u);
  assert.throws(() => calculateTransformer({ mode: 'current', primaryCurrent: 2, primaryTurns: 100, secondaryTurns: 50, efficiencyPercent: 101 }), /Efficiency/u);
});
