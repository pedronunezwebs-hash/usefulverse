import assert from 'node:assert/strict';
import test from 'node:test';
import { fitImageDimensions, validatePanoramaBounds, validatePanoramaInputs } from './logic.mjs';

const file = (overrides = {}) => ({ type: 'image/jpeg', size: 1000, width: 3000, height: 2000, ...overrides });

test('panorama input requires two bounded local raster images', () => {
  assert.equal(validatePanoramaInputs([file(), file({ width: 1500 })]), true);
  assert.throws(() => validatePanoramaInputs([file()]), /choose-two-images/u);
  assert.throws(() => validatePanoramaInputs([file(), file({ type: 'image/gif' })]), /unsupported-image-type/u);
  assert.throws(() => validatePanoramaInputs([file({ size: 12 * 1024 * 1024 + 1 }), file()]), /image-size-limit/u);
  assert.throws(() => validatePanoramaInputs([file({ width: 6001 }), file()]), /image-dimension-limit/u);
});

test('panorama image downscaling preserves aspect ratio and never enlarges', () => {
  assert.deepEqual(fitImageDimensions(6000, 3000), { width: 2500, height: 1250 });
  assert.deepEqual(fitImageDimensions(1200, 800), { width: 1200, height: 800 });
  assert.throws(() => fitImageDimensions(0, 10), /invalid-image-dimensions/u);
});

test('panorama output is bounded before allocating a canvas', () => {
  assert.deepEqual(validatePanoramaBounds(5000, 5000), { width: 5000, height: 5000 });
  assert.throws(() => validatePanoramaBounds(6000, 6000), /panorama-too-large/u);
  assert.throws(() => validatePanoramaBounds(0, 10), /panorama-too-large/u);
});
