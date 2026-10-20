import test from 'node:test';
import assert from 'node:assert/strict';
import { coverRect, PHOTO_LIMITS, validateBackgroundImageFile, validatePhotoDimensions } from './logic.mjs';

test('photo changer accepts supported nonempty image files within its byte cap', () => {
  assert.equal(validateBackgroundImageFile(new Blob([new Uint8Array([1])], { type: 'image/jpeg' })), true);
  assert.equal(validateBackgroundImageFile(new Blob([new Uint8Array([1])], { type: 'image/png' })), true);
  assert.equal(validateBackgroundImageFile(new Blob([new Uint8Array([1])], { type: 'image/webp' })), true);
  assert.throws(() => validateBackgroundImageFile(new Blob([], { type: 'image/jpeg' })), RangeError);
  assert.throws(() => validateBackgroundImageFile(new Blob([new Uint8Array(PHOTO_LIMITS.fileBytes + 1)], { type: 'image/png' })), RangeError);
  assert.throws(() => validateBackgroundImageFile(new Blob([new Uint8Array([1])], { type: 'image/gif' })), TypeError);
});

test('photo changer caps decoded pixel dimensions, including malformed values', () => {
  assert.deepEqual(validatePhotoDimensions(4000, 3000), { width: 4000, height: 3000, pixels: 12_000_000 });
  for (const [width, height] of [[0, 1], [1.5, 2], [4001, 3000], [Number.NaN, 1]]) {
    assert.throws(() => validatePhotoDimensions(width, height), RangeError);
  }
});

test('photo changer center-cover crop fills the canvas without distortion', () => {
  assert.deepEqual(coverRect(200, 100, 100, 100), { x: -50, y: 0, width: 200, height: 100 });
  assert.deepEqual(coverRect(100, 200, 100, 100), { x: 0, y: -50, width: 100, height: 200 });
  assert.throws(() => coverRect(0, 1, 1, 1), RangeError);
});
