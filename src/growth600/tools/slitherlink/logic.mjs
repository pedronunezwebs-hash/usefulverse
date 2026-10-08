const ALLOWED_SIZES = new Set([4, 5, 6]);

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

function edgeCount(size) { return size * (size + 1) * 2; }

function horizontal(size, row, column) { return row * size + column; }
function vertical(size, row, column) { return size * (size + 1) + row * (size + 1) + column; }

function cellEdges(size, index) {
  const row = Math.floor(index / size);
  const column = index % size;
  return [horizontal(size, row, column), horizontal(size, row + 1, column), vertical(size, row, column), vertical(size, row, column + 1)];
}

function vertexEdges(size, vertex) {
  const width = size + 1;
  const row = Math.floor(vertex / width);
  const column = vertex % width;
  const edges = [];
  if (row > 0) edges.push(vertical(size, row - 1, column));
  if (row < size) edges.push(vertical(size, row, column));
  if (column > 0) edges.push(horizontal(size, row, column - 1));
  if (column < size) edges.push(horizontal(size, row, column));
  return edges;
}

function validatePuzzle(puzzle) {
  if (!puzzle || !ALLOWED_SIZES.has(puzzle.size) || !Array.isArray(puzzle.clues) || puzzle.clues.length !== puzzle.size ** 2) throw new RangeError('Slitherlink puzzle must be a square grid from 4 to 6.');
  if (puzzle.clues.some((clue) => clue !== null && (!Number.isInteger(clue) || clue < 0 || clue > 3))) throw new RangeError('Slitherlink clues must be blank or whole numbers from 0 to 3.');
}

function isOneLoop(size, edges) {
  const selected = new Set(edges);
  if (selected.size < 4) return false;
  const vertices = new Map();
  for (let vertex = 0; vertex < (size + 1) ** 2; vertex += 1) {
    const incident = vertexEdges(size, vertex).filter((edge) => selected.has(edge));
    if (incident.length === 1 || incident.length > 2) return false;
    if (incident.length === 2) vertices.set(vertex, incident);
  }
  const first = vertices.keys().next().value;
  const pending = [first];
  const seen = new Set([first]);
  while (pending.length) {
    const vertex = pending.pop();
    for (const edge of vertices.get(vertex) ?? []) {
      const pair = edgeEndpoints(size, edge);
      const next = pair[0] === vertex ? pair[1] : pair[0];
      if (!seen.has(next)) { seen.add(next); pending.push(next); }
    }
  }
  return seen.size === vertices.size;
}

function edgeEndpoints(size, edge) {
  const horizontalCount = size * (size + 1);
  if (edge < horizontalCount) {
    const row = Math.floor(edge / size);
    const column = edge % size;
    return [row * (size + 1) + column, row * (size + 1) + column + 1];
  }
  const index = edge - horizontalCount;
  const row = Math.floor(index / (size + 1));
  const column = index % (size + 1);
  return [row * (size + 1) + column, (row + 1) * (size + 1) + column];
}

function propagate(size, clues, state) {
  let changed = true;
  while (changed) {
    changed = false;
    const constraints = [];
    for (let index = 0; index < clues.length; index += 1) if (clues[index] !== null) constraints.push([cellEdges(size, index), clues[index], false]);
    for (let vertex = 0; vertex < (size + 1) ** 2; vertex += 1) constraints.push([vertexEdges(size, vertex), 2, true]);
    for (const [edges, target, isVertex] of constraints) {
      const on = edges.filter((edge) => state[edge] === 1).length;
      const unknown = edges.filter((edge) => state[edge] < 0);
      if (isVertex) {
        if (on > 2 || on === 1 && unknown.length === 0) return false;
        if (on === 2 || on === 0 && unknown.length <= 1) {
          for (const edge of unknown) if (state[edge] < 0) { state[edge] = 0; changed = true; }
        } else if (on === 1 && unknown.length === 1) {
          state[unknown[0]] = 1; changed = true;
        }
      } else {
        if (on > target || on + unknown.length < target) return false;
        if (on === target) for (const edge of unknown) { state[edge] = 0; changed = true; }
        else if (on + unknown.length === target) for (const edge of unknown) { state[edge] = 1; changed = true; }
      }
    }
  }
  return true;
}

export function solveSlitherlink(puzzle, { maxSolutions = 2, maxNodes = 100_000 } = {}) {
  validatePuzzle(puzzle);
  if (!Number.isInteger(maxSolutions) || maxSolutions < 1 || maxSolutions > 10 || !Number.isInteger(maxNodes) || maxNodes < 1 || maxNodes > 1_000_000) throw new RangeError('Solver limits are outside the supported range.');
  const solutions = [];
  let nodes = 0;
  let complete = true;
  function visit(original) {
    if (solutions.length >= maxSolutions || !complete) return;
    nodes += 1;
    if (nodes > maxNodes) { complete = false; return; }
    const state = original.slice();
    if (!propagate(puzzle.size, puzzle.clues, state)) return;
    let choice = -1;
    let bestScore = -1;
    for (let edge = 0; edge < state.length; edge += 1) {
      if (state[edge] >= 0) continue;
      let score = 0;
      for (let index = 0; index < puzzle.clues.length; index += 1) if (puzzle.clues[index] !== null && cellEdges(puzzle.size, index).includes(edge)) score += 4;
      for (let vertex = 0; vertex < (puzzle.size + 1) ** 2; vertex += 1) if (vertexEdges(puzzle.size, vertex).includes(edge)) score += 1;
      if (score > bestScore) { choice = edge; bestScore = score; }
    }
    if (choice < 0) {
      const selected = Array.from(state, (value, index) => value === 1 ? index : -1).filter((edge) => edge >= 0);
      if (isOneLoop(puzzle.size, selected) && !solutions.some((solution) => solution.length === selected.length && solution.every((edge, index) => edge === selected[index]))) solutions.push(Object.freeze(selected));
      return;
    }
    for (const value of [1, 0]) {
      const branch = state.slice();
      branch[choice] = value;
      visit(branch);
      if (solutions.length >= maxSolutions || !complete) return;
    }
  }
  visit(new Int8Array(edgeCount(puzzle.size)).fill(-1));
  return Object.freeze({ solutions: Object.freeze(solutions.slice()), complete, nodes });
}

export function checkSlitherlinkBoard(puzzle, selectedEdges) {
  validatePuzzle(puzzle);
  if (!Array.isArray(selectedEdges) && !(selectedEdges instanceof Set)) throw new TypeError('Selected edges must be an array or set.');
  const selected = new Set(selectedEdges);
  if ([...selected].some((edge) => !Number.isInteger(edge) || edge < 0 || edge >= edgeCount(puzzle.size))) throw new RangeError('A selected edge is outside the board.');
  const degrees = Array.from({ length: (puzzle.size + 1) ** 2 }, (_, vertex) => vertexEdges(puzzle.size, vertex).filter((edge) => selected.has(edge)).length);
  const degreeErrors = degrees.filter((degree) => degree !== 0 && degree !== 2).length;
  const clueErrors = [];
  for (let index = 0; index < puzzle.clues.length; index += 1) {
    const clue = puzzle.clues[index];
    if (clue !== null && cellEdges(puzzle.size, index).filter((edge) => selected.has(edge)).length !== clue) clueErrors.push(index);
  }
  const loopValid = degreeErrors === 0 && isOneLoop(puzzle.size, selected);
  return Object.freeze({ valid: loopValid && clueErrors.length === 0, loopValid, degreeErrors, clueErrors: Object.freeze(clueErrors) });
}

function solutionFromCells(size, cells) {
  const edges = new Set();
  for (const cell of cells) for (const edge of cellEdges(size, cell)) {
    const adjacent = [];
    const row = Math.floor(cell / size);
    const column = cell % size;
    if (edge === horizontal(size, row, column) && row > 0) adjacent.push((row - 1) * size + column);
    else if (edge === horizontal(size, row + 1, column) && row + 1 < size) adjacent.push((row + 1) * size + column);
    else if (edge === vertical(size, row, column) && column > 0) adjacent.push(row * size + column - 1);
    else if (edge === vertical(size, row, column + 1) && column + 1 < size) adjacent.push(row * size + column + 1);
    if (!adjacent.some((neighbor) => cells.has(neighbor))) edges.add(edge);
  }
  return [...edges].sort((a, b) => a - b);
}

function clueCounts(size, edges) {
  return Array.from({ length: size ** 2 }, (_, index) => cellEdges(size, index).filter((edge) => edges.includes(edge)).length);
}

function randomPolyomino(size, random) {
  const count = Math.max(4, Math.floor(size * size * (0.3 + checkedRandom(random) * 0.25)));
  const cells = new Set([Math.floor(checkedRandom(random) * size) * size + Math.floor(checkedRandom(random) * size)]);
  while (cells.size < count) {
    const frontier = new Set();
    for (const cell of cells) {
      const row = Math.floor(cell / size);
      const column = cell % size;
      if (row > 0) frontier.add(cell - size);
      if (row + 1 < size) frontier.add(cell + size);
      if (column > 0) frontier.add(cell - 1);
      if (column + 1 < size) frontier.add(cell + 1);
    }
    const options = shuffled([...frontier].filter((cell) => !cells.has(cell)), random);
    if (!options.length) break;
    cells.add(options[0]);
  }
  return cells;
}

export function createSlitherlinkPuzzle({ size = 5, random = Math.random, maxAttempts = 80, maxNodes = 30_000 } = {}) {
  if (!ALLOWED_SIZES.has(size)) throw new RangeError('Choose a Slitherlink grid from 4 to 6.');
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 500) throw new RangeError('Generation attempts are outside the supported range.');
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const loop = solutionFromCells(size, randomPolyomino(size, random));
    if (!isOneLoop(size, loop)) continue;
    const clues = clueCounts(size, loop);
    const puzzle = { size, clues };
    const solved = solveSlitherlink(puzzle, { maxSolutions: 2, maxNodes });
    if (!solved.complete || solved.solutions.length !== 1) continue;
    const puzzleClues = clues.slice();
    const maximumBlanks = Math.floor(size * size * 0.2);
    let blanks = 0;
    for (const index of shuffled(Array.from({ length: clues.length }, (_, value) => value), random)) {
      if (blanks >= maximumBlanks || puzzleClues[index] === null) continue;
      const clue = puzzleClues[index];
      puzzleClues[index] = null;
      const reduced = solveSlitherlink({ size, clues: puzzleClues }, { maxSolutions: 2, maxNodes });
      if (reduced.complete && reduced.solutions.length === 1) blanks += 1;
      else puzzleClues[index] = clue;
    }
    return Object.freeze({ size, clues: Object.freeze(puzzleClues), solution: solved.solutions[0], number: attempt + 1 });
  }
  throw new Error('Could not generate a uniquely solvable puzzle within the attempt limit.');
}

export function findSlitherlinkHint(puzzle, selectedEdges) {
  validatePuzzle(puzzle);
  const solved = solveSlitherlink(puzzle, { maxSolutions: 2 });
  if (!solved.complete || solved.solutions.length !== 1) return null;
  const selected = new Set(selectedEdges ?? []);
  for (let edge = 0; edge < edgeCount(puzzle.size); edge += 1) {
    const inSolution = solved.solutions[0].includes(edge);
    if (inSolution !== selected.has(edge)) return Object.freeze({ edge, selected: inSolution });
  }
  return null;
}
