import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, categories } from '../src/catalog.mjs';
import { renderHome, renderToolPage } from '../src/template.mjs';
import { localePath, locales, localizedTool, runtimeMessages, ui } from '../src/locales.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'assets'), { recursive: true });
await cp(join(root, 'src', 'styles.css'), join(dist, 'assets', 'styles.css'));
await cp(join(root, 'src', 'app.js'), join(dist, 'assets', 'app.js'));
await cp(join(root, 'public', 'favicon.svg'), join(dist, 'favicon.svg'));
await cp(join(root, 'public', '_headers'), join(dist, '_headers'));
await cp(join(root, 'public', 'BingSiteAuth.xml'), join(dist, 'BingSiteAuth.xml'));
await cp(join(root, 'public', 'yandex_f441658073fe7135.html'), join(dist, 'yandex_f441658073fe7135.html'));
await cp(join(root, 'public', 'naverbbd67ca2bfab12f8138c42ad5d27c664.html'), join(dist, 'naverbbd67ca2bfab12f8138c42ad5d27c664.html'));
const indexNowKeyFile = '4fe0d351af80cfb3bc08a274c1875a4dc73650fd479d11fe4a414e82b5f41e98.txt';
await cp(join(root, 'public', indexNowKeyFile), join(dist, indexNowKeyFile));

const assetVersion = createHash('sha256')
  .update(await readFile(join(dist, 'assets', 'styles.css')))
  .update(await readFile(join(dist, 'assets', 'app.js')))
  .update(await readFile(join(root, 'src', 'locales.mjs')))
  .update(await readFile(join(root, 'src', 'locales', 'pt-br.mjs')))
  .update(await readFile(join(root, 'src', 'locales', 'de.mjs')))
  .digest('hex')
  .slice(0, 12);

const languages = Object.keys(locales);
const pages = [];
for (const language of languages) {
  const localizedTools = tools.map((tool) => localizedTool(tool, language));
  const localizedCategories = [ui[language]?.All ?? categories[0], ...new Set(localizedTools.map((tool) => tool.category))];
  const homePath = localePath(language);
  const homeFile = join(dist, homePath.replace(/^\//u, ''), 'index.html');
  await mkdir(join(dist, homePath.replace(/^\//u, '')), { recursive: true });
  await writeFile(homeFile, renderHome(localizedTools, localizedCategories, assetVersion, language));
  pages.push({ language, path: homePath });
  if (language !== 'en') {
    const localeBundle = `window.usefulverseLocale = ${JSON.stringify({ code: locales[language].code, messages: ui[language], runtime: runtimeMessages[language] })};\n`;
    await writeFile(join(dist, 'assets', `locale-${language}.js`), localeBundle);
  }
  for (const tool of localizedTools) {
    const toolPath = localePath(language, tool.id);
    const directory = join(dist, toolPath.replace(/^\//u, ''));
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), renderToolPage(tool, assetVersion, language, localizedTools));
    pages.push({ language, path: toolPath });
  }
}

const localizedRoute = (language, toolId) => `https://usefulverse.com${localePath(language, toolId)}`;
const xhtmlNamespace = ' xmlns:xhtml="http://www.w3.org/1999/xhtml"';
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${xhtmlNamespace}>\n${pages.map(({ language, path }) => {
  const toolId = path.match(/\/tools\/([^/]+)\/$/u)?.[1] ?? '';
  const alternates = languages.map((alternateLanguage) => `    <xhtml:link rel="alternate" hreflang="${locales[alternateLanguage].code}" href="${localizedRoute(alternateLanguage, toolId)}"/>`);
  alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedRoute('en', toolId)}"/>`);
  return `  <url>\n    <loc>${localizedRoute(language, toolId)}</loc>\n${alternates.join('\n')}\n  </url>`;
}).join('\n')}\n</urlset>\n`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://usefulverse.com/sitemap.xml\n`);
await writeFile(join(dist, 'llms.txt'), `# UsefulVerse\n\n> Fast, private browser tools for text, data, SEO and everyday tasks.\n\nUsefulVerse is a static website of small online tools. Browser-first tools process user input locally and do not require an account or upload.\n\n## Tools\n\n${tools.map((tool) => `- [${tool.title}](https://usefulverse.com/tools/${tool.id}/): ${tool.description}`).join('\n')}\n\n## Site\n\n- [Home](https://usefulverse.com/)\n- [Sitemap](https://usefulverse.com/sitemap.xml)\n`);
for (const language of languages.filter((key) => key !== 'en')) {
  const localizedTools = tools.map((tool) => localizedTool(tool, language));
  const homeUrl = `https://usefulverse.com${localePath(language)}`;
  const homeLabel = { es: 'Inicio', fr: 'Accueil', pt: 'Página inicial', de: 'Startseite' }[language] ?? 'Home';
  const localLlms = `# UsefulVerse — ${locales[language].name}\n\n> ${locales[language].homeDescription}\n\n${localizedTools.map((tool) => `- [${tool.title}](https://usefulverse.com${localePath(language, tool.id)}): ${tool.description}`).join('\n')}\n\n- [${homeLabel}](${homeUrl})\n- [Sitemap](https://usefulverse.com/sitemap.xml)\n`;
  const localeDirectory = localePath(language).replace(/^\//u, '').replace(/\/$/u, '');
  await writeFile(join(dist, localeDirectory, 'llms.txt'), localLlms);
}
console.log(`Built ${pages.length} pages (${tools.length} tools × ${languages.length} languages + ${languages.length} home pages) in dist/`);
