import assert from 'node:assert/strict';
import test from 'node:test';
import { cssFamilyValue, fontFaceFamily, typographyCss, validateFontFiles } from './logic.mjs';

test('font file acceptance is bounded by format, per-file, count and total size', () => {
  assert.equal(validateFontFiles([{ name: 'font.woff2', size: 100 }]).ok, true);
  assert.equal(validateFontFiles([{ name: 'font.pdf', size: 100 }]).error, 'unsupported');
  assert.equal(validateFontFiles([{ name: 'font.ttf', size: 5 * 1024 * 1024 + 1 }]).error, 'fileTooLarge');
  assert.equal(validateFontFiles(Array.from({ length: 2 }, (_, i) => ({ name: `font${i}.otf`, size: 1 })), 7).error, 'tooMany');
  assert.equal(validateFontFiles([{ name: 'font.woff', size: 1 }], 0, 15 * 1024 * 1024).error, 'totalTooLarge');
});

test('local family slots cannot escape their generated bounded names', () => {
  assert.equal(fontFaceFamily(8), 'uv-local-font-8');
  assert.throws(() => fontFaceFamily(9), RangeError);
  assert.equal(cssFamilyValue('uv-local-font-2'), '"uv-local-font-2"');
  assert.throws(() => cssFamilyValue('Arial; background:url(https://bad)'), TypeError);
  assert.throws(() => cssFamilyValue('user uploaded font'), TypeError);
});

test('CSS export clamps values and emits only selected families and controls', () => {
  const css = typographyCss({ headingFamily: 'Georgia, "Times New Roman", serif', bodyFamily: 'uv-local-font-1', headingSize: 48, bodySize: 18, headingWeight: 700, bodyWeight: 400, lineHeight: 1.6 });
  assert.match(css, /--heading-font: Georgia/u);
  assert.match(css, /--body-font: "uv-local-font-1"/u);
  assert.match(css, /font-size: 48px/u);
  assert.match(css, /line-height: 1\.6/u);
  assert.throws(() => typographyCss({ headingFamily: 'Arial', bodyFamily: 'Arial', headingSize: 120, bodySize: 18, headingWeight: 700, bodyWeight: 400, lineHeight: 1.6 }), RangeError);
});
