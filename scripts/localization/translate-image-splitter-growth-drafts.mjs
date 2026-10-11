// One-time static Google Translate drafts. Published pages make no translation requests.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { imageSplitterEnglishCopy as source } from '../../src/growth600/locales/image-splitter.en.mjs';

const target = new URL('../../src/growth600/locales/image-splitter-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function truncate(text, limit) { return text.length <= limit ? text : `${text.slice(0, limit - 1).replace(/\s+\S*$/u, '')}…`; }
function normalize(copy) {
  const suffix = ' | UsefulVerse';
  const title = copy.title.replace(/\s*[|｜]\s*UsefulVerse.*$/iu, '').trim();
  copy.title = `${truncate(title, 60 - suffix.length)}${suffix}`;
  copy.description = truncate(copy.description, 160);
  return copy;
}
collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));

async function translate(locale, group, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = group.map((_, index) => `987654${String(start + index).padStart(4, '0')}456789`);
  url.searchParams.set('q', group.map((text, index) => `${markers[index]} ${text.replaceAll('UsefulVerse', 'UVBRANDTOKENX')}`).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Google Translate failed for ${locale}: HTTP ${response.status}`);
  const translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
  return markers.map((marker, index) => {
    const begin = translated.indexOf(marker);
    const next = markers.slice(index + 1).map((nextMarker) => translated.indexOf(nextMarker, begin + marker.length)).find((position) => position >= 0) ?? translated.length;
    return (begin < 0 ? '' : translated.slice(begin + marker.length, next).trim()).replaceAll('UVBRANDTOKENX', 'UsefulVerse') || group[index];
  });
}

const result = {};
for (const locale of Object.keys(locales)) {
  const copy = structuredClone(source);
  if (locale !== 'en') {
    for (let start = 0; start < phrases.length; start += 8) {
      const translated = await translate(locale, phrases.slice(start, start + 8), start);
      translated.forEach((value, index) => setAtPath(copy, paths[start + index], value));
    }
    copy.localizationStatus = 'machine-accepted'; copy.localizationAcceptedBy = 'site-owner'; copy.localizationAcceptedAt = '2026-10-11';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = locale;
  result[locale] = normalize(copy);
  await writeFile(target, `// Static machine-translated drafts; no translation runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  console.log(`${locale}: translated ${phrases.length} strings`);
}
console.log(`Wrote ${Object.keys(result).length} localized static copies.`);
