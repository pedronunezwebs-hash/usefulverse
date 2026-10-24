import test from 'node:test';
import assert from 'node:assert/strict';
import { applyNimBotMove, chooseNimBotMove, makeNimMove, parseNimPiles } from './logic.mjs';

test('parses bounded two to six Nim piles and rejects malformed values', () => {
  assert.deepEqual(parseNimPiles('3, 4; 5'), [3, 4, 5]);
  assert.deepEqual(parseNimPiles('1 1'), [1, 1]);
  for (const input of ['', '1', '1, 2, 3, 4, 5, 6, 7', '0, 2', '51, 2', '2, nope']) {
    assert.throws(() => parseNimPiles(input));
  }
});

test('a legal move removes stones from exactly one pile; the last stone wins', () => {
  assert.deepEqual(makeNimMove([2, 3], 1, 2), { piles: [2, 1], winner: null, done: false });
  assert.deepEqual(makeNimMove([0, 1], 1, 1), { piles: [0, 0], winner: 'player', done: true });
  for (const [piles, index, take] of [[[1, 2], -1, 1], [[1, 2], 2, 1], [[1, 2], 0, 2], [[0, 2], 0, 1], [[1], 0, 1]]) {
    assert.throws(() => makeNimMove(piles, index, take));
  }
});

test('the local bot takes a winning XOR move whenever one exists', () => {
  for (const piles of [[1, 2, 4], [7, 3], [4, 5, 6], [1, 4, 2, 2]]) {
    const move = chooseNimBotMove(piles);
    const result = applyNimBotMove(piles);
    assert.ok(move);
    assert.equal(result.piles.reduce((xor, value) => xor ^ value, 0), 0);
    assert.equal(result.piles.reduce((sum, value) => sum + value, 0), piles.reduce((sum, value) => sum + value, 0) - move.take);
    assert.equal(result.done, result.piles.every((value) => value === 0));
  }
});

test('when no winning XOR move exists, the bot still makes a legal move', () => {
  const piles = [1, 2, 3];
  assert.equal(piles.reduce((xor, value) => xor ^ value, 0), 0);
  const move = chooseNimBotMove(piles);
  assert.ok(move && move.take >= 1 && move.take <= piles[move.pileIndex]);
  const result = applyNimBotMove(piles);
  assert.notDeepEqual(result.piles, piles);
});

test('empty game state has no bot action and invalid bot boards are rejected', () => {
  assert.equal(chooseNimBotMove([0, 0]), null);
  assert.deepEqual(applyNimBotMove([0, 0]), { piles: [0, 0], winner: null, done: true, move: null });
  assert.throws(() => chooseNimBotMove([1]));
  assert.throws(() => applyNimBotMove([1, -1]));
});
