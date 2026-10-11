// One-time Google Translate drafts; no translation service runs on the deployed site.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { waistToHipRatioEnglishCopy as source } from '../../src/growth600/locales/waist-to-hip-ratio-calculator.en.mjs';

const output = new URL('../../src/growth600/locales/waist-to-hip-ratio-calculator-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path);
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
function boundedTitle(name, freeLabel) {
  const suffix = ' | UsefulVerse';
  const available = 60 - Array.from(suffix).length;
  const prefix = truncate(`${name} ${freeLabel}`, available);
  return `${prefix}${suffix}`;
}
async function translate(locale, phrases, offset) {
  const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't' })) url.searchParams.set(key, value);
  const markers = phrases.map((_, index) => `QZWH${(offset + index).toString(36).toUpperCase()}XQZ`);
  const protectedPhrases = phrases.map((phrase) => phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX'));
  url.searchParams.set('q', protectedPhrases.map((phrase, index) => `${markers[index]} ${phrase} ${markers[index]}`).join('\n'));
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}`);
      break;
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
    }
  }
  const translated = ((await response.json())?.[0] ?? []).map((part) => Array.isArray(part?.[0]) ? part[0][0] : (part?.[0] ?? '')).join('');
  return markers.map((marker, index) => {
    const begin = translated.indexOf(marker); const end = begin < 0 ? -1 : translated.indexOf(marker, begin + marker.length);
    let value = begin >= 0 && end >= 0 ? translated.slice(begin + marker.length, end).trim() : '';
    if (!value) value = protectedPhrases[index];
    value = value.replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    if (!value) throw new Error(`Empty translation for ${locale} phrase ${offset + index}`);
    return value;
  });
}

collect(source);
const result = { en: { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' } };
try { Object.assign(result, (await import(`${output.href}?resume=${Date.now()}`)).default); } catch {}
result.en = { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' };
const free = { es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis', hi: 'मुफ़्त', ar: 'مجانا', zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí', it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratuït', nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo', sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bure', mr: 'मोफत', te: 'ఉచితం', ha: 'kyauta', tl: 'libre', ta: 'இலவசம்', fa: 'رایگان', am: 'ነፃ', gu: 'મફત' };
for (const { key: locale } of localeEntries) {
  if (locale === 'en') continue;
  if (result[locale]?.copyLanguage === locale && result[locale]?.localizationStatus === 'machine-accepted' && result[locale]?.howQuestion && result[locale]?.additionalFaqs?.length === source.additionalFaqs.length) continue;
  const copy = result[locale] ? structuredClone(result[locale]) : structuredClone(source);
  copy.additionalFaqs = structuredClone(source.additionalFaqs);
  const pathsToTranslate = paths.filter((path) => path.at(-1) !== 'title');
  const values = pathsToTranslate.map(get);
  for (let start = 0; start < values.length;) {
    let end = start; let length = 0;
    while (end < values.length && length + values[end].length + 48 <= 4_400) { length += values[end].length + 48; end += 1; }
    if (end === start) throw new Error(`A string exceeds the translation chunk limit at ${start}`);
    const translated = await translate(locale, values.slice(start, end), start);
    translated.forEach((value, index) => set(pathsToTranslate[start + index], value, copy));
    start = end;
  }
  copy.title = boundedTitle(copy.name, free[locale] ?? 'Free');
  copy.description = truncate(copy.description.replace(/\s+/gu, ' ').trim(), 160);
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-11';
  result[locale] = copy;
  const temp = new URL(`${output.href}.tmp`);
  await writeFile(temp, `// One-time Google Translate drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  await rename(temp, output);
  console.log(`Translated ${locale}`);
}
for (const { key } of localeEntries) if (!result[key]) throw new Error(`Missing translation for ${key}`);
await writeFile(new URL(`${output.href}.tmp`), `// One-time Google Translate drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
await rename(new URL(`${output.href}.tmp`), output);
