import { writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { english } from '../../src/markets-no-ch/copy-en.mjs';
import { marketTools } from '../../src/markets-no-ch/catalog.mjs';

const targets = [...localeEntries, { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb' }];
const languageCode = (locale) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[locale] ?? locale;
const flatten = (value, path = '', out = {}) => {
  for (const [key, child] of Object.entries(value)) {
    const next = path ? `${path}.${key}` : key;
    if (typeof child === 'string') out[next] = child;
    else if (Array.isArray(child)) child.forEach((item, index) => flatten(item, `${next}.${index}`, out));
    else if (child && typeof child === 'object') flatten(child, next, out);
  }
  return out;
};
const toolIds = new Set(marketTools.map(({ mode }) => mode));
const commonCopy = Object.fromEntries(Object.entries(english).filter(([key]) => !toolIds.has(key)));
const sources = Object.fromEntries(marketTools.map(({ mode }) => [mode, flatten({ ...commonCopy, ...english[mode] })]));
const unitSources = [...new Set(Object.values(sources).flatMap(Object.values))];
const markerFor = (index) => `UVROW${String(index).padStart(5, '0')}X`;

async function translateBatch(language, rows, offset) {
  const text = rows.map((source, index) => `${markerFor(offset + index)}|${source}`).join('\n');
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: languageCode(language), dt: 't', q: text })) url.searchParams.set(key, value);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Google Translate HTTP ${response.status} for ${language}.`);
      const data = await response.json();
      const translated = Array.isArray(data?.[0]) ? data[0].map((part) => part?.[0] ?? '').join('') : '';
      const markerPattern = /UVROW\d{5}X\s*\|?\s*([\s\S]*?)(?=UVROW\d{5}X\s*\|?|$)/gu;
      const values = [...translated.matchAll(markerPattern)].map((match) => match[1].trim());
      if (values.length !== rows.length || values.some((value) => !value)) throw new Error(`Google Translate omitted a row in ${language}.`);
      return values;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    }
  }
  throw lastError;
}

function setPath(target, path, value) {
  const parts = path.split('.'); let current = target;
  for (const part of parts.slice(0, -1)) {
    const index = /^\d+$/u.test(part) ? Number(part) : part;
    current = current[index] ??= /^\d+$/u.test(parts[parts.indexOf(part) + 1]) ? [] : {};
  }
  const last = parts.at(-1);
  current[/^\d+$/u.test(last) ? Number(last) : last] = value;
}

const packs = { en: Object.fromEntries(marketTools.map(({ mode }) => [mode, { ...structuredClone(commonCopy), ...structuredClone(english[mode]) }])) };
for (const locale of targets.filter(({ key }) => key !== 'en')) {
  const translations = new Map();
  for (let offset = 0; offset < unitSources.length; offset += 18) {
    const rows = unitSources.slice(offset, offset + 18);
    if (rows.join('\n').length > 3600) throw new Error('Translation batch exceeded the conservative size limit.');
    const values = await translateBatch(locale.key, rows, offset);
    rows.forEach((source, index) => translations.set(source, values[index]));
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  const translatedCopies = {};
  for (const [id, copy] of Object.entries(sources)) {
    const translated = {};
    for (const [path, source] of Object.entries(copy)) setPath(translated, path, translations.get(source) ?? source);
    translatedCopies[id] = translated;
  }
  packs[locale.key] = translatedCopies;
  console.log(`${locale.key}: ${unitSources.length} distinct strings translated.`);
}

for (const [locale, copies] of Object.entries(packs)) {
  for (const [id, copy] of Object.entries(copies)) {
    const source = sources[id];
    const translated = flatten(copy);
    if (Object.keys(source).length !== Object.keys(translated).length) throw new Error(`${locale}/${id}: translation keys changed.`);
    for (const path of Object.keys(source)) if (typeof translated[path] !== 'string' || !translated[path].trim()) throw new Error(`${locale}/${id}: missing ${path}.`);
  }
}
await writeFile(new URL('../../src/markets-no-ch/copies.mjs', import.meta.url), `// Machine-translated static copy. Google Translate is not called by the published pages.\nexport const copies = Object.freeze(${JSON.stringify(packs)});\n`);
console.log(`Wrote ${Object.keys(packs).length} static locale packs for ${Object.keys(english).length} tools.`);
