const makeRandom = (seed) => {
  let state = (Number(seed) >>> 0) || 0x9e3779b9;
  return () => {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
};

const indexOf = (row, col, size) => row * size + col;
const rectCells = (rect, size) => {
  const cells = [];
  for (let row = rect.top; row <= rect.bottom; row += 1) for (let col = rect.left; col <= rect.right; col += 1) cells.push(indexOf(row, col, size));
  return cells;
const area = (rect) => (rect.bottom - rect.top + 1) * (rect.right - rect.left + 1);

export function validateShikaku(puzzle, regions) {
  const { size, clues } = puzzle;
  if (!Number.isInteger(size) || size < 3 || size > 10 || !Array.isArray(clues) || !Array.isArray(regions)) return { valid: false, reason: 'invalid-puzzle' };
  const coverage = new Int16Array(size * size);
  for (const region of regions) {
    if (!region || !Number.isInteger(region.top) || !Number.isInteger(region.left) || !Number.isInteger(region.bottom) || !Number.isInteger(region.right) || region.top < 0 || region.left < 0 || region.bottom >= size || region.right >= size || region.bottom < region.top || region.right < region.left) return { valid: false, reason: 'invalid-rectangle' };
    const cells = rectCells(region, size);
    if (area(region) !== region.area || cells.some((cell) => ++coverage[cell] > 1)) return { valid: false, reason: 'overlap-or-area' };
    const inside = clues.filter((clue) => cells.includes(clue.index));
    if (inside.length !== 1 || inside[0].area !== region.area) return { valid: false, reason: 'clue-mismatch' };
  }
  if ([...coverage].some((count) => count !== 1)) return { valid: false, reason: 'uncovered-cell' };
  if (regions.length !== clues.length) return { valid: false, reason: 'region-count' };
  return { valid: true, reason: 'solved' };
}

export function canPlaceShikakuRegion(puzzle, region, regions) {
  const { size, clues } = puzzle;
  if (!region || region.bottom >= size || region.right >= size || region.top < 0 || region.left < 0) return false;
  const cells = rectCells(region, size);
  if (regions.some((placed) => rectCells(placed, size).some((cell) => cells.includes(cell)))) return false;
  const inside = clues.filter((clue) => cells.includes(clue.index));
  return inside.length === 1 && inside[0].area === area(region);
}

function candidatesFor(clue, size) {
  const candidates = [];
  for (let height = 1; height <= clue.area; height += 1) {
    if (clue.area % height !== 0) continue;
    const width = clue.area / height;
    for (let top = clue.row - height + 1; top <= clue.row; top += 1) {
      for (let left = clue.col - width + 1; left <= clue.col; left += 1) {
        const bottom = top + height - 1; const right = left + width - 1;
        if (top >= 0 && left >= 0 && bottom < size && right < size) {
          const rect = { top, left, bottom, right, area: clue.area };
          candidates.push({ rect, cells: rectCells(rect, size), clueIndex: clue.index });
        }
      }
    }
  }
  return candidates;
}

export function solveShikaku(puzzle, limit = 2) {
  const { size, clues } = puzzle;
  if (!Number.isInteger(size) || size < 3 || size > 10 || !Array.isArray(clues) || clues.length === 0 || clues.length > size * size) return { count: 0, solutions: [] };
  const seen = new Set();
  for (const clue of clues) {
    if (!Number.isInteger(clue.index) || clue.index < 0 || clue.index >= size * size || !Number.isInteger(clue.area) || clue.area < 1 || clue.area > size * size || seen.has(clue.index)) return { count: 0, solutions: [] };
    seen.add(clue.index);
  }
  const candidates = clues.map((clue) => candidatesFor(clue, size));
  if (candidates.some((list) => list.length === 0)) return { count: 0, solutions: [] };
  const occupied = new Uint8Array(size * size); const chosen = []; const solutions = [];
  const search = (remaining) => {
    if (solutions.length >= limit) return;
    if (remaining.length === 0) {
      if (occupied.every((value) => value === 1)) solutions.push(chosen.map(({ rect }) => ({ ...rect })));
      return;
    }
    let bestPosition = -1; let best = null;
    for (let position = 0; position < remaining.length; position += 1) {
      const viable = candidates[remaining[position]].filter(({ cells }) => cells.every((cell) => occupied[cell] === 0));
      if (viable.length === 0) return;
      if (best === null || viable.length < best.length) { best = viable; bestPosition = position; if (viable.length === 1) break; }
    }
    const clueIndex = remaining[bestPosition]; const next = remaining.filter((_, position) => position !== bestPosition);
    for (const candidate of best) {
      candidate.cells.forEach((cell) => { occupied[cell] = 1; }); chosen.push(candidate);
      search(next);
      chosen.pop(); candidate.cells.forEach((cell) => { occupied[cell] = 0; });
      if (solutions.length >= limit) return;
    }
  };
  search(clues.map((_, index) => index));
  return { count: solutions.length, solutions };
}

function randomPartition(size, random) {
  const used = new Uint8Array(size * size); const regions = [];
  const search = (covered) => {
    if (covered === used.length) return true;
    let first = 0; while (used[first]) first += 1;
    const row = Math.floor(first / size); const col = first % size;
    const options = [];
    for (let height = 1; row + height <= size; height += 1) {
      for (let width = 1; col + width <= size; width += 1) {
        const rect = { top: row, left: col, bottom: row + height - 1, right: col + width - 1, area: height * width };
        const cells = rectCells(rect, size);
        if (rect.area <= 1 || rect.area > Math.min(8, size + 1) || cells.some((cell) => used[cell])) continue;
        options.push({ rect, cells, weight: 1 / (1 + Math.abs(rect.area - 4)) });
      }
    }
    options.sort((a, b) => (b.weight - a.weight) || (random() - .5));
    for (const { rect, cells } of options) {
      cells.forEach((cell) => { used[cell] = 1; }); regions.push(rect);
      if (search(covered + cells.length)) return true;
      regions.pop(); cells.forEach((cell) => { used[cell] = 0; });
    }
    return false;
  };
  return search(0) ? regions : null;
}

export function generateShikaku(size = 5, seed = Date.now(), { maxAttempts = 180 } = {}) {
  if (!Number.isInteger(size) || size < 4 || size > 8) throw new RangeError('Board size must be an integer from 4 to 8.');
  const random = makeRandom(seed);
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const partition = randomPartition(size, random);
    if (!partition) continue;
    const clues = partition.map((rect) => {
      const row = rect.top + Math.floor(random() * (rect.bottom - rect.top + 1));
      const col = rect.left + Math.floor(random() * (rect.right - rect.left + 1));
      return { row, col, index: indexOf(row, col, size), area: rect.area };
    });
    const puzzle = { size, clues, seed: Number(seed) >>> 0 };
    const solved = solveShikaku(puzzle, 2);
    if (solved.count === 1 && validateShikaku(puzzle, solved.solutions[0]).valid) return { ...puzzle, solution: solved.solutions[0], attempt: attempt + 1 };
  }
  throw new Error('Could not generate a unique board. Try a smaller grid or another seed.');
}

export function dailyShikakuSeed(date = new Date()) {
  const value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-shikaku`;
  let hash = 2166136261;
  for (const character of value) { hash ^= character.codePointAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

export function rectangleBetween(start, end, size) {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < 0 || start >= size * size || end >= size * size) return null;
  return { top: Math.min(Math.floor(start / size), Math.floor(end / size)), left: Math.min(start % size, end % size), bottom: Math.max(Math.floor(start / size), Math.floor(end / size)), right: Math.max(start % size, end % size) };
}
