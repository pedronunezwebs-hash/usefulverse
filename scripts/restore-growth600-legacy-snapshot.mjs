import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { access, cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { localeEntries } from '../src/locales.mjs';

const execFile = promisify(execFileCallback);
const root = resolve(import.meta.dirname, '..');
const target = resolve(process.env.GROWTH600_DIST ?? join(root, 'dist-growth600'));
const archive = join(root, 'src/growth600/legacy-tools-archive-2026-10-15.tar.gz');
const extractedParent = await mkdtemp(join(tmpdir(), 'usefulverse-legacy-growth600-'));
const archiveDirectoryName = 'usefulverse-legacy-archive-20261018';
const sourceOrigin = 'https://tools.usefulverse.com';

async function walk(directory, output = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path, output); else output.push(path);
  }
  return output;
}

function urlsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/gu)].map((match) => match[1]);
}

function routeFile(directory, url) {
  const pathname = decodeURIComponent(new URL(url).pathname);
  const clean = pathname.replace(/^\/+|\/+$/gu, '');
  return join(directory, clean, 'index.html');
}

function localeForPath(pathname) {
  const normalized = pathname.replace(/^\/+|\/+$/gu, '');
  const first = normalized.split('/')[0];
  if (!first || first === 'tools') return { key: 'en', prefix: '' };
  return localeEntries.find(({ key, prefix }) => key === first || prefix.replace(/^\/+|\/+$/gu, '') === first);
}

if (!(await access(target).then(() => true, () => false))) throw new Error(`Growth600 output does not exist: ${target}`);
if (!(await access(archive).then(() => true, () => false))) throw new Error(`Required legacy URL preservation archive is missing: ${archive}`);

try {
  const { stdout } = await execFile('tar', ['-tzf', archive], { maxBuffer: 8 * 1024 * 1024 });
  const entries = stdout.trim().split('\n').filter(Boolean);
  if (!entries.length || entries.some((entry) => !entry.startsWith(`${archiveDirectoryName}/`) || entry.split('/').includes('..'))) {
    throw new Error('Legacy archive has an unexpected or unsafe path.');
  }
  await execFile('tar', ['-xzf', archive, '-C', extractedParent], { maxBuffer: 8 * 1024 * 1024 });
  const snapshot = join(extractedParent, archiveDirectoryName);
  const filesDirectory = join(snapshot, 'files');
  const manifest = JSON.parse(await readFile(join(snapshot, 'manifest.json'), 'utf8'));
  const previousSitemap = await readFile(join(snapshot, 'old-sitemap.xml'), 'utf8');
  const previousUrls = urlsFromSitemap(previousSitemap);
  const missingUrls = manifest.missingUrls;
  if (manifest.oldSitemapUrls !== 11_664 || previousUrls.length !== manifest.oldSitemapUrls || missingUrls.length !== 3_816) {
    throw new Error(`Legacy archive integrity check failed: ${previousUrls.length} sitemap URLs, ${missingUrls.length} preserved pages.`);
  }

  const sitemapPath = join(target, 'sitemap.xml');
  const currentSitemap = await readFile(sitemapPath, 'utf8');
  const currentUrls = new Set(urlsFromSitemap(currentSitemap));
  const previousUrlSet = new Set(previousUrls);
  const archiveOnlyUrls = missingUrls.filter((url) => !currentUrls.has(url));
  if (archiveOnlyUrls.length !== missingUrls.length) {
    throw new Error(`Legacy archive route set changed: expected ${missingUrls.length} missing routes, found ${archiveOnlyUrls.length}.`);
  }
  if (missingUrls.some((url) => !previousUrlSet.has(url))) throw new Error('Legacy archive contains a route absent from its preserved sitemap.');

  let restoredFiles = 0;
  let identicalFiles = 0;
  const archivedAssets = new Set(manifest.assets.map(({ path }) => path));
  for (const url of missingUrls) {
    const sourceFile = routeFile(filesDirectory, url);
    const destination = routeFile(target, url);
    const html = await readFile(sourceFile, 'utf8');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/u)?.[1];
    if (!html.includes('<title>') || canonical !== url) throw new Error(`Archived page metadata is incomplete or canonical differs: ${url}`);
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/gu)) {
      const assetPath = match[1].split(/[?#]/u)[0];
      if (!archivedAssets.has(assetPath)) throw new Error(`Legacy page references an asset absent from the archive manifest: ${url} → ${assetPath}`);
    }
    if (await access(destination).then(() => true, () => false)) {
      const [sourceBytes, destinationBytes] = await Promise.all([readFile(sourceFile), readFile(destination)]);
      if (!sourceBytes.equals(destinationBytes)) throw new Error(`Legacy page conflicts with current output: ${url}`);
      identicalFiles += 1;
    } else {
      await mkdir(dirname(destination), { recursive: true });
      await cp(sourceFile, destination, { errorOnExist: true, force: false });
      restoredFiles += 1;
    }
  }

  for (const asset of manifest.assets) {
    if (!asset.path.startsWith('/assets/')) throw new Error(`Legacy archive contains an unexpected asset path: ${asset.path}`);
    const sourceFile = join(filesDirectory, asset.path.replace(/^\/+/, ''));
    const destination = join(target, asset.path.replace(/^\/+/, ''));
    const bytes = await readFile(sourceFile);
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    if (bytes.length !== asset.bytes || sha256 !== asset.sha256) throw new Error(`Legacy asset integrity mismatch: ${asset.path}`);
    if (await access(destination).then(() => true, () => false)) {
      const existing = await readFile(destination);
      if (!existing.equals(bytes)) throw new Error(`Legacy asset conflicts with current output: ${asset.path}`);
      identicalFiles += 1;
    } else {
      await mkdir(dirname(destination), { recursive: true });
      await cp(sourceFile, destination, { errorOnExist: true, force: false });
      restoredFiles += 1;
    }
  }
  for (const asset of manifest.assets) {
    const extension = asset.path.split('.').at(-1);
    if (!['css', 'js', 'mjs'].includes(extension)) continue;
    const source = await readFile(join(filesDirectory, asset.path.replace(/^\/+/, '')), 'utf8');
    for (const match of source.matchAll(/\/assets\/[A-Za-z0-9._~!$&'()*+,;=:@%/-]+/gu)) {
      const dependency = match[0].split(/[?#]/u)[0];
      if (!archivedAssets.has(dependency) && !(await access(join(target, dependency.replace(/^\/+/, ''))).then(() => true, () => false))) {
        throw new Error(`Legacy asset references a dependency absent from the archive: ${asset.path} → ${dependency}`);
      }
    }
  }

  const oldUrlEntries = [...previousSitemap.matchAll(/<url>([\s\S]*?)<\/url>/gu)].map((match) => match[1]);
  const missingEntries = oldUrlEntries.filter((entry) => {
    const url = entry.match(/<loc>(.*?)<\/loc>/u)?.[1];
    if (!url) throw new Error(`Legacy sitemap entry has no URL: ${entry}`);
    return !currentUrls.has(url);
  });
  if (missingEntries.length !== missingUrls.length) throw new Error(`Legacy sitemap would add ${missingEntries.length} URLs, expected ${missingUrls.length}.`);
  const preservedSitemap = currentSitemap.replace('</urlset>', `${missingEntries.map((entry) => `  <url>${entry}</url>`).join('\n')}\n</urlset>`);
  await writeFile(sitemapPath, preservedSitemap);

  const missingLinksByLocale = new Map();
  for (const url of missingUrls) {
    const parsed = new URL(url);
    const locale = localeForPath(parsed.pathname);
    if (!locale) throw new Error(`Legacy page uses a locale absent from the current locale catalog: ${url}`);
    const localePrefix = locale.prefix.replace(/^\/+|\/+$/gu, '');
    const localeDirectory = localePrefix ? localePrefix : '';
    const page = await readFile(routeFile(filesDirectory, url), 'utf8');
    const name = page.match(/<h1>([\s\S]*?)<\/h1>/u)?.[1];
    const description = page.match(/<meta name="description" content="([\s\S]*?)">/u)?.[1];
    if (!name || !description) throw new Error(`Legacy directory metadata is missing: ${url}`);
    const linkPath = parsed.pathname;
    const card = `<li><a href="${linkPath}"><h2>${name}</h2><p>${description}</p></a></li>`;
    const llmsLine = `- [${name}](${url}): ${description}`;
    if (!missingLinksByLocale.has(locale.key)) missingLinksByLocale.set(locale.key, []);
    missingLinksByLocale.get(locale.key).push({ localeDirectory, linkPath, card, llmsLine });
  }

  for (const [localeKey, links] of missingLinksByLocale) {
    const first = links[0];
    if (links.length !== 106 || links.some(({ localeDirectory }) => localeDirectory !== first.localeDirectory)) {
      throw new Error(`${localeKey}: expected exactly 106 previous tool routes, found ${links.length}.`);
    }
    const homePath = join(target, first.localeDirectory, 'index.html');
    let home = await readFile(homePath, 'utf8');
    if (!home.includes('<ul class="tool-directory">')) throw new Error(`${localeKey}: homepage directory is missing.`);
    const newCards = links.filter(({ linkPath }) => !home.includes(`href="${linkPath}"`)).map(({ card }) => card);
    if (newCards.length) {
      home = home.replace(/(<ul class="tool-directory">[\s\S]*?)(<\/ul>)/u, `$1${newCards.join('')}$2`);
      await writeFile(homePath, home);
    }
    const llmsPath = join(target, first.localeDirectory, 'llms.txt');
    let llms = await readFile(llmsPath, 'utf8');
    const newLines = links.map(({ llmsLine }) => llmsLine).filter((line) => !llms.includes(line));
    if (newLines.length) {
      const updated = llms.replace(/\n- \[Sitemap\]/u, `\n\n${newLines.join('\n')}\n\n- [Sitemap]`);
      if (updated === llms) throw new Error(`${localeKey}: could not append preserved tools to llms.txt.`);
      llms = updated;
      await writeFile(llmsPath, llms);
    }
    const finalHome = await readFile(homePath, 'utf8');
    const finalLlms = await readFile(llmsPath, 'utf8');
    if (links.some(({ linkPath, llmsLine }) => !finalHome.includes(`href="${linkPath}"`) || !finalLlms.includes(llmsLine))) {
      throw new Error(`${localeKey}: previous tool links were not fully restored to homepage and llms.txt.`);
    }
  }

  const finalSitemap = await readFile(sitemapPath, 'utf8');
  const finalUrls = urlsFromSitemap(finalSitemap);
  const uniqueUrls = new Set(finalUrls);
  if (uniqueUrls.size !== currentUrls.size + missingUrls.length) {
    throw new Error(`Restored sitemap count is ${uniqueUrls.size}; expected ${currentUrls.size + missingUrls.length}.`);
  }
  for (const url of uniqueUrls) {
    if (!(await access(routeFile(target, url)).then(() => true, () => false))) throw new Error(`Sitemap URL has no generated page: ${url}`);
  }

  const outputFiles = await walk(target);
  if (outputFiles.length > 18_500) throw new Error(`Restored output exceeds the 18,500-file limit: ${outputFiles.length}.`);
  console.log(`Restored ${missingUrls.length} historical URLs and ${manifest.assets.length} assets; sitemap union has ${uniqueUrls.size} unique URLs, all with page files. Added ${restoredFiles} files and verified ${identicalFiles} identical files; preserved homepage/llms links in ${missingLinksByLocale.size} locales (${outputFiles.length} files total).`);
} catch (error) {
  throw new Error(`Could not safely restore the 15-Oct-2026 Growth600 snapshot: ${error.message}`, { cause: error });
}

await rm(extractedParent, { recursive: true, force: true });
