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

export default Object.freeze(source);
