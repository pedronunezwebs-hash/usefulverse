import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');

test('JSON diff controller uses safe text nodes, local comparison and localized outcomes', () => {
  assert.match(source, /compareJsonDocuments/u);
  assert.match(source, /textContent\s*=/u);
  assert.doesNotMatch(source, /\.innerHTML\s*=/u);
  assert.match(source, /copy\.messages\.downloaded/u);
  assert.match(source, /copy\.messages\.noChanges/u);
  assert.match(source, /arrayKey:\s*mode\.value/u);
});
