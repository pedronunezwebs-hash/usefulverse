export const CRAZY_EIGHTS_TARGET_SCORE = 100;
export const CRAZY_EIGHTS_SUITS = Object.freeze(['spades', 'hearts', 'diamonds', 'clubs']);
const seedRandom = (seed) => {
  let state = seed >>> 0;
  return () => { state = (state + 0x6d2b79f5) >>> 0; let t = state; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };

export function createCrazyEightsDeck(seed = 1) {
  const deck = [];
  for (let suit = 0; suit < 4; suit += 1) for (let rank = 1; rank <= 13; rank += 1) deck.push({ id: `${suit}-${rank}`, rank, suit });
  const random = seedRandom(seed);
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}

export function crazyEightsCardPoints(card) {
  if (card.rank === 8) return 50;
  if (card.rank === 1) return 1;
  if (card.rank >= 11) return 10;
  return card.rank;
}

export function createCrazyEightsGame({ seed = Date.now() >>> 0, players = 2, scores, target = CRAZY_EIGHTS_TARGET_SCORE } = {}) {
  assert(Number.isInteger(players) && players >= 2 && players <= 6, 'Choose 2 to 6 players.');
  assert(Number.isInteger(target) && target >= 1 && target <= 10000, 'The target score must be a positive whole number.');
  const hands = Array.from({ length: players }, () => []);
  const stock = createCrazyEightsDeck(seed);
  const handSize = players === 2 ? 7 : 5;
  for (let round = 0; round < handSize; round += 1) for (const hand of hands) hand.push(stock.pop());
  let starter = stock.pop();
  while (starter.rank === 8 && stock.length) { stock.unshift(starter); starter = stock.pop(); }
  const totals = scores ?? Array(players).fill(0);
  assert(Array.isArray(totals) && totals.length === players && totals.every((score) => Number.isInteger(score) && score >= 0), 'Scores must match the player count.');
  return {
    hands, stock, discard: [starter], currentSuit: starter.suit, currentPlayer: 0,
    scores: [...totals], target, status: 'playing', winner: null,
    drawCount: 0, seed: seed >>> 0, rounds: 0, lastAction: 'deal',
  };
}

export function crazyEightsLegalCards(game, player = game?.currentPlayer) {
  if (!game || game.status !== 'playing' || player !== game.currentPlayer) return [];
  const top = game.discard.at(-1);
  return game.hands[player].filter((card) => card.rank === 8 || card.suit === game.currentSuit || card.rank === top.rank);
}

function scoreRound(game, winner) {
  const roundPoints = game.hands.map((hand, index) => index === winner ? 0 : hand.reduce((sum, card) => sum + crazyEightsCardPoints(card), 0));
  game.scores = game.scores.map((score, index) => score + roundPoints[index]);
  game.roundPoints = roundPoints;
  game.rounds += 1;
  if (game.scores.some((score) => score >= game.target)) {
    const lowest = Math.min(...game.scores);
    const winners = game.scores.flatMap((score, index) => score === lowest ? [index] : []);
    game.status = 'complete';
    game.winner = winners.length === 1 ? winners[0] : null;
  } else game.status = 'roundEnd';
  game.lastAction = 'roundEnd';
}

export function playCrazyEightsCard(game, player, cardId, chosenSuit) {
  assert(game?.status === 'playing' && game.currentPlayer === player, 'It is not this player’s turn.');
  const card = game.hands[player].find(({ id }) => id === cardId);
  assert(card && crazyEightsLegalCards(game, player).some(({ id }) => id === cardId), 'That card cannot be played now.');
  if (card.rank === 8) assert(CRAZY_EIGHTS_SUITS.includes(chosenSuit) || Number.isInteger(chosenSuit) && chosenSuit >= 0 && chosenSuit < 4, 'Choose a suit when playing an eight.');
  game.hands[player] = game.hands[player].filter(({ id }) => id !== cardId);
  game.discard.push(card);
  game.currentSuit = card.rank === 8 ? (Number.isInteger(chosenSuit) ? chosenSuit : CRAZY_EIGHTS_SUITS.indexOf(chosenSuit)) : card.suit;
  game.drawCount = 0;
  game.lastAction = 'play';
  if (!game.hands[player].length) scoreRound(game, player);
  else game.currentPlayer = (player + 1) % game.hands.length;
  return game;
}

function recycleStock(game) {
  if (game.stock.length || game.discard.length < 2) return;
  const top = game.discard.pop();
  game.stock = game.discard;
  const random = seedRandom((game.seed + game.rounds * 0x9e3779b9 + game.lastAction.length) >>> 0);
  for (let index = game.stock.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [game.stock[index], game.stock[swap]] = [game.stock[swap], game.stock[index]];
  }
  game.discard = [top];
}

export function drawCrazyEightsCard(game, player) {
  assert(game?.status === 'playing' && game.currentPlayer === player, 'It is not this player’s turn.');
  assert(game.drawCount < 3, 'A player may draw at most three cards on a turn.');
  recycleStock(game);
  if (!game.stock.length) {
    game.currentPlayer = (player + 1) % game.hands.length;
    game.drawCount = 0;
    game.lastAction = 'pass';
    return { game, card: null, passed: true };
  }
  const card = game.stock.pop();
  game.hands[player].push(card);
  game.drawCount += 1;
  game.lastAction = 'draw';
  const canPlay = crazyEightsLegalCards(game, player).some(({ id }) => id === card.id);
  if (canPlay) return { game, card, playable: true, passed: false };
  if (game.drawCount >= 3) {
    game.currentPlayer = (player + 1) % game.hands.length;
    game.drawCount = 0;
    game.lastAction = 'pass';
  }
  return { game, card, playable: false, passed: game.lastAction === 'pass' };
}

export function passCrazyEightsTurn(game, player) {
  assert(game?.status === 'playing' && game.currentPlayer === player, 'It is not this player’s turn.');
  assert(game.drawCount >= 3 && !crazyEightsLegalCards(game, player).length, 'You can pass only after three unusable draws.');
  game.currentPlayer = (player + 1) % game.hands.length;
  game.drawCount = 0;
  game.lastAction = 'pass';
  return game;
}

export function startNextCrazyEightsRound(game, seed = (game.seed + 1) >>> 0) {
  assert(game && ['roundEnd', 'complete'].includes(game.status), 'The current round must finish first.');
  const next = createCrazyEightsGame({ seed, players: game.hands.length, scores: game.scores, target: game.target });
  next.rounds = game.rounds;
  return next;
}

export function crazyEightsCardCount(game) {
  return game.hands.flat().length + game.stock.length + game.discard.length;
}

export function chooseCrazyEightsCpuMove(game, player = game?.currentPlayer) {
  const legal = crazyEightsLegalCards(game, player);
  if (!legal.length) return null;
  const counts = Array(4).fill(0);
  for (const card of game.hands[player]) if (card.rank !== 8) counts[card.suit] += 1;
  legal.sort((a, b) => {
    const utility = (card) => (card.rank === 8 ? -6 : counts[card.suit] * 2 + (card.rank === game.discard.at(-1).rank ? 1 : 0) - crazyEightsCardPoints(card) * 0.1);
    return utility(b) - utility(a);
  });
  const card = legal[0];
  const chosenSuit = card.rank === 8 ? counts.indexOf(Math.max(...counts)) : card.suit;
  return { cardId: card.id, chosenSuit: CRAZY_EIGHTS_SUITS[chosenSuit] };
}
