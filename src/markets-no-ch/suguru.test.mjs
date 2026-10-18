import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSuguruSolution, countSuguruSolutions, generateSuguruPuzzle, validateSuguruBoard } from './suguru.mjs';

test('Suguru validator enforces region size, connectivity, exact coverage and diagonal separation', () => {
  const regions = Array.from({ length: 5 }, (_, row) => Array.from({ length: 5 }, (_, column) => row * 5 + column));
  const values = Array.from({ length: 25 }, (_, cell) => (Math.floor(cell / 5) + 2 * (cell % 5)) % 5 + 1);
  const good = { width: 5, height: 5, regions, values };
  assert.equal(validateSuguruBoard(good).valid, true);
  const touching = [...values]; touching[1] = touching[0];
  assert.equal(validateSuguruBoard({ ...good, values: touching }).reason, 'region-values');
  assert.equal(validateSuguruBoard({ ...good, regions: [[0, 2, 4, 6, 8], ...regions.slice(1)] }).reason, 'region-disconnected');
  assert.equal(validateSuguruBoard({ ...good, regions: regions.slice(1) }).reason, 'region-missing-cell');
  assert.equal(validateSuguruBoard({ ...good, regions: [Array.from({ length: 6 }, (_, i) => i), ...regions.slice(2)] }).reason, 'region-size');
  const bottomRightDiagonal = Array(25).fill(0);
  bottomRightDiagonal[0] = 2;
  bottomRightDiagonal[6] = 2;
  assert.equal(validateSuguruBoard({ width: 5, height: 5, regions, values: bottomRightDiagonal }).reason, 'touching-equal-values');
});

test('Suguru solution counter distinguishes a unique solution from an ambiguous puzzle', () => {
  const regions = Array.from({ length: 5 }, (_, row) => Array.from({ length: 5 }, (_, column) => row * 5 + column));
  const unique = { width: 5, height: 5, regions, givens: Array.from({ length: 25 }, (_, cell) => (Math.floor(cell / 5) + 2 * (cell % 5)) % 5 + 1) };
  assert.equal(countSuguruSolutions(unique).count, 1);
  const open = countSuguruSolutions({ ...unique, givens: Array(25).fill(0) }, { limit: 2 });
  assert.equal(open.count, 2);
  assert.equal(open.complete, true);
});

test('generated daily-style puzzles are independently valid, uniquely solvable, and seed-reproducible', () => {
  const first = generateSuguruPuzzle({ width: 5, height: 5, seed: 20261016 });
  const again = generateSuguruPuzzle({ width: 5, height: 5, seed: 20261016 });
  const other = generateSuguruPuzzle({ width: 5, height: 5, seed: 20261017 });
  assert.deepEqual(first, again);
  assert.notDeepEqual(first.givens, other.givens);
  assert.deepEqual([...new Set(first.regions.map((region) => region.length))].sort(), [5]);
  assert.equal(validateSuguruBoard({ ...first, values: first.solution }).valid, true);
  assert.equal(checkSuguruSolution(first, first.solution).solved, true);
  assert.equal(countSuguruSolutions({ ...first, givens: first.givens }, { limit: 2, maxNodes: 200_000 }).count, 1);
});

test('generated 5×5 puzzles never contain equal touching values across any diagonal', () => {
  for (const seed of [1, 7, 20261016, 2229563044, 0xffffffff]) {
    const puzzle = generateSuguruPuzzle({ width: 5, height: 5, seed });
    assert.equal(validateSuguruBoard({ ...puzzle, values: puzzle.solution }).valid, true, `invalid solution for seed ${seed}`);
    assert.equal(validateSuguruBoard({ ...puzzle, values: puzzle.givens }).valid, true, `invalid givens for seed ${seed}`);
    const uniqueness = countSuguruSolutions({ width: puzzle.width, height: puzzle.height, regions: puzzle.regions, givens: puzzle.givens }, { limit: 2, maxNodes: 200_000 });
    assert.equal(uniqueness.complete, true, `uniqueness budget exceeded for seed ${seed}`);
    assert.equal(uniqueness.count, 1, `puzzle is not unique for seed ${seed}`);
  }
});

test('generated 10×10 puzzles remain connected and unique within the bounded solver budget', () => {
  const puzzle = generateSuguruPuzzle({ width: 10, height: 10, seed: 3812026 });
  assert.equal(validateSuguruBoard({ ...puzzle, values: puzzle.solution }).valid, true);
  const uniqueness = countSuguruSolutions({ width: puzzle.width, height: puzzle.height, regions: puzzle.regions, givens: puzzle.givens }, { limit: 2, maxNodes: 250_000 });
  assert.equal(uniqueness.complete, true);
  assert.equal(uniqueness.count, 1);
});
