import assert from 'node:assert/strict';
import test from 'node:test';
import { MAX_SKETCH_PIXELS, sketchImageData, sketchImageDataChunks, validateSketchOptions, validateSketchSize } from './logic.mjs';

const image = (width, height, values) => ({ width, height, data: Uint8ClampedArray.from(values) });
const options = { intensity: 1, detail: 0 };

test('white input remains white and source pixel data is never mutated', () => {
  const source = image(4, 3, Array.from({ length: 4 * 3 * 4 }, (_, index) => index % 4 === 3 ? 255 : 255));
  const before = [...source.data];
  const result = sketchImageData(source, options);
  assert.ok([...result.data].every((value, index) => index % 4 === 3 || value === 255));
  assert.deepEqual([...source.data], before);
  assert.notEqual(result.data, source.data);
});

test('photo edges become grayscale pencil-like strokes while preserving alpha and dimensions', () => {
  const source = image(3, 3, Array.from({ length: 36 }, (_, index) => {
    const pixel = Math.floor(index / 4), channel = index % 4;
    if (channel === 3) return pixel === 4 ? 120 : 255;
    return pixel === 4 ? 0 : 255;
  }));
  const before = [...source.data];
  const result = sketchImageData(source, options);
  assert.equal(result.width, 3);
  assert.equal(result.height, 3);
  assert.ok(result.data[4 * 4] < 255, 'dark center and its edge should become visible on white paper');
  assert.deepEqual([...result.data].filter((_, index) => index % 4 === 3), [...source.data].filter((_, index) => index % 4 === 3));
  assert.deepEqual([...source.data], before);
});

test('chunked processing matches synchronous output and yields between row batches', () => {
  const source = image(5, 8, Array.from({ length: 5 * 8 * 4 }, (_, index) => index % 4 === 3 ? 180 : index * 13 % 256));
  const expected = sketchImageData(source, { intensity: 1.2, detail: 8 });
  const processor = sketchImageDataChunks(source, { intensity: 1.2, detail: 8 }, 3);
  const yields = [];
  let step = processor.next();
  while (!step.done) { yields.push(step.value.rows); step = processor.next(); }
  assert.deepEqual(yields, [3, 6]);
  assert.deepEqual([...step.value.data], [...expected.data]);
});

test('size, options, chunk limits and malformed pixel arrays fail closed', () => {
  assert.equal(validateSketchSize(2000, 2000).pixels, 4_000_000);
  assert.equal(MAX_SKETCH_PIXELS, 8_000_000);
  assert.deepEqual(validateSketchOptions({ intensity: 1.25, detail: 24 }), { intensity: 1.25, detail: 24 });
  assert.throws(() => validateSketchSize(4001, 2000), RangeError);
  assert.throws(() => validateSketchOptions({ intensity: 0.1, detail: 0 }), RangeError);
  assert.throws(() => validateSketchOptions({ intensity: 1, detail: 101 }), RangeError);
  assert.throws(() => sketchImageDataChunks({ width: 1, height: 1, data: new Uint8ClampedArray(4) }, options, 0).next(), RangeError);
  assert.throws(() => sketchImageData({ width: 2, height: 2, data: new Uint8ClampedArray(3) }, options), TypeError);
});
