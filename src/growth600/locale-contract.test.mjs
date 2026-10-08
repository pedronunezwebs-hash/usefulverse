import assert from 'node:assert/strict';
import test from 'node:test';
import { assertGrowthLocaleCoverage } from './locale-contract.mjs';
import { growthPilotTools as allGrowthPilotTools } from './catalog.mjs';
import { localeEntries } from '../locales.mjs';
import englishGrowthCopy from './locales/en.mjs';
import frenchGrowthCopy from './locales/fr.mjs';
import portugueseGrowthCopy from './locales/pt.mjs';
import germanGrowthCopy from './locales/de.mjs';
import japaneseGrowthCopy from './locales/ja.mjs';
import koreanGrowthCopy from './locales/ko.mjs';
import indonesianGrowthCopy from './locales/id.mjs';
import hindiGrowthCopy from './locales/hi.mjs';
import arabicGrowthCopy from './locales/ar.mjs';
import spanishGrowthCopy from './locales/es.mjs';
import simplifiedChineseGrowthCopy from './locales/zh.mjs';
import bengaliGrowthCopy from './locales/bn.mjs';
import russianGrowthCopy from './locales/ru.mjs';
import urduGrowthCopy from './locales/ur.mjs';
import turkishGrowthCopy from './locales/tr.mjs';
import vietnameseGrowthCopy from './locales/vi.mjs';
import italianGrowthCopy from './locales/it.mjs';
import traditionalChineseGrowthCopy from './locales/zh_tw.mjs';
import bulgarianGrowthCopy from './locales/bg.mjs';
import catalanGrowthCopy from './locales/ca.mjs';
import dutchGrowthCopy from './locales/nl.mjs';
import greekGrowthCopy from './locales/el.mjs';
import malayGrowthCopy from './locales/ms.mjs';
import polishGrowthCopy from './locales/pl.mjs';
import swedishGrowthCopy from './locales/sv.mjs';
import thaiGrowthCopy from './locales/th.mjs';
import ukrainianGrowthCopy from './locales/uk.mjs';
import swahiliGrowthCopy from './locales/sw.mjs';
import marathiGrowthCopy from './locales/mr.mjs';
import teluguGrowthCopy from './locales/te.mjs';
import hausaGrowthCopy from './locales/ha.mjs';
import filipinoGrowthCopy from './locales/tl.mjs';
import tamilGrowthCopy from './locales/ta.mjs';
import persianGrowthCopy from './locales/fa.mjs';
import amharicGrowthCopy from './locales/am.mjs';
import gujaratiGrowthCopy from './locales/gu.mjs';

const growthPilotTools = allGrowthPilotTools.filter(({ id }) => !['tire-size-calculator', 'stair-calculator', 'asphalt-calculator', 'carpet-calculator', 'aquarium-calculator', 'grass-seed-calculator', 'insulation-calculator', 'wall-framing-calculator', 'electricity-cost-calculator', 'compost-calculator', 'pond-volume-calculator', 'fertilizer-calculator', 'baluster-spacing-calculator', 'retaining-wall-calculator', 'battery-runtime-calculator', 'lumber-cut-calculator', 'plant-spacing-calculator', 'ev-charging-calculator', 'rainwater-harvesting-calculator', 'ramp-calculator', 'heat-loss-calculator', 'heat-pump-calculator', 'miter-angle-calculator', 'voltage-drop-calculator', 'molarity-calculator', 'dilution-calculator', 'ohms-law-calculator', 'chemical-equation-balancer', 'gear-ratio-calculator', 'density-calculator', 'compression-ratio-calculator', 'goal-planner'].includes(id));
const localizedCopies = Object.fromEntries(await Promise.all(localeEntries.map(async ({ key }) => [
  key,
  (await import(`./locales/${key}.mjs`)).default,
])));

const tools = [{ id: 'one' }, { id: 'two' }];
const locales = [{ key: 'en' }, { key: 'es' }];
const sampleHome = (language) => ({ title: `${language} tools | UsefulVerse`, description: 'Free browser tools.', intro: 'Simple tools.', directoryLabel: 'Tools', freeLabel: 'Free', footerFree: 'Free tools.', skipToTool: 'Skip', home: 'Home', languageLabel: 'Language', breadcrumbLabel: 'Breadcrumb', faqLabel: 'FAQ', copyLanguage: language });
const sample = (name) => ({ name, title: `${name} free | UsefulVerse`, description: `${name} works in your browser.`, intro: `${name} intro`, howQuestion: 'How?', howAnswer: 'Use it.', privacyQuestion: 'Private?', privacyAnswer: 'Local.', copyLanguage: name, });

test('growth release gate demands separate copy for every tool and every published language', () => {
  assert.equal(assertGrowthLocaleCoverage(tools, locales, { en: { _home: sampleHome('en'), one: sample('en'), two: sample('en') }, es: { _home: sampleHome('es'), one: sample('es'), two: sample('es') } }), true);
  assert.throws(() => assertGrowthLocaleCoverage(tools, locales, { en: { _home: sampleHome('en'), one: sample('en'), two: sample('en') } }), /es: locale copy is missing/);
  assert.throws(() => assertGrowthLocaleCoverage(tools, locales, { en: { _home: sampleHome('en'), one: sample('en'), two: sample('en') }, es: { _home: sampleHome('es'), one: sample('es') } }), /es\/two: translation is missing/);
});

test('growth release gate enforces metadata limits and language-specific copy', () => {
  const overlong = { ...sample('en'), title: `${'x'.repeat(61)} | UsefulVerse` };
  assert.throws(() => assertGrowthLocaleCoverage([{ id: 'one' }], [{ key: 'en' }], { en: { _home: sampleHome('en'), one: overlong } }), /title is .*max 60/);
  assert.throws(() => assertGrowthLocaleCoverage([{ id: 'one' }], [{ key: 'en' }], { en: { _home: sampleHome('en'), one: { ...sample('es'), copyLanguage: 'es' } } }), /copy language does not match/);
});

test('growth release gate blocks candidate copy explicitly marked as untranslated', () => {
  const draft = { ...sample('es'), localizationStatus: 'pending-tool-specific-translation' };
  assert.throws(() => assertGrowthLocaleCoverage([{ id: 'one' }], [{ key: 'es' }], { es: { _home: sampleHome('es'), one: draft } }), /localization is not approved for release/);
});

test('the first real English pilot copy satisfies every field, message, placeholder and title budget', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.ok(Object.values(englishGrowthCopy).every((copy) => copy.title.length <= 60));
});

test('image color picker has complete locale-specific copy and metadata in all 36 languages', () => {
  const colorPicker = allGrowthPilotTools.find(({ id }) => id === 'image-color-picker');
  assert.ok(colorPicker);
  assert.equal(localeEntries.length, 36);
  assert.equal(assertGrowthLocaleCoverage([colorPicker], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][colorPicker.id];
    assert.equal(copy.copyLanguage, key);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
  }
});

test('image upscaler has complete localized copy, local-processing limits and cancellation in all 36 languages', () => {
  const upscaler = allGrowthPilotTools.find(({ id }) => id === 'image-upscaler');
  assert.ok(upscaler);
  assert.equal(localeEntries.length, 36);
  assert.equal(assertGrowthLocaleCoverage([upscaler], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][upscaler.id];
    assert.equal(copy.copyLanguage, key);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
    assert.ok(copy.fields.accuracyNote.length > 20, `${key}: device limits are disclosed`);
    assert.ok(copy.messages.imageTooLarge.length > 0 && copy.messages.cancelled.length > 0, key);
    assert.ok(copy.actions.upscale.length > 0 && copy.actions.cancel.length > 0, key);
    assert.doesNotMatch(JSON.stringify(copy), /UVZX\d{4}QXZ|undefined/iu, key);
  }
});

test('HELOC calculator has complete localized copy, visible assumptions and metadata in all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'heloc-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.copyLanguage, key);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
    assert.ok(copy.fields.accuracyNote.trim().length > 30, `${key}: assumptions and financial caveat`);
    if (key === 'ar') assert.doesNotMatch(copy.fields.annualApr, /السنوي السنوي/u);
    assert.doesNotMatch(JSON.stringify(copy), /UVHL\d{4}QXZ|undefined/iu, key);
  }
});

test('dominoes game has complete static copy and FAQs in all 36 languages', () => {
  const dominoes = allGrowthPilotTools.find(({ id }) => id === 'dominoes-game');
  assert.ok(dominoes);
  assert.equal(assertGrowthLocaleCoverage([dominoes], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][dominoes.id];
    assert.equal(copy.copyLanguage, key);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
    assert.match(copy.messages.turn, /\{player\}/u, key);
    assert.doesNotMatch(JSON.stringify(copy), /UVTOKEN|987654\d{4}456789|undefined/u, key);
  }
});

test('weight-loss scenario has 36 localized cautious copy sets and official-source labels', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'weight-loss-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.copyLanguage, key);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.ok(copy.fields.healthNote.length > 20);
    assert.ok(copy.fields.methodNote.length > 20);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
  }
});

test('tire-size calculator has localized copy and complete controls in every supported language', () => {
  const tireTool = allGrowthPilotTools.find(({ id }) => id === 'tire-size-calculator');
  assert.ok(tireTool);
  assert.equal(localeEntries.length, 36);
  assert.equal(assertGrowthLocaleCoverage([tireTool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tireTool.id];
    assert.ok(copy.fields.fitmentNote.trim().length > 0, `${key}: fitment limits should be present`);
    assert.ok(copy.messages.sameSize.length > 0, `${key}: equality state should be localized`);
    assert.ok(copy.actions.kmh.length > 0 && copy.actions.mph.length > 0, `${key}: speed units should be labeled`);
  }
});

test('stair calculator has localized copy and two complete, localized FAQs in every supported language', () => {
  const stairTool = allGrowthPilotTools.find(({ id }) => id === 'stair-calculator');
  assert.ok(stairTool);
  assert.equal(localeEntries.length, 36);
  assert.equal(assertGrowthLocaleCoverage([stairTool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][stairTool.id];
    assert.ok(copy.fields.codeNote.trim().length > 0, `${key}: code boundary should be present`);
    assert.equal(copy.additionalFaqs.length, 2, `${key}: two additional FAQs should be localized`);
    assert.ok(copy.actions.meters && copy.actions.feet && copy.actions.inches, `${key}: units should be labeled`);
  }
});

test('asphalt calculator has 36 localized copies, estimates-only disclosures and complete FAQs', () => {
  const asphaltTool = allGrowthPilotTools.find(({ id }) => id === 'asphalt-calculator');
  assert.ok(asphaltTool);
  assert.equal(assertGrowthLocaleCoverage([asphaltTool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][asphaltTool.id];
    assert.ok(copy.fields.accuracyNote.trim().length > 0, `${key}: supplier-density caveat should be present`);
    assert.ok(copy.fields.relatedConcreteCalculator.trim().length > 0, `${key}: related concrete tool should be linked`);
    assert.equal(copy.additionalFaqs.length, 2, `${key}: two complete FAQs should be present`);
    assert.doesNotMatch(JSON.stringify(copy), /88993745\d{4}/u, `${key}: translation marker must not leak`);
  }
});

test('wallpaper calculator has complete localized copy, pattern guidance and boundaries in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'wallpaper-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.ok(copy.fields.accuracyNote.trim(), `${key}: estimate boundary should be present`);
    assert.ok(copy.fields.relatedPaintCalculator.trim(), `${key}: related paint tool should be linked`);
    assert.equal(copy.additionalFaqs.length, 2, `${key}: both FAQs should be localized`);
    assert.doesNotMatch(JSON.stringify(copy), /UVWALL\d{4}X?|UVTOKEN\d+X/u, `${key}: translation markers must not leak`);
  }
});

test('image region redactor has complete localized copy, privacy boundaries and FAQs in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'image-region-redactor');
  assert.ok(tool);
  assert.equal(localeEntries.length, 36);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.ok(copy.fields.accuracyNote.trim(), `${key}: privacy and size boundary should be present`);
    assert.ok(copy.fields.imageFile.trim(), `${key}: supported image types must be described`);
    assert.ok(copy.fields.relatedMosaic.trim() && copy.fields.relatedCropper.trim(), `${key}: related image tools should be linked`);
    assert.equal(copy.additionalFaqs.length, 2, `${key}: two FAQs should be localized`);
    assert.doesNotMatch(JSON.stringify(copy), /⟦R\d{3}⟧|UVIMG\d+X|undefined|:null/u, `${key}: no marker or missing copy`);
  }
  assert.match(localizedCopies.en[tool.id].fields.imageFile, /BMP/u, 'English copy names BMP as a supported format');
});

test('image sharpener has complete localized copy, device limits and FAQs in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'image-sharpener');
  assert.ok(tool);
  assert.equal(localeEntries.length, 36);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.ok(copy.fields.accuracyNote.trim(), `${key}: device and quality boundary should be present`);
    assert.ok(copy.fields.imageFile.trim(), `${key}: input should be labeled`);
    assert.ok(copy.fields.relatedRedactor.trim() && copy.fields.relatedCropper.trim(), `${key}: related tools should be linked`);
    assert.equal(copy.additionalFaqs.length, 2, `${key}: two FAQs should be present`);
    assert.doesNotMatch(JSON.stringify(copy), /UVS\d{3}X|UVSHARPEN\d{3}X|undefined|:null/u, `${key}: no translation marker or missing copy`);
  }
});

test('soil calculator has 36 localized copies, container-fill boundary and complete FAQs', () => {
  const soilTool = allGrowthPilotTools.find(({ id }) => id === 'soil-calculator');
  assert.ok(soilTool);
  assert.equal(assertGrowthLocaleCoverage([soilTool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][soilTool.id];
    assert.ok(copy.fields.accuracyNote.trim().length > 0, `${key}: actual fill can differ`);
    assert.equal(copy.additionalFaqs.length, 2, `${key}: two complete FAQs should be present`);
    assert.ok(copy.actions.liters && copy.actions.cubicFeet, `${key}: bag volume units should be labeled`);
    assert.doesNotMatch(JSON.stringify(copy), /UVSOIL\d{4}X|UVTOKEN\d+X/u, `${key}: translation markers must not leak`);
  }
});

test('pool calculator has 36 complete localized copies and distinguishes gallon standards', () => {
  const poolTool = allGrowthPilotTools.find(({ id }) => id === 'pool-volume-calculator');
  assert.ok(poolTool);
  assert.equal(assertGrowthLocaleCoverage([poolTool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][poolTool.id];
    assert.ok(copy.fields.accuracyNote.trim());
    assert.ok(copy.actions.sloped && copy.actions.oval && copy.actions.inches);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.doesNotMatch(JSON.stringify(copy), /UVPOOL\d{4}X|UVTOKEN\d+X/u, `${key}: translation markers must not leak`);
  }
});

test('roof pitch calculator has all localized geometry labels, safety notes and FAQs', () => {
  const roofTool = allGrowthPilotTools.find(({ id }) => id === 'roof-pitch-calculator');
  assert.ok(roofTool);
  assert.equal(assertGrowthLocaleCoverage([roofTool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][roofTool.id];
    assert.ok(copy.fields.safetyNote.trim());
    assert.ok(copy.actions.millimeters && copy.actions.feet && copy.actions.inches);
    assert.equal(copy.additionalFaqs.length, 2);
  }
});

test('drywall calculator localizes estimation limits, units and FAQs across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'drywall-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.ok(copy.fields.accuracyNote.trim());
    assert.ok(copy.actions.withCeiling && copy.actions.wallsOnly && copy.actions.millimeters);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.doesNotMatch(JSON.stringify(copy), /\{count\}|UVTOKEN\d+X/u);
  }
});

test('roofing calculator localizes material estimates, package coverage limits and FAQs across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'roofing-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.ok(copy.fields.safetyNote.trim());
    assert.ok(copy.actions.squareFeet && copy.actions.squareMeters && copy.actions.inches);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.doesNotMatch(JSON.stringify(copy), /UVTOKEN\d+X|undefined|null/u, `${key}: no draft marker or missing copy`);
  }
});

test('deck calculator localizes decking, stock-board joints, supports and safety notes in all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'deck-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.ok(copy.fields.safetyNote.trim());
    assert.ok(copy.actions.meters && copy.actions.feet && copy.actions.inches);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.doesNotMatch(JSON.stringify(copy), /UVTOKEN\d+X|undefined|null/u, `${key}: no draft marker or missing copy`);
  }
});

test('fence calculator localizes estimates, even-gate assumption and end-post FAQs in all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'fence-calculator');
  assert.ok(tool);
  assert.equal(localeEntries.length, 36);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.ok(copy.fields.accuracyNote.trim());
    assert.ok(copy.actions.meters && copy.actions.feet && copy.actions.inches);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.doesNotMatch(JSON.stringify(copy), /UVTOKEN\d+X|undefined|null/u, `${key}: no draft marker or missing copy`);
  }
});

test('pool salt calculator localizes manufacturer-target caveat and salinity FAQs in all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'pool-salt-calculator');
  assert.ok(tool);
  assert.equal(localeEntries.length, 36);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  assert.equal(localizedCopies.es[tool.id].name, 'Calculadora de sal para piscinas');
  assert.equal(localizedCopies.es[tool.id].title, 'Calculadora de sal para piscina gratis | UsefulVerse');
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.ok(copy.fields.accuracyNote.trim());
    assert.ok(copy.actions.liters && copy.actions.usGallons && copy.actions.imperialGallons);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.doesNotMatch(JSON.stringify(copy), /UVTOKEN\d+X|undefined|null/u, `${key}: no draft marker or missing copy`);
  }
  assert.match(localizedCopies.es[tool.id].privacyAnswer, /piscina/u);
  assert.doesNotMatch(localizedCopies.es[tool.id].privacyAnswer, /grupo/u);
  assert.equal(localizedCopies.ar[tool.id].actions.pounds, 'أرطال');
  assert.equal(localizedCopies.ar[tool.id].actions.kilograms, 'كيلوغرامات');
  assert.equal(localizedCopies.ar[tool.id].messages.saltToAdd, 'كمية الملح المطلوبة وفقًا للنقاء المُدخل');
});

test('solar panel calculator has a complete static draft in all 36 locales with intact brand metadata', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'solar-panel-calculator');
  assert.ok(tool);
  assert.equal(localeEntries.length, 36);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.copyLanguage, key);
    assert.ok(copy.title.endsWith(' | UsefulVerse'), `${key}: brand suffix must remain unchanged`);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: metadata length`);
    assert.equal(copy.additionalFaqs.length, 2, `${key}: complete FAQs`);
    assert.ok(copy.fields.accuracyNote.trim(), `${key}: estimate limits`);
    assert.doesNotMatch(JSON.stringify(copy), /UV(?:BEG|END|SOL)\d{4}QXZ|undefined|null/iu, `${key}: no translation markers or missing copy`);
  }
  assert.match(localizedCopies.es[tool.id].title, /UsefulVerse/u);
});

test('BTU calculator has 36 static localized drafts, honest load limits and bounded metadata', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'btu-calculator');
  assert.ok(tool);
  assert.equal(localeEntries.length, 36);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.copyLanguage, key);
    assert.ok(copy.title.endsWith(' | UsefulVerse'));
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.doesNotMatch(`${copy.name} ${copy.title} ${copy.description}`, / {2,}|undefined|null/u);
    assert.doesNotMatch(JSON.stringify(copy), /UVTOKEN\d+X|undefined|null/iu);
  }
  assert.match(localizedCopies.en[tool.id].fields.accuracyNote, /Manual J/u);
  assert.match(localizedCopies.es[tool.id].intro, /aislamiento/u);
  assert.match(localizedCopies.ar[tool.id].copyLanguage, /^ar$/u);
});

test('the first Google Translate Spanish draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'es' }], { es: spanishGrowthCopy }), true);
  assert.ok(Object.values(spanishGrowthCopy).every((copy) => copy.copyLanguage === 'es'));
  assert.ok(Object.values(spanishGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
});

test('the first Google Translate French draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'fr' }], { fr: frenchGrowthCopy }), true);
  assert.ok(Object.values(frenchGrowthCopy).every((copy) => copy.copyLanguage === 'fr'));
  assert.ok(Object.values(frenchGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
});

test('the first Google Translate Portuguese draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'pt' }], { pt: portugueseGrowthCopy }), true);
  assert.ok(Object.values(portugueseGrowthCopy).every((copy) => copy.copyLanguage === 'pt'));
  assert.ok(Object.values(portugueseGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(portugueseGrowthCopy['auto-loan-refinance-calculator'].name, 'Calculadora de refinanciamento de carro');
  assert.equal(portugueseGrowthCopy.mancala.messages.pit, 'Casa');
});

test('the first Google Translate German draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'de' }], { de: germanGrowthCopy }), true);
  assert.ok(Object.values(germanGrowthCopy).every((copy) => copy.copyLanguage === 'de'));
  assert.ok(Object.values(germanGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(germanGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} Monate');
  assert.equal(germanGrowthCopy.mancala.messages.turn, '{player} ist am Zug.');
});

test('the first Google Translate Japanese draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ja' }], { ja: japaneseGrowthCopy }), true);
  assert.ok(Object.values(japaneseGrowthCopy).every((copy) => copy.copyLanguage === 'ja'));
  assert.ok(Object.values(japaneseGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(japaneseGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver}が{recipient}にプレゼントを贈ります。');
  assert.equal(japaneseGrowthCopy.mancala.messages.turn, '{player}の番です。');
});

test('the first Google Translate Korean draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ko' }], { ko: koreanGrowthCopy }), true);
  assert.ok(Object.values(koreanGrowthCopy).every((copy) => copy.copyLanguage === 'ko'));
  assert.ok(Object.values(koreanGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(koreanGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count}개월');
  assert.equal(koreanGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} 님이 {recipient} 님에게 선물을 줍니다.');
  assert.equal(koreanGrowthCopy.mancala.messages.turn, '{player} 차례입니다.');
});

test('the first Google Translate Indonesian draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'id' }], { id: indonesianGrowthCopy }), true);
  assert.ok(Object.values(indonesianGrowthCopy).every((copy) => copy.copyLanguage === 'id'));
  assert.ok(Object.values(indonesianGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(indonesianGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} bulan');
  assert.equal(indonesianGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} memberikan hadiah kepada {recipient}.');
  assert.equal(indonesianGrowthCopy.mancala.messages.turn, 'Giliran {player} bermain.');
});

test('the first Google Translate Hindi draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'hi' }], { hi: hindiGrowthCopy }), true);
  assert.ok(Object.values(hindiGrowthCopy).every((copy) => copy.copyLanguage === 'hi'));
  assert.ok(Object.values(hindiGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(hindiGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} महीने');
  assert.equal(hindiGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} ने {recipient} को उपहार दिया।');
  assert.equal(hindiGrowthCopy.mancala.messages.turn, '{player} की चाल।');
});

test('the first Google Translate Arabic draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ar' }], { ar: arabicGrowthCopy }), true);
  assert.ok(Object.values(arabicGrowthCopy).every((copy) => copy.copyLanguage === 'ar'));
  assert.ok(Object.values(arabicGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(arabicGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} شهراً');
  assert.equal(arabicGrowthCopy['secret-santa-generator'].messages.privatePair, 'يقدم {giver} هدية إلى {recipient}.');
  assert.equal(arabicGrowthCopy.mancala.messages.turn, 'دور {player}.');
});

test('the first Google Translate simplified Chinese draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'zh' }], { zh: simplifiedChineseGrowthCopy }), true);
  assert.ok(Object.values(simplifiedChineseGrowthCopy).every((copy) => copy.copyLanguage === 'zh'));
  assert.ok(Object.values(simplifiedChineseGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(simplifiedChineseGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} 个月');
  assert.equal(simplifiedChineseGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} 赠送礼物给 {recipient}。');
  assert.equal(simplifiedChineseGrowthCopy.mancala.messages.turn, '轮到 {player} 走棋。');
  assert.equal(simplifiedChineseGrowthCopy['gravel-calculator'].actions.generate, '开始抽签');
});

test('the first Google Translate Bengali draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'bn' }], { bn: bengaliGrowthCopy }), true);
  assert.ok(Object.values(bengaliGrowthCopy).every((copy) => copy.copyLanguage === 'bn'));
  assert.ok(Object.values(bengaliGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(bengaliGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} মাস');
  assert.equal(bengaliGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} {recipient}-কে উপহার দিচ্ছেন।');
  assert.equal(bengaliGrowthCopy.mancala.messages.turn, '{player}-এর চাল।');
});

test('the first Google Translate Russian draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ru' }], { ru: russianGrowthCopy }), true);
  assert.ok(Object.values(russianGrowthCopy).every((copy) => copy.copyLanguage === 'ru'));
  assert.ok(Object.values(russianGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(russianGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} мес.');
  assert.equal(russianGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} дарит подарок {recipient}.');
  assert.equal(russianGrowthCopy.mancala.messages.turn, 'Ход игрока {player}.');
});

test('the first Google Translate Urdu draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ur' }], { ur: urduGrowthCopy }), true);
  assert.ok(Object.values(urduGrowthCopy).every((copy) => copy.copyLanguage === 'ur'));
  assert.ok(Object.values(urduGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(urduGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} مہینے');
  assert.equal(urduGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver}، {recipient} کو تحفہ دیتا ہے۔');
  assert.equal(urduGrowthCopy.mancala.messages.turn, '{player} کی باری ہے۔');
});

test('the first Turkish draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'tr' }], { tr: turkishGrowthCopy }), true);
  assert.ok(Object.values(turkishGrowthCopy).every((copy) => copy.copyLanguage === 'tr'));
  assert.ok(Object.values(turkishGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(turkishGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} ay');
  assert.equal(turkishGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver}, {recipient} kişisine hediye veriyor.');
  assert.equal(turkishGrowthCopy.mancala.messages.turn, 'Sıra {player} oyuncusunda.');
});

test('the first Vietnamese draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'vi' }], { vi: vietnameseGrowthCopy }), true);
  assert.ok(Object.values(vietnameseGrowthCopy).every((copy) => copy.copyLanguage === 'vi'));
  assert.ok(Object.values(vietnameseGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(vietnameseGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} tháng');
  assert.equal(vietnameseGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} tặng quà cho {recipient}.');
  assert.equal(vietnameseGrowthCopy.mancala.messages.turn, 'Đến lượt {player}.');
  assert.equal(vietnameseGrowthCopy['secret-santa-generator'].title.length <= 60, true);
});

test('the first Italian draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'it' }], { it: italianGrowthCopy }), true);
  assert.ok(Object.values(italianGrowthCopy).every((copy) => copy.copyLanguage === 'it'));
  assert.ok(Object.values(italianGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(italianGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} mesi');
  assert.equal(italianGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} fa un regalo a {recipient}.');
  assert.equal(italianGrowthCopy.mancala.messages.turn, 'Tocca a {player}.');
});

test('the first Traditional Chinese draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'zh_tw' }], { zh_tw: traditionalChineseGrowthCopy }), true);
  assert.ok(Object.values(traditionalChineseGrowthCopy).every((copy) => copy.copyLanguage === 'zh_tw'));
  assert.ok(Object.values(traditionalChineseGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(traditionalChineseGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} 個月');
  assert.equal(traditionalChineseGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} 送禮給 {recipient}。');
  assert.equal(traditionalChineseGrowthCopy.mancala.messages.turn, '輪到玩家 {player}。');
});

test('the first Bulgarian draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'bg' }], { bg: bulgarianGrowthCopy }), true);
  assert.ok(Object.values(bulgarianGrowthCopy).every((copy) => copy.copyLanguage === 'bg'));
  assert.ok(Object.values(bulgarianGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(bulgarianGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} месеца');
  assert.equal(bulgarianGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} подарява подарък на {recipient}.');
  assert.equal(bulgarianGrowthCopy.mancala.messages.turn, 'Ред е на {player}.');
});

test('the first Catalan draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ca' }], { ca: catalanGrowthCopy }), true);
  assert.ok(Object.values(catalanGrowthCopy).every((copy) => copy.copyLanguage === 'ca'));
  assert.ok(Object.values(catalanGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(catalanGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} mesos');
  assert.equal(catalanGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} fa un regal a {recipient}.');
  assert.equal(catalanGrowthCopy.mancala.messages.turn, 'Torn de {player}.');
});

test('the first Dutch draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'nl' }], { nl: dutchGrowthCopy }), true);
  assert.ok(Object.values(dutchGrowthCopy).every((copy) => copy.copyLanguage === 'nl'));
  assert.ok(Object.values(dutchGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(dutchGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} maanden');
  assert.equal(dutchGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} geeft een cadeau aan {recipient}.');
  assert.equal(dutchGrowthCopy.mancala.messages.turn, '{player} is aan zet.');
});

test('the first Greek draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'el' }], { el: greekGrowthCopy }), true);
  assert.ok(Object.values(greekGrowthCopy).every((copy) => copy.copyLanguage === 'el'));
  assert.ok(Object.values(greekGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(greekGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} μήνες');
  assert.equal(greekGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} δίνει δώρο στον/στην {recipient}.');
  assert.equal(greekGrowthCopy.mancala.messages.turn, 'Σειρά του/της {player}.');
});

test('the first Malay draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ms' }], { ms: malayGrowthCopy }), true);
  assert.ok(Object.values(malayGrowthCopy).every((copy) => copy.copyLanguage === 'ms'));
  assert.ok(Object.values(malayGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(malayGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} bulan');
  assert.equal(malayGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} memberikan hadiah kepada {recipient}.');
  assert.equal(malayGrowthCopy.mancala.messages.turn, 'Giliran {player} untuk bergerak.');
});

test('the first Polish draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'pl' }], { pl: polishGrowthCopy }), true);
  assert.ok(Object.values(polishGrowthCopy).every((copy) => copy.copyLanguage === 'pl'));
  assert.ok(Object.values(polishGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(polishGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} miesięcy');
  assert.equal(polishGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} daje prezent osobie {recipient}.');
  assert.equal(polishGrowthCopy.mancala.messages.turn, 'Ruch gracza {player}.');
});

test('the first Swedish draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'sv' }], { sv: swedishGrowthCopy }), true);
  assert.ok(Object.values(swedishGrowthCopy).every((copy) => copy.copyLanguage === 'sv'));
  assert.ok(Object.values(swedishGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(swedishGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} månader');
  assert.equal(swedishGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} ger en present till {recipient}.');
  assert.equal(swedishGrowthCopy.mancala.messages.turn, '{player} är näst på tur.');
});

test('the first Thai draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'th' }], { th: thaiGrowthCopy }), true);
  assert.ok(Object.values(thaiGrowthCopy).every((copy) => copy.copyLanguage === 'th'));
  assert.ok(Object.values(thaiGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(thaiGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} เดือน');
  assert.equal(thaiGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} มอบของขวัญให้ {recipient}');
  assert.equal(thaiGrowthCopy.mancala.messages.turn, 'ถึงตา {player}');
});

test('the first Ukrainian draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'uk' }], { uk: ukrainianGrowthCopy }), true);
  assert.ok(Object.values(ukrainianGrowthCopy).every((copy) => copy.copyLanguage === 'uk'));
  assert.ok(Object.values(ukrainianGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(ukrainianGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} місяців');
  assert.equal(ukrainianGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} дарує подарунок для {recipient}.');
  assert.equal(ukrainianGrowthCopy.mancala.messages.turn, 'Хід гравця {player}.');
});

test('the first Swahili draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'sw' }], { sw: swahiliGrowthCopy }), true);
  assert.ok(Object.values(swahiliGrowthCopy).every((copy) => copy.copyLanguage === 'sw'));
  assert.ok(Object.values(swahiliGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(swahiliGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, 'miezi {count}');
  assert.equal(swahiliGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} anampa {recipient} zawadi.');
  assert.equal(swahiliGrowthCopy.mancala.messages.turn, 'Zamu ya {player}.');
});

test('the first Marathi draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'mr' }], { mr: marathiGrowthCopy }), true);
  assert.ok(Object.values(marathiGrowthCopy).every((copy) => copy.copyLanguage === 'mr'));
  assert.ok(Object.values(marathiGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(marathiGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} महिने');
  assert.equal(marathiGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} {recipient} यांना भेटवस्तू देतात.');
  assert.equal(marathiGrowthCopy.mancala.messages.turn, '{player} यांची चाल.');
});

test('the first Telugu draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'te' }], { te: teluguGrowthCopy }), true);
  assert.ok(Object.values(teluguGrowthCopy).every((copy) => copy.copyLanguage === 'te'));
  assert.ok(Object.values(teluguGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(teluguGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} నెలలు');
  assert.equal(teluguGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} వారు {recipient}కు బహుమతి ఇస్తారు.');
  assert.equal(teluguGrowthCopy.mancala.messages.turn, '{player} వంతు.');
});

test('the first Hausa draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ha' }], { ha: hausaGrowthCopy }), true);
  assert.ok(Object.values(hausaGrowthCopy).every((copy) => copy.copyLanguage === 'ha'));
  assert.ok(Object.values(hausaGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(hausaGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, 'watanni {count}');
  assert.equal(hausaGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} ya ba {recipient} kyauta.');
  assert.equal(hausaGrowthCopy.mancala.messages.turn, 'Juyin {player}.');
});

test('the first Filipino draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'tl' }], { tl: filipinoGrowthCopy }), true);
  assert.ok(Object.values(filipinoGrowthCopy).every((copy) => copy.copyLanguage === 'tl'));
  assert.ok(Object.values(filipinoGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(filipinoGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} buwan');
  assert.equal(filipinoGrowthCopy['secret-santa-generator'].messages.privatePair, 'Nagbibigay si {giver} ng regalo kay {recipient}.');
  assert.equal(filipinoGrowthCopy.mancala.messages.turn, 'Turn ni {player}.');
});

test('the first Tamil draft covers every copy key and preserves required placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'ta' }], { ta: tamilGrowthCopy }), true);
  assert.ok(Object.values(tamilGrowthCopy).every((copy) => copy.copyLanguage === 'ta'));
  assert.ok(Object.values(tamilGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(tamilGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} மாதங்கள்');
  assert.equal(tamilGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver}, {recipient}க்கு பரிசு வழங்குகிறார்.');
  assert.equal(tamilGrowthCopy.mancala.messages.turn, '{player} முறை.');
});

test('the Persian machine-translation draft covers every copy key and preserves RTL placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'fa' }], { fa: persianGrowthCopy }), true);
  assert.ok(Object.values(persianGrowthCopy).every((copy) => copy.copyLanguage === 'fa'));
  assert.ok(Object.values(persianGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(persianGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} ماه');
  assert.equal(persianGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} به {recipient} هدیه می‌دهد.');
  assert.equal(persianGrowthCopy.mancala.messages.turn, '{player} نوبت دارد.');
});

test('the Amharic machine-translation draft covers every copy key and preserves placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'am' }], { am: amharicGrowthCopy }), true);
  assert.ok(Object.values(amharicGrowthCopy).every((copy) => copy.copyLanguage === 'am'));
  assert.ok(Object.values(amharicGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(amharicGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} ወራት');
  assert.equal(amharicGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} ለ{recipient} ስጦታ ይሰጣል።');
  assert.equal(amharicGrowthCopy.mancala.messages.turn, '{player} ተራ ነው።');
});

test('the Gujarati machine-translation draft covers every copy key and preserves placeholders', () => {
  assert.equal(assertGrowthLocaleCoverage(growthPilotTools, [{ key: 'gu' }], { gu: gujaratiGrowthCopy }), true);
  assert.ok(Object.values(gujaratiGrowthCopy).every((copy) => copy.copyLanguage === 'gu'));
  assert.ok(Object.values(gujaratiGrowthCopy).every((copy) => copy.title.length <= 60 && copy.description.length <= 160));
  assert.equal(gujaratiGrowthCopy['auto-loan-refinance-calculator'].messages.monthCount, '{count} મહિના');
  assert.equal(gujaratiGrowthCopy['secret-santa-generator'].messages.privatePair, '{giver} {recipient}ને ભેટ આપે છે.');
  assert.equal(gujaratiGrowthCopy.mancala.messages.turn, '{player}નો વારો.');
});

test('brick calculator has complete static localized copy and bounded metadata in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'brick-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.copyLanguage, key);
    assert.equal(copy.additionalFaqs.length, 2);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
    assert.ok(copy.fields.accuracyNote.length > 40, key);
    assert.doesNotMatch(JSON.stringify(copy), /¤¤¤\d{4}¤¤¤|undefined|null/u, key);
    if (key !== 'en') assert.notEqual(copy.intro, localizedCopies.en[tool.id].intro, key);
  }
});

test('carpet calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'carpet-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('aquarium calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'aquarium-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('grass seed calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'grass-seed-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('insulation calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'insulation-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('wall framing calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'wall-framing-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('electricity cost calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'electricity-cost-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('compost calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'compost-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('pond volume calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'pond-volume-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('fertilizer calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'fertilizer-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('baluster spacing calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'baluster-spacing-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('retaining wall calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'retaining-wall-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('battery runtime calculator has a complete English source but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'battery-runtime-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('lumber cut optimizer has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'lumber-cut-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('plant spacing calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'plant-spacing-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('EV charging calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'ev-charging-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('rainwater harvesting calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'rainwater-harvesting-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('ramp calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'ramp-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('heat loss calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'heat-loss-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('heat pump calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'heat-pump-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('miter angle calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'miter-angle-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('voltage drop calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'voltage-drop-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('molarity calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'molarity-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('dilution calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'dilution-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('Ohm’s law calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'ohms-law-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('chemical equation balancer has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'chemical-equation-balancer');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('gear ratio calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'gear-ratio-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('density calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'density-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('compression ratio calculator has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'compression-ratio-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});

test('goal planner has complete English copy but blocks untranslated locale drafts from release', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'goal-planner');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assert.throws(() => assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), /localization is not approved for release/);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    assert.equal(localizedCopies[key][tool.id].localizationStatus, 'pending-tool-specific-translation', key);
    assert.equal(localizedCopies[key][tool.id].copyLanguage, key, key);
  }
});
