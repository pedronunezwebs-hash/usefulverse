// One-time Google Translate drafts for static publication; no translation API runs on the website.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { markdownEditorEnglishCopy as source } from '../../src/growth600/locales/markdown-editor.en.mjs';

const output = new URL('../../src/growth600/locales/markdown-editor-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt'].includes(path.at(-1))) paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function get(path) { return path.reduce((parent, key) => parent[key], source); }
function set(path, value, object) {
  let parent = object;
  for (const key of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(key)] : parent[key];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function truncate(value, limit) { return value.length <= limit ? value : `${value.slice(0, limit - 1).replace(/\s+\S*$/u, '')}…`; }
async function translate(locale, phrases, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `QZMD${(start + index).toString(36).toUpperCase()}XQZ`);
  const protectedPhrases = phrases.map((phrase) => phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX').replaceAll('Markdown', 'UVMARKDOWNTOKENX'));
  url.searchParams.set('q', protectedPhrases.map((phrase, index) => `${markers[index]} ${phrase} ${markers[index]}`).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(45_000) });
  if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status}`);
  const translated = ((await response.json())?.[0] ?? []).map((part) => Array.isArray(part?.[0]) ? part[0][0] : (part?.[0] ?? '')).join('');
  return Promise.all(markers.map(async (marker, index) => {
    const begin = translated.indexOf(marker); const end = begin < 0 ? -1 : translated.indexOf(marker, begin + marker.length);
    let value = begin >= 0 && end >= 0 ? translated.slice(begin + marker.length, end).trim() : '';
    if (!value) {
      const single = new URL('https://translate.googleapis.com/translate_a/single');
      for (const [key, item] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: locale === 'zh_tw' ? 'zh-TW' : locale, dt: 't', q: protectedPhrases[index] })) single.searchParams.set(key, item);
      const singleResponse = await fetch(single, { signal: AbortSignal.timeout(45_000) });
      if (!singleResponse.ok) throw new Error(`Google Translate fallback returned HTTP ${singleResponse.status}`);
      value = ((await singleResponse.json())?.[0] ?? []).map((part) => Array.isArray(part?.[0]) ? part[0][0] : (part?.[0] ?? '')).join('');
    }
    const result = value.replaceAll('UVBRANDTOKENX', 'UsefulVerse').replaceAll('UVMARKDOWNTOKENX', 'Markdown').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    if (!result) throw new Error(`Translation empty for ${locale}, phrase ${start + index}`);
    return result;
  }));
}

collect(source);
const result = { en: { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' } };
try { Object.assign(result, (await import(`${output.href}?resume=${Date.now()}`)).default); } catch {}
const free = { en: 'Free', es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis', hi: 'मुफ़्त', ar: 'مجانا', zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí', it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratuït', nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo', sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bure', mr: 'मोफत', te: 'ఉచితం', ha: 'kyauta', tl: 'libre', ta: 'இலவசம்', fa: 'رایگان', am: 'ነፃ', gu: 'મફત' };
for (const { key: locale } of localeEntries) {
  if (locale === 'en' || result[locale]) continue;
  const copy = structuredClone(source);
  const pathsToTranslate = paths.filter((path) => path.at(-1) !== 'title');
  const values = pathsToTranslate.map(get);
  for (let start = 0; start < values.length;) {
    let end = start; let length = 0;
    while (end < values.length && length + values[end].length + 48 <= 4_400) { length += values[end].length + 48; end += 1; }
    if (end === start) throw new Error(`One string exceeds Google Translate request chunk limit: ${start}`);
    const chunk = await translate(locale, values.slice(start, end), start);
    chunk.forEach((value, index) => set(pathsToTranslate[start + index], value, copy));
    start = end;
  }
  const suffix = ' | UsefulVerse';
  copy.title = truncate(`${copy.name} ${free[locale] ?? 'Free'}${suffix}`, 60);
  copy.description = truncate(copy.description.replace(/\s+/gu, ' ').trim(), 160);
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-11';
  result[locale] = copy;
  const interim = new URL(`${output.href}.tmp`);
  await writeFile(interim, `// Generated one-time Google Translate drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  await rename(interim, output);
  console.log(`Translated ${locale}`);
}
for (const { key: locale } of localeEntries.filter(({ key }) => key !== 'en')) {
  if (!result[locale]) throw new Error(`Missing generated locale ${locale}`);
}
Object.assign(result.es, { name: 'Editor de texto Markdown' });
Object.assign(result.fr, { name: 'Éditeur de texte Markdown' });
Object.assign(result.pt, { name: 'Editor de texto Markdown' });
Object.assign(result.el, { name: 'Επεξεργαστής Markdown' });
Object.assign(result.ms, { name: 'Penyunting Markdown' });
Object.assign(result.pl, { name: 'Edytor Markdown' });
Object.assign(result.sw, { name: 'Kihariri cha Markdown' });
Object.assign(result.fa, { name: 'ویرایشگر Markdown' });
for (const { key: locale } of localeEntries.filter(({ key }) => key !== 'en')) result[locale].title = truncate(`${result[locale].name} ${free[locale] ?? 'Free'} | UsefulVerse`, 60);
await writeFile(new URL(`${output.href}.tmp`), `// Generated one-time Google Translate drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
await rename(new URL(`${output.href}.tmp`), output);
