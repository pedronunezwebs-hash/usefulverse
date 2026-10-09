import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Fourier controller stays local, uses text-safe output and provides examples plus an accessible plot', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /calculateFourierSeries\(parseInputs\(\)\)/u);
  assert.match(source, /data-action="constant"/u);
  assert.match(source, /aria-label.*copy\.fields\.chartLabel/u);
  assert.match(source, /textContent = copy\.fields\.chartLabel/u);
  assert.match(source, /copyText\(root, outputText, copy\)/u);
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|WebSocket|eval\s*\(|new Function/u);
});
