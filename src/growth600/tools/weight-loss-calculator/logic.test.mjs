import assert from 'node:assert/strict';
import test from 'node:test';
import { estimateLinearWeightLossScenario } from './logic.mjs';

test('reports a transparent linear energy-equivalent scenario in kilograms', () => {
  const result = estimateLinearWeightLossScenario({ currentWeight: 80, targetWeight: 70, dailyDeficit: 500, unit: 'kg' });
  assert.equal(result.amountToLose, 10);
  assert.equal(result.energyEquivalentKcal, 77000);
  assert.equal(result.estimatedDays, 154);
  assert.equal(result.estimatedWeeks, 22);
  assert.ok(!result.paceAboveReference);
});

test('converts the same 10 kg scenario consistently to pounds', () => {
  const result = estimateLinearWeightLossScenario({ currentWeight: 176.3698, targetWeight: 154.3236, dailyDeficit: 500, unit: 'lb' });
  assert.ok(Math.abs(result.energyEquivalentKcal - 77000) < 200);
  assert.ok(Math.abs(result.estimatedDays - 154) < 0.5);
});

test('a zero deficit yields zero modeled rate and no finite timeline', () => {
  const result = estimateLinearWeightLossScenario({ currentWeight: 80, targetWeight: 70, dailyDeficit: 0, unit: 'kg' });
  assert.equal(result.estimatedDays, null);
  assert.equal(result.estimatedWeeks, null);
  assert.equal(result.weeklyRate, 0);
  assert.equal(result.paceAboveReference, false);
});

test('allows a zero-change target and reports zero energy equivalent', () => {
  const result = estimateLinearWeightLossScenario({ currentWeight: 70, targetWeight: 70, dailyDeficit: 500, unit: 'kg' });
  assert.equal(result.amountToLose, 0);
  assert.equal(result.energyEquivalentKcal, 0);
  assert.equal(result.estimatedDays, 0);
  assert.equal(result.weeklyRate, 0);
});

test('flags scenarios above the broad gradual pace reference without changing the value', () => {
  const result = estimateLinearWeightLossScenario({ currentWeight: 80, targetWeight: 70, dailyDeficit: 1200, unit: 'kg' });
  assert.ok(result.paceAboveReference);
  assert.equal(result.estimatedDays, 77000 / 1200);
});

test('rejects invalid units, non-finite values, negative deficits and weight-gain targets', () => {
  assert.throws(() => estimateLinearWeightLossScenario({ currentWeight: 80, targetWeight: 70, dailyDeficit: 100, unit: 'stone' }), /kilograms or pounds/u);
  assert.throws(() => estimateLinearWeightLossScenario({ currentWeight: 80, targetWeight: 70, dailyDeficit: -1 }), /zero or greater/u);
  assert.throws(() => estimateLinearWeightLossScenario({ currentWeight: 70, targetWeight: 80, dailyDeficit: 100 }), /below the current/u);
  assert.throws(() => estimateLinearWeightLossScenario({ currentWeight: Infinity, targetWeight: 70, dailyDeficit: 100 }), /greater than zero/u);
  assert.throws(() => estimateLinearWeightLossScenario({ currentWeight: 80, targetWeight: 70, dailyDeficit: 100, unit: 'toString' }), /kilograms or pounds/u);
});
