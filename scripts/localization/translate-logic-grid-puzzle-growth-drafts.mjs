// One-time, static Google Translate drafts. No translation service runs on the website.
import { rename, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { logicGridPuzzleEnglishCopy as source } from '../../src/growth600/locales/logic-grid-puzzle.en.mjs';

const output = new URL('../../src/growth600/locales/logic-grid-puzzle-final.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage' && path.at(-1) !== 'localizationStatus') paths.push(path); }
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
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `QZLOGIC${(start + index).toString(36).toUpperCase()}XQZ`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n'));
  const response = await fetch(url, { signal: AbortSignal.timeout(45_000) });
  if (!response.ok) throw new Error(`Google Translate returned HTTP ${response.status}`);
  const translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
  return Promise.all(markers.map(async (marker, index) => {
    const begin = translated.indexOf(marker); const end = begin < 0 ? -1 : translated.indexOf(marker, begin + marker.length);
    let value = begin >= 0 && end >= 0 ? translated.slice(begin + marker.length, end).trim() : '';
    value = value.replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    if (!value) {
      const fallbackUrl = new URL('https://translate.googleapis.com/translate_a/single');
      fallbackUrl.searchParams.set('client', 'gtx'); fallbackUrl.searchParams.set('sl', 'en'); fallbackUrl.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); fallbackUrl.searchParams.set('dt', 't'); fallbackUrl.searchParams.set('q', phrases[index]);
      const fallbackResponse = await fetch(fallbackUrl, { signal: AbortSignal.timeout(45_000) });
      if (fallbackResponse.ok) value = ((await fallbackResponse.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
      if (!value && phrases[index].length <= 40) value = phrases[index];
      if (!value) throw new Error(`Empty translation for ${locale}, phrase ${start + index}`);
    }
    return value;
  }));
}

collect(source);
let result = { en: { ...structuredClone(source), localizationStatus: 'approved' } };
try { result = { ...result, ...(await import(`${output.href}?resume=${Date.now()}`)).default }; } catch {}
for (const locale of Object.keys(locales)) {
  if (locale === 'en' || result[locale]) continue;
  const copy = structuredClone(source);
  const values = paths.map((path) => get(path));
  for (let start = 0; start < values.length;) {
    let end = start; let length = 0;
    while (end < values.length && length + values[end].length + 48 <= 4_400) { length += values[end].length + 48; end += 1; }
    if (end === start) throw new Error(`One string exceeds the translation request limit: ${start}`);
    const chunk = await translate(locale, values.slice(start, end), start);
    chunk.forEach((value, index) => set(paths[start + index], value, copy));
    start = end;
  }
  copy.fields.categoryGroups[0].values = source.fields.categoryGroups[0].values;
  const suffix = ' | UsefulVerse';
  const title = copy.title.replace(/\s*[|｜]\s*UsefulVerse.*$/iu, '').trim();
  copy.title = `${truncate(title, 60 - suffix.length)}${suffix}`;
  copy.description = truncate(copy.description, 160);
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-11';
  result[locale] = copy;
  const interim = new URL(`${output.href}.tmp`);
  await writeFile(interim, `// Generated one-time translation drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  await rename(interim, output);
  console.log(`Translated ${locale}`);
}
for (const copy of Object.values(result)) {
  for (const key of ['hintSame', 'hintDifferent']) {
    const tokens = [...copy.messages[key].matchAll(/\{[^{}]+\}/gu)];
    copy.messages[key] = tokens.length === 2
      ? copy.messages[key].replace(/\{[^{}]+\}/gu, (match) => match === tokens[0][0] ? '{left}' : '{right}')
      : source.messages[key];
  }
}
const freeTitleWords = {
  en: 'Free', es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis',
  hi: 'मुफ़्त', ar: 'مجانا', zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí',
  it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratuït', nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo',
  sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bure', mr: 'मोफत', te: 'ఉచితం', ha: 'kyauta', tl: 'libre', ta: 'இலவசம்',
  fa: 'رایگان', am: 'ነፃ', gu: 'મફત',
};
for (const [locale, copy] of Object.entries(result)) {
  const suffix = ' | UsefulVerse';
  const phrase = `${copy.name} ${freeTitleWords[locale] ?? 'Free'}`;
  copy.title = `${phrase.slice(0, 60 - suffix.length).trim()}${suffix}`;
}
Object.assign(result.ar.fields, {
  same: 'مطابقة', different: 'لا تطابق', unmarked: 'غير محدد',
  sameMark: 'تم تحديده كتطابق', differentMark: 'تم تحديده كغير مطابق',
  difficulty: 'الصعوبة',
});
Object.assign(result.ar.actions, { checkBoard: 'تحقق من اللوحة', easy: 'سهل', medium: 'متوسط', hard: 'صعب', rules: 'كيفية اللعب' });
Object.assign(result.ar.messages, {
  unmarked: 'تمت إزالة العلامة.', markedSame: 'تم وضع علامة تطابق.', markedDifferent: 'تم وضع علامة عدم تطابق.',
  hintSame: 'تلميح: {left} يطابق {right}.', hintDifferent: 'تلميح: {left} لا يطابق {right}.',
});
const finalTemp = new URL(`${output.href}.tmp`);
await writeFile(finalTemp, `// Generated one-time translation drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
await rename(finalTemp, output);
console.log(`Wrote ${Object.keys(result).length} locale copies to ${output.pathname}`);
