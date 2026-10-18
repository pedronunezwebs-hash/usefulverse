import assert from 'node:assert/strict';
import test from 'node:test';
import { createMazeGame, generateMaze, mazeToSvg, moveMazePlayer, solveMaze, validateMazeSettings } from './logic.mjs';

test('maze generation is seeded, reproducible and has a traversable route', () => {
  const settings = { width: 21, height: 15, seed: 'seed-123' };
  const first = generateMaze(settings);
  const second = generateMaze(settings);
  assert.deepEqual(first.grid, second.grid);
  assert.ok(solveMaze(first).length > 0);
  assert.notDeepEqual(first.grid, generateMaze({ ...settings, seed: 'seed-124' }).grid);
});

test('all generated interior cells are reachable and grid remains bounded and odd', () => {
  const maze = generateMaze({ width: 41, height: 31, seed: 'maximum' });
  const path = solveMaze(maze);
  assert.equal(maze.grid.length, 31);
  assert.ok(maze.grid.every((row) => row.length === 41));
  assert.equal(path[0].x, maze.start.x);
  assert.equal(path.at(-1).x, maze.finish.x);
  const open = maze.grid.join('').replaceAll('#', '').length;
  const reached = new Set(path.map(({ x, y }) => x + ',' + y));
  const stack = [{ x: maze.start.x, y: maze.start.y }];
  const visited = new Set([stack[0].x + ',' + stack[0].y]);
  while (stack.length) {
    const point = stack.pop();
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const x = point.x + dx; const y = point.y + dy; const key = x + ',' + y;
      if (x >= 0 && y >= 0 && x < maze.width && y < maze.height && maze.grid[y][x] !== '#' && !visited.has(key)) { visited.add(key); stack.push({ x, y }); }
    }
  }
  assert.equal(visited.size, open);
  assert.ok(reached.size > 1);
});

test('player moves through paths, cannot cross walls, and wins only at exit', () => {
  const maze = generateMaze({ width: 9, height: 9, seed: 'game' });
  let game = createMazeGame(maze);
  const blocked = moveMazePlayer(game, 'up');
  assert.equal(blocked, game);
  for (const { x, y } of solveMaze(maze).slice(1)) game = moveMazePlayer(game, { x: x - game.player.x, y: y - game.player.y });
  assert.equal(game.solved, true);
  assert.equal(game.steps, solveMaze(maze).length - 1);
  assert.equal(moveMazePlayer(game, 'down'), game);
});

test('settings reject invalid sizes and overly long seeds; SVG is standalone and bounded', () => {
  assert.equal(validateMazeSettings({ width: 10, height: 9, seed: 'x' }).ok, false);
  assert.equal(validateMazeSettings({ width: 9, height: 9, seed: 'x'.repeat(41) }).ok, false);
  const maze = generateMaze({ width: 9, height: 9, seed: '<seed>' });
  const svg = mazeToSvg(maze);
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/u);
  assert.doesNotMatch(svg, /<seed>/u);
  assert.throws(() => mazeToSvg(maze, { cellSize: 100 }), RangeError);
});
