import test from 'node:test';
import assert from 'node:assert/strict';
import { createBitmapFromSanitizedSvg } from './expanded-logic.mjs';

test('sanitized SVG is decoded as an image before it is rasterized', async () => {
  const events = [];
  class ImageMock {
    set src(value) { this.url = value; events.push(`src:${value}`); }
    async decode() { events.push('decode'); }
  }
  const bitmap = { width: 64, height: 64 };
  const result = await createBitmapFromSanitizedSvg('blob:https://usefulverse.com/test', {
    ImageConstructor: ImageMock,
    bitmapFactory: async (image) => { events.push('bitmap'); assert.equal(image.url, 'blob:https://usefulverse.com/test'); return bitmap; },
  });
  assert.equal(result, bitmap);
  assert.deepEqual(events, ['src:blob:https://usefulverse.com/test', 'decode', 'bitmap']);
});

test('SVG rasterizer rejects non-local URLs and missing browser decoders', async () => {
  await assert.rejects(createBitmapFromSanitizedSvg('https://example.com/logo.svg'), /local SVG object URL/u);
  await assert.rejects(createBitmapFromSanitizedSvg('blob:test', { ImageConstructor: null, bitmapFactory: null }), /not available/u);
});
