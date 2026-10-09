import assert from 'node:assert/strict';
import test from 'node:test';
import { growthPilotTools } from './catalog.mjs';
import { renderGrowthForm } from './forms.mjs';
import { abTestEnglishCopy } from './locales/a-b-test-calculator.en.mjs';
import { investmentAllocationEnglishCopy } from './locales/investment-allocation-calculator.en.mjs';
import { repeatingDecimalEnglishCopy } from './locales/repeating-decimal-to-fraction.en.mjs';
import { parametricEquationEnglishCopy } from './locales/parametric-equation-calculator.en.mjs';
import { singularValueDecompositionEnglishCopy } from './locales/singular-value-decomposition-calculator.en.mjs';
import { spearmanCorrelationEnglishCopy } from './locales/spearman-correlation-calculator.en.mjs';
import { wilcoxonSignedRankEnglishCopy } from './locales/wilcoxon-signed-rank-test-calculator.en.mjs';
import { chineseRemainderEnglishCopy } from './locales/chinese-remainder-theorem-calculator.en.mjs';
import { jsonDiffEnglishCopy } from './locales/json-diff.en.mjs';
import { textToBinaryEnglishCopy } from './locales/text-to-binary.en.mjs';
import { certificateDecoderEnglishCopy } from './locales/certificate-decoder.en.mjs';
import { jsonToXmlEnglishCopy } from './locales/json-to-xml-converter.en.mjs';
import { harViewerEnglishCopy } from './locales/har-viewer.en.mjs';
import { robotsTxtTesterEnglishCopy } from './locales/robots-txt-tester.en.mjs';
import { jsonToExcelEnglishCopy } from './locales/json-to-excel.en.mjs';
import { binaryBase64ToolEnglishCopy } from './locales/binary-base64-tool.en.mjs';
import { jsonModelGeneratorEnglishCopy } from './locales/json-model-generator.en.mjs';
import { csvEditorEnglishCopy } from './locales/csv-editor.en.mjs';
import { phCalculatorEnglishCopy } from './locales/ph-calculator.en.mjs';
import { sectionModulusCalculatorEnglishCopy } from './locales/section-modulus-calculator.en.mjs';
import { frequencyWavelengthCalculatorEnglishCopy } from './locales/frequency-wavelength-calculator.en.mjs';
import { idealGasLawCalculatorEnglishCopy } from './locales/ideal-gas-law-calculator.en.mjs';
import { torqueCalculatorEnglishCopy } from './locales/torque-calculator.en.mjs';
import torqueCalculatorCopies from './locales/torque-calculator.mjs';
import { beamDeflectionCalculatorEnglishCopy } from './locales/beam-deflection-calculator.en.mjs';

const actions = {
  calculate: 'Calculate', generate: 'Generate', reset: 'Reset', example: 'Load example', newGame: 'New game', rules: 'Rules', reveal: 'Reveal', next: 'Next', copy: 'Copy', download: 'Download', result: 'Result', rectangle: 'Rectangle', circle: 'Circle', triangle: 'Triangle', meters: 'Meters', centimeters: 'Centimeters', millimeters: 'Millimeters', feet: 'Feet', inches: 'Inches', squareMeters: 'Square meters', squareFeet: 'Square feet', cubicMeters: 'Cubic meters', cubicFeet: 'Cubic feet', kelvin: 'Kelvin difference', fahrenheit: 'Fahrenheit difference', kilowatts: 'Kilowatts (kW)', btuPerHour: 'BTU per hour (BTU/h)', kgPerCubicMeter: 'Kilograms per cubic meter', lbPerCubicFoot: 'Pounds per cubic foot', kilograms: 'Kilograms', pounds: 'Pounds', computer: 'Play computer', twoPlayers: 'Two players', privacyNote: 'Assignments are visible on this device.', kmh: 'Kilometres per hour (km/h)', mph: 'Miles per hour (mph)', withCeiling: 'Walls and ceiling', wallsOnly: 'Walls only', productionMode: 'Estimate array output', sizingMode: 'Size for daily use', years: 'years', add: 'Add', subtract: 'Subtract', multiply: 'Multiply', divide: 'Divide', magnitude: 'Modulus', argument: 'Argument', rectangularToPolar: 'Rectangular to polar', polarToRectangular: 'Polar to rectangular', roots: 'Nth roots',
};
const messages = { copied: 'Copied.', copyUnavailable: 'Copy is unavailable.', calculated: 'Calculation complete.', sameSize: 'These tire sizes are the same.', checkInputs: 'Check your entries.', diameter: 'Nominal outside diameter', sidewall: 'Sidewall height', circumference: 'Nominal circumference', revolutions: 'Revolutions per kilometre', diameterDifference: 'Diameter difference', diameterChange: 'Diameter change', groundClearance: 'Estimated ground-clearance change', actualSpeed: 'Estimated actual speed', area: 'Area', volume: 'Volume', liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons', averageDepth: 'Average depth', orderVolume: 'Order volume', estimatedWeight: 'Estimated weight', bagsToBuy: 'Bags to buy', invalidFormula: 'Check the chemical formula.', atomCount: 'atoms', molarMass: 'Molar mass', estimateOnly: 'Estimate only; compare lender offers.', currentPayment: 'Current monthly payment', newPayment: 'New monthly payment', paymentDifference: 'Monthly payment difference', currentTotal: 'Current remaining total', newTotal: 'New loan total', estimatedDifference: 'Estimated savings (negative means higher cost)', breakEven: 'Break-even', noBreakEven: 'No break-even within the compared terms', monthCount: '{count} months', privatePair: '{giver} gives to {recipient}', allRevealed: 'All pairs revealed.', drawReady: 'Draw ready. Reveal one person at a time.', checkNamesAndRules: 'Check the names and exclusions.', downloaded: 'Downloaded.', riserHeight: 'Riser height', treadCount: 'Tread count', totalRun: 'Total run', angle: 'Angle', stringerLength: 'Stringer length', diagram: 'Stair side view', pit: 'Pit', seeds: 'seeds', playerOne: 'Player one', playerTwo: 'Player two', playerOneWins: 'Player one wins.', playerTwoWins: 'Player two wins.', tie: 'Tie game.', gameOver: 'Game over.', turn: '{player} to move.', angleDegrees: 'Angle', angleRadians: 'Angle in radians', slopePercent: 'Slope', pitch: 'Rise per 12 run', rafterLength: 'Rafter length', wallArea: 'Net wall area', ceilingArea: 'Ceiling area', totalArea: 'Total surface area', boardCount: 'Whole boards', boardCoverage: 'Board coverage', estimatedScrews: 'Estimated screws', jointSeams: 'Joint seams', estimatedCost: 'Estimated cost', costNotEntered: 'Enter price.', costEstimateNote: 'Currency is not assumed.' };
const copies = {
  'image-sharpener': { name: 'Image sharpener', actions: { ...actions, load: 'Choose image', export: 'Prepare download', download: 'Download', original: 'Show original', sharpened: 'Sharpened preview', png: 'PNG', jpeg: 'JPEG' }, messages: { ...messages, unsupportedImage: 'Unsupported image.', imageTooLarge: 'Image too large.', imageReady: 'Image ready.', selectImage: 'Choose an image first.', exporting: 'Sharpening…', exportFailed: 'Export failed.', exportReady: 'Image ready.' }, fields: { imageFile: 'Choose image', amount: 'Strength', radius: 'Radius', threshold: 'Threshold', compare: 'Show original', accuracyNote: 'Processed locally; 8 megapixel limit.', previewHint: 'Preview is reduced.', format: 'Format', relatedRedactor: 'Redact private details.', relatedCropper: 'Crop the image.' } },
  'photo-to-sketch': { name: 'Photo to sketch', actions: { ...actions, load: 'Choose image', export: 'Create sketch PNG', cancel: 'Cancel processing', download: 'Download sketch PNG', original: 'Show original' }, messages: { ...messages, unsupportedImage: 'Unsupported image.', imageTooLarge: 'Image too large.', imageReady: 'Image ready.', selectImage: 'Choose an image first.', exporting: 'Creating sketch…', cancelled: 'Processing cancelled.', exportFailed: 'Export failed.', exportReady: 'Sketch ready.' }, fields: { imageFile: 'Choose image', intensity: 'Sketch intensity', detail: 'Fine-detail threshold', compare: 'Show original', accuracyNote: 'Local processing; maximum 8 megapixels.', previewHint: 'Reduced preview.' } },
  'schema-markup-validator': { name: 'Schema markup validator', actions: { ...actions, validate: 'Validate markup', copySummary: 'Copy summary' }, messages: { ...messages, invalidJson: 'Invalid JSON.', rootNotObject: 'Expected an object.', inputTooLarge: 'Input too long.', loadingVocabulary: 'Loading terms.', vocabularyUnavailable: 'Terms unavailable.', valid: 'Valid.', invalid: 'Invalid.', unknownType: 'Unknown type.', unknownProperty: 'Unknown property.', noTypedEntity: 'No type.', exampleLoaded: 'Example loaded.' }, fields: { markup: 'Paste JSON-LD', accuracyNote: 'Local checks.', resultSummary: 'Summary', issues: 'Findings', googleNote: 'Not a Google test.' } },
  'readability-checker': { name: 'Readability checker', actions: { ...actions }, messages: { ...messages }, fields: { text: 'Text', language: 'Language', languageEn: 'English', languageEs: 'Español', languageFr: 'Français', languageDe: 'Deutsch', languageIt: 'Italiano', accuracyNote: 'Estimates only.', resultSummary: 'Results', formula: 'Formula', wordCount: 'Words', sentenceCount: 'Sentences', characterCount: 'Characters', characterCountNoSpaces: 'Characters without spaces', letterCount: 'Letters', syllableEstimate: 'Syllables', averageSentenceLength: 'Words per sentence', averageWordLength: 'Letters per word', averageSyllablesPerWord: 'Syllables per word', longWordCount: 'Long words' } },
  'image-upscaler': { name: 'Image upscaler', actions: { ...actions, upscale: 'Upscale 2×', cancel: 'Cancel', download: 'Download' }, messages: { ...messages, unsupportedImage: 'Unsupported image.', imageTooLarge: 'Image too large.', imageReady: 'Image ready.', selectImage: 'Choose image.', modelLoading: 'Loading model.', processing: 'Processing.', cancelled: 'Cancelled.', workerUnavailable: 'Worker unavailable.', processingFailed: 'Failed.', outputReady: 'Ready.' }, fields: { imageFile: 'Choose image', accuracyNote: 'Local model; 1 megapixel limit.', progressHint: 'Progress', sourcePreview: 'Original', resultPreview: 'Result' } },
  'image-region-redactor': { name: 'Image pixelator', actions: { ...actions, load: 'Choose image', addRegion: 'Add region', undo: 'Undo', clear: 'Clear regions', export: 'Apply redactions', removeRegion: 'Remove', black: 'Black', pixelate: 'Pixelate', blur: 'Blur', png: 'PNG', jpeg: 'JPEG' }, messages: { ...messages, unsupportedImage: 'Unsupported image.', imageTooLarge: 'Image too large.', imageReady: 'Image ready.', selectImage: 'Choose an image.', invalidRegion: 'Check the region.', regionAdded: 'Region added.', regionRemoved: 'Region removed.', regionsCleared: 'Regions cleared.', addRegionFirst: 'Add a region first.', exporting: 'Applying regions…', exportFailed: 'Export failed.', exportReady: 'Export ready.', region: 'Region' }, fields: { imageFile: 'Choose image', mode: 'Mode', strength: 'Strength', regionX: 'Left', regionY: 'Top', regionWidth: 'Width', regionHeight: 'Height', accuracyNote: 'Use black for sensitive details.', dragHint: 'Drag or enter exact coordinates.', regionsLabel: 'Regions', format: 'Format', relatedMosaic: 'Make a mosaic.', relatedCropper: 'Crop the image.' } },
  'wallpaper-calculator': { name: 'Wallpaper calculator', actions: { ...actions }, messages: { ...messages, netArea: 'Net wall area', strips: 'Strips', dropLength: 'Drop length', dropsPerRoll: 'Drops per roll', stripsToOrder: 'Strips to order', rolls: 'Rolls' }, fields: { unit: 'Unit', perimeter: 'Perimeter', wallHeight: 'Wall height', openingsArea: 'Opening area', rollWidth: 'Roll width', rollLength: 'Roll length', patternRepeat: 'Pattern repeat', wastePercent: 'Extra material', accuracyNote: 'Planning estimate only.', relatedPaintCalculator: 'Try paint calculator.' } },
  'pool-salt-calculator': { name: 'Pool salt calculator', actions: { ...actions, liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons' }, messages: { ...messages, noSaltNeeded: 'No salt needed.', poolVolume: 'Pool volume', currentSalinity: 'Current salinity', targetSalinity: 'Target salinity', increase: 'Increase', pureSalt: 'Pure salt', saltToAdd: 'Salt to add', bags: 'Bags' }, fields: { volume: 'Volume', volumeUnit: 'Volume unit', currentSalinityPpm: 'Current salinity ppm', targetSalinityPpm: 'Target salinity ppm', saltPurityPercent: 'Purity', bagSize: 'Bag size', bagUnit: 'Bag unit', accuracyNote: 'Use manufacturer target.' } },
  'fence-calculator': { name: 'Fence calculator', actions: { ...actions }, messages: { ...messages, totalRun: 'Total run', gateOpening: 'Gate opening', fenceLength: 'Fence length', sections: 'Sections', averageSection: 'Average section', posts: 'Posts', panels: 'Panels', pickets: 'Pickets', picketGap: 'Picket gap', picketLength: 'Picket length', extra: 'extra', onePicket: 'One picket', panelCost: 'Panel cost', picketCost: 'Picket cost' }, fields: { unit: 'Run unit', length: 'Total length', gateCount: 'Number of gates', gateWidth: 'Gate width', materialUnit: 'Material unit', postSpacing: 'Post spacing', panelWidth: 'Panel width', picketWidth: 'Picket width', maxPicketGap: 'Maximum gap', picketHeight: 'Fence height', wastePercent: 'Extra material', pricePerPost: 'Price per post', pricePerGate: 'Price per gate', pricePerPanel: 'Price per panel', pricePerPicket: 'Price per picket', accuracyNote: 'Estimate only; gates are distributed evenly.' } },
  'deck-calculator': { name: 'Deck calculator', actions: { ...actions, costNotEntered: 'Enter a board price.' }, messages: { ...messages, area: 'Deck area', boardRows: 'Board rows', coveredWidth: 'Covered width', orderLength: 'Order length', boards: 'Boards', supportLines: 'Support lines', fasteners: 'Fasteners', joints: 'Joints' }, fields: { unit: 'Deck unit', length: 'Length', width: 'Width', boardUnit: 'Board and support unit', boardWidth: 'Board width', gap: 'Gap', stockBoardLength: 'Stock length', joistSpacing: 'Joist spacing', wastePercent: 'Extra material', fastenersPerIntersection: 'Fasteners per crossing', pricePerBoard: 'Price per board', safetyNote: 'Estimate only; joints require support.' } },
  'roofing-calculator': { name: 'Roofing calculator', actions: { ...actions, squareMeters: 'Square metres', squareFeet: 'Square feet' }, messages: { ...messages, projectedArea: 'Projected area', roofArea: 'Sloped area', extraArea: 'Order area', pitch: 'Pitch', slopeFactor: 'Slope multiplier', roofingSquares: 'Roofing squares', bundles: 'Bundles', estimatedCost: 'Estimated cost', costNotEntered: 'Enter bundle price.' }, fields: { projectedArea: 'Projected area', areaUnit: 'Area unit', rise: 'Rise', run: 'Run', pitchUnit: 'Pitch unit', wastePercent: 'Extra material', bundlesPerSquare: 'Bundles per square', pricePerBundle: 'Price per bundle', safetyNote: 'Estimate only; verify with a roofer.' } },
  'drywall-calculator': { name: 'Drywall calculator', actions, messages, fields: { roomLength: 'Room length', roomWidth: 'Room width', wallHeight: 'Wall height', openingArea: 'Opening area', roomCount: 'Room count', unit: 'Unit', includeCeiling: 'Surfaces', boardWidth: 'Board width', boardHeight: 'Board length', wastePercent: 'Extra material', screwsPerBoard: 'Screws per board', pricePerBoard: 'Price per board', accuracyNote: 'Area estimate; cuts and layout change actual quantity.' } },
  'gravel-calculator': { name: 'Gravel calculator', actions, messages, fields: Object.fromEntries(['shape', 'area', 'depth', 'length', 'width', 'diameter', 'base', 'triangleHeight', 'dimensionUnit', 'depthUnit', 'density', 'densityUnit', 'waste', 'bagSize', 'bagUnit'].map((key) => [key, key])) },
  'soil-calculator': { name: 'Soil calculator', actions: { ...actions, liters: 'Liters', cubicFeet: 'Cubic feet' }, messages, fields: Object.fromEntries(['shape', 'length', 'width', 'diameter', 'depth', 'dimensionUnit', 'containerCount', 'wastePercent', 'bagVolume', 'bagUnit', 'accuracyNote'].map((key) => [key, key])) },
  'pool-volume-calculator': { name: 'Pool volume calculator', actions: { ...actions, oval: 'Oval', flat: 'Flat floor', sloped: 'Sloped floor' }, messages, fields: Object.fromEntries(['shape', 'length', 'width', 'ovalLength', 'ovalWidth', 'diameter', 'floor', 'shallowDepth', 'deepDepth', 'dimensionUnit', 'accuracyNote'].map((key) => [key, key])) },
  'roof-pitch-calculator': { name: 'Roof pitch calculator', actions: { ...actions, millimeters: 'Millimeters' }, messages, fields: { rise: 'Rise', run: 'Run', overhang: 'Overhang', unit: 'Unit', safetyNote: 'Geometry only; check local codes and a professional.' } },
  'molar-mass-calculator': { name: 'Molar mass calculator', actions, messages, fields: { formula: 'Formula', supportedHint: 'Common elements and selected isotopes are supported.' } },
  'auto-loan-refinance-calculator': { name: 'Auto refinance calculator', actions, messages, fields: { balance: 'Payoff balance', currentApr: 'Current APR', currentMonths: 'Months remaining', newApr: 'New APR', newMonths: 'New term', fees: 'Fees', feeTreatment: 'Fee treatment', upfront: 'Pay upfront', rolledIn: 'Add to balance', currencyNote: 'Use the same currency for all amounts.' } },
  'secret-santa-generator': { name: 'Secret Santa generator', actions, messages, fields: { names: 'Participants', exclusions: 'Exclusions', exclusionsHint: 'One giver:recipient per line.' } },
  'tire-size-calculator': { name: 'Tire size calculator', actions, messages, fields: { originalSize: 'Current tire size', replacementSize: 'New tire size', indicatedSpeed: 'Dashboard speed', speedUnit: 'Speed unit', fitmentNote: 'Nominal estimate only. Confirm fitment with the vehicle and tire maker.', relatedUnitConverter: 'Need to convert measurements? Open the unit converter.' } },
  'stair-calculator': { name: 'Stair calculator', actions, messages, fields: { totalRise: 'Total rise', riserCount: 'Number of risers', treadDepth: 'Tread depth', unit: 'Length unit', codeNote: 'Geometry estimate only. Check local building rules.', relatedUnitConverter: 'Need to convert measurements? Open the unit converter.' } },
  'asphalt-calculator': { name: 'Asphalt calculator', actions, messages, fields: { area: 'Paved area', areaUnit: 'Area unit', compactedThickness: 'Compacted thickness', thicknessUnit: 'Thickness unit', density: 'Mix density', densityUnit: 'Density unit', wastePercent: 'Extra material', pricePerTonne: 'Price per metric tonne', accuracyNote: 'Estimates only; confirm with your supplier.', relatedConcreteCalculator: 'Planning a concrete slab? Try the concrete calculator.' } },
  mancala: { name: 'Mancala', actions, messages, fields: { mode: 'Game mode', board: 'Kalah board', rules: 'Choose a pit. Seeds are sown counter-clockwise; the other player store is skipped.' } },
  'dominoes-game': {
    name: 'Dominoes game',
    actions: { ...actions, draw: 'Draw a tile', pass: 'Pass turn', playLeft: 'Play left', playRight: 'Play right', drawRule: 'Draw rules', blockRule: 'Block rules' },
    messages: { ...messages, played: 'Tile played.', drew: 'Tile drawn.', passed: 'Turn passed.', noMoves: 'No legal move.', stockEmpty: 'The stock is empty.' },
    fields: { mode: 'Play mode', variant: 'Rules', board: 'Domino line', stock: 'Tiles left', hand: 'Your tiles', opponentHand: 'Opponent tiles', accuracyNote: 'Local play only.', rules: 'Match one open end.' },
  },
  hitori: {
    name: 'Hitori puzzle', actions: { ...actions, newGame: 'New puzzle', checkBoard: 'Check board', hint: 'Hint', clearMarks: 'Clear marks', easy: 'Easy', medium: 'Medium', hard: 'Hard' },
    messages: { ...messages },
    fields: { size: 'Grid size', difficulty: 'Difficulty', board: 'Hitori grid', rules: 'Rules', accuracyNote: 'Unique local puzzles.', cell: 'Cell', row: 'row', column: 'column', black: 'black', white: 'white' },
  },
  nurikabe: {
    name: 'Nurikabe puzzle', actions: { ...actions, newGame: 'New puzzle', checkBoard: 'Check board', hint: 'One-cell hint', clearMarks: 'Clear sea marks', easy: 'Easy', medium: 'Medium', hard: 'Hard' },
    messages: { ...messages },
    fields: { difficulty: 'Difficulty', board: 'Nurikabe grid', rules: 'The sea cannot contain a 2×2 square.', accuracyNote: 'Unique local puzzles.', cell: 'Cell', row: 'row', column: 'column', sea: 'sea', island: 'island' },
  },
  slitherlink: { name: 'Slitherlink puzzle', actions: { ...actions, newGame: 'New puzzle', checkBoard: 'Check board', hint: 'One-edge hint', undo: 'Undo', clearMarks: 'Clear lines', rules: 'Rules', small: 'Small', medium: 'Medium', large: 'Large' }, messages: { ...messages }, fields: { size: 'Grid size', board: 'Slitherlink puzzle grid', rules: 'Draw one loop.', accuracyNote: 'Puzzles are checked locally.', row: 'row', column: 'column', horizontal: 'horizontal edge', vertical: 'vertical edge' } },
  'peg-solitaire': { name: 'Peg Solitaire', actions: { ...actions, newGame: 'New game', hint: 'Show a legal move', undo: 'Undo move', rules: 'Rules', pegsRemaining: 'Pegs remaining' }, messages: { moved: 'Jump made.', won: 'Won.', noMoves: 'No moves.' }, fields: { board: 'Peg solitaire board', rules: 'Jump over one peg into an empty hole.', accuracyNote: 'Local game.', hole: 'hole', row: 'row', column: 'column', peg: 'peg', empty: 'empty' } },
  futoshiki: { name: 'Futoshiki', actions: { ...actions, newGame: 'New puzzle', checkBoard: 'Check puzzle', hint: 'Reveal one cell', undo: 'Undo entry', notes: 'Notes', notesOn: 'Notes on', rules: 'Rules', small: '4 × 4', medium: '5 × 5', large: '6 × 6', easy: 'Easy', regular: 'Medium', hard: 'Hard' }, messages: { newPuzzle: 'New puzzle.', solved: 'Solved.', generationFailed: 'Try again.' }, fields: { size: 'Grid size', difficulty: 'Difficulty', board: 'Futoshiki grid', rules: 'Follow the row, column and inequality rules.', accuracyNote: 'Generated locally.', cell: 'Cell', row: 'row', column: 'column', notes: 'notes' } },
  'hashi-puzzle': { name: 'Hashi puzzle', actions: { ...actions, newGame: 'New puzzle', checkBoard: 'Check puzzle', hint: 'One-bridge hint', undo: 'Undo', clearBoard: 'Clear bridges', rules: 'Rules', easy: 'Easy', regular: 'Medium', hard: 'Hard' }, messages: { newPuzzle: 'New puzzle.', solved: 'Solved.' }, fields: { difficulty: 'Difficulty', board: 'Hashi board', rules: 'Connect all islands.', accuracyNote: 'Generated locally.', island: 'Island', needs: 'needs', current: 'bridges placed', bridge: 'Bridge', to: 'to', toggleHint: 'Activate to change count.' } },
  'color-name-finder': {
    name: 'Color name finder', actions: { ...actions, findName: 'Find color name', copyName: 'Copy closest name', copyHex: 'Copy hex value', result: 'Color matches' },
    messages: { ...messages, found: 'Ready.', checkColor: 'Enter a valid hex color.', copied: 'Copied.', copyUnavailable: 'Unavailable.', exactMatch: 'Exact match.', nearestMatch: 'Closest names.', distance: 'Distance' },
    fields: { hexColor: 'Hex color', colorPreview: 'Choose a color', nearestNames: 'Closest CSS color names', exactMatchNote: 'Exact match.', paletteNote: 'Nearest names are approximations.' },
  },
  'weight-loss-calculator': {
    name: 'Weight loss scenario calculator', actions: { ...actions, dayUnit: 'days', weekUnit: 'weeks', kilocalories: 'kcal', perWeek: 'per week' },
    messages: { ...messages, weightToLose: 'Weight difference', energyEquivalent: 'Linear energy equivalent', timeline: 'Timeline', weeklyRate: 'Weekly rate', noDeficitChange: 'Zero modeled change.', paceNote: 'This is not a recommended target.' },
    fields: { currentWeight: 'Current weight', targetWeight: 'Goal weight', dailyDeficit: 'Daily deficit', unit: 'Weight unit', methodNote: '7,700 kcal per kg; simple arithmetic, not a body-weight forecast.', healthNote: 'Not medical advice.', sourceNiddk: 'Dynamic model information:', sourceCdc: 'gradual-change guidance' },
  },
  'image-color-picker': {
    name: 'Image color picker',
    actions: { ...actions, load: 'Choose image', addSample: 'Add color to palette', copyColor: 'Copy color', copyPalette: 'Copy HEX palette', remove: 'Remove', clear: 'Clear palette' },
    messages: { ...messages, unsupportedImage: 'Unsupported image.', imageTooLarge: 'Image too large.', imageReady: 'Image ready.', selectImage: 'Choose an image first.', pixelSelected: 'Pixel selected.', sampleAdded: 'Color added.', paletteFull: 'Palette is full.', copiedColor: 'Color copied.', copiedPalette: 'Palette copied.', copyUnavailable: 'Clipboard unavailable.', paletteCleared: 'Palette cleared.' },
    fields: { imageFile: 'Choose image', accuracyNote: 'Maximum 12 megapixels.', previewHint: 'Click a pixel or use arrow keys.', zoom: 'Zoom', currentColor: 'Current pixel', paletteLabel: 'Color palette', relatedSharpener: 'Use the sharpener.', relatedRedactor: 'Use the redactor.' },
  },
  'heloc-calculator': {
    name: 'HELOC calculator', actions: { ...actions },
    messages: { ...messages, estimateOnly: 'Illustration only.', interestOnlyPayment: 'Interest-only payment', availableCredit: 'Available credit', repaymentPayment: 'Repayment payment', paymentChange: 'Payment change', drawInterest: 'Draw interest', repaymentInterest: 'Repayment interest', totalInterest: 'Total interest', totalPayments: 'Total payments' },
    fields: { creditLimit: 'Credit limit', balance: 'Current balance', annualApr: 'APR', drawMonths: 'Draw months', repaymentMonths: 'Repayment months', currency: 'Currency', accuracyNote: 'Illustrative fixed-rate estimate only.', relatedLoanCalculator: 'Compare with loan payment calculator.' },
  },
  'random-team-generator': {
    name: 'Random team generator', actions: { ...actions, generateTeams: 'Generate teams', team: 'Team', participant: 'participants', seedLabel: 'Seed' },
    messages: { ...messages },
    fields: { names: 'Names', teamCount: 'Number of teams', separations: 'Keep apart', separationsHint: 'Name A | Name B', seed: 'Seed', seedHint: 'Reuse the seed', privacyNote: 'Local only', relatedNamePicker: 'Pick a winner' },
  },
  'mulch-calculator': {
    name: 'Mulch calculator', actions: { ...actions, liters: 'Litres', cubicFeet: 'Cubic feet', squareMeters: 'Square metres', squareFeet: 'Square feet' },
    messages: { ...messages, bedArea: 'Total bed area', mulchDepth: 'Mulch depth', cubicYards: 'Cubic yards', costNotEntered: 'Enter a price.' },
    fields: { shape: 'Bed shape', dimensionUnit: 'Length unit', length: 'Length', width: 'Width', diameter: 'Diameter', bedCount: 'Bed count', depth: 'Depth', depthUnit: 'Depth unit', bagVolume: 'Bag volume', bagUnit: 'Bag unit', wastePercent: 'Extra material', pricePerBag: 'Price', currency: 'Currency', currencyNote: 'Estimate only.', accuracyNote: 'Follow product label.', relatedGravelCalculator: 'Gravel calculator.', relatedSoilCalculator: 'Soil calculator.' },
  },
  'paver-calculator': {
    name: 'Paver calculator', actions: { ...actions, squareMeters: 'Square metres', squareFeet: 'Square feet' },
    messages: { ...messages, area: 'Paved area', perimeter: 'Edge perimeter', moduleCount: 'Repeat modules', paversBeforeWaste: 'Pavers before extra', paversToBuy: 'Pavers to buy', baseVolume: 'Base volume', baseOrderVolume: 'Base volume with extra', paverCost: 'Paver cost', baseCost: 'Base cost', totalCost: 'Total cost', costNotEntered: 'Enter a price.' },
    fields: { length: 'Length', width: 'Width', surfaceUnit: 'Surface unit', moduleLength: 'Module length', moduleWidth: 'Module width', moduleUnit: 'Module unit', paversPerModule: 'Pavers per module', paverWastePercent: 'Extra pavers', baseDepth: 'Base depth', baseDepthUnit: 'Base unit', baseWastePercent: 'Extra base', pricePerPaver: 'Price per paver', basePricePerM3: 'Base price per cubic metre', currency: 'Currency', unitsNote: 'Module includes joints.', accuracyNote: 'Estimate only.', relatedTileCalculator: 'Tile calculator.', relatedGravelCalculator: 'Gravel calculator.' },
  },
  'solar-panel-calculator': {
    name: 'Solar panel calculator', actions: { ...actions, productionMode: 'Estimate output from panel count', sizingMode: 'Estimate panel count for daily use', years: 'years' },
    messages: { ...messages, panelCount: 'Panels', systemSize: 'Array size', dailyProduction: 'Daily energy', monthlyProduction: 'Monthly energy', annualProduction: 'Yearly energy', panelArea: 'Panel area', annualSavings: 'Annual bill offset', simplePayback: 'Payback', paybackUnavailable: 'Unavailable.' },
    fields: { mode: 'Estimate mode', dailyTargetKwh: 'Daily use', panelCount: 'Number of panels', panelWatts: 'Panel watts', peakSunHours: 'Sun hours', lossPercent: 'Losses', panelLengthM: 'Panel length', panelWidthM: 'Panel width', electricityRate: 'Price per kWh', systemCost: 'Installed cost', currency: 'Currency', assumptionNote: 'Enter both dimensions for area.', accuracyNote: 'Estimate only.' },
  },
  'btu-calculator': {
    name: 'BTU calculator', actions: { ...actions, feet: 'Feet', meters: 'Metres', inches: 'Inches', shaded: 'Shaded', typical: 'Typical', sunny: 'Sunny', no: 'No', yes: 'Yes' },
    messages: { ...messages, roomArea: 'Room area', roomVolume: 'Room volume', baseCapacity: 'Base capacity', ceilingAdjustment: 'Ceiling factor', insulationAdjustment: 'Insulation', sunAdjustment: 'Sunlight', occupantAdjustment: 'Extra occupants', kitchenAdjustment: 'Kitchen', capacity: 'Capacity', tons: 'Tons', belowReferenceBand: 'Below reference band.' },
    fields: { length: 'Room length', width: 'Room width', ceilingHeight: 'Ceiling height', dimensionUnit: 'Unit', insulationAdjustment: 'Insulation adjustment', sunExposure: 'Sun exposure', occupants: 'Occupants', kitchen: 'Kitchen', accuracyNote: 'Estimate only.' },
  },
  'brick-calculator': {
    name: 'Brick calculator', actions: { ...actions },
    messages: { ...messages, grossArea: 'Gross area', netArea: 'Net area', courses: 'Courses', bricksPerCourse: 'Average bricks per course', bricksBeforeWaste: 'Bricks before extra', bricksToOrder: 'Bricks to order', mortarVolume: 'Mortar volume', mortarBags: 'Mortar bags' },
    fields: { wallLength: 'Wall length', wallHeight: 'Wall height', wallUnit: 'Wall unit', brickLength: 'Brick length', brickHeight: 'Brick height', brickDepth: 'Brick depth', brickUnit: 'Brick unit', joint: 'Joint', jointUnit: 'Joint unit', openingWidth: 'Opening width', openingHeight: 'Opening height', openingCount: 'Opening count', wythes: 'Wall layers', wastePercent: 'Extra bricks', bagYieldLiters: 'Bag yield', accuracyNote: 'Estimate only.' },
  },
  'rafter-calculator': {
    name: 'Rafter calculator', actions: { ...actions, riseMode: 'Rise', pitchMode: 'Pitch' },
    messages: { ...messages, effectiveRun: 'Run to ridge', roofAngle: 'Roof angle', plumbCut: 'Plumb cut', overhangRun: 'Horizontal overhang' },
    fields: { unit: 'Unit', mode: 'Slope input', span: 'Full span', rise: 'Rise', pitch: 'Pitch', ridgeThickness: 'Ridge thickness', ridgeUnit: 'Ridge unit', overhang: 'Overhang', diagramLabel: 'Roof geometry diagram', accuracyNote: 'Geometry estimate only.' },
  },
  'carpet-calculator': {
    name: 'Carpet calculator', actions: { ...actions, eitherDirection: 'Use less material', alongRoomLength: 'Pile along room length', alongRoomWidth: 'Pile along room width' },
    messages: { ...messages, floorArea: 'Floor area', pileDirection: 'Pile direction', cuts: 'Cuts per room', seams: 'Seams', cutLength: 'Length per cut', orderLength: 'Roll length to order', purchasedArea: 'Purchased area', alternative: 'Other orientation' },
    fields: { unit: 'Unit', roomLength: 'Room length', roomWidth: 'Room width', rollWidth: 'Roll width', rooms: 'Number of rooms', pileDirection: 'Pile direction', wastePercent: 'Extra allowance', accuracyNote: 'Planning estimate only.' },
  },
  'aquarium-calculator': {
    name: 'Aquarium volume calculator', actions: { ...actions, centimeters: 'Centimeters', liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons' },
    fields: { length: 'Inside length', width: 'Inside width', height: 'Inside height', dimensionUnit: 'Unit', substrateDepth: 'Substrate depth', substrateSolidPercent: 'Solid share', airGap: 'Air gap', accuracyNote: 'Estimate only.' },
  },
  'grass-seed-calculator': {
    name: 'Grass seed calculator', actions: { ...actions, m2: 'Square metres', ft2: 'Square feet', acre: 'Acres', gM2: 'g/m²', lb1000ft2: 'lb/1,000 ft²', kg: 'kg', lb: 'lb' },
    messages: { ...messages, baseSeed: 'Seed before extra', extraSeed: 'Extra seed', totalSeed: 'Seed to buy', bags: 'Whole bags' },
    fields: { area: 'Lawn area', areaUnit: 'Area unit', seedingRate: 'Seeding rate', rateUnit: 'Rate unit', wastePercent: 'Extra seed', varietyA: 'Variety A', percentA: 'Variety A share', varietyB: 'Variety B', percentB: 'Variety B share', bagSize: 'Bag size', bagUnit: 'Bag unit', accuracyNote: 'Use the product label.' },
  },
  'insulation-calculator': {
    name: 'Insulation R-value calculator', actions: { ...actions, R: 'US R-value', RSI: 'Metric RSI' },
    messages: { ...messages, layerTotal: 'Layers included', totalR: 'Total US resistance', totalRsi: 'Total metric resistance', uFactorUs: 'U-factor US', uFactorSi: 'U-factor SI' },
    fields: { unit: 'Input unit', layerName1: 'Layer 1 name', layerResistance1: 'Layer 1 resistance', layerQuantity1: 'Layer 1 quantity', layerName2: 'Layer 2 name', layerResistance2: 'Layer 2 resistance', layerQuantity2: 'Layer 2 quantity', layerName3: 'Layer 3 name', layerResistance3: 'Layer 3 resistance', layerQuantity3: 'Layer 3 quantity', layerName4: 'Layer 4 name', layerResistance4: 'Layer 4 resistance', layerQuantity4: 'Layer 4 quantity', accuracyNote: 'Series layer estimate only.' },
  },
  'wall-framing-calculator': {
    name: 'Wall framing calculator', actions: { ...actions, meters: 'Metres', feet: 'Feet', centimeters: 'Centimetres', millimeters: 'Millimetres', inches: 'Inches' },
    messages: { ...messages, studCount: 'Stud count', studPositions: 'Positions', studLinearLength: 'Stud material', openings: 'Openings', topPlateMaterial: 'Top plates', bottomPlateMaterial: 'Bottom plates', totalPlateMaterial: 'Plate total', rows: 'rows' },
    fields: { wallLength: 'Wall length', wallHeight: 'Wall height', wallUnit: 'Wall unit', spacing: 'Stud spacing', spacingUnit: 'Spacing unit', openingStart1: 'Opening 1 position', openingWidth1: 'Opening 1 width', breakBottomPlate1: 'Opening interrupts bottom plate', openingStart2: 'Opening 2 position', openingWidth2: 'Opening 2 width', breakBottomPlate2: 'Opening interrupts bottom plate', openingStart3: 'Opening 3 position', openingWidth3: 'Opening 3 width', breakBottomPlate3: 'Opening interrupts bottom plate', topPlateRows: 'Top plate rows', bottomPlateRows: 'Bottom plate rows', accuracyNote: 'Estimate only; not structural design.' },
  },
  'electricity-cost-calculator': {
    name: 'Electricity Cost Calculator', actions: { ...actions, watts: 'Watts', kilowatts: 'Kilowatts' },
    messages: { ...messages, applianceBreakdown: 'Appliance estimate', energyKwh: 'Period energy', energyCost: 'Energy charge', fixedCharge: 'Fixed charge', totalCost: 'Period total', averageDailyKwh: 'Daily average energy', averageDailyCost: 'Daily average cost', quantity: 'units', hours: 'hours/day', days: 'days' },
    fields: { ratePerKwh: 'Rate per kWh', billingDays: 'Billing days', fixedCharge: 'Fixed charge', currency: 'Currency code', appliance1: 'Appliance 1', appliance2: 'Appliance 2', appliance3: 'Appliance 3', appliance4: 'Appliance 4', applianceName1: 'Name', applianceName2: 'Name', applianceName3: 'Name', applianceName4: 'Name', power1: 'Power', power2: 'Power', power3: 'Power', power4: 'Power', powerUnit1: 'Power unit', powerUnit2: 'Power unit', powerUnit3: 'Power unit', powerUnit4: 'Power unit', quantity1: 'Quantity', quantity2: 'Quantity', quantity3: 'Quantity', quantity4: 'Quantity', hours1: 'Hours', hours2: 'Hours', hours3: 'Hours', hours4: 'Hours', activeDays1: 'Active days', activeDays2: 'Active days', activeDays3: 'Active days', activeDays4: 'Active days', accuracyNote: 'Estimate only.' },
  },
  'compost-calculator': {
    name: 'Compost Calculator', actions: { ...actions, kilograms: 'Kilograms', pounds: 'Pounds' },
    messages: { ...messages, wetMass: 'Wet mass', dryMass: 'Dry mass', waterMass: 'Water mass', carbonMass: 'Carbon mass', nitrogenMass: 'Nitrogen mass', mixRatio: 'Mix C:N ratio', mixMoisture: 'Mix moisture', targetMoisture: 'Target moisture', waterToAdd: 'Water to add', waterToRemove: 'Water to remove', perMaterial: 'Material' },
    fields: { massUnit: 'Mass unit', targetMoisture: 'Target moisture', material1: 'Material 1', material2: 'Material 2', material3: 'Material 3', material4: 'Material 4', name1: 'Name', name2: 'Name', name3: 'Name', name4: 'Name', wetMass1: 'Wet mass', wetMass2: 'Wet mass', wetMass3: 'Wet mass', wetMass4: 'Wet mass', moisture1: 'Moisture', moisture2: 'Moisture', moisture3: 'Moisture', moisture4: 'Moisture', carbon1: 'Dry carbon', carbon2: 'Dry carbon', carbon3: 'Dry carbon', carbon4: 'Dry carbon', ratio1: 'C:N ratio', ratio2: 'C:N ratio', ratio3: 'C:N ratio', ratio4: 'C:N ratio', accuracyNote: 'Estimate only.' },
  },
  'pond-volume-calculator': {
    name: 'Pond Volume Calculator', actions: { ...actions, rectangle: 'Rectangle', circle: 'Circle', oval: 'Oval', meters: 'Meters', feet: 'Feet' },
    messages: { ...messages, footprint: 'Footprint area', geometricCapacity: 'Capacity', filledVolume: 'Filled volume', liters: 'Liters', usGallons: 'US gallons', imperialGallons: 'Imperial gallons', linerLength: 'Liner length', linerWidth: 'Liner width', linerArea: 'Liner area' },
    fields: { shape: 'Shape', length: 'Length', width: 'Width', diameter: 'Diameter', dimensionUnit: 'Unit', averageDepth: 'Average depth', maximumDepth: 'Maximum depth', edgeOverlap: 'Edge overlap', fillPercent: 'Fill percentage', accuracyNote: 'Geometric estimate only.' },
  },
  'fertilizer-calculator': {
    name: 'Fertilizer Calculator', actions: { ...actions, kilograms: 'Kilograms', pounds: 'Pounds', squareMeters: 'Square meters', hectares: 'Hectares', squareFeet: 'Square feet', acres: 'Acres', kg100m2: 'kg per 100 m²', kgHa: 'kg per hectare', lb1000ft2: 'lb per 1,000 ft²', lbAcre: 'lb per acre' },
    messages: { ...messages, productMass: 'Product mass', nitrogenMass: 'Nitrogen', phosphateMass: 'Phosphate', potashMass: 'Potash' },
    fields: { mode: 'Mode', productMode: 'Product amount', areaMode: 'Area and rate', productMass: 'Fertilizer mass', massUnit: 'Mass unit', area: 'Area', areaUnit: 'Area unit', productRate: 'Rate', rateUnit: 'Rate unit', nitrogenPercent: 'Nitrogen percentage', phosphatePercent: 'Phosphate percentage', potashPercent: 'Potash percentage', accuracyNote: 'Use your own product label and rate.' },
  },
  'baluster-spacing-calculator': {
    name: 'Baluster Spacing Calculator', actions: { ...actions, millimeters: 'Millimeters', centimeters: 'Centimeters', meters: 'Meters', inches: 'Inches', feet: 'Feet' },
    messages: { ...messages, balusterCount: 'Balusters to fit', gapCount: 'Equal clear gaps', uniformClearGap: 'Uniform clear gap', totalBalusterWidth: 'Total baluster width', totalClearGap: 'Total clear gap' },
    fields: { mode: 'Method', maxGapMode: 'Find count from maximum gap', countMode: 'Calculate gap from count', openingWidth: 'Clear opening', balusterWidth: 'Baluster width', unit: 'Length unit', maximumGap: 'Maximum gap', balusterCount: 'Baluster count', accuracyNote: 'Layout only; verify local code and safety.' },
  },
  'retaining-wall-calculator': {
    name: 'Retaining Wall Calculator', actions: { ...actions, meters: 'Meters', centimeters: 'Centimeters', feet: 'Feet', inches: 'Inches' },
    messages: { ...messages, courses: 'Whole block courses', blocksPerCourse: 'Blocks per course', blocksBeforeWaste: 'Blocks before extra allowance', blocksToOrder: 'Blocks to order', baseMaterial: 'Base material to order', backfill: 'Backfill to order' },
    fields: { wallLength: 'Wall length', wallHeight: 'Wall height (zero for no wall)', wallUnit: 'Wall unit', blockLength: 'Block length', blockHeight: 'Block height', blockDepth: 'Block depth', blockUnit: 'Block unit', joint: 'Joint', baseWidth: 'Base width', baseDepth: 'Base depth', backfillThickness: 'Backfill thickness', wastePercent: 'Extra allowance', accuracyNote: 'Base and backfill dimensions are user-entered, not recommendations.' },
  },
  'battery-runtime-calculator': {
    name: 'Battery Runtime Calculator', actions: { ...actions, wh: 'Watt-hours (Wh)', kwh: 'Kilowatt-hours (kWh)' },
    messages: { ...messages, nominalEnergy: 'Nominal battery energy', usableEnergy: 'Estimated usable energy', runtimeHours: 'Estimated runtime', runtimeDays: 'Equivalent days' },
    fields: { capacityMode: 'Capacity format', energyMode: 'Energy rating', ampHourMode: 'Amp-hours and voltage', capacityEnergy: 'Energy capacity', energyUnit: 'Energy unit', capacityAh: 'Amp-hours', voltage: 'Voltage', loadWatts: 'Load power', depthOfDischargePercent: 'Discharge depth', efficiencyPercent: 'Efficiency', accuracyNote: 'Estimate only; actual runtime varies.' },
  },
  'lumber-cut-calculator': {
    name: 'Lumber Cut List Optimizer', actions: { ...actions, millimeters: 'Millimeters', centimeters: 'Centimeters', meters: 'Meters', inches: 'Inches', feet: 'Feet' },
    messages: { ...messages },
    fields: { unit: 'Shared unit', stockLength: 'Stock length', kerf: 'Saw kerf', cutList: 'Cut list', accuracyNote: 'Heuristic only; verify before cutting.' },
  },
  'plant-spacing-calculator': {
    name: 'Plant spacing calculator', actions: { ...actions, grid: 'Regular grid', triangular: 'Staggered triangular', squareUnits: 'square units' },
    messages: { ...messages, totalPlants: 'Estimated plants', rows: 'Rows', plantsPerRow: 'Plants per even / offset row', bedArea: 'Bed area', plantDensity: 'Estimated density', plantsPerArea: 'plants per square unit' },
    fields: { bedLength: 'Bed length', bedWidth: 'Bed width', inRowSpacing: 'In-row spacing', rowSpacing: 'Row spacing', unit: 'Unit', pattern: 'Layout', accuracyNote: 'Geometry estimate only.' },
  },
  'ev-charging-calculator': {
    name: 'EV charging calculator', actions: { ...actions, kwh: 'Kilowatt-hours (kWh)', kw: 'Kilowatts (kW)', percent: 'Percent (%)' },
    messages: { ...messages, batteryEnergy: 'Energy added to battery', gridEnergy: 'Estimated energy from grid', chargingTime: 'Estimated constant-power time', estimatedCost: 'Estimated electricity cost' },
    fields: { batteryCapacityKwh: 'Battery capacity', startSocPercent: 'Starting charge', targetSocPercent: 'Target charge', chargerPowerKw: 'Charger power', efficiencyPercent: 'Efficiency', electricityRatePerKwh: 'Electricity rate', currency: 'Currency', accuracyNote: 'Idealized estimate only.' },
  },
  'rainwater-harvesting-calculator': {
    name: 'Rainwater harvesting calculator', actions: { ...actions, squareMeters: 'Square meters', squareFeet: 'Square feet', millimeters: 'Millimeters', inches: 'Inches', liters: 'Liters', usGallons: 'US gallons' },
    messages: { ...messages, totalCollected: 'Potential collected', totalDemand: 'Demand', totalOverflow: 'Overflow', unmetDemand: 'Unmet demand', endingStorage: 'Ending storage', rainfall: 'rainfall', collected: 'collected', demand: 'demand', overflow: 'overflow', storage: 'ending tank', months: Array.from({ length: 12 }, (_, index) => `Month ${index + 1}`) },
    fields: { catchmentArea: 'Roof area', areaUnit: 'Area unit', rainfallUnit: 'Rainfall unit', rainfallValues: 'Monthly rainfall', runoffPercent: 'Runoff efficiency', tankCapacity: 'Tank capacity', tankUnit: 'Volume unit', startingStorage: 'Starting storage', monthlyDemandValues: 'Monthly demand', accuracyNote: 'Estimate only; water may need treatment.' },
  },
  'ramp-calculator': {
    name: 'Ramp calculator', actions: { ...actions, millimeters: 'Millimeters', centimeters: 'Centimeters', meters: 'Meters', inches: 'Inches', feet: 'Feet' },
    messages: { ...messages, horizontalRun: 'Horizontal ramp run', rampSurface: 'Sloped ramp surface length', landings: 'Landings', totalHorizontal: 'Total horizontal length', slopePercent: 'Slope percentage', angle: 'Slope angle' },
    fields: { rise: 'Vertical rise', slopeRatioDenominator: 'Ratio denominator', landingCount: 'Landing count', landingDepth: 'Landing depth', unit: 'Unit', safetyNote: 'Geometry only; check applicable standards.' },
  },
  'heat-loss-calculator': {
    name: 'Heat loss calculator', actions: { ...actions },
    messages: { ...messages, wallLoss: 'Wall transmission', roofLoss: 'Roof transmission', windowLoss: 'Window transmission', floorLoss: 'Floor transmission', transmissionLoss: 'Total transmission', ventilationLoss: 'Ventilation estimate', totalLoss: 'Total estimated heat loss' },
    fields: { areaUnit: 'Area unit', temperatureUnit: 'Temperature difference unit', volumeUnit: 'Room volume unit', temperatureDifference: 'Indoor–outdoor temperature difference', wallArea: 'Wall area', wallUValue: 'Wall U-value', roofArea: 'Roof area', roofUValue: 'Roof U-value', windowArea: 'Window area', windowUValue: 'Window U-value', floorArea: 'Floor area', floorUValue: 'Floor U-value', roomVolume: 'Room volume', airChangesPerHour: 'Air changes per hour', accuracyNote: 'Simplified estimate only.' },
  },
  'heat-pump-calculator': {
    name: 'Heat pump calculator', actions: { ...actions },
    messages: { ...messages, heatOutputKw: 'Heat output', electricalInput: 'Electrical input', dailyEnergy: 'Daily energy', monthlyEnergy: '30-day energy', dailyCost: 'Daily cost', monthlyCost: '30-day cost', resistanceDailyEnergy: 'Resistance baseline energy', resistanceDailyCost: 'Resistance baseline cost', dailyEnergyDifference: 'Daily energy saved', dailyCostDifference: 'Daily cost difference' },
    fields: { heatOutput: 'Heat-output rate', heatOutputUnit: 'Unit', cop: 'COP', electricityRatePerKwh: 'Rate per kWh', hoursPerDay: 'Hours per day', currency: 'Currency code', accuracyNote: 'Estimate only. Comparison baseline assumes COP 1.' },
  },
  'miter-angle-calculator': {
    name: 'Miter angle calculator', actions: { ...actions, simpleMode: 'Simple miter', compoundMode: 'Compound miter' },
    messages: { ...messages, miterSetting: 'Miter setting', bevelSetting: 'Bevel setting', halfCorner: 'Half corner' },
    fields: { mode: 'Cut type', cornerAngle: 'Inside corner angle', springAngle: 'Spring angle', accuracyNote: 'Geometry estimate only.', diagramLabel: 'Angle diagram', diagramCorner: 'Inside corner', diagramCut: 'Miter cut', diagramSpring: 'Spring angle' },
  },
  'voltage-drop-calculator': {
    name: 'Voltage drop calculator', actions: { ...actions, meters: 'Meters', feet: 'Feet' },
    messages: { ...messages, voltageDrop: 'Voltage drop', voltageDropPercent: 'Drop percent', estimatedReceivingVoltage: 'Load voltage', resistancePerConductor: 'Resistance per conductor' },
    fields: { circuit: 'Circuit', dc: 'DC', singlePhase: 'Single-phase AC', threePhase: 'Three-phase AC', material: 'Material', copper: 'Copper', aluminum: 'Aluminum', oneWayLength: 'One-way length', lengthUnit: 'Length unit', currentA: 'Current', crossSectionMm2: 'Conductor area', supplyVoltageV: 'Supply voltage', powerFactor: 'Power factor', accuracyNote: 'Resistive estimate only.' },
  },
  'molarity-calculator': {
    name: 'Molarity calculator', actions: { ...actions, liters: 'Liters', milliliters: 'Milliliters' },
    messages: { ...messages, concentrationResult: 'Solution concentration', molesResult: 'Amount of solute', volumeResult: 'Total solution volume', soluteMassResult: 'Solute mass', soluteForSolutionResult: 'Solute mass for target solution', finalVolume: 'Target final solution volume' },
    fields: { mode: 'Calculation', concentrationMode: 'Molarity from moles and solution volume', molesMode: 'Moles from molarity and solution volume', volumeMode: 'Solution volume from moles and molarity', soluteMassMode: 'Solute mass from concentration', prepareMode: 'Prepare a target solution', moles: 'Moles', molarity: 'Molarity', volume: 'Total solution volume', volumeUnit: 'Volume unit', molarMass: 'Molar mass', accuracyNote: 'Use total final solution volume.' },
  },
  'dilution-calculator': {
    name: 'Dilution calculator', actions: { ...actions, liters: 'Liters', milliliters: 'Milliliters' },
    messages: { ...messages, stockAliquot: 'Stock volume', diluent: 'Diluent volume', dilutionFactor: 'Dilution factor', steps: 'Step count', perStepFactor: 'Factor per step', transferVolume: 'Transfer volume', totalDilutionFactor: 'Total factor' },
    fields: { mode: 'Mode', directMode: 'Direct', serialMode: 'Serial', stockConcentration: 'Stock concentration', targetConcentration: 'Target concentration', finalVolume: 'Final volume', volumeUnit: 'Volume unit', steps: 'Number of steps', accuracyNote: 'Math only.' },
  },
  'ohms-law-calculator': {
    name: 'Ohm’s law calculator', actions: { ...actions },
    messages: { ...messages, solvedVoltage: 'Voltage', solvedCurrent: 'Current', solvedResistance: 'Resistance', solvedPower: 'Power', equivalentResistance: 'Equivalent resistance', resistorCount: 'Resistor count', topology: 'Connection' },
    fields: { mode: 'Mode', solverMode: 'Solve values', networkMode: 'Equivalent resistance', voltage: 'Voltage (V)', current: 'Current (A)', resistance: 'Resistance (Ω)', power: 'Power (W)', topology: 'Connection', series: 'Series', parallel: 'Parallel', resistorValues: 'Resistor values', accuracyNote: 'Ideal DC arithmetic only.' },
  },
  'body-water-calculator': {
    name: 'Body water calculator', actions: { ...actions }, messages: { ...messages },
    fields: { equation: 'Watson equation', watsonMale: 'Male equation', watsonFemale: 'Female equation', age: 'Adult age', height: 'Height', heightUnit: 'Height unit', weight: 'Weight', weightUnit: 'Weight unit', centimeters: 'Centimeters', inches: 'Inches', kilograms: 'Kilograms', pounds: 'Pounds', accuracyNote: 'Estimate only.', resultLiters: 'Estimated total body water', resultPercent: 'Approximate share', equationNote: 'Published equation.' },
  },
  '555-timer-calculator': {
    name: '555 timer calculator', actions: { ...actions, calculate: 'Calculate', reset: 'Clear', example: 'Try an example', result: 'Timing results', copy: 'Copy results' },
    messages: { ...messages, calculated: 'Calculation ready.', checkInputs: 'Check the component values.', copied: 'Results copied.', copyUnavailable: 'Copy is unavailable.' },
    fields: { mode: 'Circuit mode', astable: 'Astable oscillator', monostable: 'Monostable pulse', resistanceA: 'Resistor RA', resistanceB: 'Resistor RB', resistance: 'Resistor R', resistanceUnit: 'Resistance unit', ohms: 'Ohms (Ω)', kilohms: 'Kilohms (kΩ)', megohms: 'Megohms (MΩ)', capacitance: 'Capacitor C', capacitanceUnit: 'Capacitance unit', farads: 'Farads (F)', millifarads: 'Millifarads (mF)', microfarads: 'Microfarads (μF)', nanofarads: 'Nanofarads (nF)', picofarads: 'Picofarads (pF)', accuracyNote: 'Ideal timing only.', frequencyNote: 'Frequency note', highFrequencyWarning: 'Check datasheet above 100 kHz.', formulaNote: 'Formulas:', sourceLink: 'TI datasheet', resultFrequency: 'Frequency', resultPeriod: 'Period', resultHigh: 'Output high time', resultLow: 'Output low time', resultWaveformDuty: 'Waveform duty cycle', resultDischargeDuty: 'Discharge interval share', resultPulse: 'Output pulse width' },
  },
  'fourier-series-calculator': {
    name: 'Fourier series calculator', actions: { ...actions, calculate: 'Calculate', reset: 'Clear', example: 'Sine example', constant: 'Constant example', result: 'Fourier results', copy: 'Copy coefficients' },
    messages: { ...messages, calculated: 'Coefficients calculated.', calculatedConstant: 'Constant signal has a DC component only.', checkInputs: 'Check samples, period and harmonics.', copied: 'Copied.', copyUnavailable: 'Copy unavailable.' },
    fields: { samples: 'Samples', samplesHint: 'Four to 128 equally spaced values.', period: 'Period', periodHint: 'Frequency is one divided by period.', harmonics: 'Harmonics', harmonicsHint: 'Choose from zero through the available limit.', accuracyNote: 'Numeric estimate only.', formulaLabel: 'Real Fourier series', formula: 'DC and coefficients', resultDc: 'DC', resultFrequency: 'Fundamental frequency', resultHarmonics: 'Harmonics included', resultRms: 'RMS sample error', coefficient: 'Harmonic', coefficientA: 'Cosine coefficient', coefficientB: 'Sine coefficient', coefficientAmplitude: 'Amplitude', phase: 'Phase', radians: 'radians', frequencyUnit: 'per unit of time', chartLabel: 'Samples and reconstruction', samplesLegend: 'Samples', reconstructionLegend: 'Reconstruction' },
  },
  'modular-inverse-calculator': {
    name: 'Modular inverse calculator', actions: { ...actions, calculate: 'Calculate inverse', reset: 'Clear', example: 'Load 3 modulo 7', result: 'Results', copy: 'Copy result' },
    messages: { ...messages },
    fields: { a: 'Integer a', modulus: 'Modulus m (at least 2)', accuracyNote: 'Integer arithmetic only.', formulaLabel: 'Definition', formula: 'a × x ≡ 1 (mod m).', resultStatus: 'Status', resultGcd: 'GCD', resultResidue: 'Residue', resultInverse: 'Inverse', bezout: 'Bezout identity', step: 'Step', quotient: 'Quotient', remainder: 'Remainder', coefficientA: 'Coefficient of residue', coefficientModulus: 'Coefficient of modulus', existsLabel: 'Inverse exists', missingLabel: 'No inverse', verification: 'Verification' },
  },
  'chemical-equation-balancer': {
    name: 'Chemical equation balancer', actions: { ...actions },
    messages: { ...messages, balancedEquation: 'Balanced equation', atomCheck: 'Atom count', leftSide: 'Reactants', rightSide: 'Products' },
    fields: { equation: 'Unbalanced equation', formulaHint: 'Enter neutral formulas and one arrow.', accuracyNote: 'Educational calculation only.' },
  },
  'gear-ratio-calculator': {
    name: 'Gear ratio calculator', actions: { ...actions },
    messages: { ...messages, overallRatio: 'Overall ratio', outputSpeed: 'Output speed', stageCount: 'Stages', direction: 'Direction', sameDirection: 'Same direction', reversedDirection: 'Reversed', idealOutputTorque: 'Ideal torque', estimatedOutputTorque: 'Estimated torque', reduction: 'speed reduction', speedIncrease: 'speed increase', noRatioChange: 'no change' },
    fields: { stages: 'Tooth pairs', stagesHint: 'One pair per line.', inputRpm: 'Input RPM', inputTorque: 'Input torque', driveType: 'Drive type', externalGears: 'External gears', chainDrive: 'Chain drive', efficiencyPercent: 'Efficiency', accuracyNote: 'Ideal arithmetic only.' },
  },
  'density-calculator': {
    name: 'Density calculator', actions: { ...actions },
    messages: { ...messages, mass: 'Mass', volume: 'Volume', density: 'Density', densityMetric: 'Metric density', densityImperial: 'US density', componentCount: 'Components' },
    fields: { mode: 'Mode', solveMode: 'Solve one value', mixtureMode: 'Estimate mixture', massKg: 'Mass in kg', volumeM3: 'Volume in m3', densityKgM3: 'Density in kg/m3', components: 'Mass,volume rows', componentsHint: 'One pair per row.', accuracyNote: 'Mixture assumes additive volumes.' },
  },
  'kinetic-energy-calculator': {
    name: 'Kinetic energy calculator', actions: { ...actions, calculate: 'Calculate energy', reset: 'Reset', copy: 'Copy result', example: 'Try 2 kg at 3 m/s' },
    messages: { ...messages, velocity: 'Speed', kineticEnergy: 'Kinetic energy', potentialEnergy: 'Gravitational potential energy', totalEnergy: 'Total mechanical energy' },
    fields: { mode: 'Calculation mode', energyMode: 'Calculate energy from speed', speedMode: 'Solve speed from kinetic energy', massKg: 'Mass (kg)', velocityMps: 'Speed (m/s)', kineticEnergyJ: 'Kinetic energy (J)', heightM: 'Height above the zero reference (m)', gravityMps2: 'Gravitational acceleration (m/s²)', accuracyNote: 'Ideal estimate; ignores energy losses.' },
  },
  'resistor-color-code-calculator': {
    name: 'Resistor color code calculator', actions: { ...actions, example: 'Try brown-black-red-gold' },
    messages: { ...messages, resistance: 'Resistance', requestedResistance: 'Requested resistance', nominalResistance: 'Nearest nominal value', tolerance: 'Tolerance', bands: 'Band order', temperatureCoefficient: 'Temperature coefficient', rounding: 'Encoding note', nearestNominal: 'Rounded to nearest nominal.' },
    fields: { mode: 'Choose a task', decodeMode: 'Decode bands', encodeMode: 'Find bands from resistance', bands: 'Band count', fourBands: '4 bands', fiveBands: '5 bands', sixBands: '6 bands', resistanceOhms: 'Resistance in ohms', tolerance: 'Tolerance', temperatureCoefficient: 'Temperature coefficient', accuracyNote: 'Standard 4–6 band codes.', band1: 'Band 1', band2: 'Band 2', band3: 'Band 3', band4: 'Band 4', band5: 'Band 5', band6: 'Band 6', black: 'Black', brown: 'Brown', red: 'Red', orange: 'Orange', yellow: 'Yellow', green: 'Green', blue: 'Blue', violet: 'Violet', gray: 'Gray', white: 'White', gold: 'Gold', silver: 'Silver', none: 'None', ppm250: '250 ppm/K', ppm100: '100 ppm/K', ppm50: '50 ppm/K', ppm25: '25 ppm/K', ppm20: '20 ppm/K', ppm15: '15 ppm/K', ppm10: '10 ppm/K', ppm5: '5 ppm/K', ppm1: '1 ppm/K', tolerance005: '0.05%', tolerance01: '0.1%', tolerance025: '0.25%', tolerance05: '0.5%', tolerance1: '1%', tolerance2: '2%', tolerance5: '5%', tolerance10: '10%', tolerance20: '20%' },
  },
  'led-resistor-calculator': {
    name: 'LED resistor calculator', actions: { ...actions, example: 'Try 12 V, one 2 V LED, 20 mA' },
    messages: { ...messages, totalLedVoltage: 'Total LED voltage', resistorVoltage: 'Resistor voltage', requiredResistance: 'Required resistance', standardResistor: 'Suggested standard resistor', actualCurrent: 'Estimated current', resistorPower: 'Resistor power', minimumPowerRating: 'Suggested power rating', powerRatingExceeds: 'Choose a higher-rated part' },
    fields: { supplyVoltage: 'Supply voltage (V)', forwardVoltage: 'Forward voltage per LED (V)', ledCount: 'LED count', targetCurrentMa: 'Target current (mA)', standardSeries: 'Preferred series', e12: 'E12', e24: 'E24', accuracyNote: 'Ideal DC estimate only.' },
  },
  'acceleration-calculator': {
    name: 'Acceleration calculator', actions: { ...actions, calculate: 'Calculate motion', example: 'Try 0 to 20 m/s in 5 seconds' },
    messages: { ...messages, acceleration: 'Acceleration', time: 'Elapsed time', initialVelocity: 'Initial velocity', finalVelocity: 'Final velocity', initialPosition: 'Initial position', displacement: 'Displacement', finalPosition: 'Final position' },
    fields: { mode: 'Solve for', solveAcceleration: 'Acceleration', solveTime: 'Time', solveFinalVelocity: 'Final velocity', solveDisplacement: 'Displacement', units: 'Unit system', metric: 'Metric', imperial: 'Imperial', initialVelocity: 'Initial velocity', finalVelocity: 'Final velocity', acceleration: 'Acceleration', timeSeconds: 'Time in seconds', initialPosition: 'Initial position', accuracyNote: 'Constant acceleration only.' },
  },
  'force-calculator': {
    name: 'Force calculator', actions: { ...actions, calculate: 'Calculate force', example: 'Try 2 kg × 3 m/s²' },
    messages: { ...messages, force: 'Force', netForce: 'Net force', mass: 'Mass', acceleration: 'Acceleration', diagram: 'Force diagram' },
    fields: { mode: 'Calculation mode', solveForce: 'Solve force', solveMass: 'Solve mass', solveAcceleration: 'Solve acceleration', netMode: 'Add collinear forces', forceUnit: 'Force unit', massUnit: 'Mass unit', accelerationUnit: 'Acceleration unit', force: 'Force', mass: 'Mass', acceleration: 'Acceleration', forces: 'Signed forces', forcesHint: 'Enter 2–5 forces on one line.', netMass: 'Object mass', accuracyNote: 'Ideal one-dimensional mechanics only.' },
  },
  'friction-calculator': {
    name: 'Friction calculator',
    actions: { ...actions, normalMode: 'Known normal force', inclineMode: 'Mass on an incline', newtons: 'Newtons', kilonewtons: 'Kilonewtons', poundsForce: 'Pounds-force' },
    messages: { ...messages, normalForce: 'Normal force', gravityComponent: 'Gravity along surface', requiredStatic: 'Static friction needed', maximumStatic: 'Maximum static friction', frictionMagnitude: 'Friction magnitude', frictionDirection: 'Friction direction', regime: 'Motion result', netForce: 'Net force', acceleration: 'Acceleration', noDirection: 'None', positiveDirection: 'Positive direction', negativeDirection: 'Negative direction', uphill: 'Up slope', downhill: 'Down slope', static: 'At rest', startsDownhill: 'Starts sliding down', startsUphill: 'Starts sliding up' },
    fields: { mode: 'Calculation mode', normalForce: 'Normal force', mass: 'Mass', massUnit: 'Mass unit', angle: 'Incline angle', gravity: 'Gravity', staticCoefficient: 'Static coefficient', kineticCoefficient: 'Kinetic coefficient', appliedForce: 'Applied force', forceUnit: 'Force unit', motionState: 'Object state', atRest: 'At rest', movingUp: 'Moving up', movingDown: 'Moving down', positiveSurfaceDirection: 'Direction note', accuracyNote: 'Coulomb model only.' },
  },
  'thermal-expansion-calculator': {
    name: 'Thermal expansion calculator',
    actions: { ...actions, squareMeters: 'Square meters', squareCentimeters: 'Square centimeters', squareFeet: 'Square feet', squareInches: 'Square inches', cubicMeters: 'Cubic meters', cubicCentimeters: 'Cubic centimeters', liters: 'Liters', cubicInches: 'Cubic inches' },
    messages: { ...messages, mode: 'Expansion type', initialDimension: 'Starting dimension', coefficient: 'Coefficient', temperatureChange: 'Temperature change', dimensionChange: 'Dimension change', finalDimension: 'Final dimension', relativeChange: 'Relative change' },
    fields: { mode: 'Expansion type', linearMode: 'Linear', areaMode: 'Area', volumeMode: 'Volume', initialDimension: 'Starting dimension', lengthUnit: 'Length unit', areaUnit: 'Area unit', volumeUnit: 'Volume unit', coefficient: 'Expansion coefficient', coefficientTemperatureUnit: 'Coefficient stated per', perCelsius: 'degree Celsius', perFahrenheit: 'degree Fahrenheit', perCelsiusShort: 'per °C', perFahrenheitShort: 'per °F', deltaTemperature: 'Temperature change', temperatureUnit: 'Temperature unit', celsius: 'Celsius', fahrenheit: 'Fahrenheit', accuracyNote: 'Enter a coefficient for the selected type.' },
  },
  'horsepower-calculator': {
    name: 'Horsepower calculator', actions: { ...actions, calculate: 'Calculate', example: 'Try 100 N·m at 1,000 RPM' },
    messages: { ...messages, torque: 'Torque', rpm: 'Engine speed', power: 'Power', watts: 'Watts', kilowatts: 'Kilowatts', horsepower: 'Mechanical horsepower', metricHorsepower: 'Metric horsepower (PS)' },
    fields: { mode: 'Calculate', solvePower: 'Power from torque and RPM', solveTorque: 'Torque from power and RPM', solveRpm: 'RPM from power and torque', torque: 'Torque', torqueUnit: 'Torque unit', rpm: 'Engine speed (RPM)', power: 'Power', powerUnit: 'Power unit', accuracyNote: 'Ideal shaft power only.' },
  },
  'rtf-converter': {
    name: 'RTF converter', actions: { ...actions, convert: 'Convert to text', print: 'Print or save as PDF' }, messages: { ...messages },
    fields: { file: 'Choose RTF file', limitNote: '5 MiB local limit.', accuracyNote: 'Text extraction only.', output: 'Extracted text' },
  },
  'csv-to-pdf': {
    name: 'CSV to PDF', actions: { ...actions, preview: 'Preview table', example: 'Load example', print: 'Print or save as PDF' }, messages: { ...messages },
    fields: { file: 'Choose CSV file', separator: 'Separator', auto: 'Detect', comma: 'Comma', semicolon: 'Semicolon', tab: 'Tab', pipe: 'Pipe', encoding: 'Encoding', hasHeader: 'First row is headings', pageSize: 'Paper', orientation: 'Orientation', landscape: 'Landscape', portrait: 'Portrait', margin: 'Margins', narrow: 'Narrow', normal: 'Normal', accuracyNote: 'Plain data only.', limitNote: '5 MiB local limit.', resultCount: 'rows', columnCount: 'columns', previewLimit: 'First', tableLabel: 'CSV preview' },
  },
  'round-robin-tournament-generator': {
    name: 'Round Robin Tournament Generator', actions: { ...actions, generate: 'Create schedule', example: 'Load example', downloadCsv: 'Download CSV', print: 'Print or save as PDF' }, messages: { ...messages },
    fields: { participants: 'Teams or players, one per line', participantsHint: '2–32 unique names.', doubleRound: 'Create a return leg', shuffle: 'Shuffle the draw', scoringNote: '3 points for a win, 1 for a draw.', limitNote: '32 participant limit.', standingsLabel: 'Standings', rank: 'Rank', team: 'Team', played: 'Played', wins: 'Wins', draws: 'Draws', losses: 'Losses', goalsFor: 'For', goalsAgainst: 'Against', goalDifference: 'Goal difference', points: 'Points', round: 'Round', leg: 'Leg', home: 'Home', away: 'Away', bye: 'Bye', homeScore: 'Home score', awayScore: 'Away score', fixtureTableLabel: 'Fixtures' },
  },
  'work-order-generator': {
    name: 'Work order generator', actions: { ...actions, generate: 'Create work order', example: 'Load example', downloadCsv: 'Download CSV', print: 'Print or save as PDF', open: 'Open', inProgress: 'In progress', completed: 'Completed' },
    messages: { ...messages, invalid: 'Check the work-order fields and line formats.', ready: 'Work order preview is ready.', createFirst: 'Create a work order first.', printBlocked: 'Allow the print window.', exampleLoaded: 'Example work order loaded.', downloadFailed: 'CSV download failed.' },
    fields: { workOrderNumber: 'Work order number', issuedDate: 'Issue date', scheduledDate: 'Scheduled date', completedDate: 'Completion date', status: 'Job status', customer: 'Customer', contact: 'Contact', location: 'Service location', assignedTo: 'Assigned to', title: 'Job summary', details: 'Work details', tasks: 'Checklist', tasksHint: 'One task per line.', materials: 'Materials', materialsHint: 'Enter description, quantity and unit.', materialsFormat: 'Description | quantity | unit', labor: 'Labor activities', laborHint: 'Enter activity and hours.', laborFormat: 'Activity | hours', notes: 'Notes', limitNote: 'Up to 40 entries per section.', privacyNote: 'Runs locally.', previewTitle: 'Work order preview', checklist: 'Checklist', materialsLabel: 'Materials', laborLabel: 'Labor', description: 'Description', quantity: 'Quantity', unit: 'Unit', activity: 'Activity', hours: 'Hours', totalLaborHours: 'Total logged labor hours' },
  },
  'compression-ratio-calculator': {
    name: 'Compression ratio calculator', actions: { ...actions, millimeters: 'Millimeters', inches: 'Inches' },
    messages: { ...messages, ratio: 'Static compression ratio', sweptVolume: 'Swept volume', clearanceVolume: 'Clearance volume', totalDisplacement: 'Total displacement', boreStroke: 'Bore to stroke' },
    fields: { unit: 'Measurement unit', volumeUnit: 'Volume unit', millimeters: 'Millimeters', inches: 'Inches', cubicCentimeters: 'Cubic centimeters', cubicInches: 'Cubic inches', bore: 'Cylinder bore', stroke: 'Stroke', chamberVolume: 'Chamber volume', gasketBore: 'Gasket bore', gasketThickness: 'Gasket thickness', deckClearance: 'Deck clearance', pistonCrownVolume: 'Piston dish or dome volume', cylinders: 'Cylinder count', accuracyNote: 'Static estimate only.' },
  },
  'goal-planner': {
    name: 'Goal Planner', actions: { ...actions, updateProgress: 'Record progress' },
    messages: { ...messages, generated: 'Plan created.', downloaded: 'Backup downloaded.', importFailed: 'Invalid backup.', saved: 'Saved.', storageUnavailable: 'Storage unavailable.', current: 'Current', day: 'day', days: 'days', remaining: 'remaining' },
    fields: { title: 'Goal name', outcome: 'Specific outcome', metric: 'Progress measure', unit: 'Unit', startValue: 'Baseline', targetValue: 'Target', currentValue: 'Current', startDate: 'Start date', currentDate: 'Progress date', dueDate: 'Deadline', milestones: 'Milestones', milestoneHint: 'Use YYYY-MM-DD | description.', accuracyNote: 'Linear progress only.', privacyNote: 'Stored in this browser.', progressLabel: 'Progress toward target', milestonesLabel: 'Milestones', backupFile: 'Restore JSON backup', backupHint: 'Choose a file up to 100 KB.', relatedTaskList: 'Task list' },
  },
  'mind-map-maker': {
    name: 'Mind Map Maker', actions: { ...actions, addChild: 'Add child idea', removeNode: 'Remove branch', moveUp: 'Move up', moveDown: 'Move down', moveNode: 'Move idea', collapse: 'Collapse branch', expand: 'Expand branch', undo: 'Undo', redo: 'Redo', exportSvg: 'Download SVG', exportJson: 'Download JSON', importJson: 'Import JSON backup' },
    messages: { ...messages, created: 'Map ready.', updated: 'Updated.', added: 'Idea added.', removed: 'Branch removed.', imported: 'Imported.', importFailed: 'Invalid backup.', checkTopic: 'Enter a topic.', checkIdea: 'Check the idea.', enterIdea: 'Enter an idea.' },
    fields: { centralTopic: 'Central topic', newIdea: 'New idea', privacyNote: 'Stays in this tab.', mapLabel: 'Mind map ideas', editIdea: 'Edit idea', moveTo: 'Move under', jsonFile: 'JSON backup', importHint: 'Maximum 500 KB.' },
  },
  'mood-tracker': {
    name: 'Mood Tracker', actions: { ...actions, saveEntry: 'Record check-in', updateEntry: 'Update check-in', removeEntry: 'Delete day', clearHistory: 'Clear all', previousMonth: 'Previous month', nextMonth: 'Next month', export: 'Download backup', import: 'Import backup' },
    fields: { date: 'Check-in date', mood: 'Mood rating', note: 'Optional note', tags: 'Emotion tags', saveConsent: 'Save in this browser', privacyNote: 'No cloud sync.', consentHint: 'Storage is optional.', calendarLabel: 'Mood calendar', monthLabel: 'Month', selectedEntry: 'Selected check-in', weekdaySun: 'Sun', weekdayMon: 'Mon', weekdayTue: 'Tue', weekdayWed: 'Wed', weekdayThu: 'Thu', weekdayFri: 'Fri', weekdaySat: 'Sat', mood1: 'Very low', mood2: 'Low', mood3: 'Neutral', mood4: 'Good', mood5: 'Very good', tagCalm: 'Calm', tagAnxious: 'Anxious', tagSad: 'Sad', tagHappy: 'Happy', tagTired: 'Tired', tagFocused: 'Focused', tagStressed: 'Stressed', tagHopeful: 'Hopeful', tagGrateful: 'Grateful', tagAngry: 'Angry', summaryLabel: 'Last 7 days', averageLabel: 'Average', countLabel: 'Days', distributionLabel: 'Distribution', noEntries: 'No entries.', accuracyNote: 'Not a diagnostic tool.', importHint: 'JSON up to 500 KB.', sourceNote: 'Seek local support if needed.' },
  },
  'journal-online': {
    name: 'Online Journal', actions: { ...actions, saveEntry: 'Save entry in this tab', updateEntry: 'Update entry', newEntry: 'New entry', example: 'Load example', reset: 'Clear form', search: 'Search', clearSearch: 'Clear search', deleteEntry: 'Delete selected entry', clearAll: 'Delete all entries', exportJson: 'Download JSON backup', importJson: 'Import JSON backup', saveBackup: 'Create encrypted backup' },
    messages: { ...messages, savedInTab: 'Entry saved.', updatedInTab: 'Entry updated.', deleted: 'Entry deleted.', allDeleted: 'All entries deleted.', allDeletedStorageFailed: 'Entries were cleared, but saved browser data could not be removed.', backupTooLarge: 'Backup exceeds 10 MB.', imported: 'Backup imported.', importFailed: 'Invalid backup or password.', importCancelled: 'Import cancelled.', exported: 'Backup downloaded.', encryptedExported: 'Encrypted backup downloaded.', localSaved: 'Saved in this browser.', localSaveRemoved: 'Saved copy removed.', storageFailed: 'Browser storage unavailable.', searchUpdated: 'Search updated.', noSelection: 'Select an entry.', passwordMismatch: 'Passwords do not match.', passwordNeeded: 'Enter a password.', encrypting: 'Encrypting…', decrypting: 'Decrypting…', confirmDelete: 'Delete this entry?', confirmClear: 'Delete all entries?', confirmImport: 'Replace current entries?', checkInputs: 'Check the date and text.', unsupportedCrypto: 'Secure encryption is unavailable.', currentEntry: 'Current entry', searchRange: 'Check the date range.' },
    fields: { date: 'Entry date', title: 'Title', body: 'Journal entry', tags: 'Tags', search: 'Search', dateFrom: 'From', dateTo: 'To', saveConsent: 'Save in this browser', storageNote: 'Browser storage is not encrypted.', encryptionNote: 'Encrypted backup is separate from browser storage.', backupPassword: 'Backup password', confirmPassword: 'Confirm password', entriesLabel: 'Entries', resultLabel: 'Selected entry', noEntries: 'No matching entries.', countLabel: 'Matching entries', tagHint: 'Comma-separated tags.', importHint: 'JSON up to 10 MB; encrypted up to 14 MB.', passwordHint: 'Password is not saved.', exampleHint: 'Example is not saved automatically.', exampleTitle: 'A small moment', exampleBody: 'Write a few lines about today.', exampleTags: 'reflection, sample', safetyNote: 'Private writing aid; not a health service.' },
  },
  'travel-itinerary-planner': {
    name: 'Travel itinerary planner', actions: { ...actions, createTrip: 'Create or update trip', saveItem: 'Add stop', updateItem: 'Update stop', newItem: 'New stop', deleteItem: 'Delete selected stop', deleteTrip: 'Delete trip', exportIcs: 'Download calendar (.ics)', exportJson: 'Download JSON backup', importJson: 'Import JSON backup', print: 'Print itinerary' },
    messages: { ...messages, tripSaved: 'Saved.', storageFailed: 'Storage unavailable.', tripDeletedStorageFailed: 'Deleted in this tab, but browser copy remains.', checkTrip: 'Check trip.', createTripFirst: 'Create a trip first.', exampleLoaded: 'Example loaded.', itemSaved: 'Stop added.', itemUpdated: 'Stop updated.', checkItem: 'Check stop.', formCleared: 'Cleared.', itemDeleted: 'Deleted.', confirmDeleteTrip: 'Delete trip?', tripDeleted: 'Trip deleted.', confirmRestore: 'Restore?', localSaved: 'Saved locally.', localRemoved: 'Removed.', jsonDownloaded: 'JSON downloaded.', icsDownloaded: 'Calendar downloaded.', backupTooLarge: 'Too large.', noItemsToExport: 'Add a stop.', exportFailed: 'Export failed.', confirmImport: 'Replace?', importCancelled: 'Cancelled.', imported: 'Imported.', importFailed: 'Invalid backup.', overlap: '{first} overlaps {second} by {minutes} min.', shortConnection: '{first} to {second}: {minutes} min; {needed} min needed.' },
    fields: { tripName: 'Trip name', tripStartDate: 'First day', tripEndDate: 'Last day', bufferMinutes: 'Buffer', saveConsent: 'Save in this browser', storageNote: 'Optional local storage.', itemDate: 'Date', startTime: 'Start time', endTime: 'End time', itemTitle: 'Stop name', category: 'Type', categories: { activity: 'Activity', meal: 'Meal', transport: 'Transport', stay: 'Stay', reservation: 'Reservation', other: 'Other' }, location: 'Place', reservation: 'Booking details', notes: 'Notes', itineraryLabel: 'Itinerary', noTrip: 'Create a trip.', noItems: 'No stops.', itemCount: 'Stops', overlapCount: 'Overlaps', bufferWarningCount: 'Short connections', conflictsLabel: 'Schedule checks', backupFile: 'Import JSON', backupHint: 'JSON up to 1 MB.', limitNote: 'Maximum 366 days and 250 stops.', timeZoneNote: 'Times stay as entered.', reservationPrivacyNote: 'Do not enter passwords or card numbers.', exampleTrip: 'Kyoto weekend', exampleActivity: 'Temple visit', exampleMeal: 'Lunch', exampleLocation: 'Kyoto', exampleReservation: 'Example only' },
  },
  'polynomial-long-division-calculator': { name: 'Polynomial division', actions: { ...actions }, fields: { dividend: 'Dividend polynomial', divisor: 'Divisor polynomial', accuracyNote: 'Integer coefficients; degree up to 20.' } },
  'half-life-calculator': { name: 'Half-life calculator', actions: { ...actions, solveRemaining: 'Remaining amount', solveInitial: 'Initial amount', solveElapsed: 'Elapsed time', solveHalfLife: 'Half-life' }, fields: { mode: 'Solve for', solveRemaining: 'Remaining amount', solveInitial: 'Initial amount', solveElapsed: 'Elapsed time', solveHalfLife: 'Half-life', initialAmount: 'Initial amount', remainingAmount: 'Remaining amount', halfLife: 'Half-life', elapsedTime: 'Elapsed time', timeUnit: 'Shared time unit', seconds: 'Seconds', minutes: 'Minutes', hours: 'Hours', days: 'Days', years: 'Years', accuracyNote: 'Use the same time unit.' } },
  'mortgage-points-calculator': { name: 'Mortgage points calculator', actions: { ...actions }, fields: { principal: 'Loan amount', termMonths: 'Loan term', rateWithoutPoints: 'Annual rate before points', rateWithPoints: 'Annual rate with points', pointsPercent: 'Points', horizonMonths: 'Comparison horizon', monthsLabel: 'months', accuracyNote: 'Estimate only.' } },
  'trapezoid-calculator': { name: 'Trapezoid calculator', actions: { ...actions }, fields: { baseA: 'Bottom base', baseB: 'Top base', height: 'Height', topOffset: 'Top base offset', unit: 'Unit', millimeters: 'Millimeters', centimeters: 'Centimeters', meters: 'Meters', inches: 'Inches', feet: 'Feet', accuracyNote: 'All dimensions must use one unit.', diagramLabel: 'Trapezoid geometry' } },
  'prayer-times-calculator': { name: 'Prayer times calculator', actions: { ...actions }, fields: { date: 'Date', latitude: 'Latitude', longitude: 'Longitude', utcOffset: 'UTC offset', method: 'Method', mwl: 'MWL', isna: 'ISNA', egypt: 'Egypt', makkah: 'Makkah', karachi: 'Karachi', france: 'France', russia: 'Russia', singapore: 'Singapore', asrMethod: 'Asr', standard: 'Standard', hanafi: 'Hanafi', highLatitudeMethod: 'High latitude', angleBased: 'Angle based', middleOfNight: 'Middle of night', oneSeventh: 'One-seventh', noAdjustment: 'None', ramadan: 'Ramadan', accuracyNote: 'Estimate only.' } },
};
copies['a-b-test-calculator'] = {
  ...abTestEnglishCopy,
};
copies['investment-allocation-calculator'] = {
  ...investmentAllocationEnglishCopy,
};
copies['repeating-decimal-to-fraction'] = { ...repeatingDecimalEnglishCopy };
copies['parametric-equation-calculator'] = { ...parametricEquationEnglishCopy };
copies['singular-value-decomposition-calculator'] = { ...singularValueDecompositionEnglishCopy };
copies['spearman-correlation-calculator'] = { ...spearmanCorrelationEnglishCopy };
copies['wilcoxon-signed-rank-test-calculator'] = { ...wilcoxonSignedRankEnglishCopy };
copies['chinese-remainder-theorem-calculator'] = { ...chineseRemainderEnglishCopy };
copies['json-diff'] = { ...jsonDiffEnglishCopy };
copies['text-to-binary-converter'] = { ...textToBinaryEnglishCopy };
copies['certificate-decoder'] = { ...certificateDecoderEnglishCopy };
copies['json-to-xml-converter'] = { ...jsonToXmlEnglishCopy };
  copies['har-viewer'] = { ...harViewerEnglishCopy };
  copies['robots-txt-tester'] = { ...robotsTxtTesterEnglishCopy };
  copies['json-to-excel'] = { ...jsonToExcelEnglishCopy };
  copies['binary-base64-tool'] = { ...binaryBase64ToolEnglishCopy };
  copies['json-model-generator'] = { ...jsonModelGeneratorEnglishCopy };
  copies['csv-editor'] = { ...csvEditorEnglishCopy };
  copies['ph-calculator'] = { ...phCalculatorEnglishCopy };
  copies['section-modulus-calculator'] = { ...sectionModulusCalculatorEnglishCopy };
  copies['frequency-wavelength-calculator'] = { ...frequencyWavelengthCalculatorEnglishCopy };
  copies['ideal-gas-law-calculator'] = { ...idealGasLawCalculatorEnglishCopy };
  copies['torque-calculator'] = { ...torqueCalculatorEnglishCopy };
  copies['beam-deflection-calculator'] = { ...beamDeflectionCalculatorEnglishCopy };
copies['savings-goal-calculator'] = { name: 'Savings Goal Calculator', actions: { ...actions, requiredContribution: 'Monthly deposit needed', monthsToGoal: 'Time needed for my deposit', beginning: 'Beginning of month', end: 'End of month' }, messages: { ...messages }, fields: { mode: 'Calculation', startingBalance: 'Current savings', targetAmount: 'Savings target', annualRatePercent: 'Annual rate', months: 'Months', monthlyContribution: 'Monthly deposit', contributionTiming: 'Deposit timing', accuracyNote: 'Estimate only.', resultSummary: 'Estimate', monthlyResult: 'Required deposit', monthsResult: 'Months', projectedBalance: 'Projected balance', totalContributions: 'Deposits', estimatedInterest: 'Estimated interest', currencyNote: 'Use the same currency.' } };
copies['severance-pay-calculator'] = { name: 'Severance Pay Calculator', actions: { ...actions, customMode: 'Custom assumptions', ukMode: 'Great Britain statutory estimate' }, messages: { ...messages, calculationFailed: 'Could not calculate.', exampleLoaded: 'Example loaded.', calculateFirst: 'Calculate first.', belowServiceMinimum: 'Fewer than two completed years.', capApplied: 'A cap applied.', noCapApplied: 'No cap applied.', customAssumptions: 'Custom assumptions.' }, fields: { mode: 'Calculation type', weeklyPay: 'Average gross weekly pay', yearsOfService: 'Years of service', weeksPerYear: 'Weeks per year', birthDate: 'Birth date', employmentStartDate: 'Employment start date', redundancyDate: 'Redundancy date', accuracyNote: 'Estimate only.', customNote: 'Uses your assumptions.', ukNote: 'Great Britain estimate; enter GBP.', officialSource: 'Official guidance', estimate: 'Estimated amount', appliedWeeklyPay: 'Weekly pay used', totalWeeks: 'Weeks of pay', rulesAsOf: 'Rules from', resultSummary: 'Estimate details' } };
copies['divisibility-calculator'] = { name: 'Divisibility Calculator', actions: { ...actions, commonDivisors: 'Test common divisors' }, messages: { ...messages, calculated: 'Results ready.', checkInputs: 'Check entries.', exampleLoaded: 'Example loaded.', commonDivisorsLoaded: 'Common divisors loaded.', calculateFirst: 'Check a number first.', divisible: 'Divisible', notDivisible: 'Not divisible' }, fields: { integer: 'Whole number', divisors: 'Divisors', accuracyNote: 'Checks up to 30 positive divisors.', resultSummary: 'Results', remainder: 'Remainder', quotient: 'Exact quotient', rule: 'Rule', rule1: 'Divisible by 1.', rule2: 'Last digit is even.', rule3: 'Digit sum divisible by 3.', rule4: 'Last two digits divisible by 4.', rule5: 'Last digit is 0 or 5.', rule6: 'Divisible by 2 and 3.', rule7: 'Double last digit and subtract.', rule8: 'Last three digits divisible by 8.', rule9: 'Digit sum divisible by 9.', rule10: 'Last digit is 0.', rule11: 'Alternating digit sum divisible by 11.', rule12: 'Divisible by 3 and 4.', rule13: 'Multiply last digit by 4 and add.', rule25: 'Last two digits are 00, 25, 50 or 75.', rule100: 'Last two digits are 00.', rule1000: 'Last three digits are 000.', ruleGeneric: 'Use the exact remainder.' } };
copies['chess-opening-trainer'] = { name: 'Chess Opening Trainer', actions: { newGame: 'New line', hint: 'Hint', rules: 'Rules' }, fields: Object.fromEntries(['opening','side','white','black','board','moves','progressLabel','square','empty','accuracyNote','rules','opening_italian','opening_sicilian','opening_ruy_lopez','opening_french','opening_caro_kann','opening_queens_gambit','opening_london','opening_scandinavian','opening_english','opening_kings_indian','piece_wp','piece_wn','piece_wb','piece_wr','piece_wq','piece_wk','piece_bp','piece_bn','piece_bb','piece_br','piece_bq','piece_bk'].map((key) => [key, key])) };
copies['decibel-calculator'] = { name: 'Decibel Calculator', actions: { calculate: 'Calculate', reset: 'Clear', copy: 'Copy result', example: 'Try an example', result: 'Result' }, fields: Object.fromEntries(['mode','powerMode','amplitudeMode','dbToPowerMode','dbToAmplitudeMode','sumMode','applyMode','ratio','inputDb','levels','levelsHint','inputLevel','gainDb','accuracyNote','assumptionsNote','formula'].map((key) => [key, key])) };
copies['hijri-calendar-converter'] = { name: 'Hijri Calendar Converter', actions: { convert: 'Convert date', reset: 'Reset', example: 'Try an example', result: 'Converted date' }, fields: { mode: 'Direction', gregorianToHijri: 'Gregorian to Hijri', hijriToGregorian: 'Hijri to Gregorian', gregorianDate: 'Gregorian date', gregorianYear: 'Year', gregorianMonth: 'Month', gregorianDay: 'Day', hijriYear: 'Year AH', hijriMonth: 'Month', hijriDay: 'Day', hijriMonths: ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha’ban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'], methodNote: 'Tabular calendar.' } };
copies['capacitor-calculator'] = { name: 'Capacitor Calculator', actions: { calculate: 'Calculate', reset: 'Clear', example: 'Try an example', result: 'Results' }, fields: { values: 'Capacitance values', valuesHint: 'One per line.', unit: 'Unit', connection: 'Connection', series: 'Series', parallel: 'Parallel', voltage: 'Voltage', accuracyNote: 'Ideal capacitors only.', resultEquivalent: 'Equivalent capacitance', resultCharge: 'Charge', resultEnergy: 'Energy', resultVoltage: 'Voltage', capacitor: 'Capacitor', formulaNote: 'Formulas' } };
copies['openapi-editor'] = { name: 'OpenAPI editor', actions: { ...actions, validate: 'Check contract', example: 'Load example', format: 'Format document', download: 'Download file', copyReport: 'Copy report' }, fields: Object.fromEntries(['format','autoFormat','jsonFormat','yamlFormat','document','upload','accuracyNote','previewTitle','operations','issues','yamlLicense'].map((key) => [key, key])) };
copies['font-pairing-tool'] = { name: 'Font Pairing Tool', actions: { ...actions, applyPreset: 'Apply pairing', swap: 'Swap fonts', copyCss: 'Copy CSS', clearFonts: 'Clear added fonts' }, fields: Object.fromEntries(['preset','headingFont','bodyFont','fontFiles','accuracyNote','sampleHeading','sampleBody','hierarchyLabel','headingSize','bodySize','headingWeight','bodyWeight','lineHeight','familyGeorgia','familyTimes','familyArial','familyVerdana','familyTrebuchet','familyMono','familySystem','presetEditorial','presetModern','presetClassic','presetTechnical','presetFriendly','presetSystem'].map((key) => [key, key])) };
copies['roth-vs-traditional-calculator'] = { name: 'Roth vs Traditional IRA Calculator', actions: { ...actions, compare: 'Compare estimates', example: 'Load example', reset: 'Reset', result: 'Results' }, fields: Object.fromEntries(['annualContribution','currentTaxRate','futureTaxRate','annualReturn','years','budgetNote','accuracyNote','resultSummary','rothAnnualDeposit','rothAfterTax','traditionalBeforeTax','traditionalAfterTax','traditionalTax','taxPaidNow','estimatedDifference','totalBudget','irsSource'].map((key) => [key, key])) };
copies['roth-vs-traditional-calculator'].fields.budgetNote = 'Compare the same pretax budget in each scenario.';
copies['roth-vs-traditional-calculator'].fields.irsSource = 'IRS information about IRA distributions';
copies['polygon-calculator'] = { name: 'Polygon Calculator', actions: { ...actions, calculate: 'Calculate', example: 'Load hexagon example', reset: 'Reset', copy: 'Copy results', result: 'Results' }, messages, fields: Object.fromEntries(['sides','dimensionMode','sideLength','apothem','circumradius','dimension','unit','accuracyNote','resultSummary','perimeter','area','computedSide','computedApothem','computedCircumradius','interiorAngle','centralAngle','formulaNote'].map((key) => [key, key])) };
copies['number-line-graphing-tool'] = { name: 'Number Line Generator', actions: { ...actions, downloadSvg: 'Download SVG' }, messages: { ...messages, calculated: 'Number line ready.', checkInputs: 'Check interval endpoints.', exampleLoaded: 'Example loaded.', downloaded: 'SVG downloaded.' }, fields: { intervals: 'Intervals or points', intervalFormat: 'One interval per line.', accuracyNote: 'Up to 20 rows; fractions are plotted approximately.', chartDescription: 'Number line graph', exampleInput: '(1, 3]\n-2' } };
copies['laplace-transform-calculator'] = { name: 'Laplace Transform Calculator', actions: { ...actions }, messages: { ...messages, calculated: 'Transform calculated.', checkInputs: 'Check inputs.', exampleLoaded: 'Example loaded.' }, fields: { direction: 'Transform direction', forwardMode: 'Laplace transform', inverseMode: 'Inverse Laplace transform', expression: 'Expression', forwardHint: 'Supported forms.', inverseHint: 'One term per line.', accuracyNote: 'Bounded table only.', resultSummary: 'Result', region: 'Region of convergence', forwardConvention: 'Unilateral transform.', inverseConvention: 'Unilateral inverse.', forwardExample: '1', inverseExample: '1/s' } };
copies['vector-calculator'] = { name: 'Vector Calculator', actions: { ...actions, add: 'Add A + B', subtract: 'Subtract A − B', dot: 'Dot product', cross: 'Cross product', magnitudeA: 'Magnitude of A', magnitudeB: 'Magnitude of B', normalizeA: 'Normalize A', normalizeB: 'Normalize B', angle: 'Angle between A and B', projection: 'Project A onto B' }, messages: { ...messages, exampleLoaded: 'Example loaded.' }, fields: { dimension: 'Vector dimensions', dimension2d: '2D', dimension3d: '3D', operation: 'Operation', vectorA: 'Vector A', vectorB: 'Vector B', ax: 'A x component', ay: 'A y component', az: 'A z component', bx: 'B x component', by: 'B y component', bz: 'B z component', accuracyNote: 'Compatible units only.', resultSummary: 'Results', zComponent: 'z-component', magnitudeAResult: 'Magnitude of A', magnitudeBResult: 'Magnitude of B', dotProductResult: 'Dot product', exampleHint: 'Example hint' } };
copies['cubic-quartic-equation-calculator'] = { name: 'Cubic and quartic calculator', actions: { ...actions }, messages: { ...messages, exampleLoaded: 'Example loaded.' }, fields: { degree: 'Degree', degree3: 'Cubic', degree4: 'Quartic', a4: 'x4 coefficient', a3: 'x3 coefficient', a2: 'x2 coefficient', a1: 'x coefficient', a0: 'Constant', accuracyNote: 'Real roots only.', resultSummary: 'Roots', root: 'Root', multiplicity: 'Multiplicity', residual: 'Residual', noRealRoots: 'No real roots.', nonRealRootsNote: 'Non-real roots not shown.', exampleHint: 'Example' } };
copies['complex-number-calculator'] = { name: 'Complex number calculator', actions: { ...actions }, messages: { ...messages, calculated: 'Result ready.', checkInputs: 'Check values.', exampleLoaded: 'Example loaded.', componentOutOfRange: 'Component outside range.', radiusOutOfRange: 'Radius outside range.', angleOutOfRange: 'Angle outside range.', negativeRadius: 'Negative radius.', invalidAngleUnit: 'Choose degrees or radians.', invalidRootDegree: 'Choose degree 2 to 12.', divisionByZero: 'Cannot divide by zero.', zeroArgument: 'Zero has no argument.', resultOutOfRange: 'Result outside range.', invalidOperation: 'Choose an operation.', missingValue: 'Enter every value.' }, fields: { operation: 'Operation', realA: 'Real part of z1', imaginaryA: 'Imaginary part of z1', realB: 'Real part of z2', imaginaryB: 'Imaginary part of z2', radius: 'Magnitude', angle: 'Angle', angleUnit: 'Angle unit', degrees: 'Degrees', radians: 'Radians', degree: 'Root degree', resultSummary: 'Result', resultReal: 'Real part', resultImaginary: 'Imaginary part', modulus: 'Modulus', argument: 'Principal argument', polar: 'Polar form', rootNumber: 'Root', zeroArgumentNote: 'Zero has no argument.', accuracyNote: 'Numerical results only.', exampleHint: 'i × i = −1.' } };
copies['divisibility-calculator'] = { name: 'Divisibility Calculator', actions: { ...actions, commonDivisors: 'Test common divisors' }, messages: { ...messages, calculated: 'Results ready.', checkInputs: 'Check entries.', exampleLoaded: 'Example loaded.', commonDivisorsLoaded: 'Common divisors loaded.', calculateFirst: 'Check a number first.', divisible: 'Divisible', notDivisible: 'Not divisible' }, fields: { integer: 'Whole number', divisors: 'Divisors', accuracyNote: 'Checks up to 30 positive divisors.', resultSummary: 'Results', remainder: 'Remainder', quotient: 'Exact quotient', rule: 'Rule', rule1: 'Divisible by 1.', rule2: 'Last digit is even.', rule3: 'Digit sum divisible by 3.', rule4: 'Last two digits divisible by 4.', rule5: 'Last digit is 0 or 5.', rule6: 'Divisible by 2 and 3.', rule7: 'Double last digit and subtract.', rule8: 'Last three digits divisible by 8.', rule9: 'Digit sum divisible by 9.', rule10: 'Last digit is 0.', rule11: 'Alternating digit sum divisible by 11.', rule12: 'Divisible by 3 and 4.', rule13: 'Multiply last digit by 4 and add.', rule25: 'Last two digits are 00, 25, 50 or 75.', rule100: 'Last two digits are 00.', rule1000: 'Last three digits are 000.', ruleGeneric: 'Use the exact remainder.' } };

test('all pilot forms render semantic labels, explicit actions and localized strings', () => {
  for (const tool of growthPilotTools) {
    const html = renderGrowthForm(tool.id, copies[tool.id]);
    assert.ok(html.length > 100, `${tool.id} form should render`);
    assert.match(html, /aria-live="polite"/u, `${tool.id} should announce state/results`);
    assert.doesNotMatch(html, /\son[a-z]+=/iu, `${tool.id} must not use inline event handlers`);
    assert.doesNotMatch(html, />undefined<|>null</u, `${tool.id} must not emit missing values`);
  }
  assert.match(renderGrowthForm('gravel-calculator', copies['gravel-calculator']), /for="length"/u);
  assert.doesNotMatch(renderGrowthForm('gravel-calculator', copies['gravel-calculator']), /name="area"/u);
  assert.match(renderGrowthForm('molar-mass-calculator', copies['molar-mass-calculator']), /maxlength="160"/u);
  assert.match(renderGrowthForm('secret-santa-generator', copies['secret-santa-generator']), /data-reveal-name/u);
  assert.match(renderGrowthForm('mancala', copies.mancala), /data-board/u);
  assert.match(renderGrowthForm('goal-planner', copies['goal-planner']), /id="goal-backup-file"[^>]+type="file"[^>]+accept="\.json,application\/json"/u);
  const colorPicker = renderGrowthForm('image-color-picker', copies['image-color-picker']);
  assert.match(colorPicker, /type="file" accept="image\/png,image\/jpeg,image\/webp,image\/gif,image\/avif,image\/bmp"/u);
  assert.match(colorPicker, /data-color-picker-preview tabindex="0" role="button"/u);
  assert.match(colorPicker, /name="zoom"/u);
  assert.match(colorPicker, /data-color-picker-palette/u);
  assert.match(colorPicker, /data-action="copy-palette"/u);
  assert.match(colorPicker, /data-action="reset"/u);
  assert.match(renderGrowthForm('gravel-calculator', copies['gravel-calculator']), /type="submit" data-action="calculate"/u);
  const pavers = renderGrowthForm('paver-calculator', copies['paver-calculator']);
  assert.match(pavers, /name="moduleLength"/u);
  assert.match(pavers, /name="paversPerModule"/u);
  assert.match(pavers, /data-action="copy"/u);
  const solar = renderGrowthForm('solar-panel-calculator', copies['solar-panel-calculator']);
  assert.match(solar, /name="mode"/u);
  assert.match(solar, /name="dailyTargetKwh"/u);
  assert.match(solar, /name="panelCount"/u);
  assert.match(solar, /data-solar-target hidden/u);
  assert.match(solar, /data-solar-count/u);
  assert.match(solar, /name="systemCost"/u);
  const btu = renderGrowthForm('btu-calculator', copies['btu-calculator']);
  assert.match(btu, /name="ceilingHeight"/u);
  assert.match(btu, /name="insulationAdjustment"/u);
  assert.match(btu, /value="typical" selected/u);
  assert.match(btu, /aria-live="polite"/u);
  const brick = renderGrowthForm('brick-calculator', copies['brick-calculator']);
  assert.match(brick, /name="openingCount"/u);
  assert.match(brick, /name="wythes"/u);
  assert.match(brick, /name="bagYieldLiters"/u);
  assert.match(brick, /data-action="copy"/u);
  assert.match(renderGrowthForm('secret-santa-generator', copies['secret-santa-generator']), /type="submit" data-action="generate"/u);
  const stairs = renderGrowthForm('stair-calculator', copies['stair-calculator']);
  assert.match(stairs, /name="riserCount" type="number" min="2" max="100" step="1"/u);
  assert.match(stairs, /data-stair-diagram/u);
  const heatLoss = renderGrowthForm('heat-loss-calculator', copies['heat-loss-calculator']);
  for (const name of ['areaUnit', 'temperatureUnit', 'temperatureDifference', 'wallArea', 'wallUValue', 'roofArea', 'roofUValue', 'windowArea', 'windowUValue', 'floorArea', 'floorUValue', 'volumeUnit', 'roomVolume', 'airChangesPerHour']) assert.match(heatLoss, new RegExp(`name="${name}"`, 'u'));
  assert.match(heatLoss, /Simplified estimate only\./u);
  assert.match(heatLoss, /data-action="calculate"/u);
  const heatPump = renderGrowthForm('heat-pump-calculator', copies['heat-pump-calculator']);
  for (const name of ['heatOutput', 'heatOutputUnit', 'cop', 'electricityRatePerKwh', 'hoursPerDay', 'currency']) assert.match(heatPump, new RegExp(`name="${name}"`, 'u'));
  assert.match(heatPump, /COP 1/u);
  assert.match(heatPump, /data-action="calculate"/u);
  const miter = renderGrowthForm('miter-angle-calculator', copies['miter-angle-calculator']);
  assert.match(miter, /name="cornerAngle" type="number" min="1" max="179"/u);
  assert.match(miter, /name="springAngle" type="number" min="0" max="90"/u);
  assert.match(miter, /data-compound-fields hidden/u);
  assert.match(miter, /role="img" aria-labelledby="miter-diagram-title miter-diagram-desc"/u);
  assert.match(miter, /data-action="copy"/u);
  assert.match(miter, /data-action="calculate"/u);
  const voltageDrop = renderGrowthForm('voltage-drop-calculator', copies['voltage-drop-calculator']);
  for (const name of ['circuit', 'material', 'oneWayLength', 'lengthUnit', 'currentA', 'crossSectionMm2', 'supplyVoltageV', 'powerFactor']) assert.match(voltageDrop, new RegExp(`name="${name}"`, 'u'));
  assert.match(voltageDrop, /data-power-factor-field/u);
  assert.match(voltageDrop, /data-action="calculate"/u);
  assert.match(voltageDrop, /type="reset"/u);
  const molarity = renderGrowthForm('molarity-calculator', copies['molarity-calculator']);
  for (const name of ['mode', 'moles', 'molarity', 'volume', 'volumeUnit', 'molarMass']) assert.match(molarity, new RegExp(`name="${name}"`, 'u'));
  for (const mode of ['concentration', 'moles', 'volume', 'solute-mass', 'prepare-solution']) assert.match(molarity, new RegExp(`value="${mode}"`, 'u'));
  assert.match(molarity, /data-molarity-fields="molarMass"/u);
  assert.match(molarity, /data-action="copy"/u);
  const dilution = renderGrowthForm('dilution-calculator', copies['dilution-calculator']);
  for (const name of ['mode', 'stockConcentration', 'targetConcentration', 'finalVolume', 'volumeUnit', 'steps']) assert.match(dilution, new RegExp(`name="${name}"`, 'u'));
  assert.match(dilution, /data-dilution-steps hidden/u);
  assert.match(dilution, /value="serial"/u);
  assert.match(dilution, /data-action="copy"/u);
  const ohms = renderGrowthForm('ohms-law-calculator', copies['ohms-law-calculator']);
  for (const name of ['mode', 'voltage', 'current', 'resistance', 'power', 'topology', 'resistorValues']) assert.match(ohms, new RegExp(`name="${name}"`, 'u'));
  assert.match(ohms, /data-ohms-solver/u);
  assert.match(ohms, /data-ohms-network hidden/u);
  assert.match(ohms, /max="1000000000000"/u);
  assert.match(ohms, /data-action="copy"/u);
  const bodyWater = renderGrowthForm('body-water-calculator', copies['body-water-calculator']);
  for (const name of ['equation', 'age', 'height', 'heightUnit', 'weight', 'weightUnit']) assert.match(bodyWater, new RegExp(`name="${name}"`, 'u'));
  assert.match(bodyWater, /name="age" type="text" inputmode="numeric"/u);
  assert.match(bodyWater, /data-result hidden/u);
  const timer555 = renderGrowthForm('555-timer-calculator', copies['555-timer-calculator']);
  for (const name of ['mode', 'resistanceA', 'resistanceB', 'resistance', 'resistanceUnit', 'capacitance', 'capacitanceUnit']) assert.match(timer555, new RegExp(`name="${name}"`, 'u'));
  assert.match(timer555, /data-555-mode="astable"/u);
  assert.match(timer555, /data-555-mode="monostable" hidden/u);
  assert.match(timer555, /ti\.com\/lit\/ds\/symlink\/ne555\.pdf/u);
  assert.match(timer555, /data-action="copy"/u);
  const fourier = renderGrowthForm('fourier-series-calculator', copies['fourier-series-calculator']);
  for (const name of ['samples', 'period', 'harmonics']) assert.match(fourier, new RegExp(`name="${name}"`, 'u'));
  assert.match(fourier, /data-action="constant"/u);
  assert.match(fourier, /data-fourier-formula/u);
  assert.match(fourier, /<textarea[^>]+maxlength="4096"/u);
  const modularInverse = renderGrowthForm('modular-inverse-calculator', copies['modular-inverse-calculator']);
  for (const name of ['a', 'modulus']) assert.match(modularInverse, new RegExp(`name="${name}"`, 'u'));
  assert.match(modularInverse, /type="submit" data-action="calculate"/u);
  assert.match(modularInverse, /data-action="example"/u);
  assert.match(modularInverse, /data-action="copy"/u);
  const chemical = renderGrowthForm('chemical-equation-balancer', copies['chemical-equation-balancer']);
  assert.match(chemical, /name="equation"[^>]+maxlength="500"/u);
  assert.match(chemical, /for="chemical-equation"/u);
  assert.match(chemical, /data-action="example"/u);
  assert.match(chemical, /data-action="copy"/u);
  const gear = renderGrowthForm('gear-ratio-calculator', copies['gear-ratio-calculator']);
  for (const name of ['stages', 'inputRpm', 'inputTorque', 'driveType', 'efficiencyPercent']) assert.match(gear, new RegExp(`name="${name}"`, 'u'));
  assert.match(gear, /maxlength="180"/u);
  assert.match(gear, /data-action="example"/u);
  assert.match(gear, /data-action="copy"/u);
  const density = renderGrowthForm('density-calculator', copies['density-calculator']);
  for (const name of ['mode', 'massKg', 'volumeM3', 'densityKgM3', 'components']) assert.match(density, new RegExp(`name="${name}"`, 'u'));
  assert.match(density, /data-density-solve/u);
  assert.match(density, /data-density-mixture/u);
  assert.match(density, /maxlength="1200"/u);
  assert.match(density, /data-action="copy"/u);
  const kinetic = renderGrowthForm('kinetic-energy-calculator', copies['kinetic-energy-calculator']);
  for (const name of ['mode', 'massKg', 'velocityMps', 'kineticEnergyJ', 'heightM', 'gravityMps2']) assert.match(kinetic, new RegExp(`name="${name}"`, 'u'));
  assert.match(kinetic, /data-kinetic-solve/u);
  assert.match(kinetic, /data-kinetic-energy-input hidden/u);
  assert.match(kinetic, /data-action="example"/u);
  assert.match(kinetic, /data-action="copy"/u);
  const resistor = renderGrowthForm('resistor-color-code-calculator', copies['resistor-color-code-calculator']);
  for (const name of ['mode', 'bands', 'resistanceOhms', 'tolerance', 'temperatureCoefficient', 'band1', 'band6']) assert.match(resistor, new RegExp(`name="${name}"`, 'u'));
  assert.match(resistor, /data-resistor-decode/u);
  assert.match(resistor, /data-resistor-encode hidden/u);
  assert.match(resistor, /value="none"/u);
  const ledResistor = renderGrowthForm('led-resistor-calculator', copies['led-resistor-calculator']);
  for (const name of ['supplyVoltage', 'forwardVoltage', 'ledCount', 'targetCurrentMa', 'series']) assert.match(ledResistor, new RegExp(`name="${name}"`, 'u'));
  assert.match(ledResistor, /value="E12"/u);
  assert.match(ledResistor, /data-action="copy"/u);
  assert.match(resistor, /data-action="example"/u);
  assert.match(resistor, /data-action="copy"/u);
  const acceleration = renderGrowthForm('acceleration-calculator', copies['acceleration-calculator']);
  for (const name of ['mode', 'units', 'initialVelocity', 'finalVelocity', 'acceleration', 'timeSeconds', 'initialPosition']) assert.match(acceleration, new RegExp(`name="${name}"`, 'u'));
  assert.match(acceleration, /value="imperial"/u);
  assert.match(acceleration, /data-action="example"/u);
  assert.match(acceleration, /data-action="copy"/u);
  const force = renderGrowthForm('force-calculator', copies['force-calculator']);
  for (const name of ['mode', 'forceUnit', 'massUnit', 'accelerationUnit', 'force', 'mass', 'acceleration', 'forces', 'netMass']) assert.match(force, new RegExp(`name="${name}"`, 'u'));
  assert.match(force, /data-force-solve/u);
  assert.match(force, /data-force-net hidden/u);
  assert.match(force, /data-action="example"/u);
  assert.match(force, /data-action="copy"/u);
  const friction = renderGrowthForm('friction-calculator', copies['friction-calculator']);
  assert.match(friction, /name="mode"/u);
  assert.match(friction, /data-friction-fields="normal"/u);
  assert.match(friction, /data-friction-fields="incline" hidden/u);
  assert.match(friction, /name="staticCoefficient"/u);
  assert.match(friction, /name="kineticCoefficient"/u);
  assert.match(friction, /Coulomb model only\./u);
  const thermal = renderGrowthForm('thermal-expansion-calculator', copies['thermal-expansion-calculator']);
  for (const name of ['mode', 'initialDimension', 'lengthUnit', 'areaUnit', 'volumeUnit', 'coefficient', 'coefficientTemperatureUnit', 'deltaTemperature', 'temperatureUnit']) assert.match(thermal, new RegExp(`name="${name}"`, 'u'));
  assert.match(thermal, /data-thermal-unit="area" hidden/u);
  assert.match(thermal, /data-thermal-unit="volume" hidden/u);
  assert.match(thermal, /data-action="example"/u);
  assert.match(thermal, /data-action="copy"/u);
  const horsepower = renderGrowthForm('horsepower-calculator', copies['horsepower-calculator']);
  for (const name of ['mode', 'torqueUnit', 'torque', 'rpm', 'powerUnit', 'power']) assert.match(horsepower, new RegExp(`name="${name}"`, 'u'));
  assert.match(horsepower, /data-horsepower-field="power" hidden/u);
  assert.match(horsepower, /data-action="example"/u);
  assert.match(horsepower, /data-action="copy"/u);
  const compression = renderGrowthForm('compression-ratio-calculator', copies['compression-ratio-calculator']);
  for (const name of ['unit', 'volumeUnit', 'bore', 'stroke', 'chamberVolume', 'gasketBore', 'gasketThickness', 'deckClearance', 'pistonCrownVolume', 'cylinders']) assert.match(compression, new RegExp(`name="${name}"`, 'u'));
  assert.match(compression, /min="1" max="16" step="1"/u);
  assert.match(compression, /data-action="example"/u);
  assert.match(compression, /data-action="copy"/u);
  const goalPlanner = renderGrowthForm('goal-planner', copies['goal-planner']);
  for (const name of ['title', 'outcome', 'metric', 'startValue', 'targetValue', 'currentValue', 'startDate', 'currentDate', 'dueDate', 'milestones']) assert.match(goalPlanner, new RegExp(`name="${name}"`, 'u'));
  assert.match(goalPlanner, /data-progress-bar/u);
  assert.match(goalPlanner, /data-milestones/u);
  assert.match(goalPlanner, /data-action="update-progress"/u);
  assert.match(goalPlanner, /data-action="download"/u);
  const mindMap = renderGrowthForm('mind-map-maker', copies['mind-map-maker']);
  for (const action of ['add-child', 'remove-node', 'move-node', 'move-up', 'move-down', 'toggle-node', 'undo', 'redo', 'export-svg', 'export-json']) assert.ok(mindMap.includes(`data-action="${action}"`) || ['add-child', 'remove-node', 'move-node', 'move-up', 'move-down', 'toggle-node'].includes(action));
  assert.match(mindMap, /name="jsonFile" type="file" accept="\.json,application\/json"/u);
  assert.match(mindMap, /data-mind-map/u);
  const moodTracker = renderGrowthForm('mood-tracker', copies['mood-tracker']);
  for (const name of ['date', 'mood', 'tags', 'note', 'saveConsent', 'backupFile']) assert.match(moodTracker, new RegExp(`name="${name}"`, 'u'));
  assert.match(moodTracker, /data-calendar/u);
  assert.match(moodTracker, /data-distribution/u);
  assert.match(moodTracker, /type="checkbox"/u);
  assert.match(moodTracker, /data-action="clear-history"/u);
  const journal = renderGrowthForm('journal-online', copies['journal-online']);
  for (const name of ['date', 'title', 'body', 'tags', 'search', 'dateFrom', 'dateTo', 'saveConsent', 'backupPassword', 'confirmPassword', 'backupFile']) assert.match(journal, new RegExp(`name="${name}"`, 'u'));
  for (const action of ['record', 'new-entry', 'search', 'clear-search', 'delete-entry', 'clear-all', 'export-json', 'save-backup']) assert.match(journal, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(journal, /accept="\.json,application\/json"/u);
  assert.match(journal, /data-journal-list/u);
  const itinerary = renderGrowthForm('travel-itinerary-planner', copies['travel-itinerary-planner']);
  for (const name of ['tripName', 'tripStartDate', 'tripEndDate', 'bufferMinutes', 'itemDate', 'startTime', 'endTime', 'itemTitle', 'category', 'location', 'reservation', 'notes', 'saveConsent', 'backupFile']) assert.match(itinerary, new RegExp(`name="${name}"`, 'u'));
  for (const action of ['create-trip', 'save-item', 'new-item', 'delete-item', 'export-ics', 'export-json', 'print', 'delete-trip']) assert.match(itinerary, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(itinerary, /data-itinerary-list/u);
  assert.match(itinerary, /data-conflict-list/u);
  assert.match(itinerary, /accept="\.json,application\/json"/u);
  const asphalt = renderGrowthForm('asphalt-calculator', copies['asphalt-calculator']);
  assert.match(asphalt, /name="compactedThickness"/u);
  assert.match(asphalt, /name="pricePerTonne"/u);
  assert.match(asphalt, /value="2400"/u);
  assert.match(renderGrowthForm('gravel-calculator', copies['gravel-calculator']), /<label for="triangle-height">/u);
  const soil = renderGrowthForm('soil-calculator', copies['soil-calculator']);
  assert.match(soil, /data-soil-shape/u);
  assert.match(soil, /name="containerCount" type="number" min="1" max="10000" step="1"/u);
  assert.match(soil, /name="bagVolume"/u);
  const pool = renderGrowthForm('pool-volume-calculator', copies['pool-volume-calculator']);
  assert.match(pool, /data-pool-shape/u);
  assert.match(pool, /data-pool-deep-depth/u);
  assert.match(pool, /name="ovalLength"/u);
  const salt = renderGrowthForm('pool-salt-calculator', copies['pool-salt-calculator']);
  assert.match(salt, /name="currentSalinityPpm"/u);
  assert.match(salt, /name="targetSalinityPpm"/u);
  assert.match(salt, /name="bagSize"/u);
  const wallpaper = renderGrowthForm('wallpaper-calculator', copies['wallpaper-calculator']);
  for (const name of ['unit', 'perimeter', 'wallHeight', 'openingsArea', 'rollWidth', 'rollLength', 'patternRepeat', 'wastePercent']) assert.match(wallpaper, new RegExp(`name="${name}"`, 'u'));
  assert.match(wallpaper, /name="patternRepeat"[^>]+value="0"/u);
  const redactor = renderGrowthForm('image-region-redactor', copies['image-region-redactor']);
  for (const name of ['imageFile', 'mode', 'strength', 'regionX', 'regionY', 'regionWidth', 'regionHeight', 'format']) assert.match(redactor, new RegExp(`name="${name}"`, 'u'));
  assert.match(redactor, /type="file"[^>]+accept="image\//u);
  assert.match(redactor, /data-preview tabindex="0"/u);
  assert.match(redactor, /data-region-list/u);
  const sharpener = renderGrowthForm('image-sharpener', copies['image-sharpener']);
  for (const name of ['imageFile', 'amount', 'radius', 'threshold', 'compare', 'format']) assert.match(sharpener, new RegExp(`name="${name}"`, 'u'));
  assert.match(sharpener, /data-sharpener-preview tabindex="0"/u);
  assert.match(sharpener, /8 megapixel limit/u);
  assert.match(sharpener, /type="checkbox" name="compare"/u);

  const upscaler = renderGrowthForm('image-upscaler', copies['image-upscaler']);
  assert.match(upscaler, /data-worker-src="__WORKER_IMAGE_UPSCALER_WORKER__"/u);
  assert.match(upscaler, /data-action="upscale"/u);
  assert.match(upscaler, /data-action="cancel"/u);
  assert.match(upscaler, /data-upscaler-source/u);
  const roof = renderGrowthForm('roof-pitch-calculator', copies['roof-pitch-calculator']);
  assert.match(roof, /name="rise"/u);
  assert.match(roof, /name="overhang"/u);
  const drywall = renderGrowthForm('drywall-calculator', copies['drywall-calculator']);
  for (const name of ['roomLength', 'roomWidth', 'wallHeight', 'openingArea', 'roomCount', 'includeCeiling', 'boardWidth', 'boardHeight', 'wastePercent', 'screwsPerBoard', 'pricePerBoard']) assert.match(drywall, new RegExp(`name="${name}"`, 'u'));
  assert.match(renderGrowthForm('gravel-calculator', copies['gravel-calculator']), /data-tool-copy/u);
  const roofing = renderGrowthForm('roofing-calculator', copies['roofing-calculator']);
  for (const name of ['projectedArea', 'areaUnit', 'rise', 'run', 'pitchUnit', 'wastePercent', 'bundlesPerSquare', 'pricePerBundle']) assert.match(roofing, new RegExp(`name="${name}"`, 'u'));
  assert.match(roofing, /value="1200"/u);
  assert.match(roofing, /value="12"/u);
  const deck = renderGrowthForm('deck-calculator', copies['deck-calculator']);
  for (const name of ['unit', 'length', 'width', 'boardUnit', 'boardWidth', 'gap', 'stockBoardLength', 'joistSpacing', 'wastePercent', 'fastenersPerIntersection', 'pricePerBoard']) assert.match(deck, new RegExp(`name="${name}"`, 'u'));
  assert.match(deck, /name="boardWidth"[^>]+value="5\.5"/u);
  const payload = renderGrowthForm('secret-santa-generator', { ...copies['secret-santa-generator'], description: '</script><script>alert(1)</script>' });
  assert.doesNotMatch(payload, /<script>alert\(1\)<\/script>/u);
});

test('polynomial long-division form labels both expressions and uses explicit actions', () => {
  const html = renderGrowthForm('polynomial-long-division-calculator', copies['polynomial-long-division-calculator']);
  assert.match(html, /<label for="polynomial-dividend">Dividend polynomial<\/label>/u);
  assert.match(html, /name="dividend" type="text" maxlength="256"/u);
  assert.match(html, /<label for="polynomial-divisor">Divisor polynomial<\/label>/u);
  assert.match(html, /data-action="example"/u);
  assert.match(html, /data-action="calculate"/u);
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('half-life form exposes a solve mode, four labeled values, shared time unit and explicit actions', () => {
  const html = renderGrowthForm('half-life-calculator', copies['half-life-calculator']);
  for (const name of ['mode', 'initialAmount', 'remainingAmount', 'halfLife', 'elapsedTime', 'timeUnit']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /name="mode"><option value="remaining">Remaining amount/u);
  assert.match(html, /name="timeUnit"><option value="seconds">Seconds/u);
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('mortgage-points form exposes quoted rates, point cost, term, horizon and accessible actions', () => {
  const html = renderGrowthForm('mortgage-points-calculator', copies['mortgage-points-calculator']);
  for (const name of ['principal', 'termMonths', 'rateWithoutPoints', 'rateWithPoints', 'pointsPercent', 'horizonMonths']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /name="rateWithPoints" type="number"[^>]+max="100"/u);
  assert.match(html, /name="horizonMonths" type="number"[^>]+max="600"/u);
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('trapezoid form labels bases, height, offset, units and its accessible sketch', () => {
  const html = renderGrowthForm('trapezoid-calculator', copies['trapezoid-calculator']);
  for (const id of ['trapezoid-base-a', 'trapezoid-base-b', 'trapezoid-height', 'trapezoid-offset', 'trapezoid-unit']) assert.match(html, new RegExp(`for="${id}"`, 'u'));
  assert.match(html, /data-trapezoid-shape/u);
  assert.match(html, /aria-labelledby="trapezoid-diagram-title"/u);
  assert.match(html, /data-action="calculate"/u);
});

test('prayer times form requires explicit civil time inputs and exposes convention/fallback choices', () => {
  const html = renderGrowthForm('prayer-times-calculator', copies['prayer-times-calculator']);
  for (const name of ['date', 'latitude', 'longitude', 'utcOffsetHours', 'method', 'asrMethod', 'highLatitudeMethod', 'ramadan']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /value="isna" selected/u);
  assert.match(html, /value="angle" selected/u);
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('dominoes form exposes localized play modes, draw/block choices, board, stock and hand', () => {
  const html = renderGrowthForm('dominoes-game', copies['dominoes-game']);
  assert.match(html, /data-mode/u);
  assert.match(html, /data-variant/u);
  assert.match(html, /data-board/u);
  assert.match(html, /data-stock-count/u);
  assert.match(html, /data-hand/u);
  assert.match(html, /data-action="draw"/u);
  assert.match(html, /data-action="pass"/u);
  assert.match(html, /aria-live="polite"/u);
});

test('Hitori form exposes localized grid settings, accessible game grid and rule actions', () => {
  const html = renderGrowthForm('hitori', copies.hitori);
  assert.match(html, /data-size/u);
  assert.match(html, /data-difficulty/u);
  assert.match(html, /role="grid"/u);
  assert.match(html, /data-action="check-board"/u);
  assert.match(html, /data-action="hint"/u);
  assert.match(html, /data-action="clear-marks"/u);
});

test('Nurikabe form exposes accessible board, difficulty, rules and local puzzle actions', () => {
  const html = renderGrowthForm('nurikabe', copies.nurikabe);
  assert.match(html, /data-difficulty/u);
  assert.match(html, /role="grid"/u);
  assert.match(html, /aria-live="polite"/u);
  assert.match(html, /data-action="new-game"/u);
  assert.match(html, /data-action="check-board"/u);
  assert.match(html, /data-action="hint"/u);
  assert.match(html, /data-action="clear-marks"/u);
  assert.match(html, /2×2/u);
});

test('Slitherlink form exposes local grid-size selection and accessible loop controls', () => {
  const html = renderGrowthForm('slitherlink', copies.slitherlink);
  assert.match(html, /data-size/u);
  assert.match(html, /data-board[^>]+role="group"[^>]+aria-label=/u);
  for (const action of ['new-game', 'check-board', 'hint', 'undo', 'clear-marks']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /aria-live="polite"/u);
});

test('Peg solitaire form exposes an accessible 33-hole board, peg count, undo and local hint actions', () => {
  const html = renderGrowthForm('peg-solitaire', copies['peg-solitaire']);
  assert.match(html, /data-board[^>]+role="group"[^>]+aria-label=/u);
  assert.match(html, /data-peg-count/u);
  for (const action of ['new-game', 'hint', 'undo']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /aria-live="polite"/u);
});

test('Futoshiki form renders localized selectors, accessible board, checks, hints and undo', () => {
  const html = renderGrowthForm('futoshiki', copies.futoshiki);
  assert.match(html, /data-size/u);
  assert.match(html, /data-difficulty/u);
  assert.match(html, /data-board[^>]+role="group"[^>]+aria-label=/u);
  assert.doesNotMatch(html, /role="grid"/u);
  for (const action of ['new-game', 'check-board', 'hint', 'undo', 'notes']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /aria-pressed="false"/u);
  assert.match(html, /greater-than and less-than|Follow the row/u);
  assert.match(html, /aria-live="polite"/u);
});

test('Hashi form renders accessible board, difficulty and bridge check, hint, undo and clear actions', () => {
  const html = renderGrowthForm('hashi-puzzle', copies['hashi-puzzle']);
  assert.match(html, /data-difficulty/u);
  assert.match(html, /data-board[^>]+role="group"[^>]+aria-label=/u);
  for (const action of ['new-game', 'check-board', 'hint', 'undo', 'clear-board']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /Connect all islands/u);
  assert.match(html, /aria-live="polite"/u);
});

test('Chess opening trainer form renders localized selectors, a keyboard-ready board, hints and move history', () => {
  const fieldKeys = ['opening','side','white','black','board','moves','progressLabel','square','accuracyNote','rules','opening_italian','opening_sicilian','opening_ruy_lopez','opening_french','opening_caro_kann','opening_queens_gambit','opening_london','opening_scandinavian','opening_english','opening_kings_indian','empty','piece_wp','piece_wn','piece_wb','piece_wr','piece_wq','piece_wk','piece_bp','piece_bn','piece_bb','piece_br','piece_bq','piece_bk'];
  const fields = Object.fromEntries(fieldKeys.map((key) => [key, key]));
  const html = renderGrowthForm('chess-opening-trainer', { name: 'Chess Opening Trainer', fields, actions: { newGame: 'New line', hint: 'Hint', rules: 'Rules' } });
  assert.match(html, /data-opening/u); assert.match(html, /data-side/u);
  assert.match(html, /data-board[^>]+role="group"[^>]+dir="ltr"/u);
  assert.match(html, /data-moves/u); assert.match(html, /aria-live="polite"/u);
  for (const action of ['new-game', 'hint', 'rules']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
});

test('decibel calculator form keeps mode-specific controls bounded and announced accessibly', () => {
  const html = renderGrowthForm('decibel-calculator', copies['decibel-calculator']);
  assert.match(html, /id="decibel-mode" name="mode"/u);
  assert.match(html, /min="1e-300" max="1e300"/u);
  for (const selector of ['data-decibel-ratio', 'data-decibel-input', 'data-decibel-levels', 'data-decibel-gain']) assert.match(html, new RegExp(selector, 'u'));
  assert.match(html, /data-decibel-ratio-note/u);
  for (const action of ['example', 'calculate', 'reset', 'copy']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
  assert.match(html, /data-result hidden aria-live="polite"/u);
});

test('investment allocation form renders bounded holding rows, clear estimates and local-copy actions', () => {
  const html = renderGrowthForm('investment-allocation-calculator', investmentAllocationEnglishCopy);
  assert.match(html, /name="assetCount"/u);
  assert.match(html, /name="currencyCode"/u);
  assert.match(html, /name="contribution"/u);
  assert.equal((html.match(/data-allocation-row/g) ?? []).length, 9); // Eight rows and the table body target share the allocation prefix.
  assert.match(html, /data-allocation-result hidden/u);
  assert.match(html, /data-allocation-rows/u);
  assert.match(html, /not investment advice/u);
  for (const action of ['example', 'calculate', 'reset', 'copy']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
});

test('repeating decimal form explains parentheses notation and exposes exact local conversion actions', () => {
  const html = renderGrowthForm('repeating-decimal-to-fraction', repeatingDecimalEnglishCopy);
  assert.match(html, /name="decimal"/u);
  assert.match(html, /0\.1\(6\)/u);
  assert.match(html, /18 repeating digits/u);
  assert.match(html, /data-result hidden aria-live="polite"/u);
  for (const action of ['example', 'calculate', 'reset', 'copy']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
});

test('parametric equation form exposes bounded expressions, graph result and CSV export', () => {
  const html = renderGrowthForm('parametric-equation-calculator', parametricEquationEnglishCopy);
  assert.match(html, /name="xExpression"[^>]*value="cos\(t\)"/u);
  assert.match(html, /name="yExpression"[^>]*value="sin\(t\)"/u);
  assert.match(html, /name="samples"[^>]*min="50"[^>]*max="1500"/u);
  assert.match(html, /data-result-count/u);
  assert.match(html, /data-result-content/u);
  for (const action of ['example', 'calculate', 'reset', 'downloadCsv']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
});

test('SVD form exposes an accessible matrix input, bounded scope and CSV export', () => {
  const html = renderGrowthForm('singular-value-decomposition-calculator', singularValueDecompositionEnglishCopy);
  assert.match(html, /textarea[^>]+name="matrix"/u);
  assert.match(html, /2–8 rows/u);
  assert.match(html, /data-action="example"/u);
  assert.match(html, /data-action="calculate"/u);
  assert.match(html, /data-action="downloadCsv"/u);
  assert.match(html, /data-result-rank/u);
  assert.match(html, /aria-live="polite"/u);
});

test('Spearman form exposes paired values, tie note and local CSV export', () => {
  const html = renderGrowthForm('spearman-correlation-calculator', spearmanCorrelationEnglishCopy);
  assert.match(html, /name="pairs"/u);
  assert.match(html, /1, 10\n2, 20\n3, 30/u);
  assert.match(html, /data-result-rho/u);
  assert.match(html, /data-result-ties/u);
  assert.match(html, /data-action="downloadCsv"/u);
  assert.match(html, /data-tool-copy/u);
});

test('Wilcoxon form exposes paired before/after inputs and transparent result fields', () => {
  const html = renderGrowthForm('wilcoxon-signed-rank-test-calculator', wilcoxonSignedRankEnglishCopy);
  assert.match(html, /name="pairs"/u);
  assert.match(html, /data-result-positive/u);
  assert.match(html, /data-result-negative/u);
  assert.match(html, /data-result-p/u);
  assert.match(html, /data-result-content/u);
  assert.match(html, /data-action="downloadCsv"/u);
});

test('JSON Diff form exposes two local inputs, array matching and patch export controls', () => {
  const html = renderGrowthForm('json-diff', jsonDiffEnglishCopy);
  assert.match(html, /id="json-diff-before"[^>]*maxlength="200000"/u);
  assert.match(html, /id="json-diff-after"[^>]*maxlength="200000"/u);
  assert.match(html, /id="json-diff-patch" name="patch"[^>]*readonly/u);
  assert.match(html, /name="arrayMode"/u);
  assert.match(html, /data-diff-list/u);
  assert.match(html, /data-json-patch/u);
  for (const action of ['example', 'compare', 'copy', 'copyPatch', 'downloadPatch']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('text to binary form exposes distinct UTF-8 modes, bounded inputs and local result actions', () => {
  const html = renderGrowthForm('text-to-binary-converter', textToBinaryEnglishCopy);
  assert.match(html, /name="mode"/u);
  assert.match(html, /data-text-input/u);
  assert.match(html, /data-binary-input hidden/u);
  assert.match(html, /name="textInput"[^>]*maxlength="20000"/u);
  assert.match(html, /name="binaryInput"[^>]*maxlength="200000"/u);
  assert.match(html, /data-binary-output/u);
  assert.match(html, /type="checkbox"/u);
  for (const action of ['example', 'convert', 'reset', 'copy', 'download']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
});

test('certificate decoder form supports bounded local PEM/DER input and safe result actions', () => {
  const html = renderGrowthForm('certificate-decoder', certificateDecoderEnglishCopy);
  assert.match(html, /name="certificate"[^>]*maxlength="1574000"/u);
  assert.match(html, /name="certificateFile"[^>]*type="file"/u);
  assert.match(html, /accept="[^"]*\.pem[^"]*\.der/u);
  assert.match(html, /role="status" aria-live="polite"/u);
  assert.match(html, /data-result-content/u);
  for (const action of ['example', 'decode', 'reset', 'copySummary']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.doesNotMatch(html, /value="-----BEGIN CERTIFICATE-----/u);
});

test('JSON/XML converter form exposes bidirectional bounded inputs and local output actions', () => {
  const html = renderGrowthForm('json-to-xml-converter', jsonToXmlEnglishCopy);
  assert.match(html, /name="mode"/u);
  assert.match(html, /name="jsonInput"[^>]*maxlength="200000"/u);
  assert.match(html, /name="xmlInput"[^>]*maxlength="200000"/u);
  assert.match(html, /name="rootName"/u);
  assert.match(html, /name="indent"/u);
  assert.match(html, /data-json-xml-output/u);
  for (const action of ['example', 'convert', 'reset', 'copy', 'download']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /data-tool-copy/u);
  assert.doesNotMatch(html.slice(html.indexOf('<form')), /https?:\/\//u);
});

test('HAR viewer form handles local files or pasted text and keeps request rendering bounded', () => {
  const html = renderGrowthForm('har-viewer', harViewerEnglishCopy);
  assert.match(html, /name="harFile"[^>]*type="file"/u);
  assert.match(html, /name="harText"[^>]*maxlength="5242880"/u);
  assert.match(html, /data-har-rows/u);
  assert.match(html, /HAR files may contain cookies/u);
  for (const action of ['example', 'analyze', 'reset', 'showMore']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.doesNotMatch(html.slice(html.indexOf('<form')), /https?:\/\//u);
});

test('robots tester form uses bounded local inputs and explicitly limits its scope', () => {
  const html = renderGrowthForm('robots-txt-tester', robotsTxtTesterEnglishCopy);
  assert.match(html, /name="robotsText"[^>]*maxlength="200000"/u);
  assert.match(html, /name="userAgent"[^>]*maxlength="80"/u);
  assert.match(html, /name="urls"[^>]*maxlength="409600"/u);
  assert.match(html, /Test rules/u);
  assert.match(html, /not a complete emulator/u);
  assert.match(html, /not access control/u);
  assert.doesNotMatch(html, /type="file"|fetch\(/iu);
});

test('JSON to Excel form is accessible, bounded, locally previewable and offers XLSX download', () => {
  const html = renderGrowthForm('json-to-excel', jsonToExcelEnglishCopy);
  assert.match(html, /name="jsonInput"[^>]*maxlength="2000000"/u);
  assert.match(html, /name="dataset"/u);
  for (const action of ['example', 'preview', 'reset', 'download']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
  assert.match(html, /<caption>/u);
  assert.doesNotMatch(html, /type="file"|fetch\(/iu);
});

test('binary Base64 form uses a labelled local file input, explicit output mode, and copy/download controls', () => {
  const html = renderGrowthForm('binary-base64-tool', binaryBase64ToolEnglishCopy);
  assert.match(html, /type="file"/u);
  assert.match(html, /name="outputFormat"/u);
  assert.match(html, /data-base64-output/u);
  assert.match(html, /data-base64-preview/u);
  for (const action of ['convert', 'reset', 'copy', 'download']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
  assert.doesNotMatch(html, /fetch\(|http:\/\//iu);
});

test('JSON model generator form provides bounded local JSON input and three code targets', () => {
  const html = renderGrowthForm('json-model-generator', jsonModelGeneratorEnglishCopy);
  assert.match(html, /name="json"[^>]*maxlength="500000"/u);
  assert.match(html, /name="language"/u);
  for (const language of ['typescript', 'csharp', 'java']) assert.match(html, new RegExp(`value="${language}"`, 'u'));
  assert.match(html, /name="rootName"[^>]*maxlength="48"/u);
  assert.match(html, /data-json-model-output/u);
  for (const action of ['example', 'generate', 'reset', 'copy', 'download']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /Generated declarations are estimates/u);
  assert.doesNotMatch(html, /fetch\(|https?:\/\//iu);
});

test('CSV editor form exposes bounded local import, grid editing, history, paging and UTF-8 export', () => {
  const html = renderGrowthForm('csv-editor', csvEditorEnglishCopy);
  assert.match(html, /name="csvFile"[^>]*type="file"/u);
  assert.match(html, /name="csvText"[^>]*maxlength="5242880"/u);
  for (const action of ['load', 'addRow', 'addColumn', 'undo', 'redo', 'export', 'copy']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /data-csv-head/u);
  assert.match(html, /data-csv-body/u);
  assert.match(html, /id="csv-type-hint"/u);
  assert.match(html, /UTF-8/u);
  assert.doesNotMatch(html, /fetch\(|https?:\/\//iu);
});

test('pH form shows acid/base models and bounded concentration/equilibrium inputs', () => {
  const html = renderGrowthForm('ph-calculator', phCalculatorEnglishCopy);
  for (const mode of ['strong-acid', 'strong-base', 'weak-acid', 'weak-base']) assert.match(html, new RegExp(`value="${mode}"`, 'u'));
  assert.match(html, /name="concentration"[^>]*max="10"/u);
  assert.match(html, /name="equilibriumConstant"[^>]*max="1"/u);
  for (const action of ['example', 'calculate', 'reset', 'copy']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /25 °C/u);
  assert.doesNotMatch(html, /fetch\(|https?:\/\//iu);
});

test('OpenAPI editor exposes local JSON/YAML editing, bounded file input and safe preview controls', () => {
  const html = renderGrowthForm('openapi-editor', copies['openapi-editor']);
  assert.match(html, /id="openapi-document"[^>]*maxlength="300000"/u);
  assert.match(html, /data-openapi-file/u);
  assert.match(html, /\.yaml/u);
  assert.match(html, /option value="json"/u);
  assert.match(html, /option value="yaml"/u);
  assert.match(html, /data-openapi-operations/u);
  assert.match(html, /data-openapi-issues/u);
  assert.match(html, /js-yaml-LICENSE/u);
  for (const action of ['example', 'format', 'validate', 'download', 'copy-report']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('font pairing form has two named font controls, bounded local upload, type sliders and useful actions', () => {
  const html = renderGrowthForm('font-pairing-tool', copies['font-pairing-tool']);
  assert.match(html, /data-font-heading/u);
  assert.match(html, /data-font-body/u);
  assert.match(html, /data-font-files/u);
  assert.match(html, /accept="\.woff,\.woff2,\.ttf,\.otf/u);
  for (const name of ['headingSize', 'bodySize', 'headingWeight', 'bodyWeight', 'lineHeight']) assert.match(html, new RegExp(`name="${name}" type="range"`, 'u'));
  for (const action of ['apply-preset', 'swap', 'copy-css', 'clear-fonts', 'reset']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('Roth vs traditional form states the same pretax budget, input assumptions and IRA limits', () => {
  const html = renderGrowthForm('roth-vs-traditional-calculator', copies['roth-vs-traditional-calculator']);
  for (const name of ['annualContribution', 'currentTaxRate', 'futureTaxRate', 'annualReturn', 'years']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /same pretax budget/u);
  assert.match(html, /publications\/p590b/u);
  assert.match(html, /data-roth-result hidden/u);
  for (const action of ['example', 'compare', 'reset']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('polygon form exposes bounded inputs, all measurement modes and accessible results', () => {
  const html = renderGrowthForm('polygon-calculator', copies['polygon-calculator']);
  assert.match(html, /name="sides" type="number" min="4" max="1000"/u);
  assert.match(html, /value="circumradius"/u);
  assert.match(html, /data-polygon-result hidden/u);
  assert.match(html, /data-polygon-values/u);
  for (const action of ['example', 'calculate', 'reset', 'copy']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('color name finder form provides hex and native picker inputs, explicit results and copy actions', () => {
  const html = renderGrowthForm('color-name-finder', copies['color-name-finder']);
  assert.match(html, /name="hexColor"[^>]*maxlength="7"/u);
  assert.match(html, /name="colorPicker" type="color"/u);
  assert.match(html, /data-action="find-name"/u);
  assert.match(html, /data-action="copy-name"/u);
  assert.match(html, /data-action="copy-hex"/u);
  assert.match(html, /data-exact-match hidden/u);
  assert.match(html, /data-name-results/u);
  assert.match(html, /aria-live="polite"/u);
});

test('photo-to-sketch form exposes local image controls, comparison, cancel and separate PNG export', () => {
  const html = renderGrowthForm('photo-to-sketch', copies['photo-to-sketch']);
  assert.match(html, /type="file" accept="image\/png,image\/jpeg,image\/webp,image\/gif,image\/avif,image\/bmp"/u);
  assert.match(html, /name="intensity" type="range"/u);
  assert.match(html, /name="detail" type="range"/u);
  assert.match(html, /name="compare"/u);
  assert.match(html, /data-sketch-preview/u);
  assert.match(html, /data-action="export"/u);
  assert.match(html, /data-action="cancel"/u);
  assert.match(html, /data-action="reset"/u);
  assert.match(html, /data-export hidden/u);
  assert.match(html, /aria-live="polite"/u);
});

test('schema markup validator form labels pasted JSON-LD and offers example, check, reset and result controls', () => {
  const html = renderGrowthForm('schema-markup-validator', {
    name: 'Schema Markup Validator',
    fields: { markup: 'Paste JSON-LD', accuracyNote: 'Local term checks.', resultSummary: 'Summary', issues: 'Findings', googleNote: 'Not a Google test.' },
    actions: { validate: 'Validate markup', example: 'Load example', copySummary: 'Copy summary', reset: 'Reset' },
    messages: { copied: 'Copied.', copyUnavailable: 'Copy unavailable.' },
  });
  assert.match(html, /name="markup"[^>]*maxlength="300000"/u);
  assert.match(html, /data-action="example"/u);
  assert.match(html, /data-action="validate"/u);
  assert.match(html, /data-action="reset"/u);
  assert.match(html, /data-validation-issues/u);
  assert.match(html, /schema\.org\/docs\/terms\.html/u);
});

test('readability checker labels source language and renders distinct metrics without altering the text', () => {
  const html = renderGrowthForm('readability-checker', copies['readability-checker']);
  assert.match(html, /name="language"/u);
  assert.match(html, /<option value="es">Español<\/option>/u);
  assert.match(html, /name="text"[^>]*maxlength="100000"/u);
  for (const key of ['words', 'sentences', 'characters-no-spaces', 'syllables', 'average-sentence', 'long-words']) assert.match(html, new RegExp(`data-readability-${key}`, 'u'));
  assert.match(html, /data-action="calculate"/u);
  assert.match(html, /data-action="example"/u);
  assert.match(html, /data-action="copy"/u);
  assert.match(html, /aria-live="polite"/u);
});

test('savings goal form exposes both solve modes and an accessible estimate region', () => {
  const html = renderGrowthForm('savings-goal-calculator', copies['savings-goal-calculator']);
  for (const name of ['mode', 'startingBalance', 'targetAmount', 'annualRatePercent', 'months', 'monthlyContribution', 'contributionTiming']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /data-savings-result hidden/u);
  assert.match(html, /name="monthlyContribution"[^>]*disabled(?![^>]*hidden)/u);
  assert.match(html, /data-action="example"/u);
  assert.match(html, /data-action="copy"/u);
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('severance form separates custom assumptions from UK statutory inputs and shows the official source', () => {
  const html = renderGrowthForm('severance-pay-calculator', copies['severance-pay-calculator']);
  for (const name of ['mode', 'weeklyPay', 'yearsOfService', 'weeksPerYear', 'birthDate', 'employmentStartDate', 'redundancyDate']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /name="birthDate"[^>]*disabled/u);
  assert.match(html, /data-severance-result hidden/u);
  assert.match(html, /data-severance-uk-note hidden/u);
  assert.match(html, /href="https:\/\/www\.gov\.uk\/redundancy-your-rights\/redundancy-pay"/u);
  assert.match(html, /<option value="custom">Custom assumptions<\/option>/u);
  assert.match(html, /<option value="uk-statutory">Great Britain statutory estimate<\/option>/u);
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('random team form exposes accessible participant, balance, constraint, seed, copy and CSV controls', () => {
  const html = renderGrowthForm('random-team-generator', copies['random-team-generator']);
  for (const name of ['names', 'teamCount', 'separations', 'seed']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /aria-live="polite" data-status/u);
  assert.match(html, /data-action="generateTeams"/u);
  assert.match(html, /data-action="download"/u);
  assert.match(html, /data-team-seed-output/u);
});

test('mulch form exposes accessible bed geometry, multiple-bed count, units, bags and optional cost', () => {
  const html = renderGrowthForm('mulch-calculator', copies['mulch-calculator']);
  for (const name of ['shape', 'dimensionUnit', 'length', 'width', 'diameter', 'bedCount', 'depth', 'depthUnit', 'bagVolume', 'bagUnit', 'wastePercent', 'pricePerBag', 'currency']) {
    assert.match(html, new RegExp(`name="${name}"`, 'u'));
  }
  assert.match(html, /data-mulch-dimensions="rectangle"/u);
  assert.match(html, /data-mulch-dimensions="circle" hidden/u);
  assert.match(html, /data-action="example"/u);
  assert.match(html, /aria-live="polite" data-status/u);
});

test('wall framing form makes doorway plate breaks an explicit localized choice', () => {
  const html = renderGrowthForm('wall-framing-calculator', copies['wall-framing-calculator']);
  for (const index of [1, 2, 3]) assert.match(html, new RegExp(`name="breakBottomPlate${index}" type="checkbox"`, 'u'));
  assert.match(html, /Opening interrupts bottom plate/u);
});

test('electricity cost form supports four per-appliance schedules and editable rate', () => {
  const html = renderGrowthForm('electricity-cost-calculator', copies['electricity-cost-calculator']);
  assert.match(html, /name="ratePerKwh"/u);
  assert.match(html, /name="billingDays"/u);
  assert.match(html, /name="currency"[^>]+pattern="\[A-Za-z\]\{3\}"/u);
  for (const index of [1, 2, 3, 4]) {
    for (const name of [`power${index}`, `powerUnit${index}`, `quantity${index}`, `hours${index}`, `activeDays${index}`]) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  }
  assert.match(html, /value="kW"/u);
  assert.match(html, /aria-live="polite" data-status/u);
});

test('compost form exposes mass-basis inputs for four materials and an optional moisture target', () => {
  const html = renderGrowthForm('compost-calculator', copies['compost-calculator']);
  assert.match(html, /name="massUnit"/u);
  assert.match(html, /name="targetMoisturePercent"/u);
  for (const index of [1, 2, 3, 4]) {
    for (const name of [`wetMass${index}`, `moisture${index}`, `carbon${index}`, `ratio${index}`]) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  }
  assert.match(html, /Dry carbon/u);
  assert.match(html, /aria-live="polite" data-status/u);
});

test('pond form exposes plan shapes, separate depth inputs and liner overlap', () => {
  const html = renderGrowthForm('pond-volume-calculator', copies['pond-volume-calculator']);
  assert.match(html, /data-pond-shape/u);
  for (const name of ['shape', 'dimensionUnit', 'length', 'width', 'ovalLength', 'ovalWidth', 'diameter', 'averageDepth', 'maximumDepth', 'edgeOverlap', 'fillPercent']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /data-pond-dimensions="circle" hidden/u);
  assert.match(html, /Fill percentage/u);
  assert.match(html, /aria-live="polite" data-status/u);
});

test('fertilizer form separates product-content and user-rate area modes', () => {
  const html = renderGrowthForm('fertilizer-calculator', copies['fertilizer-calculator']);
  assert.match(html, /data-fertilizer-mode/u);
  assert.match(html, /data-fertilizer-input="product"/u);
  assert.match(html, /data-fertilizer-input="area" hidden/u);
  for (const name of ['productMass', 'area', 'areaUnit', 'productRate', 'rateUnit', 'massUnit', 'nitrogenPercent', 'phosphatePercent', 'potashPercent']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /Area and rate/u);
});

test('baluster form exposes maximum-gap and fixed-count spacing modes', () => {
  const html = renderGrowthForm('baluster-spacing-calculator', copies['baluster-spacing-calculator']);
  assert.match(html, /data-baluster-input="max-gap"/u);
  assert.match(html, /data-baluster-input="count" hidden/u);
  for (const name of ['openingWidth', 'balusterWidth', 'unit', 'maximumGap', 'balusterCount']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /Find count from maximum gap/u);
});

test('retaining wall form collects block, joint, base and backfill dimensions', () => {
  const html = renderGrowthForm('retaining-wall-calculator', copies['retaining-wall-calculator']);
  for (const name of ['wallLength', 'wallHeight', 'wallUnit', 'blockLength', 'blockHeight', 'blockDepth', 'blockUnit', 'joint', 'baseWidth', 'baseDepth', 'backfillThickness', 'wastePercent']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /Wall height \(zero for no wall\)/u);
  assert.match(html, /not recommendations/u);
});

test('battery runtime form switches between energy and amp-hour input modes', () => {
  const html = renderGrowthForm('battery-runtime-calculator', copies['battery-runtime-calculator']);
  assert.match(html, /data-battery-input="energy"/u);
  assert.match(html, /data-battery-input="ah" hidden/u);
  for (const name of ['capacityMode', 'capacityEnergy', 'energyUnit', 'capacityAh', 'voltage', 'loadWatts', 'depthOfDischargePercent', 'efficiencyPercent']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /Amp-hours and voltage/u);
});

test('lumber cut list form has one unit, a kerf, accessible results and a multiline cut list', () => {
  const html = renderGrowthForm('lumber-cut-calculator', copies['lumber-cut-calculator']);
  for (const name of ['unit', 'stockLength', 'kerf', 'cutList']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /<textarea[^>]*name="cutList"/u);
  assert.match(html, /Heuristic only/u);
  assert.match(html, /aria-live="polite"/u);
});

test('plant spacing form exposes layout choice, bed geometry and both center spacings', () => {
  const html = renderGrowthForm('plant-spacing-calculator', copies['plant-spacing-calculator']);
  for (const name of ['unit', 'pattern', 'bedLength', 'bedWidth', 'inRowSpacing', 'rowSpacing']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /Staggered triangular/u);
  assert.match(html, /aria-live="polite"/u);
});

test('EV charging form distinguishes battery charge, charger power and optional tariff inputs', () => {
  const html = renderGrowthForm('ev-charging-calculator', copies['ev-charging-calculator']);
  for (const name of ['batteryCapacityKwh', 'startSocPercent', 'targetSocPercent', 'chargerPowerKw', 'efficiencyPercent', 'electricityRatePerKwh', 'currency']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /maxlength="3"/u);
  assert.match(html, /aria-live="polite"/u);
});

test('rainwater form gathers 12 monthly rainfall and demand entries plus catchment and storage assumptions', () => {
  const html = renderGrowthForm('rainwater-harvesting-calculator', copies['rainwater-harvesting-calculator']);
  for (const name of ['areaUnit', 'catchmentArea', 'rainfallUnit', 'rainfallValues', 'runoffPercent', 'tankUnit', 'tankCapacity', 'startingStorage', 'monthlyDemandValues']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.equal((html.match(/rows="12"/gu) ?? []).length, 2);
  assert.match(html, /water may need treatment/u);
});

test('ramp form exposes a user-selected slope, landings and a visible standards disclaimer', () => {
  const html = renderGrowthForm('ramp-calculator', copies['ramp-calculator']);
  for (const name of ['unit', 'rise', 'slopeRatioDenominator', 'landingCount', 'landingDepth']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /check applicable standards/u);
  assert.match(html, /aria-live="polite"/u);
});

test('weight scenario form explains its limits and collects explicit local inputs', () => {
  const html = renderGrowthForm('weight-loss-calculator', copies['weight-loss-calculator']);
  for (const name of ['currentWeight', 'targetWeight', 'unit', 'dailyDeficit']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /7,700 kcal per kg/u);
  assert.match(html, /niddk\.nih\.gov/u);
  assert.match(html, /cdc\.gov/u);
  assert.match(html, /data-action="example"/u);
  assert.match(html, /role="status"/u);
  assert.doesNotMatch(html, /<form[^>]+action=/u);
});

test('HELOC form exposes editable limits, two terms, currency, assumptions and related calculator', () => {
  const html = renderGrowthForm('heloc-calculator', copies['heloc-calculator']);
  for (const name of ['currency', 'creditLimit', 'balance', 'annualAprPercent', 'drawMonths', 'repaymentMonths']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  for (const currency of ['USD', 'CAD', 'AUD', 'GBP', 'EUR']) assert.match(html, new RegExp(`value="${currency}"`, 'u'));
  assert.match(html, /fixed-rate estimate only/u);
  assert.match(html, /data-action="example"/u);
  assert.match(html, /data-action="calculate"/u);
  assert.match(html, /name="balance" type="number" min="0"/u);
  assert.match(html, /loan payment calculator/u);
  assert.doesNotMatch(html, /<form[^>]+action=/u);
});

test('cubic and quartic form labels coefficients and starts with the quartic term disabled', () => {
  const html = renderGrowthForm('cubic-quartic-equation-calculator', copies['cubic-quartic-equation-calculator']);
  for (const name of ['degree', 'a4', 'a3', 'a2', 'a1', 'a0']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /data-quartic-only hidden/u);
  assert.match(html, /name="a4"[^>]+disabled/u);
  assert.match(html, /data-equation-result hidden/u);
  assert.match(html, /data-action="example"/u);
  assert.match(html, /role="status" aria-live="polite"/u);
});

test('complex-number form switches calculation modes and keeps outputs accessible', () => {
  const html = renderGrowthForm('complex-number-calculator', copies['complex-number-calculator']);
  for (const name of ['operation', 'realA', 'imaginaryA', 'realB', 'imaginaryB', 'radius', 'angle', 'angleUnit', 'degree']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /data-complex-b hidden/u);
  assert.match(html, /data-complex-polar hidden/u);
  assert.match(html, /data-complex-degree hidden/u);
  assert.match(html, /data-complex-result hidden/u);
  assert.match(html, /aria-live="polite"/u);
});

test('ideal gas law form leaves exactly one default unknown and exposes unit selectors and bounds', () => {
  const html = renderGrowthForm('ideal-gas-law-calculator', copies['ideal-gas-law-calculator']);
  for (const name of ['pressure', 'volume', 'amount', 'temperature', 'pressureUnit', 'volumeUnit', 'amountUnit', 'temperatureUnit']) assert.match(html, new RegExp(`name="${name}"`));
  assert.match(html, /PV = nRT/u);
  assert.match(html, /value="" required/u);
  assert.match(html, /absolute pressure/u);
});

test('torque form exposes three solve modes, accessible actions, directions, and formula limits', () => {
  const html = renderGrowthForm('torque-calculator', copies['torque-calculator']);
  for (const name of ['mode', 'force', 'forceUnit', 'arm', 'distanceUnit', 'angle', 'torque', 'torqueUnit', 'direction']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /value="solve-torque"/u);
  assert.match(html, /data-torque-field="torque"/u);
  assert.match(html, /role="status" aria-live="polite"/u);
  assert.match(html, /τ = r × F × sin/u);
});

test('torque form uses the localized action label instead of a machine-translated ambiguous Spanish term', () => {
  const html = renderGrowthForm('torque-calculator', torqueCalculatorCopies.es);
  assert.match(html, /data-action="calculate"[^>]*>Calcular torque<\/button>/u);
  assert.doesNotMatch(html, />Calcular par<\/button>/u);
});

test('beam deflection form includes classic support/load cases, explicit units and engineering boundaries', () => {
  const html = renderGrowthForm('beam-deflection-calculator', copies['beam-deflection-calculator']);
  for (const name of ['support', 'loadCase', 'span', 'spanUnit', 'load', 'forceUnit', 'modulus', 'modulusUnit', 'inertia', 'inertiaUnit']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /value="simply-supported"/u);
  assert.match(html, /value="cantilever"/u);
  assert.match(html, /Euler–Bernoulli/u);
  assert.match(html, /University of Illinois/u);
  assert.match(html, /role="status" aria-live="polite"/u);
  assert.match(html, /data-result hidden aria-live="polite"/u);
  assert.doesNotMatch(html, /<form[^>]+action=/u);
});

test('pilot form renderer blocks missing translated fields or actions instead of silently falling back', () => {
  assert.throws(() => renderGrowthForm('molar-mass-calculator', { actions, fields: {} }), /localized form fields/);
  assert.throws(() => renderGrowthForm('mancala', { name: 'Mancala', fields: copies.mancala.fields, actions: {} }), /localized form actions/);
  assert.throws(() => renderGrowthForm('unknown', { actions, fields: {} }), /localized form fields/);
});

test('RTF converter form accepts one local RTF file and exposes copy, text download and print-to-PDF actions', () => {
  const html = renderGrowthForm('rtf-converter', {
    fields: { file: 'Choose RTF file', limitNote: '5 MiB local limit.', accuracyNote: 'Text extraction only.', output: 'Extracted text' },
    actions: { convert: 'Convert to text', reset: 'Clear', copy: 'Copy', download: 'Download text', print: 'Print or save as PDF', result: 'Converted text' },
  });
  assert.match(html, /type="file" accept="\.rtf,application\/rtf,text\/rtf"/u);
  assert.match(html, /name="output"[^>]+readonly/u);
  for (const action of ['convert', 'reset', 'copy', 'download', 'print']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
  assert.doesNotMatch(html, /<form[^>]+action=/u);
});

test('CSV-to-PDF form labels local file, separator, encoding and print settings', () => {
  const html = renderGrowthForm('csv-to-pdf', {
    fields: { file: 'Choose CSV file', separator: 'Separator', auto: 'Detect', comma: 'Comma', semicolon: 'Semicolon', tab: 'Tab', pipe: 'Pipe', encoding: 'Encoding', hasHeader: 'First row is headings', pageSize: 'Paper', orientation: 'Orientation', landscape: 'Landscape', portrait: 'Portrait', margin: 'Margins', narrow: 'Narrow', normal: 'Normal', accuracyNote: 'Plain data only.', limitNote: '5 MiB local limit.', resultCount: 'rows', columnCount: 'columns', previewLimit: 'First', tableLabel: 'CSV preview' },
    actions: { ...actions, preview: 'Preview table', example: 'Load example', print: 'Print or save as PDF', result: 'Printable table' },
  });
  assert.match(html, /type="file" accept="\.csv,text\/csv,text\/plain"/u);
  assert.match(html, /name="encoding"/u);
  assert.match(html, /name="hasHeader" checked/u);
  assert.match(html, /data-csv-preview/u);
  for (const action of ['preview', 'example', 'reset', 'print']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
  assert.doesNotMatch(html, /<form[^>]+action=/u);
});

test('round-robin form exposes bounded participant input, league options, accessible standings and exports', () => {
  const html = renderGrowthForm('round-robin-tournament-generator', copies['round-robin-tournament-generator']);
  assert.match(html, /name="participants" rows="8" maxlength="1600" required/u);
  assert.match(html, /name="doubleRound"/u);
  assert.match(html, /name="shuffle"/u);
  assert.match(html, /data-round-robin-standings/u);
  assert.match(html, /data-round-robin-rounds/u);
  assert.match(html, /<table data-round-robin-standings><thead><\/thead><tbody><\/tbody><\/table>/u);
  for (const action of ['generate', 'example', 'reset', 'downloadCsv', 'print']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
  assert.doesNotMatch(html, /<form[^>]+action=/u);
});

test('work-order form collects service details and exposes local preview, CSV and print controls', () => {
  const html = renderGrowthForm('work-order-generator', {
    fields: {
      workOrderNumber: 'Work order number', issuedDate: 'Issue date', scheduledDate: 'Scheduled date', completedDate: 'Completion date', status: 'Job status',
      customer: 'Customer', contact: 'Contact', location: 'Service location', assignedTo: 'Assigned to', title: 'Job summary', details: 'Work details',
      tasks: 'Checklist', tasksHint: 'One task per line.', materials: 'Materials', materialsHint: 'Enter description, quantity and unit.', materialsFormat: 'Description | quantity | unit',
      labor: 'Labor activities', laborHint: 'Enter activity and hours.', laborFormat: 'Activity | hours', notes: 'Notes', limitNote: 'Up to 40 entries per section.', privacyNote: 'Runs locally.',
      previewTitle: 'Work order preview', checklist: 'Checklist', materialsLabel: 'Materials', laborLabel: 'Labor', description: 'Description',
      quantity: 'Quantity', unit: 'Unit', activity: 'Activity', hours: 'Hours', totalLaborHours: 'Total hours',
    },
    actions: { ...actions, generate: 'Create work order', downloadCsv: 'Download CSV', print: 'Print or save as PDF', open: 'Open', inProgress: 'In progress', completed: 'Completed' },
    messages: { ready: 'Ready.', createFirst: 'Create one first.', printBlocked: 'Allow the print window.', exampleLoaded: 'Example loaded.' },
  });
  for (const name of ['issuedDate', 'scheduledDate', 'completedDate', 'status', 'customer', 'location', 'assignedTo', 'tasks', 'materials', 'labor']) assert.match(html, new RegExp(`name="${name}"`, 'u'));
  assert.match(html, /<option value="in-progress">In progress<\/option>/u);
  assert.match(html, /data-work-order-preview/u);
  for (const action of ['generate', 'example', 'reset', 'downloadCsv', 'print']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  assert.match(html, /role="status" aria-live="polite"/u);
  assert.doesNotMatch(html, /<form[^>]+action=/u);
});
