import test from 'node:test';
import assert from 'node:assert/strict';
import { bidPreferans, createPreferansDeck, createPreferansGame, decidePreferansDefense, exchangePreferans, legalPreferansCards, playPreferansCard, scorePreferansHand } from './logic.mjs';

test('creates a 32-card deck and three ten-card hands with a two-card talon', () => {
  assert.equal(createPreferansDeck().length, 32);
  const game = createPreferansGame({ random: () => 0.5, dealer: 2 });
  assert.deepEqual(game.hands.map((hand) => hand.length), [10, 10, 10]);
  assert.equal(game.talon.length, 2);
  assert.equal(game.currentPlayer, 0);
});

test('auction completes after two passes following a bid and exchange replaces two cards', () => {
  let game = createPreferansGame({ random: () => 0.5, dealer: 2 });
  game = bidPreferans(game, 0, 'clubs');
  game = bidPreferans(game, 1, null);
  game = bidPreferans(game, 2, null);
  assert.equal(game.phase, 'exchange');
  assert.equal(game.declarer, 0);
  const discards = [...game.hands[0], ...game.talon].slice(0, 2).map((card) => card.id);
  game = exchangePreferans(game, 0, discards);
  assert.equal(game.hands[0].length, 10);
  assert.equal(game.talon.length, 0);
  assert.equal(game.trump, 'clubs');
  assert.equal(game.phase, 'defend');
});

test('all-pass hand redeals only after all three seats pass', () => {
  let game = createPreferansGame({ random: () => 0.5, dealer: 2 });
  game = bidPreferans(game, 0, null);
  game = bidPreferans(game, 1, null);
  assert.equal(game.phase, 'auction');
  game = bidPreferans(game, 2, null);
  assert.equal(game.phase, 'complete');
  assert.equal(game.redeal, true);
});

test('auction requires consecutive suit levels and then ends after two passes', () => {
  let game = createPreferansGame({ random: () => 0.5, dealer: 2 });
  assert.throws(() => bidPreferans(game, 0, 'spades'));
  game = bidPreferans(game, 0, 'clubs');
  game = bidPreferans(game, 1, 'spades');
  game = bidPreferans(game, 2, null);
  game = bidPreferans(game, 0, null);
  assert.equal(game.phase, 'exchange');
  assert.equal(game.declarer, 1);
  assert.equal(game.trump, null);
});

test('defenders can drop or defend, and a full hand resolves ten tricks', () => {
  let game = createPreferansGame({ random: () => 0.5, dealer: 2 });
  game = bidPreferans(game, 0, 'clubs');
  game = bidPreferans(game, 1, null);
  game = bidPreferans(game, 2, null);
  game = exchangePreferans(game, 0, [...game.hands[0], ...game.talon].slice(0, 2).map((card) => card.id));
  game = decidePreferansDefense(game, game.currentPlayer, true);
  game = decidePreferansDefense(game, game.currentPlayer, true);
  while (game.phase === 'playing') {
    const card = legalPreferansCards(game)[0];
    game = playPreferansCard(game, game.currentPlayer, card.id);
  }
  assert.equal(game.phase, 'complete');
  assert.equal(game.tricks.length, 10);
  assert.equal(game.tricksWon.reduce((sum, tricks) => sum + tricks, 0), 10);
  assert.equal(game.hands.flat().length, 0);
});

test('Austrian practice scoring records declarer transfers and individual defender quota penalties', () => {
  assert.deepEqual(scorePreferansHand({ declarer: 0, defenders: [1, 2], tricksWon: [6, 2, 2] }), [6, 2, 2]);
  assert.deepEqual(scorePreferansHand({ declarer: 0, defenders: [1, 2], tricksWon: [5, 4, 1] }), [-15, 4, -9]);
});

test('both defenders dropping out gives declarer all ten tricks by default', () => {
  let game = createPreferansGame({ random: () => 0.5, dealer: 2 });
  game = bidPreferans(game, 0, 'clubs');
  game = bidPreferans(game, 1, null);
  game = bidPreferans(game, 2, null);
  game = exchangePreferans(game, 0, [...game.hands[0], ...game.talon].slice(0, 2).map((card) => card.id));
  game = decidePreferansDefense(game, game.currentPlayer, false);
  game = decidePreferansDefense(game, game.currentPlayer, false);
  assert.equal(game.phase, 'complete');
  assert.equal(game.tricksWon[0], 10);
  assert.deepEqual(game.scoreDelta, [10, 0, 0]);
});

test('rejects illegal bids, exchanges, and off-suit plays while able to follow', () => {
  let game = createPreferansGame({ random: () => 0.5, dealer: 2 });
  assert.throws(() => bidPreferans(game, 1, 'clubs'));
});
