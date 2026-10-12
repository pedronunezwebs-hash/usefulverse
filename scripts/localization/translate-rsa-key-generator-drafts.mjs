// One-time Google Translate drafts; output is static and is never translated at runtime.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { rsaKeyGeneratorEnglishCopy as source } from '../../src/growth600/locales/rsa-key-generator.en.mjs';

const output = new URL('../../src/growth600/locales/rsa-key-generator-final.mjs', import.meta.url);
const metadata = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt']);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!metadata.has(path.at(-1)) && path.at(-1) !== 'title') paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function get(path) { return path.reduce((parent, key) => parent[key], source); }
function set(path, value, object) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function truncate(value, limit) { return value.length <= limit ? value : `${value.slice(0, limit - 1).replace(/\s+\S*$/u, '')}…`; }
function targetFor(locale) { return locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale; }
async function translate(locale, phrases, offset) {
  const markers = phrases.map((_, index) => `QZRSA${(offset + index).toString(36).toUpperCase()}ZQ`);
  const query = phrases.map((phrase, index) => `${markers[index]} ${phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n');
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: targetFor(locale), dt: 't', q: query })) url.searchParams.set(key, value);
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}`);
      break;
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 800));
    }
  }
  const joined = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
  return markers.map((marker, index) => {
    const begin = joined.indexOf(marker); const end = begin < 0 ? -1 : joined.indexOf(marker, begin + marker.length);
    const translated = begin >= 0 && end >= 0 ? joined.slice(begin + marker.length, end).trim() : '';
    return (translated || phrases[index]).replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
  });
}

collect(source);
const pathsToTranslate = paths;
const values = pathsToTranslate.map(get);
const free = { es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis', hi: 'मुफ़्त', ar: 'مجانا', zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí', it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratuït', nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo', sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bure', mr: 'मोफत', te: 'ఉచితం', ha: 'kyauta', tl: 'libre', ta: 'இலவசம்', fa: 'رایگان', am: 'ነፃ', gu: 'મફત' };
const result = { en: { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' } };
for (const { key: locale } of localeEntries) {
  if (locale === 'en') continue;
  const copy = structuredClone(source);
  for (let start = 0; start < values.length;) {
    let end = start; let length = 0;
    while (end < values.length && length + values[end].length + 44 <= 4_400) { length += values[end].length + 44; end += 1; }
    if (end === start) throw new Error(`String at ${start} exceeds translation chunk limit`);
    const translated = await translate(locale, values.slice(start, end), start);
    translated.forEach((value, index) => set(pathsToTranslate[start + index], value, copy));
    start = end;
  }
  const suffix = ` | UsefulVerse`;
  const localizedTitle = `${truncate(`${copy.name} ${free[locale] ?? 'Free'}`, 60 - suffix.length)}${suffix}`;
  copy.title = localizedTitle;
  copy.description = truncate(copy.description.replace(/\s+/gu, ' ').trim(), 160);
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-12';
  result[locale] = copy;
  const temp = new URL(`${output.href}.tmp`);
  await writeFile(temp, `// One-time Google Translate drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  await rename(temp, output);
  console.log(`Translated ${locale}`);
}
for (const { key } of localeEntries) if (!result[key]) throw new Error(`Missing translation for ${key}`);
