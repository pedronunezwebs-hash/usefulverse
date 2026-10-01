import { access, readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools } from '../src/catalog.mjs';
import { seo } from '../src/seo.mjs';
import { localePath, locales, localizedTool, packs } from '../src/locales.mjs';
import { longtailBodies, longtailFaqs } from '../src/locales/longtail.mjs';
import { relatedToolIds } from '../src/template.mjs';
import { guideCanonical, guidePath, guides } from '../src/guides.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = process.env.USEFULVERSE_DIST ? resolve(process.env.USEFULVERSE_DIST) : join(root, 'dist');
const languages = Object.keys(locales);
const localizedFiles = languages.filter((language) => language !== 'en').flatMap((language) => [
  `assets/locale-${language}.js`,
  `${localePath(language).replace(/^\//u, '').replace(/\/$/u, '')}/llms.txt`,
]);
const required = ['index.html', '404.html', 'assets/styles.css', 'assets/app.js', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'llms.txt', ...localizedFiles, 'BingSiteAuth.xml', 'yandex_f441658073fe7135.html', 'naverbbd67ca2bfab12f8138c42ad5d27c664.html', '4fe0d351af80cfb3bc08a274c1875a4dc73650fd479d11fe4a414e82b5f41e98.txt'];
const notFound = await readFile(join(dist, '404.html'), 'utf8');
if (!notFound.includes('<meta name="robots" content="noindex,follow">') || /<link rel="canonical"/u.test(notFound)) throw new Error('404 page must be noindex and must not claim a canonical URL');
for (const language of languages) if (!notFound.includes(`href="${localePath(language)}"`)) throw new Error(`404 page is missing its ${language} home link`);
for (const file of required) await access(join(dist, file));
const naverVerification = await readFile(join(dist, 'naverbbd67ca2bfab12f8138c42ad5d27c664.html'), 'utf8');
if (naverVerification !== 'naver-site-verification: naverbbd67ca2bfab12f8138c42ad5d27c664.html\n') throw new Error('Naver verification file content does not match the downloaded file');
const pages = [];
const titlesByLanguage = new Map(languages.map((language) => [language, new Set()]));
for (const language of languages) {
  const homePath = join(dist, localePath(language).replace(/^\//u, ''), 'index.html');
  pages.push({ path: homePath, language, tool: null });
  const home = await readFile(homePath, 'utf8');
  const direction = packs[language]?.meta.direction ?? 'ltr';
  if (!home.includes(`<html lang="${locales[language].code}" dir="${direction}" data-asset-version="`) || !home.includes('id="tool-grid"')) throw new Error(`Incomplete ${language} home page or wrong text direction`);
  if (!home.includes(`aria-label="${locales[language].code.toUpperCase()} — ${locales[language].name}"`)) throw new Error(`Language selector accessible name does not include the visible code for ${language}`);
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
    if (!html.includes(`<html lang="${locales[language].code}" dir="${direction}" data-asset-version="`)) throw new Error(`Wrong html lang or text direction for ${language}/${tool.id}`);
    if (!html.includes(`aria-label="${locales[language].code.toUpperCase()} — ${locales[language].name}"`)) throw new Error(`Language selector accessible name does not include the visible code for ${language}/${tool.id}`);
    if (!html.includes(`rel="canonical" href="${canonical}"`)) throw new Error(`Missing canonical for ${language}/${tool.id}`);
    for (const alternate of languages) if (!html.includes(`hreflang="${locales[alternate].code}" href="https://usefulverse.com${localePath(alternate, tool.id)}"`)) throw new Error(`Missing ${alternate} alternate for ${language}/${tool.id}`);
    if (!html.includes(`data-tool="${tool.id}"`)) throw new Error(`Missing tool runtime for ${language}/${tool.id}`);
    const relatedHeading = packs[language]?.ui['More useful tools'] ?? { en: 'More useful tools', es: 'Más herramientas útiles', fr: 'Plus d’outils utiles', pt: 'Mais ferramentas úteis', de: 'Weitere nützliche Tools' }[language];
    if (!html.includes(relatedHeading)) throw new Error(`Missing localized related-tools heading for ${language}/${tool.id}`);
    if (!html.includes('"@type":"WebApplication"') || !html.includes('property="og:title"')) throw new Error(`Missing SEO schema or social metadata for ${language}/${tool.id}`);
    if (!html.includes('"@type":"FAQPage"') || !html.includes('class="tool-faq"')) throw new Error(`Missing FAQ content for ${language}/${tool.id}`);
    if (language === 'en' && seo[tool.id]?.faq?.length && !html.includes(seo[tool.id].faq[0].question)) throw new Error(`English FAQ mismatch for ${tool.id}`);
    const expectedBody = longtailBodies[tool.id]?.[language];
    if (expectedBody && !html.includes(expectedBody.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'))) throw new Error(`Missing localized long-tail explanation for ${language}/${tool.id}`);
    const expectedFaq = longtailFaqs[tool.id]?.[language];
    if (expectedFaq) for (const { question, answer } of expectedFaq) {
      if (!html.includes(question) || !html.includes(answer)) throw new Error(`Missing localized long-tail FAQ for ${language}/${tool.id}: ${question}`);
    }
    const expectedRelated = relatedToolIds[tool.id];
    if (expectedRelated) for (const relatedId of expectedRelated) {
      if (!html.includes(`href="${localePath(language, relatedId)}"`)) throw new Error(`Missing contextual ${relatedId} link on ${language}/${tool.id}`);
    }
  }
}
const guidesIndexPath = join(dist, guidePath().replace(/^\//u, ''), 'index.html');
pages.push({ path: guidesIndexPath, language: 'en', tool: null, guide: null });
const guidesIndex = await readFile(guidesIndexPath, 'utf8');
if (!guidesIndex.includes(`<link rel="canonical" href="${guideCanonical()}">`) || !guidesIndex.includes('"@type":"CollectionPage"')) throw new Error('Guides index is missing its canonical or collection schema');
if (!guidesIndex.includes('href="/guides/how-to-calculate-a-weighted-grade/"')) throw new Error('Guides index is missing its weighted-grade guide');
for (const guide of guides) {
  const route = guidePath(guide.slug);
  const path = join(dist, route.replace(/^\//u, ''), 'index.html');
  await access(path);
  const html = await readFile(path, 'utf8');
  pages.push({ path, language: 'en', tool: null, guide });
  if (!html.includes(`<link rel="canonical" href="${guideCanonical(guide.slug)}">`)) throw new Error(`Missing canonical for guide ${guide.slug}`);
  if (/<link rel="alternate" hreflang=/u.test(html)) throw new Error(`Untranslated guide ${guide.slug} must not claim language alternates`);
  if (!html.includes('<html lang="en" dir="ltr" data-asset-version="') || !html.includes('"@type":"Article"')) throw new Error(`Guide ${guide.slug} is missing its language or article schema`);
  if (!html.includes(`href="${localePath('en', guide.toolId)}"`)) throw new Error(`Guide ${guide.slug} is missing its related tool CTA`);
  if (!html.includes('Sources and further reading') || !guide.sources?.every(({ url }) => html.includes(`href="${url}"`))) throw new Error(`Guide ${guide.slug} is missing its source links`);
}
const home = await readFile(join(dist, 'index.html'), 'utf8');
if (!home.includes('href="/guides/">Guides</a>')) throw new Error('English home page is missing the guides navigation link');
const assetVersion = home.match(/\/assets\/app\.js\?v=([a-f0-9]{12})/u)?.[1];
if (!assetVersion || !home.includes(`/assets/styles.css?v=${assetVersion}`)) throw new Error('Hashed asset URLs are missing');
for (const toolId of ['pdf-page-editor', 'pdf-ocr', 'pdf-document-converter', 'pdf-to-markdown', 'pdf-form-filler', 'pdf-compare', 'zip-archive-tool', 'media-converter', 'scientific-calculator', 'loan-calculator', 'compound-interest-calculator', 'invoice-generator', 'resume-builder', 'portrait-background-remover']) {
  const page = await readFile(join(dist, localePath('en', toolId).replace(/^\//u, ''), 'index.html'), 'utf8');
  if (!page.includes(`data-tool="${toolId}"`) || !page.includes(`v=${assetVersion}`)) throw new Error(`Suite tool ${toolId} is missing its versioned runtime or page markup`);
}
for (const asset of ['assets/tool-suite-tools.js', 'assets/tool-suite-ocr.js', 'assets/portrait-background-worker.js', 'assets/vendor/tesseract-7.0.0/worker.min.js', 'assets/vendor/tesseract-7.0.0/tesseract-core-lstm.wasm', 'assets/vendor/tesseract-7.0.0/tesseract-core-simd-lstm.wasm', 'assets/vendor/tesseract-7.0.0/tesseract-core-relaxedsimd-lstm.wasm.js', 'assets/vendor/tesseract-7.0.0/tesseract-core-relaxedsimd-lstm.wasm', 'assets/ocr-languages-4.0.0/eng.traineddata.gz', 'assets/models-fa2fa546052fba4c08921230a26cc69a333fca12/Xenova/modnet/onnx/model_quantized.onnx']) await access(join(dist, asset));
for (const file of await readdir(dist, { recursive: true })) {
  const path = join(dist, file);
  if ((await stat(path)).isFile() && (await stat(path)).size > 25 * 1024 * 1024) throw new Error(`Cloudflare Pages asset exceeds 25 MiB: ${file}`);
}
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const sitemapCount = [...sitemap.matchAll(/<loc>https:\/\/usefulverse\.com\//gu)].length;
if (sitemapCount !== pages.length) throw new Error(`Sitemap expected ${pages.length} URLs, found ${sitemapCount}`);
if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"') || !sitemap.includes('hreflang="x-default"')) throw new Error('Sitemap is missing localized alternate links');
for (const language of languages) {
  const paths = [localePath(language), ...tools.map((tool) => localePath(language, tool.id)), ...(language === 'en' ? [guidePath(), ...guides.map((guide) => guidePath(guide.slug))] : [])];
  const count = paths.filter((path) => sitemap.includes(`<loc>https://usefulverse.com${path}</loc>`)).length;
  const expected = tools.length + 1 + (language === 'en' ? guides.length + 1 : 0);
  if (count !== expected) throw new Error(`Sitemap has ${count} URLs for ${language}; expected ${expected}`);
}
for (const route of [guidePath(), ...guides.map((guide) => guidePath(guide.slug))]) if (!sitemap.includes(`<loc>https://usefulverse.com${route}</loc>`)) throw new Error(`Sitemap is missing guide ${route}`);
for (const guide of guides) {
  const toolPage = await readFile(join(dist, localePath('en', guide.toolId).replace(/^\//u, ''), 'index.html'), 'utf8');
  if (!toolPage.includes(`href="${guidePath(guide.slug)}"`)) throw new Error(`Related English tool page is missing guide ${guide.slug}`);
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
const universalStrings = new Set(['usefulverse', 'UsefulVerse', 'useful', 'verse', 'JSON Web Token', 'Base64', 'JSON', 'CSV', 'UUID', 'SHA-256', 'UTC', 'HEX', 'RGB', 'HSL', 'JPG', 'JPEG', 'PNG', 'WebP', 'PDF', 'M4A (AAC)', 'OGG (Opus)', 'Bahasa Indonesia', '<note><to>Alex</to></note>', '256 px', '384 px', '512 px',
  'English', 'Español', 'Français', 'Português', 'Deutsch', '日本語', '한국어', 'Indonesian', 'हिन्दी', 'العربية', '中文', 'বাংলা', 'Русский', 'اردو', 'Türkçe', 'Tiếng Việt',
  ...Object.values(locales).flatMap(({ name, code }) => [name, code.toUpperCase(), `${code.toUpperCase()} — ${name}`])]);
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
