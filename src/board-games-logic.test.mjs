import test from 'node:test';
import assert from 'node:assert/strict';
import { BLACK, createConnectFour, createReversi, createCheckers, checkersLegalMoves, playCheckersMove, dropConnectDisc, connectFourWinner, playReversiMove, reversiFlips, reversiLegalMoves, reversiTurnOutcome, RED } from './board-games-logic.mjs';

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

test('Checkers starts with the standard 24 pieces and seven legal opening moves per side', () => {
  const board = createCheckers();
  assert.equal(board.filter((piece) => piece === RED).length, 12);
  assert.equal(board.filter((piece) => piece === BLACK).length, 12);
  assert.equal(checkersLegalMoves(board, RED).length, 7);
  assert.equal(checkersLegalMoves(board, BLACK).length, 7);
  assert.equal(checkersLegalMoves(board, RED).every((move) => move.capture === null), true);
});

test('Checkers makes captures compulsory and forces multi-jumps with the same piece', () => {
  const board = Array(64).fill(0); board[40] = RED; board[49] = RED; board[33] = BLACK; board[19] = BLACK;
  const legal = checkersLegalMoves(board, RED);
  assert.deepEqual(legal, [{ from: 40, to: 26, capture: 33 }]);
  const first = playCheckersMove(board, 40, 26, RED);
  assert.ok(first); assert.equal(first.continuation, true); assert.equal(first.nextPlayer, RED);
  assert.equal(first.board[33], 0); assert.equal(first.board[19], BLACK); assert.equal(board[40], RED);
  assert.deepEqual(checkersLegalMoves(first.board, RED, 26), [{ from: 26, to: 12, capture: 19 }]);
  const second = playCheckersMove(first.board, 26, 12, RED, 26);
  assert.ok(second); assert.equal(second.continuation, false); assert.equal(second.nextPlayer, BLACK);
  assert.equal(second.board[12], RED); assert.equal(second.board[19], 0);
  assert.equal(playCheckersMove(first.board, 49, 40, RED), null);
});

test('Checkers crowns men, kings move backwards, and crowning ends the turn', () => {
  const board = Array(64).fill(0); board[10] = RED; board[19] = BLACK; board[5] = BLACK;
  const crowned = playCheckersMove(board, 10, 1, RED);
  assert.ok(crowned); assert.equal(crowned.promoted, true); assert.equal(crowned.board[1], RED + 2);
  assert.equal(crowned.nextPlayer, BLACK); assert.equal(crowned.continuation, false);
  const kingMoves = checkersLegalMoves(crowned.board, RED);
  assert.ok(kingMoves.some((move) => move.from === 1 && move.to === 8));
  assert.ok(kingMoves.some((move) => move.from === 1 && move.to === 10));
});

test('Checkers rejects invalid turns, occupied destinations and impossible board positions', () => {
  const board = createCheckers();
  assert.equal(checkersLegalMoves([], RED).length, 0);
  assert.equal(checkersLegalMoves(board, 3).length, 0);
  assert.equal(playCheckersMove(board, 49, 40, BLACK), null);
  assert.equal(playCheckersMove(board, 49, 41, RED), null);
  assert.equal(playCheckersMove(board, -1, 40, RED), null);
});

test('Checkers ends when the next player has no legal move', () => {
  const board = Array(64).fill(0); board[40] = RED; board[33] = BLACK;
  const result = playCheckersMove(board, 40, 26, RED);
  assert.ok(result); assert.equal(result.winner, RED); assert.equal(result.nextPlayer, BLACK);
});
