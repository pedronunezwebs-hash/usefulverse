import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('flow-rate controller uses local math, updates the selected calculation and does not upload or persist inputs', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /calculateFlowRate\(/u);
  assert.match(source, /convertFlowValue\(/u);
  assert.match(source, /updateMode\(/u);
  assert.match(source, /data-flow-field/u);
  assert.match(source, /showRows\(/u);
  assert.match(source, /copyText\(/u);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB|eval|Function)\b/u);
});
