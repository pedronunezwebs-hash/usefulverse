import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { appendFile, lstat, readdir, realpath, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PAGES_FREE = Object.freeze({
  maxFiles: 20_000, maxAssetBytes: 25 * 1024 * 1024,
  reference: 'https://developers.cloudflare.com/pages/platform/limits/',
  checkedAt: '2026-10-28',
});

const ordered = entries => [...entries].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
const inside = (parent, child) => {
  const path = relative(parent, child);
  return !path || (!isAbsolute(path) && path !== '..' && !path.startsWith('..' + sep));
};

async function realDirectory(directory) {
  const root = resolve(directory), stat = await lstat(root);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw Error('Input must be a real directory');
  return realpath(root);
}

async function separateOutput(path, inputs) {
  const output = resolve(await realpath(dirname(path)), basename(path));
  if (inputs.some(input => inside(input, output))) throw Error('Report/summary must not modify a build input');
  try {
    const stat = await lstat(output);
    if (stat.isSymbolicLink() || !stat.isFile()) throw Error('Output must be a regular file');
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  return output;
}

export async function inventory(directory) {
  const root = await realDirectory(directory);
  const files = new Map();
  async function walk(path, prefix = '') {
    for (const name of await readdir(path)) {
      const absolute = resolve(path, name), key = prefix + name;
      const stat = await lstat(absolute);
      if (stat.isSymbolicLink()) throw Error(`Symlinks are not deployable inventory inputs: ${key}`);
      if (stat.isDirectory()) await walk(absolute, key + '/');
      else if (stat.isFile()) {
        const digest = createHash('sha256');
        for await (const chunk of createReadStream(absolute)) digest.update(chunk);
        const after = await lstat(absolute);
        if (after.size !== stat.size || after.mtimeMs !== stat.mtimeMs) throw Error(`Input changed during measurement: ${key}`);
        files.set(key, { bytes: stat.size, sha256: digest.digest('hex') });
      } else throw Error(`Unsupported filesystem entry: ${key}`);
    }
  }
  await walk(root);
  if (!files.size) throw Error('Build output must not be empty');
  return files;
}

export function summarize(files, limits = PAGES_FREE) {
  let bytes = 0, htmlFiles = 0;
  const oversized = [], digest = createHash('sha256');
  for (const [path, file] of ordered(files)) {
    if (!Number.isSafeInteger(file.bytes) || file.bytes < 0 || !/^[a-f0-9]{64}$/u.test(file.sha256)) throw Error('Invalid inventory entry');
    bytes += file.bytes;
    if (!Number.isSafeInteger(bytes)) throw Error('Inventory total exceeds exact arithmetic');
    htmlFiles += /\.html?$/iu.test(path) ? 1 : 0;
    if (file.bytes > limits.maxAssetBytes) oversized.push({ path, bytes: file.bytes });
    digest.update(JSON.stringify([path, file.bytes, file.sha256]) + '\n');
  }
  const largest = ordered(files).map(([path, { bytes }]) => ({ path, bytes }))
    .sort((a, b) => b.bytes - a.bytes || (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)).slice(0, 10);
  return { files: files.size, htmlFiles, bytes, treeSha256: digest.digest('hex'), largest,
    fitsFileAndAssetBudget: files.size <= limits.maxFiles && oversized.length === 0,
    excessFiles: Math.max(0, files.size - limits.maxFiles), oversizedAssetCount: oversized.length,
    oversizedAssetSample: oversized.slice(0, 10) };
}

export function pathUnion(inputs) {
  const files = new Map(), conflicts = new Set();
  let identicalPathOccurrences = 0;
  for (const input of inputs) for (const [path, file] of input) {
    const previous = files.get(path);
    if (previous) {
      if (previous.bytes === file.bytes && previous.sha256 === file.sha256) identicalPathOccurrences++;
      else conflicts.add(path);
    }
    // This is a count bound, not an assembly. Keep the larger conflicting variant
    // to avoid concealing oversized assets; never overwrite a build on disk.
    if (!previous || file.bytes > previous.bytes) files.set(path, file);
  }
  return { ...summarize(files), fileCountIsLowerBound: true,
    bytesUseLargestConflictingVariant: true, identicalPathOccurrences,
    conflictingPaths: conflicts.size, conflictingHtmlPaths: [...conflicts].filter(path => /\.html?$/iu.test(path)).length,
    conflictSample: [...conflicts].sort().slice(0, 20), assemblyApproved: false };
}

export async function measure({ main, hub, preview }) {
  const roots = await Promise.all([main, hub, preview].map(realDirectory));
  for (let i = 0; i < roots.length; i++) for (let j = i + 1; j < roots.length; j++)
    if (inside(roots[i], roots[j]) || inside(roots[j], roots[i])) throw Error('Build inputs must be distinct, separate directories');
  const [mainFiles, hubFiles, previewFiles] = await Promise.all(roots.map(inventory));
  const separate = { main: summarize(mainFiles), hub: summarize(hubFiles), preview: summarize(previewFiles) };
  return { schemaVersion: 1, measuredAt: new Date().toISOString(), sourceCommit: process.env.CAPACITY_SOURCE_SHA ?? null,
    limits: PAGES_FREE, countPolicy: 'All regular files including config/metadata; no deduplication across distinct paths',
    separate, existingSeparateLayoutFitsBudget: Object.values(separate).every(site => site.fitsFileAndAssetBudget),
    hubWithCandidates: pathUnion([hubFiles, previewFiles]),
    singleOriginReferenceOnly: pathUnion([mainFiles, hubFiles, previewFiles]),
    measurementOnly: true, deploymentApproved: false, deploymentsPerformed: 0 };
}

export function markdown(report) {
  const rows = Object.entries(report.separate).map(([name, value]) => `| ${name} | ${value.files} | ${value.bytes} | ${value.fitsFileAndAssetBudget ? 'within measured file/asset budget' : 'OVER BUDGET'} |`);
  rows.push(`| hub + candidates (path count lower bound) | ${report.hubWithCandidates.files} | — | ${report.hubWithCandidates.fitsFileAndAssetBudget ? 'count/asset check only; conflicts unresolved' : 'OVER BUDGET'} |`);
  return ['## Capacity measurement only — no deployment approval', '',
    '| Output | Files | Uncompressed bytes | Result |', '|---|---:|---:|---|', ...rows, '',
    `${report.hubWithCandidates.conflictingPaths} conflicting paths require explicit composition; existing homes and metadata must be preserved.`,
    'These checks do not certify translation, functionality, responsive design or transfer budgets.', ''].join('\n');
}

async function cli() {
  const values = {};
  for (let i = 2; i < process.argv.length; i += 2) {
    const name = process.argv[i];
    if (!['--main', '--hub', '--preview', '--output'].includes(name) || !process.argv[i + 1] || values[name.slice(2)]) throw Error('Expected --main --hub --preview --output');
    values[name.slice(2)] = resolve(process.argv[i + 1]);
  }
  if (Object.keys(values).length !== 4) throw Error('All three builds and a separate output file are required');
  const roots = await Promise.all([values.main, values.hub, values.preview].map(realDirectory));
  values.output = await separateOutput(values.output, roots);
  const summary = process.env.GITHUB_STEP_SUMMARY ? await separateOutput(resolve(process.env.GITHUB_STEP_SUMMARY), roots) : null;
  if (summary === values.output) throw Error('Summary and JSON report must have separate paths');
  const report = await measure(values);
  await writeFile(values.output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log('UVCAPACITY_REPORT ' + JSON.stringify(report));
  if (summary) await appendFile(summary, markdown(report));
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await cli();
