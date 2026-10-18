import test from 'node:test';
import assert from 'node:assert/strict';
import { effectParameters, encodeWav, pitchRate } from './voice-changer.mjs';

const mockBuffer = (channels, sampleRate, samples) => ({
  numberOfChannels: channels,
  sampleRate,
  length: samples[0].length,
  getChannelData: (channel) => Float32Array.from(samples[channel]),
});

test('pitch-rate conversion is bounded and uses equal-tempered semitone steps', () => {
  assert.equal(pitchRate(0), 1);
  assert.equal(pitchRate(12), 2);
  assert.equal(pitchRate(-12), 0.5);
  assert.throws(() => pitchRate(13), RangeError);
});

test('effect presets return safe explicit filter, pitch and output settings', () => {
  assert.equal(effectParameters('radio').filter, 'bandpass');
  assert.equal(effectParameters('echo').echo, true);
  assert.ok(effectParameters('deep').playbackRate < 1);
  assert.ok(effectParameters('bright').playbackRate > 1);
  assert.ok(effectParameters('clean', 0, 1).volume <= 1);
  assert.throws(() => effectParameters('identity-clone'), RangeError);
  assert.throws(() => effectParameters('clean', 0, 1.1), RangeError);
});

test('WAV encoder writes a valid 16-bit mono PCM header and clamps samples', () => {
  const wav = encodeWav(mockBuffer(1, 8000, [[-2, 0, 0.5, 2]]));
  const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  assert.equal(new TextDecoder().decode(wav.slice(0, 4)), 'RIFF');
  assert.equal(new TextDecoder().decode(wav.slice(8, 12)), 'WAVE');
  assert.equal(view.getUint16(20, true), 1);
  assert.equal(view.getUint16(22, true), 1);
  assert.equal(view.getUint32(24, true), 8000);
  assert.equal(view.getUint16(34, true), 16);
  assert.equal(view.getUint32(40, true), 8);
  assert.equal(view.getInt16(44, true), -32768);
  assert.equal(view.getInt16(48, true), 16383);
  assert.equal(view.getInt16(50, true), 32767);
});

test('WAV encoder supports stereo but rejects empty, oversized and multichannel output', () => {
  const stereo = encodeWav(mockBuffer(2, 44100, [[0.25], [-0.25]]));
  assert.equal(new DataView(stereo.buffer).getUint16(22, true), 2);
  assert.throws(() => encodeWav(null), TypeError);
  assert.throws(() => encodeWav(mockBuffer(3, 44100, [[0], [0], [0]])), RangeError);
  assert.throws(() => encodeWav(mockBuffer(1, 1000, Array(60001).fill(0))), RangeError);
});
