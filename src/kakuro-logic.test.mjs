import test from 'node:test';
import assert from 'node:assert/strict';
import { checkKakuroSolution, createKakuroPuzzle, getKakuroHint, isValidKakuroEntry, KAKURO_SIZE, normalizeKakuroDigit } from './kakuro-logic.mjs';

test('Kakuro generator creates varied 4×4 grids with valid distinct runs and matching clues', () => {
  const puzzles = Array.from({ length: 12 }, () => createKakuroPuzzle());
  assert.equal(new Set(puzzles.map(({ solution }) => JSON.stringify(solution))).size, 12);
  for (const puzzle of puzzles) {
    assert.equal(puzzle.size, KAKURO_SIZE);
    assert.equal(puzzle.solution.length, 4);
    assert.ok(puzzle.solution.every((row, index) => row.length === 4 && new Set(row).size === 4 && row.reduce((a, b) => a + b, 0) === puzzle.rowSums[index]));
    for (let column = 0; column < 4; column += 1) {
      const digits = puzzle.solution.map((row) => row[column]);
      assert.equal(new Set(digits).size, 4);
      assert.equal(digits.reduce((a, b) => a + b, 0), puzzle.columnSums[column]);
    }
    assert.equal(checkKakuroSolution(puzzle, puzzle.solution), true);
  }
});

test('Kakuro accepts any grid that satisfies the cross sums and no-repeat rules', () => {
  const puzzle = createKakuroPuzzle(() => 0.37);
  const alternate = puzzle.solution.map((row) => [...row]);
  assert.equal(checkKakuroSolution(puzzle, alternate), true);
  alternate[0][0] = alternate[0][1];
  assert.equal(checkKakuroSolution(puzzle, alternate), false);
  assert.equal(checkKakuroSolution(puzzle, [[1]]), false);
});

test('Kakuro entry validation and hints are bounded and choose only a blank cell', () => {
  assert.equal(isValidKakuroEntry(1), true);
  assert.equal(isValidKakuroEntry(9), true);
  for (const value of [0, 10, 1.5, NaN, '3']) assert.equal(isValidKakuroEntry(value), false);
  const puzzle = createKakuroPuzzle(() => 0.24);
  const entries = Array.from({ length: 4 }, () => Array(4).fill(0));
  assert.deepEqual(getKakuroHint(puzzle, entries), { row: 0, column: 0, value: puzzle.solution[0][0] });
  entries[0][0] = puzzle.solution[0][0];
  assert.deepEqual(getKakuroHint(puzzle, entries), { row: 0, column: 1, value: puzzle.solution[0][1] });
  assert.equal(getKakuroHint(puzzle, Array.from({ length: 4 }, () => Array(4).fill(1))), null);
});

test('Kakuro accepts localized decimal digits and normalizes them to puzzle digits', () => {
  assert.equal(normalizeKakuroDigit('٧'), '7');
  assert.equal(normalizeKakuroDigit('۳'), '3');
  assert.equal(normalizeKakuroDigit('४'), '4');
  assert.equal(normalizeKakuroDigit('８'), '8');
  assert.equal(normalizeKakuroDigit('x'), '');
});

test('Kakuro generator rejects a broken random source', () => {
  assert.throws(() => createKakuroPuzzle(() => 1), RangeError);
});
