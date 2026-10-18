import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { voiceChangerEnglish } from '../../src/markets-no-ch/voice-changer-copy-en.mjs';

const checkpoint = '/private/tmp/usefulverse-voice-changer-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const flatten = (value, result = []) => { if (typeof value === 'string') result.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, result)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result)); return result; };
const generic = new Set(Object.keys(translationsByLocale.es));
const sources = [...new Set(flatten(voiceChangerEnglish).filter((value) => !generic.has(value)))];
const captures = JSON.parse(await readFile(checkpoint, 'utf8'));
const dictionaries = {};
for (const locale of locales) {
  const pack = captures[locale];
  if (!pack || Object.keys(pack).length !== sources.length) throw new Error(`${locale}: missing translated strings`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => {
    const translated = pack[`Q${String(index).padStart(4, '0')}`]?.trim();
    if (!translated || /UVVC\d{4}X|AXWebArea|127\.0\.0\.1|Focused UI element/iu.test(translated)) throw new Error(`${locale}: invalid translation row ${index}`);
    for (const token of source.match(/\{[^}]+\}/gu) ?? []) if ((translated.match(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'), 'gu')) ?? []).length !== 1) throw new Error(`${locale}: placeholder ${token} missing in row ${index}`);
    let value = translated;
    for (const token of source.match(/UsefulVerse|\b(?:WAV|MP3|OGG|FLAC|Web Audio)\b/gu) ?? []) if (!value.includes(token)) value = `${value} (${token})`;
    return [source, value];
  }));
}
await writeFile(new URL('../../src/markets-no-ch/voice-changer-translations.mjs', import.meta.url), `// Static Google Translate UI drafts; pages do not call a translation service.\nexport const voiceChangerTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Built ${locales.length} static voice-changer dictionaries × ${sources.length} unique strings.`);
