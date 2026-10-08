import test from 'node:test';
import assert from 'node:assert/strict';
import { checkHashiBoard, createHashiPuzzle, findHashiBridges, findHashiHint, solveHashi } from './logic.mjs';

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 0x1_0000_0000; };
}

test('generated Hashi puzzles at each difficulty have a unique connected non-crossing solution', () => {
  for (const difficulty of ['easy', 'medium', 'hard']) {
    const puzzle = createHashiPuzzle({ difficulty, random: seededRandom(difficulty.length * 71) });
    assert.equal(puzzle.difficulty, difficulty);
    assert.ok(puzzle.islands.length >= 3);
    assert.ok(puzzle.bridges.length >= puzzle.islands.length - 1);
    assert.equal(puzzle.solution.length, puzzle.bridges.length);
    assert.equal(checkHashiBoard(puzzle, puzzle.solution).valid, true);
    const solved = solveHashi(puzzle, { maxSolutions: 2, maxNodes: 100_000 });
    assert.equal(solved.complete, true);
    assert.equal(solved.solutions.length, 1);
    assert.deepEqual(solved.solutions[0], puzzle.solution);
  }
});

test('new puzzles vary by layout while keeping valid answers', () => {
  const first = createHashiPuzzle({ random: seededRandom(10) });
  const second = createHashiPuzzle({ random: seededRandom(11) });
  assert.notDeepEqual(first.islands, second.islands);
  assert.equal(checkHashiBoard(first, first.solution).valid, true);
  assert.equal(checkHashiBoard(second, second.solution).valid, true);
});

test('bounded fallback stays uniquely solvable and varies across daily visits', () => {
  const first = createHashiPuzzle({ difficulty: 'hard', random: seededRandom(31), maxAttempts: 1, maxNodes: 1 });
  const second = createHashiPuzzle({ difficulty: 'hard', random: seededRandom(32), maxAttempts: 1, maxNodes: 1 });
  for (const puzzle of [first, second]) {
    assert.equal(puzzle.generated, false);
    assert.equal(puzzle.difficulty, 'hard');
    assert.equal(checkHashiBoard(puzzle, puzzle.solution).valid, true);
    const solved = solveHashi(puzzle, { maxSolutions: 2, maxNodes: 100 });
    assert.equal(solved.complete, true);
    assert.equal(solved.solutions.length, 1);
  }
  assert.notDeepEqual(first.islands, second.islands);
});

test('bridge candidates join only nearest islands along rows and columns', () => {
  const islands = [{ row: 0, column: 0 }, { row: 0, column: 3 }, { row: 0, column: 6 }, { row: 4, column: 3 }];
  const edges = findHashiBridges(islands);
  assert.deepEqual(edges.map(({ a, b, orientation }) => [a, b, orientation]), [[0, 1, 'horizontal'], [1, 2, 'horizontal'], [1, 3, 'vertical']]);
});

test('checker flags wrong island counts, crossings and disconnected components', () => {
  const puzzle = { gridSize: 5, islands: [{ row: 0, column: 2, degree: 1 }, { row: 2, column: 0, degree: 2 }, { row: 2, column: 4, degree: 2 }, { row: 4, column: 2, degree: 1 }], bridges: [
    { a: 1, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 1 }, { a: 2, b: 3 },
  ] };
  assert.ok(checkHashiBoard(puzzle, [1, 1, 0, 0]).errors.includes('crossing'));
  assert.ok(checkHashiBoard(puzzle, [1, 0, 0, 0]).errors.includes('degree'));
  assert.ok(checkHashiBoard(puzzle, [0, 0, 1, 0]).errors.includes('disconnected'));
  assert.throws(() => checkHashiBoard(puzzle, [3, 0, 0, 0]), /zero, one or two/);
});

test('hints reveal the first bridge difference and return null for a solved state', () => {
  const puzzle = createHashiPuzzle({ random: seededRandom(88) });
  const hint = findHashiHint(puzzle, Array(puzzle.bridges.length).fill(0));
  assert.ok(hint);
  assert.equal(hint.count, puzzle.solution[hint.index]);
  assert.equal(findHashiHint(puzzle, puzzle.solution), null);
});

test('generator rejects invalid random values and unsupported difficulty', () => {
  assert.throws(() => createHashiPuzzle({ difficulty: 'expert' }), /difficulty/u);
  assert.throws(() => createHashiPuzzle({ random: () => 1 }), /Random source/u);
});
