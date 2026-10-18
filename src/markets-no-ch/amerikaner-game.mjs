const SUITS = Object.freeze(['spades', 'hearts', 'diamonds', 'clubs']);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function randomFor(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createAmerikanerDeck(seed = 1, players = 4) {
  assert(Number.isInteger(players) && players >= 3 && players <= 6, 'Choose 3 to 6 players.');
  const twosToRemove = players === 3 ? 1 : players === 5 ? 2 : players === 6 ? 4 : 0;
  const deck = [];
  for (let suit = 0; suit < SUITS.length; suit += 1) {
    for (let rank = 2; rank <= 14; rank += 1) {
      if (rank === 2 && suit < twosToRemove) continue;
      deck.push({ id: `${suit}-${rank}`, suit, rank });
    }
  }
  const random = randomFor(seed);
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealRound(game, seed) {
  const deck = createAmerikanerDeck(seed, game.players.length);
  const hands = Array.from({ length: game.players.length }, () => []);
  deck.forEach((card, index) => hands[index % hands.length].push(card));
  game.players.forEach((player, index) => { player.hand = hands[index]; player.tricks = 0; });
  game.removedTwos = 52 - deck.length;
  game.deckSize = deck.length;
  game.currentBid = null;
  game.passed = [];
  game.bidOrder = Array.from({ length: game.players.length }, (_, offset) => (game.dealer + 1 + offset) % game.players.length);
  game.bidCursor = 0;
  game.turn = game.bidOrder[0];
  game.trick = [];
  game.trickNumber = 0;
  game.captured = [];
  game.partnerId = null;
  game.trumpSuit = null;
  game.requestedCardId = null;
  game.lastAction = 'dealt';
  game.status = 'bidding';
  return game;
}

export function createAmerikanerGame({ seed = Date.now() >>> 0, players = 4 } = {}) {
  assert(Number.isInteger(players) && players >= 3 && players <= 6, 'Choose 3 to 6 players.');
  const game = {
    players: Array.from({ length: players }, (_, id) => ({ id, hand: [], score: 0, tricks: 0 })),
    dealer: 0, round: 1, seed: seed >>> 0, deckSize: 0, removedTwos: 0, captured: [],
    status: 'bidding', winner: null, winners: [], currentBid: null, passed: [], bidOrder: [], bidCursor: 0,
    turn: 0, trick: [], trickNumber: 0, partnerId: null, trumpSuit: null, requestedCardId: null,
    declarerTricks: 0, lastAction: 'dealt', lastResult: null,
  };
  return dealRound(game, (seed >>> 0) || 1);
}

export function amerikanerInventory(game) {
  return game.players.reduce((sum, player) => sum + player.hand.length, 0) + game.trick.length + (game.captured?.length ?? 0);
}

function nextBidder(game) {
  for (let attempts = 0; attempts < game.bidOrder.length; attempts += 1) {
    const playerId = game.bidOrder[game.bidCursor];
    if (!game.passed.includes(playerId)) return playerId;
    game.bidCursor = (game.bidCursor + 1) % game.bidOrder.length;
  }
  return null;
}

function advanceBid(game) {
  game.bidCursor = (game.bidCursor + 1) % game.bidOrder.length;
  const eligible = game.players.length - game.passed.length;
  if (!game.currentBid && eligible === 0) {
    game.round += 1;
    game.dealer = (game.dealer + 1) % game.players.length;
    game.seed = (game.seed + 1) >>> 0;
    game.lastAction = 'allPassed';
    dealRound(game, game.seed || 1);
    return;
  }
  if (game.currentBid && (game.currentBid.type === 'americaner' || eligible === 1)) {
    game.status = 'lead';
    game.turn = game.currentBid.playerId;
    game.lastAction = 'declarer';
    return;
  }
  game.turn = nextBidder(game);
}

export function amerikanerBid(game, { playerId = game?.turn, bid = 'pass' } = {}) {
  assert(game?.status === 'bidding', 'The game is not waiting for a bid.');
  assert(playerId === game.turn && !game.passed.includes(playerId), 'It is not this player’s bidding turn.');
  if (bid === 'pass') {
    game.passed.push(playerId);
    game.lastAction = 'passed';
    advanceBid(game);
    return game;
  }
  const handSize = game.players[playerId].hand.length;
  const minimum = Math.ceil(handSize / 2);
  const maximum = handSize;
  if (bid === 'americaner') {
    game.currentBid = { playerId, type: 'americaner', tricks: handSize };
    game.lastAction = 'americanerBid';
    advanceBid(game);
    return game;
  }
  assert(Number.isInteger(bid) && bid >= minimum && bid <= maximum, `Bid from ${minimum} to ${maximum}, or pass.`);
  assert(!game.currentBid || game.currentBid.type !== 'americaner', 'Americaner already ends the bidding.');
  assert(!game.currentBid || bid > game.currentBid.tricks, 'A bid must beat the current bid.');
  game.currentBid = { playerId, type: 'tricks', tricks: bid };
  game.lastAction = 'bid';
  advanceBid(game);
  return game;
}

export function amerikanerLead(game, { cardId, requestedCardId = null } = {}) {
  assert(game?.status === 'lead' && (game.trickNumber > 0 || game.turn === game.currentBid.playerId), 'The correct player is not choosing a lead.');
  const player = game.players[game.turn];
  const card = player.hand.find(({ id }) => id === cardId);
  assert(card, 'Choose a card from the declarer’s hand.');
  const isAmericaner = game.currentBid.type === 'americaner';
  if (!isAmericaner) {
    const wanted = game.players.flatMap(({ hand }) => hand).find(({ id }) => id === requestedCardId);
    assert(wanted && wanted.suit === card.suit && !player.hand.some(({ id }) => id === requestedCardId), 'Request an in-play card of the led suit that is not in the declarer’s hand.');
    game.requestedCardId = requestedCardId;
    game.trumpSuit = card.suit;
  } else {
    game.requestedCardId = null;
    game.trumpSuit = null;
  }
  game.trick = [{ playerId: game.turn, card }];
  player.hand.splice(player.hand.indexOf(card), 1);
  game.status = 'playing';
  game.turn = (game.turn + 1) % game.players.length;
  game.lastAction = 'leadPlayed';
  if (game.trick.length === game.players.length) resolveTrick(game);
  return game;
}

export function legalAmerikanerCards(game, playerId = game?.turn) {
  const player = game?.players?.[playerId];
  if (!player || game.status !== 'playing' || game.turn !== playerId) return [];
  if (game.trickNumber === 0 && game.requestedCardId && player.hand.some(({ id }) => id === game.requestedCardId)) {
    return player.hand.filter(({ id }) => id === game.requestedCardId);
  }
  const ledSuit = game.trick[0]?.card.suit;
  const following = player.hand.filter(({ suit }) => suit === ledSuit);
  return following.length ? following : player.hand;
}

function compareCards(game, candidate, incumbent, ledSuit) {
  const candidateTrump = game.trumpSuit !== null && candidate.suit === game.trumpSuit;
  const incumbentTrump = game.trumpSuit !== null && incumbent.suit === game.trumpSuit;
  if (candidateTrump !== incumbentTrump) return candidateTrump ? 1 : -1;
  if (candidate.suit !== incumbent.suit) return candidate.suit === ledSuit ? 1 : -1;
  return Math.sign(candidate.rank - incumbent.rank);
}

function resolveTrick(game) {
  const ledSuit = game.trick[0].card.suit;
  let winningPlay = game.trick[0];
  for (const play of game.trick.slice(1)) {
    if (compareCards(game, play.card, winningPlay.card, ledSuit) > 0) winningPlay = play;
  }
  game.players[winningPlay.playerId].tricks += 1;
  game.turn = winningPlay.playerId;
  game.captured.push(...game.trick.map(({ card }) => card));
  game.trick = [];
  game.trickNumber += 1;
  game.lastAction = 'trickWon';
  if (game.trickNumber === game.deckSize / game.players.length) scoreRound(game);
  else game.status = 'lead';
  return game;
}

export function amerikanerPlay(game, { playerId = game?.turn, cardId } = {}) {
  assert(game?.status === 'playing' && playerId === game.turn, 'It is not this player’s card turn.');
  const allowed = legalAmerikanerCards(game, playerId);
  const card = allowed.find(({ id }) => id === cardId);
  assert(card, 'That card is not legal; follow suit or play the requested partner card.');
  if (game.currentBid.type === 'tricks' && game.trickNumber === 0 && card.id === game.requestedCardId) game.partnerId = playerId;
  game.trick.push({ playerId, card });
  game.players[playerId].hand.splice(game.players[playerId].hand.findIndex(({ id }) => id === cardId), 1);
  if (game.trick.length === game.players.length) resolveTrick(game);
  else game.turn = (game.turn + 1) % game.players.length;
  return game;
}

export function chooseAmerikanerCpuBid(game, playerId = game?.turn) {
  const player = game.players[playerId];
  const counts = [0, 0, 0, 0];
  let strength = 0;
  for (const card of player.hand) {
    counts[card.suit] += 1;
    strength += ({ 14: 1.5, 13: 0.95, 12: 0.55, 11: 0.25 })[card.rank] ?? 0;
  }
  strength += counts.reduce((sum, length) => sum + Math.max(0, length - 4) * 0.28, 0);
  const total = player.hand.length;
  if (!game.currentBid) return strength >= Math.ceil(total / 2) * 0.72 ? Math.ceil(total / 2) : 'pass';
  const next = game.currentBid.tricks + 1;
  if (game.currentBid.type === 'americaner' || next > total) return 'pass';
  if (strength >= next * 0.8) return next;
  return 'pass';
}

export function chooseAmerikanerCpuLead(game, playerId = game?.turn) {
  const hand = game.players[playerId].hand;
  if (game.currentBid.type === 'americaner') return hand.toSorted((a, b) => b.rank - a.rank)[0];
  const held = new Set(hand.map(({ id }) => id));
  const inPlay = new Set(game.players.flatMap(({ hand: cards }) => cards.map(({ id }) => id)));
  const groups = Array.from({ length: 4 }, (_, suit) => hand.filter((card) => card.suit === suit));
  const suit = groups.map((cards, index) => ({ cards, suit: index })).filter(({ cards, suit }) => cards.length > 0 && Array.from({ length: 13 }, (_, index) => `${suit}-${index + 2}`).some((id) => inPlay.has(id) && !held.has(id))).sort((a, b) => b.cards.length - a.cards.length || b.cards.reduce((sum, card) => sum + card.rank, 0) - a.cards.reduce((sum, card) => sum + card.rank, 0))[0];
  const leadCard = suit.cards.toSorted((a, b) => a.rank - b.rank)[0];
  const askedCard = Array.from({ length: 13 }, (_, index) => ({ id: `${leadCard.suit}-${index + 2}`, suit: leadCard.suit, rank: index + 2 })).filter(({ id }) => inPlay.has(id) && !held.has(id)).toSorted((a, b) => b.rank - a.rank)[0];
  return { card: leadCard, requestedCard: askedCard };
}

export function chooseAmerikanerCpuCard(game, playerId = game?.turn) {
  const legal = legalAmerikanerCards(game, playerId);
  if (legal.length === 1) return legal[0];
  const ledSuit = game.trick[0].card.suit;
  const current = game.trick.reduce((winner, play) => compareCards(game, play.card, winner.card, ledSuit) > 0 ? play : winner, game.trick[0]);
  const partnerInTrick = game.currentBid.type === 'tricks' && [game.currentBid.playerId, game.partnerId].includes(current.playerId);
  const winningCards = legal.filter((card) => compareCards(game, card, current.card, ledSuit) > 0).toSorted((a, b) => a.rank - b.rank);
  if (partnerInTrick) return legal.toSorted((a, b) => a.rank - b.rank)[0];
  return winningCards[0] ?? legal.toSorted((a, b) => a.rank - b.rank)[0];
}

function scoreRound(game) {
  const bid = game.currentBid;
  const total = game.deckSize / game.players.length;
  if (bid.type === 'americaner') {
    for (const player of game.players) player.score += player.id === bid.playerId ? (player.tricks === total ? 52 : -52) : player.tricks;
  } else {
    const teamTricks = game.players.filter(({ id }) => id === bid.playerId || id === game.partnerId).reduce((sum, player) => sum + player.tricks, 0);
    for (const player of game.players) {
      if (player.id === bid.playerId || player.id === game.partnerId) player.score += teamTricks >= bid.tricks ? bid.tricks : -bid.tricks;
      else player.score += player.tricks;
    }
  }
  game.lastResult = { bidder: bid.playerId, partner: game.partnerId, tricks: game.players.map(({ tricks }) => tricks), scores: game.players.map(({ score }) => score), bid: bid.tricks, type: bid.type };
  const highest = Math.max(...game.players.map(({ score }) => score));
  if (highest >= 52) {
    game.winners = game.players.filter(({ score }) => score === highest).map(({ id }) => id);
    game.winner = game.winners.length === 1 ? game.winners[0] : null;
    game.status = game.winner === null ? 'tie' : 'complete';
    game.lastAction = game.winner === null ? 'gameTied' : 'gameWon';
    return;
  }
  game.dealer = (game.dealer + 1) % game.players.length;
  game.round += 1;
  game.seed = (game.seed + 1) >>> 0;
  dealRound(game, game.seed || 1);
  game.lastAction = 'roundScored';
}

export function amerikanerRankLabel(rank) { return ({ 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' })[rank] ?? String(rank); }
export function amerikanerSuitLabel(suit) { return SUITS[suit] ?? '' ; }
