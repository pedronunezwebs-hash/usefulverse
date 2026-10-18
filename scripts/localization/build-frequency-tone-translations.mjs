import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { frequencyToneEnglish } from '../../src/markets-no-ch/frequency-tone-generator-copy-en.mjs';

const checkpoint = '/private/tmp/usefulverse-frequency-tone-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const flatten = (value, result = []) => { if (typeof value === 'string') result.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, result)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result)); return result; };
const generic = new Set(Object.keys(translationsByLocale.es));
const sources = [...new Set(flatten(frequencyToneEnglish).filter((value) => !generic.has(value)))];
const displayNames = { nb: 'Tonegenerator', sv: 'Frekvensgenerator', tl: 'Tagagawa ng Tono ng Dalas' };
const captures = JSON.parse(await readFile(checkpoint, 'utf8')); const dictionaries = {};
for (const locale of locales) {
  const pack = captures[locale];
  if (!pack || Object.keys(pack).length !== sources.length) throw new Error(`${locale}: missing translation strings.`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => {
    let value = pack[`Q${String(index).padStart(4, '0')}`]?.trim();
    if (!value || /UVFT\d{4}X|AXWebArea|127\.0\.0\.1|Focused UI element/iu.test(value)) throw new Error(`${locale}: invalid translation row ${index}.`);
    for (const token of source.match(/UsefulVerse|\b(?:WAV|PCM|Hz|Web Audio|Nyquist|RIFF)\b/gu) ?? []) if (!value.includes(token)) value = `${value} (${token})`;
    return [source, value];
  }));
  if (displayNames[locale]) dictionaries[locale][frequencyToneEnglish.name] = displayNames[locale];
}
await writeFile(new URL('../../src/markets-no-ch/frequency-tone-generator-translations.mjs', import.meta.url), `// Static Google Translate UI drafts; published pages do not call a translation service.\nexport const frequencyToneTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Built ${locales.length} static frequency-tone dictionaries × ${sources.length} unique strings.`);
