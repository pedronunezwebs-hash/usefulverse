import test from 'node:test';
import assert from 'node:assert/strict';
import { COLOR_IMAGE_MAX_BYTES, COLOR_IMAGE_MAX_PIXELS, COLOR_VISION_MODES, simulateColorVision, validateColorImage } from './color-vision-logic.mjs';

test('normal preview preserves RGBA pixels exactly', () => {
  const pixels = new Uint8ClampedArray([255, 40, 20, 255, 10, 200, 90, 128]);
  assert.deepEqual(simulateColorVision(pixels, 'normal'), pixels);
});

test('color-vision simulations are bounded, deterministic, and preserve alpha', () => {
  const pixels = new Uint8ClampedArray([255, 30, 120, 255, 10, 180, 250, 73]);
  for (const mode of COLOR_VISION_MODES.filter((item) => item !== 'normal')) {
    const first = simulateColorVision(pixels, mode); const second = simulateColorVision(pixels, mode);
    assert.deepEqual(first, second); assert.deepEqual([...first].filter((_, index) => index % 4 === 3), [255, 73]);
    assert.ok([...first].every((value) => value >= 0 && value <= 255));
  }
  const gray = simulateColorVision(pixels, 'achromatopsia');
  assert.equal(gray[0], gray[1]); assert.equal(gray[1], gray[2]); assert.equal(gray[4], gray[5]); assert.equal(gray[5], gray[6]);
});

test('unknown modes and malformed pixel arrays are rejected', () => {
  assert.equal(simulateColorVision(new Uint8Array([1, 2, 3]), 'normal'), null);
  assert.equal(simulateColorVision(new Uint8Array([1, 2, 3, 4]), 'sepia'), null);
  assert.equal(simulateColorVision(null, 'normal'), null);
});

test('image intake accepts common raster types only within exact byte and pixel limits', () => {
  for (const type of ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp']) assert.equal(validateColorImage({ type, size: COLOR_IMAGE_MAX_BYTES, width: 2000, height: 2000 }), 'ok');
  assert.equal(validateColorImage({ type: 'image/svg+xml', size: 10, width: 1, height: 1 }), 'type');
  assert.equal(validateColorImage({ type: 'image/png', size: COLOR_IMAGE_MAX_BYTES + 1, width: 1, height: 1 }), 'size');
  assert.equal(validateColorImage({ type: 'image/png', size: 10, width: 2001, height: 2000 }), 'pixels');
  assert.equal(validateColorImage({ type: 'image/png', size: 10, width: 0, height: 1 }), 'pixels');
  assert.equal(COLOR_IMAGE_MAX_PIXELS, 4_000_000);
});
