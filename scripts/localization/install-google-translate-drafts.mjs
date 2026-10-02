import { readFile, writeFile } from 'node:fs/promises';
import { expandedLocaleTitleFixes, expandedLocaleUiFixes } from '../../src/locales/expanded-locale-review.mjs';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR ?? '/tmp/usefulverse-local-translation-20261001';
const input = JSON.parse(await readFile(`${directory}/draft-input.json`, 'utf8'));
const rows = (await readFile(`${directory}/google-translate-output.jsonl`, 'utf8'))
  .split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
const translations = new Map();
for (const row of rows) translations.set(`${row.language}:${row.unitId}`, row.translation);

const counts = (text, pattern) => text.match(pattern)?.length ?? 0;
const placeholders = /\{[A-Za-z][A-Za-z0-9_]*\}/gu;
const urls = /https?:\/\/[^\s<>]+/gu;
const installed = {};

function materialize(value, language) {
  if (Array.isArray(value)) return value.map((item) => materialize(item, language));
  if (!value || typeof value !== 'object') return value;
  if (Object.hasOwn(value, '$translate')) {
    const source = input.targets[language].units[value.$translate];
    const translated = translations.get(`${language}:${value.$translate}`);
    if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Missing translation: ${language}/${value.$translate}`);
    if (counts(source, placeholders) !== counts(translated, placeholders)) throw new Error(`Placeholder mismatch: ${language}/${value.$translate}`);
    if (/UV(?:R[A-F0-9]{8}|KEEP\d{4}X)/u.test(translated)) throw new Error(`Unrestored marker: ${language}/${value.$translate}`);
    if (counts(source, urls) !== counts(translated, urls)) throw new Error(`URL count mismatch: ${language}/${value.$translate}`);
    if (Object.hasOwn(value, '$count')) {
      const localizedCount = new Intl.NumberFormat(input.targets[language].pack.meta.code, { useGrouping: false }).format(value.$count);
      const digits = [...localizedCount].filter((character) => /\p{N}/u.test(character));
      const groupedNumber = digits.map((digit) => digit.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')).join('[\\p{P}\\p{Zs}]*');
      return translated.replace(new RegExp(`(?<!\\p{N})${groupedNumber}(?!\\p{N})`, 'gu'), '{count}');
    }
    return translated;
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, materialize(item, language)]));
}

for (const [language, target] of Object.entries(input.targets)) {
  const missing = Object.keys(target.units).filter((unitId) => !translations.has(`${language}:${unitId}`));
  if (missing.length) throw new Error(`${language}: ${missing.length} translations missing; first: ${missing[0]}`);
  let pack = materialize(target.pack, language);

  // Retain the small, already-reviewed usability corrections from this worktree.
  for (const [toolId, title] of Object.entries(expandedLocaleTitleFixes[language] ?? {})) {
    if (pack.copy[toolId]) pack.copy[toolId][0] = title;
  }
  Object.assign(pack.ui, expandedLocaleUiFixes[language] ?? {});
  Object.assign(pack.runtimeMessages, expandedLocaleUiFixes[language] ?? {});

  const destination = `src/locales/${language}/index.mjs`;
  await writeFile(destination, `export const pack = ${JSON.stringify(pack, null, 2)};\n`);
  installed[language] = { units: Object.keys(target.units).length, translatedRows: rows.filter((row) => row.language === language).length };
}

const summaryPath = `${directory}/google-translate-install-summary.json`;
await writeFile(summaryPath, `${JSON.stringify(installed, null, 2)}\n`);
console.log(JSON.stringify({ installed, summaryPath }, null, 2));
