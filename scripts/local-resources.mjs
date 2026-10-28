import { lstat, readdir, realpath, statfs } from 'node:fs/promises';
import { join } from 'node:path';

export async function footprint(root) {
  let bytes = 0; const seen = new Set();
  async function visit(path) {
    const info = await lstat(path);
    if (info.isSymbolicLink()) return;
    if (info.isDirectory()) for (const name of await readdir(path)) await visit(join(path, name));
    else if (info.isFile() && !seen.has(`${info.dev}:${info.ino}`)) { seen.add(`${info.dev}:${info.ino}`); bytes += info.size; }
  }
  await visit(root); return bytes;
}
export async function checkResources(root, reserveBytes, { maxWorkingBytes = 2_000_000_000, minFreeBytes = 10_000_000_000 } = {}) {
  root = await realpath(root);
  const footprintBeforeBytes = await footprint(root), disk = await statfs(root);
  const freeBytes = disk.bavail * disk.bsize, projectedWorkingBytes = footprintBeforeBytes + reserveBytes;
  if (!Number.isSafeInteger(reserveBytes) || reserveBytes < 0 || projectedWorkingBytes > maxWorkingBytes || freeBytes - reserveBytes < minFreeBytes) throw Error('Working-space/free-disk budget exceeded');
  return { footprintBeforeBytes, projectedWorkingBytes, maxWorkingBytes, freeBytes, minFreeBytes };
}
