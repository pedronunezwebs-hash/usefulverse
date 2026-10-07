import assert from 'node:assert/strict';
import test from 'node:test';
import { growthPilotTools } from './catalog.mjs';
import { renderGrowthForm } from './forms.mjs';

const actions = {
  calculate: 'Calculate', generate: 'Generate', reset: 'Reset', example: 'Load example', newGame: 'New game', rules: 'Rules', reveal: 'Reveal', next: 'Next', copy: 'Copy', download: 'Download', result: 'Result', rectangle: 'Rectangle', circle: 'Circle', triangle: 'Triangle', meters: 'Meters', centimeters: 'Centimeters', millimeters: 'Millimeters', feet: 'Feet', inches: 'Inches', kgPerCubicMeter: 'Kilograms per cubic meter', lbPerCubicFoot: 'Pounds per cubic foot', kilograms: 'Kilograms', pounds: 'Pounds', computer: 'Play computer', twoPlayers: 'Two players', privacyNote: 'Assignments are visible on this device.', kmh: 'Kilometres per hour (km/h)', mph: 'Miles per hour (mph)', withCeiling: 'Walls and ceiling', wallsOnly: 'Walls only', productionMode: 'Estimate array output', sizingMode: 'Size for daily use', years: 'years',
};
const messages = { copied: 'Copied.', copyUnavailable: 'Copy is unavailable.', calculated: 'Calculation complete.', sameSize: 'These tire sizes are the same.', checkInputs: 'Check your entries.', diameter: 'Nominal outside diameter', sidewall: 'Sidewall height', circumference: 'Nominal circumference', revolutions: 'Revolutions per kilometre', diameterDifference: 'Diameter difference', diameterChange: 'Diameter change', groundClearance: 'Estimated ground-clearance change', actualSpeed: 'Estimated actual speed', area: 'Area', volume: 'Volume', liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons', averageDepth: 'Average depth', orderVolume: 'Order volume', estimatedWeight: 'Estimated weight', bagsToBuy: 'Bags to buy', invalidFormula: 'Check the chemical formula.', atomCount: 'atoms', molarMass: 'Molar mass', estimateOnly: 'Estimate only; compare lender offers.', currentPayment: 'Current monthly payment', newPayment: 'New monthly payment', paymentDifference: 'Monthly payment difference', currentTotal: 'Current remaining total', newTotal: 'New loan total', estimatedDifference: 'Estimated savings (negative means higher cost)', breakEven: 'Break-even', noBreakEven: 'No break-even within the compared terms', monthCount: '{count} months', privatePair: '{giver} gives to {recipient}', allRevealed: 'All pairs revealed.', drawReady: 'Draw ready. Reveal one person at a time.', checkNamesAndRules: 'Check the names and exclusions.', downloaded: 'Downloaded.', riserHeight: 'Riser height', treadCount: 'Tread count', totalRun: 'Total run', angle: 'Angle', stringerLength: 'Stringer length', diagram: 'Stair side view', pit: 'Pit', seeds: 'seeds', playerOne: 'Player one', playerTwo: 'Player two', playerOneWins: 'Player one wins.', playerTwoWins: 'Player two wins.', tie: 'Tie game.', gameOver: 'Game over.', turn: '{player} to move.', angleDegrees: 'Angle', angleRadians: 'Angle in radians', slopePercent: 'Slope', pitch: 'Rise per 12 run', rafterLength: 'Rafter length', wallArea: 'Net wall area', ceilingArea: 'Ceiling area', totalArea: 'Total surface area', boardCount: 'Whole boards', boardCoverage: 'Board coverage', estimatedScrews: 'Estimated screws', jointSeams: 'Joint seams', estimatedCost: 'Estimated cost', costNotEntered: 'Enter price.', costEstimateNote: 'Currency is not assumed.' };
const copies = {
  'image-sharpener': { name: 'Image sharpener', actions: { ...actions, load: 'Choose image', export: 'Prepare download', download: 'Download', original: 'Show original', sharpened: 'Sharpened preview', png: 'PNG', jpeg: 'JPEG' }, messages: { ...messages, unsupportedImage: 'Unsupported image.', imageTooLarge: 'Image too large.', imageReady: 'Image ready.', selectImage: 'Choose an image first.', exporting: 'Sharpening…', exportFailed: 'Export failed.', exportReady: 'Image ready.' }, fields: { imageFile: 'Choose image', amount: 'Strength', radius: 'Radius', threshold: 'Threshold', compare: 'Show original', accuracyNote: 'Processed locally; 8 megapixel limit.', previewHint: 'Preview is reduced.', format: 'Format', relatedRedactor: 'Redact private details.', relatedCropper: 'Crop the image.' } },
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
};

test('all pilot forms render semantic labels, explicit actions and localized strings', () => {
  for (const tool of growthPilotTools) {
    const html = renderGrowthForm(tool.id, copies[tool.id]);
    assert.ok(html.length > 100, `${tool.id} form should render`);
    assert.match(html, /aria-live="polite"/u, `${tool.id} should announce state/results`);
    assert.doesNotMatch(html, /\son[a-z]+=/iu, `${tool.id} must not use inline event handlers`);
    assert.doesNotMatch(html, /undefined|null/u, `${tool.id} must not emit missing values`);
  }
  assert.match(renderGrowthForm('gravel-calculator', copies['gravel-calculator']), /for="length"/u);
  assert.doesNotMatch(renderGrowthForm('gravel-calculator', copies['gravel-calculator']), /name="area"/u);
  assert.match(renderGrowthForm('molar-mass-calculator', copies['molar-mass-calculator']), /maxlength="160"/u);
  assert.match(renderGrowthForm('secret-santa-generator', copies['secret-santa-generator']), /data-reveal-name/u);
  assert.match(renderGrowthForm('mancala', copies.mancala), /data-board/u);
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
  assert.match(renderGrowthForm('secret-santa-generator', copies['secret-santa-generator']), /type="submit" data-action="generate"/u);
  const stairs = renderGrowthForm('stair-calculator', copies['stair-calculator']);
  assert.match(stairs, /name="riserCount" type="number" min="2" max="100" step="1"/u);
  assert.match(stairs, /data-stair-diagram/u);
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

test('pilot form renderer blocks missing translated fields or actions instead of silently falling back', () => {
  assert.throws(() => renderGrowthForm('molar-mass-calculator', { actions, fields: {} }), /localized form fields/);
  assert.throws(() => renderGrowthForm('mancala', { name: 'Mancala', fields: copies.mancala.fields, actions: {} }), /localized form actions/);
  assert.throws(() => renderGrowthForm('unknown', { actions, fields: {} }), /localized form fields/);
});
