import test from 'node:test';
import assert from 'node:assert/strict';
import { BATTLESHIP_FLEET, BATTLESHIP_SIZE, createBattleshipFleet, createBattleshipGame, fireBattleshipShot, playBattleshipTurn } from './battleship-logic.mjs';

function seeded(seed = 3819) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0x1_0000_0000; };
}

test('random fleet contains each ship length exactly once, without overlap or out-of-board cells', () => {
  for (let iteration = 0; iteration < 40; iteration += 1) {
    const board = createBattleshipFleet(seeded(iteration + 1));
    assert.equal(board.length, BATTLESHIP_SIZE ** 2);
    assert.deepEqual([...new Set(board.filter(Boolean))].sort(), [1, 2, 3]);
    assert.deepEqual([1, 2, 3].map((id) => board.filter((cell) => cell === id).length), BATTLESHIP_FLEET);
    for (const id of [1, 2, 3]) {
      const cells = board.flatMap((cell, index) => cell === id ? [index] : []);
      const rows = cells.map((index) => Math.floor(index / BATTLESHIP_SIZE)); const columns = cells.map((index) => index % BATTLESHIP_SIZE);
      assert.ok(new Set(rows).size === 1 || new Set(columns).size === 1, `ship ${id} must be straight`);
      assert.deepEqual([...cells].sort((a, b) => a - b).filter((index, position, ordered) => position === 0 || index !== ordered[position - 1]).length, BATTLESHIP_FLEET[id - 1]);
    }
  }
});

test('shots distinguish misses, hits, duplicate attempts, sinking and fleet completion', () => {
  const fleet = Array(BATTLESHIP_SIZE ** 2).fill(0); fleet[0] = 1; fleet[1] = 1;
  const emptyShots = Array(fleet.length).fill(0);
  const miss = fireBattleshipShot(fleet, emptyShots, 7);
  assert.equal(miss.hit, false); assert.equal(miss.shots[7], -1); assert.equal(emptyShots[7], 0);
  const hit = fireBattleshipShot(fleet, miss.shots, 0); assert.equal(hit.hit, true); assert.equal(hit.sunk.length, 0);
  assert.equal(fireBattleshipShot(fleet, hit.shots, 0), null);
  const sunk = fireBattleshipShot(fleet, hit.shots, 1); assert.deepEqual(sunk.sunk, [1]); assert.equal(sunk.allSunk, true);
  assert.equal(fireBattleshipShot(fleet, emptyShots, 64), null);
});

test('a sunk ship is reported only on the shot that sinks it', () => {
  const fleet = Array(BATTLESHIP_SIZE ** 2).fill(0); fleet[0] = 1; fleet[1] = 1; fleet[2] = 2;
  let shots = Array(fleet.length).fill(0);
  const first = fireBattleshipShot(fleet, shots, 0); shots = first.shots;
  const second = fireBattleshipShot(fleet, shots, 1); shots = second.shots;
  assert.deepEqual(second.sunk, [1]); assert.equal(second.allSunk, false);
  const third = fireBattleshipShot(fleet, shots, 2);
  assert.deepEqual(third.sunk, [2]); assert.equal(third.allSunk, true);
});

test('turns alternate with one untried computer shot and stop immediately at a win', () => {
  const game = createBattleshipGame(seeded());
  const result = playBattleshipTurn(game, 0, seeded(99));
  assert.ok(result); assert.equal(result.game.turns, 1); assert.equal(result.enemyShot.index >= 0, true);
  assert.equal(game.playerShots[0], 0); assert.equal(game.enemyShots[result.enemyShot.index], 0);
  assert.equal(playBattleshipTurn(result.game, 0, seeded()), null);

  let current = game; let final;
  for (let index = 0; index < current.enemyFleet.length && !current.over; index += 1) {
    if (current.enemyFleet[index] === 0 || current.playerShots[index] !== 0) continue;
    final = playBattleshipTurn(current, index, seeded(index + 100)); current = final.game;
  }
  assert.equal(current.over, true); assert.equal(current.winner, 'player'); assert.equal(final.enemyShot, null);
  assert.equal(playBattleshipTurn(current, 63, seeded()), null);
});

test('the computer can win by sinking the full player fleet', () => {
  const game = createBattleshipGame(seeded());
  const playerFleet = Array(BATTLESHIP_SIZE ** 2).fill(0); playerFleet[0] = 1;
  const enemyFleet = Array(BATTLESHIP_SIZE ** 2).fill(0); enemyFleet[63] = 1;
  const state = { ...game, playerFleet, enemyFleet };
  const result = playBattleshipTurn(state, 0, () => 0);
  assert.equal(result.game.over, true); assert.equal(result.game.winner, 'computer');
  assert.equal(result.enemyShot.index, 0); assert.equal(result.enemyShot.hit, true);
});
