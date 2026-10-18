export const CANASTA_HAND_SIZE = 15;
export const CANASTA_TARGET_SCORE = 5000;
export const CANASTA_CARD_POINTS = Object.freeze([20, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 20, 50]);

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const isWild = (card) => card.rank === 0 || card.rank === 13;
const isRedThree = (card) => card.rank === 1 && (card.suit === 0 || card.suit === 1);
const isBlackThree = (card) => card.rank === 1 && (card.suit === 2 || card.suit === 3);
const cardPoints = (card) => CANASTA_CARD_POINTS[card.rank];
const cloneCard = (card) => ({ ...card });
const seedRandom = (seed) => {
  let state = seed >>> 0;
  return () => { state = (state + 0x6d2b79f5) >>> 0; let t = state; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};

export function createCanastaDeck(seed = 1) {
  const deck = [];
  let id = 0;
  for (let pack = 0; pack < 2; pack += 1) {
    for (let suit = 0; suit < 4; suit += 1) {
      for (let rank = 0; rank < 13; rank += 1) deck.push({ id: id++, rank, suit, pack });
    }
    for (let joker = 0; joker < 2; joker += 1) deck.push({ id: id++, rank: 13, suit: null, pack });
  }
  const random = seedRandom(seed);
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}

export function openingMeldRequirement(score = 0) {
  if (score >= 5000) return 150;
  if (score >= 3000) return 120;
  if (score >= 1500) return 90;
  return 50;
}

export function createCanastaGame({ seed = Date.now() >>> 0, scores = [0, 0] } = {}) {
  assert(Array.isArray(scores) && scores.length === 2 && scores.every((score) => Number.isInteger(score) && score >= 0), 'Scores must be two non-negative whole numbers.');
  const deck = createCanastaDeck(seed);
  const hands = [deck.splice(0, CANASTA_HAND_SIZE), deck.splice(0, CANASTA_HAND_SIZE)];
  const redThreeCards = hands.map((hand) => hand.filter(isRedThree));
  const redThrees = redThreeCards.map((cards) => cards.length);
  for (let player = 0; player < 2; player += 1) {
    for (const card of redThreeCards[player]) {
      hands[player].splice(hands[player].findIndex((held) => held.id === card.id), 1);
      hands[player].push(deck.pop());
    }
  }
  const discard = [deck.shift()];
  const frozen = isWild(discard[0]) || isBlackThree(discard[0]);
  return {
    hands, stock: deck, discard, frozen, melds: [[], []], scores: [...scores], toMove: 0,
    phase: 'draw', status: 'playing', winner: null, seed: seed >>> 0, round: 1,
    redThrees, redThreeCards,
    lastAction: 'deal',
  };
}

export function canastaCardCount(game) {
  return game.hands.flat().length + game.stock.length + game.discard.length + game.redThreeCards.flat().length + game.melds.flat().reduce((sum, meld) => sum + meld.cards.length, 0);
}

export function canastaMeldPoints(meld) {
  return meld.cards.reduce((sum, card) => sum + cardPoints(card), 0)
    + (meld.cards.length >= 7 ? (meld.cards.some(isWild) ? 300 : 500) : 0);
}

export function legalCanastaMeld(game, player, rank, cardIds) {
  if (!game || game.status !== 'playing' || game.phase !== 'meld' || player !== game.toMove || !Number.isInteger(rank) || !Array.isArray(cardIds)) return false;
  if (rank === 1 || rank < 0 || rank > 12) return false; // Threes are never melded in this version.
  const hand = game.hands[player];
  if (new Set(cardIds).size !== cardIds.length) return false;
  const cards = cardIds.map((id) => hand.find((card) => card.id === id));
  if (cards.some((card) => !card || (!isWild(card) && card.rank !== rank))) return false;
  const existing = game.melds[player].find((meld) => meld.rank === rank);
  if (cardIds.length < (existing ? 1 : 3)) return false;
  const combined = [...(existing?.cards ?? []), ...cards];
  const combinedNaturals = combined.filter((card) => !isWild(card)).length;
  const combinedWilds = combined.length - combinedNaturals;
  if (combinedNaturals < 2 || combinedWilds > 3 || combinedWilds > combinedNaturals) return false;
  if (existing && (existing.cards.some(isWild) || existing.cards.length >= 7) && cards.some(isWild)) return false;
  const otherCanastaExists = game.melds[player].some((meld) => meld.cards.length >= 7);
  const createsCanasta = combined.length >= 7;
  if (hand.length - cardIds.length < 2 && !otherCanastaExists && !createsCanasta) return false;
  const opening = game.melds[player].length === 0;
  const currentOpenPoints = game.melds[player].reduce((sum, meld) => sum + canastaMeldPoints(meld), 0);
  if (opening && currentOpenPoints + cards.reduce((sum, card) => sum + cardPoints(card), 0) < openingMeldRequirement(game.scores[player])) return false;
  return true;
}

function transferRedThrees(game, player, cards) {
  const count = cards.filter(isRedThree).length;
  if (!count) return;
  game.redThrees[player] += count;
  // Red threes are bonus cards, never part of a playable meld; replace each with one stock card.
  for (const card of cards.filter(isRedThree)) {
    const index = game.hands[player].findIndex((held) => held.id === card.id);
    if (index >= 0) {
      game.hands[player].splice(index, 1);
      game.redThreeCards[player].push(card);
    }
    if (game.stock.length) game.hands[player].push(game.stock.pop());
  }
}

function normalizeRound(game, reason, outPlayer = null) {
  const roundPoints = [0, 0];
  for (let player = 0; player < 2; player += 1) {
    roundPoints[player] += game.melds[player].reduce((sum, meld) => sum + canastaMeldPoints(meld), 0);
    roundPoints[player] += game.redThrees[player] * (game.melds[player].length ? 100 : -100);
    roundPoints[player] -= game.hands[player].reduce((sum, card) => sum + cardPoints(card), 0);
  }
  if (outPlayer !== null) roundPoints[outPlayer] += 100;
  game.scores = game.scores.map((score, player) => score + roundPoints[player]);
  game.roundPoints = roundPoints;
  game.status = game.scores.some((score) => score >= CANASTA_TARGET_SCORE) ? 'complete' : reason;
  if (game.status === 'complete') game.winner = game.scores[0] === game.scores[1] ? null : game.scores[0] > game.scores[1] ? 0 : 1;
  game.phase = 'roundEnd';
  game.lastAction = 'roundEnd';
}

export function drawCanastaStock(game, player) {
  assert(game?.status === 'playing' && game.phase === 'draw' && game.toMove === player, 'It is not this player’s draw phase.');
  if (game.stock.length < 2) { normalizeRound(game, 'stockEmpty'); return game; }
  const drawn = [game.stock.pop(), game.stock.pop()];
  game.hands[player].push(...drawn);
  transferRedThrees(game, player, drawn);
  game.phase = 'meld';
  game.lastAction = 'drawStock';
  return game;
}

export function takeCanastaDiscardPile(game, player) {
  assert(game?.status === 'playing' && game.phase === 'draw' && game.toMove === player, 'It is not this player’s draw phase.');
  const top = game.discard.at(-1);
  assert(top && !isWild(top) && !isBlackThree(top), 'The discard pile cannot be taken while its top card is a wild card or black three.');
  const naturalMatches = game.hands[player].filter((card) => card.rank === top.rank).length;
  assert(naturalMatches >= 2, 'To take the pile, hold two natural cards matching its top card.');
  const matchingIds = game.hands[player].filter((card) => card.rank === top.rank).slice(0, 2).map((card) => card.id);
  const pile = [...game.discard];
  const opening = game.melds[player].length === 0;
  const matchedCards = [...matchingIds.map((id) => game.hands[player].find((card) => card.id === id)), top];
  const openingPoints = matchedCards.reduce((sum, card) => sum + cardPoints(card), 0);
  assert(!opening || openingPoints >= openingMeldRequirement(game.scores[player]), 'Taking the pile must satisfy your opening requirement.');
  game.hands[player].push(...pile);
  game.discard = [];
  game.frozen = false;
  game.phase = 'meld';
  game.lastAction = 'takeDiscard';
  return game;
}

export function playCanastaMeld(game, player, rank, cardIds) {
  assert(legalCanastaMeld(game, player, rank, cardIds), 'That meld is not legal under this version’s rules.');
  const hand = game.hands[player];
  const cards = cardIds.map((id) => hand.find((card) => card.id === id));
  for (const id of cardIds) hand.splice(hand.findIndex((card) => card.id === id), 1);
  const meld = game.melds[player].find((entry) => entry.rank === rank);
  if (meld) meld.cards.push(...cards); else game.melds[player].push({ rank, cards });
  game.lastAction = 'meld';
  if (!hand.length && game.melds[player].some((entry) => entry.cards.length >= 7)) normalizeRound(game, 'roundComplete', player);
  return game;
}

export function discardCanastaCard(game, player, cardId) {
  assert(game?.status === 'playing' && game.phase === 'meld' && game.toMove === player, 'It is not this player’s discard phase.');
  const hand = game.hands[player];
  const index = hand.findIndex((card) => card.id === cardId);
  assert(index >= 0, 'Choose a card from your hand.');
  if (hand.length === 1 && !game.melds[player].some((meld) => meld.cards.length >= 7)) throw new Error('You need a canasta before you can go out.');
  const [card] = hand.splice(index, 1);
  game.discard.push(card);
  game.frozen = isWild(card) || isBlackThree(card);
  const wentOut = hand.length === 0;
  if (wentOut) normalizeRound(game, 'roundComplete', player);
  else if (game.stock.length < 2) normalizeRound(game, 'stockEmpty');
  else { game.toMove = 1 - player; game.phase = 'draw'; }
  game.lastAction = wentOut ? 'wentOut' : 'discard';
  return game;
}

export function chooseCanastaCpuAction(game) {
  if (!game || game.status !== 'playing' || game.toMove !== 1) return null;
  if (game.phase === 'draw') return game.discard.length && !game.frozen
    ? null : { type: 'drawStock' };
  if (game.phase !== 'meld') return null;
  const hand = game.hands[1];
  const grouped = new Map();
  for (const card of hand) if (!isWild(card) && card.rank !== 1) grouped.set(card.rank, [...(grouped.get(card.rank) ?? []), card]);
  const possible = [];
  for (const [rank, naturals] of grouped) {
    const wilds = hand.filter(isWild);
    const existing = game.melds[1].find((meld) => meld.rank === rank);
    const needed = Math.max(0, 3 - (existing?.cards.length ?? 0) - naturals.length);
    const chosen = [...naturals, ...wilds.slice(0, needed)];
    const ids = chosen.map((card) => card.id);
    if (chosen.length >= (existing ? 1 : 3) && legalCanastaMeld(game, 1, rank, ids)) possible.push({ type: 'meld', rank, cardIds: ids });
  }
  if (possible.length) return possible.sort((a, b) => b.cardIds.length - a.cardIds.length)[0];
  const discardable = hand.filter((card) => !(hand.length === 1 && !game.melds[1].some((meld) => meld.cards.length >= 7)));
  if (!discardable.length) return null;
  const card = [...discardable].sort((a, b) => cardPoints(a) - cardPoints(b))[0];
  return { type: 'discard', cardId: card.id };
}

export function playCanastaCpuTurn(game) {
  if (game?.toMove !== 1 || game.status !== 'playing') return game;
  if (game.phase === 'draw') {
    // Prefer the stock to avoid giving away the pile; pile-taking is available to the human player.
    drawCanastaStock(game, 1);
  }
  let action = chooseCanastaCpuAction(game);
  while (action?.type === 'meld') {
    playCanastaMeld(game, 1, action.rank, action.cardIds);
    action = chooseCanastaCpuAction(game);
  }
  if (action?.type === 'discard') discardCanastaCard(game, 1, action.cardId);
  return game;
}

export function startNextCanastaRound(previous, seed = (previous?.seed ?? 0) + 1) {
  assert(previous && ['roundComplete', 'stockEmpty'].includes(previous.status), 'The current round must be scored before starting another.');
  assert(!previous.scores.some((score) => score >= CANASTA_TARGET_SCORE), 'The match is already complete.');
  const next = createCanastaGame({ seed, scores: previous.scores });
  next.round = (previous.round ?? 1) + 1;
  return next;
}

export const canastaCard = Object.freeze({ isWild, isRedThree, isBlackThree, points: cardPoints, label: (card) => `${card.rank}:${card.suit ?? 'joker'}:${card.pack}` });
