import test from 'node:test';
import assert from 'node:assert/strict';
import { rasterToRunningStitchSketch } from './logic.mjs';

const rgba = (pixels) => new Uint8ClampedArray(pixels.flatMap(([r,g,b,a=255]) => [r,g,b,a]));
test('samples dark runs at the selected scanline spacing', () => {
  const image = rgba([[0,0,0],[0,0,0],[255,255,255],[0,0,0],[0,0,0], [255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255]]);
  const result = rasterToRunningStitchSketch(image, 5, 2, 128, 2);
  assert.deepEqual(result.paths.map((path) => path.d), ['M0 0 H1','M3 0 H4']); assert.equal(result.stitchCount, 2);
});
test('treats transparent pixels as white and respects brightness threshold', () => {
  const image = rgba([[0,0,0,0],[100,100,100],[200,200,200]]);
  assert.deepEqual(rasterToRunningStitchSketch(image, 3, 1, 128, 2).paths.map((path) => path.d), ['M1 0 H1']);
});
test('rejects oversized or malformed images and invalid spacing', () => {
  assert.throws(() => rasterToRunningStitchSketch(new Uint8ClampedArray(12), 2, 2), { code: 'invalid-image' });
  assert.throws(() => rasterToRunningStitchSketch(new Uint8ClampedArray(4), 1, 1, 128, 1), { code: 'invalid-image' });
});
