import assert from 'node:assert/strict';
import test from 'node:test';
import { countMarkdown, insertMarkdown } from './logic.mjs';

test('Markdown insertion wraps selected text and returns the inner selection', () => {
  assert.deepEqual(insertMarkdown('before text after', 7, 11, 'bold'), {
    value: 'before **text** after', selectionStart: 9, selectionEnd: 13,
  });
});

test('Markdown insertion adds locale-neutral editing skeletons with the cursor inside', () => {
  assert.equal(insertMarkdown('', 0, 0, 'heading').value, '# ');
  assert.equal(insertMarkdown('', 0, 0, 'checklist').value, '- [ ] ');
  assert.equal(insertMarkdown('', 0, 0, 'link').value, '[]()');
  assert.match(insertMarkdown('', 0, 0, 'table').value, /^\|  \|  \|\n\| --- \| --- \|\n\|  \|  \|\n$/u);
  assert.deepEqual(insertMarkdown('', 0, 0, 'bold'), { value: '****', selectionStart: 2, selectionEnd: 2 });
});

test('Markdown insertion rejects unsupported actions, invalid selections, and documents over the cap', () => {
  assert.throws(() => insertMarkdown('', 0, 0, 'unknown'), /Unsupported/u);
  assert.throws(() => insertMarkdown('abc', 2, 1, 'bold'), /Invalid/u);
  assert.throws(() => insertMarkdown('x'.repeat(500_000), 500_000, 500_000, 'bold'), /too long/u);
});

test('word count handles empty content and Unicode words while character count counts code points', () => {
  assert.deepEqual(countMarkdown(''), { words: 0, characters: 0 });
  assert.deepEqual(countMarkdown('你好 café don’t 𐐀'), { words: 4, characters: 15 });
});
