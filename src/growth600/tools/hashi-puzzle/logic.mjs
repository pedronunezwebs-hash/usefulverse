const SETTINGS = Object.freeze({
  easy: Object.freeze({ islands: 5, extraBridges: 0, doubleChance: 0.1 }),
  medium: Object.freeze({ islands: 9, extraBridges: 1, doubleChance: 0.2 }),
  hard: Object.freeze({ islands: 11, extraBridges: 2, doubleChance: 0.28 }),
});

function randomIndex(length, random) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return Math.floor(value * length);
}

function shuffle(items, random) {
  const result = items.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = randomIndex(index + 1, random);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function crosses(first, second, islands) {
  const a = islands[first.a]; const b = islands[first.b];
  const c = islands[second.a]; const d = islands[second.b];
  const horizontal = a.row === b.row ? first : second;
  const vertical = a.row !== b.row ? first : second;
  const h1 = islands[horizontal.a]; const h2 = islands[horizontal.b];
  const v1 = islands[vertical.a]; const v2 = islands[vertical.b];
  if (h1.row !== h2.row || v1.column !== v2.column) return false;
  const left = Math.min(h1.column, h2.column); const right = Math.max(h1.column, h2.column);
  const top = Math.min(v1.row, v2.row); const bottom = Math.max(v1.row, v2.row);
  return v1.column > left && v1.column < right && h1.row > top && h1.row < bottom;
}

function findBridges(islands) {
  const edges = [];
  const rows = new Map(); const columns = new Map();
  islands.forEach((island, index) => {
    rows.set(island.row, [...(rows.get(island.row) ?? []), index]);
    columns.set(island.column, [...(columns.get(island.column) ?? []), index]);
  });
  for (const [row, indexes] of rows) {
    indexes.sort((a, b) => islands[a].column - islands[b].column);
    for (let i = 0; i < indexes.length - 1; i += 1) edges.push({ a: indexes[i], b: indexes[i + 1], orientation: 'horizontal', row, column: islands[indexes[i]].column });
  }
  for (const [column, indexes] of columns) {
    indexes.sort((a, b) => islands[a].row - islands[b].row);
    for (let i = 0; i < indexes.length - 1; i += 1) edges.push({ a: indexes[i], b: indexes[i + 1], orientation: 'vertical', row: islands[indexes[i]].row, column });
  }
  return edges.map((edge, index) => Object.freeze({ ...edge, index }));
}

function validatePuzzle(puzzle) {
  if (!puzzle || !Number.isInteger(puzzle.gridSize) || puzzle.gridSize < 4 || puzzle.gridSize > 9 || !Array.isArray(puzzle.islands) || puzzle.islands.length < 2 || puzzle.islands.length > 40 || !Array.isArray(puzzle.bridges)) throw new RangeError('Hashi needs 2–40 islands on a 4×4 to 9×9 board and a bridge list.');
  for (const island of puzzle.islands) if (!island || !Number.isInteger(island.row) || !Number.isInteger(island.column) || island.row < 0 || island.row >= puzzle.gridSize || island.column < 0 || island.column >= puzzle.gridSize || !Number.isInteger(island.degree) || island.degree < 1 || island.degree > 8) throw new RangeError('Each island needs a valid coordinate and bridge count from 1 to 8.');
  if (new Set(puzzle.islands.map(({ row, column }) => `${row}:${column}`)).size !== puzzle.islands.length) throw new RangeError('Hashi islands must occupy different positions.');
  const keys = new Set();
  for (const bridge of puzzle.bridges) {
    if (!bridge || !Number.isInteger(bridge.a) || !Number.isInteger(bridge.b) || bridge.a < 0 || bridge.b < 0 || bridge.a >= puzzle.islands.length || bridge.b >= puzzle.islands.length || bridge.a === bridge.b) throw new RangeError('Every bridge must connect two different islands.');
    const key = bridge.a < bridge.b ? `${bridge.a}:${bridge.b}` : `${bridge.b}:${bridge.a}`;
    if (keys.has(key)) throw new RangeError('A bridge pair may appear only once.');
    keys.add(key);
  }
}

function derivePuzzle(puzzle, counts) {
  const totals = Array(puzzle.islands.length).fill(0);
  counts.forEach((count, index) => {
    if (count > 0) { totals[puzzle.bridges[index].a] += count; totals[puzzle.bridges[index].b] += count; }
  });
  return totals;
}

function connected(islands, bridges, counts) {
  const visited = new Set([0]); const queue = [0];
  while (queue.length) {
    const current = queue.shift();
    bridges.forEach((edge, index) => {
      if (counts[index] === 0) return;
      const next = edge.a === current ? edge.b : edge.b === current ? edge.a : -1;
      if (next >= 0 && !visited.has(next)) { visited.add(next); queue.push(next); }
    });
  }
  return visited.size === islands.length;
}

export function checkHashiBoard(puzzle, counts) {
  validatePuzzle(puzzle);
  if (!Array.isArray(counts) || counts.length !== puzzle.bridges.length || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 2)) throw new RangeError('Enter zero, one or two bridges for each connected island pair.');
  const errors = new Set(); const totals = derivePuzzle(puzzle, counts);
  if (puzzle.islands.some((island, index) => totals[index] !== island.degree)) errors.add('degree');
  for (let first = 0; first < puzzle.bridges.length; first += 1) {
    if (!counts[first]) continue;
    for (let second = first + 1; second < puzzle.bridges.length; second += 1) if (counts[second] && crosses(puzzle.bridges[first], puzzle.bridges[second], puzzle.islands)) errors.add('crossing');
  }
  if (counts.some(Boolean) && !connected(puzzle.islands, puzzle.bridges, counts)) errors.add('disconnected');
  return Object.freeze({ valid: errors.size === 0, totals: Object.freeze(totals), errors: Object.freeze([...errors]) });
}

export function solveHashi(puzzle, { maxSolutions = 2, maxNodes = 80_000 } = {}) {
  validatePuzzle(puzzle);
  if (!Number.isInteger(maxSolutions) || maxSolutions < 1 || maxSolutions > 10 || !Number.isInteger(maxNodes) || maxNodes < 1 || maxNodes > 1_000_000) throw new RangeError('Hashi solver limits are invalid.');
  const incident = puzzle.islands.map((_, island) => puzzle.bridges.map((edge, index) => edge.a === island || edge.b === island ? index : -1).filter((index) => index >= 0));
  const crossing = puzzle.bridges.map((edge, index) => puzzle.bridges.map((other, otherIndex) => otherIndex !== index && crosses(edge, other, puzzle.islands) ? otherIndex : -1).filter((otherIndex) => otherIndex >= 0));
  const solutions = []; const budget = { nodes: 0, complete: true };

  function propagate(state) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let index = 0; index < state.length; index += 1) if (state[index] > 0) for (const other of crossing[index]) {
        if (state[other] > 0) return false;
        if (state[other] === -1) { state[other] = 0; changed = true; }
      }
      for (let island = 0; island < puzzle.islands.length; island += 1) {
        const edges = incident[island]; const target = puzzle.islands[island].degree;
        const used = edges.reduce((sum, index) => sum + Math.max(0, state[index]), 0);
        const unknown = edges.filter((index) => state[index] < 0);
        const need = target - used;
        if (need < 0 || need > unknown.length * 2 || (unknown.length === 0 && need !== 0)) return false;
        if (unknown.length && (need === 0 || need === unknown.length * 2)) {
          const value = need === 0 ? 0 : 2;
          for (const index of unknown) { state[index] = value; changed = true; }
        }
      }
    }
    return true;
  }

  function search(incoming) {
    if (solutions.length >= maxSolutions) { budget.complete = false; return; }
    if (budget.nodes >= maxNodes) { budget.complete = false; return; }
    budget.nodes += 1;
    const state = incoming.slice();
    if (!propagate(state)) return;
    const unresolved = state.map((value, index) => value < 0 ? index : -1).filter((index) => index >= 0);
    if (!unresolved.length) {
      const totals = derivePuzzle(puzzle, state);
      if (totals.every((value, island) => value === puzzle.islands[island].degree) && connected(puzzle.islands, puzzle.bridges, state)) {
        if (!solutions.some((previous) => previous.every((value, index) => value === state[index]))) solutions.push(Object.freeze(state));
      }
      return;
    }
    const selected = unresolved.reduce((best, index) => {
      const linked = incident[puzzle.bridges[index].a].filter((edge) => state[edge] < 0).length + incident[puzzle.bridges[index].b].filter((edge) => state[edge] < 0).length;
      return linked < best.score ? { index, score: linked } : best;
    }, { index: unresolved[0], score: Infinity }).index;
    for (const value of [0, 1, 2]) {
      const next = state.slice(); next[selected] = value; search(next);
      if (solutions.length >= maxSolutions || !budget.complete) return;
    }
  }
  search(Array(puzzle.bridges.length).fill(-1));
  if (solutions.length >= maxSolutions) budget.complete = false;
  return Object.freeze({ solutions: Object.freeze(solutions), complete: budget.complete, nodes: budget.nodes });
}

function disjointSet(size) {
  const parent = Array.from({ length: size }, (_, index) => index);
  const find = (index) => { while (parent[index] !== index) { parent[index] = parent[parent[index]]; index = parent[index]; } return index; };
  return { find, join(a, b) { const rootA = find(a); const rootB = find(b); if (rootA === rootB) return false; parent[rootA] = rootB; return true; } };
}

function fallbackPuzzle(random, difficulty) {
  const horizontal = random() < 0.5;
  const gapA = 1 + randomIndex(2, random); const gapB = 1 + randomIndex(2, random);
  const total = gapA + gapB; const start = randomIndex(7 - total, random);
  const fixed = randomIndex(7, random);
  const points = [start, start + gapA, start + total];
  const islands = points.map((point, index) => ({ row: horizontal ? fixed : point, column: horizontal ? point : fixed, degree: index === 1 ? 2 : 1 }));
  const bridges = findBridges(islands);
  return Object.freeze({ gridSize: 7, difficulty: 'easy', islands: Object.freeze(islands.map(Object.freeze)), bridges, solution: Object.freeze([1, 1]), generated: false });
}

export function createHashiPuzzle({ difficulty = 'medium', random = Math.random, maxAttempts = 40, maxNodes = 80_000 } = {}) {
  if (!Object.hasOwn(SETTINGS, difficulty) || typeof random !== 'function' || !Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 100 || !Number.isInteger(maxNodes) || maxNodes < 1 || maxNodes > 1_000_000) throw new RangeError('Choose an available Hashi difficulty and valid generation limits.');
  const settings = SETTINGS[difficulty]; const gridSize = 7;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const positions = shuffle(Array.from({ length: gridSize ** 2 }, (_, index) => ({ row: Math.floor(index / gridSize), column: index % gridSize })), random).slice(0, settings.islands);
    const islands = positions.map((position) => ({ ...position, degree: 1 }));
    const candidates = findBridges(islands); const tree = disjointSet(islands.length); const solution = Array(candidates.length).fill(0);
    for (const edge of shuffle(candidates, random)) if (tree.join(edge.a, edge.b)) solution[edge.index] = random() < settings.doubleChance ? 2 : 1;
    if (!connected(islands, candidates, solution)) continue;
    const optional = shuffle(candidates.filter((edge) => solution[edge.index] === 0), random);
    let added = 0;
    for (const edge of optional) {
      if (added >= settings.extraBridges) break;
      if (candidates.some((other) => solution[other.index] > 0 && crosses(edge, other, islands))) continue;
      solution[edge.index] = random() < settings.doubleChance ? 2 : 1; added += 1;
    }
    const totals = derivePuzzle({ islands, bridges: candidates }, solution);
    if (totals.some((degree) => degree === 0 || degree > 8)) continue;
    const puzzle = { gridSize, difficulty, islands: islands.map((island, index) => ({ ...island, degree: totals[index] })), bridges: candidates, solution: Object.freeze(solution), generated: true };
    const result = solveHashi(puzzle, { maxSolutions: 2, maxNodes });
    if (result.complete && result.solutions.length === 1 && result.solutions[0].every((value, index) => value === solution[index])) {
      return Object.freeze({ ...puzzle, islands: Object.freeze(puzzle.islands.map(Object.freeze)), number: attempt + 1 });
    }
  }
  const fallback = fallbackPuzzle(random, difficulty);
  return Object.freeze({ ...fallback, difficulty, number: maxAttempts + 1 });
}

export function findHashiHint(puzzle, counts) {
  validatePuzzle(puzzle);
  if (!Array.isArray(puzzle.solution) || puzzle.solution.length !== puzzle.bridges.length || !Array.isArray(counts) || counts.length !== puzzle.bridges.length) throw new TypeError('A generated Hashi puzzle with a matching solution and bridge state is required.');
  const index = counts.findIndex((value, edge) => value !== puzzle.solution[edge]);
  return index < 0 ? null : Object.freeze({ index, count: puzzle.solution[index] });
}

export function findHashiBridges(islands) {
  if (!Array.isArray(islands) || islands.length < 2) throw new RangeError('At least two islands are required.');
  return findBridges(islands);
}
