import test from 'node:test';
import assert from 'node:assert/strict';
import { checkEarTrainingAnswer, createEarTrainingQuestion, validateEarTrainingSettings } from './ear-training-logic.mjs';

test('generates a bounded interval with an explicit direction and exact semitone spacing', () => {
  const ascending = createEarTrainingQuestion({ intervals: ['perfect-fifth'], direction: 'ascending', random: () => 0.5 });
  assert.equal(ascending.semitones, 7);
  assert.equal(ascending.secondMidi - ascending.firstMidi, 7);
  const descending = createEarTrainingQuestion({ intervals: ['minor-third'], direction: 'descending', random: () => 0.5 });
  assert.equal(descending.firstMidi - descending.secondMidi, 3);
});

test('random direction uses the injected random source and answers match only the active interval', () => {
  let values = [0, 0.9, 0.5];
  const question = createEarTrainingQuestion({ intervals: ['octave'], direction: 'random', random: () => values.shift() ?? 0.5 });
  assert.equal(question.direction, 'descending');
  assert.equal(checkEarTrainingAnswer(question, 'octave'), true);
  assert.equal(checkEarTrainingAnswer(question, 'tritone'), false);
});

test('rejects empty/unknown interval sets and unsupported round sizes', () => {
  assert.throws(() => createEarTrainingQuestion({ intervals: [] }), /interval/u);
  assert.throws(() => createEarTrainingQuestion({ intervals: ['made-up'] }), /interval/u);
  assert.throws(() => validateEarTrainingSettings({ questions: 7, direction: 'random' }), /5, 10 or 20/u);
  assert.deepEqual(validateEarTrainingSettings({ questions: '10', direction: 'descending' }), { questions: 10, direction: 'descending' });
});
