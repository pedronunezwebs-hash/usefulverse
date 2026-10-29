import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseSitemap, sitemapXML } from './compose-sites-metadata.mjs';

// Dates are recorded when content changes, never when a build happens. Unknown
// legacy modification dates are deliberately omitted (not replaced by today).
export const phaseZeroContentDate = '2026-10-29';

function checkedURL(value, origin) {
  const url = new URL(value);
  if (url.origin !== origin || url.username || url.password || url.search || url.hash || /%|\\|(?:^|\/)\.{1,2}(?:\/|$)/u.test(value) || !/^\/(?:[a-z\d_.-]+\/)*[a-z\d_.-]*$/iu.test(url.pathname)) throw Error(`Unsafe or cross-origin sitemap URL: ${value}`);
  return url;
}
function language(url) {
  const prefix = url.pathname.split('/')[1];
  if (!prefix || ['tools', 'guides'].includes(prefix)) return 'en';
  if (!/^[a-z]{2,3}(?:-[a-z\d]{2,8})*$/u.test(prefix)) throw Error(`Unknown sitemap language: ${url}`);
  return prefix;
}
function checkedRecord(record, origin) {
  checkedURL(record.loc, origin);
  if (record.lastmod && (!/^\d{4}-\d{2}-\d{2}$/u.test(record.lastmod) || new Date(record.lastmod).toISOString().slice(0, 10) !== record.lastmod)) throw Error(`Invalid content modification date: ${record.lastmod}`);
  return record;
}

export async function readSitemapRecords(directory, origin, entry = 'sitemap.xml') {
  origin = new URL(origin).origin;
  const visited = new Set(), seen = new Set(), records = [];
  async function read(path) {
    if (!/^sitemap(?:-[a-z\d-]+)?\.xml$/u.test(path) || visited.has(path)) throw Error('Unsafe, repeated or cyclic sitemap');
    visited.add(path);
    const parsed = parseSitemap(await readFile(join(directory, path), 'utf8'));
    for (const record of parsed.records) {
      const url = checkedURL(record.loc, origin);
      if (parsed.type === 'sitemapindex') { await read(url.pathname.slice(1)); continue; }
      checkedRecord(record, origin);
      if (seen.has(record.loc)) throw Error(`Duplicate sitemap URL: ${record.loc}`);
      seen.add(record.loc); records.push(record);
    }
  }
  await read(entry);
  return records;
}

export async function writeLanguageSitemaps(directory, origin, records) {
  origin = new URL(origin).origin;
  const groups = new Map(), seen = new Set();
  for (const record of records) {
    checkedRecord(record, origin);
    if (seen.has(record.loc)) throw Error(`Duplicate sitemap URL: ${record.loc}`);
    seen.add(record.loc);
    const key = language(new URL(record.loc));
    const group = groups.get(key) ?? []; group.push(record); groups.set(key, group);
  }
  const index = [];
  for (const [key, group] of [...groups].sort()) {
    group.sort((a, b) => a.loc < b.loc ? -1 : a.loc > b.loc ? 1 : 0);
    const name = `sitemap-${key}.xml`;
    await writeFile(join(directory, name), sitemapXML(group));
    // Only claim a modification date for the child when every URL has one.
    const dates = group.map(r => r.lastmod).filter(Boolean).sort();
    index.push({ loc: `${origin}/${name}`, ...(dates.length === group.length ? { lastmod: dates.at(-1) } : {}) });
  }
  // Draft-only previews retain the empty URL set, never a feed of draft routes.
  await writeFile(join(directory, 'sitemap.xml'), sitemapXML(index, index.length > 0));
  return { urls: records.length, languages: groups.size };
}
