import { readFile, writeFile } from 'node:fs/promises';
import { natalChartEnglish } from '../../src/markets-no-ch/natal-chart-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-natal-chart-translation-checkpoint.json';
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(natalChartEnglish).filter((text) => !genericEnglish.has(text)))];
const locales = Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort();
const packs = JSON.parse(await readFile(checkpointPath, 'utf8'));
if (JSON.stringify(Object.keys(packs).sort()) !== JSON.stringify(locales)) throw new Error('Translation checkpoint does not contain all 36 non-English locales.');
const dictionaries = {};
for (const locale of locales) {
  const pack = packs[locale];
  const ids = sources.map((_, index) => `Q${String(index).padStart(4, '0')}`);
  const missing = ids.filter((id) => typeof pack[id] !== 'string' || !pack[id].trim());
  const extra = Object.keys(pack).filter((id) => !ids.includes(id));
  if (missing.length || extra.length) throw new Error(`${locale}: missing ${missing.length} or extra ${extra.length} translations.`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => [source, pack[ids[index]].trim()]));
  if (Object.values(dictionaries[locale]).some((text) => /[⟦⟧]|UVNCX\d{4}X/u.test(text))) throw new Error(`${locale}: leaked translation marker.`);
}
const target = new URL('../../src/markets-no-ch/natal-chart-translations.mjs', import.meta.url);
await writeFile(target, `// Static machine translations. The website never calls a translation service at runtime.\nexport const natalChartTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Wrote ${locales.length} locale packs × ${sources.length} distinct strings to ${target.pathname}.`);
