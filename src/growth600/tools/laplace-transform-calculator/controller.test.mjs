import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('Laplace controller is local-only and binds both transform directions', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /calculateLaplaceTransform\(expression\.value, direction\.value\)/u);
  assert.match(source, /data-laplace-result/u);
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|WebSocket|eval\s*\(|new Function/u);
});
