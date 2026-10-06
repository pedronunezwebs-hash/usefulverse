import test from 'node:test';
import assert from 'node:assert/strict';
import { createTangramPuzzle, getBackgammonMoves, moleculeCatalog, moveBackgammonChecker, moveJigsawPiece, moveTangramPiece, newBackgammonGame, rollBackgammon, scoreNotes, shuffledPuzzle, tangramIsSolved, validateAudioLoop, validateLocalImage, validatePixelDimensions } from './planned-tools-logic.mjs';
import { strToU8, zipSync } from 'fflate';
import { validateEpubArchive } from './epub-tools-logic.mjs';

test('audio loops validate ranges, count and bounded duration', () => {
  assert.deepEqual(validateAudioLoop(1, 3, 5, 4), { start: 1, end: 3, repeats: 4, duration: 8 });
  assert.throws(() => validateAudioLoop(-1, 3, 5), RangeError);
  assert.throws(() => validateAudioLoop(0, 20, 20, 8), RangeError);
  assert.throws(() => validateAudioLoop(0, 1, 5, 1), RangeError);
});

test('photo image validation accepts only bounded browser-raster files and pixel dimensions', () => {
  assert.deepEqual(validateLocalImage({ size: 10, type: 'image/png' }, 10, 20), { maxPixels: 20, maxBytes: 10 });
  assert.throws(() => validateLocalImage({ size: 11, type: 'image/png' }, 10, 20), RangeError);
  assert.throws(() => validateLocalImage({ size: 10, type: 'image/svg+xml' }, 20, 20), TypeError);
  assert.deepEqual(validatePixelDimensions(4, 5, 20), { width: 4, height: 5, pixels: 20 });
  assert.throws(() => validatePixelDimensions(5, 5, 20), RangeError);
});

test('molecule gallery contains unique diagrams with valid connected bond references', () => {
  assert.equal(new Set(moleculeCatalog.map(({ id }) => id)).size, moleculeCatalog.length);
  for (const molecule of moleculeCatalog) {
    assert.ok(molecule.atoms.length > 1 && molecule.bonds.length > 0);
    for (const [from, to, order = 1] of molecule.bonds) assert.ok(from < molecule.atoms.length && to < molecule.atoms.length && [1, 2, 3].includes(order));
  }
});

test('photo puzzle shuffle is a valid permutation and tile swaps preserve every piece', () => {
  const board = shuffledPuzzle(3, () => 0.5);
  assert.equal(board.length, 9);
  assert.deepEqual([...board].sort((a, b) => a - b), [0,1,2,3,4,5,6,7,8]);
  assert.notDeepEqual(board, [0,1,2,3,4,5,6,7,8]);
  assert.deepEqual(moveJigsawPiece([0,1,2,3,4,5,6,7,8], 3, 0, 1), [1,0,2,3,4,5,6,7,8]);
  assert.deepEqual(moveJigsawPiece([0,1,2,3,4,5,6,7,8], 3, 0, 8), [8,1,2,3,4,5,6,7,0]);
  assert.throws(() => shuffledPuzzle(6), RangeError);
});

test('music score caps notes and validates notation values', () => {
  assert.deepEqual(scoreNotes([{ pitch: 'C', octave: 4, duration: 'q' }]), [{ pitch: 'C', octave: 4, duration: 'q' }]);
  assert.throws(() => scoreNotes([{ pitch: 'H', octave: 4, duration: 'q' }]), TypeError);
  assert.throws(() => scoreNotes(Array(33).fill({ pitch: 'C', octave: 4, duration: 'q' })), RangeError);
});

test('tangram supports seven bounded pieces, movement, rotation, flip and three solved layouts', () => {
  for (const shape of ['house', 'boat', 'bird']) {
    const puzzle = createTangramPuzzle(shape, () => 0.25);
    assert.equal(puzzle.length, 7);
    const solution = puzzle.reduce((state, piece, index) => moveTangramPiece(state, index, { x: piece.target.x, y: piece.target.y, rotation: piece.target.r, flip: false }), puzzle);
    assert.equal(tangramIsSolved(solution, shape), true);
    assert.equal(tangramIsSolved(moveTangramPiece(solution, 0, { x: 20 }), shape), false);
    assert.equal(tangramIsSolved(moveTangramPiece(solution, 0, { flip: true }), shape), false);
    assert.throws(() => moveTangramPiece(puzzle, 0, { x: 401 }), RangeError);
  }
  assert.throws(() => createTangramPuzzle('circle'), TypeError);
});

test('backgammon initial position, bar entry, blocked points, hits and turns', () => {
  let game = newBackgammonGame();
  assert.equal(game.points.reduce((sum, point) => sum + point[0], 0), 15);
  assert.equal(game.points.reduce((sum, point) => sum + point[1], 0), 15);
  game = rollBackgammon(game, [3, 5]);
  assert.ok(getBackgammonMoves(game).some((move) => move.from === 23 && move.to === 20));
  const moved = moveBackgammonChecker(game, 23, 20, 3);
  assert.equal(moved.points[20][0], 1);
  assert.equal(moved.turn, 0);
  assert.equal(moved.dice.length, 1);
  const bar = { ...newBackgammonGame(), bar: [1, 0] };
  const rolled = rollBackgammon(bar, [2, 4]);
  assert.ok(getBackgammonMoves(rolled).every((move) => move.from === 'bar'));
  const blocked = { ...rolled, points: rolled.points.map((point, index) => index === 22 ? [0, 2] : point) };
  assert.ok(getBackgammonMoves(blocked).every((move) => move.to !== 22));
});

test('backgammon requires the higher die when only one die can be used and supports bearing off', () => {
  const game = newBackgammonGame(); game.points = Array.from({ length: 24 }, () => [0, 0]); game.points[0][0] = 1; game.off = [14, 15]; game.dice = [2, 5];
  const moves = getBackgammonMoves(game);
  assert.ok(moves.length > 0);
  assert.ok(moves.every((move) => move.die === 5 && move.to === 'off'));
  const finished = moveBackgammonChecker(game, moves[0].from, moves[0].to, moves[0].die);
  assert.equal(finished.winner, 0);
  assert.equal(finished.off[0], 15);
});

test('EPUB archive validator accepts a minimal safe EPUB and rejects unsafe archives', () => {
  const valid = zipSync({ mimetype: [strToU8('application/epub+zip'), { level: 0 }], 'META-INF': { 'container.xml': strToU8('<container/>') }, 'book.opf': strToU8('<package/>') }, { level: 6 });
  const result = validateEpubArchive(valid);
  assert.equal(result.count, 4);
  assert.ok(result.paths.has('mimetype'));
  const unsafe = zipSync({ mimetype: [strToU8('application/epub+zip'), { level: 0 }], 'META-INF': { 'container.xml': strToU8('<container/>') }, '../escape': strToU8('no') });
  assert.throws(() => validateEpubArchive(unsafe), TypeError);
  assert.throws(() => validateEpubArchive(new Uint8Array([1, 2, 3])), RangeError);
});
