import { readFile, writeFile } from 'node:fs/promises';
import { swissWheelOffsetEnglish } from '../../src/markets-no-ch/swiss-wheel-offset-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const [inputPath, outputPath = 'src/markets-no-ch/swiss-wheel-offset-translations.mjs'] = process.argv.slice(2);
if (!inputPath) throw new Error('Usage: node scripts/localization/build-swiss-wheel-offset-translations.mjs <capture.json> [output.mjs]');
function flatten(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
}
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const sourceStrings = [...new Set(flatten(swissWheelOffsetEnglish).filter((value) => !genericEnglish.has(value)))];
const ids = sourceStrings.map((_, index) => `Q${String(index).padStart(3, '0')}`);
const captures = JSON.parse(await readFile(inputPath, 'utf8'));
const expectedLocales = [...new Set([...Object.keys(translationsByLocale).filter((locale) => locale !== 'en'), 'nb'])].sort();
const receivedLocales = Object.keys(captures).sort();
if (JSON.stringify(receivedLocales) !== JSON.stringify(expectedLocales)) throw new Error(`Locale mismatch: expected ${expectedLocales.length}; received ${receivedLocales.length}.`);
const translations = {};
for (const locale of expectedLocales) {
  const pack = captures[locale];
  const missing = ids.filter((id) => typeof pack[id] !== 'string' || !pack[id].trim());
  const extra = Object.keys(pack).filter((id) => !ids.includes(id));
  if (missing.length || extra.length) throw new Error(`${locale}: missing ${missing.join(', ') || 'none'}; unexpected ${extra.join(', ') || 'none'}`);
  translations[locale] = Object.fromEntries(ids.map((id, index) => [sourceStrings[index], pack[id].trim()]));
}
await writeFile(outputPath, `const translations = ${JSON.stringify(translations, null, 2)};\nfor (const pack of Object.values(translations)) Object.freeze(pack);\n\nexport const swissWheelOffsetTranslationsByLocale = Object.freeze(translations);\n`);
console.log(`Wrote ${outputPath}: ${expectedLocales.length} locale packs × ${sourceStrings.length} strings.`);
