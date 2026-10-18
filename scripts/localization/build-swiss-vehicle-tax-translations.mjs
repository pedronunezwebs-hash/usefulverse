// Assemble static translations captured manually from the Google Translate UI.
// This script is fully offline: it makes no network request and no API call.
import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { swissVehicleTaxEnglish } from '../../src/markets-no-ch/switzerland-vehicle-tax-copy-en.mjs';

const checkpointPath = '/private/tmp/usefulverse-swiss-vehicle-tax-translations.json';
const outputPath = new URL('../../src/markets-no-ch/switzerland-vehicle-tax-translations.mjs', import.meta.url);
const expectedLocales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(swissVehicleTaxEnglish))];
const sourceTokens = (text) => text.match(/\{[^}]+\}|https?:\/\/\S+/gu) ?? [];
const checkpoint = JSON.parse(await readFile(checkpointPath, 'utf8'));
if (JSON.stringify(Object.keys(checkpoint).sort()) !== JSON.stringify(expectedLocales)) {
  throw new Error(`Expected exactly ${expectedLocales.length} locale captures; found ${Object.keys(checkpoint).length}.`);
}

const dictionaries = {};
for (const locale of expectedLocales) {
  const pack = checkpoint[locale];
  const ids = sources.map((_, index) => `Q${String(index).padStart(4, '0')}`);
  const missing = ids.filter((id) => typeof pack?.[id] !== 'string' || !pack[id].trim());
  const extra = Object.keys(pack ?? {}).filter((id) => !ids.includes(id));
  if (missing.length || extra.length) throw new Error(`${locale}: ${missing.length} missing, ${extra.length} extra strings.`);

  const dictionary = Object.fromEntries(sources.map((source, index) => {
    let translated = pack[ids[index]].trim();
    const placeholders = source.match(/\{[^}]+\}/gu) ?? [];
    if (placeholders.length) {
      const translatedPlaceholders = translated.match(/\{[^}]+\}/gu) ?? [];
      for (const placeholder of translatedPlaceholders) translated = translated.replace(placeholder, placeholders.shift());
    }
    return [source, translated];
  }));
  if (locale === 'tl' && dictionary[swissVehicleTaxEnglish.name] === swissVehicleTaxEnglish.name) {
    dictionary[swissVehicleTaxEnglish.name] = 'Calculator ng Paghahambing ng Buwis sa Sasakyan sa Switzerland';
  }
  if (dictionary[swissVehicleTaxEnglish.title] === swissVehicleTaxEnglish.title) throw new Error(`${locale}: page title remains English.`);
  if (dictionary[swissVehicleTaxEnglish.name] === swissVehicleTaxEnglish.name) throw new Error(`${locale}: page name remains English.`);
  for (const [source, translated] of Object.entries(dictionary)) {
    if (/UVTV\d{4}X|AXWebArea|Focused UI element|127\.0\.0\.1|Translation results available/iu.test(translated)) {
      throw new Error(`${locale}: browser/debug residue in “${source}”.`);
    }
    for (const token of sourceTokens(source)) {
      if (!translated.includes(token)) throw new Error(`${locale}: lost protected token ${token} in “${source}”.`);
    }
  }
  dictionaries[locale] = dictionary;
}

await writeFile(outputPath, `// Static Google Translate drafts; no translation service is called at runtime.\nexport const swissVehicleTaxTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Wrote ${expectedLocales.length} static locale packs × ${sources.length} strings to ${outputPath.pathname}.`);
