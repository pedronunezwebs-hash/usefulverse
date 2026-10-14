const FULL = (1 << 9) - 1;
const boxId = (index) => Math.floor(Math.floor(index / 9) / 3) * 3 + Math.floor((index % 9) / 3);

function validateGrid(grid) {
  if (!Array.isArray(grid) || grid.length !== 81 || grid.some((value) => !Number.isInteger(value) || value < 0 || value > 9)) throw new RangeError('Enter 81 Sudoku cells, using 0 for an empty cell and 1–9 for digits.');
}

export function findSudokuConflicts(grid) {
  validateGrid(grid);
  const conflicts = new Set();
  const inspect = (cells) => {
    const seen = new Map();
    for (const index of cells) if (grid[index]) {
      const prior = seen.get(grid[index]);
      if (prior !== undefined) { conflicts.add(index); conflicts.add(prior); }
      else seen.set(grid[index], index);
    }
  };
  for (let i = 0; i < 9; i += 1) {
    inspect(Array.from({ length: 9 }, (_, column) => i * 9 + column));
    inspect(Array.from({ length: 9 }, (_, row) => row * 9 + i));
  }
  for (let row = 0; row < 9; row += 3) for (let column = 0; column < 9; column += 3) inspect(Array.from({ length: 9 }, (_, offset) => (row + Math.floor(offset / 3)) * 9 + column + offset % 3));
  return Object.freeze([...conflicts].sort((a, b) => a - b));
}

function candidateMask(grid, index) {
  const row = Math.floor(index / 9); const column = index % 9; let used = 0;
  for (let offset = 0; offset < 9; offset += 1) {
    const rowValue = grid[row * 9 + offset]; const columnValue = grid[offset * 9 + column];
    if (rowValue) used |= 1 << (rowValue - 1);
    if (columnValue) used |= 1 << (columnValue - 1);
  }
  const boxRow = Math.floor(row / 3) * 3; const boxColumn = Math.floor(column / 3) * 3;
  for (let r = 0; r < 3; r += 1) for (let c = 0; c < 3; c += 1) { const value = grid[(boxRow + r) * 9 + boxColumn + c]; if (value) used |= 1 << (value - 1); }
  return FULL & ~used;
}

function digits(mask) { const result = []; for (let bit = 1; bit <= 1 << 8; bit <<= 1) if (mask & bit) result.push(Math.log2(bit) + 1); return result; }

export function findSudokuStep(grid) {
  validateGrid(grid);
  if (findSudokuConflicts(grid).length) return null;
  const cells = Array.from({ length: 81 }, (_, index) => index).filter((index) => !grid[index]);
  const masks = new Map(cells.map((index) => [index, candidateMask(grid, index)]));
  for (const index of cells) {
    const values = digits(masks.get(index));
    if (values.length === 1) return Object.freeze({ index, value: values[0], technique: 'naked-single' });
  }
  const units = [];
  for (let row = 0; row < 9; row += 1) units.push({ type: 'row', index: row, cells: Array.from({ length: 9 }, (_, column) => row * 9 + column) });
  for (let column = 0; column < 9; column += 1) units.push({ type: 'column', index: column, cells: Array.from({ length: 9 }, (_, row) => row * 9 + column) });
  for (let row = 0; row < 3; row += 1) for (let column = 0; column < 3; column += 1) units.push({ type: 'box', index: row * 3 + column, cells: Array.from({ length: 9 }, (_, offset) => (row * 3 + Math.floor(offset / 3)) * 9 + column * 3 + offset % 3) });
  for (const unit of units) for (let value = 1; value <= 9; value += 1) {
    const bit = 1 << (value - 1);
    const positions = unit.cells.filter((index) => !grid[index] && (masks.get(index) & bit));
    if (positions.length === 1) return Object.freeze({ index: positions[0], value, technique: 'hidden-single', unit: unit.type, unitIndex: unit.index + 1 });
  }
  return null;
}

export function solveSudoku(grid, { maxSolutions = 2, maxNodes = 250_000 } = {}) {
  validateGrid(grid);
  if (![1, 2].includes(maxSolutions) || !Number.isInteger(maxNodes) || maxNodes < 1 || maxNodes > 1_000_000) throw new RangeError('Solver limits are outside the supported range.');
  const conflicts = findSudokuConflicts(grid);
  if (conflicts.length) return Object.freeze({ status: 'invalid', conflicts, count: 0, complete: true, nodes: 0, solution: null });
  const board = grid.slice(); const rows = Array(9).fill(0); const columns = Array(9).fill(0); const boxes = Array(9).fill(0);
  for (let index = 0; index < 81; index += 1) if (board[index]) {
    const bit = 1 << (board[index] - 1); const row = Math.floor(index / 9); const column = index % 9;
    rows[row] |= bit; columns[column] |= bit; boxes[boxId(index)] |= bit;
  }
  let count = 0; let nodes = 0; let complete = true; let solution = null;
  function search() {
    if (count >= maxSolutions || nodes >= maxNodes) { complete = false; return; }
    nodes += 1;
    let best = -1; let bestMask = 0; let bestCount = 10;
    for (let index = 0; index < 81; index += 1) if (!board[index]) {
      const row = Math.floor(index / 9); const column = index % 9; const mask = FULL & ~(rows[row] | columns[column] | boxes[boxId(index)]); const amount = digits(mask).length;
      if (!amount) return;
      if (amount < bestCount) { best = index; bestMask = mask; bestCount = amount; if (amount === 1) break; }
    }
    if (best < 0) { count += 1; if (!solution) solution = board.slice(); return; }
    const row = Math.floor(best / 9); const column = best % 9; const square = boxId(best);
    for (const value of digits(bestMask)) {
      const bit = 1 << (value - 1); board[best] = value; rows[row] |= bit; columns[column] |= bit; boxes[square] |= bit;
      search();
      board[best] = 0; rows[row] ^= bit; columns[column] ^= bit; boxes[square] ^= bit;
      if (count >= maxSolutions || nodes >= maxNodes) { complete = false; return; }
    }
  }
  search();
  const status = count >= 2 ? 'multiple' : !complete ? 'incomplete' : count === 0 ? 'unsatisfiable' : 'unique';
  return Object.freeze({ status, conflicts: Object.freeze([]), count, complete, nodes, solution: solution && Object.freeze(solution) });
}

export function createSudokuExample() {
  return Object.freeze([
    5,3,0,0,7,0,0,0,0, 6,0,0,1,9,5,0,0,0, 0,9,8,0,0,0,0,6,0,
    8,0,0,0,6,0,0,0,3, 4,0,0,8,0,3,0,0,1, 7,0,0,0,2,0,0,0,6,
    0,6,0,0,0,0,2,8,0, 0,0,0,4,1,9,0,0,5, 0,0,0,0,8,0,0,7,9,
  ]);
}
