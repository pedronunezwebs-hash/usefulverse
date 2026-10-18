export const MATCH_BOARD_SIZE = 8;
export const MATCH_COLORS = 6;
export const MATCH_LEVELS = Object.freeze([
  { goal: 360, moves: 24 }, { goal: 430, moves: 23 }, { goal: 500, moves: 23 },
  { goal: 560, moves: 22 }, { goal: 620, moves: 22 }, { goal: 690, moves: 21 },
  { goal: 760, moves: 21 }, { goal: 830, moves: 20 }, { goal: 900, moves: 20 },
  { goal: 980, moves: 19 }, { goal: 1060, moves: 19 }, { goal: 1150, moves: 18 },
]);

function rngFor(seed) {
  let value = (Number(seed) >>> 0) || 1;
  return () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 0x100000000; };
}

export function findMatchCells(board) {
  const matches = new Set();
  for (let row = 0; row < MATCH_BOARD_SIZE; row += 1) {
    let start = 0;
    while (start < MATCH_BOARD_SIZE) {
      const color = board[row][start]; let end = start + 1;
      while (end < MATCH_BOARD_SIZE && color !== null && board[row][end] === color) end += 1;
      if (color !== null && end - start >= 3) for (let col = start; col < end; col += 1) matches.add(row * MATCH_BOARD_SIZE + col);
      start = end;
    }
  }
  for (let col = 0; col < MATCH_BOARD_SIZE; col += 1) {
    let start = 0;
    while (start < MATCH_BOARD_SIZE) {
      const color = board[start][col]; let end = start + 1;
      while (end < MATCH_BOARD_SIZE && color !== null && board[end][col] === color) end += 1;
      if (color !== null && end - start >= 3) for (let row = start; row < end; row += 1) matches.add(row * MATCH_BOARD_SIZE + col);
      start = end;
    }
  }
  return matches;
}

function swapCells(board, a, b) {
  const next = board.map((row) => [...row]);
  const ar = Math.floor(a / MATCH_BOARD_SIZE); const ac = a % MATCH_BOARD_SIZE;
  const br = Math.floor(b / MATCH_BOARD_SIZE); const bc = b % MATCH_BOARD_SIZE;
  [next[ar][ac], next[br][bc]] = [next[br][bc], next[ar][ac]];
  return next;
}

export function areAdjacent(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a >= 64 || b >= 64) return false;
  const rowA = Math.floor(a / 8); const rowB = Math.floor(b / 8);
  const colA = a % 8; const colB = b % 8;
  return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
}

export function hasLegalMatchMove(board) {
  for (let cell = 0; cell < 64; cell += 1) {
    for (const next of [cell + 1, cell + 8]) {
      if (next >= 64 || (next === cell + 1 && Math.floor(next / 8) !== Math.floor(cell / 8))) continue;
      if (findMatchCells(swapCells(board, cell, next)).size > 0) return true;
    }
  }
  return false;
}

export function createMatchBoard(seed = 1) {
  const random = rngFor(seed);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let row = 0; row < 8; row += 1) for (let col = 0; col < 8; col += 1) {
      const choices = Array.from({ length: MATCH_COLORS }, (_, color) => color).filter((color) => {
        const horizontal = col >= 2 && board[row][col - 1] === color && board[row][col - 2] === color;
        const vertical = row >= 2 && board[row - 1][col] === color && board[row - 2][col] === color;
        return !horizontal && !vertical;
      });
      board[row][col] = choices[Math.floor(random() * choices.length)];
    }
    if (hasLegalMatchMove(board)) return board;
  }
  // A deterministic no-match fallback with a known vertical match after one swap.
  const board = Array.from({ length: 8 }, (_, row) => Array.from({ length: 8 }, (_, col) => (row * 2 + col) % MATCH_COLORS));
  board[0][0] = 0; board[1][0] = 1; board[2][0] = 0; board[1][1] = 0;
  return board;
}

export function findMatchHint(board) {
  for (let cell = 0; cell < 64; cell += 1) {
    for (const next of [cell + 1, cell + 8]) {
      if (next >= 64 || (next === cell + 1 && Math.floor(next / 8) !== Math.floor(cell / 8))) continue;
      if (findMatchCells(swapCells(board, cell, next)).size > 0) return [cell, next];
    }
  }
  return null;
}

function collapseBoard(board, random) {
  const next = board.map((row) => [...row]);
  for (let col = 0; col < 8; col += 1) {
    const survivors = [];
    for (let row = 7; row >= 0; row -= 1) if (next[row][col] !== null) survivors.push(next[row][col]);
    for (let row = 7; row >= 0; row -= 1) next[row][col] = survivors[7 - row] ?? Math.floor(random() * MATCH_COLORS);
  }
  return next;
}

export function resolveMatchBoard(board, seed = 1) {
  const random = rngFor(seed); let next = board.map((row) => [...row]); let score = 0; let cascades = 0; let cleared = 0;
  while (cascades < 20) {
    const matches = findMatchCells(next);
    if (!matches.size) break;
    cascades += 1; cleared += matches.size;
    score += matches.size * 10 * cascades;
    for (const index of matches) next[Math.floor(index / 8)][index % 8] = null;
    next = collapseBoard(next, random);
  }
  // A pathological cascade must never leave a board with uncleared matches.
  if (findMatchCells(next).size) next = createMatchBoard(seed ^ 0x5f3759df);
  return { board: next, score, cascades, cleared };
}

export function createMatchThreeState({ level = 0, seed = Date.now() } = {}) {
  const levelIndex = Math.max(0, Math.min(MATCH_LEVELS.length - 1, Math.floor(Number(level) || 0)));
  const config = MATCH_LEVELS[levelIndex];
  return { level: levelIndex, seed: Number(seed) >>> 0 || 1, board: createMatchBoard(seed), score: 0, moves: config.moves, status: 'playing', lastMove: null, hint: null };
}

export function swapMatchThree(state, a, b) {
  if (state.status !== 'playing' || !areAdjacent(a, b)) return { state, valid: false, reason: 'invalid' };
  const swapped = swapCells(state.board, a, b);
  if (!findMatchCells(swapped).size) return { state, valid: false, reason: 'no-match' };
  const resolved = resolveMatchBoard(swapped, state.seed + state.score + state.moves);
  const score = state.score + resolved.score;
  const moves = state.moves - 1;
  const status = score >= MATCH_LEVELS[state.level].goal ? 'won' : moves <= 0 ? 'lost' : 'playing';
  return { valid: true, reason: '', state: { ...state, board: resolved.board, score, moves, status, lastMove: { board: state.board, score: state.score, moves: state.moves, status: state.status }, hint: null, lastCascade: resolved.cascades } };
}

export function hintMatchThree(state) {
  return { ...state, hint: findMatchHint(state.board) };
}

export function shuffleMatchThree(state, seed = state.seed + 1) {
  return { ...state, seed: Number(seed) >>> 0 || 1, board: createMatchBoard(seed), lastMove: null, hint: null, boardShuffled: false };
}

export function nextMatchLevel(state, seed = state.seed + 1) {
  if (state.status !== 'won') return state;
  return createMatchThreeState({ level: Math.min(MATCH_LEVELS.length - 1, state.level + 1), seed });
}

export function undoMatchThree(state) {
  if (!state.lastMove || state.status === 'playing' && state.moves === state.lastMove.moves) return state;
  return { ...state, ...state.lastMove, hint: null, lastMove: null };
}
