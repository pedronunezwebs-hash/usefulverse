import assert from 'node:assert/strict';
import test from 'node:test';
import { chooseDotsAndBoxesBotMove, createDotsAndBoxesGame, listOpenDotsAndBoxesEdges, playDotsAndBoxesEdge } from './logic.mjs';

test('a box is awarded once and its player gets another turn', () => {
  let game = createDotsAndBoxesGame(2, 'two-player');
  game = playDotsAndBoxesEdge(game, 'h', 0, 0);
  game = playDotsAndBoxesEdge(game, 'v', 0, 0);
  game = playDotsAndBoxesEdge(game, 'h', 1, 0);
  assert.equal(game.currentPlayer, 1);
  game = playDotsAndBoxesEdge(game, 'v', 0, 1);
  assert.equal(game.scores[1], 1);
  assert.equal(game.boxes[0], 1);
  assert.equal(game.currentPlayer, 1);
  assert.throws(() => playDotsAndBoxesEdge(game, 'h', 0, 0), /already drawn/u);
  assert.equal(game.scores[1], 1);
});

test('non-scoring moves change turn; completing the last box ends the board', () => {
  let game = createDotsAndBoxesGame(2);
  game = playDotsAndBoxesEdge(game, 'h', 0, 0);
  assert.equal(game.currentPlayer, 1);
  game = playDotsAndBoxesEdge(game, 'v', 0, 0);
  game = playDotsAndBoxesEdge(game, 'h', 0, 1);
  game = playDotsAndBoxesEdge(game, 'v', 0, 2);
  assert.equal(game.scores[0] + game.scores[1], 0);
  assert.equal(listOpenDotsAndBoxesEdges(game).length, game.edges.length - game.moves);
});

test('a closing line can award two adjacent boxes but neither is double-counted', () => {
  let game = createDotsAndBoxesGame(2, 'two-player');
  for (const move of [
    ['h', 0, 0], ['h', 0, 1], ['h', 1, 0], ['v', 0, 0], ['v', 0, 2],
    ['h', 2, 0], ['h', 2, 1], ['v', 1, 0], ['v', 1, 2], ['v', 0, 1], ['v', 1, 1],
  ]) game = playDotsAndBoxesEdge(game, ...move);
  assert.equal(game.scores[game.currentPlayer], 2);
  assert.equal(game.boxes.filter((owner) => owner === game.currentPlayer).length, 2);
});

test('finishes with an explicit tie/winner and rejects invalid board sizes and moves', () => {
  assert.throws(() => createDotsAndBoxesGame(1), /2 to 7/u);
  assert.throws(() => createDotsAndBoxesGame(8), /2 to 7/u);
  let game = createDotsAndBoxesGame(2, 'two-player');
  for (let row = 0; row <= 2; row += 1) for (let col = 0; col < 2; col += 1) game = playDotsAndBoxesEdge(game, 'h', row, col);
  for (let row = 0; row < 2; row += 1) for (let col = 0; col <= 2; col += 1) game = playDotsAndBoxesEdge(game, 'v', row, col);
  assert.equal(game.gameOver, true);
  assert.equal(game.scores[0] + game.scores[1], 4);
  assert.ok(game.winner === 0 || game.winner === 1 || game.winner === 'tie');
  assert.throws(() => playDotsAndBoxesEdge(game, 'h', 0, 0), /already over/u);
  assert.throws(() => playDotsAndBoxesEdge(createDotsAndBoxesGame(2), 'v', 2, 0), /valid edge/u);
});

test('the local bot closes a box when available and can choose a legal safe move', () => {
  let game = createDotsAndBoxesGame(2);
  game = playDotsAndBoxesEdge(game, 'h', 0, 0);
  game = playDotsAndBoxesEdge(game, 'v', 0, 0);
  game = playDotsAndBoxesEdge(game, 'h', 1, 0);
  const move = chooseDotsAndBoxesBotMove(game, () => 0);
  assert.deepEqual(move, { orientation: 'v', row: 0, col: 1 });
  const next = playDotsAndBoxesEdge(game, move.orientation, move.row, move.col);
  assert.equal(next.scores[next.currentPlayer], 1);
  const safeGame = createDotsAndBoxesGame(2);
  const safe = chooseDotsAndBoxesBotMove(safeGame, () => 0);
  assert.ok(listOpenDotsAndBoxesEdges(safeGame).some(({ orientation, row, col }) => orientation === safe.orientation && row === safe.row && col === safe.col));
});
