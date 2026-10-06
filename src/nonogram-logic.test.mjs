import test from 'node:test';
import assert from 'node:assert/strict';
import { checkNonogramSolution, countNonogramSolutions, generateNonogram, lineClues } from './nonogram-logic.mjs';

test('line clues count consecutive filled runs and represent a blank line as zero', () => {
  assert.deepEqual(lineClues([0, 1, 1, 0, 1, 1, 1, 0]), [2, 3]);
  assert.deepEqual(lineClues([0, 0, 0]), [0]);
  assert.deepEqual(lineClues([1, 1, 1]), [3]);
});

test('solution counter distinguishes unique and ambiguous clue sets', () => {
  const unique = [[2], [3], [2], [4], [1]];
  const uniqueColumns = [[2], [4], [3], [2], [1]];
  assert.equal(countNonogramSolutions(unique, uniqueColumns, 2), 1);
  assert.equal(countNonogramSolutions(Array(5).fill([1]), Array(5).fill([1]), 2), 2);
  assert.equal(countNonogramSolutions(Array(5).fill([6]), Array(5).fill([1]), 2), 0);
  assert.throws(() => countNonogramSolutions([[1]], [], 2), /square board/u);
});

test('generated 5×5 games are playable and have exactly one matching solution', () => {
  for (let initialSeed = 1; initialSeed <= 20; initialSeed += 1) {
    let seed = initialSeed * 0x9e37_79b1;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 0x1_0000_0000; };
    const game = generateNonogram(random);
    assert.equal(game.size, 5);
    const filled = game.grid.flat().filter(Boolean).length;
    assert.ok(filled >= 5 && filled <= 20);
    assert.equal(countNonogramSolutions(game.rows, game.columns, 2), 1);
    assert.equal(checkNonogramSolution(game, game.grid), true);
    assert.equal(checkNonogramSolution(game, Array.from({ length: 5 }, () => Array(5).fill(false))), false);
  }
});

test('fallback generation keeps a unique puzzle and validates its random source', () => {
  const game = generateNonogram(() => 0.7);
  assert.equal(countNonogramSolutions(game.rows, game.columns, 2), 1);
  assert.throws(() => generateNonogram(() => 1), /Random source/u);
});
