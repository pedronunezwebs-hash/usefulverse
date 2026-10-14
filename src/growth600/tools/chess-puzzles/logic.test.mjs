import assert from 'node:assert/strict';
import test from 'node:test';
import { CHESS_MATE_PUZZLES, createChessPuzzleSession, getChessPuzzleBoard, getChessPuzzleHint, submitChessPuzzleMove, validateMatePuzzles } from './logic.mjs';

test('every original puzzle has one legal declared mate-in-one answer', () => {
  assert.equal(validateMatePuzzles().length, 10);
  assert.equal(new Set(CHESS_MATE_PUZZLES.map(({ fen }) => fen)).size, CHESS_MATE_PUZZLES.length);
});

test('a correct answer is played on the board and completes the puzzle', () => {
  const session = createChessPuzzleSession({ puzzles: [CHESS_MATE_PUZZLES[0]], random: () => 0 });
  assert.equal(getChessPuzzleBoard(session).flat().filter(Boolean).length, 6);
  const result = submitChessPuzzleMove(session, 'f5', 'f6');
  assert.deepEqual(result, { ok: true, san: 'Qxf6#', attempts: 1, hints: 0 });
  assert.equal(session.game.isCheckmate(), true);
  assert.deepEqual(submitChessPuzzleMove(session, 'a1', 'a2'), { ok: false, reason: 'finished' });
});

test('illegal and legal-but-wrong moves count once and do not mutate the board', () => {
  const session = createChessPuzzleSession({ puzzles: [CHESS_MATE_PUZZLES[0]], random: () => 0 });
  const before = session.game.fen();
  assert.equal(submitChessPuzzleMove(session, 'a1', 'a2').reason, 'illegal');
  assert.equal(submitChessPuzzleMove(session, 'f5', 'g5').reason, 'not-solution');
  assert.equal(session.game.fen(), before);
  assert.equal(session.attempts, 2);
});

test('hints identify the verified move and new puzzles avoid the last ID when possible', () => {
  const session = createChessPuzzleSession({ previousId: CHESS_MATE_PUZZLES[0].id, puzzles: CHESS_MATE_PUZZLES, random: () => 0 });
  assert.notEqual(session.puzzle.id, CHESS_MATE_PUZZLES[0].id);
  assert.deepEqual(getChessPuzzleHint(session), { from: session.puzzle.from, to: session.puzzle.to });
  assert.equal(session.hints, 1);
});

test('malformed lists, squares and random sources are rejected', () => {
  assert.throws(() => validateMatePuzzles([{ id: 'bad', fen: 'broken', from: 'a1', to: 'a2' }]), /Invalid FEN/u);
  assert.throws(() => createChessPuzzleSession({ random: () => 1 }), /random source/u);
  const session = createChessPuzzleSession({ puzzles: [CHESS_MATE_PUZZLES[0]], random: () => 0 });
  assert.deepEqual(submitChessPuzzleMove(session, 'invalid', 'g7'), { ok: false, reason: 'invalid-square' });
});
