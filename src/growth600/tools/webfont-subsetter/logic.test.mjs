import test from 'node:test';
import assert from 'node:assert/strict';
import { subsetFilename, validateFontRequest } from './logic.mjs';

test('validates authorized TTF and deduplicates requested characters', () => {
  const file = new File([new Uint8Array(32)], 'sample.ttf');
  assert.deepEqual(validateFontRequest(file, 'aba🙂', true), { text: 'ab🙂' });
});
test('requires an OTF or TTF, text, a bounded file, and modification rights', () => {
  assert.throws(() => validateFontRequest(new File(['font'], 'x.woff'), 'abc', true));
  assert.throws(() => validateFontRequest(new File(['font'], 'x.ttf'), 'abc', false));
  assert.throws(() => validateFontRequest(new File(['font'], 'x.ttf'), ' ', true));
});
test('keeps the source outline extension in the download name', () => {
  assert.equal(subsetFilename('Brand.OTF'), 'Brand-subset.otf');
});
