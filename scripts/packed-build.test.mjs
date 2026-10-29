import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { packBuild, openPackedBuild } from './packed-build.mjs';
import { stageBuildTree } from './stage-build-tree.mjs';
import { inventory } from './release-capacity.mjs';
import { footprint } from './local-resources.mjs';
async function fixture(run) {
  const root = await mkdtemp(join(import.meta.dirname, '.packed-test-')), input = join(root, 'input'), output = join(root, 'build.uvpack');
  await mkdir(join(input, 'assets'), { recursive: true }); await mkdir(join(input, 'tools/a'), { recursive: true });
  for (const [path, data] of [['index.html', '<h1>Home</h1>'], ['assets/shared.js', 'a'.repeat(65536)], ['tools/a/index.html', '<h1>Tool</h1>'], ['empty.txt', '']]) await writeFile(join(input, path), data);
  try { await run({ root, input, output, options: { input, output, workingRoot: root } }); }
  finally { await rm(root, { recursive: true, force: true }); }
}
test('packed build verifies and restores every byte, including empty files, without changing source', () => fixture(async c => {
  const before = await inventory(c.input), report = await packBuild(c.options);
  assert.deepEqual(await inventory(c.input), before); assert.ok(report.packedBytes < report.rawBytes);
  const reader = await openPackedBuild(c.output);
  try { for (const [path, f] of reader.files) assert.deepEqual(await f.read(), await readFile(join(c.input, path))); }
  finally { await reader.close(); }
  await assert.rejects(packBuild(c.options), /already exists/u);
}));
test('Brotli repacks an existing build without extraction and preserves all file hashes', () => fixture(async c => {
  const original = await packBuild(c.options), output = join(c.root, 'brotli.uvpack');
  const compressed = await packBuild({ ...c.options, input: c.output, output, compression: 'brotli' });
  assert.equal(compressed.rawBytes, original.rawBytes); assert.ok(compressed.packedBytes < original.packedBytes);
  const reader = await openPackedBuild(output);
  try { for (const [path, file] of reader.files) assert.deepEqual(await file.read(), await readFile(join(c.input, path))); }
  finally { await reader.close(); }
  const meta = JSON.parse(await readFile(output + '.json', 'utf8'));
  meta.rawBytes -= meta.files[0].bytes - 1; meta.files[0].bytes = 1;
  await writeFile(output + '.json', JSON.stringify(meta));
  const invalid = await openPackedBuild(output);
  try { await assert.rejects(invalid.files.values().next().value.read()); } finally { await invalid.close(); }
}));
test('damaged archive, unsafe manifest, fake decoded size and hash never pass verification', () => fixture(async c => {
  await packBuild(c.options);
  const pack = await readFile(c.output), text = await readFile(c.output + '.json', 'utf8');
  const damaged = Buffer.from(pack); damaged[10] ^= 1; await writeFile(c.output, damaged);
  await assert.rejects(openPackedBuild(c.output), /integrity/u); await writeFile(c.output, pack);
  for (const mutation of [m => { m.files[0].path = '../outside'; }, m => { m.files[1].offset++; }]) {
    const m = JSON.parse(text); mutation(m); await writeFile(c.output + '.json', JSON.stringify(m)); await assert.rejects(openPackedBuild(c.output));
  }
  for (const mutation of [m => { m.files[0].sha256 = '0'.repeat(64); }, m => { m.rawBytes -= m.files[0].bytes - 1; m.files[0].bytes = 1; }]) {
    const m = JSON.parse(text); mutation(m); await writeFile(c.output + '.json', JSON.stringify(m));
    const reader = await openPackedBuild(c.output); try { await assert.rejects(reader.files.values().next().value.read()); } finally { await reader.close(); }
  }
}));
test('space limits, output overlap and source links fail without creating archive', () => fixture(async c => {
  await assert.rejects(packBuild({ ...c.options, output: join(c.input, 'wrong') }), /separate/u);
  await assert.rejects(packBuild({ ...c.options, limits: { maxWorkingBytes: 1 } }), /budget/u);
  await assert.rejects(stat(c.output), { code: 'ENOENT' });
  const link = join(c.root, 'linked'); await symlink(c.input, link);
  await assert.rejects(packBuild({ ...c.options, input: link }), /symlink/u);
}));
test('local staging shares immutable files while mutable metadata remains independent', () => fixture(async c => {
  const before = await footprint(c.root), target = join(c.root, 'stage'); await stageBuildTree(c.input, target);
  for (const path of ['assets/shared.js', 'tools/a/index.html']) assert.equal((await stat(join(c.input, path))).ino, (await stat(join(target, path))).ino);
  assert.notEqual((await stat(join(c.input, 'index.html'))).ino, (await stat(join(target, 'index.html'))).ino);
  await writeFile(join(target, 'index.html'), '<h1>Merged</h1>'); assert.equal(await readFile(join(c.input, 'index.html'), 'utf8'), '<h1>Home</h1>');
  assert.ok(await footprint(c.root) < before + 100);
  await assert.rejects(stageBuildTree(c.input, target));
  const alias = join(c.root, 'alias'); await symlink(c.input, alias);
  await assert.rejects(stageBuildTree(c.input, join(alias, 'nested')), /overlap/u);
  await assert.rejects(stat(join(c.input, 'nested')), { code: 'ENOENT' });
}));
