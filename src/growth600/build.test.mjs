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

const actions = { calculate: 'Calculate', generate: 'Generate', reset: 'Reset', example: 'Example', newGame: 'New game', rules: 'Rules', reveal: 'Reveal', next: 'Next', copy: 'Copy', download: 'Download', updateProgress: 'Record progress', result: 'Result', rectangle: 'Rectangle', circle: 'Circle', triangle: 'Triangle', meters: 'Meters', centimeters: 'Centimeters', feet: 'Feet', inches: 'Inches', liters: 'Liters', cubicFeet: 'Cubic feet', kgPerCubicMeter: 'Kilograms per cubic meter', lbPerCubicFoot: 'Pounds per cubic foot', kilograms: 'Kilograms', pounds: 'Pounds', computer: 'Computer', twoPlayers: 'Two players', privacyNote: 'Private on this device.', riseMode: 'Rise', pitchMode: 'Pitch' };
const messages = { copied: 'Copied.', copyUnavailable: 'Copy unavailable.', calculated: 'Done.', sameSize: 'Sizes match.', checkInputs: 'Check entries.', diameter: 'Outside diameter', sidewall: 'Sidewall height', circumference: 'Circumference', revolutions: 'Revolutions per kilometre', diameterDifference: 'Diameter difference', diameterChange: 'Diameter change', groundClearance: 'Ground-clearance change', actualSpeed: 'Actual speed estimate', area: 'Area', volume: 'Volume', volumePerContainer: 'Volume per container', totalVolume: 'Total soil volume', orderVolume: 'Order volume', estimatedWeight: 'Estimated weight', bagsToBuy: 'Bags to buy', invalidFormula: 'Check formula.', atomCount: 'atoms', molarMass: 'Molar mass', estimateOnly: 'Estimate only.', currentPayment: 'Current payment', newPayment: 'New payment', paymentDifference: 'Difference', currentTotal: 'Current total', newTotal: 'New total', estimatedDifference: 'Estimated savings', breakEven: 'Break-even', noBreakEven: 'No break-even', monthCount: '{count} months', privatePair: '{giver} gives to {recipient}', allRevealed: 'All revealed.', drawReady: 'Ready.', checkNamesAndRules: 'Check entries.', downloaded: 'Downloaded.', pit: 'Pit', seeds: 'seeds', playerOne: 'Player one', playerTwo: 'Player two', playerOneWins: 'Player one wins.', playerTwoWins: 'Player two wins.', tie: 'Tie.', gameOver: 'Game over.', turn: '{player} turn.', effectiveRun: 'Horizontal run to ridge', rafterLength: 'Geometric rafter length', pitch: 'Pitch (rise per 12)', roofAngle: 'Roof angle', plumbCut: 'Plumb-cut angle', overhangRun: 'Horizontal overhang' };
function toolCopy(tool, language) {
  const name = `${tool.id} ${language}`;
  const fields = {
    'image-region-redactor': { imageFile: 'Choose a raster image', mode: 'Redaction style', strength: 'Pixel size or blur amount', regionX: 'Left position in pixels', regionY: 'Top position in pixels', regionWidth: 'Region width in pixels', regionHeight: 'Region height in pixels', accuracyNote: 'Use black for private details; large images need enough memory.', dragHint: 'Drag to select or enter exact coordinates.', regionsLabel: 'Selected regions', format: 'Export format', relatedMosaic: 'Try a whole-image mosaic.', relatedCropper: 'Try the image cropper.' },
    'image-upscaler': { imageFile: 'Choose an image', accuracyNote: 'Local model; 1 megapixel limit.', progressHint: 'Progress', sourcePreview: 'Original', resultPreview: 'Result', relatedResizer: 'Resize image.', relatedSharpener: 'Sharpen image.' },
    'photo-to-sketch': { imageFile: 'Choose an image', intensity: 'Sketch intensity', detail: 'Fine-detail threshold', compare: 'Show original', accuracyNote: 'Local processing; maximum 8 megapixels.', previewHint: 'Reduced preview.' },
    'schema-markup-validator': { markup: 'Paste JSON-LD', accuracyNote: 'Local Schema.org 30.1 vocabulary.', resultSummary: 'Validation summary', issues: 'Findings', googleNote: 'Not a Google test.' },
    'readability-checker': { text: 'Text', language: 'Language', languageEn: 'English', languageEs: 'Spanish', languageFr: 'French', languageDe: 'German', languageIt: 'Italian', accuracyNote: 'Estimates only.', resultSummary: 'Results', formula: 'Formula', wordCount: 'Words', sentenceCount: 'Sentences', characterCount: 'Characters', characterCountNoSpaces: 'Characters without spaces', letterCount: 'Letters', syllableEstimate: 'Syllables', averageSentenceLength: 'Words per sentence', averageWordLength: 'Letters per word', averageSyllablesPerWord: 'Syllables per word', longWordCount: 'Long words' },
    'savings-goal-calculator': { mode: 'Calculation', startingBalance: 'Current savings', targetAmount: 'Savings target', annualRatePercent: 'Annual rate', months: 'Months', monthlyContribution: 'Monthly deposit', contributionTiming: 'Deposit timing', accuracyNote: 'Estimate only.', resultSummary: 'Estimate', monthlyResult: 'Required deposit', monthsResult: 'Months', projectedBalance: 'Projected balance', totalContributions: 'Deposits', estimatedInterest: 'Estimated interest', currencyNote: 'Use one currency.' },
    'severance-pay-calculator': { mode: 'Calculation type', weeklyPay: 'Average gross weekly pay', yearsOfService: 'Years of service', weeksPerYear: 'Weeks per year', birthDate: 'Birth date', employmentStartDate: 'Employment start date', redundancyDate: 'Redundancy date', accuracyNote: 'Estimate only.', customNote: 'Custom assumptions.', ukNote: 'Great Britain estimate; enter GBP.', officialSource: 'Official guidance', estimate: 'Estimated amount', appliedWeeklyPay: 'Weekly pay used', totalWeeks: 'Weeks of pay', rulesAsOf: 'Rules from', resultSummary: 'Estimate details' },
    'divisibility-calculator': { integer: 'Whole number', divisors: 'Divisors', accuracyNote: 'Checks up to 30 divisors.', resultSummary: 'Results', remainder: 'Remainder', quotient: 'Exact quotient', rule: 'Rule', rule1: 'Divisible by 1.', rule2: 'Last digit even.', rule3: 'Digit sum divisible by 3.', rule4: 'Last two digits divisible by 4.', rule5: 'Last digit is 0 or 5.', rule6: 'Divisible by 2 and 3.', rule7: 'Double last digit and subtract.', rule8: 'Last three digits divisible by 8.', rule9: 'Digit sum divisible by 9.', rule10: 'Last digit is 0.', rule11: 'Alternating sum divisible by 11.', rule12: 'Divisible by 3 and 4.', rule13: 'Multiply last digit by 4 and add.', rule25: 'Last two digits are 00, 25, 50 or 75.', rule100: 'Last two digits are 00.', rule1000: 'Last three digits are 000.', ruleGeneric: 'Use exact remainder.' },
    'number-line-graphing-tool': { intervals: 'Intervals', intervalFormat: 'One per line.', accuracyNote: 'Fractions are plotted approximately.', chartDescription: 'Number line graph', exampleInput: '(1, 3]\n-2' },
    'laplace-transform-calculator': { direction: 'Direction', forwardMode: 'Laplace transform', inverseMode: 'Inverse Laplace transform', expression: 'Expression', forwardHint: 'Supported forward forms.', inverseHint: 'One inverse term per line.', accuracyNote: 'Bounded symbolic table only.', resultSummary: 'Result', region: 'Region of convergence', forwardConvention: 'Unilateral transform.', inverseConvention: 'Unilateral inverse.', forwardExample: 't^2 + 1', inverseExample: '1/s\n2/s^3' },
    'vector-calculator': { dimension: 'Vector dimensions', dimension2d: '2D', dimension3d: '3D', operation: 'Operation', vectorA: 'Vector A', vectorB: 'Vector B', ax: 'A x component', ay: 'A y component', az: 'A z component', bx: 'B x component', by: 'B y component', bz: 'B z component', accuracyNote: 'Compatible units only.', resultSummary: 'Results', zComponent: 'z-component', magnitudeAResult: 'Magnitude of A', magnitudeBResult: 'Magnitude of B', dotProductResult: 'Dot product', exampleHint: 'Example hint' },
    'cubic-quartic-equation-calculator': { degree: 'Polynomial degree', degree3: 'Cubic', degree4: 'Quartic', a4: 'x4 coefficient', a3: 'x3 coefficient', a2: 'x2 coefficient', a1: 'x coefficient', a0: 'Constant term', accuracyNote: 'Numerical real roots only.', resultSummary: 'Real roots', root: 'Root', multiplicity: 'Multiplicity', residual: 'Absolute residual', noRealRoots: 'No real roots.', nonRealRootsNote: 'Non-real roots are not shown.', exampleHint: 'Example x3 - 1.' },
    'wallpaper-calculator': { unit: 'Unit', perimeter: 'Wall perimeter', wallHeight: 'Wall height', openingsArea: 'Opening area', rollWidth: 'Roll width', rollLength: 'Roll length', patternRepeat: 'Pattern repeat', wastePercent: 'Extra material', accuracyNote: 'Planning estimate only.', relatedPaintCalculator: 'Need paint too? Try the paint calculator.' },
    'pool-salt-calculator': { volume: 'Pool volume', volumeUnit: 'Volume unit', currentSalinityPpm: 'Current salinity ppm', targetSalinityPpm: 'Target salinity ppm', saltPurityPercent: 'Salt purity', bagSize: 'Bag size', bagUnit: 'Bag unit', accuracyNote: 'Use the manufacturer target.' },
    'solar-panel-calculator': { mode: 'Estimate type', dailyTargetKwh: 'Daily energy target', panelCount: 'Panel count', panelWatts: 'Panel rating', peakSunHours: 'Peak sun hours', lossPercent: 'System losses', panelLengthM: 'Panel length', panelWidthM: 'Panel width', electricityRate: 'Electricity rate', systemCost: 'Installed system cost', currency: 'Currency', assumptionNote: 'Enter local sunlight and your own price assumptions.', accuracyNote: 'Planning estimate only; actual production, savings and payback vary with conditions and utility rules.' },
    'btu-calculator': { length: 'Room length', width: 'Room width', ceilingHeight: 'Ceiling height', dimensionUnit: 'Unit', insulationAdjustment: 'Insulation adjustment', sunExposure: 'Sun exposure', occupants: 'People', kitchen: 'Kitchen', accuracyNote: 'Planning estimate only.' },
    'fence-calculator': { unit: 'Run unit', length: 'Total run', gateCount: 'Number of gates', gateWidth: 'Gate opening', materialUnit: 'Material unit', postSpacing: 'Post spacing', panelWidth: 'Panel width', picketWidth: 'Picket width', maxPicketGap: 'Maximum gap', picketHeight: 'Picket length', wastePercent: 'Extra pieces', pricePerPost: 'Price per post', pricePerGate: 'Price per gate', pricePerPanel: 'Price per panel', pricePerPicket: 'Price per picket', accuracyNote: 'Estimate only; gate positions are assumed evenly spaced.' },
    'deck-calculator': { unit: 'Unit', length: 'Deck length', width: 'Deck width', boardUnit: 'Board and support unit', boardWidth: 'Board width', gap: 'Gap', stockBoardLength: 'Stock board length', joistSpacing: 'Support spacing', wastePercent: 'Extra material', fastenersPerIntersection: 'Fasteners per crossing', pricePerBoard: 'Price per board', safetyNote: 'Estimate only; joints require support.' },
    'roofing-calculator': { projectedArea: 'Projected roof area', areaUnit: 'Area unit', rise: 'Rise', run: 'Run', pitchUnit: 'Pitch unit', wastePercent: 'Extra material', bundlesPerSquare: 'Bundles per square', pricePerBundle: 'Price per bundle', safetyNote: 'Estimate only; verify measurements.' },
    'drywall-calculator': { roomLength: 'Room length', roomWidth: 'Room width', wallHeight: 'Wall height', openingArea: 'Opening area', roomCount: 'Room count', unit: 'Unit', includeCeiling: 'Surfaces', boardWidth: 'Board width', boardHeight: 'Board length', wastePercent: 'Extra material', screwsPerBoard: 'Screws per board', pricePerBoard: 'Price per board', accuracyNote: 'Area estimate; cuts and layout change actual quantity.' },
    'soil-calculator': { shape: 'Container shape', length: 'Inside length', width: 'Inside width', diameter: 'Inside diameter', depth: 'Fill depth', dimensionUnit: 'Dimension unit', containerCount: 'Number of containers', wastePercent: 'Extra soil', bagVolume: 'Bag volume', bagUnit: 'Bag volume unit', accuracyNote: 'Estimate only; tapered pots and settling change the actual amount.' },
    'pool-volume-calculator': { shape: 'Pool shape', length: 'Inside length', width: 'Inside width', ovalLength: 'Oval length', ovalWidth: 'Oval width', diameter: 'Inside diameter', floor: 'Floor type', shallowDepth: 'Shallow depth', deepDepth: 'Deep depth', dimensionUnit: 'Dimension unit', accuracyNote: 'Estimate only; steps and fill level change capacity.' },
    'roof-pitch-calculator': { rise: 'Vertical rise', run: 'Horizontal run', overhang: 'Eave overhang', unit: 'Length unit', safetyNote: 'Geometry only; confirm structure and local rules.' },
    'gravel-calculator': { shape: 'Shape', area: 'Area', depth: 'Depth', length: 'Length', width: 'Width', diameter: 'Diameter', base: 'Base', triangleHeight: 'Height', dimensionUnit: 'Dimension unit', depthUnit: 'Depth unit', density: 'Density', densityUnit: 'Density unit', waste: 'Waste', bagSize: 'Bag size', bagUnit: 'Bag unit' },
    'molar-mass-calculator': { formula: 'Formula', supportedHint: 'Selected elements and isotopes are supported.' },
    'auto-loan-refinance-calculator': { balance: 'Balance', currentApr: 'Current APR', currentMonths: 'Current months', newApr: 'New APR', newMonths: 'New months', fees: 'Fees', feeTreatment: 'Fee treatment', upfront: 'Upfront', rolledIn: 'Rolled in', currencyNote: 'Use one currency for all amounts.' },
    'secret-santa-generator': { names: 'Names', exclusions: 'Exclusions', exclusionsHint: 'One giver:recipient pair per line.' },
    'tire-size-calculator': { originalSize: 'Current tire size', replacementSize: 'New tire size', indicatedSpeed: 'Dashboard speed', speedUnit: 'Speed unit', fitmentNote: 'Nominal estimate only; check fitment with vehicle and tire maker.', relatedUnitConverter: 'Need to convert measurements? Open the unit converter.' },
    'stair-calculator': { totalRise: 'Total rise', riserCount: 'Number of risers', treadDepth: 'Tread depth', unit: 'Length unit', codeNote: 'Geometry only; check local rules.', relatedUnitConverter: 'Need to convert measurements? Open the unit converter.' },
    'asphalt-calculator': { area: 'Paved area', areaUnit: 'Area unit', compactedThickness: 'Compacted thickness', thicknessUnit: 'Thickness unit', density: 'Mix density', densityUnit: 'Density unit', wastePercent: 'Extra material', pricePerTonne: 'Price per tonne', accuracyNote: 'Estimate only; use supplier data.', relatedConcreteCalculator: 'Planning concrete? Use the concrete calculator.' },
    mancala: { mode: 'Mode', board: 'Kalah board', rules: 'Sow seeds around the board; skip the opponent store. Capture the opposite pit when the last seed lands in an empty pit on your side.' },
    'dominoes-game': { mode: 'Play mode', variant: 'Rules', board: 'Domino line', stock: 'Tiles left to draw', hand: 'Your tiles', opponentHand: "Opponent's tiles", accuracyNote: 'Local double-six game.', rules: 'Match an open end.' },
    hitori: { size: 'Grid size', difficulty: 'Difficulty', board: 'Hitori number grid', rules: 'Rules', accuracyNote: 'Unique local puzzles.', cell: 'Cell', row: 'row', column: 'column', black: 'black', white: 'white' },
    nurikabe: { difficulty: 'Difficulty', board: 'Nurikabe grid', rules: 'Rules', accuracyNote: 'Unique local puzzles.', cell: 'Cell', row: 'row', column: 'column', sea: 'sea', island: 'island' },
    'color-name-finder': { hexColor: 'Hex color', colorPreview: 'Choose a color', nearestNames: 'Closest CSS color names', exactMatchNote: 'Exact match.', paletteNote: 'Nearest names are approximations.' },
  'weight-loss-calculator': { currentWeight: 'Current weight', targetWeight: 'Goal weight', dailyDeficit: 'Daily deficit', unit: 'Weight unit', methodNote: '7,700 kcal per kg; simple arithmetic only.', healthNote: 'Not medical advice.', sourceNiddk: 'Model notes:', sourceCdc: 'Gradual change' },
    'heloc-calculator': { creditLimit: 'Credit limit', balance: 'Current balance', annualApr: 'Annual APR', drawMonths: 'Draw period in months', repaymentMonths: 'Repayment period in months', currency: 'Currency', accuracyNote: 'Fixed APR; no additional draws or fees are modeled.', relatedLoanCalculator: 'See loan payment calculator.' },
    'random-team-generator': { names: 'Names', teamCount: 'Number of teams', separations: 'Keep apart', separationsHint: 'One pair per line: Name A | Name B.', seed: 'Seed', seedHint: 'Reuse the same seed to reproduce a result.', privacyNote: 'Runs locally; no upload or server processing.', relatedNamePicker: 'Want to pick a winner instead? Try the random name picker.' },
    'mulch-calculator': { shape: 'Bed shape', dimensionUnit: 'Length unit', length: 'Bed length', width: 'Bed width', diameter: 'Bed diameter', bedCount: 'Number of beds', depth: 'Mulch depth', depthUnit: 'Depth unit', bagVolume: 'Bag volume', bagUnit: 'Bag unit', wastePercent: 'Extra material', pricePerBag: 'Price per bag', currency: 'Currency', currencyNote: 'Optional estimate only.', accuracyNote: 'Planning estimate; follow product label.', relatedGravelCalculator: 'Try the gravel calculator.', relatedSoilCalculator: 'Try the soil calculator.' },
    'paver-calculator': { length: 'Paved area length', width: 'Paved area width', surfaceUnit: 'Surface unit', moduleLength: 'Repeat module length', moduleWidth: 'Repeat module width', moduleUnit: 'Module unit', paversPerModule: 'Pavers per module', paverWastePercent: 'Extra pavers', baseDepth: 'Base depth', baseDepthUnit: 'Base-depth unit', baseWastePercent: 'Extra base', pricePerPaver: 'Price per paver', basePricePerM3: 'Base price per m³', currency: 'Currency', unitsNote: 'Module dimensions include joint spacing.', accuracyNote: 'Estimate only.', relatedTileCalculator: 'Try tile calculator.', relatedGravelCalculator: 'Try gravel calculator.' },
    'brick-calculator': { wallLength: 'Wall length', wallHeight: 'Wall height', wallUnit: 'Wall unit', brickLength: 'Brick length', brickHeight: 'Brick height', brickDepth: 'Brick depth', brickUnit: 'Brick unit', joint: 'Joint thickness', jointUnit: 'Joint unit', openingWidth: 'Opening width', openingHeight: 'Opening height', openingCount: 'Identical openings', wythes: 'Wall layers', wastePercent: 'Extra bricks', bagYieldLiters: 'Bag yield in litres', accuracyNote: 'Planning estimate only; verify dimensions and product coverage with the supplier.' },
    'rafter-calculator': { unit: 'Measurement unit', mode: 'Slope input', span: 'Full roof span', rise: 'Rise to ridge', pitch: 'Pitch', ridgeThickness: 'Ridge-board thickness', ridgeUnit: 'Ridge-board unit', overhang: 'Horizontal overhang', diagramLabel: 'Roof geometry diagram', accuracyNote: 'Geometry estimate only; not structural design.' },
    'carpet-calculator': { unit: 'Unit', roomLength: 'Room length', roomWidth: 'Room width', rollWidth: 'Carpet roll width', rooms: 'Number of identical rooms', pileDirection: 'Pile direction', wastePercent: 'Extra allowance', accuracyNote: 'Planning estimate only.' },
    'aquarium-calculator': { length: 'Inside length', width: 'Inside width', height: 'Inside height', dimensionUnit: 'Dimension unit', substrateDepth: 'Substrate depth', substrateSolidPercent: 'Solid share', airGap: 'Air gap', accuracyNote: 'Estimate only.' },
    'grass-seed-calculator': { area: 'Lawn area', areaUnit: 'Area unit', seedingRate: 'Seeding rate', rateUnit: 'Rate unit', wastePercent: 'Extra seed', varietyA: 'Seed variety A', percentA: 'Variety A share', varietyB: 'Seed variety B', percentB: 'Variety B share', bagSize: 'Bag size', bagUnit: 'Bag unit', accuracyNote: 'Use the product label; planning estimate only.' },
    'insulation-calculator': { unit: 'Input resistance unit', layerName1: 'Layer 1 name', layerResistance1: 'Layer 1 resistance', layerQuantity1: 'Layer 1 quantity', layerName2: 'Layer 2 name', layerResistance2: 'Layer 2 resistance', layerQuantity2: 'Layer 2 quantity', layerName3: 'Layer 3 name', layerResistance3: 'Layer 3 resistance', layerQuantity3: 'Layer 3 quantity', layerName4: 'Layer 4 name', layerResistance4: 'Layer 4 resistance', layerQuantity4: 'Layer 4 quantity', accuracyNote: 'Series layers only; no code compliance.' },
    'wall-framing-calculator': { wallLength: 'Wall length', wallHeight: 'Wall height', wallUnit: 'Wall unit', spacing: 'Maximum stud spacing', spacingUnit: 'Spacing unit', openingStart1: 'Opening 1 start', openingWidth1: 'Opening 1 width', breakBottomPlate1: 'Opening interrupts bottom plate', openingStart2: 'Opening 2 start', openingWidth2: 'Opening 2 width', breakBottomPlate2: 'Opening interrupts bottom plate', openingStart3: 'Opening 3 start', openingWidth3: 'Opening 3 width', breakBottomPlate3: 'Opening interrupts bottom plate', topPlateRows: 'Top plate rows', bottomPlateRows: 'Bottom plate rows', accuracyNote: 'Planning estimate only; not a structural plan.' },
    'electricity-cost-calculator': { ratePerKwh: 'Electricity price per kWh', billingDays: 'Billing period days', fixedCharge: 'Fixed charge', currency: 'Currency code', appliance1: 'Appliance 1', appliance2: 'Appliance 2', appliance3: 'Appliance 3', appliance4: 'Appliance 4', applianceName1: 'Name', applianceName2: 'Name', applianceName3: 'Name', applianceName4: 'Name', power1: 'Power', power2: 'Power', power3: 'Power', power4: 'Power', powerUnit1: 'Unit', powerUnit2: 'Unit', powerUnit3: 'Unit', powerUnit4: 'Unit', quantity1: 'Quantity', quantity2: 'Quantity', quantity3: 'Quantity', quantity4: 'Quantity', hours1: 'Hours per day', hours2: 'Hours per day', hours3: 'Hours per day', hours4: 'Hours per day', activeDays1: 'Active days', activeDays2: 'Active days', activeDays3: 'Active days', activeDays4: 'Active days', accuracyNote: 'Estimate only; actual energy and bills vary.' },
    'compost-calculator': { massUnit: 'Mass unit', targetMoisture: 'Target moisture', material1: 'Material 1', material2: 'Material 2', material3: 'Material 3', material4: 'Material 4', name1: 'Name', name2: 'Name', name3: 'Name', name4: 'Name', wetMass1: 'Wet mass', wetMass2: 'Wet mass', wetMass3: 'Wet mass', wetMass4: 'Wet mass', moisture1: 'Moisture', moisture2: 'Moisture', moisture3: 'Moisture', moisture4: 'Moisture', carbon1: 'Dry carbon %', carbon2: 'Dry carbon %', carbon3: 'Dry carbon %', carbon4: 'Dry carbon %', ratio1: 'C:N ratio', ratio2: 'C:N ratio', ratio3: 'C:N ratio', ratio4: 'C:N ratio', accuracyNote: 'Estimate only; enter dry-matter data.' },
    'pond-volume-calculator': { shape: 'Pond plan shape', length: 'Longest plan dimension', width: 'Shortest plan dimension or width', diameter: 'Pond diameter', dimensionUnit: 'Dimension unit', averageDepth: 'Average water depth', maximumDepth: 'Maximum pond depth', edgeOverlap: 'Edge overlap', fillPercent: 'Fill percentage', accuracyNote: 'Geometric estimate only.' },
    'fertilizer-calculator': { mode: 'Mode', productMode: 'Product amount', areaMode: 'Area and rate', productMass: 'Product mass', massUnit: 'Mass unit', area: 'Area', areaUnit: 'Area unit', productRate: 'Rate', rateUnit: 'Rate unit', nitrogenPercent: 'N percentage', phosphatePercent: 'P2O5 percentage', potashPercent: 'K2O percentage', accuracyNote: 'Use a user-entered rate only.' },
    'baluster-spacing-calculator': { mode: 'Method', maxGapMode: 'Find count from maximum gap', countMode: 'Calculate gap from count', openingWidth: 'Clear opening', balusterWidth: 'Baluster width', unit: 'Length unit', maximumGap: 'Maximum gap', balusterCount: 'Baluster count', accuracyNote: 'Layout estimate only.' },
    'retaining-wall-calculator': { wallLength: 'Straight wall length', wallHeight: 'Wall height', wallUnit: 'Wall unit', blockLength: 'Block length', blockHeight: 'Block height', blockDepth: 'Block depth', blockUnit: 'Block unit', joint: 'Joint thickness', baseWidth: 'Base width', baseDepth: 'Base depth', backfillThickness: 'Backfill thickness', wastePercent: 'Extra material allowance', accuracyNote: 'Planning estimate only.' },
    'battery-runtime-calculator': { capacityMode: 'Battery capacity format', energyMode: 'Energy rating', ampHourMode: 'Amp-hours and voltage', capacityEnergy: 'Battery energy capacity', energyUnit: 'Energy unit', capacityAh: 'Battery capacity', voltage: 'Voltage', loadWatts: 'Load power', depthOfDischargePercent: 'Depth of discharge', efficiencyPercent: 'Efficiency', accuracyNote: 'Runtime estimate only.' },
    'lumber-cut-calculator': { unit: 'Shared unit', stockLength: 'Stock length', kerf: 'Saw kerf', cutList: 'Cut list', accuracyNote: 'Planning heuristic only.' },
    'plant-spacing-calculator': { bedLength: 'Bed length', bedWidth: 'Bed width', inRowSpacing: 'In-row spacing', rowSpacing: 'Row spacing', unit: 'Unit', pattern: 'Pattern', accuracyNote: 'Geometry estimate only.' },
    'ev-charging-calculator': { batteryCapacityKwh: 'Battery capacity', startSocPercent: 'Starting charge', targetSocPercent: 'Target charge', chargerPowerKw: 'Charger power', efficiencyPercent: 'Efficiency', electricityRatePerKwh: 'Electricity rate', currency: 'Currency', accuracyNote: 'Estimate only.' },
    'rainwater-harvesting-calculator': { catchmentArea: 'Roof area', areaUnit: 'Area unit', rainfallUnit: 'Rainfall unit', rainfallValues: 'Monthly rainfall', runoffPercent: 'Runoff efficiency', tankCapacity: 'Tank capacity', tankUnit: 'Volume unit', startingStorage: 'Starting storage', monthlyDemandValues: 'Monthly demand', accuracyNote: 'Estimate only.' },
    'ramp-calculator': { rise: 'Vertical rise', slopeRatioDenominator: 'Ratio denominator', landingCount: 'Landing count', landingDepth: 'Landing depth', unit: 'Unit', safetyNote: 'Geometry only.' },
    'heat-loss-calculator': { areaUnit: 'Area unit', temperatureUnit: 'Temperature-difference unit', volumeUnit: 'Room volume unit', temperatureDifference: 'Indoor–outdoor temperature difference', wallArea: 'Wall area', wallUValue: 'Wall U-value', roofArea: 'Roof area', roofUValue: 'Roof U-value', windowArea: 'Window area', windowUValue: 'Window U-value', floorArea: 'Floor area', floorUValue: 'Floor U-value', roomVolume: 'Room volume', airChangesPerHour: 'Air changes per hour', accuracyNote: 'Simplified estimate only.' },
    'heat-pump-calculator': { heatOutput: 'Heat-output rate', heatOutputUnit: 'Heat-output unit', cop: 'Coefficient of performance', electricityRatePerKwh: 'Electricity rate', hoursPerDay: 'Operating hours', currency: 'Currency code', accuracyNote: 'Estimate only.' },
    'miter-angle-calculator': { mode: 'Cut type', cornerAngle: 'Inside corner angle', springAngle: 'Spring angle', accuracyNote: 'Geometry estimate only.', diagramLabel: 'Angle diagram', diagramCorner: 'Inside corner', diagramCut: 'Miter cut', diagramSpring: 'Spring angle' },
    'voltage-drop-calculator': { circuit: 'Circuit', dc: 'DC, two conductors', singlePhase: 'Single-phase AC', threePhase: 'Balanced three-phase AC', material: 'Conductor material', copper: 'Copper', aluminum: 'Aluminum', oneWayLength: 'One-way route length', lengthUnit: 'Length unit', currentA: 'Load current', crossSectionMm2: 'Cross-sectional area', supplyVoltageV: 'Supply voltage', powerFactor: 'Power factor', accuracyNote: 'Resistive estimate only.' },
    'molarity-calculator': { mode: 'Calculation', concentrationMode: 'Molarity from moles and solution volume', molesMode: 'Moles from concentration and solution volume', volumeMode: 'Solution volume from moles and concentration', soluteMassMode: 'Solute mass from concentration', prepareMode: 'Prepare target solution', moles: 'Moles', molarity: 'Molarity', volume: 'Solution volume', volumeUnit: 'Volume unit', molarMass: 'Molar mass', accuracyNote: 'Educational estimate only.' },
    'dilution-calculator': { mode: 'Dilution type', directMode: 'Direct dilution', serialMode: 'Equal-step serial dilution', stockConcentration: 'Stock concentration', targetConcentration: 'Target concentration', finalVolume: 'Final volume', volumeUnit: 'Volume unit', steps: 'Number of steps', accuracyNote: 'Math only; not a lab protocol.' },
    'ohms-law-calculator': { mode: 'Calculator mode', solverMode: 'Solve circuit values', networkMode: 'Equivalent resistor network', voltage: 'Voltage (V)', current: 'Current (A)', resistance: 'Resistance (Ω)', power: 'Power (W)', topology: 'Resistor connection', series: 'Series', parallel: 'Parallel', resistorValues: 'Resistor values in ohms', accuracyNote: 'Ideal DC math only; not electrical safety advice.' },
    'chemical-equation-balancer': { equation: 'Unbalanced equation', formulaHint: 'Use neutral formulas and one arrow.', accuracyNote: 'Educational atom-count balancing only.' },
    'gear-ratio-calculator': { stages: 'Driver teeth : driven teeth', stagesHint: 'One stage per line.', inputRpm: 'Input RPM', inputTorque: 'Input torque', driveType: 'Drive type', externalGears: 'External gears', chainDrive: 'Chain drive', efficiencyPercent: 'Efficiency per stage', accuracyNote: 'Ideal ratio arithmetic only.' },
    'density-calculator': { mode: 'Calculation mode', solveMode: 'Find a missing value', mixtureMode: 'Estimate a mixture', massKg: 'Mass (kg)', volumeM3: 'Volume (m3)', densityKgM3: 'Density (kg/m3)', components: 'Component mass,volume', componentsHint: 'One row per component.', accuracyNote: 'Mixture volumes are assumed additive.' },
    'kinetic-energy-calculator': { mode: 'Calculation mode', energyMode: 'Calculate energy from speed', speedMode: 'Solve speed from kinetic energy', massKg: 'Mass (kg)', velocityMps: 'Speed (m/s)', kineticEnergyJ: 'Kinetic energy (J)', heightM: 'Height above the zero reference (m)', gravityMps2: 'Gravitational acceleration (m/s²)', accuracyNote: 'Ideal estimate; ignores energy losses.' },
    'resistor-color-code-calculator': { mode: 'Choose a task', decodeMode: 'Decode band colors', encodeMode: 'Find bands from resistance', bands: 'Number of bands', fourBands: '4 bands', fiveBands: '5 bands', sixBands: '6 bands', resistanceOhms: 'Resistance in ohms', tolerance: 'Tolerance', temperatureCoefficient: 'Temperature coefficient', accuracyNote: 'Uses standard color codes.', band1: 'Band 1', band2: 'Band 2', band3: 'Band 3', band4: 'Band 4', band5: 'Band 5', band6: 'Band 6', black: 'Black', brown: 'Brown', red: 'Red', orange: 'Orange', yellow: 'Yellow', green: 'Green', blue: 'Blue', violet: 'Violet', gray: 'Gray', white: 'White', gold: 'Gold', silver: 'Silver', none: 'None', ppm250: '250 ppm/K', ppm100: '100 ppm/K', ppm50: '50 ppm/K', ppm25: '25 ppm/K', ppm20: '20 ppm/K', ppm15: '15 ppm/K', ppm10: '10 ppm/K', ppm5: '5 ppm/K', ppm1: '1 ppm/K', tolerance005: '0.05%', tolerance01: '0.1%', tolerance025: '0.25%', tolerance05: '0.5%', tolerance1: '1%', tolerance2: '2%', tolerance5: '5%', tolerance10: '10%', tolerance20: '20%' },
    'acceleration-calculator': { mode: 'Solve for', solveAcceleration: 'Acceleration', solveTime: 'Time', solveFinalVelocity: 'Final velocity', solveDisplacement: 'Displacement', units: 'Unit system', metric: 'Metric', imperial: 'Imperial', initialVelocity: 'Initial velocity', finalVelocity: 'Final velocity', acceleration: 'Acceleration', timeSeconds: 'Time in seconds', initialPosition: 'Initial position', accuracyNote: 'Constant acceleration only.' },
    'force-calculator': { mode: 'Calculation mode', solveForce: 'Solve force', solveMass: 'Solve mass', solveAcceleration: 'Solve acceleration', netMode: 'Add collinear forces', forceUnit: 'Force unit', massUnit: 'Mass unit', accelerationUnit: 'Acceleration unit', force: 'Force', mass: 'Mass', acceleration: 'Acceleration', forces: 'Signed forces', forcesHint: 'Enter 2–5 signed forces on one line.', netMass: 'Object mass', accuracyNote: 'Ideal one-dimensional mechanics only.' },
    'horsepower-calculator': { mode: 'Calculate', solvePower: 'Power from torque and RPM', solveTorque: 'Torque from power and RPM', solveRpm: 'RPM from power and torque', torque: 'Torque', torqueUnit: 'Torque unit', rpm: 'Engine speed (RPM)', power: 'Power', powerUnit: 'Power unit', accuracyNote: 'Ideal shaft power only.' },
    'compression-ratio-calculator': { unit: 'Measurement unit', volumeUnit: 'Volume unit', millimeters: 'Millimeters', inches: 'Inches', cubicCentimeters: 'Cubic centimeters', cubicInches: 'Cubic inches', bore: 'Bore', stroke: 'Stroke', chamberVolume: 'Chamber volume', gasketBore: 'Gasket bore', gasketThickness: 'Gasket thickness', deckClearance: 'Deck clearance', pistonCrownVolume: 'Piston dish/dome volume', cylinders: 'Cylinder count', accuracyNote: 'Static estimate only.' },
    'polynomial-long-division-calculator': { dividend: 'Dividend polynomial', divisor: 'Divisor polynomial', accuracyNote: 'Integer coefficients; maximum degree 20.' },
    'half-life-calculator': { mode: 'Value to solve', solveRemaining: 'Remaining amount', solveInitial: 'Initial amount', solveElapsed: 'Elapsed time', solveHalfLife: 'Half-life', initialAmount: 'Initial amount', remainingAmount: 'Remaining amount', halfLife: 'Half-life', elapsedTime: 'Elapsed time', timeUnit: 'Shared time unit', seconds: 'Seconds', minutes: 'Minutes', hours: 'Hours', days: 'Days', years: 'Years', accuracyNote: 'Educational equation only.' },
    'mortgage-points-calculator': { principal: 'Loan amount', termMonths: 'Loan term in months', rateWithoutPoints: 'APR without points', rateWithPoints: 'APR with points', pointsPercent: 'Points paid upfront (%)', horizonMonths: 'Comparison horizon in months', monthsLabel: 'months', accuracyNote: 'Estimate only; enter lender quotes.' },
    'trapezoid-calculator': { baseA: 'Bottom base', baseB: 'Top base', height: 'Perpendicular height', topOffset: 'Top base offset', unit: 'Unit', millimeters: 'Millimeters', centimeters: 'Centimeters', meters: 'Meters', inches: 'Inches', feet: 'Feet', accuracyNote: 'One unit for all lengths.', diagramLabel: 'Trapezoid geometry' },
    'prayer-times-calculator': { date: 'Date', latitude: 'Latitude', longitude: 'Longitude', utcOffset: 'UTC offset', method: 'Method', mwl: 'MWL', isna: 'ISNA', egypt: 'Egypt', makkah: 'Makkah', karachi: 'Karachi', france: 'France', russia: 'Russia', singapore: 'Singapore', asrMethod: 'Asr method', standard: 'Standard', hanafi: 'Hanafi', highLatitudeMethod: 'High-latitude adjustment', angleBased: 'Angle based', middleOfNight: 'Middle of night', oneSeventh: 'One seventh', noAdjustment: 'No adjustment', ramadan: 'Ramadan', accuracyNote: 'Approximate only.' },
    'goal-planner': { title: 'Goal title', outcome: 'Measurable outcome', metric: 'Measure', unit: 'Unit', startValue: 'Baseline', targetValue: 'Target', currentValue: 'Current', startDate: 'Start date', currentDate: 'Progress date', dueDate: 'Deadline', milestones: 'Milestones', milestoneHint: 'Date | milestone', accuracyNote: 'Linear progress only.', privacyNote: 'Local browser storage.', progressLabel: 'Progress', milestonesLabel: 'Milestones', backupFile: 'Restore JSON backup', backupHint: 'Choose a file up to 100 KB.', relatedTaskList: 'Task list' },
    'mind-map-maker': { centralTopic: 'Central topic', newIdea: 'New idea', privacyNote: 'Stays in this tab.', mapLabel: 'Mind map ideas', editIdea: 'Edit idea', moveTo: 'Move under', jsonFile: 'JSON backup', importHint: 'Maximum 500 KB.' },
    'mood-tracker': { date: 'Check-in date', mood: 'Mood rating', note: 'Optional note', tags: 'Emotion tags', saveConsent: 'Save in this browser', privacyNote: 'No cloud sync.', consentHint: 'Storage is optional.', calendarLabel: 'Mood calendar', monthLabel: 'Month', selectedEntry: 'Selected check-in', weekdaySun: 'Sun', weekdayMon: 'Mon', weekdayTue: 'Tue', weekdayWed: 'Wed', weekdayThu: 'Thu', weekdayFri: 'Fri', weekdaySat: 'Sat', mood1: 'Very low', mood2: 'Low', mood3: 'Neutral', mood4: 'Good', mood5: 'Very good', tagCalm: 'Calm', tagAnxious: 'Anxious', tagSad: 'Sad', tagHappy: 'Happy', tagTired: 'Tired', tagFocused: 'Focused', tagStressed: 'Stressed', tagHopeful: 'Hopeful', tagGrateful: 'Grateful', tagAngry: 'Angry', summaryLabel: 'Last 7 days', averageLabel: 'Average', countLabel: 'Days', distributionLabel: 'Distribution', noEntries: 'No entries.', accuracyNote: 'Not a diagnostic tool.', importHint: 'JSON up to 500 KB.', sourceNote: 'Seek local support if needed.' },
    'journal-online': { date: 'Entry date', title: 'Title', body: 'Journal entry', tags: 'Tags', search: 'Search', dateFrom: 'From date', dateTo: 'To date', saveConsent: 'Save in this browser', storageNote: 'Browser storage is not encrypted.', encryptionNote: 'Encrypted backup is optional.', backupPassword: 'Backup password', confirmPassword: 'Confirm password', entriesLabel: 'Entries', resultLabel: 'Selected entry', noEntries: 'No matching entries.', countLabel: 'Matching entries', tagHint: 'Comma-separated tags.', importHint: 'JSON up to 10 MB.', passwordHint: 'Password is not stored.', exampleHint: 'Example is not saved automatically.', exampleTitle: 'A small moment', exampleBody: 'Write a few lines about today.', exampleTags: 'reflection, sample', safetyNote: 'Not a medical service.' },
    'travel-itinerary-planner': { tripName: 'Trip name', tripStartDate: 'First day', tripEndDate: 'Last day', bufferMinutes: 'Connection buffer', saveConsent: 'Save in this browser', storageNote: 'Optional browser storage.', itemDate: 'Date', startTime: 'Start time', endTime: 'End time', itemTitle: 'Activity name', category: 'Type', categories: { activity: 'Activity', meal: 'Meal', transport: 'Transport', stay: 'Stay', reservation: 'Reservation', other: 'Other' }, location: 'Place', reservation: 'Reservation details', notes: 'Notes', itineraryLabel: 'Itinerary', noTrip: 'Create a trip.', noItems: 'No stops yet.', itemCount: 'Stops', overlapCount: 'Overlaps', bufferWarningCount: 'Short connections', conflictsLabel: 'Schedule checks', backupFile: 'Import JSON', backupHint: 'JSON up to 1 MB.', limitNote: 'Maximum 366 days and 250 stops.', timeZoneNote: 'Times stay as entered.', reservationPrivacyNote: 'Do not enter passwords or card details.', exampleTrip: 'Sample trip', exampleActivity: 'Sample activity', exampleMeal: 'Sample meal', exampleLocation: 'Sample place', exampleReservation: 'Sample only' },
    'density-calculator': { mode: 'Calculation mode', solveMode: 'Find a missing value', mixtureMode: 'Estimate a mixture', massKg: 'Mass (kg)', volumeM3: 'Volume (m3)', densityKgM3: 'Density (kg/m3)', components: 'Component mass,volume', componentsHint: 'One row per component.', accuracyNote: 'Mixture volumes are assumed additive.' },
  }[tool.id];
  if (tool.id === 'tire-size-calculator') {
    Object.assign(actions, { kmh: 'Kilometres per hour (km/h)', mph: 'Miles per hour (mph)' });
  }
  if (tool.id === 'pool-volume-calculator') Object.assign(actions, { oval: 'Oval', flat: 'Flat floor', sloped: 'Sloped floor' });
  if (tool.id === 'roof-pitch-calculator') Object.assign(actions, { millimeters: 'Millimeters' });
  if (tool.id === 'carpet-calculator') Object.assign(actions, { eitherDirection: 'Use less material', alongRoomLength: 'Along room length', alongRoomWidth: 'Along room width' });
  if (tool.id === 'aquarium-calculator') Object.assign(actions, { centimeters: 'Centimetres', inches: 'Inches', liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons' });
  if (tool.id === 'grass-seed-calculator') Object.assign(actions, { m2: 'Square metres', ft2: 'Square feet', acre: 'Acres', gM2: 'g/m²', lb1000ft2: 'lb/1,000 ft²', kg: 'kg', lb: 'lb' });
  if (tool.id === 'insulation-calculator') Object.assign(actions, { R: 'US R-value (ft²·°F·h/Btu)', RSI: 'Metric RSI (m²·K/W)' });
  if (tool.id === 'wall-framing-calculator') Object.assign(actions, { meters: 'Metres', feet: 'Feet', centimeters: 'Centimetres', millimeters: 'Millimetres', inches: 'Inches' });
  if (tool.id === 'electricity-cost-calculator') Object.assign(actions, { watts: 'Watts', kilowatts: 'Kilowatts' });
  if (tool.id === 'compost-calculator') Object.assign(actions, { kilograms: 'Kilograms', pounds: 'Pounds' });
  if (tool.id === 'pond-volume-calculator') Object.assign(actions, { rectangle: 'Rectangle', circle: 'Circle', oval: 'Oval', meters: 'Meters', feet: 'Feet' });
  if (tool.id === 'fertilizer-calculator') Object.assign(actions, { kilograms: 'Kilograms', pounds: 'Pounds', squareMeters: 'Square meters', hectares: 'Hectares', squareFeet: 'Square feet', acres: 'Acres', kg100m2: 'kg per 100 m2', kgHa: 'kg per hectare', lb1000ft2: 'lb per 1000 ft2', lbAcre: 'lb per acre' });
  if (tool.id === 'baluster-spacing-calculator') Object.assign(actions, { millimeters: 'Millimeters', centimeters: 'Centimeters', meters: 'Meters', inches: 'Inches', feet: 'Feet' });
  if (tool.id === 'retaining-wall-calculator') Object.assign(actions, { meters: 'Meters', centimeters: 'Centimeters', feet: 'Feet', inches: 'Inches' });
  if (tool.id === 'battery-runtime-calculator') Object.assign(actions, { wh: 'Watt-hours', kwh: 'Kilowatt-hours' });
  if (tool.id === 'lumber-cut-calculator') Object.assign(actions, { millimeters: 'Millimeters', centimeters: 'Centimeters', meters: 'Meters', inches: 'Inches', feet: 'Feet' });
  if (tool.id === 'plant-spacing-calculator') Object.assign(actions, { millimeters: 'Millimeters', centimeters: 'Centimeters', meters: 'Meters', inches: 'Inches', feet: 'Feet', grid: 'Grid', triangular: 'Triangular', squareUnits: 'square units' });
  if (tool.id === 'ev-charging-calculator') Object.assign(actions, { kwh: 'Kilowatt-hours', kw: 'Kilowatts', percent: 'Percent' });
  if (tool.id === 'rainwater-harvesting-calculator') Object.assign(actions, { squareMeters: 'Square meters', squareFeet: 'Square feet', millimeters: 'Millimeters', inches: 'Inches', liters: 'Liters', usGallons: 'US gallons' });
  if (tool.id === 'ramp-calculator') Object.assign(actions, { millimeters: 'Millimeters', centimeters: 'Centimeters', meters: 'Meters', inches: 'Inches', feet: 'Feet' });
  if (tool.id === 'heat-loss-calculator') Object.assign(actions, { squareMeters: 'Square meters', squareFeet: 'Square feet', cubicMeters: 'Cubic meters', cubicFeet: 'Cubic feet', kelvin: 'Kelvin difference', fahrenheit: 'Fahrenheit difference' });
  if (tool.id === 'heat-pump-calculator') Object.assign(actions, { kilowatts: 'Kilowatts (kW)', btuPerHour: 'BTU per hour (BTU/h)' });
  if (tool.id === 'miter-angle-calculator') Object.assign(actions, { simpleMode: 'Simple miter', compoundMode: 'Compound miter' });
  if (tool.id === 'voltage-drop-calculator') Object.assign(actions, { meters: 'Meters', feet: 'Feet' });
  if (tool.id === 'molarity-calculator') Object.assign(actions, { liters: 'Liters', milliliters: 'Milliliters' });
  if (tool.id === 'dilution-calculator') Object.assign(actions, { liters: 'Liters', milliliters: 'Milliliters' });
  if (tool.id === 'drywall-calculator') Object.assign(actions, { millimeters: 'Millimeters', withCeiling: 'Walls and ceiling', wallsOnly: 'Walls only' });
  if (tool.id === 'roofing-calculator') Object.assign(actions, { squareMeters: 'Square metres', squareFeet: 'Square feet' });
  if (tool.id === 'deck-calculator') Object.assign(actions, { millimeters: 'Millimeters' });
  if (tool.id === 'fence-calculator') Object.assign(actions, { millimeters: 'Millimeters' });
  if (tool.id === 'pool-salt-calculator') Object.assign(actions, { liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons' });
  if (tool.id === 'image-region-redactor') Object.assign(actions, { load: 'Choose image', addRegion: 'Add region', undo: 'Undo last region', clear: 'Remove all regions', export: 'Apply redactions', removeRegion: 'Remove region', black: 'Solid black', pixelate: 'Pixelate', blur: 'Blur', png: 'PNG', jpeg: 'JPEG' });
  if (tool.id === 'image-upscaler') Object.assign(actions, { upscale: 'Upscale 2×', cancel: 'Cancel processing' });
  if (tool.id === 'dominoes-game') Object.assign(actions, { draw: 'Draw a tile', pass: 'Pass', playLeft: 'Play left', playRight: 'Play right', drawRule: 'Draw dominoes', blockRule: 'Block dominoes' });
  if (tool.id === 'hitori') Object.assign(actions, { checkBoard: 'Check board', hint: 'One-cell hint', clearMarks: 'Clear marks', easy: 'Easy', medium: 'Medium', hard: 'Hard' });
  if (tool.id === 'nurikabe') Object.assign(actions, { checkBoard: 'Check board', hint: 'One-cell hint', clearMarks: 'Clear sea marks', easy: 'Easy', medium: 'Medium', hard: 'Hard' });
  if (tool.id === 'color-name-finder') Object.assign(actions, { findName: 'Find color name', copyName: 'Copy closest name', copyHex: 'Copy hex value' });
  if (tool.id === 'photo-to-sketch') Object.assign(actions, { load: 'Choose image', export: 'Create sketch PNG', cancel: 'Cancel processing', download: 'Download sketch PNG', original: 'Show original' });
  if (tool.id === 'schema-markup-validator') Object.assign(actions, { validate: 'Validate markup', example: 'Load example', copySummary: 'Copy summary' });
  if (tool.id === 'weight-loss-calculator') Object.assign(actions, { dayUnit: 'days', weekUnit: 'weeks', kilocalories: 'kcal', perWeek: 'per week' });
  if (tool.id === 'paver-calculator') Object.assign(actions, { squareMeters: 'Square metres', squareFeet: 'Square feet' });
  const deckMessages = tool.id === 'deck-calculator' ? { area: 'Deck area', boardRows: 'Board rows', coveredWidth: 'Covered width', orderLength: 'Order length', boards: 'Boards to order', supportLines: 'Support lines', fasteners: 'Fasteners', joints: 'End joints', estimatedCost: 'Estimated cost', costNotEntered: 'Enter a board price.' } : {};
  const fenceMessages = tool.id === 'fence-calculator' ? { totalRun: 'Total run', gateOpening: 'Gate openings', fenceLength: 'Fence length', sections: 'Fence sections', averageSection: 'Average section', posts: 'Posts', panels: 'Panels to order', pickets: 'Pickets to order', picketGap: 'Adjusted picket gap', picketLength: 'Total picket cut length', extra: 'extra', onePicket: 'One picket per section', panelCost: 'Panel-option cost', picketCost: 'Picket-option cost' } : {};
  const localizedMessages = tool.id === 'stair-calculator' ? { ...messages, riserHeight: 'Riser height', treadCount: 'Tread count', totalRun: 'Total run', angle: 'Angle', stringerLength: 'Stringer length', diagram: 'Stair side view' } : messages;
  const asphaltMessages = tool.id === 'asphalt-calculator' ? { ...messages, compactedVolume: 'Compacted volume', orderVolume: 'Order volume', metricTonnes: 'Metric tonnes', shortTons: 'US short tons', estimatedCost: 'Estimated material cost' } : {};
  const poolMessages = tool.id === 'pool-volume-calculator' ? { liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons', averageDepth: 'Average depth' } : {};
  const saltMessages = tool.id === 'pool-salt-calculator' ? { noSaltNeeded: 'No salt needed.', poolVolume: 'Pool volume', currentSalinity: 'Current salinity', targetSalinity: 'Target salinity', increase: 'Salinity increase', pureSalt: 'Pure salt amount', saltToAdd: 'Salt to add', bags: 'Bags to buy' } : {};
  const roofMessages = tool.id === 'roof-pitch-calculator' ? { angleDegrees: 'Angle', angleRadians: 'Angle in radians', slopePercent: 'Slope', pitch: 'Rise per 12 run', rafterLength: 'Rafter length' } : {};
  const drywallMessages = tool.id === 'drywall-calculator' ? { wallArea: 'Net wall area', ceilingArea: 'Ceiling area', totalArea: 'Total surface area', boardCount: 'Whole boards', boardCoverage: 'Board coverage', estimatedScrews: 'Estimated screws', jointSeams: 'Approximate joint seams', estimatedCost: 'Estimated board cost', costNotEntered: 'Enter a board price.' } : {};
  const roofingMessages = tool.id === 'roofing-calculator' ? { projectedArea: 'Projected area', roofArea: 'Sloped roof area', extraArea: 'Area with extra material', pitch: 'Pitch', slopeFactor: 'Slope multiplier', roofingSquares: 'Roofing squares', bundles: 'Bundles', estimatedCost: 'Estimated cost', costNotEntered: 'Enter a bundle price.' } : {};
  const redactorMessages = tool.id === 'image-region-redactor' ? { unsupportedImage: 'Choose a supported raster image.', imageTooLarge: 'Image too large for this tab.', imageReady: 'Image ready.', selectImage: 'Choose an image first.', invalidRegion: 'Check the pixel region.', regionAdded: 'Region added.', regionRemoved: 'Region removed.', regionsCleared: 'All regions removed.', addRegionFirst: 'Add a region first.', exporting: 'Applying regions…', exportFailed: 'Could not create the image.', exportReady: 'Redacted image ready.', region: 'Region' } : {};
  const upscalerMessages = tool.id === 'image-upscaler' ? { unsupportedImage: 'Choose a supported image.', imageTooLarge: 'Image exceeds 1 megapixel.', imageReady: 'Image ready.', selectImage: 'Choose an image first.', modelLoading: 'Loading the local model.', processing: 'Processing tiles.', cancelled: 'Processing cancelled.', workerUnavailable: 'Local worker unavailable.', processingFailed: 'Processing failed.', outputReady: '2× image ready.' } : {};
  const dominoMessages = tool.id === 'dominoes-game' ? { played: 'Tile played.', drew: 'Tile drawn.', passed: 'Turn passed.', noMoves: 'No legal move.', stockEmpty: 'The draw pile is empty.' } : {};
  const hitoriMessages = tool.id === 'hitori' ? { newPuzzle: 'New puzzle ready.', solved: 'Solved!', duplicateWhite: 'Repeated white number.', adjacentBlack: 'Black cells touch.', disconnectedWhite: 'White cells are disconnected.', hintBlack: 'Cross this number out.', hintWhite: 'Keep this number white.', noHint: 'Already solved.', marksCleared: 'Marks cleared.', markedBlack: 'Marked black.', markedWhite: 'Marked white.', generationFailed: 'Could not create the puzzle.' } : {};
  const nurikabeMessages = tool.id === 'nurikabe' ? { newPuzzle: 'New puzzle ready.', solved: 'Solved! The islands and sea follow every rule.', clueInSea: 'A numbered clue is marked as sea.', seaSquare: 'Four sea cells make a 2×2 square.', seaDisconnected: 'All sea cells must connect by sides.', islandsTouch: 'Two numbered islands touch by a side.', islandWithoutClue: 'A land region has no numbered clue.', islandSize: 'An island does not match its clue size.', hintSea: 'This cell is sea.', hintIsland: 'Keep this cell in an island.', noHint: 'The puzzle is already solved.', marksCleared: 'Sea marks cleared.', markedSea: 'Marked as sea.', markedIsland: 'Sea mark cleared.', generationFailed: 'Could not create a puzzle. Try again.' } : {};
  const colorNameMessages = tool.id === 'color-name-finder' ? { found: 'Matches ready.', checkColor: 'Enter a valid hex color.', copied: 'Copied.', copyUnavailable: 'Copy unavailable.', exactMatch: 'Exact CSS match.', nearestMatch: 'Closest CSS names found.', distance: 'Perceptual distance' } : {};
  const photoToSketchMessages = tool.id === 'photo-to-sketch' ? { unsupportedImage: 'Choose a supported image.', imageTooLarge: 'Image exceeds 8 megapixels.', imageReady: 'Image ready.', selectImage: 'Choose an image first.', exporting: 'Creating sketch…', cancelled: 'Processing cancelled.', exportFailed: 'Could not create PNG.', exportReady: 'Sketch PNG ready.' } : {};
  const schemaValidatorMessages = tool.id === 'schema-markup-validator' ? { invalidJson: 'Invalid JSON.', rootNotObject: 'Expected an object.', inputTooLarge: 'Input too long.', loadingVocabulary: 'Loading vocabulary.', vocabularyUnavailable: 'Vocabulary unavailable.', valid: 'Valid JSON.', invalid: 'Invalid JSON.', unknownType: 'Unknown type.', unknownProperty: 'Unknown property.', noTypedEntity: 'No typed entity.', exampleLoaded: 'Example loaded.', copied: 'Copied.', copyUnavailable: 'Copy unavailable.' } : {};
  const readabilityMessages = tool.id === 'readability-checker' ? { emptyInput: 'Enter text.', inputTooLarge: 'Text too long.', noScore: 'No score.', shortSample: 'Short sample.', analyzed: 'Results ready.', exampleLoaded: 'Example loaded.', analyzeFirst: 'Analyze first.', copied: 'Copied.', copyUnavailable: 'Copy unavailable.' } : {};
  const savingsGoalMessages = tool.id === 'savings-goal-calculator' ? { calculated: 'Estimate ready.', checkInputs: 'Check inputs.', exampleLoaded: 'Example loaded.', calculateFirst: 'Calculate first.', copied: 'Copied.', copyUnavailable: 'Copy unavailable.', unreachable: 'Goal unreachable.', horizonCapped: 'Not reached in 100 years.', alreadyReached: 'Already reached.' } : {};
  const severanceMessages = tool.id === 'severance-pay-calculator' ? { calculated: 'Estimate ready.', checkInputs: 'Check inputs.', calculationFailed: 'Could not calculate.', exampleLoaded: 'Example loaded.', calculateFirst: 'Calculate first.', copied: 'Copied.', copyUnavailable: 'Copy unavailable.', belowServiceMinimum: 'Fewer than two completed service years.', capApplied: 'A statutory cap applied.', noCapApplied: 'No weekly cap applied.', customAssumptions: 'Calculated from your assumptions only.' } : {};
  const divisibilityMessages = tool.id === 'divisibility-calculator' ? { calculated: 'Results ready.', checkInputs: 'Check entries.', exampleLoaded: 'Example loaded.', commonDivisorsLoaded: 'Common divisors loaded.', calculateFirst: 'Check a number first.', copied: 'Copied.', copyUnavailable: 'Copy unavailable.', divisible: 'Divisible', notDivisible: 'Not divisible' } : {};
  const numberLineMessages = tool.id === 'number-line-graphing-tool' ? { calculated: 'Number line ready.', checkInputs: 'Check interval endpoints.', exampleLoaded: 'Example loaded.', downloaded: 'SVG downloaded.' } : {};
  const laplaceMessages = tool.id === 'laplace-transform-calculator' ? { calculated: 'Transform ready.', checkInputs: 'Check the expression.', exampleLoaded: 'Example loaded.' } : {};
  const vectorMessages = tool.id === 'vector-calculator' ? { calculated: 'Vector operation ready.', checkInputs: 'Check entries.', exampleLoaded: 'Example loaded.', missingComponent: 'Enter all vector components.', componentOutOfRange: 'Components out of range.', invalidDimension: 'Choose 2D or 3D.', zeroNormalize: 'Cannot normalize zero.', zeroAngle: 'Angle undefined for zero.', zeroProjection: 'Cannot project onto zero.', invalidOperation: 'Choose an operation.', resultOutOfRange: 'Result out of range.' } : {};
  const equationMessages = tool.id === 'cubic-quartic-equation-calculator' ? { calculated: 'Root estimates ready.', checkInputs: 'Check entries.', exampleLoaded: 'Example loaded.', invalidDegree: 'Choose degree 3 or 4.', missingCoefficient: 'Enter every coefficient.', coefficientOutOfRange: 'Coefficient outside range.', zeroLeadingCoefficient: 'Leading coefficient cannot be zero.', illConditioned: 'Leading coefficient too small.', rangeTooWide: 'Root range too wide.', calculationFailed: 'Could not calculate reliably.', noRealRoots: 'No real roots.' } : {};
  const weightMessages = tool.id === 'weight-loss-calculator' ? { weightToLose: 'Weight difference', energyEquivalent: 'Linear energy equivalent', timeline: 'Timeline', weeklyRate: 'Weekly rate', noDeficitChange: 'Zero modeled change.', paceNote: 'This is not a recommended target.' } : {};
  const helocMessages = tool.id === 'heloc-calculator' ? { interestOnlyPayment: 'Interest-only payment', availableCredit: 'Available credit', repaymentPayment: 'Repayment payment', paymentChange: 'Payment change', drawInterest: 'Draw-period interest', repaymentInterest: 'Repayment interest', totalInterest: 'Total modeled interest', totalPayments: 'Total payments', estimateOnly: 'Illustration only; actual HELOC terms vary.' } : {};
  const teamMessages = tool.id === 'random-team-generator' ? { generated: 'Teams generated.', invalidCount: 'Enter 2 to 60 names and a valid team count.', duplicateName: 'Names must be unique.', invalidPair: 'Check keep-apart pair format.', unknownName: 'A rule contains an unknown name.', incompatible: 'These rules cannot fit the selected team count.', searchLimit: 'Local search limit reached; simplify the rules.', downloadReady: 'CSV downloaded.', seedUnavailable: 'Secure randomness is unavailable.' } : {};
  const paverMessages = tool.id === 'paver-calculator' ? { perimeter: 'Edge perimeter', moduleCount: 'Complete repeat modules', paversBeforeWaste: 'Pavers before extra allowance', paversToBuy: 'Pavers to buy', baseVolume: 'Base-layer volume', baseOrderVolume: 'Base volume with allowance', paverCost: 'Estimated paver cost', baseCost: 'Estimated base cost', totalCost: 'Estimated total material cost', costNotEntered: 'Enter a price to estimate cost.' } : {};
  const brickMessages = tool.id === 'brick-calculator' ? { grossArea: 'Gross wall area', netArea: 'Wall area after openings', courses: 'Approximate courses', bricksPerCourse: 'Average bricks per course', bricksBeforeWaste: 'Bricks before extra allowance', bricksToOrder: 'Bricks to order', mortarVolume: 'Approximate mortar volume', mortarBags: 'Mortar bags by entered yield' } : {};
  const rafterMessages = tool.id === 'rafter-calculator' ? { effectiveRun: 'Horizontal run to ridge', rafterLength: 'Geometric rafter length', pitch: 'Pitch (rise per 12)', roofAngle: 'Roof angle', plumbCut: 'Plumb-cut angle', overhangRun: 'Horizontal overhang' } : {};
  const carpetMessages = tool.id === 'carpet-calculator' ? { floorArea: 'Total floor area', pileDirection: 'Selected pile direction', cuts: 'Full-width cuts per room', seams: 'Seams per room', cutLength: 'Length of each cut', orderLength: 'Continuous roll length to order', purchasedArea: 'Approximate purchased area', alternative: 'Other orientation' } : {};
  const aquariumMessages = tool.id === 'aquarium-calculator' ? { tankVolume: 'Geometric capacity', substrateDisplacement: 'Substrate displacement', airSpace: 'Air-space volume', waterVolume: 'Water volume', waterMassKg: 'Water mass', waterMassLb: 'Water mass' } : {};
  const grassSeedMessages = tool.id === 'grass-seed-calculator' ? { baseSeed: 'Seed before extra allowance', extraSeed: 'Seed allowance', totalSeed: 'Estimated seed to buy', bags: 'Whole bags' } : {};
  const insulationMessages = tool.id === 'insulation-calculator' ? { layerTotal: 'Layers included', totalR: 'Total US thermal resistance', totalRsi: 'Total metric thermal resistance', uFactorUs: 'Reciprocal U-factor (US)', uFactorSi: 'Reciprocal U-factor (SI)' } : {};
  const wallFramingMessages = tool.id === 'wall-framing-calculator' ? { studCount: 'Stud positions counted', studPositions: 'Stud positions from left end', studLinearLength: 'Total stud linear length', openings: 'Openings entered', topPlateMaterial: 'Top plate length', bottomPlateMaterial: 'Bottom plate length', totalPlateMaterial: 'Total plate length', rows: 'rows' } : {};
  const electricityCostMessages = tool.id === 'electricity-cost-calculator' ? { applianceBreakdown: 'Appliance estimate', energyKwh: 'Energy in this billing period', energyCost: 'Energy charge', fixedCharge: 'Fixed charge', totalCost: 'Estimated total for this period', averageDailyKwh: 'Average energy per day', averageDailyCost: 'Average cost per day', quantity: 'units', hours: 'hours/day', days: 'days' } : {};
  const compostMessages = tool.id === 'compost-calculator' ? { wetMass: 'Total wet mass', dryMass: 'Estimated dry mass', waterMass: 'Estimated water mass', carbonMass: 'Estimated carbon mass', nitrogenMass: 'Estimated nitrogen mass', mixRatio: 'Estimated mix C:N ratio', mixMoisture: 'Estimated mix moisture', targetMoisture: 'Entered target moisture', waterToAdd: 'Estimated water to add', waterToRemove: 'Estimated water to remove', perMaterial: 'Material' } : {};
  const pondMessages = tool.id === 'pond-volume-calculator' ? { footprint: 'Pond footprint area', geometricCapacity: 'Geometric capacity at average depth', filledVolume: 'Estimated water volume at fill level', liters: 'Liters', usGallons: 'US gallons', imperialGallons: 'Imperial gallons', linerLength: 'Estimated liner sheet length', linerWidth: 'Estimated liner sheet width', linerArea: 'Estimated rectangular liner area' } : {};
  const fertilizerMessages = tool.id === 'fertilizer-calculator' ? { productMass: 'Estimated fertilizer product mass', nitrogenMass: 'Nitrogen (N)', phosphateMass: 'Phosphate equivalent (P2O5)', potashMass: 'Potash equivalent (K2O)' } : {};
  const balusterMessages = tool.id === 'baluster-spacing-calculator' ? { balusterCount: 'Balusters to fit', gapCount: 'Equal clear gaps, including both ends', uniformClearGap: 'Uniform clear gap', totalBalusterWidth: 'Total width of all balusters', totalClearGap: 'Total width of all clear gaps' } : {};
  const retainingWallMessages = tool.id === 'retaining-wall-calculator' ? { courses: 'Whole block courses', blocksPerCourse: 'Blocks per course', blocksBeforeWaste: 'Blocks before extra allowance', blocksToOrder: 'Blocks to order', baseMaterial: 'Base material to order', backfill: 'Rectangular backfill to order' } : {};
  const batteryRuntimeMessages = tool.id === 'battery-runtime-calculator' ? { nominalEnergy: 'Nominal battery energy', usableEnergy: 'Estimated usable energy', runtimeHours: 'Estimated runtime', runtimeDays: 'Equivalent days at this constant load' } : {};
  const lumberCutMessages = tool.id === 'lumber-cut-calculator' ? { stockBoards: 'Stock boards needed', pieces: 'Pieces', totalStock: 'Total stock length', totalCut: 'Total requested cut length', totalKerf: 'Total kerf allowance', totalOffcut: 'Total remaining offcut', lowerBound: 'Theoretical board lower bound', board: 'Board', remaining: 'remaining', kerf: 'kerf' } : {};
  const plantSpacingMessages = tool.id === 'plant-spacing-calculator' ? { totalPlants: 'Estimated plants', rows: 'Rows', plantsPerRow: 'Plants per even / offset row', bedArea: 'Bed area', plantDensity: 'Estimated density', plantsPerArea: 'plants per square unit' } : {};
  const evChargingMessages = tool.id === 'ev-charging-calculator' ? { batteryEnergy: 'Energy added to battery', gridEnergy: 'Estimated energy from grid', chargingTime: 'Estimated constant-power time', estimatedCost: 'Estimated electricity cost' } : {};
  const rainwaterMessages = tool.id === 'rainwater-harvesting-calculator' ? { totalCollected: 'Potential collected', totalDemand: 'Demand', totalOverflow: 'Overflow', unmetDemand: 'Unmet demand', endingStorage: 'Ending storage', rainfall: 'rainfall', collected: 'collected', demand: 'demand', overflow: 'overflow', storage: 'ending tank', months: Array.from({ length: 12 }, (_, index) => `Month ${index + 1}`) } : {};
  const rampMessages = tool.id === 'ramp-calculator' ? { horizontalRun: 'Horizontal ramp run', rampSurface: 'Sloped ramp surface length', landings: 'Landings (count × depth)', totalHorizontal: 'Total horizontal length including landings', slopePercent: 'Chosen slope percentage', angle: 'Slope angle' } : {};
  const heatLossMessages = tool.id === 'heat-loss-calculator' ? { wallLoss: 'Wall transmission', roofLoss: 'Roof transmission', windowLoss: 'Window transmission', floorLoss: 'Floor transmission', transmissionLoss: 'Total transmission', ventilationLoss: 'Ventilation estimate', totalLoss: 'Total estimated heat loss' } : {};
  const heatPumpMessages = tool.id === 'heat-pump-calculator' ? { heatOutputKw: 'Heat-output rate', electricalInput: 'Estimated electrical input power', dailyEnergy: 'Heat-pump electricity per day', monthlyEnergy: 'Heat-pump electricity per 30 days', dailyCost: 'Heat-pump cost per day', monthlyCost: 'Heat-pump cost per 30 days', resistanceDailyEnergy: 'Resistance-heater baseline energy per day (COP 1)', resistanceDailyCost: 'Resistance-heater baseline cost per day', dailyEnergyDifference: 'Estimated daily energy saved vs COP 1 baseline', dailyCostDifference: 'Estimated daily cost difference vs COP 1 baseline' } : {};
  const miterMessages = tool.id === 'miter-angle-calculator' ? { miterSetting: 'Miter-saw setting', bevelSetting: 'Bevel-saw setting', halfCorner: 'Half of inside corner' } : {};
  const voltageDropMessages = tool.id === 'voltage-drop-calculator' ? { voltageDrop: 'Estimated voltage drop', voltageDropPercent: 'Drop as a share of supply voltage', estimatedReceivingVoltage: 'Estimated voltage at load', resistancePerConductor: 'Reference resistance per conductor' } : {};
  const molarityMessages = tool.id === 'molarity-calculator' ? { concentrationResult: 'Solution concentration', molesResult: 'Amount of solute', volumeResult: 'Total solution volume', soluteMassResult: 'Solute mass', soluteForSolutionResult: 'Solute mass for target solution', finalVolume: 'Target final solution volume' } : {};
  const dilutionMessages = tool.id === 'dilution-calculator' ? { stockAliquot: 'Stock-solution volume', diluent: 'Additional diluent volume', dilutionFactor: 'Total dilution factor', steps: 'Serial step count', perStepFactor: 'Dilution factor per step', transferVolume: 'Transfer volume per step', totalDilutionFactor: 'Total dilution factor' } : {};
  const ohmsMessages = tool.id === 'ohms-law-calculator' ? { solvedVoltage: 'Voltage', solvedCurrent: 'Current', solvedResistance: 'Resistance', solvedPower: 'Power', equivalentResistance: 'Equivalent resistance', resistorCount: 'Resistor count', topology: 'Connection' } : {};
  const chemicalMessages = tool.id === 'chemical-equation-balancer' ? { balancedEquation: 'Balanced equation', atomCheck: 'Atom count', leftSide: 'Reactants', rightSide: 'Products', multipleSolutions: 'Multiple valid balances; not a guaranteed global minimum.' } : {};
  const gearMessages = tool.id === 'gear-ratio-calculator' ? { overallRatio: 'Overall ratio', outputSpeed: 'Output speed', stageCount: 'Stages', direction: 'Direction', sameDirection: 'Same direction', reversedDirection: 'Reversed', idealOutputTorque: 'Ideal output torque', estimatedOutputTorque: 'Efficiency-adjusted torque', reduction: 'speed reduction', speedIncrease: 'speed increase', noRatioChange: 'no speed change' } : {};
  const densityMessages = tool.id === 'density-calculator' ? { mass: 'Mass', volume: 'Volume', density: 'Density', densityMetric: 'Density (metric)', densityImperial: 'Density (US customary)', componentCount: 'Components' } : {};
  const compressionMessages = tool.id === 'compression-ratio-calculator' ? { ratio: 'Static compression ratio', sweptVolume: 'Swept volume per cylinder', clearanceVolume: 'Clearance volume per cylinder', totalDisplacement: 'Total engine displacement', boreStroke: 'Bore-to-stroke ratio' } : {};
  const polynomialMessages = tool.id === 'polynomial-long-division-calculator' ? { quotient: 'Quotient', remainder: 'Remainder', step: 'Step', quotientTerm: 'Divide leading terms', subtract: 'Subtract', newRemainder: 'New remainder', exampleLoaded: 'Example loaded.' } : {};
  const halfLifeMessages = tool.id === 'half-life-calculator' ? { calculatedValue: 'Calculated value', initialAmount: 'Initial amount', remainingAmount: 'Remaining amount', halfLife: 'Half-life', elapsedTime: 'Elapsed time', remainingPercent: 'Percentage remaining', halfLivesElapsed: 'Half-lives elapsed', exampleLoaded: 'Example loaded.' } : {};
  const accelerationMessages = tool.id === 'acceleration-calculator' ? { acceleration: 'Acceleration', time: 'Elapsed time', initialVelocity: 'Initial velocity', finalVelocity: 'Final velocity', initialPosition: 'Initial position', displacement: 'Displacement', finalPosition: 'Final position' } : {};
  const forceMessages = tool.id === 'force-calculator' ? { force: 'Force', netForce: 'Net force', mass: 'Mass', acceleration: 'Acceleration', diagram: 'Force diagram' } : {};
  const horsepowerMessages = tool.id === 'horsepower-calculator' ? { torque: 'Torque', rpm: 'Engine speed', power: 'Power', watts: 'Watts', kilowatts: 'Kilowatts', horsepower: 'Mechanical horsepower', metricHorsepower: 'Metric horsepower (PS)' } : {};
  const mortgagePointsMessages = tool.id === 'mortgage-points-calculator' ? { pointCost: 'Points cost', paymentWithoutPoints: 'Payment without points', paymentWithPoints: 'Payment with points', monthlyPaymentSavings: 'Monthly payment reduction', lifetimeInterestSavings: 'Full-term interest difference', balanceWithoutPoints: 'Balance without points', balanceWithPoints: 'Balance with points', netBenefitAtHorizon: 'Net benefit at horizon', paymentOnlyBreakEven: 'Payment-only break-even', netBreakEven: 'Balance-inclusive break-even', noBreakEven: 'Not recovered in the term', noMonthlySavings: 'No monthly savings', exampleLoaded: 'Example loaded.' } : {};
  const trapezoidMessages = tool.id === 'trapezoid-calculator' ? { area: 'Area', leftSide: 'Left side', rightSide: 'Right side', perimeter: 'Perimeter', exampleLoaded: 'Example loaded.' } : {};
  const prayerMessages = tool.id === 'prayer-times-calculator' ? { fajr: 'Fajr', sunrise: 'Sunrise', dhuhr: 'Dhuhr', asr: 'Asr', sunset: 'Sunset', maghrib: 'Maghrib', isha: 'Isha', unavailable: 'Unavailable', methodLabel: 'Method', asrLabel: 'Asr method', offsetLabel: 'UTC offset', highLatitudeAdjusted: 'High-latitude estimate applied.', exampleLoaded: 'Example loaded.' } : {};
  const goalMessages = tool.id === 'goal-planner' ? { generated: 'Plan created.', downloaded: 'Backup downloaded.', importFailed: 'Invalid backup.', saved: 'Saved.', storageUnavailable: 'Storage unavailable.', current: 'Current', day: 'day', days: 'days', remaining: 'remaining' } : {};
  const mindMapMessages = tool.id === 'mind-map-maker' ? { created: 'Map ready.', updated: 'Idea updated.', added: 'Idea added.', removed: 'Branch removed.', imported: 'Map imported.', importFailed: 'Invalid backup.', checkTopic: 'Enter a topic.', checkIdea: 'Check the idea.', enterIdea: 'Enter an idea.' } : {};
  const moodMessages = tool.id === 'mood-tracker' ? { recorded: 'Recorded.', updated: 'Updated.', removed: 'Deleted.', imported: 'Imported.', importFailed: 'Invalid backup.', downloaded: 'Downloaded.', saved: 'Saved.', storageUnavailable: 'Storage unavailable.', storageEnabled: 'Saving enabled.', storageDisabled: 'Saved copy removed.', cleared: 'Cleared.', confirmClear: 'Delete all entries?', confirmClearSession: 'Delete this tab’s entries?', checkInputs: 'Check entries.', noEntry: 'Choose a day.', current: 'Selected', mood: 'Mood', tags: 'Tags', note: 'Note', count: 'days', average: 'Average' } : {};
  const journalMessages = tool.id === 'journal-online' ? { savedInTab: 'Entry saved.', updatedInTab: 'Entry updated.', deleted: 'Entry deleted.', allDeleted: 'All entries deleted.', allDeletedStorageFailed: 'Entries cleared, but saved browser data could not be removed.', backupTooLarge: 'Backup exceeds 10 MB.', imported: 'Backup imported.', importFailed: 'Invalid backup or password.', importCancelled: 'Import cancelled.', exported: 'Backup downloaded.', encryptedExported: 'Encrypted backup downloaded.', localSaved: 'Saved in this browser.', localSaveRemoved: 'Saved copy removed.', storageFailed: 'Browser storage unavailable.', searchUpdated: 'Search updated.', noSelection: 'Select an entry.', passwordMismatch: 'Passwords do not match.', passwordNeeded: 'Enter a password.', encrypting: 'Encrypting…', decrypting: 'Decrypting…', confirmDelete: 'Delete this entry?', confirmClear: 'Delete all entries?', confirmImport: 'Replace current entries?', checkInputs: 'Check date and text.', unsupportedCrypto: 'Secure encryption unavailable.', currentEntry: 'Current entry', searchRange: 'Check date range.' } : {};
  if (tool.id === 'mind-map-maker') Object.assign(actions, { addChild: 'Add child idea', removeNode: 'Remove branch', moveUp: 'Move up', moveDown: 'Move down', moveNode: 'Move idea', collapse: 'Collapse', expand: 'Expand', undo: 'Undo', redo: 'Redo', exportSvg: 'Download SVG', exportJson: 'Download JSON', importJson: 'Import JSON backup' });
  if (tool.id === 'mood-tracker') Object.assign(actions, { saveEntry: 'Record check-in', updateEntry: 'Update check-in', removeEntry: 'Delete day', clearHistory: 'Clear all', previousMonth: 'Previous month', nextMonth: 'Next month', export: 'Download backup', import: 'Import backup' });
  if (tool.id === 'journal-online') Object.assign(actions, { saveEntry: 'Save entry', updateEntry: 'Update entry', newEntry: 'New entry', example: 'Load example', reset: 'Clear form', search: 'Search', clearSearch: 'Clear search', deleteEntry: 'Delete selected', clearAll: 'Delete all', exportJson: 'Download JSON backup', importJson: 'Import JSON backup', saveBackup: 'Create encrypted backup' });
  const localized = { name, title: `${name} free | UsefulVerse`, description: `Free ${name} that works in your browser, with no account required.`, intro: `Use this ${name} for free in your browser.`, howQuestion: `How do I use ${name}?`, howAnswer: `Enter the details and use the controls shown.`, privacyQuestion: 'Is my data uploaded?', privacyAnswer: 'No. This tool runs locally in this browser.', fields, actions, messages: { ...localizedMessages, ...asphaltMessages, ...poolMessages, ...saltMessages, ...roofMessages, ...drywallMessages, ...roofingMessages, ...deckMessages, ...fenceMessages, ...redactorMessages, ...upscalerMessages, ...dominoMessages, ...weightMessages, ...helocMessages, ...teamMessages, ...paverMessages, ...brickMessages, ...rafterMessages, ...carpetMessages, ...aquariumMessages, ...grassSeedMessages, ...insulationMessages, ...wallFramingMessages, ...electricityCostMessages, ...compostMessages, ...pondMessages, ...fertilizerMessages, ...balusterMessages, ...retainingWallMessages, ...batteryRuntimeMessages, ...lumberCutMessages, ...plantSpacingMessages, ...evChargingMessages, ...rainwaterMessages, ...rampMessages, ...heatLossMessages, ...heatPumpMessages, ...miterMessages, ...voltageDropMessages, ...molarityMessages, ...dilutionMessages, ...ohmsMessages, ...chemicalMessages, ...gearMessages, ...densityMessages, ...compressionMessages, ...polynomialMessages, ...halfLifeMessages, ...accelerationMessages, ...forceMessages, ...horsepowerMessages, ...mortgagePointsMessages, ...trapezoidMessages, ...prayerMessages, ...goalMessages, ...mindMapMessages, ...moodMessages, ...journalMessages, ...colorNameMessages, ...photoToSketchMessages, ...schemaValidatorMessages, ...savingsGoalMessages, ...severanceMessages, ...divisibilityMessages, ...laplaceMessages, ...vectorMessages, ...equationMessages }, copyLanguage: language, ...(['carpet-calculator', 'aquarium-calculator', 'grass-seed-calculator', 'insulation-calculator', 'wall-framing-calculator', 'electricity-cost-calculator', 'compost-calculator', 'pond-volume-calculator', 'fertilizer-calculator', 'baluster-spacing-calculator', 'retaining-wall-calculator', 'battery-runtime-calculator', 'lumber-cut-calculator', 'plant-spacing-calculator', 'ev-charging-calculator', 'rainwater-harvesting-calculator', 'ramp-calculator', 'heat-loss-calculator', 'heat-pump-calculator', 'miter-angle-calculator', 'voltage-drop-calculator', 'molarity-calculator', 'dilution-calculator', 'ohms-law-calculator', 'mood-tracker', 'journal-online', 'travel-itinerary-planner', 'half-life-calculator', 'mortgage-points-calculator', 'trapezoid-calculator', 'color-name-finder', 'photo-to-sketch', 'schema-markup-validator', 'savings-goal-calculator', 'severance-pay-calculator', 'divisibility-calculator', 'vector-calculator', 'force-calculator', 'horsepower-calculator'].includes(tool.id) ? { localizationStatus: 'approved' } : {}) };
  if (tool.id === 'complex-number-calculator') {
    Object.assign(localized, { fields: { operation: 'Operation', realA: 'Real part of z1', imaginaryA: 'Imaginary part of z1', realB: 'Real part of z2', imaginaryB: 'Imaginary part of z2', radius: 'Magnitude (radius)', angle: 'Angle', angleUnit: 'Angle unit', degrees: 'Degrees', radians: 'Radians', degree: 'Root degree', resultSummary: 'Result', resultReal: 'Real part', resultImaginary: 'Imaginary part', modulus: 'Modulus', argument: 'Principal argument', polar: 'Polar form', rootNumber: 'Root', zeroArgumentNote: 'Zero has no defined argument.', accuracyNote: 'Finite inputs only; roots 2 to 12; numerical results.', exampleHint: 'i × i = −1.' }, messages: { ...localized.messages, calculated: 'Result ready.', checkInputs: 'Check values.', exampleLoaded: 'Example loaded.', missingValue: 'Enter every required value.', componentOutOfRange: 'Component outside range.', radiusOutOfRange: 'Radius outside range.', angleOutOfRange: 'Angle outside range.', negativeRadius: 'Radius cannot be negative.', invalidAngleUnit: 'Choose degrees or radians.', invalidRootDegree: 'Choose root degree 2 to 12.', divisionByZero: 'Cannot divide by zero.', zeroArgument: 'Zero has no defined argument.', resultOutOfRange: 'Result outside range.', invalidOperation: 'Choose a supported operation.' }, actions: { ...localized.actions, calculate: 'Calculate', example: 'Load example', reset: 'Clear', add: 'Add z1 + z2', subtract: 'Subtract z1 - z2', multiply: 'Multiply z1 × z2', divide: 'Divide z1 ÷ z2', magnitude: 'Modulus of z1', argument: 'Argument of z1', rectangularToPolar: 'Rectangular to polar', polarToRectangular: 'Polar to rectangular', roots: 'Nth roots of z1' }, localizationStatus: 'approved', additionalFaqs: [{ question: 'What is the principal argument?', answer: 'The principal angle is in the range −180° exclusive to 180° inclusive.' }, { question: 'Does it list every nth root?', answer: 'Yes, for integer degrees from 2 through 12.' }] });
  }
  if (tool.id === 'readability-checker') {
    Object.assign(localized.messages, readabilityMessages);
    localized.localizationStatus = 'approved';
    localized.additionalFaqs = [
      { question: 'Which formulas are supported?', answer: 'Five language-specific formulas are available.' },
      { question: 'Does this test comprehension?', answer: 'No. Scores are structural estimates.' },
    ];
  }
  if (tool.id === 'readability-checker') Object.assign(actions, { calculate: 'Check readability', example: 'Load example', copy: 'Copy results', reset: 'Clear' });
  if (tool.id === 'savings-goal-calculator') {
    Object.assign(actions, { calculate: 'Calculate', example: 'Load example', copy: 'Copy result', reset: 'Clear', requiredContribution: 'Monthly deposit needed', monthsToGoal: 'Time needed for my deposit', beginning: 'Beginning of month', end: 'End of month' });
    localized.localizationStatus = 'approved';
    localized.additionalFaqs = [{ question: 'Does this guarantee the goal?', answer: 'No. It is an estimate.' }, { question: 'Does it convert currency?', answer: 'No.' }];
  }
  if (tool.id === 'severance-pay-calculator') {
    Object.assign(actions, { calculate: 'Calculate estimate', example: 'Load example', copy: 'Copy estimate', reset: 'Clear', customMode: 'Custom assumptions', ukMode: 'Great Britain statutory estimate' });
    localized.localizationStatus = 'approved';
    localized.additionalFaqs = [{ question: 'Does this decide eligibility?', answer: 'No. It is a limited estimate; check official guidance for your circumstances.' }, { question: 'Does this cover Northern Ireland or earlier dates?', answer: 'No. This mode covers Great Britain and dates from 6 April 2026 only.' }];
  }
  if (tool.id === 'divisibility-calculator') {
    Object.assign(actions, { calculate: 'Check divisibility', example: 'Load example', commonDivisors: 'Test common divisors', copy: 'Copy results', reset: 'Clear' });
    localized.additionalFaqs = [{ question: 'Does a remainder of zero mean divisible?', answer: 'Yes, for a non-zero divisor.' }, { question: 'Does this find every factor?', answer: 'No. It checks only divisors you enter.' }];
  }
  if (tool.id === 'number-line-graphing-tool') {
    Object.assign(actions, { calculate: 'Create number line', example: 'Load example', downloadSvg: 'Download SVG', reset: 'Clear' });
    Object.assign(localized.messages, numberLineMessages);
    localized.additionalFaqs = [{ question: 'What do open and closed circles mean?', answer: 'A hollow circle excludes an endpoint; a filled circle includes it.' }, { question: 'Can I plot fractions or infinity?', answer: 'Yes. Fractions are plotted as decimal coordinates, and infinity is an open outer endpoint.' }];
  }
  if (tool.id === 'laplace-transform-calculator') {
    localized.additionalFaqs = [
      { question: 'Does it find partial fractions automatically?', answer: 'No. Enter each supported inverse term on its own line.' },
      { question: 'Does it handle every symbolic expression?', answer: 'No. It supports the bounded forms listed on the page.' },
    ];
  }
  if (tool.id === 'laplace-transform-calculator') Object.assign(actions, { calculate: 'Calculate transform', example: 'Load example', reset: 'Clear' });
  if (tool.id === 'vector-calculator') {
    Object.assign(actions, { calculate: 'Calculate', example: 'Load example', reset: 'Clear', add: 'Add A + B', subtract: 'Subtract A − B', dot: 'Dot product', cross: 'Cross product', magnitudeA: 'Magnitude of A', magnitudeB: 'Magnitude of B', normalizeA: 'Normalize A', normalizeB: 'Normalize B', angle: 'Angle between A and B', projection: 'Project A onto B' });
    localized.additionalFaqs = [{ question: 'What does the 2D cross product return?', answer: 'It returns the signed z-component; a 3D cross product returns a vector.' }, { question: 'Which units should I enter?', answer: 'Use compatible units for both vectors. The angle is shown in degrees.' }];
  }
  if (tool.id === 'cubic-quartic-equation-calculator') {
    Object.assign(actions, { calculate: 'Calculate roots', example: 'Load example', reset: 'Clear' });
    localized.additionalFaqs = [{ question: 'Does it calculate complex roots?', answer: 'No. It estimates real roots only.' }, { question: 'Are results exact?', answer: 'No. Results are numeric estimates with residuals.' }];
  }
  if (tool.id === 'hitori') Object.assign(localized.messages, hitoriMessages);
  if (tool.id === 'hitori') localized.localizationStatus = 'approved';
  if (tool.id === 'nurikabe') Object.assign(localized.messages, nurikabeMessages);
  if (tool.id === 'nurikabe') localized.localizationStatus = 'approved';
  if (tool.id === 'color-name-finder') Object.assign(localized.messages, colorNameMessages);
  if (tool.id === 'photo-to-sketch') Object.assign(localized.messages, photoToSketchMessages);
  if (tool.id === 'travel-itinerary-planner') {
    Object.assign(localized.actions, { createTrip: 'Create trip', saveItem: 'Add stop', updateItem: 'Update stop', newItem: 'New stop', deleteItem: 'Delete stop', deleteTrip: 'Delete trip', exportIcs: 'Download calendar', exportJson: 'Download JSON', importJson: 'Import JSON', print: 'Print itinerary' });
    Object.assign(localized.messages, { tripSaved: 'Trip saved.', storageFailed: 'Storage failed.', tripDeletedStorageFailed: 'Deleted in this tab, but browser copy remains.', checkTrip: 'Check trip.', createTripFirst: 'Create a trip first.', exampleLoaded: 'Example loaded.', itemSaved: 'Stop added.', itemUpdated: 'Stop updated.', checkItem: 'Check stop.', formCleared: 'Cleared.', itemDeleted: 'Deleted.', confirmDeleteTrip: 'Delete?', tripDeleted: 'Deleted.', confirmRestore: 'Restore?', localSaved: 'Saved.', localRemoved: 'Removed.', jsonDownloaded: 'JSON saved.', icsDownloaded: 'Calendar saved.', backupTooLarge: 'Backup too large.', noItemsToExport: 'Add a stop.', exportFailed: 'Export failed.', confirmImport: 'Replace?', importCancelled: 'Cancelled.', imported: 'Imported.', importFailed: 'Invalid backup.', overlap: '{first} conflicts with {second} for {minutes} minutes.', shortConnection: '{first} to {second}: {minutes} minutes; {needed} needed.' });
    localized.localizationStatus = 'approved';
    localized.additionalFaqs = [
      { question: 'Can this book travel?', answer: 'No. This is a manual local planner.' },
      { question: 'Are calendar times converted?', answer: 'No. Times remain as entered.' },
    ];
  }
  if (tool.id === 'mood-tracker') Object.assign(localized, { additionalFaqs: [
    { question: 'Does it diagnose mood?', answer: 'No. The summary describes only check-ins that you record and is not a clinical assessment.' },
    { question: 'Where is data saved?', answer: 'Only in this browser if you explicitly enable local saving; otherwise it stays in this tab.' },
  ] });
  if (tool.id === 'journal-online') Object.assign(localized, { additionalFaqs: [
    { question: 'Are journal entries uploaded?', answer: 'No. They remain in this browser unless you download a backup.' },
    { question: 'Is browser storage encrypted?', answer: 'No. Only a separately created backup is encrypted.' },
  ] });
  if (tool.id === 'image-color-picker') Object.assign(localized, {
    fields: { imageFile: 'Choose an image', accuracyNote: 'Local processing; maximum 12 megapixels.', previewHint: 'Click a pixel or use arrow keys.', zoom: 'Preview zoom', currentColor: 'Current pixel', paletteLabel: 'Color palette', relatedSharpener: 'Open the image sharpener.', relatedRedactor: 'Open the image redactor.' },
    actions: { ...actions, load: 'Choose image', addSample: 'Add color to palette', copyColor: 'Copy color', copyPalette: 'Copy HEX palette', remove: 'Remove', clear: 'Clear palette' },
    messages: { ...localized.messages, unsupportedImage: 'Choose a supported raster image.', imageTooLarge: 'Image exceeds 12 megapixels.', imageReady: 'Image ready.', selectImage: 'Choose an image first.', pixelSelected: 'Pixel selected.', sampleAdded: 'Color added.', paletteFull: 'Palette is full.', copiedColor: 'Color copied.', copiedPalette: 'Palette copied.', copyUnavailable: 'Clipboard unavailable.', paletteCleared: 'Palette cleared.' },
    additionalFaqs: [
      { question: 'Can I sample a transparent pixel?', answer: 'Yes. The tool includes alpha in the eight-digit HEX value when a pixel is not fully opaque.' },
      { question: 'Are sampled values exact?', answer: 'It reads the decoded source pixel at its original coordinates. The browser may convert embedded profiles to sRGB.' },
    ],
  });
  if (tool.id === 'image-sharpener') Object.assign(localized, {
    fields: { imageFile: 'Choose image', amount: 'Strength', radius: 'Radius', threshold: 'Threshold', compare: 'Show original', accuracyNote: 'Processed locally; 8 megapixel limit.', previewHint: 'Reduced preview.', format: 'Format', relatedRedactor: 'Redact details.', relatedCropper: 'Crop image.' },
    actions: { ...actions, load: 'Choose image', export: 'Prepare download', download: 'Download', original: 'Show original', sharpened: 'Sharpened preview', png: 'PNG', jpeg: 'JPEG' },
    messages: { ...localized.messages, unsupportedImage: 'Unsupported image.', imageTooLarge: 'Image too large.', imageReady: 'Image ready.', selectImage: 'Choose image first.', exporting: 'Sharpening…', exportFailed: 'Export failed.', exportReady: 'Download ready.' },
    additionalFaqs: [
      { question: 'Can sharpening restore missing detail?', answer: 'No. It increases local edge contrast only.' },
      { question: 'What do strength, radius and threshold do?', answer: 'They control the sharpening effect.' },
    ],
  });
  if (tool.id === 'wallpaper-calculator') Object.assign(localized.messages, { netArea: 'Estimated net wall area', strips: 'Wall strips needed', dropLength: 'Cut length per strip', dropsPerRoll: 'Strips per roll', stripsToOrder: 'Strips including extra', rolls: 'Whole rolls to buy' });
  if (tool.id === 'tire-size-calculator') localized.additionalFaqs = [
    { question: 'Will this replacement tire fit my vehicle?', answer: fields.fitmentNote },
    { question: 'How is actual speed estimated?', answer: 'Dashboard speed is multiplied by the ratio of new to current nominal tire diameter. It is an estimate.' },
  ];
  if (tool.id === 'stair-calculator') localized.additionalFaqs = [
    { question: 'Which dimensions are shown?', answer: 'Rise, tread count, total run, angle and stringer estimate.' },
    { question: 'Does it verify local rules?', answer: fields.codeNote },
  ];
  if (tool.id === 'asphalt-calculator') localized.additionalFaqs = [
    { question: 'What density should I use?', answer: fields.accuracyNote },
    { question: 'How are extra material and cost estimated?', answer: 'Extra material increases the order estimate; cost is tonnes times the entered unit price.' },
  ];
  if (tool.id === 'soil-calculator') localized.additionalFaqs = [
    { question: 'How many bags do I need?', answer: 'Enter the volume on the bag; the estimate rounds up to whole bags.' },
    { question: 'Does this estimate soil coverage?', answer: 'No. It calculates fill volume for containers.' },
  ];
  if (tool.id === 'pool-volume-calculator') localized.additionalFaqs = [
    { question: 'How do I estimate a sloped floor?', answer: 'Average shallow and deep water depth, then multiply by the pool footprint.' },
    { question: 'Why show two gallon values?', answer: 'US and imperial gallons are different units.' },
  ];
  if (tool.id === 'pool-salt-calculator') localized.additionalFaqs = [
    { question: 'Does the calculator choose my target salt level?', answer: fields.accuracyNote },
    { question: 'What if the current level is already above my target?', answer: 'It estimates zero salt to add when the target is at or below the current salinity.' },
  ];
  if (tool.id === 'roof-pitch-calculator') localized.additionalFaqs = [
    { question: 'What is a 12:12 roof pitch?', answer: 'It means equal rise and run, or 45 degrees.' },
    { question: 'Does the rafter estimate include eaves?', answer: 'It includes only the optional horizontal overhang you enter.' },
  ];
  if (tool.id === 'drywall-calculator') localized.additionalFaqs = [
    { question: 'Do doors, windows and waste affect the sheet count?', answer: 'Enter total door and window area per room, then add material for cuts. The estimate is area-based; board layout and reusable offcuts may change the amount.' },
    { question: 'Does it set joint or screw installation rules?', answer: 'No. It estimates material only. Follow board-maker instructions and local requirements for joints, fire or moisture ratings and screw spacing.' },
  ];
  if (tool.id === 'roofing-calculator') localized.additionalFaqs = [
    { question: 'How does roof pitch change the material estimate?', answer: 'The sloped surface is the horizontal projected area multiplied by the slope factor from rise and run. A steeper pitch increases the area.' },
    { question: 'How many shingle bundles cover one roofing square?', answer: 'Enter the bundle rate printed on the product package. Coverage differs by shingle and product, so the calculator does not assume one universal rate.' },
  ];
  if (tool.id === 'deck-calculator') localized.additionalFaqs = [
    { question: 'What if the stock boards are shorter than the deck?', answer: fields.safetyNote },
    { question: 'Does this estimate include a cut map or framing design?', answer: 'No. It estimates surface board quantity and simplified support fasteners; every board-end joint still needs a suitable support and project-specific framing design.' },
  ];
  if (tool.id === 'fence-calculator') localized.additionalFaqs = [
    { question: 'How many posts does one isolated fence section need?', answer: fields.accuracyNote },
    { question: 'Does this place gates at their exact positions?', answer: 'No. It divides fence sections evenly because individual gate positions are not entered.' },
  ];
  if (tool.id === 'solar-panel-calculator') {
    Object.assign(fields, {
      mode: 'Estimate type', dailyTargetKwh: 'Daily energy target', panelCount: 'Panel count', panelWatts: 'Panel rating',
      peakSunHours: 'Peak sun hours', lossPercent: 'System losses', panelLengthM: 'Panel length', panelWidthM: 'Panel width',
      electricityRate: 'Electricity rate', systemCost: 'Installed system cost', currency: 'Currency',
      assumptionNote: 'Enter local sunlight and your own price assumptions.', accuracyNote: 'Planning estimate only; actual production, savings and payback vary with conditions and utility rules.',
    });
    Object.assign(actions, { productionMode: 'Estimate production', sizingMode: 'Size a system', years: 'years' });
    Object.assign(localized.messages, {
      panelCount: 'Panels needed', systemSize: 'System size', dailyProduction: 'Daily production', monthlyProduction: 'Monthly production',
      annualProduction: 'Annual production', panelArea: 'Panel area', annualSavings: 'Annual bill offset', simplePayback: 'Simple payback',
      paybackUnavailable: 'No payback estimate available.',
    });
    localized.additionalFaqs = [
      { question: 'How many solar panels do I need?', answer: 'Enter daily energy use, panel power, sunlight and system losses.' },
      { question: 'Are savings guaranteed?', answer: 'No. This is an estimate based on your assumptions.' },
    ];
  }
  if (tool.id === 'btu-calculator') {
    Object.assign(localized.actions, { feet: 'Feet', meters: 'Metres', inches: 'Inches', shaded: 'Shaded', typical: 'Typical', sunny: 'Sunny', no: 'No', yes: 'Yes' });
    Object.assign(localized.messages, {
      roomArea: 'Room area', roomVolume: 'Room volume', baseCapacity: 'Base capacity', ceilingAdjustment: 'Ceiling factor',
      insulationAdjustment: 'Insulation', sunAdjustment: 'Sunlight', occupantAdjustment: 'Extra occupants', kitchenAdjustment: 'Kitchen',
      capacity: 'Capacity', tons: 'Tons', belowReferenceBand: 'Below chart range.',
    });
    localized.additionalFaqs = [
      { question: 'What does this BTU estimate show?', answer: 'A room-air-conditioner planning estimate based on the entered area and assumptions.' },
      { question: 'Does this replace a professional load calculation?', answer: 'No. It is not a Manual J calculation or HVAC design.' },
    ];
  }
  if (tool.id === 'brick-calculator') localized.additionalFaqs = [
    { question: 'Do openings reduce the brick estimate?', answer: 'Yes. The entered opening area is deducted from the wall before estimating bricks.' },
    { question: 'Is the mortar amount exact?', answer: 'No. It is a geometric estimate; joint size, bond, technique and product coverage change actual use.' },
  ];
  if (tool.id === 'rafter-calculator') localized.additionalFaqs = [
    { question: 'Does an eave overhang increase rafter length?', answer: 'Yes. Enter it as a horizontal distance; the estimate extends the rafter along the same slope.' },
    { question: 'Does this calculate a birdsmouth cut?', answer: 'No. This is basic roof geometry only, not a construction or structural plan.' },
  ];
  if (tool.id === 'carpet-calculator') localized.additionalFaqs = [
    { question: 'Why can the carpet estimate exceed the room area?', answer: 'Carpet is cut in full-width strips, so unused edges can remain after the layout is cut.' },
    { question: 'Does it create an installer-ready cutting diagram?', answer: 'No. The estimate does not account for obstacles, patterns or joining different rooms.' },
  ];
  if (tool.id === 'aquarium-calculator') localized.additionalFaqs = [
    { question: 'Does this include gravel, rocks and aquarium equipment?', answer: fields.accuracyNote },
    { question: 'Does the estimated weight include the tank?', answer: 'No. This estimate reports water mass only; add the tank, substrate, equipment and stand separately.' },
  ];
  if (tool.id === 'wallpaper-calculator') localized.additionalFaqs = [
    { question: 'Why does a pattern repeat need more wallpaper?', answer: 'The cut length is rounded up to the next full design repeat, so fewer strips can fit on one roll.' },
    { question: 'Are openings and corners placed exactly?', answer: fields.accuracyNote },
  ];
  if (tool.id === 'image-region-redactor') localized.additionalFaqs = [
    { question: 'Does blur or pixelation fully hide private information?', answer: 'Not always. Use solid black for sensitive details and check the exported copy.' },
    { question: 'Does the original image change?', answer: 'No. The original remains unchanged; export creates a new flattened image.' },
  ];
  if (tool.id === 'image-sharpener') localized.additionalFaqs = [
    { question: 'Can sharpening restore missing detail?', answer: 'No. It increases local edge contrast only.' },
    { question: 'What do strength, radius and threshold do?', answer: 'They control the sharpening effect.' },
  ];
  if (tool.id === 'image-upscaler') localized.additionalFaqs = [
    { question: 'Does it restore real missing detail?', answer: 'No. The model infers plausible details and cannot know the original scene.' },
    { question: 'Why the size limit?', answer: 'The model and enlarged output use local device memory and CPU.' },
  ];
  if (tool.id === 'hitori') localized.additionalFaqs = [
    { question: 'What are the rules of Hitori?', answer: 'Do not leave duplicate numbers among the white cells in any row or column. Black cells cannot touch orthogonally, and all white cells must form one connected area. Diagonal black cells may touch.' },
    { question: 'Does each new Hitori puzzle have a solution?', answer: 'The generator checks that each displayed grid has exactly one solution under these rules. It runs on your device and does not need an account or a server.' },
  ];
  if (tool.id === 'nurikabe') localized.additionalFaqs = [
    { question: 'What are the rules of Nurikabe?', answer: 'Each numbered island has one clue and exactly the number of cells shown. Islands cannot touch by sides. The sea must be connected and cannot contain a 2×2 block.' },
    { question: 'Does every puzzle have one solution?', answer: 'The local generator proves uniqueness before accepting a fresh board and uses a verified fallback if it reaches its attempt limit.' },
  ];
  if (tool.id === 'color-name-finder') localized.additionalFaqs = [
    { question: 'Does every hex color have an exact name?', answer: 'No. CSS defines a fixed named-color palette; other values are matched approximately.' },
    { question: 'Why can two CSS names share a value?', answer: 'Some names are aliases, such as aqua and cyan, and share an exact RGB value.' },
  ];
  if (tool.id === 'photo-to-sketch') localized.additionalFaqs = [
    { question: 'Does the tool draw a real pencil illustration?', answer: 'No. It applies a local grayscale, tone and edge filter, not a hand-drawn reconstruction.' },
    { question: 'Will it upload or change my original photo?', answer: 'No. The source stays unchanged; the tool creates a separate PNG in this browser.' },
  ];
  if (tool.id === 'schema-markup-validator') localized.additionalFaqs = [
    { question: 'Does a valid result guarantee a Google rich result?', answer: 'No. This checks syntax and vocabulary terms, not Google eligibility or display.' },
    { question: 'Are remote contexts or pages fetched?', answer: 'No. Only the versioned local vocabulary asset loads after validation starts.' },
  ];
  if (tool.id === 'dominoes-game') localized.additionalFaqs = [
    { question: 'Draw or block?', answer: 'The variant changes drawing rules.' },
    { question: 'Can two people play locally?', answer: 'Yes. Two people can share one device.' },
  ];
  if (tool.id === 'hitori') localized.additionalFaqs = [
    { question: 'What are the rules of Hitori?', answer: 'Do not leave duplicate numbers among the white cells in any row or column. Black cells cannot touch orthogonally, and all white cells must form one connected area. Diagonal black cells may touch.' },
    { question: 'Does each new Hitori puzzle have a solution?', answer: 'The generator checks that each displayed grid has exactly one solution under these rules. It runs on your device and does not need an account or a server.' },
  ];
  if (tool.id === 'weight-loss-calculator') localized.additionalFaqs = [
    { question: 'Is this a body-weight prediction?', answer: 'No. It is simple linear arithmetic; body-weight change is dynamic.' },
    { question: 'What does a zero deficit show?', answer: 'Zero modeled energy change and no finite timeline.' },
  ];
  if (tool.id === 'heloc-calculator') localized.additionalFaqs = [
    { question: 'What happens to payments when the draw period ends?', answer: 'This estimate moves the current balance into equal monthly principal-and-interest payments over the term you enter.' },
    { question: 'Does it include future withdrawals or a changing rate?', answer: 'No. It assumes no more draws and one unchanged APR; lender rules, fees and variable-rate changes can make actual payments different.' },
  ];
  if (tool.id === 'random-team-generator') {
    Object.assign(localized.actions, { generateTeams: 'Generate teams', team: 'Team', participant: 'participants', seedLabel: 'Seed' });
    localized.additionalFaqs = [
      { question: 'Can two people be kept on different teams?', answer: 'Yes. Add the exact names as a pair in the keep-apart field.' },
      { question: 'Can I reproduce a team draw?', answer: 'Yes. Use the same seed, participant list, team count and rules.' },
    ];
  }
  if (tool.id === 'mulch-calculator') {
    Object.assign(localized.actions, { rectangle: 'Rectangle', circle: 'Circle', meters: 'Metres', feet: 'Feet', centimeters: 'Centimetres', millimeters: 'Millimetres', inches: 'Inches', liters: 'Litres', cubicFeet: 'Cubic feet', squareMeters: 'Square metres', squareFeet: 'Square feet' });
    Object.assign(localized.messages, { bedArea: 'Total bed area', mulchDepth: 'Mulch depth', cubicYards: 'Approximate cubic yards', bags: 'Whole bags to buy', estimatedCost: 'Estimated bag cost', costNotEntered: 'Enter a bag price.' });
    localized.additionalFaqs = [
      { question: 'How many bags cover one cubic metre?', answer: 'Divide 1,000 litres by the volume of one bag and round up.' },
      { question: 'Does this calculator choose the right depth for my plants?', answer: 'No. Follow local gardening advice and the product label.' },
    ];
  }
  if (tool.id === 'paver-calculator') localized.additionalFaqs = [
    { question: 'How many pavers do I need?', answer: 'Enter the surface dimensions, the repeating module dimensions and the number of pavers in each module. Full modules are rounded up in the entered orientation.' },
    { question: 'Does this plan edge cuts or reuse offcuts?', answer: 'No. It counts complete repeat modules and reports perimeter; it does not generate a cut plan or determine whether offcuts can be reused.' },
  ];
  if (tool.id === 'kinetic-energy-calculator') {
    Object.assign(localized.actions, { calculate: 'Calculate energy', example: 'Try 2 kg at 3 m/s', reset: 'Clear', copy: 'Copy result' });
    Object.assign(localized.messages, { velocity: 'Speed', kineticEnergy: 'Kinetic energy', potentialEnergy: 'Gravitational potential energy', totalEnergy: 'Total mechanical energy' });
    localized.additionalFaqs = [
      { question: 'Can I solve speed from kinetic energy?', answer: 'Yes. Select the solve-speed mode and enter mass and kinetic energy.' },
      { question: 'Why can potential energy be negative?', answer: 'Potential energy is relative to the zero-height reference you choose.' },
      { question: 'Does total energy include friction?', answer: 'No. It adds only kinetic energy and gravitational potential energy.' },
    ];
    localized.localizationStatus = 'approved';
  }
  if (tool.id === 'resistor-color-code-calculator') {
    Object.assign(localized.actions, { calculate: 'Calculate', example: 'Try brown-black-red-gold', reset: 'Clear', copy: 'Copy result' });
    Object.assign(localized.messages, { resistance: 'Resistance', requestedResistance: 'Requested resistance', nominalResistance: 'Nearest nominal value', tolerance: 'Tolerance', bands: 'Band order', temperatureCoefficient: 'Temperature coefficient', rounding: 'Encoding note', nearestNominal: 'Rounded to the nearest representable nominal value.' });
    localized.additionalFaqs = [
      { question: 'What does brown-black-red-gold mean?', answer: 'Brown is 1, black is 0, red multiplies by 100, and gold means ±5% tolerance: 1,000 Ω ±5%.' },
      { question: 'What changes between 4-, 5- and 6-band resistors?', answer: 'Four bands use two significant digits; five use three; six add a temperature-coefficient band.' },
      { question: 'Does reverse encoding guarantee an exact value?', answer: 'Not always. It selects the nearest value representable with the chosen band count and reports rounding.' },
    ];
    localized.localizationStatus = 'approved';
  }
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
  const smallLocales = localeEntries.filter(({ key }) => ['en', 'es', 'fr', 'pt', 'de', 'ja', 'ko', 'id', 'hi', 'ar', 'zh', 'bn', 'ru', 'ur', 'tr', 'vi', 'it', 'zh_tw', 'bg', 'ca', 'nl', 'el', 'ms', 'pl', 'sv', 'th', 'uk', 'sw', 'mr', 'te', 'ha', 'tl', 'ta', 'fa', 'am', 'gu'].includes(key));
  const controllerBundles = Object.fromEntries(growthPilotTools.map((tool) => [tool.id, `document.querySelector('[data-tool="${tool.id}"]');`]));
  const workerBundles = { 'image-upscaler-worker': 'self.addEventListener("message",()=>{});' };
  const extraAssets = { 'models-test/config.json': '{"upscale":2}', 'models-test/onnx/model.onnx': Buffer.from([1, 2, 3]) };
  const fixtureCopyByLocale = { en: englishGrowthCopy, es: spanishGrowthCopy, fr: frenchGrowthCopy, pt: portugueseGrowthCopy, de: germanGrowthCopy, ja: japaneseGrowthCopy, ko: koreanGrowthCopy, id: indonesianGrowthCopy, hi: hindiGrowthCopy, ar: arabicGrowthCopy, zh: simplifiedChineseGrowthCopy, bn: bengaliGrowthCopy, ru: russianGrowthCopy, ur: urduGrowthCopy, tr: turkishGrowthCopy, vi: vietnameseGrowthCopy, it: italianGrowthCopy, zh_tw: traditionalChineseGrowthCopy, bg: bulgarianGrowthCopy, ca: catalanGrowthCopy, nl: dutchGrowthCopy, el: greekGrowthCopy, ms: malayGrowthCopy, pl: polishGrowthCopy, sv: swedishGrowthCopy, th: thaiGrowthCopy, uk: ukrainianGrowthCopy, sw: swahiliGrowthCopy, mr: marathiGrowthCopy, te: teluguGrowthCopy, ha: hausaGrowthCopy, tl: filipinoGrowthCopy, ta: tamilGrowthCopy, fa: persianGrowthCopy, am: amharicGrowthCopy, gu: gujaratiGrowthCopy };
  for (const locale of smallLocales) fixtureCopyByLocale[locale.key] = {
    ...fixtureCopyByLocale[locale.key],
    'carpet-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'carpet-calculator'), locale.key),
    'aquarium-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'aquarium-calculator'), locale.key),
    'grass-seed-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'grass-seed-calculator'), locale.key),
    'insulation-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'insulation-calculator'), locale.key),
    'wall-framing-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'wall-framing-calculator'), locale.key),
    'electricity-cost-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'electricity-cost-calculator'), locale.key),
    'compost-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'compost-calculator'), locale.key),
    'pond-volume-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'pond-volume-calculator'), locale.key),
    'fertilizer-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'fertilizer-calculator'), locale.key),
    'baluster-spacing-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'baluster-spacing-calculator'), locale.key),
    'retaining-wall-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'retaining-wall-calculator'), locale.key),
    'battery-runtime-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'battery-runtime-calculator'), locale.key),
    'lumber-cut-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'lumber-cut-calculator'), locale.key),
    'plant-spacing-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'plant-spacing-calculator'), locale.key),
    'ev-charging-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'ev-charging-calculator'), locale.key),
    'rainwater-harvesting-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'rainwater-harvesting-calculator'), locale.key),
    'ramp-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'ramp-calculator'), locale.key),
    'heat-loss-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'heat-loss-calculator'), locale.key),
    'heat-pump-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'heat-pump-calculator'), locale.key),
    'miter-angle-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'miter-angle-calculator'), locale.key),
    'voltage-drop-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'voltage-drop-calculator'), locale.key),
    'molarity-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'molarity-calculator'), locale.key),
    'dilution-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'dilution-calculator'), locale.key),
    'ohms-law-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'ohms-law-calculator'), locale.key),
    'chemical-equation-balancer': toolCopy(growthPilotTools.find(({ id }) => id === 'chemical-equation-balancer'), locale.key),
    'gear-ratio-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'gear-ratio-calculator'), locale.key),
    'density-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'density-calculator'), locale.key),
    'kinetic-energy-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'kinetic-energy-calculator'), locale.key),
    'resistor-color-code-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'resistor-color-code-calculator'), locale.key),
    'acceleration-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'acceleration-calculator'), locale.key),
    'force-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'force-calculator'), locale.key),
    'horsepower-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'horsepower-calculator'), locale.key),
    'compression-ratio-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'compression-ratio-calculator'), locale.key),
    'goal-planner': toolCopy(growthPilotTools.find(({ id }) => id === 'goal-planner'), locale.key),
    'mind-map-maker': toolCopy(growthPilotTools.find(({ id }) => id === 'mind-map-maker'), locale.key),
    'mood-tracker': toolCopy(growthPilotTools.find(({ id }) => id === 'mood-tracker'), locale.key),
    'journal-online': toolCopy(growthPilotTools.find(({ id }) => id === 'journal-online'), locale.key),
    'travel-itinerary-planner': toolCopy(growthPilotTools.find(({ id }) => id === 'travel-itinerary-planner'), locale.key),
    'polynomial-long-division-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'polynomial-long-division-calculator'), locale.key),
    'half-life-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'half-life-calculator'), locale.key),
    'mortgage-points-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'mortgage-points-calculator'), locale.key),
    'trapezoid-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'trapezoid-calculator'), locale.key),
    'prayer-times-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'prayer-times-calculator'), locale.key),
    hitori: toolCopy(growthPilotTools.find(({ id }) => id === 'hitori'), locale.key),
    nurikabe: toolCopy(growthPilotTools.find(({ id }) => id === 'nurikabe'), locale.key),
    'color-name-finder': toolCopy(growthPilotTools.find(({ id }) => id === 'color-name-finder'), locale.key),
    'photo-to-sketch': toolCopy(growthPilotTools.find(({ id }) => id === 'photo-to-sketch'), locale.key),
    'schema-markup-validator': toolCopy(growthPilotTools.find(({ id }) => id === 'schema-markup-validator'), locale.key),
    'readability-checker': toolCopy(growthPilotTools.find(({ id }) => id === 'readability-checker'), locale.key),
    'savings-goal-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'savings-goal-calculator'), locale.key),
    'severance-pay-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'severance-pay-calculator'), locale.key),
    'divisibility-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'divisibility-calculator'), locale.key),
    'number-line-graphing-tool': toolCopy(growthPilotTools.find(({ id }) => id === 'number-line-graphing-tool'), locale.key),
    'laplace-transform-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'laplace-transform-calculator'), locale.key),
    'vector-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'vector-calculator'), locale.key),
    'cubic-quartic-equation-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'cubic-quartic-equation-calculator'), locale.key),
    'complex-number-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'complex-number-calculator'), locale.key),
    'density-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'density-calculator'), locale.key),
    'kinetic-energy-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'kinetic-energy-calculator'), locale.key),
    'resistor-color-code-calculator': toolCopy(growthPilotTools.find(({ id }) => id === 'resistor-color-code-calculator'), locale.key),
  };
  const result = await buildGrowthStaticSite({
    outputDir,
    origin: 'https://tools.usefulverse.com',
    localeEntries: smallLocales,
    copyByLocale: fixtureCopyByLocale,
    controllerBundles,
    workerBundles,
    extraAssets,
    styles: 'body{font-family:system-ui}',
    faviconSvg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    currentTools,
  });
  assert.equal(result.pages, smallLocales.length * (growthPilotTools.length + 1));
  assert.equal(result.sitemapUrls, result.pages);
  assert.equal(await readFile(join(outputDir, 'favicon.svg'), 'utf8'), '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  assert.ok(result.files <= 18_500);
  assert.ok(result.assetFiles.length === growthPilotTools.length + 1 + Object.keys(workerBundles).length + Object.keys(extraAssets).length);
  const sitemap = await readFile(join(outputDir, 'sitemap.xml'), 'utf8');
  assert.ok(sitemap.includes('https://tools.usefulverse.com/es/tools/gravel-calculator/'));
  assert.ok(!sitemap.includes('https://usefulverse.com/tools/gravel-calculator/'));
  const workerAsset = result.assetFiles.map(([path]) => path.split('/').at(-1)).find((name) => name.startsWith('image-upscaler-worker.'));
  assert.ok(workerAsset);
  assert.match(await readFile(join(outputDir, 'assets', workerAsset), 'utf8'), /addEventListener/u);
  assert.deepEqual([...await readFile(join(outputDir, 'assets/models-test/onnx/model.onnx'))], [1, 2, 3]);
  assert.match(await readFile(join(outputDir, 'robots.txt'), 'utf8'), /https:\/\/tools\.usefulverse\.com\/sitemap\.xml/u);
  const arabic = locales.ar;
  assert.equal(arabic.prefix, '/ar');
  const enPage = await readFile(join(outputDir, 'tools/gravel-calculator/index.html'), 'utf8');
  assert.ok(enPage.includes('href="https://tools.usefulverse.com/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('hreflang="es" href="https://tools.usefulverse.com/es/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('hreflang="fr" href="https://tools.usefulverse.com/fr/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('hreflang="ko" href="https://tools.usefulverse.com/ko/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('hreflang="id" href="https://tools.usefulverse.com/id/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('hreflang="hi" href="https://tools.usefulverse.com/hi/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('hreflang="ar" href="https://tools.usefulverse.com/ar/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('hreflang="zh-CN" href="https://tools.usefulverse.com/zh-cn/tools/gravel-calculator/"'));
  assert.ok(enPage.includes('hreflang="bn" href="https://tools.usefulverse.com/bn/tools/gravel-calculator/"'));
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
  const dePage = await readFile(join(outputDir, 'de/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(dePage, /<html lang="de" dir="ltr">/u);
  assert.match(dePage, /Kiesrechner/u);
  assert.match(dePage, /Häufig gestellte Fragen/u);
  assert.doesNotMatch(dePage, />undefined</u);
  const jaPage = await readFile(join(outputDir, 'ja/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(jaPage, /<html lang="ja" dir="ltr">/u);
  assert.match(jaPage, /砂利計算機/u);
  assert.match(jaPage, /よくある質問/u);
  assert.doesNotMatch(jaPage, />undefined</u);
  const koPage = await readFile(join(outputDir, 'ko/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(koPage, /<html lang="ko" dir="ltr">/u);
  assert.match(koPage, /자갈 계산기/u);
  assert.match(koPage, /자주 묻는 질문/u);
  assert.doesNotMatch(koPage, />undefined</u);
  const idPage = await readFile(join(outputDir, 'id/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(idPage, /<html lang="id" dir="ltr">/u);
  assert.match(idPage, /Kalkulator kerikil/u);
  assert.match(idPage, /Pertanyaan umum/u);
  assert.doesNotMatch(idPage, />undefined</u);
  const hiPage = await readFile(join(outputDir, 'hi/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(hiPage, /<html lang="hi" dir="ltr">/u);
  assert.match(hiPage, /ग्रेवल कैलकुलेटर/u);
  assert.match(hiPage, /अक्सर पूछे जाने वाले सवाल/u);
  assert.doesNotMatch(hiPage, />undefined</u);
  const arPage = await readFile(join(outputDir, 'ar/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(arPage, /<html lang="ar" dir="rtl">/u);
  assert.match(arPage, /حاسبة الحصى/u);
  assert.match(arPage, /الأسئلة الشائعة/u);
  assert.doesNotMatch(arPage, />undefined</u);
  const zhPage = await readFile(join(outputDir, 'zh-cn/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(zhPage, /<html lang="zh-CN" dir="ltr">/u);
  assert.match(zhPage, /碎石计算器/u);
  assert.match(zhPage, /常见问题/u);
  assert.doesNotMatch(zhPage, />undefined</u);
  const bnPage = await readFile(join(outputDir, 'bn/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(bnPage, /<html lang="bn" dir="ltr">/u);
  assert.match(bnPage, /নুড়িপাথরের হিসাবকারী/u);
  assert.match(bnPage, /সচরাচর জিজ্ঞাসিত প্রশ্নাবলী/u);
  assert.doesNotMatch(bnPage, />undefined</u);
  const ruPage = await readFile(join(outputDir, 'ru/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(ruPage, /<html lang="ru" dir="ltr">/u);
  assert.match(ruPage, /Калькулятор гравия/u);
  assert.match(ruPage, /Часто задаваемые вопросы/u);
  assert.doesNotMatch(ruPage, />undefined</u);
  const urPage = await readFile(join(outputDir, 'ur/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(urPage, /<html lang="ur" dir="rtl">/u);
  assert.match(urPage, /بجری کا کیلکولیٹر/u);
  assert.match(urPage, /اکثر پوچھے گئے سوالات/u);
  assert.doesNotMatch(urPage, />undefined</u);
  const trPage = await readFile(join(outputDir, 'tr/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(trPage, /<html lang="tr" dir="ltr">/u);
  assert.match(trPage, /Çakıl hesaplayıcı/u);
  assert.match(trPage, /Sıkça sorulan sorular/u);
  assert.doesNotMatch(trPage, />undefined</u);
  const viPage = await readFile(join(outputDir, 'vi/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(viPage, /<html lang="vi" dir="ltr">/u);
  assert.match(viPage, /Công cụ tính sỏi/u);
  assert.match(viPage, /Câu hỏi thường gặp/u);
  assert.doesNotMatch(viPage, />undefined</u);
  const itPage = await readFile(join(outputDir, 'it/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(itPage, /<html lang="it-IT" dir="ltr">/u);
  assert.match(itPage, /Calcolatore di ghiaia/u);
  assert.match(itPage, /Domande frequenti/u);
  assert.doesNotMatch(itPage, />undefined</u);
  const zhTwPage = await readFile(join(outputDir, 'zh-tw/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(zhTwPage, /<html lang="zh-TW" dir="ltr">/u);
  assert.match(zhTwPage, /碎石計算器/u);
  assert.match(zhTwPage, /常見問題/u);
  assert.doesNotMatch(zhTwPage, />undefined</u);
  const bgPage = await readFile(join(outputDir, 'bg/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(bgPage, /<html lang="bg-BG" dir="ltr">/u);
  assert.match(bgPage, /Калкулатор за чакъл/u);
  assert.match(bgPage, /Често задавани въпроси/u);
  assert.doesNotMatch(bgPage, />undefined</u);
  const caPage = await readFile(join(outputDir, 'ca/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(caPage, /<html lang="ca-ES" dir="ltr">/u);
  assert.match(caPage, /Calculadora de grava/u);
  assert.match(caPage, /Preguntes freqüents/u);
  assert.doesNotMatch(caPage, />undefined</u);
  const nlPage = await readFile(join(outputDir, 'nl/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(nlPage, /<html lang="nl-NL" dir="ltr">/u);
  assert.match(nlPage, /Grindcalculator/u);
  assert.match(nlPage, /Veelgestelde vragen/u);
  assert.doesNotMatch(nlPage, />undefined</u);
  const elPage = await readFile(join(outputDir, 'el/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(elPage, /<html lang="el-GR" dir="ltr">/u);
  assert.match(elPage, /Υπολογιστής ποσότητας χαλικιού/u);
  assert.match(elPage, /Συχνές ερωτήσεις/u);
  assert.doesNotMatch(elPage, />undefined</u);
  const msPage = await readFile(join(outputDir, 'ms/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(msPage, /<html lang="ms-MY" dir="ltr">/u);
  assert.match(msPage, /Kalkulator batu kerikil/u);
  assert.match(msPage, /Soalan lazim/u);
  assert.doesNotMatch(msPage, />undefined</u);
  const plPage = await readFile(join(outputDir, 'pl/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(plPage, /<html lang="pl-PL" dir="ltr">/u);
  assert.match(plPage, /Kalkulator żwiru/u);
  assert.match(plPage, /Często zadawane pytania/u);
  assert.doesNotMatch(plPage, />undefined</u);
  const svPage = await readFile(join(outputDir, 'sv/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(svPage, /<html lang="sv-SE" dir="ltr">/u);
  assert.match(svPage, /Gruskalkylator/u);
  assert.match(svPage, /Vanliga frågor/u);
  assert.doesNotMatch(svPage, />undefined</u);
  const thPage = await readFile(join(outputDir, 'th/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(thPage, /<html lang="th-TH" dir="ltr">/u);
  assert.match(thPage, /เครื่องคำนวณกรวด/u);
  assert.match(thPage, /คำถามที่พบบ่อย/u);
  assert.doesNotMatch(thPage, />undefined</u);
  const ukPage = await readFile(join(outputDir, 'uk/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(ukPage, /<html lang="uk-UA" dir="ltr">/u);
  assert.match(ukPage, /Калькулятор гравію/u);
  assert.match(ukPage, /Поширені запитання/u);
  assert.doesNotMatch(ukPage, />undefined</u);
  const swPage = await readFile(join(outputDir, 'sw/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(swPage, /<html lang="sw-KE" dir="ltr">/u);
  assert.match(swPage, /Kikokotoo cha changarawe/u);
  assert.match(swPage, /Maswali yanayoulizwa mara kwa mara/u);
  assert.doesNotMatch(swPage, />undefined</u);
  const mrPage = await readFile(join(outputDir, 'mr/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(mrPage, /<html lang="mr-IN" dir="ltr">/u);
  assert.match(mrPage, /खडीचे गणक/u);
  assert.match(mrPage, /वारंवार विचारले जाणारे प्रश्न/u);
  assert.doesNotMatch(mrPage, />undefined</u);
  const tePage = await readFile(join(outputDir, 'te/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(tePage, /<html lang="te-IN" dir="ltr">/u);
  assert.match(tePage, /కంకర కాలిక్యులేటర్/u);
  assert.match(tePage, /తరచుగా అడిగే ప్రశ్నలు/u);
  assert.doesNotMatch(tePage, />undefined</u);
  const haPage = await readFile(join(outputDir, 'ha/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(haPage, /<html lang="ha-NG" dir="ltr">/u);
  assert.match(haPage, /Kalkuleta tsakuwa/u);
  assert.match(haPage, /Tambayoyin da ake yawan yi/u);
  assert.doesNotMatch(haPage, />undefined</u);
  const tlPage = await readFile(join(outputDir, 'tl/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(tlPage, /<html lang="fil-PH" dir="ltr">/u);
  assert.match(tlPage, /Kalkulador ng graba/u);
  assert.match(tlPage, /Mga madalas itanong/u);
  assert.doesNotMatch(tlPage, />undefined</u);
  const taPage = await readFile(join(outputDir, 'ta/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(taPage, /<html lang="ta-IN" dir="ltr">/u);
  assert.match(taPage, /சரளைக் கணிப்பான்/u);
  assert.match(taPage, /அடிக்கடி கேட்கப்படும் கேள்விகள்/u);
  assert.doesNotMatch(taPage, />undefined</u);
  const faPage = await readFile(join(outputDir, 'fa/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(faPage, /<html lang="fa-IR" dir="rtl">/u);
  assert.match(faPage, /ماشین‌حساب شن و ماسه/u);
  assert.match(faPage, /پرسش‌های متداول/u);
  assert.match(faPage, /hreflang="fa-IR" href="https:\/\/tools\.usefulverse\.com\/fa\/tools\/gravel-calculator\//u);
  assert.doesNotMatch(faPage, />undefined</u);
  const amPage = await readFile(join(outputDir, 'am/tools/gravel-calculator/index.html'), 'utf8');
  assert.match(amPage, /<html lang="am-ET" dir="ltr">/u);
  assert.match(amPage, /የጠጠር ማስያ/u);
  assert.match(amPage, /ተደጋጋሚ ጥያቄዎች/u);
  assert.match(amPage, /hreflang="am-ET" href="https:\/\/tools\.usefulverse\.com\/am\/tools\/gravel-calculator\//u);
  assert.doesNotMatch(amPage, />undefined</u);
  const files = await readdir(join(outputDir, 'assets'));
  // Top-level entries include the stylesheet, one controller per tool, the
  // model worker, and the models directory (whose contents are nested).
  assert.equal(files.length, growthPilotTools.length + 3);
  assert.ok((await stat(join(outputDir, 'assets', files[0]))).isFile());
});

test('static build refuses overwrite, missing translated pages/controllers, and file-count overflow', async (context) => {
  const tempRoot = await mkdtemp(join(tmpdir(), 'usefulverse-growth600-gates-'));
  context.after(async () => rm(tempRoot, { recursive: true, force: true }));
  const smallLocales = localeEntries.filter(({ key }) => key === 'en');
  const base = { origin: 'https://tools.usefulverse.com', localeEntries: smallLocales, copyByLocale: createCopy(smallLocales), controllerBundles: Object.fromEntries(growthPilotTools.map((tool) => [tool.id, 'export {};'])), styles: 'body{}', faviconSvg: '<svg/>', currentTools };
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: tempRoot }), /Refusing to overwrite/);
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'overflow'), maxFiles: 1 }), /safety cap is 1/);
  assert.equal(await stat(join(tempRoot, 'overflow')).then(() => true, () => false), false, 'failed build must not leave a partial output directory');
  assert.deepEqual((await readdir(tempRoot)).filter((name) => name.startsWith('.growth600-build-')), [], 'failed build must clean its staging directory');
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'oversized-file'), maxFileBytes: 1 }), /per-file maximum/u);
  assert.equal(await stat(join(tempRoot, 'oversized-file')).then(() => true, () => false), false, 'file-size rejection must not leave a partial output directory');
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
  const workerWithDynamicCode = { 'trusted-runtime-worker': 'new Function("return 1")()' };
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'untrusted-worker'), workerBundles: workerWithDynamicCode }), /worker contains dynamic code execution/u);
  const trustedWorkerBuild = await buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'trusted-worker'), workerBundles: workerWithDynamicCode, trustedWorkerDynamicCode: ['trusted-runtime-worker'] });
  assert.ok(trustedWorkerBuild.assetFiles.some(([path]) => path.startsWith('assets/trusted-runtime-worker.')));
  const tooLarge = { ...base.controllerBundles, mancala: 'x'.repeat(25 * 1024) };
  await assert.rejects(buildGrowthStaticSite({ ...base, outputDir: join(tempRoot, 'oversized-controller'), controllerBundles: tooLarge }), /initial runtime budget/);
});

test('local controller guard permits the standard SVG XML namespace but still blocks remote requests', async () => {
  const { assertLocalController } = await import('./build.mjs');
  assert.doesNotThrow(() => assertLocalController('svg-export', 'const svg = \'<svg xmlns="http://www.w3.org/2000/svg"></svg>\';', 1024));
  assert.throws(() => assertLocalController('remote-controller', 'fetch("https://example.invalid/api")', 1024), /must not contact a remote service/u);
  assert.doesNotThrow(() => assertLocalController('schema-markup-validator', 'fetch(new URL("/assets/schemaorg-v30.1.json",location.origin),{credentials:"omit",cache:"force-cache"})', 1024));
  assert.doesNotThrow(() => assertLocalController('schema-markup-validator', 'const vocabulary = "https://schema.org/";', 1024));
  assert.throws(() => assertLocalController('remote-controller', 'fetch("https://schema.org/")', 1024), /must not contact a remote service/u);
  assert.throws(() => assertLocalController('schema-markup-validator', 'fetch(new URL(userInput,location.origin))', 1024), /must not contact a remote service/u);
});
