import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CANASTA_HAND_SIZE, CANASTA_TARGET_SCORE, canastaCardCount, canastaMeldPoints, createCanastaDeck,
  createCanastaGame, discardCanastaCard, drawCanastaStock, legalCanastaMeld, openingMeldRequirement,
  playCanastaMeld, takeCanastaDiscardPile,
} from './canasta-game.mjs';

const card = (id, rank, suit = 0, pack = 0) => ({ id, rank, suit, pack });
const meldFixture = ({ rank = 12, hand = [], scores = [0, 0], wildOnMeld = false } = {}) => {
  const game = createCanastaGame({ seed: 12, scores });
  game.phase = 'meld';
  game.hands[0] = hand;
  game.melds[0] = wildOnMeld ? [{ rank, cards: [card(900, rank), card(901, rank), card(902, 0)] }] : [];
  return game;
};

test('two shuffled packs contain 108 unique cards and deal 15 to each player', () => {
  const a = createCanastaDeck(101);
  const b = createCanastaDeck(101);
  assert.equal(a.length, 108);
  assert.equal(new Set(a.map(({ id }) => id)).size, 108);
  assert.deepEqual(a, b);
  const game = createCanastaGame({ seed: 101 });
  assert.equal(game.hands[0].length, CANASTA_HAND_SIZE);
  assert.equal(game.hands[1].length, CANASTA_HAND_SIZE);
  assert.equal(canastaCardCount(game), 108);
  assert.equal(game.stock.length + game.discard.length, 77);
});

test('opening thresholds follow cumulative score bands', () => {
  assert.equal(openingMeldRequirement(0), 50);
  assert.equal(openingMeldRequirement(1495), 50);
  assert.equal(openingMeldRequirement(1500), 90);
  assert.equal(openingMeldRequirement(2995), 90);
  assert.equal(openingMeldRequirement(3000), 120);
  assert.equal(openingMeldRequirement(5000), 150);
});

test('natural melds are valid; wrong rank, too few naturals and excess wild cards are rejected', () => {
  const game = meldFixture({ rank: 12, hand: [card(1, 12), card(2, 12, 1), card(3, 12, 2), card(4, 0), card(5, 10)] });
  assert.equal(legalCanastaMeld(game, 0, 12, [1, 2, 3]), true);
  assert.equal(legalCanastaMeld(game, 0, 11, [1, 2, 3]), false);
  assert.equal(legalCanastaMeld(game, 0, 12, [1, 2, 4]), true);
  game.hands[0] = [card(1, 12), card(2, 0), card(3, 13)];
  assert.equal(legalCanastaMeld(game, 0, 12, [1, 2, 3]), false);
});

test('opening must meet its points and an already opened rank can be extended', () => {
  const below = meldFixture({ rank: 2, hand: [card(1, 2), card(2, 2, 1), card(3, 2, 2)] });
  assert.equal(legalCanastaMeld(below, 0, 2, [1, 2, 3]), false);
  const high = meldFixture({ rank: 12, hand: [card(1, 12), card(2, 12, 1), card(3, 12, 2)], scores: [1500, 0] });
  assert.equal(legalCanastaMeld(high, 0, 12, [1, 2, 3]), false);
  high.melds[0] = [{ rank: 8, cards: [card(10, 8), card(11, 8), card(12, 8)] }];
  high.hands[0].push(card(4, 8, 3));
  assert.equal(legalCanastaMeld(high, 0, 8, [4]), true);
});

test('a natural seven-card meld scores a clean 500-point bonus; wild meld scores 300', () => {
  const clean = { rank: 12, cards: Array.from({ length: 7 }, (_, index) => card(index, 12, index % 4, Math.floor(index / 4))) };
  const mixed = { rank: 12, cards: [...clean.cards.slice(0, 6), card(8, 0)] };
  assert.equal(canastaMeldPoints(clean), 640);
  assert.equal(canastaMeldPoints(mixed), 440);
});

test('a frozen pile cannot be taken, and the player needs two natural matches for an ordinary pile', () => {
  const game = createCanastaGame({ seed: 42 });
  game.hands[0] = [card(1, 12), card(2, 12, 1)];
  game.discard = [card(3, 12, 2)];
  assert.equal(takeCanastaDiscardPile(game, 0).phase, 'meld');
  const frozen = createCanastaGame({ seed: 42 });
  frozen.discard = [card(4, 0)];
  assert.throws(() => takeCanastaDiscardPile(frozen, 0), /cannot be taken/u);
  const short = createCanastaGame({ seed: 42 });
  short.hands[0] = [card(1, 12)];
  short.discard = [card(3, 12, 2)];
  assert.throws(() => takeCanastaDiscardPile(short, 0), /two natural cards/u);
});

test('drawing two cards enters meld phase and preserves the physical card count, including red threes', () => {
  const game = createCanastaGame({ seed: 9 });
  assert.equal(canastaCardCount(game), 108);
  drawCanastaStock(game, 0);
  assert.equal(game.phase, 'meld');
  assert.equal(game.hands[0].length + game.redThreeCards[0].length, CANASTA_HAND_SIZE + 2 + game.redThrees[0]);
  assert.equal(canastaCardCount(game), 108);
});

test('three threes are not melded, and a player cannot go out without a canasta', () => {
  const game = meldFixture({ hand: [card(1, 1), card(2, 1, 2), card(3, 1, 3)] });
  assert.equal(legalCanastaMeld(game, 0, 1, [1, 2, 3]), false);
  game.hands[0] = [card(4, 12)];
  assert.throws(() => discardCanastaCard(game, 0, 4), /need a canasta/u);
});

test('a legal final discard requires a canasta and adds round/out points to the running totals', () => {
  const game = meldFixture({ hand: [card(90, 8)] });
  game.phase = 'meld';
  game.melds[0] = [{ rank: 12, cards: Array.from({ length: 7 }, (_, index) => card(index, 12, index % 4, Math.floor(index / 4))) }];
  game.stock = [card(91, 10)];
  game.discard = [card(92, 9)];
  game.redThreeCards = [[], []];
  game.redThrees = [0, 0];
  discardCanastaCard(game, 0, 90);
  assert.equal(game.status, 'roundComplete');
  assert.equal(game.roundPoints[0], 740);
  assert.equal(game.scores[0], 740);
  assert.equal(game.winner, null);
  assert.ok(CANASTA_TARGET_SCORE > game.scores[0]);
});

test('a scored round can start another shuffled deal while retaining the running score', async () => {
  const { startNextCanastaRound } = await import('./canasta-game.mjs');
  const previous = createCanastaGame({ seed: 7, scores: [2000, 1200] });
  previous.status = 'stockEmpty';
  previous.scores = [2300, 1450];
  const next = startNextCanastaRound(previous, 8);
  assert.equal(next.round, 2);
  assert.deepEqual(next.scores, [2300, 1450]);
  assert.equal(next.status, 'playing');
  assert.equal(next.hands[0].length, CANASTA_HAND_SIZE);
  assert.throws(() => startNextCanastaRound({ ...previous, scores: [5000, 0] }), /already complete/u);
});

