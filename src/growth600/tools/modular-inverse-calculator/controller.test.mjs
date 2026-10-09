import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('modular inverse controller uses localized numbers and only safe text output', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /parseLocalizedNumber/u);
  assert.match(source, /calculateModularInverse\(read\('a'\), read\('modulus'\)\)/u);
  assert.match(source, /result\.exists \? copy\.messages\.calculated : copy\.messages\.noInverse/u);
  assert.match(source, /copyText\(root, outputText, copy\)/u);
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|WebSocket|eval\s*\(|new Function|innerHTML/u);
});
