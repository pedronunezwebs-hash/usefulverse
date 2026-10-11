import test from 'node:test';
import assert from 'node:assert/strict';
import { checkLogicGridMarks, createLogicGridPuzzle, logicGridHint, logicGridPairGroups, solveLogicGrid } from './logic.mjs';

const constantRandom = (value = 0.41) => () => value;

test('generated logic-grid puzzles have exactly one solution at every difficulty', () => {
  for (const difficulty of ['easy', 'medium', 'hard']) {
    const puzzle = createLogicGridPuzzle({ difficulty, random: constantRandom() });
    assert.equal(puzzle.difficulty, difficulty);
    assert.ok(puzzle.clues.length >= ({ easy: 12, medium: 9, hard: 7 })[difficulty]);
    assert.deepEqual(solveLogicGrid(puzzle.clues), [puzzle.solution]);
  }
});

test('new games vary assignments when their random source varies', () => {
  const first = createLogicGridPuzzle({ random: constantRandom(0.13) });
  const second = createLogicGridPuzzle({ random: constantRandom(0.82) });
  assert.notDeepEqual(first.solution, second.solution);
});

test('solver distinguishes insufficient clues from a unique assignment', () => {
  assert.equal(solveLogicGrid([]).length, 2);
  const puzzle = createLogicGridPuzzle({ random: constantRandom() });
  assert.equal(solveLogicGrid(puzzle.clues).length, 1);
});

test('board checker requires four one-to-one matches in all six category pairs', () => {
  const puzzle = createLogicGridPuzzle({ random: constantRandom() });
  const marks = [];
  assert.equal(checkLogicGridMarks(puzzle, marks).status, 'incomplete');
  for (const [pair, [groupA, groupB]] of logicGridPairGroups.entries()) for (let person = 0; person < 4; person += 1) {
    marks.push({ pair, row: puzzle.solution[groupA][person], column: puzzle.solution[groupB][person], relation: 'same' });
  }
  assert.equal(checkLogicGridMarks(puzzle, marks).status, 'solved');
});

test('checker rejects duplicate row or column matches and incorrect assignments', () => {
  const puzzle = createLogicGridPuzzle({ random: constantRandom() });
  const conflict = [0, 1, 2, 3].map((row) => ({ pair: 0, row, column: 0, relation: 'same' }));
  assert.equal(checkLogicGridMarks(puzzle, conflict).status, 'conflict');
  const wrong = [];
  for (const [pair, [groupA, groupB]] of logicGridPairGroups.entries()) for (let person = 0; person < 4; person += 1) {
    wrong.push({ pair, row: puzzle.solution[groupA][person], column: puzzle.solution[groupB][person], relation: 'same' });
  }
  [wrong[0].column, wrong[1].column] = [wrong[1].column, wrong[0].column];
  assert.equal(checkLogicGridMarks(puzzle, wrong).status, 'incorrect');
});

test('hint returns a new bounded cell and no hint after a solved board', () => {
  const puzzle = createLogicGridPuzzle({ random: constantRandom() });
  const hint = logicGridHint(puzzle, []);
  assert.deepEqual(hint, { pair: 0, row: 0, column: 0, relation: puzzle.solution[0][0] === puzzle.solution[1][0] ? 'same' : 'different' });
  assert.equal(logicGridHint(puzzle, Array.from({ length: 24 }, (_, index) => {
    const pair = Math.floor(index / 4);
    const row = index % 4;
    const [groupA, groupB] = logicGridPairGroups[pair];
    return { pair, row: puzzle.solution[groupA][row], column: puzzle.solution[groupB][row], relation: 'same' };
  })), null);
});

test('generator and solver enforce difficulty, random source and input bounds', () => {
  assert.throws(() => createLogicGridPuzzle({ difficulty: 'expert' }), RangeError);
  assert.throws(() => createLogicGridPuzzle({ random: () => 1 }), RangeError);
  assert.throws(() => createLogicGridPuzzle({ maxChecks: 97 }), RangeError);
  assert.throws(() => solveLogicGrid([{ groupA: 0, groupB: 0, valueA: 0, valueB: 0, relation: 'same' }]), RangeError);
  assert.throws(() => checkLogicGridMarks(createLogicGridPuzzle(), [{ pair: 7, row: 0, column: 0, relation: 'same' }]), RangeError);
});
