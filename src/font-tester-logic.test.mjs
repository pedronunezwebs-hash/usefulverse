import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_FONT_FILE_BYTES, validateFontFile } from './font-tester-logic.mjs';

test('font tester accepts supported font extensions within the local size cap', () => {
  for (const name of ['font.woff', 'FONT.WOFF2', 'font.ttf', 'font.otf']) {
    assert.equal(validateFontFile({ name, size: MAX_FONT_FILE_BYTES }), null);
  }
});

test('font tester rejects missing, empty, unsupported, and oversized files', () => {
  assert.equal(validateFontFile(null), 'Choose a font file first.');
  assert.notEqual(validateFontFile({ name: 'font.svg', size: 100 }), null);
  assert.notEqual(validateFontFile({ name: 'font.ttf', size: 0 }), null);
  assert.notEqual(validateFontFile({ name: 'font.woff2', size: MAX_FONT_FILE_BYTES + 1 }), null);
});
