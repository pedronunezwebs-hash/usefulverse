const validRandomValue = (random) => {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return value;
};

const validRandomIndex = (random, max) => {
  const value = validRandomValue(random);
  return Math.floor(value * max);
};

export function lineClues(line) {
  const clues = []; let run = 0;
  for (const filled of line) {
    if (filled) run += 1;
    else if (run) { clues.push(run); run = 0; }
  }
  if (run) clues.push(run);
  return clues.length ? clues : [0];
}

const cluesForGrid = (grid) => ({
  rows: grid.map(lineClues),
  columns: Array.from({ length: grid.length }, (_, column) => lineClues(grid.map((row) => row[column]))),
});

const candidatesForLine = (size, clues) => {
  const result = [];
  for (let pattern = 0; pattern < 2 ** size; pattern += 1) {
    const line = Array.from({ length: size }, (_, index) => Boolean(pattern & (1 << (size - index - 1))));
    if (JSON.stringify(lineClues(line)) === JSON.stringify(clues)) result.push(line);
  }
  return result;
};

export function countNonogramSolutions(rows, columns, limit = 2) {
  const size = rows.length;
  if (!Number.isInteger(size) || size < 1 || size > 10 || columns.length !== size || !Number.isInteger(limit) || limit < 1) throw new RangeError('Nonogram clues need a square board of 1 to 10 cells per side and a positive solution limit.');
  const rowCandidates = rows.map((clues) => candidatesForLine(size, clues));
  const columnCandidates = columns.map((clues) => candidatesForLine(size, clues));
  if (rowCandidates.some((candidates) => !candidates.length) || columnCandidates.some((candidates) => !candidates.length)) return 0;
  const possibilities = columnCandidates.map((candidate) => candidate.map((line) => line));
  const grid = [];
  let solutions = 0;
  const search = (rowIndex) => {
    if (solutions >= limit) return;
    if (rowIndex === size) { solutions += 1; return; }
    for (const row of rowCandidates[rowIndex]) {
      const nextPossibilities = possibilities.map((candidates, column) => candidates.filter((line) => line[rowIndex] === row[column]));
      if (nextPossibilities.some((candidates) => !candidates.length)) continue;
      grid.push(row); const previous = possibilities.splice(0, size, ...nextPossibilities);
      search(rowIndex + 1);
      possibilities.splice(0, size, ...previous); grid.pop();
      if (solutions >= limit) return;
    }
  };
  search(0);
  return solutions;
}

const BASE_PATTERN = [
  [1, 1, 0, 0, 0],
  [1, 1, 1, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1],
  [0, 0, 0, 1, 0],
];

const shuffled = (values, random) => {
  const output = [...values];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const target = validRandomIndex(random, index + 1);
    [output[index], output[target]] = [output[target], output[index]];
  }
  return output;
};

export function generateNonogram(random = Math.random) {
  if (typeof random !== 'function') throw new TypeError('Provide a random function.');
  const size = 5;
  let grid;
  for (let attempt = 0; attempt < 96; attempt += 1) {
    grid = Array.from({ length: size }, () => Array.from({ length: size }, () => Number(validRandomValue(random) < 0.44)));
    const filled = grid.flat().reduce((sum, value) => sum + value, 0);
    if (filled < 5 || filled > size * size - 5) continue;
    const clues = cluesForGrid(grid);
    if (countNonogramSolutions(clues.rows, clues.columns, 2) === 1) return { size, grid, ...clues };
  }
  const rowOrder = shuffled([0, 1, 2, 3, 4], random);
  const columnOrder = shuffled([0, 1, 2, 3, 4], random);
  grid = rowOrder.map((row) => columnOrder.map((column) => BASE_PATTERN[row][column]));
  const clues = cluesForGrid(grid);
  if (countNonogramSolutions(clues.rows, clues.columns, 2) !== 1) throw new Error('The fallback nonogram pattern must have a unique solution.');
  return { size, grid, ...clues };
}

export function checkNonogramSolution(game, entries) {
  if (!Array.isArray(entries) || entries.length !== game.size || entries.some((row) => !Array.isArray(row) || row.length !== game.size)) return false;
  return entries.every((row, rowIndex) => row.every((filled, column) => Boolean(filled) === Boolean(game.grid[rowIndex][column])));
}
