import assert from 'node:assert/strict';
import test from 'node:test';
import { addColorSample, formatColorSample, mapPreviewPoint, MAX_IMAGE_COLOR_SAMPLES, normalizeColorSample, validateColorPickerSize } from './logic.mjs';

test('accepts an image exactly at the size ceiling and rejects dimensions above it', () => {
  assert.equal(validateColorPickerSize(4000, 3000).pixels, 12_000_000);
  assert.throws(() => validateColorPickerSize(4001, 3000), /pixel count/);
  assert.throws(() => validateColorPickerSize(0, 1), /pixel count/);
});

test('formats opaque red as conventional HEX/RGB and preserves transparent alpha', () => {
  assert.deepEqual(formatColorSample({ x: 4, y: 7, r: 255, g: 0, b: 0, a: 255 }), {
    hex: '#FF0000', rgb: '255, 0, 0', rgba: 'rgba(255, 0, 0, 1)', cssColor: 'rgba(255, 0, 0, 1)',
  });
  assert.equal(formatColorSample({ x: 0, y: 0, r: 1, g: 2, b: 3, a: 0 }).hex, '#01020300');
  assert.equal(formatColorSample({ x: 0, y: 0, r: 1, g: 2, b: 3, a: 128 }).rgba, 'rgba(1, 2, 3, 0.502)');
});

test('maps pointer positions to exact source pixels at crop edges', () => {
  const rect = { left: 10, top: 20, width: 200, height: 100 };
  const source = { x: 100, y: 50, width: 400, height: 200 };
  assert.deepEqual(mapPreviewPoint(10, 20, rect, source, 800, 400), { x: 100, y: 50 });
  assert.deepEqual(mapPreviewPoint(210, 120, rect, source, 800, 400), { x: 499, y: 249 });
  assert.deepEqual(mapPreviewPoint(110, 70, rect, source, 800, 400), { x: 300, y: 150 });
  assert.throws(() => mapPreviewPoint(10, 20, { ...rect, width: 0 }, source, 800, 400), /coordinates/);
});

test('rejects invalid color channels and coordinates instead of wrapping values', () => {
  assert.throws(() => normalizeColorSample({ x: -1, y: 0, r: 1, g: 2, b: 3, a: 255 }), /coordinates/);
  assert.throws(() => normalizeColorSample({ x: 0, y: 0, r: 256, g: 2, b: 3, a: 255 }), /Red/);
  assert.throws(() => normalizeColorSample({ x: 0, y: 0, r: 1, g: 2, b: 3, a: 1.5 }), /Alpha/);
});

test('adds independent samples without mutating the prior palette and enforces its cap', () => {
  const original = [];
  const first = addColorSample(original, { x: 0, y: 0, r: 255, g: 0, b: 0, a: 255 });
  assert.equal(original.length, 0);
  assert.equal(first.length, 1);
  const full = Array.from({ length: MAX_IMAGE_COLOR_SAMPLES }, (_, index) => ({ x: index, y: 0, r: index, g: 1, b: 2, a: 255 }));
  assert.throws(() => addColorSample(full, { x: 0, y: 0, r: 0, g: 0, b: 0, a: 255 }), /sample limit/);
});
