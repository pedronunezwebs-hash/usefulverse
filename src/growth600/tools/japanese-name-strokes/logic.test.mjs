import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculateJapaneseNameStrokes } from './logic.mjs';

const counts = JSON.parse(await readFile(new URL('./data/stroke-counts.json', import.meta.url), 'utf8'));

test('Japanese stroke counter returns per-character counts and complete totals from the bundled dataset', () => {
  const result = calculateJapaneseNameStrokes('あい', counts);
  assert.deepEqual(result.characters.map(({ strokes }) => strokes), [3, 2]);
  assert.equal(result.total, 5);
  assert.equal(result.complete, true);
});

test('Japanese stroke counter normalizes Unicode and withholds partial totals for unsupported characters', () => {
  const composed = calculateJapaneseNameStrokes('が', counts);
  const decomposed = calculateJapaneseNameStrokes('か\u3099', counts);
  const partial = calculateJapaneseNameStrokes('あ🙂', counts);
  assert.equal(decomposed.normalized, composed.normalized);
  assert.equal(decomposed.total, composed.total);
  assert.equal(partial.characters[1].strokes, null);
  assert.equal(partial.complete, false);
  assert.equal(partial.total, null);
});

test('Japanese stroke counter bounds input and rejects malformed lookup data', () => {
  assert.throws(() => calculateJapaneseNameStrokes('', counts), RangeError);
  assert.throws(() => calculateJapaneseNameStrokes('あ'.repeat(41), counts), RangeError);
  assert.throws(() => calculateJapaneseNameStrokes('あ', null), TypeError);
  assert.throws(() => calculateJapaneseNameStrokes('あ', []), TypeError);
});
