import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { localeEntries } from '../src/locales.mjs';
import { tools as currentTools } from '../src/catalog.mjs';
import { growthPilotTools } from '../src/growth600/catalog.mjs';
import { bundleGrowthControllers } from '../src/growth600/bundle-controllers.mjs';
import { buildGrowthStaticSite } from '../src/growth600/build.mjs';

const root = resolve(import.meta.dirname, '..');
const localeDir = resolve(root, 'src/growth600/locales');
const missing = [];
const copyByLocale = {};
for (const locale of localeEntries) {
  const path = resolve(localeDir, `${locale.key}.mjs`);
  try {
    await access(path);
    copyByLocale[locale.key] = (await import(`${pathToFileURL(path).href}?v=${Date.now()}`)).default;
  } catch (error) {
    if (error.code === 'ENOENT') missing.push(locale.key);
    else throw error;
  }
}
if (missing.length) throw new Error(`Growth600 release blocked: translated copy is missing for ${missing.join(', ')}.`);

const outputDir = resolve(process.env.GROWTH600_DIST ?? resolve(root, 'dist-growth600'));
const styles = await readFile(resolve(root, 'src/growth600/site.css'), 'utf8');
const result = await buildGrowthStaticSite({
  outputDir,
  origin: 'https://tools.usefulverse.com',
  localeEntries,
  copyByLocale,
  controllerBundles: await bundleGrowthControllers(),
  styles,
  currentTools,
  tools: growthPilotTools,
  maxFiles: 18_500,
  maxAssetBytes: 24 * 1024,
});
console.log(`Built ${result.pages} static pages for ${growthPilotTools.length} new tools in ${localeEntries.length} locales (${result.files} files, ${result.totalBytes} bytes).`);
