import test from 'node:test';
import assert from 'node:assert/strict';
import { createGoGame, getGoGroup, passGoTurn, playGoMove, scoreGoArea } from './go-game-logic.mjs';

test('creates supported empty Go boards and rejects unsupported dimensions', () => {
  for (const size of [5, 9, 13, 19]) assert.equal(createGoGame(size).board.length, size * size);
  assert.throws(() => createGoGame(8), RangeError);
});

test('captures a surrounded opposing stone and records it for the capturing player', () => {
  let game = createGoGame(5);
  for (const [index, color] of [[11,'B'],[12,'W'],[13,'B'],[0,'W'],[7,'B'],[1,'W']]) {
    assert.equal(game.turn, color);
    game = playGoMove(game, index).game;
  }
  const result = playGoMove(game, 17);
  assert.equal(result.status, 'capture');
  assert.equal(result.captured, 1);
  assert.equal(result.game.board[12], null);
  assert.equal(result.game.captures.B, 1);
});

test('rejects occupied, suicide and repeated positions without mutating the original game', () => {
  let game = createGoGame(5);
  for (const [index, color] of [[1,'B'],[0,'W'],[5,'B'],[10,'W'],[6,'B']]) game = playGoMove(game, index).game;
  const occupied = playGoMove(game, 6);
  assert.equal(occupied.status, 'occupied');
  let setup = createGoGame(5);
  for (const [index, color] of [[1,'B'],[24,'W'],[5,'B'],[23,'W'],[7,'B'],[22,'W'],[11,'B']]) {
    assert.equal(setup.turn, color);
    setup = playGoMove(setup, index).game;
  }
  // White now has no liberty at the central point (6); four black stones surround it.
  const before = setup;
  const suicide = playGoMove(setup, 6);
  assert.equal(suicide.status, 'suicide');
  assert.equal(suicide.game, before);
  assert.equal(getGoGroup(before.board, 1, 5).liberties.size > 0, true);

  const empty = createGoGame(5);
  const repeatedPosition = Array(25).fill('.'); repeatedPosition[0] = 'B';
  const repeated = { ...empty, history: [...empty.history, repeatedPosition.join('')] };
  assert.equal(playGoMove(repeated, 0).status, 'repeat');
});

test('two consecutive passes finish the game and area scoring counts surrounded empty regions', () => {
  let game = createGoGame(5);
  for (const index of [1, 0, 5, 20]) game = playGoMove(game, index).game;
  const first = passGoTurn(game); assert.equal(first.status, 'passed'); assert.equal(first.game.finished, false);
  const second = passGoTurn(first.game); assert.equal(second.status, 'finished'); assert.equal(second.game.finished, true);
  assert.ok(second.score.B > 0 && second.score.W > 0);
  assert.deepEqual(scoreGoArea(Array(25).fill(null), 5), { B: 0, W: 0 });
  assert.throws(() => passGoTurn(second.game), /ended/u);
});
