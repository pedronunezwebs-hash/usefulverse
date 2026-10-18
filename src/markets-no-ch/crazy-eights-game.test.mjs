import test from 'node:test';
import assert from 'node:assert/strict';
import {
  crazyEightsCardCount, crazyEightsCardPoints, crazyEightsLegalCards, createCrazyEightsDeck,
  createCrazyEightsGame, drawCrazyEightsCard, passCrazyEightsTurn, playCrazyEightsCard,
  startNextCrazyEightsRound,
} from './crazy-eights-game.mjs';

test('creates a shuffled 52-card deck without duplicates', () => {
  const deck = createCrazyEightsDeck(19);
  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map(({ id }) => id)).size, 52);
  assert.deepEqual(createCrazyEightsDeck(19), deck);
});

test('deals seven cards for two and five for three to six; conserves cards', () => {
  for (let players = 2; players <= 6; players += 1) {
    const game = createCrazyEightsGame({ seed: players, players });
    assert.equal(game.hands[0].length, players === 2 ? 7 : 5);
    assert.equal(crazyEightsCardCount(game), 52);
    assert.notEqual(game.discard[0].rank, 8);
  }
});

test('allows matching suit, matching rank and any eight; rejects an illegal card', () => {
  const game = createCrazyEightsGame({ seed: 29 });
  game.discard = [{ id: 'top', rank: 7, suit: 0 }]; game.currentSuit = 0;
  game.hands[0] = [{ id: 'suit', rank: 2, suit: 0 }, { id: 'rank', rank: 7, suit: 2 }, { id: 'wild', rank: 8, suit: 1 }, { id: 'bad', rank: 3, suit: 3 }];
  assert.deepEqual(crazyEightsLegalCards(game, 0).map(({ id }) => id), ['suit', 'rank', 'wild']);
  assert.throws(() => playCrazyEightsCard(game, 0, 'bad', 'spades'));
});

test('playing an eight chooses the next suit and advances the turn', () => {
  const game = createCrazyEightsGame({ seed: 33 });
  game.discard = [{ id: 'top', rank: 3, suit: 2 }]; game.currentSuit = 2;
  game.hands[0] = [{ id: 'eight', rank: 8, suit: 1 }, { id: 'other', rank: 4, suit: 0 }];
  playCrazyEightsCard(game, 0, 'eight', 'clubs');
  assert.equal(game.currentSuit, 3);
  assert.equal(game.currentPlayer, 1);
});

test('a drawn playable card ends the turn and an unplayable third draw passes', () => {
  const game = createCrazyEightsGame({ seed: 42 });
  game.discard = [{ id: 'top', rank: 5, suit: 0 }]; game.currentSuit = 0;
  game.hands[0] = []; game.stock = [
    { id: 'fits', rank: 5, suit: 1 }, { id: 'two', rank: 3, suit: 2 }, { id: 'one', rank: 2, suit: 3 },
  ];
  assert.equal(drawCrazyEightsCard(game, 0).playable, false);
  assert.equal(drawCrazyEightsCard(game, 0).playable, false);
  const third = drawCrazyEightsCard(game, 0);
  assert.equal(third.playable, true);
  assert.equal(game.currentPlayer, 0);
  playCrazyEightsCard(game, 0, 'fits', 'hearts');
  game.stock = [{ id: 'x', rank: 2, suit: 3 }, { id: 'y', rank: 3, suit: 2 }, { id: 'z', rank: 4, suit: 1 }];
  game.hands[0] = []; game.currentPlayer = 0; game.drawCount = 0;
  drawCrazyEightsCard(game, 0); drawCrazyEightsCard(game, 0);
  assert.equal(drawCrazyEightsCard(game, 0).passed, true);
  assert.equal(game.currentPlayer, 1);
});

test('recycles the discard pile without moving its top card', () => {
  const game = createCrazyEightsGame({ seed: 50 });
  game.discard.push(...game.stock);
  game.stock = [];
  const top = game.discard.at(-1);
  game.currentPlayer = 0;
  drawCrazyEightsCard(game, 0);
  assert.equal(game.discard.length, 1);
  assert.equal(game.discard[0].id, top.id);
  assert.equal(crazyEightsCardCount(game), 52);
});

test('scores the round and finishes after the target is exceeded; the lower total wins', () => {
  const game = createCrazyEightsGame({ seed: 61, scores: [90, 50], target: 100 });
  game.hands = [[{ id: 'last', rank: 7, suit: 1 }], [{ id: 'ace', rank: 1, suit: 1 }, { id: 'eight', rank: 8, suit: 2 }]];
  game.discard = [{ id: 'top', rank: 4, suit: 1 }]; game.currentSuit = 1; game.currentPlayer = 0; game.stock = [];
  playCrazyEightsCard(game, 0, 'last', 'hearts');
  assert.deepEqual(game.roundPoints, [0, 51]);
  assert.deepEqual(game.scores, [90, 101]);
  assert.equal(game.status, 'complete');
  assert.equal(game.winner, 0);
  assert.equal(crazyEightsCardPoints({ rank: 8 }), 50);
});

test('starts the next round with the saved cumulative scores', () => {
  const game = createCrazyEightsGame({ seed: 71, scores: [25, 40] });
  game.status = 'roundEnd'; game.rounds = 1; game.roundPoints = [0, 10]; game.scores = [25, 50];
  const next = startNextCrazyEightsRound(game, 72);
  assert.deepEqual(next.scores, [25, 50]);
  assert.equal(next.rounds, 1);
  assert.equal(crazyEightsCardCount(next), 52);
});

test('pass is blocked when a card fits or the draw limit has not been reached', () => {
  const game = createCrazyEightsGame({ seed: 82 });
  game.discard = [{ id: 'top', rank: 4, suit: 1 }]; game.currentSuit = 1;
  game.hands[0] = [{ id: 'legal', rank: 9, suit: 1 }]; game.drawCount = 1;
  assert.throws(() => passCrazyEightsTurn(game, 0));
  game.hands[0] = [{ id: 'not-legal', rank: 9, suit: 3 }]; game.drawCount = 2;
  assert.throws(() => passCrazyEightsTurn(game, 0));
  game.drawCount = 3;
  passCrazyEightsTurn(game, 0);
  assert.equal(game.currentPlayer, 1);
});
