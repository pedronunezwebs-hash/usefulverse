import test from 'node:test';
import assert from 'node:assert/strict';
import { fingerprintAudio, findAudioMatch } from './logic.mjs';

function toneSequence(notes, { secondsPerNote = 1, sampleRate = 11025 } = {}) {
  const samples = new Float32Array(Math.round(notes.length * secondsPerNote * sampleRate));
  notes.forEach((midi, noteIndex) => {
    const start = Math.round(noteIndex * secondsPerNote * sampleRate);
    const end = Math.round((noteIndex + 1) * secondsPerNote * sampleRate);
    const frequency = 440 * 2 ** ((midi - 69) / 12);
    for (let i = start; i < end; i += 1) samples[i] = 0.4 * Math.sin(2 * Math.PI * frequency * i / sampleRate);
  });
  return samples;
}

test('local audio fingerprints find the query sequence inside a user-provided reference track', () => {
  const query = fingerprintAudio(toneSequence([60, 64, 67]));
  const other = fingerprintAudio(toneSequence([58, 61, 65, 70, 65, 61]));
  const reference = fingerprintAudio(toneSequence([48, 60, 64, 67, 72, 60]));
  const result = findAudioMatch(query, [
    { name: 'other.wav', fingerprint: other },
    { name: 'my-reference.wav', fingerprint: reference },
  ]);
  assert.equal(result.name, 'my-reference.wav');
  assert.ok(result.score > 0.95);
  assert.ok(result.offsetSeconds >= 0.5);
  assert.equal(result.comparedFrames, query.frames.length);
});

test('local audio fingerprints reject silence, short samples, invalid rates and oversized libraries', () => {
  assert.throws(() => fingerprintAudio(new Float32Array(1024)));
  assert.throws(() => fingerprintAudio(new Float32Array(4096), 6000));
  assert.throws(() => fingerprintAudio(new Float32Array(4096)));
  assert.throws(() => findAudioMatch({ frames: [{}] }, Array(9).fill({ name: 'x', fingerprint: { frames: [{}] } })));
});
