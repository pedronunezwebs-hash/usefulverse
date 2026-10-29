const ARGENTINA = 'argentina';
const BRAZIL = 'brazil-paulista';
const SPANISH_SUITS = ['spades', 'clubs', 'coins', 'cups'];
const FRENCH_SUITS = ['clubs', 'hearts', 'spades', 'diamonds'];
const SPANISH_RANKS = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
const BRAZIL_RANKS = [4, 5, 6, 7, 10, 11, 12, 1, 2, 3];
const BRAZIL_SUIT_POWER = Object.freeze({ clubs: 4, hearts: 3, spades: 2, diamonds: 1 });
const BRAZIL_STAKES = [1, 3, 6, 9, 12];
const ARGENTINA_STAKES = [1, 2, 3, 4];

const teamOf = (player) => player % 2;

function randomInteger(max, randomIndex) {
  const value = randomIndex ? randomIndex(max) : Math.floor(Math.random() * max);
  if (!Number.isInteger(value) || value < 0 || value >= max) throw new RangeError('Random index is outside the deck.');
  return value;
}

function shuffle(values, randomIndex) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInteger(i + 1, randomIndex);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeDeck(variant) {
  const spanish = variant === ARGENTINA;
  const suits = spanish ? SPANISH_SUITS : FRENCH_SUITS;
  const ranks = spanish ? SPANISH_RANKS : BRAZIL_RANKS;
  return suits.flatMap((suit) => ranks.map((rank) => {
    const displayRank = spanish
      ? ({ 1: 'A', 10: 'S', 11: 'C', 12: 'R' })[rank] ?? String(rank)
      : ({ 1: 'A', 10: 'Q', 11: 'J', 12: 'K' })[rank] ?? String(rank);
    return Object.freeze({ id: `${suit}-${rank}`, suit, rank, displayRank });
  }));
}

export function getTrucoCardStrength(card, variant, vira = null) {
  if (variant === ARGENTINA) {
    if (card.rank === 1 && card.suit === 'spades') return 14;
    if (card.rank === 1 && card.suit === 'clubs') return 13;
    if (card.rank === 7 && card.suit === 'spades') return 12;
    if (card.rank === 7 && card.suit === 'coins') return 11;
    if (card.rank === 3) return 10;
    if (card.rank === 2) return 9;
    if (card.rank === 1) return 8;
    if (card.rank === 12) return 7;
    if (card.rank === 11) return 6;
    if (card.rank === 10) return 5;
    if (card.rank === 7) return 4;
    if (card.rank === 6) return 3;
    if (card.rank === 5) return 2;
    return 1;
  }
  if (variant !== BRAZIL || !vira) throw new RangeError('Choose a supported Truco rules profile.');
  const nextRank = BRAZIL_RANKS[(BRAZIL_RANKS.indexOf(vira.rank) + 1) % BRAZIL_RANKS.length];
  if (card.rank === nextRank) return 20 + BRAZIL_SUIT_POWER[card.suit];
  return BRAZIL_RANKS.indexOf(card.rank) + 1;
}

export function calculateArgentineEnvido(cards) {
  if (!Array.isArray(cards) || cards.length !== 3) throw new RangeError('Envido needs three cards.');
  const value = (card) => card.rank >= 10 ? 0 : card.rank;
  let best = Math.max(...cards.map(value));
  for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) {
    if (cards[i].suit === cards[j].suit) best = Math.max(best, 20 + value(cards[i]) + value(cards[j]));
  }
  return best;
}

function deal({ variant, target, names, score, handNumber, mano, randomIndex }) {
  const deck = shuffle(makeDeck(variant), randomIndex);
  const hands = Array.from({ length: 4 }, (_, player) => [deck[player], deck[player + 4], deck[player + 8]]);
  const vira = variant === BRAZIL ? deck[12] : null;
  return {
    variant, target, names: [...names], score: [...score], handNumber, mano,
    hands, vira, currentPlayer: mano, currentTrick: [], tricks: [], trickWins: [0, 0],
    stake: 1, stakeIndex: 0, offer: null, envidoUsed: false, handClosed: false,
    handWinner: null, matchWinner: null, lastResult: null,
  };
}

export function startTrucoGame({ variant = ARGENTINA, target = variant === BRAZIL ? 12 : 30, playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'], randomIndex } = {}) {
  if (![ARGENTINA, BRAZIL].includes(variant)) throw Object.assign(new RangeError('Choose a supported rules profile.'), { code: 'invalid-variant' });
  if (![12, 15, 30].includes(Number(target))) throw Object.assign(new RangeError('Choose a target of 12, 15 or 30 points.'), { code: 'invalid-target' });
  if (!Array.isArray(playerNames) || playerNames.length !== 4 || playerNames.some((name) => !String(name).trim() || String(name).length > 20)) throw Object.assign(new RangeError('Enter four player names up to 20 characters.'), { code: 'invalid-names' });
  return deal({ variant, target: Number(target), names: playerNames.map((name) => String(name).trim()), score: [0, 0], handNumber: 1, mano: 0, randomIndex });
}

function checkActiveTurn(state, player) {
  if (!state || state.handClosed || state.matchWinner !== null || state.offer || state.currentPlayer !== player || ![0, 1, 2, 3].includes(player)) {
    throw Object.assign(new RangeError('This action is not available in the current game state.'), { code: 'invalid-action' });
  }
}

export function callArgentineEnvido(state, player = state?.currentPlayer) {
  checkActiveTurn(state, player);
  if (state.variant !== ARGENTINA || state.envidoUsed || state.tricks.length || state.currentTrick.length) throw Object.assign(new RangeError('Envido is only available once before the first card in the Argentine profile.'), { code: 'envido-unavailable' });
  return { ...state, envidoUsed: true, offer: { type: 'envido', caller: player, responder: (player + 1) % 4, previousStake: 0, proposedStake: 2 }, currentPlayer: (player + 1) % 4, lastResult: { code: 'envido-called', player } };
}

export function callNextTrucoStake(state, player = state?.currentPlayer) {
  checkActiveTurn(state, player);
  const stakes = state.variant === ARGENTINA ? ARGENTINA_STAKES : BRAZIL_STAKES;
  const nextIndex = state.stakeIndex + 1;
  if (nextIndex >= stakes.length) throw Object.assign(new RangeError('The highest Truco call has already been reached.'), { code: 'no-higher-call' });
  return { ...state, offer: { type: 'truco', caller: player, responder: (player + 1) % 4, previousStake: state.stake, proposedStake: stakes[nextIndex], level: nextIndex }, currentPlayer: (player + 1) % 4, lastResult: { code: 'truco-called', player, stake: stakes[nextIndex] } };
}

function scorePoint(state, winnerTeam, points) {
  const score = [...state.score]; score[winnerTeam] += points;
  return { score, matchWinner: score[winnerTeam] >= state.target ? winnerTeam : null };
}

export function respondToTrucoOffer(state, player, accept) {
  if (!state?.offer || state.offer.responder !== player || state.currentPlayer !== player || state.handClosed) throw Object.assign(new RangeError('There is no offer for this player to answer.'), { code: 'invalid-response' });
  const offer = state.offer;
  const callerTeam = teamOf(offer.caller);
  if (offer.type === 'envido') {
    if (!accept) {
      const result = scorePoint(state, callerTeam, 1);
      return { ...state, ...result, offer: null, currentPlayer: offer.caller, lastResult: { code: 'envido-declined', winner: callerTeam, points: 1 } };
    }
    const values = [0, 1].map((team) => Math.max(...state.hands.filter((_, playerIndex) => teamOf(playerIndex) === team).map(calculateArgentineEnvido)));
    const winner = values[0] === values[1] ? teamOf(state.mano) : values[0] > values[1] ? 0 : 1;
    const result = scorePoint(state, winner, 2);
    return { ...state, ...result, offer: null, currentPlayer: offer.caller, lastResult: { code: 'envido-accepted', winner, points: 2, values } };
  }
  if (!accept) {
    const result = scorePoint(state, callerTeam, offer.previousStake);
    return { ...state, ...result, offer: null, handClosed: true, handWinner: callerTeam, lastResult: { code: 'truco-declined', winner: callerTeam, points: offer.previousStake } };
  }
  return { ...state, offer: null, stake: offer.proposedStake, stakeIndex: offer.level, currentPlayer: offer.caller, lastResult: { code: 'truco-accepted', player: offer.caller, stake: offer.proposedStake } };
}

function awardHand(state, winnerTeam) {
  const result = scorePoint(state, winnerTeam, state.stake);
  return { ...state, ...result, handClosed: true, handWinner: winnerTeam, lastResult: { code: 'hand-won', winner: winnerTeam, points: state.stake } };
}

export function playTrucoCard(state, player, cardId) {
  checkActiveTurn(state, player);
  const hand = state.hands[player];
  const index = hand.findIndex((card) => card.id === cardId);
  if (index < 0) throw Object.assign(new RangeError('Choose a card in the active hand.'), { code: 'invalid-card' });
  const card = hand[index];
  const hands = state.hands.map((cards) => [...cards]); hands[player].splice(index, 1);
  const currentTrick = [...state.currentTrick, { player, card }];
  if (currentTrick.length < 4) return { ...state, hands, currentTrick, currentPlayer: (player + 1) % 4, lastResult: { code: 'card-played', player } };
  const strengths = currentTrick.map(({ card: played }) => getTrucoCardStrength(played, state.variant, state.vira));
  const best = Math.max(...strengths);
  const topPlays = currentTrick.filter((_, index) => strengths[index] === best);
  const topTeams = new Set(topPlays.map(({ player: seat }) => teamOf(seat)));
  const winnerTeam = topTeams.size === 1 ? [...topTeams][0] : null;
  const winnerSeat = winnerTeam === null ? state.mano : topPlays[0].player;
  const wins = [...state.trickWins]; if (winnerTeam !== null) wins[winnerTeam]++;
  const tricks = [...state.tricks, { plays: currentTrick, winner: winnerTeam, leader: winnerSeat }];
  const resolved = { ...state, hands, tricks, trickWins: wins, currentTrick: [], currentPlayer: winnerSeat, lastResult: { code: 'trick-won', winner: winnerTeam, trick: tricks.length } };
  if (winnerTeam !== null && wins[winnerTeam] >= 2) return awardHand(resolved, winnerTeam);
  if (tricks.length >= 3) {
    const firstDecisiveTrick = tricks.find((trick) => trick.winner !== null);
    if (!firstDecisiveTrick && state.variant === BRAZIL) return { ...resolved, handClosed: true, handWinner: null, lastResult: { code: 'all-tied' } };
    return awardHand(resolved, firstDecisiveTrick?.winner ?? teamOf(state.mano));
  }
  return resolved;
}

export function startNextTrucoHand(state, randomIndex) {
  if (!state || !state.handClosed || state.matchWinner !== null) throw Object.assign(new RangeError('The current hand is not ready to restart.'), { code: 'invalid-action' });
  return deal({ variant: state.variant, target: state.target, names: state.names, score: state.score, handNumber: state.handNumber + 1, mano: (state.mano + 1) % 4, randomIndex });
}
