// Read-only, loopback-only checks against a running Static Assets runtime.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { inventory } from './release-capacity.mjs';
import { hasOldHost, inspectHTML, parseSitemap, TARGET } from './compose-sites-metadata.mjs';

export function inspectDeliveredHTML({ path, status, headers, body, noindex }) {
  const issues = [], info = inspectHTML(body);
  if (status !== 200) issues.push('page-status');
  if (info.canonical !== TARGET + path || hasOldHost(body)) issues.push('canonical-or-old-host');
  if (info.noindex !== noindex || !noindex && /noindex/iu.test(headers.get('x-robots-tag') ?? '')) issues.push('indexation');
  const heading = body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/iu)?.[1].replace(/<[^>]+>/gu, '').trim();
  if (!heading || !info.description) issues.push('metadata');
  if (headers.get('x-content-type-options') !== 'nosniff' || headers.get('x-frame-options') !== 'DENY') issues.push('security-headers');
  const cache = headers.get('cache-control') ?? '';
  if (!/must-revalidate/iu.test(cache) || /immutable|(?:s-)?max-age=(?!0(?:,|$))\d+/iu.test(cache)) issues.push('html-cache');
  return issues;
}

export async function verifyStaticDelivery({ origin, directory }) {
  const url = new URL(origin);
  if (!['127.0.0.1', '[::1]'].includes(url.hostname) || url.protocol !== 'http:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw Error('An HTTP loopback origin is required');
  const files = await inventory(directory), rows = [], indexed = new Set(), drafts = new Set(), visited = new Set();
  const get = async (path, options = {}) => fetch(new URL(path, origin), { redirect: 'manual', signal: AbortSignal.timeout(15000), ...options });
  const row = (kind, path, issues, details = {}) => rows.push({ kind, path, issues, pass: !issues.length, ...details });
  for (const [file] of files) if (file.endsWith('/index.html') || file === 'index.html') {
    const path = '/' + file.replace(/index\.html$/u, ''), source = await readFile(resolve(directory, file), 'utf8');
    const expected = inspectHTML(source), response = await get(path), body = await response.text();
    const issues = inspectDeliveredHTML({ path, status: response.status, headers: response.headers, body, noindex: expected.noindex });
    if (body !== source) issues.push('html-bytes-changed');
    (expected.noindex ? drafts : indexed).add(TARGET + path);
    row('page', path, issues, { status: response.status, noindex: expected.noindex });
  }
  const sitemapURLs = new Set();
  async function sitemap(path) {
    if (visited.has(path)) throw Error('Cyclic sitemap'); visited.add(path);
    const response = await get(path), text = await response.text(), parsed = parseSitemap(text);
    row('sitemap-status', path, response.status === 200 ? [] : ['status']);
    for (const item of parsed.records) {
      if (new URL(item.loc).origin !== TARGET) throw Error('Unexpected sitemap origin');
      if (parsed.type === 'sitemapindex') await sitemap(new URL(item.loc).pathname);
      else { if (sitemapURLs.has(item.loc)) throw Error('Duplicate sitemap URL'); sitemapURLs.add(item.loc); }
    }
  }
  await sitemap('/sitemap.xml');
  row('sitemap-membership', '/sitemap.xml', [...indexed].some(u => !sitemapURLs.has(u)) || [...drafts].some(u => sitemapURLs.has(u)) || [...sitemapURLs].some(u => !indexed.has(u)) ? ['indexable-set-differs'] : []);
  const robots = await get('/robots.txt'), robotsText = await robots.text();
  row('robots', '/robots.txt', robots.status !== 200 || /^\s*Disallow:\s*\S+/imu.test(robotsText) ? ['blocked-or-unavailable'] : []);
  for (const path of ['/tools/zzz-runtime-qa/', '/es/zzz-runtime-qa/', '/zzz-runtime-qa.html', '/_headers', '/_redirects']) {
    const response = await get(path), body = await response.text();
    row('not-found', path, response.status !== 404 || !inspectHTML(body).noindex ? ['not-a-noindex-404'] : [], { status: response.status });
  }
  for (const route of [...indexed, ...drafts]) {
    const path = new URL(route).pathname;
    if (path === '/') continue;
    const response = await get(path.slice(0, -1) + '?qa=one%20two&n=1');
    const location = response.headers.get('location');
    row('canonical-redirect', path, ![301, 307, 308].includes(response.status) || !location || new URL(location, origin).pathname !== path || new URL(location, origin).search !== '?qa=one%20two&n=1' ? ['redirect-or-query'] : [], { status: response.status, location });
  }
  for (const [file] of files) if (/^assets\/.*\.(?:m?js|css)$/u.test(file)) {
    const response = await get('/' + file, { method: 'HEAD' });
    row('asset-cache', '/' + file, response.status !== 200 || response.headers.get('cache-control') !== 'public, max-age=31536000, immutable' ? ['asset-status-or-cache'] : []);
  }
  return { scope: 'local-runtime-sample-not-production-or-tool-approval', origin, pageCount: indexed.size + drafts.size, noindexPages: drafts.size, sitemapURLs: sitemapURLs.size, checks: rows.length, rows, pass: rows.every(r => r.pass), deploymentApproved: false };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv.length !== 5) throw Error('Usage: node scripts/verify-static-delivery.mjs http://127.0.0.1:PORT/ DIRECTORY REPORT.json');
  const report = await verifyStaticDelivery({ origin: process.argv[2], directory: process.argv[3] });
  await writeFile(process.argv[4], JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ checks: report.checks, pages: report.pageCount, pass: report.pass }));
  if (!report.pass) process.exitCode = 1;
}
