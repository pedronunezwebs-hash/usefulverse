import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCircularArea, calculateGravel, calculateRectangularArea, calculateTriangularArea } from './gravel-calculator/logic.mjs';
import { calculateMolarMass, parseChemicalFormula } from './molar-mass-calculator/logic.mjs';
import { compareAutoLoanRefinance, monthlyLoanPayment } from './auto-loan-refinance-calculator/logic.mjs';
import { assignSecretSanta } from './secret-santa-generator/logic.mjs';
import { compareMetricTireSizes, parseMetricTireSize } from './tire-size-calculator/logic.mjs';
import { calculateStairGeometry } from './stair-calculator/logic.mjs';
import { calculateAsphalt } from './asphalt-calculator/logic.mjs';
import { calculateSoil } from './soil-calculator/logic.mjs';
import { calculatePoolVolume } from './pool-volume-calculator/logic.mjs';
import { calculateRoofPitch } from './roof-pitch-calculator/logic.mjs';
import { calculateDrywall } from './drywall-calculator/logic.mjs';
import { calculateRoofing } from './roofing-calculator/logic.mjs';
import { calculateDeck } from './deck-calculator/logic.mjs';
import { chooseMancalaMove, createMancalaGame, legalMancalaPits, playMancalaMove } from './mancala/logic.mjs';

test('gravel calculator converts area and depth into volume, waste, weight and bags', () => {
  const result = calculateGravel({ areaM2: 10, depthM: 0.1, densityKgM3: 1600, wastePercent: 5, bagKg: 20 });
  assert.equal(result.volumeM3, 1);
  assert.equal(result.orderVolumeM3, 1.05);
  assert.equal(result.weightKg, 1680);
  assert.equal(result.bags, 84);
  assert.equal(calculateGravel({ areaM2: 10, depthM: 0.1 }).volumeM3, 1);
  assert.equal(calculateRectangularArea(4, 3), 12);
  assert.equal(calculateCircularArea(2), Math.PI);
  assert.equal(calculateTriangularArea(4, 3), 6);
  assert.throws(() => calculateGravel({ areaM2: 0, depthM: 1 }), /Area/);
  assert.throws(() => calculateGravel({ areaM2: 1, depthM: 1, wastePercent: 101 }), /Waste/);
});

test('soil calculator estimates raised-bed and pot fill volume and bag count', () => {
  const cube = calculateSoil({ shape: 'rectangle', length: 1, width: 1, depth: 1 });
  assert.equal(cube.volumePerContainerM3, 1);
  assert.equal(cube.totalVolumeM3, 1);
  assert.equal(cube.orderVolumeM3, 1);
  assert.equal(cube.bagsToBuy, null);
  const beds = calculateSoil({ shape: 'rectangle', length: 2, width: 1, depth: 0.3, containerCount: 2, wastePercent: 10, bagVolume: 40, bagUnit: 'l' });
  assert.equal(beds.volumePerContainerM3, 0.6);
  assert.equal(beds.totalVolumeM3, 1.2);
  assert.equal(beds.orderVolumeM3, 1.32);
  assert.equal(beds.bagsToBuy, 33);
  const roundPot = calculateSoil({ shape: 'circle', diameter: 40, depth: 30, dimensionUnit: 'cm', bagVolume: 1, bagUnit: 'ft3' });
  assert.ok(Math.abs(roundPot.volumePerContainerM3 - Math.PI * 0.2 ** 2 * 0.3) < 1e-12);
  assert.equal(roundPot.bagsToBuy, 2);
  assert.throws(() => calculateSoil({ shape: 'triangle', length: 1, width: 1, depth: 1 }), /shape/u);
  assert.throws(() => calculateSoil({ shape: 'rectangle', length: 1, width: 1, depth: 1, containerCount: 1.5 }), /container count/iu);
  assert.throws(() => calculateSoil({ shape: 'rectangle', length: 1, width: 1, depth: 1, wastePercent: 51 }), /waste/iu);
});

test('pool volume calculator handles shapes, sloped bottoms and gallon standards', () => {
  const rectangular = calculatePoolVolume({ shape: 'rectangle', length: 2, width: 3, shallowDepth: 1, dimensionUnit: 'm' });
  assert.equal(rectangular.volumeM3, 6);
  assert.equal(rectangular.liters, 6000);
  assert.equal(Math.round(rectangular.usGallons), 1585);
  assert.equal(Math.round(rectangular.imperialGallons), 1320);
  const slope = calculatePoolVolume({ shape: 'rectangle', length: 2, width: 3, floor: 'sloped', shallowDepth: 1, deepDepth: 2, dimensionUnit: 'm' });
  assert.equal(slope.averageDepthM, 1.5);
  assert.equal(slope.liters, 9000);
  const circle = calculatePoolVolume({ shape: 'circle', diameter: 20, shallowDepth: 5, dimensionUnit: 'ft' });
  assert.ok(Math.abs(circle.volumeM3 - Math.PI * 10 ** 2 * 5 * 0.3048 ** 3) < 1e-12);
  const oval = calculatePoolVolume({ shape: 'oval', length: 8, width: 4, shallowDepth: 1, deepDepth: 2, floor: 'sloped' });
  assert.ok(Math.abs(oval.volumeM3 - Math.PI * 8 * 4 / 4 * 1.5) < 1e-12);
  assert.throws(() => calculatePoolVolume({ shape: 'rectangle', length: 2, width: 3, shallowDepth: 1, floor: 'sloped', deepDepth: 0 }), /Deep depth/u);
  assert.throws(() => calculatePoolVolume({ shape: 'square', shallowDepth: 1 }), /shape/u);
});

test('roof pitch calculator reports pitch, slope, angles and optional overhang length', () => {
  const equal = calculateRoofPitch({ rise: 3, run: 3, unit: 'm' });
  assert.equal(equal.pitchRisePer12, 12);
  assert.equal(equal.slopePercent, 100);
  assert.equal(equal.angleDegrees, 45);
  assert.ok(Math.abs(equal.angleRadians - Math.PI / 4) < 1e-12);
  assert.ok(Math.abs(equal.rafterLengthM - Math.sqrt(18)) < 1e-12);
  const overhang = calculateRoofPitch({ rise: 4, run: 12, overhang: 1, unit: 'ft' });
  assert.equal(overhang.pitchRisePer12, 4);
  assert.ok(Math.abs(overhang.slopePercent - 100 / 3) < 1e-12);
  assert.ok(Math.abs(overhang.rafterLengthM - Math.hypot(4, 13) * 0.3048) < 1e-12);
  assert.throws(() => calculateRoofPitch({ rise: 0, run: 10 }), /Rise/u);
  assert.throws(() => calculateRoofPitch({ rise: 3, run: 0 }), /Run/u);
  assert.throws(() => calculateRoofPitch({ rise: 3, run: 3, unit: 'yd' }), /unit/u);
});

test('drywall calculator estimates sheet coverage, seams, screws and optional cost', () => {
  const room = calculateDrywall({ roomLength: 4, roomWidth: 3, wallHeight: 2.5, boardWidth: 1.2, boardHeight: 2.4, wastePercent: 0 });
  assert.equal(room.grossWallAreaPerRoomM2, 35);
  assert.equal(room.wallAreaM2, 35);
  assert.equal(room.ceilingAreaM2, 12);
  assert.equal(room.totalAreaM2, 47);
  assert.equal(room.boards, 17);
  assert.ok(room.boardCoverageM2 >= room.totalAreaM2);
  assert.equal(room.estimatedScrews, 544);
  assert.equal(room.approximateJointSeamLengthM, 48);
  assert.equal(room.estimatedCost, null);

  const multiRoom = calculateDrywall({ roomLength: 4, roomWidth: 3, wallHeight: 2.5, openingArea: 1.5, roomCount: 2, includeCeiling: false, wastePercent: 0, pricePerBoard: 12 });
  assert.equal(multiRoom.wallAreaM2, 67);
  assert.equal(multiRoom.ceilingAreaM2, 0);
  assert.equal(multiRoom.boards, 24);
  assert.equal(multiRoom.estimatedScrews, 768);
  assert.equal(multiRoom.estimatedCost, 288);
  const imperial = calculateDrywall({ roomLength: 10, roomWidth: 8, wallHeight: 8, openingArea: 20, includeCeiling: false, boardWidth: 4, boardHeight: 8, unit: 'ft', wastePercent: 0 });
  assert.ok(Math.abs(imperial.totalAreaM2 / 0.3048 ** 2 - 268) < 1e-10);
  assert.equal(imperial.boards, 9);
  assert.ok(calculateDrywall({ roomLength: 4, roomWidth: 3, wallHeight: 2.5, wastePercent: 10 }).boards > room.boards);
  assert.throws(() => calculateDrywall({ roomLength: 4, roomWidth: 3, wallHeight: 2.5, openingArea: 36 }), /Opening area/u);
  assert.throws(() => calculateDrywall({ roomLength: 4, roomWidth: 3, wallHeight: 2.5, roomCount: 1.5 }), /whole number/u);
  assert.throws(() => calculateDrywall({ roomLength: 4, roomWidth: 3, wallHeight: 2.5, screwsPerBoard: 32.5 }), /whole number/u);
  assert.throws(() => calculateDrywall({ roomLength: 4, roomWidth: 3, wallHeight: 2.5, boardWidth: 0 }), /Board width/u);
});

test('roofing calculator increases projected area by pitch and rounds material bundles up', () => {
  const result = calculateRoofing({ projectedArea: 1200, areaUnit: 'ft2', rise: 6, run: 12, pitchUnit: 'in', wastePercent: 10, bundlesPerSquare: 3, pricePerBundle: 36 });
  assert.ok(result.roofAreaM2 / (0.3048 ** 2) > 1200);
  assert.ok(Math.abs(result.roofAreaM2 / (0.3048 ** 2) - 1341.6407865) < 1e-6);
  assert.ok(Math.abs(result.orderAreaM2 / (0.3048 ** 2) - 1475.8048652) < 1e-6);
  assert.equal(Number(result.roofingSquares.toFixed(3)), 14.758);
  assert.equal(result.bundles, 45);
  assert.equal(result.estimatedCost, 1620);
  const flat = calculateRoofing({ projectedArea: 100, areaUnit: 'm2', rise: 0, run: 12, pitchUnit: 'in', wastePercent: 0, bundlesPerSquare: 3 });
  assert.equal(flat.roofAreaM2, 100);
  assert.equal(flat.bundles, 33);
  assert.throws(() => calculateRoofing({ projectedArea: 100, areaUnit: 'm2', rise: 6, run: 0, pitchUnit: 'in' }), /Run/u);
  assert.throws(() => calculateRoofing({ projectedArea: 100, areaUnit: 'acre', rise: 6, run: 12, pitchUnit: 'in' }), /square metres/u);
  assert.throws(() => calculateRoofing({ projectedArea: 100, areaUnit: 'm2', rise: 6, run: 12, pitchUnit: 'yd' }), /pitch unit/u);
  assert.throws(() => calculateRoofing({ projectedArea: 100, areaUnit: 'm2', rise: 6, run: 12, pitchUnit: 'in', wastePercent: 31 }), /Waste/u);
});

test('deck calculator counts board rows, stock length, supported-run estimates and fasteners', () => {
  const deck = calculateDeck({ length: 16, width: 12, unit: 'ft', boardWidth: 5.5, boardUnit: 'in', gap: 0.25, stockBoardLength: 16, joistSpacing: 16, wastePercent: 10, fastenersPerIntersection: 2, pricePerBoard: 20 });
  assert.equal(deck.rows, 26);
  assert.ok(Math.abs(deck.coveredWidthM / 0.3048 - 12.4375) < 1e-10);
  assert.equal(deck.boards, 29);
  assert.equal(deck.piecesPerRow, 1);
  assert.equal(deck.supportLines, 13);
  assert.equal(deck.estimatedFasteners, 676);
  assert.equal(deck.totalJoints, 0);
  assert.equal(deck.estimatedCost, 580);
  const shorterStock = calculateDeck({ length: 16, width: 12, unit: 'ft', boardWidth: 5.5, boardUnit: 'in', gap: 0.25, stockBoardLength: 8, joistSpacing: 16, wastePercent: 0, fastenersPerIntersection: 2 });
  assert.equal(shorterStock.jointsPerRow, 1);
  assert.equal(shorterStock.totalJoints, 26);
  assert.equal(shorterStock.boards, 52);
  const conservativeCuts = calculateDeck({ length: 15, width: 12, unit: 'ft', boardWidth: 5.5, boardUnit: 'in', gap: 0.25, stockBoardLength: 8, joistSpacing: 16, wastePercent: 0, fastenersPerIntersection: 2 });
  assert.equal(conservativeCuts.boards, 52);
  assert.ok(conservativeCuts.boards > Math.ceil(conservativeCuts.orderLinearMetres / (8 * 0.3048)), 'without a cut map, short offcuts are not assumed reusable');
  const metric = calculateDeck({ length: 4, width: 3, unit: 'm', boardWidth: 0.14, gap: 0.006, stockBoardLength: 4, joistSpacing: 0.4, wastePercent: 0, fastenersPerIntersection: 2 });
  assert.equal(metric.rows, 21);
  assert.equal(metric.supportLines, 11);
  assert.equal(metric.estimatedFasteners, 462);
  assert.throws(() => calculateDeck({ length: 4, width: 3, unit: 'yard', boardWidth: 0.14, gap: 0, stockBoardLength: 4, joistSpacing: 0.4 }), /supported length unit/u);
  assert.throws(() => calculateDeck({ length: 4, width: 3, unit: 'm', boardWidth: 0, stockBoardLength: 4, joistSpacing: 0.4 }), /Board width/u);
  assert.throws(() => calculateDeck({ length: 4, width: 3, unit: 'm', boardWidth: 0.14, gap: 0, stockBoardLength: 4, joistSpacing: 0.4, fastenersPerIntersection: 1.5 }), /whole number/u);
});

test('molar-mass parser handles formulas, nested groups and supported isotopes', () => {
  assert.equal(Number(calculateMolarMass('H2O').molarMass.toFixed(3)), 18.015);
  assert.equal(Number(calculateMolarMass('Ca(OH)2').molarMass.toFixed(3)), 74.092);
  assert.deepEqual(parseChemicalFormula('Al2(SO4)3'), { Al: 2, S: 3, O: 12 });
  assert.equal(Number(calculateMolarMass('CuSO4·5H2O').molarMass.toFixed(3)), 249.677);
  assert.equal(Number(calculateMolarMass('{13C}H4').molarMass.toFixed(3)), 17.035);
  assert.throws(() => calculateMolarMass('Xx2'), /not in the supported list/);
  assert.throws(() => calculateMolarMass('Ca(OH2'), /Missing/);
  assert.throws(() => calculateMolarMass('()'), /empty/);
  assert.throws(() => calculateMolarMass('C0'), /Formula counts/);
  assert.throws(() => calculateMolarMass('(H1000000)1000000'), /cannot exceed/u);
  assert.throws(() => calculateMolarMass(`${'('.repeat(33)}H${')'.repeat(33)}`), /nested more than 32 levels/u);
});

test('loan comparison handles zero APR, zero fees and a fee-only payment change', () => {
  assert.equal(monthlyLoanPayment(1200, 0, 12), 100);
  const comparison = compareAutoLoanRefinance({ balance: 1200, currentApr: 0, currentMonths: 12, newApr: 0, newMonths: 12, fees: 120, feeTreatment: 'upfront' });
  assert.equal(comparison.currentPayment, 100);
  assert.equal(comparison.refinancePayment, 100);
  assert.equal(comparison.estimatedSavings, -120);
  assert.equal(comparison.breakEvenMonths, null);
  const refinanceWins = compareAutoLoanRefinance({ balance: 12000, currentApr: 12, currentMonths: 36, newApr: 4, newMonths: 36, fees: 100, feeTreatment: 'upfront' });
  assert.ok(refinanceWins.estimatedSavings > 0);
  assert.ok(refinanceWins.breakEvenMonths > 0 && refinanceWins.breakEvenMonths <= 36);
  const noFee = compareAutoLoanRefinance({ balance: 1200, currentApr: 0, currentMonths: 12, newApr: 0, newMonths: 12 });
  assert.equal(noFee.estimatedSavings, 0);
  assert.throws(() => compareAutoLoanRefinance({ balance: 0, currentApr: 0, currentMonths: 1, newApr: 0, newMonths: 1 }), /balance/);
  assert.throws(() => monthlyLoanPayment(100, 4, 0), /Term/);
});

test('Secret Santa generates a complete derangement, respects exclusions and detects impossible cases', () => {
  const random = () => 0.31;
  const pairs = assignSecretSanta(['Ana', 'Ben', 'Cleo', 'Dan'], { Ana: ['Ben'] }, random);
  assert.equal(pairs.length, 4);
  assert.equal(new Set(pairs.map(({ recipient }) => recipient)).size, 4);
  for (const { giver, recipient } of pairs) assert.notEqual(giver, recipient);
  assert.notEqual(pairs.find(({ giver }) => giver === 'Ana').recipient, 'Ben');
  assert.throws(() => assignSecretSanta(['Ana', 'ana']), /unique/);
  assert.throws(() => assignSecretSanta(['Ana', 'Ben'], { Ana: ['Ben'] }), /No valid/);
  assert.throws(() => assignSecretSanta(['Ana']), /between 2 and 30/);
});

test('Secret Santa stays valid across varied random draws and produces different valid rounds', () => {
  const seeded = (seed) => () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
  const names = ['Ana', 'Ben', 'Cleo', 'Dan', 'Eli', 'Fatima'];
  const first = assignSecretSanta(names, {}, seeded(11));
  const second = assignSecretSanta(names, {}, seeded(29));
  assert.notDeepEqual(first, second);
  const integerRandom = assignSecretSanta(names, {}, (limit) => limit - 1);
  assert.equal(integerRandom.length, names.length);
  assert.ok(integerRandom.every(({ giver, recipient }) => giver !== recipient));
  for (let seed = 1; seed <= 40; seed += 1) {
    const pairs = assignSecretSanta(names, {}, seeded(seed));
    assert.equal(new Set(pairs.map(({ recipient }) => recipient)).size, names.length);
    assert.ok(pairs.every(({ giver, recipient }) => giver !== recipient));
  }
});

test('Mancala conserves seeds and implements extra turns, captures, endings and legal moves', () => {
  const initial = createMancalaGame();
  assert.equal(initial.board.reduce((sum, value) => sum + value, 0), 48);
  const extraTurn = playMancalaMove(initial, 2);
  assert.equal(extraTurn.extraTurn, true);
  assert.equal(extraTurn.game.currentPlayer, 0);
  assert.equal(extraTurn.game.board.reduce((sum, value) => sum + value, 0), 48);

  const capturePosition = { ...initial, board: [0, 0, 1, 0, 0, 0, 20, 0, 0, 5, 0, 0, 0, 22] };
  const capture = playMancalaMove(capturePosition, 2);
  assert.equal(capture.captured, 6);
  assert.equal(capture.game.board[6], 26);
  assert.equal(capture.game.board.reduce((sum, value) => sum + value, 0), 48);

  const noMoves = { ...initial, board: [0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 24] };
  const ended = playMancalaMove({ ...noMoves, board: [1, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 23] }, 0);
  assert.equal(ended.game.over, true);
  assert.equal(ended.game.winner, 0);
  assert.equal(ended.game.board.reduce((sum, value) => sum + value, 0), 48);
  assert.deepEqual(legalMancalaPits(noMoves), []);
  assert.equal(chooseMancalaMove(initial, () => 0), 2);
  assert.equal(playMancalaMove(initial, 6), null);
});

test('metric tire comparison computes nominal geometry and speedometer estimate', () => {
  const size = parseMetricTireSize('205/55R16');
  assert.ok(Math.abs(size.diameterMm - 631.9) < 0.1);
  assert.ok(Math.abs(size.circumferenceMm - Math.PI * size.diameterMm) < 1e-9);
  assert.equal(Number(size.sidewallMm.toFixed(2)), 112.75);

  const same = compareMetricTireSizes('205/55R16', '205/55R16');
  assert.equal(same.diameterDifferenceMm, 0);
  assert.equal(same.circumferenceDifferenceMm, 0);
  assert.equal(same.diameterChangePercent, 0);
  assert.equal(same.estimatedActualSpeed, 100);
  assert.equal(same.identicalSize, true);
  assert.equal(compareMetricTireSizes('205 / 55 r 16', '205/55R16').identicalSize, true);

  const larger = compareMetricTireSizes('205/55R16', '225/55R17', 60, 'mph');
  assert.ok(larger.diameterDifferenceMm > 0);
  assert.ok(larger.estimatedActualSpeed > 60);
  assert.equal(larger.groundClearanceChangeMm, larger.diameterDifferenceMm / 2);
  assert.throws(() => parseMetricTireSize('31x10.50R15'), /metric tire format/);
  assert.throws(() => parseMetricTireSize('40/55R16'), /Width/);
  assert.throws(() => parseMetricTireSize('205/10R16'), /Aspect ratio/);
  assert.throws(() => compareMetricTireSizes('205/55R16', '205/55R16', 250, 'mph'), /Indicated speed/);
  assert.throws(() => compareMetricTireSizes('205/55R16', '205/55R16', 0), /Indicated speed/);
  assert.equal(compareMetricTireSizes('205/55R16', '205/55R16', 1).estimatedActualSpeed, 1);
  assert.throws(() => compareMetricTireSizes(null, '205/55R16'), /metric tire format/);
});

test('stair geometry calculates risers, treads, run and stringer without claiming code compliance', () => {
  const result = calculateStairGeometry(2.8, 16, 0.28, 'm');
  assert.equal(result.riserCount, 16);
  assert.equal(result.treadCount, 15);
  assert.equal(result.riserHeight, 0.175);
  assert.equal(result.totalRun, 4.2);
  assert.ok(Math.abs(result.stringerLength - 5.04777) < 0.0001);
  assert.ok(Math.abs(result.angleDegrees - 32.005) < 0.01);
  assert.equal(calculateStairGeometry(110, 16, 11, 'in').unit, 'in');
  assert.throws(() => calculateStairGeometry(2.8, 1, 0.28, 'm'), /between/u);
  assert.throws(() => calculateStairGeometry(2.8, 16.5, 0.28, 'm'), /whole number/u);
  assert.throws(() => calculateStairGeometry(2.8, 16, 0.05, 'm'), /between/u);
  assert.throws(() => calculateStairGeometry(2.8, 16, 0.28, 'yard'), /unit/u);
});

test('asphalt calculator converts compacted layer to tonnage, cost and imperial units', () => {
  const result = calculateAsphalt({ area: 100, areaUnit: 'm2', compactedThickness: 50, thicknessUnit: 'mm', density: 2400, densityUnit: 'kgm3', wastePercent: 0, pricePerTonne: 95 });
  assert.equal(result.compactedVolumeM3, 5);
  assert.equal(result.orderVolumeM3, 5);
  assert.equal(result.estimatedMassKg, 12000);
  assert.equal(result.metricTonnes, 12);
  assert.equal(result.estimatedCost, 1140);
  assert.ok(Math.abs(result.usShortTons - 13.227735) < 0.00001);
  const withWaste = calculateAsphalt({ area: 100, compactedThickness: 50, density: 2400, wastePercent: 5 });
  assert.equal(withWaste.orderVolumeM3, 5.25);
  assert.equal(withWaste.metricTonnes, 12.6);
  const imperial = calculateAsphalt({ area: 1076.391, areaUnit: 'ft2', compactedThickness: 1.9685, thicknessUnit: 'in', density: 149.826, densityUnit: 'lbft3' });
  assert.ok(Math.abs(imperial.metricTonnes - 12) < 0.002);
  assert.equal(calculateAsphalt({ area: 100, compactedThickness: 50 }).estimatedCost, null);
  assert.throws(() => calculateAsphalt({ area: 0, compactedThickness: 50 }), /Area/u);
  assert.throws(() => calculateAsphalt({ area: 100, compactedThickness: 0 }), /Compacted thickness/u);
  assert.throws(() => calculateAsphalt({ area: 100, compactedThickness: 50, wastePercent: 31 }), /Waste/u);
  assert.throws(() => calculateAsphalt({ area: 100, compactedThickness: 50, density: 9000 }), /Density/u);
  assert.throws(() => calculateAsphalt({ area: 100, compactedThickness: 50, areaUnit: 'acre' }), /units/u);
});

test('Mancala keeps the original seed total over complete deterministic games', () => {
  for (let seed = 1; seed <= 12; seed += 1) {
    let state = createMancalaGame((seed % 8) + 1);
    const expectedSeeds = state.board.reduce((sum, value) => sum + value, 0);
    let cursor = seed;
    const random = () => { cursor = (cursor * 48271) % 2147483647; return cursor / 2147483647; };
    let moves = 0;
    while (!state.over && moves < 5000) {
      const pit = chooseMancalaMove(state, random);
      assert.notEqual(pit, null);
      const result = playMancalaMove(state, pit);
      assert.ok(result);
      state = result.game;
      assert.equal(state.board.reduce((sum, value) => sum + value, 0), expectedSeeds);
      moves += 1;
    }
    assert.equal(state.over, true, `Game ${seed} did not terminate within 5000 moves.`);
  }
});
