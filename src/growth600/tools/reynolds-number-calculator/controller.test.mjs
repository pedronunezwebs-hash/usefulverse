import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Reynolds controller uses local math, exposes dynamic/kinematic modes, and never uploads or persists inputs', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /calculateReynoldsNumber\(/u);
  assert.match(source, /data-reynolds-field/u);
  assert.match(source, /showRows\(/u);
  assert.match(source, /copyText\(/u);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB|eval|Function)\b/u);
});
