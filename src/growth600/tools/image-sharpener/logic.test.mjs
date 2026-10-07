import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_SHARPENER_PIXELS, sharpenImageData, sharpenImageDataChunks, validateSharpenerOptions, validateSharpenerSize } from './logic.mjs';

function image(width, height, data) { return { width, height, data: Uint8ClampedArray.from(data) }; }

test('zero amount returns an exact RGBA copy at original dimensions', () => {
  const source = image(3, 1, [20, 30, 40, 0, 50, 60, 70, 128, 220, 210, 200, 255]);
  const result = sharpenImageData(source, { amount: 0, radius: 4, threshold: 0 });
  assert.deepEqual({ width: result.width, height: result.height, data: [...result.data] }, { width: 3, height: 1, data: [...source.data] });
  assert.notEqual(result.data, source.data);
});

test('unsharp mask increases a hard edge, preserves alpha and does not mutate source', () => {
  const source = image(5, 1, [40, 40, 40, 10, 80, 80, 80, 80, 160, 160, 160, 160, 220, 220, 220, 255, 240, 240, 240, 64]);
  const before = [...source.data];
  const result = sharpenImageData(source, { amount: 1.5, radius: 1, threshold: 0 });
  assert.equal(result.width, 5);
  assert.equal(result.height, 1);
  assert.deepEqual([...result.data].filter((_, index) => index % 4 === 3), [10, 80, 160, 255, 64]);
  assert.ok(result.data[4] < source.data[4], 'dark side of an edge gets darker');
  assert.ok(result.data[12] > source.data[12], 'bright side of an edge gets brighter');
  assert.deepEqual([...source.data], before);
});

test('threshold leaves low-contrast noise unchanged', () => {
  const source = image(3, 1, [100, 100, 100, 255, 102, 102, 102, 255, 101, 101, 101, 255]);
  const result = sharpenImageData(source, { amount: 3, radius: 1, threshold: 64 });
  assert.deepEqual([...result.data], [...source.data]);
});

test('chunked export yields between row batches and matches synchronous output', () => {
  const source = image(4, 7, Array.from({ length: 4 * 7 * 4 }, (_, index) => index % 4 === 3 ? 255 : (index * 17) % 256));
  const options = { amount: 1.7, radius: 2, threshold: 3 };
  const expected = sharpenImageData(source, options);
  const processor = sharpenImageDataChunks(source, options, 2);
  const yields = [];
  let step = processor.next();
  while (!step.done) { yields.push(step.value.rows); step = processor.next(); }
  assert.deepEqual(yields, [2, 4, 6]);
  assert.deepEqual([...step.value.data], [...expected.data]);
});

test('options and device-size boundary reject unsupported values', () => {
  assert.deepEqual(validateSharpenerOptions({ amount: 1.2, radius: 4, threshold: 20 }), { amount: 1.2, radius: 4, threshold: 20 });
  assert.throws(() => validateSharpenerOptions({ amount: 3.1, radius: 1, threshold: 0 }), RangeError);
  assert.throws(() => validateSharpenerOptions({ amount: 1, radius: 0, threshold: 0 }), RangeError);
  assert.throws(() => validateSharpenerOptions({ amount: 1, radius: 1, threshold: 65 }), RangeError);
  assert.equal(validateSharpenerSize(2000, 2000).pixels, 4_000_000);
  assert.throws(() => validateSharpenerSize(4001, 2000), RangeError);
  assert.equal(MAX_SHARPENER_PIXELS, 8_000_000);
});

test('malformed pixel buffers fail closed', () => {
  assert.throws(() => sharpenImageData({ width: 2, height: 2, data: new Uint8ClampedArray(3) }, { amount: 1, radius: 1, threshold: 0 }), TypeError);
});
