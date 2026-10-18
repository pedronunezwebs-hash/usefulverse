import { copyFile, cp, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { localeEntries } from '../src/locales.mjs';
import { english } from '../src/markets-no-ch/copy-en.mjs';
import { translationsByLocale } from '../src/markets-no-ch/translations.mjs';
import { marketTools } from '../src/markets-no-ch/catalog.mjs';
import { renderPage } from '../src/markets-no-ch/render.mjs';
import { petAgeTranslationsByLocale } from '../src/markets-no-ch/pet-age-translations.mjs';
import { norwayTaxTranslationsByLocale } from '../src/markets-no-ch/norway-tax-translations.mjs';
import { norwayWealthTaxTranslationsByLocale } from '../src/markets-no-ch/norway-wealth-tax-translations.mjs';
import { swissUidTranslationsByLocale } from '../src/markets-no-ch/swiss-uid-translations.mjs';
import { swissQrBillTranslationsByLocale } from '../src/markets-no-ch/swiss-qr-bill-translations.mjs';
import { swissQrBillEnglish } from '../src/markets-no-ch/swiss-qr-bill-copy-en.mjs';
import { swissCoordinateTranslationsByLocale } from '../src/markets-no-ch/swiss-coordinate-translations.mjs';
import { swissCoordinateEnglish } from '../src/markets-no-ch/swiss-coordinate-copy-en.mjs';
import { swissWheelOffsetTranslationsByLocale } from '../src/markets-no-ch/swiss-wheel-offset-translations.mjs';
import { dewPointTranslationsByLocale } from '../src/markets-no-ch/dew-point-translations.mjs';
import { dewPointEnglish } from '../src/markets-no-ch/dew-point-copy-en.mjs';
import { natalChartEnglish } from '../src/markets-no-ch/natal-chart-copy-en.mjs';
import { natalChartTranslationsByLocale } from '../src/markets-no-ch/natal-chart-translations.mjs';
import { numerologyEnglish } from '../src/markets-no-ch/numerology-copy-en.mjs';
import { numerologyTranslationsByLocale } from '../src/markets-no-ch/numerology-translations.mjs';
import { jassEnglish } from '../src/markets-no-ch/jass-copy-en.mjs';
import { jassTranslationsByLocale } from '../src/markets-no-ch/jass-translations.mjs';
import { nineMensMorrisEnglish } from '../src/markets-no-ch/nine-mens-morris-copy-en.mjs';
import { nineMensMorrisTranslationsByLocale } from '../src/markets-no-ch/nine-mens-morris-translations.mjs';
import { halmaGameEnglish } from '../src/markets-no-ch/halma-game-copy-en.mjs';
import { halmaGameTranslationsByLocale } from '../src/markets-no-ch/halma-game-translations.mjs';
import { canastaCardGameEnglish } from '../src/markets-no-ch/canasta-card-game-copy-en.mjs';
import { canastaCardGameTranslationsByLocale } from '../src/markets-no-ch/canasta-card-game-translations.mjs';
import { skatCardGameEnglish } from '../src/markets-no-ch/skat-card-game-copy-en.mjs';
import { skatCardGameTranslationsByLocale } from '../src/markets-no-ch/skat-card-game-translations.mjs';
import { doppelkopfEnglish } from '../src/markets-no-ch/doppelkopf-copy-en.mjs';
import { doppelkopfTranslationsByLocale } from '../src/markets-no-ch/doppelkopf-translations.mjs';
import { schafkopfEnglish } from '../src/markets-no-ch/schafkopf-copy-en.mjs';
import { schafkopfTranslationsByLocale } from '../src/markets-no-ch/schafkopf-translations.mjs';
import { schnapsenEnglish } from '../src/markets-no-ch/schnapsen-copy-en.mjs';
import { schnapsenTranslationsByLocale } from '../src/markets-no-ch/schnapsen-translations.mjs';
import { suguruEnglish } from '../src/markets-no-ch/suguru-copy-en.mjs';
import { suguruTranslationsByLocale } from '../src/markets-no-ch/suguru-translations.mjs';
import { shikakuEnglish } from '../src/markets-no-ch/shikaku-copy-en.mjs';
import { shikakuTranslationsByLocale } from '../src/markets-no-ch/shikaku-translations.mjs';
import { brickBreakerEnglish } from '../src/markets-no-ch/brick-breaker-copy-en.mjs';
import { brickBreakerTranslationsByLocale } from '../src/markets-no-ch/brick-breaker-translations.mjs';
import { miniGolfEnglish } from '../src/markets-no-ch/minigolf-copy-en.mjs';
import { miniGolfTranslationsByLocale } from '../src/markets-no-ch/minigolf-translations.mjs';
import { matchThreeEnglish } from '../src/markets-no-ch/match-three-copy-en.mjs';
import { matchThreeTranslationsByLocale } from '../src/markets-no-ch/match-three-translations.mjs';
import { audioToMidiEnglish } from '../src/markets-no-ch/audio-to-midi-copy-en.mjs';
import { audioToMidiTranslationsByLocale } from '../src/markets-no-ch/audio-to-midi-translations.mjs';
import { voiceChangerEnglish } from '../src/markets-no-ch/voice-changer-copy-en.mjs';
import { voiceChangerTranslationsByLocale } from '../src/markets-no-ch/voice-changer-translations.mjs';
import { frequencyToneEnglish } from '../src/markets-no-ch/frequency-tone-generator-copy-en.mjs';
import { frequencyToneTranslationsByLocale } from '../src/markets-no-ch/frequency-tone-generator-translations.mjs';
import { barcodeReaderEnglish } from '../src/markets-no-ch/barcode-reader-copy-en.mjs';
import { barcodeReaderTranslationsByLocale } from '../src/markets-no-ch/barcode-reader-translations.mjs';
import { resumeStructureEnglish } from '../src/markets-no-ch/resume-structure-copy-en.mjs';
import { resumeStructureTranslationsByLocale } from '../src/markets-no-ch/resume-structure-translations.mjs';
import { aquariumWaterMixingEnglish } from '../src/markets-no-ch/aquarium-water-mixing-copy-en.mjs';
import { aquariumWaterMixingTranslationsByLocale } from '../src/markets-no-ch/aquarium-water-mixing-translations.mjs';
import { swissVehicleTaxEnglish } from '../src/markets-no-ch/switzerland-vehicle-tax-copy-en.mjs';
import { swissVehicleTaxTranslationsByLocale } from '../src/markets-no-ch/switzerland-vehicle-tax-translations.mjs';
import { carbonFootprintEnglish } from '../src/markets-no-ch/carbon-footprint-copy-en.mjs';
import { carbonFootprintTranslationsByLocale } from '../src/markets-no-ch/carbon-footprint-translations.mjs';
import { dicomViewerEnglish } from '../src/markets-no-ch/dicom-viewer-copy-en.mjs';
import { dicomViewerTranslationsByLocale } from '../src/markets-no-ch/dicom-viewer-translations.mjs';
import { crazyEightsEnglish } from '../src/markets-no-ch/crazy-eights-copy-en.mjs';
import { crazyEightsTranslationsByLocale } from '../src/markets-no-ch/crazy-eights-translations.mjs';
import { idiotCardGameEnglish } from '../src/markets-no-ch/idiot-card-game-copy-en.mjs';
import { idiotCardGameTranslationsByLocale } from '../src/markets-no-ch/idiot-card-game-translations.mjs';
import { presidentCardGameEnglish } from '../src/markets-no-ch/president-card-game-copy-en.mjs';
import { presidentCardGameTranslationsByLocale, presidentCardGameIntentionalUnchangedByLocale, presidentCardGameVerbatimTerms } from '../src/markets-no-ch/president-card-game-translations.mjs';
import { amerikanerCardGameEnglish } from '../src/markets-no-ch/amerikaner-card-game-copy-en.mjs';
import { amerikanerCardGameTranslationsByLocale } from '../src/markets-no-ch/amerikaner-card-game-translations.mjs';
import { amerikanerCardGameTranslationOverrides } from '../src/markets-no-ch/amerikaner-card-game-translation-overrides.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = resolve(process.env.MARKETS_NO_CH_DIST ?? '/private/tmp/usefulverse-market-pilot-dist');
const locales = [...localeEntries.map((entry) => ({ ...entry, rtl: ['ar', 'ur', 'fa'].includes(entry.key) })), { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false }];
if (locales.length !== 37 || new Set(locales.map(({ key }) => key)).size !== 37) throw new Error('Expected 37 unique locales.');
for (const locale of locales) if (locale.key !== 'en' && !translationsByLocale[locale.key]) throw new Error(`Missing static translation pack: ${locale.key}`);
if (marketTools.some(({ mode }) => mode === 'petAge') && locales.some(({ key }) => key !== 'en' && !petAgeTranslationsByLocale[key])) {
  throw new Error('Pet Age is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'norwayTax') && locales.some(({ key }) => key !== 'en' && !norwayTaxTranslationsByLocale[key])) {
  throw new Error('Norway Tax is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'norwayWealthTax') && locales.some(({ key }) => key !== 'en' && !norwayWealthTaxTranslationsByLocale[key])) {
  throw new Error('Norway Wealth Tax is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'swissUid') && locales.some(({ key }) => key !== 'en' && !swissUidTranslationsByLocale[key])) {
  throw new Error('Swiss UID Validator is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'swissQrBill') && locales.some(({ key }) => key !== 'en' && !swissQrBillTranslationsByLocale[key])) {
  throw new Error('Swiss QR-bill is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'swissCoordinates') && locales.some(({ key }) => key !== 'en' && !swissCoordinateTranslationsByLocale[key])) {
  throw new Error('Swiss Coordinates is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'swissWheelOffset') && locales.some(({ key }) => key !== 'en' && !swissWheelOffsetTranslationsByLocale[key])) {
  throw new Error('Wheel Offset is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'dewPoint') && locales.some(({ key }) => key !== 'en' && !dewPointTranslationsByLocale[key])) {
  throw new Error('Dew Point is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'natalChart') && locales.some(({ key }) => key !== 'en' && !natalChartTranslationsByLocale[key])) {
  throw new Error('Natal Chart is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'numerology') && locales.some(({ key }) => key !== 'en' && !numerologyTranslationsByLocale[key])) {
  throw new Error('Numerology is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'jass') && locales.some(({ key }) => key !== 'en' && !jassTranslationsByLocale[key])) {
  throw new Error('Jass is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'nineMensMorris') && locales.some(({ key }) => key !== 'en' && !nineMensMorrisTranslationsByLocale[key])) {
  throw new Error('Nine Men’s Morris is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'halma') && locales.some(({ key }) => key !== 'en' && !halmaGameTranslationsByLocale[key])) {
  throw new Error('Halma is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'canasta') && locales.some(({ key }) => key !== 'en' && !canastaCardGameTranslationsByLocale[key])) {
  throw new Error('Canasta is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'skat') && locales.some(({ key }) => key !== 'en' && !skatCardGameTranslationsByLocale[key])) {
  throw new Error('Skat is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'doppelkopf') && locales.some(({ key }) => key !== 'en' && !doppelkopfTranslationsByLocale[key])) {
  throw new Error('Doppelkopf is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'schafkopf') && locales.some(({ key }) => key !== 'en' && !schafkopfTranslationsByLocale[key])) {
  throw new Error('Schafkopf is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'schnapsen') && locales.some(({ key }) => key !== 'en' && !schnapsenTranslationsByLocale[key])) {
  throw new Error('Schnapsen is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'suguru') && locales.some(({ key }) => key !== 'en' && !suguruTranslationsByLocale[key])) {
  throw new Error('Suguru is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'shikaku') && locales.some(({ key }) => key !== 'en' && !shikakuTranslationsByLocale[key])) {
  throw new Error('Shikaku is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'brickBreaker') && locales.some(({ key }) => key !== 'en' && !brickBreakerTranslationsByLocale[key])) {
  throw new Error('Brick Breaker is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'miniGolf') && locales.some(({ key }) => key !== 'en' && !miniGolfTranslationsByLocale[key])) {
  throw new Error('Mini Golf is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'matchThree') && locales.some(({ key }) => key !== 'en' && !matchThreeTranslationsByLocale[key])) {
  throw new Error('Match 3 is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'audioToMidi') && locales.some(({ key }) => key !== 'en' && !audioToMidiTranslationsByLocale[key])) {
  throw new Error('Audio-to-MIDI is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'voiceChanger') && locales.some(({ key }) => key !== 'en' && !voiceChangerTranslationsByLocale[key])) {
  throw new Error('Voice Changer is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'frequencyTone') && locales.some(({ key }) => key !== 'en' && !frequencyToneTranslationsByLocale[key])) {
  throw new Error('Frequency Tone Generator is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'barcodeReader') && locales.some(({ key }) => key !== 'en' && !barcodeReaderTranslationsByLocale[key])) {
  throw new Error('Barcode Reader is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'resumeStructure') && locales.some(({ key }) => key !== 'en' && !resumeStructureTranslationsByLocale[key])) {
  throw new Error('Resume Structure Checker is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'aquariumWaterMixing') && locales.some(({ key }) => key !== 'en' && !aquariumWaterMixingTranslationsByLocale[key])) {
  throw new Error('Aquarium Water Mixing Calculator is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'swissVehicleTax') && locales.some(({ key }) => key !== 'en' && !swissVehicleTaxTranslationsByLocale[key])) {
  throw new Error('Swiss Vehicle Tax Calculator is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'carbonFootprint') && locales.some(({ key }) => key !== 'en' && !carbonFootprintTranslationsByLocale[key])) {
  throw new Error('Carbon Footprint Calculator is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'dicomViewer') && locales.some(({ key }) => key !== 'en' && !dicomViewerTranslationsByLocale[key])) {
  throw new Error('DICOM Viewer is not buildable yet: its complete static translation pack for all 36 non-English locales is still pending.');
}
if (marketTools.some(({ mode }) => mode === 'dicomViewer')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(dicomViewerEnglish);
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = dicomViewerTranslationsByLocale[locale.key];
    if (sourceStrings.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) {
      throw new Error(`DICOM Viewer translation pack is incomplete for ${locale.key}.`);
    }
  }
}
if (marketTools.some(({ mode }) => mode === 'crazyEights')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(crazyEightsEnglish);
  const uniqueSources = [...new Set(sourceStrings.filter((source) => !Object.hasOwn(translationsByLocale.es, source)))];
  const tokens = /\{[^{}]+\}/gu;
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = crazyEightsTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) {
      throw new Error(`Vri åtter translation pack is incomplete for ${locale.key}.`);
    }
    if (dictionary[crazyEightsEnglish.title] === crazyEightsEnglish.title) {
      throw new Error(`Vri åtter title is still English in ${locale.key}.`);
    }
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Vri åtter has an empty translation in ${locale.key}.`);
      const protectedTokens = source.match(tokens) ?? [];
      if (protectedTokens.some((token) => !translated.includes(token))) throw new Error(`Vri åtter lost a protected variable in ${locale.key}: ${source}`);
    }
  }
}

if (marketTools.some(({ mode }) => mode === 'idiotCardGame')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(idiotCardGameEnglish);
  const uniqueSources = [...new Set(sourceStrings.filter((source) => !Object.hasOwn(translationsByLocale.es, source)))];
  const tokens = /\{[^{}]+\}/gu;
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = idiotCardGameTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) {
      throw new Error(`Idiot Card Game translation pack is incomplete for ${locale.key}.`);
    }
    if (dictionary[idiotCardGameEnglish.title] === idiotCardGameEnglish.title) {
      throw new Error(`Idiot Card Game title is still English in ${locale.key}.`);
    }
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Idiot Card Game has an empty translation in ${locale.key}.`);
      const protectedTokens = source.match(tokens) ?? [];
      if (protectedTokens.some((token) => !translated.includes(token))) throw new Error(`Idiot Card Game lost a protected variable in ${locale.key}: ${source}`);
    }
  }
}

if (marketTools.some(({ mode }) => mode === 'amerikanerCardGame')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(amerikanerCardGameEnglish);
  const uniqueSources = [...new Set(sourceStrings.filter((source) => !Object.hasOwn(translationsByLocale.es, source)))];
  const tokens = /\{[^{}]+\}/gu;
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = { ...amerikanerCardGameTranslationsByLocale[locale.key], ...amerikanerCardGameTranslationOverrides[locale.key] };
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Amerikaner translation pack is incomplete for ${locale.key}.`);
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Amerikaner has an empty translation in ${locale.key}: ${source}`);
      const protectedTokens = source.match(tokens) ?? [];
      if (protectedTokens.some((token) => !translated.includes(token))) throw new Error(`Amerikaner lost a protected variable in ${locale.key}: ${source}`);
    }
  }
}

const urls = [];
for (const tool of marketTools) {
  const modeCopy = tool.mode === 'carbonFootprint' ? carbonFootprintEnglish : tool.mode === 'voiceChanger' ? voiceChangerEnglish : tool.mode === 'audioToMidi' ? audioToMidiEnglish : tool.mode === 'matchThree' ? matchThreeEnglish : tool.mode === 'miniGolf' ? miniGolfEnglish : tool.mode === 'brickBreaker' ? brickBreakerEnglish : tool.mode === 'shikaku' ? shikakuEnglish : tool.mode === 'suguru' ? suguruEnglish : tool.mode === 'schnapsen' ? schnapsenEnglish : tool.mode === 'schafkopf' ? schafkopfEnglish : tool.mode === 'swissQrBill' ? swissQrBillEnglish : tool.mode === 'swissCoordinates' ? swissCoordinateEnglish : tool.mode === 'dewPoint' ? dewPointEnglish : tool.mode === 'natalChart' ? natalChartEnglish : tool.mode === 'numerology' ? numerologyEnglish : tool.mode === 'jass' ? jassEnglish : tool.mode === 'nineMensMorris' ? nineMensMorrisEnglish : tool.mode === 'halma' ? halmaGameEnglish : tool.mode === 'canasta' ? canastaCardGameEnglish : tool.mode === 'skat' ? skatCardGameEnglish : tool.mode === 'doppelkopf' ? doppelkopfEnglish : english[tool.mode];
  const copy = { ...english, ...(tool.mode === 'carbonFootprint' ? carbonFootprintEnglish : tool.mode === 'aquariumWaterMixing' ? aquariumWaterMixingEnglish : tool.mode === 'resumeStructure' ? resumeStructureEnglish : tool.mode === 'frequencyTone' ? frequencyToneEnglish : tool.mode === 'barcodeReader' ? barcodeReaderEnglish : modeCopy), ...(tool.mode === 'swissVehicleTax' ? swissVehicleTaxEnglish : {}), actions: english.actions, messages: english.messages };
  for (const locale of locales) {
    const pathPrefix = locale.prefix.replace(/^\//u, '');
    const path = join(output, pathPrefix, 'tools', tool.id, 'index.html');
    await mkdir(join(path, '..'), { recursive: true });
    await writeFile(path, renderPage({ tool, locale, locales, copy }));
    urls.push(`https://tools.usefulverse.com${locale.prefix}/tools/${tool.id}/`);
  }
  const verbatimTerms = new Set(presidentCardGameVerbatimTerms);
  const untranslated = locales.filter(({ key }) => key !== 'en').flatMap(({ key }) => {
    const allowedUnchanged = new Set([...verbatimTerms, ...(presidentCardGameIntentionalUnchangedByLocale[key] ?? [])]);
    return uniqueSources.filter((source) => presidentCardGameTranslationsByLocale[key][source] === source && !allowedUnchanged.has(source) && !/^\d+$/u.test(source)).map((source) => `${key}/${source}`);
  });
  if (untranslated.length) throw new Error(`President Card Game has untranslated strings: ${untranslated.slice(0, 12).join(', ')}`);
}
if (marketTools.some(({ mode }) => mode === 'shutBox')) {
  const sourceStrings = [];
  const collectStrings = (value) => { if (typeof value === 'string') sourceStrings.push(value); else if (Array.isArray(value)) value.forEach(collectStrings); else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings); };
  collectStrings(shutTheBoxEnglish);
  const uniqueSources = [...new Set(sourceStrings)];
  const tokens = /\{[^{}]+\}/gu;
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = shutTheBoxTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Shut the Box needs ${uniqueSources.length} static strings for ${locale.key}.`);
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Shut the Box has an empty translation for ${locale.key}: ${source}`);
      const placeholders = source.match(tokens) ?? [];
      if (placeholders.some((token) => !translated.includes(token))) throw new Error(`Shut the Box lost a variable for ${locale.key}: ${source}`);
    }
  }
}
if (marketTools.some(({ mode }) => mode === 'norwayEmployerCost')) {
  const sourceStrings = [];
  const collectStrings = (value) => { if (typeof value === 'string') sourceStrings.push(value); else if (Array.isArray(value)) value.forEach(collectStrings); else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings); };
  collectStrings(norwayEmployerCostEnglish);
  const uniqueSources = [...new Set(sourceStrings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = norwayEmployerCostTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Norway Employer Cost Calculator needs ${uniqueSources.length} static strings for ${locale.key}.`);
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Norway Employer Cost Calculator has an empty translation for ${locale.key}: ${source}`);
      const placeholders = source.match(/\{[^{}]+\}/gu) ?? [];
      if (placeholders.some((token) => !translated.includes(token))) throw new Error(`Norway Employer Cost Calculator lost a variable for ${locale.key}: ${source}`);
    }
  }
}
if (marketTools.some(({ mode }) => mode === 'norwayParentalBenefit')) {
  const sourceStrings = [];
  const collectStrings = (value) => { if (typeof value === 'string') sourceStrings.push(value); else if (Array.isArray(value)) value.forEach(collectStrings); else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings); };
  collectStrings(norwayParentalBenefitEnglish);
  const allUniqueSources = [...new Set(sourceStrings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = norwayParentalBenefitTranslationsByLocale[locale.key];
    const uniqueSources = allUniqueSources.filter((source) => !translationsByLocale[locale.key]?.[source]);
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Norway parental benefit planner needs ${uniqueSources.length} static strings for ${locale.key}.`);
    for (const source of uniqueSources) if (typeof dictionary[source] !== 'string' || !dictionary[source].trim()) throw new Error(`Norway parental benefit planner has a missing translation for ${locale.key}: ${source}`);
  }
}
if (marketTools.some(({ mode }) => mode === 'norwayChildSupport')) {
  const sourceStrings = [];
  const collectStrings = (value) => { if (typeof value === 'string') sourceStrings.push(value); else if (Array.isArray(value)) value.forEach(collectStrings); else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings); };
  collectStrings(norwayChildSupportEnglish);
  const allUniqueSources = [...new Set(sourceStrings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = norwayChildSupportTranslationsByLocale[locale.key];
    const uniqueSources = allUniqueSources.filter((source) => !translationsByLocale[locale.key]?.[source]);
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Norwegian Child Support Estimator needs ${uniqueSources.length} static strings for ${locale.key}.`);
    for (const source of uniqueSources) if (typeof dictionary[source] !== 'string' || !dictionary[source].trim()) throw new Error(`Norwegian Child Support Estimator has a missing translation for ${locale.key}: ${source}`);
  }
}
if (marketTools.some(({ mode }) => mode === 'norwayHousingBenefit')) {
  const sourceStrings = [];
  const collectStrings = (value) => { if (typeof value === 'string') sourceStrings.push(value); else if (Array.isArray(value)) value.forEach(collectStrings); else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings); };
  collectStrings(norwayHousingBenefitEnglish);
  const allUniqueSources = [...new Set(sourceStrings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = norwayHousingBenefitTranslationsByLocale[locale.key];
    const uniqueSources = allUniqueSources.filter((source) => !translationsByLocale[locale.key]?.[source]);
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Norway Housing Benefit Estimator needs ${uniqueSources.length} static strings for ${locale.key}.`);
    for (const source of uniqueSources) if (typeof dictionary[source] !== 'string' || !dictionary[source].trim()) throw new Error(`Norway Housing Benefit Estimator has a missing translation for ${locale.key}: ${source}`);
  }
}

const assets = join(output, 'assets');
await mkdir(assets, { recursive: true });
for (const name of ['controller.mjs', 'logic.mjs', 'binary-worker.mjs', 'bubble-shooter.mjs', 'pet-age.mjs', 'pet-age-controller.mjs', 'norway-income-tax.mjs', 'norway-tax-controller.mjs', 'norway-wealth-tax.mjs', 'norway-wealth-tax-controller.mjs', 'swiss-uid.mjs', 'swiss-uid-controller.mjs', 'swiss-qr-bill.mjs', 'swiss-qr-bill-controller.mjs', 'swiss-coordinate-converter.mjs', 'swiss-coordinate-controller.mjs', 'swiss-wheel-offset.mjs', 'swiss-wheel-offset-controller.mjs', 'scale-drawing.mjs', 'scale-drawing-controller.mjs', 'dew-point.mjs', 'dew-point-controller.mjs', 'natal-chart.mjs', 'natal-chart-controller.mjs', 'numerology.mjs', 'numerology-controller.mjs', 'jass-game.mjs', 'jass-controller.mjs', 'nine-mens-morris.mjs', 'nine-mens-morris-controller.mjs', 'halma-game.mjs', 'halma-game-controller.mjs', 'canasta-game.mjs', 'canasta-game-controller.mjs', 'skat-game.mjs', 'skat-game-controller.mjs', 'doppelkopf-game.mjs', 'doppelkopf-controller.mjs', 'schafkopf-game.mjs', 'schafkopf-controller.mjs', 'schnapsen-game.mjs', 'schnapsen-controller.mjs', 'suguru.mjs', 'suguru-worker.mjs', 'suguru-controller.mjs', 'shikaku.mjs', 'shikaku-controller.mjs', 'brick-breaker.mjs', 'brick-breaker-controller.mjs', 'minigolf.mjs', 'minigolf-controller.mjs', 'match-three.mjs', 'match-three-controller.mjs', 'audio-to-midi-transcriber.mjs', 'audio-to-midi-worker.mjs', 'audio-to-midi-controller.mjs', 'voice-changer.mjs', 'voice-changer-controller.mjs', 'markets.css']) {
  await copyFile(join(root, 'src/markets-no-ch', name), join(assets, name === 'markets.css' ? 'markets-no-ch.css' : name));
}
await copyFile(join(root, 'src/markets-no-ch/frequency-tone-generator.mjs'), join(assets, 'frequency-tone-generator.mjs'));
await copyFile(join(root, 'src/markets-no-ch/frequency-tone-generator-controller.mjs'), join(assets, 'frequency-tone-generator-controller.mjs'));
await copyFile(join(root, 'src/markets-no-ch/barcode-reader.mjs'), join(assets, 'barcode-reader.mjs'));
await copyFile(join(root, 'src/markets-no-ch/barcode-reader-controller.mjs'), join(assets, 'barcode-reader-controller.mjs'));
await copyFile(join(root, 'src/markets-no-ch/resume-structure.mjs'), join(assets, 'resume-structure.mjs'));
await copyFile(join(root, 'src/markets-no-ch/resume-structure-controller.mjs'), join(assets, 'resume-structure-controller.mjs'));
await copyFile(join(root, 'src/markets-no-ch/aquarium-water-mixing.mjs'), join(assets, 'aquarium-water-mixing.mjs'));
await copyFile(join(root, 'src/markets-no-ch/aquarium-water-mixing-controller.mjs'), join(assets, 'aquarium-water-mixing-controller.mjs'));
await copyFile(join(root, 'src/markets-no-ch/switzerland-vehicle-tax.mjs'), join(assets, 'switzerland-vehicle-tax.mjs'));
await copyFile(join(root, 'src/markets-no-ch/switzerland-vehicle-tax-controller.mjs'), join(assets, 'swiss-vehicle-tax-controller.mjs'));
await copyFile(join(root, 'src/markets-no-ch/carbon-footprint.mjs'), join(assets, 'carbon-footprint.mjs'));
await copyFile(join(root, 'src/markets-no-ch/carbon-electricity-factors.mjs'), join(assets, 'carbon-electricity-factors.mjs'));
await copyFile(join(root, 'src/markets-no-ch/carbon-footprint-controller.mjs'), join(assets, 'carbon-footprint-controller.mjs'));
const localNodeModules = resolve(process.env.MARKETS_NO_CH_NODE_MODULES ?? join(root, 'node_modules'));
const esbuild = process.env.MARKETS_NO_CH_ESBUILD_MODULE ? await import(process.env.MARKETS_NO_CH_ESBUILD_MODULE) : await import('esbuild');
await esbuild.build({ entryPoints: [join(root, 'src/markets-no-ch/resume-structure-worker.mjs')], outfile: join(assets, 'resume-structure-worker.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], minify: true, nodePaths: [localNodeModules], legalComments: 'none' });
const pdfjsRoot = resolve(localNodeModules, 'pdfjs-dist');
await mkdir(join(assets, 'vendor'), { recursive: true });
await copyFile(join(pdfjsRoot, 'legacy/build/pdf.min.mjs'), join(assets, 'vendor/pdf.min.mjs'));
await copyFile(join(pdfjsRoot, 'legacy/build/pdf.worker.min.mjs'), join(assets, 'vendor/pdf.worker.min.mjs'));
await copyFile(join(pdfjsRoot, 'LICENSE'), join(assets, 'vendor/LICENSE-pdfjs'));
await copyFile(join(localNodeModules, 'fflate/LICENSE'), join(assets, 'vendor/LICENSE-fflate'));
await cp(join(pdfjsRoot, 'cmaps'), join(assets, 'vendor/cmaps'), { recursive: true });
await cp(join(pdfjsRoot, 'standard_fonts'), join(assets, 'vendor/standard_fonts'), { recursive: true });
await copyFile(join(root, 'src/markets-no-ch/vendor/qrcode-generator.js'), join(assets, 'vendor/qrcode-generator.js'));
await copyFile(join(root, 'src/markets-no-ch/vendor/LICENSE-qrcode-generator'), join(assets, 'vendor/LICENSE-qrcode-generator'));
await copyFile(join(root, 'src/markets-no-ch/vendor/astronomy.browser.min.js'), join(assets, 'vendor/astronomy.browser.min.js'));
await copyFile(join(root, 'src/markets-no-ch/vendor/LICENSE-astronomy-engine'), join(assets, 'vendor/LICENSE-astronomy-engine'));
const now = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${now}</lastmod></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(output, 'market-pilot-sitemap-fragment.xml'), sitemap);
console.log(`Built ${urls.length} pilot routes for ${marketTools.length} tools in ${locales.length} locales at ${output}. This is a test artifact, not the complete production site.`);
