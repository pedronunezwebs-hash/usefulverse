import test from 'node:test';
import assert from 'node:assert/strict';
import {
  arrangeIdiotCpuCards, chooseIdiotCpuAction, createIdiotDeck, createIdiotGame,
  idiotCardInventory, idiotLegalHandCards, isIdiotCardPlayable, playIdiotCards,
  playIdiotTableCard, riskIdiotDraw, startIdiotGame, swapIdiotCards, takeIdiotPile,
} from './idiot-game.mjs';

function playingFixture({ hand = [], faceUp = [], faceDown = [], discard = [], stock = [], other = {} } = {}) {
  const all = createIdiotDeck(81);
  const assigned = [...hand, ...faceUp, ...faceDown, ...discard, ...stock, ...(other.hand ?? []), ...(other.faceUp ?? []), ...(other.faceDown ?? [])];
  const ids = new Set(assigned.map(({ id }) => id));
  assert.equal(ids.size, assigned.length, 'fixture cards must be unique');
  const remaining = all.filter(({ id }) => !ids.has(id));
  return {
    seats: [
      { id: 0, hand: [...hand], faceUp: [...faceUp], faceDown: [...faceDown], finished: false },
      { id: 1, hand: [...(other.hand ?? [])], faceUp: [...(other.faceUp ?? [])], faceDown: [...(other.faceDown ?? [])], finished: false },
    ],
    stock: [...remaining, ...stock], discard: [...discard], burned: [], currentPlayer: 0,
    status: 'playing', placements: [], idiot: null, seed: 81, turns: 0, lastAction: 'fixture',
  };
}

const card = (rank, suit = 0) => ({ id: `${suit}-${rank}`, rank, suit });

test('creates and deals one conserved 52-card deck for two to five seats', () => {
  const deck = createIdiotDeck(9);
  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map(({ id }) => id)).size, 52);
  for (let players = 2; players <= 5; players += 1) {
    const game = createIdiotGame({ seed: 9, players });
    assert.equal(game.seats.length, players);
    assert.ok(game.seats.every(({ hand, faceUp, faceDown }) => hand.length === 3 && faceUp.length === 3 && faceDown.length === 3));
    assert.equal(game.stock.length, 52 - players * 9);
    assert.equal(idiotCardInventory(game), 52);
  }
  assert.throws(() => createIdiotGame({ players: 6 }), /2 to 5/u);
});

test('lets each seat swap a hand card with a visible table card before play', () => {
  const game = createIdiotGame({ seed: 12, players: 2 });
  const held = game.seats[0].hand[0]; const visible = game.seats[0].faceUp[1];
  swapIdiotCards(game, 0, held.id, 1);
  assert.equal(game.seats[0].hand[0].id, visible.id);
  assert.equal(game.seats[0].faceUp[1].id, held.id);
  arrangeIdiotCpuCards(game, 1);
  assert.equal(idiotCardInventory(game), 52);
  startIdiotGame(game);
  assert.equal(game.status, 'playing');
  assert.throws(() => swapIdiotCards(game, 0, held.id, 0), /before the game starts/u);
});

test('starts with the seat holding the lowest card, with seat order breaking ties', () => {
  const game = createIdiotGame({ seed: 14, players: 2 });
  game.seats[0].hand = [card(8), card(9), card(12)];
  game.seats[1].hand = [card(3, 1), card(13, 1), card(14, 1)];
  assert.equal(startIdiotGame(game).currentPlayer, 1);
});

test('2 and 10 can play on any top card; after a 2 any rank is legal', () => {
  const game = playingFixture({ discard: [card(14)], hand: [card(2, 1), card(10, 1), card(8, 2)] });
  assert.equal(isIdiotCardPlayable(game, card(2, 1)), true);
  assert.equal(isIdiotCardPlayable(game, card(10, 1)), true);
  assert.equal(isIdiotCardPlayable(game, card(8, 2)), false);
  game.discard = [card(2)];
  assert.equal(isIdiotCardPlayable(game, card(3, 1)), true);
});

test('rejects lower cards, duplicate ids and sets with mixed ranks without mutating the game', () => {
  const lower = card(5); const higher = card(9, 1);
  const game = playingFixture({ hand: [lower, higher], discard: [card(8, 2)] });
  const before = JSON.stringify(game);
  assert.throws(() => playIdiotCards(game, 0, [lower.id]), /lower than the top/u);
  assert.throws(() => playIdiotCards(game, 0, [lower.id, higher.id]), /same rank/u);
  assert.throws(() => playIdiotCards(game, 0, [lower.id, lower.id]), /same card twice/u);
  assert.equal(JSON.stringify(game), before);
});

test('playing a 2 lets the next player play any rank without burning the pile', () => {
  const two = card(2); const low = card(3, 1);
  const game = playingFixture({ hand: [two], discard: [card(14)], other: { hand: [low] } });
  playIdiotCards(game, 0, [two.id]);
  assert.equal(game.discard.at(-1).rank, 2);
  assert.equal(game.currentPlayer, 1);
  assert.equal(idiotLegalHandCards(game, 1)[0].id, low.id);
  assert.equal(idiotCardInventory(game), 52);
});

test('a ten burns the pile, stays out of play and grants another turn', () => {
  const ten = card(10);
  const game = playingFixture({ hand: [ten], discard: [card(4), card(12)], other: { hand: [card(5, 1)] } });
  playIdiotCards(game, 0, [ten.id]);
  assert.equal(game.discard.length, 0);
  assert.equal(game.burned.length, 3);
  assert.equal(game.currentPlayer, 0);
  assert.equal(idiotCardInventory(game), 52);
});

test('four of a kind burn the pile and grant another turn', () => {
  const fours = [card(7, 0), card(7, 1), card(7, 2), card(7, 3)];
  const game = playingFixture({ hand: fours, discard: [card(6)], other: { hand: [card(5, 1)] } });
  playIdiotCards(game, 0, fours.map(({ id }) => id));
  assert.equal(game.discard.length, 0);
  assert.equal(game.burned.length, 5);
  assert.equal(game.currentPlayer, 0);
  assert.equal(idiotCardInventory(game), 52);
});

test('refills a hand to three cards after a hand play while stock remains', () => {
  const played = card(9); const otherCards = [card(3, 1), card(4, 1)];
  const game = playingFixture({ hand: [played, ...otherCards], other: { hand: [card(5, 2)] } });
  const beforeStock = game.stock.length;
  playIdiotCards(game, 0, [played.id]);
  assert.equal(game.seats[0].hand.length, 3);
  assert.equal(game.stock.length, beforeStock - 1);
  assert.equal(idiotCardInventory(game), 52);
});

test('taking the pile is an available choice and advances the turn', () => {
  const game = playingFixture({ hand: [card(3)], discard: [card(7), card(9)], other: { hand: [card(4, 1)] } });
  takeIdiotPile(game, 0);
  assert.equal(game.seats[0].hand.length, 3);
  assert.equal(game.discard.length, 0);
  assert.equal(game.currentPlayer, 1);
  assert.equal(idiotCardInventory(game), 52);
});

test('a risky stock draw must be played when it fits', () => {
  const playable = card(10); const game = playingFixture({ hand: [card(4)], discard: [card(14)], stock: [playable], other: { hand: [card(5, 1)] } });
  const result = riskIdiotDraw(game, 0);
  assert.equal(result.playable, true);
  assert.ok(game.burned.some(({ id }) => id === playable.id));
  assert.equal(game.currentPlayer, 0);
  assert.equal(idiotCardInventory(game), 52);
});

test('a failed risky draw takes both the drawn card and the pile into the hand', () => {
  const tooLow = card(4); const game = playingFixture({ hand: [card(6)], discard: [card(9)], stock: [tooLow], other: { hand: [card(5, 1)] } });
  const result = riskIdiotDraw(game, 0);
  assert.equal(result.playable, false);
  assert.equal(game.seats[0].hand.length, 3);
  assert.equal(game.discard.length, 0);
  assert.equal(game.currentPlayer, 1);
  assert.equal(idiotCardInventory(game), 52);
});

test('face-up cards wait until hand and stock are empty; an invalid face-down card takes the pile', () => {
  const game = playingFixture({ faceUp: [card(5)], faceDown: [card(3, 1)], discard: [card(8)], other: { hand: [card(9, 2)] } });
  assert.throws(() => playIdiotTableCard(game, 0, 'faceUp', 0), /hand and draw pile first/u);
  game.burned.push(...game.stock); game.stock = [];
  const visible = playIdiotTableCard(game, 0, 'faceUp', 0);
  assert.equal(visible.playable, false);
  assert.equal(game.seats[0].hand.length, 2);
  assert.equal(game.currentPlayer, 1);
  const hiddenGame = playingFixture({ faceDown: [card(3, 1)], discard: [card(9, 3)], other: { hand: [card(10, 2)] } });
  hiddenGame.burned.push(...hiddenGame.stock); hiddenGame.stock = [];
  const hidden = playIdiotTableCard(hiddenGame, 0, 'faceDown', 0);
  assert.equal(hidden.playable, false);
  assert.equal(hiddenGame.seats[0].hand.length, 2);
  assert.equal(hiddenGame.discard.length, 0);
  assert.equal(idiotCardInventory(hiddenGame), 52);
});

test('players finish in order; the final player is marked as the idiot', () => {
  const game = playingFixture({ faceUp: [card(8)], other: { faceUp: [card(9, 1)] } });
  game.burned.push(...game.stock); game.stock = [];
  playIdiotTableCard(game, 0, 'faceUp', 0);
  assert.equal(game.status, 'complete');
  assert.equal(game.idiot, 1);
  assert.deepEqual(game.placements, [0]);
  assert.equal(idiotCardInventory(game), 52);
});

test('CPU selects only a legal hand group or takes the pile', () => {
  const playable = card(8); const game = playingFixture({ hand: [card(4), playable], discard: [card(7)], other: { hand: [card(3, 1)] } });
  assert.deepEqual(chooseIdiotCpuAction(game, 0), { type: 'play', cardIds: [playable.id] });
  game.seats[0].hand = [card(4)];
  assert.deepEqual(chooseIdiotCpuAction(game, 0), { type: 'takePile' });
});
