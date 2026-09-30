import assert from 'node:assert/strict';
import test from 'node:test';
import UTIF from 'utif';
import { decodeTiffFile, decodeTiffPixels } from './tiff-decoder.mjs';

const sample = () => UTIF.encodeImage(new Uint8Array([
  255, 0, 0, 255, 0, 255, 0, 255,
  0, 0, 255, 255, 255, 255, 0, 255,
]), 2, 2);

test('TIFF decoder returns first-page dimensions and unmodified RGBA pixels', () => {
  const decoded = decodeTiffPixels(sample());
  assert.equal(decoded.width, 2);
  assert.equal(decoded.height, 2);
  assert.deepEqual([...decoded.rgba], [
    255, 0, 0, 255, 0, 255, 0, 255,
    0, 0, 255, 255, 255, 255, 0, 255,
  ]);
});

test('TIFF decoder rejects invalid files and checks pixel limits before decoding', () => {
  assert.throws(() => decodeTiffPixels(new ArrayBuffer(4)), /incomplete/u);
  assert.throws(() => decodeTiffPixels(sample(), 3), /pixel limit/u);
  assert.throws(() => decodeTiffPixels(new ArrayBuffer(64)), /dimensions/u);
});

test('file adapter works without DOM globals for local data pipelines', async () => {
  const bytes = sample();
  const file = { arrayBuffer: async () => bytes };
  const decoded = await decodeTiffFile(file);
  assert.equal(decoded.width, 2);
  assert.equal(decoded.height, 2);
  assert.equal(decoded.rgba.byteLength, 16);
});
