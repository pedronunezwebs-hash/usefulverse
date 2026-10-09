import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('controller renders user values as text, clears stale results, and has no network/storage APIs', async () => {
  const controller = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(controller, /document\.createTextNode\(value\)/u);
  assert.match(controller, /replaceChildren\(\)/u);
  assert.match(controller, /addEventListener\('input'/u);
  assert.match(controller, /navigator\.clipboard/u);
  assert.doesNotMatch(controller, /fetch\(|localStorage|sessionStorage|XMLHttpRequest|eval\(/u);
});
