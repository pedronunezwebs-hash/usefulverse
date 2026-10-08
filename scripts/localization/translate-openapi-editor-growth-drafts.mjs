// Static Google Translate drafts; the published site does not call a translation service.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { openApiEditorEnglishCopy as source } from '../../src/growth600/locales/openapi-editor.en.mjs';

const target = new URL('../../src/growth600/locales/openapi-editor.mjs', import.meta.url);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', tl: 'tl', sw: 'sw', ha: 'ha', fa: 'fa', am: 'am', gu: 'gu', mr: 'mr', te: 'te', ur: 'ur', bn: 'bn', hi: 'hi', ar: 'ar', zh: 'zh-CN' };
const localeCode = (key) => targetCodes[key] ?? (key === 'pt-br' ? 'pt' : key.replace('_', '-'));
const tokenPrefix = 'UVOPENAPI';
const strings = [];
function collect(value, path = []) {
  if (typeof value === 'string') strings.push({ path, value });
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, index]));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => collect(item, [...path, key]));
}
collect(source);
const paths = strings.map(({ path }) => path);
const phrases = strings.map(({ value }) => value);
function put(root, path, value) { const last = path.at(-1); const parent = path.slice(0, -1).reduce((node, key) => node[key], root); parent[last] = value; }
function normalize(copy) {
  const brand = ' | UsefulVerse';
  const titleText = String(copy.title || copy.name);
  const prefix = titleText.split(/\s*\|\s*UsefulVerse/iu)[0].trim();
  copy.title = `${[...prefix].slice(0, 60 - [...brand].length).join('').trim()}${brand}`;
  copy.description = [...String(copy.description).replace(/\s+/gu, ' ').trim()].slice(0, 160).join('');
  copy.localizationStatus = 'machine-accepted';
  return copy;
}
async function translate(language, batch) {
  const rows = batch.map((phrase, index) => {
    const tokens = [];
    const text = phrase.replace(/\b(?:OpenAPI|JSON|YAML|HTTP|API|MIT|JSON Pointer|SPL)\b|\$ref|\{count\}/gu, (match) => {
      const token = `${tokenPrefix}${index}X${tokens.length}END`;
      tokens.push([token, match]);
      return token;
    });
    return { text, tokens };
  });
  const url = new URL('https://clients5.google.com/translate_a/t');
  url.searchParams.set('client', 'dict-chrome-ex'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', localeCode(language)); url.searchParams.set('dt', 't');
  for (const { text } of rows) url.searchParams.append('q', text);
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`Translation request failed for ${language}: HTTP ${response.status}`);
  const values = await response.json();
  if (!Array.isArray(values) || values.length !== rows.length) throw new Error(`Unexpected translation response for ${language}.`);
  return values.map((value, index) => {
    let result = typeof value === 'string' ? value.trim() : '';
    for (const [token, original] of rows[index].tokens) {
      if (result.split(token).length - 1 !== rows[index].text.split(token).length - 1) return batch[index];
      result = result.replaceAll(token, original);
    }
    return result || batch[index];
  });
}
const copies = {};
for (const language of Object.keys(locales)) {
  if (language === 'en') { copies.en = normalize(structuredClone(source)); continue; }
  const translated = [];
  for (let start = 0; start < phrases.length; start += 8) translated.push(...await translate(language, phrases.slice(start, start + 8)));
  const draft = structuredClone(source);
  paths.forEach((path, index) => put(draft, path, translated[index]));
  copies[language] = normalize(draft);
  console.log(`${language}: translated ${phrases.length} strings`);
}
await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} locale drafts (${phrases.length} source strings each).`);
