import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { audioToMidiEnglish } from '../../src/markets-no-ch/audio-to-midi-copy-en.mjs';

const checkpoint = '/private/tmp/usefulverse-audio-midi-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const generic = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, result = []) => { if (typeof value === 'string') result.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, result)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result)); return result; };
const sources = [...new Set(flatten(audioToMidiEnglish).filter((value) => !generic.has(value)))];
const captures = JSON.parse(await readFile(checkpoint, 'utf8'));
const dictionaries = {};
const checkpointIndexForSource = (index) => {
  if (index < 18) return index;
  if (index < 21) return 60 + index - 18;
  if (index < 53) return index - 3;
  if (index < 55) return 63 + index - 53;
  return index - 5;
};
for (const locale of locales) {
  const pack = captures[locale];
  if (!pack || Object.keys(pack).length < 65) throw new Error(`${locale}: missing translation strings`);
  dictionaries[locale] = Object.fromEntries(sources.map((source, index) => {
    const checkpointIndex = checkpointIndexForSource(index);
    let translated = pack[`Q${String(checkpointIndex).padStart(4, '0')}`]?.trim();
    if (!translated || /UVMIDI\d{4}X|AXWebArea|127\.0\.0\.1|Focused UI element/iu.test(translated)) throw new Error(`${locale}: invalid translation row ${index}`);
    const protectedTerms = source.match(/UsefulVerse|\b(?:MIDI|WAV|MP3|OGG|FLAC|BPM|A4|E5)\b/gu) ?? [];
    for (const term of protectedTerms) if (!translated.includes(term)) translated = `${translated} (${term})`;
    for (const token of source.match(/\{[^}]+\}/gu) ?? []) if ((translated.match(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'), 'gu')) ?? []).length !== 1) throw new Error(`${locale}: placeholder ${token} missing in row ${index}`);
    return [source, translated];
  }));
}
await writeFile(new URL('../../src/markets-no-ch/audio-to-midi-translations.mjs', import.meta.url), `// Static Google Translate UI drafts; no translation service is called by the page.\nexport const audioToMidiTranslationsByLocale = Object.freeze(${JSON.stringify(dictionaries)});\n`);
console.log(`Built ${locales.length} static locale dictionaries × ${sources.length} unique strings.`);
