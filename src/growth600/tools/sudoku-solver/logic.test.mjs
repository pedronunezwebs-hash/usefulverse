import test from 'node:test';
import assert from 'node:assert/strict';
import { createSudokuExample, findSudokuConflicts, findSudokuStep, solveSudoku } from './logic.mjs';

test('example Sudoku resolves to a completed, verified unique solution', () => {
  const puzzle = createSudokuExample();
  const result = solveSudoku(puzzle);
  assert.equal(result.status, 'unique');
  assert.equal(result.complete, true);
  assert.equal(result.count, 1);
  assert.equal(result.solution.length, 81);
  assert.equal(result.solution[0], 5);
  for (let row = 0; row < 9; row += 1) assert.equal(new Set(result.solution.slice(row * 9, row * 9 + 9)).size, 9);
  for (let index = 0; index < 81; index += 1) if (puzzle[index]) assert.equal(result.solution[index], puzzle[index]);
});

test('solver detects duplicate givens by row, column and box and does not solve invalid input', () => {
  const grid = Array(81).fill(0); grid[0] = 4; grid[1] = 4;
  assert.deepEqual(findSudokuConflicts(grid), [0, 1]);
  assert.equal(solveSudoku(grid).status, 'invalid');
  assert.throws(() => solveSudoku(Array(80).fill(0)), /81 Sudoku cells/u);
  assert.throws(() => solveSudoku(Array(81).fill(10)), /81 Sudoku cells/u);
});

test('solver distinguishes multiple solutions and never calls a bounded search unique', () => {
  const blank = Array(81).fill(0);
  const multiple = solveSudoku(blank);
  assert.equal(multiple.status, 'multiple');
  assert.ok(multiple.count >= 2);
  const limited = solveSudoku(createSudokuExample(), { maxNodes: 1 });
  assert.equal(limited.status, 'incomplete');
  assert.equal(limited.complete, false);
});

test('a conflict-free but impossible puzzle is reported unsatisfiable', () => {
  const puzzle = createSudokuExample().slice(); puzzle[2] = 1;
  assert.deepEqual(findSudokuConflicts(puzzle), []);
  const result = solveSudoku(puzzle);
  assert.equal(result.status, 'unsatisfiable');
  assert.equal(result.solution, null);
});

test('next-step helper returns only a real naked or hidden single and rejects conflicting entries', () => {
  const puzzle = createSudokuExample();
  const step = findSudokuStep(puzzle);
  assert.ok(step);
  assert.ok(['naked-single', 'hidden-single'].includes(step.technique));
  assert.equal(puzzle[step.index], 0);
  const invalid = puzzle.slice(); invalid[0] = invalid[1];
  assert.deepEqual(findSudokuConflicts(invalid), [0, 1]);
  assert.equal(findSudokuStep(invalid), null);
});

