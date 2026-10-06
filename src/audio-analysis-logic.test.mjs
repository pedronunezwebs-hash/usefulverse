import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeSamples,
  AUDIO_ANALYSIS_MAX_BYTES,
  AUDIO_ANALYSIS_MAX_SECONDS,
  estimateSongKey,
  fft,
  formatPitchFrequency,
  validateAudioInput,
} from './audio-analysis-logic.mjs';

test('radix-2 FFT keeps an impulse flat and rejects invalid sizes', () => {
  const real = new Float64Array([1, 0, 0, 0]); const imaginary = new Float64Array(4);
  const result = fft(real, imaginary);
  assert.deepEqual([...result.real], [1, 1, 1, 1]);
  assert.deepEqual([...result.imaginary], [0, 0, 0, 0]);
  assert.throws(() => fft(new Float64Array(3), new Float64Array(3)), /power-of-two/u);
});

test('audio analysis detects a 440 Hz spectral peak within one FFT bin', () => {
  const sampleRate = 44100; const samples = Float32Array.from({ length: 8192 }, (_, index) => Math.sin(2 * Math.PI * 440 * index / sampleRate));
  const result = analyzeSamples(samples, sampleRate, { fftSize: 4096, hopSize: 2048, maxFrames: 4 });
  const peak = result.frames[0].reduce((best, value, index, bins) => index > best.index && value > bins[best.index] ? { index, value } : best, { index: 1, value: 0 });
  assert.ok(Math.abs(peak.index * sampleRate / result.fftSize - 440) < sampleRate / result.fftSize);
  assert.equal(result.frames.length, 4);
});

test('key profile estimates the supplied major/minor profiles and silence has no guess', () => {
  const major = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
  const minor = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
  assert.deepEqual(estimateSongKey(major)[0], { tonic: 'C', mode: 'major', score: 1, rank: 1 });
  const aMinor = [...minor.slice(3), ...minor.slice(0, 3)];
  assert.equal(estimateSongKey(aMinor)[0].tonic, 'A');
  assert.equal(estimateSongKey(aMinor)[0].mode, 'minor');
  assert.deepEqual(estimateSongKey(new Float64Array(12)), []);
});

test('pitch formatting labels A4 and rejects invalid frequency', () => {
  assert.deepEqual(formatPitchFrequency(440), { note: 'A', octave: 4, cents: 0 });
  assert.equal(formatPitchFrequency(0), null);
});

test('audio input limits accept boundaries and reject unknown, invalid or excessive media', () => {
  assert.equal(validateAudioInput(1, 1), null);
  assert.equal(validateAudioInput(AUDIO_ANALYSIS_MAX_BYTES, AUDIO_ANALYSIS_MAX_SECONDS), null);
  assert.equal(validateAudioInput(AUDIO_ANALYSIS_MAX_BYTES + 1, 1), 'file-too-large');
  assert.equal(validateAudioInput(1, AUDIO_ANALYSIS_MAX_SECONDS + 0.01), 'duration-too-long');
  assert.equal(validateAudioInput(1, null), 'duration-unknown');
  assert.equal(validateAudioInput(0, 1), 'invalid-file');
  assert.equal(validateAudioInput(Number.NaN, 1), 'invalid-file');
  assert.equal(validateAudioInput(1, 0), 'invalid-duration');
});
