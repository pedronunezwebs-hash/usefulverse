const RANKS = Object.freeze(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']);
const SUITS = Object.freeze(['spades', 'hearts', 'diamonds', 'clubs']);
const ROW_SIZES = Object.freeze([3, 6, 9, 10]);

function randomValue(random) { if (typeof random !== 'function') throw new TypeError('A random-number function is required.'); const value = random(); if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random values must be from 0 inclusive to 1 exclusive.'); return value; }
function shuffle(cards, random) { const deck = [...cards]; for (let i = deck.length - 1; i > 0; i -= 1) { const j = Math.floor(randomValue(random) * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; } return deck; }
function lowerIndices(row, column) {
  if (row === 0) return [column * 2, column * 2 + 1];
  if (row === 1) { const first = Math.floor(column * 9 / 6); return [first, first + 1]; }
  if (row === 2) { const first = Math.floor(column * 10 / 9); return [first, first + 1]; }
  return [];
}
function pushUndo(game) { game.history.push({ tableau: game.tableau.map((card) => ({ ...card })), stock: [...game.stock], waste: [...game.waste], moves: game.moves, score: game.score, status: game.status }); }
function finishStatus(game) { if (game.tableau.every((card) => card.removed)) game.status = 'won'; else if (game.stock.length === 0 && !getTripeaksHints(game).length) game.status = 'stuck'; }

export function createTripeaksGame({ random = Math.random } = {}) {
  const shuffled = shuffle(SUITS.flatMap((suit) => RANKS.map((rank) => ({ id: rank + '-' + suit, rank, suit }))), random);
  let offset = 0; const tableau = [];
  ROW_SIZES.forEach((count, row) => { for (let column = 0; column < count; column += 1) { const card = shuffled[offset++]; tableau.push({ ...card, row, column, covers: lowerIndices(row, column), removed: false }); } });
  return { tableau, stock: shuffled.slice(offset), waste: [], moves: 0, score: 0, status: 'playing', history: [] };
}
export function isTripeaksCardExposed(game, cardId) {
  const card = game?.tableau?.find((item) => item.id === cardId);
  if (!card || card.removed) return false;
  return card.row === 3 || card.covers.every((column) => game.tableau.some((lower) => lower.row === card.row + 1 && lower.column === column && lower.removed));
}
function rankAdjacent(first, second) { const a = RANKS.indexOf(first); const b = RANKS.indexOf(second); return Math.abs(a - b) === 1 || Math.abs(a - b) === 12; }
export function getTripeaksHints(game) {
  if (!game || game.status !== 'playing' || !game.waste.length) return Object.freeze([]);
  const top = game.waste.at(-1);
  return Object.freeze(game.tableau.filter((card) => !card.removed && isTripeaksCardExposed(game, card.id) && rankAdjacent(card.rank, top.rank)).map((card) => card.id));
}
export function drawTripeaksCard(game) {
  if (!game || game.status !== 'playing') return Object.freeze({ ok: false, reason: 'finished' });
  if (!game.stock.length) return Object.freeze({ ok: false, reason: 'stock-empty' });
  pushUndo(game); game.waste.push(game.stock.pop()); game.moves += 1; finishStatus(game);
  return Object.freeze({ ok: true, card: game.waste.at(-1), status: game.status, stockRemaining: game.stock.length });
}
export function removeTripeaksCard(game, cardId) {
  if (!game || game.status !== 'playing') return Object.freeze({ ok: false, reason: 'finished' });
  const card = game.tableau.find((item) => item.id === cardId);
  if (!card || card.removed) return Object.freeze({ ok: false, reason: 'unknown-card' });
  if (!isTripeaksCardExposed(game, cardId)) return Object.freeze({ ok: false, reason: 'covered' });
  const top = game.waste.at(-1); if (!top) return Object.freeze({ ok: false, reason: 'draw-first' });
  if (!rankAdjacent(card.rank, top.rank)) return Object.freeze({ ok: false, reason: 'rank-mismatch' });
  pushUndo(game); card.removed = true; game.waste.push({ ...card, removed: false }); game.moves += 1; game.score += 10; finishStatus(game);
  return Object.freeze({ ok: true, card: Object.freeze({ ...card }), status: game.status, hints: getTripeaksHints(game) });
}
export function undoTripeaksMove(game) {
  if (!game?.history?.length) return Object.freeze({ ok: false, reason: 'nothing-to-undo' });
  const previous = game.history.pop(); game.tableau = previous.tableau; game.stock = previous.stock; game.waste = previous.waste; game.moves = previous.moves; game.score = previous.score; game.status = previous.status;
  return Object.freeze({ ok: true, status: game.status, moves: game.moves });
}
export function getTripeaksState(game) {
  if (!game || !Array.isArray(game.tableau)) throw new TypeError('Invalid Tripeaks game.');
  return Object.freeze({ tableau: Object.freeze(game.tableau.map((card) => Object.freeze({ ...card, exposed: isTripeaksCardExposed(game, card.id) }))), stockRemaining: game.stock.length, waste: Object.freeze(game.waste.map((card) => Object.freeze({ ...card }))), moves: game.moves, score: game.score ?? 0, status: game.status, hints: getTripeaksHints(game) });
}
