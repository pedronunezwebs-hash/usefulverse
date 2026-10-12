import test from 'node:test';
import assert from 'node:assert/strict';
import { canCribbagePlayerPlay, chooseCribbageBotDiscards, passCribbageMatchTurn, playCribbageComputerTurn, playCribbageMatchCard, scoreNextCribbageCount, startCribbageMatch, submitCribbageDiscards } from './game.mjs';

const c = (rank, suit) => ({ id: `${rank}-${suit}`, rank, suit });

test('a round deals a real starter and leaves the crib empty until discards', () => {
  const game = startCribbageMatch({ random: () => 0.37, dealer: 1 });
  assert.equal(game.phase, 'discard');
  assert.deepEqual(game.hands.map((hand) => hand.length), [6, 6]);
  assert.equal(game.crib.length, 0);
  assert.equal(game.remaining.length, 39);
  assert.equal(new Set([...game.hands.flat(), game.starter, ...game.remaining].map(({ id }) => id)).size, 52);
});

test('the computer chooses two distinct cards and submitted discards start four-card pegging', () => {
  const game = startCribbageMatch({ random: () => 0.37, dealer: 1 });
  const choice = chooseCribbageBotDiscards(game.hands[1], game.dealer);
  assert.equal(choice.cards.length, 2);
  assert.equal(new Set(choice.indices).size, 2);
  const pegging = submitCribbageDiscards(game, [0, 1]);
  assert.equal(pegging.phase, 'pegging');
  assert.deepEqual(pegging.hands.map((hand) => hand.length), [4, 4]);
  assert.equal(pegging.crib.length, 4);
  assert.equal(new Set([...pegging.hands.flat(), ...pegging.crib, pegging.starter, ...pegging.remaining].map(({ id }) => id)).size, 52);
  assert.throws(() => submitCribbageDiscards(game, [0, 0]), /two different/u);
});

test('a complete pegging segment hands off to count; score order is non-dealer, dealer, then crib', () => {
  const game = startCribbageMatch({ random: () => 0.37, dealer: 1 });
  let state = submitCribbageDiscards(game, [0, 1]);
  let turns = 0;
  while (state.phase === 'pegging' && turns < 100) {
    turns += 1;
    if (state.currentPlayer === 1) state = playCribbageComputerTurn(state);
    else if (canCribbagePlayerPlay(state, 0)) state = playCribbageMatchCard(state, state.hands[0].findIndex((card) => state.count + Math.min(card.rank, 10) <= 31));
    else state = passCribbageMatchTurn(state);
  }
  assert.equal(state.phase, 'count');
  assert.deepEqual(state.countQueue, [0, 1, 'crib']);
  for (const phase of ['hand', 'hand', 'crib']) {
    state = scoreNextCribbageCount(state, () => 0.37);
    if (phase !== 'crib') assert.equal(state.lastScoring.phase, 'hand');
    else assert.ok(['discard', 'finished'].includes(state.phase));
  }
  assert.equal(state.phase, 'discard');
  assert.equal(state.dealer, 0, 'dealer alternates for the next hand');
  assert.equal(state.hands[0].length, 6);
  assert.equal(state.scoreHistory.length >= 3, true);
});

test('counting a winning hand ends the match immediately', () => {
  const initial = startCribbageMatch({ random: () => 0.37, dealer: 1, targetScore: 29 });
  const hands = [
    [c(5, 'clubs'), c(5, 'diamonds'), c(5, 'hearts'), c(11, 'spades')],
    [c(2, 'clubs'), c(4, 'diamonds'), c(6, 'hearts'), c(8, 'spades')],
  ];
  const state = Object.freeze({ ...initial, phase: 'count', scores: Object.freeze([0, 0]), targetScore: 29, winner: null, hands: Object.freeze(hands), countHands: Object.freeze(hands), crib: Object.freeze([c(2, 'diamonds'), c(4, 'hearts'), c(6, 'spades'), c(8, 'clubs')]), starter: c(5, 'spades'), countQueue: Object.freeze([0, 1, 'crib']) });
  const result = scoreNextCribbageCount(state);
  assert.equal(result.phase, 'finished');
  assert.equal(result.winner, 0);
  assert.equal(result.scores[0], 29);
  assert.equal(result.lastScoring.total, 29);
  assert.throws(() => scoreNextCribbageCount(result), /waiting to be counted/u);
});

test('a dealer jack cut awards two heels before discards and may finish a match', () => {
  const candidates = Array.from({ length: 20 }, (_, index) => startCribbageMatch({ random: () => (index * 0.037) % 1, dealer: 1 }));
  const jackCut = candidates.find(({ starter }) => starter.rank === 11);
  assert.ok(jackCut, 'deterministic shuffle sample includes a starter jack');
  const target = startCribbageMatch({ random: () => candidates.indexOf(jackCut) * 0.037 % 1, dealer: 1, targetScore: 2 });
  assert.equal(target.starter.rank, 11);
  assert.equal(target.phase, 'finished');
  assert.equal(target.scores[1], 2);
  assert.equal(target.winner, 1);
});

test('a local match advances through new deals and eventually stops at its target', () => {
  let state = startCribbageMatch({ random: () => 0.37, dealer: 1, targetScore: 15 });
  for (let step = 0; state.phase !== 'finished' && step < 500; step += 1) {
    if (state.phase === 'discard') state = submitCribbageDiscards(state, [0, 1]);
    else if (state.phase === 'pegging' && state.currentPlayer === 1) state = playCribbageComputerTurn(state);
    else if (state.phase === 'pegging' && canCribbagePlayerPlay(state, 0)) state = playCribbageMatchCard(state, state.hands[0].findIndex((card) => state.count + Math.min(card.rank, 10) <= 31));
    else if (state.phase === 'pegging') state = passCribbageMatchTurn(state);
    else if (state.phase === 'count') state = scoreNextCribbageCount(state, () => 0.37);
  }
  assert.equal(state.phase, 'finished');
  assert.ok(state.winner === 0 || state.winner === 1);
  assert.ok(state.scores[state.winner] >= 15);
});
