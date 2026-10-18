import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceShutBoxRound, advanceShutBoxTurn, applyShutBoxSelection, chooseComputerShutBoxMove, createShutBoxGame, legalShutBoxCombinations, playComputerShutBoxTurn, rollShutBoxDice, SHUT_BOX_TILES, shutBoxDiceCount, toggleShutBoxTile } from './shut-the-box.mjs';

test('a total of seven can close tile 7 or the valid combination 3 + 4', () => {
  const moves = legalShutBoxCombinations(SHUT_BOX_TILES, 7);
  assert.ok(moves.some((move) => move.length === 1 && move[0] === 7));
  assert.ok(moves.some((move) => move.length === 2 && move.includes(3) && move.includes(4)));
  assert.ok(moves.every((move) => move.reduce((sum, tile) => sum + tile, 0) === 7));
});

test('dice variants are explicit and follow their stated switch points', () => {
  assert.equal(shutBoxDiceCount(SHUT_BOX_TILES, 'two-dice'), 2);
  assert.equal(shutBoxDiceCount([1, 2, 3, 4, 5, 6], 'one-after-high'), 1);
  assert.equal(shutBoxDiceCount([1, 2, 3, 4, 5, 6, 7], 'one-after-high'), 2);
  assert.equal(shutBoxDiceCount([1, 2, 3], 'one-when-sum-six'), 1);
  assert.equal(shutBoxDiceCount([1, 2, 4], 'one-when-sum-six'), 2);
});

test('illegal tile totals are rejected and a valid selection keeps the turn rolling', () => {
  let game = createShutBoxGame({ seed: 7 });
  game = rollShutBoxDice(game, [3, 4]);
  assert.throws(() => applyShutBoxSelection(game, [3, 3, 1]), /distinct/u);
  assert.throws(() => applyShutBoxSelection(game, [2, 4]), /equal the dice/u);
  game = toggleShutBoxTile(game, 3);
  game = toggleShutBoxTile(game, 4);
  game = applyShutBoxSelection(game);
  assert.equal(game.stage, 'rolling');
  assert.deepEqual(game.players[0].open, [1, 2, 5, 6, 7, 8, 9]);
  assert.equal(game.players[0].scores.length, 0);
});

test('a roll with no legal combination ends the turn and scores remaining tiles', () => {
  let game = createShutBoxGame({ seed: 2, diceRule: 'two-dice' });
  game = Object.freeze({ ...game, players: Object.freeze([Object.freeze({ ...game.players[0], open: Object.freeze([1, 2, 3]) })]) });
  game = rollShutBoxDice(game, [6, 6]);
  assert.equal(game.stage, 'turn-complete');
  assert.equal(game.turnScore, 6);
  assert.deepEqual(game.players[0].scores, [6]);
  assert.equal(advanceShutBoxTurn(game).stage, 'round-complete');
});

test('closing all tiles shuts the box and immediately awards the round', () => {
  let game = createShutBoxGame({ seed: 3, diceRule: 'two-dice' });
  game = Object.freeze({ ...game, players: Object.freeze([Object.freeze({ ...game.players[0], open: Object.freeze([1, 2]) })]) });
  game = rollShutBoxDice(game, [1, 2]);
  game = applyShutBoxSelection(game, [1, 2]);
  assert.equal(game.stage, 'round-complete');
  assert.equal(game.winner, 0);
  assert.equal(game.players[0].scores.at(-1), 0);
});

test('computer moves are legal, turn stays local, and round settings reset the board', () => {
  const move = chooseComputerShutBoxMove(SHUT_BOX_TILES, 7);
  assert.ok(legalShutBoxCombinations(SHUT_BOX_TILES, 7).some((candidate) => candidate.join(',') === move.join(',')));
  let game = createShutBoxGame({ mode: 'computer', rounds: 3, seed: 11 });
  game = rollShutBoxDice(game, [1, 2]);
  game = applyShutBoxSelection(game, [3]);
  game = Object.freeze({ ...game, stage: 'turn-complete', players: Object.freeze(game.players.map((player, index) => index === 0 ? Object.freeze({ ...player, scores: Object.freeze([42]) }) : player)) });
  game = advanceShutBoxTurn(game);
  assert.equal(game.activePlayer, 1);
  game = playComputerShutBoxTurn(game);
  assert.equal(game.stage, 'turn-complete');
  game = advanceShutBoxTurn(game);
  assert.equal(game.stage, 'round-complete');
  game = advanceShutBoxRound(game);
  assert.equal(game.round, 2);
  assert.deepEqual(game.players[0].open, SHUT_BOX_TILES);
  assert.deepEqual(game.players[0].scores, [42]);
});

test('game setup rejects unsupported modes, dice rules, rounds, and dice values', () => {
  assert.throws(() => createShutBoxGame({ mode: 'betting' }), /solo practice/u);
  assert.throws(() => createShutBoxGame({ diceRule: 'three-dice' }), /dice rule/u);
  assert.throws(() => createShutBoxGame({ rounds: 2 }), /1, 3, or 5/u);
  assert.throws(() => rollShutBoxDice(createShutBoxGame(), [0, 7]), /six-sided/u);
});
