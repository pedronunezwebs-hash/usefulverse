import { readFile, writeFile } from 'node:fs/promises';
import { dewPointEnglish } from '../../src/markets-no-ch/dew-point-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const [inputPath, outputPath = 'src/markets-no-ch/dew-point-translations.mjs'] = process.argv.slice(2);
if (!inputPath) throw new Error('Usage: node scripts/localization/build-dew-point-translations.mjs <capture.json> [output.mjs]');
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const sourceStrings = [...new Set(flatten(dewPointEnglish).filter((value) => !genericEnglish.has(value)))];
const captures = JSON.parse(await readFile(inputPath, 'utf8'));
const expectedLocales = Object.keys(translationsByLocale).filter((key) => key !== 'en').sort();
if (JSON.stringify(Object.keys(captures).sort()) !== JSON.stringify(expectedLocales)) throw new Error(`Expected ${expectedLocales.length} complete locales.`);
const ids = sourceStrings.map((_, index) => `Q${String(index).padStart(3, '0')}`);
const translations = {};
for (const locale of expectedLocales) {
  const pack = captures[locale];
  const missing = ids.filter((id) => typeof pack[id] !== 'string' || !pack[id].trim());
  const extra = Object.keys(pack).filter((id) => !ids.includes(id));
  if (missing.length || extra.length) throw new Error(`${locale}: missing ${missing.join(', ') || 'none'}; extra ${extra.join(', ') || 'none'}`);
  translations[locale] = Object.fromEntries(ids.map((id, index) => [
    sourceStrings[index],
    pack[id].trim().replace(/^⟧\s*/u, ''),
  ]));
}
await writeFile(outputPath, `const translations = ${JSON.stringify(translations, null, 2)};\nfor (const pack of Object.values(translations)) Object.freeze(pack);\n\nexport const dewPointTranslationsByLocale = Object.freeze(translations);\n`);
console.log(`Wrote ${outputPath}: ${expectedLocales.length} locales × ${sourceStrings.length} strings.`);
