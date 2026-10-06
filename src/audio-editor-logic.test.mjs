import test from 'node:test';
import assert from 'node:assert/strict';
import { encodePcm16Wav, validateAudioEdit } from './audio-editor-logic.mjs';

test('audio editor validates trim bounds, gain and non-overlapping fades', () => {
  assert.deepEqual(validateAudioEdit(1, 4, 5, 1.5, 1, 1), { start: 1, end: 4, duration: 3, volume: 1.5, fadeIn: 1, fadeOut: 1 });
  for (const values of [[-1, 4, 5], [1, 6, 5], [4, 4, 5], [0, 1, 1, 3], [0, 1, 1, 1, 0.6, 0.6], [0, NaN, 1]]) assert.throws(() => validateAudioEdit(...values));
});

test('WAV export writes valid mono/stereo PCM headers and clips samples safely', () => {
  const data = encodePcm16Wav([Float32Array.of(-1, -0.5, 0, 0.5, 1)], 44100);
  const view = new DataView(data); const id = (offset, length) => String.fromCharCode(...new Uint8Array(data, offset, length));
  assert.equal(id(0, 4), 'RIFF'); assert.equal(id(8, 4), 'WAVE'); assert.equal(id(36, 4), 'data');
  assert.equal(view.getUint16(22, true), 1); assert.equal(view.getUint32(24, true), 44100); assert.equal(view.getUint32(40, true), 10);
  assert.deepEqual(Array.from({ length: 5 }, (_, index) => view.getInt16(44 + index * 2, true)), [-32768, -16384, 0, 16384, 32767]);
  assert.throws(() => encodePcm16Wav([Float32Array.of(0), Float32Array.of()], 44100));
  assert.throws(() => encodePcm16Wav([Float32Array.of(0)], 1000));
});
