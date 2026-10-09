import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('certificate controller decodes selected files locally and never sends certificate contents over the network', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /file\.arrayBuffer\(\)/u);
  assert.match(source, /file\.size > CERTIFICATE_LIMITS\.maxBytes/u);
  assert.match(source, /decodeCertificateInput\(input\.value\)/u);
  assert.match(source, /sha256Fingerprint\(bytes\)/u);
  assert.match(source, /showRows\(root, rows\)/u);
  assert.match(source, /copyText\(root, summary, copy\)/u);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB|eval|Function)\b/u);
  assert.doesNotMatch(source, /innerHTML/u);
});
