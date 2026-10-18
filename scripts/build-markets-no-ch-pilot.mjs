import { copyFile, cp, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as bundle } from 'esbuild';
import { localeEntries } from '../src/locales.mjs';
import { english } from '../src/markets-no-ch/copy-en.mjs';
import { translationsByLocale } from '../src/markets-no-ch/translations.mjs';
import { marketTools } from '../src/markets-no-ch/catalog.mjs';
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
import { swissPremiumReductionTranslationsByLocale } from '../src/markets-no-ch/swiss-premium-reduction-translations.mjs';
import { remainingToolsEnglish } from '../src/markets-no-ch/remaining-tools-copy-en.mjs';
import { resumeStructureEnglish } from '../src/markets-no-ch/resume-structure-copy-en.mjs';
import { vocalRemoverEnglish } from '../src/markets-no-ch/vocal-remover-copy-en.mjs';
import { finalCandidateTranslationsByLocale } from '../src/markets-no-ch/final-candidate-translations.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = resolve(process.env.MARKETS_NO_CH_DIST ?? '/private/tmp/usefulverse-market-pilot-dist');
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


if (marketTools.some(({ mode }) => mode === 'grisCardGame')) {
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

if (marketTools.some(({ mode }) => mode === 'fiveLetterWord')) {
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

if (marketTools.some(({ mode }) => mode === 'bridgeGame')) {
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

if (marketTools.some(({ mode }) => mode === 'farkleGame')) {
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

if (marketTools.some(({ mode }) => mode === 'swissNetSalary')) {
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

if (marketTools.some(({ mode }) => mode === 'swissTaxCompare')) {
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

if (marketTools.some(({ mode }) => mode === 'swissAhvPension')) {
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

if (marketTools.some(({ mode }) => mode === 'codebreaker')) {
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

if (marketTools.some(({ mode }) => mode === 'shoeSize')) {
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

if (marketTools.some(({ mode }) => mode === 'childGrowth')) {
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

if (marketTools.some(({ mode }) => mode === 'ringSize')) {
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

if (marketTools.some(({ mode }) => mode === 'model3dViewer')) {
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

if (marketTools.some(({ mode }) => mode === 'dxfViewer')) {
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

const urls = [];
for (const tool of toolsToBuild) {
  const modeCopy = tool.mode === 'norwayDisabilityBenefit' ? norwayDisabilityBenefitEnglish : tool.mode === 'norwayStudentFinance' ? norwayStudentFinanceEnglish : tool.mode === 'norwayBsu' ? norwayBsuEnglish : tool.mode === 'norwayCommutingDeduction' ? norwayCommutingDeductionEnglish : tool.mode === 'norwayMileageReimbursement' ? norwayMileageReimbursementEnglish : tool.mode === 'latePaymentInterest' ? latePaymentInterestEnglish : tool.mode === 'norwayImportCost' ? norwayImportCostEnglish : tool.mode === 'norwayCarImportCost' ? norwayCarImportCostEnglish : tool.mode === 'norwayTollCost' ? norwayTollCostEnglish : tool.mode === 'norwayPropertyTransfer' ? norwayPropertyTransferEnglish : tool.mode === 'norwayElectricitySupport' ? norwayElectricitySupportEnglish : tool.mode === 'beadPattern' ? beadPatternEnglish : tool.mode === 'codebreaker' ? codebreakerEnglish : tool.mode === 'fiveLetterWord' ? fiveLetterWordEnglish : tool.mode === 'shoeSize' ? shoeSizeEnglish : tool.mode === 'childGrowth' ? childGrowthEnglish : tool.mode === 'grisCardGame' ? grisCardGameEnglish : tool.mode === 'model3dViewer' ? model3dViewerEnglish : tool.mode === 'dxfViewer' ? dxfViewerEnglish : tool.mode === 'bridgeGame' ? bridgeGameEnglish : tool.mode === 'farkleGame' ? farkleEnglish : tool.mode === 'swissNetSalary' ? swissNetSalaryEnglish : tool.mode === 'swissTaxCompare' ? swissTaxCompareEnglish : tool.mode === 'swissAhvPension' ? swissAhvPensionEnglish : tool.mode === 'swissPillar3a' ? swissPillar3aEnglish : tool.mode === 'swissBvgPension' ? swissBvgPensionEnglish : tool.mode === 'swissPensionWithdrawal' ? swissPensionWithdrawalEnglish : tool.mode === 'swissHealthDeductible' ? swissHealthDeductibleEnglish : tool.mode === 'swissRentAdjustment' ? swissRentAdjustmentEnglish : tool.mode === 'swissVacationAccrual' ? swissVacationAccrualEnglish : tool.mode === 'swissPremiumReduction' ? swissPremiumReductionEnglish : tool.mode === 'resumeStructure' ? resumeStructureEnglish : tool.mode === 'vocalRemover' ? vocalRemoverEnglish : remainingToolsEnglish[tool.mode] ?? english[tool.mode];
  const copy = { ...english, ...modeCopy, actions: english.actions, messages: { ...english.messages, ...(modeCopy?.messages ?? {}) } };
  for (const locale of locales) {
    const pathPrefix = locale.prefix.replace(/^\//u, '');
    const path = join(output, pathPrefix, 'tools', tool.id, 'index.html');
    await mkdir(join(path, '..'), { recursive: true });
    await writeFile(path, renderPage({ tool, locale, locales, copy }));
    urls.push(`https://tools.usefulverse.com${locale.prefix}/tools/${tool.id}/`);
  }
}

const assets = join(output, 'assets');
await mkdir(assets, { recursive: true });
await copyFile(join(root, 'public/favicon.svg'), join(output, 'favicon.svg'));
  for (const name of ['controller.mjs', 'five-letter-word-controller.mjs', 'five-letter-word.mjs', 'bridge-game-controller.mjs', 'bridge-game.mjs', 'farkle-controller.mjs', 'farkle.mjs', 'swiss-net-salary-controller.mjs', 'swiss-net-salary.mjs', 'swiss-tax-compare-controller.mjs', 'swiss-tax-compare.mjs', 'swiss-ahv-pension-controller.mjs', 'swiss-ahv-pension.mjs', 'swiss-pillar-3a-controller.mjs', 'swiss-pillar-3a.mjs', 'swiss-bvg-pension-controller.mjs', 'swiss-bvg-pension.mjs', 'swiss-pension-withdrawal-controller.mjs', 'swiss-pension-withdrawal.mjs', 'swiss-health-deductible-controller.mjs', 'swiss-health-deductible.mjs', 'swiss-rent-adjustment-controller.mjs', 'swiss-rent-adjustment.mjs', 'swiss-vacation-accrual-controller.mjs', 'swiss-vacation-accrual.mjs', 'swiss-premium-reduction-controller.mjs', 'swiss-premium-reduction.mjs', 'remaining-tools.mjs', 'remaining-tools-controller.mjs', 'resume-structure.mjs', 'resume-docx-archive.mjs', 'resume-structure-controller.mjs', 'vocal-remover-controller.mjs', 'norway-property-transfer-controller.mjs', 'norway-property-transfer.mjs', 'norway-electricity-support-controller.mjs', 'norway-electricity-support.mjs', 'bead-pattern-controller.mjs', 'bead-pattern.mjs', 'bead-pattern-worker.mjs', 'codebreaker-controller.mjs', 'codebreaker.mjs', 'shoe-size-controller.mjs', 'shoe-size.mjs', 'ring-size.mjs', 'ring-size-controller.mjs', 'child-growth-controller.mjs', 'child-growth.mjs', 'cdc-growth-data.mjs', 'model3d-viewer-controller.mjs', 'model3d-step-worker.js', 'dxf-viewer-controller.mjs', 'dxf-viewer-worker.mjs', 'norway-disability-benefit-controller.mjs', 'norway-disability-benefit.mjs', 'norway-student-finance-controller.mjs', 'norway-student-finance.mjs', 'norway-bsu-controller.mjs', 'norway-bsu.mjs', 'norway-commuting-deduction-controller.mjs', 'norway-commuting-deduction.mjs', 'norway-mileage-reimbursement-controller.mjs', 'norway-mileage-reimbursement.mjs', 'late-payment-interest-controller.mjs', 'late-payment-interest.mjs', 'norway-import-cost-controller.mjs', 'norway-import-cost.mjs', 'norway-car-import-cost-controller.mjs', 'norway-car-import-cost.mjs', 'norway-toll-stations-data.mjs', 'logic.mjs', 'binary-worker.mjs', 'bubble-shooter.mjs', 'markets.css']) {
await copyFile(join(root, 'src/markets-no-ch', name), join(assets, name === 'markets.css' ? 'markets-no-ch.css' : name));
}
if (toolsToBuild.some(({ mode }) => mode === 'vocalRemover')) {
  const runtime = join(assets, 'vocal-remover'); await mkdir(runtime, { recursive: true });
  const ortDist = join(root, 'node_modules/onnxruntime-web/dist');
  for (const name of ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm']) await copyFile(join(ortDist, name), join(runtime, name));
  await copyFile(join(root, 'docs/markets-no-ch/ONNXRUNTIME-WEB-LICENSE.txt'), join(runtime, 'ONNXRUNTIME-WEB-MIT-LICENSE.txt'));
  await copyFile(join(root, 'docs/markets-no-ch/OPEN-UNMIX-MIT-LICENSE.txt'), join(runtime, 'OPEN-UNMIX-MIT-LICENSE.txt'));
  await bundle({ entryPoints: [join(root, 'src/markets-no-ch/vocal-remover-worker.mjs')], outfile: join(assets, 'vocal-remover-worker.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'none' });
}
if (toolsToBuild.some(({ mode }) => mode === 'resumeStructure')) {
  const vendor = join(assets, 'vendor'); await mkdir(vendor, { recursive: true });
  const pdfDist = join(root, 'node_modules/pdfjs-dist');
  await copyFile(join(pdfDist, 'build/pdf.mjs'), join(vendor, 'pdf.min.mjs'));
  await copyFile(join(pdfDist, 'build/pdf.worker.mjs'), join(vendor, 'pdf.worker.min.mjs'));
  await copyFile(join(pdfDist, 'LICENSE'), join(vendor, 'PDFJS-APACHE-LICENSE.txt'));
  await copyFile(join(root, 'node_modules/fflate/LICENSE'), join(assets, 'FFLATE-MIT-LICENSE.txt'));
  await bundle({ entryPoints: [join(root, 'src/markets-no-ch/resume-structure-worker.mjs')], outfile: join(assets, 'resume-structure-worker.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'none' });
  for (const directory of ['cmaps', 'standard_fonts']) await cp(join(pdfDist, directory), join(vendor, directory), { recursive: true });
}
if (toolsToBuild.some(({ mode }) => mode === 'fiveLetterWord')) {
  const bankOut = join(assets, 'five-letter-word-bank');
  await mkdir(bankOut, { recursive: true });
  for (const name of ['nb-accepted.txt', 'nb-targets.txt', 'ATTRIBUTION.txt']) await copyFile(join(root, 'src/markets-no-ch/five-letter-word-bank', name), join(bankOut, name));
}
if (toolsToBuild.some(({ mode }) => mode === 'dxfViewer')) {
  await bundle({ entryPoints: [join(root, 'src/markets-no-ch/dxf-viewer-worker.mjs')], outfile: join(assets, 'dxf-viewer-worker.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'none' });
  await copyFile(join(root, 'docs/markets-no-ch/licenses/DXF-PARSER-MIT-LICENSE.txt'), join(assets, 'DXF-PARSER-MIT-LICENSE.txt'));
  await copyFile(join(root, 'docs/markets-no-ch/licenses/LOGLEVEL-MIT-LICENSE.txt'), join(assets, 'LOGLEVEL-MIT-LICENSE.txt'));
}
if (toolsToBuild.some(({ mode }) => mode === 'model3dViewer')) {
  for (const name of ['occt-import-js.js', 'occt-import-js.wasm']) {
    await copyFile(join(root, 'src/markets-no-ch/vendor/occt-import-js-0.0.23', name), join(assets, name));
  }
  for (const name of ['OCCT-IMPORT-JS-LGPL-2.1.txt', 'OCCT-LGPL-2.1.txt', 'OCCT-LGPL-EXCEPTION-1.0.txt']) {
    await copyFile(join(root, 'docs/markets-no-ch/licenses', name), join(assets, name));
  }
  await bundle({ entryPoints: [join(root, 'src/markets-no-ch/model3d-viewer-runtime.mjs')], outfile: join(assets, 'model3d-viewer-runtime.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'none' });
  await bundle({ entryPoints: [join(root, 'src/markets-no-ch/model3d-viewer-worker.mjs')], outfile: join(assets, 'model3d-viewer-worker.mjs'), bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'none' });
  await copyFile(join(root, 'docs/markets-no-ch/licenses/THREE-MIT-LICENSE.txt'), join(assets, 'THREE-MIT-LICENSE.txt'));
}
const now = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${now}</lastmod></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(output, 'market-pilot-sitemap-fragment.xml'), sitemap);
console.log(`Built ${urls.length} pilot routes for ${toolsToBuild.length} tools in ${locales.length} locales at ${output}. This is a test artifact, not the complete production site.`);
