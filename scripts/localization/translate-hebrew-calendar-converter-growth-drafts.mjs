// One-time Google Translate draft generation. The published tool has no runtime translation service.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { hebrewCalendarConverterEnglishCopy as source } from '../../src/growth600/locales/hebrew-calendar-converter.en.mjs';

const output = new URL('../../src/growth600/locales/hebrew-calendar-converter-final.mjs', import.meta.url);
const metadata = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt']);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (!metadata.has(path.at(-1)) && path.at(-1) !== 'title') paths.push(path); }
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
function makeTitle(name, freeLabel) {
  const suffix = ' | UsefulVerse';
  return `${truncate(`${name} ${freeLabel}`, 60 - Array.from(suffix).length)}${suffix}`;
}
async function translate(locale, phrases, offset) {
  const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't' })) url.searchParams.set(key, value);
  const markers = phrases.map((_, index) => `QZHC${(offset + index).toString(36).toUpperCase()}XQZ`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n'));
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
    if (!value) value = phrases[index].replaceAll('UsefulVerse', 'UVBRANDTOKENX');
    value = value.replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    if (!value) throw new Error(`Empty translation for ${locale}, text ${offset + index}`);
    return value;
  });
}

collect(source);
let result = { en: { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' } };
try { result = { ...result, ...(await import(`${output.href}?resume=${Date.now()}`)).default }; } catch {}
result.en = { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' };
const free = { es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis', hi: 'मुफ़्त', ar: 'مجانا', zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí', it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratuït', nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo', sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bure', mr: 'मोफत', te: 'ఉచితం', ha: 'kyauta', tl: 'libre', ta: 'இலவசம்', fa: 'رایگان', am: 'ነፃ', gu: 'મફત' };
for (const { key: locale } of localeEntries) {
  if (locale === 'en') continue;
  if (result[locale]?.copyLanguage === locale && result[locale]?.localizationStatus === 'machine-accepted'
    && result[locale]?.howQuestion && result[locale]?.additionalFaqs?.length === source.additionalFaqs.length) continue;
  const copy = structuredClone(source);
  const pathsToTranslate = paths.filter((path) => !(path[0] === 'fields' && ['commonMonths', 'leapMonths'].includes(path[1])));
  const values = pathsToTranslate.map(get);
  for (let start = 0; start < values.length;) {
    let end = start; let length = 0;
    while (end < values.length && length + values[end].length + 48 <= 4_400) { length += values[end].length + 48; end += 1; }
    if (end === start) throw new Error(`String at ${start} exceeds translation chunk limit`);
    const translated = await translate(locale, values.slice(start, end), start);
    translated.forEach((value, index) => set(pathsToTranslate[start + index], value, copy));
    start = end;
  }
  copy.title = makeTitle(copy.name, free[locale] ?? 'Free');
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
const smallFixes = {
  ar: { actions: { reset: 'إعادة تعيين' } },
  de: { actions: { reset: 'Zurücksetzen' } },
  ja: { actions: { convert: '日付を変換' } },
  bn: { actions: { reset: 'আবার সেট করুন' } },
  ur: { actions: { reset: 'دوبارہ ترتیب دیں' } },
  tr: { actions: { reset: 'Sıfırla' } },
  vi: { actions: { result: 'Kết quả chuyển đổi' } },
  nl: { actions: { reset: 'Opnieuw instellen' } },
  sv: { name: 'Hebreisk kalenderomvandlare', privacyQuestion: 'Laddas mina datum upp?', actions: { example: 'Prova ett exempel' }, messages: { copyUnavailable: 'Kopiering är inte tillgänglig i den här webbläsaren.' }, fields: { direction: 'Konverteringsriktning', gregorianToHebrew: 'Gregoriansk till hebreisk', gregorianDate: 'Gregorianskt datum', hebrewDate: 'Hebreiskt datum', hebrewYear: 'Hebreiskt år (AM)', hebrewDay: 'Hebreisk dag', yearType: 'Hebreiskt skottår' } },
  sw: { name: 'Kibadilishaji cha Kalenda ya Kiebrania', fields: { leapNo: 'Hapana' } },
  mr: { actions: { reset: 'रीसेट करा' } },
  te: { actions: { reset: 'రీసెట్ చేయి', example: 'ఒక ఉదాహరణను ప్రయత్నించండి' } },
  ha: { actions: { reset: 'Sake saita' }, fields: { direction: 'Hanyar juyawa' } },
  tl: { name: 'Tagapagpalit ng Kalendaryong Hebreo', fields: { gregorianDate: 'Petsa ng Gregorian', gregorianInput: 'Petsa ng Gregorian', hebrewYear: 'Taon ng Hebreo (AM)', yearType: 'Taon ng paglukso ng Hebreo' } },
  ta: { actions: { reset: 'மீட்டமை' } },
  fa: { name: 'مبدل تقویم عبری' },
  am: { actions: { reset: 'ዳግም አስጀምር' }, fields: { leapNo: 'አይ' } },
  gu: { actions: { reset: 'ફરીથી સેટ કરો' } },
};
for (const [locale, patch] of Object.entries(smallFixes)) {
  const copy = result[locale];
  for (const section of ['actions', 'messages', 'fields']) if (patch[section]) copy[section] = { ...copy[section], ...patch[section] };
  if (patch.name) copy.name = patch.name;
  if (patch.privacyQuestion) copy.privacyQuestion = patch.privacyQuestion;
  if (patch.name || patch.actions) copy.title = makeTitle(copy.name, free[locale] ?? 'Free');
}
for (const { key } of localeEntries) if (!result[key]) throw new Error(`Missing translation for ${key}`);
await writeFile(new URL(`${output.href}.tmp`), `// One-time Google Translate drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
await rename(new URL(`${output.href}.tmp`), output);
