const SUITS = Object.freeze(['spades', 'hearts', 'diamonds', 'clubs']);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

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

export function createIdiotDeck(seed = 1) {
  const cards = [];
  for (let suit = 0; suit < SUITS.length; suit += 1) {
    for (let rank = 2; rank <= 14; rank += 1) cards.push({ id: `${suit}-${rank}`, suit, rank });
  }
  return shuffle(cards, seed);
}

export function idiotRankLabel(rank) {
  return ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' })[rank] ?? String(rank);
}

export function createIdiotGame({ seed = Date.now() >>> 0, players = 3 } = {}) {
  assert(Number.isInteger(players) && players >= 2 && players <= 5, 'Choose 2 to 5 players.');
  const stock = createIdiotDeck(seed);
  const seats = Array.from({ length: players }, (_, index) => ({
    id: index,
    hand: [],
    faceUp: [],
    faceDown: [],
    finished: false,
  }));
  for (const seat of seats) {
    seat.faceDown = [stock.pop(), stock.pop(), stock.pop()];
    seat.faceUp = [stock.pop(), stock.pop(), stock.pop()];
    seat.hand = [stock.pop(), stock.pop(), stock.pop()];
  }
  return {
    seats,
    stock,
    discard: [],
    burned: [],
    currentPlayer: null,
    status: 'setup',
    placements: [],
    idiot: null,
    seed: seed >>> 0,
    turns: 0,
    lastAction: 'deal',
  };
}

function seatFor(game, player) {
  assert(game && Number.isInteger(player) && game.seats[player], 'Choose a player in this game.');
  return game.seats[player];
}

export function swapIdiotCards(game, player, handCardId, faceUpIndex) {
  assert(game?.status === 'setup', 'Cards can only be swapped before the game starts.');
  const seat = seatFor(game, player);
  assert(Number.isInteger(faceUpIndex) && faceUpIndex >= 0 && faceUpIndex < seat.faceUp.length, 'Choose a visible table card.');
  const handIndex = seat.hand.findIndex(({ id }) => id === handCardId);
  assert(handIndex >= 0, 'Choose one of this player’s hand cards.');
  [seat.hand[handIndex], seat.faceUp[faceUpIndex]] = [seat.faceUp[faceUpIndex], seat.hand[handIndex]];
  game.lastAction = 'swap';
  return game;
}

export function arrangeIdiotCpuCards(game, player) {
  assert(game?.status === 'setup', 'Cards can only be arranged before the game starts.');
  const seat = seatFor(game, player);
  const keep = [...seat.hand].sort((a, b) => a.rank - b.rank).slice(0, 3);
  const place = [...seat.hand].filter(({ id }) => !keep.some((card) => card.id === id)).sort((a, b) => b.rank - a.rank);
  for (let index = 0; index < Math.min(place.length, seat.faceUp.length); index += 1) {
    const handIndex = seat.hand.findIndex(({ id }) => id === place[index].id);
    [seat.hand[handIndex], seat.faceUp[index]] = [seat.faceUp[index], seat.hand[handIndex]];
  }
  return game;
}

export function startIdiotGame(game) {
  assert(game?.status === 'setup', 'This game has already started.');
  const startValue = (rank) => rank === 2 ? 0 : rank === 10 ? 1 : rank;
  const lowest = Math.min(...game.seats.map(({ hand }) => Math.min(...hand.map(({ rank }) => startValue(rank)))));
  game.currentPlayer = game.seats.findIndex(({ hand }) => hand.some(({ rank }) => startValue(rank) === lowest));
  game.status = 'playing';
  game.lastAction = 'start';
  return game;
}

function topCard(game) { return game.discard.at(-1) ?? null; }

export function isIdiotCardPlayable(game, card) {
  const top = topCard(game);
  return card.rank === 2 || card.rank === 10 || !top || top.rank === 2 || card.rank >= top.rank;
}

export function idiotLegalHandCards(game, player = game?.currentPlayer) {
  if (!game || game.status !== 'playing' || player !== game.currentPlayer) return [];
  return seatFor(game, player).hand.filter((card) => isIdiotCardPlayable(game, card));
}

function advanceTurn(game, player) {
  const active = game.seats.filter(({ finished }) => !finished);
  if (active.length <= 1) {
    game.idiot = active[0]?.id ?? player;
    game.status = 'complete';
    game.currentPlayer = null;
    game.lastAction = 'complete';
    return;
  }
  let next = player;
  do { next = (next + 1) % game.seats.length; } while (game.seats[next].finished);
  game.currentPlayer = next;
}

function refillHand(game, seat) {
  while (seat.hand.length < 3 && game.stock.length) seat.hand.push(game.stock.pop());
}

function markFinished(game, seat) {
  if (seat.hand.length || seat.faceUp.length || seat.faceDown.length || game.stock.length) return false;
  seat.finished = true;
  game.placements.push(seat.id);
  return true;
}

function resolvePlay(game, player, cards, zone) {
  const seat = seatFor(game, player);
  for (const card of cards) game.discard.push(card);
  const top = topCard(game);
  const lastFour = game.discard.slice(-4);
  const burnedByTen = cards.some(({ rank }) => rank === 10);
  const burnedByFour = lastFour.length === 4 && lastFour.every(({ rank }) => rank === lastFour[0].rank);
  const burned = burnedByTen || burnedByFour;
  if (burned) {
    game.burned.push(...game.discard);
    game.discard = [];
  }
  if (zone === 'hand') refillHand(game, seat);
  game.turns += 1;
  if (markFinished(game, seat)) {
    if (game.seats.filter(({ finished }) => !finished).length === 1) {
      game.idiot = game.seats.find(({ finished }) => !finished).id;
      game.status = 'complete';
      game.currentPlayer = null;
      game.lastAction = 'complete';
      return;
    }
  }
  game.lastAction = burned ? (burnedByTen ? 'burnTen' : 'burnFour') : cards.some(({ rank }) => rank === 2) ? 'reset' : 'play';
  if (!burned) advanceTurn(game, player);
  else game.currentPlayer = player;
}

export function playIdiotCards(game, player, cardIds) {
  assert(game?.status === 'playing' && game.currentPlayer === player, 'It is not this player’s turn.');
  assert(Array.isArray(cardIds) && cardIds.length >= 1, 'Choose at least one card.');
  const seat = seatFor(game, player);
  const uniqueIds = new Set(cardIds);
  assert(uniqueIds.size === cardIds.length, 'Do not select the same card twice.');
  const cards = cardIds.map((id) => seat.hand.find((card) => card.id === id));
  assert(cards.every(Boolean), 'Choose cards from this player’s hand.');
  assert(cards.every(({ rank }) => rank === cards[0].rank), 'Cards played together must have the same rank.');
  assert(cards.every((card) => isIdiotCardPlayable(game, card)), 'That card is lower than the top of the pile.');
  seat.hand = seat.hand.filter(({ id }) => !uniqueIds.has(id));
  resolvePlay(game, player, cards, 'hand');
  return game;
}

export function playIdiotTableCard(game, player, zone, index) {
  assert(game?.status === 'playing' && game.currentPlayer === player, 'It is not this player’s turn.');
  assert(game.stock.length === 0 && !seatFor(game, player).hand.length, 'Finish the hand and draw pile first.');
  assert(zone === 'faceUp' || zone === 'faceDown', 'Choose a table card.');
  const seat = seatFor(game, player);
  const source = seat[zone];
  assert(Number.isInteger(index) && index >= 0 && index < source.length, 'That table card is not available.');
  const [card] = source.splice(index, 1);
  if (!isIdiotCardPlayable(game, card)) {
    seat.hand.push(card, ...game.discard);
    game.discard = [];
    game.turns += 1;
    game.lastAction = zone === 'faceDown' ? 'blindFail' : 'tableFail';
    advanceTurn(game, player);
    return { game, card, playable: false };
  }
  resolvePlay(game, player, [card], zone);
  return { game, card, playable: true };
}

export function takeIdiotPile(game, player) {
  assert(game?.status === 'playing' && game.currentPlayer === player, 'It is not this player’s turn.');
  const seat = seatFor(game, player);
  assert(game.discard.length > 0, 'There is no pile to take now.');
  seat.hand.push(...game.discard);
  game.discard = [];
  game.turns += 1;
  game.lastAction = 'takePile';
  advanceTurn(game, player);
  return game;
}

export function riskIdiotDraw(game, player) {
  assert(game?.status === 'playing' && game.currentPlayer === player, 'It is not this player’s turn.');
  const seat = seatFor(game, player);
  assert(seat.hand.length > 0 && game.stock.length > 0, 'A blind draw is not available.');
  const [card] = game.stock.splice(game.stock.length - 1, 1);
  game.turns += 1;
  if (isIdiotCardPlayable(game, card)) {
    resolvePlay(game, player, [card], 'hand');
    return { game, card, playable: true };
  }
  seat.hand.push(card, ...game.discard);
  game.discard = [];
  game.lastAction = 'riskFail';
  advanceTurn(game, player);
  return { game, card, playable: false };
}

export function chooseIdiotCpuAction(game, player = game?.currentPlayer) {
  const seat = seatFor(game, player);
  if (!seat.hand.length && !game.stock.length) {
    const visible = seat.faceUp.filter((card) => isIdiotCardPlayable(game, card)).sort((a, b) => a.rank - b.rank);
    if (visible.length) return { type: 'faceUp', index: seat.faceUp.findIndex(({ id }) => id === visible[0].id) };
    if (seat.faceUp.length) return { type: 'takePile' };
    if (seat.faceDown.length) return { type: 'faceDown', index: Math.floor(seededRandom((game.seed + game.turns + player) >>> 0)() * seat.faceDown.length) };
  }
  const legal = idiotLegalHandCards(game, player);
  if (!legal.length) return game.stock.length > game.discard.length ? { type: 'risk' } : { type: 'takePile' };
  const groups = new Map();
  for (const card of legal) groups.set(card.rank, [...(groups.get(card.rank) ?? []), card]);
  const candidates = [...groups.values()];
  candidates.sort((a, b) => {
    const score = (group) => (group.length >= 4 ? 100 : 0) + (group[0].rank === 10 ? 30 : group[0].rank === 2 ? 15 : 0) - group[0].rank;
    return score(b) - score(a);
  });
  return { type: 'play', cardIds: candidates[0].map(({ id }) => id) };
}

export function idiotCardInventory(game) {
  return game.seats.flatMap(({ hand, faceUp, faceDown }) => [...hand, ...faceUp, ...faceDown]).length
    + game.stock.length + game.discard.length + game.burned.length;
}
