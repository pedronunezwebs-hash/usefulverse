// One-time Google Translate drafts; translations are static files, never requested by visitors.
import { rename, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { specificHeatCalculatorEnglishCopy as source } from '../../src/growth600/locales/specific-heat-calculator.en.mjs';

const output = new URL('../../src/growth600/locales/specific-heat-calculator-final.mjs', import.meta.url);
const metadata = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt']);
const universalUnitLabels = new Set(['joulesPerKilogram', 'kilojoulesPerKilogram', 'joulesPerGram', 'caloriesPerGram', 'btuPerPound', 'celsius', 'fahrenheit', 'btu', 'joules', 'kilojoules', 'calories', 'kilocalories', 'grams']);
const fixedUnitLabels = Object.freeze({ kilograms: 'kg', grams: 'g', pounds: 'lb', ounces: 'oz', celsius: '°C', fahrenheit: '°F', joules: 'J', kilojoules: 'kJ', calories: 'cal', kilocalories: 'kcal' });
const fixedUnitExpressions = Object.freeze({ joulesPerKilogram: 'J/(kg·°C)', kilojoulesPerKilogram: 'kJ/(kg·°C)', joulesPerGram: 'J/(g·°C)', caloriesPerGram: 'cal/(g·°C)', btuPerPound: 'BTU/(lb·°F)', btu: 'BTU' });
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
function preserveUnitSymbols(copy) {
  for (const [key, symbol] of Object.entries(fixedUnitLabels)) {
    const label = copy.fields[key];
    const localizedName = label.replace(/\s*[（(].*[）)]\s*$/u, '').trim() || source.fields[key].replace(/\s*[（(].*[）)]\s*$/u, '').trim();
    copy.fields[key] = `${localizedName} (${symbol})`;
  }
  Object.assign(copy.fields, fixedUnitExpressions);
}
function truncate(value, limit) { return Array.from(value).length <= limit ? value : `${Array.from(value).slice(0, limit - 1).join('').replace(/\s+\S*$/u, '')}…`; }
function title(name, freeWord) {
  const suffix = ' | UsefulVerse';
  return `${truncate(`${name} ${freeWord}`, 60 - Array.from(suffix).length)}${suffix}`;
}
async function translate(locale, phrases, offset) {
  const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't' })) url.searchParams.set(key, value);
  const markers = phrases.map((_, index) => `QZSH${(offset + index).toString(36).toUpperCase()}ZQ`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${markers[index]} ${phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[index]}`).join('\n'));
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
  const translated = ((await response.json())?.[0] ?? []).map((part) => Array.isArray(part?.[0]) ? part[0][0] : (part?.[0] ?? '')).join('');
  return markers.map((marker, index) => {
    const begin = translated.indexOf(marker); const end = begin < 0 ? -1 : translated.indexOf(marker, begin + marker.length);
    let value = begin >= 0 && end >= 0 ? translated.slice(begin + marker.length, end).trim() : '';
    if (!value) value = phrases[index].replaceAll('UsefulVerse', 'UVBRANDTOKENX');
    value = value.replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
    if (!value) throw new Error(`Empty translation for ${locale}, string ${offset + index}`);
    return value;
  });
}
async function translateSingle(locale, phrase) {
  const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't', q: phrase.replaceAll('UsefulVerse', 'UVBRANDTOKENX') })) url.searchParams.set(key, value);
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`Google Translate fallback returned HTTP ${response.status} for ${locale}`);
  let value = ((await response.json())?.[0] ?? []).map((part) => Array.isArray(part?.[0]) ? part[0][0] : (part?.[0] ?? '')).join('')
    .replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
  if (locale === 'ha' && value === phrase) {
    const hausaAlternatives = {
      'Mass (m)': 'Mass quantity (m)',
      'Material 1 mass': 'Mass quantity of material 1',
      'Material 2 mass': 'Mass quantity of material 2',
      Mass: 'Mass value',
    };
    const alternative = hausaAlternatives[phrase];
    if (alternative) value = await translateSingle(locale, alternative);
  }
  if (!value) throw new Error(`Empty translation for ${locale}: ${phrase}`);
  return value;
}
function needsUiTranslation(path, value, original) {
  const visible = ['name', 'fields', 'actions', 'messages', 'additionalFaqs'].includes(path[0]);
  return visible && (value === original || (original.length > 1 && /^[\p{P}\p{S}\s]+$/u.test(value)));
}

collect(source);
const values = paths.map(get);
const result = { en: { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' } };
try {
  const previous = (await import(`${output.href}?resume=${Date.now()}`)).default;
  if (previous?.en && typeof previous === 'object') Object.assign(result, structuredClone(previous));
} catch { /* First run: there is no generated locale file to resume. */ }
result.en = { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' };
preserveUnitSymbols(result.en);
const free = { es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis', hi: 'मुफ़्त', ar: 'مجانا', zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí', it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratuït', nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo', sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bure', mr: 'मोफत', te: 'ఉచితం', ha: 'kyauta', tl: 'libre', ta: 'இலவசம்', fa: 'رایگان', am: 'ነፃ', gu: 'મફત' };
for (const { key: locale } of localeEntries) {
  if (locale === 'en') continue;
  if (result[locale]?.copyLanguage === locale && result[locale]?.localizationStatus === 'machine-accepted') {
    const copy = structuredClone(result[locale]);
    const translated = await translateSingle(locale, source.fields.solveMass);
    if (translated === source.fields.solveMass) throw new Error(`Untranslated visible copy for ${locale}: fields.solveMass`);
    copy.fields.solveMass = translated;
    preserveUnitSymbols(copy);
    copy.copyLanguage = locale;
    copy.localizationStatus = 'machine-accepted';
    copy.localizationAcceptedBy = 'site-owner';
    copy.localizationAcceptedAt = '2026-10-11';
    result[locale] = copy;
    const temp = new URL(`${output.href}.tmp`);
    await writeFile(temp, `// One-time Google Translate drafts; no runtime translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
    await rename(temp, output);
    console.log(`Updated ${locale}`);
    continue;
  }
  const copy = structuredClone(source);
  for (let start = 0; start < values.length;) {
    let end = start; let length = 0;
    while (end < values.length && length + values[end].length + 44 <= 4_400) { length += values[end].length + 44; end += 1; }
    if (end === start) throw new Error(`String at ${start} exceeds translation chunk limit`);
    const translated = await translate(locale, values.slice(start, end), start);
    for (let index = 0; index < translated.length; index += 1) {
      const path = paths[start + index]; const original = values[start + index];
      let value = translated[index];
      if (path[0] === 'fields' && universalUnitLabels.has(path[1])) value = original;
      if (needsUiTranslation(path, value, original)) value = await translateSingle(locale, original);
      if (!value || (['name', 'fields', 'actions', 'messages', 'additionalFaqs'].includes(path[0]) && value === original && !(path[0] === 'fields' && universalUnitLabels.has(path[1])))) throw new Error(`Untranslated visible copy for ${locale}: ${path.join('.')}`);
      set(path, value, copy);
    }
    start = end;
  }
  copy.title = title(copy.name, free[locale] ?? 'Free');
  copy.description = truncate(copy.description.replace(/\s+/gu, ' ').trim(), 160);
  preserveUnitSymbols(copy);
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
