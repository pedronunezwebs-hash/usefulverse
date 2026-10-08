import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('equation calculator controller keeps roots and residuals text-only and loads a cubic example', async () => {
  const source = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(source, /solveRealPolynomial/);
  assert.match(source, /text\.textContent = lines\.join/);
  assert.match(source, /data-action="example"/);
  assert.match(source, /form\.elements\.namedItem\('a4'\)\.disabled = !isQuartic/);
  assert.match(source, /clearResult\(\)/);
  assert.match(source, /copy\.fields\.nonRealRootsNote/);
});
