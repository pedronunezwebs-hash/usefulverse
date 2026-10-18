import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { localeEntries } from '../src/locales.mjs';
import { marketTools } from '../src/markets-no-ch/catalog.mjs';

const source = resolve(process.env.MARKETS_NO_CH_DIST ?? '/private/tmp/usefulverse-market-candidate-20261018-a');
const target = resolve(process.env.GROWTH600_DIST ?? '/private/tmp/usefulverse-growth600-merged-20261018-a');
const origin = 'https://tools.usefulverse.com';
if (!(await stat(source).then(() => true, () => false))) throw new Error(`Market-tools candidate does not exist: ${source}`);
if (!(await stat(target).then(() => true, () => false))) throw new Error(`Growth600 output does not exist: ${target}`);
if (source === target || source.startsWith(`${target}/`) || target.startsWith(`${source}/`)) throw new Error('Source and target build directories must be separate.');

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, out); else out.push(path);
  }
  return out;
}
const marketPages = await Promise.all(marketTools.map(async ({ id }) => {
  const file = join(source, 'tools', id, 'index.html');
  const html = await readFile(file, 'utf8');
  const name = html.match(/<h1>([\s\S]*?)<\/h1>/u)?.[1];
  const description = html.match(/<meta name="description" content="([\s\S]*?)">/u)?.[1];
  if (!name || !description) throw new Error(`English market-tool page is missing directory metadata: ${id}`);
  return { id, name, description };
}));

// The Growth600 bundle can already contain the same market pages because both
// builds share the main catalogue. Permit only byte-identical duplicates; an
// actual content conflict still fails closed.
const candidateFiles = await walk(source);
const mergeFiles = candidateFiles.filter((file) => !['favicon.svg', 'market-pilot-sitemap-fragment.xml'].includes(relative(source, file)));
const marketRouteFiles = mergeFiles.filter((file) => /(?:^|\/)tools\/[^/]+\/index\.html$/u.test(relative(source, file)));
if (marketRouteFiles.length !== marketTools.length * 37) throw new Error(`Expected ${marketTools.length * 37} localized market routes, found ${marketRouteFiles.length}.`);
let verifiedExistingFiles = 0;
let addedFiles = 0;
for (const file of mergeFiles) {
  const rel = relative(source, file);
  if (!rel.startsWith('assets/') && !/(?:^|\/)tools\//u.test(rel)) throw new Error(`Unexpected non-route market candidate output: ${rel}`);
  const destination = join(target, rel);
  if (await stat(destination).then(() => true, () => false)) {
    const [candidateBytes, existingBytes] = await Promise.all([readFile(file), readFile(destination)]);
    if (!candidateBytes.equals(existingBytes)) throw new Error(`Market route conflicts with different hub content; refusing to overwrite: ${rel}`);
    verifiedExistingFiles += 1;
  }
}
for (const file of mergeFiles) {
  const rel = relative(source, file);
  const destination = join(target, rel);
  if (await stat(destination).then(() => true, () => false)) continue;
  await mkdir(dirname(destination), { recursive: true });
  await cp(file, destination, { errorOnExist: true, force: false });
  addedFiles += 1;
}

const fragment = await readFile(join(source, 'market-pilot-sitemap-fragment.xml'), 'utf8');
const sitemapPath = join(target, 'sitemap.xml');
const currentSitemap = await readFile(sitemapPath, 'utf8');
const currentUrls = new Set([...currentSitemap.matchAll(/<loc>(.*?)<\/loc>/gu)].map((match) => match[1]));
const addedUrls = [...fragment.matchAll(/<url>([\s\S]*?)<\/url>/gu)].map((match) => match[1]).filter((item) => {
  const url = item.match(/<loc>(.*?)<\/loc>/u)?.[1];
  if (!url) throw new Error(`Market sitemap URL is invalid: ${item}`);
  if (currentUrls.has(url)) return false;
  currentUrls.add(url); return true;
});
const norwegianHomeUrl = new URL('/nb/', origin).href;
if (!currentUrls.has(norwegianHomeUrl)) {
  currentUrls.add(norwegianHomeUrl);
  addedUrls.push(`<loc>${norwegianHomeUrl}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>`);
}
if (addedUrls.length) await writeFile(sitemapPath, currentSitemap.replace('</urlset>', `${addedUrls.map((entry) => `  <url>${entry}</url>`).join('\n')}\n</urlset>`));

// Add the localized routes to the existing directory and language-specific
// LLM index pages so they are findable without replacing any existing tools.
const homePaths = [{ key: 'en', prefix: '' }, ...localeEntries.filter(({ key }) => key !== 'en').map(({ key, prefix }) => ({ key, prefix: prefix.replace(/^\//u, '') }))];
let norwegianDirectoryLinks = '';
let norwegianLlmsLines = [];
for (const locale of [...homePaths, { key: 'nb', prefix: 'nb' }]) {
  const cards = [];
  const llmLines = [];
  for (const { id } of marketTools) {
    const pagePath = join(source, locale.prefix, 'tools', id, 'index.html');
    const html = await readFile(pagePath, 'utf8');
    const name = html.match(/<h1>([\s\S]*?)<\/h1>/u)?.[1];
    const description = html.match(/<meta name="description" content="([\s\S]*?)">/u)?.[1];
    if (!name || !description) throw new Error(`${locale.key}: missing localized name or description for ${id}`);
    const path = `${locale.prefix ? `/${locale.prefix}` : ''}/tools/${id}/`;
    cards.push(`<li><a href="${path}"><h2>${name}</h2><p>${description}</p></a></li>`);
    llmLines.push(`- [${name}](${new URL(path, origin)}): ${description}`);
  }
  if (locale.key !== 'nb') {
    const homePath = join(target, locale.prefix, 'index.html');
    let home = await readFile(homePath, 'utf8');
    if (!home.includes('class="tool-directory"')) throw new Error(`The ${locale.key} homepage has no tool directory to extend.`);
    const missingCards = cards.filter((card) => {
      const href = card.match(/href="([^"]+)"/u)?.[1];
      return href && !home.includes(`href="${href}"`);
    });
    if (missingCards.length) {
      home = home.replace(/(<ul class="tool-directory">[\s\S]*?)(<\/ul>)/u, `$1${missingCards.join('')}$2`);
      await writeFile(homePath, home);
    }
  } else {
    norwegianDirectoryLinks = cards.join('');
    norwegianLlmsLines = llmLines;
    const existingHome = join(target, 'nb', 'index.html');
    const samplePage = await readFile(join(source, 'nb', 'tools', marketTools[0].id, 'index.html'), 'utf8');
    const copyJson = samplePage.match(/<script type="application\/json" data-tool-copy>([\s\S]*?)<\/script>/u)?.[1];
    if (!copyJson) throw new Error('Norwegian tool page is missing its localized page labels.');
    const copy = JSON.parse(copyJson);
    const growthStylesheet = (await readFile(join(target, 'index.html'), 'utf8')).match(/href="(\/assets\/growth600\.[^"]+\.css)"/u)?.[1];
    if (!growthStylesheet) throw new Error('Growth600 stylesheet is missing from the Norwegian directory page.');
    const title = 'UsefulVerse – Gratis verktøy på norsk';
    const description = 'Finn 100 gratis kalkulatorer, spill og nettverktøy på norsk. Ingen konto nødvendig; verktøyene kjører i nettleseren din.';
    const header = samplePage.match(/<header class="top">[\s\S]*?<\/header>/u)?.[0]?.replace('<a class="brand" href="/">', '<a class="brand" href="/nb/">');
    if (!header) throw new Error('Norwegian market-tool page is missing its localized header.');
    const homeHtml = `<!doctype html><html lang="nb-NO" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${description}"><meta name="robots" content="index,follow"><link rel="canonical" href="${norwegianHomeUrl}"><link rel="alternate" hreflang="nb-NO" href="${norwegianHomeUrl}"><link rel="alternate" hreflang="x-default" href="${origin}/"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="${growthStylesheet}"><link rel="stylesheet" href="/assets/market-tools/markets-no-ch.css"><title>${title}</title></head><body>${header}<main class="page-shell"><section class="tool-intro"><p class="eyebrow">${copy.freeBadge}</p><h1>Gratis verktøy på norsk</h1><p>${description}</p></section><ul class="tool-directory">${norwegianDirectoryLinks}</ul></main><footer><a href="/nb/">${copy.home}</a> · ${copy.siteName}</footer></body></html>`;
    if (await stat(existingHome).then(() => true, () => false)) {
      const existingNorwegianHome = await readFile(existingHome, 'utf8');
      const missingNorwegianLinks = marketTools.filter(({ id }) => !existingNorwegianHome.includes(`href="/nb/tools/${id}/"`));
      if (missingNorwegianLinks.length) throw new Error(`Norwegian homepage exists but is missing ${missingNorwegianLinks.length} market-tool links.`);
    } else {
      await mkdir(dirname(existingHome), { recursive: true });
      await writeFile(existingHome, homeHtml);
    }
  }
  const llmsPath = join(target, locale.prefix, 'llms.txt');
  const hasLlms = await stat(llmsPath).then(() => true, () => false);
  const existing = hasLlms ? await readFile(llmsPath, 'utf8') : `# UsefulVerse – gratis verktøy på norsk\n\nFinn 100 gratis kalkulatorer, spill og nettverktøy på norsk.\n\n- [Sitemap](${new URL('/sitemap.xml', origin)})\n`;
  const lines = locale.key === 'nb' ? norwegianLlmsLines : llmLines;
  const missingLlmsLines = lines.filter((line) => !existing.includes(line));
  if (missingLlmsLines.length) {
    const updated = existing.replace(/\n- \[Sitemap\]/u, `\n\n${missingLlmsLines.join('\n')}\n\n- [Sitemap]`);
    if (updated === existing) throw new Error(`Could not add market tools to ${locale.key} llms.txt.`);
    await writeFile(llmsPath, updated);
  }
  const home = await readFile(join(target, locale.prefix, 'index.html'), 'utf8');
  const visibleMarketLinks = marketTools.filter(({ id }) => home.includes(`href="/${locale.prefix ? `${locale.prefix}/` : ''}tools/${id}/"`));
  if (visibleMarketLinks.length !== marketTools.length) throw new Error(`${locale.key}: expected ${marketTools.length} market-tool links in the homepage directory, found ${visibleMarketLinks.length}.`);
}
const mergedFiles = await walk(target);
if (mergedFiles.length > 18_500) throw new Error(`Merged output exceeds the 18,500-file release safety limit: ${mergedFiles.length}.`);
const oversized = await Promise.all(mergedFiles.map(async (file) => ({ file: relative(target, file), bytes: (await stat(file)).size }))).then((files) => files.filter(({ bytes }) => bytes > 25 * 1024 * 1024));
if (oversized.length) throw new Error(`Merged output contains assets above Cloudflare Pages' 25 MiB file limit: ${oversized.map(({ file, bytes }) => `${file} (${Math.ceil(bytes / 1024 / 1024)} MiB)`).join(', ')}.`);

console.log(`Merged ${marketTools.length} tools (${addedUrls.length} new sitemap URLs plus the Norwegian directory) into ${target}; verified ${verifiedExistingFiles} identical files, added ${addedFiles} files, and checked ${mergedFiles.length} total files.`);
