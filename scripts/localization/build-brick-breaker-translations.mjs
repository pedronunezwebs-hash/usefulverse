import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { brickBreakerEnglish } from '../../src/markets-no-ch/brick-breaker-copy-en.mjs';

const checkpoint = '/private/tmp/usefulverse-brick-breaker-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const generic = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, result = []) => { if (typeof value === 'string') result.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, result)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result)); return result; };
const sources = [...new Set(flatten(brickBreakerEnglish).filter((text) => !generic.has(text)))];
const captures = JSON.parse(await readFile(checkpoint, 'utf8')); const dictionaries = {};
const privacyAnswer = 'No. The game runs in this browser. Your best score is saved locally only when you choose Save best score.';
for (const locale of locales) {
  const pack = captures[locale];
  if (!pack || Object.keys(pack).length !== sources.length) throw new Error(`${locale}: missing translation strings`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => {
    let translated = pack[`Q${String(index).padStart(4, '0')}`]?.trim();
    // Google Translate's accessibility tree occasionally appends its result-tab index
    // to this final sentence (e.g. “. 70”). It contains no intended numeric content.
    if (source === privacyAnswer) translated = translated?.replace(/\s+\d{2,3}$/u, '').trim();
    if (!translated || /UVBRK\d{4}X|AXWebArea|127\.0\.0\.1|Focused UI element/iu.test(translated)) throw new Error(`${locale}: invalid translation at ${index}`);
    return [source, translated];
  }));
}
await writeFile(new URL('../../src/markets-no-ch/brick-breaker-translations.mjs', import.meta.url), `// Static Google Translate UI drafts. The published page does not translate at runtime.\nexport const brickBreakerTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Built ${locales.length} static locale dictionaries × ${sources.length} unique strings.`);
