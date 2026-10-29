import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the locked sanitizer includes the three 3.4.17 security fixes', async () => {
  const pkg = JSON.parse(await read('package.json'));
  const lock = JSON.parse(await read('package-lock.json'));
  const version = pkg.devDependencies.dompurify;
  assert.match(version, /^\d+\.\d+\.\d+$/u, 'use an exact reviewed release');
  const [major, minor, patch] = version.split('.').map(Number);
  assert.ok(major > 3 || major === 3 && (minor > 4 || minor === 4 && patch >= 17), 'the sanitizer predates the security fixes');
  assert.equal(lock.packages[''].devDependencies.dompurify, version);
  assert.equal(lock.packages['node_modules/dompurify'].version, version);
});

test('the hub URL changes with the sanitizer release and matches its copied asset', async () => {
  const pkg = JSON.parse(await read('package.json'));
  const build = await read('scripts/build-growth600.mjs');
  const controller = await read('src/growth600/tools/markdown-editor/controller.mjs');
  const output = build.match(/extraAssets\['vendor\/(purify-[^']+)'\]/u)?.[1];
  const requested = controller.match(/loadLibrary\('(purify-[^']+)'/u)?.[1];
  assert.equal(output, `purify-${pkg.devDependencies.dompurify}.min.js`, 'a dependency update must invalidate the old immutable URL');
  assert.equal(requested, output, 'Markdown must request the asset that the build actually publishes');
});
