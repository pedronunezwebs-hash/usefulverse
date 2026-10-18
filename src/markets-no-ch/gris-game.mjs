const randomFor = (seed) => {
  let state = (Number(seed) >>> 0) || 0x9e3779b9;
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
};
const nextActive = (game, from, step = 1) => {
  for (let offset = 1; offset <= game.players.length; offset += 1) {
    const id = (from + offset * step + game.players.length) % game.players.length;
    if (!game.players[id].eliminated) return id;
  }
  return from;
};
const activeIds = (game) => game.players.filter((player) => !player.eliminated).map(({ id }) => id);

export function createGrisDeck(seed = 1) {
  const cards = [];
  for (let suit = 0; suit < 4; suit += 1) for (let rank = 2; rank <= 14; rank += 1) {
    cards.push({ id: `${suit}-${rank}`, suit, rank, originalOwner: null, passCount: 0 });
  }
  const random = randomFor(seed);
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [cards[index], cards[other]] = [cards[other], cards[index]];
  }
  return cards;
}

export function createGrisGame({ seed = Date.now(), players = 4, word = 'GRIS' } = {}) {
  if (!Number.isInteger(players) || players < 3 || players > 8) throw new RangeError('Gris requires 3 to 8 players.');
  if (typeof word !== 'string' || word.trim().length < 2 || word.trim().length > 12) throw new RangeError('The elimination word must contain 2 to 12 letters.');
  const deck = createGrisDeck(seed);
  const seats = Array.from({ length: players }, (_, id) => ({ id, hand: [], letters: 0, eliminated: false }));
  // Seat zero starts with the sixth card. Everyone receives exactly five first.
  for (let round = 0; round < 5; round += 1) for (const player of seats) player.hand.push(deck.pop());
  seats[0].hand.push(deck.pop());
  for (const player of seats) for (const card of player.hand) card.originalOwner = player.id;
  return {
    seed: Number(seed) >>> 0, word: word.trim().toUpperCase(), players: seats, stock: deck,
    discard: [], activePlayer: 0, starter: 0, dealer: players - 1, round: 1, status: 'passing',
    signaler: null, reactionOrder: [], reactionCursor: 0, lastPenaltyPlayer: null,
    pendingCard: null, pendingReturn: false,
  };
}

export function sameSuitCount(hand = []) {
  const counts = new Map();
  for (const card of hand) counts.set(card.suit, (counts.get(card.suit) ?? 0) + 1);
  return Math.max(0, ...counts.values());
}

export function chooseGrisCpuCard(game, playerId = game?.activePlayer) {
  const player = game?.players?.[playerId];
  if (!player?.hand?.length) return null;
  const counts = new Map();
  for (const card of player.hand) counts.set(card.suit, (counts.get(card.suit) ?? 0) + 1);
  return [...player.hand].sort((a, b) => {
    const aOffSuit = counts.get(a.suit) < 5 ? 0 : 1;
    const bOffSuit = counts.get(b.suit) < 5 ? 0 : 1;
    return aOffSuit - bOffSuit || b.rank - a.rank || String(a.id).localeCompare(String(b.id));
  })[0];
}

export function grisPass(game, { playerId = game?.activePlayer, cardId } = {}) {
  if (!game || game.status !== 'passing' || playerId !== game.activePlayer) throw new Error('It is not this player’s passing turn.');
  const sender = game.players[playerId];
  const index = sender.hand.findIndex(({ id }) => id === cardId);
  if (index < 0) throw new RangeError('Choose a card from the active hand.');
  const [card] = sender.hand.splice(index, 1);
  const receiverId = nextActive(game, playerId);
  const receiver = game.players[receiverId];
  receiver.hand.push(card);
  card.passCount = (card.passCount ?? 0) + 1;
  game.activePlayer = receiverId;
  if (receiverId === card.originalOwner && card.passCount > 1) {
    game.status = 'return-check';
    game.pendingCard = card.id;
    game.pendingReturn = true;
    return game;
  }
  if (sameSuitCount(sender.hand) >= 5) {
    game.status = 'signal';
    game.signaler = playerId;
    game.reactionOrder = activeIds(game).filter((id) => id !== playerId);
    game.reactionCursor = 0;
  }
  return game;
}

export function grisReact(game, { playerId = game?.reactionOrder?.[game?.reactionCursor] } = {}) {
  if (!game || !['signal', 'reacting'].includes(game.status) || playerId !== game.reactionOrder[game.reactionCursor]) throw new Error('It is not this player’s signal response.');
  game.status = 'reacting';
  game.reactionCursor += 1;
  if (game.reactionCursor >= game.reactionOrder.length) {
    const penalty = game.reactionOrder.at(-1);
    game.lastPenaltyPlayer = penalty;
    if (penalty !== undefined) game.players[penalty].letters = Math.min(game.word.length, game.players[penalty].letters + 1);
    if (penalty !== undefined && game.players[penalty].letters >= game.word.length) game.players[penalty].eliminated = true;
    game.status = 'round-end';
  }
  return { status: game.status, lastPenaltyPlayer: game.lastPenaltyPlayer };
}

export function grisResolveReturnedCard(game, { discardCard = false } = {}) {
  if (!game || !game.pendingCard) return game;
  const holder = game.players.find(({ hand }) => hand.some(({ id }) => id === game.pendingCard));
  if (discardCard && holder) {
    const index = holder.hand.findIndex(({ id }) => id === game.pendingCard);
    const [card] = holder.hand.splice(index, 1);
    game.discard.push(card);
    const replacement = game.stock.pop();
    if (replacement) holder.hand.push(replacement);
  }
  game.pendingCard = null;
  game.pendingReturn = false;
  game.status = 'passing';
  if (holder && sameSuitCount(holder.hand) >= 5) {
    game.status = 'signal';
    game.signaler = holder.id;
    game.reactionOrder = activeIds(game).filter((id) => id !== holder.id);
    game.reactionCursor = 0;
  }
  return game;
}

export function grisNextRound(game) {
  if (!game || game.status !== 'round-end') throw new Error('The round must end before dealing again.');
  const ids = activeIds(game);
  if (ids.length < 2) { game.status = 'complete'; return game; }
  game.round += 1;
  game.dealer = nextActive(game, game.dealer);
  // Starter rotates independently from elimination so seat order remains predictable.
  game.starter = nextActive(game, game.dealer);
  const cards = [...game.players.flatMap(({ hand }) => hand), ...game.stock, ...game.discard];
  const random = randomFor(game.seed + game.round * 104729);
  for (let index = cards.length - 1; index > 0; index -= 1) { const other = Math.floor(random() * (index + 1)); [cards[index], cards[other]] = [cards[other], cards[index]]; }
  for (const player of game.players) player.hand = [];
  game.stock = cards; game.discard = [];
  for (let round = 0; round < 5; round += 1) for (const id of ids) game.players[id].hand.push(game.stock.pop());
  game.players[game.starter].hand.push(game.stock.pop());
  for (const player of game.players) for (const card of player.hand) card.originalOwner = player.id;
  game.activePlayer = game.starter;
  game.status = 'passing'; game.signaler = null; game.reactionOrder = []; game.reactionCursor = 0;
  game.lastPenaltyPlayer = null; game.pendingCard = null; game.pendingReturn = false;
  return game;
}

export function grisInventory(game) {
  return game.players.reduce((sum, { hand }) => sum + hand.length, 0) + game.stock.length + game.discard.length;
}
