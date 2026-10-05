import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseTicTacToeMove, ticTacToeResult } from './tic-tac-toe-logic.mjs';

test('tic-tac-toe detects each win line, draws and unfinished games', () => {
  for (const line of [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]) {
    const board = Array(9).fill(null); line.forEach((index) => { board[index] = 'X'; });
    assert.equal(ticTacToeResult(board), 'X');
  }
  assert.equal(ticTacToeResult(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), 'draw');
  assert.equal(ticTacToeResult(Array(9).fill(null)), null);
});

test('computer always takes a win or blocks an immediate loss', () => {
  assert.equal(chooseTicTacToeMove(['O', 'O', null, 'X', 'X', null, null, null, null], () => 0), 2);
  assert.equal(chooseTicTacToeMove(['X', 'X', null, 'O', null, null, null, null, null], () => 0), 2);
  assert.equal(chooseTicTacToeMove(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), null);
});

test('unbeatable computer cannot lose against any legal human reply sequence', () => {
  const explore = (board, turn) => {
    const result = ticTacToeResult(board);
    if (result) return result !== 'X';
    if (turn === 'O') {
      const move = chooseTicTacToeMove(board, () => 0);
      board[move] = 'O'; const safe = explore(board, 'X'); board[move] = null;
      return safe;
    }
    return board.flatMap((value, index) => value === null ? [index] : []).every((move) => {
      board[move] = 'X'; const safe = explore(board, 'O'); board[move] = null;
      return safe;
    });
  };
  assert.equal(explore(Array(9).fill(null), 'X'), true);
});

test('computer validates random source and never mutates the caller board', () => {
  const board = Array(9).fill(null); const copy = [...board];
  assert.equal(typeof chooseTicTacToeMove(board, () => 0.99), 'number');
  assert.deepEqual(board, copy);
  assert.throws(() => chooseTicTacToeMove(board, () => 1), /Random source/u);
  assert.throws(() => ticTacToeResult([]), /nine-cell/u);
});
