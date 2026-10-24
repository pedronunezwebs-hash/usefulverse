import assert from 'node:assert/strict';
import test from 'node:test';
import { chooseMusWinner, compareMusHands, createMusDeck, evaluateMusHand, musGameCardValue, musRankValue, musTeammateSeat, scorePassedLance } from './logic.mjs';
const hand = (...ranks) => ranks.map((rank, index) => ({ id: `${index}-${rank}`, suit: ['oros', 'copas', 'espadas', 'bastos'][index], rank }));

test('Spanish deck has 40 unique cards and applies the documented 3/king and 2/ace equivalences', () => {
  const deck = createMusDeck();
  assert.equal(deck.length, 40);
  assert.equal(new Set(deck.map(({ id }) => id)).size, 40);
  assert.equal(musRankValue(deck.find(({ rank }) => rank === 3)), musRankValue(deck.find(({ rank }) => rank === 12)));
  assert.equal(musRankValue(deck.find(({ rank }) => rank === 2)), musRankValue(deck.find(({ rank }) => rank === 1)));
  assert.equal(musGameCardValue(deck.find(({ rank }) => rank === 3)), 10);
  assert.equal(musGameCardValue(deck.find(({ rank }) => rank === 2)), 1);
});

test('Grande and Chica compare every card in descending and ascending order', () => {
  assert.equal(compareMusHands(hand(12, 11, 5, 4), hand(3, 11, 5, 4), 'grande'), 0);
  assert.equal(compareMusHands(hand(12, 11, 5, 4), hand(10, 11, 5, 4), 'grande'), 1);
  assert.equal(compareMusHands(hand(1, 4, 5, 6), hand(2, 4, 5, 7), 'chica'), 1);
});

test('Pares rank duples above medias above simple pairs and scores their documented values', () => {
  const duples = hand(11, 11, 7, 7), medias = hand(12, 3, 12, 4), simple = hand(5, 5, 10, 4);
  assert.equal(evaluateMusHand(duples).pairs.type, 'duples');
  assert.equal(evaluateMusHand(duples).pairs.value, 3);
  assert.equal(evaluateMusHand(medias).pairs.type, 'medias');
  assert.equal(evaluateMusHand(medias).pairs.value, 2);
  assert.equal(evaluateMusHand(simple).pairs.type, 'simple');
  assert.equal(compareMusHands(duples, medias, 'pares'), 1);
  assert.equal(scorePassedLance([duples, simple, medias, hand(1, 4, 6, 7)], 'pares', 0).points, 5);
});

test('Juego ranking and passed scoring use 31, 32, then 40 and face cards count ten', () => {
  const thirtyOne = hand(12, 11, 7, 4), thirtyTwo = hand(12, 11, 7, 5), forty = hand(12, 11, 10, 10);
  assert.equal(evaluateMusHand(thirtyOne).gameTotal, 31);
  assert.equal(evaluateMusHand(thirtyOne).game, 8);
  assert.equal(compareMusHands(thirtyOne, thirtyTwo, 'juego'), 1);
  assert.equal(compareMusHands(thirtyTwo, forty, 'juego'), 1);
  assert.equal(scorePassedLance([thirtyOne, hand(1, 2, 4, 5), thirtyTwo, forty], 'juego', 0).points, 5);
});

test('Punto is used only when no player has Juego; ties resolve clockwise from mano', () => {
  const hands = [hand(1, 4, 5, 6), hand(2, 4, 5, 6), hand(1, 4, 5, 6), hand(1, 4, 5, 6)];
  assert.equal(chooseMusWinner(hands, 'juego', 0), null);
  assert.equal(chooseMusWinner(hands, 'punto', 2).seat, 2);
  assert.equal(musTeammateSeat(1), 3);
});

test('invalid hands, seats and lances are rejected', () => {
  assert.throws(() => evaluateMusHand(hand(1, 2, 3)), RangeError);
  assert.throws(() => evaluateMusHand(hand(1, 2, 3, 99)), RangeError);
  assert.throws(() => chooseMusWinner([], 'grande'), RangeError);
  assert.throws(() => musTeammateSeat(4), RangeError);
});
