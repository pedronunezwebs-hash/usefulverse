import test from 'node:test';
import assert from 'node:assert/strict';
import { checkFutoshikiBoard, createFutoshikiPuzzle, findFutoshikiHint, solveFutoshiki } from './logic.mjs';

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 0x1_0000_0000; };
}

test('generated boards at each size and difficulty are Latin squares and obey all displayed inequalities', () => {
  for (const size of [4, 5, 6]) for (const difficulty of ['easy', 'medium', 'hard']) {
    const puzzle = createFutoshikiPuzzle({ size, difficulty, random: seededRandom(size * 10 + difficulty.length), maxNodes: 30_000 });
    assert.equal(puzzle.generated, true);
    assert.equal(puzzle.size, size);
    assert.equal(puzzle.difficulty, difficulty);
    assert.equal(puzzle.solution.length, size ** 2);
    assert.ok(puzzle.inequalities.length > 0);
    assert.equal(checkFutoshikiBoard(puzzle, puzzle.solution).valid, true);
    assert.equal(checkFutoshikiBoard(puzzle, puzzle.clues).valid, false);
    const solved = solveFutoshiki(puzzle, { maxSolutions: 2, maxNodes: 30_000 });
    assert.equal(solved.complete, true);
    assert.equal(solved.solutions.length, 1);
    assert.deepEqual(solved.solutions[0], puzzle.solution);
  }
});

test('random new puzzles can differ while keeping the same selected size and difficulty', () => {
  const one = createFutoshikiPuzzle({ random: seededRandom(44) });
  const two = createFutoshikiPuzzle({ random: seededRandom(45) });
  assert.notDeepEqual([one.clues, one.inequalities], [two.clues, two.inequalities]);
});

test('solver distinguishes ambiguity and returns incomplete when a node budget is exhausted', () => {
  const empty = { size: 4, clues: Array(16).fill(0), inequalities: [] };
  const ambiguous = solveFutoshiki(empty, { maxSolutions: 2, maxNodes: 1000 });
  assert.equal(ambiguous.solutions.length, 2);
  assert.equal(ambiguous.complete, false);
  const limited = solveFutoshiki(empty, { maxSolutions: 2, maxNodes: 1 });
  assert.deepEqual(limited.solutions, []);
  assert.equal(limited.complete, false);
});

test('board checker reports repeated values, violated inequalities and missing cells', () => {
  const puzzle = { size: 4, clues: Array(16).fill(0), inequalities: [{ a: 0, b: 1, relation: '<' }] };
  const values = [2, 2, 0, 4, 1, 3, 4, 2, 3, 4, 2, 1, 4, 2, 1, 3];
  const result = checkFutoshikiBoard(puzzle, values);
  assert.ok(result.errors.includes('duplicate-row'));
  assert.ok(result.errors.includes('inequality'));
  assert.ok(result.errors.includes('incomplete'));
  assert.equal(result.valid, false);
  assert.throws(() => checkFutoshikiBoard(puzzle, Array(15).fill(0)), /one value per cell/);
  assert.throws(() => solveFutoshiki({ ...puzzle, inequalities: [{ a: 0, b: 5, relation: '<' }] }), /adjacent/);
});

test('hint gives the first differing value and returns null for a completed solution', () => {
  const puzzle = createFutoshikiPuzzle({ size: 4, random: seededRandom(9) });
  const hint = findFutoshikiHint(puzzle, puzzle.clues.slice());
  assert.ok(hint);
  assert.equal(hint.value, puzzle.solution[hint.index]);
  const values = puzzle.solution.slice();
  assert.equal(findFutoshikiHint(puzzle, values), null);
});

test('generation rejects unsupported settings and invalid random numbers', () => {
  assert.throws(() => createFutoshikiPuzzle({ size: 7 }), /4×4 to 6×6/);
  assert.throws(() => createFutoshikiPuzzle({ random: () => 1 }), /Random source/);
});
