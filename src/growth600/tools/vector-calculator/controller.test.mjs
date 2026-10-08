import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('Vector calculator controller binds local operations, examples and result output', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /calculateVectorOperation\(/u);
  assert.match(source, /data-vector-result/u);
  assert.match(source, /\[data-action="example"\]/u);
  assert.match(source, /copy\.messages\[error\?\.code\]/u);
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|WebSocket|eval\s*\(|new Function/u);
});
