import test from 'node:test';
import assert from 'node:assert/strict';
import { emptySequence, normalizeSequence, SEQUENCER_NOTES, sequenceStepSeconds, sequenceToMidi, toggleSequenceStep, validateSequencerTempo } from './online-sequencer-logic.mjs';

test('sequencer creates an independent empty eight-note, sixteen-step pattern', () => {
  const a = emptySequence(); const b = emptySequence();
  assert.equal(a.length, 8); assert.ok(a.every((row) => row.length === 16 && row.every((step) => step === false)));
  a[0][0] = true; assert.equal(b[0][0], false);
});

test('sequencer toggles only the selected note and step without mutating its input', () => {
  const pattern = emptySequence();
  const changed = toggleSequenceStep(pattern, 7, 15);
  assert.equal(pattern[7][15], false); assert.equal(changed[7][15], true);
  assert.equal(toggleSequenceStep(changed, 7, 15)[7][15], false);
});

test('sequencer rejects malformed patterns and out-of-range cells', () => {
  assert.throws(() => normalizeSequence([]), /8 note rows/u);
  assert.throws(() => normalizeSequence(Array.from({ length: 8 }, () => Array(16).fill(0))), /on\/off/u);
  assert.throws(() => toggleSequenceStep(emptySequence(), -1, 0), /valid note/u);
  assert.throws(() => toggleSequenceStep(emptySequence(), 0, 16), /valid note/u);
});

test('tempo is bounded and step duration is a sixteenth note', () => {
  assert.equal(validateSequencerTempo(120), 120);
  assert.equal(sequenceStepSeconds(120), 0.125);
  assert.throws(() => validateSequencerTempo(39), /40 to 240/u);
  assert.throws(() => validateSequencerTempo(120.5), /whole number/u);
});

test('MIDI export has a valid Standard MIDI header, tempo, note-on and note-off events', () => {
  const pattern = emptySequence();
  pattern[7][0] = true; pattern[3][5] = true;
  const bytes = sequenceToMidi(pattern, 120);
  assert.deepEqual([...bytes.slice(0, 14)], [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 1, 0xe0]);
  const text = String.fromCharCode(...bytes);
  assert.ok(text.includes('MTrk'));
  assert.ok(bytes.some((_, index) => bytes[index] === 0x90 && bytes[index + 1] === SEQUENCER_NOTES[7].midi && bytes[index + 2] === 96));
  assert.ok(bytes.some((_, index) => bytes[index] === 0x80 && bytes[index + 1] === SEQUENCER_NOTES[7].midi && bytes[index + 2] === 0));
  assert.ok(bytes.some((_, index) => bytes[index] === 0xff && bytes[index + 1] === 0x51 && bytes[index + 2] === 3));
});

test('MIDI export validates pattern and tempo before producing a file', () => {
  assert.throws(() => sequenceToMidi([], 100), /8 note rows/u);
  assert.throws(() => sequenceToMidi(emptySequence(), 241), /40 to 240/u);
});
