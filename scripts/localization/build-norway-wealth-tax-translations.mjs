import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { english } from '../../src/markets-no-ch/copy-en.mjs';

const captureUrl = new URL('../../norway-wealth-tax-translation-captures.json', import.meta.url);
const outputUrl = new URL('../../src/markets-no-ch/norway-wealth-tax-translations.mjs', import.meta.url);
const locales = [...localeEntries, { key: 'nb', name: 'Norsk bokmål' }];
const copy = english.norwayWealthTax;

function flatten(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
}

const rows = flatten(copy);
if (rows.length !== 59) throw new Error(`Expected 59 source strings, found ${rows.length}.`);
const expected = locales.filter(({ key }) => key !== 'en').map(({ key }) => key);
const captures = JSON.parse(await readFile(captureUrl, 'utf8'));
const missing = expected.filter((key) => !Array.isArray(captures[key]) || captures[key].length !== rows.length);
const unexpected = Object.keys(captures).filter((key) => !expected.includes(key));
if (missing.length || unexpected.length) throw new Error(`Capture mismatch. Missing: ${missing.join(', ') || 'none'}; unexpected: ${unexpected.join(', ') || 'none'}.`);

const dictionaries = {};
for (const locale of expected) {
  const values = captures[locale];
  const invalid = values.flatMap((value, index) => typeof value !== 'string' || !value.trim() ? [index + 1] : []);
  if (invalid.length) throw new Error(`${locale}: empty or invalid rows ${invalid.join(', ')}.`);
  dictionaries[locale] = Object.fromEntries(rows.map((source, index) => {
    const translated = values[index].replace(/(?:UVROW|UVEND)\d{3}X/gu, '').replaceAll('|', '').replace(/\s+/gu, ' ').trim();
    if (!translated) throw new Error(`${locale}: row ${index + 1} became empty after marker cleanup.`);
    return [source, translated];
  }));
}

const source = `// Static machine-translated strings. Translation is never requested at runtime.\nexport const norwayWealthTaxTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`;
await writeFile(outputUrl, source);
console.log(`Generated ${Object.keys(dictionaries).length} static dictionaries for ${rows.length} strings.`);
