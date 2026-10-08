// One-time static drafts via Google's free web translation endpoint. Never used by the site/build.
import { writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { soilEnglishCopy as source } from '../../src/growth600/locales/soil-calculator.en.mjs';

const localeKeys = Object.keys(locales);
const outputPath = new URL('../../src/growth600/locales/soil-calculator.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') {
    if (path.at(-1) !== 'copyLanguage') paths.push(path);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, [...path, String(index)]));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
  }
}
collect(source);

function setAtPath(target, path, value) {
  let parent = target;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}

function placeholders(text) { return [...text.matchAll(/\{[^{}]+\}/gu)].map((match) => match[0]); }
function targetCode(language) { return language === 'zh_tw' ? 'zh-TW' : language === 'pt' ? 'pt' : language; }

async function translateBatch(language, phrases, offset) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', targetCode(language));
  url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `UVSOIL${String(offset + index).padStart(4, '0')}X`);
  const protectedPhrases = phrases.map((phrase) => phrase.replace(/\{([^{}]+)\}/gu, (_, token, index) => `UVTOKEN${index}X${token}X`));
  url.searchParams.set('q', protectedPhrases.map((phrase, index) => `${markers[index]} ${phrase}`).join('\n'));
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`Translation request failed for ${language}: HTTP ${response.status}`);
      const text = (await response.json())?.[0]?.map((segment) => segment?.[0] ?? '').join('') ?? '';
      const lines = text.split(/\r?\n/u);
      const output = markers.map((marker, index) => {
        let value = lines.find((line) => line.includes(marker))?.replace(marker, '').trim() ?? '';
        if (!value) throw new Error(`Missing translated segment ${offset + index} (${language}).`);
        value = value.replace(/UVTOKEN(\d+)X([^X]+)X/gu, (_, _index, token) => `{${token}}`);
        if (JSON.stringify(placeholders(phrases[index]).sort()) !== JSON.stringify(placeholders(value).sort())) throw new Error(`Placeholder mismatch in ${language} item ${offset + index}.`);
        return value;
      });
      return output;
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw new Error(`Could not translate batch ${language}/${offset}.`);
}

function safeMetadata(copy) {
  const suffix = ' | UsefulVerse';
  if (!copy.title.includes('UsefulVerse')) copy.title = `${copy.name}${suffix}`;
  if (copy.title.length > 60) copy.title = `${copy.name.slice(0, 60 - suffix.length)}${suffix}`;
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  return copy;
}

if (process.argv.includes('--repair-metadata')) {
  const copies = (await import(`${outputPath.href}?repair=${Date.now()}`)).default;
  for (const copy of Object.values(copies)) safeMetadata(copy);
  await writeFile(outputPath, `// Static machine-translated drafts. The published site never calls a translation service.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
  console.log(`Normalized brand suffix and metadata for ${Object.keys(copies).length} locales; no translation requests made.`);
  process.exit(0);
}

const result = {};
for (const language of localeKeys) {
  if (language === 'en') { result.en = { ...source, copyLanguage: 'en' }; continue; }
  const translated = structuredClone(source);
  const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
  const localized = [];
  for (let offset = 0; offset < phrases.length; offset += 15) {
    localized.push(...await translateBatch(language, phrases.slice(offset, offset + 15), offset));
  }
  paths.forEach((path, index) => setAtPath(translated, path, localized[index]));
  translated.copyLanguage = language;
  // Ensure brand survives the text service and page titles fit the site's release contract.
  translated.title = translated.title.replace(/UsefulVerse/giu, 'UsefulVerse');
  result[language] = safeMetadata(translated);
  console.log(`${language}: ${phrases.length} strings`);
  await new Promise((resolve) => setTimeout(resolve, 250));
}

const moduleText = `// Static machine-translated drafts. The published site never calls a translation service.\nexport default Object.freeze(${JSON.stringify(result)});\n`;
await writeFile(outputPath, moduleText);
console.log(`Wrote soil calculator drafts for ${localeKeys.length} locales.`);
