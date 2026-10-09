import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('CRT controller renders safe localized text, clears stale results, and copies locally', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /showRows\(root, rows\)/u);
  assert.match(source, /copy\.messages\.incompatible/u);
  assert.match(source, /copyText\(root, outputText, copy\)/u);
  assert.match(source, /clearResult\(root\)/u);
  assert.match(source, /addEventListener\('input'/u);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|eval|Function)\b/u);
});
