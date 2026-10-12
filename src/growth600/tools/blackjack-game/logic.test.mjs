import assert from 'node:assert/strict';
import test from 'node:test';
import { canDoubleBlackjackHand, canSplitBlackjackHand, createBlackjackGame, doubleBlackjackHand, scoreBlackjackHand, splitBlackjackHand, standBlackjackHand, startNextBlackjackRound } from './logic.mjs';

const card = (rank, suit = 'spades') => ({ rank, suit });
function arrangedShoe(drawQueue) {
  const filler = Array.from({ length: 52 - drawQueue.length }, (_, index) => card((index % 13) + 1, ['spades', 'hearts', 'diamonds', 'clubs'][index % 4]));
  return [...filler, ...drawQueue.toReversed()];
}

test('scores aces as 1 or 11 to avoid bust and identifies natural blackjack', () => {
  assert.deepEqual(scoreBlackjackHand([card(1), card(6)]), { total: 17, soft: true, bust: false, blackjack: false });
  assert.deepEqual(scoreBlackjackHand([card(1), card(6), card(9)]), { total: 16, soft: false, bust: false, blackjack: false });
  assert.deepEqual(scoreBlackjackHand([card(1), card(13)]), { total: 21, soft: true, bust: false, blackjack: true });
});

test('settles a player natural, dealer natural, and simultaneous naturals correctly', () => {
  const playerNatural = createBlackjackGame({ decks: 1, shoe: arrangedShoe([card(1), card(13), card(9), card(7)]) });
  assert.equal(playerNatural.phase, 'complete');
  assert.deepEqual(playerNatural.results, ['natural']);
  assert.equal(playerNatural.stats.wins, 1);
  const dealerNatural = createBlackjackGame({ decks: 1, shoe: arrangedShoe([card(9), card(7), card(1), card(13)]) });
  assert.deepEqual(dealerNatural.results, ['loss']);
  const tied = createBlackjackGame({ decks: 1, shoe: arrangedShoe([card(1), card(13), card(1, 'hearts'), card(12)]) });
  assert.deepEqual(tied.results, ['push']);
  assert.equal(tied.dealerHidden, false);
});

test('double draws exactly one card, ends the hand and never represents a cash wager', () => {
  const game = createBlackjackGame({ decks: 1, shoe: arrangedShoe([card(2), card(3), card(10), card(7), card(10)]) });
  assert.equal(canDoubleBlackjackHand(game), true);
  const next = doubleBlackjackHand(game);
  assert.equal(next.phase, 'complete');
  assert.equal(next.playerHands[0].cards.length, 3);
  assert.equal(next.playerHands[0].doubled, true);
  assert.deepEqual(next.results, ['loss']);
  assert.equal(next.wager, undefined);
});

test('split creates two independently played hands and advances to the next one', () => {
  let game = createBlackjackGame({ decks: 1, shoe: arrangedShoe([card(8), card(8, 'hearts'), card(5), card(10), card(2), card(3), card(10)]) });
  assert.equal(canSplitBlackjackHand(game), true);
  game = splitBlackjackHand(game);
  assert.equal(game.playerHands.length, 2);
  assert.equal(game.currentHand, 0);
  game = standBlackjackHand(game);
  assert.equal(game.currentHand, 1);
  game = standBlackjackHand(game);
  assert.equal(game.phase, 'complete');
  assert.deepEqual(game.results, ['win', 'win']);
});

test('split aces receive one card and stand; new rounds reuse the remaining local shoe', () => {
  let game = createBlackjackGame({ decks: 1, shoe: arrangedShoe([card(1), card(1, 'hearts'), card(8), card(9), card(10), card(9), card(2)]) });
  game = splitBlackjackHand(game);
  assert.deepEqual(game.playerHands.map(({ finished }) => finished), [true, true]);
  assert.equal(game.phase, 'complete');
  const next = startNextBlackjackRound(game, () => 0.5);
  assert.ok(next.round === game.round || next.round === game.round + 1);
  assert.equal(next.decks, 1);
  assert.equal(next.stats.wins + next.stats.losses + next.stats.pushes, game.stats.wins + game.stats.losses + game.stats.pushes);
});

test('dealer hits soft 17 only when that rule is selected and invalid settings are rejected', () => {
  const queue = [card(10), card(7), card(1), card(6), card(2)];
  const dealerStands = standBlackjackHand(createBlackjackGame({ decks: 1, hitSoft17: false, shoe: arrangedShoe(queue) }));
  const dealerHits = standBlackjackHand(createBlackjackGame({ decks: 1, hitSoft17: true, shoe: arrangedShoe(queue) }));
  assert.equal(dealerStands.dealerCards.length, 2);
  assert.equal(dealerStands.results[0], 'push');
  assert.equal(dealerHits.dealerCards.length, 3);
  assert.equal(dealerHits.results[0], 'loss');
  assert.throws(() => createBlackjackGame({ decks: 7 }), /1 to 6/u);
  assert.throws(() => startNextBlackjackRound(createBlackjackGame({ decks: 1, shoe: arrangedShoe(queue) })), /Finish the current hand/u);
});
