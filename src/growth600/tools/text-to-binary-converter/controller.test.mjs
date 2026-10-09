import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');

test('text/binary controller keeps conversions local and renders output as text', () => {
  assert.match(source, /encodeTextToBinary/u);
  assert.match(source, /decodeBinaryToText/u);
  assert.match(source, /output\.value\s*=\s*outputText/u);
  assert.match(source, /textContent|\.value\s*=/u);
  assert.doesNotMatch(source, /\.innerHTML\s*=/u);
  assert.match(source, /copy\.messages\[error\.message\]/u);
  assert.match(source, /URL\.createObjectURL/u);
});
