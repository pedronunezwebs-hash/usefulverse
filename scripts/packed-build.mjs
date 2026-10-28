// Local, seekable, per-file compression. Source builds and packed inputs remain
// unchanged. This is a build cache format, never an upload/deployment format.
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { lstat, open, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { deflateRawSync, inflateRawSync } from 'node:zlib';
import { inventory } from './release-capacity.mjs';
import { checkResources } from './local-resources.mjs';
const MAGIC = Buffer.from('UVPACK1\n');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const inside = (root, path) => { const p = relative(root, path); return !p || !isAbsolute(p) && p !== '..' && !p.startsWith('../'); };
const safePath = path => typeof path === 'string' && path.length < 1024 && !path.startsWith('/') && !path.includes('\\') && !path.includes('\0') && path.split('/').every(p => p && p !== '.' && p !== '..');
async function digestFile(path) { const h = createHash('sha256'); for await (const data of createReadStream(path)) h.update(data); return h.digest('hex'); }

export async function packBuild({ input, output, workingRoot = dirname(output), limits }) {
  if ((await lstat(input)).isSymbolicLink()) throw Error('Packed source must not be a symlink');
  input = await realpath(input); output = join(await realpath(dirname(resolve(output))), basename(output));
  const work = await realpath(workingRoot);
  if (!inside(work, input) || !inside(work, output) || inside(input, output)) throw Error('Packed output/inputs must be separate inside the working tree');
  for (const path of [output, output + '.json']) try { await lstat(path); throw Error('Packed output already exists'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const files = await inventory(input), entries = []; let offset = MAGIC.length;
  if (files.size > 80_000 || [...files.values()].reduce((n, f) => n + f.bytes, 0) > 1_500_000_000) throw Error('Packed build budget exceeded');
  async function compressed(path, file) {
    if (!safePath(path) || file.bytes > 25 * 1024 * 1024) throw Error('Unsafe/oversized build asset');
    const bytes = await readFile(join(input, path)); if (sha(bytes) !== file.sha256) throw Error('Build changed while packing');
    return deflateRawSync(bytes, { level: 6 });
  }
  // First pass measures exact compressed bytes before any disk write.
  for (const [path, file] of [...files].sort(([a], [b]) => a < b ? -1 : 1)) {
    const data = await compressed(path, file);
    entries.push({ path, bytes: file.bytes, sha256: file.sha256, offset, compressedBytes: data.length }); offset += data.length;
  }
  const manifest = { format: 'usefulverse-packed-build-v1', files: entries, packedBytes: offset, rawBytes: entries.reduce((n, f) => n + f.bytes, 0), packSha256: '0'.repeat(64) };
  const resources = await checkResources(work, offset + Buffer.byteLength(JSON.stringify(manifest)), limits);
  const handle = await open(output, 'wx'); let complete = false;
  try {
    await handle.writeFile(MAGIC);
    for (const entry of entries) await handle.writeFile(await compressed(entry.path, entry));
    await handle.sync(); await handle.close();
    manifest.packSha256 = await digestFile(output);
    await writeFile(output + '.json', JSON.stringify(manifest), { flag: 'wx' });
    const reader = await openPackedBuild(output);
    try { for (const file of reader.files.values()) await file.read(); } finally { await reader.close(); }
    complete = true;
    return { files: entries.length, rawBytes: manifest.rawBytes, packedBytes: offset, packSha256: manifest.packSha256, resources, sourcePreserved: true, verifiedEveryFile: true };
  } finally {
    await handle.close().catch(() => {});
    if (!complete) { await rm(output, { force: true }); await rm(output + '.json', { force: true }); }
  }
}

export async function openPackedBuild(path) {
  const stat = await lstat(path), meta = await lstat(path + '.json');
  if (!stat.isFile() || stat.isSymbolicLink() || !meta.isFile() || meta.isSymbolicLink() || meta.size > 32 * 1024 * 1024) throw Error('Invalid packed build files');
  const manifest = JSON.parse(await readFile(path + '.json', 'utf8'));
  if (manifest.format !== 'usefulverse-packed-build-v1' || !Array.isArray(manifest.files) || !manifest.files.length || manifest.files.length > 80_000 || !Number.isSafeInteger(manifest.rawBytes) || manifest.rawBytes < 0 || manifest.rawBytes > 1_500_000_000 || stat.size > 1_500_000_000 || manifest.packedBytes !== stat.size || manifest.packSha256 !== await digestFile(path)) throw Error('Packed build integrity mismatch');
  const handle = await open(path, 'r');
  try {
    const header = Buffer.alloc(MAGIC.length); await handle.read(header, 0, header.length, 0);
    if (!header.equals(MAGIC)) throw Error('Invalid packed build header');
    let end = MAGIC.length; const files = new Map();
    for (const f of manifest.files) {
      if (!safePath(f.path) || files.has(f.path) || !Number.isSafeInteger(f.bytes) || f.bytes < 0 || f.bytes > 25 * 1024 * 1024 || !/^[a-f\d]{64}$/u.test(f.sha256)
          || f.offset !== end || !Number.isSafeInteger(f.compressedBytes) || f.compressedBytes < 1 || f.compressedBytes > 26 * 1024 * 1024) throw Error('Invalid packed asset index');
      end += f.compressedBytes;
      if (end > stat.size) throw Error('Packed asset exceeds file bounds');
      files.set(f.path, { bytes: f.bytes, sha256: f.sha256, async read() {
        const data = Buffer.alloc(f.compressedBytes);
        const { bytesRead } = await handle.read(data, 0, data.length, f.offset); if (bytesRead !== data.length) throw Error('Truncated packed asset');
        const bytes = inflateRawSync(data, { maxOutputLength: Math.max(1, f.bytes) });
        if (bytes.length !== f.bytes || sha(bytes) !== f.sha256) throw Error('Packed asset content hash mismatch'); return bytes;
      } });
    }
    if (end !== stat.size || [...files.values()].reduce((n, f) => n + f.bytes, 0) !== manifest.rawBytes) throw Error('Packed asset totals mismatch');
    return { root: await realpath(path), files, close: () => handle.close() };
  } catch (error) { await handle.close(); throw error; }
}

export async function openBuildSource(path) {
  const stat = await lstat(path);
  if (stat.isSymbolicLink()) throw Error('Build input must not be a symlink');
  if (stat.isFile()) return openPackedBuild(path);
  const root = await realpath(path), files = await inventory(root);
  return { root, files: new Map([...files].map(([path, file]) => [path, { ...file, source: join(root, path) }])), async close() {} };
}
