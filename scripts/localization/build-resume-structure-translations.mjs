import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { resumeStructureEnglish } from '../../src/markets-no-ch/resume-structure-copy-en.mjs';

const checkpoint = '/private/tmp/usefulverse-resume-structure-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const flatten = (value, out = []) => { if (typeof value === 'string') out.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, out)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, out)); return out; };
const generic = new Set(Object.keys(translationsByLocale.es));
const sources = [...new Set(flatten(resumeStructureEnglish).filter((value) => !generic.has(value)))];
const captures = JSON.parse(await readFile(checkpoint, 'utf8')); const dictionaries = {};
for (const locale of locales) {
  const pack = captures[locale];
  if (!pack || Object.keys(pack).length !== sources.length) throw new Error(`${locale}: missing translation strings.`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => {
    let value = pack[`Q${String(index).padStart(4, '0')}`]?.trim();
    if (!value || /UVRC\d{4}X|AXWebArea|127\.0\.0\.1|Focused UI element/iu.test(value)) throw new Error(`${locale}: invalid translation row ${index}.`);
    for (const token of source.match(/UsefulVerse|\b(?:PDF|DOCX|ATS|OCR|MB|PDF\.js|DOCX|20 MB|50 pages|80 MB)\b|\{[^}]+\}/gu) ?? []) if (!value.includes(token)) value = `${value} (${token})`;
    return [source, value];
  }));
}
const displayNames = { nb: 'CV-struktursjekker', sv: 'CV-strukturkontroll', tl: 'Tagasuri ng Istruktura ng Resume', el: 'Έλεγχος δομής βιογραφικού', ta: 'ரெஸ்யூம் அமைப்பு சரிபார்ப்பு' };
for (const [locale, name] of Object.entries(displayNames)) dictionaries[locale][resumeStructureEnglish.name] = name;
await writeFile(new URL('../../src/markets-no-ch/resume-structure-translations.mjs', import.meta.url), `// Static Google Translate UI drafts; published pages do not call a translation service.\nexport const resumeStructureTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Built ${locales.length} static resume-structure dictionaries × ${sources.length} unique strings.`);
