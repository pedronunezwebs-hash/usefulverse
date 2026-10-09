// One-time static drafts; the published calculator never contacts a translation service.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { abTestEnglishCopy as source } from '../../src/growth600/locales/a-b-test-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/a-b-test-calculator.mjs', import.meta.url);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const titleOverrides = {
  es: 'Calculadora A/B gratis e ilimitada | UsefulVerse',
  ca: 'Calculadora A/B gratuïta i il·limitada | UsefulVerse',
  ru: 'Бесплатный калькулятор A/B-тестов | UsefulVerse',
  pl: 'Darmowy kalkulator testów A/B bez limitu | UsefulVerse',
  uk: 'Безкоштовний калькулятор A/B-тесту | UsefulVerse',
  vi: 'Máy tính A/B miễn phí, không giới hạn | UsefulVerse',
  tl: 'Libreng A/B test calculator, walang limit | UsefulVerse',
  ha: 'Kalkuleta gwajin A/B kyauta kuma marar iyaka | UsefulVerse',
};
const localeCode = (key) => targetCodes[key] ?? key.replace('_', '-');
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function normalize(copy) {
  const brand = ' | UsefulVerse';
  const available = 60 - [...brand].length;
  const rawTitle = String(copy.title).split('|', 1)[0].trim();
  let prefix = [...rawTitle].slice(0, available).join('').trimEnd();
  if ([...rawTitle].length > available) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${brand}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}…`;
  return copy;
}
collect(source);

async function translate(locale, phrases, offset) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', localeCode(locale)); url.searchParams.set('dt', 't');
  for (const phrase of phrases) url.searchParams.append('q', phrase);
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Google Translate failed for ${locale}: HTTP ${response.status}`);
  const values = await response.json();
  if (!Array.isArray(values) || values.length !== phrases.length) throw new Error(`Unexpected translation response for ${locale} near string ${offset}.`);
  return values.map((value, index) => typeof value === 'string' && value.trim() ? value.trim() : phrases[index]);
}

if (process.argv.includes('--fix-titles')) {
  const { default: existing } = await import(new URL(`../../src/growth600/locales/a-b-test-calculator.mjs?repair=${Date.now()}`, import.meta.url));
  for (const [locale, title] of Object.entries(titleOverrides)) existing[locale].title = title;
  existing.ar.actions.reset = 'مسح';
  await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(existing)});\n`);
  console.log(`Repaired ${Object.keys(titleOverrides).length} localized titles without new translation requests.`);
  process.exit(0);
}

const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
const copies = {};
for (const locale of Object.keys(locales)) {
  const copy = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 8) translated.push(...await translate(locale, phrases.slice(start, start + 8), start));
    paths.forEach((path, index) => setAtPath(copy, path, translated[index]));
    copy.localizationStatus = 'machine-accepted';
    copy.localizationAcceptedBy = 'site-owner';
    copy.localizationAcceptedAt = '2026-10-09';
  }
  copy.copyLanguage = locale;
  copies[locale] = normalize(copy);
  console.log(`${locale}: ${phrases.length} strings`);
}
await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} static locale copies.`);
