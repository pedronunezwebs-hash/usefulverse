// One-time Google Translate drafts. Visitors use only the generated static copy.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { weekNumberCalculatorEnglishCopy as source } from '../../src/growth600/locales/week-number-calculator.en.mjs';

const output = new URL('../../src/growth600/locales/week-number-calculator-final.mjs', import.meta.url);
const excluded = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt']);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (!excluded.has(path.at(-1)) && path.at(-1) !== 'title') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function get(path) { return path.reduce((parent, key) => parent[key], source); }
function set(path, value, object) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function truncate(value, max) { return Array.from(value).length <= max ? value : `${Array.from(value).slice(0, max - 1).join('').replace(/\s+\S*$/u, '')}…`; }
function makeTitle(name, freeWord) {
  const suffix = ' | UsefulVerse';
  return `${truncate(`${name} ${freeWord}`, 60 - Array.from(suffix).length)}${suffix}`;
}
const free = { es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis', hi: 'मुफ़्त', ar: 'مجانا', zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí', it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratuït', nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo', sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bure', mr: 'मोफत', te: 'ఉచితం', ha: 'kyauta', tl: 'libre', ta: 'இலவசம்', fa: 'رایگان', am: 'ነፃ', gu: 'મફત' };
async function translate(locale, phrases, offset) {
  const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't' })) url.searchParams.set(key, value);
  const markers = phrases.map((_, index) => `QZWN${(offset + index).toString(36).toUpperCase()}ZQ`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n'));
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${locale}`);
      break;
    } catch (error) { if (attempt === 3) throw error; await new Promise((resolve) => setTimeout(resolve, attempt * 800)); }
  }
  const translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
  return await Promise.all(markers.map(async (marker, index) => {
    const begin = translated.indexOf(marker); const end = begin < 0 ? -1 : translated.indexOf(marker, begin + marker.length);
    let value = (begin >= 0 && end >= 0 ? translated.slice(begin + marker.length, end) : '').trim()
      .replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    if (!value) {
      const single = new URL('https://translate.googleapis.com/translate_a/single');
      for (const [key, setting] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't', q: phrases[index].replaceAll('UsefulVerse', 'UVBRANDTOKENX') })) single.searchParams.set(key, setting);
      const fallbackResponse = await fetch(single, { signal: AbortSignal.timeout(20_000) });
      if (!fallbackResponse.ok) throw new Error(`Fallback translation HTTP ${fallbackResponse.status} for ${locale}`);
      value = ((await fallbackResponse.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('')
        .replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    }
    if (!value) throw new Error(`Translation missing for ${locale}, string ${offset + index}`);
    return value;
  }));
}

collect(source);
const pathsToTranslate = paths;
const values = pathsToTranslate.map(get);
const result = { en: { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' } };
for (const { key: locale } of localeEntries) {
  if (locale === 'en') continue;
  const copy = structuredClone(source);
  for (let start = 0; start < values.length;) {
    let end = start; let length = 0;
    while (end < values.length && length + values[end].length + 44 <= 4_400) { length += values[end].length + 44; end += 1; }
    if (end === start) throw new Error(`String at ${start} exceeds translation limit`);
    const batch = await translate(locale, values.slice(start, end), start);
    for (let index = 0; index < batch.length; index += 1) {
      let value = batch[index];
      if (value === values[start + index]) {
        const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
        const url = new URL('https://translate.googleapis.com/translate_a/single');
        for (const [key, setting] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't', q: value.replaceAll('UsefulVerse', 'UVBRANDTOKENX') })) url.searchParams.set(key, setting);
        const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
        if (!response.ok) throw new Error(`Fallback translation HTTP ${response.status} for ${locale}`);
        const parts = (await response.json())?.[0] ?? [];
        const fallback = parts.map((part) => part?.[0] ?? '').join('').replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').trim();
        if (fallback) value = fallback;
      }
      set(pathsToTranslate[start + index], value, copy);
    }
    start = end;
  }
  copy.title = makeTitle(copy.name, free[locale] ?? 'Free');
  copy.description = truncate(copy.description.replace(/\s+/gu, ' ').trim(), 160);
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-12';
  result[locale] = copy;
  const temporary = new URL(`${output.href}.tmp`);
  await writeFile(temporary, `// One-time Google Translate copy; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  await rename(temporary, output);
  console.log(`Translated ${locale}`);
}
for (const { key } of localeEntries) if (!result[key]) throw new Error(`Missing copy for ${key}`);
