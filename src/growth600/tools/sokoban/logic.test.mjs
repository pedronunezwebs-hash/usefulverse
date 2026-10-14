import test from 'node:test';
import assert from 'node:assert/strict';
import { createSokoban, getSokobanTile, moveSokoban, undoSokoban, SOKOBAN_LEVELS } from './logic.mjs';

test('all included levels are rectangular, solvable with their supplied solutions, and stop at completion', () => {
  for (const [index, level] of SOKOBAN_LEVELS.entries()) {
    assert.equal(new Set(level.map.map((row) => row.length)).size, 1);
    let game = createSokoban(index);
    for (const move of level.solution) game = moveSokoban(game, ({ U: 'up', D: 'down', L: 'left', R: 'right' })[move]);
    assert.equal(game.solved, true, level.name);
    assert.equal(moveSokoban(game, 'left'), game, 'a completed puzzle cannot continue moving');
  }
});

test('walls and blocked box pushes never move the player or a box', () => {
  const game = createSokoban(0);
  assert.equal(moveSokoban(game, 'left'), game);
  const solved = moveSokoban(game, 'right');
  assert.equal(solved.pushes, 1);
  assert.equal(getSokobanTile(solved, 3, 1), 'box-on-goal');
  const corridor = createSokoban(1);
  const boxedIn = { ...corridor, boxes: new Set(['2,2', '2,1']) };
  assert.equal(moveSokoban(boxedIn, 'up'), boxedIn);
});

test('undo restores both player and box positions, move count, and push count', () => {
  const start = createSokoban(0);
  const pushed = moveSokoban(start, 'right');
  assert.deepEqual(undoSokoban(pushed), start);
  const corridor = createSokoban(1);
  const onePush = moveSokoban(corridor, 'up');
  assert.equal(onePush.moves, 1);
  assert.equal(onePush.pushes, 1);
  assert.equal(undoSokoban(onePush).moves, 0);
});

test('unknown levels fail instead of returning an empty board', () => {
  assert.throws(() => createSokoban(999), RangeError);
});
