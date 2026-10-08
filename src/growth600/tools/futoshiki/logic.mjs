const DIFFICULTY = Object.freeze({
  easy: Object.freeze({ clues: 0.58, edges: 0.28 }),
  medium: Object.freeze({ clues: 0.43, edges: 0.4 }),
  hard: Object.freeze({ clues: 0.31, edges: 0.52 }),
});

function randomIndex(length, random) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return Math.floor(value * length);
}

function shuffle(values, random) {
  const result = values.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = randomIndex(index + 1, random);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function validatePuzzle(puzzle) {
  if (!puzzle || !Number.isInteger(puzzle.size) || puzzle.size < 4 || puzzle.size > 6 || !Array.isArray(puzzle.clues) || puzzle.clues.length !== puzzle.size ** 2 || !Array.isArray(puzzle.inequalities)) {
    throw new RangeError('Futoshiki needs a 4×4 to 6×6 grid, one clue slot per cell, and an inequality list.');
  }
  const max = puzzle.size ** 2 - 1;
  for (const value of puzzle.clues) if (!Number.isInteger(value) || value < 0 || value > puzzle.size) throw new RangeError('Futoshiki clues must be blank or between 1 and the grid size.');
  const seen = new Set();
  for (const edge of puzzle.inequalities) {
    if (!edge || !Number.isInteger(edge.a) || !Number.isInteger(edge.b) || edge.a < 0 || edge.a > max || edge.b < 0 || edge.b > max || !['<', '>'].includes(edge.relation)) throw new RangeError('Each Futoshiki inequality must have valid adjacent cells and a < or > relation.');
    const ar = Math.floor(edge.a / puzzle.size); const ac = edge.a % puzzle.size;
    const br = Math.floor(edge.b / puzzle.size); const bc = edge.b % puzzle.size;
    if (Math.abs(ar - br) + Math.abs(ac - bc) !== 1) throw new RangeError('Futoshiki inequalities must join orthogonally adjacent cells.');
    const key = edge.a < edge.b ? `${edge.a}:${edge.b}` : `${edge.b}:${edge.a}`;
    if (seen.has(key)) throw new RangeError('A pair of Futoshiki cells may have only one inequality.');
    seen.add(key);
  }
}

function domainsFor(values, size, inequalities) {
  const domains = Array.from({ length: size ** 2 }, (_, index) => {
    const row = Math.floor(index / size); const column = index % size;
    const used = new Set();
    for (let cursor = 0; cursor < size; cursor += 1) {
      const rowValue = values[row * size + cursor]; const columnValue = values[cursor * size + column];
      if (rowValue) used.add(rowValue);
      if (columnValue) used.add(columnValue);
    }
    return values[index] ? [values[index]] : Array.from({ length: size }, (_, value) => value + 1).filter((value) => !used.has(value));
  });
  for (const edge of inequalities) {
    const aDomain = domains[edge.a]; const bDomain = domains[edge.b];
    if (edge.relation === '<') {
      if (!aDomain.some((a) => bDomain.some((b) => a < b))) return null;
    } else if (!aDomain.some((a) => bDomain.some((b) => a > b))) return null;
  }
  return domains;
}

export function checkFutoshikiBoard(puzzle, values) {
  validatePuzzle(puzzle);
  if (!Array.isArray(values) || values.length !== puzzle.size ** 2) throw new RangeError('Futoshiki board needs one value per cell.');
  if (values.some((value) => !Number.isInteger(value) || value < 0 || value > puzzle.size)) throw new RangeError('Cell values must be blank or between 1 and the grid size.');
  const errors = new Set();
  if (values.includes(0)) errors.add('incomplete');
  for (let row = 0; row < puzzle.size; row += 1) {
    const entries = values.slice(row * puzzle.size, (row + 1) * puzzle.size).filter(Boolean);
    if (new Set(entries).size !== entries.length) errors.add('duplicate-row');
  }
  for (let column = 0; column < puzzle.size; column += 1) {
    const entries = Array.from({ length: puzzle.size }, (_, row) => values[row * puzzle.size + column]).filter(Boolean);
    if (new Set(entries).size !== entries.length) errors.add('duplicate-column');
  }
  for (const edge of puzzle.inequalities) {
    const a = values[edge.a]; const b = values[edge.b];
    if (a && b && (edge.relation === '<' ? a >= b : a <= b)) errors.add('inequality');
  }
  return Object.freeze({ valid: errors.size === 0, complete: !values.includes(0), errors: Object.freeze([...errors]) });
}

export function solveFutoshiki(puzzle, { maxSolutions = 2, maxNodes = 100_000, random = null } = {}) {
  validatePuzzle(puzzle);
  if (!Number.isInteger(maxSolutions) || maxSolutions < 1 || maxSolutions > 10 || !Number.isInteger(maxNodes) || maxNodes < 1 || maxNodes > 1_000_000 || random !== null && typeof random !== 'function') throw new RangeError('Futoshiki solver limits or random source are invalid.');
  const values = puzzle.clues.slice();
  const budget = { nodes: 0, complete: true };
  const solutions = [];

  function search() {
    if (solutions.length >= maxSolutions) { budget.complete = false; return; }
    if (budget.nodes >= maxNodes) { budget.complete = false; return; }
    budget.nodes += 1;
    const domains = domainsFor(values, puzzle.size, puzzle.inequalities);
    if (!domains) return;
    let selected = -1; let candidates = null;
    for (let index = 0; index < values.length; index += 1) {
      if (values[index]) continue;
      if (!candidates || domains[index].length < candidates.length) { selected = index; candidates = domains[index]; }
      if (candidates?.length === 0) return;
    }
    if (selected < 0) {
      const answer = Object.freeze(values.slice());
      if (!solutions.some((previous) => previous.every((value, index) => value === answer[index]))) solutions.push(answer);
      return;
    }
    for (const value of random ? shuffle(candidates, random) : candidates) {
      values[selected] = value;
      search();
      values[selected] = 0;
      if (solutions.length >= maxSolutions || !budget.complete) return;
    }
  }

  search();
  if (solutions.length >= maxSolutions) budget.complete = false;
  return Object.freeze({ solutions: Object.freeze(solutions), complete: budget.complete, nodes: budget.nodes });
}

function buildLatinSolution(size, random) {
  const puzzle = { size, clues: Array(size ** 2).fill(0), inequalities: [] };
  const result = solveFutoshiki(puzzle, { maxSolutions: 1, maxNodes: 100_000, random });
  // The randomized solver deliberately stops after one solution, so it cannot
  // claim exhaustive uniqueness here. Generation only needs a valid solution.
  if (!result.solutions.length) throw new Error('Could not construct a Latin-square solution.');
  return result.solutions[0];
}

function adjacencyEdges(size, solution) {
  const edges = [];
  for (let row = 0; row < size; row += 1) for (let column = 0; column < size; column += 1) {
    const index = row * size + column;
    if (column + 1 < size) edges.push({ a: index, b: index + 1, relation: solution[index] < solution[index + 1] ? '<' : '>' });
    if (row + 1 < size) edges.push({ a: index, b: index + size, relation: solution[index] < solution[index + size] ? '<' : '>' });
  }
  return edges;
}

function fallbackPuzzle(size, difficulty) {
  const solution = Object.freeze(Array.from({ length: size ** 2 }, (_, index) => (Math.floor(index / size) + index % size) % size + 1));
  const clues = difficulty === 'hard' ? solution.slice() : solution.slice();
  return Object.freeze({ size, difficulty, clues: Object.freeze(clues), inequalities: Object.freeze(adjacencyEdges(size, solution).map(Object.freeze)), solution, generated: false });
}

export function createFutoshikiPuzzle({ size = 5, difficulty = 'medium', random = Math.random, maxAttempts = 12, maxNodes = 100_000 } = {}) {
  if (!Number.isInteger(size) || size < 4 || size > 6 || !Object.hasOwn(DIFFICULTY, difficulty) || typeof random !== 'function' || !Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 50 || !Number.isInteger(maxNodes) || maxNodes < 1 || maxNodes > 1_000_000) throw new RangeError('Choose a 4×4 to 6×6 Futoshiki grid, a supported difficulty, and valid generation limits.');
  const settings = DIFFICULTY[difficulty];
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const solution = buildLatinSolution(size, random);
    const edges = shuffle(adjacencyEdges(size, solution), random).slice(0, Math.ceil(size * (size - 1) * 2 * settings.edges));
    const clues = solution.slice();
    const target = Math.max(size, Math.ceil(size ** 2 * settings.clues));
    for (const index of shuffle(Array.from({ length: size ** 2 }, (_, cell) => cell), random)) {
      if (clues.filter(Boolean).length <= target) break;
      const previous = clues[index]; clues[index] = 0;
      const result = solveFutoshiki({ size, clues, inequalities: edges }, { maxSolutions: 2, maxNodes, random: null });
      if (!result.complete || result.solutions.length !== 1 || result.solutions[0].some((value, cell) => value !== solution[cell])) clues[index] = previous;
    }
    const result = solveFutoshiki({ size, clues, inequalities: edges }, { maxSolutions: 2, maxNodes, random: null });
    if (result.complete && result.solutions.length === 1 && result.solutions[0].every((value, index) => value === solution[index])) {
      return Object.freeze({ size, difficulty, clues: Object.freeze(clues), inequalities: Object.freeze(edges.map((edge) => Object.freeze(edge))), solution: Object.freeze(solution.slice()), generated: true, number: attempt });
    }
  }
  const fallback = fallbackPuzzle(size, difficulty);
  return Object.freeze({ ...fallback, difficulty, number: maxAttempts + 1 });
}

export function findFutoshikiHint(puzzle, values) {
  validatePuzzle(puzzle);
  if (!Array.isArray(puzzle.solution) || puzzle.solution.length !== puzzle.size ** 2) throw new TypeError('A generated Futoshiki puzzle with its solution is required.');
  if (!Array.isArray(values) || values.length !== puzzle.size ** 2) throw new RangeError('Futoshiki board needs one value per cell.');
  const index = values.findIndex((value, cell) => value !== puzzle.solution[cell]);
  return index < 0 ? null : Object.freeze({ index, value: puzzle.solution[index] });
}
