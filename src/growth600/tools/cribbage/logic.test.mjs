import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseCribbagePeggingCard, createCribbageDeck, dealCribbageHand, passCribbagePeggingTurn, playCribbagePeggingCard, scoreCribbageHand, scoreCribbagePegging, shuffleCribbageDeck, startCribbagePegging } from './logic.mjs';

const card = (rank, suit) => ({ rank, suit });

test('deck has 52 unique cards and a reproducible valid shuffle', () => {
  const deck = createCribbageDeck();
  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map(({ id }) => id)).size, 52);
  const random = () => 0.314159;
  assert.deepEqual(shuffleCribbageDeck(random), shuffleCribbageDeck(random));
  assert.throws(() => shuffleCribbageDeck(() => 1), /Random source/u);
});

test('deal produces six cards per player, an unfilled crib, one starter and 39 unseen cards', () => {
  const dealt = dealCribbageHand(() => 0.314159, 1);
  assert.equal(dealt.dealer, 1);
  assert.deepEqual(dealt.hands.map((hand) => hand.length), [6, 6]);
  assert.equal(dealt.crib.length, 0, 'crib cards must be chosen by the players, not dealt randomly');
  assert.equal(dealt.remaining.length, 39);
  assert.equal(new Set([...dealt.hands.flat(), ...dealt.crib, dealt.starter, ...dealt.remaining].map(({ id }) => id)).size, 52);
});

test('the canonical 29-point hand scores every distinct fifteens, pair and nobs', () => {
  const score = scoreCribbageHand([card(5, 'clubs'), card(5, 'diamonds'), card(5, 'hearts'), card(11, 'spades')], card(5, 'spades'));
  assert.deepEqual(score, { total: 29, fifteens: 16, pairs: 12, runs: 0, flush: 0, nobs: 1 });
});

test('run multiplicity counts distinct card identities without reusing the same score combination', () => {
  const score = scoreCribbageHand([card(3, 'clubs'), card(3, 'diamonds'), card(4, 'hearts'), card(5, 'spades')], card(6, 'clubs'));
  assert.equal(score.runs, 8);
});

test('flush and nobs differ correctly for hand versus crib', () => {
  const hand = [card(2, 'hearts'), card(4, 'hearts'), card(6, 'hearts'), card(11, 'hearts')];
  assert.equal(scoreCribbageHand(hand, card(13, 'spades')).flush, 4);
  assert.equal(scoreCribbageHand(hand, card(13, 'spades'), { crib: true }).flush, 0);
  assert.equal(scoreCribbageHand(hand, card(13, 'hearts')).flush, 5);
  assert.equal(scoreCribbageHand(hand, card(13, 'hearts'), { crib: true }).flush, 5);
  assert.equal(scoreCribbageHand(hand, card(1, 'spades')).nobs, 0);
});

test('invalid card counts, duplicate physical cards and malformed cards are rejected', () => {
  assert.throws(() => scoreCribbageHand([card(1, 'clubs')], card(2, 'clubs')), /4 cards/u);
  assert.throws(() => scoreCribbageHand([card(1, 'clubs'), card(1, 'clubs'), card(4, 'hearts'), card(5, 'spades')], card(7, 'diamonds')), /duplicate/u);
  assert.throws(() => scoreCribbageHand([card(1, 'clubs'), card(2, 'diamonds'), card(4, 'hearts'), card(5, 'spades')], card(14, 'clubs')), /Invalid/u);
});

test('pegging adds separate fifteen, pair, run and thirty-one scores', () => {
  const sequence = [card(5, 'clubs'), card(5, 'diamonds'), card(6, 'hearts'), card(8, 'spades'), card(7, 'clubs')];
  assert.deepEqual(scoreCribbagePegging(sequence), { count: 31, fifteens: 0, pairs: 0, runs: 4, thirtyOne: 2, total: 6 });
  assert.deepEqual(scoreCribbagePegging([card(7, 'clubs'), card(8, 'diamonds')]), { count: 15, fifteens: 2, pairs: 0, runs: 0, thirtyOne: 0, total: 2 });
  assert.equal(scoreCribbagePegging([card(9, 'clubs'), card(9, 'diamonds'), card(9, 'hearts')]).pairs, 6);
  assert.equal(scoreCribbagePegging([card(7, 'clubs'), card(7, 'diamonds'), card(7, 'hearts'), card(7, 'spades')]).pairs, 12);
  assert.equal(scoreCribbagePegging([card(4, 'clubs'), card(6, 'diamonds'), card(5, 'hearts')]).runs, 3);
  assert.throws(() => scoreCribbagePegging([card(10, 'clubs'), card(10, 'diamonds'), card(10, 'hearts'), card(10, 'spades')]), /exceed 31/u);
});

test('pegging begins with the non-dealer, scores turn combinations and resets after 31', () => {
  const hands = [
    [card(5, 'clubs'), card(6, 'clubs'), card(7, 'clubs'), card(2, 'clubs')],
    [card(5, 'diamonds'), card(8, 'diamonds'), card(9, 'diamonds'), card(3, 'diamonds')],
  ];
  let state = startCribbagePegging(hands, 1);
  assert.equal(state.currentPlayer, 0);
  const botChoice = chooseCribbagePeggingCard(state).card;
  assert.ok(state.hands[state.currentPlayer].some(({ rank, suit }) => rank === botChoice.rank && suit === botChoice.suit));
  for (const rank of [5, 5, 6, 8, 7]) {
    const index = state.hands[state.currentPlayer].findIndex((item) => item.rank === rank);
    state = playCribbagePeggingCard(state, index);
  }
  assert.equal(state.count, 0);
  assert.deepEqual(state.scores, [6, 2]);
  assert.equal(state.currentPlayer, 0, 'player who reached 31 leads the next count');
  assert.equal(state.sequence.length, 0);
});

test('go is legal only when no card fits; the last card point goes to the last player', () => {
  const hands = [
    [card(10, 'clubs'), card(9, 'clubs'), card(8, 'clubs'), card(7, 'clubs')],
    [card(10, 'diamonds'), card(9, 'diamonds'), card(8, 'diamonds'), card(7, 'diamonds')],
  ];
  const initial = startCribbagePegging(hands, 1);
  const state = Object.freeze({ ...initial, sequence: Object.freeze([card(10, 'hearts'), card(10, 'spades'), card(5, 'hearts')]), count: 25, lastPlayer: 1, currentPlayer: 0 });
  assert.throws(() => passCribbagePeggingTurn({ ...state, count: 10 }), /cannot say go/u);
  const next = passCribbagePeggingTurn(state);
  assert.equal(next.scores[1], 1);
  assert.equal(next.count, 0);
  assert.equal(next.currentPlayer, 1);
  assert.equal(next.sequence.length, 0);
});

test('a player who says go cannot re-enter the count; the opponent may continue to 31', () => {
  const hands = [
    [card(10, 'clubs'), card(9, 'clubs'), card(8, 'clubs'), card(7, 'clubs')],
    [card(6, 'diamonds'), card(4, 'diamonds'), card(3, 'diamonds'), card(2, 'diamonds')],
  ];
  const initial = startCribbagePegging(hands, 1);
  const state = Object.freeze({ ...initial, sequence: Object.freeze([card(10, 'hearts'), card(10, 'spades'), card(5, 'hearts')]), count: 25, lastPlayer: 1, currentPlayer: 0 });
  const afterGo = passCribbagePeggingTurn(state);
  assert.equal(afterGo.currentPlayer, 1);
  assert.equal(afterGo.passed[0], true);
  const afterThirtyOne = playCribbagePeggingCard(afterGo, 0);
  assert.equal(afterThirtyOne.scores[1], 2);
  assert.equal(afterThirtyOne.count, 0);
  assert.equal(afterThirtyOne.currentPlayer, 1);
  assert.equal(afterThirtyOne.passed[0], false);
});

test('pegging stops immediately when a player reaches the match target', () => {
  const hands = [
    [card(5, 'clubs'), card(6, 'clubs'), card(7, 'clubs'), card(2, 'clubs')],
    [card(5, 'diamonds'), card(8, 'diamonds'), card(9, 'diamonds'), card(3, 'diamonds')],
  ];
  let state = startCribbagePegging(hands, 1, { scores: [0, 1], targetScore: 3 });
  state = playCribbagePeggingCard(state, 0);
  state = playCribbagePeggingCard(state, 0);
  assert.equal(state.finished, true);
  assert.equal(state.winner, 1);
  assert.deepEqual(state.scores, [0, 3]);
  assert.throws(() => playCribbagePeggingCard(state, 0), /already finished/u);
});
