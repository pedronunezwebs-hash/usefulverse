import assert from 'node:assert/strict';
import test from 'node:test';
import { breathingPhaseAt, normalizeBreathingConfig } from './logic.mjs';

const box = Object.freeze({ inhaleSeconds: 4, holdAfterInhaleSeconds: 4, exhaleSeconds: 4, holdAfterExhaleSeconds: 4, durationSeconds: 60 });

test('box breathing transitions exactly at each phase boundary and counts cycles', () => {
  assert.equal(breathingPhaseAt(box, 0).phase, 'inhale');
  assert.ok(Math.abs(breathingPhaseAt(box, 3.9).phaseRemainingSeconds - 0.1) < 1e-9);
  assert.deepEqual([breathingPhaseAt(box, 4).phase, breathingPhaseAt(box, 8).phase, breathingPhaseAt(box, 12).phase, breathingPhaseAt(box, 16).cycle], ['hold', 'exhale', 'hold', 2]);
});

test('sessions stop at requested duration even when the last cycle is partial', () => {
  const config = { inhaleSeconds: 4, exhaleSeconds: 6, durationSeconds: 35 };
  assert.equal(breathingPhaseAt(config, 34.99).remainingSeconds, 1);
  assert.equal(breathingPhaseAt(config, 35).phase, 'complete');
  assert.equal(breathingPhaseAt(config, 100).progress, 1);
});

test('zero-length holds are skipped and configuration is normalized into an immutable snapshot', () => {
  const normalized = normalizeBreathingConfig({ inhaleSeconds: '3', exhaleSeconds: '5', durationSeconds: '90' });
  assert.equal(normalized.cycleSeconds, 8);
  assert.equal(breathingPhaseAt(normalized, 3).phase, 'exhale');
  assert.ok(Object.isFrozen(normalized));
});

test('rejects invalid timing, unsafe duration and negative/non-finite elapsed time', () => {
  assert.throws(() => normalizeBreathingConfig({ inhaleSeconds: 0, exhaleSeconds: 4, durationSeconds: 60 }));
  assert.throws(() => normalizeBreathingConfig({ inhaleSeconds: 4, exhaleSeconds: 4, durationSeconds: 29 }));
  assert.throws(() => normalizeBreathingConfig({ inhaleSeconds: 4, exhaleSeconds: 4, durationSeconds: 3_601 }));
  assert.throws(() => breathingPhaseAt(box, -1));
  assert.throws(() => breathingPhaseAt(box, Number.NaN));
});

test('acceptance: 4-7-8 session uses exact configured phase durations', () => {
  const config = { inhaleSeconds: 4, holdAfterInhaleSeconds: 7, exhaleSeconds: 8, durationSeconds: 60 };
  assert.deepEqual([breathingPhaseAt(config, 0).phase, breathingPhaseAt(config, 4).phase, breathingPhaseAt(config, 11).phase, breathingPhaseAt(config, 19).phase], ['inhale', 'hold', 'exhale', 'inhale']);
});
