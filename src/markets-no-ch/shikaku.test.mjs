import test from 'node:test';
import assert from 'node:assert/strict';
import { canPlaceShikakuRegion, dailyShikakuSeed, generateShikaku, rectangleBetween, solveShikaku, validateShikaku } from './shikaku.mjs';

test('generated boards have complete unique rectangle partitions for repeatable seeds', () => {
  for (const size of [4, 5, 6]) for (const seed of [1, 2, 17, 20261016]) {
    const puzzle = generateShikaku(size, seed, { maxAttempts: 300 });
    assert.equal(validateShikaku(puzzle, puzzle.solution).valid, true, `${size}/${seed}`);
    assert.equal(solveShikaku(puzzle, 2).count, 1, `${size}/${seed} must have one solution`);
    assert.equal(puzzle.clues.reduce((sum, clue) => sum + clue.area, 0), size * size);
  }
});

test('rectangle verifier rejects overlaps, missing cells and mismatched clue areas', () => {
  const puzzle = { size: 4, clues: [{ row: 0, col: 0, index: 0, area: 4 }, { row: 0, col: 2, index: 2, area: 4 }, { row: 2, col: 0, index: 8, area: 4 }, { row: 2, col: 2, index: 10, area: 4 }] };
  const valid = [
    { top: 0, left: 0, bottom: 1, right: 1, area: 4 }, { top: 0, left: 2, bottom: 1, right: 3, area: 4 },
    { top: 2, left: 0, bottom: 3, right: 1, area: 4 }, { top: 2, left: 2, bottom: 3, right: 3, area: 4 },
  ];
  assert.equal(validateShikaku(puzzle, valid).valid, true);
  assert.equal(validateShikaku(puzzle, [valid[0], valid[0], ...valid.slice(2)]).reason, 'overlap-or-area');
  assert.equal(validateShikaku(puzzle, valid.slice(0, 3)).reason, 'uncovered-cell');
  assert.equal(validateShikaku(puzzle, valid.map((region, index) => index === 0 ? { ...region, area: 3 } : region)).reason, 'overlap-or-area');
  assert.equal(solveShikaku({ size: 4, clues: [{ row: 0, col: 0, index: 0, area: 3 }] }).count, 0);
});

test('placement blocks overlap and requires exactly one matching clue', () => {
  const puzzle = { size: 4, clues: [{ row: 0, col: 0, index: 0, area: 4 }, { row: 3, col: 3, index: 15, area: 4 }] };
  const placed = [{ top: 0, left: 0, bottom: 1, right: 1, area: 4 }];
  assert.equal(canPlaceShikakuRegion(puzzle, { top: 0, left: 0, bottom: 1, right: 1 }, []), true);
  assert.equal(canPlaceShikakuRegion(puzzle, { top: 0, left: 0, bottom: 1, right: 1 }, placed), false);
  assert.equal(canPlaceShikakuRegion(puzzle, { top: 2, left: 2, bottom: 3, right: 3 }, placed), true);
  assert.equal(canPlaceShikakuRegion(puzzle, { top: 1, left: 1, bottom: 2, right: 2 }, []), false);
});

test('daily seed is stable for one local date and changes by date; drag bounds are normalized', () => {
  assert.equal(dailyShikakuSeed(new Date(2026, 0, 1)), dailyShikakuSeed(new Date(2026, 0, 1)));
  assert.notEqual(dailyShikakuSeed(new Date(2026, 0, 1)), dailyShikakuSeed(new Date(2026, 0, 2)));
  assert.deepEqual(rectangleBetween(14, 1, 4), { top: 0, left: 1, bottom: 3, right: 2 });
  assert.equal(rectangleBetween(-1, 1, 4), null);
});
