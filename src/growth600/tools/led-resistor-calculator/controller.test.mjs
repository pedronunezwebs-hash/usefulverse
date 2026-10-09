import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('LED calculator controller binds local math, uses localized text output and has no remote or storage path', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /calculateLedResistor\(/u);
  assert.match(source, /data-action="example"/u);
  assert.match(source, /showRows\(/u);
  assert.match(source, /copyText\(/u);
  assert.match(source, /2066/u);
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|eval\s*\(|new Function/u);
});
