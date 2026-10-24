import test from 'node:test';
import assert from 'node:assert/strict';
import { discardIndianRummyCard, startIndianRummy, takeIndianRummyDraw, validateIndianRummyHand } from './logic.mjs';

const card = (rank, suit, id = `${rank}-${suit}`) => ({ id, rank, suit, joker: false });

test('two-deck Paplu deal has 13 cards per player and a two-joker stock', () => {
  const game = startIndianRummy(() => 0.5);
  assert.equal(game.human.length, 13);
  assert.equal(game.bot.length, 13);
  assert.equal(game.stock.length, 78);
  assert.equal(game.discards.length, 1);
  const deck = [...game.human, ...game.bot, ...game.stock, ...game.discards, game.wildIndicator];
  assert.equal(deck.length, 106);
  assert.equal(new Set(deck.map(({ id }) => id)).size, 106);
  assert.equal(deck.filter(({ joker }) => joker).length, 2);
  assert.throws(() => startIndianRummy(() => 1), RangeError);
  assert.throws(() => startIndianRummy(null), TypeError);
});

test('draw and discard keep turns bounded and protect the card taken from discard', () => {
  const game = startIndianRummy(() => 0.5);
  const fromDiscard = takeIndianRummyDraw(game, 'discard', () => 0.5);
  assert.equal(fromDiscard.phase, 'discard');
  assert.equal(fromDiscard.human.length, 14);
  assert.throws(() => discardIndianRummyCard(fromDiscard, fromDiscard.lastDrawnId, () => 0.5), /different card/u);
  const next = discardIndianRummyCard(fromDiscard, fromDiscard.human[0].id, () => 0.5);
  assert.equal(next.human.length, 13);
  assert.equal(next.turn, 'human');
  assert.equal(next.phase, 'draw');
  assert.equal(next.bot.length, 13);
});

test('hand validator requires full partition, two sequences and one pure sequence', () => {
  const winning = [
    card('A', 'S'), card('2', 'S'), card('3', 'S'),
    card('4', 'H'), card('5', 'H'), card('6', 'H'),
    card('7', 'S'), card('7', 'H'), card('7', 'D'), card('7', 'C'),
    card('9', 'C'), card('10', 'C'), card('J', 'C'),
  ];
  assert.equal(validateIndianRummyHand(winning, 'K').valid, true);
  assert.equal(validateIndianRummyHand(winning.slice(0, 12), 'K').valid, false);
  assert.equal(validateIndianRummyHand(winning, 'K').groups.reduce((sum, group) => sum + group.ids.length, 0), 13);

  const wraparound = [card('K', 'S'), card('A', 'S'), card('2', 'S')];
  assert.equal(validateIndianRummyHand(wraparound.concat(winning.slice(3)), 'Q').valid, false);
});
