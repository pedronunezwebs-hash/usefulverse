import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_SOURCE_LENGTH, PARAPHRASE_STYLES, validateParaphraseSource, validateParaphraseStyle } from './logic.mjs';

test('validates a bounded paraphrasing source', () => {
  assert.equal(validateParaphraseSource('  Bonjour  '), 'Bonjour');
  assert.equal(validateParaphraseSource('x'.repeat(MAX_SOURCE_LENGTH)).length, MAX_SOURCE_LENGTH);
  assert.throws(() => validateParaphraseSource('  '), /empty-source/u);
  assert.throws(() => validateParaphraseSource('x'.repeat(MAX_SOURCE_LENGTH + 1)), /source-too-long/u);
});

test('accepts only the four disclosed rewriting styles', () => {
  for (const style of PARAPHRASE_STYLES) assert.equal(validateParaphraseStyle(style), style);
  assert.throws(() => validateParaphraseStyle('translate'), /invalid-style/u);
});
