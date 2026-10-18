import test from 'node:test';
import assert from 'node:assert/strict';
import { bankFarkle, createFarkleGame, holdFarkleDice, playFarkleCpuTurn, rollFarkle, scoreFarkleDice } from './farkle.mjs';

test('fixed scoring table covers singles, triples, larger sets and six-dice combinations', () => {
  assert.equal(scoreFarkleDice([1]).score, 100);
  assert.equal(scoreFarkleDice([5]).score, 50);
  assert.equal(scoreFarkleDice([1, 1, 1]).score, 300);
  assert.equal(scoreFarkleDice([2, 2, 2]).score, 200);
  assert.equal(scoreFarkleDice([6, 6, 6, 6]).score, 1000);
  assert.equal(scoreFarkleDice([2, 2, 2, 2, 2]).score, 2000);
  assert.equal(scoreFarkleDice([3, 3, 3, 3, 3, 3]).score, 3000);
  assert.equal(scoreFarkleDice([1, 2, 3, 4, 5, 6]).score, 1500);
  assert.equal(scoreFarkleDice([1, 1, 2, 2, 3, 3]).score, 1500);
  assert.equal(scoreFarkleDice([4, 4, 4, 4, 2, 2]).score, 1500);
  assert.equal(scoreFarkleDice([2, 2, 2, 5, 5, 5]).score, 2500);
});

test('doubling table uses its own declared triple and larger-set values', () => {
  assert.equal(scoreFarkleDice([1, 1, 1], 'doubling').score, 1000);
  assert.equal(scoreFarkleDice([4, 4, 4], 'doubling').score, 400);
  assert.equal(scoreFarkleDice([4, 4, 4, 4], 'doubling').score, 800);
  assert.equal(scoreFarkleDice([1, 1, 1, 1, 1, 1], 'doubling').score, 8000);
  assert.throws(() => scoreFarkleDice([1], 'unknown'), /scoring table/u);
});

test('a seeded roll is reproducible and only scoring dice can be kept', () => {
  const first = rollFarkle(createFarkleGame({ seed: 42 }));
  const second = rollFarkle(createFarkleGame({ seed: 42 }));
  assert.deepEqual(first.dice, second.dice);
  assert.ok(scoreFarkleDice(first.dice).score > 0);
  const selectedIndex = first.dice.findIndex((face) => face === 1 || face === 5);
  const kept = holdFarkleDice(first, [selectedIndex]);
  assert.equal(kept.turnPoints, first.dice[selectedIndex] === 1 ? 100 : 50);
  assert.equal(kept.remainingDice, 5);
  assert.throws(() => holdFarkleDice(first, []), /Select one or more/u);
});

test('hot dice return all six dice and a Farkle loses only the unbanked turn points', () => {
  const base = createFarkleGame({ seed: 7, entryScore: 100 });
  const allScoring = Object.freeze({ ...base, dice: [1, 2, 3, 4, 5, 6] });
  const hot = holdFarkleDice(allScoring, [0, 1, 2, 3, 4, 5]);
  assert.equal(hot.lastOutcome, 'hotDice');
  assert.equal(hot.remainingDice, 6);
  assert.equal(rollFarkle(hot).dice.length, 6);
  const rolledFarkle = Array.from({ length: 5000 }, (_, seed) => rollFarkle(createFarkleGame({ seed: seed + 1, entryScore: 100 })) ).find((game) => game.lastOutcome === 'farkle');
  assert.ok(rolledFarkle);
  const heldScore = Object.freeze({ ...base, turnPoints: 200, players: [Object.freeze({ ...base.players[0], total: 500, opened: true }), base.players[1]] });
  const banked = bankFarkle(heldScore);
  assert.equal(banked.scoreSheet.at(-1).points, 200);
  assert.equal(banked.scoreSheet.at(-1).total, 700);
  assert.equal(rolledFarkle.turnPoints, 0);
  assert.equal(rolledFarkle.scoreSheet.at(-1).outcome, 'farkle');
});

test('CPU turns use the same legal engine and the score target ends the game', () => {
  const base = createFarkleGame({ seed: 9, names: ['CPU', 'You'], cpuPlayers: [true, false], targetScore: 1000, entryScore: 100 });
  const cpuNearTarget = Object.freeze({ ...base, players: [Object.freeze({ ...base.players[0], total: 900, opened: true }), base.players[1]] });
  const winningSeed = Array.from({ length: 100 }, (_, seed) => Object.freeze({ ...cpuNearTarget, seed: seed + 1, rngState: seed + 17 })).map(playFarkleCpuTurn).find(({ status }) => status === 'won');
  assert.ok(winningSeed);
  assert.equal(winningSeed.players[winningSeed.winner].total >= winningSeed.targetScore, true);
  const game = playFarkleCpuTurn(base);
  assert.equal(game.currentPlayer, 1);
  assert.equal(game.status, 'playing');
  assert.equal(game.players[1].cpu, false);
  assert.throws(() => playFarkleCpuTurn(game), /not the CPU turn/u);
  assert.throws(() => createFarkleGame({ entryScore: 1100, targetScore: 1000 }), /Invalid Farkle/u);
});
