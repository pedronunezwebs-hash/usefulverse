import test from 'node:test';
import assert from 'node:assert/strict';
import { searchEmoji } from './logic.mjs';

const entries = [['😀', 'Grinning face', ['smile', 'happy']], ['😃', 'Grinning face with big eyes', ['smile']], ['☕', 'Coffee', ['café', 'drink']]];

test('emoji search folds accents, matches all query words and ranks exact names first', () => {
  assert.deepEqual(searchEmoji(entries, 'grinning face'), [
    { symbol: '😀', name: 'Grinning face' },
    { symbol: '😃', name: 'Grinning face with big eyes' },
  ]);
  assert.deepEqual(searchEmoji(entries, 'cafe').map(({ symbol }) => symbol), ['☕']);
  assert.deepEqual(searchEmoji(entries, '😃').map(({ symbol }) => symbol), ['😃']);
});

test('emoji search bounds query, dataset and result limit', () => {
  assert.throws(() => searchEmoji(entries, ''), { code: 'invalid-query' });
  assert.throws(() => searchEmoji(entries, 'x'.repeat(101)), { code: 'invalid-query' });
  assert.throws(() => searchEmoji(entries, 'smile', 0), { code: 'invalid-limit' });
  assert.throws(() => searchEmoji(entries, 'smile', 2.5), { code: 'invalid-limit' });
  assert.throws(() => searchEmoji(Array(2501).fill(['x', 'x', []]), 'x'), { code: 'invalid-data' });
});
