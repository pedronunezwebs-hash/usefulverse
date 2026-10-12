export const CRIBBAGE_SUITS = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades']);
export const CRIBBAGE_RANKS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

function validateCards(cards, count, label) {
  if (!Array.isArray(cards) || cards.length !== count) throw new RangeError(`${label} must contain ${count} cards.`);
  const ids = new Set();
  for (const card of cards) {
    if (!card || !CRIBBAGE_RANKS.includes(card.rank) || !CRIBBAGE_SUITS.includes(card.suit)) throw new TypeError(`Invalid ${label.toLowerCase()} card.`);
    const id = card.id ?? `${card.rank}-${card.suit}`;
    if (ids.has(id)) throw new RangeError(`${label} cannot contain duplicate cards.`);
    ids.add(id);
  }
}

export function cribbagePipValue(rank) {
  if (!CRIBBAGE_RANKS.includes(rank)) throw new RangeError('Card rank must be 1–13.');
  return Math.min(rank, 10);
}

function countFifteens(cards) {
  let count = 0;
  for (let mask = 1; mask < (1 << cards.length); mask += 1) {
    let total = 0;
    for (let index = 0; index < cards.length; index += 1) if (mask & (1 << index)) total += cribbagePipValue(cards[index].rank);
    if (total === 15) count += 2;
  }
  return count;
}

function countRuns(cards) {
  const counts = new Map();
  for (const { rank } of cards) counts.set(rank, (counts.get(rank) ?? 0) + 1);
  const ranks = [...counts.keys()].sort((a, b) => a - b);
  let bestLength = 0;
  let runMultiplicity = 0;
  for (let start = 0; start < ranks.length;) {
    let end = start + 1;
    while (end < ranks.length && ranks[end] === ranks[end - 1] + 1) end += 1;
    const length = end - start;
    if (length >= 3) {
      const multiplicity = ranks.slice(start, end).reduce((total, rank) => total * counts.get(rank), 1);
      if (length > bestLength) { bestLength = length; runMultiplicity = multiplicity; }
      else if (length === bestLength) runMultiplicity += multiplicity;
    }
    start = end;
  }
  return bestLength * runMultiplicity;
}

/** Scores one six-card hand plus starter, or a five-card crib plus starter. */
export function scoreCribbageHand(cards, starter, { crib = false } = {}) {
  const expected = 4;
  validateCards(cards, expected, crib ? 'Crib' : 'Hand');
  validateCards([starter], 1, 'Starter');
  if (cards.some((card) => (card.id ?? `${card.rank}-${card.suit}`) === (starter.id ?? `${starter.rank}-${starter.suit}`))) throw new RangeError('Starter must be a different card.');
  const all = [...cards, starter];
  const fifteens = countFifteens(all);
  let pairs = 0;
  for (let left = 0; left < all.length; left += 1) for (let right = left + 1; right < all.length; right += 1) if (all[left].rank === all[right].rank) pairs += 2;
  const runs = countRuns(all);
  const flush = cards.every(({ suit }) => suit === cards[0].suit)
    ? (starter.suit === cards[0].suit ? cards.length + 1 : crib ? 0 : cards.length)
    : 0;
  const nobs = cards.some(({ rank, suit }) => rank === 11 && suit === starter.suit) ? 1 : 0;
  const total = fifteens + pairs + runs + flush + nobs;
  return Object.freeze({ total, fifteens, pairs, runs, flush, nobs });
}

export function createCribbageDeck() {
  return CRIBBAGE_SUITS.flatMap((suit) => CRIBBAGE_RANKS.map((rank) => Object.freeze({ id: `${rank}-${suit}`, rank, suit })));
}

export function shuffleCribbageDeck(random = Math.random) {
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  const deck = createCribbageDeck();
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random source must return values from 0 up to (but not including) 1.');
    const swap = Math.floor(sample * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}

export function dealCribbageHand(random = Math.random, dealer = 1) {
  if (!Number.isInteger(dealer) || dealer < 0 || dealer > 1) throw new RangeError('Dealer must be player 0 or 1.');
  const deck = shuffleCribbageDeck(random);
  const hands = [[], []];
  const nonDealer = 1 - dealer;
  for (let index = 0; index < 12; index += 1) hands[index % 2 === 0 ? nonDealer : dealer].push(deck[index]);
  return Object.freeze({
    dealer,
    hands: Object.freeze(hands.map((hand) => Object.freeze(hand))),
    crib: Object.freeze([]),
    starter: deck[12],
    remaining: Object.freeze(deck.slice(13)),
  });
}

function validatePeggingHands(hands) {
  if (!Array.isArray(hands) || hands.length !== 2) throw new TypeError('Pegging needs two player hands.');
  const seen = new Set();
  for (const hand of hands) {
    if (!Array.isArray(hand) || hand.length !== 4) throw new RangeError('Each pegging hand must contain four cards.');
    validateCards(hand, 4, 'Hand');
    for (const card of hand) {
      const id = card.id ?? `${card.rank}-${card.suit}`;
      if (seen.has(id)) throw new RangeError('The two hands cannot share a physical card.');
      seen.add(id);
    }
  }
}

/** Scores the latest pegging card. Distinct scoring categories can stack. */
export function scoreCribbagePegging(sequence) {
  if (!Array.isArray(sequence) || sequence.length < 1 || sequence.length > 31) throw new RangeError('A pegging sequence must contain 1–31 cards.');
  validateCards(sequence, sequence.length, 'Sequence');
  const count = sequence.reduce((sum, card) => sum + cribbagePipValue(card.rank), 0);
  if (count > 31) throw new RangeError('A pegging sequence cannot exceed 31.');
  const lastRank = sequence.at(-1).rank;
  let pairRun = 0;
  for (let index = sequence.length - 1; index >= 0 && sequence[index].rank === lastRank; index -= 1) pairRun += 1;
  const pairs = pairRun >= 2 ? [0, 0, 2, 6, 12][pairRun] : 0;
  let runs = 0;
  for (let length = Math.min(sequence.length, 7); length >= 3; length -= 1) {
    const ranks = sequence.slice(-length).map(({ rank }) => rank);
    if (new Set(ranks).size === length && Math.max(...ranks) - Math.min(...ranks) === length - 1) {
      runs = length;
      break;
    }
  }
  return Object.freeze({ count, fifteens: count === 15 ? 2 : 0, pairs, runs, thirtyOne: count === 31 ? 2 : 0, total: (count === 15 ? 2 : 0) + pairs + runs + (count === 31 ? 2 : 0) });
}

export function startCribbagePegging(hands, dealer, { scores = [0, 0], targetScore = 121 } = {}) {
  validatePeggingHands(hands);
  if (!Number.isInteger(dealer) || dealer < 0 || dealer > 1) throw new RangeError('Dealer must be player 0 or 1.');
  if (!Array.isArray(scores) || scores.length !== 2 || scores.some((score) => !Number.isInteger(score) || score < 0 || score >= targetScore)) throw new RangeError('Match scores must be non-negative integers below the target.');
  if (!Number.isInteger(targetScore) || targetScore < 1 || targetScore > 10000) throw new RangeError('Target score must be an integer from 1 to 10,000.');
  return Object.freeze({
    hands: Object.freeze(hands.map((hand) => Object.freeze(hand.map((card) => Object.freeze({ ...card }))))),
    dealer,
    scores: Object.freeze([...scores]),
    targetScore,
    winner: null,
    sequence: Object.freeze([]),
    count: 0,
    currentPlayer: 1 - dealer,
    lastPlayer: null,
    passed: Object.freeze([false, false]),
    finished: false,
    lastAward: null,
  });
}

function freezePegging(state) {
  return Object.freeze({
    ...state,
    hands: Object.freeze(state.hands.map((hand) => Object.freeze(hand.map((card) => Object.freeze({ ...card }))))),
    scores: Object.freeze([...state.scores]),
    sequence: Object.freeze(state.sequence.map((card) => Object.freeze({ ...card }))),
    passed: Object.freeze([...state.passed]),
    lastAward: state.lastAward ? Object.freeze({ ...state.lastAward }) : null,
  });
}

function awardPegging(state, player, points, reason) {
  const scores = [...state.scores];
  scores[player] += points;
  return { ...state, scores, winner: scores[player] >= state.targetScore ? player : null, lastAward: { player, points, reason } };
}

function canPlayAny(hand, count) {
  return hand.some((card) => count + cribbagePipValue(card.rank) <= 31);
}

function finishPegging(state) {
  return freezePegging({ ...state, finished: true, sequence: [], count: 0, passed: [false, false] });
}

function resetPeggingCount(state, leader, awardLastCard) {
  let next = state;
  if (awardLastCard && next.lastPlayer !== null) next = awardPegging(next, next.lastPlayer, 1, 'last-card');
  if (next.hands.every((hand) => hand.length === 0)) return finishPegging(next);
  return freezePegging({ ...next, sequence: [], count: 0, currentPlayer: leader, passed: [false, false], lastPlayer: null });
}

export function playCribbagePeggingCard(state, handIndex) {
  if (!state || state.finished) throw new RangeError('Pegging is already finished.');
  const player = state.currentPlayer;
  const hand = state.hands[player];
  if (!Number.isInteger(handIndex) || handIndex < 0 || handIndex >= hand.length) throw new RangeError('Choose a card in the current hand.');
  const card = hand[handIndex];
  const count = state.count + cribbagePipValue(card.rank);
  if (count > 31) throw new RangeError('That card would take the count above 31.');
  const hands = state.hands.map((cards, index) => index === player ? cards.filter((_, position) => position !== handIndex) : [...cards]);
  const sequence = [...state.sequence, card];
  const points = scoreCribbagePegging(sequence);
  let next = awardPegging({ ...state, hands, sequence, count, lastPlayer: player, passed: state.passed.map((value, index) => index === player ? false : value) }, player, points.total, points.thirtyOne ? '31' : points.total ? 'pegging' : null);
  if (next.winner !== null) return finishPegging(next);
  if (count === 31) return resetPeggingCount(next, player, false);
  if (hands.every((cards) => cards.length === 0)) return resetPeggingCount(next, player, true);
  const other = 1 - player;
  if (next.passed[other] || !canPlayAny(hands[other], count)) {
    next = { ...next, passed: next.passed.map((value, index) => index === other ? true : value) };
    if (!next.passed[player] && canPlayAny(hands[player], count)) return freezePegging({ ...next, currentPlayer: player, lastAward: points.total ? next.lastAward : null });
    return resetPeggingCount(next, player, true);
  }
  return freezePegging({ ...next, currentPlayer: other, lastAward: points.total ? next.lastAward : null });
}

export function passCribbagePeggingTurn(state) {
  if (!state || state.finished) throw new RangeError('Pegging is already finished.');
  const player = state.currentPlayer;
  if (canPlayAny(state.hands[player], state.count)) throw new RangeError('A legal card remains; the player cannot say go yet.');
  const passed = [...state.passed];
  passed[player] = true;
  const other = 1 - player;
  if (passed[other] || !canPlayAny(state.hands[other], state.count)) {
    const next = state.lastPlayer === null ? { ...state, passed } : awardPegging({ ...state, passed }, state.lastPlayer, 1, 'last-card');
    return next.winner !== null ? finishPegging(next) : resetPeggingCount(next, state.lastPlayer ?? other, false);
  }
  return freezePegging({ ...state, passed, currentPlayer: other, lastAward: null });
}

/** Simple deterministic local choice: take an immediate score, otherwise shed a high pip card. */
export function chooseCribbagePeggingCard(state) {
  if (!state || state.finished) return null;
  const hand = state.hands[state.currentPlayer];
  const legal = hand.map((card, index) => ({ card, index }))
    .filter(({ card }) => state.count + cribbagePipValue(card.rank) <= 31)
    .map(({ card, index }) => ({ card, index, score: scoreCribbagePegging([...state.sequence, card]) }))
    .sort((left, right) => right.score.total - left.score.total || cribbagePipValue(right.card.rank) - cribbagePipValue(left.card.rank) || left.index - right.index);
  if (!legal.length) return null;
  return Object.freeze({ index: legal[0].index, card: Object.freeze({ ...legal[0].card }), points: legal[0].score.total });
}

export function playCribbageBotPeggingTurn(state) {
  const choice = chooseCribbagePeggingCard(state);
  return choice ? playCribbagePeggingCard(state, choice.index) : passCribbagePeggingTurn(state);
}
