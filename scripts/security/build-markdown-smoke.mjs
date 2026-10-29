// Local partial build for reviewing sanitizer changes; never a complete release.
import { readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { minify } from 'csso';
import { localeEntries } from '../../src/locales.mjs';
import { tools as mainTools } from '../../src/catalog.mjs';
import { growthPilotTools } from '../../src/growth600/catalog.mjs';
import { buildGrowthStaticSite } from '../../src/growth600/build.mjs';
import { bundleGrowthControllers } from '../../src/growth600/bundle-controllers.mjs';
import markdown from '../../src/growth600/locales/markdown-editor-final.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const outputDir = process.argv[2] && resolve(process.argv[2]);
if (!outputDir) throw Error('Supply a new, disposable output directory');
const path = relative(root, outputDir);
if (!path || ['src', 'public', 'scripts', 'tests', 'docs', 'translation-sources', '.git'].includes(path.split(/[\\/]/u)[0])) {
  throw Error('The partial build must not replace project sources');
}
const locales = localeEntries.filter(l => ['en', 'es', 'ar'].includes(l.key));
const tools = growthPilotTools.filter(t => t.id === 'markdown-editor');
const copyByLocale = {};
for (const locale of locales) {
  const pack = (await import(pathToFileURL(resolve(root, `src/growth600/locales/${locale.key}.mjs`)))).default;
  copyByLocale[locale.key] = { _home: pack._home, 'markdown-editor': markdown[locale.key] };
}
const text = name => readFile(resolve(root, name), 'utf8');
const version = JSON.parse(await text('package.json')).devDependencies.dompurify;
const result = await buildGrowthStaticSite({
  outputDir, origin: 'https://tools.usefulverse.com', localeEntries: locales,
  copyByLocale, tools, currentTools: [...mainTools, ...growthPilotTools.filter(t => t.id !== 'markdown-editor')],
  controllerBundles: await bundleGrowthControllers({ tools }),
  styles: minify(await text('src/growth600/site.css')).css,
  toolStyles: { 'markdown-editor': minify(await text('src/growth600/tools/markdown-editor/markdown-editor.css')).css },
  faviconSvg: await text('public/favicon.svg'),
  extraAssets: {
    'qa/layout-regression.mjs': await readFile(resolve(root, 'tests/browser/page-layout.mjs')),
    [`vendor/purify-${version}.min.js`]: await readFile(resolve(root, 'node_modules/dompurify/dist/purify.min.js')),
    'vendor/marked-18.0.14.umd.js': await readFile(resolve(root, 'node_modules/marked/lib/marked.umd.js')),
  },
});
console.log(JSON.stringify({ ...result, scope: 'partial-markdown-smoke-not-a-release' }));
