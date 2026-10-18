import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { barcodeReaderEnglish } from '../../src/markets-no-ch/barcode-reader-copy-en.mjs';

const checkpoint = '/private/tmp/usefulverse-barcode-reader-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const flatten = (value, out = []) => { if (typeof value === 'string') out.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, out)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, out)); return out; };
const generic = new Set(Object.keys(translationsByLocale.es));
const sources = [...new Set(flatten(barcodeReaderEnglish).filter((value) => !generic.has(value)))];
const captures = JSON.parse(await readFile(checkpoint, 'utf8')); const dictionaries = {};
for (const locale of locales) {
  const pack = captures[locale];
  if (!pack || Object.keys(pack).length !== sources.length) throw new Error(`${locale}: missing translation strings.`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => {
    let value = pack[`Q${String(index).padStart(4, '0')}`]?.trim();
    if (!value || /UVBR\d{4}X|AXWebArea|127\.0\.0\.1|Focused UI element/iu.test(value)) throw new Error(`${locale}: invalid translation row ${index}.`);
    for (const token of source.match(/UsefulVerse|\b(?:EAN|UPC|Code 128|EAN-13|EAN-8|UPC-A|UPC-E|GTIN|HTTPS|MB)\b|\{[^}]+\}/gu) ?? []) if (!value.includes(token)) value = `${value} (${token})`;
    return [source, value];
  }));
}
const displayNames = { ha: 'Mai karanta lambar mashaya', nb: 'Strekkodeskanner', sv: 'Streckkodsläsare', tl: 'Scanner ng Barcode' };
for (const [locale, name] of Object.entries(displayNames)) dictionaries[locale][barcodeReaderEnglish.name] = name;
await writeFile(new URL('../../src/markets-no-ch/barcode-reader-translations.mjs', import.meta.url), `// Static Google Translate UI drafts; published pages do not call a translation service.\nexport const barcodeReaderTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Built ${locales.length} static barcode-reader dictionaries × ${sources.length} unique strings.`);
