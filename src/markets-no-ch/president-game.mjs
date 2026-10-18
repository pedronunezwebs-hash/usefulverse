const SUITS = Object.freeze(['spades', 'hearts', 'diamonds', 'clubs']);
export const PRESIDENT_DEFAULT_RULES = Object.freeze({ opening: 'three-clubs', allowReentry: true, exchangeCards: true });
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function normalizeRules(rules = {}) {
  const normalized = { ...PRESIDENT_DEFAULT_RULES, ...rules };
  assert(['three-clubs', 'player-one'].includes(normalized.opening), 'Choose a supported opening rule.');
  assert(typeof normalized.allowReentry === 'boolean' && typeof normalized.exchangeCards === 'boolean', 'Choose valid house rules.');
  return normalized;
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(cards, seed) {
  const random = seededRandom(seed);
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [cards[index], cards[swap]] = [cards[swap], cards[index]];
  }
  return cards;
}

export function createPresidentDeck(seed = 1, decks = 1) {
  assert(Number.isInteger(decks) && decks >= 1 && decks <= 2, 'Use one or two decks.');
  const cards = [];
  for (let deck = 0; deck < decks; deck += 1) {
    for (let suit = 0; suit < SUITS.length; suit += 1) {
      for (let rank = 2; rank <= 14; rank += 1) cards.push({ id: `${deck}-${suit}-${rank}`, deck, suit, rank });
    }
  }
  return shuffle(cards, seed);
}

const rankPower = (rank) => rank === 2 ? 15 : rank;
const nextPlayer = (game, after) => {
  for (let offset = 1; offset <= game.players.length; offset += 1) {
    const player = game.players[(after + offset) % game.players.length];
    if (player.hand.length) return player.id;
  }
  return null;
};

function sortedCards(cards, direction = 1) {
  return [...cards].sort((a, b) => direction * (rankPower(a.rank) - rankPower(b.rank)) || a.suit - b.suit || a.deck - b.deck);
}

function dealRound(game, previousPlacements = []) {
  const decks = game.players.length > 6 ? 2 : 1;
  const deck = createPresidentDeck((game.seed + game.round * 0x9e3779b9) >>> 0, decks);
  for (const player of game.players) player.hand = [];
  deck.forEach((card, index) => game.players[index % game.players.length].hand.push(card));
  for (const player of game.players) player.hand = sortedCards(player.hand);
  game.deckCount = decks;
  game.discard = [];
  game.trick = [];
  game.lastPlay = null;
  game.passed = [];
  game.placements = [];
  game.lastPlacements = [...previousPlacements];
  game.exchangeQueue = [];
  game.exchangeIndex = 0;
  game.exchangeStage = null;
  game.status = 'playing';
  game.lastAction = 'deal';

  if (!previousPlacements.length) {
    if (game.rules.opening === 'player-one') {
      game.currentPlayer = 0;
      return game;
    }
    const clubThrees = game.players.filter(({ hand }) => hand.some((card) => card.suit === 3 && card.rank === 3));
    game.currentPlayer = clubThrees[0]?.id ?? 0;
    return game;
  }

  if (!game.rules.exchangeCards) {
    game.status = 'playing';
    game.currentPlayer = game.lastPlacements.at(-1);
    game.exchangeQueue = [];
    game.lastAction = 'roundReady';
    return game;
  }

  const president = previousPlacements[0];
  const bum = previousPlacements.at(-1);
  game.exchangeQueue.push({ from: bum, to: president, count: 2 });
  if (game.players.length >= 4) game.exchangeQueue.push({ from: previousPlacements.at(-2), to: previousPlacements[1], count: 1 });
  game.status = 'exchange';
  game.exchangeStage = 'give';
  advanceExchange(game);
  return game;
}

function advanceExchange(game) {
  while (game.status === 'exchange' && game.exchangeIndex < game.exchangeQueue.length) {
    const exchange = game.exchangeQueue[game.exchangeIndex];
    if (game.exchangeStage === 'give') {
      const from = game.players[exchange.from];
      const cards = sortedCards(from.hand, -1).slice(0, exchange.count);
      assert(cards.length === exchange.count, 'Not enough cards for this exchange.');
      const ids = new Set(cards.map(({ id }) => id));
      from.hand = from.hand.filter(({ id }) => !ids.has(id));
      game.players[exchange.to].hand.push(...cards);
      game.players[exchange.to].hand = sortedCards(game.players[exchange.to].hand);
      game.exchangeStage = 'return';
      game.lastAction = 'cardsGiven';
    } else if (exchange.to <= 1) {
      game.lastAction = 'chooseReturn';
      return game;
    } else {
      const to = game.players[exchange.to];
      const cards = sortedCards(to.hand).slice(0, exchange.count);
      const ids = new Set(cards.map(({ id }) => id));
      to.hand = to.hand.filter(({ id }) => !ids.has(id));
      game.players[exchange.from].hand.push(...cards);
      game.players[exchange.from].hand = sortedCards(game.players[exchange.from].hand);
      game.exchangeIndex += 1;
      game.exchangeStage = 'give';
      game.lastAction = 'cardsReturned';
    }
  }
  if (game.status === 'exchange' && game.exchangeIndex >= game.exchangeQueue.length) {
    game.status = 'playing';
    game.currentPlayer = game.lastPlacements.at(-1);
    game.lastAction = 'roundReady';
  }
  return game;
}

function endRound(game) {
  const remaining = game.players.filter(({ hand }) => hand.length);
  assert(remaining.length === 1, 'A round ends when one player still has cards.');
  game.placements.push(remaining[0].id);
  const first = game.placements[0];
  const second = game.placements[1];
  game.players[first].score += 2;
  if (game.players.length >= 4 && second !== undefined) game.players[second].score += 1;
  game.lastPlacements = [...game.placements];
  game.currentPlayer = null;
  const winner = game.placements.find((id) => game.players[id].score >= game.targetScore);
  if (winner !== undefined) {
    game.status = 'complete';
    game.winner = winner;
    game.lastAction = 'matchWon';
    return game;
  }
  game.lastAction = 'roundComplete';
  game.round += 1;
  return dealRound(game, game.lastPlacements);
}

function countCards(game) {
  return game.players.reduce((sum, player) => sum + player.hand.length, 0) + game.trick.length + game.discard.length;
}

function completeIfLastPlayer(game) {
  if (game.players.filter(({ hand }) => hand.length).length === 1) endRound(game);
}

export function createPresidentGame({ seed = Date.now() >>> 0, players = 4, targetScore = 11, rules = {} } = {}) {
  assert(Number.isInteger(players) && players >= 3 && players <= 8, 'Choose 3 to 8 players.');
  assert(Number.isInteger(targetScore) && targetScore >= 2 && targetScore <= 50, 'Choose a target from 2 to 50 points.');
  const game = {
    players: Array.from({ length: players }, (_, id) => ({ id, score: 0, hand: [] })),
    deckCount: 1, currentPlayer: null, status: 'playing', round: 1, targetScore,
    trick: [], discard: [], lastPlay: null, passed: [], placements: [], lastPlacements: [],
    exchangeQueue: [], exchangeIndex: 0, exchangeStage: null, winner: null,
    seed: seed >>> 0, turns: 0, lastAction: 'deal', rules: normalizeRules(rules),
  };
  return dealRound(game);
}

export function presidentIsLegalPlay(game, playerId, cardIds) {
  if (!game || game.status !== 'playing' || game.currentPlayer !== playerId || !Array.isArray(cardIds) || !cardIds.length || cardIds.length > 4) return false;
  if (game.rules?.allowReentry === false && game.passed.includes(playerId)) return false;
  const player = game.players[playerId];
  const ids = new Set(cardIds);
  if (ids.size !== cardIds.length) return false;
  const cards = cardIds.map((id) => player?.hand.find((card) => card.id === id));
  if (!player || cards.some((card) => !card) || cards.some(({ rank }) => rank !== cards[0].rank)) return false;
  if (game.lastPlay && cards.length !== game.lastPlay.cards.length) return false;
  return !game.lastPlay || rankPower(cards[0].rank) > rankPower(game.lastPlay.rank);
}

function advanceAfterPlay(game, playerId) {
  game.currentPlayer = nextPlayer(game, playerId);
  completeIfLastPlayer(game);
  if (game.status === 'playing' && game.currentPlayer === null) endRound(game);
}

export function presidentPlay(game, playerId, cardIds) {
  assert(presidentIsLegalPlay(game, playerId, cardIds), 'Play a higher set with the same number of cards.');
  const player = game.players[playerId];
  const ids = new Set(cardIds);
  const cards = cardIds.map((id) => player.hand.find((card) => card.id === id));
  player.hand = player.hand.filter(({ id }) => !ids.has(id));
  game.trick.push(...cards);
  game.lastPlay = { player: playerId, rank: cards[0].rank, cards: [...cards] };
  if (game.rules?.allowReentry !== false) game.passed = [];
  game.turns += 1;
  if (!player.hand.length && !game.placements.includes(playerId)) game.placements.push(playerId);
  game.lastAction = 'play';
  advanceAfterPlay(game, playerId);
  return game;
}

export function presidentPass(game, playerId) {
  assert(game?.status === 'playing' && game.currentPlayer === playerId, 'It is not this player’s turn.');
  assert(game.trick.length > 0 && game.lastPlay, 'The lead player must play a set.');
  if (!game.passed.includes(playerId)) game.passed.push(playerId);
  game.turns += 1;
  const leader = game.lastPlay.player;
  const activeOthers = game.players.filter(({ hand, id }) => hand.length && id !== leader);
  if (activeOthers.every(({ id }) => game.passed.includes(id))) {
    game.discard.push(...game.trick);
    game.trick = [];
    game.lastPlay = null;
    game.passed = [];
    game.currentPlayer = game.players[leader]?.hand.length ? leader : nextPlayer(game, leader);
    game.lastAction = 'trickCleared';
  } else {
    game.currentPlayer = nextPlayer(game, playerId);
    game.lastAction = 'pass';
  }
  completeIfLastPlayer(game);
  return game;
}

export function presidentReturnExchange(game, cardIds) {
  assert(game?.status === 'exchange' && game.exchangeStage === 'return', 'No return exchange is waiting for you.');
  const exchange = game.exchangeQueue[game.exchangeIndex];
  assert(exchange && exchange.to <= 1, 'It is not your turn to choose exchange cards.');
  assert(Array.isArray(cardIds) && cardIds.length === exchange.count, `Choose exactly ${exchange.count} card${exchange.count === 1 ? '' : 's'}.`);
  const ids = new Set(cardIds);
  assert(ids.size === cardIds.length, 'Choose different cards.');
  const recipient = game.players[exchange.to];
  const cards = cardIds.map((id) => recipient.hand.find((card) => card.id === id));
  assert(cards.every(Boolean), 'Choose cards from your hand.');
  recipient.hand = recipient.hand.filter(({ id }) => !ids.has(id));
  game.players[exchange.from].hand.push(...cards);
  game.players[exchange.from].hand = sortedCards(game.players[exchange.from].hand);
  game.exchangeIndex += 1;
  game.exchangeStage = 'give';
  advanceExchange(game);
  return game;
}

export function choosePresidentCpuAction(game, playerId = game?.currentPlayer) {
  const player = game?.players[playerId];
  assert(game?.status === 'playing' && player, 'Choose an active computer player.');
  if (game.rules?.allowReentry === false && game.passed.includes(playerId)) return { type: 'pass' };
  if (game.trick.length) {
    const count = game.lastPlay.cards.length;
    const groups = new Map();
    for (const card of player.hand) groups.set(card.rank, [...(groups.get(card.rank) ?? []), card]);
    const legal = [...groups.entries()].filter(([rank, cards]) => cards.length >= count && rankPower(rank) > rankPower(game.lastPlay.rank));
    legal.sort(([rankA], [rankB]) => rankPower(rankA) - rankPower(rankB));
    if (!legal.length) return { type: 'pass' };
    return { type: 'play', cardIds: legal[0][1].slice(0, count).map(({ id }) => id) };
  }
  const groups = new Map();
  for (const card of player.hand) groups.set(card.rank, [...(groups.get(card.rank) ?? []), card]);
  const lead = [...groups.entries()].sort(([rankA], [rankB]) => rankPower(rankA) - rankPower(rankB))[0];
  const cards = lead?.[1] ?? [];
  return { type: 'play', cardIds: cards.slice(0, Math.min(4, cards.length)).map(({ id }) => id) };
}

export function presidentInventory(game) { return countCards(game); }
export function presidentRankLabel(rank) { return ({ 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace', 15: '2' })[rankPower(rank)] ?? String(rank); }
export function presidentCardRankOrder(card) { return rankPower(card.rank); }
export function presidentRole(game, playerId) {
  const index = game.lastPlacements.indexOf(playerId);
  if (index === 0) return 'president';
  if (index === 1 && game.players.length >= 4) return 'vicePresident';
  if (index === game.players.length - 1) return 'bum';
  if (index === game.players.length - 2 && game.players.length >= 4) return 'viceBum';
  return index < 0 ? 'neutral' : 'player';
}
