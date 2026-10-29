import { copyFile, link, mkdir, realpath, rm } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { inventory } from './release-capacity.mjs';

// Only generated, immutable assets/tool pages may share inodes. Homes, llms,
// headers and sitemaps get independent copies because mergers update them.
export const immutableBuildPath = path => path.startsWith('assets/') || /(?:^|\/)tools\/[^/]+\/index\.html$/u.test(path);
export async function linkImmutableBuildFile(source, target) { await link(source, target); }
export async function stageBuildTree(source, target) {
  const files = await inventory(source); source = await realpath(source);
  target = join(await realpath(dirname(resolve(target))), basename(target));
  const rel = relative(source, target);
  if (!rel || !isAbsolute(rel) && rel !== '..' && !rel.startsWith('../')) throw Error('Staging overlaps source');
  await mkdir(target); let complete = false;
  try {
    for (const path of files.keys()) {
      const destination = join(target, path); await mkdir(dirname(destination), { recursive: true });
      if (immutableBuildPath(path)) await linkImmutableBuildFile(join(source, path), destination);
      else await copyFile(join(source, path), destination);
    }
    complete = true;
  } finally { if (!complete) await rm(target, { recursive: true, force: true }); }
}
