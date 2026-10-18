import test from 'node:test';
import assert from 'node:assert/strict';
import { BRICK_FIELD, createBrickGame, createBrickLayout, launchBrickGame, movePaddle, nextBrickLevel, tickBrickGame } from './brick-breaker.mjs';

test('creates original levels with bounded rows and meaningful brick durability', () => {
  assert.equal(createBrickLayout(1).length, 14);
  assert.ok(createBrickLayout(2).length > createBrickLayout(1).length);
  assert.ok(createBrickLayout(7).every(({ hits, x, y }) => hits >= 1 && x >= 0 && y >= 0));
  assert.ok(createBrickLayout(4).length <= 35);
});

test('starts in ready state and paddle stays fully inside the court', () => {
  const game = createBrickGame({ seed: 17 });
  assert.equal(game.status, 'ready');
  assert.equal(game.lives, 3);
  assert.equal(movePaddle(game, -100).paddle.x, game.paddle.width / 2);
  assert.equal(movePaddle(game, 900).paddle.x, BRICK_FIELD.width - game.paddle.width / 2);
  assert.equal(launchBrickGame(game).status, 'playing');
});

test('bounces off the left wall without tunneling past the field', () => {
  const initial = createBrickGame();
  const game = { ...initial, status: 'playing', bricks: [], ball: { x: 8, y: 480, vx: -160, vy: -30, radius: 7 } };
  const next = tickBrickGame(game, 1 / 60);
  assert.ok(next.ball.x >= next.ball.radius);
  assert.ok(next.ball.vx > 0);
});

test('resolves a brick corner contact and removes a cleared brick exactly once', () => {
  const initial = createBrickGame();
  const game = { ...initial, status: 'playing', bricks: [{ id: 'corner', x: 100, y: 100, width: 48, height: 18, hits: 1, maxHits: 1 }], ball: { x: 96, y: 96, vx: 30, vy: 30, radius: 7 } };
  const next = tickBrickGame(game, 1 / 60);
  assert.equal(next.score, 10);
  assert.equal(next.bricks.length, 0);
  assert.ok(next.ball.vy < 0);
  assert.equal(next.status, 'levelComplete');
});

test('still detects bricks at the maximum simulated speed and frame step', () => {
  const initial = createBrickGame({ level: 20 });
  const game = { ...initial, status: 'playing', bricks: [{ id: 'fast', x: 186, y: 100, width: 48, height: 18, hits: 1, maxHits: 1 }], ball: { x: 210, y: 130, vx: 0, vy: -310, radius: 7 } };
  const next = tickBrickGame(game, 1 / 30);
  assert.equal(next.score, 10);
  assert.equal(next.bricks.length, 0);
  assert.ok(next.ball.vy > 0);
});

test('a missed ball consumes one life and resets ready for the next serve', () => {
  const initial = createBrickGame();
  const game = { ...initial, status: 'playing', ball: { x: 20, y: 525, vx: 0, vy: 250, radius: 7 } };
  const next = tickBrickGame(game, 1 / 60);
  assert.equal(next.lives, 2);
  assert.equal(next.status, 'ready');
});

test('the last life ends the game and persists the best score in state', () => {
  const initial = createBrickGame({ best: 40 });
  const game = { ...initial, status: 'playing', lives: 1, score: 70, ball: { x: 20, y: 525, vx: 0, vy: 250, radius: 7 } };
  const next = tickBrickGame(game, 1 / 60);
  assert.equal(next.status, 'lost');
  assert.equal(next.lives, 0);
  assert.equal(next.best, 70);
});

test('clearing all bricks completes the level; only a completed level advances', () => {
  const initial = createBrickGame();
  const game = { ...initial, status: 'playing', bricks: [{ x: 200, y: 100, width: 48, height: 18, hits: 1, maxHits: 1 }], ball: { x: 224, y: 118, vx: 0, vy: -20, radius: 7 } };
  const complete = tickBrickGame(game, 1 / 60);
  assert.equal(complete.status, 'levelComplete');
  assert.equal(nextBrickLevel(complete).level, 2);
  assert.equal(nextBrickLevel(game), game);
});

test('game steps ignore invalid and non-playing states', () => {
  const game = createBrickGame();
  assert.equal(tickBrickGame(game, 1 / 60), game);
  const playing = launchBrickGame(game);
  assert.equal(tickBrickGame(playing, -1), playing);
});
