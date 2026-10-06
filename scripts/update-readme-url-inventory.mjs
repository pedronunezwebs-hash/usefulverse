import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = process.env.USEFULVERSE_DIST ? resolve(process.env.USEFULVERSE_DIST) : resolve(root, 'dist');
const readmePath = resolve(root, 'README.md');
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map(([, value]) => value.trim());
if (!urls.length) throw new Error(`No <loc> entries found in ${resolve(dist, 'sitemap.xml')}`);
if (new Set(urls).size !== urls.length) throw new Error('The sitemap contains duplicate URLs');
if (urls.some((value) => new URL(value).hostname !== 'usefulverse.com' || !value.startsWith('https://'))) {
  throw new Error('The sitemap contains a URL outside https://usefulverse.com');
}

const start = '<!-- BEGIN GENERATED SITEMAP URL INVENTORY -->';
const end = '<!-- END GENERATED SITEMAP URL INVENTORY -->';
const readme = await readFile(readmePath, 'utf8');
const startIndex = readme.indexOf(start);
const endIndex = readme.indexOf(end);
if (startIndex < 0 || endIndex < startIndex) throw new Error('README inventory markers are missing or out of order');

const inventory = `\n\nGenerated from \`dist/sitemap.xml\`: **${urls.length.toLocaleString('en-US')} canonical URLs**.\n\n\`\`\`text\n${urls.join('\n')}\n\`\`\``;
const updated = `${readme.slice(0, startIndex + start.length)}${inventory}${readme.slice(endIndex)}`;
await writeFile(readmePath, updated);
console.log(`Updated README.md with ${urls.length} sitemap URLs from ${resolve(dist, 'sitemap.xml')}`);
