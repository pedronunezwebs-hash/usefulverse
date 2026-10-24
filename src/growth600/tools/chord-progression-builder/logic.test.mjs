import test from 'node:test';
import assert from 'node:assert/strict';
import { buildChordProgression, encodeProgressionMidi } from './logic.mjs';

test('chord progression builds diatonic chords, inversions and note names', () => {
  const chords = buildChordProgression({ key: 'C', scale: 'major', degrees: '1 5 6 4' });
  assert.deepEqual(chords.map(({ label }) => label), ['C', 'G', 'Am', 'F']);
  assert.deepEqual(chords[0].notes, ['C3', 'E3', 'G3']);
  const firstInversion = buildChordProgression({ key: 'C', scale: 'major', degrees: '1', inversion: 1 })[0];
  assert.deepEqual(firstInversion.notes, ['E3', 'G3', 'C4']);
  const minor = buildChordProgression({ key: 'A', scale: 'minor', degrees: '1 4 5' });
  assert.deepEqual(minor.map(({ label }) => label), ['Am', 'Dm', 'Em']);
});

test('chord progression validates keys, scales, degree count and inversions', () => {
  assert.throws(() => buildChordProgression({ key: 'Db' }), RangeError);
  assert.throws(() => buildChordProgression({ scale: 'dorian' }), RangeError);
  assert.throws(() => buildChordProgression({ degrees: '1 8' }), RangeError);
  assert.throws(() => buildChordProgression({ degrees: '' }), RangeError);
  assert.throws(() => buildChordProgression({ degrees: Array(17).fill('1').join(' ') }), RangeError);
  assert.throws(() => buildChordProgression({ inversion: 3 }), RangeError);
});

test('MIDI export contains a format-one header, tempo event and end-of-track marker', () => {
  const bytes = encodeProgressionMidi(buildChordProgression({ degrees: '1 5' }), { tempo: 120, beatsPerChord: 2 });
  const asciiAt = (offset) => String.fromCharCode(...bytes.slice(offset, offset + 4));
  assert.equal(asciiAt(0), 'MThd');
  assert.equal(asciiAt(14), 'MTrk');
  assert.deepEqual([...bytes.slice(22, 29)], [0, 0xff, 0x51, 3, 0x07, 0xa1, 0x20]);
  assert.deepEqual([...bytes.slice(-4)], [0, 0xff, 0x2f, 0]);
  assert.throws(() => encodeProgressionMidi([], {}), RangeError);
  assert.throws(() => encodeProgressionMidi(buildChordProgression(), { tempo: 20 }), RangeError);
});
