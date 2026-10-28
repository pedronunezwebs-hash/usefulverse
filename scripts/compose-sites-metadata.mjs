const XML = 'http://www.sitemaps.org/schemas/sitemap/0.9';
export const TARGET = 'https://usefulverse.com';
const OLD_HOSTS = ['tools.usefulverse.com', 'draft-300-noindex.usefulverse-tools.pages.dev'];
export const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
export function unescape(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/giu, (_, code) => {
    if (code[0] === '#') return String.fromCodePoint(parseInt(code.slice(code[1].toLowerCase() === 'x' ? 2 : 1), code[1].toLowerCase() === 'x' ? 16 : 10));
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[code.toLowerCase()];
  });
}
export function normalizeURL(value) {
  if (/(?:^|\/)\.{1,2}(?:\/|$)|%|\\/u.test(value)) throw Error('Unsafe route path');
  const url = new URL(unescape(value));
  if (![TARGET, ...OLD_HOSTS.map(h => `https://${h}`)].includes(url.origin) || url.username || url.password || url.search || url.hash) throw Error(`Unexpected sitemap/canonical URL: ${value}`);
  if (!/^(?:\/[a-z\d_.-]+)*\/?$/iu.test(url.pathname) || url.pathname.split('/').some(p => p === '.' || p === '..')) throw Error('Unsafe route path');
  return TARGET + url.pathname;
}
export function rewriteOrigins(text) {
  for (const host of OLD_HOSTS) {
    const escaped = host.replaceAll('.', '\\.');
    text = text.replace(new RegExp(`https:\\/\\/${escaped}(?=[/\\s"'<>?#)\\]]|$)`, 'gu'), TARGET);
  }
  return text;
}
export function hasOldHost(text) { return OLD_HOSTS.some(host => text.includes(host)); }
export function attribute(tag, name) {
  const matches = [...tag.matchAll(new RegExp(`(?:\\s|^)${name}\\s*=\\s*(["'])(.*?)\\1`, 'gisu'))];
  if (matches.length > 1) throw Error(`Duplicate ${name} attribute`);
  return matches[0] ? unescape(matches[0][2]) : undefined;
}
export function inspectHTML(html) {
  const metas = html.match(/<meta\b[^>]*>/giu) ?? [];
  const links = html.match(/<link\b[^>]*>/giu) ?? [];
  const canonical = links.filter(tag => attribute(tag, 'rel')?.toLowerCase() === 'canonical');
  const noindex = metas.some(tag => attribute(tag, 'name')?.toLowerCase() === 'robots' && /(?:^|[\s,])noindex(?:$|[\s,])/iu.test(attribute(tag, 'content') ?? ''));
  return { noindex, canonical: canonical.length === 1 ? normalizeURL(attribute(canonical[0], 'href')) : null,
    language: attribute(html.match(/<html\b[^>]*>/iu)?.[0] ?? '', 'lang'),
    alternates: links.filter(tag => attribute(tag, 'rel')?.toLowerCase() === 'alternate' && attribute(tag, 'hreflang')).map(tag => normalizeURL(attribute(tag, 'href'))),
    title: unescape((html.match(/<h1\b[^>]*>([^<]*)<\/h1>/iu) ?? [])[1] ?? ''),
    description: attribute(metas.find(tag => attribute(tag, 'name')?.toLowerCase() === 'description') ?? '', 'content') ?? '' };
}
export function parseSitemap(text) {
  if (/<!/u.test(text)) throw Error('Sitemap declarations/entities are not supported');
  const source = text.replace(/^\s*<\?xml[^?]*\?>/u, '').trim();
  const outer = source.match(/^<(urlset|sitemapindex)\s+xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']\s*>([\s\S]*)<\/\1>$/u);
  if (!outer) throw Error('Invalid sitemap XML');
  const type = outer[1], tag = type === 'urlset' ? 'url' : 'sitemap';
  const records = [];
  let remainder = outer[2].replace(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'gu'), (_, body) => {
    const item = {};
    const rest = body.replace(/<(loc|lastmod|changefreq|priority)>([^<]*)<\/\1>/gu, (_, key, value) => {
      if (Object.hasOwn(item, key) || /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/iu.test(value)) throw Error('Invalid/duplicate sitemap field');
      item[key] = unescape(value); return '';
    });
    if (rest.trim() || !item.loc || type === 'sitemapindex' && Object.keys(item).some(k => !['loc', 'lastmod'].includes(k))) throw Error('Invalid sitemap entry');
    records.push(item); return '';
  });
  if (remainder.trim()) throw Error('Unparsed sitemap markup');
  return { type, records };
}
export function sitemapXML(records, index = false) {
  const root = index ? 'sitemapindex' : 'urlset', tag = index ? 'sitemap' : 'url';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${root} xmlns="${XML}">\n${records.map(record => `  <${tag}>${Object.entries(record).map(([key, value]) => `<${key}>${xml(value)}</${key}>`).join('')}</${tag}>`).join('\n')}\n</${root}>\n`;
}

function headerRules(text) {
  const rules = new Map(); let current;
  for (const line of text.split(/\r?\n/u)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/u.test(line)) {
      const path = line.trim().replace(/^\/\*\/tools\//u, '/:locale/tools/');
      if (!path.startsWith('/') || (path.match(/\*/gu) ?? []).length > 1 || rules.has(path)) throw Error('Unsupported/duplicate header path');
      current = { set: new Map(), unset: new Set() }; rules.set(path, current);
    } else {
      if (!current || line.length > 2000) throw Error('Invalid header rule');
      const unset = line.trim().match(/^! ([\w-]+)$/u);
      if (unset) { current.unset.add(unset[1].toLowerCase()); continue; }
      const field = line.trim().match(/^([\w-]+):\s*(.+)$/u);
      if (!field || current.set.has(field[1].toLowerCase())) throw Error('Invalid/duplicate header');
      current.set.set(field[1].toLowerCase(), field[2]);
    }
  }
  return rules;
}
export function mergeHeaders(main, hub, preview) {
  const base = headerRules(main), extra = headerRules(hub), draft = headerRules(preview);
  for (const rules of [base, extra]) if (/noindex/iu.test(rules.get('/*')?.set.get('x-robots-tag') ?? '')) throw Error('Global noindex on existing tools is forbidden');
  for (const rules of [base, extra]) for (const rule of rules.values()) if (/noindex/iu.test(rule.set.get('x-robots-tag') ?? '')) throw Error('HTTP noindex on an existing build requires manual review');
  // The draft's HTTP noindex must not become a site-wide rule. Every draft HTML
  // page is independently required to retain its own robots noindex meta tag.
  for (const rule of draft.values()) rule.set.delete('x-robots-tag');
  const serialize = rules => [...rules].map(([path, rule]) => [path, [...rule.set], [...rule.unset]]);
  if (JSON.stringify(serialize(draft)) !== JSON.stringify(serialize(extra))) throw Error('Draft security headers differ from the hub profile');
  for (const [path, rule] of extra) {
    const target = base.get(path) ?? { set: new Map(), unset: new Set() }; base.set(path, target);
    for (const [name, value] of rule.set) {
      // Do not add a global cache value which would be comma-joined with more
      // specific HTML/asset rules. Workers' ordinary asset defaults remain.
      if (name === 'cache-control' && path === '/*') continue;
      const previous = target.set.get(name);
      if (name === 'x-frame-options' && path === '/*' && [previous, value].every(v => ['DENY', 'SAMEORIGIN', undefined].includes(v))) target.set.set(name, 'DENY');
      else if (previous && previous !== value) throw Error(`Unreviewed header conflict: ${path} ${name}`);
      else target.set.set(name, value);
    }
    for (const name of rule.unset) target.unset.add(name);
  }
  for (const [path, rule] of base) {
    if (path !== '/assets/*' && rule.set.has('cache-control') && !/no-store|private/iu.test(rule.set.get('cache-control'))) rule.set.set('cache-control', 'public, max-age=0, must-revalidate');
  }
  // The former hub permitted user-consented geolocation for weather-dashboard.
  // Preserve that capability without relaxing the main site's global policy.
  for (const path of ['/tools/weather-dashboard/*', '/:locale/tools/weather-dashboard/*']) {
    const rule = base.get(path) ?? { set: new Map(), unset: new Set() };
    rule.unset.add('permissions-policy'); base.set(path, rule);
  }
  if (base.size > 100) throw Error('Static header rule budget exceeded');
  const output = [...base].map(([path, rule]) => `${path}\n${[...rule.unset].map(name => `  ! ${name}\n`).join('')}${[...rule.set].map(([name, value]) => `  ${name}: ${value}\n`).join('')}`).join('\n');
  if (output.split('\n').some(line => line.length > 2000)) throw Error('Static header line budget exceeded');
  return output;
}

export function mergeRedirects(texts) {
  const rules = new Map();
  for (const text of texts) for (const raw of text.split(/\r?\n/u)) {
    const line = raw.trim(); if (!line || line.startsWith('#')) continue;
    const fields = rewriteOrigins(line).split(/\s+/u);
    if (fields.length < 2 || fields.length > 3 || !fields[0].startsWith('/') || !['301', '302', '303', '307', '308'].includes(fields[2] ?? '302')) throw Error('Unsupported redirect/rewrite');
    const value = fields.slice(1).join(' ');
    if (rules.has(fields[0]) && rules.get(fields[0]) !== value) throw Error('Conflicting redirects');
    rules.set(fields[0], value);
  }
  const dynamic = [...rules].filter(([path]) => /[*:]/u.test(path));
  if (dynamic.length > 100 || rules.size - dynamic.length > 2000) throw Error('Static redirect budget exceeded');
  const output = [...rules].sort(([a], [b]) => Number(/[*:]/u.test(a)) - Number(/[*:]/u.test(b))).map(([path, value]) => `${path} ${value}`).join('\n');
  if (output.split('\n').some(line => line.length > 1000)) throw Error('Redirect line budget exceeded');
  return output && output + '\n';
}
