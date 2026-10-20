import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPoolGame,
  createPoolRack,
  isPoolCuePlacementValid,
  resolvePoolShot,
  shootCueBall,
  simulatePoolStep,
  TABLE,
} from './logic.mjs';

test('rack contains a cue ball and all fifteen numbered object balls', () => {
  const balls = createPoolRack();
  assert.equal(balls.length, 16);
  assert.deepEqual(balls.slice(1).map(({ id }) => id).sort((a, b) => a - b), Array.from({ length: 15 }, (_, index) => index + 1));
  assert.equal(balls.find(({ id }) => id === 8).kind, 'eight');
});

test('cue placement rejects invalid coordinates, pockets and occupied positions', () => {
  const balls = createPoolRack();
  assert.equal(isPoolCuePlacementValid(balls, 220, 250), true);
  assert.equal(isPoolCuePlacementValid(balls, 0, 250), false);
  assert.equal(isPoolCuePlacementValid(balls, 12, 12), false);
  assert.equal(isPoolCuePlacementValid(balls, balls[1].x, balls[1].y), false);
  assert.equal(isPoolCuePlacementValid(balls, NaN, 100), false);
});

test('shot resolution assigns groups, switches after fouls and applies the 8-ball win condition', () => {
  const game = createPoolGame();
  const assignment = resolvePoolShot(game, { firstContactKind: 'solid', pocketed: [{ id: 3, kind: 'solid' }], railAfterContact: false, cueScratch: false });
  assert.equal(assignment.assigned, true);
  assert.deepEqual(game.groups, ['solid', 'stripe']);
  assert.equal(game.turn, 0);

  const foulGame = createPoolGame();
  const foul = resolvePoolShot(foulGame, { firstContactKind: null, pocketed: [], railAfterContact: false, cueScratch: false });
  assert.equal(foul.kind, 'foul');
  assert.equal(foulGame.ballInHand, true);
  assert.equal(foulGame.turn, 1);

  const clearTable = createPoolGame();
  clearTable.groups = ['solid', 'stripe'];
  clearTable.balls = clearTable.balls.filter(({ kind }) => kind !== 'solid');
  const win = resolvePoolShot(clearTable, { firstContactKind: 'solid', pocketed: [{ id: 8, kind: 'eight' }], railAfterContact: false, cueScratch: false });
  assert.equal(win.kind, 'win');
  assert.equal(clearTable.winner, 0);

  const premature = createPoolGame();
  premature.groups = ['solid', 'stripe'];
  const loss = resolvePoolShot(premature, { firstContactKind: 'solid', pocketed: [{ id: 8, kind: 'eight' }], railAfterContact: false, cueScratch: false });
  assert.equal(loss.kind, 'loss');
});

test('shooting normalizes direction and caps force; physics bounds frame time', () => {
  const balls = createPoolRack();
  assert.equal(shootCueBall(balls, 3, 4, 900), true);
  const cue = balls[0];
  assert.ok(Math.abs(cue.vx - 510) < 1e-9);
  assert.ok(Math.abs(cue.vy - 680) < 1e-9);
  const x = cue.x;
  simulatePoolStep(balls, 1, null);
  assert.ok(cue.x > x);
  assert.ok(TABLE.width > 0);
});
