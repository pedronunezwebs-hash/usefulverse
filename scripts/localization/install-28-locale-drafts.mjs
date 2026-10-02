import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const defaultDirectory = '/tmp/usefulverse-local-translation-20261001';
const files = process.argv.slice(2).length
  ? process.argv.slice(2).map(resolve)
  : ['it', 'zh_tw', 'bg', 'ca', 'nl', 'el', 'ms', 'pl', 'sv', 'th', 'uk', 'sw'].map((language) => `${defaultDirectory}/draft-${language}.json`);
const repository = resolve(new URL('../..', import.meta.url).pathname);
const packs = {};

for (const file of files) Object.assign(packs, JSON.parse(await readFile(file, 'utf8')));

function replaceSampleCount(text, count, language) {
  const formatted = new Intl.NumberFormat(language.replace('_', '-'), { useGrouping: false }).format(count);
  for (const token of new Set([String(count), formatted])) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
    const match = text.match(new RegExp(`(?<!\\d)${escaped}(?!\\d)`, 'u'));
    if (match) return text.replace(match[0], '{count}');
  }
  throw new Error(`Plural draft lost sample count ${count} (${language}): ${text}`);
}

function materialize(value, language) {
  if (Array.isArray(value)) return value.map((item) => materialize(item, language));
  if (value && typeof value === 'object') {
    if (Object.hasOwn(value, '$value')) {
      const text = String(value.$value);
      return Object.hasOwn(value, '$count') ? replaceSampleCount(text, value.$count, language) : text;
    }
    const result = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, materialize(item, language)]));
    if (Object.hasOwn(result, '$translate')) throw new Error(`Unresolved translation marker: ${result.$translate}`);
    return result;
  }
  return value;
}

for (const [language, rawPack] of Object.entries(packs)) {
  const pack = materialize(rawPack, language);
  const path = resolve(repository, `src/locales/${language}/index.mjs`);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `export const pack = ${JSON.stringify(pack, null, 2)};\n`, 'utf8');
  console.log(`${language}: wrote ${Object.keys(pack.copy).length} tool copies, ${Object.keys(pack.ui).length} UI entries and ${pack.guides.length} guides.`);
}
