// One-time Google Translate drafts; generated files are static and never call this service at runtime.
import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { inductorCalculatorEnglishCopy } from '../../src/growth600/locales/inductor-calculator.en.mjs';
import { centripetalForceCalculatorEnglishCopy } from '../../src/growth600/locales/centripetal-force-calculator.en.mjs';
import torqueCalculatorCopies from '../../src/growth600/locales/torque-calculator.mjs';
import { writingTrackerEnglishCopy } from '../../src/growth600/locales/writing-tracker.en.mjs';
import { aesEncryptionToolEnglishCopy } from '../../src/growth600/locales/aes-encryption-tool.en.mjs';

const jobs = [
  ['inductor-calculator', inductorCalculatorEnglishCopy],
  ['centripetal-force-calculator', centripetalForceCalculatorEnglishCopy],
  ['writing-tracker', writingTrackerEnglishCopy],
  ['aes-encryption-tool', aesEncryptionToolEnglishCopy],
];
const omitted = new Set(['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt', 'title']);
const freeWord = { es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis', hi: 'मुफ़्त', ar: 'مجانا', zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí', it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratuït', nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo', sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bure', mr: 'मोफत', te: 'ఉచితం', ha: 'kyauta', tl: 'libre', ta: 'இலவசம்', fa: 'رایگان', am: 'ነፃ', gu: 'મફત' };
const clean = (value) => value.replaceAll('UVBRANDTOKENX', 'UsefulVerse').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').trim();
function collect(value, path = [], output = []) {
  if (typeof value === 'string') { if (!omitted.has(path.at(-1))) output.push({ path, value }); }
  else if (Array.isArray(value)) value.forEach((child, index) => collect(child, [...path, String(index)], output));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key], output);
  return output;
}
function assign(target, path, value) {
  let parent = target;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value; else parent[path.at(-1)] = value;
}
function short(value, max) { const chars = Array.from(value); return chars.length <= max ? value : `${chars.slice(0, max - 1).join('').replace(/\s+\S*$/u, '')}…`; }
function titleFor(name, locale) {
  const suffix = ' | UsefulVerse';
  return `${short(`${name} ${freeWord[locale] ?? 'free'}`, 60 - Array.from(suffix).length)}${suffix}`;
}
async function translateBatch(locale, values, baseIndex) {
  const target = locale === 'zh_tw' ? 'zh-TW' : locale === 'tl' ? 'fil' : locale;
  const markers = values.map((_, i) => `QZUV${(baseIndex + i).toString(36).toUpperCase()}ZQ`);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, val] of Object.entries({ client: 'dict-chrome-ex', sl: 'en', tl: target, dt: 't' })) url.searchParams.set(key, val);
  url.searchParams.set('q', values.map((value, i) => `${markers[i]} ${value.replaceAll('UsefulVerse', 'UVBRANDTOKENX')} ${markers[i]}`).join('\n'));
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(25_000) });
      if (!response.ok) throw new Error(`Translator returned HTTP ${response.status} for ${locale}`);
      break;
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 700));
    }
  }
  const joined = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('');
  return markers.map((marker, index) => {
    const start = joined.indexOf(marker); const end = start < 0 ? -1 : joined.indexOf(marker, start + marker.length);
    const translated = start >= 0 && end >= 0 ? clean(joined.slice(start + marker.length, end)) : '';
    return translated || clean(values[index].replaceAll('UsefulVerse', 'UVBRANDTOKENX'));
  });
}
for (const [slug, source] of jobs.filter(([name]) => !process.argv[2] || process.argv[2] === name)) {
  const strings = collect(source);
  const output = { en: { ...structuredClone(source), copyLanguage: 'en', localizationStatus: 'approved' } };
  for (const { key: locale } of localeEntries) {
    if (locale === 'en') continue;
    const draft = structuredClone(source);
    if (slug === 'centripetal-force-calculator') draft.fields.inches = torqueCalculatorCopies[locale].fields.inches;
    for (let start = 0; start < strings.length;) {
      let end = start; let chars = 0;
      while (end < strings.length && chars + strings[end].value.length + 44 <= 1_500) { chars += strings[end].value.length + 44; end += 1; }
      if (end === start) throw new Error(`${slug}: a source string exceeds the translation batch size`);
      const translated = await translateBatch(locale, strings.slice(start, end).map(({ value }) => value), start);
      translated.forEach((value, index) => assign(draft, strings[start + index].path, value));
      start = end;
    }
    draft.name = draft.name || source.name;
    draft.title = titleFor(draft.name, locale);
    draft.description = short(draft.description, 155);
    draft.copyLanguage = locale; draft.localizationStatus = 'machine-accepted'; draft.localizationAcceptedBy = 'site-owner'; draft.localizationAcceptedAt = '2026-10-12';
    output[locale] = draft;
    process.stdout.write(`${slug}: ${locale}\n`);
  }
  await writeFile(new URL(`../../src/growth600/locales/${slug}-final.mjs`, import.meta.url), `// One-time static machine translations; no runtime translation requests.\nexport default Object.freeze(${JSON.stringify(output)});\n`);
}
