// One-time static Google Translate drafts; the published tool never calls a translation service.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { workOrderGeneratorEnglishCopy as source } from '../../src/growth600/locales/work-order-generator.en.mjs';

const target = new URL('../../src/growth600/locales/work-order-generator.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt', 'materialsFormat', 'laborFormat'].includes(path.at(-1))) paths.push(path);
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(targetObject, path, value) {
  let parent = targetObject;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function targetCode(language) {
  return language === 'zh_tw' ? 'zh-TW' : language === 'pt' ? 'pt-BR' : language;
}
function normalize(copy, language) {
  copy.fields.materialsFormat = `${copy.fields.description} | ${copy.fields.quantity} | ${copy.fields.unit}`;
  copy.fields.laborFormat = `${copy.fields.activity} | ${copy.fields.hours}`;
  const suffix = ' | UsefulVerse';
  if (language !== 'en') {
    copy.title = `${Array.from(copy.name).slice(0, 60 - suffix.length).join('')}${suffix}`;
    if (copy.description.length > 160) {
      const trimmed = Array.from(copy.description).slice(0, 157).join('');
      copy.description = `${trimmed.replace(/\s+\S*$/u, '')}…`;
    }
    copy.localizationStatus = 'machine-accepted';
    copy.localizationAcceptedBy = 'site-owner';
    copy.localizationAcceptedAt = '2026-10-09';
  } else copy.localizationStatus = 'approved';
  copy.copyLanguage = language;
  return copy;
}
collect(source);

async function translate(language, phrases) {
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', targetCode(language));
  url.searchParams.set('dt', 't');
  const rows = phrases.map((phrase) => {
    const tokens = [];
    let text = phrase.replace(/\{([a-z][a-zA-Z0-9]*)\}/gu, (match) => {
      const token = `UVWOTOKEN${tokens.length}X`;
      tokens.push([token, match]);
      return token;
    });
    text = text.replaceAll('|', ' UVWOPIPEX ');
    if (text.includes('|')) {
      const marker = `UVWOPIPE${tokens.filter(([token]) => token.startsWith('UVWOPIPE')).length}X`;
      tokens.push([marker, '|']);
      text = text.replaceAll('|', ` ${marker} `);
    }
    return { text, tokens };
  });
  for (const { text } of rows) url.searchParams.append('q', text);
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Google Translate request failed for ${language}: HTTP ${response.status}`);
      const translatedText = await response.json();
      if (!Array.isArray(translatedText) || translatedText.length !== rows.length) throw new Error(`Google Translate returned an unexpected response for ${language}`);
      return rows.map(({ tokens }, index) => {
        let value = typeof translatedText[index] === 'string' ? translatedText[index].trim() : '';
        for (const [token, original] of tokens) {
          const expected = rows[index].text.split(token).length - 1;
          const actual = value.split(token).length - 1;
          if (actual !== expected) {
            console.warn(`Translation changed a protected format token; keeping source string ${language}/${start + index}.`);
            return phrases[index];
          }
          value = value.replaceAll(token, original);
        }
        return value || phrases[index];
      });
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

const copies = {};
const pathsToTranslate = paths;
const phrases = pathsToTranslate.map((path) => path.reduce((value, key) => value[key], source));
const localeKeys = Object.keys(locales);
for (const language of localeKeys) {
  if (language === 'en') {
    copies.en = normalize(structuredClone(source), 'en');
    continue;
  }
  const draft = structuredClone(source);
  const translated = [];
  let batch = [];
  let size = 0;
  let start = 0;
  for (const [index, phrase] of phrases.entries()) {
    const estimated = phrase.length + 24;
    if (batch.length && size + estimated > 950) {
      translated.push(...await translate(language, batch, start));
      start += batch.length;
      batch = [];
      size = 0;
    }
    batch.push(phrase);
    size += estimated;
    if (index === phrases.length - 1 && batch.length) translated.push(...await translate(language, batch, start));
  }
  pathsToTranslate.forEach((path, index) => setAtPath(draft, path, translated[index] || phrases[index]));
  copies[language] = normalize(draft, language);
  console.log(`${language}: translated ${phrases.length} strings`);
}

await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} locale drafts (${phrases.length} source strings each).`);
