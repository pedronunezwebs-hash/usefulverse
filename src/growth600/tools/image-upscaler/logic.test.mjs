import test from 'node:test';
import assert from 'node:assert/strict';
import { createUpscaleTiles, MAX_UPSCALER_PIXELS, UPSCALER_SCALE, validateUpscaledOutput, validateUpscalerSize } from './logic.mjs';

test('validates the bounded input and exact 2x output dimensions', () => {
  assert.deepEqual(validateUpscalerSize(64, 64), { width: 64, height: 64, pixels: 4096, outputWidth: 128, outputHeight: 128 });
  assert.equal(UPSCALER_SCALE, 2);
  assert.equal(MAX_UPSCALER_PIXELS, 1_000_000);
  assert.deepEqual(validateUpscaledOutput(64, 64, 128, 128), { width: 128, height: 128 });
  assert.throws(() => validateUpscalerSize(1001, 1000), RangeError);
  assert.throws(() => validateUpscaledOutput(64, 64, 127, 128), RangeError);
  assert.throws(() => validateUpscalerSize(0, 2), RangeError);
});

test('tiles have bounded model inputs, exact non-overlapping cores, and overlap where possible', () => {
  const tiles = createUpscaleTiles(500, 300);
  assert.equal(tiles.length, 6);
  assert.ok(tiles.every(({ width, height }) => width <= 256 && height <= 256));
  assert.deepEqual(tiles.map(({ x, y, coreWidth, coreHeight }) => [x, y, coreWidth, coreHeight]), [
    [0, 0, 224, 224], [224, 0, 224, 224], [448, 0, 52, 224],
    [0, 224, 224, 76], [224, 224, 224, 76], [448, 224, 52, 76],
  ]);
  assert.equal(tiles[1].left, 208);
  assert.equal(tiles[1].cropX, 32);
  assert.equal(tiles[4].top, 208);
  assert.equal(tiles[4].cropY, 32);
});

test('supports tiny edge tiles and rejects invalid tile parameters', () => {
  assert.deepEqual(createUpscaleTiles(3, 5), [{ x: 0, y: 0, coreWidth: 3, coreHeight: 5, left: 0, top: 0, width: 3, height: 5, cropX: 0, cropY: 0 }]);
  assert.throws(() => createUpscaleTiles(64, 64, 15), RangeError);
  assert.throws(() => createUpscaleTiles(64, 64, 224, 65), RangeError);
});
