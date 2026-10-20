import { access, cp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { minify as minifyCss } from 'csso';
import { localeEntries, localePath } from '../src/locales.mjs';
import { tools as currentTools } from '../src/catalog.mjs';
import { growthPilotTools } from '../src/growth600/catalog.mjs';
import { marketTools } from '../src/markets-no-ch/catalog.mjs';
import { bundleGrowthControllers } from '../src/growth600/bundle-controllers.mjs';
import { buildGrowthStaticSite } from '../src/growth600/build.mjs';
import { assertRuleSnapshotsCurrent } from '../src/growth600/rule-maintenance.mjs';
import { getTranslationPackReleaseIssues } from '../src/growth600/translation-release-gate.mjs';
import { growthReleasePlan } from '../src/growth600/release-plan.mjs';
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
import heartsGameCopies from '../src/growth600/locales/hearts-game-final.mjs';
import typingPracticeCopies from '../src/growth600/locales/typing-practice-final.mjs';
import sokobanCopies from '../src/growth600/locales/sokoban-final.mjs';
import mazeGeneratorCopies from '../src/growth600/locales/maze-generator-final.mjs';
import sleepCalculatorCopies from '../src/growth600/locales/sleep-calculator-final.mjs';
import leanBodyMassCalculatorCopies from '../src/growth600/locales/lean-body-mass-calculator-final.mjs';
import cyclingPowerCalculatorCopies from '../src/growth600/locales/cycling-power-calculator-final.mjs';
import inductorCalculatorCopies from '../src/growth600/locales/inductor-calculator-final.mjs';
import centripetalForceCalculatorCopies from '../src/growth600/locales/centripetal-force-calculator-final.mjs';
import writingTrackerCopies from '../src/growth600/locales/writing-tracker-final.mjs';
import aesEncryptionToolCopies from '../src/growth600/locales/aes-encryption-tool-final.mjs';
import jwtEncoderCopies from '../src/growth600/locales/jwt-encoder-final.mjs';
import customerAcquisitionCostCalculatorCopies from '../src/growth600/locales/customer-acquisition-cost-calculator-final.mjs';
import graphqlFormatterCopies from '../src/growth600/locales/graphql-formatter-final.mjs';
import choreChartMakerCopies from '../src/growth600/locales/chore-chart-maker-final.mjs';
import cssBorderRadiusGeneratorCopies from '../src/growth600/locales/css-border-radius-generator-final.mjs';
import rentalYieldCalculatorCopies from '../src/growth600/locales/rental-yield-calculator-final.mjs';
import rsaKeyGeneratorCopies from '../src/growth600/locales/rsa-key-generator-final.mjs';
import logAnalyzerCopies from '../src/growth600/locales/log-analyzer-final.mjs';
import pyramidSolitaireCopies from '../src/growth600/locales/pyramid-solitaire-final.mjs';
import rebusPuzzlesCopies from '../src/growth600/locales/rebus-puzzles-final.mjs';
import killerSudokuCopies from '../src/growth600/locales/killer-sudoku-final.mjs';
import sudokuSolverCopies from '../src/growth600/locales/sudoku-solver-final.mjs';
import hangmanGameCopies from '../src/growth600/locales/hangman-game-final.mjs';
import aimTrainerCopies from '../src/growth600/locales/aim-trainer-final.mjs';
import chessPuzzlesCopies from '../src/growth600/locales/chess-puzzles-final.mjs';
import dotsAndBoxesCopies from '../src/growth600/locales/dots-and-boxes-final.mjs';
import chessAnalysisBoardCopies from '../src/growth600/locales/chess-analysis-board-final.mjs';
import blackjackGameCopies from '../src/growth600/locales/blackjack-game-final.mjs';
import tripeaksSolitaireCopies from '../src/growth600/locales/tripeaks-solitaire-final.mjs';
import pendingToolsCopies from '../src/growth600/locales/pending-tools-final.mjs';

const root = resolve(import.meta.dirname, '..');
const execFile = promisify(execFileCallback);

const localeDir = resolve(root, 'src/growth600/locales');
const translatedToolCopyDir = resolve(localeDir, 'translated-tools');
const implementationProgressPath = resolve(root, 'docs/planning/usefulverse-1000-2026-10-19/implementation-progress.json');
const implementationProgress = JSON.parse(await readFile(implementationProgressPath, 'utf8'));
const candidateToolIds = new Set(implementationProgress.tools.map(({ slug }) => slug));
const noindexDraftRelease = process.env.GROWTH600_NOINDEX_DRAFT_RELEASE === '1';
const previewOnly = noindexDraftRelease && process.env.GROWTH600_PREVIEW_ONLY === '1';
const releasePlan = growthReleasePlan(growthPilotTools, { previewOnly });
const releaseTools = releasePlan.tools;
const releaseToolIds = new Set(releaseTools.map(({ id }) => id));
assertRuleSnapshotsCurrent(releaseTools);
const catalogToolIds = new Set(growthPilotTools.map(({ id }) => id));
const missingCandidateImplementations = [...candidateToolIds].filter((toolId) => !catalogToolIds.has(toolId));
const requiredTranslatedToolIds = new Set(releaseTools.filter((tool) => candidateToolIds.has(tool.id) && tool.indexable !== false).map(({ id }) => id));
const translatedToolPacks = new Map();
for (const filename of await readdir(translatedToolCopyDir).catch((error) => {
  if (error.code === 'ENOENT') return [];
  throw error;
})) {
  if (!filename.endsWith('.mjs')) continue;
  const toolId = filename.slice(0, -4);
  const modulePath = resolve(translatedToolCopyDir, filename);
  translatedToolPacks.set(toolId, (await import(`${pathToFileURL(modulePath).href}?v=${Date.now()}`)).default);
}
const requiredToolLocales = [...localeEntries.map(({ key }) => key), 'nb'];
const requiredTranslationPackIds = requiredTranslatedToolIds.size ? [...requiredTranslatedToolIds, 'growth-tool-chrome'] : [];
const translationPackIssues = getTranslationPackReleaseIssues(
  requiredTranslationPackIds,
  translatedToolPacks,
  requiredToolLocales,
);
if ((!noindexDraftRelease && translationPackIssues.length) || missingCandidateImplementations.length) {
  const examples = translationPackIssues.slice(0, 12).join('; ');
  const remaining = translationPackIssues.length - Math.min(translationPackIssues.length, 12);
  const missingImplementations = missingCandidateImplementations.length
    ? ` Missing implementations (${missingCandidateImplementations.length}): ${missingCandidateImplementations.join(', ')}.`
    : '';
  throw new Error(`Growth600 release blocked: ${missingCandidateImplementations.length} candidate implementation(s) missing; ${translationPackIssues.length} translation-pack issue(s) across ${requiredTranslationPackIds.length} required packs for ${requiredToolLocales.length} locales.${missingImplementations}${translationPackIssues.length ? ` Translation issues: ${examples}${remaining ? `; and ${remaining} more` : ''}` : ''}`);
}
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
const extraToolLocales = [];
if (requiredTranslatedToolIds.size && !noindexDraftRelease) {
  const chromePack = translatedToolPacks.get('growth-tool-chrome');
  if (!chromePack?.nb) throw new Error('Growth600 release blocked: the approved Norwegian tool-page chrome copy is missing.');
  const norwegianLocale = { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false };
  copyByLocale.nb = { _home: chromePack.nb };
  for (const toolId of requiredTranslatedToolIds) {
    const pack = translatedToolPacks.get(toolId);
    if (!pack?.nb) throw new Error(`Growth600 release blocked: ${toolId} is missing its Norwegian tool-page copy.`);
    copyByLocale.nb[toolId] = pack.nb;
  }
  extraToolLocales.push(norwegianLocale);
}
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
  if (!heartsGameCopies[key]) throw new Error(`Growth600 release blocked: Hearts Game copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'hearts-game': heartsGameCopies[key] };
  if (!typingPracticeCopies[key]) throw new Error(`Growth600 release blocked: Typing Practice copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'typing-practice': typingPracticeCopies[key] };
  if (!sokobanCopies[key]) throw new Error(`Growth600 release blocked: Sokoban copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], sokoban: sokobanCopies[key] };
  if (!mazeGeneratorCopies[key]) throw new Error(`Growth600 release blocked: Maze Generator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'maze-generator': mazeGeneratorCopies[key] };
  if (!sleepCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Sleep Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'sleep-calculator': sleepCalculatorCopies[key] };
  if (!leanBodyMassCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Lean Body Mass Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'lean-body-mass-calculator': leanBodyMassCalculatorCopies[key] };
  if (!cyclingPowerCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Cycling Power Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'cycling-power-calculator': cyclingPowerCalculatorCopies[key] };
  copyByLocale[key] = { ...copyByLocale[key], 'inductor-calculator': inductorCalculatorCopies[key] };
  copyByLocale[key] = { ...copyByLocale[key], 'centripetal-force-calculator': centripetalForceCalculatorCopies[key] };
  copyByLocale[key] = { ...copyByLocale[key], 'writing-tracker': writingTrackerCopies[key] };
  copyByLocale[key] = { ...copyByLocale[key], 'aes-encryption-tool': aesEncryptionToolCopies[key] };
  copyByLocale[key] = { ...copyByLocale[key], 'jwt-encoder': jwtEncoderCopies[key] };
  if (!customerAcquisitionCostCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Customer Acquisition Cost Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'customer-acquisition-cost-calculator': customerAcquisitionCostCalculatorCopies[key] };
  if (!graphqlFormatterCopies[key]) throw new Error(`Growth600 release blocked: GraphQL Formatter copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'graphql-formatter': graphqlFormatterCopies[key] };
  if (!choreChartMakerCopies[key]) throw new Error(`Growth600 release blocked: Chore Chart Maker copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'chore-chart-maker': choreChartMakerCopies[key] };
  if (!cssBorderRadiusGeneratorCopies[key]) throw new Error(`Growth600 release blocked: CSS Border Radius Generator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'css-border-radius-generator': cssBorderRadiusGeneratorCopies[key] };
  if (!rentalYieldCalculatorCopies[key]) throw new Error(`Growth600 release blocked: Rental Yield Calculator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'rental-yield-calculator': rentalYieldCalculatorCopies[key] };
  if (!rsaKeyGeneratorCopies[key]) throw new Error(`Growth600 release blocked: RSA Key Generator copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'rsa-key-generator': rsaKeyGeneratorCopies[key] };
  if (!logAnalyzerCopies[key]) throw new Error(`Growth600 release blocked: Access Log Analyzer copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'log-analyzer': logAnalyzerCopies[key] };
  if (!pyramidSolitaireCopies[key]) throw new Error(`Growth600 release blocked: Pyramid Solitaire copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'pyramid-solitaire': pyramidSolitaireCopies[key] };
  if (!rebusPuzzlesCopies[key]) throw new Error(`Growth600 release blocked: Rebus Puzzles copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'rebus-puzzles': rebusPuzzlesCopies[key] };
  if (!killerSudokuCopies[key]) throw new Error(`Growth600 release blocked: Killer Sudoku copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'killer-sudoku': killerSudokuCopies[key] };
  if (!sudokuSolverCopies[key]) throw new Error(`Growth600 release blocked: Sudoku Solver copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'sudoku-solver': sudokuSolverCopies[key] };
  if (!hangmanGameCopies[key]) throw new Error(`Growth600 release blocked: Hangman Game copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'hangman-game': hangmanGameCopies[key] };
  if (!aimTrainerCopies[key]) throw new Error(`Growth600 release blocked: Aim Trainer copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'aim-trainer': aimTrainerCopies[key] };
  if (!chessPuzzlesCopies[key]) throw new Error(`Growth600 release blocked: Chess Puzzles copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'chess-puzzles': chessPuzzlesCopies[key] };
  if (!dotsAndBoxesCopies[key]) throw new Error(`Growth600 release blocked: Dots and Boxes copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], 'dots-and-boxes': dotsAndBoxesCopies[key] };
  copyByLocale[key] = { ...copyByLocale[key], 'chess-analysis-board': chessAnalysisBoardCopies[key], 'blackjack-game': blackjackGameCopies[key], 'tripeaks-solitaire': tripeaksSolitaireCopies[key] };
  if (!pendingToolsCopies[key]) throw new Error(`Growth600 release blocked: pending tools copy is missing for ${key}.`);
  copyByLocale[key] = { ...copyByLocale[key], ...pendingToolsCopies[key] };
  for (const [toolId, pack] of translatedToolPacks) {
    if (pack[key]) copyByLocale[key][toolId] = pack[key];
  }
}

const outputDir = resolve(process.env.GROWTH600_DIST ?? resolve(root, 'dist-growth600'));
if (await access(outputDir).then(() => true, () => false)) throw new Error(`Refusing to overwrite existing release directory: ${outputDir}`);
const buildId = `${process.pid}-${Date.now()}`;
const growthOnlyDir = `${outputDir}.growth-only-${buildId}`;
const marketToolsDir = `${outputDir}.market-tools-${buildId}`;
const mergedDir = `${outputDir}.merged-${buildId}`;
const styleFiles = [
  'src/growth600/site.css', 'src/growth600/rtl-fixes.css',
  'src/growth600/tools/peg-solitaire/peg-solitaire.css',
  'src/growth600/tools/futoshiki/futoshiki.css',
  'src/growth600/tools/hashi-puzzle/hashi-puzzle.css',
  'src/growth600/tools/chess-opening-trainer/chess-opening-trainer.css',
];
const styles = minifyCss((await Promise.all(styleFiles.map((file) => readFile(resolve(root, file), 'utf8')))).join(''), { comments: 'exclamation' }).css;
const toolStyles = {
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
  'hebrew-calendar-converter': minifyCss(await readFile(resolve(root, 'src/growth600/tools/hebrew-calendar-converter/hebrew-calendar-converter.css'), 'utf8'), { comments: 'exclamation' }).css,
  'absolute-value-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/absolute-value-calculator/absolute-value-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'specific-heat-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/specific-heat-calculator/specific-heat-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'rc-time-constant-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/rc-time-constant-calculator/rc-time-constant-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'reverse-mortgage-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/reverse-mortgage-calculator/reverse-mortgage-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'hearts-game': minifyCss(await readFile(resolve(root, 'src/growth600/tools/hearts-game/hearts-game.css'), 'utf8'), { comments: 'exclamation' }).css,
  'typing-practice': minifyCss(await readFile(resolve(root, 'src/growth600/tools/typing-practice/typing-practice.css'), 'utf8'), { comments: 'exclamation' }).css,
  sokoban: minifyCss(await readFile(resolve(root, 'src/growth600/tools/sokoban/sokoban.css'), 'utf8'), { comments: 'exclamation' }).css,
  'maze-generator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/maze-generator/maze-generator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'sleep-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/sleep-calculator/sleep-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'lean-body-mass-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/lean-body-mass-calculator/lean-body-mass-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'cycling-power-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/cycling-power-calculator/cycling-power-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'inductor-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/inductor-calculator/inductor-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'centripetal-force-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/centripetal-force-calculator/centripetal-force-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'writing-tracker': minifyCss(await readFile(resolve(root, 'src/growth600/tools/writing-tracker/writing-tracker.css'), 'utf8'), { comments: 'exclamation' }).css,
  'aes-encryption-tool': minifyCss(await readFile(resolve(root, 'src/growth600/tools/aes-encryption-tool/aes-encryption-tool.css'), 'utf8'), { comments: 'exclamation' }).css,
  'jwt-encoder': minifyCss(await readFile(resolve(root, 'src/growth600/tools/jwt-encoder/jwt-encoder.css'), 'utf8'), { comments: 'exclamation' }).css,
  'customer-acquisition-cost-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/customer-acquisition-cost-calculator/customer-acquisition-cost-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'graphql-formatter': minifyCss(await readFile(resolve(root, 'src/growth600/tools/graphql-formatter/graphql-formatter.css'), 'utf8'), { comments: 'exclamation' }).css,
  'chore-chart-maker': minifyCss(await readFile(resolve(root, 'src/growth600/tools/chore-chart-maker/chore-chart-maker.css'), 'utf8'), { comments: 'exclamation' }).css,
  'css-border-radius-generator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/css-border-radius-generator/css-border-radius-generator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'rental-yield-calculator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/rental-yield-calculator/rental-yield-calculator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'rsa-key-generator': minifyCss(await readFile(resolve(root, 'src/growth600/tools/rsa-key-generator/rsa-key-generator.css'), 'utf8'), { comments: 'exclamation' }).css,
  'log-analyzer': minifyCss(await readFile(resolve(root, 'src/growth600/tools/log-analyzer/log-analyzer.css'), 'utf8'), { comments: 'exclamation' }).css,
  'pyramid-solitaire': minifyCss(await readFile(resolve(root, 'src/growth600/tools/pyramid-solitaire/pyramid-solitaire.css'), 'utf8'), { comments: 'exclamation' }).css,
  'rebus-puzzles': minifyCss(await readFile(resolve(root, 'src/growth600/tools/rebus-puzzles/rebus-puzzles.css'), 'utf8'), { comments: 'exclamation' }).css,
  'killer-sudoku': minifyCss(await readFile(resolve(root, 'src/growth600/tools/killer-sudoku/killer-sudoku.css'), 'utf8'), { comments: 'exclamation' }).css,
  'sudoku-solver': minifyCss(await readFile(resolve(root, 'src/growth600/tools/sudoku-solver/sudoku-solver.css'), 'utf8'), { comments: 'exclamation' }).css,
  'hangman-game': minifyCss(await readFile(resolve(root, 'src/growth600/tools/hangman-game/hangman-game.css'), 'utf8'), { comments: 'exclamation' }).css,
};
toolStyles['aim-trainer'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/aim-trainer/aim-trainer.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['chess-puzzles'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/chess-puzzles/chess-puzzles.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['dots-and-boxes'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/dots-and-boxes/dots-and-boxes.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['chess-analysis-board'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/chess-analysis-board/chess-analysis-board.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['blackjack-game'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/blackjack-game/blackjack-game.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['tripeaks-solitaire'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/tripeaks-solitaire/tripeaks-solitaire.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['hearing-self-check'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/hearing-self-check/site.css'), 'utf8'), { comments: 'exclamation' }).css;
const pendingToolStyles = minifyCss(await readFile(resolve(root, 'src/growth600/tools/pending-23/pending-23.css'), 'utf8'), { comments: 'exclamation' }).css;
for (const tool of growthPilotTools) if (!toolStyles[tool.id]) toolStyles[tool.id] = pendingToolStyles;
toolStyles['coloring-studio'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/coloring-studio/coloring-studio.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['hearts-game'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/hearts-game/hearts-game.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles.belote = minifyCss(await readFile(resolve(root, 'src/growth600/tools/belote/belote.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['chord-recognizer'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/chord-recognizer/chord-recognizer.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['laser-box-designer'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/laser-box-designer/laser-box-designer.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['geometry-construction'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/geometry-construction/geometry-construction.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles.pinochle = minifyCss(await readFile(resolve(root, 'src/growth600/tools/pinochle/pinochle.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles.tute = minifyCss(await readFile(resolve(root, 'src/growth600/tools/tute/tute.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['origami-simulator'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/origami-simulator/origami-simulator.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles.mus = minifyCss(await readFile(resolve(root, 'src/growth600/tools/mus/mus.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['pdf-digital-signature-validator'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/pdf-digital-signature-validator/pdf-digital-signature-validator.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles.fanorona = minifyCss(await readFile(resolve(root, 'src/growth600/tools/fanorona/fanorona.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['masyu-puzzle'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/masyu-puzzle/masyu-puzzle.css'), 'utf8'), { comments: 'exclamation' }).css;
toolStyles['text-translator'] = minifyCss(await readFile(resolve(root, 'src/growth600/tools/text-translator/text-translator.css'), 'utf8'), { comments: 'exclamation' }).css;
const faviconSvg = await readFile(resolve(root, 'public/favicon.svg'), 'utf8');
const modelRevision = '92a21aca5713f20faf9a87590cdfbdce2e34112c';
const modelFolder = `Xenova/swin2SR-lightweight-x2-64`;
const modelAssetRoot = `models-image-upscaler-${modelRevision}/${modelFolder}`;
const extraAssets = Object.fromEntries(await Promise.all([
  'config.json', 'preprocessor_config.json', 'onnx/model_q4.onnx',
].map(async (path) => [`${modelAssetRoot}/${path}`, await readFile(resolve(root, 'public/growth600-models', modelFolder, path))])));
const localAiRuntime = await build({
  entryPoints: [resolve(root, 'node_modules/@mlc-ai/web-llm/lib/index.js')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2020'], minify: true, write: false, logLevel: 'silent',
});
if (Buffer.byteLength(localAiRuntime.outputFiles[0].text) > 12 * 1024 * 1024) throw new Error('The optional local chat runtime exceeds its 12 MiB asset budget.');
extraAssets['local-ai-chat/web-llm-0.2.86.mjs'] = localAiRuntime.outputFiles[0].text;
extraAssets['licenses/local-ai-chat/WebLLM-APACHE-2.0.txt'] = await readFile(resolve(root, 'node_modules/@mlc-ai/web-llm/LICENSE'));
extraAssets['licenses/local-ai-chat/loglevel-MIT.txt'] = await readFile(resolve(root, 'node_modules/loglevel/LICENSE-MIT'));
const opencvJsPath = resolve(root, 'node_modules/@techstark/opencv-js/dist/opencv.js');
const opencvJs = await readFile(opencvJsPath);
if (opencvJs.byteLength > 12 * 1024 * 1024) throw new Error('The optional local panorama OpenCV runtime exceeds its 12 MiB static asset budget.');
extraAssets['panorama-stitcher/opencv-4.12.0.js'] = opencvJs;
extraAssets['panorama-stitcher/worker.js'] = await readFile(resolve(root, 'src/growth600/tools/panorama-stitcher/worker.js'));
extraAssets['licenses/panorama-stitcher-OpenCV-Apache-2.0.txt'] = await readFile(resolve(root, 'node_modules/@techstark/opencv-js/LICENSE'));
const speedProbe = Buffer.alloc(512 * 1024);
let speedProbeState = 0x6d2b79f5;
for (let index = 0; index < speedProbe.length; index += 1) {
  speedProbeState ^= speedProbeState << 13;
  speedProbeState ^= speedProbeState >>> 17;
  speedProbeState ^= speedProbeState << 5;
  speedProbe[index] = speedProbeState & 0xff;
}
extraAssets['speed-test-probe.bin'] = speedProbe;
extraAssets['vendor/marked-18.0.14.umd.js'] = await readFile(resolve(root, 'node_modules/marked/lib/marked.umd.js'));
extraAssets['vendor/purify-3.4.16.min.js'] = await readFile(resolve(root, 'node_modules/dompurify/dist/purify.min.js'));
extraAssets['licenses/marked-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/marked/LICENSE'));
extraAssets['licenses/DOMPurify-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/dompurify/LICENSE'));
const cubejsVendor = resolve(root, 'src/growth600/tools/rubiks-cube-solver/vendor');
for (const filename of ['cube.js', 'solve.js', 'worker.js']) extraAssets[`cubejs-1.3.2/${filename}`] = await readFile(resolve(cubejsVendor, filename));
extraAssets['licenses/cubejs-MIT.txt'] = await readFile(resolve(cubejsVendor, 'LICENSE'));
const stockfishAssetRoot = resolve(root, 'public/growth600-vendor/stockfish-19.0.0');
for (const filename of ['stockfish-19-lite-single.js', 'stockfish-19-lite-single.wasm', 'LICENSE-GPL-3.0.txt', 'NOTICE.md']) {
  const target = filename === 'LICENSE-GPL-3.0.txt' ? 'licenses/stockfish-GPL-3.0.txt' : filename === 'NOTICE.md' ? 'licenses/stockfish-NOTICE.md' : `vendor/stockfish-19.0.0/${filename}`;
  extraAssets[target] = await readFile(resolve(stockfishAssetRoot, filename));
}
const yamlParserBuild = await build({
  entryPoints: [resolve(root, 'node_modules/js-yaml/dist/js-yaml.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2020'], minify: true, write: false, logLevel: 'silent',
});
if (Buffer.byteLength(yamlParserBuild.outputFiles[0].text) > 64 * 1024) throw new Error('The lazily loaded YAML parser exceeded its 64 KiB runtime asset budget.');
extraAssets['vendor/js-yaml-4.3.2.mjs'] = yamlParserBuild.outputFiles[0].text;
extraAssets['licenses/js-yaml-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/js-yaml/LICENSE'));
const pyodideRoot = resolve(root, 'public/growth600-vendor/pyodide-314.0.7');
for (const filename of ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json', 'online-python-worker.mjs', 'fonttools-4.62.1-py3-none-any.whl']) {
  extraAssets[`pyodide-314.0.7/${filename}`] = await readFile(resolve(pyodideRoot, filename));
}
extraAssets['webfont-subsetter-worker.mjs'] = await readFile(resolve(root, 'src/growth600/tools/webfont-subsetter/worker.mjs'));
extraAssets['licenses/FontTools-MIT.txt'] = await readFile(resolve(root, 'public/growth600-vendor/licenses/FontTools-MIT.txt'));
extraAssets['openchemlib-9.25.1/openchemlib.mjs'] = await readFile(resolve(root, 'public/growth600-vendor/openchemlib-9.25.1/openchemlib.mjs'));
extraAssets['openchemlib-9.25.1/resources.json'] = await readFile(resolve(root, 'public/growth600-vendor/openchemlib-9.25.1/resources.json'));
extraAssets['licenses/OpenChemLib-BSD-3-Clause.txt'] = await readFile(resolve(root, 'public/growth600-vendor/licenses/OpenChemLib-BSD-3-Clause.txt'));
extraAssets['chemical-structure-editor-runtime.mjs'] = await readFile(resolve(root, 'src/growth600/tools/chemical-structure-editor/runtime.mjs'));
extraAssets['licenses/Pyodide-MPL-2.0.txt'] = await readFile(resolve(pyodideRoot, 'LICENSE-MPL-2.0.txt'));
extraAssets['licenses/Pyodide-Python-PSF.txt'] = await readFile(resolve(pyodideRoot, 'LICENSE-Python-PSF.txt'));
const modnetRevision = 'fa2fa546052fba4c08921230a26cc69a333fca12';
const modnetAssetRoot = `models-${modnetRevision}/Xenova/modnet`;
for (const filename of ['config.json', 'preprocessor_config.json', 'onnx/model_quantized.onnx']) {
  extraAssets[`${modnetAssetRoot}/${filename}`] = await readFile(resolve(root, 'public/models/Xenova/modnet', filename));
}
extraAssets['licenses/photo-background-changer/MODNET-NOTICE.md'] = await readFile(resolve(root, 'public/models/Xenova/modnet/NOTICE.md'));
extraAssets['licenses/photo-background-changer/LICENSE-APACHE-2.0.txt'] = await readFile(resolve(root, 'public/growth600-models/LICENSE-APACHE-2.0.txt'));
extraAssets['licenses/photo-background-changer/LICENSE-MIT-ONNX-RUNTIME.txt'] = await readFile(resolve(root, 'public/growth600-models/LICENSE-MIT-ONNX-RUNTIME.txt'));
extraAssets['licenses/photo-background-changer/THIRD-PARTY-NOTICES.md'] = await readFile(resolve(root, 'public/growth600-models/THIRD-PARTY-NOTICES.md'));
const graphqlFormatterBuild = await build({
  entryPoints: [resolve(root, 'src/growth600/tools/graphql-formatter/runtime.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2020'], minify: true, write: false, logLevel: 'silent',
});
if (Buffer.byteLength(graphqlFormatterBuild.outputFiles[0].text) > 256 * 1024) throw new Error('The lazily loaded GraphQL formatter exceeded its 256 KiB runtime asset budget.');
extraAssets['vendor/prettier-graphql-3.9.9.mjs'] = graphqlFormatterBuild.outputFiles[0].text;
extraAssets['licenses/prettier-LICENSE.txt'] = await readFile(resolve(root, 'node_modules/prettier/LICENSE'));
extraAssets['licenses/upscaler/THIRD-PARTY-NOTICES.md'] = await readFile(resolve(root, 'public/growth600-models/THIRD-PARTY-NOTICES.md'));
extraAssets['licenses/upscaler/LICENSE-APACHE-2.0.txt'] = await readFile(resolve(root, 'public/growth600-models/LICENSE-APACHE-2.0.txt'));
extraAssets['licenses/upscaler/LICENSE-MIT-ONNX-RUNTIME.txt'] = await readFile(resolve(root, 'public/growth600-models/LICENSE-MIT-ONNX-RUNTIME.txt'));
const onnxVendor = resolve(root, 'node_modules/onnxruntime-web/dist');
extraAssets['schemaorg-v30.1.json'] = await readFile(resolve(root, 'src/growth600/data/schemaorg-v30.1.json'));
extraAssets['japanese-name-strokes/stroke-counts.json'] = await readFile(resolve(root, 'src/growth600/tools/japanese-name-strokes/data/stroke-counts.json'));
extraAssets['licenses/japanese-name-strokes/ATTRIBUTION.md'] = await readFile(resolve(root, 'src/growth600/tools/japanese-name-strokes/data/ATTRIBUTION.md'));
const cmudictRoot = resolve(root, 'public/growth600-vendor/cmudict-2026-10-20');
extraAssets['ipa-transcriber/cmudict-2026-10-20.dict'] = await readFile(resolve(cmudictRoot, 'cmudict.dict'));
extraAssets['licenses/ipa-transcriber-CMUdict-BSD-style.txt'] = await readFile(resolve(cmudictRoot, 'LICENSE'));
extraAssets['licenses/ipa-transcriber-CMUdict-NOTICE.md'] = await readFile(resolve(cmudictRoot, 'NOTICE.md'));
for (const filename of await readdir(resolve(root, 'src/growth600/tools/emoji-search/data'))) {
  extraAssets[`emoji-search-data/${filename}`] = await readFile(resolve(root, 'src/growth600/tools/emoji-search/data', filename));
}
extraAssets['earthquake-world-land.svg'] = await readFile(resolve(root, 'src/growth600/tools/earthquake-map/world-land.svg'));
for (const filename of ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm']) {
  extraAssets[`vendor/onnx/${filename}`] = await readFile(resolve(onnxVendor, filename));
}
const workerBuild = await build({
  entryPoints: [resolve(root, 'src/growth600/tools/image-upscaler/worker.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], minify: true, write: false, logLevel: 'silent',
});
const pdfImpositionWorkerBuild = await build({
  entryPoints: [resolve(root, 'src/growth600/tools/pdf-imposition/worker.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], minify: true, write: false, logLevel: 'silent',
});
const photoBackgroundWorkerBuild = await build({
  entryPoints: [resolve(root, 'src/portrait-background-worker.mjs')],
  bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], minify: true, write: false, logLevel: 'silent',
});
const result = await buildGrowthStaticSite({
  outputDir: growthOnlyDir,
  origin: 'https://tools.usefulverse.com',
  localeEntries,
  extraToolLocales,
  copyByLocale,
  controllerBundles: await bundleGrowthControllers({ tools: releaseTools }),
  toolStyles: Object.fromEntries(Object.entries(toolStyles).filter(([id]) => releaseToolIds.has(id))),
  workerBundles: { 'image-upscaler-worker': workerBuild.outputFiles[0].text, 'pdf-imposition-worker': pdfImpositionWorkerBuild.outputFiles[0].text, 'photo-background-worker': photoBackgroundWorkerBuild.outputFiles[0].text },
  // ONNX Runtime's pinned static browser bundle uses Function internally for
  // its own dispatch; no user-controlled source reaches either worker.
  trustedWorkerDynamicCode: ['image-upscaler-worker', 'photo-background-worker'],
  extraAssets,
  styles,
  faviconSvg,
  currentTools,
  ...releasePlan,
  maxFiles: previewOnly ? 20_000 : 18_500,
  maxAssetBytes: 24 * 1024,
  maxToolStyleBytes: 64 * 1024,
});
const releaseToolCount = releaseTools.length;
console.log(`Built ${result.pages} Growth600 pages for ${releaseToolCount} tools in ${localeEntries.length} locales (${result.files} files, ${result.totalBytes} bytes).`);

if (previewOnly) {
  const sitemap = await readFile(resolve(growthOnlyDir, 'sitemap.xml'), 'utf8');
  const missingNoindexRoutes = [];
  const indexedCandidateRoutes = [];
  for (const locale of localeEntries) {
    for (const { id: toolId } of releaseTools) {
      const route = localePath(locale.key, toolId);
      const page = await readFile(resolve(growthOnlyDir, route.replace(/^\/+|\/+$/gu, ''), 'index.html'), 'utf8');
      if (!/<meta\s+name="robots"\s+content="noindex,follow">/u.test(page)) missingNoindexRoutes.push(route);
      if (sitemap.includes(`https://tools.usefulverse.com${route}`)) indexedCandidateRoutes.push(route);
    }
  }
  const indexableHomes = (sitemap.match(/<loc>/gu) ?? []).length;
  if (missingNoindexRoutes.length || indexedCandidateRoutes.length || indexableHomes) {
    throw new Error(`Noindex preview failed closed: ${missingNoindexRoutes.length} candidate page(s) lack noindex; ${indexedCandidateRoutes.length} candidates remain in sitemap; ${indexableHomes} indexable homepage(s) remain.`);
  }
  await rename(growthOnlyDir, outputDir);
  console.log(`Verified noindex on ${releaseTools.length * localeEntries.length} preview tool pages (including all ${candidateToolIds.size * localeEntries.length} candidate pages) and all preview homepages; sitemap contains no indexable URLs.`);
} else {

try {
  await execFile(process.execPath, [resolve(root, 'scripts/build-markets-no-ch-pilot.mjs')], {
    cwd: root,
    env: { ...process.env, MARKETS_NO_CH_DIST: marketToolsDir },
    maxBuffer: 8 * 1024 * 1024,
  });
  await cp(growthOnlyDir, mergedDir, { recursive: true, errorOnExist: true, force: false });
  await execFile(process.execPath, [resolve(root, 'scripts/merge-markets-no-ch-into-growth600.mjs')], {
    cwd: root,
    env: { ...process.env, MARKETS_NO_CH_DIST: marketToolsDir, GROWTH600_DIST: mergedDir },
    maxBuffer: 8 * 1024 * 1024,
  });
  await execFile(process.execPath, [resolve(root, 'scripts/merge-live-only-106.mjs')], {
    cwd: root,
    env: { ...process.env, GROWTH600_DIST: mergedDir },
    maxBuffer: 8 * 1024 * 1024,
  });
  if (releasePlan.noindexToolIds.length) {
    const sitemap = await readFile(resolve(mergedDir, 'sitemap.xml'), 'utf8');
    const missingNoindexRoutes = [];
    const indexedCandidateRoutes = [];
    for (const locale of localeEntries) {
      for (const toolId of candidateToolIds) {
        const route = localePath(locale.key, toolId);
        const page = await readFile(resolve(mergedDir, route.replace(/^\/+|\/+$/gu, ''), 'index.html'), 'utf8');
        if (!/<meta\s+name="robots"\s+content="noindex,follow">/u.test(page)) missingNoindexRoutes.push(route);
        if (sitemap.includes(`https://tools.usefulverse.com${route}`)) indexedCandidateRoutes.push(route);
      }
    }
    if (missingNoindexRoutes.length || indexedCandidateRoutes.length) {
      throw new Error(`Noindex draft release failed closed: ${missingNoindexRoutes.length} candidate route(s) lack a noindex meta tag; ${indexedCandidateRoutes.length} candidate route(s) remain in the sitemap.`);
    }
    console.log(`Verified noindex on ${candidateToolIds.size * localeEntries.length} draft candidate pages; none appear in the sitemap.`);
  }
  const indexNowKey = (await readFile(resolve(root, 'src/growth600/indexnow-key.txt'), 'utf8')).trim();
  if (!/^[a-f0-9]{8,128}$/u.test(indexNowKey)) throw new Error('Growth600 IndexNow key must contain 8 to 128 lowercase hexadecimal characters.');
  await writeFile(resolve(mergedDir, `${indexNowKey}.txt`), `${indexNowKey}\n`, { flag: 'wx' });
  await rename(mergedDir, outputDir);
  await Promise.all([rm(growthOnlyDir, { recursive: true }), rm(marketToolsDir, { recursive: true })]);
} catch (error) {
  throw new Error(`Growth600 + 100 market-tool release assembly failed. Growth build: ${growthOnlyDir}; market build: ${marketToolsDir}; merged staging: ${mergedDir}. ${error.message}`, { cause: error });
}
console.log(`Assembled additive release with ${releaseTools.length} Growth tools, ${marketTools.length} market tools, and 106 editable recovered tools; publishing directory: ${outputDir}.`);
}
