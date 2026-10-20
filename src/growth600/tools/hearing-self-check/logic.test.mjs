import assert from 'node:assert/strict';
import test from 'node:test';
import { createHearingObservation, HEARING_TONE_FREQUENCIES_HZ } from './logic.mjs';

test('hearing observation contains six self-reported frequencies without a score', () => {
  const result = createHearingObservation({ 250: 'heard', 500: 'not-heard' });
  assert.deepEqual(result.map(({ frequency }) => frequency), [250, 500, 1000, 2000, 4000, 6000]);
  assert.deepEqual(result.map(({ response }) => response), ['heard', 'not-heard', 'skipped', 'skipped', 'skipped', 'skipped']);
  assert.equal('score' in result, false);
});

test('hearing observation rejects unsupported response values', () => {
  assert.equal(HEARING_TONE_FREQUENCIES_HZ.length, 6);
  assert.throws(() => createHearingObservation({ 250: 'pass' }), RangeError);
});
