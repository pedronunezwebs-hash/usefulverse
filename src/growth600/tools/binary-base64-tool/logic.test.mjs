import assert from 'node:assert/strict';
import test from 'node:test';
import { BINARY_BASE64_LIMITS, canPreviewBase64Image, encodeBinaryBase64, encodeBinaryFile, safeFileMimeType } from './logic.mjs';

test('binary encoder exactly round-trips bytes across Base64 chunk boundaries', () => {
  const original = Uint8Array.from({ length: BINARY_BASE64_LIMITS.chunkBytes + 97 }, (_, index) => (index * 37) % 256);
  const encoded = encodeBinaryBase64(original);
  assert.deepEqual(new Uint8Array(Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0))), original);
});

test('file encoder adds a safe MIME-labelled data URI and identifies supported raster previews', () => {
  const result = encodeBinaryFile(Uint8Array.from([137, 80, 78, 71]), 'image/png');
  assert.equal(result.base64, 'iVBORw==');
  assert.equal(result.dataUri, 'data:image/png;base64,iVBORw==');
  assert.equal(result.byteLength, 4);
  assert.equal(result.previewableImage, true);
  assert.equal(canPreviewBase64Image('image/svg+xml'), false);
  assert.equal(canPreviewBase64Image('text/html'), false);
});

test('unknown and hostile MIME labels fall back without altering file bytes', () => {
  assert.equal(safeFileMimeType(' IMAGE/PNG '), 'image/png');
  assert.equal(safeFileMimeType('image/svg+xml'), 'image/svg+xml');
  assert.equal(safeFileMimeType('image/png;base64,evil'), 'application/octet-stream');
  assert.equal(encodeBinaryFile(new Uint8Array([1]), '').dataUri, 'data:application/octet-stream;base64,AQ==');
});

test('binary input is type-checked and bounded before encoding', () => {
  assert.throws(() => encodeBinaryBase64('text'), /invalidBytes/u);
  assert.throws(() => encodeBinaryBase64(new Uint8Array(BINARY_BASE64_LIMITS.inputBytes + 1)), /tooLarge/u);
  assert.equal(encodeBinaryBase64(new Uint8Array()), '');
});
