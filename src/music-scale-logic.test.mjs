import test from 'node:test';
import assert from 'node:assert/strict';
import { buildScale, validateScalePlayback } from './music-scale-logic.mjs';

test('builds major and minor scales with the expected notes and intervals', () => {
  assert.deepEqual(buildScale({ root: 'C', scale: 'major' }).map(({ note }) => note), ['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  assert.deepEqual(buildScale({ root: 'A', scale: 'minor' }).map(({ note }) => note), ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  assert.deepEqual(buildScale({ root: 'B♭', scale: 'blues' }).map(({ note }) => note), ['B♭', 'D♭', 'E♭', 'E', 'F', 'A♭']);
});

test('returns usable MIDI values, scale degrees and distinct scale sizes', () => {
  const scale = buildScale({ root: 'F♯', scale: 'majorPentatonic' });
  assert.equal(scale.length, 5);
  assert.deepEqual(scale.map(({ degree }) => degree), ['1', '2', '3', '5', '6']);
  assert.ok(scale.every(({ midi }) => midi >= 60 && midi <= 83));
  assert.equal(buildScale({ root: 'C', scale: 'harmonicMinor' }).at(-1).semitones, 11);
});

test('rejects unsupported note names, scale IDs and unsafe playback settings', () => {
  assert.throws(() => buildScale({ root: 'H', scale: 'major' }), /root note/u);
  assert.throws(() => buildScale({ root: 'C', scale: 'made-up' }), /scale/u);
  assert.throws(() => validateScalePlayback({ durationMs: 10 }), /100 to 1500/u);
  assert.throws(() => validateScalePlayback({ volume: 0.8 }), /0 to 0.35/u);
  assert.deepEqual(validateScalePlayback({ durationMs: '420', volume: '0.2' }), { durationMs: 420, volume: 0.2 });
});
