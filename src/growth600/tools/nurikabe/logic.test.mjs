import assert from 'node:assert/strict';
import test from 'node:test';
import { checkNurikabeBoard, createNurikabePuzzle, findNurikabeHint, solveNurikabe } from './logic.mjs';

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

test('fresh puzzles at every difficulty satisfy Nurikabe rules and have one exhaustively verified solution', () => {
  for (const difficulty of ['easy', 'medium', 'hard']) {
    const puzzle = createNurikabePuzzle({ difficulty, random: seededRandom(difficulty.length * 17) });
    assert.equal(puzzle.size, 5);
    assert.equal(puzzle.difficulty, difficulty);
    assert.equal(checkNurikabeBoard(puzzle, puzzle.solution).valid, true);
    const result = solveNurikabe(puzzle, { maxSolutions: 2, maxNodes: 250_000 });
    assert.equal(result.complete, true);
    assert.equal(result.solutions.length, 1);
    assert.deepEqual(result.solutions[0], puzzle.solution);
  }
});

test('independent games vary the clue layout, including randomized fallback layouts', () => {
  for (const difficulty of ['easy', 'medium', 'hard']) {
    const layouts = new Set(Array.from({ length: 8 }, (_, index) => {
      const puzzle = createNurikabePuzzle({ difficulty, random: seededRandom(index + 90) });
      return JSON.stringify(puzzle.clues.map(({ index: cell, size }) => [cell, size]).sort((a, b) => a[0] - b[0]));
    }));
    assert.ok(layouts.size > 1, `${difficulty} should not repeat the same board every game`);
  }
});

test('each verified fallback is valid and uniquely solvable when generation reaches its limit', () => {
  for (const difficulty of ['easy', 'medium', 'hard']) {
    const puzzle = createNurikabePuzzle({ difficulty, random: () => 0, maxAttempts: 1 });
    assert.equal(puzzle.number, 2);
    assert.equal(checkNurikabeBoard(puzzle, puzzle.solution).valid, true);
    const result = solveNurikabe(puzzle);
    assert.equal(result.complete, true);
    assert.equal(result.solutions.length, 1);
    assert.deepEqual(result.solutions[0], puzzle.solution);
  }
});

test('the uniqueness proof refuses to call a search complete when its node budget runs out', () => {
  const puzzle = createNurikabePuzzle({ random: () => 0, maxAttempts: 1 });
  const result = solveNurikabe(puzzle, { maxSolutions: 2, maxNodes: 1 });
  assert.equal(result.complete, false);
  assert.equal(result.solutions.length, 0);
  assert.equal(result.nodes, 1);
});

test('checker reports the distinct sea and island rule failures', () => {
  const puzzle = { size: 4, clues: [{ index: 0, size: 1 }, { index: 3, size: 1 }, { index: 12, size: 1 }, { index: 15, size: 1 }] };
  const squareSea = checkNurikabeBoard(puzzle, [5, 6, 9, 10]);
  assert.ok(squareSea.errors.includes('sea-square'));
  const splitSea = checkNurikabeBoard(puzzle, [1, 14]);
  assert.ok(splitSea.errors.includes('sea-disconnected'));
  const clueSea = checkNurikabeBoard(puzzle, [0]);
  assert.ok(clueSea.errors.includes('clue-in-sea'));
  assert.ok(checkNurikabeBoard(puzzle, []).errors.includes('islands-touch'));
});

test('checker rejects cells outside the board and malformed clue sets', () => {
  const puzzle = createNurikabePuzzle({ random: () => 0, maxAttempts: 1 });
  assert.throws(() => checkNurikabeBoard(puzzle, [25]), /outside the grid/u);
  assert.throws(() => checkNurikabeBoard(puzzle, '0'), /array or set/u);
  assert.throws(() => solveNurikabe({ size: 5, clues: [{ index: 1, size: 2 }, { index: 1, size: 3 }] }), /unique cell/u);
  assert.throws(() => createNurikabePuzzle({ random: () => 1 }), /Random source/u);
  assert.throws(() => createNurikabePuzzle({ difficulty: 'expert' }), /difficulty/u);
});

test('one-cell hint agrees with the stored solution and returns null after completion', () => {
  const puzzle = createNurikabePuzzle({ random: () => 0, maxAttempts: 1 });
  const hint = findNurikabeHint(puzzle, []);
  assert.ok(hint);
  assert.equal(hint.sea, puzzle.solution.includes(hint.index));
  assert.equal(findNurikabeHint(puzzle, puzzle.solution), null);
  assert.throws(() => findNurikabeHint({}, []), /generated Nurikabe/u);
});
