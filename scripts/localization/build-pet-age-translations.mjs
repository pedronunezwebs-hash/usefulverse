import { readFile, writeFile } from 'node:fs/promises';
import { english } from '../../src/markets-no-ch/copy-en.mjs';

const capturePath = new URL('../../pet-age-translation-captures.json', import.meta.url);
const outputPath = new URL('../../src/markets-no-ch/pet-age-translations.mjs', import.meta.url);
const captured = JSON.parse(await readFile(capturePath, 'utf8'));
const pet = english.petAge;
const sourceStrings = [
  pet.name,
  pet.title,
  pet.description,
  pet.intro,
  ...Object.values(pet.fields),
  pet.example,
  pet.details,
  ...pet.faq.flatMap(({ q, a }) => [q, a]),
];

if (sourceStrings.length !== 44) throw new Error(`Expected 44 English source strings; received ${sourceStrings.length}.`);

const translations = {};
for (const [locale, rows] of Object.entries(captured)) {
  if (!Array.isArray(rows) || rows.length !== sourceStrings.length || rows.some((row) => typeof row !== 'string' || !row.trim())) {
    throw new Error(`Invalid ${locale} capture: expected 44 non-empty strings.`);
  }
  translations[locale] = Object.fromEntries(sourceStrings.map((source, index) => [source, rows[index].trim()]));
}

const file = `// Free machine-translation drafts; review locale-specific wording before production.\nexport const petAgeTranslationsByLocale = Object.freeze(${JSON.stringify(translations, null, 2)});\n`;
await writeFile(outputPath, file);
console.log(`Generated ${Object.keys(translations).length} locale dictionaries with 44 mapped strings each.`);
