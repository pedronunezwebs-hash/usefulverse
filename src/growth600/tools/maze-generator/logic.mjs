const DIRECTIONS = Object.freeze([
  Object.freeze({ x: 0, y: -1 }),
  Object.freeze({ x: 1, y: 0 }),
  Object.freeze({ x: 0, y: 1 }),
  Object.freeze({ x: -1, y: 0 }),
]);

function hashSeed(seed) {
  let hash = 2166136261;
  for (const character of String(seed)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function key(x, y) { return x + ',' + y; }

export function validateMazeSettings({ width, height, seed }) {
  const errors = [];
  if (!Number.isInteger(width) || width < 9 || width > 41 || width % 2 === 0) errors.push('width');
  if (!Number.isInteger(height) || height < 9 || height > 31 || height % 2 === 0) errors.push('height');
  if (String(seed ?? '').length > 40) errors.push('seed');
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function generateMaze({ width = 21, height = 15, seed = 'usefulverse' } = {}) {
  const validation = validateMazeSettings({ width, height, seed });
  if (!validation.ok) throw new RangeError('Use odd maze dimensions within the supported range and a seed of at most 40 characters.');
  const cells = Array.from({ length: height }, () => Array(width).fill('#'));
  const random = createRandom(seed);
  const stack = [{ x: 1, y: 1 }];
  cells[1][1] = ' ';
  while (stack.length) {
    const current = stack.at(-1);
    const neighbors = DIRECTIONS
      .map(({ x, y }) => ({ x: current.x + x * 2, y: current.y + y * 2, wallX: current.x + x, wallY: current.y + y }))
      .filter(({ x, y }) => x > 0 && y > 0 && x < width - 1 && y < height - 1 && cells[y][x] === '#');
    if (!neighbors.length) { stack.pop(); continue; }
    const next = neighbors[Math.floor(random() * neighbors.length)];
    cells[next.wallY][next.wallX] = ' ';
    cells[next.y][next.x] = ' ';
    stack.push({ x: next.x, y: next.y });
  }
  const start = Object.freeze({ x: 1, y: 0 });
  const finish = Object.freeze({ x: width - 2, y: height - 1 });
  cells[start.y][start.x] = 'S';
  cells[finish.y][finish.x] = 'E';
  const grid = Object.freeze(cells.map((row) => row.join('')));
  const maze = Object.freeze({ width, height, seed: String(seed), grid, start, finish });
  if (!solveMaze(maze)) throw new Error('Generated maze has no route to its exit.');
  return maze;
}

export function solveMaze(maze) {
  const startKey = key(maze.start.x, maze.start.y);
  const finishKey = key(maze.finish.x, maze.finish.y);
  const queue = [maze.start];
  const previous = new Map([[startKey, null]]);
  for (let index = 0; index < queue.length; index += 1) {
    const point = queue[index];
    const pointKey = key(point.x, point.y);
    if (pointKey === finishKey) break;
    for (const { x, y } of DIRECTIONS) {
      const next = { x: point.x + x, y: point.y + y };
      const nextKey = key(next.x, next.y);
      if (next.x < 0 || next.y < 0 || next.x >= maze.width || next.y >= maze.height || maze.grid[next.y][next.x] === '#' || previous.has(nextKey)) continue;
      previous.set(nextKey, pointKey);
      queue.push(next);
    }
  }
  if (!previous.has(finishKey)) return null;
  const path = [];
  for (let cursor = finishKey; cursor; cursor = previous.get(cursor)) {
    const [x, y] = cursor.split(',').map(Number);
    path.push(Object.freeze({ x, y }));
  }
  return Object.freeze(path.reverse());
}

export function createMazeGame(maze) {
  return Object.freeze({ maze, player: maze.start, steps: 0, solved: false });
}

export function moveMazePlayer(game, direction) {
  const delta = typeof direction === 'string' ? ({ up: DIRECTIONS[0], right: DIRECTIONS[1], down: DIRECTIONS[2], left: DIRECTIONS[3] })[direction] : direction;
  if (!delta || game.solved) return game;
  const x = game.player.x + delta.x;
  const y = game.player.y + delta.y;
  if (x < 0 || y < 0 || x >= game.maze.width || y >= game.maze.height || game.maze.grid[y][x] === '#') return game;
  return Object.freeze({ maze: game.maze, player: Object.freeze({ x, y }), steps: game.steps + 1, solved: x === game.maze.finish.x && y === game.maze.finish.y });
}

export function mazeToSvg(maze, { cellSize = 12 } = {}) {
  if (!Number.isInteger(cellSize) || cellSize < 4 || cellSize > 32) throw new RangeError('Cell size must be between 4 and 32 pixels.');
  const width = maze.width * cellSize;
  const height = maze.height * cellSize;
  const rects = [];
  for (let y = 0; y < maze.height; y += 1) for (let x = 0; x < maze.width; x += 1) {
    const tile = maze.grid[y][x];
    const fill = tile === '#' ? '#132238' : tile === 'S' ? '#a3e635' : tile === 'E' ? '#fb7185' : '#ffffff';
    rects.push(`<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${fill}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Maze ${maze.width} by ${maze.height}">${rects.join('')}</svg>`;
}
