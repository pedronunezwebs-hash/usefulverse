const COLORS = Object.freeze(['#2878e5', '#eb5a54', '#2f9c67', '#f0b429', '#9157c8', '#17a6a6']);
export const bubbleColors = COLORS;

function rngFor(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function validSeed(seed) {
  if (!Number.isSafeInteger(seed)) throw new RangeError('Seed must be a safe integer.');
  return seed >>> 0;
}

export function bubbleNeighbors(row, col, rows, cols) {
  if (![row, col, rows, cols].every(Number.isInteger) || rows < 1 || cols < 1 || row < 0 || row >= rows || col < 0 || col >= cols) throw new RangeError('Bubble coordinates are outside the board.');
  const side = [[row, col - 1], [row, col + 1]];
  const offset = row % 2 === 0 ? [-1, 0] : [0, 1];
  for (const deltaRow of [-1, 1]) for (const deltaCol of offset) side.push([row + deltaRow, col + deltaCol]);
  return side.filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols);
}

function connected(grid, starts, predicate = () => true) {
  const rows = grid.length; const cols = grid[0]?.length ?? 0;
  const visited = new Set(); const queue = starts.filter(([r, c]) => grid[r]?.[c] && predicate(grid[r][c]));
  while (queue.length) {
    const [row, col] = queue.shift(); const key = `${row},${col}`;
    if (visited.has(key)) continue;
    visited.add(key);
    for (const [r, c] of bubbleNeighbors(row, col, rows, cols)) if (!visited.has(`${r},${c}`) && grid[r][c] && predicate(grid[r][c])) queue.push([r, c]);
  }
  return [...visited].map((key) => key.split(',').map(Number));
}

export function resolveBubblePlacement(inputGrid, row, col, color) {
  const rows = inputGrid.length; const cols = inputGrid[0]?.length ?? 0;
  if (!rows || !cols || inputGrid.some((line) => line.length !== cols)) throw new RangeError('Board must be a non-empty rectangle.');
  if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= rows || col < 0 || col >= cols || inputGrid[row][col] !== null) throw new RangeError('Choose an empty bubble position.');
  if (!COLORS.includes(color)) throw new RangeError('Choose a supported bubble color.');
  const grid = inputGrid.map((line) => [...line]); grid[row][col] = color;
  const match = connected(grid, [[row, col]], (candidate) => candidate === color);
  const cleared = match.length >= 3 ? match : [];
  for (const [r, c] of cleared) grid[r][c] = null;
  const supported = connected(grid, Array.from({ length: cols }, (_, c) => [0, c]));
  const supportSet = new Set(supported.map(([r, c]) => `${r},${c}`)); const dropped = [];
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) if (grid[r][c] && !supportSet.has(`${r},${c}`)) { dropped.push([r, c]); grid[r][c] = null; }
  const score = cleared.length * 10 + dropped.length * 20;
  return Object.freeze({ grid, cleared: cleared.length, dropped: dropped.length, score, matched: cleared.length >= 3 });
}

export function createBubbleGame({ seed = Date.now(), cols = 11, rows = 14, initialRows = 5, level = 1, score = 0 } = {}) {
  validSeed(seed);
  if (![cols, rows, initialRows, level, score].every(Number.isInteger) || cols < 5 || cols > 16 || rows < 8 || rows > 24 || initialRows < 1 || initialRows > rows - 3 || level < 1 || score < 0) throw new RangeError('Bubble game settings are outside their supported range.');
  const random = rngFor(seed); const palette = COLORS.slice(0, Math.min(4 + Math.floor((level - 1) / 2), COLORS.length));
  const grid = Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => row < initialRows ? palette[Math.floor(random() * palette.length)] : null));
  const pick = () => palette[Math.floor(random() * palette.length)];
  return Object.freeze({ grid, cols, rows, palette, launcher: pick(), next: pick(), score, level, seed: seed >>> 0, status: 'playing' });
}

export function shootBubble(game, row, col) {
  if (!game || game.status !== 'playing') throw new RangeError('Start or resume a game before shooting.');
  const result = resolveBubblePlacement(game.grid, row, col, game.launcher);
  const empty = result.grid.every((line) => line.every((bubble) => bubble === null));
  const danger = result.grid.slice(-2).some((line) => line.some(Boolean));
  const random = rngFor((game.seed + game.score + 0x9e3779b9) >>> 0);
  const palette = game.palette;
  const pick = () => palette[Math.floor(random() * palette.length)];
  return Object.freeze({ ...game, grid: result.grid, launcher: game.next, next: pick(), score: game.score + result.score, status: empty ? 'won' : danger ? 'lost' : 'playing', lastShot: result });
}

export function dailyBubbleSeed(date = new Date()) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new RangeError('Provide a valid date.');
  const day = date.toISOString().slice(0, 10);
  let hash = 2166136261;
  for (const character of `UsefulVerse Bubble Shooter ${day}`) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}
