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

export function createWarDeck(seed = 1) {
  const deck = [];
  for (let suit = 0; suit < SUITS.length; suit += 1) {
    for (let rank = 2; rank <= 14; rank += 1) deck.push({ id: `${suit}-${rank}`, suit, rank });
  }
  const random = randomFor(seed);
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}

export function createWarGame({ seed = Date.now() >>> 0, players = 2 } = {}) {
  assert(Number.isInteger(players) && players >= 2 && players <= 4, 'Choose 2 to 4 players.');
  const cards = createWarDeck(seed);
  const hands = Array.from({ length: players }, () => []);
  cards.forEach((card, index) => {
    if (index < Math.floor(52 / players) * players) hands[index % players].push(card);
  });
  return {
    players: hands.map((pile, id) => ({ id, pile, battlesWon: 0, eliminated: false })),
    sidelined: cards.slice(Math.floor(52 / players) * players), table: [], warParticipants: [],
    status: 'playing', winner: null, seed: seed >>> 0, turns: 0, wars: 0, lastAction: 'dealt', lastWinnerId: null, lastWonCount: 0,
  };
}

function activePlayers(game) { return game.players.filter(({ pile, eliminated }) => pile.length && !eliminated); }
function cardCount(game) { return game.players.reduce((total, player) => total + player.pile.length, 0) + game.table.length + game.sidelined.length; }

function settleBattle(game, winnerId) {
  const winner = game.players[winnerId];
  game.lastWinnerId = winnerId;
  game.lastWonCount = game.table.length;
  winner.pile.push(...game.table.map(({ card }) => card));
  winner.battlesWon += 1;
  game.table = [];
  game.warParticipants = [];
  const remaining = activePlayers(game);
  if (remaining.length <= 1 || winner.pile.length === 52 - game.sidelined.length) {
    game.status = 'complete';
    game.winner = winnerId;
    game.lastAction = 'matchWon';
  } else {
    game.status = 'playing';
    game.lastAction = 'battleWon';
  }
  return game;
}

function decideWar(game, participants) {
  const upCards = game.table.filter(({ faceUp }) => faceUp);
  const highest = Math.max(...upCards.map(({ card }) => card.rank));
  const winners = upCards.filter(({ card }) => card.rank === highest).map(({ playerId }) => playerId);
  if (winners.length === 1) return settleBattle(game, winners[0]);
  game.status = 'war';
  // The Norwegian three- and four-player rule includes every player from the tied battle.
  game.warParticipants = [...new Set(participants)];
  game.wars += 1;
  game.lastAction = 'war';
  return game;
}

export function warFlip(game) {
  assert(game?.status === 'playing', 'The game is not waiting for a card flip.');
  const participants = activePlayers(game).map(({ id }) => id);
  assert(participants.length >= 2, 'At least two players need cards to continue.');
  game.turns += 1;
  game.table = [];
  for (const playerId of participants) {
    const player = game.players[playerId];
    const card = player.pile.shift();
    game.table.push({ playerId, card, faceUp: true });
  }
  return decideWar(game, participants);
}

export function warContinue(game) {
  assert(game?.status === 'war' && game.warParticipants.length >= 2, 'No war is waiting to be resolved.');
  game.turns += 1;
  const able = [];
  for (const playerId of game.warParticipants) {
    const player = game.players[playerId];
    if (player.pile.length < 2) {
      player.eliminated = true;
      game.table.push(...player.pile.map((card) => ({ playerId, card, faceUp: false })));
      player.pile = [];
      continue;
    }
    game.table.push({ playerId, card: player.pile.shift(), faceUp: false });
    game.table.push({ playerId, card: player.pile.shift(), faceUp: true });
    able.push(playerId);
  }
  if (able.length === 0) {
    game.status = 'draw';
    game.winner = null;
    game.lastAction = 'noCardsToContinueWar';
    return game;
  }
  if (able.length === 1) return settleBattle(game, able[0]);
  return decideWar(game, able);
}

export function warInventory(game) { return cardCount(game); }
export function warRankLabel(rank) { return ({ 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' })[rank] ?? String(rank); }

