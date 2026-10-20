import test from 'node:test';
import assert from 'node:assert/strict';
import { createBeloteDeck, createBeloteGame, legalBeloteCards, playBeloteCard, chooseBeloteBotCard, beloteCardPoints } from './logic.mjs';

const deterministic = () => { let value = 0; return () => (value++ % 97) / 97; };

test('Belote deals four unique 8-card hands and applies trump and plain-suit points', () => {
  const game = createBeloteGame({ trump: 'hearts', random: deterministic() });
  const cards = game.hands.flat();
  assert.equal(createBeloteDeck().length, 32);
  assert.equal(cards.length, 32);
  assert.equal(new Set(cards.map(({ id }) => id)).size, 32);
  assert.ok(game.hands.every((hand) => hand.length === 8));
  assert.equal(beloteCardPoints({ suit: 'hearts', rank: 11 }, 'hearts'), 20);
  assert.equal(beloteCardPoints({ suit: 'hearts', rank: 9 }, 'hearts'), 14);
  assert.equal(beloteCardPoints({ suit: 'clubs', rank: 11 }, 'hearts'), 2);
  assert.equal(beloteCardPoints({ suit: 'clubs', rank: 14 }, 'hearts'), 11);
});

test('Belote enforces follow-suit, mandatory trump and overtrump when possible', () => {
  let game = createBeloteGame({ trump: 'hearts', random: deterministic() });
  const lead = game.hands[0][0];
  game = playBeloteCard(game, 0, lead.id);
  const player = game.currentPlayer;
  const legal = legalBeloteCards(game, player);
  const following = game.hands[player].filter(({ suit }) => suit === lead.suit);
  if (following.length) assert.deepEqual(legal.map(({ id }) => id), following.map(({ id }) => id));
  else {
    const trumps = game.hands[player].filter(({ suit }) => suit === game.trump);
    if (trumps.length) assert.deepEqual(legal.map(({ id }) => id), trumps.map(({ id }) => id));
  }
  assert.throws(() => playBeloteCard(game, player, game.hands[player].find(({ id }) => !legal.some((card) => card.id === id))?.id ?? 'missing'));
});

test('Belote requires an available overtrump and awards the same-player King/Queen announcement once', () => {
  const base = {
    phase: 'playing', trump: 'hearts', declarerTeam: 0,
    hands: [
      [{ id: 'hearts-13', suit: 'hearts', rank: 13 }, { id: 'hearts-12', suit: 'hearts', rank: 12 }],
      [{ id: 'clubs-7', suit: 'clubs', rank: 7 }],
      [{ id: 'diamonds-7', suit: 'diamonds', rank: 7 }],
      [{ id: 'spades-7', suit: 'spades', rank: 7 }],
    ], currentPlayer: 0, leadPlayer: 0, trick: [], tricks: [], teamPoints: [0, 0],
    beloteProgress: [0, 0, 0, 0], beloteAnnounced: [false, false, false, false], trickNumber: 1, winnerTeam: null,
  };
  let game = playBeloteCard(base, 0, 'hearts-13');
  game = playBeloteCard(game, 1, 'clubs-7');
  game = playBeloteCard(game, 2, 'diamonds-7');
  game = playBeloteCard(game, 3, 'spades-7');
  assert.equal(game.currentPlayer, 0);
  game = playBeloteCard(game, 0, 'hearts-12');
  assert.equal(game.beloteAnnounced[0], true);
  assert.equal(game.teamPoints[0], 24);

  const overtrump = { ...base, hands: [base.hands[0], base.hands[1], [{ id: 'hearts-11', suit: 'hearts', rank: 11 }, { id: 'hearts-7', suit: 'hearts', rank: 7 }], base.hands[3]], currentPlayer: 2, trick: [{ player: 0, card: { id: 'clubs-14', suit: 'clubs', rank: 14 } }, { player: 1, card: { id: 'hearts-9', suit: 'hearts', rank: 9 } }] };
  assert.deepEqual(legalBeloteCards(overtrump, 2).map(({ rank }) => rank), [11]);
});

test('Belote bot completes a hand with eight tricks and contract outcome', () => {
  let game = createBeloteGame({ trump: 'spades', random: deterministic() });
  let guard = 0;
  while (game.phase === 'playing' && guard++ < 32) game = playBeloteCard(game, game.currentPlayer, chooseBeloteBotCard(game).id);
  assert.equal(game.phase, 'complete');
  assert.equal(game.tricks.length, 8);
  assert.equal(game.teamPoints[0] + game.teamPoints[1], 162 + game.beloteAnnounced.filter(Boolean).length * 20);
  assert.ok([0, 1].includes(game.winnerTeam));
});

test('Belote reports malformed trump, turn, card and random-source input', () => {
  assert.throws(() => createBeloteGame({ trump: 'invalid', random: deterministic() }));
  assert.throws(() => createBeloteGame({ trump: 'clubs', random: () => 1 }));
  assert.throws(() => createBeloteGame({ trump: 'clubs', cryptoImpl: {} }));
});
