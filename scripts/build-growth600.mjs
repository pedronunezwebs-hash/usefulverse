import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { minify as minifyCss } from 'csso';
import { localeEntries } from '../src/locales.mjs';
import { tools as currentTools } from '../src/catalog.mjs';
import { growthPilotTools } from '../src/growth600/catalog.mjs';
import { bundleGrowthControllers } from '../src/growth600/bundle-controllers.mjs';
import { buildGrowthStaticSite } from '../src/growth600/build.mjs';
import markdownEditorCopies from '../src/growth600/locales/markdown-editor-final.mjs';
import purchaseOrderGeneratorCopies from '../src/growth600/locales/purchase-order-generator-final.mjs';
import eigenvalueCalculatorCopies from '../src/growth600/locales/eigenvalue-calculator-final.mjs';
import bondCalculatorCopies from '../src/growth600/locales/bond-calculator-final.mjs';
import waistToHipRatioCopies from '../src/growth600/locales/waist-to-hip-ratio-calculator-final.mjs';
import hebrewCalendarConverterCopies from '../src/growth600/locales/hebrew-calendar-converter-final.mjs';
import absoluteValueCalculatorCopies from '../src/growth600/locales/absolute-value-calculator-final.mjs';
import specificHeatCalculatorCopies from '../src/growth600/locales/specific-heat-calculator-final.mjs';
import rcTimeConstantCalculatorCopies from '../src/growth600/locales/rc-time-constant-calculator-final.mjs';
import reverseMortgageCalculatorCopies from '../src/growth600/locales/reverse-mortgage-calculator-final.mjs';
import carDepreciationCalculatorCopies from '../src/growth600/locales/car-depreciation-calculator-final.mjs';
import stockProfitCalculatorCopies from '../src/growth600/locales/stock-profit-calculator-final.mjs';
import pensionCalculatorCopies from '../src/growth600/locales/pension-calculator-final.mjs';
import lifetimeValueCalculatorCopies from '../src/growth600/locales/lifetime-value-calculator-final.mjs';
import polarGraphingCalculatorCopies from '../src/growth600/locales/polar-graphing-calculator-final.mjs';
import booleanAlgebraCalculatorCopies from '../src/growth600/locales/boolean-algebra-calculator-final.mjs';
import weekNumberCalculatorCopies from '../src/growth600/locales/week-number-calculator-final.mjs';
import inductorCalculatorCopies from '../src/growth600/locales/inductor-calculator-final.mjs';
import centripetalForceCalculatorCopies from '../src/growth600/locales/centripetal-force-calculator-final.mjs';
import writingTrackerCopies from '../src/growth600/locales/writing-tracker-final.mjs';
import aesEncryptionToolCopies from '../src/growth600/locales/aes-encryption-tool-final.mjs';
import jwtEncoderCopies from '../src/growth600/locales/jwt-encoder-final.mjs';
import graphqlFormatterCopies from '../src/growth600/locales/graphql-formatter-final.mjs';
import rsaKeyGeneratorCopies from '../src/growth600/locales/rsa-key-generator-final.mjs';
import logAnalyzerCopies from '../src/growth600/locales/log-analyzer-final.mjs';
import inflationCalculatorCopies from '../src/growth600/locales/inflation-calculator-final.mjs';
import retirementCalculatorCopies from '../src/growth600/locales/retirement-calculator-final.mjs';
import textToSpeechCopies from '../src/growth600/locales/text-to-speech-final.mjs';
import worldClockCopies from '../src/growth600/locales/world-clock-final.mjs';
import euchreCopies from '../src/growth600/locales/euchre-final.mjs';
import nameGeneratorCopies from '../src/growth600/locales/name-generator-final.mjs';
import cribbageCopies from '../src/growth600/locales/cribbage-final.mjs';
import fourOhOneKCalculatorCopies from '../src/growth600/locales/401k-calculator-final.mjs';
import ginRummyCopies from '../src/growth600/locales/gin-rummy-final.mjs';
import familyTreeMakerCopies from '../src/growth600/locales/family-tree-maker-final.mjs';
import dividendCalculatorCopies from '../src/growth600/locales/dividend-calculator-final.mjs';
import netWorthCalculatorCopies from '../src/growth600/locales/net-worth-calculator-final.mjs';
import randomWordGeneratorCopies from '../src/growth600/locales/random-word-generator-final.mjs';
import breathingExerciseCopies from '../src/growth600/locales/breathing-exercise-final.mjs';
import alarmClockCopies from '../src/growth600/locales/alarm-clock-final.mjs';
import imageVectorizerCopies from '../src/growth600/locales/image-vectorizer-final.mjs';
import vo2MaxCalculatorCopies from '../src/growth600/locales/vo2-max-calculator-final.mjs';

const root = resolve(import.meta.dirname, '..');
const localeDir = resolve(root, 'src/growth600/locales');
const missing = [];
const copyByLocale = {};
for (const locale of localeEntries) {
  const path = resolve(localeDir, `${locale.key}.mjs`);
  try {
    await access(path);
    copyByLocale[locale.key] = (await import(`${pathToFileURL(path).href}?v=${Date.now()}`)).default;
  } catch (error) {
    if (error.code === 'ENOENT') missing.push(locale.key);
    else throw error;
  }
}
if (missing.length) throw new Error(`Growth600 release blocked: translated copy is missing for ${missing.join(', ')}.`);
for (const { key } of localeEntries) {
  if (!markdownEditorCopies[key]) throw new Error(`Growth600 release blocked: Markdown Editor copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'markdown-editor': markdownEditorCopies[key] };
  if (!purchaseOrderGeneratorCopies[key]) throw new Error(`Growth600 release blocked: Purchase Order Generator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'purchase-order-generator': purchaseOrderGeneratorCopies[key] };
  if (!eigenvalueCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Eigenvalue Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'eigenvalue-calculator': eigenvalueCalculatorCopies[key] };
  if (!bondCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Bond Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'bond-calculator': bondCalculatorCopies[key] };
  if (!waistToHipRatioCopies[key]) throw new Error(`Growth600 release blocked: Waist to Hip Ratio copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'waist-to-hip-ratio-calculator': waistToHipRatioCopies[key] };
  if (!hebrewCalendarConverterCopies[key]) throw new Error(`Growth600 release blocked: Hebrew Calendar Converter copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'hebrew-calendar-converter': hebrewCalendarConverterCopies[key] };
  if (!absoluteValueCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Absolute Value Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'absolute-value-calculator': absoluteValueCalculatorCopies[key] };
  if (!specificHeatCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Specific Heat Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'specific-heat-calculator': specificHeatCalculatorCopies[key] };
  if (!rcTimeConstantCalculatorCopies[key]) throw new Error(`Growth600 release blocked: RC Time Constant Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'rc-time-constant-calculator': rcTimeConstantCalculatorCopies[key] };
  copyByLocale[key] = { ...copyByLocale[key], 'reverse-mortgage-calculator': reverseMortgageCalculatorCopies[key] };
  if (!carDepreciationCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Car Depreciation Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'car-depreciation-calculator': carDepreciationCalculatorCopies[key] };
  if (!stockProfitCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Stock Profit Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'stock-profit-calculator': stockProfitCalculatorCopies[key] };
  if (!pensionCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Pension Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'pension-calculator': pensionCalculatorCopies[key] };
  if (!lifetimeValueCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Customer Lifetime Value Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'lifetime-value-calculator': lifetimeValueCalculatorCopies[key] };
  if (!polarGraphingCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Polar Graphing Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'polar-graphing-calculator': polarGraphingCalculatorCopies[key] };
  if (!booleanAlgebraCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Boolean Algebra Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'boolean-algebra-calculator': booleanAlgebraCalculatorCopies[key] };
  if (!weekNumberCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Week Number Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'week-number-calculator': weekNumberCalculatorCopies[key] };
  if (!inductorCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Inductor Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'inductor-calculator': inductorCalculatorCopies[key] };
  if (!centripetalForceCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Centripetal Force Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'centripetal-force-calculator': centripetalForceCalculatorCopies[key] };
  if (!writingTrackerCopies[key]) throw new Error(`Growth600 release blocked: Writing Tracker copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'writing-tracker': writingTrackerCopies[key] };
  if (!aesEncryptionToolCopies[key]) throw new Error(`Growth600 release blocked: AES Encryption Tool copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'aes-encryption-tool': aesEncryptionToolCopies[key] };
  if (!jwtEncoderCopies[key]) throw new Error(`Growth600 release blocked: JWT Encoder copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'jwt-encoder': jwtEncoderCopies[key] };
  if (!graphqlFormatterCopies[key]) throw new Error(`Growth600 release blocked: GraphQL Formatter copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'graphql-formatter': graphqlFormatterCopies[key] };
  if (!rsaKeyGeneratorCopies[key]) throw new Error(`Growth600 release blocked: RSA Key Generator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'rsa-key-generator': rsaKeyGeneratorCopies[key] };
  if (!logAnalyzerCopies[key]) throw new Error(`Growth600 release blocked: Log Analyzer copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'log-analyzer': logAnalyzerCopies[key] };
  if (!inflationCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Inflation Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'inflation-calculator': inflationCalculatorCopies[key] };
  if (!retirementCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Retirement Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'retirement-calculator': retirementCalculatorCopies[key] };
  if (!textToSpeechCopies[key]) throw new Error(`Growth600 release blocked: Text to Speech copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'text-to-speech': textToSpeechCopies[key] };
  if (!worldClockCopies[key]) throw new Error(`Growth600 release blocked: World Clock copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'world-clock': worldClockCopies[key] };
  if (!euchreCopies[key]) throw new Error(`Growth600 release blocked: Euchre copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], euchre: euchreCopies[key] };
  if (!nameGeneratorCopies[key]) throw new Error(`Growth600 release blocked: Name Generator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'name-generator': nameGeneratorCopies[key] };
  if (!randomWordGeneratorCopies[key]) throw new Error(`Growth600 release blocked: Random Word Generator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'random-word-generator': randomWordGeneratorCopies[key] };
  if (!breathingExerciseCopies[key]) throw new Error(`Growth600 release blocked: Breathing Exercise copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'breathing-exercise': breathingExerciseCopies[key] };
  if (!alarmClockCopies[key]) throw new Error(`Growth600 release blocked: Online Alarm Clock copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'alarm-clock': alarmClockCopies[key] };
  if (!imageVectorizerCopies[key]) throw new Error(`Growth600 release blocked: Image Vectorizer copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'image-vectorizer': imageVectorizerCopies[key] };
  if (!vo2MaxCalculatorCopies[key]) throw new Error(`Growth600 release blocked: VO2 Max Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'vo2-max-calculator': vo2MaxCalculatorCopies[key] };
  if (!cribbageCopies[key]) throw new Error(`Growth600 release blocked: Cribbage copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], cribbage: cribbageCopies[key] };
  if (!fourOhOneKCalculatorCopies[key]) throw new Error(`Growth600 release blocked: 401(k) Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], '401k-calculator': fourOhOneKCalculatorCopies[key] };
  if (!ginRummyCopies[key]) throw new Error(`Growth600 release blocked: Gin Rummy copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'gin-rummy': ginRummyCopies[key] };
  if (!familyTreeMakerCopies[key]) throw new Error(`Growth600 release blocked: Family Tree Maker copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'family-tree-maker': familyTreeMakerCopies[key] };
  if (!dividendCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Dividend Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'dividend-calculator': dividendCalculatorCopies[key] };
  if (!netWorthCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Net Worth Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'net-worth-calculator': netWorthCalculatorCopies[key] };
}

const outputDir = resolve(process.env.GROWTH600_DIST ?? resolve(root, 'dist-growth600'));
const styleFiles = [
  'src/growth600/site.css', 'src/growth600/rtl-fixes.css',
  'src/growth600/tools/peg-solitaire/peg-solitaire.css',
  'src/growth600/tools/futoshiki/futoshiki.css',
  'src/growth600/tools/hashi-puzzle/hashi-puzzle.css',
  'src/growth600/tools/chess-opening-trainer/chess-opening-trainer.css',
];
const styles = minifyCss((await Promise.all(styleFiles.map((file) => readFile(resolve(root, file), 'utf8')))).join(''), { comments: 'exclamation' }).css;
const toolStyles = {
  'boolean-algebra-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/boolean-algebra-calculator/boolean-algebra-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'slitherlink': minifyCss(await readFile(resolve(root, 'src/growth600/tools/slitherlink/slitherlink.css'), 'utf8'), { comments: 'exclamation' }).css,
  'har-viewer': minifyCss(await readFile(resolve(root, 'src/growth600/tools/har-viewer/har-viewer.css'), 'utf8'), { comments: 'exclamation' }).css,
  'robots-txt-tester': minifyCss(await readFile(resolve(root, 'src/growth600/tools/robots-txt-tester/robots-txt-tester.css'), 'utf8'), { comments: 'exclamation' }).css,
  'binary-base64-tool': minifyCss(await readFile(resolve(root, 'src/growth600/tools/binary-base64-tool/binary-base64-tool.css'), 'utf8'), { comments: 'exclamation' }).css,
  'csv-editor': minifyCss(await readFile(resolve(root, 'src/growth600/tools/csv-editor/csv-editor.css'), 'utf8'), { comments: 'exclamation' }).css,
  'logic-grid-puzzle': minifyCss(await readFile(resolve(root, 'src/growth600/tools/logic-grid-puzzle/logic-grid-puzzle.css'), 'utf8'), { comments: 'exclamation' }).css,
  'markdown-editor': minifyCss(await readFile(resolve(root, 'src/growth600/tools/markdown-editor/markdown-editor.css'), 'utf8'), { comments: 'exclamation' }).css,
  'purchase-order-generator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/purchase-order-generator/purchase-order-generator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'eigenvalue-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/eigenvalue-calculator/eigenvalue-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'bond-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/bond-calculator/bond-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'waist-to-hip-ratio-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/waist-to-hip-ratio-calculator/waist-to-hip-ratio-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'body-surface-area-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/body-surface-area-calculator/body-surface-area-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'weekly-planner': minifyCss(await readFile(resolve(root, 'src/growth600/tools/weekly-planner/weekly-planner.css'), 'utf8'), { comments: 'exclamation' }).css,
  'overtime-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/overtime-calculator/overtime-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'meeting-minutes-template': minifyCss(await readFile(resolve(root, 'src/growth600/tools/meeting-minutes-template/meeting-minutes-template.css'), 'utf8'), { comments: 'exclamation' }).css,
  'dots-and-boxes': minifyCss(await readFile(resolve(root, 'src/growth600/tools/dots-and-boxes/dots-and-boxes.css'), 'utf8'), { comments: 'exclamation' }).css,
  'color-mixer': minifyCss(await readFile(resolve(root, 'src/growth600/tools/color-mixer/color-mixer.css'), 'utf8'), { comments: 'exclamation' }).css,
  'blackjack-game': minifyCss(await readFile(resolve(root, 'src/growth600/tools/blackjack-game/blackjack-game.css'), 'utf8'), { comments: 'exclamation' }).css,
  'debt-to-income-ratio-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/debt-to-income-ratio-calculator/debt-to-income-ratio-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'car-lease-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/car-lease-calculator/car-lease-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'fire-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/fire-calculator/fire-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'email-signature-generator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/email-signature-generator/email-signature-generator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'image-vectorizer': minifyCss(await readFile(resolve(root, 'src/growth600/tools/image-vectorizer/image-vectorizer.css'), 'utf8'), { comments: 'exclamation' }).css,
  'vo2-max-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/vo2-max-calculator/vo2-max-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'hebrew-calendar-converter': minifyCss(await readFile(resolve(root, 'src/growth600/tools/hebrew-calendar-converter/hebrew-calendar-converter.css'), 'utf8'), { comments: 'exclamation' }).css,
  'absolute-value-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/absolute-value-calculator/absolute-value-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'specific-heat-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/specific-heat-calculator/specific-heat-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'rc-time-constant-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/rc-time-constant-calculator/rc-time-constant-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'reverse-mortgage-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/reverse-mortgage-calculator/reverse-mortgage-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'writing-tracker': minifyCss(await readFile(resolve(root, 'src/growth600/tools/writing-tracker/writing-tracker.css'), 'utf8'), { comments: 'exclamation' }).css,
  'graphql-formatter': minifyCss(await readFile(resolve(root, 'src/growth600/tools/graphql-formatter/graphql-formatter.css'), 'utf8'), { comments: 'exclamation' }).css,
  'rsa-key-generator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/rsa-key-generator/rsa-key-generator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'log-analyzer': minifyCss(await readFile(resolve(root, 'src/growth600/tools/log-analyzer/log-analyzer.css'), 'utf8'), { comments: 'exclamation' }).css,
  'inflation-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/inflation-calculator/inflation-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'retirement-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/retirement-calculator/retirement-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  '401k-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/401k-calculator/401k-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'text-to-speech': minifyCss(await readFile(resolve(root, 'src/growth600/tools/text-to-speech/text-to-speech.css'), 'utf8'), { comments: 'exclamation' }).css,
  'world-clock': minifyCss(await readFile(resolve(root, 'src/growth600/tools/world-clock/world-clock.css'), 'utf8'), { comments: 'exclamation' }).css,
  'euchre': minifyCss(await readFile(resolve(root, 'src/growth600/tools/euchre/euchre.css'), 'utf8'), { comments: 'exclamation' }).css,
  'name-generator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/name-generator/name-generator.css'), 'utf8'), { comments: 'exclamation' }).css,
  cribbage: minifyCss(await readFile(resolve(root, 'src/growth600/tools/cribbage/cribbage.css'), 'utf8'), { comments: 'exclamation' }).css,
  'gin-rummy': minifyCss(await readFile(resolve(root, 'src/growth600/tools/gin-rummy/gin-rummy.css'), 'utf8'), { comments: 'exclamation' }).css,
  'family-tree-maker': minifyCss(await readFile(resolve(root, 'src/growth600/tools/family-tree-maker/family-tree-maker.css'), 'utf8'), { comments: 'exclamation' }).css,
  'dividend-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/dividend-calculator/dividend-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'net-worth-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/net-worth-calculator/net-worth-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'random-word-generator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/random-word-generator/random-word-generator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'breathing-exercise': minifyCss(await readFile(resolve(root, 'src/growth600/tools/breathing-exercise/breathing-exercise.css'), 'utf8'), { comments: 'exclamation' }).css,
  'alarm-clock': minifyCss(await readFile(resolve(root, 'src/growth600/tools/alarm-clock/alarm-clock.css'), 'utf8'), { comments: 'exclamation' }).css,
};
const faviconSvg = await readFile(resolve(root, 'public/favicon.svg'), 'utf8');
const modelRevision = '92a21aca5713f20faf9a87590cdfbdce2e34112c';
const modelFolder = `Xenova/swin2SR-lightweight-x2-64`;
const modelAssetRoot = `models-image-upscaler-${modelRevision}/${modelFolder}`;
const extraAssets = Object.fromEntries(await Promise.all([
  'config.json', 'preprocessor_config.json', 'onnx/model_q4.onnx',
].map(async (path) => [`${modelAssetRoot}/${path}`, await readFile(resolve(root, 'public/growth600-models', modelFolder, path))])));
const randomWordDictionaryBuild = await build({
  entryPoints: [resolve(root, 'src/growth600/tools/random-word-generator/dictionaries.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2020'], minify: true, write: false, logLevel: 'silent',
});
if (Buffer.byteLength(randomWordDictionaryBuild.outputFiles[0].text) > 128 * 1024) throw new Error('The lazily loaded random-word dictionaries exceeded their 128 KiB static asset budget.');
extraAssets['vendor/random-word-generator-dictionaries.mjs'] = randomWordDictionaryBuild.outputFiles[0].text;
extraAssets['vendor/marked-18.0.14.umd.js'] = await readFile(resolve(root, 'node_modules/marked/lib/marked.umd.js'));
extraAssets['vendor/purify-3.4.16.min.js'] = await readFile(resolve(root, 'node_modules/dompurify/dist/purify.min.js'));
extraAssets['licenses/marked-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/marked/LICENSE'));
extraAssets['licenses/DOMPurify-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/dompurify/LICENSE'));
const yamlParserBuild = await build({
  entryPoints: [resolve(root, 'node_modules/js-yaml/dist/js-yaml.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2020'], minify: true, write: false, logLevel: 'silent',
});
if (Buffer.byteLength(yamlParserBuild.outputFiles[0].text) > 64 * 1024) throw new Error('The lazily loaded YAML parser exceeded its 64 KiB runtime asset budget.');
extraAssets['vendor/js-yaml-4.3.2.mjs'] = yamlParserBuild.outputFiles[0].text;
extraAssets['licenses/js-yaml-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/js-yaml/LICENSE'));
const graphqlParserBuild = await build({
  entryPoints: [resolve(root, 'src/growth600/tools/graphql-formatter/logic.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2020'], minify: true, write: false, logLevel: 'silent',
});
if (Buffer.byteLength(graphqlParserBuild.outputFiles[0].text) > 64 * 1024) throw new Error('The lazily loaded GraphQL parser exceeded its 64 KiB runtime asset budget.');
extraAssets['vendor/graphql-formatter-16.11.0.mjs'] = graphqlParserBuild.outputFiles[0].text;
extraAssets['licenses/graphql-js-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/graphql/LICENSE'));
extraAssets['licenses/upscaler/THIRD-PARTY-NOTICES.md'] = await readFile(resolve(root, 'public/growth600-models/THIRD-PARTY-NOTICES.md'));
extraAssets['licenses/upscaler/LICENSE-APACHE-2.0.txt'] = await readFile(resolve(root, 'public/growth600-models/LICENSE-APACHE-2.0.txt'));
extraAssets['licenses/upscaler/LICENSE-MIT-ONNX-RUNTIME.txt'] = await readFile(resolve(root, 'public/growth600-models/LICENSE-MIT-ONNX-RUNTIME.txt'));
const onnxVendor = resolve(root, 'node_modules/onnxruntime-web/dist');
extraAssets['schemaorg-v30.1.json'] = await readFile(resolve(root, 'src/growth600/data/schemaorg-v30.1.json'));
for (const filename of ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm']) {
  extraAssets[`vendor/onnx/${filename}`] = await readFile(resolve(onnxVendor, filename));
}
const workerBuild = await build({
  entryPoints: [resolve(root, 'src/growth600/tools/image-upscaler/worker.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], minify: true, write: false, logLevel: 'silent',
});
const result = await buildGrowthStaticSite({
  outputDir,
  origin: 'https://tools.usefulverse.com',
  localeEntries,
  copyByLocale,
  tools: growthPilotTools,
  controllerBundles: await bundleGrowthControllers(),
  toolStyles,
  workerBundles: { 'image-upscaler-worker': workerBuild.outputFiles[0].text },
  // ONNX Runtime's pinned static browser bundle uses Function internally for
  // its own dispatch; no user-controlled source reaches this worker.
  trustedWorkerDynamicCode: ['image-upscaler-worker'],
  extraAssets,
  styles,
  faviconSvg,
  currentTools,
  tools: growthPilotTools,
  maxFiles: 18_500,
  maxAssetBytes: 24 * 1024,
});
console.log(`Built ${result.pages} static pages for ${growthPilotTools.length} new tools in ${localeEntries.length} locales (${result.files} files, ${result.totalBytes} bytes).`);
