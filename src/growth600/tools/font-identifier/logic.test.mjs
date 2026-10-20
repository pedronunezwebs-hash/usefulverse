import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeGlyphMask, rankFontMasks, validateFontSampleDimensions, validateFontSampleFile } from './logic.mjs';

function rgba(width, height, inkPoints = []) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < width * height; index += 1) { data[index * 4] = 255; data[index * 4 + 1] = 255; data[index * 4 + 2] = 255; data[index * 4 + 3] = 255; }
  for (const [x, y] of inkPoints) { const index = (y * width + x) * 4; data[index] = 0; data[index + 1] = 0; data[index + 2] = 0; }
  return data;
}

test('font identifier accepts supported image samples within byte and pixel limits', () => {
  assert.equal(validateFontSampleFile(new Blob([new Uint8Array([1])], { type: 'image/png' })), true);
  assert.equal(validateFontSampleDimensions(2000, 4000).pixels, 8_000_000);
  assert.throws(() => validateFontSampleFile(new Blob([], { type: 'image/png' })), RangeError);
  assert.throws(() => validateFontSampleFile(new Blob([new Uint8Array([1])], { type: 'image/gif' })), TypeError);
  assert.throws(() => validateFontSampleDimensions(2001, 4000), RangeError);
});

test('font identifier crops whitespace, normalizes glyph pixels and rejects a blank sample', () => {
  const sample = normalizeGlyphMask(rgba(8, 6, [[3, 2], [4, 2], [3, 3], [4, 3]]), 8, 6);
  assert.equal(sample.width, 128);
  assert.equal(sample.height, 64);
  assert.ok(sample.inkPixels > 0);
  assert.ok(sample.inkPixels < sample.mask.length);
  assert.throws(() => normalizeGlyphMask(rgba(8, 6), 8, 6), /No dark text/u);
});

test('font identifier ranks an exact raster first and removes identical fallback renderings', () => {
  const target = normalizeGlyphMask(rgba(8, 6, [[2, 1], [2, 2], [2, 3], [3, 3], [4, 3]]), 8, 6);
  const other = normalizeGlyphMask(rgba(8, 6, [[1, 1], [2, 1], [3, 1], [3, 2], [3, 3]]), 8, 6);
  const result = rankFontMasks(target, [
    { name: 'Near', sample: other }, { name: 'Exact', sample: target }, { name: 'Fallback alias', sample: target },
  ], { limit: 3 });
  assert.equal(result[0].name, 'Exact');
  assert.equal(result[0].similarity, 1);
  assert.equal(result.length, 2);
  assert.ok(result[1].similarity < 1);
  assert.throws(() => rankFontMasks(target, []), RangeError);
});
