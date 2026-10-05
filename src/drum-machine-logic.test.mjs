import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_DRUM_PATTERN, DRUM_STEPS, drumStepSeconds, normalizeDrumPattern, toggleDrumStep, validateDrumTempo } from './drum-machine-logic.mjs';

test('drum machine ships a valid 16-step starter beat and returns independent patterns', () => {
  const pattern = normalizeDrumPattern(DEFAULT_DRUM_PATTERN);
  assert.equal(Object.values(pattern).every((steps) => steps.length === DRUM_STEPS), true);
  assert.notEqual(pattern.kick, DEFAULT_DRUM_PATTERN.kick);
  assert.deepEqual(pattern.snare.filter(Boolean), [1, 1]);
});

test('drum steps toggle independently and reject invalid tracks or positions', () => {
  const original = normalizeDrumPattern(DEFAULT_DRUM_PATTERN);
  const next = toggleDrumStep(original, 'kick', 1);
  assert.equal(next.kick[1], 1);
  assert.equal(original.kick[1], 0);
  assert.throws(() => toggleDrumStep(original, 'bass', 1), /kick, snare or hat/u);
  assert.throws(() => toggleDrumStep(original, 'kick', 16), /16 steps/u);
  assert.throws(() => normalizeDrumPattern({ ...original, hat: [1, 2] }), /16 on\/off steps/u);
});

test('drum tempo is bounded and step duration follows the selected BPM', () => {
  assert.equal(validateDrumTempo('120'), 120);
  assert.equal(drumStepSeconds(120), 0.125);
  assert.equal(drumStepSeconds(60), 0.25);
  for (const invalid of [39, 241, 90.5, 'abc', NaN]) assert.throws(() => validateDrumTempo(invalid), /40 to 240 BPM/u);
});
