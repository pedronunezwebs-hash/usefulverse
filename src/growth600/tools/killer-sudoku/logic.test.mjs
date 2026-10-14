import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSudokuPuzzle } from '../../../local-planners-logic.mjs';
import { checkKillerSudoku, countKillerSudokuSolutions, generateKillerSudoku, validateKillerSolution } from './logic.mjs';

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 0x1_0000_0000; };
}

function singletonCages(solution) {
  return solution.map((sum, cell) => ({ cells: [cell], sum }));
}

test('generated Killer boards cover every cell, obey classic and cage rules, and have one proven solution', () => {
  const puzzle = generateKillerSudoku({ random: seededRandom(17), maxMergeAttempts: 100 });
  assert.equal(puzzle.unique, true);
  assert.equal(validateKillerSolution(puzzle.solution, puzzle.cages), true);
  assert.equal(new Set(puzzle.cages.flatMap(({ cells }) => cells)).size, 81);
  assert.equal(puzzle.cages.flatMap(({ cells }) => cells).length, 81);
  const proof = countKillerSudokuSolutions(puzzle.cages, { limit: 2, maxNodes: 30_000 });
  assert.equal(proof.complete, true);
  assert.equal(proof.count, 1);
  assert.equal(checkKillerSudoku(puzzle.cages, puzzle.solution).solved, true);
});

test('board checker distinguishes partial play, impossible cage sums, and completed solutions', () => {
  const solution = generateSudokuPuzzle('easy', seededRandom(88)).solution;
  const cages = singletonCages(solution);
  const partial = solution.map((value, index) => index === 40 ? 0 : value);
  const state = checkKillerSudoku(cages, partial);
  assert.equal(state.complete, false);
  assert.equal(state.solved, false);
  const wrong = solution.slice();
  wrong[0] = wrong[0] % 9 + 1;
  assert.equal(checkKillerSudoku(cages, wrong).solved, false);
  assert.equal(checkKillerSudoku(cages, solution).solved, true);
  const duplicate = Array(81).fill(0); duplicate[0] = 1; duplicate[1] = 1;
  assert.ok(checkKillerSudoku(cages, duplicate).errors.includes(0), 'the first cell in a duplicate must also be highlighted');
  assert.throws(() => checkKillerSudoku(cages, Array(80).fill(0)), /81 cells/u);
});

test('cage validation rejects incomplete, duplicate, disconnected and impossible cages', () => {
  const solution = generateSudokuPuzzle('easy', seededRandom(19)).solution;
  const cages = singletonCages(solution);
  assert.throws(() => countKillerSudokuSolutions(cages.slice(1)), /cover all 81/u);
  const duplicate = cages.slice();
  duplicate[1] = { cells: [0], sum: solution[1] };
  assert.throws(() => countKillerSudokuSolutions(duplicate), /unique cells/u);
  const disconnected = cages.slice();
  disconnected[0] = { cells: [0, 80], sum: solution[0] + solution[80] };
  disconnected.splice(80, 1);
  assert.throws(() => countKillerSudokuSolutions(disconnected), /connected/u);
  const impossible = cages.slice();
  impossible[0] = { cells: [0, 1], sum: 2 };
  impossible.splice(1, 1);
  assert.throws(() => countKillerSudokuSolutions(impossible), /impossible/u);
});

test('generator is bounded and different seeded runs can produce different cage layouts', () => {
  const first = generateKillerSudoku({ random: seededRandom(31), maxMergeAttempts: 160 });
  const second = generateKillerSudoku({ random: seededRandom(32), maxMergeAttempts: 160 });
  assert.notDeepEqual(first.cages, second.cages);
  assert.ok(first.attempts <= 160);
  assert.throws(() => generateKillerSudoku({ targetCages: 20 }), /45–80/u);
  assert.throws(() => generateKillerSudoku({ random: () => 1 }), /0 \(inclusive\)/u);
});

