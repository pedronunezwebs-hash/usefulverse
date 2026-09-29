import { access, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools } from '../src/catalog.mjs';
import { seo } from '../src/seo.mjs';
import { localePath, locales, localizedTool, packs } from '../src/locales.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = process.env.USEFULVERSE_DIST ? resolve(process.env.USEFULVERSE_DIST) : join(root, 'dist');
const languages = Object.keys(locales);
const localizedFiles = languages.filter((language) => language !== 'en').flatMap((language) => [
  `assets/locale-${language}.js`,
  `${localePath(language).replace(/^\//u, '').replace(/\/$/u, '')}/llms.txt`,
]);
const required = ['index.html', 'assets/styles.css', 'assets/app.js', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'llms.txt', ...localizedFiles, 'BingSiteAuth.xml', 'yandex_f441658073fe7135.html', 'naverbbd67ca2bfab12f8138c42ad5d27c664.html', '4fe0d351af80cfb3bc08a274c1875a4dc73650fd479d11fe4a414e82b5f41e98.txt'];
for (const file of required) await access(join(dist, file));
const naverVerification = await readFile(join(dist, 'naverbbd67ca2bfab12f8138c42ad5d27c664.html'), 'utf8');
if (naverVerification !== 'naver-site-verification: naverbbd67ca2bfab12f8138c42ad5d27c664.html\n') throw new Error('Naver verification file content does not match the downloaded file');
const pages = [];
const titlesByLanguage = new Map(languages.map((language) => [language, new Set()]));
for (const language of languages) {
  const homePath = join(dist, localePath(language).replace(/^\//u, ''), 'index.html');
  pages.push({ path: homePath, language, tool: null });
  const home = await readFile(homePath, 'utf8');
  if (!home.includes(`<html lang="${locales[language].code}">`) || !home.includes('id="tool-grid"')) throw new Error(`Incomplete ${language} home page`);
  if (!home.includes(`rel="canonical" href="https://usefulverse.com${localePath(language)}"`)) throw new Error(`Missing canonical on ${language} home`);
  for (const alternate of languages) if (!home.includes(`hreflang="${locales[alternate].code}" href="https://usefulverse.com${localePath(alternate)}"`)) throw new Error(`Missing ${alternate} alternate on ${language} home`);
  const localizedHomeMarker = packs[language]?.meta.homeMarker ?? { es: 'Herramientas', fr: 'Outils', pt: 'Ferramentas', de: 'Tool-Sammlung' }[language];
  if (localizedHomeMarker && !home.includes(localizedHomeMarker)) throw new Error(`Home copy is not localized for ${language}`);
  for (const tool of tools.map((item) => localizedTool(item, language))) {
    const path = join(dist, localePath(language, tool.id).replace(/^\//u, ''), 'index.html');
    pages.push({ path, language, tool });
    await access(path);
    const html = await readFile(path, 'utf8');
    const canonical = `https://usefulverse.com${localePath(language, tool.id)}`;
    if (!html.includes(`<html lang="${locales[language].code}">`)) throw new Error(`Wrong html lang for ${language}/${tool.id}`);
    if (!html.includes(`rel="canonical" href="${canonical}"`)) throw new Error(`Missing canonical for ${language}/${tool.id}`);
    for (const alternate of languages) if (!html.includes(`hreflang="${locales[alternate].code}" href="https://usefulverse.com${localePath(alternate, tool.id)}"`)) throw new Error(`Missing ${alternate} alternate for ${language}/${tool.id}`);
    if (!html.includes(`data-tool="${tool.id}"`)) throw new Error(`Missing tool runtime for ${language}/${tool.id}`);
    const relatedHeading = packs[language]?.ui['More useful tools'] ?? { en: 'More useful tools', es: 'Más herramientas útiles', fr: 'Plus d’outils utiles', pt: 'Mais ferramentas úteis', de: 'Weitere nützliche Tools' }[language];
    if (!html.includes(relatedHeading)) throw new Error(`Missing localized related-tools heading for ${language}/${tool.id}`);
    if (!html.includes('"@type":"WebApplication"') || !html.includes('property="og:title"')) throw new Error(`Missing SEO schema or social metadata for ${language}/${tool.id}`);
    if (!html.includes('"@type":"FAQPage"') || !html.includes('class="tool-faq"')) throw new Error(`Missing FAQ content for ${language}/${tool.id}`);
    if (language === 'en' && seo[tool.id]?.faq?.length && !html.includes(seo[tool.id].faq[0].question)) throw new Error(`English FAQ mismatch for ${tool.id}`);
  }
}
const home = await readFile(join(dist, 'index.html'), 'utf8');
const assetVersion = home.match(/\/assets\/app\.js\?v=([a-f0-9]{12})/u)?.[1];
if (!assetVersion || !home.includes(`/assets/styles.css?v=${assetVersion}`)) throw new Error('Hashed asset URLs are missing');
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const sitemapCount = [...sitemap.matchAll(/<loc>https:\/\/usefulverse\.com\//gu)].length;
if (sitemapCount !== pages.length) throw new Error(`Sitemap expected ${pages.length} URLs, found ${sitemapCount}`);
if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"') || !sitemap.includes('hreflang="x-default"')) throw new Error('Sitemap is missing localized alternate links');
for (const language of languages) {
  const paths = [localePath(language), ...tools.map((tool) => localePath(language, tool.id))];
  const count = paths.filter((path) => sitemap.includes(`<loc>https://usefulverse.com${path}</loc>`)).length;
  if (count !== tools.length + 1) throw new Error(`Sitemap has ${count} URLs for ${language}; expected ${tools.length + 1}`);
}
for (const { path, language } of pages) {
  const html = await readFile(path, 'utf8');
  const unescape = (value) => value.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&amp;', '&');
  const title = unescape(html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '');
  const description = unescape(html.match(/<meta name="description" content="([^"]+)"/u)?.[1] ?? '');
  if (title.length < 15 || title.length > 65) throw new Error(`Title length is invalid in ${path}: ${title.length}`);
  if (description.length < 25 || description.length > 155) throw new Error(`Description length is invalid in ${path}: ${description.length}`);
  const titles = titlesByLanguage.get(language);
  if (titles.has(title)) throw new Error(`Duplicate title in ${language}: ${title}`);
  titles.add(title);
}

// Language packs are strict: no visible text or aria-label/placeholder/title may still equal an English UI string.
const decodeEntities = (value) => value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#039;', "'");
const visibleStrings = (html) => html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>)/giu).flatMap((part) => {
  if (/^<(?:script|style)\b/iu.test(part)) return [];
  const values = part.startsWith('<') ? [...part.matchAll(/\b(?:aria-label|placeholder|title)="([^"]*)"/gu)].map((match) => match[1]) : [part];
  return values.map((value) => decodeEntities(value).trim()).filter((value) => /\p{L}/u.test(value));
});
const englishStrings = new Set();
for (const { path, language } of pages) if (language === 'en') for (const value of visibleStrings(await readFile(path, 'utf8'))) englishStrings.add(value);
const universalStrings = new Set(['usefulverse', 'UsefulVerse', 'useful', 'verse', 'JSON Web Token', 'Base64', 'JSON', 'CSV', 'UUID', 'SHA-256', 'UTC', 'HEX', 'RGB', 'HSL', '256 px', '384 px', '512 px',
  ...Object.values(locales).flatMap(({ name, code }) => [name, code.toUpperCase()])]);
const isUniversal = (value) => universalStrings.has(value) || [...value.replace(/\s/gu, '')].length <= 3 || !/\p{Ll}{2}/u.test(value) || /^[^\p{L}]*(?:https?:|\\b|\{"|name,age)/u.test(value);
for (const [language, pack] of Object.entries(packs)) {
  const keepEnglish = new Set(pack.meta.keepEnglish ?? []);
  const leftovers = new Map();
  for (const { path } of pages.filter((page) => page.language === language)) {
    for (const value of visibleStrings(await readFile(path, 'utf8'))) if (englishStrings.has(value) && !isUniversal(value) && !keepEnglish.has(value)) leftovers.set(value, path.slice(dist.length));
  }
  if (leftovers.size) throw new Error(`Untranslated English strings in ${language} (${leftovers.size}):\n${[...leftovers].map(([value, path]) => `  ${JSON.stringify(value)} (${path})`).join('\n')}`);
}
console.log(`Build check passed: ${pages.filter(({ tool }) => tool).length} localized tool pages + ${languages.length} home pages; ${sitemapCount} URLs in sitemap.`);
