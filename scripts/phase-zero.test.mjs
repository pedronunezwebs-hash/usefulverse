import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { renderHome, renderNotFoundPage } from '../src/template.mjs';
import { locales } from '../src/locales.mjs';
import { versionRecoveredAssets } from './recovered-assets.mjs';
import { runInNewContext } from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
test('phase 0: English home title has no repeated word and fits 60 characters', () => {
  const title = renderHome([], ['All']).match(/<title>(.*?)<\/title>/u)[1];
  const words = title.toLowerCase().match(/[\p{L}\p{N}]+/gu);
  assert.equal(new Set(words).size, words.length, title);
  assert.ok(title.length <= 60, title);
});
test('phase 0: every existing main home title fits 60 characters', () => {
  for (const key of Object.keys(locales)) {
    const title = renderHome([], ['All'], '', key).match(/<title>(.*?)<\/title>/u)[1];
    assert.ok(title.length <= 60, `${key}: ${title}`);
  }
});
test('G1: all 106 real captured controllers get content-versioned URLs', async () => {
  const source = join(root, 'src/growth600/live-only-106-source');
  const inventory = JSON.parse(await readFile(join(source, 'source-inventory.json')));
  const assets = new Map(await Promise.all(inventory.assetPaths.map(async p => [p.slice(1), await readFile(join(source, p))])));
  const versioned = versionRecoveredAssets(assets);
  const controllers = inventory.assetPaths.filter(p => p.includes('/controllers/') && p.endsWith('.js'));
  assert.equal(controllers.length, 106);
  for (const path of controllers) {
    const fresh = versioned.rewrite(path);
    assert.notEqual(fresh, path, path);
    assert.match(fresh, /\/recovered-live-only-106\/[a-f0-9]{24}\//u);
    assert.ok(versioned.assets.has(fresh.slice(1)));
  }
  const manifest = JSON.parse(await readFile(join(root, 'src/growth600/live-only-106.manifest.json')));
  for (const { id } of manifest.tools) {
    const html = await readFile(join(source, 'pages/tools', id, 'index.html'), 'utf8');
    const path = html.match(/\/assets\/recovered-live-only-106\/controllers\/[^"']+\.js/u)?.[0];
    assert.ok(path, id); // push-up-test and memory-test use *.controller.js.
    assert.ok(versioned.assets.has(versioned.rewrite(path).slice(1)), id);
    assert.ok(versioned.rewrite(html).includes(versioned.rewrite(path)), id);
  }
});
test('G1: a transitive vendor edit invalidates every entry URL and preserves relative imports', () => {
  const prefix = 'assets/recovered-live-only-106/';
  const assets = new Map([
    [prefix + 'controllers/a.js', Buffer.from(`import '../vendor/b.mjs'; new Worker('/${prefix}vendor/b.mjs');`)],
    [prefix + 'vendor/b.mjs', Buffer.from('export const b = 1;')],
    [prefix + 'vendor/binary.dat', Buffer.from([0, 255, 0, 128])],
    ['favicon.svg', Buffer.from('<svg/>')],
  ]);
  const first = versionRecoveredAssets(assets), reordered = versionRecoveredAssets(new Map([...assets].reverse()));
  assert.equal(first.version, reordered.version);
  const entry = first.rewrite('/' + prefix + 'controllers/a.js');
  const code = first.assets.get(entry.slice(1)).toString();
  assert.ok(code.includes("import '../vendor/b.mjs'"));
  assert.ok(code.includes(first.rewrite('/' + prefix + 'vendor/b.mjs')));
  assert.equal(first.rewrite(code), code, 'rewriting is idempotent');
  assert.deepEqual(first.assets.get(first.rewrite('/' + prefix + 'vendor/binary.dat').slice(1)), assets.get(prefix + 'vendor/binary.dat'));
  assets.set(prefix + 'vendor/b.mjs', Buffer.from('export const b = 2;'));
  assert.notEqual(first.version, versionRecoveredAssets(assets).version);
  assert.equal(first.assets.get('favicon.svg').toString(), '<svg/>');
});
test('G1: malformed captured paths cannot escape or silently double-version assets', () => {
  for (const path of ['assets/other/a.js', 'assets/recovered-live-only-106/../a.js', 'assets/recovered-live-only-106/' + 'a'.repeat(24) + '/a.js']) {
    assert.throws(() => versionRecoveredAssets(new Map([[path, Buffer.from('x')]])));
  }
});
test('404 normal text and the home button meet WCAG AA contrast (axe regression)', () => {
  // WCAG 2.2 relative luminance: https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
  const luminance = hex => {
    const c = hex.match(/[a-f\d]{2}/giu).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  };
  const html = renderNotFoundPage();
  const foreground = html.match(/\.code\s*\{[^}]*color:\s*(#[a-f\d]{6})/iu)[1];
  const background = html.match(/\.home\s*\{[^}]*background:\s*(#[a-f\d]{6})/iu)[1];
  for (const color of [foreground, background]) assert.ok(1.05 / (luminance(color) + .05) >= 4.5, color);
});
test('404 brand and language navigation provide 44px touch targets', () => {
  const html = renderNotFoundPage();
  for (const selector of ['\\.brand', 'nav a']) {
    const rule = html.match(new RegExp(selector + '\\s*\\{([^}]+)\\}', 'u'))[1];
    assert.match(rule, /min-height:\s*44px/u);
  }
});
test('404 follows the URL language before browser preferences, including RTL', () => {
  const script = renderNotFoundPage().match(/<script>([\s\S]*?)<\/script>/u)[1];
  for (const [pathname, languages, lang, dir, href] of [
    ['/ar/missing/', ['es', 'en'], 'ar', 'rtl', '/ar/'],
    ['/de/missing/', ['es'], 'de', 'ltr', '/de/'],
    ['/pt-br/missing/', ['en'], 'pt-BR', 'ltr', '/pt-br/'],
    ['/tools/missing/', ['es', 'en'], 'es', 'ltr', '/es/'],
    ['/fa/missing/', ['es'], 'en', 'ltr', '/fa/'],
  ]) {
    const nodes = {};
    const document = { documentElement: {}, getElementById: id => nodes[id] ??= { setAttribute(k, v) { this[k] = v; } } };
    runInNewContext(script, { document, navigator: { languages }, location: { pathname } });
    assert.equal(document.documentElement.lang, lang, pathname);
    assert.equal(document.documentElement.dir, dir, pathname);
    assert.equal(nodes['not-found-home'].href, href, pathname);
  }
});
test('404 declares the existing favicon rather than requesting a missing favicon.ico', () => {
  assert.match(renderNotFoundPage(), /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml">/u);
});
