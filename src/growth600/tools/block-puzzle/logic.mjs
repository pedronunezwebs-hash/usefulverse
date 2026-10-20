const SHAPES = Object.freeze({
  single: [[0, 0]],
  line3: [[0, 0], [0, 1], [0, 2]],
  line4: [[0, 0], [0, 1], [0, 2], [0, 3]],
  square: [[0, 0], [0, 1], [1, 0], [1, 1]],
  l: [[0, 0], [1, 0], [2, 0], [2, 1]],
  t: [[0, 0], [0, 1], [0, 2], [1, 1]],
  zigzag: [[0, 1], [0, 2], [1, 0], [1, 1]],
  corner: [[0, 0], [1, 0], [1, 1], [1, 2]],
});
export const blockShapeIds = Object.freeze(Object.keys(SHAPES));

export function getBlockCells(piece) {
  if (!piece || !SHAPES[piece.shape] || !Number.isInteger(piece.rotation)) throw new RangeError('Choose a supported block piece.');
  let cells = SHAPES[piece.shape].map(([row, column]) => [row, column]);
  for (let turn = 0; turn < ((piece.rotation % 4) + 4) % 4; turn++) cells = cells.map(([row, column]) => [column, -row]);
  const minRow = Math.min(...cells.map(([row]) => row));
  const minColumn = Math.min(...cells.map(([, column]) => column));
  return Object.freeze(cells.map(([row, column]) => Object.freeze([row - minRow, column - minColumn])));
}

function makePiece(random) {
  const roll = random();
  if (!Number.isFinite(roll) || roll < 0 || roll >= 1) throw new RangeError('The piece selector must return a value from zero to below one.');
  const shape = blockShapeIds[Math.floor(roll * blockShapeIds.length)];
  return Object.freeze({ shape, rotation: 0 });
}

export function getBlockPlacements(board, piece) {
  if (!Array.isArray(board) || board.length !== 100 || board.some((cell) => cell !== 0 && cell !== 1)) throw new RangeError('Invalid puzzle board.');
  const cells = getBlockCells(piece);
  const height = Math.max(...cells.map(([row]) => row)) + 1;
  const width = Math.max(...cells.map(([, column]) => column)) + 1;
  const placements = [];
  for (let row = 0; row <= 10 - height; row++) for (let column = 0; column <= 10 - width; column++) {
    if (cells.every(([dr, dc]) => board[(row + dr) * 10 + column + dc] === 0)) placements.push(Object.freeze({ row, column }));
  }
  return Object.freeze(placements);
}

export function createBlockPuzzle({ random = Math.random } = {}) {
  if (typeof random !== 'function') throw new TypeError('A random-number function is required.');
  const board = Object.freeze(Array(100).fill(0));
  const tray = Object.freeze(Array.from({ length: 3 }, () => makePiece(random)));
  return Object.freeze({ board, tray, score: 0, clearedLines: 0, gameOver: !tray.some((piece) => getBlockPlacements(board, piece).length), turns: 0 });
}

export function rotateBlockPiece(piece) {
  return Object.freeze({ ...piece, rotation: (piece.rotation + 1) % 4 });
}

export function placeBlockPiece(game, trayIndex, row, column, { random = Math.random } = {}) {
  if (!game || game.gameOver || !Number.isInteger(trayIndex) || trayIndex < 0 || trayIndex > 2 || !game.tray[trayIndex]) throw Object.assign(new RangeError('Choose a piece that is still in the tray.'), { code: 'piece-unavailable' });
  const piece = game.tray[trayIndex];
  if (!getBlockPlacements(game.board, piece).some((placement) => placement.row === row && placement.column === column)) throw Object.assign(new RangeError('That piece does not fit in this position.'), { code: 'illegal-placement' });
  const board = [...game.board];
  const cells = getBlockCells(piece);
  for (const [dr, dc] of cells) board[(row + dr) * 10 + column + dc] = 1;
  const fullRows = Array.from({ length: 10 }, (_, index) => index).filter((r) => board.slice(r * 10, r * 10 + 10).every(Boolean));
  const fullColumns = Array.from({ length: 10 }, (_, columnIndex) => columnIndex).filter((c) => Array.from({ length: 10 }, (_, r) => board[r * 10 + c]).every(Boolean));
  const clear = new Set();
  for (const r of fullRows) for (let c = 0; c < 10; c++) clear.add(r * 10 + c);
  for (const c of fullColumns) for (let r = 0; r < 10; r++) clear.add(r * 10 + c);
  for (const index of clear) board[index] = 0;
  const clearedLines = fullRows.length + fullColumns.length;
  const tray = [...game.tray]; tray[trayIndex] = null;
  let nextTray = tray;
  if (tray.every((entry) => entry === null)) nextTray = Array.from({ length: 3 }, () => makePiece(random));
  const frozenBoard = Object.freeze(board);
  const frozenTray = Object.freeze(nextTray);
  const gameOver = !frozenTray.some((entry) => entry && getBlockPlacements(frozenBoard, entry).length > 0);
  return Object.freeze({ board: frozenBoard, tray: frozenTray, score: game.score + cells.length + clearedLines * 10, clearedLines: game.clearedLines + clearedLines, gameOver, turns: game.turns + 1, lastMove: Object.freeze({ placed: cells.length, clearedRows: fullRows.length, clearedColumns: fullColumns.length, clearedCells: clear.size }) });
}
