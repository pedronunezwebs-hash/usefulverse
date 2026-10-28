import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { execFile as callback } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inventory, markdown, measure, PAGES_FREE, pathUnion, summarize } from './release-capacity.mjs';

const execFile = promisify(callback), script = fileURLToPath(new URL('./release-capacity.mjs', import.meta.url));
const entry = (text = 'x', bytes = Buffer.byteLength(text)) => ({ bytes, sha256: createHash('sha256').update(text).digest('hex') });
async function fixture(run) {
  const root = await realpath(await mkdtemp(resolve(tmpdir(), 'uv-capacity-')));
  const builds = Object.fromEntries(['main', 'hub', 'preview'].map(name => [name, resolve(root, name)]));
  try {
    for (const [name, path] of Object.entries(builds)) {
      await mkdir(path); await writeFile(resolve(path, 'index.html'), `<html>${name}</html>`);
      await writeFile(resolve(path, 'shared.css'), 'same bytes');
    }
    const cli = (output, extra = {}) => execFile(process.execPath, [script, ...Object.entries(builds).flatMap(([name, path]) => ['--' + name, path]), '--output', output],
      { env: { ...process.env, GITHUB_STEP_SUMMARY: '', ...extra } });
    await run({ root, builds, cli });
  } finally { await rm(root, { recursive: true, force: true }); }
}

test('Pages count boundary accepts 20000 paths and blocks 20001 without deduplicating equal contents', () => {
  const files = new Map(Array.from({ length: 20_000 }, (_, index) => [`assets/${index}.txt`, entry()]));
  assert.equal(summarize(files).fitsFileAndAssetBudget, true);
  files.set('assets/another.txt', entry());
  assert.equal(summarize(files).fitsFileAndAssetBudget, false);
  assert.equal(summarize(files).excessFiles, 1);
});

test('25 MiB boundary uses raw file bytes and rejects invalid or inexact inventories', () => {
  const files = new Map([['model.bin', entry('x', PAGES_FREE.maxAssetBytes)]]);
  assert.equal(summarize(files).fitsFileAndAssetBudget, true);
  files.set('model.bin', entry('x', PAGES_FREE.maxAssetBytes + 1));
  assert.equal(summarize(files).oversizedAssetCount, 1);
  for (const bad of [entry('x', -1), entry('x', NaN), { bytes: 1, sha256: 'invalid' }])
    assert.throws(() => summarize(new Map([['bad', bad]])), /Invalid inventory/u);
});

test('shared paths are counted once; differing homes remain explicit conflicts and never approve an assembly', () => {
  const hub = new Map([['index.html', entry('indexable')], ['shared.css', entry()], ['tools/existing/index.html', entry('old')]]);
  const preview = new Map([['index.html', entry('noindex')], ['shared.css', entry()], ['tools/new/index.html', entry('new')]]);
  const result = pathUnion([hub, preview]);
  assert.equal(result.files, 4); assert.equal(result.identicalPathOccurrences, 1);
  assert.equal(result.conflictingPaths, 1); assert.equal(result.conflictingHtmlPaths, 1);
  assert.equal(result.fileCountIsLowerBound, true); assert.equal(result.assemblyApproved, false);
  assert.deepEqual(result.conflictSample, ['index.html']);
  assert.equal(hub.get('index.html').sha256, entry('indexable').sha256);
});

test('an oversized conflicting variant cannot disappear behind a smaller shared-path file', () => {
  const result = pathUnion([new Map([['same', entry()]]), new Map([['same', entry('big', PAGES_FREE.maxAssetBytes + 1)]])]);
  assert.equal(result.fitsFileAndAssetBudget, false); assert.equal(result.oversizedAssetCount, 1);
});

test('a real tree includes metadata/empty files and fingerprints file bytes rather than timestamps', async () => fixture(async ({ builds }) => {
  await writeFile(resolve(builds.main, '_headers'), '');
  const first = summarize(await inventory(builds.main));
  assert.equal(first.files, 3); assert.equal(first.htmlFiles, 1);
  await writeFile(resolve(builds.main, 'index.html'), '<html>different</html>');
  assert.notEqual(summarize(await inventory(builds.main)).treeSha256, first.treeSha256);
}));

test('measurement preserves all inputs and marks overlapping hypothetical layouts as analysis only', async () => fixture(async ({ builds }) => {
  const before = await Promise.all(Object.values(builds).map(async path => summarize(await inventory(path)).treeSha256));
  const report = await measure(builds);
  assert.equal(report.existingSeparateLayoutFitsBudget, true);
  assert.equal(report.hubWithCandidates.conflictingPaths, 1);
  assert.equal(report.deploymentApproved, false); assert.equal(report.measurementOnly, true);
  assert.equal(report.deploymentsPerformed, 0);
  assert.match(markdown(report), /no deployment approval/u);
  assert.deepEqual(await Promise.all(Object.values(builds).map(async path => summarize(await inventory(path)).treeSha256)), before);
}));

test('missing/empty builds, duplicate roots and nested roots cannot produce a successful measurement', async () => fixture(async ({ root, builds }) => {
  await mkdir(resolve(root, 'empty'));
  for (const path of [resolve(root, 'missing'), resolve(root, 'empty')]) await assert.rejects(() => inventory(path));
  await assert.rejects(() => measure({ ...builds, preview: builds.hub }), /separate directories/u);
  await mkdir(resolve(builds.hub, 'nested'));
  await assert.rejects(() => measure({ ...builds, preview: resolve(builds.hub, 'nested') }), /separate directories/u);
}));

test('symlink roots or entries never read data outside the build', async () => fixture(async ({ root, builds }) => {
  await symlink(builds.main, resolve(root, 'linked'), 'dir');
  await assert.rejects(() => inventory(resolve(root, 'linked')), /real directory/u);
  await writeFile(resolve(root, 'outside'), 'not a public asset');
  await symlink(resolve(root, 'outside'), resolve(builds.main, 'unsafe'));
  await assert.rejects(() => inventory(builds.main), /Symlinks/u);
}));

test('CLI writes a separate report/summary, refuses to replace it and never grants deployment approval', async () => fixture(async ({ root, cli }) => {
  const path = resolve(root, 'report.json'), summary = resolve(root, 'summary.md');
  const result = await cli(path, { GITHUB_STEP_SUMMARY: summary });
  assert.match(result.stdout, /UVCAPACITY_REPORT/u);
  assert.equal(JSON.parse(await readFile(path)).deploymentApproved, false);
  assert.match(await readFile(summary, 'utf8'), /no deployment approval/u);
  const saved = await readFile(path, 'utf8');
  await assert.rejects(() => cli(path)); assert.equal(await readFile(path, 'utf8'), saved);
}));

test('CLI cannot write a report through an output-parent symlink into a build', async () => fixture(async ({ root, builds, cli }) => {
  await symlink(builds.main, resolve(root, 'alias'), 'dir');
  await assert.rejects(() => cli(resolve(root, 'alias', 'report.json')));
}));

test('CLI cannot append a GitHub summary through a symlink to an existing build page', async () => fixture(async ({ root, builds, cli }) => {
  const page = resolve(builds.main, 'index.html'), saved = await readFile(page, 'utf8');
  await symlink(page, resolve(root, 'summary-link'));
  await assert.rejects(() => cli(resolve(root, 'report.json'), { GITHUB_STEP_SUMMARY: resolve(root, 'summary-link') }));
  assert.equal(await readFile(page, 'utf8'), saved);
}));

test('CLI refuses a summary path that would corrupt its JSON report', async () => fixture(async ({ root, cli }) => {
  const path = resolve(root, 'same-output.json');
  await assert.rejects(() => cli(path, { GITHUB_STEP_SUMMARY: path }));
}));

test('capacity workflow is manual, standard, read-only and has no deploy/model/artifact steps', async () => {
  const workflow = await readFile(new URL('../.github/workflows/measure-release-capacity.yml', import.meta.url), 'utf8');
  for (const required of ['workflow_dispatch:', 'contents: read', 'runs-on: ubuntu-latest', 'github.event.repository.private == false',
    'npm ci --ignore-scripts', 'node --test scripts/release-capacity.test.mjs', 'node scripts/release-capacity.mjs', 'GROWTH600_PREVIEW_ONLY:']) assert.ok(workflow.includes(required), required);
  for (const forbidden of ['contents: write', 'secrets:', 'upload-artifact', 'actions/cache', 'wrangler', 'publish_growth600', 'pip install', 'translation-autopilot.py']) assert.ok(!workflow.includes(forbidden), forbidden);
});
