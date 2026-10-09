import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('parametric calculator controller avoids code evaluation, network and persistent storage', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\beval\s*\(|new Function|\bfetch\s*\(|localStorage|sessionStorage|indexedDB/u);
  assert.match(source, /createElementNS/u);
  assert.match(source, /createObjectURL/u);
  assert.match(source, /revokeObjectURL/u);
});
