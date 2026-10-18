import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'src/growth600/live-only-106-source');
const snapshotPath = join(root, 'src/growth600/live-only-106.snapshot.json.gz');
const manifestPath = join(root, 'src/growth600/live-only-106.manifest.json');
const origin = 'https://tools.usefulverse.com';

if (await stat(sourceDir).then(() => true, () => false)) {
  throw new Error(`Refusing to overwrite recovered source directory: ${sourceDir}`);
}

const snapshot = JSON.parse(gunzipSync(await readFile(snapshotPath)).toString('utf8'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const ids = new Set(manifest.tools.map(({ id }) => id));
if (ids.size !== 106 || snapshot.pages.length !== 3816 || snapshot.sourceSitemapUrls.length !== snapshot.sourceSitemapUrlCount) {
  throw new Error('The published snapshot or 106-tool manifest is incomplete.');
}

const writeSafe = async (relativePath, contents) => {
  const destination = join(sourceDir, relativePath);
  if (!destination.startsWith(`${sourceDir}/`)) throw new Error(`Unsafe recovery path: ${relativePath}`);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, contents, { flag: 'wx' });
};

const assetRewrites = new Map();
const assetPathMap = new Map();
for (const assetPath of Object.keys(snapshot.assets)) {
  const normalized = assetPath.replace(/^\/+/, '');
  if (!(normalized === 'favicon.svg' || normalized.startsWith('assets/')) || normalized.split('/').includes('..')) {
    throw new Error(`Unexpected published asset: ${assetPath}`);
  }
  const stem = normalized.match(/^assets\/([^/]+)\.[a-f0-9]{12}\.(js|css)$/u);
  const editableToolAsset = Boolean(stem && ids.has(stem[1]));
  const outputPath = editableToolAsset
    ? `assets/recovered-live-only-106/${stem[2] === 'js' ? 'controllers' : 'styles'}/${stem[1]}.${stem[2]}`
    : `assets/recovered-live-only-106/published/${normalized}`;
  assetPathMap.set(assetPath, { normalized, outputPath, editableToolAsset });
  assetRewrites.set(assetPath, `/${outputPath}`);
}
assetRewrites.set('/favicon.svg', '/assets/recovered-live-only-106/published/favicon.svg');

const editableAssetPaths = new Set();
for (const [assetPath, encoded] of Object.entries(snapshot.assets)) {
  const { normalized, outputPath, editableToolAsset } = assetPathMap.get(assetPath);
  const bytes = Buffer.from(encoded, 'base64');
  if (!bytes.length || bytes.toString('base64') !== encoded) throw new Error(`Invalid published asset: ${assetPath}`);
  const extension = normalized.split('.').at(-1)?.toLowerCase();
  let output = bytes;
  const sourceText = bytes.toString('utf8');
  const isHtmlFallback = sourceText.trimStart().toLowerCase().startsWith('<!doctype html');
  if (editableToolAsset && (extension === 'js' || extension === 'css') && !isHtmlFallback) {
    const parser = extension === 'js' ? 'babel' : 'css';
    output = Buffer.from(await prettier.format(sourceText, { parser, singleQuote: true, printWidth: 100 }));
  }
  if (['js', 'mjs', 'css', 'json', 'svg'].includes(extension) && !isHtmlFallback) {
    let text = output.toString('utf8');
    for (const [publishedPath, outputPath] of [...assetRewrites].sort((a, b) => b[0].length - a[0].length)) {
      text = text.replaceAll(publishedPath, outputPath);
    }
    output = Buffer.from(text);
  }
  await writeSafe(outputPath, output);
  editableAssetPaths.add(`/${outputPath}`);
}

for (const page of snapshot.pages) {
  const url = new URL(page.url);
  if (url.origin !== origin || url.pathname !== page.path) throw new Error(`Invalid published route: ${page.url}`);
  const match = url.pathname.match(/^\/(?:([a-z0-9-]+)\/)?tools\/([a-z0-9-]+)\/$/u);
  if (!match || !ids.has(match[2])) throw new Error(`Unexpected page in published snapshot: ${page.url}`);
  let html = page.html;
  for (const [publishedPath, editablePath] of assetRewrites) html = html.replaceAll(publishedPath, editablePath);
  await writeSafe(`pages${url.pathname}index.html`, html);
}

const originalAssets = Object.entries(snapshot.assets).map(([urlPath, encoded]) => ({
  urlPath,
  sha256: createHash('sha256').update(Buffer.from(encoded, 'base64')).digest('hex'),
})).sort((left, right) => left.urlPath.localeCompare(right.urlPath));
await writeSafe('source-inventory.json', `${JSON.stringify({
  schemaVersion: 1,
  recoveryMethod: 'formatted published HTML and browser assets',
  exactOriginalModulesRecovered: false,
  origin,
  capturedAt: snapshot.capturedAt,
  sourceSitemapSha256: snapshot.sourceSitemapSha256,
  sourceSitemapUrlCount: snapshot.sourceSitemapUrlCount,
  pageCount: snapshot.pages.length,
  toolIds: [...ids].sort(),
  routes: snapshot.sourceSitemapUrls,
  assetPaths: [...editableAssetPaths].sort(),
  originalAssets,
}, null, 2)}\n`);

await writeSafe('README.md', `# Recuperación editable de las 106 herramientas públicas\n\n` +
  `Las páginas y recursos se recuperaron del HTML y los assets servidos públicamente por ` +
  `${origin}. Los controladores JavaScript y estilos CSS propios de cada herramienta se ` +
  `formatearon como archivos editables; sus páginas HTML están organizadas por idioma y ruta.\n\n` +
  `**No son los módulos originales de autoría.** La búsqueda en Git y en los PRs disponibles ` +
  `no encontró esos fuentes ni source maps. Los bundles conservan la lógica publicada, pero ` +
  `no se pueden recuperar desde ellos los nombres locales, comentarios ni la estructura previa ` +
  `al build.\n\n` +
  `- \`pages/<locale>/tools/<id>/index.html\`: HTML publicado por ruta e idioma ` +
  `(el idioma base vive en \`pages/tools/<id>/index.html\`).\n` +
  `- \`assets/recovered-live-only-106/controllers/<id>.js\` y \`styles/<id>.css\`: ` +
  `controladores y estilos editables.\n` +
  `- \`assets/recovered-live-only-106/published/\`: recursos compartidos, aislados para ` +
  `evitar colisiones con los assets actuales.\n` +
  `- \`source-inventory.json\`: IDs, sitemap, hashes y rutas de los recursos capturados.\n\n` +
  `El build importa estas páginas y assets. Compara las ediciones con la captura comprimida ` +
  `\`../live-only-106.snapshot.json.gz\` y revisa los 36 idiomas antes de publicar.\n`);

console.log(`Materialized ${snapshot.pages.length} editable published pages and ${Object.keys(snapshot.assets).length} assets at ${sourceDir}.`);
