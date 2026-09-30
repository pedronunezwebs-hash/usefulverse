import { cp, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as bundle } from 'esbuild';
import { tools, categories } from '../src/catalog.mjs';
import { renderGuidePage, renderGuidesIndex, renderHome, renderNotFoundPage, renderToolPage } from '../src/template.mjs';
import { guidePath, guides } from '../src/guides.mjs';
import { localePath, locales, localizedTool, packs, ui } from '../src/locales.mjs';
import { localeBundleSource } from '../src/locales/bundle.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = process.env.USEFULVERSE_DIST ? resolve(process.env.USEFULVERSE_DIST) : join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'assets'), { recursive: true });
await cp(join(root, 'src', 'styles.css'), join(dist, 'assets', 'styles.css'));
await cp(join(root, 'src', 'app.js'), join(dist, 'assets', 'app.js'));
await cp(join(root, 'src', 'advanced-tools.js'), join(dist, 'assets', 'advanced-tools.js'));
await cp(join(root, 'src', 'advanced-logic.mjs'), join(dist, 'assets', 'advanced-logic.mjs'));
await cp(join(root, 'src', 'expanded-tools.js'), join(dist, 'assets', 'expanded-tools.js'));
await cp(join(root, 'src', 'expanded-logic.mjs'), join(dist, 'assets', 'expanded-logic.mjs'));
await cp(join(root, 'src', 'new-tools.js'), join(dist, 'assets', 'new-tools.js'));
await cp(join(root, 'src', 'new-tool-logic.mjs'), join(dist, 'assets', 'new-tool-logic.mjs'));
const vendor = join(dist, 'assets', 'vendor');
await mkdir(vendor, { recursive: true });
await cp(join(root, 'node_modules', 'pdf-lib', 'dist', 'pdf-lib.min.js'), join(vendor, 'pdf-lib.min.js'));
await bundle({
  entryPoints: [join(root, 'src', 'tiff-decoder.mjs')],
  outfile: join(dist, 'assets', 'tiff-decoder.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'office-package-worker.mjs')],
  outfile: join(vendor, 'office-package-worker.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await cp(join(root, 'node_modules', 'jsqr', 'dist', 'jsQR.js'), join(vendor, 'jsQR.js'));
await cp(join(root, 'node_modules', 'heic2any', 'dist', 'heic2any.min.js'), join(vendor, 'heic2any.min.js'));
await cp(join(root, 'node_modules', 'marked', 'lib', 'marked.umd.js'), join(vendor, 'marked.umd.js'));
await cp(join(root, 'node_modules', 'dompurify', 'dist', 'purify.min.js'), join(vendor, 'purify.min.js'));
await cp(join(root, 'node_modules', 'turndown', 'lib', 'turndown.browser.umd.js'), join(vendor, 'turndown.browser.umd.js'));
await cp(join(root, 'node_modules', 'js-yaml', 'dist', 'js-yaml.mjs'), join(vendor, 'js-yaml.mjs'));
await cp(join(root, 'node_modules', 'jsbarcode', 'dist', 'JsBarcode.all.min.js'), join(vendor, 'JsBarcode.all.min.js'));
await cp(join(root, 'node_modules', '@neslinesli93', 'qpdf-wasm', 'dist', 'qpdf.wasm'), join(vendor, 'qpdf.wasm'));
await bundle({
  entryPoints: [join(root, 'src', 'pdf-compressor-worker.mjs')],
  outfile: join(vendor, 'pdf-compressor-worker.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
  external: ['fs', 'path'],
});
await bundle({
  entryPoints: [join(root, 'src', 'video-compression.mjs')],
  outfile: join(vendor, 'video-compression.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await cp(join(root, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.min.mjs'), join(vendor, 'pdf.min.mjs'));
await cp(join(root, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs'), join(vendor, 'pdf.worker.min.mjs'));
await cp(join(root, 'node_modules', 'pdfjs-dist', 'cmaps'), join(vendor, 'cmaps'), { recursive: true });
await cp(join(root, 'node_modules', 'pdfjs-dist', 'standard_fonts'), join(vendor, 'standard_fonts'), { recursive: true });
await cp(join(root, 'node_modules', 'pdf-lib', 'LICENSE.md'), join(vendor, 'LICENSE-pdf-lib.md'));
await cp(join(root, 'node_modules', 'pdfjs-dist', 'LICENSE'), join(vendor, 'LICENSE-pdfjs-dist'));
await cp(join(root, 'node_modules', 'jsqr', 'LICENSE'), join(vendor, 'LICENSE-jsqr'));
await cp(join(root, 'node_modules', 'heic2any', 'LICENSE.md'), join(vendor, 'LICENSE-heic2any.md'));
await cp(join(root, 'node_modules', 'marked', 'LICENSE'), join(vendor, 'LICENSE-marked'));
await cp(join(root, 'node_modules', 'dompurify', 'LICENSE-MPL'), join(vendor, 'LICENSE-dompurify-MPL'));
await cp(join(root, 'node_modules', 'turndown', 'LICENSE'), join(vendor, 'LICENSE-turndown'));
await cp(join(root, 'node_modules', 'js-yaml', 'LICENSE'), join(vendor, 'LICENSE-js-yaml'));
await cp(join(root, 'node_modules', 'jsbarcode', 'MIT-LICENSE.txt'), join(vendor, 'LICENSE-jsbarcode.txt'));
await cp(join(root, 'node_modules', 'utif', 'LICENSE'), join(vendor, 'LICENSE-utif'));
await cp(join(root, 'node_modules', 'pako', 'LICENSE'), join(vendor, 'LICENSE-pako'));
await cp(join(root, 'node_modules', 'fflate', 'LICENSE'), join(vendor, 'LICENSE-fflate'));
await cp(join(root, 'node_modules', 'mediabunny', 'LICENSE'), join(vendor, 'LICENSE-mediabunny'));
await cp(join(root, 'node_modules', '@neslinesli93', 'qpdf-wasm', 'README.md'), join(vendor, 'NOTICE-qpdf-wasm.md'));
await cp(join(root, 'public', 'licenses', 'LICENSE-qpdf.txt'), join(vendor, 'LICENSE-qpdf.txt'));
await cp(join(root, 'public', 'licenses', 'LICENSE-qpdf-wasm-ISC.txt'), join(vendor, 'LICENSE-qpdf-wasm-ISC.txt'));
await cp(join(root, 'public', 'favicon.svg'), join(dist, 'favicon.svg'));
await cp(join(root, 'public', '_headers'), join(dist, '_headers'));
await cp(join(root, 'public', 'BingSiteAuth.xml'), join(dist, 'BingSiteAuth.xml'));
await cp(join(root, 'public', 'yandex_f441658073fe7135.html'), join(dist, 'yandex_f441658073fe7135.html'));
await cp(join(root, 'public', 'naverbbd67ca2bfab12f8138c42ad5d27c664.html'), join(dist, 'naverbbd67ca2bfab12f8138c42ad5d27c664.html'));
const indexNowKeyFile = '4fe0d351af80cfb3bc08a274c1875a4dc73650fd479d11fe4a414e82b5f41e98.txt';
await cp(join(root, 'public', indexNowKeyFile), join(dist, indexNowKeyFile));

const assetHash = createHash('sha256')
  .update(await readFile(join(dist, 'assets', 'styles.css')))
  .update(await readFile(join(dist, 'assets', 'app.js')))
  .update(await readFile(join(dist, 'assets', 'advanced-tools.js')))
  .update(await readFile(join(dist, 'assets', 'advanced-logic.mjs')))
  .update(await readFile(join(dist, 'assets', 'expanded-tools.js')))
  .update(await readFile(join(dist, 'assets', 'expanded-logic.mjs')))
  .update(await readFile(join(dist, 'assets', 'new-tools.js')))
  .update(await readFile(join(dist, 'assets', 'new-tool-logic.mjs')))
  .update(await readFile(join(root, 'package-lock.json')))
  .update(await readFile(join(root, 'src', 'locales.mjs')));
for (const file of (await readdir(vendor, { recursive: true })).sort()) {
  const path = join(vendor, file);
  if ((await stat(path)).isFile()) assetHash.update(await readFile(path));
}
const localeFiles = (await readdir(join(root, 'src', 'locales'), { recursive: true })).filter((file) => /\.m?js$/u.test(file) && !file.endsWith('.test.mjs')).sort();
for (const file of localeFiles) assetHash.update(await readFile(join(root, 'src', 'locales', file)));
const assetVersion = assetHash
  .digest('hex')
  .slice(0, 12);
await rename(join(vendor, 'cmaps'), join(vendor, `cmaps-${assetVersion}`));
await rename(join(vendor, 'standard_fonts'), join(vendor, `standard_fonts-${assetVersion}`));

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
    await writeFile(join(dist, 'assets', `locale-${language}.js`), await localeBundleSource(language));
  }
  for (const tool of localizedTools) {
    const toolPath = localePath(language, tool.id);
    const directory = join(dist, toolPath.replace(/^\//u, ''));
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), renderToolPage(tool, assetVersion, language, localizedTools));
    pages.push({ language, path: toolPath });
  }
}

await mkdir(join(dist, 'guides'), { recursive: true });
await writeFile(join(dist, 'guides', 'index.html'), renderGuidesIndex(guides, assetVersion));
pages.push({ language: 'en', path: guidePath() });
for (const guide of guides) {
  const route = guidePath(guide.slug);
  const directory = join(dist, route.replace(/^\//u, ''));
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), renderGuidePage(guide, assetVersion));
  pages.push({ language: 'en', path: route });
}

const localizedRoute = (language, toolId) => `https://usefulverse.com${localePath(language, toolId)}`;
const xhtmlNamespace = ' xmlns:xhtml="http://www.w3.org/1999/xhtml"';
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${xhtmlNamespace}>\n${pages.map(({ language, path }) => {
  if (path.startsWith('/guides/')) return `  <url>\n    <loc>https://usefulverse.com${path}</loc>\n  </url>`;
  const toolId = path.match(/\/tools\/([^/]+)\/$/u)?.[1] ?? '';
  const alternates = languages.map((alternateLanguage) => `    <xhtml:link rel="alternate" hreflang="${locales[alternateLanguage].code}" href="${localizedRoute(alternateLanguage, toolId)}"/>`);
  alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedRoute('en', toolId)}"/>`);
  return `  <url>\n    <loc>${localizedRoute(language, toolId)}</loc>\n${alternates.join('\n')}\n  </url>`;
}).join('\n')}\n</urlset>\n`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://usefulverse.com/sitemap.xml\n`);
await writeFile(join(dist, 'llms.txt'), `# UsefulVerse\n\n> Fast, private browser tools for text, data, SEO and everyday tasks.\n\nUsefulVerse is a static website of small online tools. Browser-first tools process user input locally and do not require an account or upload.\n\n## Tools\n\n${tools.map((tool) => `- [${tool.title}](https://usefulverse.com/tools/${tool.id}/): ${tool.description}`).join('\n')}\n\n## Guides\n\n- [UsefulVerse Guides](https://usefulverse.com${guidePath()})\n${guides.map((guide) => `- [${guide.title}](https://usefulverse.com${guidePath(guide.slug)}): ${guide.description}`).join('\n')}\n\n## Site\n\n- [Home](https://usefulverse.com/)\n- [Sitemap](https://usefulverse.com/sitemap.xml)\n`);
await writeFile(join(dist, '404.html'), renderNotFoundPage());
for (const language of languages.filter((key) => key !== 'en')) {
  const localizedTools = tools.map((tool) => localizedTool(tool, language));
  const homeUrl = `https://usefulverse.com${localePath(language)}`;
  const homeLabel = packs[language]?.meta.homeLabel ?? { es: 'Inicio', fr: 'Accueil', pt: 'Página inicial', de: 'Startseite' }[language] ?? 'Home';
  const localLlms = `# UsefulVerse — ${locales[language].name}\n\n> ${locales[language].homeDescription}\n\n${localizedTools.map((tool) => `- [${tool.title}](https://usefulverse.com${localePath(language, tool.id)}): ${tool.description}`).join('\n')}\n\n- [${homeLabel}](${homeUrl})\n- [Sitemap](https://usefulverse.com/sitemap.xml)\n`;
  const localeDirectory = localePath(language).replace(/^\//u, '').replace(/\/$/u, '');
  await writeFile(join(dist, localeDirectory, 'llms.txt'), localLlms);
}
console.log(`Built ${pages.length} pages (${tools.length} tools × ${languages.length} languages + ${languages.length} home pages + ${guides.length + 1} English guide pages) in ${dist}`);
