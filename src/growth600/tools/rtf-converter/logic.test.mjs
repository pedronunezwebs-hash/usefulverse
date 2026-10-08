import assert from 'node:assert/strict';
import test from 'node:test';
import { convertRtfToText, RTF_INPUT_LIMIT_BYTES } from './logic.mjs';

test('extracts plain text while ignoring RTF formatting control words and preserving paragraphs', () => {
  assert.equal(convertRtfToText('{\\rtf1\\ansi Hello \\b bold\\b0\\par Second line.}'), 'Hello bold\nSecond line.');
});

test('decodes escaped braces, backslashes, tabs and common typographic controls', () => {
  assert.equal(convertRtfToText("{\\rtf1\\ansi A \\{literal\\} \\\\ path\\tab x\\emdash y}"), 'A {literal} \\ path\tx—y');
});

test('decodes Windows-1252 hex escapes and signed Unicode with fallback characters', () => {
  assert.equal(convertRtfToText("{\\rtf1\\ansi Caf\\'e9 \\u8217? and \\u-10179?\\u-8704?}"), 'Café ’ and 😀');
});

test('honors the declared code page for grouped hex bytes', () => {
  assert.equal(convertRtfToText("{\\rtf1\\ansi\\ansicpg1251 \\'cf\\'f0\\'e8\\'e2\\'e5\\'f2}"), 'Привет');
});

test('skips metadata, font, picture and private extension destinations', () => {
  const input = '{\\rtf1{\\fonttbl{\\f0 Arial;}}{\\info{\\title Secret metadata}}Before {\\*\\unknown hidden payload} after{\\pict 123456} end}';
  assert.equal(convertRtfToText(input), 'Before  after end');
});

test('keeps field result text and discards field instructions', () => {
  const input = '{\\rtf1 Link: {\\field{\\*\\fldinst HYPERLINK "https://example.invalid"}{\\fldrslt useful text}}}';
  assert.equal(convertRtfToText(input), 'Link: useful text');
});

test('does not interpret markup-like document text as HTML', () => {
  assert.equal(convertRtfToText('{\\rtf1 <script>alert(1)</script>}'), '<script>alert(1)</script>');
});

test('rejects invalid headers, malformed groups, empty extraction and oversized input', () => {
  assert.throws(() => convertRtfToText('plain text'), /RTF header/u);
  assert.throws(() => convertRtfToText('{\\rtf1 unclosed'), /unbalanced braces/u);
  assert.throws(() => convertRtfToText('{\\rtf1{\\fonttbl Arial;}}'), /No readable text/u);
  assert.throws(() => convertRtfToText(`{\\rtf1 ${'x'.repeat(RTF_INPUT_LIMIT_BYTES)}}`), /5 MiB/u);
});

test('rejects excessive group nesting and invalid binary lengths', () => {
  assert.throws(() => convertRtfToText(`{\\rtf1${'{'.repeat(257)}x${'}'.repeat(258)}`), /nested groups/u);
  assert.throws(() => convertRtfToText('{\\rtf1\\bin999999999999 x}'), /binary block/u);
});
