import { copyFile, cp, mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as bundle } from 'esbuild';
import { localeEntries } from '../src/locales.mjs';
import { english } from '../src/markets-no-ch/copy-en.mjs';
import { translationsByLocale } from '../src/markets-no-ch/translations.mjs';
import { marketTools } from '../src/markets-no-ch/catalog.mjs';
import { numerologyEnglish } from '../src/markets-no-ch/numerology-copy-en.mjs';
import { nineMensMorrisEnglish } from '../src/markets-no-ch/nine-mens-morris-copy-en.mjs';
import { halmaGameEnglish } from '../src/markets-no-ch/halma-game-copy-en.mjs';
import { canastaCardGameEnglish } from '../src/markets-no-ch/canasta-card-game-copy-en.mjs';
import { skatCardGameEnglish } from '../src/markets-no-ch/skat-card-game-copy-en.mjs';
import { doppelkopfEnglish } from '../src/markets-no-ch/doppelkopf-copy-en.mjs';
import { schafkopfEnglish } from '../src/markets-no-ch/schafkopf-copy-en.mjs';
import { schnapsenEnglish } from '../src/markets-no-ch/schnapsen-copy-en.mjs';
import { suguruEnglish } from '../src/markets-no-ch/suguru-copy-en.mjs';
import { shikakuEnglish } from '../src/markets-no-ch/shikaku-copy-en.mjs';
import { brickBreakerEnglish } from '../src/markets-no-ch/brick-breaker-copy-en.mjs';
import { miniGolfEnglish } from '../src/markets-no-ch/minigolf-copy-en.mjs';
import { matchThreeEnglish } from '../src/markets-no-ch/match-three-copy-en.mjs';
import { audioToMidiEnglish } from '../src/markets-no-ch/audio-to-midi-copy-en.mjs';
import { voiceChangerEnglish } from '../src/markets-no-ch/voice-changer-copy-en.mjs';
import { dicomViewerEnglish } from '../src/markets-no-ch/dicom-viewer-copy-en.mjs';
import { crazyEightsEnglish } from '../src/markets-no-ch/crazy-eights-copy-en.mjs';
import { idiotCardGameEnglish } from '../src/markets-no-ch/idiot-card-game-copy-en.mjs';
import { jassEnglish } from '../src/markets-no-ch/jass-copy-en.mjs';
import { warCardGameEnglish } from '../src/markets-no-ch/war-card-game-copy-en.mjs';
import { natalChartEnglish } from '../src/markets-no-ch/natal-chart-copy-en.mjs';
import { renderPage } from '../src/markets-no-ch/render.mjs';
import { norwayDisabilityBenefitEnglish } from '../src/markets-no-ch/norway-disability-benefit-copy-en.mjs';
import { norwayStudentFinanceEnglish } from '../src/markets-no-ch/norway-student-finance-copy-en.mjs';
import { norwayBsuEnglish } from '../src/markets-no-ch/norway-bsu-copy-en.mjs';
import { norwayCommutingDeductionEnglish } from '../src/markets-no-ch/norway-commuting-deduction-copy-en.mjs';
import { norwayMileageReimbursementEnglish } from '../src/markets-no-ch/norway-mileage-reimbursement-copy-en.mjs';
import { latePaymentInterestEnglish } from '../src/markets-no-ch/late-payment-interest-copy-en.mjs';
import { norwayImportCostEnglish } from '../src/markets-no-ch/norway-import-cost-copy-en.mjs';
import { norwayCarImportCostEnglish } from '../src/markets-no-ch/norway-car-import-cost-copy-en.mjs';
import { norwayTollCostEnglish } from '../src/markets-no-ch/norway-toll-cost-copy-en.mjs';
import { norwayPropertyTransferEnglish } from '../src/markets-no-ch/norway-property-transfer-copy-en.mjs';
import { norwayElectricitySupportEnglish } from '../src/markets-no-ch/norway-electricity-support-copy-en.mjs';
import { beadPatternEnglish } from '../src/markets-no-ch/bead-pattern-copy-en.mjs';
import { codebreakerEnglish } from '../src/markets-no-ch/codebreaker-copy-en.mjs';
import { codebreakerTranslationsByLocale } from '../src/markets-no-ch/codebreaker-translations.mjs';
import { shoeSizeEnglish } from '../src/markets-no-ch/shoe-size-copy-en.mjs';
import { shoeSizeTranslationsByLocale } from '../src/markets-no-ch/shoe-size-translations.mjs';
import { childGrowthEnglish } from '../src/markets-no-ch/child-growth-copy-en.mjs';
import { childGrowthTranslationsByLocale } from '../src/markets-no-ch/child-growth-translations.mjs';
import { ringSizeTranslationsByLocale } from '../src/markets-no-ch/ring-size-translations.mjs';
import { grisCardGameEnglish } from '../src/markets-no-ch/gris-card-game-copy-en.mjs';
import { grisCardGameTranslationsByLocale } from '../src/markets-no-ch/gris-card-game-translations.mjs';
import { model3dViewerEnglish } from '../src/markets-no-ch/3d-model-viewer-copy-en.mjs';
import { model3dViewerGeneratedTranslationsByLocale } from '../src/markets-no-ch/3d-model-viewer-generated-translations.mjs';
import { dxfViewerEnglish } from '../src/markets-no-ch/dxf-viewer-copy-en.mjs';
import { dxfViewerGeneratedTranslationsByLocale } from '../src/markets-no-ch/dxf-viewer-generated-translations.mjs';
import { fiveLetterWordEnglish } from '../src/markets-no-ch/five-letter-word-copy-en.mjs';
import { fiveLetterWordTranslationsByLocale } from '../src/markets-no-ch/five-letter-word-translations.mjs';
import { bridgeGameEnglish } from '../src/markets-no-ch/bridge-game-copy-en.mjs';
import { bridgeGameTranslationsByLocale } from '../src/markets-no-ch/bridge-game-translations.mjs';
import { farkleEnglish } from '../src/markets-no-ch/farkle-copy-en.mjs';
import { farkleTranslationsByLocale } from '../src/markets-no-ch/farkle-translations.mjs';
import { swissNetSalaryEnglish } from '../src/markets-no-ch/swiss-net-salary-copy-en.mjs';
import { swissNetSalaryTranslationsByLocale } from '../src/markets-no-ch/swiss-net-salary-translations.mjs';
import { swissTaxCompareEnglish } from '../src/markets-no-ch/swiss-tax-compare-copy-en.mjs';
import { swissTaxCompareTranslationsByLocale } from '../src/markets-no-ch/swiss-tax-compare-translations.mjs';
import { swissAhvPensionEnglish } from '../src/markets-no-ch/swiss-ahv-pension-copy-en.mjs';
import { swissAhvPensionTranslationsByLocale } from '../src/markets-no-ch/swiss-ahv-pension-translations.mjs';
import { swissPillar3aEnglish } from '../src/markets-no-ch/swiss-pillar-3a-copy-en.mjs';
import { swissPillar3aTranslationsByLocale } from '../src/markets-no-ch/swiss-pillar-3a-translations.mjs';
import { swissBvgPensionEnglish } from '../src/markets-no-ch/swiss-bvg-pension-copy-en.mjs';
import { swissBvgPensionTranslationsByLocale } from '../src/markets-no-ch/swiss-bvg-pension-translations.mjs';
import { swissPensionWithdrawalEnglish } from '../src/markets-no-ch/swiss-pension-withdrawal-copy-en.mjs';
import { swissPensionWithdrawalTranslationsByLocale } from '../src/markets-no-ch/swiss-pension-withdrawal-translations.mjs';
import { swissHealthDeductibleEnglish } from '../src/markets-no-ch/swiss-health-deductible-copy-en.mjs';
import { swissHealthDeductibleTranslationsByLocale } from '../src/markets-no-ch/swiss-health-deductible-translations.mjs';
import { swissRentAdjustmentEnglish } from '../src/markets-no-ch/swiss-rent-adjustment-copy-en.mjs';
import { swissRentAdjustmentTranslationsByLocale } from '../src/markets-no-ch/swiss-rent-adjustment-translations.mjs';
import { swissVacationAccrualEnglish } from '../src/markets-no-ch/swiss-vacation-accrual-copy-en.mjs';
import { swissVacationAccrualTranslationsByLocale } from '../src/markets-no-ch/swiss-vacation-accrual-translations.mjs';
import { swissPremiumReductionEnglish } from '../src/markets-no-ch/swiss-premium-reduction-copy-en.mjs';
import { swissWheelOffsetEnglish } from '../src/markets-no-ch/swiss-wheel-offset-copy-en.mjs';
import { swissWheelOffsetTranslationsByLocale } from '../src/markets-no-ch/swiss-wheel-offset-translations.mjs';
import { petAgeEnglish } from '../src/markets-no-ch/pet-age-copy-en.mjs';
import { petAgeTranslationsByLocale } from '../src/markets-no-ch/pet-age-translations.mjs';
import { swissUidEnglish } from '../src/markets-no-ch/swiss-uid-copy-en.mjs';
import { swissUidTranslationsByLocale } from '../src/markets-no-ch/swiss-uid-translations.mjs';
import { swissCoordinateEnglish } from '../src/markets-no-ch/swiss-coordinate-copy-en.mjs';
import { swissCoordinateTranslationsByLocale } from '../src/markets-no-ch/swiss-coordinate-translations.mjs';
import { frequencyToneEnglish } from '../src/markets-no-ch/frequency-tone-generator-copy-en.mjs';
import { frequencyToneTranslationsByLocale } from '../src/markets-no-ch/frequency-tone-generator-translations.mjs';
import { norwayCompanyCarEnglish } from '../src/markets-no-ch/norway-company-car-copy-en.mjs';
import { norwayEmployerCostEnglish } from '../src/markets-no-ch/norway-employer-cost-copy-en.mjs';
import { norwayCompanyCarTranslationsByLocale } from '../src/markets-no-ch/norway-company-car-translations.mjs';
import { pinballEnglish } from '../src/markets-no-ch/pinball-copy-en.mjs';
import { pinballTranslationsByLocale } from '../src/markets-no-ch/pinball-translations.mjs';
import { amerikanerCardGameEnglish } from '../src/markets-no-ch/amerikaner-card-game-copy-en.mjs';
import { amerikanerCardGameTranslationsByLocale } from '../src/markets-no-ch/amerikaner-card-game-translations.mjs';
import { presidentCardGameEnglish } from '../src/markets-no-ch/president-card-game-copy-en.mjs';
import { presidentCardGameTranslationsByLocale } from '../src/markets-no-ch/president-card-game-translations.mjs';
import { geographyQuizEnglish } from '../src/markets-no-ch/geography-quiz-copy-en.mjs';
import { norwayChildSupportEnglish } from '../src/markets-no-ch/norway-child-support-copy-en.mjs';
import { norwayParentalBenefitEnglish } from '../src/markets-no-ch/norway-parental-benefit-copy-en.mjs';
import { norwayUnemploymentBenefitEnglish } from '../src/markets-no-ch/norway-unemployment-benefit-copy-en.mjs';
import { norwayHousingBenefitEnglish } from '../src/markets-no-ch/norway-housing-benefit-copy-en.mjs';
import { swissVehicleTaxEnglish } from '../src/markets-no-ch/switzerland-vehicle-tax-copy-en.mjs';
import { currencyConverterEnglish } from '../src/markets-no-ch/currency-converter-copy-en.mjs';
import { carbonFootprintEnglish } from '../src/markets-no-ch/carbon-footprint-copy-en.mjs';
import { dewPointEnglish } from '../src/markets-no-ch/dew-point-copy-en.mjs';
import { aquariumWaterMixingEnglish } from '../src/markets-no-ch/aquarium-water-mixing-copy-en.mjs';
import { barcodeReaderEnglish } from '../src/markets-no-ch/barcode-reader-copy-en.mjs';
import { scaleDrawingEnglish } from '../src/markets-no-ch/scale-drawing-copy-en.mjs';
import { shutTheBoxEnglish } from '../src/markets-no-ch/shut-the-box-copy-en.mjs';
import { snakesAndLaddersEnglish } from '../src/markets-no-ch/snakes-and-ladders-copy-en.mjs';
import { swissPremiumReductionTranslationsByLocale } from '../src/markets-no-ch/swiss-premium-reduction-translations.mjs';
import { remainingToolsEnglish } from '../src/markets-no-ch/remaining-tools-copy-en.mjs';
import { resumeStructureEnglish } from '../src/markets-no-ch/resume-structure-copy-en.mjs';
import { vocalRemoverEnglish } from '../src/markets-no-ch/vocal-remover-copy-en.mjs';
import { finalCandidateTranslationsByLocale } from '../src/markets-no-ch/final-candidate-translations.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = resolve(process.env.MARKETS_NO_CH_DIST ?? '/private/tmp/usefulverse-market-pilot-dist');
const staging = `${output}.staging-${process.pid}`;
const rewriteAssetPrefix = (value) => value.replaceAll('/assets/', '/assets/market-tools/');
async function copyMarketAsset(source, destination) {
  const ext = source.split('.').at(-1)?.toLowerCase();
  if (['mjs', 'js', 'css', 'txt'].includes(ext)) {
    await writeFile(destination, rewriteAssetPrefix(await readFile(source, 'utf8')));
  } else await copyFile(source, destination);
}
for (const path of [output, staging]) {
  try { await stat(path); throw new Error(`Refusing to overwrite existing market pilot artifact: ${path}. Set MARKETS_NO_CH_DIST to a new path.`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
const locales = [...localeEntries.map((entry) => ({ ...entry, rtl: ['ar', 'ur', 'fa'].includes(entry.key) })), { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false }];
const finalCandidateModes = new Set(['swissHealthDeductible', 'swissPremiumReduction', 'swissRentAdjustment', 'swissVacationAccrual']);
if (locales.length !== 37 || new Set(locales.map(({ key }) => key)).size !== 37) throw new Error('Expected 37 unique locales.');
for (const locale of locales) if (locale.key !== 'en' && !translationsByLocale[locale.key]) throw new Error(`Missing static translation pack: ${locale.key}`);

const requestedIds = process.env.MARKETS_NO_CH_TOOL_IDS?.split(',').map((id) => id.trim()).filter(Boolean);
const toolsToBuild = requestedIds ? marketTools.filter(({ id }) => requestedIds.includes(id)) : marketTools;
if (requestedIds && (toolsToBuild.length !== new Set(requestedIds).size || toolsToBuild.length !== requestedIds.length)) {
  throw new Error(`Unknown or repeated market tool id in MARKETS_NO_CH_TOOL_IDS: ${requestedIds.join(', ')}`);
}
if (toolsToBuild.some(({ mode }) => Object.hasOwn(remainingToolsEnglish, mode) || mode === 'resumeStructure' || mode === 'vocalRemover' || finalCandidateModes.has(mode))) {
  const sources = new Set();
  const collect = (value) => { if (typeof value === 'string') sources.add(value); else if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') Object.values(value).forEach(collect); };
  for (const { mode } of toolsToBuild) {
    if (Object.hasOwn(remainingToolsEnglish, mode)) collect(remainingToolsEnglish[mode]);
    else if (mode === 'resumeStructure') collect(resumeStructureEnglish);
    else if (mode === 'vocalRemover') collect(vocalRemoverEnglish);
    else if (mode === 'swissHealthDeductible') collect(swissHealthDeductibleEnglish);
    else if (mode === 'swissPremiumReduction') collect(swissPremiumReductionEnglish);
    else if (mode === 'swissRentAdjustment') collect(swissRentAdjustmentEnglish);
    else if (mode === 'swissVacationAccrual') collect(swissVacationAccrualEnglish);
  }
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = finalCandidateTranslationsByLocale[locale.key];
    if (!dictionary || [...sources].some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Final-candidate translation pack incomplete for ${locale.key}.`);
  }
}


if (toolsToBuild.some(({ mode }) => mode === 'grisCardGame')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(grisCardGameEnglish);
  const uniqueSources = [...new Set(sourceStrings.filter((source) => !Object.hasOwn(translationsByLocale.es, source)))];
  const tokens = /\{[^{}]+\}/gu;
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = grisCardGameTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Gris translation pack is incomplete for ${locale.key}.`);
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Gris has an empty translation in ${locale.key}: ${source}`);
      const protectedTokens = source.match(tokens) ?? [];
      if (protectedTokens.some((token) => !translated.includes(token))) throw new Error(`Gris lost a protected variable in ${locale.key}: ${source}`);
    }
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissWheelOffset')) {
  const strings = [];
  const collect = (value) => { if (typeof value === 'string') strings.push(value); else if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') Object.values(value).forEach(collect); };
  collect(swissWheelOffsetEnglish);
  const commonSources = new Set(Object.keys(translationsByLocale.es ?? {}));
  const sources = [...new Set(strings.filter((source) => !commonSources.has(source)))];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissWheelOffsetTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Wheel Offset translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'petAge')) {
  const strings = [];
  const collect = (value) => { if (typeof value === 'string') strings.push(value); else if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') Object.values(value).forEach(collect); };
  collect(petAgeEnglish);
  const commonSources = new Set(Object.keys(translationsByLocale.es ?? {}));
  const sources = [...new Set(strings.filter((source) => !commonSources.has(source)))];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = petAgeTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Pet Age translation pack is incomplete for ${locale.key}.`);
  }
}

for (const [mode, englishCopy, pack, label] of [
  ['swissUid', swissUidEnglish, swissUidTranslationsByLocale, 'Swiss UID'],
  ['swissCoordinates', swissCoordinateEnglish, swissCoordinateTranslationsByLocale, 'Swiss coordinates'],
  ['frequencyTone', frequencyToneEnglish, frequencyToneTranslationsByLocale, 'Frequency tone'],
  ['norwayCompanyCar', norwayCompanyCarEnglish, norwayCompanyCarTranslationsByLocale, 'Norway company car'],
  ['pinball', pinballEnglish, pinballTranslationsByLocale, 'Pinball'],
  ['amerikanerCardGame', amerikanerCardGameEnglish, amerikanerCardGameTranslationsByLocale, 'Amerikaner'],
  ['presidentCardGame', presidentCardGameEnglish, presidentCardGameTranslationsByLocale, 'President'],
]) {
  if (!toolsToBuild.some((tool) => tool.mode === mode)) continue;
  const strings = [];
  const collect = (value) => { if (typeof value === 'string') strings.push(value); else if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') Object.values(value).forEach(collect); };
  collect(englishCopy);
  const commonSources = new Set(Object.keys(translationsByLocale.es ?? {}));
  const sources = [...new Set(strings.filter((source) => !commonSources.has(source)))];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = pack[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`${label} translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'fiveLetterWord')) {
  const strings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(fiveLetterWordEnglish);
  const uniqueSources = [...new Set(strings)];
  const tokens = /\{[^{}]+\}/gu;
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = fiveLetterWordTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Five-letter game translation pack is incomplete for ${locale.key}.`);
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Five-letter game translation is empty in ${locale.key}: ${source}`);
      const protectedTokens = source.match(tokens) ?? [];
      if (protectedTokens.some((token) => !translated.includes(token))) throw new Error(`Five-letter game translation lost a placeholder in ${locale.key}: ${source}`);
    }
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'bridgeGame')) {
  const strings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(bridgeGameEnglish);
  const uniqueSources = [...new Set(strings)];
  const tokens = /\{[^{}]+\}/gu;
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = bridgeGameTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Bridge translation pack is incomplete for ${locale.key}.`);
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Bridge translation is empty in ${locale.key}: ${source}`);
      const protectedTokens = source.match(tokens) ?? [];
      if (protectedTokens.some((token) => !translated.includes(token))) throw new Error(`Bridge translation lost a placeholder in ${locale.key}: ${source}`);
    }
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'farkleGame')) {
  const strings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(farkleEnglish);
  const uniqueSources = [...new Set(strings)];
  const tokens = /\{[^{}]+\}/gu;
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = farkleTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Farkle translation pack is incomplete for ${locale.key}.`);
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Farkle translation is empty in ${locale.key}: ${source}`);
      const placeholders = source.match(tokens) ?? [];
      if (placeholders.some((token) => !translated.includes(token))) throw new Error(`Farkle translation lost a placeholder in ${locale.key}: ${source}`);
    }
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissNetSalary')) {
  const strings = [];
  const collect = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(swissNetSalaryEnglish);
  const sources = [...new Set(strings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissNetSalaryTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Swiss salary translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissTaxCompare')) {
  const strings = [];
  const collect = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(swissTaxCompareEnglish);
  const sources = [...new Set(strings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissTaxCompareTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Swiss tax comparison translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissAhvPension')) {
  const strings = [];
  const collect = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(swissAhvPensionEnglish);
  const sources = [...new Set(strings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissAhvPensionTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Swiss AHV pension translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissPillar3a')) {
  const strings = [];
  const collect = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(swissPillar3aEnglish);
  const sources = [...new Set(strings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissPillar3aTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Swiss pillar 3a translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissBvgPension')) {
  const strings = [];
  const collect = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(swissBvgPensionEnglish);
  const sources = [...new Set(strings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissBvgPensionTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Swiss BVG pension translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissPensionWithdrawal')) {
  const strings = [];
  const collect = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(swissPensionWithdrawalEnglish);
  const sources = [...new Set(strings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissPensionWithdrawalTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Swiss pension withdrawal translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissHealthDeductible')) {
  const strings = [];
  const collect = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(swissHealthDeductibleEnglish);
  const sources = [...new Set(strings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissHealthDeductibleTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Swiss health deductible translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissRentAdjustment')) {
  const strings = [];
  const collect = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(swissRentAdjustmentEnglish);
  const sources = [...new Set(strings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissRentAdjustmentTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Swiss rent adjustment translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissVacationAccrual')) {
  const strings = [];
  const collect = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(swissVacationAccrualEnglish);
  const sources = [...new Set(strings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissVacationAccrualTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Swiss vacation accrual translation fallback is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'swissPremiumReduction')) {
  const strings = [];
  const collect = (value) => { if (typeof value === 'string') strings.push(value); else if (Array.isArray(value)) value.forEach(collect); else if (value && typeof value === 'object') Object.values(value).forEach(collect); };
  collect(swissPremiumReductionEnglish);
  const sources = [...new Set(strings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = swissPremiumReductionTranslationsByLocale[locale.key];
    if (!dictionary || sources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Swiss premium reduction fallback is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'codebreaker')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(codebreakerEnglish);
  const uniqueSources = [...new Set(sourceStrings.filter((source) => !Object.hasOwn(translationsByLocale.es, source)))];
  const tokens = /\{[^{}]+\}/gu;
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = codebreakerTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Codebreaker translation pack is incomplete for ${locale.key}.`);
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Codebreaker has an empty translation in ${locale.key}: ${source}`);
      const placeholders = (value) => value.match(tokens) ?? [];
      if (placeholders(source).length !== placeholders(translated).length) throw new Error(`Codebreaker lost a protected variable in ${locale.key}: ${source}`);
    }
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'shoeSize')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(shoeSizeEnglish);
  const uniqueSources = [...new Set(sourceStrings.filter((source) => !Object.hasOwn(translationsByLocale.es, source)))];
  const tokens = (value) => value.match(/\{[^{}]+\}/gu) ?? [];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = shoeSizeTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Shoe size translation pack is incomplete for ${locale.key}.`);
    for (const source of uniqueSources) {
      const translated = dictionary[source];
      if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Shoe size has an empty translation in ${locale.key}: ${source}`);
      if (tokens(source).length !== tokens(translated).length) throw new Error(`Shoe size lost a protected variable in ${locale.key}: ${source}`);
    }
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'childGrowth')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(childGrowthEnglish);
  const uniqueSources = [...new Set(sourceStrings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = childGrowthTranslationsByLocale[locale.key];
    if (!dictionary || Object.keys(dictionary).length !== uniqueSources.length) throw new Error(`Child growth translation pack is incomplete for ${locale.key}.`);
    for (const source of uniqueSources) if (typeof dictionary[source] !== 'string' || !dictionary[source].trim()) throw new Error(`Child growth has an empty translation in ${locale.key}: ${source}`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'ringSize')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(english.ringSize);
  const uniqueSources = [...new Set(sourceStrings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = ringSizeTranslationsByLocale[locale.key];
    if (!dictionary || uniqueSources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`Ring-size translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'model3dViewer')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(model3dViewerEnglish);
  const uniqueSources = [...new Set(sourceStrings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = model3dViewerGeneratedTranslationsByLocale[locale.key];
    if (!dictionary || uniqueSources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`3D model viewer translation pack is incomplete for ${locale.key}.`);
  }
}

if (toolsToBuild.some(({ mode }) => mode === 'dxfViewer')) {
  const sourceStrings = [];
  const collectStrings = (value) => {
    if (typeof value === 'string') sourceStrings.push(value);
    else if (Array.isArray(value)) value.forEach(collectStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
  };
  collectStrings(dxfViewerEnglish);
  const uniqueSources = [...new Set(sourceStrings)];
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = dxfViewerGeneratedTranslationsByLocale[locale.key];
    if (!dictionary || uniqueSources.some((source) => typeof dictionary[source] !== 'string' || !dictionary[source].trim())) throw new Error(`DXF viewer translation pack is incomplete for ${locale.key}.`);
  }
}
function copyFor(tool) {
  const explicit = {
    numerology: numerologyEnglish, nineMensMorris: nineMensMorrisEnglish, halma: halmaGameEnglish,
    canasta: canastaCardGameEnglish, skat: skatCardGameEnglish, doppelkopf: doppelkopfEnglish,
    schafkopf: schafkopfEnglish, schnapsen: schnapsenEnglish, suguru: suguruEnglish, shikaku: shikakuEnglish,
    brickBreaker: brickBreakerEnglish, miniGolf: miniGolfEnglish, matchThree: matchThreeEnglish,
    audioToMidi: audioToMidiEnglish, voiceChanger: voiceChangerEnglish, dicomViewer: dicomViewerEnglish,
    crazyEights: crazyEightsEnglish, idiotCardGame: idiotCardGameEnglish, jass: jassEnglish,
    warCardGame: warCardGameEnglish, natalChart: natalChartEnglish,
    geographyQuiz: geographyQuizEnglish,
    norwayChildSupport: norwayChildSupportEnglish,
    norwayEmployerCost: norwayEmployerCostEnglish,
    norwayParentalBenefit: norwayParentalBenefitEnglish,
    norwayUnemploymentBenefit: norwayUnemploymentBenefitEnglish,
    norwayHousingBenefit: norwayHousingBenefitEnglish,
    swissVehicleTax: swissVehicleTaxEnglish,
    currency: currencyConverterEnglish,
    carbonFootprint: carbonFootprintEnglish,
    dewPoint: dewPointEnglish,
    aquariumWaterMixing: aquariumWaterMixingEnglish,
    barcodeReader: barcodeReaderEnglish,
    scaleDrawing: scaleDrawingEnglish,
    shutBox: shutTheBoxEnglish,
    snakesAndLadders: snakesAndLaddersEnglish,
  }[tool.mode];
  const modeCopy = explicit ?? (tool.mode === 'norwayDisabilityBenefit' ? norwayDisabilityBenefitEnglish : tool.mode === 'norwayStudentFinance' ? norwayStudentFinanceEnglish : tool.mode === 'norwayBsu' ? norwayBsuEnglish : tool.mode === 'norwayCommutingDeduction' ? norwayCommutingDeductionEnglish : tool.mode === 'norwayMileageReimbursement' ? norwayMileageReimbursementEnglish : tool.mode === 'latePaymentInterest' ? latePaymentInterestEnglish : tool.mode === 'norwayImportCost' ? norwayImportCostEnglish : tool.mode === 'norwayCarImportCost' ? norwayCarImportCostEnglish : tool.mode === 'norwayTollCost' ? norwayTollCostEnglish : tool.mode === 'norwayPropertyTransfer' ? norwayPropertyTransferEnglish : tool.mode === 'norwayElectricitySupport' ? norwayElectricitySupportEnglish : tool.mode === 'beadPattern' ? beadPatternEnglish : tool.mode === 'codebreaker' ? codebreakerEnglish : tool.mode === 'fiveLetterWord' ? fiveLetterWordEnglish : tool.mode === 'shoeSize' ? shoeSizeEnglish : tool.mode === 'childGrowth' ? childGrowthEnglish : tool.mode === 'grisCardGame' ? grisCardGameEnglish : tool.mode === 'model3dViewer' ? model3dViewerEnglish : tool.mode === 'dxfViewer' ? dxfViewerEnglish : tool.mode === 'bridgeGame' ? bridgeGameEnglish : tool.mode === 'farkleGame' ? farkleEnglish : tool.mode === 'swissNetSalary' ? swissNetSalaryEnglish : tool.mode === 'swissTaxCompare' ? swissTaxCompareEnglish : tool.mode === 'swissAhvPension' ? swissAhvPensionEnglish : tool.mode === 'swissPillar3a' ? swissPillar3aEnglish : tool.mode === 'swissBvgPension' ? swissBvgPensionEnglish : tool.mode === 'swissPensionWithdrawal' ? swissPensionWithdrawalEnglish : tool.mode === 'swissHealthDeductible' ? swissHealthDeductibleEnglish : tool.mode === 'swissRentAdjustment' ? swissRentAdjustmentEnglish : tool.mode === 'swissVacationAccrual' ? swissVacationAccrualEnglish : tool.mode === 'swissPremiumReduction' ? swissPremiumReductionEnglish : tool.mode === 'swissWheelOffset' ? swissWheelOffsetEnglish : tool.mode === 'petAge' ? petAgeEnglish : tool.mode === 'resumeStructure' ? resumeStructureEnglish : tool.mode === 'vocalRemover' ? vocalRemoverEnglish : remainingToolsEnglish[tool.mode] ?? english[tool.mode]);
  return { ...english, ...modeCopy, actions: english.actions, messages: { ...english.messages, ...(modeCopy?.messages ?? {}) } };
}

// Render every requested page in memory first. A missing form, copy field, or
// locale pack must fail before the output tree is changed, never midway through
// the route loop.
const preflightErrors = [];
for (const tool of toolsToBuild) {
  const copy = copyFor(tool);
  for (const locale of locales) {
    try {
      renderPage({ tool, locale, locales, copy });
    } catch (error) {
      preflightErrors.push(`${tool.id} [${tool.mode}] / ${locale.key}: ${error.message}`);
    }
  }
}
if (preflightErrors.length) {
  throw new Error(`Market tools preflight failed for ${preflightErrors.length} page(s); no routes were written:\n${preflightErrors.join('\n')}`);
}

const urls = [];
await mkdir(staging, { recursive: false });
for (const tool of toolsToBuild) {
  const copy = copyFor(tool);
  for (const locale of locales) {
    const pathPrefix = locale.prefix.replace(/^\//u, '');
    const path = join(staging, pathPrefix, 'tools', tool.id, 'index.html');
    await mkdir(join(path, '..'), { recursive: true });
    await writeFile(path, rewriteAssetPrefix(renderPage({ tool, locale, locales, copy })));
    urls.push(`https://tools.usefulverse.com${locale.prefix}/tools/${tool.id}/`);
  }
}

const assets = join(staging, 'assets', 'market-tools');
await mkdir(assets, { recursive: true });
await copyFile(join(root, 'public/favicon.svg'), join(staging, 'favicon.svg'));
  for (const name of ['controller.mjs', 'display-test-controller.mjs', 'fps-test-controller.mjs', 'yatzy-controller.mjs', 'yatzy.mjs', 'microphone-controller.mjs', 'bubble-shooter-controller.mjs', 'bubble-shooter.mjs', 'numerology-controller.mjs', 'numerology.mjs', 'nine-mens-morris-controller.mjs', 'nine-mens-morris.mjs', 'halma-game-controller.mjs', 'halma-game.mjs', 'canasta-game-controller.mjs', 'canasta-game.mjs', 'skat-game-controller.mjs', 'skat-game.mjs', 'doppelkopf-controller.mjs', 'doppelkopf-game.mjs', 'schafkopf-controller.mjs', 'schafkopf-game.mjs', 'schnapsen-controller.mjs', 'schnapsen-game.mjs', 'suguru-controller.mjs', 'suguru.mjs', 'suguru-worker.mjs', 'shikaku-controller.mjs', 'shikaku.mjs', 'brick-breaker-controller.mjs', 'brick-breaker.mjs', 'minigolf-controller.mjs', 'minigolf.mjs', 'match-three-controller.mjs', 'match-three.mjs', 'audio-to-midi-controller.mjs', 'audio-to-midi-transcriber.mjs', 'audio-to-midi-worker.mjs', 'voice-changer-controller.mjs', 'voice-changer.mjs', 'dicom-viewer-controller.mjs', 'dicom-viewer.mjs', 'dicom-viewer-worker.mjs', 'crazy-eights-controller.mjs', 'crazy-eights-game.mjs', 'idiot-card-game-controller.mjs', 'jass-controller.mjs', 'jass-game.mjs', 'war-card-game-controller.mjs', 'war-game.mjs', 'natal-chart-controller.mjs', 'natal-chart.mjs', 'controller.mjs', 'five-letter-word-controller.mjs', 'five-letter-word.mjs', 'bridge-game-controller.mjs', 'bridge-game.mjs', 'farkle-controller.mjs', 'farkle.mjs', 'swiss-net-salary-controller.mjs', 'swiss-net-salary.mjs', 'swiss-tax-compare-controller.mjs', 'swiss-tax-compare.mjs', 'swiss-ahv-pension-controller.mjs', 'swiss-ahv-pension.mjs', 'swiss-pillar-3a-controller.mjs', 'swiss-pillar-3a.mjs', 'swiss-bvg-pension-controller.mjs', 'swiss-bvg-pension.mjs', 'swiss-pension-withdrawal-controller.mjs', 'swiss-pension-withdrawal.mjs', 'swiss-health-deductible-controller.mjs', 'swiss-health-deductible.mjs', 'swiss-rent-adjustment-controller.mjs', 'swiss-rent-adjustment.mjs', 'swiss-vacation-accrual-controller.mjs', 'swiss-vacation-accrual.mjs', 'swiss-premium-reduction-controller.mjs', 'swiss-premium-reduction.mjs', 'remaining-tools.mjs', 'remaining-tools-controller.mjs', 'resume-structure.mjs', 'resume-docx-archive.mjs', 'resume-structure-controller.mjs', 'vocal-remover-controller.mjs', 'norway-property-transfer-controller.mjs', 'norway-property-transfer.mjs', 'norway-electricity-support-controller.mjs', 'norway-electricity-support.mjs', 'bead-pattern-controller.mjs', 'bead-pattern.mjs', 'bead-pattern-worker.mjs', 'codebreaker-controller.mjs', 'codebreaker.mjs', 'shoe-size-controller.mjs', 'shoe-size.mjs', 'ring-size.mjs', 'ring-size-controller.mjs', 'child-growth-controller.mjs', 'child-growth.mjs', 'cdc-growth-data.mjs', 'model3d-viewer-controller.mjs', 'model3d-step-worker.js', 'dxf-viewer-controller.mjs', 'dxf-viewer-worker.mjs', 'norway-disability-benefit-controller.mjs', 'norway-disability-benefit.mjs', 'norway-student-finance-controller.mjs', 'norway-student-finance.mjs', 'norway-bsu-controller.mjs', 'norway-bsu.mjs', 'norway-commuting-deduction-controller.mjs', 'norway-commuting-deduction.mjs', 'norway-mileage-reimbursement-controller.mjs', 'norway-mileage-reimbursement.mjs', 'late-payment-interest-controller.mjs', 'late-payment-interest.mjs', 'norway-import-cost-controller.mjs', 'norway-import-cost.mjs', 'norway-car-import-cost-controller.mjs', 'norway-car-import-cost.mjs', 'norway-toll-stations-data.mjs', 'logic.mjs', 'binary-worker.mjs', 'markets.css']) {
  await copyMarketAsset(join(root, 'src/markets-no-ch', name), join(assets, name === 'markets.css' ? 'markets-no-ch.css' : name));
}
await copyMarketAsset(join(root, 'src/markets-no-ch/swiss-wheel-offset-controller.mjs'), join(assets, 'swiss-wheel-offset-controller.mjs'));
await copyMarketAsset(join(root, 'src/markets-no-ch/swiss-wheel-offset.mjs'), join(assets, 'swiss-wheel-offset.mjs'));
await copyMarketAsset(join(root, 'src/markets-no-ch/pet-age-controller.mjs'), join(assets, 'pet-age-controller.mjs'));
await copyMarketAsset(join(root, 'src/markets-no-ch/pet-age.mjs'), join(assets, 'pet-age.mjs'));
for (const [mode, files] of Object.entries({
  norwayTax: ['norway-tax-controller.mjs', 'norway-income-tax.mjs'],
  swissUid: ['swiss-uid-controller.mjs', 'swiss-uid.mjs'],
  swissCoordinates: ['swiss-coordinate-controller.mjs', 'swiss-coordinate-converter.mjs'],
  norwayCompanyCar: ['norway-company-car-controller.mjs', 'norway-company-car.mjs'],
  frequencyTone: ['frequency-tone-generator-controller.mjs', 'frequency-tone-generator.mjs'],
  pinball: ['pinball-controller.mjs', 'pinball.mjs'],
  amerikanerCardGame: ['amerikaner-card-game-controller.mjs', 'amerikaner-game.mjs'],
  presidentCardGame: ['president-card-game-controller.mjs', 'president-game.mjs'],
})) {
  if (!toolsToBuild.some((tool) => tool.mode === mode)) continue;
  for (const name of files) await copyMarketAsset(join(root, 'src/markets-no-ch', name), join(assets, name));
}
for (const [mode, files] of Object.entries({
  norwayChildSupport: ['norway-child-support-controller.mjs', 'norway-child-support.mjs'],
  norwayParentalBenefit: ['norway-parental-benefit-controller.mjs', 'norway-parental-benefit.mjs', 'norway-parental-calendar.mjs'],
  norwayUnemploymentBenefit: ['norway-unemployment-benefit-controller.mjs', 'norway-unemployment-benefit.mjs'],
  norwayHousingBenefit: ['norway-housing-benefit-controller.mjs', 'norway-housing-benefit.mjs'],
  norwayWealthTax: ['norway-wealth-tax-controller.mjs', 'norway-wealth-tax.mjs'],
  swissVehicleTax: ['switzerland-vehicle-tax-controller.mjs', 'switzerland-vehicle-tax.mjs'],
  currency: ['currency-converter-controller.mjs', 'currency-converter.mjs'],
  carbonFootprint: ['carbon-footprint-controller.mjs', 'carbon-footprint.mjs', 'carbon-electricity-factors.mjs'],
  dewPoint: ['dew-point-controller.mjs', 'dew-point.mjs'],
  aquariumWaterMixing: ['aquarium-water-mixing-controller.mjs', 'aquarium-water-mixing.mjs'],
  barcodeReader: ['barcode-reader-controller.mjs', 'barcode-reader.mjs'],
  scaleDrawing: ['scale-drawing-controller.mjs', 'scale-drawing.mjs'],
  snakesAndLadders: ['snakes-and-ladders-controller.mjs', 'snakes-and-ladders.mjs'],
  geographyQuiz: ['geography-quiz-controller.mjs', 'geography-quiz.mjs', 'geography-quiz-data.mjs'],
  shutBox: ['shut-the-box-controller.mjs', 'shut-the-box.mjs'],
  grisCardGame: ['gris-card-game-controller.mjs', 'gris-game.mjs'],
})) {
  if (!toolsToBuild.some((tool) => tool.mode === mode)) continue;
  for (const name of files) await copyMarketAsset(join(root, 'src/markets-no-ch', name), join(assets, name));
}
if (toolsToBuild.some(({ mode }) => mode === 'vocalRemover')) {
  const runtime = join(assets, 'vocal-remover'); await mkdir(runtime, { recursive: true });
  const ortDist = join(root, 'node_modules/onnxruntime-web/dist');
  for (const name of ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm']) await copyMarketAsset(join(ortDist, name), join(runtime, name));
  await copyMarketAsset(join(root, 'docs/markets-no-ch/ONNXRUNTIME-WEB-LICENSE.txt'), join(runtime, 'ONNXRUNTIME-WEB-MIT-LICENSE.txt'));
  await copyMarketAsset(join(root, 'docs/markets-no-ch/OPEN-UNMIX-MIT-LICENSE.txt'), join(runtime, 'OPEN-UNMIX-MIT-LICENSE.txt'));
  await bundle({ entryPoints: [join(root, 'src/markets-no-ch/vocal-remover-worker.mjs')], outfile: join(assets, 'vocal-remover-worker.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'none' });
  await writeFile(join(assets, 'vocal-remover-worker.mjs'), rewriteAssetPrefix(await readFile(join(assets, 'vocal-remover-worker.mjs'), 'utf8')));
}
if (toolsToBuild.some(({ mode }) => mode === 'resumeStructure')) {
  const vendor = join(assets, 'vendor'); await mkdir(vendor, { recursive: true });
  const pdfDist = join(root, 'node_modules/pdfjs-dist');
  await copyMarketAsset(join(pdfDist, 'build/pdf.mjs'), join(vendor, 'pdf.min.mjs'));
  await copyMarketAsset(join(pdfDist, 'build/pdf.worker.mjs'), join(vendor, 'pdf.worker.min.mjs'));
  await copyMarketAsset(join(pdfDist, 'LICENSE'), join(vendor, 'PDFJS-APACHE-LICENSE.txt'));
  await copyMarketAsset(join(root, 'node_modules/fflate/LICENSE'), join(assets, 'FFLATE-MIT-LICENSE.txt'));
  await bundle({ entryPoints: [join(root, 'src/markets-no-ch/resume-structure-worker.mjs')], outfile: join(assets, 'resume-structure-worker.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'none' });
  await writeFile(join(assets, 'resume-structure-worker.mjs'), rewriteAssetPrefix(await readFile(join(assets, 'resume-structure-worker.mjs'), 'utf8')));
  for (const directory of ['cmaps', 'standard_fonts']) await cp(join(pdfDist, directory), join(vendor, directory), { recursive: true });
}
if (toolsToBuild.some(({ mode }) => mode === 'fiveLetterWord')) {
  const bankOut = join(assets, 'five-letter-word-bank');
  await mkdir(bankOut, { recursive: true });
  for (const name of ['nb-accepted.txt', 'nb-targets.txt', 'ATTRIBUTION.txt']) await copyMarketAsset(join(root, 'src/markets-no-ch/five-letter-word-bank', name), join(bankOut, name));
}
if (toolsToBuild.some(({ mode }) => mode === 'dxfViewer')) {
  await bundle({ entryPoints: [join(root, 'src/markets-no-ch/dxf-viewer-worker.mjs')], outfile: join(assets, 'dxf-viewer-worker.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'none' });
  await writeFile(join(assets, 'dxf-viewer-worker.mjs'), rewriteAssetPrefix(await readFile(join(assets, 'dxf-viewer-worker.mjs'), 'utf8')));
  await copyMarketAsset(join(root, 'docs/markets-no-ch/licenses/DXF-PARSER-MIT-LICENSE.txt'), join(assets, 'DXF-PARSER-MIT-LICENSE.txt'));
  await copyMarketAsset(join(root, 'docs/markets-no-ch/licenses/LOGLEVEL-MIT-LICENSE.txt'), join(assets, 'LOGLEVEL-MIT-LICENSE.txt'));
}
if (toolsToBuild.some(({ mode }) => mode === 'model3dViewer')) {
  for (const name of ['occt-import-js.js', 'occt-import-js.wasm']) {
    await copyMarketAsset(join(root, 'src/markets-no-ch/vendor/occt-import-js-0.0.23', name), join(assets, name));
  }
  for (const name of ['OCCT-IMPORT-JS-LGPL-2.1.txt', 'OCCT-LGPL-2.1.txt', 'OCCT-LGPL-EXCEPTION-1.0.txt']) {
    await copyMarketAsset(join(root, 'docs/markets-no-ch/licenses', name), join(assets, name));
  }
  await bundle({ entryPoints: [join(root, 'src/markets-no-ch/model3d-viewer-runtime.mjs')], outfile: join(assets, 'model3d-viewer-runtime.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'none' });
  await bundle({ entryPoints: [join(root, 'src/markets-no-ch/model3d-viewer-worker.mjs')], outfile: join(assets, 'model3d-viewer-worker.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'none' });
  for (const name of ['model3d-viewer-runtime.mjs', 'model3d-viewer-worker.mjs']) await writeFile(join(assets, name), rewriteAssetPrefix(await readFile(join(assets, name), 'utf8')));
  await copyMarketAsset(join(root, 'docs/markets-no-ch/licenses/THREE-MIT-LICENSE.txt'), join(assets, 'THREE-MIT-LICENSE.txt'));
}
if (toolsToBuild.some(({ mode }) => mode === 'natalChart')) {
  const vendor = join(assets, 'vendor'); await mkdir(vendor, { recursive: true });
  await copyMarketAsset(join(root, 'src/markets-no-ch/vendor/astronomy.browser.min.js'), join(vendor, 'astronomy.browser.min.js'));
  await copyMarketAsset(join(root, 'src/markets-no-ch/vendor/ASTRONOMY-ENGINE-MIT-LICENSE.txt'), join(vendor, 'ASTRONOMY-ENGINE-MIT-LICENSE.txt'));
}
const now = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${now}</lastmod></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(staging, 'market-pilot-sitemap-fragment.xml'), sitemap);
await rename(staging, output);
console.log(`Built ${urls.length} pilot routes for ${toolsToBuild.length} tools in ${locales.length} locales at ${output}. This is a test artifact, not the complete production site.`);
