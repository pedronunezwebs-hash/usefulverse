import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const origin = 'https://usefulverse.com';
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Uso: npm run seo:indexnow -- <URL...> | --sitemap [--dry-run]');
  console.log('Envía páginas nuevas, actualizadas o eliminadas a Yandex mediante IndexNow.');
  process.exit(0);
}

const dryRun = args.includes('--dry-run');
const sitemapMode = args.includes('--sitemap');
const urls = args.filter((arg) => arg !== '--dry-run' && arg !== '--sitemap');

if (sitemapMode && urls.length) throw new Error('Usa --sitemap o URLs explícitas, no ambos.');
if (!sitemapMode && !urls.length) throw new Error('Indica URLs cambiadas o --sitemap para el alta inicial.');

let submittedUrls = urls;
if (sitemapMode) {
  const sitemap = await readFile(join(root, 'dist', 'sitemap.xml'), 'utf8');
  submittedUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1]);
}

submittedUrls = [...new Set(submittedUrls)];
if (!submittedUrls.length || submittedUrls.length > 10_000) {
  throw new Error('IndexNow requiere entre 1 y 10.000 URLs por envío.');
}
for (const value of submittedUrls) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`URL no válida: ${value}`);
  }
  if (url.origin !== origin) throw new Error(`La URL debe pertenecer a ${origin}: ${value}`);
}

const publicDir = join(root, 'public');
const keyFiles = (await readdir(publicDir)).filter((file) => /^[a-f0-9]{8,128}\.txt$/u.test(file));
let key;
for (const file of keyFiles) {
  const candidate = basename(file, '.txt');
  if ((await readFile(join(publicDir, file), 'utf8')).trim() === candidate) {
    key = candidate;
    break;
  }
}
if (!key) throw new Error('No se encontró una clave IndexNow válida en public/.');

if (dryRun) {
  console.log(`Simulación: ${submittedUrls.length} URL(s) válidas para ${origin}; no se envió ninguna petición.`);
  process.exit(0);
}

const response = await fetch('https://yandex.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'usefulverse.com',
    key,
    keyLocation: `${origin}/${key}.txt`,
    urlList: submittedUrls,
  }),
});
const details = await response.text();
console.log(`Yandex IndexNow: HTTP ${response.status} para ${submittedUrls.length} URL(s).`);
if (response.status === 202) {
  console.log('Aceptado; Yandex todavía puede estar verificando la clave. Esto no confirma indexación.');
} else if (response.status !== 200) {
  console.error(details.slice(0, 300) || 'Yandex no aceptó el envío.');
  process.exitCode = 1;
}
