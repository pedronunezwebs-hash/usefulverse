import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');

test('JSON/XML controller switches modes, exposes local conversion and safe text output', () => {
  assert.match(source, /convertJsonToXml/u);
  assert.match(source, /convertXmlToJson/u);
  assert.match(source, /form\.addEventListener\('submit'/u);
  assert.match(source, /output\.value\s*=\s*outputText/u);
  assert.match(source, /URL\.createObjectURL/u);
  assert.match(source, /copyText/u);
  assert.doesNotMatch(source, /\.innerHTML\s*=/u);
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|WebSocket|EventSource/u);
});
