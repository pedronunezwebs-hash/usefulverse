import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { shikakuEnglish } from '../../src/markets-no-ch/shikaku-copy-en.mjs';

const checkpoint = '/private/tmp/usefulverse-shikaku-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const generic = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, result = []) => { if (typeof value === 'string') result.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, result)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result)); return result; };
const sources = [...new Set(flatten(shikakuEnglish).filter((text) => !generic.has(text)))];
const overrides = {
  tr: { [shikakuEnglish.name]: 'Shikaku Dikdörtgen Bulmacası' },
  vi: { [shikakuEnglish.name]: 'Trò chơi ô chữ hình chữ nhật Shikaku' },
};
const captures = JSON.parse(await readFile(checkpoint, 'utf8')); const dictionaries = {};
for (const locale of locales) {
  const pack = captures[locale];
  if (!pack || Object.keys(pack).length !== sources.length) throw new Error(`${locale}: missing translation strings`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => {
    const translated = pack[`Q${String(index).padStart(4, '0')}`]?.trim();
    if (!translated || /UVSHK\d{4}X|AXWebArea|127\.0\.0\.1|Focused UI element/iu.test(translated)) throw new Error(`${locale}: invalid translation at ${index}`);
    const sourceTokens = [...source.matchAll(/\{[^{}]+\}/gu)].map(([token]) => token);
    const targetTokens = [...translated.matchAll(/\{[^{}]+\}/gu)].map(([token]) => token);
    if (JSON.stringify(sourceTokens) !== JSON.stringify(targetTokens)) throw new Error(`${locale}: placeholder mismatch in ${source}`);
    return [source, overrides[locale]?.[source] ?? translated];
  }));
}
await writeFile(new URL('../../src/markets-no-ch/shikaku-translations.mjs', import.meta.url), `// Static Google Translate UI drafts. Nothing is translated at page load.\nexport const shikakuTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Built ${locales.length} static locale dictionaries × ${sources.length} unique strings.`);
