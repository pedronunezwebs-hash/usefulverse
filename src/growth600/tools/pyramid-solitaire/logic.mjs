export const PYRAMID_ROW_COUNT = 7;
export const PYRAMID_SIZE = 28;
export const PYRAMID_DECK_SIZE = 52;
export const PYRAMID_MAX_RECYCLES = 1_000;

const SUITS = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades']);
const RANKS = Object.freeze(Array.from({ length: 13 }, (_, index) => index + 1));

function createDeck() {
  return SUITS.flatMap((suit) => RANKS.map((rank) => Object.freeze({ id: `${rank}-${suit}`, rank, suit })));
}

function shuffle(cards, random) {
  if (typeof random !== 'function') throw new TypeError('A random-number function is required.');
  const result = [...cards];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('The random source must return values from 0 inclusive to 1 exclusive.');
    const other = Math.floor(value * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function validateRecycleLimit(value) {
  if (value === Infinity) return value;
  if (!Number.isInteger(value) || value < 0 || value > PYRAMID_MAX_RECYCLES) throw new RangeError(`Recycling must be between 0 and ${PYRAMID_MAX_RECYCLES}, or unlimited.`);
  return value;
}

export function createPyramidGame({ random = Math.random, recycleLimit = 1 } = {}) {
  const deck = shuffle(createDeck(), random);
  const pyramid = deck.slice(0, PYRAMID_SIZE).map((card, index) => {
    const row = Math.floor((Math.sqrt(8 * index + 1) - 1) / 2);
    return Object.freeze({ ...card, row, column: index - row * (row + 1) / 2 });
  });
  return Object.freeze({ pyramid: Object.freeze(pyramid), stock: Object.freeze(deck.slice(PYRAMID_SIZE)), waste: Object.freeze([]), removed: Object.freeze([]), recycleLimit: validateRecycleLimit(recycleLimit), recycleCount: 0, draws: 0 });
}

export function clonePyramidGame(game) {
  if (!game || !Array.isArray(game.pyramid) || !Array.isArray(game.stock) || !Array.isArray(game.waste) || !Array.isArray(game.removed)) throw new TypeError('Invalid Pyramid Solitaire game state.');
  return Object.freeze({ ...game, pyramid: Object.freeze(game.pyramid.map((card) => Object.freeze({ ...card }))), stock: Object.freeze(game.stock.map((card) => Object.freeze({ ...card }))), waste: Object.freeze(game.waste.map((card) => Object.freeze({ ...card }))), removed: Object.freeze(game.removed.map((card) => Object.freeze({ ...card }))) });
}

export function isPyramidCardExposed(game, cardId) {
  const card = game?.pyramid?.find((item) => item.id === cardId);
  if (!card) return false;
  return !game.pyramid.some((other) => other.row === card.row + 1 && (other.column === card.column || other.column === card.column + 1));
}

export function getPyramidMoves(game) {
  if (!game || !Array.isArray(game.pyramid) || !Array.isArray(game.waste)) return [];
  const exposed = game.pyramid.filter((card) => isPyramidCardExposed(game, card.id));
  const moves = [];
  for (const card of exposed) {
    if (card.rank === 13) moves.push(Object.freeze({ kind: 'king', cards: Object.freeze([card.id]) }));
  }
  for (let first = 0; first < exposed.length; first += 1) {
    for (let second = first + 1; second < exposed.length; second += 1) {
      if (exposed[first].rank + exposed[second].rank === 13) moves.push(Object.freeze({ kind: 'pair', cards: Object.freeze([exposed[first].id, exposed[second].id]) }));
    }
  }
  const topWaste = game.waste.at(-1);
  if (topWaste) {
    if (topWaste.rank === 13) moves.push(Object.freeze({ kind: 'king', cards: Object.freeze([topWaste.id]) }));
    for (const card of exposed) if (card.rank + topWaste.rank === 13) moves.push(Object.freeze({ kind: 'pair', cards: Object.freeze([card.id, topWaste.id]) }));
  }
  return moves;
}

export function getPyramidStatus(game) {
  if (!game || !Array.isArray(game.pyramid)) return 'invalid';
  if (!game.pyramid.length) return 'won';
  if (getPyramidMoves(game).length || game.stock.length || game.waste.length && (game.recycleLimit === Infinity || game.recycleCount < game.recycleLimit)) return 'playing';
  return 'no-moves';
}

export function drawPyramidCard(game) {
  if (getPyramidStatus(game) === 'invalid' || !game.stock.length) return null;
  const card = game.stock.at(-1);
  return Object.freeze({ ...game, stock: Object.freeze(game.stock.slice(0, -1)), waste: Object.freeze([...game.waste, card]), draws: game.draws + 1 });
}

export function recyclePyramidWaste(game) {
  if (!game || !game.waste.length || game.stock.length || game.recycleCount >= game.recycleLimit) return null;
  return Object.freeze({ ...game, stock: Object.freeze([...game.waste].reverse()), waste: Object.freeze([]), recycleCount: game.recycleCount + 1 });
}

export function removePyramidMove(game, cardIds) {
  if (!Array.isArray(cardIds) || cardIds.length < 1 || cardIds.length > 2) return null;
  const requested = [...cardIds].sort();
  const move = getPyramidMoves(game).find((candidate) => candidate.cards.length === requested.length && [...candidate.cards].sort().every((id, index) => id === requested[index]));
  if (!move) return null;
  const removedIds = new Set(move.cards);
  const removedCards = [...game.pyramid, ...game.waste].filter((card) => removedIds.has(card.id));
  return Object.freeze({ ...game, pyramid: Object.freeze(game.pyramid.filter((card) => !removedIds.has(card.id))), waste: Object.freeze(game.waste.filter((card) => !removedIds.has(card.id))), removed: Object.freeze([...game.removed, ...removedCards]) });
}
