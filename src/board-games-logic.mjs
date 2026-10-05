export const CONNECT_ROWS = 6;
export const CONNECT_COLUMNS = 7;
export const EMPTY = 0;
export const RED = 1;
export const BLACK = 2;

export function createConnectFour() { return Array(CONNECT_ROWS * CONNECT_COLUMNS).fill(EMPTY); }
export function dropConnectDisc(board, column, player) {
  if (!Array.isArray(board) || board.length !== CONNECT_ROWS * CONNECT_COLUMNS || !Number.isInteger(column) || column < 0 || column >= CONNECT_COLUMNS || ![RED, BLACK].includes(player)) return null;
  const next = [...board];
  for (let row = CONNECT_ROWS - 1; row >= 0; row -= 1) {
    const index = row * CONNECT_COLUMNS + column;
    if (next[index] === EMPTY) { next[index] = player; return { board: next, row, winner: connectFourWinner(next), draw: next.every((cell) => cell !== EMPTY) };
    }
  }
  return null;
}
export function connectFourWinner(board) {
  if (!Array.isArray(board) || board.length !== CONNECT_ROWS * CONNECT_COLUMNS) return EMPTY;
  for (let row = 0; row < CONNECT_ROWS; row += 1) for (let column = 0; column < CONNECT_COLUMNS; column += 1) {
    const player = board[row * CONNECT_COLUMNS + column];
    if (![RED, BLACK].includes(player)) continue;
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      const endRow = row + dr * 3; const endColumn = column + dc * 3;
      if (endRow < 0 || endRow >= CONNECT_ROWS || endColumn < 0 || endColumn >= CONNECT_COLUMNS) continue;
      if ([1, 2, 3].every((step) => board[(row + dr * step) * CONNECT_COLUMNS + column + dc * step] === player)) return player;
    }
  }
  return EMPTY;
}

const REVERSI_SIZE = 8;
const reversiIndex = (row, column) => row * REVERSI_SIZE + column;
const inside = (row, column) => row >= 0 && row < REVERSI_SIZE && column >= 0 && column < REVERSI_SIZE;
const directions = [-1, 0, 1].flatMap((dr) => [-1, 0, 1].filter((dc) => dr || dc).map((dc) => [dr, dc]));
export function createReversi() {
  const board = Array(REVERSI_SIZE * REVERSI_SIZE).fill(EMPTY);
  board[reversiIndex(3, 3)] = BLACK; board[reversiIndex(3, 4)] = RED; board[reversiIndex(4, 3)] = RED; board[reversiIndex(4, 4)] = BLACK;
  return board;
}
export function reversiFlips(board, row, column, player) {
  if (!Array.isArray(board) || board.length !== 64 || !inside(row, column) || board[reversiIndex(row, column)] !== EMPTY || ![RED, BLACK].includes(player)) return [];
  const flips = [];
  for (const [dr, dc] of directions) {
    const line = []; let r = row + dr; let c = column + dc;
    while (inside(r, c) && board[reversiIndex(r, c)] === (player === RED ? BLACK : RED)) { line.push(reversiIndex(r, c)); r += dr; c += dc; }
    if (line.length && inside(r, c) && board[reversiIndex(r, c)] === player) flips.push(...line);
  }
  return flips;
}
export function reversiLegalMoves(board, player) {
  if (!Array.isArray(board) || board.length !== 64 || ![RED, BLACK].includes(player)) return [];
  return board.flatMap((cell, index) => cell === EMPTY && reversiFlips(board, Math.floor(index / 8), index % 8, player).length ? [index] : []);
}
export function playReversiMove(board, row, column, player) {
  const flips = reversiFlips(board, row, column, player);
  if (!flips.length) return null;
  const next = [...board]; const index = reversiIndex(row, column); next[index] = player;
  for (const cell of flips) next[cell] = player;
  const red = next.filter((cell) => cell === RED).length; const black = next.filter((cell) => cell === BLACK).length;
  return { board: next, flips, red, black, nextPlayer: player === RED ? BLACK : RED };
}

export function reversiTurnOutcome(board, mover, nextPlayer = mover === RED ? BLACK : RED) {
  if (!Array.isArray(board) || board.length !== 64 || ![RED, BLACK].includes(mover) || ![RED, BLACK].includes(nextPlayer) || mover === nextPlayer) return null;
  const red = board.filter((cell) => cell === RED).length;
  const black = board.filter((cell) => cell === BLACK).length;
  if (reversiLegalMoves(board, nextPlayer).length) return { kind: 'turn', player: nextPlayer, red, black, winner: EMPTY };
  if (reversiLegalMoves(board, mover).length) return { kind: 'pass', player: nextPlayer, red, black, winner: EMPTY };
  return { kind: 'finished', player: null, red, black, winner: red === black ? 3 : red > black ? RED : BLACK };
}

const CHECKERS_SIZE = 8;
const checkersIndex = (row, column) => row * CHECKERS_SIZE + column;
const checkersInside = (row, column) => row >= 0 && row < CHECKERS_SIZE && column >= 0 && column < CHECKERS_SIZE;
const checkersOwner = (value) => value === RED || value === RED + 2 ? RED : value === BLACK || value === BLACK + 2 ? BLACK : EMPTY;
const checkersKing = (value) => value === RED + 2 || value === BLACK + 2;

export function createCheckers() {
  const board = Array(64).fill(EMPTY);
  for (let row = 0; row < 3; row += 1) for (let column = 0; column < 8; column += 1) if ((row + column) % 2 === 1) board[checkersIndex(row, column)] = BLACK;
  for (let row = 5; row < 8; row += 1) for (let column = 0; column < 8; column += 1) if ((row + column) % 2 === 1) board[checkersIndex(row, column)] = RED;
  return board;
}

function checkersMovesForPiece(board, index) {
  const player = checkersOwner(board[index]); if (!player) return [];
  const row = Math.floor(index / 8); const column = index % 8;
  const rowDirections = checkersKing(board[index]) ? [-1, 1] : [player === RED ? -1 : 1];
  const moves = [];
  for (const dr of rowDirections) for (const dc of [-1, 1]) {
    const nextRow = row + dr; const nextColumn = column + dc;
    if (!checkersInside(nextRow, nextColumn)) continue;
    const next = checkersIndex(nextRow, nextColumn);
    if (board[next] === EMPTY) moves.push({ from: index, to: next, capture: null });
    else if (checkersOwner(board[next]) !== player) {
      const landingRow = nextRow + dr; const landingColumn = nextColumn + dc;
      if (checkersInside(landingRow, landingColumn)) {
        const landing = checkersIndex(landingRow, landingColumn);
        if (board[landing] === EMPTY) moves.push({ from: index, to: landing, capture: next });
      }
    }
  }
  return moves;
}

export function checkersLegalMoves(board, player, forcedFrom = null) {
  if (!Array.isArray(board) || board.length !== 64 || ![RED, BLACK].includes(player)) return [];
  const pieces = forcedFrom === null ? board.map((piece, index) => checkersOwner(piece) === player ? index : -1).filter((index) => index >= 0)
    : checkersOwner(board[forcedFrom]) === player ? [forcedFrom] : [];
  const moves = pieces.flatMap((index) => checkersMovesForPiece(board, index));
  return moves.some((move) => move.capture !== null) ? moves.filter((move) => move.capture !== null) : forcedFrom === null ? moves : [];
}

export function playCheckersMove(board, from, to, player, forcedFrom = null) {
  if (!Number.isInteger(from) || from < 0 || from >= 64 || !Number.isInteger(to) || to < 0 || to >= 64) return null;
  const move = checkersLegalMoves(board, player, forcedFrom).find((candidate) => candidate.from === from && candidate.to === to);
  if (!move) return null;
  const next = [...board]; let piece = next[from]; next[from] = EMPTY; next[to] = EMPTY;
  if (move.capture !== null) next[move.capture] = EMPTY;
  const promoted = !checkersKing(piece) && (player === RED ? Math.floor(to / 8) === 0 : Math.floor(to / 8) === 7);
  if (promoted) piece += 2;
  next[to] = piece;
  const continuation = move.capture !== null && !promoted ? checkersMovesForPiece(next, to).filter((candidate) => candidate.capture !== null) : [];
  const nextPlayer = continuation.length ? player : player === RED ? BLACK : RED;
  const winner = checkersLegalMoves(next, nextPlayer).length ? EMPTY : player;
  return { board: next, capture: move.capture, promoted, continuation: continuation.length > 0, nextPlayer, winner };
}
