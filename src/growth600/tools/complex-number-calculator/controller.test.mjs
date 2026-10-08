import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('complex calculator controller binds local operations and emits result copy as text', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /calculateComplexOperation\(/u);
  assert.match(source, /data-complex-result/u);
  assert.match(source, /data-action="example"/u);
  assert.match(source, /text\.textContent = lines\.join/u);
  assert.match(source, /copy\.messages\[error\?\.code\]/u);
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|WebSocket|eval\s*\(|new Function/u);
});
