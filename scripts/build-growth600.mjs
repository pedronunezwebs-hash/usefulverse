import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { minify as minifyCss } from 'csso';
import { localeEntries } from '../src/locales.mjs';
import { tools as currentTools } from '../src/catalog.mjs';
import { growthPilotTools } from '../src/growth600/catalog.mjs';
import { bundleGrowthControllers } from '../src/growth600/bundle-controllers.mjs';
import { buildGrowthStaticSite } from '../src/growth600/build.mjs';
import markdownEditorCopies from '../src/growth600/locales/markdown-editor-final.mjs';
import purchaseOrderGeneratorCopies from '../src/growth600/locales/purchase-order-generator-final.mjs';
import eigenvalueCalculatorCopies from '../src/growth600/locales/eigenvalue-calculator-final.mjs';

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
for (const { key } of localeEntries) {
  if (!markdownEditorCopies[key]) throw new Error(`Growth600 release blocked: Markdown Editor copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'markdown-editor': markdownEditorCopies[key] };
  if (!purchaseOrderGeneratorCopies[key]) throw new Error(`Growth600 release blocked: Purchase Order Generator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'purchase-order-generator': purchaseOrderGeneratorCopies[key] };
  if (!eigenvalueCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Eigenvalue Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'eigenvalue-calculator': eigenvalueCalculatorCopies[key] };
}

const outputDir = resolve(process.env.GROWTH600_DIST ?? resolve(root, 'dist-growth600'));
const styleFiles = [
  'src/growth600/site.css', 'src/growth600/rtl-fixes.css',
  'src/growth600/tools/peg-solitaire/peg-solitaire.css',
  'src/growth600/tools/futoshiki/futoshiki.css',
  'src/growth600/tools/hashi-puzzle/hashi-puzzle.css',
  'src/growth600/tools/chess-opening-trainer/chess-opening-trainer.css',
];
const styles = minifyCss((await Promise.all(styleFiles.map((file) => readFile(resolve(root, file), 'utf8')))).join(''), { comments: 'exclamation' }).css;
const toolStyles = {
  'har-viewer': minifyCss(await readFile(resolve(root, 'src/growth600/tools/har-viewer/har-viewer.css'), 'utf8'), { comments: 'exclamation' }).css,
  'robots-txt-tester': minifyCss(await readFile(resolve(root, 'src/growth600/tools/robots-txt-tester/robots-txt-tester.css'), 'utf8'), { comments: 'exclamation' }).css,
  'binary-base64-tool': minifyCss(await readFile(resolve(root, 'src/growth600/tools/binary-base64-tool/binary-base64-tool.css'), 'utf8'), { comments: 'exclamation' }).css,
  'csv-editor': minifyCss(await readFile(resolve(root, 'src/growth600/tools/csv-editor/csv-editor.css'), 'utf8'), { comments: 'exclamation' }).css,
  'logic-grid-puzzle': minifyCss(await readFile(resolve(root, 'src/growth600/tools/logic-grid-puzzle/logic-grid-puzzle.css'), 'utf8'), { comments: 'exclamation' }).css,
  'markdown-editor': minifyCss(await readFile(resolve(root, 'src/growth600/tools/markdown-editor/markdown-editor.css'), 'utf8'), { comments: 'exclamation' }).css,
  'purchase-order-generator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/purchase-order-generator/purchase-order-generator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'eigenvalue-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/eigenvalue-calculator/eigenvalue-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
};
const faviconSvg = await readFile(resolve(root, 'public/favicon.svg'), 'utf8');
const modelRevision = '92a21aca5713f20faf9a87590cdfbdce2e34112c';
const modelFolder = `Xenova/swin2SR-lightweight-x2-64`;
const modelAssetRoot = `models-image-upscaler-${modelRevision}/${modelFolder}`;
const extraAssets = Object.fromEntries(await Promise.all([
  'config.json', 'preprocessor_config.json', 'onnx/model_q4.onnx',
].map(async (path) => [`${modelAssetRoot}/${path}`, await readFile(resolve(root, 'public/growth600-models', modelFolder, path))])));
extraAssets['vendor/marked-18.0.14.umd.js'] = await readFile(resolve(root, 'node_modules/marked/lib/marked.umd.js'));
extraAssets['vendor/purify-3.4.16.min.js'] = await readFile(resolve(root, 'node_modules/dompurify/dist/purify.min.js'));
extraAssets['licenses/marked-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/marked/LICENSE'));
extraAssets['licenses/DOMPurify-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/dompurify/LICENSE'));
const yamlParserBuild = await build({
  entryPoints: [resolve(root, 'node_modules/js-yaml/dist/js-yaml.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2020'], minify: true, write: false, logLevel: 'silent',
});
if (Buffer.byteLength(yamlParserBuild.outputFiles[0].text) > 64 * 1024) throw new Error('The lazily loaded YAML parser exceeded its 64 KiB runtime asset budget.');
extraAssets['vendor/js-yaml-4.3.2.mjs'] = yamlParserBuild.outputFiles[0].text;
extraAssets['licenses/js-yaml-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/js-yaml/LICENSE'));
extraAssets['licenses/upscaler/THIRD-PARTY-NOTICES.md'] = await readFile(resolve(root, 'public/growth600-models/THIRD-PARTY-NOTICES.md'));
extraAssets['licenses/upscaler/LICENSE-APACHE-2.0.txt'] = await readFile(resolve(root, 'public/growth600-models/LICENSE-APACHE-2.0.txt'));
extraAssets['licenses/upscaler/LICENSE-MIT-ONNX-RUNTIME.txt'] = await readFile(resolve(root, 'public/growth600-models/LICENSE-MIT-ONNX-RUNTIME.txt'));
const onnxVendor = resolve(root, 'node_modules/onnxruntime-web/dist');
extraAssets['schemaorg-v30.1.json'] = await readFile(resolve(root, 'src/growth600/data/schemaorg-v30.1.json'));
for (const filename of ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm']) {
  extraAssets[`vendor/onnx/${filename}`] = await readFile(resolve(onnxVendor, filename));
}
const workerBuild = await build({
  entryPoints: [resolve(root, 'src/growth600/tools/image-upscaler/worker.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], minify: true, write: false, logLevel: 'silent',
});
const result = await buildGrowthStaticSite({
  outputDir,
  origin: 'https://tools.usefulverse.com',
  localeEntries,
  copyByLocale,
  controllerBundles: await bundleGrowthControllers(),
  toolStyles,
  workerBundles: { 'image-upscaler-worker': workerBuild.outputFiles[0].text },
  // ONNX Runtime's pinned static browser bundle uses Function internally for
  // its own dispatch; no user-controlled source reaches this worker.
  trustedWorkerDynamicCode: ['image-upscaler-worker'],
  extraAssets,
  styles,
  faviconSvg,
  currentTools,
  tools: growthPilotTools,
  maxFiles: 18_500,
  maxAssetBytes: 24 * 1024,
});
console.log(`Built ${result.pages} static pages for ${growthPilotTools.length} new tools in ${localeEntries.length} locales (${result.files} files, ${result.totalBytes} bytes).`);
