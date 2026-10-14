import { mkdir, mkdtemp, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { localePath } from '../locales.mjs';
import { growthPilotTools, assertGrowthCatalogIsAdditive } from './catalog.mjs';
import { assertGrowthLocaleCoverage } from './locale-contract.mjs';
import { renderGrowthForm } from './forms.mjs';
import { renderGrowthHomePage, renderGrowthToolPage } from './render.mjs';

const sha = (value) => createHash('sha256').update(value).digest('hex').slice(0, 12);

async function walkFiles(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walkFiles(path, files);
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

async function writeRoute(root, route, content) {
  const path = join(root, route.replace(/^\/+|\/+$/gu, ''), 'index.html');
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

export function assertLocalController(toolId, source, maxBytes) {
  const bytes = Buffer.byteLength(source);
  if (bytes > maxBytes) throw new Error(`${toolId} controller exceeds the ${maxBytes}-byte initial runtime budget.`);
  const withoutSvgNamespace = source.replaceAll('http://www.w3.org/2000/svg', '');
  const withoutPackageNamespaces = withoutSvgNamespace
    .replaceAll(/https?:\/\/schema\.org\/?/gu, '')
    .replaceAll('http://schemas.openxmlformats.org/package/2006/content-types', '')
    .replaceAll('http://schemas.openxmlformats.org/package/2006/relationships', '')
    .replaceAll('http://schemas.openxmlformats.org/spreadsheetml/2006/main', '')
    .replaceAll('http://schemas.openxmlformats.org/officeDocument/2006/relationships', '');
  const localVocabularyFetch = /fetch\(new URL\(["']\/assets\/schemaorg-v30\.1\.json["'],location\.origin\)/u;
  const withoutAllowedFetch = source.replace(localVocabularyFetch, '');
  if (/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\b/u.test(withoutAllowedFetch) || /https?:\/\//u.test(withoutPackageNamespaces)) throw new Error(`${toolId} controller must not contact a remote service.`);
  if (/\beval\s*\(|\bnew\s+Function\b/u.test(source)) throw new Error(`${toolId} controller contains dynamic code execution.`);
}

async function buildGrowthStaticSiteIntoDirectory({
  outputDir, origin, localeEntries, copyByLocale, controllerBundles, styles, toolStyles = {}, workerBundles = {}, extraAssets = {}, trustedWorkerDynamicCode = [],
  faviconSvg,
  currentTools, tools = growthPilotTools, maxFiles = 18_500,
  maxAssetBytes = 24 * 1024, maxFileBytes = 25 * 1024 * 1024,
}) {
  if (!outputDir || !Array.isArray(localeEntries) || !localeEntries.length || !styles || !faviconSvg) throw new TypeError('Build directory, locales, stylesheet and favicon are required.');
  if (await stat(outputDir).then(() => true, () => false)) throw new Error(`Refusing to overwrite an existing growth build directory: ${outputDir}`);
  assertGrowthCatalogIsAdditive(currentTools ?? [], tools);
  assertGrowthLocaleCoverage(tools, localeEntries, copyByLocale);
  for (const locale of localeEntries) {
    const home = copyByLocale[locale.key]._home;
    for (const key of ['title', 'description', 'intro', 'directoryLabel', 'freeLabel', 'footerFree']) {
      if (typeof home?.[key] !== 'string' || !home[key].trim()) throw new Error(`${locale.key}: missing localized home ${key}.`);
    }
    if (home.title.length > 60 || home.description.length > 160) throw new Error(`${locale.key}: home metadata exceeds its character budget.`);
    // Keep caller-owned locale data immutable so tests/build stages can safely reuse it.
  }
  for (const tool of tools) {
    if (typeof controllerBundles?.[tool.id] !== 'string' || !controllerBundles[tool.id].trim()) throw new Error(`Missing isolated browser controller for ${tool.id}.`);
    const controllerBudget = ['chess-opening-trainer', 'chess-puzzles', 'chess-analysis-board'].includes(tool.id) ? 48 * 1024 : maxAssetBytes;
    assertLocalController(tool.id, controllerBundles[tool.id], controllerBudget);
  }
  for (const [name, source] of Object.entries(workerBundles)) {
    if (!/^[a-z0-9-]+$/u.test(name) || typeof source !== 'string' || !source.trim()) throw new Error(`Invalid worker bundle: ${name}.`);
    if ((/\beval\s*\(|\bnew\s+Function\b/u.test(source)) && !trustedWorkerDynamicCode.includes(name)) throw new Error(`${name} worker contains dynamic code execution.`);
    if (Buffer.byteLength(source) > maxFileBytes) throw new Error(`${name} worker exceeds Cloudflare's per-file maximum.`);
  }
  for (const [name, contents] of Object.entries(extraAssets)) {
    if (!name || name.startsWith('/') || name.split('/').includes('..') || !(typeof contents === 'string' || Buffer.isBuffer(contents) || contents instanceof Uint8Array)) throw new Error(`Invalid static asset: ${name}.`);
    if (Buffer.from(contents).byteLength > maxFileBytes) throw new Error(`${name} exceeds Cloudflare's per-file maximum.`);
  }
  for (const [toolId, source] of Object.entries(toolStyles)) {
    if (!tools.some(({ id }) => id === toolId) || typeof source !== 'string' || !source.trim()) throw new Error(`Invalid tool stylesheet: ${toolId}.`);
    if (Buffer.byteLength(source) > maxAssetBytes) throw new Error(`${toolId} stylesheet exceeds the ${maxAssetBytes}-byte budget.`);
  }
  if (Buffer.byteLength(styles) > maxAssetBytes) throw new Error(`Growth stylesheet exceeds the ${maxAssetBytes}-byte budget.`);

  await mkdir(join(outputDir, 'assets'), { recursive: true });
  await writeFile(join(outputDir, 'favicon.svg'), faviconSvg);
  const version = sha(Buffer.concat([Buffer.from(styles), ...Object.entries(toolStyles).flatMap(([name, source]) => [Buffer.from(name), Buffer.from(source)]), ...tools.map(({ id }) => Buffer.from(controllerBundles[id])), ...Object.entries(workerBundles).flatMap(([name, source]) => [Buffer.from(name), Buffer.from(source)]), ...Object.entries(extraAssets).flatMap(([name, contents]) => [Buffer.from(name), Buffer.from(contents)])]));
  await writeFile(join(outputDir, 'assets', `growth600.${version}.css`), styles);
  const assetFiles = new Map([[`assets/growth600.${version}.css`, Buffer.byteLength(styles)]]);
  const toolStylePaths = {};
  for (const [toolId, source] of Object.entries(toolStyles)) {
    const filename = `${toolId}.${sha(source)}.css`;
    await writeFile(join(outputDir, 'assets', filename), source);
    toolStylePaths[toolId] = `/assets/${filename}`;
    assetFiles.set(`assets/${filename}`, Buffer.byteLength(source));
  }
  for (const tool of tools) {
    const filename = `${tool.id}.${sha(controllerBundles[tool.id])}.js`;
    await writeFile(join(outputDir, 'assets', filename), controllerBundles[tool.id]);
    assetFiles.set(`assets/${filename}`, Buffer.byteLength(controllerBundles[tool.id]));
  }
  const workerPaths = {};
  for (const [name, source] of Object.entries(workerBundles)) {
    const filename = `${name}.${sha(source)}.mjs`;
    await writeFile(join(outputDir, 'assets', filename), source);
    workerPaths[name] = `/assets/${filename}`;
    assetFiles.set(`assets/${filename}`, Buffer.byteLength(source));
  }
  for (const [name, contents] of Object.entries(extraAssets)) {
    const path = join(outputDir, 'assets', name);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, contents);
    assetFiles.set(`assets/${name}`, Buffer.from(contents).byteLength);
  }

  const canonicalUrls = [];
  for (const locale of localeEntries) {
    const localeCopy = copyByLocale[locale.key];
    const localeHomeRoute = localePath(locale.key);
    const homeHtml = renderGrowthHomePage({ tools, locale, localeEntries, copy: { ...localeCopy._home, tools: Object.fromEntries(tools.map((tool) => [tool.id, localeCopy[tool.id]])) }, origin });
    await writeRoute(outputDir, localeHomeRoute, homeHtml.replace('/assets/growth600.css', `/assets/growth600.${version}.css`));
    canonicalUrls.push(`${new URL(origin).origin}${localeHomeRoute}`);
    for (const tool of tools) {
      const copy = localeCopy[tool.id];
      let formHtml = renderGrowthForm(tool.id, copy);
      for (const [name, path] of Object.entries(workerPaths)) formHtml = formHtml.replaceAll(`__WORKER_${name.toUpperCase().replaceAll('-', '_')}__`, path);
      let html = renderGrowthToolPage({ tool, locale, localeEntries, copy: { ...localeCopy._home, ...copy }, origin, assetVersion: version, formHtml });
      html = html.replace(`/assets/growth600.css?v=${version}`, `/assets/growth600.${version}.css`)
        .replace(`/assets/${tool.id}.js?v=${version}`, `/assets/${tool.id}.${sha(controllerBundles[tool.id])}.js`);
      if (toolStylePaths[tool.id]) html = html.replace('</head>', `  <link rel="stylesheet" href="${toolStylePaths[tool.id]}">\n</head>`);
      const route = localePath(locale.key, tool.id);
      await writeRoute(outputDir, route, html);
      canonicalUrls.push(`${new URL(origin).origin}${route}`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicalUrls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(join(outputDir, 'sitemap.xml'), sitemap);
  await writeFile(join(outputDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', origin)}\n`);
  const english = copyByLocale.en;
  const llms = `# UsefulVerse tools\n\n${english._home.intro}\n\n${tools.map((tool) => `- [${english[tool.id].name}](${new URL(localePath('en', tool.id), origin)}): ${english[tool.id].description}`).join('\n')}\n\n- [Sitemap](${new URL('/sitemap.xml', origin)})\n`;
  await writeFile(join(outputDir, 'llms.txt'), llms);
  for (const locale of localeEntries) {
    const translated = copyByLocale[locale.key];
    const route = localePath(locale.key).replace(/^\/+|\/+$/gu, '');
    await writeFile(join(outputDir, route, 'llms.txt'), `# UsefulVerse — ${locale.name}\n\n${translated._home.intro}\n\n${tools.map((tool) => `- [${translated[tool.id].name}](${new URL(localePath(locale.key, tool.id), origin)}): ${translated[tool.id].description}`).join('\n')}\n\n- [Sitemap](${new URL('/sitemap.xml', origin)})\n`);
  }
  await writeFile(join(outputDir, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Cache-Control: public, max-age=0, must-revalidate\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n`);

  const files = await walkFiles(outputDir);
  if (files.length > maxFiles) throw new Error(`Growth Pages project would contain ${files.length} files; safety cap is ${maxFiles}.`);
  const sizes = await Promise.all(files.map(async (path) => ({ path, bytes: (await stat(path)).size })));
  const tooLarge = sizes.find(({ bytes }) => bytes > maxFileBytes);
  if (tooLarge) throw new Error(`Published asset exceeds Cloudflare's per-file maximum: ${tooLarge.path} (${tooLarge.bytes} bytes).`);
  const actualUrls = (await readFile(join(outputDir, 'sitemap.xml'), 'utf8')).match(/<loc>/gu)?.length ?? 0;
  if (actualUrls !== canonicalUrls.length) throw new Error(`Sitemap has ${actualUrls} URLs; expected ${canonicalUrls.length}.`);
  return { files: files.length, pages: canonicalUrls.length, sitemapUrls: actualUrls, totalBytes: sizes.reduce((sum, file) => sum + file.bytes, 0), origin: new URL(origin).origin, version, assetFiles: [...assetFiles] };
}

/**
 * Build in an isolated sibling directory and publish the completed tree with one rename.
 * A failed budget/validation check must never leave a partial deploy directory behind.
 */
export async function buildGrowthStaticSite(options) {
  const outputDir = resolve(options?.outputDir ?? '');
  if (!options?.outputDir) throw new TypeError('A build output directory is required.');
  if (await stat(outputDir).then(() => true, () => false)) throw new Error(`Refusing to overwrite an existing growth build directory: ${outputDir}`);

  const parent = dirname(outputDir);
  await mkdir(parent, { recursive: true });
  const stagingRoot = await mkdtemp(join(parent, '.growth600-build-'));
  const stagingOutput = join(stagingRoot, 'site');
  try {
    const result = await buildGrowthStaticSiteIntoDirectory({ ...options, outputDir: stagingOutput });
    await rename(stagingOutput, outputDir);
    return result;
  } finally {
    await rm(stagingRoot, { recursive: true, force: true });
  }
}
