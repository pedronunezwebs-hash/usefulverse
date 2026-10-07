import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { locales, localeEntries } from '../locales.mjs';
import { tools as currentTools } from '../catalog.mjs';
import { growthPilotTools } from './catalog.mjs';
import { buildGrowthStaticSite } from './build.mjs';
import englishGrowthCopy from './locales/en.mjs';
import frenchGrowthCopy from './locales/fr.mjs';
import portugueseGrowthCopy from './locales/pt.mjs';
import spanishGrowthCopy from './locales/es.mjs';

const actions = { calculate: 'Calculate', generate: 'Generate', reset: 'Reset', example: 'Example', newGame: 'New game', rules: 'Rules', reveal: 'Reveal', next: 'Next', copy: 'Copy', download: 'Download', result: 'Result', rectangle: 'Rectangle', circle: 'Circle', triangle: 'Triangle', meters: 'Meters', centimeters: 'Centimeters', feet: 'Feet', inches: 'Inches', kgPerCubicMeter: 'Kilograms per cubic meter', lbPerCubicFoot: 'Pounds per cubic foot', kilograms: 'Kilograms', pounds: 'Pounds', computer: 'Computer', twoPlayers: 'Two players', privacyNote: 'Private on this device.' };
const messages = { copied: 'Copied.', copyUnavailable: 'Copy unavailable.', calculated: 'Done.', checkInputs: 'Check entries.', area: 'Area', volume: 'Volume', orderVolume: 'Order volume', estimatedWeight: 'Estimated weight', bagsToBuy: 'Bags to buy', invalidFormula: 'Check formula.', atomCount: 'atoms', molarMass: 'Molar mass', estimateOnly: 'Estimate only.', currentPayment: 'Current payment', newPayment: 'New payment', paymentDifference: 'Difference', currentTotal: 'Current total', newTotal: 'New total', estimatedDifference: 'Estimated savings', breakEven: 'Break-even', noBreakEven: 'No break-even', monthCount: '{count} months', privatePair: '{giver} gives to {recipient}', allRevealed: 'All revealed.', drawReady: 'Ready.', checkNamesAndRules: 'Check entries.', downloaded: 'Downloaded.', pit: 'Pit', seeds: 'seeds', playerOne: 'Player one', playerTwo: 'Player two', playerOneWins: 'Player one wins.', playerTwoWins: 'Player two wins.', tie: 'Tie.', gameOver: 'Game over.', turn: '{player} turn.' };
function toolCopy(tool, language) {
  const name = `${tool.id} ${language}`;
  const fields = {
    'gravel-calculator': { shape: 'Shape', area: 'Area', depth: 'Depth', length: 'Length', width: 'Width', diameter: 'Diameter', base: 'Base', triangleHeight: 'Height', dimensionUnit: 'Dimension unit', depthUnit: 'Depth unit', density: 'Density', densityUnit: 'Density unit', waste: 'Waste', bagSize: 'Bag size', bagUnit: 'Bag unit' },
    'molar-mass-calculator': { formula: 'Formula', supportedHint: 'Selected elements and isotopes are supported.' },
    'auto-loan-refinance-calculator': { balance: 'Balance', currentApr: 'Current APR', currentMonths: 'Current months', newApr: 'New APR', newMonths: 'New months', fees: 'Fees', feeTreatment: 'Fee treatment', upfront: 'Upfront', rolledIn: 'Rolled in', currencyNote: 'Use one currency for all amounts.' },
    'secret-santa-generator': { names: 'Names', exclusions: 'Exclusions', exclusionsHint: 'One giver:recipient pair per line.' },
    mancala: { mode: 'Mode', board: 'Kalah board', rules: 'Sow seeds around the board; skip the opponent store. Capture the opposite pit when the last seed lands in an empty pit on your side.' },
  }[tool.id];
  const localized = { name, title: `${name} free | UsefulVerse`, description: `Free ${name} that works in your browser, with no account required.`, intro: `Use this ${name} for free in your browser.`, howQuestion: `How do I use ${name}?`, howAnswer: `Enter the details and use the controls shown.`, privacyQuestion: 'Is my data uploaded?', privacyAnswer: 'No. This tool runs locally in this browser.', fields, actions, messages, copyLanguage: language };
  return localized;
}

function createCopy(languages) {
  return Object.fromEntries(languages.map((locale) => [locale.key, {
    _home: { copyLanguage: locale.key, title: `UsefulVerse ${locale.key} tools | UsefulVerse`, description: 'Free browser tools with no account required.', intro: 'Small, useful tools that run in your browser.', directoryLabel: 'Everyday tools', freeLabel: 'Free, no usage limit', footerFree: 'Free browser tools.', skipToTool: 'Skip to tool', home: 'Home', languageLabel: 'Language', breadcrumbLabel: 'Breadcrumb', faqLabel: 'FAQ' },
    ...Object.fromEntries(growthPilotTools.map((tool) => [tool.id, toolCopy(tool, locale.key)])),
  }]));
}

test('separate static build writes only localized hub routes, its sitemap and bounded hashed assets', async (context) => {
  const tempRoot = await mkdtemp(join(tmpdir(), 'usefulverse-growth600-build-'));
  context.after(async () => rm(tempRoot, { recursive: true, force: true }));
  const outputDir = join(tempRoot, 'site');
  const smallLocales = localeEntries.filter(({ key }) => ['en', 'es', 'fr', 'pt'].includes(key));
  const controllerBundles = Object.fromEntries(growthPilotTools.map((tool) => [tool.id, `document.querySelector('[data-tool="${tool.id}"]');`]));
  const result = await buildGrowthStaticSite({
    outputDir,
    origin: 'https://tools.usefulverse.com',
    localeEntries: smallLocales,
    copyByLocale: { en: englishGrowthCopy, es: spanishGrowthCopy, fr: frenchGrowthCopy, pt: portugueseGrowthCopy },
    controllerBundles,
    styles: 'body{font-family:system-ui}',
    currentTools,
  });
  assert.equal(result.pages, smallLocales.length * (growthPilotTools.length + 1));
  assert.equal(result.sitemapUrls, result.pages);
  assert.ok(result.files <= 18_500);
  assert.ok(result.assetFiles.length === growthPilotTools.length + 1);
  const sitemap = await readFile(join(outputDir, 'sitemap.xml'), 'utf8');
  assert.ok(sitemap.includes('https://tools.usefulverse.com/es/tools/gravel-calculator/'));
  assert.ok(!sitemap.includes('https://usefulverse.com/tools/gravel-calculator/'));
  assert.match(await readFile(join(outputDir, 'robots.txt'), 'utf8'), /https:\/\/tools\.usefulverse\.com\/sitemap\.xml/u);
  const arabic = locales.ar;
  assert.equal(arabic.prefix, '/ar');
  const enPage = await readFile(join(outputDir, 'tools/gravel-calculator/index.html'), 'utf8');
  assert.ok(enPage.includes('href="https://tools.usefulverse.com/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('hreflang="es" href="https://tools.usefulverse.com/es/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('hreflang="fr" href="https://tools.usefulverse.com/fr/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('name="area"') === false);
  assert.ok(enPage.includes('data-shape'));
  const esPage = await readFile(join(outputDir, 'es/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(esPage, /<html lang="es" dir="ltr">/u);
  assert.match(esPage, /Calculadora de grava/u);
  assert.match(esPage, /Preguntas frecuentes/u);
  assert.doesNotMatch(esPage, />undefined</u);
  const frPage = await readFile(join(outputDir, 'fr/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(frPage, /<html lang="fr" dir="ltr">/u);
  assert.match(frPage, /Calculateur de gravier/u);
  assert.match(frPage, /Foire aux questions/u);
  assert.doesNotMatch(frPage, />undefined</u);
  const ptPage = await readFile(join(outputDir, 'pt-br/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(ptPage, /<html lang="pt-BR" dir="ltr">/u);
  assert.match(ptPage, /Calculadora de cascalho/u);
  assert.match(ptPage, /Perguntas frequentes/u);
  assert.doesNotMatch(ptPage, />undefined</u);
  const files = await readdir(join(outputDir, 'assets'));
  assert.equal(files.length, growthPilotTools.length + 1);
  assert.ok((await stat(join(outputDir, 'assets', files[0]))).isFile());
});

test('static build refuses overwrite, missing translated pages/controllers, and file-count overflow', async (context) => {
  const tempRoot = await mkdtemp(join(tmpdir(), 'usefulverse-growth600-gates-'));
  context.after(async () => rm(tempRoot, { recursive: true, force: true }));
  const smallLocales = localeEntries.filter(({ key }) => key === 'en');
  const base = { origin: 'https://tools.usefulverse.com', localeEntries: smallLocales, copyByLocale: createCopy(smallLocales), controllerBundles: Object.fromEntries(growthPilotTools.map((tool) => [tool.id, 'export {};'])), styles: 'body{}', currentTools };
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: tempRoot }), /Refusing to overwrite/);
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'overflow'), maxFiles: 1 }), /safety cap is 1/);
  const noCopy = createCopy(smallLocales);
  delete noCopy.en['mancala'];
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'missing-copy'), copyByLocale: noCopy }), /mancala: translation is missing/);
  const noController = { ...base.controllerBundles };
  delete noController.mancala;
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'missing-controller'), controllerBundles: noController }), /Missing isolated browser controller/);
  const remoteController = { ...base.controllerBundles, mancala: 'fetch("https://example.invalid/process")' };
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'remote-controller'), controllerBundles: remoteController }), /must not contact a remote service/);
  const dynamicCode = { ...base.controllerBundles, mancala: 'new Function("return 1")()' };
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'dynamic-code'), controllerBundles: dynamicCode }), /dynamic code execution/);
  const tooLarge = { ...base.controllerBundles, mancala: 'x'.repeat(25 * 1024) };
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'oversized-controller'), controllerBundles: tooLarge }), /initial runtime budget/);
});
