import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('Wilcoxon controller safely renders a translated table and exports local CSV only', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /createElement\('table'\)/u);
  assert.match(source, /cell\.textContent = format\(value\)/u);
  assert.match(source, /calculation\.status === 'all-zero'/u);
  assert.match(source, /createObjectURL/u);
  assert.match(source, /revokeObjectURL/u);
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|eval|Function)\b/u);
  assert.match(source, /addEventListener\('input'/u);
});
