import test from 'node:test';
import assert from 'node:assert/strict';
import { mapPointerRegion, normalizeRedactionRegion, validateImageSize, validateRedactionMode } from './logic.mjs';

test('image bounds are positive, integral and limited to device-safe pixel count', () => {
  assert.deepEqual(validateImageSize(4000, 3000), { width: 4000, height: 3000, pixels: 12_000_000 });
  assert.throws(() => validateImageSize(6000, 5000), /pixel count/u);
  assert.throws(() => validateImageSize(0, 20), /positive integers/u);
});

test('regions require positive whole-pixel rectangles fully inside the source image', () => {
  assert.deepEqual(normalizeRedactionRegion({ x: 2, y: 3, width: 4, height: 5 }, 10, 10), { x: 2, y: 3, width: 4, height: 5 });
  for (const region of [{ x: -1, y: 0, width: 1, height: 1 }, { x: 9, y: 9, width: 2, height: 1 }, { x: 1.2, y: 0, width: 2, height: 2 }, { x: 0, y: 0, width: 0, height: 1 }]) {
    assert.throws(() => normalizeRedactionRegion(region, 10, 10), /inside the image/u);
  }
});

test('pointer drags map preview coordinates back to source pixels and clamp to the image', () => {
  assert.deepEqual(mapPointerRegion({ x: 5, y: 4 }, { x: 20, y: 19 }, 2, 3, 100, 100), { x: 10, y: 12, width: 30, height: 45 });
  assert.deepEqual(mapPointerRegion({ x: -2, y: -2 }, { x: 2, y: 2 }, 2, 2, 100, 100), { x: 0, y: 0, width: 4, height: 4 });
});

test('only the documented local redaction modes are accepted', () => {
  for (const mode of ['black', 'pixelate', 'blur']) assert.equal(validateRedactionMode(mode), mode);
  assert.throws(() => validateRedactionMode('original'), /Choose/u);
});
