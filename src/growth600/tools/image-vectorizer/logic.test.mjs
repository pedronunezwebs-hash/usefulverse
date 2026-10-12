import assert from 'node:assert/strict';
import test from 'node:test';
import { traceRasterToSvg } from './logic.mjs';

test('converts a simple two-color raster to SVG path data without embedding a bitmap', () => {
  const data = new Uint8ClampedArray([255, 0, 0, 255, 255, 0, 0, 255, 0, 0, 255, 255, 0, 0, 255, 255]);
  const result = traceRasterToSvg({ width: 2, height: 2, data, colorCount: 2, alphaThreshold: 128 });
  assert.match(result.svg, /^<svg/u);
  assert.match(result.svg, /<path fill="#/u);
  assert.doesNotMatch(result.svg, /<image|data:image|base64/iu);
  assert.equal(result.pathCount, 2);
  assert.equal(result.colorCount, 2);
});

test('preserves transparent pixels and merges identical horizontal runs across rows', () => {
  const data = new Uint8ClampedArray([10, 20, 30, 255, 10, 20, 30, 255, 0, 0, 0, 0, 10, 20, 30, 255, 10, 20, 30, 255, 0, 0, 0, 0]);
  const merged = traceRasterToSvg({ width: 3, height: 2, data, colorCount: 2, alphaThreshold: 128, mergeRuns: true });
  const unmerged = traceRasterToSvg({ width: 3, height: 2, data, colorCount: 2, alphaThreshold: 128, mergeRuns: false });
  assert.equal(merged.pathCount, 1);
  assert.equal(unmerged.pathCount, 2);
  assert.match(merged.svg, /viewBox="0 0 3 2"/u);
});

test('composites semitransparent pixels against white and applies the alpha threshold', () => {
  const data = new Uint8ClampedArray([0, 0, 0, 128, 0, 0, 0, 40]);
  const result = traceRasterToSvg({ width: 2, height: 1, data, colorCount: 2, alphaThreshold: 100 });
  assert.equal(result.pathCount, 1);
  assert.match(result.palette[0], /^#[0-9a-f]{6}$/u);
});

test('rejects empty, malformed and oversized inputs plus invalid thresholds/color counts', () => {
  assert.throws(() => traceRasterToSvg({ width: 0, height: 1, data: new Uint8ClampedArray(), colorCount: 2 }), RangeError);
  assert.throws(() => traceRasterToSvg({ width: 2, height: 2, data: new Uint8ClampedArray(4), colorCount: 2 }), RangeError);
  assert.throws(() => traceRasterToSvg({ width: 257, height: 1, data: new Uint8ClampedArray(257 * 4), colorCount: 2 }), RangeError);
  assert.throws(() => traceRasterToSvg({ width: 1, height: 1, data: new Uint8ClampedArray(4), colorCount: 1 }), RangeError);
  assert.throws(() => traceRasterToSvg({ width: 1, height: 1, data: new Uint8ClampedArray(4), colorCount: 2, alphaThreshold: 256 }), RangeError);
});

test('an entirely transparent source is rejected with a usable error', () => {
  assert.throws(() => traceRasterToSvg({ width: 1, height: 1, data: new Uint8ClampedArray([0, 0, 0, 0]), colorCount: 2 }), /No visible pixels/u);
});
