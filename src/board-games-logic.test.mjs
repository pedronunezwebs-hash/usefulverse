import test from 'node:test';
import assert from 'node:assert/strict';
import { BLACK, createConnectFour, createReversi, dropConnectDisc, connectFourWinner, playReversiMove, reversiFlips, reversiLegalMoves, reversiTurnOutcome, RED } from './board-games-logic.mjs';

test('Connect Four drops to lowest empty cell, copies source and rejects full/invalid columns', () => {
  const board = createConnectFour(); const one = dropConnectDisc(board, 3, RED); const two = dropConnectDisc(one.board, 3, BLACK);
  assert.equal(one.row, 5); assert.equal(two.row, 4); assert.equal(board[31], 0); assert.equal(two.board[31], BLACK);
  assert.equal(dropConnectDisc(board, 7, RED), null);
  const full = Array.from({ length: 42 }, (_, i) => i % 2 ? RED : BLACK);
  assert.equal(dropConnectDisc(full, 0, RED), null);
});

test('Connect Four detects horizontal, vertical and both diagonal wins only', () => {
  const fixtures = [
    [[35, 36, 37, 38]], [[0, 7, 14, 21]], [[28, 22, 16, 10]], [[31, 25, 19, 13]],
  ];
  for (const [indices] of fixtures) { const board = createConnectFour(); indices.forEach((i) => { board[i] = RED; }); assert.equal(connectFourWinner(board), RED); }
  assert.equal(connectFourWinner(createConnectFour()), 0);
});

test('Reversi starts with four center discs and four legal moves for either player', () => {
  const board = createReversi(); assert.equal(board.filter(Boolean).length, 4);
  assert.equal(reversiLegalMoves(board, RED).length, 4); assert.equal(reversiLegalMoves(board, BLACK).length, 4);
});

test('Reversi move flips every bracketed line and preserves the source board', () => {
  const board = createReversi(); const move = playReversiMove(board, 2, 3, RED);
  assert.ok(move); assert.equal(move.flips.length, 1); assert.equal(move.board[27], RED); assert.deepEqual(board, createReversi());
  assert.equal(move.red, 4); assert.equal(move.black, 1); assert.equal(move.nextPlayer, BLACK);
  assert.equal(reversiFlips(board, 0, 0, RED).length, 0);
});

test('Reversi refuses illegal/occupied cells and does not mutate the input', () => {
  const board = createReversi(); assert.equal(playReversiMove(board, 3, 3, RED), null); assert.equal(playReversiMove(board, -1, 0, RED), null);
  assert.equal(board.filter(Boolean).length, 4);
});

test('Reversi outcome distinguishes a normal turn, a forced pass, and game end', () => {
  const start = createReversi();
  assert.deepEqual(reversiTurnOutcome(start, RED), { kind: 'turn', player: BLACK, red: 2, black: 2, winner: 0 });
  assert.equal(reversiTurnOutcome(start, RED, RED), null);

  let seed = 0x51d0; const random = (max) => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed % max; };
  let sawPass = false; let sawFinished = false;
  for (let game = 0; game < 100 && (!sawPass || !sawFinished); game += 1) {
    let board = createReversi(); let player = RED;
    for (let ply = 0; ply < 64; ply += 1) {
      const moves = reversiLegalMoves(board, player);
      if (!moves.length) break;
      const index = moves[random(moves.length)]; const move = playReversiMove(board, Math.floor(index / 8), index % 8, player);
      board = move.board;
      const outcome = reversiTurnOutcome(board, player, move.nextPlayer);
      if (outcome.kind === 'pass') sawPass = true;
      if (outcome.kind === 'finished') { sawFinished = true; break; }
      player = outcome.player;
    }
  }
  assert.ok(sawPass, 'fixed-seed random legal games should cover forced pass');
  assert.ok(sawFinished, 'fixed-seed random legal games should cover game over');
  assert.deepEqual(reversiTurnOutcome(Array(64).fill(RED), RED), { kind: 'finished', player: null, red: 64, black: 0, winner: RED });
});
