import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('SVD controller renders numeric results with DOM text nodes and only local CSV export', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /createElement\('table'\)/u);
  assert.match(source, /cell\.textContent = format\(value\)/u);
  assert.match(source, /createObjectURL/u);
  assert.match(source, /revokeObjectURL/u);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|eval|Function)\b/u);
  assert.match(source, /addEventListener\('input'/u);
});
