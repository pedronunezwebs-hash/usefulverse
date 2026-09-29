import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools } from '../src/catalog.mjs';
import { seo } from '../src/seo.mjs';
import { localePath, locales, localizedTool } from '../src/locales.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const required = ['index.html', 'assets/styles.css', 'assets/app.js', 'assets/locale-es.js', 'assets/locale-fr.js', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'llms.txt', 'es/llms.txt', 'fr/llms.txt', 'BingSiteAuth.xml', 'yandex_f441658073fe7135.html', 'naverbbd67ca2bfab12f8138c42ad5d27c664.html', '4fe0d351af80cfb3bc08a274c1875a4dc73650fd479d11fe4a414e82b5f41e98.txt'];
for (const file of required) await access(join(root, 'dist', file));
const naverVerification = await readFile(join(root, 'dist', 'naverbbd67ca2bfab12f8138c42ad5d27c664.html'), 'utf8');
if (naverVerification !== 'naver-site-verification: naverbbd67ca2bfab12f8138c42ad5d27c664.html\n') throw new Error('Naver verification file content does not match the downloaded file');
const languages = Object.keys(locales);
const pages = [];
const titles = [];
for (const language of languages) {
  const homePath = join(root, 'dist', localePath(language).replace(/^\//u, ''), 'index.html');
  pages.push({ path: homePath, language, tool: null });
  const home = await readFile(homePath, 'utf8');
  if (!home.includes(`<html lang="${language}">`) || !home.includes('id="tool-grid"')) throw new Error(`Incomplete ${language} home page`);
  if (!home.includes(`rel="canonical" href="https://usefulverse.com${localePath(language)}"`)) throw new Error(`Missing canonical on ${language} home`);
  for (const alternate of languages) if (!home.includes(`hreflang="${locales[alternate].code}" href="https://usefulverse.com${localePath(alternate)}"`)) throw new Error(`Missing ${alternate} alternate on ${language} home`);
  if (language !== 'en' && !home.includes(language === 'es' ? 'Herramientas' : 'Outils')) throw new Error(`Home copy is not localized for ${language}`);
  for (const tool of tools.map((item) => localizedTool(item, language))) {
    const path = join(root, 'dist', localePath(language, tool.id).replace(/^\//u, ''), 'index.html');
    pages.push({ path, language, tool });
    await access(path);
    const html = await readFile(path, 'utf8');
    const canonical = `https://usefulverse.com${localePath(language, tool.id)}`;
    if (!html.includes(`<html lang="${language}">`)) throw new Error(`Wrong html lang for ${language}/${tool.id}`);
    if (!html.includes(`rel="canonical" href="${canonical}"`)) throw new Error(`Missing canonical for ${language}/${tool.id}`);
    for (const alternate of languages) if (!html.includes(`hreflang="${locales[alternate].code}" href="https://usefulverse.com${localePath(alternate, tool.id)}"`)) throw new Error(`Missing ${alternate} alternate for ${language}/${tool.id}`);
    if (!html.includes(`data-tool="${tool.id}"`)) throw new Error(`Missing tool runtime for ${language}/${tool.id}`);
    const relatedHeading = language === 'en' ? 'More useful tools' : language === 'es' ? 'Más herramientas útiles' : 'Plus d’outils utiles';
    if (!html.includes(relatedHeading)) throw new Error(`Missing localized related-tools heading for ${language}/${tool.id}`);
    if (!html.includes('"@type":"WebApplication"') || !html.includes('property="og:title"')) throw new Error(`Missing SEO schema or social metadata for ${language}/${tool.id}`);
    if (!html.includes('"@type":"FAQPage"') || !html.includes('class="tool-faq"')) throw new Error(`Missing FAQ content for ${language}/${tool.id}`);
    if (language === 'en' && seo[tool.id]?.faq?.length && !html.includes(seo[tool.id].faq[0].question)) throw new Error(`English FAQ mismatch for ${tool.id}`);
  }
}
const home = await readFile(join(root, 'dist', 'index.html'), 'utf8');
const assetVersion = home.match(/\/assets\/app\.js\?v=([a-f0-9]{12})/u)?.[1];
if (!assetVersion || !home.includes(`/assets/styles.css?v=${assetVersion}`)) throw new Error('Hashed asset URLs are missing');
const sitemap = await readFile(join(root, 'dist', 'sitemap.xml'), 'utf8');
const sitemapCount = [...sitemap.matchAll(/<loc>https:\/\/usefulverse\.com\//gu)].length;
if (sitemapCount !== pages.length) throw new Error(`Sitemap expected ${pages.length} URLs, found ${sitemapCount}`);
if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"') || !sitemap.includes('hreflang="x-default"')) throw new Error('Sitemap is missing localized alternate links');
for (const language of languages) {
  const paths = [localePath(language), ...tools.map((tool) => localePath(language, tool.id))];
  const count = paths.filter((path) => sitemap.includes(`<loc>https://usefulverse.com${path}</loc>`)).length;
  if (count !== tools.length + 1) throw new Error(`Sitemap has ${count} URLs for ${language}; expected ${tools.length + 1}`);
}
for (const { path } of pages) {
  const html = await readFile(path, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]+)"/u)?.[1] ?? '';
  if (title.length < 15 || title.length > 65) throw new Error(`Title length is invalid in ${path}: ${title.length}`);
  if (description.length < 25 || description.length > 155) throw new Error(`Description length is invalid in ${path}: ${description.length}`);
  if (titles.includes(title)) throw new Error(`Duplicate title: ${title}`);
  titles.push(title);
}
console.log(`Build check passed: ${pages.filter(({ tool }) => tool).length} localized tool pages + ${languages.length} home pages; ${sitemapCount} URLs in sitemap.`);
