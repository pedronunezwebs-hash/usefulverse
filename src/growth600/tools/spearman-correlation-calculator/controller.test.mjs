import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('Spearman controller renders data as text and exports only a local CSV', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /createElement\('table'\)/u);
  assert.match(source, /renderRankChart\(calculation\.pairs\)/u);
  assert.match(source, /aria-label', copy\.fields\.chartLabel/u);
  assert.match(source, /cell\.textContent = format\(value\)/u);
  assert.match(source, /createObjectURL/u);
  assert.match(source, /revokeObjectURL/u);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|eval|Function)\b/u);
  assert.match(source, /addEventListener\('input'/u);
});
