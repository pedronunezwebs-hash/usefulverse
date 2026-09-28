import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools } from '../src/catalog.mjs';
import { seo } from '../src/seo.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const required = ['index.html', 'assets/styles.css', 'assets/app.js', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'llms.txt', 'BingSiteAuth.xml', 'yandex_f441658073fe7135.html', '4fe0d351af80cfb3bc08a274c1875a4dc73650fd479d11fe4a414e82b5f41e98.txt'];
for (const file of required) await access(join(root, 'dist', file));
const pages = [join(root, 'dist', 'index.html')];
for (const tool of tools) {
  const path = join(root, 'dist', 'tools', tool.id, 'index.html');
  pages.push(path);
  await access(path);
  const html = await readFile(path, 'utf8');
  const escapedTitle = (seo[tool.id]?.title ?? tool.title).replaceAll('&', '&amp;');
  if (!html.includes(`<title>${escapedTitle} | UsefulVerse</title>`)) throw new Error(`Missing title for ${tool.id}`);
  if (!html.includes(`data-tool="${tool.id}"`)) throw new Error(`Missing tool runtime for ${tool.id}`);
  if (!html.includes('More useful tools')) throw new Error(`Missing related tools for ${tool.id}`);
  if (!html.includes('"@type":"WebApplication"')) throw new Error(`Missing application schema for ${tool.id}`);
  if (!html.includes('property="og:title"')) throw new Error(`Missing social metadata for ${tool.id}`);
  if (html.includes(`href="/#${tool.category.toLowerCase()}"`)) throw new Error(`Broken category anchor for ${tool.id}`);
  if (seo[tool.id]?.faq?.length && (!html.includes('"@type":"FAQPage"') || !html.includes('class="tool-faq"'))) throw new Error(`Missing FAQ content for ${tool.id}`);
}
const home = await readFile(join(root, 'dist', 'index.html'), 'utf8');
if (!home.includes('UsefulVerse') || !home.includes('tool-grid')) throw new Error('Home page is incomplete');
const assetVersion = home.match(/\/assets\/app\.js\?v=([a-f0-9]{12})/u)?.[1];
if (!assetVersion || !home.includes(`/assets/styles.css?v=${assetVersion}`)) throw new Error('Hashed asset URLs are missing');
const titles = [];
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]+)"/u)?.[1] ?? '';
  if (title.length < 15 || title.length > 65) throw new Error(`Title length is invalid in ${page}: ${title.length}`);
  if (description.length < 25 || description.length > 155) throw new Error(`Description length is invalid in ${page}: ${description.length}`);
  if (titles.includes(title)) throw new Error(`Duplicate title: ${title}`);
  titles.push(title);
}
console.log(`Build check passed: ${tools.length} tool pages + home.`);
