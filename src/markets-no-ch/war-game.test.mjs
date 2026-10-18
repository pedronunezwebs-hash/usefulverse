import test from 'node:test';
import assert from 'node:assert/strict';
import { createWarDeck, createWarGame, warContinue, warFlip, warInventory } from './war-game.mjs';

const card = (id, rank, suit = 0) => ({ id, rank, suit });
function fixture(hands) {
  return {
    players: hands.map((pile, id) => ({ id, pile: [...pile], battlesWon: 0, eliminated: false })),
    sidelined: [], table: [], warParticipants: [], status: 'playing', winner: null,
    seed: 1, turns: 0, wars: 0, lastAction: 'dealt',
  };
}

test('creates a deterministic 52-card deck with four suits and no jokers', () => {
  const first = createWarDeck(27);
  assert.equal(first.length, 52);
  assert.deepEqual(createWarDeck(27), first);
  assert.equal(new Set(first.map(({ id }) => id)).size, 52);
  assert.deepEqual(new Set(first.map(({ rank }) => rank)), new Set(Array.from({ length: 13 }, (_, i) => i + 2)));
});

test('deals 2–4 players evenly and sets aside only the undealt card in a three-player game', () => {
  for (const seats of [2, 3, 4]) {
    const game = createWarGame({ seed: 5, players: seats });
    assert.ok(game.players.every(({ pile }) => pile.length === Math.floor(52 / seats)));
    assert.equal(game.sidelined.length, seats === 3 ? 1 : 0);
    assert.equal(warInventory(game), 52);
  }
  assert.throws(() => createWarGame({ players: 1 }), /2 to 4/u);
  assert.throws(() => createWarGame({ players: 5 }), /2 to 4/u);
});

test('highest face-up card takes the battle and all cards remain in play', () => {
  const game = fixture([[card('a1', 9), card('a2', 4)], [card('b1', 6), card('b2', 2)]]);
  warFlip(game);
  assert.equal(game.status, 'playing');
  assert.equal(game.players[0].pile.length, 3);
  assert.equal(game.players[1].pile.length, 1);
  assert.equal(game.players[0].pile.at(-1).id, 'b1');
  assert.equal(warInventory(game), 4);
});

test('a tie exposes one down and one up card from each tied player before settling', () => {
  const game = fixture([
    [card('a0', 7), card('a1', 3), card('a2', 13)],
    [card('b0', 7), card('b1', 14), card('b2', 2)],
  ]);
  warFlip(game);
  assert.equal(game.status, 'war');
  assert.equal(game.table.filter(({ faceUp }) => faceUp).length, 2);
  warContinue(game);
  assert.equal(game.status, 'complete');
  assert.equal(game.winner, 0);
  assert.equal(game.players[0].pile.length, 6);
  assert.equal(warInventory(game), 6);
});

test('equal war cards continue to a second down/up round', () => {
  const game = fixture([
    [card('a0', 9), card('a1', 2), card('a2', 8), card('a3', 4), card('a4', 14)],
    [card('b0', 9), card('b1', 3), card('b2', 8), card('b3', 5), card('b4', 2)],
  ]);
  warFlip(game);
  warContinue(game);
  assert.equal(game.status, 'war');
  warContinue(game);
  assert.equal(game.status, 'complete');
  assert.equal(game.winner, 0);
  assert.equal(game.table.length, 0);
  assert.equal(warInventory(game), 10);
});

test('three-player tie includes the third player in the Norwegian war round', () => {
  const game = fixture([
    [card('a0', 7), card('a1', 4), card('a2', 13)],
    [card('b0', 7), card('b1', 6), card('b2', 9)],
    [card('c0', 2), card('c1', 5), card('c2', 3)],
  ]);
  warFlip(game);
  assert.deepEqual(game.warParticipants, [0, 1, 2]);
  warContinue(game);
  assert.equal(game.status, 'complete');
  assert.equal(game.winner, 0);
  assert.equal(game.players[0].pile.length, 9);
  assert.equal(warInventory(game), 9);
});

test('a player without two cards loses the war and the remaining opponent collects all stakes', () => {
  const game = fixture([[card('a0', 8)], [card('b0', 8), card('b1', 4), card('b2', 12)]]);
  warFlip(game);
  assert.equal(game.status, 'war');
  warContinue(game);
  assert.equal(game.status, 'complete');
  assert.equal(game.winner, 1);
  assert.equal(game.players[1].pile.length, 4);
  assert.equal(game.players[0].eliminated, true);
  assert.equal(warInventory(game), 4);
});

test('rejects advancing while no flip or war decision is waiting', () => {
  const game = fixture([[card('a0', 7)], [card('b0', 7)]]);
  assert.throws(() => warContinue(game), /No war/u);
  warFlip(game);
  assert.throws(() => warFlip(game), /not waiting/u);
});

test('preserves every dealt card across repeated seeded 2–4 player games', () => {
  for (const seats of [2, 3, 4]) {
    for (let seed = 1; seed <= 20; seed += 1) {
      const game = createWarGame({ seed, players: seats });
      for (let action = 0; action < 400 && ['playing', 'war'].includes(game.status); action += 1) {
        if (game.status === 'playing') warFlip(game);
        else warContinue(game);
        assert.equal(warInventory(game), 52, `seed ${seed}, ${seats} players, action ${action}`);
      }
    }
  }
});
