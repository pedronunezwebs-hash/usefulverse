const SUITS = Object.freeze(['hearts', 'diamonds', 'spades', 'clubs']);
const RANKS = Object.freeze([6, 7, 8, 9, 10, 11, 12, 13, 14]);
const CONTRACTS = Object.freeze([...SUITS, 'top-down', 'bottom-up']);
const TRUMP_ORDER = Object.freeze([11, 9, 14, 13, 12, 10, 8, 7, 6]);
const PLAIN_ORDER = Object.freeze([14, 13, 12, 11, 10, 9, 8, 7, 6]);
const TOP_ORDER = PLAIN_ORDER;
const BOTTOM_ORDER = Object.freeze([...RANKS]);
const TRUMP_POINTS = Object.freeze({ 6: 0, 7: 0, 8: 0, 9: 14, 10: 10, 11: 20, 12: 3, 13: 4, 14: 11 });
const PLAIN_POINTS = Object.freeze({ 6: 0, 7: 0, 8: 0, 9: 0, 10: 10, 11: 2, 12: 3, 13: 4, 14: 11 });
const TOP_POINTS = Object.freeze({ ...PLAIN_POINTS, 8: 8 });
const BOTTOM_POINTS = Object.freeze({ ...PLAIN_POINTS, 6: 11, 8: 8, 14: 0 });
const TARGET_ROUNDS = 12;

function assert(condition, message) { if (!condition) throw new RangeError(message); }
function validCard(card) { return card && SUITS.includes(card.suit) && RANKS.includes(card.rank) && card.id === `${card.suit}-${card.rank}`; }
function teamOf(seat) { return seat % 2; }
function nextRandom(state) {
  let value = (state >>> 0) || 0x9e3779b9;
  value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
  return { value: value >>> 0, state: value >>> 0 };
}

function shuffledDeck(seed) {
  const cards = SUITS.flatMap((suit) => RANKS.map((rank) => Object.freeze({ id: `${suit}-${rank}`, suit, rank })));
  let state = seed >>> 0;
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const draw = nextRandom(state); state = draw.state;
    const swap = draw.value % (index + 1);
    [cards[index], cards[swap]] = [cards[swap], cards[index]];
  }
  return { cards, state };
}

function dealHands(seed, forehand) {
  const { cards, state } = shuffledDeck(seed);
  const hands = Array.from({ length: 4 }, () => []);
  const dealer = (forehand + 1) % 4;
  for (let index = 0; index < cards.length; index += 1) {
    const seat = (dealer + 1 + index) % 4;
    hands[seat].push(cards[index]);
  }
  return { hands, state };
}

function makeTrickOrder(leader) { return Array.from({ length: 4 }, (_, index) => (leader + index) % 4); }
function trumpSuit(contract) { return SUITS.includes(contract) ? contract : null; }
function highestTrumpIn(trick, suit) {
  return trick.filter(({ card }) => card.suit === suit).reduce((highest, entry) => !highest || TRUMP_ORDER.indexOf(entry.card.rank) < TRUMP_ORDER.indexOf(highest.card.rank) ? entry : highest, null);
}

export function legalJassCards(hand, trick, contract) {
  assert(Array.isArray(hand) && hand.length > 0 && hand.every(validCard), 'A non-empty hand of valid Jass cards is required.');
  assert(Array.isArray(trick) && trick.length < 4 && trick.every((entry) => Number.isInteger(entry.player) && validCard(entry.card)), 'Invalid trick.');
  assert(CONTRACTS.includes(contract), 'Choose a supported Schieber contract.');
  if (trick.length === 0) return [...hand];
  const suit = trumpSuit(contract);
  const ledSuit = trick[0].card.suit;
  if (!suit) {
    const follow = hand.filter((card) => card.suit === ledSuit);
    return follow.length ? follow : [...hand];
  }
  const trumps = hand.filter((card) => card.suit === suit);
  if (ledSuit === suit) {
    const playableTrump = trumps.filter((card) => card.rank !== 11);
    return playableTrump.length ? trumps : [...hand];
  }
  const follows = hand.filter((card) => card.suit === ledSuit);
  const alreadyTrumped = trick.some(({ card }) => card.suit === suit);
  const highest = alreadyTrumped ? highestTrumpIn(trick, suit) : null;
  const onlyTrumps = hand.every((card) => card.suit === suit);
  const canPlayTrump = (card) => !alreadyTrumped || onlyTrumps || TRUMP_ORDER.indexOf(card.rank) < TRUMP_ORDER.indexOf(highest.card.rank);
  const trumpOptions = trumps.filter(canPlayTrump);
  return follows.length ? [...follows, ...trumpOptions] : [...hand.filter((card) => card.suit !== suit), ...trumpOptions];
}

function strength(card, contract, ledSuit) {
  const suit = trumpSuit(contract);
  if (suit && card.suit === suit) return 100 - TRUMP_ORDER.indexOf(card.rank);
  if (card.suit !== ledSuit) return -1;
  const order = contract === 'top-down' ? TOP_ORDER : contract === 'bottom-up' ? BOTTOM_ORDER : PLAIN_ORDER;
  return 50 - order.indexOf(card.rank);
}

export function resolveJassTrick(trick, contract, isLastTrick = false) {
  assert(Array.isArray(trick) && trick.length === 4 && trick.every((entry) => Number.isInteger(entry.player) && validCard(entry.card)), 'A complete four-card trick is required.');
  assert(CONTRACTS.includes(contract), 'Choose a supported Schieber contract.');
  const ledSuit = trick[0].card.suit;
  const winner = trick.reduce((best, entry) => strength(entry.card, contract, ledSuit) > strength(best.card, contract, ledSuit) ? entry : best, trick[0]);
  const cardPoints = trick.reduce((sum, { card }) => {
    if (contract === 'top-down') return sum + TOP_POINTS[card.rank];
    if (contract === 'bottom-up') return sum + BOTTOM_POINTS[card.rank];
    return sum + (card.suit === contract ? TRUMP_POINTS[card.rank] : PLAIN_POINTS[card.rank]);
  }, 0);
  return Object.freeze({ winner: winner.player, team: teamOf(winner.player), cardPoints, points: cardPoints + (isLastTrick ? 5 : 0), lastTrickBonus: isLastTrick ? 5 : 0 });
}

function contractStrength(hand, contract) {
  const suit = trumpSuit(contract);
  const cards = hand.filter((card) => !suit || card.suit === suit);
  return cards.reduce((sum, card) => sum + (suit ? (card.rank === 11 ? 6 : card.rank === 9 ? 4 : card.rank === 14 ? 3 : 1) : card.rank === (contract === 'top-down' ? 14 : 6) ? 4 : card.rank === (contract === 'top-down' ? 13 : 7) ? 2 : 0), 0);
}

export function chooseJassCpuContract(hand) {
  assert(Array.isArray(hand) && hand.length === 9 && hand.every(validCard), 'A CPU needs its own nine-card hand to choose a contract.');
  return [...CONTRACTS].sort((a, b) => contractStrength(hand, b) - contractStrength(hand, a) || CONTRACTS.indexOf(a) - CONTRACTS.indexOf(b))[0];
}

function trickWinnerSoFar(trick, contract) {
  if (!trick.length) return null;
  return trick.reduce((best, entry) => strength(entry.card, contract, trick[0].card.suit) > strength(best.card, contract, trick[0].card.suit) ? entry : best, trick[0]);
}

export function chooseJassCpuCard({ hand, trick, contract, player, seed = 1 }) {
  const legal = legalJassCards(hand, trick, contract);
  assert(Number.isInteger(player) && player >= 0 && player <= 3, 'The CPU seat must be 0–3.');
  const ledSuit = trick[0]?.card.suit ?? legal[0].suit;
  const currentWinner = trickWinnerSoFar(trick, contract);
  const winsWith = (card) => {
    const simulated = [...trick, { player, card }];
    return trickWinnerSoFar(simulated, contract);
  };
  const ranked = legal.map((card, index) => {
    const winner = winsWith(card);
    const winning = trick.length > 0 && strength(card, contract, ledSuit) > strength(currentWinner.card, contract, ledSuit);
    const partnerAhead = currentWinner && teamOf(currentWinner.player) === teamOf(player);
    const points = trumpSuit(contract) && card.suit === contract ? TRUMP_POINTS[card.rank] : contract === 'top-down' ? TOP_POINTS[card.rank] : contract === 'bottom-up' ? BOTTOM_POINTS[card.rank] : PLAIN_POINTS[card.rank];
    const cost = points + (trumpSuit(contract) && card.suit === contract ? 2 : 0) + (card.rank === 11 ? 5 : 0);
    const score = trick.length === 0 ? strength(card, contract, ledSuit) - cost * 0.04
      : partnerAhead ? (winning ? -100 - cost : -cost)
        : winning ? 100 - cost : -cost * 0.3;
    return { card, score, tie: (Math.imul((seed >>> 0) ^ card.rank ^ SUITS.indexOf(card.suit) ^ index, 2654435761) >>> 0) };
  }).sort((a, b) => b.score - a.score || a.tie - b.tie);
  return ranked[0].card;
}

export function createJassGame({ seed = Date.now() >>> 0, deckStyle = 'french' } = {}) {
  assert(Number.isSafeInteger(seed) && seed >= 0 && seed <= 0xffffffff, 'Seed must be an unsigned 32-bit integer.');
  assert(['french', 'german'].includes(deckStyle), 'Choose French or German card suits.');
  const forehand = 0;
  const dealt = dealHands(seed, forehand);
  return Object.freeze({ version: 1, seed: seed >>> 0, rngState: dealt.state, deckStyle, round: 1, forehand, hands: dealt.hands, contract: null, bidder: forehand, trick: [], trickNumber: 0, scores: [0, 0], scorecard: [], status: 'bidding', pendingBid: 'forehand', lastMessage: 'started' });
}

export function chooseJassContractAction(game, player, contract) {
  assert(game?.status === 'bidding' && player === game.bidder, 'It is not this player’s contract choice.');
  if (contract === 'pass') {
    assert(game.pendingBid === 'forehand', 'The partner must choose a contract after a pass.');
    return Object.freeze({ ...game, bidder: (game.forehand + 2) % 4, pendingBid: 'partner', lastMessage: 'passed' });
  }
  assert(CONTRACTS.includes(contract), 'Choose a supported contract.');
  return Object.freeze({ ...game, contract, status: 'playing', leader: game.forehand, turnOrder: makeTrickOrder(game.forehand), nextIndex: 0, trick: [], trickNumber: 0, lastMessage: 'contractChosen' });
}

function beginNextRound(game) {
  const forehand = (game.forehand + 1) % 4;
  const round = game.round + 1;
  if (round > TARGET_ROUNDS) return Object.freeze({ ...game, status: 'complete', forehand, lastMessage: 'matchComplete' });
  const dealt = dealHands((game.rngState ^ Math.imul(round, 0x45d9f3b)) >>> 0, forehand);
  return Object.freeze({ ...game, rngState: dealt.state, round, forehand, hands: dealt.hands, contract: null, bidder: forehand, trick: [], trickNumber: 0, pendingBid: 'forehand', status: 'bidding', lastMessage: 'roundStarted' });
}

export function playJassCard(game, player, cardId) {
  assert(game?.status === 'playing' && game.turnOrder?.[game.nextIndex] === player, 'It is not this player’s turn.');
  const hand = game.hands[player];
  const legal = legalJassCards(hand, game.trick, game.contract);
  const card = hand.find((item) => item.id === cardId);
  assert(card && legal.some((item) => item.id === card.id), 'That card is not legal under the current trick rules.');
  const hands = game.hands.map((cards, seat) => seat === player ? cards.filter((item) => item.id !== card.id) : cards);
  const trick = [...game.trick, Object.freeze({ player, card })];
  if (trick.length < 4) return Object.freeze({ ...game, hands, trick, nextIndex: game.nextIndex + 1, lastMessage: 'cardPlayed' });
  const outcome = resolveJassTrick(trick, game.contract, game.trickNumber === 8);
  const scores = [...game.scores]; scores[outcome.team] += outcome.points;
  const trickNumber = game.trickNumber + 1;
  if (trickNumber < 9) return Object.freeze({ ...game, hands, trick, scores, trickNumber, leader: outcome.winner, turnOrder: makeTrickOrder(outcome.winner), nextIndex: 0, trick: [], lastMessage: 'trickWon', lastOutcome: outcome });
  const scorecard = [...game.scorecard, Object.freeze({ round: game.round, contract: game.contract, points: outcome.points, team0: scores[0] - (game.scorecard.reduce((sum, item) => sum + item.team0, 0)), team1: scores[1] - (game.scorecard.reduce((sum, item) => sum + item.team1, 0)) })];
  const completed = Object.freeze({ ...game, hands, trick: [], scores, scorecard, trickNumber, lastOutcome: outcome, lastMessage: 'roundComplete' });
  return beginNextRound(completed);
}

export function runJassCpuAction(game) {
  assert(game && game.status !== 'complete', 'The match is complete.');
  const player = game.status === 'bidding' ? game.bidder : game.turnOrder?.[game.nextIndex];
  assert(Number.isInteger(player) && player !== 0, 'The human player must act.');
  if (game.status === 'bidding') {
    const hand = game.hands[player];
    if (game.pendingBid === 'forehand' && player === game.forehand && contractStrength(hand, chooseJassCpuContract(hand)) < 11) return chooseJassContractAction(game, player, 'pass');
    return chooseJassContractAction(game, player, chooseJassCpuContract(hand));
  }
  const card = chooseJassCpuCard({ hand: game.hands[player], trick: game.trick, contract: game.contract, player, seed: (game.seed + game.round * 97 + game.trickNumber * 13 + player) >>> 0 });
  return playJassCard(game, player, card.id);
}

export function jassGameSummary(game) {
  assert(game && Array.isArray(game.scores) && Array.isArray(game.scorecard), 'Invalid match state.');
  return Object.freeze({ roundsPlayed: game.scorecard.length, team0: game.scores[0], team1: game.scores[1], winner: game.status === 'complete' ? (game.scores[0] === game.scores[1] ? 'draw' : game.scores[0] > game.scores[1] ? 0 : 1) : null, remaining: TARGET_ROUNDS - game.scorecard.length });
}

export function isValidJassGameState(value) {
  if (!value || value.version !== 1 || !Number.isSafeInteger(value.seed) || value.seed < 0 || value.seed > 0xffffffff || !Number.isSafeInteger(value.rngState) || value.rngState < 0 || value.rngState > 0xffffffff || !['french', 'german'].includes(value.deckStyle)) return false;
  if (!Number.isInteger(value.round) || value.round < 1 || value.round > TARGET_ROUNDS || !Number.isInteger(value.forehand) || value.forehand < 0 || value.forehand > 3) return false;
  if (!Array.isArray(value.hands) || value.hands.length !== 4 || value.hands.some((hand) => !Array.isArray(hand) || hand.length > 9 || hand.some((item) => !validCard(item)))) return false;
  if (!Array.isArray(value.trick) || value.trick.length > 3 || value.trick.some((entry) => !Number.isInteger(entry.player) || entry.player < 0 || entry.player > 3 || !validCard(entry.card))) return false;
  const remaining = [...value.hands.flat(), ...value.trick.map(({ card }) => card)];
  if (new Set(remaining.map(({ id }) => id)).size !== remaining.length) return false;
  if (!['bidding', 'playing', 'complete'].includes(value.status) || (value.contract !== null && !CONTRACTS.includes(value.contract))) return false;
  if (!Number.isInteger(value.bidder) || value.bidder < 0 || value.bidder > 3 || !['forehand', 'partner'].includes(value.pendingBid)) return false;
  if (!Array.isArray(value.scores) || value.scores.length !== 2 || value.scores.some((score) => !Number.isSafeInteger(score) || score < 0)) return false;
  if (!Array.isArray(value.scorecard) || value.scorecard.length > TARGET_ROUNDS || value.scorecard.some((row, index) => row.round !== index + 1 || !CONTRACTS.includes(row.contract) || !Number.isInteger(row.team0) || row.team0 < 0 || !Number.isInteger(row.team1) || row.team1 < 0 || row.team0 + row.team1 !== 157)) return false;
  if (value.status === 'playing' && (!CONTRACTS.includes(value.contract) || !Array.isArray(value.turnOrder) || value.turnOrder.length !== 4 || !Number.isInteger(value.nextIndex) || value.nextIndex < 0 || value.nextIndex > 3 || !Number.isInteger(value.trickNumber) || value.trickNumber < 0 || value.trickNumber > 8)) return false;
  if (value.status === 'complete' && value.scorecard.length !== TARGET_ROUNDS) return false;
  return true;
}

export const jassRules = Object.freeze({ suits: SUITS, ranks: RANKS, contracts: CONTRACTS, targetRounds: TARGET_ROUNDS, cardsPerPlayer: 9, pointsPerDeal: 157, tournament: true, melds: false, multipliers: false });
