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

const actions = { calculate: 'Calculate', generate: 'Generate', reset: 'Reset', example: 'Example', newGame: 'New game', rules: 'Rules', reveal: 'Reveal', next: 'Next', copy: 'Copy', download: 'Download', result: 'Result', rectangle: 'Rectangle', circle: 'Circle', triangle: 'Triangle', meters: 'Meters', centimeters: 'Centimeters', feet: 'Feet', inches: 'Inches', liters: 'Liters', cubicFeet: 'Cubic feet', kgPerCubicMeter: 'Kilograms per cubic meter', lbPerCubicFoot: 'Pounds per cubic foot', kilograms: 'Kilograms', pounds: 'Pounds', computer: 'Computer', twoPlayers: 'Two players', privacyNote: 'Private on this device.' };
const messages = { copied: 'Copied.', copyUnavailable: 'Copy unavailable.', calculated: 'Done.', sameSize: 'Sizes match.', checkInputs: 'Check entries.', diameter: 'Outside diameter', sidewall: 'Sidewall height', circumference: 'Circumference', revolutions: 'Revolutions per kilometre', diameterDifference: 'Diameter difference', diameterChange: 'Diameter change', groundClearance: 'Ground-clearance change', actualSpeed: 'Actual speed estimate', area: 'Area', volume: 'Volume', volumePerContainer: 'Volume per container', totalVolume: 'Total soil volume', orderVolume: 'Order volume', estimatedWeight: 'Estimated weight', bagsToBuy: 'Bags to buy', invalidFormula: 'Check formula.', atomCount: 'atoms', molarMass: 'Molar mass', estimateOnly: 'Estimate only.', currentPayment: 'Current payment', newPayment: 'New payment', paymentDifference: 'Difference', currentTotal: 'Current total', newTotal: 'New total', estimatedDifference: 'Estimated savings', breakEven: 'Break-even', noBreakEven: 'No break-even', monthCount: '{count} months', privatePair: '{giver} gives to {recipient}', allRevealed: 'All revealed.', drawReady: 'Ready.', checkNamesAndRules: 'Check entries.', downloaded: 'Downloaded.', pit: 'Pit', seeds: 'seeds', playerOne: 'Player one', playerTwo: 'Player two', playerOneWins: 'Player one wins.', playerTwoWins: 'Player two wins.', tie: 'Tie.', gameOver: 'Game over.', turn: '{player} turn.' };
function toolCopy(tool, language) {
  const name = `${tool.id} ${language}`;
  const fields = {
    'image-region-redactor': { imageFile: 'Choose a raster image', mode: 'Redaction style', strength: 'Pixel size or blur amount', regionX: 'Left position in pixels', regionY: 'Top position in pixels', regionWidth: 'Region width in pixels', regionHeight: 'Region height in pixels', accuracyNote: 'Use black for private details; large images need enough memory.', dragHint: 'Drag to select or enter exact coordinates.', regionsLabel: 'Selected regions', format: 'Export format', relatedMosaic: 'Try a whole-image mosaic.', relatedCropper: 'Try the image cropper.' },
    'image-upscaler': { imageFile: 'Choose an image', accuracyNote: 'Local model; 1 megapixel limit.', progressHint: 'Progress', sourcePreview: 'Original', resultPreview: 'Result', relatedResizer: 'Resize image.', relatedSharpener: 'Sharpen image.' },
    'wallpaper-calculator': { unit: 'Unit', perimeter: 'Wall perimeter', wallHeight: 'Wall height', openingsArea: 'Opening area', rollWidth: 'Roll width', rollLength: 'Roll length', patternRepeat: 'Pattern repeat', wastePercent: 'Extra material', accuracyNote: 'Planning estimate only.', relatedPaintCalculator: 'Need paint too? Try the paint calculator.' },
    'pool-salt-calculator': { volume: 'Pool volume', volumeUnit: 'Volume unit', currentSalinityPpm: 'Current salinity ppm', targetSalinityPpm: 'Target salinity ppm', saltPurityPercent: 'Salt purity', bagSize: 'Bag size', bagUnit: 'Bag unit', accuracyNote: 'Use the manufacturer target.' },
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
  'weight-loss-calculator': { currentWeight: 'Current weight', targetWeight: 'Goal weight', dailyDeficit: 'Daily deficit', unit: 'Weight unit', methodNote: '7,700 kcal per kg; simple arithmetic only.', healthNote: 'Not medical advice.', sourceNiddk: 'Model notes:', sourceCdc: 'Gradual change' },
    'heloc-calculator': { creditLimit: 'Credit limit', balance: 'Current balance', annualApr: 'Annual APR', drawMonths: 'Draw period in months', repaymentMonths: 'Repayment period in months', currency: 'Currency', accuracyNote: 'Fixed APR; no additional draws or fees are modeled.', relatedLoanCalculator: 'See loan payment calculator.' },
  }[tool.id];
  if (tool.id === 'tire-size-calculator') {
    Object.assign(actions, { kmh: 'Kilometres per hour (km/h)', mph: 'Miles per hour (mph)' });
  }
  if (tool.id === 'pool-volume-calculator') Object.assign(actions, { oval: 'Oval', flat: 'Flat floor', sloped: 'Sloped floor' });
  if (tool.id === 'roof-pitch-calculator') Object.assign(actions, { millimeters: 'Millimeters' });
  if (tool.id === 'drywall-calculator') Object.assign(actions, { millimeters: 'Millimeters', withCeiling: 'Walls and ceiling', wallsOnly: 'Walls only' });
  if (tool.id === 'roofing-calculator') Object.assign(actions, { squareMeters: 'Square metres', squareFeet: 'Square feet' });
  if (tool.id === 'deck-calculator') Object.assign(actions, { millimeters: 'Millimeters' });
  if (tool.id === 'fence-calculator') Object.assign(actions, { millimeters: 'Millimeters' });
  if (tool.id === 'pool-salt-calculator') Object.assign(actions, { liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons' });
  if (tool.id === 'image-region-redactor') Object.assign(actions, { load: 'Choose image', addRegion: 'Add region', undo: 'Undo last region', clear: 'Remove all regions', export: 'Apply redactions', removeRegion: 'Remove region', black: 'Solid black', pixelate: 'Pixelate', blur: 'Blur', png: 'PNG', jpeg: 'JPEG' });
  if (tool.id === 'image-upscaler') Object.assign(actions, { upscale: 'Upscale 2×', cancel: 'Cancel processing' });
  if (tool.id === 'dominoes-game') Object.assign(actions, { draw: 'Draw a tile', pass: 'Pass', playLeft: 'Play left', playRight: 'Play right', drawRule: 'Draw dominoes', blockRule: 'Block dominoes' });
  if (tool.id === 'weight-loss-calculator') Object.assign(actions, { dayUnit: 'days', weekUnit: 'weeks', kilocalories: 'kcal', perWeek: 'per week' });
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
  const weightMessages = tool.id === 'weight-loss-calculator' ? { weightToLose: 'Weight difference', energyEquivalent: 'Linear energy equivalent', timeline: 'Timeline', weeklyRate: 'Weekly rate', noDeficitChange: 'Zero modeled change.', paceNote: 'This is not a recommended target.' } : {};
  const helocMessages = tool.id === 'heloc-calculator' ? { interestOnlyPayment: 'Interest-only payment', availableCredit: 'Available credit', repaymentPayment: 'Repayment payment', paymentChange: 'Payment change', drawInterest: 'Draw-period interest', repaymentInterest: 'Repayment interest', totalInterest: 'Total modeled interest', totalPayments: 'Total payments', estimateOnly: 'Illustration only; actual HELOC terms vary.' } : {};
  const localized = { name, title: `${name} free | UsefulVerse`, description: `Free ${name} that works in your browser, with no account required.`, intro: `Use this ${name} for free in your browser.`, howQuestion: `How do I use ${name}?`, howAnswer: `Enter the details and use the controls shown.`, privacyQuestion: 'Is my data uploaded?', privacyAnswer: 'No. This tool runs locally in this browser.', fields, actions, messages: { ...localizedMessages, ...asphaltMessages, ...poolMessages, ...saltMessages, ...roofMessages, ...drywallMessages, ...roofingMessages, ...deckMessages, ...fenceMessages, ...redactorMessages, ...upscalerMessages, ...dominoMessages, ...weightMessages, ...helocMessages }, copyLanguage: language };
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
  if (tool.id === 'dominoes-game') localized.additionalFaqs = [
    { question: 'Draw or block?', answer: 'The variant changes drawing rules.' },
    { question: 'Can two people play locally?', answer: 'Yes. Two people can share one device.' },
  ];
  if (tool.id === 'weight-loss-calculator') localized.additionalFaqs = [
    { question: 'Is this a body-weight prediction?', answer: 'No. It is simple linear arithmetic; body-weight change is dynamic.' },
    { question: 'What does a zero deficit show?', answer: 'Zero modeled energy change and no finite timeline.' },
  ];
  if (tool.id === 'heloc-calculator') localized.additionalFaqs = [
    { question: 'What happens to payments when the draw period ends?', answer: 'This estimate moves the current balance into equal monthly principal-and-interest payments over the term you enter.' },
    { question: 'Does it include future withdrawals or a changing rate?', answer: 'No. It assumes no more draws and one unchanged APR; lender rules, fees and variable-rate changes can make actual payments different.' },
  ];
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
  const result = await buildGrowthStaticSite({
    outputDir,
    origin: 'https://tools.usefulverse.com',
    localeEntries: smallLocales,
    copyByLocale: { en: englishGrowthCopy, es: spanishGrowthCopy, fr: frenchGrowthCopy, pt: portugueseGrowthCopy, de: germanGrowthCopy, ja: japaneseGrowthCopy, ko: koreanGrowthCopy, id: indonesianGrowthCopy, hi: hindiGrowthCopy, ar: arabicGrowthCopy, zh: simplifiedChineseGrowthCopy, bn: bengaliGrowthCopy, ru: russianGrowthCopy, ur: urduGrowthCopy, tr: turkishGrowthCopy, vi: vietnameseGrowthCopy, it: italianGrowthCopy, zh_tw: traditionalChineseGrowthCopy, bg: bulgarianGrowthCopy, ca: catalanGrowthCopy, nl: dutchGrowthCopy, el: greekGrowthCopy, ms: malayGrowthCopy, pl: polishGrowthCopy, sv: swedishGrowthCopy, th: thaiGrowthCopy, uk: ukrainianGrowthCopy, sw: swahiliGrowthCopy, mr: marathiGrowthCopy, te: teluguGrowthCopy, ha: hausaGrowthCopy, tl: filipinoGrowthCopy, ta: tamilGrowthCopy, fa: persianGrowthCopy, am: amharicGrowthCopy, gu: gujaratiGrowthCopy },
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
