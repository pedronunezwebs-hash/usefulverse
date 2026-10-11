// One-time Google Translate drafts; the published tool makes no translation requests.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { reverseMortgageCalculatorEnglishCopy as source } from '../../src/growth600/locales/reverse-mortgage-calculator.en.mjs';

const output = new URL('../../src/growth600/locales/reverse-mortgage-calculator-final.mjs', import.meta.url);
const refresh = process.argv.includes('--refresh');
const ignored = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt', 'title']);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (!ignored.has(path.at(-1))) paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function get(path, object = source) { return path.reduce((value, key) => Array.isArray(value) ? value[Number(key)] : value[key], object); }
function set(path, value, object) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function truncate(value, maximum) {
  const chars = Array.from(value);
  while (chars.join('').length > maximum) chars.pop();
  if (chars.join('') === value) return value;
  return `${chars.join('').replace(/\s+\S*$/u, '')}…`;
}
const freeWords = {
  es:'gratis',fr:'gratuit',pt:'grátis',de:'kostenlos',ja:'無料',ko:'무료',id:'gratis',hi:'मुफ़्त',ar:'مجانا',zh:'免费',bn:'বিনামূল্যে',ru:'бесплатно',ur:'مفت',tr:'ücretsiz',vi:'miễn phí',it:'gratis',zh_tw:'免費',bg:'безплатно',ca:'gratuït',nl:'gratis',el:'δωρεάν',ms:'percuma',pl:'za darmo',sv:'gratis',th:'ฟรี',uk:'безкоштовно',sw:'bure',mr:'मोफत',te:'ఉచితం',ha:'kyauta',tl:'libre',ta:'இலவசம்',fa:'رایگان',am:'ነፃ',gu:'મફત'
};
function targetLanguage(locale) { return locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale; }
function makeTitle(copy, locale) {
  const suffix = ' | UsefulVerse';
  copy.title = `${truncate(`${copy.name} ${freeWords[locale] ?? 'Free'}`, 60 - suffix.length)}${suffix}`;
}
async function translateOne(locale, phrases, offset) {
  const target = targetLanguage(locale);
  const markers = phrases.map((_, index) => `QZRMC${(offset + index).toString(36).toUpperCase()}TRZQ`);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't' })) url.searchParams.set(key, value);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n'));
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status} for ${locale}`);
      break;
    } catch (error) { if (attempt === 3) throw error; await new Promise((resolve) => setTimeout(resolve, attempt * 700)); }
  }
  const text = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
  const translated = markers.map((marker, index) => {
    const start = text.indexOf(marker); const end = start < 0 ? -1 : text.indexOf(markers[index], start + marker.length);
    return start >= 0 && end >= 0 ? text.slice(start + marker.length, end).replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim() : '';
  });
  for (let index = 0; index < translated.length; index += 1) {
    if (translated[index]) continue;
    const single = new URL('https://translate.googleapis.com/translate_a/single');
    for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't', q: phrases[index].replaceAll('UsefulVerse', 'UVBRANDTOKENX') })) single.searchParams.set(key, value);
    const fallback = await fetch(single, { signal: AbortSignal.timeout(20_000) });
    if (!fallback.ok) throw new Error(`Google Translate fallback returned HTTP ${fallback.status} for ${locale}`);
    translated[index] = ((await fallback.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    if (!translated[index]) throw new Error(`Empty translation for ${locale}, phrase ${index}`);
  }
  return translated;
}
async function writeProgress(result) {
  const temporary = new URL(`${output.href}.tmp`);
  await writeFile(temporary, `// One-time Google Translate drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  await rename(temporary, output);
}

collect(source);
const values = paths.map((path) => get(path));
const result = { en: structuredClone(source) };
try { Object.assign(result, (await import(`${output.href}?resume=${Date.now()}`)).default); } catch { /* Fresh run. */ }
result.en = structuredClone(source);
for (const { key: locale } of localeEntries) {
  if (locale === 'en') continue;
  if (!refresh && result[locale]?.copyLanguage === locale && result[locale]?.localizationStatus === 'machine-accepted') continue;
  const copy = structuredClone(source);
  for (let start = 0; start < values.length;) {
    let end = start; let size = 0;
    while (end < values.length && size + values[end].length + 48 <= 4_300) { size += values[end].length + 48; end += 1; }
    if (end === start) throw new Error(`Source phrase ${start} exceeds batch size`);
    const translated = await translateOne(locale, values.slice(start, end), start);
    translated.forEach((value, index) => set(paths[start + index], value, copy));
    start = end;
  }
  makeTitle(copy, locale);
  copy.description = truncate(copy.description.replace(/\s+/gu, ' ').trim(), 160);
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-11';
  result[locale] = copy;
  await writeProgress(result);
  console.log(`Translated ${locale}`);
}
for (const { key } of localeEntries) if (!result[key]) throw new Error(`Missing translation for ${key}`);
// Google Translate returned punctuation-only UI strings in these locales.
// Keep short one-time corrections in the local copy; no runtime service.
Object.assign(result.ar.actions, { reset: 'إعادة تعيين' });
Object.assign(result.ar.messages, { calculated: 'تم حساب السيناريو.', exampleLoaded: 'تم تحميل المثال.' });
result.el.messages.calculated = 'Το σενάριο υπολογίστηκε.';
result.ha.messages.calculated = 'An ƙididdige yanayin.';
await writeProgress(result);
