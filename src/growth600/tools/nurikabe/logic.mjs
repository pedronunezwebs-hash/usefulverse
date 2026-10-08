const DIFFICULTY = Object.freeze({
  easy: Object.freeze({ islands: [3, 3], sizes: [2, 3] }),
  medium: Object.freeze({ islands: [4, 4], sizes: [2, 4] }),
  hard: Object.freeze({ islands: [4, 5], sizes: [2, 4] }),
});
const FALLBACKS = Object.freeze({
  easy: Object.freeze({ clues: Object.freeze([{ index: 13, size: 2 }, { index: 5, size: 3 }, { index: 23, size: 3 }]), solution: Object.freeze([0,1,2,3,4,7,9,10,12,14,15,16,17,18,19,20,24]) }),
  medium: Object.freeze({ clues: Object.freeze([{ index: 14, size: 2 }, { index: 15, size: 2 }, { index: 3, size: 2 }, { index: 7, size: 4 }]), solution: Object.freeze([0,1,2,5,8,9,10,11,13,16,18,21,22,23,24]) }),
  hard: Object.freeze({ clues: Object.freeze([{ index: 24, size: 2 }, { index: 10, size: 2 }, { index: 17, size: 3 }, { index: 4, size: 2 }, { index: 20, size: 2 }]), solution: Object.freeze([0,1,2,3,6,8,11,13,14,15,16,18,22,23]) }),
});

function randomValue(random) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return value;
}

function shuffled(values, random) {
  const result = values.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(randomValue(random) * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function neighbors(index, size) {
  const row = Math.floor(index / size);
  const column = index % size;
  return [row > 0 ? index - size : -1, row + 1 < size ? index + size : -1, column > 0 ? index - 1 : -1, column + 1 < size ? index + 1 : -1].filter((cell) => cell >= 0);
}

function validatePuzzle(puzzle) {
  if (!puzzle || !Number.isInteger(puzzle.size) || puzzle.size < 4 || puzzle.size > 7 || !Array.isArray(puzzle.clues) || puzzle.clues.length < 2 || puzzle.clues.length > puzzle.size * puzzle.size / 2) {
    throw new RangeError('Nurikabe needs a 4×4 to 7×7 grid and at least two clues.');
  }
  const seen = new Set();
  for (const clue of puzzle.clues) {
    if (!clue || !Number.isInteger(clue.index) || clue.index < 0 || clue.index >= puzzle.size ** 2 || !Number.isInteger(clue.size) || clue.size < 1 || clue.size > puzzle.size ** 2 || seen.has(clue.index)) {
      throw new RangeError('Each Nurikabe clue needs a unique cell and a positive island size.');
    }
    seen.add(clue.index);
  }
}

function isConnected(cells, size) {
  if (cells.size === 0) return false;
  const start = cells.values().next().value;
  const visited = new Set([start]);
  const pending = [start];
  while (pending.length) {
    for (const next of neighbors(pending.pop(), size)) if (cells.has(next) && !visited.has(next)) { visited.add(next); pending.push(next); }
  }
  return visited.size === cells.size;
}

function hasSeaSquare(seaCells, size) {
  for (let row = 0; row < size - 1; row += 1) for (let column = 0; column < size - 1; column += 1) {
    const topLeft = row * size + column;
    if (seaCells.has(topLeft) && seaCells.has(topLeft + 1) && seaCells.has(topLeft + size) && seaCells.has(topLeft + size + 1)) return true;
  }
  return false;
}

export function checkNurikabeBoard(puzzle, seaCells) {
  validatePuzzle(puzzle);
  if (!Array.isArray(seaCells) && !(seaCells instanceof Set)) throw new TypeError('Sea cells must be an array or set of cell indexes.');
  const sea = new Set(seaCells);
  if ([...sea].some((index) => !Number.isInteger(index) || index < 0 || index >= puzzle.size ** 2)) throw new RangeError('A sea cell is outside the grid.');
  const errors = [];
  if (puzzle.clues.some(({ index }) => sea.has(index))) errors.push('clue-in-sea');
  if (hasSeaSquare(sea, puzzle.size)) errors.push('sea-square');
  if (sea.size && !isConnected(sea, puzzle.size)) errors.push('sea-disconnected');

  const land = new Set(Array.from({ length: puzzle.size ** 2 }, (_, index) => index).filter((index) => !sea.has(index)));
  const clueAt = new Map(puzzle.clues.map((clue) => [clue.index, clue]));
  const visited = new Set();
  for (const start of land) {
    if (visited.has(start)) continue;
    const component = new Set([start]);
    const pending = [start];
    visited.add(start);
    while (pending.length) {
      for (const next of neighbors(pending.pop(), puzzle.size)) if (land.has(next) && !visited.has(next)) { visited.add(next); component.add(next); pending.push(next); }
    }
    const clues = [...component].map((index) => clueAt.get(index)).filter(Boolean);
    if (clues.length !== 1) errors.push(clues.length ? 'islands-touch' : 'island-without-clue');
    else if (component.size !== clues[0].size) errors.push('island-size');
  }
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...new Set(errors)]), seaCount: sea.size });
}

function islandCandidates(puzzle, clue, budget) {
  const { size } = puzzle;
  const otherClues = new Set(puzzle.clues.filter((entry) => entry.index !== clue.index).map((entry) => entry.index));
  const forbidden = new Set();
  for (const other of otherClues) for (const neighbor of neighbors(other, size)) forbidden.add(neighbor);
  const allowed = new Set(Array.from({ length: size ** 2 }, (_, index) => index).filter((index) => !otherClues.has(index) && (!forbidden.has(index) || index === clue.index)));
  if (!allowed.has(clue.index)) return [];
  const found = new Map();

  function grow(cells) {
    if (budget.nodes >= budget.maxNodes) {
      budget.complete = false;
      return;
    }
    budget.nodes += 1;
    if (cells.size === clue.size) {
      const ordered = [...cells].sort((a, b) => a - b);
      found.set(ordered.join(','), ordered);
      return;
    }
    const frontier = new Set();
    for (const cell of cells) for (const next of neighbors(cell, size)) if (allowed.has(next) && !cells.has(next)) frontier.add(next);
    for (const next of frontier) {
      grow(new Set([...cells, next]));
      if (!budget.complete) return;
    }
  }

  grow(new Set([clue.index]));
  return [...found.values()];
}

export function solveNurikabe(puzzle, { maxSolutions = 2, maxNodes = 250_000 } = {}) {
  validatePuzzle(puzzle);
  if (!Number.isInteger(maxSolutions) || maxSolutions < 1 || maxSolutions > 10 || !Number.isInteger(maxNodes) || maxNodes < 1 || maxNodes > 1_000_000) throw new RangeError('Nurikabe solver limits are outside the supported range.');
  const budget = { maxNodes, nodes: 0, complete: true };
  const candidateLists = [];
  for (const clue of puzzle.clues) {
    const result = islandCandidates(puzzle, clue, budget);
    candidateLists.push(result);
    if (!budget.complete) return Object.freeze({ solutions: Object.freeze([]), complete: false, nodes: budget.nodes });
  }
  if (candidateLists.some((candidates) => candidates.length === 0)) return Object.freeze({ solutions: Object.freeze([]), complete: true, nodes: budget.nodes });
  const order = candidateLists.map((candidates, index) => ({ index, candidates })).sort((a, b) => a.candidates.length - b.candidates.length);
  const selected = [];
  const solutions = [];
  function search(depth) {
    if (solutions.length >= maxSolutions) { budget.complete = false; return; }
    if (budget.nodes >= maxNodes) { budget.complete = false; return; }
    budget.nodes += 1;
    if (depth === order.length) {
      const land = new Set(selected.flat());
      const sea = new Set(Array.from({ length: puzzle.size ** 2 }, (_, index) => index).filter((index) => !land.has(index)));
      if (hasSeaSquare(sea, puzzle.size) || !isConnected(sea, puzzle.size)) return;
      const answer = [...sea].sort((a, b) => a - b);
      if (!solutions.some((previous) => previous.length === answer.length && previous.every((cell, index) => cell === answer[index]))) solutions.push(Object.freeze(answer));
      return;
    }
    for (const cells of order[depth].candidates) {
      const occupied = new Set(selected.flat());
      let compatible = true;
      for (const cell of cells) {
        if (occupied.has(cell) || neighbors(cell, puzzle.size).some((next) => occupied.has(next))) { compatible = false; break; }
      }
      if (!compatible) continue;
      selected.push(cells);
      search(depth + 1);
      selected.pop();
      if (solutions.length >= maxSolutions || !budget.complete) return;
    }
  }

  search(0);
  return Object.freeze({ solutions: Object.freeze(solutions.slice()), complete: budget.complete, nodes: budget.nodes });
}

function createLayout(size, islandSizes, random) {
  const islands = [];
  for (const islandSize of islandSizes) {
    const occupied = new Set(islands.flat());
    const legalStarts = shuffled(Array.from({ length: size ** 2 }, (_, index) => index), random).filter((cell) => !occupied.has(cell) && !neighbors(cell, size).some((next) => occupied.has(next)));
    let placed = null;
    for (const start of legalStarts) {
      const island = new Set([start]);
      while (island.size < islandSize) {
        const frontier = new Set();
        for (const cell of island) for (const next of neighbors(cell, size)) if (!island.has(next) && !occupied.has(next) && !neighbors(next, size).some((adjacent) => occupied.has(adjacent))) frontier.add(next);
        if (!frontier.size) break;
        island.add(shuffled([...frontier], random)[0]);
      }
      if (island.size === islandSize) { placed = [...island]; break; }
    }
    if (!placed) return null;
    islands.push(placed);
  }
  const land = new Set(islands.flat());
  const sea = new Set(Array.from({ length: size ** 2 }, (_, index) => index).filter((index) => !land.has(index)));
  if (!isConnected(sea, size) || hasSeaSquare(sea, size)) return null;
  return islands;
}

export function createNurikabePuzzle({ difficulty = 'easy', random = Math.random, maxAttempts = 800 } = {}) {
  if (!Object.hasOwn(DIFFICULTY, difficulty)) throw new RangeError('Choose easy, medium or hard difficulty.');
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 2_000) throw new RangeError('Puzzle generation attempts are outside the supported range.');
  const size = 5;
  const settings = DIFFICULTY[difficulty];
  let solverNodes = 0;
  const generationNodeBudget = 200_000;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const islandCount = settings.islands[0] + Math.floor(randomValue(random) * (settings.islands[1] - settings.islands[0] + 1));
    const islandSizes = Array.from({ length: islandCount }, () => settings.sizes[0] + Math.floor(randomValue(random) * (settings.sizes[1] - settings.sizes[0] + 1)));
    if (islandSizes.reduce((sum, value) => sum + value, 0) > size ** 2 - 4) continue;
    const islands = createLayout(size, islandSizes, random);
    if (!islands) continue;
    const clues = islands.map((cells) => ({ index: shuffled(cells, random)[0], size: cells.length }));
    const puzzle = { size, clues: Object.freeze(clues.map((clue) => Object.freeze(clue))), difficulty, number: attempt + 1 };
    const remainingNodes = generationNodeBudget - solverNodes;
    if (remainingNodes <= 0) break;
    const solved = solveNurikabe(puzzle, { maxSolutions: 2, maxNodes: Math.min(80_000, remainingNodes) });
    solverNodes += solved.nodes;
    const landCells = new Set(islands.flat());
    const expectedSea = Array.from({ length: size ** 2 }, (_, index) => index).filter((index) => !landCells.has(index));
    if (solved.complete && solved.solutions.length === 1 && solved.solutions[0].length === expectedSea.length && solved.solutions[0].every((cell, index) => cell === expectedSea[index])) {
      return Object.freeze({ ...puzzle, solution: solved.solutions[0] });
    }
  }
  const fallback = FALLBACKS[difficulty];
  const turns = Math.floor(randomValue(random) * 4);
  const flipRows = randomValue(random) >= 0.5;
  const flipColumns = randomValue(random) >= 0.5;
  const transform = (index) => {
    let row = Math.floor(index / size);
    let column = index % size;
    if (flipRows) row = size - 1 - row;
    if (flipColumns) column = size - 1 - column;
    for (let turn = 0; turn < turns; turn += 1) [row, column] = [column, size - 1 - row];
    return row * size + column;
  };
  const clues = fallback.clues.map((clue) => Object.freeze({ ...clue, index: transform(clue.index) }));
  const solution = Object.freeze(fallback.solution.map(transform).sort((a, b) => a - b));
  return Object.freeze({ size, clues: Object.freeze(clues), difficulty, number: maxAttempts + 1, solution });
}

export function findNurikabeHint(puzzle, seaCells) {
  if (!puzzle || !Array.isArray(puzzle.solution)) throw new TypeError('A generated Nurikabe puzzle is required.');
  const current = new Set(seaCells ?? []);
  const expected = new Set(puzzle.solution);
  for (let index = 0; index < puzzle.size ** 2; index += 1) if (current.has(index) !== expected.has(index)) return Object.freeze({ index, sea: expected.has(index) });
  return null;
}
