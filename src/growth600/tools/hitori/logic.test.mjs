import assert from 'node:assert/strict';
import test from 'node:test';
import { checkHitoriBoard, createHitoriPuzzle, findHitoriHint, solveHitori } from './logic.mjs';

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => ((state = (state * 1_664_525 + 1_013_904_223) >>> 0) / 2 ** 32);
}

test('generated boards have one valid solution and the returned answer is the one generated', () => {
  for (const size of [5, 6, 7, 8]) {
    for (const difficulty of ['easy', 'medium', 'hard']) {
      const puzzle = createHitoriPuzzle({ size, difficulty, random: seededRandom(size * 13 + difficulty.length) });
      assert.equal(puzzle.grid.length, size, `${size}-${difficulty}`);
      assert.equal(puzzle.grid.every((row) => row.length === size), true, `${size}-${difficulty}`);
      assert.equal(solveHitori(puzzle.grid).length, 1, `${size}-${difficulty}`);
      assert.deepEqual(solveHitori(puzzle.grid)[0], puzzle.solution, `${size}-${difficulty}`);
      assert.equal(checkHitoriBoard(puzzle.grid, puzzle.solution).valid, true, `${size}-${difficulty}`);
    }
  }
});

test('new seeds make different random puzzles, and hints identify a cell without disclosing the whole answer', () => {
  const first = createHitoriPuzzle({ random: seededRandom(101) });
  const second = createHitoriPuzzle({ random: seededRandom(102) });
  assert.notDeepEqual(first.grid, second.grid);
  const hint = findHitoriHint(first, []);
  assert.ok(hint);
  assert.equal(hint.black, first.solution.includes(hint.index));
  assert.equal(findHitoriHint(first, first.solution), null);
});

test('bounded fallback templates are uniquely solvable for every size and difficulty', () => {
  for (const size of [5, 6, 7, 8]) {
    for (const difficulty of ['easy', 'medium', 'hard']) {
      const puzzle = createHitoriPuzzle({ size, difficulty, random: () => 0, maxAttempts: 1 });
      assert.equal(puzzle.number, 2, `${size}-${difficulty} uses the fallback`);
      assert.equal(solveHitori(puzzle.grid).length, 1, `${size}-${difficulty}`);
      assert.deepEqual(solveHitori(puzzle.grid)[0], puzzle.solution, `${size}-${difficulty}`);
    }
  }
});

test('validation catches remaining row and column duplicates, touching black cells, and disconnected white cells', () => {
  assert.deepEqual(checkHitoriBoard([[1, 1, 2], [2, 3, 1], [3, 2, 3]], []).errors, ['duplicate-white']);
  assert.ok(checkHitoriBoard([[1, 1, 2], [2, 3, 1], [3, 2, 3]], [0, 1]).errors.includes('adjacent-black'));
  assert.ok(checkHitoriBoard([[1, 1, 2, 3], [4, 2, 1, 4], [2, 3, 4, 1], [3, 4, 2, 2]], [1, 4, 11, 14]).errors.includes('disconnected-white'));
});

test('solver reports ambiguous or unsatisfiable grids rather than pretending there is one answer', () => {
  assert.equal(solveHitori([[1, 2], [3, 4]]).length, 1);
  assert.equal(solveHitori([[1, 1], [1, 1]]).length, 0);
  assert.equal(solveHitori([[1, 1, 2], [2, 3, 1], [3, 2, 3]]).length, 2);
});

test('generator bounds invalid inputs and reports bounded exhaustion clearly', () => {
  assert.throws(() => createHitoriPuzzle({ size: 4 }), /grid from 5 to 8/u);
  assert.throws(() => createHitoriPuzzle({ difficulty: 'expert' }), /easy, medium or hard/u);
  assert.throws(() => createHitoriPuzzle({ random: () => 1 }), /Random source/u);
  const fallback = createHitoriPuzzle({ random: () => 0, maxAttempts: 1 });
  assert.equal(solveHitori(fallback.grid).length, 1);
  assert.equal(checkHitoriBoard(fallback.grid, fallback.solution).valid, true);
});
