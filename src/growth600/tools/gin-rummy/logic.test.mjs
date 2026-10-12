import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseGinRummyDiscard, createGinRummyDeck, discardGinRummyCard, drawGinRummyCard, playGinRummyBotTurn, scoreGinRummyHand, startGinRummyGame } from './logic.mjs';

const c = (rank, suit) => ({ rank, suit });

test('finds runs, sets and remaining deadwood points', () => {
  const result = scoreGinRummyHand([
    c(1, 'clubs'), c(2, 'clubs'), c(3, 'clubs'),
    c(7, 'hearts'), c(8, 'hearts'), c(9, 'hearts'),
    c(5, 'clubs'), c(5, 'diamonds'), c(5, 'spades'), c(13, 'hearts'),
  ]);
  assert.equal(result.melds.length, 3);
  assert.deepEqual(result.melds.map(({ type }) => type).sort(), ['run', 'run', 'set']);
  assert.equal(result.deadwoodPoints, 10);
  assert.equal(result.gin, false);
  assert.equal(result.knockEligible, true);
});

test('recognizes gin only when all ten cards are covered by non-overlapping melds', () => {
  const result = scoreGinRummyHand([
    c(1, 'clubs'), c(2, 'clubs'), c(3, 'clubs'),
    c(7, 'hearts'), c(8, 'hearts'), c(9, 'hearts'),
    c(5, 'clubs'), c(5, 'diamonds'), c(5, 'spades'), c(5, 'hearts'),
  ]);
  assert.equal(result.gin, true);
  assert.equal(result.deadwoodPoints, 0);
  assert.equal(result.deadwood.length, 0);
});

test('uses the best disjoint meld combination when a card can join overlapping runs', () => {
  const result = scoreGinRummyHand([
    c(1, 'clubs'), c(2, 'clubs'), c(3, 'clubs'), c(4, 'clubs'),
    c(8, 'diamonds'), c(8, 'clubs'), c(8, 'hearts'),
    c(11, 'spades'), c(12, 'spades'), c(13, 'spades'),
  ]);
  assert.equal(result.gin, true);
  assert.equal(result.melds.reduce((sum, meld) => sum + meld.cards.length, 0), 10);
});

test('selects a high unmatched card as a reasonable discard', () => {
  const hand = [
    c(1, 'clubs'), c(2, 'clubs'), c(3, 'clubs'),
    c(7, 'hearts'), c(8, 'hearts'), c(9, 'hearts'),
    c(5, 'clubs'), c(5, 'diamonds'), c(5, 'spades'), c(13, 'hearts'), c(6, 'diamonds'),
  ];
  assert.deepEqual(chooseGinRummyDiscard(hand).card, c(13, 'hearts'));
  assert.equal(chooseGinRummyDiscard(hand).knockEligible, true);
  assert.throws(() => chooseGinRummyDiscard(hand.slice(0, 10)), /exactly 11/u);
});

test('rejects malformed hands and duplicate physical cards', () => {
  assert.throws(() => scoreGinRummyHand([]), /exactly 10/u);
  assert.throws(() => scoreGinRummyHand(Array(10).fill(c(1, 'clubs'))), /cannot appear twice/u);
  assert.throws(() => scoreGinRummyHand([c(0, 'clubs'), ...Array.from({ length: 9 }, (_, i) => c(i + 1, 'hearts'))]), /standard rank/u);
});

test('creates a complete shuffled deck and supports deterministic randomness', () => {
  const deck = createGinRummyDeck(() => 0.5);
  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map((card) => `${card.rank}:${card.suit}`)).size, 52);
  assert.throws(() => createGinRummyDeck(() => 1), /from 0 inclusive/u);
});

test('deals two 10-card hands, draws from stock and ends a normal turn at 10 cards', () => {
  const game = startGinRummyGame(() => 0.5);
  assert.equal(game.stock.length, 31);
  assert.deepEqual(game.hands.map((hand) => hand.length), [10, 10]);
  const afterDraw = drawGinRummyCard(game, 'stock');
  assert.equal(afterDraw.phase, 'discard');
  assert.equal(afterDraw.hands[0].length, 11);
  assert.equal(game.hands[0].length, 10, 'state transitions do not mutate the prior state');
  const afterDiscard = discardGinRummyCard(afterDraw, 0);
  assert.equal(afterDiscard.phase, 'draw');
  assert.equal(afterDiscard.currentPlayer, 1);
  assert.equal(afterDiscard.hands[0].length, 10);
  assert.equal(afterDiscard.discardPile.length, 2);
});

test('cannot immediately put a picked-up discard back on the pile', () => {
  const game = startGinRummyGame(() => 0.5);
  const afterDraw = drawGinRummyCard(game, 'discard');
  const pickedCardIndex = afterDraw.hands[0].findIndex(({ rank, suit }) => rank === afterDraw.drawnCard.card.rank && suit === afterDraw.drawnCard.card.suit);
  assert.throws(() => discardGinRummyCard(afterDraw, pickedCardIndex), /cannot immediately discard/u);
});

test('knocking resolves a valid low-deadwood hand and records the explicit no-layoff variant', () => {
  const knockerHand = [
    c(1, 'clubs'), c(2, 'clubs'), c(3, 'clubs'), c(7, 'hearts'), c(8, 'hearts'), c(9, 'hearts'),
    c(5, 'clubs'), c(5, 'diamonds'), c(5, 'spades'), c(13, 'hearts'), c(6, 'diamonds'),
  ];
  const opponentHand = [c(1, 'hearts'), c(4, 'hearts'), c(6, 'hearts'), c(10, 'spades'), c(2, 'diamonds'), c(7, 'clubs'), c(11, 'clubs'), c(3, 'spades'), c(12, 'diamonds'), c(9, 'spades')];
  const game = { hands: [knockerHand, opponentHand], stock: [], discardPile: [], scores: [0, 0], currentPlayer: 0, phase: 'discard', drawnCard: { card: c(6, 'diamonds'), source: 'stock' }, roundResult: null };
  const result = discardGinRummyCard(game, 10, { knock: true });
  assert.equal(result.phase, 'finished');
  assert.equal(result.roundResult.type, 'knock');
  assert.equal(result.roundResult.scoringVariant, 'no-layoff');
  assert.equal(result.roundResult.winner, 0);
  assert.equal(result.roundResult.points, 52);
  assert.equal(result.scores[0], 52);
});

test('an opponent with equal-or-lower deadwood undercuts and receives the bonus', () => {
  const knockerHand = [c(1, 'clubs'), c(2, 'clubs'), c(3, 'clubs'), c(7, 'hearts'), c(8, 'hearts'), c(9, 'hearts'), c(5, 'clubs'), c(5, 'diamonds'), c(5, 'spades'), c(13, 'hearts'), c(6, 'diamonds')];
  const opponentHand = [c(1, 'diamonds'), c(2, 'diamonds'), c(3, 'diamonds'), c(7, 'spades'), c(8, 'spades'), c(9, 'spades'), c(4, 'clubs'), c(4, 'diamonds'), c(4, 'hearts'), c(5, 'hearts')];
  const game = { hands: [knockerHand, opponentHand], stock: [], discardPile: [], scores: [0, 0], currentPlayer: 0, phase: 'discard', drawnCard: { card: c(6, 'diamonds'), source: 'stock' }, roundResult: null };
  const result = discardGinRummyCard(game, 10, { knock: true });
  assert.equal(result.roundResult.type, 'undercut');
  assert.equal(result.roundResult.winner, 1);
  assert.equal(result.roundResult.points, 30);
  assert.equal(result.scores[1], 30);
});

test('local opponent completes its turn without exposing its hand or mutating the old state', () => {
  const game = { ...startGinRummyGame(() => 0.5), currentPlayer: 1 };
  const next = playGinRummyBotTurn(game);
  assert.ok(['draw', 'finished'].includes(next.phase));
  assert.equal(next.hands[1].length, 10);
  assert.equal(game.hands[1].length, 10);
  assert.equal(game.phase, 'draw');
  assert.ok(next.discardPile.length > game.discardPile.length || next.phase === 'finished');
});
