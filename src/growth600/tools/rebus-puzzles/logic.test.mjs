import test from 'node:test';
import assert from 'node:assert/strict';
import { createRebusSession, getCurrentRebus, nextRebusPuzzle, normalizeRebusAnswer, REBUS_PUZZLE_COUNT, requestRebusHint, resetRebusSession, revealRebusAnswer, submitRebusAnswer } from './logic.mjs';

test('creates a shuffled, finite set of unique original rebus puzzles', () => {
  const a = createRebusSession({ random: () => 0.5 });
  const b = createRebusSession({ random: () => 0.2 });
  assert.equal(a.order.length, 10);
  assert.equal(new Set(a.order).size, REBUS_PUZZLE_COUNT);
  assert.notDeepEqual(a.order, b.order);
  assert.deepEqual(getCurrentRebus(a).rows, getCurrentRebus(a).rows);
  assert.equal(getCurrentRebus(a).hint, '');
  assert.throws(() => createRebusSession({ random: () => 1 }), /0 inclusive/u);
});

test('normalizes case, punctuation and accents without accepting a wrong phrase', () => {
  assert.equal(normalizeRebusAnswer('  Head—OVER   heels! '), 'head over heels');
  assert.equal(normalizeRebusAnswer('café'), 'cafe');
  const s = createRebusSession({ random: () => 0.5 });
  const first = getCurrentRebus(s);
  const wrong = submitRebusAnswer(s, 'not the answer');
  assert.equal(wrong.correct, false);
  assert.equal(wrong.session.attempts, 1);
  assert.equal(first.answer, '', 'the hidden answer is not exposed before solving');
  const solved = submitRebusAnswer(s, 'HEAD—OVER heels!');
  assert.equal(solved.correct, true);
  assert.equal(solved.session.attempts, 1);
  assert.equal(solved.session.correct, 1);
  assert.equal(getCurrentRebus(solved.session).answer, 'head over heels');
});

test('hints are progressive, and a correct answer updates score exactly once', () => {
  const s = createRebusSession({ random: () => 0.5 });
  assert.equal(getCurrentRebus(requestRebusHint(s)).hint.length > 0, true);
  const solved = submitRebusAnswer(s, 'HEAD OVER HEELS');
  assert.equal(solved.correct, true);
  assert.equal(solved.session.correct, 1);
  assert.equal(getCurrentRebus(solved.session).explanation.length > 0, true);
  assert.equal(submitRebusAnswer(solved.session, 'head over heels').ignored, true);
});

test('answer reveal and next puzzle are bounded and do not alter prior session state', () => {
  let session = createRebusSession({ random: () => 0.5 });
  const answer = getCurrentRebus(session).answer;
  session = revealRebusAnswer(session);
  assert.equal(getCurrentRebus(session).answer.length > 0, true);
  assert.equal(getCurrentRebus(session).explanation.length > 0, true);
  assert.equal(submitRebusAnswer(session, answer).ignored, true);
  assert.equal(session.index, 0);
  for (let i = 0; i < REBUS_PUZZLE_COUNT - 1; i += 1) session = nextRebusPuzzle(session);
  assert.equal(session.index, REBUS_PUZZLE_COUNT - 1);
  assert.equal(nextRebusPuzzle(session), null);
  assert.equal(resetRebusSession({ random: () => 0.5 }).index, 0);
});
