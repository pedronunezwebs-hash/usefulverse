import test from 'node:test';
import assert from 'node:assert/strict';
import { exampleRubiksCubeFaces, FACE_ORDER, readRubiksCubeFaces } from './logic.mjs';

const solvedFaces = Object.fromEntries(FACE_ORDER.map((face) => [`face${face}`, face.repeat(9)]));

test('Rubik solver accepts a solved facelet state and preserves its face order', () => {
  const result = readRubiksCubeFaces(solvedFaces);
  assert.equal(result.isSolved, true);
  assert.equal(result.facelets, FACE_ORDER.map((face) => face.repeat(9)).join(''));
  assert.ok(result.state);
});

test('Rubik solver example is a legal, unsolved state with nine stickers per face color', () => {
  const example = exampleRubiksCubeFaces();
  const result = readRubiksCubeFaces(example);
  assert.equal(result.isSolved, false);
  for (const face of FACE_ORDER) assert.equal([...result.facelets].filter((sticker) => sticker === face).length, 9);
});

test('Rubik solver rejects malformed facelets, centers, sticker counts and impossible states', () => {
  assert.throws(() => readRubiksCubeFaces({ ...solvedFaces, faceU: 'UUUU' }), RangeError);
  assert.throws(() => readRubiksCubeFaces({ ...solvedFaces, faceU: `UUUU${'R'}UUUU` }), RangeError);
  assert.throws(() => readRubiksCubeFaces({ ...solvedFaces, faceU: 'UUUUUUUUR' }), RangeError);
  const impossible = { ...exampleRubiksCubeFaces() };
  const stickers = impossible.faceU.split('');
  [stickers[0], stickers[2]] = [stickers[2], stickers[0]];
  impossible.faceU = stickers.join('');
  assert.throws(() => readRubiksCubeFaces(impossible), RangeError);
});

test('Rubik solver tolerates whitespace in face input', () => {
  const spaced = { ...solvedFaces, faceF: 'FFF FFF FFF' };
  assert.equal(readRubiksCubeFaces(spaced).isSolved, true);
});
