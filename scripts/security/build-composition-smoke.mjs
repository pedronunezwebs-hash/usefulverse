// Regenerable, local-only composition of three real pages in three locales.
// This does not exercise the full 700 + 300 release or approve deployment.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { minify } from 'csso';
import { tools as mainTools } from '../../src/catalog.mjs';
import { localeEntries, localizedTool } from '../../src/locales.mjs';
import { localeBundleSource } from '../../src/locales/bundle.mjs';
import { renderHome, renderNotFoundPage, renderToolPage } from '../../src/template.mjs';
import { growthPilotTools } from '../../src/growth600/catalog.mjs';
import { buildGrowthStaticSite } from '../../src/growth600/build.mjs';
import { bundleGrowthControllers } from '../../src/growth600/bundle-controllers.mjs';
import markdown from '../../src/growth600/locales/markdown-editor-final.mjs';
import pending from '../../src/growth600/locales/pending-tools-final.mjs';
import { addNorwegianDraftFallback } from '../../src/growth600/draft-locales.mjs';
import { composeSites } from '../compose-sites.mjs';
import { sitemapXML, TARGET } from '../compose-sites-metadata.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = process.argv[2] && resolve(process.argv[2]);
const extended = process.argv[3] === '--extended';
if (process.argv.length > (extended ? 4 : 3)) throw Error('Unknown sample option');
if (!output || !relative(root, output).startsWith('.qa-step-a/')) throw Error('Use a new .qa-step-a/ subdirectory');
await mkdir(output); // fail if it already exists
const text = path => readFile(join(root, path), 'utf8');
const write = async (path, data) => { await mkdir(resolve(path, '..'), { recursive: true }); await writeFile(path, data); };
const locales = localeEntries.filter(l => (extended ? ['en', 'es', 'de', 'ar', 'ja', 'hi'] : ['en', 'es', 'ar']).includes(l.key));
const mainDir = join(output, 'main'), hubDir = join(output, 'hub'), previewDir = join(output, 'preview');
const primary = mainTools.find(t => t.id === 'word-counter');
const records = [];
for (const locale of locales) {
  const tool = localizedTool(primary, locale.key), prefix = locale.prefix.replace(/^\//u, '');
  const folder = join(mainDir, prefix);
  await write(join(folder, 'index.html'), renderHome([tool], ['All', tool.category], 'composition-smoke', locale.key));
  await write(join(folder, 'tools/word-counter/index.html'), renderToolPage(tool, 'composition-smoke', locale.key, [tool]));
  await write(join(folder, 'llms.txt'), `# UsefulVerse\n${TARGET}${locale.prefix}/tools/word-counter/\n`);
  if (locale.key !== 'en') await write(join(mainDir, 'assets', `locale-${locale.key}.js`), await localeBundleSource(locale.key));
  records.push({ loc: `${TARGET}${locale.prefix}/` }, { loc: `${TARGET}${locale.prefix}/tools/word-counter/` });
}
await write(join(mainDir, '404.html'), renderNotFoundPage('composition-smoke'));
for (const [path, data] of Object.entries({ 'sitemap.xml': sitemapXML(records), 'robots.txt': `User-agent: *\nAllow: /\nSitemap: ${TARGET}/sitemap.xml\n`, _headers: await text('public/_headers'), 'assets/styles.css': minify(await text('src/styles.css')).css, 'assets/app.js': await text('src/app.js'), 'favicon.svg': await text('public/favicon.svg') })) await write(join(mainDir, path), data);
for (const role of ['hub', 'preview']) {
  const ids = role === 'hub' ? ['markdown-editor'] : extended ? ['grammar-checker', 'fancy-text-generator'] : ['grammar-checker'];
  const [id] = ids;
  const tools = growthPilotTools.filter(t => ids.includes(t.id)), copyByLocale = {}, extraToolLocales = [];
  for (const locale of locales) {
    const pack = (await import(pathToFileURL(join(root, `src/growth600/locales/${locale.key}.mjs`)))).default;
    copyByLocale[locale.key] = { _home: pack._home, ...Object.fromEntries(ids.map(id => [id, role === 'hub' ? markdown[locale.key] : pending[locale.key][id]])) };
  }
  if (extended && role === 'preview') addNorwegianDraftFallback({ previewOnly: true, tools, copyByLocale, extraToolLocales });
  const version = JSON.parse(await text('package.json')).devDependencies.dompurify;
  await buildGrowthStaticSite({ outputDir: role === 'hub' ? hubDir : previewDir,
    origin: role === 'hub' ? 'https://tools.usefulverse.com' : 'https://draft-300-noindex.usefulverse-tools.pages.dev',
    localeEntries: locales, extraToolLocales, copyByLocale, tools, currentTools: [...mainTools, ...growthPilotTools.filter(t => !ids.includes(t.id))],
    controllerBundles: await bundleGrowthControllers({ tools }),
    styles: minify(await text('src/growth600/site.css') + (extended ? await text('src/growth600/rtl-fixes.css') : '')).css,
    toolStyles: role === 'hub' ? { [id]: minify(await text('src/growth600/tools/markdown-editor/markdown-editor.css')).css } : {},
    faviconSvg: await text('public/favicon.svg'),
    noindexHome: role === 'preview', noindexToolIds: role === 'preview' ? ids : [], allowUnapprovedToolIds: role === 'preview' ? ids : [],
    maxAssetBytes: 72 * 1024,
    extraAssets: role === 'hub' ? {
      [`vendor/purify-${version}.min.js`]: await readFile(join(root, 'node_modules/dompurify/dist/purify.min.js')),
      'vendor/marked-18.0.14.umd.js': await readFile(join(root, 'node_modules/marked/lib/marked.umd.js')),
    } : {},
  });
}
// Main's runtime is standalone and its normal build minifies this exact source.
const runtime = await build({ stdin: { contents: await text('src/app.js') }, minify: true, write: false, target: 'es2020' });
await writeFile(join(mainDir, 'assets/app.js'), runtime.outputFiles[0].contents);
const report = await composeSites({ main: mainDir, hub: hubDir, preview: previewDir, output: join(output, 'composed'),
  existingIds: ['word-counter', 'markdown-editor'], draftIds: extended ? ['grammar-checker', 'fancy-text-generator'] : ['grammar-checker'], draftPrefixes: [...locales.map(l => l.prefix.replace(/^\//u, '')), ...(extended ? ['nb'] : [])],
  workingRoot: root, scope: extended ? 'real-four-tool-seven-locale-partial-not-release' : 'real-three-tool-three-locale-partial-not-release', write: true });
await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
