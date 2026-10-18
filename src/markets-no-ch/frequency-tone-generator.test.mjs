import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeToneWav, generateToneSamples, validateToneSettings } from './frequency-tone-generator.mjs';

const defaults = { mode: 'tone', startFrequency: 440, endFrequency: 880, waveform: 'sine', channel: 'mono', duration: 1, volume: 0.02, sampleRate: 48000 };

test('validates frequency against the output Nyquist limit and bounds all controls', () => {
  assert.equal(validateToneSettings(defaults).startFrequency, 440);
  assert.throws(() => validateToneSettings({ ...defaults, startFrequency: 20000, sampleRate: 32000 }), /Nyquist/u);
  assert.throws(() => validateToneSettings({ ...defaults, duration: 11 }), RangeError);
  assert.throws(() => validateToneSettings({ ...defaults, volume: 0.11 }), RangeError);
  assert.throws(() => validateToneSettings({ ...defaults, waveform: 'voice' }), RangeError);
});

test('sine generation returns expected frame count, fade envelope and a 440 Hz crossing estimate', () => {
  const result = generateToneSamples(defaults);
  const [samples] = result.channels;
  assert.equal(samples.length, 48000);
  assert.equal(samples[0], 0);
  assert.ok(Math.abs(samples[24000]) < 1e-5);
  assert.equal(Object.is(samples[24000], -0), false);
  assert.equal(samples.at(-1), 0);
  let crossings = 0;
  for (let i = 1; i < samples.length; i += 1) if (samples[i - 1] <= 0 && samples[i] > 0) crossings += 1;
  assert.equal(crossings, 440);
});

test('sweep interpolates from the requested start to end and supports supported waveforms', () => {
  const result = generateToneSamples({ ...defaults, mode: 'sweep', duration: 2, startFrequency: 200, endFrequency: 1200, waveform: 'triangle' });
  assert.equal(result.channels[0].length, 96000);
  assert.ok(result.channels[0].some((sample) => sample !== 0));
  for (const waveform of ['square', 'sawtooth']) assert.ok(generateToneSamples({ ...defaults, waveform }).channels[0].some((sample) => sample !== 0));
});

test('stereo channels are identical, low-level and produce a valid stereo PCM WAV', () => {
  const samples = generateToneSamples({ ...defaults, channel: 'stereo' });
  assert.deepEqual(samples.channels[0], samples.channels[1]);
  assert.ok(Math.max(...samples.channels[0].slice(100, 500)) <= 0.02);
  const wav = encodeToneWav(samples); const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  assert.equal(new TextDecoder().decode(wav.slice(0, 4)), 'RIFF');
  assert.equal(view.getUint16(22, true), 2);
  assert.equal(view.getUint32(24, true), 48000);
  assert.equal(view.getUint16(34, true), 16);
  assert.equal(view.getUint32(40, true), samples.channels[0].length * 4);
});

test('rejects malformed or overlong WAV buffers instead of allocating unbounded data', () => {
  assert.throws(() => encodeToneWav(null), TypeError);
  assert.throws(() => encodeToneWav({ sampleRate: 48000, channels: [new Float32Array(480001)] }), RangeError);
});
