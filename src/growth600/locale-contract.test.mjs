import assert from 'node:assert/strict';
import test from 'node:test';
import { assertGrowthLocaleCoverage } from './locale-contract.mjs';
import { growthPilotTools as allGrowthPilotTools } from './catalog.mjs';
import { localeEntries } from '../locales.mjs';
import englishGrowthCopy from './locales/en.mjs';
import transformerCopies from './locales/transformer-calculator-final.mjs';
import { transformerCalculatorEnglishCopy } from './locales/transformer-calculator.en.mjs';
import stoichiometryCopies from './locales/stoichiometry-calculator-final.mjs';
import { stoichiometryCalculatorEnglishCopy } from './locales/stoichiometry-calculator.en.mjs';
import pressureCalculatorCopies from './locales/pressure-calculator-final.mjs';
import { pressureCalculatorEnglishCopy } from './locales/pressure-calculator.en.mjs';
import pcbTraceWidthCopies from './locales/pcb-trace-width-calculator-final.mjs';
import { pcbTraceWidthCalculatorEnglishCopy } from './locales/pcb-trace-width-calculator.en.mjs';
import projectileMotionCopies from './locales/projectile-motion-calculator-final.mjs';
import { projectileMotionCalculatorEnglishCopy } from './locales/projectile-motion-calculator.en.mjs';
import pulleyCalculatorCopies from './locales/pulley-calculator-final.mjs';
import { pulleyCalculatorEnglishCopy } from './locales/pulley-calculator.en.mjs';
import rlcCircuitCalculatorCopies from './locales/rlc-circuit-calculator-final.mjs';
import { rlcCircuitCalculatorEnglishCopy } from './locales/rlc-circuit-calculator.en.mjs';
import antennaLengthCalculatorCopies from './locales/antenna-length-calculator-final.mjs';
import { antennaLengthCalculatorEnglishCopy } from './locales/antenna-length-calculator.en.mjs';
import effectiveInterestRateCalculatorCopies from './locales/effective-interest-rate-calculator-final.mjs';
import { effectiveInterestRateCalculatorEnglishCopy } from './locales/effective-interest-rate-calculator.en.mjs';
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
import sectionModulusCopies from './locales/section-modulus-calculator.mjs';
import frequencyWavelengthCopies from './locales/frequency-wavelength-calculator.mjs';
import idealGasLawCopies from './locales/ideal-gas-law-calculator.mjs';
import torqueCalculatorCopies from './locales/torque-calculator.mjs';
import beamDeflectionCopies from './locales/beam-deflection-calculator.mjs';
import ledResistorCopies from './locales/led-resistor-calculator.mjs';
import flowRateCopies from './locales/flow-rate-calculator.mjs';
import reynoldsNumberCopies from './locales/reynolds-number-calculator.mjs';
import threePhasePowerCopies from './locales/three-phase-power-calculator.mjs';
import momentumCopies from './locales/momentum-calculator.mjs';
import logicGridPuzzleCopies from './locales/logic-grid-puzzle-final.mjs';
import markdownEditorCopies from './locales/markdown-editor-final.mjs';
import purchaseOrderGeneratorCopies from './locales/purchase-order-generator-final.mjs';
import eigenvalueCalculatorCopies from './locales/eigenvalue-calculator-final.mjs';
import bondCalculatorCopies from './locales/bond-calculator-final.mjs';
import waistToHipRatioCopies from './locales/waist-to-hip-ratio-calculator-final.mjs';
import stockProfitCalculatorCopies from './locales/stock-profit-calculator-final.mjs';
import { stockProfitCalculatorEnglishCopy } from './locales/stock-profit-calculator.en.mjs';
import pensionCalculatorCopies from './locales/pension-calculator-final.mjs';
import { pensionCalculatorEnglishCopy } from './locales/pension-calculator.en.mjs';
import lifetimeValueCalculatorCopies from './locales/lifetime-value-calculator-final.mjs';
import { lifetimeValueCalculatorEnglishCopy } from './locales/lifetime-value-calculator.en.mjs';

const growthPilotTools = allGrowthPilotTools.filter(({ id }) => !['markdown-editor', 'purchase-order-generator', 'bond-calculator', 'waist-to-hip-ratio-calculator', 'tire-size-calculator', 'stair-calculator', 'asphalt-calculator', 'carpet-calculator', 'aquarium-calculator', 'grass-seed-calculator', 'insulation-calculator', 'wall-framing-calculator', 'electricity-cost-calculator', 'compost-calculator', 'pond-volume-calculator', 'fertilizer-calculator', 'baluster-spacing-calculator', 'retaining-wall-calculator', 'battery-runtime-calculator', 'lumber-cut-calculator', 'plant-spacing-calculator', 'ev-charging-calculator', 'rainwater-harvesting-calculator', 'ramp-calculator', 'heat-loss-calculator', 'heat-pump-calculator', 'miter-angle-calculator', 'voltage-drop-calculator', 'molarity-calculator', 'ph-calculator', 'dilution-calculator', 'ohms-law-calculator', 'chemical-equation-balancer', 'gear-ratio-calculator', 'density-calculator', 'kinetic-energy-calculator', 'resistor-color-code-calculator', 'acceleration-calculator', 'compression-ratio-calculator', 'goal-planner', 'mind-map-maker', 'mood-tracker', 'journal-online', 'travel-itinerary-planner', 'polynomial-long-division-calculator', 'half-life-calculator', 'mortgage-points-calculator', 'trapezoid-calculator', 'prayer-times-calculator', 'hitori', 'nurikabe', 'color-name-finder', 'photo-to-sketch', 'schema-markup-validator', 'readability-checker', 'savings-goal-calculator', 'severance-pay-calculator', 'divisibility-calculator', 'number-line-graphing-tool', 'laplace-transform-calculator', 'vector-calculator', 'cubic-quartic-equation-calculator', 'complex-number-calculator'].includes(id));
const localizedCopies = Object.fromEntries(await Promise.all(localeEntries.map(async ({ key }) => [
  key,
  { ...(await import(`./locales/${key}.mjs`)).default, 'purchase-order-generator': purchaseOrderGeneratorCopies[key], 'eigenvalue-calculator': eigenvalueCalculatorCopies[key], 'bond-calculator': bondCalculatorCopies[key], 'waist-to-hip-ratio-calculator': waistToHipRatioCopies[key], 'stock-profit-calculator': key === 'en' ? stockProfitCalculatorEnglishCopy : stockProfitCalculatorCopies[key], 'pension-calculator': pensionCalculatorCopies[key], 'lifetime-value-calculator': lifetimeValueCalculatorCopies[key] },
])));

test('section modulus calculator has static, bounded translations in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'section-modulus-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = sectionModulusCopies[key];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 80, `${key}: structural limits disclosed`);
    assert.ok(copy.fields.hollowRectangle && copy.fields.triangle && copy.messages.ix && copy.messages.zxTop, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
  }
});

test('frequency wavelength calculator has static, bounded translations and science caveats in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'frequency-wavelength-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = frequencyWavelengthCopies[key];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 80, `${key}: speed assumptions disclosed`);
    assert.ok(copy.fields.frequency && copy.fields.wavelength && copy.fields.speed && copy.messages.solved, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
  }
});

test('ideal gas law calculator has static, bounded translations and absolute-temperature caveats in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'ideal-gas-law-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = idealGasLawCopies[key];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 30, `${key}: model and absolute-temperature limits disclosed`);
    assert.ok(copy.fields.pressure && copy.fields.volume && copy.fields.amount && copy.fields.temperature, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
  }
});

test('torque calculator has static, bounded translations and moment assumptions in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'torque-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = torqueCalculatorCopies[key];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 70, `${key}: formula and limits disclosed`);
    assert.ok(copy.fields.force && copy.fields.arm && copy.fields.angle && copy.messages.diagram, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
    assert.notEqual(copy.additionalFaqs[0].question, copy.howQuestion, `${key}: FAQ must add a distinct question`);
    assert.notEqual(copy.additionalFaqs[0].question, copy.privacyQuestion, `${key}: FAQs must not repeat the privacy question`);
  }
});

test('beam deflection calculator has static translations, unit labels and engineering limits in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'beam-deflection-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  assert.equal(localeEntries.length, 36);
  for (const { key } of localeEntries) {
    const copy = beamDeflectionCopies[key];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.simplySupported && copy.fields.cantilever && copy.fields.inertia && copy.fields.accuracyNote, key);
    assert.ok(copy.messages.maxDeflection && copy.messages.maxMoment && copy.messages.curveLabel, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
    assert.ok(copy.fields.accuracyNote.length > 40, `${key}: structural limitations are disclosed`);
  }
  assert.match(beamDeflectionCopies.en.fields.accuracyNote, /Euler–Bernoulli/u);
});

test('LED resistor calculator has static translations and current/power caveats in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'led-resistor-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = ledResistorCopies[key];
    assert.equal(copy.additionalFaqs.length, 4, key);
    assert.ok(copy.fields.supplyVoltage && copy.fields.forwardVoltage && copy.fields.targetCurrentMa && copy.fields.accuracyNote, key);
    assert.ok(copy.messages.requiredResistance && copy.messages.resistorPower && copy.messages.minimumPowerRating, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
  }
  assert.match(ledResistorCopies.en.fields.accuracyNote, /not a safety certification/u);
  assert.equal(ledResistorCopies.es.title, 'Calculadora de resistencia LED gratis | UsefulVerse');
  assert.equal(ledResistorCopies.ar.fields.targetCurrentMa, 'التيار المستهدف (mA)');
  assert.equal(ledResistorCopies.ar.fields.e24, 'E24 — خيارات أكثر');
});

test('flow rate calculator has static localized flow, unit and hydraulic-scope copy in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'flow-rate-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = flowRateCopies[key];
    assert.equal(copy.additionalFaqs.length, 4, key);
    assert.ok(copy.fields.mode && copy.fields.area && copy.fields.velocity && copy.fields.flowRate && copy.fields.tankVolume && copy.fields.accuracyNote, key);
    assert.ok(copy.messages.flowRate && copy.messages.fillTime && copy.messages.formulaValue, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
    if (key !== 'en') {
      assert.notEqual(copy.name, flowRateCopies.en.name, `${key}: tool name is translated`);
      assert.notEqual(copy.intro, flowRateCopies.en.intro, `${key}: page introduction is translated`);
      assert.notEqual(copy.fields.accuracyNote, flowRateCopies.en.fields.accuracyNote, `${key}: model limits are translated`);
    }
  }
  assert.match(flowRateCopies.en.fields.accuracyNote, /pressure loss.*not plumbing or engineering design advice/u);
});

test('Reynolds number calculator has localized scope and invariant equations in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'reynolds-number-calculator');
  assert.ok(tool);
  assert.equal(Object.keys(reynoldsNumberCopies).length, 36);
  for (const { key } of localeEntries) {
    const copy = reynoldsNumberCopies[key];
    assert.ok(copy.name && copy.intro && copy.description && copy.fields.dynamicViscosity && copy.fields.kinematicViscosity && copy.fields.accuracyNote, key);
    assert.equal(copy.messages.dynamicFormula, 'Re = ρ × v × L ÷ μ', `${key}: dynamic equation remains invariant`);
    assert.equal(copy.messages.kinematicFormula, 'Re = v × L ÷ ν', `${key}: kinematic equation remains invariant`);
    if (key !== 'en') {
      assert.notEqual(copy.name, reynoldsNumberCopies.en.name, `${key}: localized name`);
      assert.notEqual(copy.intro, reynoldsNumberCopies.en.intro, `${key}: localized introduction`);
      assert.notEqual(copy.fields.accuracyNote, reynoldsNumberCopies.en.fields.accuracyNote, `${key}: localized scope limits`);
    }
  }
  assert.match(reynoldsNumberCopies.en.fields.accuracyNote, /External-flow regimes depend on geometry and the chosen length scale, so no universal category is assigned/u);
});

test('three-phase power calculator has static scope and invariant formulas in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'three-phase-power-calculator');
  assert.ok(tool);
  assert.equal(Object.keys(threePhasePowerCopies).length, 36);
  for (const { key } of localeEntries) {
    const copy = threePhasePowerCopies[key];
    assert.ok(copy.name && copy.intro && copy.description && copy.fields.system && copy.fields.topology && copy.fields.accuracyNote, key);
    assert.equal(copy.messages.singlePhaseFormula, 'S = V × I; P = S × PF; Q = S × √(1 − PF²)', `${key}: single-phase equation remains invariant`);
    assert.equal(copy.messages.threePhaseFormula, 'S = √3 × Vline × Iline; P = S × PF; Q = S × √(1 − PF²)', `${key}: three-phase equation remains invariant`);
    if (key !== 'en') {
      assert.notEqual(copy.name, threePhasePowerCopies.en.name, `${key}: localized name`);
      assert.notEqual(copy.intro, threePhasePowerCopies.en.intro, `${key}: localized introduction`);
      assert.notEqual(copy.fields.accuracyNote, threePhasePowerCopies.en.fields.accuracyNote, `${key}: localized safety scope`);
    }
  }
  assert.match(threePhasePowerCopies.en.fields.accuracyNote, /Harmonics, phase imbalance.*not modeled/u);
  assert.equal(threePhasePowerCopies.ar.messages.activePower, 'القدرة الفعالة (P)');
  assert.equal(threePhasePowerCopies.ar.messages.lineCurrent, 'تيار الخط');
  assert.equal(threePhasePowerCopies.ar.fields.lineVoltage, 'جهد الخط');
});

test('section modulus calculator has static, bounded translations in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'section-modulus-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 80, `${key}: structural limits disclosed`);
    assert.ok(copy.fields.hollowRectangle && copy.fields.triangle && copy.messages.ix && copy.messages.zxTop, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
  }
});

test('polygon calculator has 36 locale copies with clear geometric measurements', () => {
  assert.equal(assertGrowthLocaleCoverage([allGrowthPilotTools.find(({ id }) => id === 'polygon-calculator')], localeEntries, localizedCopies), true);
  assert.equal(localizedCopies.ar['polygon-calculator'].fields.circumradius, 'المسافة من المركز إلى الرأس');
  assert.equal(localizedCopies.ar['polygon-calculator'].fields.computedApothem, 'المسافة العمودية من المركز إلى الضلع');
  assert.equal(localizedCopies.ar['polygon-calculator'].fields.sides, 'عدد الأضلاع (4–1000)');
  assert.equal(localizedCopies.ar['polygon-calculator'].fields.area, 'المساحة');
  assert.equal(localizedCopies.ru['polygon-calculator'].fields.apothem, 'Расстояние от центра перпендикулярно к стороне');
  assert.equal(localizedCopies.ur['polygon-calculator'].fields.computedCircumradius, 'مرکز سے راس تک فاصلہ');
  for (const locale of localeEntries) {
    const copy = localizedCopies[locale.key]['polygon-calculator'];
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${locale.key} metadata stays within snippet budgets`);
  }
});

test('thermal expansion calculator has complete static copy and snippet-sized metadata in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'thermal-expansion-calculator');
  assert.ok(tool);
  assert.equal(localeEntries.length, 36);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  assert.equal(localizedCopies.ar[tool.id].fields.areaMode, 'المساحة');
  assert.equal(localizedCopies.ar[tool.id].fields.volumeMode, 'الحجم');
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 30, `${key}: limits and coefficient assumptions disclosed`);
    assert.ok(copy.title.toLowerCase().includes('usefulverse'), `${key}: brand retained in title`);
  }
});

test('Fourier calculator has 36 translated copies and fixes technical labels left in English', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'fourier-series-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  assert.equal(localizedCopies.tl[tool.id].name, 'Kalkulador ng Seryeng Fourier');
  assert.equal(localizedCopies.tl[tool.id].fields.coefficientA, 'Koepisyent ng cosine aₙ');
  assert.equal(localizedCopies.sw[tool.id].actions.reset, 'Futa');
  assert.equal(localizedCopies.ha[tool.id].name, 'Kalkuleta na jerin Fourier');
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: metadata budgets`);
    assert.equal(copy.fields.formula, localizedCopies.en[tool.id].fields.formula, `${key}: formula stays exact`);
  }
});

test('modular inverse calculator has complete translated copies and preserves its mathematical definition', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'modular-inverse-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  assert.equal(localizedCopies.en[tool.id].fields.formula, 'a × x ≡ 1 (mod m).');
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: metadata limits`);
    assert.equal(copy.fields.formula, localizedCopies.en[tool.id].fields.formula, `${key}: formula remains exact`);
    assert.ok(copy.fields.resultInverse && copy.fields.resultGcd && copy.fields.accuracyNote.length > 30, key);
  }
});

test('A/B test calculator has 36 copies, explicit group labels, three FAQs, and bounded metadata', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'a-b-test-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: metadata limits`);
    assert.ok(copy.fields.groupA && copy.fields.groupB && copy.fields.methodNote, key);
    assert.ok(copy.actions.example && copy.messages.inconclusive, key);
  }
});

test('investment allocation calculator includes static copy, three FAQs and bounded metadata in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'investment-allocation-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: metadata limits`);
    assert.ok(copy.fields.targetWeight && copy.fields.difference && copy.fields.accuracyNote, key);
    assert.ok(copy.actions.calculate && copy.actions.copy && copy.messages.checkInputs, key);
  }
  assert.match(localizedCopies.en[tool.id].fields.accuracyNote, /not investment advice/u);
});

test('repeating-decimal conversion has static copy and exact-decimal FAQ coverage in all locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'repeating-decimal-to-fraction');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: metadata limits`);
    assert.ok(copy.fields.decimal && copy.fields.inputHint && copy.fields.derivation, key);
    assert.ok(copy.actions.calculate && copy.actions.copy && copy.messages.checkInputs, key);
  }
  assert.match(localizedCopies.en[tool.id].description, /0\.\(3\)/u);
});

function assertMachineAcceptedGrowthToolInAllLocales(tool) {
  const copies = Object.fromEntries(localeEntries.map(({ key }) => [key, {
    ...localizedCopies[key],
    ...(tool.id === 'markdown-editor' ? { 'markdown-editor': markdownEditorCopies[key] } : {}),
    ...(tool.id === 'purchase-order-generator' ? { 'purchase-order-generator': purchaseOrderGeneratorCopies[key] } : {}),
    ...(tool.id === 'eigenvalue-calculator' ? { 'eigenvalue-calculator': eigenvalueCalculatorCopies[key] } : {}),
    ...(tool.id === 'bond-calculator' ? { 'bond-calculator': bondCalculatorCopies[key] } : {}),
    ...(tool.id === 'pension-calculator' ? { 'pension-calculator': pensionCalculatorCopies[key] } : {}),
    ...(tool.id === 'lifetime-value-calculator' ? { 'lifetime-value-calculator': lifetimeValueCalculatorCopies[key] } : {}),
    ...(tool.id === 'waist-to-hip-ratio-calculator' ? { 'waist-to-hip-ratio-calculator': waistToHipRatioCopies[key] } : {}),
  }]));
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, copies), true);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    const copy = copies[key][tool.id];
    assert.equal(copy.localizationStatus, 'machine-accepted', key);
    assert.equal(copy.localizationAcceptedBy, 'site-owner', key);
    assert.match(copy.localizationAcceptedAt, /^\d{4}-\d{2}-\d{2}$/u, key);
    assert.equal(copy.copyLanguage, key, key);
    assert.notEqual(copy.intro, copies.en[tool.id].intro, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
  }
}

test('waist-to-hip ratio copy is localized in all 36 routes and keeps its health-scope disclaimer', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'waist-to-hip-ratio-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  assert.equal(localeEntries.length, 36);
  for (const { key } of localeEntries) {
    const copy = waistToHipRatioCopies[key];
    assert.equal(copy.additionalFaqs.length, 2, key);
    assert.ok(copy.fields.waist && copy.fields.hip && copy.fields.accuracyNote && copy.fields.formulaNote, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
    assert.ok(copy.additionalFaqs.every(({ question, answer }) => question && answer), key);
  }
});

test('bond calculator has 36 static locales, bounded metadata and clear Arabic control labels', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'bond-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 4, key);
    assert.ok(copy.fields.mode && copy.fields.frequency && copy.fields.accuracyNote, key);
    assert.ok([...copy.title].length <= 60 && [...copy.description].length <= 160, key);
  }
  assert.equal(bondCalculatorCopies.ar.actions.reset, 'إعادة الضبط');
  assert.equal(bondCalculatorCopies.ar.fields.frequency, 'تكرار دفع القسيمة سنويًا');
  assert.equal(new Set(bondCalculatorCopies.ar.additionalFaqs.map(({ question }) => question)).size, 4);
  assert.match(bondCalculatorCopies.ar.additionalFaqs[0].question, /قيمته الاسمية/u);
});

test('logic grid puzzle has complete static translations and four distinct localized categories in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'logic-grid-puzzle');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    const categories = copy.fields.categoryGroups;
    assert.equal(categories.length, 4, key);
    for (const category of categories) {
      assert.ok(category.name.trim(), `${key}: category name`);
      assert.equal(category.values.length, 4, `${key}: four values`);
      assert.equal(new Set(category.values.map((value) => value.trim().toLowerCase())).size, 4, `${key}: distinct values`);
    }
    assert.equal(copy.additionalFaqs.length, 2, key);
    assert.ok(copy.messages.hintSame.includes('{left}') && copy.messages.hintSame.includes('{right}'), `${key}: hint placeholders`);
    assert.ok(copy.title.toLowerCase().includes(copy.name.toLowerCase()), `${key}: title retains localized tool name`);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: bounded metadata`);
  }
  assert.equal(logicGridPuzzleCopies.ar.fields.unmarked, 'غير محدد');
  assert.equal(logicGridPuzzleCopies.ar.actions.hard, 'صعب');
  assert.equal(logicGridPuzzleCopies.ar.messages.unmarked, 'تمت إزالة العلامة.');
  assert.equal(logicGridPuzzleCopies.en.fields.categoryGroups[0].name, 'People');
});

test('Markdown editor has static translations, safe-preview copy and accurate metadata for all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'markdown-editor');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = markdownEditorCopies[key];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.editor && copy.fields.preview && copy.fields.autosave, key);
    assert.ok(copy.actions.showPreview && copy.actions.hidePreview && copy.actions.download, key);
    assert.ok(copy.messages.previewFailed && copy.messages.tooLong, key);
    assert.ok(copy.title.toLowerCase().includes(copy.name.toLowerCase()), `${key}: title retains localized name`);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: bounded metadata`);
  }
});

test('Purchase Order Generator has static translations and valid example syntax in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'purchase-order-generator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = purchaseOrderGeneratorCopies[key];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.items && copy.fields.itemsHint && copy.fields.currencyHint, key);
    assert.ok(copy.actions.generate && copy.actions.downloadCsv && copy.actions.print, key);
    assert.ok(copy.messages.invalid && copy.messages.downloadFailed, key);
    assert.ok(copy.title.toLowerCase().includes(copy.name.toLowerCase()), `${key}: title retains localized name`);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: bounded metadata`);
    assert.equal(copy.example.values.length, 2, key);
    for (const line of copy.example.values) assert.equal((line.match(/\|/gu) ?? []).length, 2, `${key}: stable line-item syntax`);
  }
});

test('Eigenvalue Calculator has static translated copy and explicit numeric scope in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'eigenvalue-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = eigenvalueCalculatorCopies[key];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.matrix && copy.fields.matrixHint && copy.fields.accuracyNote, key);
    assert.ok(copy.messages.notSymmetric && copy.messages.invalidSize && copy.messages.didNotConverge, key);
    assert.ok(copy.actions.calculate && copy.actions.copy && copy.actions.example, key);
    assert.ok(copy.title.includes('UsefulVerse'), key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
  }
  assert.match(eigenvalueCalculatorCopies.ar.fields.resultSummary, /القيم والمتجهات الذاتية/u);
});

test('HAR viewer has complete static translations, privacy warnings and preserved HAR fixtures in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'har-viewer');
  assert.ok(tool);
  assert.equal(localeEntries.length, 36);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  const english = localizedCopies.en[tool.id];
  assert.equal(english.additionalFaqs.length, 3);
  assert.match(english.fields.privacyWarning, /never uploads/u);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.equal(copy.exampleHar, english.exampleHar, `${key}: HAR fixture remains valid JSON`);
    assert.ok(copy.fields.privacyWarning.length > 80, `${key}: privacy caveat stays clear`);
    assert.match(copy.title, /UsefulVerse/u, `${key}: brand retained`);
  }
});

test('robots tester has 36 static translations, local-only scope and safe snippet metadata', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'robots-txt-tester');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.equal(copy.exampleRobots, localizedCopies.en[tool.id].exampleRobots, `${key}: sample rules remain executable`);
    assert.match(copy.fields.scopeNote, /robots\.txt/u, `${key}: product protocol remains recognizable`);
    assert.ok(copy.messages.tooComplex, `${key}: bounded-work message`);
  }
});

test('JSON to Excel has 36 static translations, preserves its executable example and local-only disclosures', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'json-to-excel');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.equal(copy.exampleJson, localizedCopies.en[tool.id].exampleJson, `${key}: JSON fixture remains valid and unchanged`);
    assert.match(copy.title, /UsefulVerse/u, `${key}: brand retained`);
    assert.ok(copy.fields.privacyNote.length > 30, `${key}: local processing disclosed`);
  }
});

test('binary Base64 tool has 36 static translations and keeps its size/MIME safety disclosures', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'binary-base64-tool');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 30, `${key}: MIME is not verified`);
    assert.ok(copy.fields.fileHint.length > 20, `${key}: local 2 MiB limit disclosed`);
    assert.ok(copy.actions.copy && copy.actions.download, key);
  }
});

test('JSON model generator has 36 static translations and keeps language, scope and compiler-claim disclosures', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'json-model-generator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 40, `${key}: inference, not compiler verification`);
    assert.ok(copy.fields.privacyNote.length > 20, `${key}: local-only disclosure`);
    assert.ok(copy.actions.generate && copy.actions.download, key);
  }
});

test('CSV editor has 36 static translations with its limits, local-data promise, history and encoding scope', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'csv-editor');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 45, `${key}: limits and UTF-8 scope disclosed`);
    assert.ok(copy.fields.privacyNote.length > 20, `${key}: no autosave disclosure`);
    assert.ok(copy.actions.load && copy.actions.undo && copy.actions.redo && copy.actions.export, key);
  }
});

test('CSV editor has 36 static translations and keeps data-locality, limits, undo and encoding disclosures', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'csv-editor');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 45, `${key}: limits and UTF-8 scope disclosed`);
    assert.ok(copy.fields.privacyNote.length > 20, `${key}: no autosave disclosure`);
    assert.ok(copy.actions.load && copy.actions.undo && copy.actions.redo && copy.actions.export, key);
  }
});

test('pH calculator has 36 static translations with its equilibrium and 25 °C assumptions stated', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'ph-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 60, `${key}: model limitations disclosed`);
    assert.ok(copy.fields.strongAcid && copy.fields.weakAcid && copy.messages.hydrogen, key);
    assert.equal(copy.messages.pH, 'pH', `${key}: universal pH notation`);
    assert.equal(copy.messages.pOH, 'pOH', `${key}: universal pOH notation`);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: metadata limits`);
  }
});

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

test('growth release gate accepts machine translation only with explicit owner acceptance metadata', () => {
  const accepted = {
    ...sample('es'),
    localizationStatus: 'machine-accepted',
    localizationAcceptedBy: 'site-owner',
    localizationAcceptedAt: '2026-10-08',
  };
  assert.equal(assertGrowthLocaleCoverage([{ id: 'one' }], [{ key: 'es' }], { es: { _home: sampleHome('es'), one: accepted } }), true);
  assert.throws(() => assertGrowthLocaleCoverage([{ id: 'one' }], [{ key: 'es' }], {
    es: { _home: sampleHome('es'), one: { ...accepted, localizationAcceptedAt: '' } },
  }), /localization is not approved for release/);
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
  assertMachineAcceptedGrowthToolInAllLocales(upscaler);
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

test('color name finder has complete English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'color-name-finder');
  const english = englishGrowthCopy[tool.id];
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('photo-to-sketch has complete machine-accepted translations across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'photo-to-sketch');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  assert.match(english.fields.accuracyNote, /8 megapixels/u);
  assert.equal(english.additionalFaqs.length, 2);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('schema markup validator has complete English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'schema-markup-validator');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  assert.match(english.fields.accuracyNote, /remote @context/iu);
  assert.match(english.fields.googleNote, /Rich Results Test/u);
  assert.equal(english.additionalFaqs.length, 2);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('readability-checker has complete machine-accepted localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'readability-checker');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  assert.equal(english.additionalFaqs.length, 2);
  assert.match(english.fields.accuracyNote, /syllable counts use language-specific heuristics/iu);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('savings-goal-calculator has complete machine-accepted translations across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'savings-goal-calculator');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.equal(english.additionalFaqs.length, 2);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('severance-pay-calculator has complete machine-accepted translations across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'severance-pay-calculator');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.equal(english.additionalFaqs.length, 2);
  assert.match(english.fields.ukNote, /£751/u);
  assert.match(english.fields.ukNote, /6 April 2026/u);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('divisibility calculator has valid English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'divisibility-calculator');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.equal(english.additionalFaqs.length, 2);
  assert.match(english.fields.accuracyNote, /30 different positive divisors/u);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('number line generator has valid English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'number-line-graphing-tool');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.equal(english.additionalFaqs.length, 2);
  assert.match(english.fields.accuracyNote, /20 rows/u);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('laplace-transform-calculator has complete machine-accepted translations across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'laplace-transform-calculator');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.equal(english.additionalFaqs.length, 2);
  assert.match(english.fields.accuracyNote, /not a general computer algebra system/u);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('vector-calculator has complete machine-accepted translations across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'vector-calculator');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.equal(english.additionalFaqs.length, 2);
  assert.match(english.fields.accuracyNote, /compatible units/u);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('cubic-quartic-equation-calculator has complete machine-accepted translations across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'cubic-quartic-equation-calculator');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.equal(english.additionalFaqs.length, 2);
  assert.match(english.fields.accuracyNote, /Real roots only/u);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('complex-number calculator has complete machine-accepted copy in all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'complex-number-calculator');
  assert.ok(tool);
  const english = englishGrowthCopy[tool.id];
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: { _home: englishGrowthCopy._home, [tool.id]: english } }), true);
  assert.equal(english.additionalFaqs.length, 2);
  assert.match(english.fields.accuracyNote, /degrees 2–12/u);
  assert.ok(english.title.length <= 60 && english.description.length <= 160);
  for (const { key } of localeEntries.filter(({ key }) => key !== 'en')) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.localizationStatus, 'machine-accepted', key);
    assert.equal(assertGrowthLocaleCoverage([tool], [{ key }], { [key]: { _home: localizedCopies[key]._home, [tool.id]: copy } }), true);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
    if (key === 'es') {
      assert.equal(copy.fields.degrees, 'Grados');
      assert.equal(copy.actions.reset, 'Borrar');
    }
  }
});

test('HELOC calculator has complete localized copy, visible assumptions and metadata in all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'heloc-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
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
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.copyLanguage, key);
    assert.match(copy.title, /[|｜]\s*UsefulVerse$/u, `${key}: brand suffix must remain unchanged`);
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

test('RTF Converter has machine-accepted complete copy in all 36 locales and stays within SEO metadata budgets', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'rtf-converter');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.fields.file.trim().length > 0, true, key);
    assert.equal(copy.fields.limitNote.trim().length > 0, true, key);
    assert.equal(copy.actions.print.trim().length > 0, true, key);
    assert.equal(copy.additionalFaqs.length, 3, key);
  }
});

test('CSV to PDF has machine-accepted complete copy in all 36 locales and stays within SEO metadata budgets', () => {
  for (const [locale, copy] of Object.entries(localizedCopies)) {
    const csv = copy['csv-to-pdf'];
    assert.equal(csv.copyLanguage, locale);
    assert.equal(csv.localizationStatus, locale === 'en' ? 'approved' : 'machine-accepted');
    if (locale !== 'en') assert.equal(csv.localizationAcceptedBy, 'site-owner');
    assert.match(csv.title, /\| UsefulVerse$/u);
    assert.ok(csv.title.length <= 60, `${locale} title exceeds 60 characters`);
    assert.ok(csv.description.length <= 160, `${locale} description exceeds 160 characters`);
    for (const key of ['file', 'separator', 'encoding', 'hasHeader', 'pageSize', 'orientation', 'margin', 'accuracyNote', 'limitNote', 'resultCount', 'columnCount', 'previewLimit', 'tableLabel']) assert.ok(csv.fields[key]?.trim(), `${locale} missing ${key}`);
    for (const key of ['preview', 'reset', 'example', 'print', 'result']) assert.ok(csv.actions[key]?.trim(), `${locale} missing action ${key}`);
    assert.equal(csv.additionalFaqs.length, 3);
  }
});

test('Slitherlink puzzle has static machine-accepted copy and preserved brand titles in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'slitherlink');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const [locale, catalog] of Object.entries(localizedCopies)) {
    const copy = catalog.slitherlink;
    assert.match(copy.title, /\| UsefulVerse$/u, `${locale}: keep exact brand suffix`);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${locale}: metadata budget`);
    assert.equal(copy.additionalFaqs.length, 3, `${locale}: localized FAQ count`);
    for (const key of ['size', 'board', 'rules', 'accuracyNote', 'row', 'column', 'horizontal', 'vertical']) assert.ok(copy.fields[key]?.trim(), `${locale}: missing ${key}`);
    for (const key of ['newGame', 'checkBoard', 'hint', 'undo', 'clearMarks', 'rules']) assert.ok(copy.actions[key]?.trim(), `${locale}: missing ${key}`);
  }
  assert.equal(localizedCopies.es.slitherlink.title, 'Slitherlink gratis | UsefulVerse');
  assert.equal(localizedCopies.es.slitherlink.actions.checkBoard, 'Comprobar tablero');
  assert.equal(localizedCopies.ar.slitherlink.title, 'Slitherlink مجاني | UsefulVerse');
  assert.equal(localizedCopies.ar.slitherlink.actions.checkBoard, 'تحقق من الحل');
});

test('Peg solitaire has complete static copy, localized controls and safe metadata in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'peg-solitaire');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const [locale, catalog] of Object.entries(localizedCopies)) {
    const copy = catalog['peg-solitaire'];
    assert.equal(copy.copyLanguage, locale);
    assert.match(copy.title, /\| UsefulVerse$/u);
    assert.ok(copy.title.length <= 60, `${locale}: title limit`);
    assert.ok(copy.description.length <= 160, `${locale}: description limit`);
    assert.equal(copy.additionalFaqs.length, 3, `${locale}: FAQ count`);
    for (const key of ['board', 'rules', 'accuracyNote', 'hole', 'row', 'column', 'peg', 'empty']) assert.ok(copy.fields[key]?.trim(), `${locale}: missing ${key}`);
    for (const key of ['newGame', 'hint', 'undo', 'rules', 'pegsRemaining']) assert.ok(copy.actions[key]?.trim(), `${locale}: missing action ${key}`);
  }
  assert.equal(localizedCopies.es['peg-solitaire'].title, 'Solitario de clavijas gratis | UsefulVerse');
  assert.equal(localizedCopies.es['peg-solitaire'].actions.newGame, 'Nueva partida');
  assert.match(localizedCopies.es['peg-solitaire'].howAnswer, /una sola clavija/u);
  assert.doesNotMatch(JSON.stringify(localizedCopies.es['peg-solitaire'].additionalFaqs), /solitario peg/u);
  assert.notEqual(localizedCopies.ar['peg-solitaire'].fields.board, 'English peg solitaire board');
  assert.equal(localizedCopies.ar['peg-solitaire'].fields.peg, 'وتد');
  assert.match(localizedCopies.ar['peg-solitaire'].messages.won, /وتد واحد/u);
  assert.doesNotMatch(JSON.stringify(localizedCopies.ar['peg-solitaire']), /ربط/u);
});

test('Round Robin has machine-accepted complete copy in all 36 locales and stays within SEO metadata budgets', () => {
  for (const [locale, copy] of Object.entries(localizedCopies)) {
    const league = copy['round-robin-tournament-generator'];
    assert.equal(league.copyLanguage, locale);
    assert.equal(league.localizationStatus, locale === 'en' ? 'approved' : 'machine-accepted');
    if (locale !== 'en') assert.equal(league.localizationAcceptedBy, 'site-owner');
    assert.match(league.title, /\| UsefulVerse$/u);
    assert.ok(league.title.length <= 60, `${locale} title exceeds 60 characters`);
    assert.ok(league.description.length <= 160, `${locale} description exceeds 160 characters`);
    for (const key of ['participants', 'participantsHint', 'doubleRound', 'shuffle', 'scoringNote', 'limitNote', 'standingsLabel', 'rank', 'team', 'played', 'wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points', 'round', 'leg', 'home', 'away', 'bye', 'homeScore', 'awayScore', 'fixtureTableLabel']) assert.ok(league.fields[key]?.trim(), `${locale} missing ${key}`);
    for (const key of ['generate', 'reset', 'example', 'downloadCsv', 'print', 'result']) assert.ok(league.actions[key]?.trim(), `${locale} missing ${key}`);
    assert.equal(league.additionalFaqs.length, 3);
  }
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
  assertMachineAcceptedGrowthToolInAllLocales(tool);
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

test('carpet calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'carpet-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('aquarium calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'aquarium-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('grass seed calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'grass-seed-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('insulation calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'insulation-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('wall framing calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'wall-framing-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('electricity cost calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'electricity-cost-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('compost calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'compost-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('pond volume calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'pond-volume-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('fertilizer calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'fertilizer-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('baluster spacing calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'baluster-spacing-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('retaining wall calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'retaining-wall-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('battery runtime calculator has a complete English source but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'battery-runtime-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('lumber cut optimizer has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'lumber-cut-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('plant spacing calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'plant-spacing-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('EV charging calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'ev-charging-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('rainwater harvesting calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'rainwater-harvesting-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('ramp calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'ramp-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('heat loss calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'heat-loss-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('heat pump calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'heat-pump-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('miter angle calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'miter-angle-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('voltage drop calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'voltage-drop-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('molarity calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'molarity-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('dilution calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'dilution-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('Ohm’s law calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'ohms-law-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('transformer calculator has complete static copy and machine-accepted localization in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'transformer-calculator');
  assert.ok(tool);
  assert.equal(transformerCopies.en.name, transformerCalculatorEnglishCopy.name);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('stoichiometry calculator has complete static copy and machine-accepted localization in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'stoichiometry-calculator');
  assert.ok(tool);
  assert.equal(stoichiometryCopies.en.name, stoichiometryCalculatorEnglishCopy.name);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const locale of localeEntries) {
    const copy = stoichiometryCopies[locale.key];
    assert.ok(copy.fields.equation && copy.fields.reactantAmounts && copy.fields.accuracyNote, locale.key);
    assert.ok(copy.messages.limitingReactants && copy.messages.percentYield, locale.key);
    assert.ok([...copy.title].length <= 60, locale.key);
    assert.ok([...copy.description].length <= 160, locale.key);
  }
  assert.match(stoichiometryCopies.ar.fields.equation, /التفاعل/u);
});

test('pressure calculator has complete static copy and machine-assisted localization in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'pressure-calculator');
  assert.ok(tool);
  assert.equal(pressureCalculatorCopies.en.name, pressureCalculatorEnglishCopy.name);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const locale of localeEntries) {
    const copy = pressureCalculatorCopies[locale.key];
    assert.ok(copy.fields.mode && copy.fields.accuracyNote && copy.fields.density, locale.key);
    assert.ok(copy.messages.pressure && copy.messages.pressurePascals, locale.key);
    assert.ok([...copy.title].length <= 60, locale.key);
    assert.ok([...copy.description].length <= 160, locale.key);
  }
  assert.match(pressureCalculatorCopies.ar.fields.mode, /الحساب/u);
});

test('PCB trace width calculator has complete static copy and machine-accepted localization in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'pcb-trace-width-calculator');
  assert.ok(tool);
  assert.equal(pcbTraceWidthCopies.en.name, pcbTraceWidthCalculatorEnglishCopy.name);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const locale of localeEntries) {
    const copy = pcbTraceWidthCopies[locale.key];
    assert.ok(copy.fields.mode && copy.fields.copperWeight && copy.fields.accuracyNote, locale.key);
    assert.ok(copy.fields.formulaNote && copy.fields.sourceLink && copy.fields.resultWidth, locale.key);
    assert.ok(copy.messages.calculated && copy.messages.checkInputs, locale.key);
    assert.ok([...copy.title].length <= 60, locale.key);
    assert.ok([...copy.description].length <= 160, locale.key);
  }
  assert.match(pcbTraceWidthCopies.ar.fields.accuracyNote, /IPC-2221/u);
});

test('projectile motion calculator has complete static copy and machine-accepted localization in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'projectile-motion-calculator');
  assert.ok(tool);
  assert.equal(projectileMotionCopies.en.name, projectileMotionCalculatorEnglishCopy.name);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const locale of localeEntries) {
    const copy = projectileMotionCopies[locale.key];
    assert.ok(copy.fields.speed && copy.fields.angleDegrees && copy.fields.initialHeight && copy.fields.plotDescription, locale.key);
    assert.ok(copy.actions.playTrajectory && copy.actions.resetAnimation, locale.key);
    assert.ok(copy.messages.time && copy.messages.range && copy.messages.impactSpeed, locale.key);
    assert.ok([...copy.title].length <= 60, locale.key);
    assert.ok([...copy.description].length <= 160, locale.key);
  }
  assert.match(projectileMotionCopies.ar.fields.accuracyNote, /مقاومة هواء/u);
});

test('pulley calculator has complete static copy and machine-accepted localization in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'pulley-calculator');
  assert.ok(tool);
  assert.equal(pulleyCalculatorCopies.en.name, pulleyCalculatorEnglishCopy.name);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const locale of localeEntries) {
    const copy = pulleyCalculatorCopies[locale.key];
    assert.ok(copy.fields.driverDiameter && copy.fields.drivenDiameter && copy.fields.accuracyNote, locale.key);
    assert.ok(copy.actions.calculate && copy.messages.beltLength && copy.messages.outputRpm, locale.key);
    assert.ok([...copy.title].length <= 60, locale.key);
    assert.ok([...copy.description].length <= 160, locale.key);
  }
  assert.match(pulleyCalculatorCopies.ar.fields.accuracyNote, /الأبعاد/u);
});

test('RLC calculator has complete static copy and machine-accepted localization in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'rlc-circuit-calculator');
  assert.ok(tool);
  assert.equal(rlcCircuitCalculatorCopies.en.name, rlcCircuitCalculatorEnglishCopy.name);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const locale of localeEntries) {
    const copy = rlcCircuitCalculatorCopies[locale.key];
    assert.ok(copy.fields.topology && copy.fields.resistance && copy.fields.inductance && copy.fields.capacitance, locale.key);
    assert.ok(copy.actions.calculate && copy.messages.resonance && copy.messages.impedanceMagnitudePhase, locale.key);
    assert.equal(copy.additionalFaqs.length, 5, locale.key);
    assert.ok([...copy.title].length <= 60, locale.key);
    assert.ok([...copy.description].length <= 160, locale.key);
  }
  assert.match(rlcCircuitCalculatorCopies.ar.fields.accuracyNote, /مركّز/u);
});

test('antenna length calculator has complete static, bounded copy across all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'antenna-length-calculator');
  assert.ok(tool);
  assert.equal(antennaLengthCalculatorCopies.en.name, antennaLengthCalculatorEnglishCopy.name);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const locale of localeEntries) {
    const copy = antennaLengthCalculatorCopies[locale.key];
    assert.ok(copy.fields.mode && copy.fields.frequency && copy.fields.shorteningFactor && copy.fields.accuracyNote, locale.key);
    assert.ok(copy.actions.calculate && copy.messages.wavelength && copy.messages.adjustedLength && copy.messages.elementLength, locale.key);
    assert.equal(copy.additionalFaqs.length, 4, locale.key);
    assert.ok([...copy.title].length <= 60, locale.key);
    assert.ok([...copy.description].length <= 160, locale.key);
  }
  assert.match(antennaLengthCalculatorCopies.ar.fields.accuracyNote, /موصل/u);
});

test('effective interest rate calculator has static copy, guarded formulas and all 36 localized variants', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'effective-interest-rate-calculator');
  assert.ok(tool);
  assert.equal(localeEntries.length, 36);
  assert.equal(effectiveInterestRateCalculatorCopies.en.name, effectiveInterestRateCalculatorEnglishCopy.name);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.ok(copy.fields.mode && copy.fields.rate && copy.fields.frequency && copy.fields.monthly && copy.fields.accuracyNote, key);
    assert.ok(copy.actions.calculate && copy.messages.apr && copy.messages.apy && copy.messages.periodicRate && copy.messages.formula, key);
    assert.equal(copy.additionalFaqs.length, key === 'en' ? 2 : 1, key);
    assert.ok([...copy.title].length <= 60, `${key}: title limit`);
    assert.ok([...copy.description].length <= 160, `${key}: description limit`);
    assert.doesNotMatch(JSON.stringify(copy), /undefined/iu, key);
  }
  assert.match(effectiveInterestRateCalculatorCopies.es.fields.accuracyNote, /asesoramiento financiero/u);
  assert.match(effectiveInterestRateCalculatorCopies.ar.privacyAnswer, /لا/u);
});

test('chemical equation balancer has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'chemical-equation-balancer');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('gear ratio calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'gear-ratio-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('density calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'density-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('compression ratio calculator has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'compression-ratio-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('goal planner has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'goal-planner');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('mind map maker has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'mind-map-maker');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('mood tracker has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'mood-tracker');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('online journal has complete English copy but has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'journal-online');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('travel itinerary planner has complete English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'travel-itinerary-planner');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('polynomial long-division calculator has English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'polynomial-long-division-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('half-life calculator has complete English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'half-life-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('mortgage-points calculator has complete English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'mortgage-points-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('trapezoid calculator has complete English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'trapezoid-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('prayer times calculator has complete English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'prayer-times-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('Hitori has complete English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'hitori');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('Nurikabe has complete English copy and has approved localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'nurikabe');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('kinetic energy calculator has complete English copy and localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'kinetic-energy-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('momentum calculator has static copy and collision assumptions across all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'momentum-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = momentumCopies[key];
    assert.equal(copy.additionalFaqs.length, 4, key);
    assert.ok(copy.fields.accuracyNote.length > 80, `${key}: one-dimensional and collision limits disclosed`);
    assert.ok(copy.fields.mass1 && copy.fields.velocity1 && copy.fields.restitution && copy.messages.momentumAfter, key);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, key);
  }
});

test('resistor color code calculator has complete English copy and localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'resistor-color-code-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('acceleration calculator has complete English copy and localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'acceleration-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('force calculator has complete English copy and localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'force-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('friction calculator has localized copy across all 36 languages and the Arabic heat-pump action is clear', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'friction-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  assert.equal(localizedCopies.ar['heat-pump-calculator'].actions.copy, 'نسخ التقدير');
  assert.match(localizedCopies.ar['friction-calculator'].fields.normalForce, /القوة العمودية/u);
  assert.match(localizedCopies.ru['friction-calculator'].howAnswer, /μs × normal force|μs × нормальная сила/u);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 40, `${key}: physics boundary`);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: metadata limits`);
  }
});

test('horsepower calculator has complete English copy and localized copy across all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'horsepower-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
});

test('Roth vs traditional calculator has complete locale copy, bounded metadata and clear tax disclaimers in all 36 languages', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'roth-vs-traditional-calculator');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], [{ key: 'en' }], { en: englishGrowthCopy }), true);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.equal(copy.additionalFaqs.length, 3, key);
    assert.ok(copy.fields.accuracyNote.length > 40, `${key}: disclaimer`);
    assert.ok(copy.fields.irsSource.length > 0, `${key}: official IRS link label`);
    assert.doesNotMatch(JSON.stringify(copy), /UVROTHIRA\d+X\d+END|undefined/iu, key);
  }
});

test('repeating decimal calculator preserves the period-and-parentheses notation in every locale', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'repeating-decimal-to-fraction');
  assert.ok(tool);
  assert.equal(assertGrowthLocaleCoverage([tool], localeEntries, localizedCopies), true);
  for (const { key } of localeEntries) {
    const copy = localizedCopies[key][tool.id];
    assert.ok(copy.title.length <= 60, `${key}: title limit`);
    assert.ok(copy.description.length <= 160, `${key}: description limit`);
    assert.match(copy.fields.inputHint, /0\.\(3\).*0\.1\(6\).*1\.2\(34\)/u, `${key}: exact notation`);
    assert.match(copy.fields.accuracyNote, /1.*18|18.*1/u, `${key}: repeating period guidance`);
  }
});

test('stock profit calculator has complete static copy in all 36 locales with bounded metadata', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'stock-profit-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = key === 'en' ? stockProfitCalculatorEnglishCopy : stockProfitCalculatorCopies[key];
    assert.equal(copy.copyLanguage, key, `${key}: copy language`);
    assert.equal(copy.additionalFaqs.length, 4, `${key}: FAQs`);
    assert.ok(copy.title.length <= 60 && copy.description.length <= 160, `${key}: SEO metadata limits`);
    assert.match(copy.title, /\| UsefulVerse$/u, `${key}: one brand suffix at the end`);
    assert.equal((copy.title.match(/UsefulVerse/gu) ?? []).length, 1, `${key}: no duplicate brand suffix`);
    if (key !== 'en') {
      assert.notEqual(copy.intro, stockProfitCalculatorEnglishCopy.intro, `${key}: translated introduction`);
      assert.notEqual(copy.privacyAnswer, stockProfitCalculatorEnglishCopy.privacyAnswer, `${key}: translated privacy answer`);
    }
    assert.doesNotMatch(JSON.stringify(copy), /UVBRANDTOKENX|यूवीब्रांडटोकनएक्स|undefined/iu, `${key}: leaked translation placeholder`);
    for (const action of Object.values(copy.actions)) assert.ok(action.trim().length > 1, `${key}: action label`);
  }
});

test('pension calculator has static localized copy and guarded pension-specific claims', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'pension-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = pensionCalculatorCopies[key];
    assert.equal(copy.copyLanguage, key, `${key}: copy language`);
    assert.equal(copy.additionalFaqs.length, 4, `${key}: FAQs`);
    assert.ok(Array.from(copy.title).length <= 60 && Array.from(copy.description).length <= 160, `${key}: SEO metadata limits`);
    assert.match(copy.title, /\| UsefulVerse$/u, `${key}: brand suffix`);
    assert.doesNotMatch(JSON.stringify(copy), /UVBRANDTOKENX|undefined/iu, `${key}: translation placeholder`);
    for (const action of Object.values(copy.actions)) assert.ok(action.trim().length > 1, `${key}: action`);
    if (key !== 'en') assert.notEqual(copy.intro, pensionCalculatorEnglishCopy.intro, `${key}: translated introduction`);
  }
  assert.match(pensionCalculatorEnglishCopy.fields.accuracyNote, /not a pension entitlement/u);
});

test('customer lifetime value calculator has static bounded copy in all 36 locales', () => {
  const tool = allGrowthPilotTools.find(({ id }) => id === 'lifetime-value-calculator');
  assert.ok(tool);
  assertMachineAcceptedGrowthToolInAllLocales(tool);
  for (const { key } of localeEntries) {
    const copy = lifetimeValueCalculatorCopies[key];
    assert.equal(copy.copyLanguage, key, `${key}: copy language`);
    assert.equal(copy.additionalFaqs.length, 2, `${key}: FAQs`);
    assert.ok(Array.from(copy.title).length <= 60 && Array.from(copy.description).length <= 160, `${key}: SEO metadata limits`);
    assert.match(copy.title, /\| UsefulVerse$/u, `${key}: brand suffix`);
    assert.doesNotMatch(JSON.stringify(copy), /UVBRANDTOKENX|undefined/iu, `${key}: translation placeholder`);
    for (const action of Object.values(copy.actions)) assert.ok(action.trim().length > 1, `${key}: action`);
    if (key !== 'en') assert.notEqual(copy.intro, lifetimeValueCalculatorEnglishCopy.intro, `${key}: translated introduction`);
  }
  assert.match(lifetimeValueCalculatorEnglishCopy.fields.accuracyNote, /not a business forecast/u);
});
