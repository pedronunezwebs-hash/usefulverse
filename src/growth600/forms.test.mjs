import assert from 'node:assert/strict';
import test from 'node:test';
import { growthPilotTools } from './catalog.mjs';
import { renderGrowthForm } from './forms.mjs';

const actions = {
  calculate: 'Calculate', generate: 'Generate', reset: 'Reset', example: 'Load example', newGame: 'New game', rules: 'Rules', reveal: 'Reveal', next: 'Next', copy: 'Copy', download: 'Download', result: 'Result', rectangle: 'Rectangle', circle: 'Circle', triangle: 'Triangle', meters: 'Meters', centimeters: 'Centimeters', millimeters: 'Millimeters', feet: 'Feet', inches: 'Inches', kgPerCubicMeter: 'Kilograms per cubic meter', lbPerCubicFoot: 'Pounds per cubic foot', kilograms: 'Kilograms', pounds: 'Pounds', computer: 'Play computer', twoPlayers: 'Two players', privacyNote: 'Assignments are visible on this device.', kmh: 'Kilometres per hour (km/h)', mph: 'Miles per hour (mph)', withCeiling: 'Walls and ceiling', wallsOnly: 'Walls only',
};
const messages = { copied: 'Copied.', copyUnavailable: 'Copy is unavailable.', calculated: 'Calculation complete.', sameSize: 'These tire sizes are the same.', checkInputs: 'Check your entries.', diameter: 'Nominal outside diameter', sidewall: 'Sidewall height', circumference: 'Nominal circumference', revolutions: 'Revolutions per kilometre', diameterDifference: 'Diameter difference', diameterChange: 'Diameter change', groundClearance: 'Estimated ground-clearance change', actualSpeed: 'Estimated actual speed', area: 'Area', volume: 'Volume', liters: 'Litres', usGallons: 'US gallons', imperialGallons: 'Imperial gallons', averageDepth: 'Average depth', orderVolume: 'Order volume', estimatedWeight: 'Estimated weight', bagsToBuy: 'Bags to buy', invalidFormula: 'Check the chemical formula.', atomCount: 'atoms', molarMass: 'Molar mass', estimateOnly: 'Estimate only; compare lender offers.', currentPayment: 'Current monthly payment', newPayment: 'New monthly payment', paymentDifference: 'Monthly payment difference', currentTotal: 'Current remaining total', newTotal: 'New loan total', estimatedDifference: 'Estimated savings (negative means higher cost)', breakEven: 'Break-even', noBreakEven: 'No break-even within the compared terms', monthCount: '{count} months', privatePair: '{giver} gives to {recipient}', allRevealed: 'All pairs revealed.', drawReady: 'Draw ready. Reveal one person at a time.', checkNamesAndRules: 'Check the names and exclusions.', downloaded: 'Downloaded.', riserHeight: 'Riser height', treadCount: 'Tread count', totalRun: 'Total run', angle: 'Angle', stringerLength: 'Stringer length', diagram: 'Stair side view', pit: 'Pit', seeds: 'seeds', playerOne: 'Player one', playerTwo: 'Player two', playerOneWins: 'Player one wins.', playerTwoWins: 'Player two wins.', tie: 'Tie game.', gameOver: 'Game over.', turn: '{player} to move.', angleDegrees: 'Angle', angleRadians: 'Angle in radians', slopePercent: 'Slope', pitch: 'Rise per 12 run', rafterLength: 'Rafter length', wallArea: 'Net wall area', ceilingArea: 'Ceiling area', totalArea: 'Total surface area', boardCount: 'Whole boards', boardCoverage: 'Board coverage', estimatedScrews: 'Estimated screws', jointSeams: 'Joint seams', estimatedCost: 'Estimated cost', costNotEntered: 'Enter price.', costEstimateNote: 'Currency is not assumed.' };
const copies = {
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
  assert.match(renderGrowthForm('gravel-calculator', copies['gravel-calculator']), /type="submit" data-action="calculate"/u);
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
  const payload = renderGrowthForm('secret-santa-generator', { ...copies['secret-santa-generator'], description: '</script><script>alert(1)</script>' });
  assert.doesNotMatch(payload, /<script>alert\(1\)<\/script>/u);
});

test('pilot form renderer blocks missing translated fields or actions instead of silently falling back', () => {
  assert.throws(() => renderGrowthForm('molar-mass-calculator', { actions, fields: {} }), /localized form fields/);
  assert.throws(() => renderGrowthForm('mancala', { name: 'Mancala', fields: copies.mancala.fields, actions: {} }), /localized form actions/);
  assert.throws(() => renderGrowthForm('unknown', { actions, fields: {} }), /localized form fields/);
});
