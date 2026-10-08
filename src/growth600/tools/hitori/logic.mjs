const DIFFICULTY_BLACK_COUNTS = Object.freeze({
  easy: Object.freeze({ 5: 2, 6: 3, 7: 4, 8: 5 }),
  medium: Object.freeze({ 5: 3, 6: 4, 7: 5, 8: 6 }),
  hard: Object.freeze({ 5: 4, 6: 5, 7: 6, 8: 7 }),
});
const UNIQUE_FALLBACKS = Object.freeze({
  '5-easy': { grid: [[4,1,3,5,2],[5,3,4,2,1],[3,2,1,4,5],[1,2,2,1,4],[2,4,5,1,3]], solution: [16,18] },
  '5-medium': { grid: [[1,2,4,5,3],[4,5,3,4,5],[4,3,2,1,5],[1,1,5,2,4],[5,4,1,3,2]], solution: [5,9,15] },
  '5-hard': { grid: [[5,4,1,3,2],[4,5,2,2,5],[3,1,5,2,4],[2,4,3,4,3],[1,2,4,5,3]], solution: [6,8,16,19] },
  '6-easy': { grid: [[6,3,2,5,4,1],[2,1,5,6,3,4],[3,6,6,4,5,2],[4,5,3,1,2,6],[4,4,6,2,1,3],[1,2,3,3,6,5]], solution: [14,24,32] },
  '6-medium': { grid: [[3,2,4,6,1,5],[2,3,6,4,5,1],[5,1,2,3,6,4],[1,5,3,2,2,6],[4,4,1,5,3,3],[4,4,5,1,2,3]], solution: [22,25,29,30] },
  '6-hard': { grid: [[3,6,5,1,3,2],[5,2,1,4,2,3],[3,3,6,2,1,5],[2,1,3,6,5,4],[5,5,2,3,1,1],[1,3,4,5,2,6]], solution: [0,10,13,24,28] },
  '7-easy': { grid: [[4,1,3,2,6,5,7],[5,2,7,3,3,1,6],[6,5,2,1,7,7,3],[7,4,1,5,3,6,2],[3,6,5,4,7,7,1],[1,3,5,7,5,2,4],[2,7,4,6,1,3,5]], solution: [11,19,32,37] },
  '7-medium': { grid: [[3,7,4,2,1,5,6],[2,6,1,4,5,7,3],[4,3,5,5,7,7,2],[1,2,7,5,6,3,4],[7,1,3,5,2,4,5],[5,5,6,7,3,2,7],[6,5,2,3,4,1,7]], solution: [17,19,31,36,41] },
  '7-hard': { grid: [[6,5,4,1,3,2,7],[2,7,4,4,6,2,3],[2,3,7,7,2,4,6],[7,1,2,6,5,3,4],[3,4,2,2,7,6,5],[5,2,6,6,4,7,1],[4,6,3,7,1,5,2]], solution: [9,12,14,17,30,38] },
  '8-easy': { grid: [[7,2,4,3,1,8,2,5],[3,3,8,1,6,5,2,7],[2,5,3,7,4,1,8,6],[8,1,5,6,2,7,3,4],[6,8,2,5,7,3,4,1],[6,4,6,4,5,2,7,3],[3,7,1,4,8,6,5,5],[5,6,7,2,3,4,1,8]], solution: [6,8,40,43,55] },
  '8-medium': { grid: [[5,7,8,6,1,3,2,4],[7,6,1,2,1,4,6,4],[2,6,7,3,5,1,8,8],[7,3,6,3,2,5,8,7],[6,2,5,4,7,8,3,1],[8,1,3,5,4,2,7,6],[1,8,4,7,3,6,5,2],[3,4,2,8,6,7,1,5]], solution: [9,12,15,22,24,27] },
  '8-hard': { grid: [[3,7,7,1,4,8,5,6],[8,2,5,6,5,3,2,6],[2,6,8,7,1,5,3,4],[5,1,3,4,6,2,8,7],[7,5,6,8,2,4,1,3],[6,3,4,5,8,1,7,2],[4,4,1,1,5,7,6,8],[2,8,7,2,3,6,4,5]], solution: [2,9,12,15,49,51,56] },
});

function checkedRandom(random) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return value;
}

function shuffled(values, random) {
  const output = values.slice();
  for (let index = output.length - 1; index > 0; index -= 1) {
    const other = Math.floor(checkedRandom(random) * (index + 1));
    [output[index], output[other]] = [output[other], output[index]];
  }
  return output;
}

function validateGrid(grid) {
  if (!Array.isArray(grid) || grid.length < 2 || grid.length > 8 || grid.some((row) => !Array.isArray(row) || row.length !== grid.length || row.some((value) => !Number.isInteger(value) || value < 1))) {
    throw new RangeError('Hitori needs a square grid from 2 to 8 rows with positive whole numbers.');
  }
}

function duplicatePairs(grid) {
  const size = grid.length;
  const pairs = [];
  for (let row = 0; row < size; row += 1) {
    for (let first = 0; first < size; first += 1) for (let second = first + 1; second < size; second += 1) {
      if (grid[row][first] === grid[row][second]) pairs.push([row * size + first, row * size + second]);
      if (grid[first][row] === grid[second][row]) pairs.push([first * size + row, second * size + row]);
    }
  }
  return pairs;
}

function neighbors(index, size) {
  const row = Math.floor(index / size);
  const column = index % size;
  return [row > 0 ? index - size : -1, row + 1 < size ? index + size : -1, column > 0 ? index - 1 : -1, column + 1 < size ? index + 1 : -1].filter((value) => value >= 0);
}

function whitesConnected(size, black) {
  const total = size * size;
  let firstWhite = -1;
  let expected = 0;
  for (let index = 0; index < total; index += 1) if (!black.has(index)) { expected += 1; if (firstWhite < 0) firstWhite = index; }
  if (!expected) return false;
  const visited = new Set([firstWhite]);
  const pending = [firstWhite];
  while (pending.length) {
    for (const next of neighbors(pending.pop(), size)) if (!black.has(next) && !visited.has(next)) { visited.add(next); pending.push(next); }
  }
  return visited.size === expected;
}

export function checkHitoriBoard(grid, blackCells) {
  validateGrid(grid);
  const size = grid.length;
  const total = size * size;
  const black = new Set(blackCells ?? []);
  if (!Array.isArray(blackCells) && !(blackCells instanceof Set)) throw new TypeError('Black cells must be an array or set of cell indexes.');
  if ([...black].some((index) => !Number.isInteger(index) || index < 0 || index >= total)) throw new RangeError('A black cell is outside the grid.');
  const errors = [];
  for (const index of black) if (neighbors(index, size).some((next) => black.has(next))) { errors.push('adjacent-black'); break; }
  if (duplicatePairs(grid).some(([first, second]) => !black.has(first) && !black.has(second))) errors.push('duplicate-white');
  if (!whitesConnected(size, black)) errors.push('disconnected-white');
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), blackCount: black.size });
}

export function solveHitori(grid, { maxSolutions = 2 } = {}) {
  validateGrid(grid);
  if (!Number.isInteger(maxSolutions) || maxSolutions < 1 || maxSolutions > 10) throw new RangeError('Maximum solution count must be from 1 to 10.');
  const size = grid.length;
  const pairs = duplicatePairs(grid);
  const candidates = [...new Set(pairs.flat())];
  const candidateSet = new Set(candidates);
  const solutions = [];

  function visit(original) {
    if (solutions.length >= maxSolutions) return;
    const state = original.slice();
    let changed = true;
    while (changed) {
      changed = false;
      for (const index of candidates) if (state[index] === 1 && neighbors(index, size).some((next) => state[next] === 1)) return;
      for (const [first, second] of pairs) {
        if (state[first] === 1 || state[second] === 1) continue;
        if (state[first] === 2 && state[second] === 2) return;
        if (state[first] === 2 && state[second] === 0) { state[second] = 1; changed = true; }
        else if (state[second] === 2 && state[first] === 0) { state[first] = 1; changed = true; }
      }
    }
    for (const [first, second] of pairs) {
      if (state[first] === 1 || state[second] === 1) continue;
      for (const pick of [first, second]) {
        const branch = state.slice();
        branch[pick] = 1;
        visit(branch);
        if (solutions.length >= maxSolutions) return;
      }
      return;
    }
    const optional = candidates.find((index) => state[index] === 0);
    if (optional !== undefined) {
      for (const value of [2, 1]) {
        const branch = state.slice();
        branch[optional] = value;
        visit(branch);
        if (solutions.length >= maxSolutions) return;
      }
      return;
    }
    const black = new Set(candidates.filter((index) => state[index] === 1));
    if (!checkHitoriBoard(grid, black).valid) return;
    const solution = [...black].sort((a, b) => a - b);
    if (!solutions.some((entry) => entry.length === solution.length && entry.every((value, index) => value === solution[index]))) solutions.push(Object.freeze(solution));
  }

  const initial = new Uint8Array(size * size);
  for (let index = 0; index < initial.length; index += 1) if (!candidateSet.has(index)) initial[index] = 2;
  visit(initial);
  return Object.freeze(solutions.slice());
}

function connectedAfterMask(size, black) {
  return whitesConnected(size, black);
}

export function createHitoriPuzzle({ size = 5, difficulty = 'easy', random = Math.random, maxAttempts = 500 } = {}) {
  if (!Number.isInteger(size) || size < 5 || size > 8) throw new RangeError('Choose a Hitori grid from 5 to 8.');
  if (!Object.hasOwn(DIFFICULTY_BLACK_COUNTS, difficulty)) throw new RangeError('Choose easy, medium or hard difficulty.');
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 2_000) throw new RangeError('Puzzle generation attempts are outside the supported range.');
  const targetBlack = DIFFICULTY_BLACK_COUNTS[difficulty][size];
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const symbols = shuffled(Array.from({ length: size }, (_, index) => index + 1), random);
    const rowOrder = shuffled(Array.from({ length: size }, (_, index) => index), random);
    const columnOrder = shuffled(Array.from({ length: size }, (_, index) => index), random);
    const solutionGrid = rowOrder.map((row) => columnOrder.map((column) => symbols[(row + column) % size]));
    const selected = new Set();
    for (const index of shuffled(Array.from({ length: size * size }, (_, value) => value), random)) {
      if (selected.size >= targetBlack) break;
      if (neighbors(index, size).some((next) => selected.has(next))) continue;
      selected.add(index);
    }
    if (selected.size !== targetBlack || !connectedAfterMask(size, selected)) continue;

    const puzzle = solutionGrid.map((row) => row.slice());
    const targetsByRow = Array.from({ length: size }, () => new Set());
    let possible = true;
    for (const index of shuffled([...selected], random)) {
      const row = Math.floor(index / size);
      const column = index % size;
      const targetColumns = shuffled(Array.from({ length: size }, (_, value) => value).filter((value) => !selected.has(row * size + value) && !targetsByRow[row].has(value)), random);
      if (!targetColumns.length) { possible = false; break; }
      const target = targetColumns[0];
      targetsByRow[row].add(target);
      puzzle[row][column] = puzzle[row][target];
    }
    if (!possible) continue;
    const solutions = solveHitori(puzzle, { maxSolutions: 2 });
    const expected = [...selected].sort((a, b) => a - b);
    if (solutions.length !== 1 || solutions[0].length !== expected.length || !solutions[0].every((value, index) => value === expected[index])) continue;
    return Object.freeze({ grid: Object.freeze(puzzle.map((row) => Object.freeze(row))), solution: solutions[0], size, difficulty, number: attempt + 1 });
  }
  const fallback = UNIQUE_FALLBACKS[`${size}-${difficulty}`];
  const symbols = shuffled(Array.from({ length: size }, (_, index) => index + 1), random);
  const turns = Math.floor(checkedRandom(random) * 4);
  const flipRows = checkedRandom(random) >= 0.5;
  const flipColumns = checkedRandom(random) >= 0.5;
  const transformed = Array.from({ length: size }, () => Array(size));
  const transform = (sourceIndex) => {
    let row = Math.floor(sourceIndex / size);
    let column = sourceIndex % size;
    if (flipRows) row = size - 1 - row;
    if (flipColumns) column = size - 1 - column;
    for (let turn = 0; turn < turns; turn += 1) [row, column] = [column, size - 1 - row];
    return row * size + column;
  };
  for (let index = 0; index < size * size; index += 1) {
    const destination = transform(index);
    transformed[Math.floor(destination / size)][destination % size] = symbols[fallback.grid[Math.floor(index / size)][index % size] - 1];
  }
  const solution = fallback.solution.map(transform).sort((a, b) => a - b);
  return Object.freeze({ grid: Object.freeze(transformed.map((row) => Object.freeze(row))), solution: Object.freeze(solution), size, difficulty, number: maxAttempts + 1 });
}

export function findHitoriHint(puzzle, blackCells) {
  if (!puzzle || !Array.isArray(puzzle.grid) || !Array.isArray(puzzle.solution)) throw new TypeError('A generated Hitori puzzle is required.');
  const current = new Set(blackCells ?? []);
  const expected = new Set(puzzle.solution);
  for (let index = 0; index < puzzle.size * puzzle.size; index += 1) {
    if (current.has(index) !== expected.has(index)) return Object.freeze({ index, black: expected.has(index) });
  }
  return null;
}
