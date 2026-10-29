import { createHash } from 'node:crypto';

export const recoveredPrefix = 'assets/recovered-live-only-106/';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

// Address the complete dependency tree, not just its entry points. Relative
// imports/worker URLs keep their directory relationships; an edit to any vendor
// also changes the URL loaded by all 106 controllers. Hash the original bytes
// to avoid a circular hash when a module contains its own absolute asset root.
// The captured sources (and the translator's provenance) are never modified.
export function versionRecoveredAssets(assets) {
  const entries = [...assets].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  for (const [path, bytes] of entries) {
    if (!(path === 'favicon.svg' || path.startsWith(recoveredPrefix)) || path.includes('..') || path.includes('\\') || !Buffer.isBuffer(bytes) || !bytes.length) throw Error(`Invalid captured asset: ${path}`);
    if (/^assets\/recovered-live-only-106\/[a-f0-9]{24}\//u.test(path)) throw Error('Captured input must not already be versioned');
  }
  const version = sha(JSON.stringify(entries.map(([path, bytes]) => [path, sha(bytes)]))).slice(0, 24);
  const rewrite = text => text.replace(/\/assets\/recovered-live-only-106\/(?![a-f0-9]{24}\/)/gu, `/${recoveredPrefix}${version}/`);
  const output = new Map(entries.map(([path, bytes]) => {
    if (!path.startsWith(recoveredPrefix)) return [path, bytes];
    const destination = path.replace(recoveredPrefix, `${recoveredPrefix}${version}/`);
    return [destination, /\.(?:m?js|css)$/u.test(path) ? Buffer.from(rewrite(bytes.toString('utf8'))) : bytes];
  }));
  return { version, assets: output, rewrite };
}
