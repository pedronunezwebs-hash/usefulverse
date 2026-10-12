import {
  cribbagePipValue,
  createCribbageDeck,
  dealCribbageHand,
  playCribbageBotPeggingTurn,
  playCribbagePeggingCard,
  passCribbagePeggingTurn,
  scoreCribbageHand,
  startCribbagePegging,
} from './logic.mjs';

function freezeMatch(state) {
  return Object.freeze({
    ...state,
    hands: Object.freeze(state.hands.map((hand) => Object.freeze(hand.map((card) => Object.freeze({ ...card }))))),
    countHands: state.countHands ? Object.freeze(state.countHands.map((hand) => Object.freeze(hand.map((card) => Object.freeze({ ...card }))))) : null,
    crib: Object.freeze(state.crib.map((card) => Object.freeze({ ...card }))),
    scores: Object.freeze([...state.scores]),
    countQueue: Object.freeze([...(state.countQueue ?? [])]),
    scoreHistory: Object.freeze([...(state.scoreHistory ?? [])].map((entry) => Object.freeze({ ...entry }))),
    lastScoring: state.lastScoring ? Object.freeze({ ...state.lastScoring }) : null,
  });
}

function validateMatchOptions({ scores, targetScore, dealer }) {
  if (!Array.isArray(scores) || scores.length !== 2 || scores.some((score) => !Number.isInteger(score) || score < 0 || score >= targetScore)) throw new RangeError('Match scores must be non-negative integers below the target.');
  if (!Number.isInteger(targetScore) || targetScore < 1 || targetScore > 121) throw new RangeError('Cribbage target score must be from 1 to 121.');
  if (!Number.isInteger(dealer) || dealer < 0 || dealer > 1) throw new RangeError('Dealer must be player 0 or 1.');
}

function beginRound({ random, dealer, scores, targetScore, scoreHistory = [] }) {
  validateMatchOptions({ scores, targetScore, dealer });
  const dealt = dealCribbageHand(random, dealer);
  const heels = dealt.starter.rank === 11 ? 2 : 0;
  const nextScores = [...scores];
  if (heels) nextScores[dealer] += heels;
  const winner = nextScores[dealer] >= targetScore ? dealer : null;
  return freezeMatch({
    ...dealt,
    phase: winner === null ? 'discard' : 'finished',
    hands: dealt.hands,
    countHands: null,
    crib: [],
    scores: nextScores,
    targetScore,
    winner,
    heels,
    countQueue: [],
    scoreHistory: [...scoreHistory, ...(heels ? [{ phase: 'heels', player: dealer, points: heels }] : [])],
    sequence: [],
    count: 0,
    currentPlayer: null,
    lastPlayer: null,
    passed: [false, false],
    lastAward: heels ? { player: dealer, points: heels, reason: 'heels' } : null,
  });
}

export function startCribbageMatch({ random = Math.random, dealer = 1, targetScore = 121 } = {}) {
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  return beginRound({ random, dealer, scores: [0, 0], targetScore });
}

/** Bot keeps the four-card subset with the highest average hand score over unseen starters. */
export function chooseCribbageBotDiscards(hand, dealer) {
  if (!Array.isArray(hand) || hand.length !== 6) throw new RangeError('The computer needs six cards to choose discards.');
  if (!Number.isInteger(dealer) || dealer < 0 || dealer > 1) throw new RangeError('Dealer must be player 0 or 1.');
  const deck = createCribbageDeck();
  const handIds = new Set(hand.map(({ id, rank, suit }) => id ?? `${rank}-${suit}`));
  const unseenStarters = deck.filter(({ id }) => !handIds.has(id));
  let best = null;
  for (let first = 0; first < hand.length; first += 1) {
    for (let second = first + 1; second < hand.length; second += 1) {
      const kept = hand.filter((_, index) => index !== first && index !== second);
      const expectedHand = unseenStarters.reduce((sum, starter) => sum + scoreCribbageHand(kept, starter).total, 0) / unseenStarters.length;
      const discarded = [hand[first], hand[second]];
      const pairPotential = discarded[0].rank === discarded[1].rank ? 2 : 0;
      const fivePotential = discarded.filter(({ rank }) => rank === 5).length * 0.7;
      const runPotential = Math.abs(discarded[0].rank - discarded[1].rank) === 1 ? 0.8 : 0;
      const cribAdjustment = dealer === 1 ? pairPotential + fivePotential + runPotential : -(pairPotential + fivePotential + runPotential) * 0.45;
      const value = expectedHand + cribAdjustment;
      if (!best || value > best.value) best = { indices: [first, second], value };
    }
  }
  return Object.freeze({ indices: Object.freeze(best.indices), cards: Object.freeze(best.indices.map((index) => Object.freeze({ ...hand[index] }))) });
}

export function submitCribbageDiscards(state, indices) {
  if (!state || state.phase !== 'discard') throw new RangeError('The match is not waiting for crib discards.');
  if (!Array.isArray(indices) || indices.length !== 2 || indices.some((index) => !Number.isInteger(index) || index < 0 || index >= 6) || indices[0] === indices[1]) throw new RangeError('Select exactly two different cards for the crib.');
  const bot = chooseCribbageBotDiscards(state.hands[1], state.dealer);
  const playerDiscards = indices.map((index) => state.hands[0][index]);
  const playerHand = state.hands[0].filter((_, index) => !indices.includes(index));
  const botHand = state.hands[1].filter((_, index) => !bot.indices.includes(index));
  const crib = [...playerDiscards, ...bot.cards];
  const pegging = startCribbagePegging([playerHand, botHand], state.dealer, { scores: state.scores, targetScore: state.targetScore });
  return freezeMatch({ ...state, ...pegging, phase: 'pegging', hands: [playerHand, botHand], countHands: [playerHand, botHand], crib, countQueue: [], scoreHistory: state.scoreHistory });
}

function afterPegging(state, pegging) {
  if (pegging.winner !== null) return freezeMatch({ ...state, ...pegging, phase: 'finished', winner: pegging.winner, countQueue: [] });
  if (!pegging.finished) return freezeMatch({ ...state, ...pegging, phase: 'pegging' });
  return freezeMatch({ ...state, ...pegging, phase: 'count', countQueue: [1 - state.dealer, state.dealer, 'crib'], winner: null });
}

export function playCribbageMatchCard(state, handIndex) {
  if (!state || state.phase !== 'pegging') throw new RangeError('The match is not in the pegging phase.');
  return afterPegging(state, playCribbagePeggingCard(state, handIndex));
}

export function passCribbageMatchTurn(state) {
  if (!state || state.phase !== 'pegging') throw new RangeError('The match is not in the pegging phase.');
  return afterPegging(state, passCribbagePeggingTurn(state));
}

export function playCribbageComputerTurn(state) {
  if (!state || state.phase !== 'pegging' || state.currentPlayer !== 1) throw new RangeError('It is not the computer pegging turn.');
  return afterPegging(state, playCribbageBotPeggingTurn(state));
}

/** Count one hand in cribbage order: non-dealer, dealer, then dealer's crib. */
export function scoreNextCribbageCount(state, random = Math.random) {
  if (!state || state.phase !== 'count' || state.countQueue.length === 0) throw new RangeError('There is no hand waiting to be counted.');
  const [item, ...remaining] = state.countQueue;
  const crib = item === 'crib';
  const player = crib ? state.dealer : item;
  const scored = scoreCribbageHand(crib ? state.crib : state.countHands[player], state.starter, { crib });
  const scores = [...state.scores];
  scores[player] += scored.total;
  const scoreHistory = [...state.scoreHistory, { phase: crib ? 'crib' : 'hand', player, points: scored.total }];
  if (scores[player] >= state.targetScore) return freezeMatch({ ...state, scores, scoreHistory, countQueue: [], phase: 'finished', winner: player, lastScoring: { phase: crib ? 'crib' : 'hand', player, ...scored } });
  if (remaining.length) return freezeMatch({ ...state, scores, scoreHistory, countQueue: remaining, lastScoring: { phase: crib ? 'crib' : 'hand', player, ...scored } });
  return beginRound({ random, dealer: 1 - state.dealer, scores, targetScore: state.targetScore, scoreHistory });
}

export function canCribbagePlayerPlay(state, player) {
  if (!state || state.phase !== 'pegging' || !Number.isInteger(player) || player < 0 || player > 1) return false;
  return state.hands[player].some((card) => state.count + cribbagePipValue(card.rank) <= 31);
}
