import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { OPENING_LINES, createOpeningSession, getExpectedMoveDetails, playOpponentMoves, submitOpeningMove, validateOpeningLines } from './logic.mjs';

test('all teaching lines are legal from the standard initial position', () => {
  const validated = validateOpeningLines();
  assert.equal(validated.length, 10);
  for (const line of validated) assert.ok(line.plies >= 8);
});

test('White can follow the selected Italian line one legal move at a time', () => {
  const session = createOpeningSession('italian', 'w');
  let state = playOpponentMoves(session);
  for (const san of ['e4', 'Nf3', 'Bc4', 'c3', 'd4']) {
    const move = new Chess(session.game.fen());
    const { from, to } = move.moves({ verbose: true }).find((candidate) => candidate.san === san);
    const result = submitOpeningMove(session, from, to);
    assert.equal(result.ok, true, san);
    state = playOpponentMoves(session);
  }
  assert.equal(state.completed, true);
  assert.equal(session.completed, true);
});

test('Black receives opponent moves automatically and has the right response', () => {
  const session = createOpeningSession('sicilian', 'b');
  const start = playOpponentMoves(session);
  assert.deepEqual(start.played, ['e4']);
  assert.equal(start.expected, 'c5');
  const result = submitOpeningMove(session, 'c7', 'c5');
  assert.equal(result.ok, true);
  assert.deepEqual(playOpponentMoves(session).played, ['Nf3']);
});

test('a legal but unrelated move is rejected without changing the board', () => {
  const session = createOpeningSession('french', 'w');
  playOpponentMoves(session);
  const before = session.game.fen();
  const result = submitOpeningMove(session, 'd2', 'd4');
  assert.equal(result.reason, 'off-line');
  assert.equal(result.expected, 'e4');
  assert.equal(session.game.fen(), before);
  assert.equal(session.mistakes, 1);
});

test('invalid side and unknown opening are rejected', () => {
  assert.throws(() => createOpeningSession('italian', 'x'), /Side/);
  assert.throws(() => createOpeningSession('unknown', 'w'), /opening/);
  assert.equal(OPENING_LINES.length, 10);
});

test('every line is fully playable by either color with only legal opponent replies', () => {
  for (const line of OPENING_LINES) for (const side of ['w', 'b']) {
    const session = createOpeningSession(line.id, side);
    playOpponentMoves(session);
    let safety = 0;
    while (!session.completed && safety++ < line.moves.length) {
      const expected = getExpectedMoveDetails(session);
      assert.ok(expected, `${line.id}/${side} expected move ${session.ply}`);
      assert.equal(submitOpeningMove(session, expected.from, expected.to).ok, true, `${line.id}/${side} ${expected.san}`);
      playOpponentMoves(session);
    }
    assert.equal(session.completed, true, `${line.id}/${side} should reach the end`);
  }
});
