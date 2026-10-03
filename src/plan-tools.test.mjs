import assert from 'node:assert/strict';
import test from 'node:test';
import { createXlsx, readXlsxSheets } from './pdf-office.mjs';
import { convertSubtitles, csvText, gcdAll, lcmAll, parseCsv, parseWholeNumbers } from './plan-tools.js';

test('GCD and LCM support negative integers, zero and several values', () => {
  const values = parseWholeNumbers('12, -18, 30');
  assert.equal(gcdAll(values), 6n);
  assert.equal(lcmAll(values), 180n);
  assert.equal(gcdAll(parseWholeNumbers('0 0')), 0n);
  assert.equal(lcmAll(parseWholeNumbers('0 12')), 0n);
  assert.throws(() => parseWholeNumbers('4.5, 3'), /whole numbers/u);
  assert.throws(() => parseWholeNumbers('1'), /2 to 100/u);
});

test('CSV parser preserves quoted commas, escaped quotes, newlines and leading zeros', () => {
  const input = 'id,note\r\n001,"one, two"\r\n002,"line one\nline two"\r\n003,"say ""hi"""';
  const rows = parseCsv(input);
  assert.deepEqual(rows, [['id', 'note'], ['001', 'one, two'], ['002', 'line one\nline two'], ['003', 'say "hi"']]);
  assert.deepEqual(parseCsv(csvText(rows)), rows);
  assert.throws(() => parseCsv('a,"open'), /unclosed/u);
});

test('XLSX converter reads a selected worksheet and writes values as inert text', () => {
  const bytes = createXlsx([['id', 'value'], ['001', '=2+2'], ['002', 'hello']]);
  const sheets = readXlsxSheets(bytes);
  assert.equal(sheets.length, 1);
  assert.deepEqual(sheets[0].rows, [['id', 'value'], ['001', '=2+2'], ['002', 'hello']]);
});

test('subtitle conversion shifts timing, preserves multiline captions and normalizes timestamps', () => {
  const srt = '1\n00:00:01,250 --> 00:00:02,500\nHello\nsecond line\n\n2\n00:00:03,000 --> 00:00:04,000\nBye';
  const vtt = convertSubtitles(srt, 'vtt', 500);
  assert.match(vtt, /^WEBVTT/u);
  assert.match(vtt, /00:00:01\.750 --> 00:00:03\.000\nHello\nsecond line/u);
  assert.match(vtt, /00:00:03\.500 --> 00:00:04\.500/u);
  assert.throws(() => convertSubtitles(srt, 'srt', -2_000), /cue invalid/u);
});
