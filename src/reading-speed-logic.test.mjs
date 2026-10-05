import test from 'node:test';
import assert from 'node:assert/strict';
import { countReadingWords, formatElapsed, readingWordsPerMinute } from './reading-speed-logic.mjs';

test('reading word count handles spaces, punctuation and empty Unicode text', () => {
  assert.equal(countReadingWords('One, two—three!'), 3);
  assert.equal(countReadingWords('   '), 0);
  assert.ok(countReadingWords('これは日本語の文章です', 'ja') >= 3);
});

test('reading speed uses elapsed wall time and rounds to whole words per minute', () => {
  assert.equal(readingWordsPerMinute(120, 60000), 120);
  assert.equal(readingWordsPerMinute(60, 30000), 120);
  assert.equal(readingWordsPerMinute(100, 120000), 50);
});

test('reading speed rejects empty, too-short, excessive and non-finite measurements', () => {
  for (const [words, time] of [[0, 1000], [10001, 60000], [10, 999], [10, Infinity]]) {
    assert.throws(() => readingWordsPerMinute(words, time));
  }
});

test('elapsed time displays as a bounded minute and second clock', () => {
  assert.equal(formatElapsed(0), '0:00');
  assert.equal(formatElapsed(61000), '1:01');
  assert.equal(formatElapsed(-3000), '0:00');
});
