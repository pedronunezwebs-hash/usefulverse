const NEIGHBORS = Object.freeze(Array.from({ length: 9 }, (_, index) => {
  const dr = Math.floor(index / 3) - 1;
  const dc = index % 3 - 1;
  return [dr, dc];
}).filter(([dr, dc]) => dr !== 0 || dc !== 0));

function seededRandom(seed) {
  let state = (Number(seed) >>> 0) || 0x9e3779b9;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const shuffle = (items, random) => {
  const values = [...items];
  for (let index = values.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [values[index], values[other]] = [values[other], values[index]];
  }
  return values;
};

function neighborsOf(index, width, height) {
  const row = Math.floor(index / width);
  const column = index % width;
  return NEIGHBORS.flatMap(([dr, dc]) => {
    const r = row + dr;
    const c = column + dc;
    return r >= 0 && r < height && c >= 0 && c < width ? [r * width + c] : [];
  });
}

export function validateSuguruBoard({ width, height, regions, values }) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width * height > 100) return { valid: false, reason: 'dimensions' };
  const count = width * height;
  if (!Array.isArray(regions) || !Array.isArray(values) || values.length !== count) return { valid: false, reason: 'shape' };
  const regionOf = Array(count).fill(-1);
  for (let regionId = 0; regionId < regions.length; regionId += 1) {
    const region = regions[regionId];
    if (!Array.isArray(region) || region.length < 1 || region.length > 5) return { valid: false, reason: 'region-size', regionId };
    for (const cell of region) {
      if (!Number.isInteger(cell) || cell < 0 || cell >= count || regionOf[cell] !== -1) return { valid: false, reason: 'region-overlap', cell };
      regionOf[cell] = regionId;
    }
    const connected = new Set([region[0]]);
    const frontier = [region[0]];
    while (frontier.length) {
      const current = frontier.pop();
      for (const next of neighborsOf(current, width, height).filter((cell) => Math.abs(Math.floor(cell / width) - Math.floor(current / width)) + Math.abs(cell % width - current % width) === 1)) {
        if (region.includes(next) && !connected.has(next)) { connected.add(next); frontier.push(next); }
      }
    }
    if (connected.size !== region.length) return { valid: false, reason: 'region-disconnected', regionId };
    const seen = new Set();
    for (const cell of region) {
      const value = values[cell];
      if (value === 0 || value === null || value === undefined) continue;
      if (!Number.isInteger(value) || value < 1 || value > region.length || seen.has(value)) return { valid: false, reason: 'region-values', regionId, cell };
      seen.add(value);
    }
  }
  if (regionOf.some((regionId) => regionId === -1)) return { valid: false, reason: 'region-missing-cell' };
  for (let cell = 0; cell < count; cell += 1) {
    const value = values[cell];
    if (value === 0 || value === null || value === undefined) continue;
    if (!Number.isInteger(value) || value < 1 || value > 5) return { valid: false, reason: 'value-range', cell };
    for (const next of neighborsOf(cell, width, height)) if (next > cell && values[next] === value) return { valid: false, reason: 'touching-equal-values', cell, other: next };
  }
  return { valid: true, complete: values.every((value) => Number.isInteger(value) && value > 0) };
}

export function countSuguruSolutions({ width, height, regions, givens }, { limit = 2, maxNodes = 250_000, random = null } = {}) {
  const count = width * height;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || count > 100 || !Array.isArray(givens) || givens.length !== count || !Array.isArray(regions)) return { count: 0, nodes: 0, complete: true, first: null };
  const regionOf = Array(count).fill(-1);
  const regionCells = regions.map((region, id) => {
    if (!Array.isArray(region) || region.length < 1 || region.length > 5) return [];
    for (const cell of region) {
      if (!Number.isInteger(cell) || cell < 0 || cell >= count || regionOf[cell] !== -1) return [];
      regionOf[cell] = id;
    }
    return [...region];
  });
  if (regionOf.some((id) => id < 0) || regionCells.some((cells) => !cells.length)) return { count: 0, nodes: 0, complete: true, first: null };
  const neighbors = Array.from({ length: count }, (_, cell) => neighborsOf(cell, width, height));
  const values = [...givens].map((value) => value ?? 0);
  if (values.some((value) => !Number.isInteger(value) || value < 0 || value > 5)) return { count: 0, nodes: 0, complete: true, first: null };
  const regionSets = regionCells.map((cells) => new Set(cells));
  const candidates = (cell) => {
    const region = regionCells[regionOf[cell]];
    const used = new Set();
    for (const other of region) if (values[other]) used.add(values[other]);
    for (const other of neighbors[cell]) if (values[other]) used.add(values[other]);
    const options = Array.from({ length: region.length }, (_, index) => index + 1).filter((value) => !used.has(value));
    return random ? shuffle(options, random) : options;
  };
  for (let cell = 0; cell < count; cell += 1) {
    if (!values[cell]) continue;
    const given = values[cell];
    values[cell] = 0;
    const valid = candidates(cell).includes(given);
    values[cell] = given;
    if (!valid || !regionSets[regionOf[cell]].has(cell)) return { count: 0, nodes: 0, complete: true, first: null };
  }
  let solutions = 0;
  let nodes = 0;
  let first = null;
  let aborted = false;
  function visit() {
    if (solutions >= limit) return;
    nodes += 1;
    if (nodes > maxNodes) { aborted = true; return; }
    let chosen = -1;
    let options = null;
    for (let cell = 0; cell < count; cell += 1) {
      if (values[cell]) continue;
      const current = candidates(cell);
      if (!current.length) return;
      if (!options || current.length < options.length) { chosen = cell; options = current; if (current.length === 1) break; }
    }
    if (chosen < 0) { solutions += 1; if (!first) first = [...values]; return; }
    for (const value of options) {
      values[chosen] = value;
      visit();
      values[chosen] = 0;
      if (solutions >= limit || aborted) return;
    }
  }
  visit();
  return { count: solutions, nodes, complete: !aborted, first };
}

function makePartition(width, height, vertical, random) {
  if (width === 5) {
    const remaining = new Set(Array.from({ length: 25 }, (_, index) => index));
    const regions = [];
    for (const target of shuffle([4, 4, 4, 4, 4, 5], random)) {
      const region = [shuffle([...remaining], random)[0]];
      remaining.delete(region[0]);
      while (region.length < target) {
        const frontier = new Set();
        for (const cell of region) {
          const row = Math.floor(cell / 5); const column = cell % 5;
          for (const [r, c] of [[row - 1, column], [row + 1, column], [row, column - 1], [row, column + 1]]) {
            const next = r * 5 + c;
            if (r >= 0 && r < 5 && c >= 0 && c < 5 && remaining.has(next)) frontier.add(next);
          }
        }
        if (!frontier.size) return null;
        const next = shuffle([...frontier], random)[0];
        region.push(next);
        remaining.delete(next);
      }
      regions.push(region);
    }
    return regions;
  }
  const regions = [];
  if (vertical) {
    for (let columnBlock = 0; columnBlock < width; columnBlock += 5) {
      for (let block = 0; block < height; block += 5) {
        for (let column = columnBlock; column < columnBlock + 5; column += 1) {
          regions.push(Array.from({ length: 5 }, (_, offset) => (block + offset) * width + column));
        }
      }
    }
  } else {
    for (let row = 0; row < height; row += 1) {
      for (let column = 0; column < width; column += 5) {
        regions.push(Array.from({ length: 5 }, (_, offset) => row * width + column + offset));
      }
    }
  }
  return regions;
}

function patternValue(cell, width) {
  const row = Math.floor(cell / width);
  const column = cell % width;
  return (row + 2 * column) % 5;
}

function makePatternPartition(random) {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const remaining = new Set(Array.from({ length: 25 }, (_, index) => index));
    const regions = [];
    let failed = false;
    for (const target of shuffle([5, 5, 5, 5, 5], random)) {
      const seed = shuffle([...remaining], random)[0];
      if (seed === undefined) { failed = true; break; }
      const region = [seed];
      const symbols = new Set([patternValue(seed, 5)]);
      remaining.delete(seed);
      while (region.length < target) {
        const frontier = new Set();
        for (const cell of region) {
          const row = Math.floor(cell / 5); const column = cell % 5;
          for (const [r, c] of [[row - 1, column], [row + 1, column], [row, column - 1], [row, column + 1]]) {
            const next = r * 5 + c;
            if (r >= 0 && r < 5 && c >= 0 && c < 5 && remaining.has(next) && !symbols.has(patternValue(next, 5))) frontier.add(next);
          }
        }
        if (!frontier.size) { failed = true; break; }
        const next = shuffle([...frontier], random)[0];
        region.push(next);
        symbols.add(patternValue(next, 5));
        remaining.delete(next);
      }
      if (failed) break;
      regions.push(region);
    }
    if (!failed && remaining.size === 0) return regions;
  }
  return null;
}

export function generateSuguruPuzzle({ width = 5, height = 5, seed = Date.now() } = {}) {
  if (![5, 10].includes(width) || height !== width) throw new RangeError('Suguru supports 5×5 or 10×10 boards.');
  const random = seededRandom(seed);
  let regions; let solution;
  if (width === 5) {
    regions = makePatternPartition(random);
    if (!regions) regions = Array.from({ length: 5 }, (_, column) => Array.from({ length: 5 }, (_, row) => row * 5 + column));
    const digits = shuffle([1, 2, 3, 4, 5], random);
    solution = Array.from({ length: width * height }, (_, cell) => digits[patternValue(cell, width)]);
  } else {
    const vertical = random() < 0.5;
    regions = makePartition(width, height, vertical, random);
    const digits = shuffle([1, 2, 3, 4, 5], random);
    solution = Array.from({ length: width * height }, (_, cell) => {
      const row = Math.floor(cell / width);
      const column = cell % width;
      return digits[(row + 2 * column) % 5];
    });
  }
  const givens = [...solution];
  const order = shuffle(Array.from({ length: givens.length }, (_, index) => index), random);
  const clueFloor = width === 5 ? 7 : 34;
  for (const cell of order) {
    if (givens.filter(Boolean).length <= clueFloor) break;
    const old = givens[cell];
    givens[cell] = 0;
    const uniqueness = countSuguruSolutions({ width, height, regions, givens }, { limit: 2, maxNodes: width === 5 ? 80_000 : 45_000 });
    if (!uniqueness.complete || uniqueness.count !== 1) givens[cell] = old;
  }
  return { width, height, seed: Number(seed) >>> 0, regions, givens, solution, difficulty: givens.filter(Boolean).length <= (width === 5 ? 11 : 48) ? 'hard' : givens.filter(Boolean).length <= (width === 5 ? 15 : 64) ? 'medium' : 'easy' };
}

export function checkSuguruSolution(puzzle, values) {
  const result = validateSuguruBoard({ ...puzzle, values });
  if (!result.valid || !result.complete) return { solved: false, valid: result.valid, reason: result.reason ?? 'incomplete' };
  return { solved: values.every((value, index) => value === puzzle.solution[index]), valid: true };
}
