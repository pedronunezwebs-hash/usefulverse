import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = process.env.USEFULVERSE_DIST ? resolve(process.env.USEFULVERSE_DIST) : resolve(root, 'dist');
const growthDist = process.env.GROWTH600_DIST ? resolve(process.env.GROWTH600_DIST) : resolve(root, 'dist-growth600');
const readmePath = resolve(root, 'README.md');
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map(([, value]) => value.trim());
if (!urls.length) throw new Error(`No <loc> entries found in ${resolve(dist, 'sitemap.xml')}`);
if (new Set(urls).size !== urls.length) throw new Error('The sitemap contains duplicate URLs');
if (urls.some((value) => new URL(value).hostname !== 'usefulverse.com' || !value.startsWith('https://'))) {
  throw new Error('The sitemap contains a URL outside https://usefulverse.com');
}
const growthSitemap = await readFile(resolve(growthDist, 'sitemap.xml'), 'utf8');
const growthUrls = [...growthSitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map(([, value]) => value.trim());
if (!growthUrls.length) throw new Error(`No <loc> entries found in ${resolve(growthDist, 'sitemap.xml')}`);
if (new Set(growthUrls).size !== growthUrls.length) throw new Error('The Growth600 sitemap contains duplicate URLs');
if (growthUrls.some((value) => new URL(value).hostname !== 'tools.usefulverse.com' || !value.startsWith('https://'))) {
  throw new Error('The Growth600 sitemap contains a URL outside https://tools.usefulverse.com');
}

const start = '<!-- BEGIN GENERATED SITEMAP URL INVENTORY -->';
const end = '<!-- END GENERATED SITEMAP URL INVENTORY -->';
const growthStart = '<!-- BEGIN GENERATED GROWTH600 URL INVENTORY -->';
const growthEnd = '<!-- END GENERATED GROWTH600 URL INVENTORY -->';
const readme = await readFile(readmePath, 'utf8');
const startIndex = readme.indexOf(start);
const endIndex = readme.indexOf(end);
if (startIndex < 0 || endIndex < startIndex) throw new Error('README inventory markers are missing or out of order');
const growthStartIndex = readme.indexOf(growthStart);
const growthEndIndex = readme.indexOf(growthEnd);
if (growthStartIndex < 0 || growthEndIndex < growthStartIndex) throw new Error('README Growth600 inventory markers are missing or out of order');

const inventory = `\n\nGenerated from \`dist/sitemap.xml\`: **${urls.length.toLocaleString('en-US')} canonical URLs**.\n\n\`\`\`text\n${urls.join('\n')}\n\`\`\``;
const growthInventory = `\n\nGenerated from \`dist-growth600/sitemap.xml\`: **${growthUrls.length.toLocaleString('en-US')} canonical URLs**.\n\n\`\`\`text\n${growthUrls.join('\n')}\n\`\`\``;
let updated = `${readme.slice(0, startIndex + start.length)}${inventory}${readme.slice(endIndex)}`;
const updatedGrowthStart = updated.indexOf(growthStart);
const updatedGrowthEnd = updated.indexOf(growthEnd);
updated = `${updated.slice(0, updatedGrowthStart + growthStart.length)}${growthInventory}${updated.slice(updatedGrowthEnd)}`;
await writeFile(readmePath, updated);
console.log(`Updated README.md with ${urls.length} main-site and ${growthUrls.length} Growth600 sitemap URLs.`);
