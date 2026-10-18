import test from 'node:test';
import assert from 'node:assert/strict';
import { detectMonophonicNotes, encodeMidi, estimatePitch, quantizeNotes } from './audio-to-midi-transcriber.mjs';

function tone(hz, seconds, sampleRate = 24000, amplitude = 0.55) {
  return Float32Array.from({ length: Math.round(seconds * sampleRate) }, (_, index) => amplitude * Math.sin(2 * Math.PI * hz * index / sampleRate));
}

function join(...parts) {
  const result = new Float32Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.length; }
  return result;
}

test('estimates isolated A4 near 440 Hz and rejects silence and malformed input', () => {
  const a4 = tone(440, 0.2);
  const estimate = estimatePitch(a4.subarray(0, 768), 24000);
  assert.ok(estimate);
  assert.equal(estimate.midi, 69);
  assert.ok(Math.abs(estimate.hz - 440) < 8, `${estimate.hz} Hz`);
  assert.equal(estimatePitch(new Float32Array(768), 24000), null);
  assert.equal(estimatePitch([], 24000), null);
});

test('transcribes known monophonic notes, separates silence, and keeps valid event ordering', () => {
  const sampleRate = 24000;
  const silence = new Float32Array(Math.round(0.22 * sampleRate));
  const notes = detectMonophonicNotes(join(tone(440, 0.42, sampleRate), silence, tone(659.255, 0.48, sampleRate)), sampleRate);
  assert.ok(notes.length >= 2, JSON.stringify(notes));
  assert.ok(notes.some((note) => note.midi === 69), JSON.stringify(notes));
  assert.ok(notes.some((note) => note.midi === 76), JSON.stringify(notes));
  assert.ok(notes.every((note) => note.start >= 0 && note.duration > 0 && note.velocity >= 1 && note.velocity <= 127));
  const second = notes.find((note) => note.midi === 76);
  assert.ok(second.start > 0.4, JSON.stringify(notes));
  for (let index = 0; index < notes.length - 1; index += 1) assert.ok(notes[index].start + notes[index].duration <= notes[index + 1].start + 1e-9, 'monophonic events must not overlap');
});

test('a synthetic chord is not claimed as reliable polyphonic transcription', () => {
  const sampleRate = 24000;
  const chord = Float32Array.from({ length: sampleRate }, (_, index) => 0.3 * Math.sin(2 * Math.PI * 440 * index / sampleRate) + 0.25 * Math.sin(2 * Math.PI * 659.255 * index / sampleRate));
  const detected = detectMonophonicNotes(chord, sampleRate);
  assert.ok(detected.length <= 1, `single-pitch mode unexpectedly emitted simultaneous chord notes: ${JSON.stringify(detected)}`);
  if (detected.length) assert.ok(detected[0].confidence < 0.78, 'the chord fixture should not receive a high-confidence label');
});

test('quantization rounds start and end and rejects invalid tempo/grid', () => {
  const source = [{ midi: 60, start: 0.31, duration: 0.42, velocity: 90 }];
  assert.deepEqual(quantizeNotes(source, 120, 16), [{ ...source[0], start: 0.25, duration: 0.5 }]);
  assert.deepEqual(quantizeNotes(source, 120, 0), source);
  assert.throws(() => quantizeNotes(source, 0, 4), RangeError);
  assert.throws(() => quantizeNotes(source, 120, 3), RangeError);
});

test('exports a valid single-track SMF with tempo, note-on/off and end-of-track', () => {
  const midi = encodeMidi([{ midi: 69, start: 0, duration: 0.5, velocity: 96 }], { bpm: 120 });
  assert.equal(new TextDecoder().decode(midi.subarray(0, 4)), 'MThd');
  assert.equal(new TextDecoder().decode(midi.subarray(14, 18)), 'MTrk');
  assert.ok(midi.includes(0x90) && midi.includes(69) && midi.includes(96));
  assert.ok(midi.includes(0x80));
  assert.deepEqual([...midi.slice(-4)], [0, 0xff, 0x2f, 0]);
  assert.throws(() => encodeMidi([{ midi: 128, start: 0, duration: 1, velocity: 80 }]), RangeError);
  assert.throws(() => encodeMidi([{ midi: 60, start: -1, duration: 1, velocity: 80 }]), RangeError);
});
