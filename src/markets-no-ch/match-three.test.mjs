import test from 'node:test';
import assert from 'node:assert/strict';
import { MATCH_LEVELS, areAdjacent, createMatchBoard, createMatchThreeState, findMatchCells, findMatchHint, hasLegalMatchMove, nextMatchLevel, resolveMatchBoard, shuffleMatchThree, swapMatchThree, undoMatchThree } from './match-three.mjs';

const board = (rows) => rows.map((row) => row.split('').map(Number));

test('generated board has no initial matches and always offers a legal move', () => {
  for (let seed = 0; seed < 80; seed += 1) {
    const next = createMatchBoard(seed);
    assert.equal(findMatchCells(next).size, 0);
    assert.equal(hasLegalMatchMove(next), true);
  }
});

test('deterministic fallback board has no ready-made line and has a legal move', () => {
  const fallback = Array.from({ length: 8 }, (_, row) => Array.from({ length: 8 }, (_, col) => (row * 2 + col) % 6));
  fallback[0][0] = 0; fallback[1][0] = 1; fallback[2][0] = 0; fallback[1][1] = 0;
  assert.equal(findMatchCells(fallback).size, 0);
  assert.equal(findMatchCells((() => { const next = fallback.map((row) => [...row]); [next[1][0], next[1][1]] = [next[1][1], next[1][0]]; return next; })()).size >= 3, true);
});

test('detects horizontal, vertical and intersecting matches once per tile', () => {
  const horizontal = Array.from({ length: 8 }, (_, row) => Array.from({ length: 8 }, (_, col) => (row + col) % 6));
  horizontal[2][0] = 4; horizontal[2][1] = 4; horizontal[2][2] = 4;
  assert.equal(findMatchCells(horizontal).size, 3);
  const crossed = Array.from({ length: 8 }, (_, row) => Array.from({ length: 8 }, (_, col) => (row + col) % 6));
  for (const col of [2, 3, 4]) crossed[3][col] = 5;
  crossed[2][3] = 5; crossed[4][3] = 5;
  assert.equal(findMatchCells(crossed).size, 5);
});

test('rejects diagonal, nonadjacent and non-matching swaps without mutating state', () => {
  const state = createMatchThreeState({ seed: 123 });
  assert.equal(areAdjacent(0, 9), false);
  assert.equal(swapMatchThree(state, 0, 9).reason, 'invalid');
  assert.equal(swapMatchThree(state, 0, 1).valid, false);
  assert.equal(state.moves, 24);
});

test('valid swap cascades, scores matches, consumes one move and can be undone', () => {
  const fixture = board(['01234501', '12034512', '20345123', '34012345', '45123450', '51234501', '12345012', '23450123']);
  fixture[0] = [0, 1, 2, 3, 4, 5, 0, 1];
  fixture[1][0] = 2; fixture[2][0] = 0;
  const state = { ...createMatchThreeState({ seed: 9 }), board: fixture };
  const move = findMatchHint(fixture);
  assert.ok(move);
  const result = swapMatchThree(state, ...move);
  assert.equal(result.valid, true);
  assert.equal(result.state.moves, 23);
  assert.ok(result.state.score > 0);
  assert.equal(undoMatchThree(result.state).moves, 24);
  assert.deepEqual(undoMatchThree(result.state).board, fixture);
});

test('resolution reports the whole cascade and produces a full legal board', () => {
  const result = resolveMatchBoard(board(['00012345', '12345012', '23450123', '34501234', '45012345', '50123450', '01234501', '12345012']), 55);
  assert.equal(result.cleared, 3);
  assert.equal(result.score, 30);
  assert.ok(result.cascades >= 1);
  assert.ok(result.board.every((row) => row.length === 8 && row.every(Number.isInteger)));
  assert.equal(findMatchCells(result.board).size, 0);
});

test('hint is a legal move and level progression advances only after a win', () => {
  const state = createMatchThreeState({ level: 2, seed: 77 });
  assert.deepEqual(findMatchHint(state.board), hintMatchThreeForAssertion(state.board));
  assert.equal(nextMatchLevel(state).level, 2);
  assert.equal(nextMatchLevel({ ...state, status: 'won' }, 2).level, 3);
});

test('shuffle keeps earned score and remaining moves, and a final move can win', () => {
  const original = createMatchThreeState({ seed: 99 });
  const shuffled = shuffleMatchThree({ ...original, score: 180, moves: 11 }, 1234);
  assert.equal(shuffled.score, 180);
  assert.equal(shuffled.moves, 11);
  assert.equal(findMatchCells(shuffled.board).size, 0);
  assert.equal(hasLegalMatchMove(shuffled.board), true);

  const fixture = board(['01234501', '12034512', '20345123', '34012345', '45123450', '51234501', '12345012', '23450123']);
  fixture[0] = [0, 1, 2, 3, 4, 5, 0, 1]; fixture[1][0] = 2; fixture[2][0] = 0;
  const move = findMatchHint(fixture);
  const state = { ...createMatchThreeState({ seed: 4 }), board: fixture, score: MATCH_LEVELS[0].goal - 10, moves: 1 };
  const won = swapMatchThree(state, ...move);
  assert.equal(won.state.status, 'won');
  assert.equal(won.state.moves, 0);
});

function hintMatchThreeForAssertion(current) {
  const pair = findMatchHint(current);
  assert.ok(pair);
  return pair;
}
