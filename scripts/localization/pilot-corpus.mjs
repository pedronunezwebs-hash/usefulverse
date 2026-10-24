import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { voiceChangerEnglish } from '../../src/markets-no-ch/voice-changer-copy-en.mjs';
import { shikakuEnglish } from '../../src/markets-no-ch/shikaku-copy-en.mjs';
import { dxfViewerEnglish } from '../../src/markets-no-ch/dxf-viewer-copy-en.mjs';
import { voiceChangerTranslationsByLocale } from '../../src/markets-no-ch/voice-changer-translations.mjs';
import { shikakuTranslationsByLocale } from '../../src/markets-no-ch/shikaku-translations.mjs';
import { dxfViewerTranslationsByLocale } from '../../src/markets-no-ch/dxf-viewer-translations.mjs';

const sources = {
  'voice-changer': [voiceChangerEnglish, voiceChangerTranslationsByLocale],
  shikaku: [shikakuEnglish, shikakuTranslationsByLocale],
  'dxf-viewer': [dxfViewerEnglish, dxfViewerTranslationsByLocale],
};
const aliases = { 'pt-BR': 'pt', 'zh-CN': 'zh', 'zh-TW': 'zh_tw', fil: 'tl', 'nb-NO': 'nb' };
export const pilotLocales = ['en','es','fr','pt-BR','de','ja','ko','id','hi','ar','zh-CN','bn','ru','ur','tr','vi','it','zh-TW','bg','ca','nl','el','ms','pl','sv','th','uk','sw','mr','te','ha','fil','ta','fa','am','gu','nb-NO'];
const references = {
  'voice-changer': ['fields.chooseFile','fields.privacy','fields.load','fields.preview','fields.stop','fields.clear','fields.export','fields.chooseFirst','fields.loaded','fields.decodeFailed','fields.tooLarge','fields.tooLong','fields.faq1a','fields.faq2a'],
  shikaku: ['fields.newPuzzle','fields.daily','fields.resume','fields.deleteSave','fields.selectStart','fields.selectEnd','fields.check','fields.hint','fields.reveal','fields.undo','fields.clear','fields.faq.1.a','example'],
  'dxf-viewer': ['fields.file','fields.cancel','fields.unsupported','fields.binary','fields.invalidCoordinates','fields.measurement','fields.exportSvg','fields.exportPng','fields.resetView','fields.zoomIn','fields.zoomOut','faq.0.a','faq.2.a'],
};

export function createPilotCorpus() {
  const units = [];
  for (const [tool, [copy, translations]] of Object.entries(sources)) {
    function visit(value, path = '') {
      if (typeof value === 'string' && value.trim()) {
        // Filenames, brand-only values and numeric-only unit options are not prose.
        if (path.endsWith('outputName') || value === 'UsefulVerse' || !/\p{L}/u.test(value)) return;
        units.push({ key: `${tool}.${path}`, tool, context: path, source: value,
          source_hash: createHash('sha256').update(value).digest('hex'),
          reference: references[tool].includes(path),
          legacy: Object.fromEntries(pilotLocales.filter((locale) => locale !== 'en').map((locale) => [locale, translations[aliases[locale] ?? locale]?.[value] ?? null])) });
      } else if (Array.isArray(value)) value.forEach((item, i) => visit(item, `${path}.${i}`));
      else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) visit(item, path ? `${path}.${key}` : key);
    }
    visit(copy);
  }
  const referenceUnits = units.filter((unit) => unit.reference);
  if (referenceUnits.length !== 40) throw Error(`Expected 40 fixed reference strings, got ${referenceUnits.length}`);
  const sourceDigest = createHash('sha256').update(JSON.stringify(units.map(({ key, source_hash, context }) => [key, source_hash, context]))).digest('hex');
  return { schemaVersion: 1, sourceDigest, locales: pilotLocales, tools: Object.keys(sources),
    fullSourceUnits: units.length, uniqueSourceStrings: new Set(units.map(({ source }) => source)).size,
    referenceUnits: referenceUnits.length, units };
}

if (process.argv[1] && resolve(process.argv[1]) === import.meta.filename) {
  const output = resolve(process.argv[2] ?? '.translation-data/pilot-corpus.json');
  const corpus = createPilotCorpus();
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(corpus, null, 2)}\n`);
  console.log(JSON.stringify({ output, tools: corpus.tools, locales: corpus.locales.length, units: corpus.fullSourceUnits, references: corpus.referenceUnits, sourceDigest: corpus.sourceDigest }));
}
