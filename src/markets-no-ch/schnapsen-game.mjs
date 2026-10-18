export const SCHNAPSEN_RANKS = Object.freeze(['J', 'Q', 'K', '10', 'A']);
export const SCHNAPSEN_SUITS = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades']);
export const SCHNAPSEN_POINTS = Object.freeze([2, 3, 4, 10, 11]);

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const seededRandom = (seed) => {
  let state = seed >>> 0;
  return () => { state = (state + 0x6d2b79f5) >>> 0; let value = state; value = Math.imul(value ^ (value >>> 15), value | 1); value ^= value + Math.imul(value ^ (value >>> 7), value | 61); return ((value ^ (value >>> 14)) >>> 0) / 4294967296; };
};
const cardKey = (card) => `${card.suit}:${card.rank}`;
const isTrump = (game, card) => card.suit === game.trumpSuit;

export function createSchnapsenDeck(seed = 1) {
  const cards = SCHNAPSEN_SUITS.flatMap((_, suit) => SCHNAPSEN_RANKS.map((_, rank) => ({ id: suit * 5 + rank, suit, rank })));
  const random = seededRandom(seed);
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [cards[index], cards[swap]] = [cards[swap], cards[index]];
  }
  return cards;
}

export function createSchnapsenGame({ seed = Date.now() >>> 0, dealer = (seed >>> 0) % 2, gamePoints = [7, 7] } = {}) {
  assert(Number.isInteger(dealer) && dealer >= 0 && dealer <= 1, 'Dealer must be one of two players.');
  assert(Array.isArray(gamePoints) && gamePoints.length === 2 && gamePoints.every((score) => Number.isInteger(score) && score >= 0 && score <= 7), 'Match points must be between zero and seven.');
  const deck = createSchnapsenDeck(seed);
  const hands = [[], []];
  for (let index = 0; index < 10; index += 1) hands[(dealer + 1 + index) % 2].push(deck[index]);
  const trumpCard = deck[19];
  return {
    hands, dealer, leader: 1 - dealer, toMove: 1 - dealer, trumpSuit: trumpCard.suit, trumpCard,
    stock: deck.slice(10, 19), closed: false, phase: 'open', status: 'playing', trick: [], tricks: [],
    points: [0, 0], tricksWon: [0, 0], gamePoints: [...gamePoints], pendingMarriage: [0, 0],
    pendingLead: null, marriageEvents: [], closeSnapshot: null, seed: seed >>> 0,
  };
}

export function schnapsenCardCount(game) {
  return game.hands.flat().length + game.trick.length + game.tricks.flat().reduce((sum, trick) => sum + trick.plays.length, 0)
    + game.stock.length + Number(Boolean(game.trumpCard));
}

function beats(card, current, lead, game) {
  const cardTrump = isTrump(game, card); const currentTrump = isTrump(game, current);
  if (cardTrump !== currentTrump) return cardTrump;
  if (cardTrump) return card.rank > current.rank;
  if (card.suit !== lead.suit) return false;
  if (current.suit !== lead.suit) return true;
  return card.rank > current.rank;
}

export function winningSchnapsenPlay(plays, game) {
  assert(Array.isArray(plays) && plays.length > 0, 'A trick needs at least one card.');
  const lead = plays[0].card;
  return plays.reduce((winner, play) => beats(play.card, winner.card, lead, game) ? play : winner);
}

export function legalSchnapsenCards(game, seat) {
  const hand = game.hands[seat] ?? [];
  if (!hand.length || !game.trick.length) return [...hand];
  if (game.phase === 'open') return [...hand];
  const lead = game.trick[0].card;
  const sameSuit = hand.filter((card) => card.suit === lead.suit);
  if (sameSuit.length) {
    const higher = sameSuit.filter((card) => beats(card, lead, lead, game));
    return higher.length ? higher : sameSuit;
  }
  if (!isTrump(game, lead)) {
    const trumps = hand.filter((card) => isTrump(game, card));
    return trumps.length ? trumps : [...hand];
  }
  return [...hand];
}

export function canExchangeSchnapsenTrumpJack(game, seat) {
  return Boolean(game?.status === 'playing' && game.toMove === seat && !game.trick.length && !game.pendingLead && game.stock.length > 0 && game.trumpCard
    && game.hands[seat]?.some((card) => card.suit === game.trumpSuit && card.rank === 0));
}

export function exchangeSchnapsenTrumpJack(game, seat) {
  assert(canExchangeSchnapsenTrumpJack(game, seat), 'The trump jack exchange is not available.');
  const hand = game.hands[seat]; const jackIndex = hand.findIndex((card) => card.suit === game.trumpSuit && card.rank === 0);
  const jack = hand[jackIndex]; hand[jackIndex] = game.trumpCard; game.trumpCard = jack;
  return game;
}

export function canCloseSchnapsenTalon(game, seat) {
  return Boolean(game?.status === 'playing' && game.toMove === seat && game.tricks.length > 0 && !game.trick.length && !game.pendingLead && !game.closed && game.stock.length > 0 && game.trumpCard
    && game.hands[seat]?.length === 5 && game.hands[1 - seat]?.length === 5);
}

export function closeSchnapsenTalon(game, seat) {
  assert(canCloseSchnapsenTalon(game, seat), 'The talon cannot be closed now.');
  const opponent = 1 - seat;
  game.closed = true; game.phase = 'strict'; game.closeSnapshot = { closer: seat, opponentPoints: game.points[opponent], opponentTricks: game.tricksWon[opponent] };
  return game;
}

export function availableSchnapsenMarriage(game, seat) {
  if (!game || game.status !== 'playing' || game.toMove !== seat || game.trick.length || game.pendingLead) return [];
  const hand = game.hands[seat] ?? [];
  return SCHNAPSEN_SUITS.map((_, suit) => ({ suit, ranks: [1, 2] }))
    .filter(({ suit, ranks }) => ranks.every((rank) => hand.some((card) => card.suit === suit && card.rank === rank)))
    .map(({ suit }) => ({ suit, points: suit === game.trumpSuit ? 40 : 20 }));
}

export function declareSchnapsenMarriage(game, seat, suit) {
  const marriage = availableSchnapsenMarriage(game, seat).find((entry) => entry.suit === suit);
  assert(marriage, 'A marriage is not available in that suit.');
  game.pendingMarriage[seat] += marriage.points;
  game.marriageEvents.push({ seat, suit, points: marriage.points, trick: game.tricks.length + 1, counted: false });
  game.pendingLead = { seat, suit, ids: game.hands[seat].filter((card) => card.suit === suit && (card.rank === 1 || card.rank === 2)).map((card) => card.id) };
  return game;
}

function awardHand(game, winner, reason, failedCloser = false) {
  const loser = 1 - winner;
  let won;
  if (failedCloser && game.closeSnapshot) won = game.closeSnapshot.opponentTricks === 0 ? 3 : 2;
  else if (game.closeSnapshot && game.closeSnapshot.closer === winner) {
    won = game.closeSnapshot.opponentTricks === 0 ? 3 : game.closeSnapshot.opponentPoints < 33 ? 2 : 1;
  } else won = game.tricksWon[loser] === 0 ? 3 : game.points[loser] < 33 ? 2 : 1;
  game.gamePoints[winner] = Math.max(0, game.gamePoints[winner] - won);
  game.result = { winner, gamePointsWon: won, reason, points: [...game.points], tricks: [...game.tricksWon], matchWinner: game.gamePoints[winner] === 0 ? winner : null };
  game.status = game.gamePoints[winner] === 0 ? 'matchComplete' : 'handComplete'; game.phase = 'complete';
  return game.result;
}

export function claimSchnapsen66(game, seat) {
  assert(game?.status === 'playing' && game.toMove === seat && (game.tricks.length > 0 || game.pendingMarriage[seat] > 0), 'A 66 claim is only allowed after winning a trick or declaring a marriage.');
  const points = game.points[seat] + game.pendingMarriage[seat];
  assert(points >= 66, 'Your counted points have not reached 66.');
  const opponentWonAgainstCloser = game.closeSnapshot && game.closeSnapshot.closer !== seat;
  return awardHand(game, seat, '66', Boolean(opponentWonAgainstCloser));
}

function completeTrick(game) {
  const plays = [...game.trick]; const winner = winningSchnapsenPlay(plays, game).seat;
  const value = plays.reduce((sum, play) => sum + SCHNAPSEN_POINTS[play.card.rank], 0);
  game.points[winner] += value + game.pendingMarriage[winner];
  if (game.pendingMarriage[winner]) {
    for (const event of game.marriageEvents) if (event.seat === winner && !event.counted) event.counted = true;
    game.pendingMarriage[winner] = 0;
  }
  game.tricksWon[winner] += 1; game.tricks.push({ plays, winner, points: value }); game.trick = [];
  game.leader = winner; game.toMove = winner;
  if (game.stock.length >= 2) {
    game.hands[winner].push(game.stock.pop()); game.hands[1 - winner].push(game.stock.pop());
  } else if (game.stock.length === 1 && game.trumpCard) {
    game.hands[winner].push(game.stock.pop()); game.hands[1 - winner].push(game.trumpCard); game.trumpCard = null;
  } else {
    game.phase = 'strict';
  }
  if (!game.trumpCard && game.stock.length === 0) game.phase = 'strict';
  if (game.tricks.length === 10 && game.points[winner] < 66) {
    if (game.closeSnapshot) awardHand(game, 1 - game.closeSnapshot.closer, 'failed-close', true);
    else awardHand(game, winner, 'last-trick');
  }
  return game;
}

export function playSchnapsenCard(game, seat, id) {
  assert(game?.status === 'playing' && game.toMove === seat, 'It is not your turn.');
  const hand = game.hands[seat]; const index = hand.findIndex((card) => card.id === id);
  assert(index >= 0, 'Choose a card from your hand.');
  if (game.pendingLead && (game.pendingLead.seat !== seat || !game.pendingLead.ids.includes(id))) throw new Error('Lead one of the cards in the declared marriage.');
  assert(legalSchnapsenCards(game, seat).some((card) => card.id === id), 'That card is not legal in this phase.');
  const [card] = hand.splice(index, 1); game.trick.push({ seat, card }); game.pendingLead = null;
  if (game.trick.length === 1) game.toMove = 1 - seat;
  else completeTrick(game);
  return game;
}

export function chooseSchnapsenCpuCard(game, seat) {
  assert(game?.status === 'playing' && game.toMove === seat, 'It is not the computer’s turn.');
  const legal = legalSchnapsenCards(game, seat); const opponent = 1 - seat;
  if (game.trick.length) {
    const current = winningSchnapsenPlay(game.trick, game);
    return [...legal].sort((a, b) => {
      const aWins = beats(a, current.card, game.trick[0].card, game);
      const bWins = beats(b, current.card, game.trick[0].card, game);
      const aCost = SCHNAPSEN_POINTS[a.rank] + Number(isTrump(game, a)) * 5 - (aWins && current.seat === opponent ? 18 : 0);
      const bCost = SCHNAPSEN_POINTS[b.rank] + Number(isTrump(game, b)) * 5 - (bWins && current.seat === opponent ? 18 : 0);
      return aCost - bCost || a.id - b.id;
    })[0].id;
  }
  return [...legal].sort((a, b) => {
    const aCost = SCHNAPSEN_POINTS[a.rank] + Number(isTrump(game, a)) * 4 - Number(a.rank === 0) * 2;
    const bCost = SCHNAPSEN_POINTS[b.rank] + Number(isTrump(game, b)) * 4 - Number(b.rank === 0) * 2;
    return aCost - bCost || a.id - b.id;
  })[0].id;
}

export function playSchnapsenCpuTurn(game, seat) {
  if (game.points[seat] + game.pendingMarriage[seat] >= 66 && game.tricks.length > 0) {
    claimSchnapsen66(game, seat);
    return game;
  }
  if (game.pendingLead?.seat === seat) return playSchnapsenCard(game, seat, game.pendingLead.ids[0]);
  return playSchnapsenCard(game, seat, chooseSchnapsenCpuCard(game, seat));
}
