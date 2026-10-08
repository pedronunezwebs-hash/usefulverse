import tireSizeCopies from './tire-size-calculator.mjs';
import stairCopies from './stair-calculator.mjs';
import asphaltCopies from './asphalt-calculator.mjs';
import soilCopies from './soil-calculator.mjs';
import { soilEnglishCopy } from './soil-calculator.en.mjs';
import poolCopies from './pool-volume-calculator.mjs';
import { poolVolumeCalculatorEnglishCopy } from './pool-volume-calculator.en.mjs';
import roofCopies from './roof-pitch-calculator.mjs';
import { roofPitchCalculatorEnglishCopy } from './roof-pitch-calculator.en.mjs';
import { registerGrowthLocaleExtension } from '../locale-utils.mjs';
import drywallCopies from './drywall-calculator.mjs';
import { drywallEnglishCopy } from './drywall-calculator.en.mjs';
import roofingCopies from './roofing-calculator.mjs';
import { roofingCalculatorEnglishCopy } from './roofing-calculator.en.mjs';
import deckCopies from './deck-calculator.mjs';
import { deckCalculatorEnglishCopy } from './deck-calculator.en.mjs';
import fenceCopies from './fence-calculator.mjs';
import { fenceCalculatorEnglishCopy } from './fence-calculator.en.mjs';
import poolSaltTranslations from './pool-salt-calculator-final.mjs';
import { poolSaltCalculatorEnglishCopy } from './pool-salt-calculator.en.mjs';
import wallpaperCopies from './wallpaper-calculator-final.mjs';
import { wallpaperCalculatorEnglishCopy } from './wallpaper-calculator.en.mjs';
import imageRegionRedactorCopies from './image-region-redactor-final.mjs';
import { imageRegionRedactorEnglishCopy } from './image-region-redactor.en.mjs';
import imageSharpenerCopies from './image-sharpener-final.mjs';
import { imageSharpenerEnglishCopy } from './image-sharpener.en.mjs';
import imageUpscalerDrafts from './image-upscaler-final.mjs';
import { imageUpscalerEnglishCopy } from './image-upscaler.en.mjs';
import imageColorPickerCopies from './image-color-picker-final.mjs';
import { imageColorPickerEnglishCopy } from './image-color-picker.en.mjs';
import dominoesCopies from './dominoes-game-final.mjs';
import hitoriCopies from './hitori-final.mjs';
import { hitoriEnglishCopy } from './hitori.en.mjs';
import weightLossCopies from './weight-loss-calculator-final.mjs';
import helocCopies from './heloc-calculator-final.mjs';
import { helocCalculatorEnglishCopy } from './heloc-calculator.en.mjs';
import randomTeamGeneratorCopies from './random-team-generator-final.mjs';
import { randomTeamGeneratorEnglishCopy } from './random-team-generator.en.mjs';
import mulchCopies from './mulch-calculator-final.mjs';
import { mulchCalculatorEnglishCopy } from './mulch-calculator.en.mjs';
import paverCopies from './paver-calculator-final.mjs';
import { paverCalculatorEnglishCopy } from './paver-calculator.en.mjs';
import solarCopies from './solar-panel-calculator-final.mjs';
import { solarPanelCalculatorEnglishCopy } from './solar-panel-calculator.en.mjs';
import btuCopies from './btu-calculator-final.mjs';
import { btuCalculatorEnglishCopy } from './btu-calculator.en.mjs';
import brickCopies from './brick-calculator-final.mjs';
import { brickCalculatorEnglishCopy } from './brick-calculator.en.mjs';
import rafterCopies from './rafter-calculator-final.mjs';
import { rafterCalculatorEnglishCopy } from './rafter-calculator.en.mjs';
import carpetCopies from './carpet-calculator-final.mjs';
import { carpetCalculatorEnglishCopy } from './carpet-calculator.en.mjs';
import aquariumCopies from './aquarium-calculator-final.mjs';
import { aquariumCalculatorEnglishCopy } from './aquarium-calculator.en.mjs';
import grassSeedCopies from './grass-seed-calculator-final.mjs';
import { grassSeedCalculatorEnglishCopy } from './grass-seed-calculator.en.mjs';
import insulationCopies from './insulation-calculator-final.mjs';
import { insulationCalculatorEnglishCopy } from './insulation-calculator.en.mjs';
import wallFramingCopies from './wall-framing-calculator-final.mjs';
import { wallFramingCalculatorEnglishCopy } from './wall-framing-calculator.en.mjs';
import electricityCostCopies from './electricity-cost-calculator-final.mjs';
import { electricityCostCalculatorEnglishCopy } from './electricity-cost-calculator.en.mjs';
import compostCopies from './compost-calculator-final.mjs';
import { compostCalculatorEnglishCopy } from './compost-calculator.en.mjs';
import pondCopies from './pond-volume-calculator-final.mjs';
import { pondVolumeCalculatorEnglishCopy } from './pond-volume-calculator.en.mjs';
import fertilizerCopies from './fertilizer-calculator-final.mjs';
import { fertilizerCalculatorEnglishCopy } from './fertilizer-calculator.en.mjs';
import balusterCopies from './baluster-spacing-calculator-final.mjs';
import { balusterSpacingCalculatorEnglishCopy } from './baluster-spacing-calculator.en.mjs';
import retainingWallCopies from './retaining-wall-calculator-final.mjs';
import { retainingWallCalculatorEnglishCopy } from './retaining-wall-calculator.en.mjs';
import batteryRuntimeCopies from './battery-runtime-calculator-final.mjs';
import { batteryRuntimeCalculatorEnglishCopy } from './battery-runtime-calculator.en.mjs';
import lumberCutCopies from './lumber-cut-calculator-final.mjs';
import { lumberCutCalculatorEnglishCopy } from './lumber-cut-calculator.en.mjs';
import plantSpacingCopies from './plant-spacing-calculator-final.mjs';
import { plantSpacingCalculatorEnglishCopy } from './plant-spacing-calculator.en.mjs';
import evChargingCopies from './ev-charging-calculator-final.mjs';
import { evChargingCalculatorEnglishCopy } from './ev-charging-calculator.en.mjs';
import rainwaterHarvestingCopies from './rainwater-harvesting-calculator-final.mjs';
import { rainwaterHarvestingCalculatorEnglishCopy } from './rainwater-harvesting-calculator.en.mjs';
import rampCopies from './ramp-calculator-final.mjs';
import { rampCalculatorEnglishCopy } from './ramp-calculator.en.mjs';
import heatLossCopies from './heat-loss-calculator-final.mjs';
import { heatLossCalculatorEnglishCopy } from './heat-loss-calculator.en.mjs';
import heatPumpCopies from './heat-pump-calculator-final.mjs';
import { heatPumpCalculatorEnglishCopy } from './heat-pump-calculator.en.mjs';
import miterAngleCopies from './miter-angle-calculator-final.mjs';
import { miterAngleCalculatorEnglishCopy } from './miter-angle-calculator.en.mjs';
import voltageDropCopies from './voltage-drop-calculator-final.mjs';
import { voltageDropCalculatorEnglishCopy } from './voltage-drop-calculator.en.mjs';
import molarityCopies from './molarity-calculator-final.mjs';
import { molarityCalculatorEnglishCopy } from './molarity-calculator.en.mjs';
import dilutionCopies from './dilution-calculator-final.mjs';
import { dilutionCalculatorEnglishCopy } from './dilution-calculator.en.mjs';
import ohmsLawCopies from './ohms-law-calculator-final.mjs';
import { ohmsLawCalculatorEnglishCopy } from './ohms-law-calculator.en.mjs';
import chemicalEquationCopies from './chemical-equation-balancer-final.mjs';
import { chemicalEquationBalancerEnglishCopy } from './chemical-equation-balancer.en.mjs';
import gearRatioCopies from './gear-ratio-calculator-final.mjs';
import { gearRatioCalculatorEnglishCopy } from './gear-ratio-calculator.en.mjs';
import densityCopies from './density-calculator-final.mjs';
import { densityCalculatorEnglishCopy } from './density-calculator.en.mjs';
import compressionRatioCopies from './compression-ratio-calculator-final.mjs';
import { compressionRatioCalculatorEnglishCopy } from './compression-ratio-calculator.en.mjs';
import goalPlannerCopies from './goal-planner-final.mjs';
import { goalPlannerEnglishCopy } from './goal-planner.en.mjs';
import mindMapMakerCopies from './mind-map-maker-final.mjs';
import { mindMapMakerEnglishCopy } from './mind-map-maker.en.mjs';
import moodTrackerCopies from './mood-tracker-final.mjs';
import { moodTrackerEnglishCopy } from './mood-tracker.en.mjs';
import journalOnlineCopies from './journal-online-final.mjs';
import { journalOnlineEnglishCopy } from './journal-online.en.mjs';
import travelItineraryPlannerCopies from './travel-itinerary-planner-final.mjs';
import { travelItineraryPlannerEnglishCopy } from './travel-itinerary-planner.en.mjs';
import polynomialLongDivisionCopies from './polynomial-long-division-calculator-final.mjs';
import { polynomialLongDivisionCalculatorEnglishCopy } from './polynomial-long-division-calculator.en.mjs';
import halfLifeCalculatorCopies from './half-life-calculator-final.mjs';
import { halfLifeCalculatorEnglishCopy } from './half-life-calculator.en.mjs';
import mortgagePointsCalculatorCopies from './mortgage-points-calculator-final.mjs';
import { mortgagePointsCalculatorEnglishCopy } from './mortgage-points-calculator.en.mjs';
import trapezoidCalculatorCopies from './trapezoid-calculator-final.mjs';
import { trapezoidCalculatorEnglishCopy } from './trapezoid-calculator.en.mjs';
import prayerTimesCalculatorCopies from './prayer-times-calculator-final.mjs';
import { prayerTimesCalculatorEnglishCopy } from './prayer-times-calculator.en.mjs';

const poolSaltCopies = Object.freeze({
  ...poolSaltTranslations,
  es: Object.freeze({
    ...poolSaltTranslations.es,
    name: 'Calculadora de sal para piscinas',
    title: 'Calculadora de sal para piscina gratis | UsefulVerse',
    privacyAnswer: 'No. Esta estimación se calcula en tu navegador y no envía los datos de tu piscina a un servidor.',
  }),
  ar: Object.freeze({
    ...poolSaltTranslations.ar,
    actions: Object.freeze({
      ...poolSaltTranslations.ar.actions,
      kilograms: 'كيلوغرامات',
      pounds: 'أرطال',
    }),
    messages: Object.freeze({
      ...poolSaltTranslations.ar.messages,
      saltToAdd: 'كمية الملح المطلوبة وفقًا للنقاء المُدخل',
    }),
  }),
});

const wallpaperFreeLabels = Object.freeze({
  en: 'free', es: 'gratis', fr: 'gratuit', pt: 'grátis', de: 'kostenlos', ja: '無料', ko: '무료', id: 'gratis', hi: 'मुफ़्त', ar: 'مجاني',
  zh: '免费', bn: 'বিনামূল্যে', ru: 'бесплатно', ur: 'مفت', tr: 'ücretsiz', vi: 'miễn phí', it: 'gratis', zh_tw: '免費', bg: 'безплатно', ca: 'gratuït',
  nl: 'gratis', el: 'δωρεάν', ms: 'percuma', pl: 'za darmo', sv: 'gratis', th: 'ฟรี', uk: 'безкоштовно', sw: 'bila malipo', mr: 'विनामूल्य', te: 'ఉచితంగా',
  ha: 'kyauta', tl: 'libre', ta: 'இலவசம்', fa: 'رایگان', am: 'ነፃ', gu: 'મફત',
});
const localizedWallpaperCopies = Object.freeze(Object.fromEntries(Object.entries(wallpaperCopies).map(([language, copy]) => {
  const suffix = ` ${wallpaperFreeLabels[language] ?? 'free'} | UsefulVerse`;
  const availableNameLength = 60 - suffix.length;
  const shortName = copy.name.length <= availableNameLength
    ? copy.name
    : copy.name.slice(0, availableNameLength).replace(/\s+\S*$/u, '').trim();
  return [language, Object.freeze({ ...copy, title: `${shortName}${suffix}` })];
})));

const actionCopy = Object.freeze({
  calculate: 'Calculate', generate: 'Make the draw', reset: 'Reset', example: 'Try an example', newGame: 'New game',
  rules: 'How to play', reveal: 'Reveal first pair', next: 'Next pair', copy: 'Copy result', download: 'Download result', result: 'Result',
  rectangle: 'Rectangle', circle: 'Circle', triangle: 'Triangle', meters: 'Meters', centimeters: 'Centimeters', feet: 'Feet', inches: 'Inches',
  kgPerCubicMeter: 'Kilograms per cubic meter', lbPerCubicFoot: 'Pounds per cubic foot', kilograms: 'Kilograms', pounds: 'Pounds',
  computer: 'Play against the computer', twoPlayers: 'Two players on this device', privacyNote: 'Names and pairings stay on this device.',
});

const reusableMessages = Object.freeze({ copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.' });

const tools = {
  'deck-calculator': deckCalculatorEnglishCopy,
  'fence-calculator': fenceCalculatorEnglishCopy,
  'roofing-calculator': roofingCalculatorEnglishCopy,
  'drywall-calculator': drywallEnglishCopy,
  'gravel-calculator': {
    copyLanguage: 'en', name: 'Gravel calculator', title: 'Gravel calculator free & unlimited | UsefulVerse',
    description: 'Estimate gravel volume, weight and bags for a rectangle, circle or triangle. Free, unlimited and calculated in your browser.',
    intro: 'Enter your area and depth to estimate how much gravel to order. Add waste, density or bag size if you know them.',
    howQuestion: 'How much gravel do I need?',
    howAnswer: 'Choose a shape and unit, enter the measurements and depth, then calculate. The order volume includes your extra-material percentage. Weight and bag count appear when you enter density and bag size. Suppliers can use different densities, so treat the weight as an estimate.',
    privacyQuestion: 'Are my measurements uploaded?', privacyAnswer: 'No. This calculator runs in your browser and does not send your measurements to a server.',
    fields: {
      shape: 'Area shape', depth: 'Depth', length: 'Length', width: 'Width', diameter: 'Diameter', base: 'Triangle base', triangleHeight: 'Triangle height',
      dimensionUnit: 'Unit for length and width', depthUnit: 'Unit for depth', density: 'Gravel density (optional)', densityUnit: 'Density unit',
      waste: 'Extra material (%)', bagSize: 'Weight in one bag (optional)', bagUnit: 'Bag weight unit',
    },
    actions: actionCopy,
    messages: { ...reusableMessages, calculated: 'Estimate ready.', checkInputs: 'Enter a number above zero for each required measurement. Check the optional values too.', area: 'Area', volume: 'Gravel volume', orderVolume: 'Volume to order', estimatedWeight: 'Estimated weight', bagsToBuy: 'Whole bags to buy' },
  },
  'soil-calculator': soilEnglishCopy,
  'pool-volume-calculator': poolVolumeCalculatorEnglishCopy,
  'pool-salt-calculator': poolSaltCalculatorEnglishCopy,
  'wallpaper-calculator': wallpaperCalculatorEnglishCopy,
  'rafter-calculator': rafterCalculatorEnglishCopy,
  'carpet-calculator': carpetCalculatorEnglishCopy,
  'aquarium-calculator': aquariumCalculatorEnglishCopy,
  'image-region-redactor': imageRegionRedactorEnglishCopy,
  'image-sharpener': imageSharpenerEnglishCopy,
  'image-color-picker': imageColorPickerEnglishCopy,
  'roof-pitch-calculator': roofPitchCalculatorEnglishCopy,
  'molar-mass-calculator': {
    copyLanguage: 'en', name: 'Molar mass calculator', title: 'Molar mass calculator free unlimited | UsefulVerse',
    description: 'Calculate the molar mass of supported chemical formulas in your browser. Free, unlimited and no account needed.',
    intro: 'Enter a chemical formula such as H2O, Ca(OH)2 or CuSO4·5H2O to calculate its molar mass.',
    howQuestion: 'How do I calculate molar mass?', howAnswer: 'Type a formula using element symbols and numbers. Parentheses and hydrate dots are supported. The calculator lists each supported atom count and its estimated molar mass in grams per mole.',
    privacyQuestion: 'Is my formula uploaded?', privacyAnswer: 'No. Your formula is calculated in this browser and is not sent to a server.',
    fields: { formula: 'Chemical formula', supportedHint: 'This calculator supports a defined set of elements and selected isotope notation. Unsupported elements are rejected instead of guessed.' },
    actions: actionCopy,
    messages: { ...reusableMessages, calculated: 'Molar mass calculated.', invalidFormula: 'This formula is invalid or contains an element or isotope that is not supported.', atomCount: 'atom count', molarMass: 'Molar mass' },
  },
  'auto-loan-refinance-calculator': {
    copyLanguage: 'en', name: 'Auto loan refinance calculator', title: 'Auto refinance calculator free unlimited | UsefulVerse',
    description: 'Compare current and new auto-loan payments, total cost, fees and break-even time. Free browser calculator with no account.',
    intro: 'Compare your current car loan with a possible refinance. Enter every amount in the same currency. Results are estimates, not lender quotes or financial advice.',
    howQuestion: 'Will refinancing lower my car payment?', howAnswer: 'Enter the payoff balance, current rate and months left, then the proposed rate and loan term. Add fees and choose whether you pay them now or add them to the new balance. Compare the monthly payment and total cost: a lower payment can still cost more over a longer term.',
    privacyQuestion: 'Are loan details sent anywhere?', privacyAnswer: 'No. The comparison runs in your browser. Do not enter account numbers or other sensitive details.',
    fields: {
      balance: 'Current payoff balance', currentApr: 'Current annual rate (APR %)', currentMonths: 'Months left on current loan',
      newApr: 'New annual rate (APR %)', newMonths: 'New loan term (months)', fees: 'Refinance fees', feeTreatment: 'How will you pay the fees?',
      upfront: 'Pay fees upfront', rolledIn: 'Add fees to the new balance', currencyNote: 'Use the same currency for every amount. This estimate does not include taxes, insurance or lender-specific charges.',
    },
    actions: actionCopy,
    messages: { ...reusableMessages, estimateOnly: 'Estimate only. Compare the lender’s written offer and total cost.', checkInputs: 'Check the balance, rates, months and fees. Rates must be from 0 to 100; loan terms must be whole months.', currentPayment: 'Current estimated monthly payment', newPayment: 'New estimated monthly payment', paymentDifference: 'Monthly payment change (negative means higher)', currentTotal: 'Current remaining payments', newTotal: 'New loan payments and fees', estimatedDifference: 'Estimated savings (negative means higher cost)', breakEven: 'Estimated break-even', noBreakEven: 'No break-even within the terms entered', monthCount: '{count} months' },
  },
  'secret-santa-generator': {
    copyLanguage: 'en', name: 'Secret Santa generator', title: 'Secret Santa generator free unlimited | UsefulVerse',
    description: 'Make a Secret Santa draw with exclusions and private, one-at-a-time reveals. Free, unlimited and local to your device.',
    intro: 'Enter each person on a new line. Add exclusions if needed, then reveal one match at a time on this device.',
    howQuestion: 'How do I make a Secret Santa draw?', howAnswer: 'Add 2 to 30 unique names, one per line. To block a match, enter “Giver: Recipient” on a new line; separate several recipients with commas. The tool checks whether a valid draw exists. Keep the screen private while revealing names one at a time.',
    privacyQuestion: 'Are names uploaded or saved?', privacyAnswer: 'No. Names and matches stay in this browser session. They are not uploaded. Use the download option only after every match has been revealed.',
    fields: { names: 'Names (one per line)', exclusions: 'Blocked matches (optional)', exclusionsHint: 'Example: Alex: Sam, Jo means Alex cannot draw Sam or Jo.' },
    actions: actionCopy,
    messages: { ...reusableMessages, privatePair: '{giver} gives a gift to {recipient}.', allRevealed: 'Every match is now visible on this device.', drawReady: 'Draw ready. Reveal one match at a time.', checkNamesAndRules: 'Use 2 to 30 unique names. Check each blocked match and make sure a valid draw is possible.', downloaded: 'The text file has been created on your device.' },
  },
  mancala: {
    copyLanguage: 'en', name: 'Mancala (Kalah)', title: 'Mancala game online free unlimited | UsefulVerse',
    description: 'Play Mancala Kalah against the computer or with two people on one device. Free, unlimited and no download needed.',
    intro: 'Play a full game of Kalah. Choose a pit to sow its seeds around the board; capture seeds and try to finish with the most.',
    howQuestion: 'How do you play Mancala Kalah?', howAnswer: 'The board starts with four seeds in each pit. Choose a pit on your side and sow its seeds counter-clockwise, skipping the other player’s store. Land your last seed in your store to take another turn. If it lands in an empty pit on your side, capture the seeds in the opposite pit. When one side is empty, the game ends and the remaining seeds go to the other store.',
    privacyQuestion: 'Does this game need an account or download?', privacyAnswer: 'No. The game runs in this browser. Choose computer mode or pass the same device to a second player.',
    fields: { mode: 'Choose who to play', board: 'Mancala Kalah board', rules: 'New game starts with four seeds in each pit. Choose one of your pits to move. Extra turns, captures and the final sweep follow Kalah rules.' },
    actions: actionCopy,
    messages: { pit: 'Pit', seeds: 'seeds', playerOne: 'Player one', playerTwo: 'Player two', playerOneWins: 'Player one wins.', playerTwoWins: 'Player two wins.', tie: 'The game is a tie.', gameOver: 'Game over.', turn: '{player} to move.' },
  },
};

const source = {
  _home: {
    copyLanguage: 'en', title: 'Free everyday tools | UsefulVerse', description: 'Simple free browser tools for useful everyday tasks.',
    intro: 'Small tools that do one clear job. They run in your browser, with no account or usage fee.', directoryLabel: 'Free everyday tools',
    freeLabel: 'Free to use, no account', footerFree: 'Free browser tools. Your data stays on your device where the tool allows it.',
    skipToTool: 'Skip to tool', home: 'Home', languageLabel: 'Language', breadcrumbLabel: 'Breadcrumb', faqLabel: 'Frequently asked questions',
  },
  ...tools,
};

registerGrowthLocaleExtension(source, 'tire-size-calculator', tireSizeCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'drywall-calculator', drywallCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'stair-calculator', stairCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'asphalt-calculator', asphaltCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'soil-calculator', soilCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'pool-volume-calculator', poolCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'roof-pitch-calculator', roofCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'roofing-calculator', roofingCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'deck-calculator', deckCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'fence-calculator', fenceCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'pool-salt-calculator', poolSaltCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'wallpaper-calculator', localizedWallpaperCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'image-region-redactor', imageRegionRedactorCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'image-sharpener', imageSharpenerCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'image-upscaler', { ...imageUpscalerDrafts, en: imageUpscalerEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'image-color-picker', imageColorPickerCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'dominoes-game', dominoesCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'weight-loss-calculator', weightLossCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'heloc-calculator', { ...helocCopies, en: helocCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'random-team-generator', { ...randomTeamGeneratorCopies, en: randomTeamGeneratorEnglishCopy }, 'gravel-calculator');
const localizedMulchCopies = {
  ...mulchCopies,
  en: mulchCalculatorEnglishCopy,
  ar: {
    ...mulchCopies.ar,
    name: 'حاسبة تغطية التربة',
    title: 'حاسبة تغطية التربة مجانًا وبلا حدود | UsefulVerse',
    description: 'قدّر كمية تغطية التربة والأكياس والتكلفة حسب مساحة الأحواض وعمقها. أداة مجانية بلا حدود في متصفحك.',
    intro: 'اختر أحواضًا مستطيلة أو دائرية، وأدخل أبعادها وعددها وعمق التغطية وحجم الكيس لمعرفة الكمية المطلوبة.',
    howQuestion: 'ما كمية التغطية التي أحتاج إليها؟',
    howAnswer: 'اضرب إجمالي مساحة الأحواض في العمق المحدد. أضف نسبة اختيارية للتفاوت أو الهبوط، ثم اقسم الحجم على سعة الكيس وقرّب العدد إلى الأعلى.',
    privacyQuestion: 'هل تُرسل قياساتي إلى الموقع؟',
    privacyAnswer: 'لا. تُجرى الحسابات في المتصفح، ولا تُرسل القياسات إلى خادم ولا تحفظها هذه الأداة.',
    fields: {
      ...mulchCopies.ar.fields,
      shape: 'شكل الحوض', dimensionUnit: 'وحدة القياس', length: 'طول الحوض المستطيل', width: 'عرض الحوض المستطيل', diameter: 'قطر الحوض الدائري',
      bedCount: 'عدد الأحواض المتساوية', depth: 'عمق التغطية', depthUnit: 'وحدة العمق', bagVolume: 'حجم كل كيس', bagUnit: 'وحدة حجم الكيس',
      wastePercent: 'كمية إضافية (%)', pricePerBag: 'سعر الكيس (اختياري)', currency: 'العملة',
      currencyNote: 'التكلفة تقديرية حسب السعر الذي تدخله، ولا تشمل الضرائب أو التوصيل أو اختلاف الأسعار المحلية.',
      accuracyNote: 'هذا تقدير للتخطيط فقط. قد تؤثر حواف الأحواض والأرض غير المستوية والهبوط وتعليمات المنتج في الكمية. اتبع إرشادات الزراعة المحلية وملصق المنتج لتحديد العمق المناسب.',
      relatedGravelCalculator: 'تحتاج إلى حساب الحصى؟ جرّب حاسبة الحصى.', relatedSoilCalculator: 'تملأ أصصًا أو أوعية زراعة؟ جرّب حاسبة التربة.',
    },
    actions: {
      ...mulchCopies.ar.actions,
      calculate: 'احسب الكمية', reset: 'إعادة ضبط', copy: 'نسخ النتيجة', example: 'جرّب مثالًا', result: 'الكمية المطلوبة', rectangle: 'مستطيل', circle: 'دائرة',
      meters: 'أمتار', feet: 'أقدام', centimeters: 'سنتيمترات', millimeters: 'ملليمترات', inches: 'بوصات', liters: 'لترات', cubicFeet: 'أقدام مكعبة',
      squareMeters: 'أمتار مربعة', squareFeet: 'أقدام مربعة', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.',
    },
    messages: {
      ...mulchCopies.ar.messages,
      copied: 'تم النسخ.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', calculated: 'اكتمل التقدير.',
      checkInputs: 'تحقق من الأبعاد والعدد والعمق وحجم الكيس والنسبة الإضافية.', bedArea: 'إجمالي مساحة الأحواض', mulchDepth: 'عمق التغطية',
      volume: 'الحجم قبل إضافة كمية إضافية', orderVolume: 'الحجم مع الكمية الإضافية', cubicYards: 'حجم تقريبي بالياردات المكعبة',
      bags: 'عدد الأكياس الكاملة للشراء', estimatedCost: 'التكلفة التقديرية للأكياس', costNotEntered: 'أدخل سعر الكيس لتقدير التكلفة.',
    },
    additionalFaqs: [
      { question: 'كم كيسًا أحتاج إلى متر مكعب واحد؟', answer: 'اقسم 1000 لتر على سعة الكيس باللترات، ثم قرّب العدد إلى الأعلى. تحتاج إلى 20 كيسًا سعة كل منها 50 لترًا، قبل إضافة أي كمية احتياطية.' },
      { question: 'هل أضيف كمية احتياطية؟', answer: 'يمكنك إضافة نسبة لتغطية تفاوت سطح الأرض أو هبوط المادة. لا تحدد الأداة عمق الزراعة أو نسبة احتياطية مناسبة؛ اتبع إرشادات العناية بالنبات وملصق المنتج.' },
    ],
  },
};
registerGrowthLocaleExtension(source, 'mulch-calculator', localizedMulchCopies, 'gravel-calculator');
const localizedPaverCopies = {
  ...paverCopies,
  en: paverCalculatorEnglishCopy,
  ar: {
    ...paverCopies.ar,
    name: 'حاسبة بلاط الرصف', title: 'حاسبة بلاط الرصف مجانًا بلا حدود | UsefulVerse',
    description: 'قدّر عدد بلاط الرصف ومواد القاعدة والتكلفة لساحة مستطيلة. مجانية وبلا حدود في متصفحك.',
    intro: 'قدّر بلاط الرصف ومواد القاعدة لمساحة مستطيلة. أدخل أبعاد المساحة ونمط التكرار ونسبة المواد الإضافية والأسعار الاختيارية.',
    howQuestion: 'كيف تعمل حاسبة بلاط الرصف؟',
    howAnswer: 'تقرّب الحاسبة عدد وحدات النمط الكاملة إلى الأعلى لتغطية المساحة، ثم تضربه في عدد البلاطات داخل كل وحدة. كما تقدّر طول الحواف وحجم طبقة القاعدة.',
    privacyQuestion: 'هل تُرفع قياساتي؟', privacyAnswer: 'لا. تعمل الحاسبة في متصفحك، ولا ترسل القياسات أو الأسعار إلى خادم ولا تحفظها.',
    fields: {
      ...paverCopies.ar.fields,
      length: 'طول المساحة المرصوفة', width: 'عرض المساحة المرصوفة', surfaceUnit: 'وحدة قياس المساحة',
      moduleLength: 'طول وحدة النمط المتكرر', moduleWidth: 'عرض وحدة النمط المتكرر', moduleUnit: 'وحدة قياس النمط',
      paversPerModule: 'عدد بلاطات الرصف في كل وحدة نمط', paverWastePercent: 'بلاطات إضافية (%)',
      baseDepth: 'عمق طبقة القاعدة', baseDepthUnit: 'وحدة عمق القاعدة', baseWastePercent: 'مواد قاعدة إضافية (%)',
      pricePerPaver: 'سعر بلاطة الرصف (اختياري)', basePricePerM3: 'سعر مواد القاعدة لكل م³ (اختياري)', currency: 'العملة',
      unitsNote: 'يجب أن تصف أبعاد النمط جزءًا كاملًا متكررًا، بما في ذلك عرض الفواصل. اجعل اتجاه النمط موافقًا لطول المساحة وعرضها.',
      accuracyNote: 'تقدير للتخطيط فقط. تحسب الأداة وحدات النمط الكاملة؛ وقد تنتج قصاصات الحواف قطعًا قابلة لإعادة الاستخدام، لذلك قد تختلف الكمية الفعلية. لا تنشئ خطة قص أو تركيب، ولا تقيّم التصريف أو التربة أو الأحمال أو عمق الصقيع أو قوانين البناء المحلية. تحقّق من القياسات وتغطية المنتج ومتطلبات القاعدة مع المورد أو فني تركيب مؤهل.',
      relatedTileCalculator: 'تحسب بلاط الأرضيات؟ جرّب حاسبة البلاط.', relatedGravelCalculator: 'تحسب طبقة حصى؟ جرّب حاسبة الحصى.',
    },
    actions: { ...paverCopies.ar.actions, calculate: 'احسب بلاطات الرصف', reset: 'إعادة ضبط', copy: 'انسخ النتيجة', example: 'جرّب مثالًا', result: 'تقدير بلاطات الرصف' },
    messages: {
      ...paverCopies.ar.messages, copied: 'تم النسخ.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', calculated: 'التقدير جاهز.',
      checkInputs: 'تحقق من أبعاد المساحة والنمط وعدد البلاطات وعمق القاعدة والنسب الإضافية.',
      area: 'مساحة الرصف', perimeter: 'محيط الحواف', moduleCount: 'وحدات النمط الكاملة',
      paversBeforeWaste: 'عدد البلاطات قبل الإضافة', paversToBuy: 'بلاطات الرصف المطلوب شراؤها',
      baseVolume: 'حجم طبقة القاعدة', baseOrderVolume: 'حجم القاعدة مع الإضافة',
      paverCost: 'التكلفة التقديرية للبلاطات', baseCost: 'التكلفة التقديرية لمواد القاعدة',
      totalCost: 'إجمالي التكلفة التقديرية للمواد', costNotEntered: 'أدخل سعرًا لتقدير التكلفة.',
    },
    additionalFaqs: [
      { question: 'كم بلاطة رصف أحتاج؟', answer: 'أدخل أبعاد المساحة المرصوفة وأبعاد وحدة نمط كاملة وعدد البلاطات فيها. تحسب الأداة وحدات كافية لتغطية كل جانب، ثم تضيف النسبة الاحتياطية التي تختارها.' },
      { question: 'هل يشمل التقدير قصّ الحواف؟', answer: 'يحسب وحدات النمط الكاملة ويعرض محيط الحواف. لكنه لا يخطط للقص ولا يحدد إن كان يمكن إعادة استخدام القصاصات.' },
    ],
  },
  zh: {
    ...paverCopies.zh,
    name: '铺路砖计算器', title: '铺路砖计算器免费无限制 | UsefulVerse',
    description: '估算矩形庭院所需的铺路砖、基层材料、边缘长度和费用。免费使用，次数不限。',
    intro: '估算矩形铺装区域所需的铺路砖和基层材料。输入面积、重复铺设模块、损耗比例和可选价格。',
    howQuestion: '铺路砖计算器如何工作？',
    howAnswer: '计算器会向上取整，确保完整的重复模块覆盖区域，然后乘以每个模块中的铺路砖数量。它还会估算边缘总长度和基层体积。',
    privacyQuestion: '我的测量数据会上传吗？', privacyAnswer: '不会。计算在浏览器中进行，测量数据和价格不会发送到服务器，也不会由此工具保存。',
    fields: {
      ...paverCopies.zh.fields,
      surfaceUnit: '面积单位', paversPerModule: '每个重复模块中的铺路砖数量', paverWastePercent: '额外铺路砖 (%)',
      pricePerPaver: '每块铺路砖的价格（可选）', basePricePerM3: '每立方米基层材料价格（可选）',
      unitsNote: '模块尺寸应表示一个完整的重复铺设单元，并包含接缝宽度。输入模块方向时，请与铺装区域的长宽方向对应。',
      accuracyNote: '仅供规划估算。工具按完整重复模块计数；边缘切割可能产生可重复利用的余料，因此实际用量可能不同。工具不会生成切割或铺设方案，也不评估排水、土壤、承重、冻土深度或当地建筑规定。请向供应商或合格的施工人员确认尺寸、产品覆盖量和基层要求。',
      relatedTileCalculator: '计算室内瓷砖用量？试试瓷砖计算器。', relatedGravelCalculator: '估算松散碎石层？试试碎石计算器。',
    },
    actions: { ...paverCopies.zh.actions, calculate: '计算铺路砖用量', result: '铺路砖用量估算' },
    messages: {
      ...paverCopies.zh.messages, checkInputs: '请检查区域尺寸、模块尺寸、每个模块的铺路砖数量、基层深度和损耗比例。',
      area: '铺装面积', perimeter: '边缘总长度', moduleCount: '完整重复模块数量',
      paversBeforeWaste: '增加损耗前的铺路砖数量', paversToBuy: '建议购买的铺路砖数量',
      baseVolume: '基层体积', baseOrderVolume: '含损耗的基层体积', paverCost: '铺路砖估算费用',
      baseCost: '基层材料估算费用', totalCost: '材料总估算费用',
    },
    additionalFaqs: [
      { question: '我需要多少块铺路砖？', answer: '输入铺装区域的尺寸、一个完整重复模块的尺寸，以及该模块包含的铺路砖数量。计算器会向上取整以覆盖整个区域，并应用可选的损耗比例。' },
      { question: '估算包含边缘切割吗？', answer: '工具按输入方向计算完整重复模块，并显示边缘总长度；它不会规划切割，也不会判断余料能否重复使用。' },
    ],
  },
  zh_tw: {
    ...paverCopies.zh_tw,
    name: '鋪路磚計算器', title: '鋪路磚計算器免費無限制 | UsefulVerse',
    description: '估算矩形庭院所需的鋪路磚、底層材料、邊緣長度和費用。免費使用，次數不限。',
    intro: '估算矩形鋪面所需的鋪路磚和底層材料。輸入面積、重複鋪設模組、耗損比例和選填價格。',
    howQuestion: '鋪路磚計算器如何運作？',
    howAnswer: '計算器會將完整的重複模組數量無條件進位，確保覆蓋區域，再乘以每個模組中的鋪路磚數量。也會估算邊緣總長度和底層體積。',
    privacyQuestion: '我的測量資料會上傳嗎？', privacyAnswer: '不會。計算在瀏覽器中進行，測量資料和價格不會傳送到伺服器，也不會由此工具保存。',
    fields: {
      ...paverCopies.zh_tw.fields,
      surfaceUnit: '面積單位', paversPerModule: '每個重複模組中的鋪路磚數量', paverWastePercent: '額外鋪路磚 (%)',
      pricePerPaver: '每塊鋪路磚價格（選填）', basePricePerM3: '每立方公尺底層材料價格（選填）',
      unitsNote: '模組尺寸應代表一個完整的重複鋪設單元，並包含接縫寬度。輸入模組方向時，請對應鋪面區域的長寬方向。',
      accuracyNote: '僅供規劃估算。工具按完整重複模組計數；邊緣切割可能產生可重複利用的餘料，因此實際用量可能不同。工具不會產生切割或鋪設方案，也不評估排水、土壤、承重、凍土深度或當地建築規定。請向供應商或合格施工人員確認尺寸、產品覆蓋量和底層需求。',
      relatedTileCalculator: '計算室內磁磚用量？試試磁磚計算器。', relatedGravelCalculator: '估算鬆散碎石層？試試碎石計算器。',
    },
    actions: { ...paverCopies.zh_tw.actions, calculate: '計算鋪路磚用量', result: '鋪路磚用量估算' },
    messages: {
      ...paverCopies.zh_tw.messages, checkInputs: '請檢查區域尺寸、模組尺寸、每個模組的鋪路磚數量、底層深度和耗損比例。',
      area: '鋪面面積', perimeter: '邊緣總長度', moduleCount: '完整重複模組數量',
      paversBeforeWaste: '增加耗損前的鋪路磚數量', paversToBuy: '建議購買的鋪路磚數量',
      baseVolume: '底層體積', baseOrderVolume: '含耗損的底層體積', paverCost: '鋪路磚估算費用',
      baseCost: '底層材料估算費用', totalCost: '材料總估算費用',
    },
    additionalFaqs: [
      { question: '我需要多少塊鋪路磚？', answer: '輸入鋪面區域尺寸、一個完整重複模組的尺寸，以及該模組包含的鋪路磚數量。計算器會無條件進位以覆蓋整個區域，並套用選填的耗損比例。' },
      { question: '估算包含邊緣切割嗎？', answer: '工具依輸入方向計算完整重複模組，並顯示邊緣總長度；它不會規劃切割，也不會判斷餘料能否重複使用。' },
    ],
  },
  ja: {
    ...paverCopies.ja,
    name: '舗装ブロック計算機', title: '舗装ブロック計算機・無料・回数無制限 | UsefulVerse',
    description: '長方形の庭に必要な舗装ブロック、路盤材、縁の長さと費用を見積もります。無料・回数無制限。',
    intro: '長方形の舗装面に必要なブロックと路盤材を見積もります。面積、繰り返しパターン、余分の割合、任意の価格を入力してください。',
    howQuestion: '舗装ブロック計算機の使い方は？',
    howAnswer: '入力した向きで面全体を覆えるよう、繰り返しモジュール数を切り上げて、各モジュールのブロック数を掛けます。縁の長さと路盤材の体積も見積もります。',
    privacyQuestion: '測定値はアップロードされますか？', privacyAnswer: 'いいえ。計算はブラウザー内で行われ、測定値や価格はサーバーへ送信・保存されません。',
    fields: {
      ...paverCopies.ja.fields,
      length: '舗装面の長さ', width: '舗装面の幅', surfaceUnit: '面積の単位',
      moduleLength: '繰り返しモジュールの長さ', moduleWidth: '繰り返しモジュールの幅', moduleUnit: 'モジュールの単位',
      paversPerModule: '1モジュールに含まれる舗装ブロック数', paverWastePercent: '追加するブロック (%)',
      baseDepth: '路盤層の厚さ', baseDepthUnit: '路盤層の単位', baseWastePercent: '追加する路盤材 (%)',
      pricePerPaver: 'ブロック1個の価格（任意）', basePricePerM3: '路盤材1m³あたりの価格（任意）', currency: '通貨',
      unitsNote: 'モジュールの寸法は、目地幅を含む完全な繰り返し単位を表します。舗装面の長さと幅に合わせて向きを入力してください。',
      accuracyNote: '計画用の概算です。完全な繰り返しモジュールで数えるため、端部の切断や余材の再利用によって実際の数量は変わります。切断・配置図は作成せず、排水、地盤、荷重、凍結深度、地域の建築規則も評価しません。寸法、製品の施工範囲、路盤の要件は販売店または有資格の施工業者に確認してください。',
      relatedTileCalculator: '室内タイルの数量計算にはタイル計算機をお試しください。', relatedGravelCalculator: '砂利層の見積もりには砂利計算機をお試しください。',
    },
    actions: { ...paverCopies.ja.actions, calculate: 'ブロック数を計算', copy: '結果をコピー', example: '入力例を試す', result: '舗装ブロックの見積もり' },
    messages: {
      ...paverCopies.ja.messages, copyUnavailable: 'このブラウザーではコピーできません。', checkInputs: '舗装面とモジュールの寸法、ブロック数、路盤の厚さ、追加割合を確認してください。',
      area: '舗装面積', perimeter: '縁の長さ', moduleCount: '完全な繰り返しモジュール数',
      paversBeforeWaste: '追加分を含まないブロック数', paversToBuy: '購入するブロック数',
      baseVolume: '路盤層の体積', baseOrderVolume: '追加分を含む路盤材の体積', paverCost: 'ブロックの概算費用',
      baseCost: '路盤材の概算費用', totalCost: '材料費の合計概算', costNotEntered: '費用を見積もるには価格を入力してください。',
    },
    additionalFaqs: [
      { question: '舗装ブロックは何個必要ですか？', answer: '舗装面と完全な繰り返しモジュールの寸法、モジュール内のブロック数を入力します。面全体を覆うようにモジュール数を切り上げ、任意の追加割合を適用します。' },
      { question: '端部の切断分も含まれますか？', answer: '完全なモジュール数と縁の長さを計算しますが、切断配置や余材を再利用できるかどうかは判断しません。' },
    ],
  },
};
registerGrowthLocaleExtension(source, 'paver-calculator', localizedPaverCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'solar-panel-calculator', { ...solarCopies, en: solarPanelCalculatorEnglishCopy }, 'gravel-calculator');
const cleanBtuMetadata = (copy) => Object.freeze({
  ...copy,
  name: copy.name.replace(/[ \t]{2,}/gu, ' ').trim(),
  title: copy.title.replace(/[ \t]{2,}/gu, ' ').trim(),
  description: copy.description.replace(/[ \t]{2,}/gu, ' ').trim(),
});
const translatedBtuCopies = { ...btuCopies, en: btuCalculatorEnglishCopy };
translatedBtuCopies.es = Object.freeze({
  ...translatedBtuCopies.es,
  title: 'Calculadora BTU gratis e ilimitada | UsefulVerse',
  description: 'Calcula la capacidad del aire acondicionado en BTU/h. Gratis, sin límites de uso y en tu navegador; el resultado es solo orientativo.',
  fields: Object.freeze({
    ...translatedBtuCopies.es.fields,
    occupants: 'Número de personas que suelen estar en la habitación',
    accuracyNote: 'Estimación orientativa basada en los rangos de tamaño de ENERGY STAR. El ajuste de aislamiento es una suposición que eliges tú. Para habitaciones de menos de 9,3 m² se usa el valor mínimo de la tabla; por encima de 232 m², consulta a un profesional. No sustituye un cálculo Manual J ni un diseño HVAC. La necesidad real depende del clima, ventanas, fugas de aire y otros detalles del edificio.',
  }),
  messages: Object.freeze({
    ...translatedBtuCopies.es.messages,
    roomArea: 'Área del suelo de la habitación', roomVolume: 'Volumen aproximado de la habitación',
    baseCapacity: 'Capacidad base según el área', ceilingAdjustment: 'Factor por altura del techo',
    insulationAdjustment: 'Ajuste por aislamiento', sunAdjustment: 'Factor de luz solar',
    occupantAdjustment: 'Ajuste por personas adicionales', kitchenAdjustment: 'Ajuste por uso de cocina',
    capacity: 'Capacidad de refrigeración estimada', tons: 'toneladas de refrigeración aproximadas',
  }),
  privacyAnswer: 'No. El cálculo se realiza en tu navegador. Esta herramienta no envía ni guarda en un servidor las medidas de la habitación ni los ajustes.',
  actions: Object.freeze({ ...translatedBtuCopies.es.actions, meters: 'Metros' }),
});
translatedBtuCopies.ar = Object.freeze({
  ...translatedBtuCopies.ar,
  intro: 'قدّر سعة التبريد اللازمة للغرفة حسب مساحة الأرضية وارتفاع السقف والعزل وأشعة الشمس وعدد الأشخاص واستخدام المطبخ. تظهر الأداة كل تعديل.',
  howAnswer: 'قِس الغرفة، واختر نطاق المساحة المناسب، ثم عدّل التقدير حسب ارتفاع السقف والعزل وضوء الشمس وعدد الأشخاص الإضافيين واستخدام المطبخ. تُقرّب النتيجة إلى أقرب 1000 وحدة BTU في الساعة.',
  fields: Object.freeze({
    ...translatedBtuCopies.ar.fields,
    occupants: 'عدد الأشخاص الموجودين عادةً في الغرفة',
    accuracyNote: 'هذا تقدير تخطيطي فقط، ويعتمد على نطاقات حجم مكيفات الغرف المنشورة من ENERGY STAR. تعديل العزل افتراض تختاره بنفسك. للمساحات الأقل من 100 قدم مربع يُستخدم الحد الأدنى في الجدول. للمساحات فوق 2500 قدم مربع، استشر مختصًا. هذا ليس حساب Manual J ولا تصميمًا لنظام تكييف مركزي. تختلف الحاجة الفعلية حسب المناخ والنوافذ وتسرب الهواء وتفاصيل المبنى.',
  }),
  actions: Object.freeze({ ...translatedBtuCopies.ar.actions, no: 'لا' }),
  messages: Object.freeze({ ...translatedBtuCopies.ar.messages, copied: 'تم النسخ.', copyUnavailable: 'النسخ غير متاح في هذا المتصفح.', calculated: 'التقدير جاهز.', tons: 'طن تبريد تقريبي' }),
});
const localizedBtuCopies = Object.freeze(Object.fromEntries(Object.entries(translatedBtuCopies).map(([language, copy]) => [language, cleanBtuMetadata(copy)])));
registerGrowthLocaleExtension(source, 'btu-calculator', localizedBtuCopies, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'brick-calculator', { ...brickCopies, en: brickCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'rafter-calculator', { ...rafterCopies, en: rafterCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'carpet-calculator', { ...carpetCopies, en: carpetCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'aquarium-calculator', { ...aquariumCopies, en: aquariumCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'grass-seed-calculator', { ...grassSeedCopies, en: grassSeedCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'insulation-calculator', { ...insulationCopies, en: insulationCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'wall-framing-calculator', { ...wallFramingCopies, en: wallFramingCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'electricity-cost-calculator', { ...electricityCostCopies, en: electricityCostCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'compost-calculator', { ...compostCopies, en: compostCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'pond-volume-calculator', { ...pondCopies, en: pondVolumeCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'fertilizer-calculator', { ...fertilizerCopies, en: fertilizerCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'baluster-spacing-calculator', { ...balusterCopies, en: balusterSpacingCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'retaining-wall-calculator', { ...retainingWallCopies, en: retainingWallCalculatorEnglishCopy }, 'brick-calculator');
registerGrowthLocaleExtension(source, 'battery-runtime-calculator', { ...batteryRuntimeCopies, en: batteryRuntimeCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'lumber-cut-calculator', { ...lumberCutCopies, en: lumberCutCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'plant-spacing-calculator', { ...plantSpacingCopies, en: plantSpacingCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'ev-charging-calculator', { ...evChargingCopies, en: evChargingCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'rainwater-harvesting-calculator', { ...rainwaterHarvestingCopies, en: rainwaterHarvestingCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'ramp-calculator', { ...rampCopies, en: rampCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'heat-loss-calculator', { ...heatLossCopies, en: heatLossCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'heat-pump-calculator', { ...heatPumpCopies, en: heatPumpCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'miter-angle-calculator', { ...miterAngleCopies, en: miterAngleCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'voltage-drop-calculator', { ...voltageDropCopies, en: voltageDropCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'molarity-calculator', { ...molarityCopies, en: molarityCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'dilution-calculator', { ...dilutionCopies, en: dilutionCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'ohms-law-calculator', { ...ohmsLawCopies, en: ohmsLawCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'chemical-equation-balancer', { ...chemicalEquationCopies, en: chemicalEquationBalancerEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'gear-ratio-calculator', { ...gearRatioCopies, en: gearRatioCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'density-calculator', { ...densityCopies, en: densityCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'compression-ratio-calculator', { ...compressionRatioCopies, en: compressionRatioCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'goal-planner', { ...goalPlannerCopies, en: goalPlannerEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'mind-map-maker', { ...mindMapMakerCopies, en: mindMapMakerEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'mood-tracker', { ...moodTrackerCopies, en: moodTrackerEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'journal-online', { ...journalOnlineCopies, en: journalOnlineEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'travel-itinerary-planner', { ...travelItineraryPlannerCopies, en: travelItineraryPlannerEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'polynomial-long-division-calculator', { ...polynomialLongDivisionCopies, en: polynomialLongDivisionCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'half-life-calculator', { ...halfLifeCalculatorCopies, en: halfLifeCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'mortgage-points-calculator', { ...mortgagePointsCalculatorCopies, en: mortgagePointsCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'trapezoid-calculator', { ...trapezoidCalculatorCopies, en: trapezoidCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'prayer-times-calculator', { ...prayerTimesCalculatorCopies, en: prayerTimesCalculatorEnglishCopy }, 'gravel-calculator');
registerGrowthLocaleExtension(source, 'hitori', { ...hitoriCopies, en: hitoriEnglishCopy }, 'gravel-calculator');

export default Object.freeze(source);
