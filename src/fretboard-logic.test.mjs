import test from 'node:test';
import assert from 'node:assert/strict';
import { createFretboardQuestion, isCorrectNote, NOTE_NAMES, noteAtPosition } from './fretboard-logic.mjs';

test('standard tuning returns the expected open strings and semitone positions', () => {
  assert.deepEqual([6, 5, 4, 3, 2, 1].map((string) => noteAtPosition(string, 0)), ['E', 'A', 'D', 'G', 'B', 'E']);
  assert.equal(noteAtPosition(2, 1), 'C');
  assert.equal(noteAtPosition(6, 12), 'E');
  assert.equal(noteAtPosition(1, 24), 'E');
  assert.throws(() => noteAtPosition(0, 1), /1 to 6/u);
  assert.throws(() => noteAtPosition(1, 25), /0 to 24/u);
});

test('question generation covers the six strings and 13-fret practice range', () => {
  for (let position = 0; position < 78; position += 1) {
    const question = createFretboardQuestion(() => (position + 0.25) / 78);
    assert.equal(question.string, [6, 5, 4, 3, 2, 1][Math.floor(position / 13)]);
    assert.equal(question.fret, position % 13);
    assert.equal(question.note, noteAtPosition(question.string, question.fret));
  }
  assert.throws(() => createFretboardQuestion(() => 1), /\[0, 1\)/u);
});

test('a repeated position is moved by one fret and answers are checked exactly', () => {
  const prior = createFretboardQuestion(() => 0);
  const next = createFretboardQuestion(() => 0, prior);
  assert.notDeepEqual([next.string, next.fret], [prior.string, prior.fret]);
  assert.equal(next.note, noteAtPosition(next.string, next.fret));
  assert.equal(isCorrectNote(next, next.note), true);
  assert.equal(isCorrectNote(next, NOTE_NAMES[(NOTE_NAMES.indexOf(next.note) + 1) % 12]), false);
});
