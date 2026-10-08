import assert from 'node:assert/strict';
import test from 'node:test';
import { checkSlitherlinkBoard, createSlitherlinkPuzzle, findSlitherlinkHint, solveSlitherlink } from './logic.mjs';

const rectangle = Object.freeze({ size: 4, clues: [0, 1, 1, 0, 1, 2, 2, 1, 1, 2, 2, 1, 0, 1, 1, 0] });
const rectangleLoop = Object.freeze([5, 6, 13, 14, 26, 28, 31, 33]);

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => ((state = (state * 1_664_525 + 1_013_904_223) >>> 0) / 2 ** 32);
}

test('a complete rectangular loop matches every clue and has exactly one solution', () => {
  assert.deepEqual(checkSlitherlinkBoard(rectangle, rectangleLoop), { valid: true, loopValid: true, degreeErrors: 0, clueErrors: [] });
  const solved = solveSlitherlink(rectangle);
  assert.equal(solved.complete, true);
  assert.equal(solved.solutions.length, 1);
  assert.deepEqual(solved.solutions[0], rectangleLoop);
});

test('checker rejects broken ends, clue mismatches, branches and detached loops', () => {
  assert.equal(checkSlitherlinkBoard(rectangle, rectangleLoop.slice(1)).loopValid, false);
  assert.notDeepEqual(checkSlitherlinkBoard(rectangle, rectangleLoop.slice(0, 3)).clueErrors, []);
  const branch = [...rectangleLoop, 27];
  assert.equal(checkSlitherlinkBoard(rectangle, branch).loopValid, false);
  const blankPuzzle = { size: 4, clues: Array(16).fill(null) };
  const detachedSquares = [0, 4, 20, 21, 15, 19, 38, 39];
  assert.equal(checkSlitherlinkBoard(blankPuzzle, detachedSquares).degreeErrors, 0);
  assert.equal(checkSlitherlinkBoard(blankPuzzle, detachedSquares).loopValid, false);
  assert.throws(() => checkSlitherlinkBoard(rectangle, [999]), /outside the board/u);
});

test('generation is fresh, bounded, and every supported size has one checked loop solution', () => {
  for (const size of [4, 5, 6]) {
    const puzzle = createSlitherlinkPuzzle({ size, random: seededRandom(size * 83) });
    assert.equal(puzzle.clues.length, size ** 2);
    assert.ok(puzzle.clues.some((clue) => clue === null), `${size}×${size} puzzle has some omitted clues`);
    assert.equal(checkSlitherlinkBoard(puzzle, puzzle.solution).valid, true, `${size}×${size} loop obeys clues and topology`);
    const solved = solveSlitherlink(puzzle);
    assert.equal(solved.complete, true, `${size}×${size} solver completed within its budget`);
    assert.equal(solved.solutions.length, 1, `${size}×${size} puzzle has one solution`);
    assert.deepEqual(solved.solutions[0], puzzle.solution);
  }
});

test('puzzle generation randomizes the board and hints reveal only the next differing edge', () => {
  const first = createSlitherlinkPuzzle({ random: seededRandom(101) });
  const second = createSlitherlinkPuzzle({ random: seededRandom(102) });
  assert.notDeepEqual(first.clues, second.clues);
  const hint = findSlitherlinkHint(first, []);
  assert.ok(hint);
  assert.equal(first.solution.includes(hint.edge), hint.selected);
  assert.equal(findSlitherlinkHint(first, first.solution), null);
});

test('solver reports ambiguity and bounded exhaustion instead of claiming uniqueness', () => {
  const empty = { size: 4, clues: Array(16).fill(null) };
  assert.equal(solveSlitherlink(empty, { maxNodes: 1 }).complete, false);
  assert.equal(solveSlitherlink(empty).solutions.length, 2);
});

test('inputs and budgets are range checked', () => {
  assert.throws(() => createSlitherlinkPuzzle({ size: 3 }), /from 4 to 6/u);
  assert.throws(() => createSlitherlinkPuzzle({ random: () => 1 }), /Random source/u);
  assert.throws(() => solveSlitherlink(rectangle, { maxSolutions: 11 }), /limits/u);
  assert.throws(() => checkSlitherlinkBoard({ size: 4, clues: Array(16).fill(4) }, []), /numbers from 0 to 3/u);
});
