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
