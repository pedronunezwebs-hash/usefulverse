import test from 'node:test';
import assert from 'node:assert/strict';
import { chordMinesweeperCell, createMinesweeperGame, elapsedMinesweeperSeconds, minesweeperDifficulties, minesweeperRemaining, neighborsOf, revealMinesweeperCell, toggleMinesweeperFlag } from './minesweeper-logic.mjs';

test('difficulty presets create exact empty boards and bounded mine counts', () => {
  for (const [name, expected] of Object.entries({ easy: [9, 9, 10], medium: [16, 16, 40], hard: [16, 30, 99] })) {
    const game = createMinesweeperGame(name);
    assert.deepEqual([game.rows, game.columns, game.mines], expected);
    assert.equal(game.cells.length, expected[0] * expected[1]);
    assert.equal(game.cells.filter(({ mine }) => mine).length, 0);
    assert.equal(game.status, 'ready');
  }
  assert.throws(() => createMinesweeperGame('extreme'), /easy, medium or hard/u);
});

test('neighbor calculation respects rows, columns, corners and bounds', () => {
  const game = createMinesweeperGame('easy');
  assert.deepEqual(neighborsOf(game, 0), [1, 9, 10]);
  assert.equal(neighborsOf(game, 40).length, 8);
  assert.deepEqual(neighborsOf(game, -1), []);
});

test('first reveal is safe, clears its surrounding area and plants exactly the requested mines', () => {
  const game = createMinesweeperGame('easy');
  assert.equal(revealMinesweeperCell(game, 40, () => 0.5, 10_000), 'revealed');
  assert.equal(game.cells[40].mine, false);
  assert.ok(neighborsOf(game, 40).every((index) => !game.cells[index].mine));
  assert.equal(game.cells.filter(({ mine }) => mine).length, 10);
  assert.ok(game.cells[40].revealed);
  assert.ok(game.revealedSafe >= 1);
  assert.equal(game.status, 'playing');
  assert.equal(elapsedMinesweeperSeconds(game, 12_500), 2);
});

test('flags are reversible, cannot exceed the mine limit and block reveal', () => {
  const game = createMinesweeperGame('easy');
  for (let index = 0; index < game.mines; index += 1) assert.equal(toggleMinesweeperFlag(game, index), true);
  assert.equal(toggleMinesweeperFlag(game, 10), false);
  assert.equal(minesweeperRemaining(game), 0);
  assert.equal(revealMinesweeperCell(game, 0), 'ignored');
  assert.equal(toggleMinesweeperFlag(game, 0), true);
  assert.equal(minesweeperRemaining(game), 1);
  assert.equal(toggleMinesweeperFlag(game, 0), true);
  assert.equal(minesweeperRemaining(game), 0);
});

test('number clues equal adjacent mines and floods do not reveal flags', () => {
  const game = createMinesweeperGame('easy');
  toggleMinesweeperFlag(game, 0);
  revealMinesweeperCell(game, 40, () => 0.5, 5_000);
  for (let index = 0; index < game.cells.length; index += 1) {
    const cell = game.cells[index];
    if (!cell.mine) assert.equal(cell.adjacent, neighborsOf(game, index).filter((neighbor) => game.cells[neighbor].mine).length);
    if (cell.flagged) assert.equal(cell.revealed, false);
  }
});

test('chord reveals neighbors when flags match and ends on a wrongly flagged mine', () => {
  const game = createMinesweeperGame('easy');
  revealMinesweeperCell(game, 40, () => 0.5, 1_000);
  const clue = game.cells.findIndex((cell, index) => cell.revealed && cell.adjacent > 0 && neighborsOf(game, index).some((neighbor) => !game.cells[neighbor].revealed));
  assert.notEqual(clue, -1);
  const mine = neighborsOf(game, clue).find((neighbor) => game.cells[neighbor].mine);
  assert.notEqual(mine, undefined);
  assert.equal(chordMinesweeperCell(game, clue), 'ignored');
  assert.equal(toggleMinesweeperFlag(game, mine), true);
  const before = game.revealedSafe;
  assert.equal(chordMinesweeperCell(game, clue), 'revealed');
  assert.ok(game.revealedSafe > before);

  const other = createMinesweeperGame('easy');
  revealMinesweeperCell(other, 40, () => 0.5, 2_000);
  const numbered = other.cells.findIndex((cell, index) => cell.revealed && cell.adjacent > 0 && neighborsOf(other, index).some((neighbor) => !other.cells[neighbor].revealed));
  const safeNeighbor = neighborsOf(other, numbered).find((neighbor) => !other.cells[neighbor].mine && !other.cells[neighbor].revealed);
  const trueMine = neighborsOf(other, numbered).find((neighbor) => other.cells[neighbor].mine);
  assert.ok(trueMine !== undefined && safeNeighbor !== undefined);
  assert.equal(toggleMinesweeperFlag(other, safeNeighbor), true);
  assert.equal(chordMinesweeperCell(other, numbered, 10_000), 'lost');
  assert.equal(other.status, 'lost');
  assert.ok(other.endedAt);
  assert.equal(elapsedMinesweeperSeconds(other, 50_000), 8);
});

test('reveal reaches victory after all safe cells are opened; terminal boards ignore actions', () => {
  const game = createMinesweeperGame('easy');
  revealMinesweeperCell(game, 40, () => 0.5, 1_000);
  for (let index = 0; index < game.cells.length; index += 1) if (!game.cells[index].mine) revealMinesweeperCell(game, index, () => 0.5, 2_000);
  assert.equal(game.status, 'won');
  assert.equal(game.revealedSafe, game.cells.length - game.mines);
  assert.equal(revealMinesweeperCell(game, 0), 'finished');
  assert.equal(toggleMinesweeperFlag(game, game.cells.findIndex(({ mine }) => mine)), false);
  assert.equal(minesweeperDifficulties.hard.mines, 99);
});
