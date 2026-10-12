import test from 'node:test';
import assert from 'node:assert/strict';
import { countSpeechCharacters, MAX_SPEECH_CHARACTERS, splitSpeechText, truncateSpeechText } from './logic.mjs';

test('counts Unicode code points rather than UTF-16 halves', () => {
  assert.equal(countSpeechCharacters('Hi 👋🏽'), 5);
  assert.equal(countSpeechCharacters(''), 0);
  assert.equal(countSpeechCharacters(null), 0);
});

test('truncates by Unicode code point without splitting emoji and rejects invalid limits', () => {
  assert.equal(truncateSpeechText('a😀b', 2), 'a😀');
  assert.equal(truncateSpeechText('abc', 0), '');
  assert.throws(() => truncateSpeechText('abc', -1), RangeError);
});

test('splits long text near sentence and word boundaries without losing content', () => {
  const text = `${'One short sentence. '.repeat(80)}final word`;
  const chunks = splitSpeechText(text, 48);
  assert.ok(chunks.length > 1);
  assert.equal(chunks.join(''), text);
  assert.ok(chunks.every((chunk) => chunk.length <= 48));
  assert.match(chunks[0], /sentence\. $/u);
});

test('keeps emoji surrogate pairs together at hard chunk boundaries', () => {
  const text = `${'a'.repeat(5)}😀${'b'.repeat(7)}`;
  const chunks = splitSpeechText(text, 6);
  assert.equal(chunks.join(''), text);
  assert.deepEqual(chunks.map((chunk) => chunk.length), [5, 6, 3]);
  assert.ok(chunks.every((chunk) => !/[\uD800-\uDBFF]$/u.test(chunk)));
});

test('splits CJK text at the bound and does not split a supplementary character', () => {
  const text = '界'.repeat(7) + '𠮷'.repeat(3);
  const chunks = splitSpeechText(text, 5);
  assert.equal(chunks.join(''), text);
  assert.ok(chunks.every((chunk) => chunk.length <= 5));
  assert.equal(chunks.reduce((sum, chunk) => sum + countSpeechCharacters(chunk), 0), countSpeechCharacters(text));
});

test('rejects invalid chunk sizes and permits empty input as no chunks', () => {
  assert.deepEqual(splitSpeechText(''), []);
  assert.throws(() => splitSpeechText('abc', 1), RangeError);
  assert.throws(() => splitSpeechText('abc', 2.5), RangeError);
  assert.equal(MAX_SPEECH_CHARACTERS, 30_000);
});
