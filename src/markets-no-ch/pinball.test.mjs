import test from 'node:test';
import assert from 'node:assert/strict';
import { createPinballGame, drainPinballBall, launchPinballBall, setPinballControls, stepPinballGame, togglePinballPause } from './pinball.mjs';

test('pinball starts locally with three balls and a deterministic seed', () => {
  const a = createPinballGame({ seed: 37 }); const b = createPinballGame({ seed: 37 });
  assert.deepEqual(a, b);
  assert.equal(a.status, 'ready'); assert.equal(a.ballsRemaining, 3); assert.equal(a.score, 0);
  assert.throws(() => createPinballGame({ seed: NaN }), /integer/u);
});

test('launch is user initiated and reproducible', () => {
  const a = launchPinballBall(createPinballGame({ seed: 90 })); const b = launchPinballBall(createPinballGame({ seed: 90 }));
  assert.deepEqual(a, b); assert.equal(a.status, 'playing'); assert.ok(a.ball.vy < -600);
  assert.throws(() => launchPinballBall(a), /cannot be launched/u);
});

test('fixed-step simulation stays deterministic and respects its input bound', () => {
  const start = launchPinballBall(createPinballGame({ seed: 8 }));
  assert.deepEqual(stepPinballGame(start, 120), stepPinballGame(launchPinballBall(createPinballGame({ seed: 8 })), 120));
  assert.equal(stepPinballGame(start, 0), start);
  assert.throws(() => stepPinballGame(start, 241), /0 to 240/u);
});

test('pause freezes motion and clears held flipper controls', () => {
  let game = launchPinballBall(createPinballGame());
  game = setPinballControls(game, { left: true, right: true });
  game = togglePinballPause(game);
  assert.equal(game.status, 'paused'); assert.deepEqual(game.controls, { left: false, right: false });
  const frozen = stepPinballGame(game, 60); assert.equal(frozen, game);
  assert.equal(togglePinballPause(game).status, 'playing');
});

test('three drained balls end a round and restarting starts with three', () => {
  let game = launchPinballBall(createPinballGame({ seed: 1 }));
  game = drainPinballBall(game); assert.equal(game.status, 'ballLost'); assert.equal(game.ballsRemaining, 2);
  game = launchPinballBall(game); game = drainPinballBall(game);
  game = launchPinballBall(game); game = drainPinballBall(game);
  assert.equal(game.status, 'gameOver'); assert.equal(game.ballsRemaining, 0);
  const fresh = createPinballGame({ seed: 1 }); assert.equal(fresh.status, 'ready'); assert.equal(fresh.ballsRemaining, 3);
});

test('bumper collision awards points and repositions the ball outside its collider', () => {
  const launched = launchPinballBall(createPinballGame());
  const near = Object.freeze({ ...launched, ball: Object.freeze({ x: 110, y: 145, vx: -100, vy: 0 }) });
  const next = stepPinballGame(near);
  assert.ok(next.score >= 100);
  assert.ok(Math.hypot(next.ball.x - 110, next.ball.y - 145) > 32);
  assert.match(next.lastHit, /bumper/u);
});

test('flipper control state accepts both sides and rejects invalid values', () => {
  let game = launchPinballBall(createPinballGame());
  game = setPinballControls(game, { left: true }); assert.equal(game.controls.left, true); assert.equal(game.controls.right, false);
  game = setPinballControls(game, { right: true }); assert.equal(game.controls.right, true);
  assert.throws(() => setPinballControls(game, { left: 1 }), /boolean/u);
});
