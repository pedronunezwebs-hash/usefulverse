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
import { calculateFence } from './fence-calculator/logic.mjs';
import { calculatePoolSalt } from './pool-salt-calculator/logic.mjs';
import { calculateWallpaper } from './wallpaper-calculator/logic.mjs';
import { calculateBrickMaterials } from './brick-calculator/logic.mjs';
import { calculateRafter } from './rafter-calculator/logic.mjs';
import { calculateCarpet } from './carpet-calculator/logic.mjs';
import { calculateAquarium } from './aquarium-calculator/logic.mjs';
import { calculateGrassSeed } from './grass-seed-calculator/logic.mjs';
import { calculateInsulation } from './insulation-calculator/logic.mjs';
import { calculateWallFraming } from './wall-framing-calculator/logic.mjs';
import { calculateElectricityCost } from './electricity-cost-calculator/logic.mjs';
import { calculateCompostMix } from './compost-calculator/logic.mjs';
import { calculatePond } from './pond-volume-calculator/logic.mjs';
import { mapPointerRegion, normalizeRedactionRegion, validateImageSize, validateRedactionMode } from './image-region-redactor/logic.mjs';
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

test('wallpaper calculator counts pattern-aligned drops, openings and allowance', () => {
  const base = { perimeter: 12, wallHeight: 2.4, rollWidth: 0.53, rollLength: 10.05, wastePercent: 0, unit: 'm' };
  assert.equal(calculateWallpaper(base).rollsNeeded, 6);
  assert.equal(calculateWallpaper({ ...base, patternRepeat: 0.32 }).rollsNeeded, 8);
  assert.equal(calculateWallpaper({ ...base, openingsArea: 2.4 }).stripsNeeded, 21);
});

test('brick calculator counts openings, layers, courses, mortar and bag yield', () => {
  const wall = { wallLength: 10, wallHeight: 8, wallUnit: 'ft', brickLength: 7.625, brickHeight: 2.25, brickDepth: 3.625, brickUnit: 'in', joint: 0.375, jointUnit: 'in', wastePercent: 0 };
  const closed = calculateBrickMaterials(wall);
  const door = calculateBrickMaterials({ ...wall, openingWidth: 3, openingHeight: 7, openingCount: 1, wastePercent: 5, bagYieldLiters: 25 });
  assert.ok(door.bricksToOrder < calculateBrickMaterials({ ...wall, wastePercent: 5 }).bricksToOrder);
  const doubleWythe = calculateBrickMaterials({ ...wall, wythes: 2 });
  assert.equal(doubleWythe.bricksToOrder, closed.bricksToOrder * 2);
  assert.equal(doubleWythe.mortarLiters, closed.mortarLiters * 2);
  assert.equal(door.courses, 37);
  assert.ok(door.mortarLiters > 0);
  assert.equal(door.mortarBags, Math.ceil(door.mortarLiters / 25));
  const metric = calculateBrickMaterials({ wallLength: 3, wallHeight: 2.4, wallUnit: 'm', brickLength: 19, brickHeight: 5.7, brickDepth: 9, brickUnit: 'cm', joint: 1, jointUnit: 'cm' });
  assert.ok(metric.bricksToOrder > 0);
  assert.throws(() => calculateBrickMaterials({ ...wall, openingWidth: 11, openingHeight: 9, openingCount: 2 }), /Openings/u);
  assert.throws(() => calculateBrickMaterials({ ...wall, openingWidth: 0, openingHeight: 4, openingCount: 1 }), /both opening/u);
  assert.throws(() => calculateBrickMaterials({ ...wall, wythes: 1.5 }), /whole number/u);
});

test('rafter calculator handles span deduction, pitch, overhang and invalid geometry', () => {
  const base = calculateRafter({ span: 20, rise: 6, ridgeThickness: 1.5, ridgeUnit: 'in', unit: 'ft', overhang: 0 });
  assert.equal(base.horizontalRun, 9.9375);
  assert.ok(Math.abs(base.rafterLength - Math.hypot(9.9375, 6)) < 1e-12);
  const withOverhang = calculateRafter({ span: 20, rise: 6, ridgeThickness: 1.5, ridgeUnit: 'in', unit: 'ft', overhang: 1 });
  assert.ok(withOverhang.rafterLength > base.rafterLength);
  const pitchMode = calculateRafter({ span: 20, pitch: 3, ridgeThickness: 1.5, ridgeUnit: 'in', unit: 'ft', mode: 'pitch' });
  assert.ok(Math.abs(pitchMode.rise - 2.484375) < 1e-12);
  assert.ok(Math.abs(pitchMode.pitchPer12 - 3) < 1e-12);
  const metric = calculateRafter({ span: 6, rise: 1.5, ridgeThickness: 0.1, overhang: 0.3, unit: 'm' });
  assert.ok(metric.rafterLength > 0);
  assert.throws(() => calculateRafter({ span: 1, rise: 1, ridgeThickness: 1, ridgeUnit: 'm', unit: 'm' }), /smaller than the span/u);
  assert.throws(() => calculateRafter({ span: 20, pitch: 0, unit: 'ft', mode: 'pitch' }), /Pitch/u);
});

test('carpet calculator compares cut orientation, seams, rooms, allowance and units', () => {
  const plan = calculateCarpet({ roomLength: 4, roomWidth: 5, rollWidth: 3, wastePercent: 0, unit: 'm', pileDirection: 'length' });
  assert.equal(plan.chosen.cutsPerRoom, 2);
  assert.equal(plan.chosen.seamsPerRoom, 1);
  assert.equal(plan.chosen.cutLength, 4);
  assert.equal(plan.chosen.orderedLength, 8);
  assert.equal(plan.roomArea, 20);
  const best = calculateCarpet({ roomLength: 4, roomWidth: 5, rollWidth: 3, wastePercent: 0, unit: 'm', pileDirection: 'either' });
  assert.equal(best.chosen.pileDirection, 'length');
  assert.ok(best.options.find((option) => option.pileDirection === 'width').orderedLength > best.chosen.orderedLength);
  const twoRooms = calculateCarpet({ roomLength: 4, roomWidth: 5, rollWidth: 3, rooms: 2, wastePercent: 10, unit: 'm', pileDirection: 'length' });
  assert.equal(twoRooms.chosen.orderedLength, 17.6);
  const imperial = calculateCarpet({ roomLength: 12, roomWidth: 15, rollWidth: 10, unit: 'ft', wastePercent: 0, pileDirection: 'length' });
  assert.equal(imperial.chosen.cutsPerRoom, 2);
  assert.throws(() => calculateCarpet({ roomLength: 4, roomWidth: 5, rollWidth: 0 }), /Roll width/u);
  assert.throws(() => calculateCarpet({ roomLength: 4, roomWidth: 5, rollWidth: 3, rooms: 1.5 }), /whole number/u);
});

test('aquarium calculator estimates net water, substrate, air space, gallons and water mass', () => {
  const result = calculateAquarium({ length: 60, width: 30, height: 36, unit: 'cm', substrateDepth: 5, substrateSolidPercent: 50, airGap: 3 });
  assert.equal(result.tankVolumeLiters, 64.8);
  assert.equal(result.substrateDisplacementLiters, 4.5);
  assert.ok(Math.abs(result.airSpaceLiters - 5.4) < 1e-10);
  assert.ok(Math.abs(result.waterLiters - 54.9) < 1e-10);
  assert.equal(result.waterMassKg, result.waterLiters);
  assert.ok(Math.abs(calculateAquarium({ length: 10, width: 10, height: 10, unit: 'cm', substrateDepth: 0, substrateSolidPercent: 0, airGap: 0 }).waterMassKg - 1) < 1e-10);
  assert.ok(Math.abs(calculateAquarium({ length: 24, width: 12, height: 12, unit: 'in', substrateDepth: 0, substrateSolidPercent: 0, airGap: 0 }).waterLiters - 56.634) < 0.01);
  assert.throws(() => calculateAquarium({ length: 30, width: 30, height: 40, unit: 'cm', substrateDepth: 25, airGap: 15 }), /less than tank height/u);
  assert.throws(() => calculateAquarium({ length: 30, width: 30, height: 40, unit: 'cm', substrateSolidPercent: 101 }), /from 0 to 100/u);
});

test('image redactor validates safe image sizes, exact regions, drag mapping and modes', () => {
  assert.equal(validateImageSize(4000, 3000).pixels, 12_000_000);
  assert.throws(() => validateImageSize(6000, 5000), /pixel count/u);
  assert.deepEqual(normalizeRedactionRegion({ x: 5, y: 5, width: 20, height: 20 }, 100, 100), { x: 5, y: 5, width: 20, height: 20 });
  assert.deepEqual(mapPointerRegion({ x: 10, y: 10 }, { x: 30, y: 35 }, 2, 2, 100, 100), { x: 20, y: 20, width: 40, height: 50 });
  assert.equal(validateRedactionMode('black'), 'black');
  assert.throws(() => validateRedactionMode('reversible'), /Choose/u);
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

test('fence calculator counts endpoint posts, evenly split gates, panels, pickets, waste and optional costs', () => {
  const fence = calculateFence({ length: 100, unit: 'ft', gateCount: 1, gateWidth: 48, materialUnit: 'in', postSpacing: 96, panelWidth: 96, picketWidth: 5.5, maxPicketGap: 2, picketHeight: 72, wastePercent: 10, pricePerPost: 25, pricePerGate: 120, pricePerPanel: 80, pricePerPicket: 8 });
  assert.ok(Math.abs(fence.gateOpeningM - 4 * 0.3048) < 1e-12);
  assert.equal(fence.sectionCount, 2);
  assert.equal(fence.postSpansPerSection, 6);
  assert.equal(fence.postCount, 14);
  assert.equal(fence.panelCount, 12);
  assert.equal(fence.orderedPanels, 14);
  assert.equal(fence.picketsPerSection, 78);
  assert.equal(fence.picketCount, 156);
  assert.equal(fence.orderedPickets, 172);
  assert.ok(fence.actualPicketGapM <= 2 * 0.0254);
  assert.equal(fence.estimatedPanelOptionCost, 14 * 25 + 120 + 14 * 80);
  assert.equal(fence.estimatedPicketOptionCost, 14 * 25 + 120 + 172 * 8);

  const isolated = calculateFence({ length: 4, unit: 'm', gateCount: 0, gateWidth: 1, materialUnit: 'm', postSpacing: 100, panelWidth: 2, picketWidth: 0.1, maxPicketGap: 0.05, picketHeight: 1.8, wastePercent: 0 });
  assert.equal(isolated.sectionCount, 1);
  assert.equal(isolated.postCount, 2, 'an isolated fence section needs both end posts');
  assert.equal(isolated.gateOpeningM, 0);
  assert.equal(isolated.estimatedPanelOptionCost, null);
  assert.equal(isolated.estimatedPicketOptionCost, null);

  const metric = calculateFence({ length: 30, unit: 'm', gateCount: 2, gateWidth: 1.2, materialUnit: 'm', postSpacing: 2.4, panelWidth: 2.4, picketWidth: 0.15, maxPicketGap: 0.05, picketHeight: 1.8, wastePercent: 0 });
  assert.equal(metric.sectionCount, 3);
  assert.ok(metric.postCount >= 2 * metric.sectionCount);
  assert.equal(metric.gateOpeningM, 2.4);
  assert.throws(() => calculateFence({ length: 2, unit: 'm', gateCount: 1, gateWidth: 80, materialUnit: 'in', postSpacing: 8, panelWidth: 8, picketWidth: 6, maxPicketGap: 2, picketHeight: 6 }), /Gate openings/u);
  assert.throws(() => calculateFence({ length: 100, unit: 'ft', gateCount: 1.5 }), /whole number/u);
  assert.throws(() => calculateFence({ length: 100, unit: 'ft', gateCount: 0, wastePercent: 31 }), /Extra material/u);
  assert.throws(() => calculateFence({ length: 100, unit: 'ft', postSpacing: 0 }), /Maximum post spacing/u);
  assert.throws(() => calculateFence({ length: 100, unit: 'ft', materialUnit: 'm', maxPicketGap: 1.1 }), /must not exceed 1 meter/u);
  assert.throws(() => calculateFence({ length: 1, unit: 'm', gateCount: 0, materialUnit: 'm', picketWidth: 1.1, maxPicketGap: 0.05 }), /must fit within/u);
});

test('pool salt calculator estimates dosage from volume and measured salinity without inventing a target', () => {
  const acceptance = calculatePoolSalt({ volume: 1_000, volumeUnit: 'l', currentSalinityPpm: 0, targetSalinityPpm: 1_000, saltPurityPercent: 100, bagSize: 1, bagUnit: 'kg' });
  assert.equal(acceptance.saltToAddKg, 1);
  assert.equal(acceptance.bagsToBuy, 1);
  assert.equal(acceptance.noSaltNeeded, false);

  const purityAdjusted = calculatePoolSalt({ volume: 1_000, volumeUnit: 'l', currentSalinityPpm: 500, targetSalinityPpm: 1_500, saltPurityPercent: 99, bagSize: 2.5, bagUnit: 'lb' });
  assert.ok(Math.abs(purityAdjusted.saltToAddKg - (1 / 0.99)) < 1e-12);
  assert.equal(purityAdjusted.bagsToBuy, 1);

  const gallons = calculatePoolSalt({ volume: 1_000, volumeUnit: 'us-gal', currentSalinityPpm: 0, targetSalinityPpm: 1_000 });
  assert.ok(Math.abs(gallons.saltToAddKg - 3.785411784) < 1e-12);
  const alreadyAtTarget = calculatePoolSalt({ volume: 1_000, volumeUnit: 'l', currentSalinityPpm: 3_000, targetSalinityPpm: 2_800 });
  assert.equal(alreadyAtTarget.saltToAddKg, 0);
  assert.equal(alreadyAtTarget.bagsToBuy, null);
  assert.equal(alreadyAtTarget.noSaltNeeded, true);

  assert.throws(() => calculatePoolSalt({ volume: 0, currentSalinityPpm: 0, targetSalinityPpm: 1_000 }), /Pool volume/u);
  assert.throws(() => calculatePoolSalt({ volume: 1_000, currentSalinityPpm: -1, targetSalinityPpm: 1_000 }), /Current salinity/u);
  assert.throws(() => calculatePoolSalt({ volume: 1_000, currentSalinityPpm: 0, targetSalinityPpm: 10_001 }), /Target salinity/u);
  assert.throws(() => calculatePoolSalt({ volume: 1_000, currentSalinityPpm: 0, targetSalinityPpm: 1_000, saltPurityPercent: 0 }), /Salt purity/u);
  assert.throws(() => calculatePoolSalt({ volume: 1_000, currentSalinityPpm: 0, targetSalinityPpm: 1_000, volumeUnit: 'cups' }), /supported volume/u);
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

test('grass seed estimates user-selected rates, mix shares and whole bags', () => {
  const metric = calculateGrassSeed({ area: 100, seedingRate: 30 });
  assert.equal(metric.totalKg, 3);
  assert.equal(metric.components[0].weightKg, 3);
  const mixed = calculateGrassSeed({ area: 100, seedingRate: 30, percentA: 70, percentB: 30, varietyA: 'Rye', varietyB: 'Fescue', bagSize: 1.2 });
  assert.equal(mixed.totalKg, 3);
  assert.equal(mixed.components[0].weightKg, 2.1);
  assert.equal(mixed.components[1].weightKg, 0.9);
  assert.equal(mixed.bagsNeeded, 3);
  assert.ok(Math.abs(mixed.estimatedPackedKg - 3.6) < 1e-12);
  const imperial = calculateGrassSeed({ area: 1000, areaUnit: 'ft2', seedingRate: 5, rateUnit: 'lb-1000ft2', bagSize: 10, bagUnit: 'lb' });
  assert.ok(Math.abs(imperial.totalLb - 5) < 1e-8);
  assert.equal(imperial.bagsNeeded, 1);
  assert.ok(Math.abs(calculateGrassSeed({ area: 1, areaUnit: 'acre', seedingRate: 1, rateUnit: 'lb-1000ft2' }).totalLb - 43.56) < 1e-7);
  assert.throws(() => calculateGrassSeed({ area: 100, seedingRate: 30, percentA: 65, percentB: 30 }), /add up to 100/u);
  assert.throws(() => calculateGrassSeed({ area: 100, seedingRate: 30, areaUnit: 'hectare' }), /supported/u);
  assert.throws(() => calculateGrassSeed({ area: 100, seedingRate: -1 }), /Seeding rate/u);
});

test('insulation adds series layers, quantity and converts R/RSI with reciprocal U-factors', () => {
  const rValue = calculateInsulation({ layers: [{ name: 'A', resistance: 2 }, { name: 'B', resistance: 3 }] });
  assert.equal(rValue.rValue, 5);
  assert.ok(Math.abs(rValue.rsi - 0.880550919) < 1e-9);
  assert.equal(rValue.uFactorUs, 0.2);
  assert.ok(Math.abs(rValue.uFactorSi - 1 / rValue.rsi) < 1e-12);
  const metric = calculateInsulation({ unit: 'RSI', layers: [{ resistance: 1 }, { resistance: 2, quantity: 1 }, { resistance: 0.5, quantity: 2 }] });
  assert.equal(metric.rsi, 4);
  assert.ok(Math.abs(metric.rValue - (4 / 0.1761101838)) < 1e-10);
  assert.equal(metric.layerCount, 3);
  assert.throws(() => calculateInsulation({ layers: [{ resistance: 2, quantity: 1.5 }] }), /allowed range/u);
  assert.throws(() => calculateInsulation({ layers: [{ resistance: 0 }] }), /above zero/u);
  assert.throws(() => calculateInsulation({ unit: 'Rsi', layers: [{ resistance: 2 }] }), /Choose R or RSI/u);
});

test('wall framing includes both endpoints and positioned opening edges, with plate lengths', () => {
  const result = calculateWallFraming({ wallLength: 8, wallHeight: 8, wallUnit: 'ft', spacing: 16, spacingUnit: 'in', openings: [{ start: 2, width: 3, breaksBottomPlate: true }] });
  assert.equal(result.studCount, 7);
  assert.deepEqual(result.studPositions, [0, 1, 2, 5, 6, 7, 8]);
  assert.equal(result.studLinearLength, 56);
  assert.equal(result.topPlateLength, 16);
  assert.equal(result.bottomPlateLength, 5);
  assert.equal(result.totalPlateLength, 21);
  assert.equal(result.openingCount, 1);
  const windowOpening = calculateWallFraming({ wallLength: 8, wallHeight: 8, wallUnit: 'ft', spacing: 16, spacingUnit: 'in', openings: [{ start: 2, width: 3 }] });
  assert.equal(windowOpening.bottomPlateLength, 8);
  const metric = calculateWallFraming({ wallLength: 3, wallHeight: 2.4, wallUnit: 'm', spacing: 600, spacingUnit: 'mm', topPlateRows: 2, bottomPlateRows: 0 });
  assert.equal(metric.studPositions[0], 0);
  assert.equal(metric.studPositions.at(-1), 3);
  assert.equal(metric.bottomPlateLength, 0);
  assert.ok(metric.studPositions.slice(1).every((position, index) => position - metric.studPositions[index] <= 0.6000001));
  assert.throws(() => calculateWallFraming({ wallLength: 8, wallHeight: 8, spacing: 16, spacingUnit: 'in', openings: [{ start: 2, width: 4 }, { start: 5, width: 1 }] }), /overlap/u);
  assert.throws(() => calculateWallFraming({ wallLength: 8, wallHeight: 8, spacing: 16, spacingUnit: 'in', openings: [{ start: 2, width: null }] }), /both the start and width/u);
  assert.throws(() => calculateWallFraming({ wallLength: 8, wallHeight: 8, spacing: 16, spacingUnit: 'in', openings: [{ start: 0, width: 3 }] }), /leave wall at both ends/u);
});

test('electricity cost follows entered appliance schedules, kWh rate and fixed period charge', () => {
  const acceptance = calculateElectricityCost({
    appliances: [{ power: 1000, powerUnit: 'W', quantity: 1, hoursPerDay: 1, activeDays: 1 }],
    ratePerKwh: 0.2, billingDays: 1,
  });
  assert.equal(acceptance.energyKwh, 1);
  assert.equal(acceptance.energyCost, 0.2);
  assert.equal(acceptance.totalCost, 0.2);
  const multiple = calculateElectricityCost({
    appliances: [
      { name: 'Heater', power: 2, powerUnit: 'kW', quantity: 2, hoursPerDay: 3.5, activeDays: 2 },
      { power: 500, powerUnit: 'W', quantity: 1, hoursPerDay: 4, activeDays: 2 },
      {},
    ],
    ratePerKwh: 0.3, billingDays: 30, fixedCharge: 4,
  });
  assert.equal(multiple.appliances.length, 2);
  assert.equal(multiple.energyKwh, 32);
  assert.equal(multiple.energyCost, 9.6);
  assert.equal(multiple.totalCost, 13.6);
  assert.equal(multiple.averageDailyKwh, 32 / 30);
  assert.throws(() => calculateElectricityCost({ appliances: [{ name: 'Only a name' }], ratePerKwh: 0.2 }), /Complete every value/u);
  assert.throws(() => calculateElectricityCost({ appliances: [], ratePerKwh: 0.2 }), /at least one appliance/u);
  assert.throws(() => calculateElectricityCost({ appliances: [{ power: 100, powerUnit: 'W', quantity: 1, hoursPerDay: 1, activeDays: 31 }], ratePerKwh: 0.2, billingDays: 30 }), /allowed range/u);
  assert.throws(() => calculateElectricityCost({ appliances: [{ power: 100, powerUnit: 'MW', quantity: 1, hoursPerDay: 1, activeDays: 1 }], ratePerKwh: 0.2 }), /Choose W or kW/u);
});

test('compost mix derives carbon and nitrogen from dry matter and estimates moisture balance', () => {
  assert.throws(() => calculateCompostMix({ materials: [], targetMoisturePercent: 50 }), /at least one material/u);
  assert.throws(() => calculateCompostMix({ materials: [{ wetMass: 0, moisturePercent: 20, carbonPercent: 45, carbonNitrogenRatio: 30 }] }), /allowed range/u);
  const result = calculateCompostMix({
    massUnit: 'kg', targetMoisturePercent: 55,
    materials: [
      { name: 'Dry leaves', wetMass: 10, moisturePercent: 20, carbonPercent: 45, carbonNitrogenRatio: 60 },
      { name: 'Food scraps', wetMass: 10, moisturePercent: 70, carbonPercent: 45, carbonNitrogenRatio: 15 },
      {},
    ],
  });
  assert.equal(result.wetMassKg, 20);
  assert.equal(result.dryMassKg, 11);
  assert.equal(result.waterKg, 9);
  assert.equal(result.carbonKg, 4.95);
  assert.ok(Math.abs(result.nitrogenKg - 0.15) < 1e-12);
  assert.ok(Math.abs(result.carbonNitrogenRatio - 33) < 1e-10);
  assert.equal(result.moisturePercent, 45);
  assert.ok(Math.abs(result.waterToAddKg - 4.444444444444445) < 1e-10);
  assert.equal(result.waterToRemoveKg, 0);
  const dryTarget = calculateCompostMix({ materials: [{ wetMass: 10, moisturePercent: 60, carbonPercent: 40, carbonNitrogenRatio: 30 }], targetMoisturePercent: 40 });
  assert.equal(dryTarget.waterToAddKg, 0);
  assert.ok(dryTarget.waterToRemoveKg > 0);
  assert.throws(() => calculateCompostMix({ massUnit: 'ton', materials: [{ wetMass: 10, moisturePercent: 20, carbonPercent: 45, carbonNitrogenRatio: 30 }] }), /Choose kilograms/u);
  assert.throws(() => calculateCompostMix({ materials: [{ name: 'Leaves' }] }), /Complete every value/u);
});

test('pond volume separates average-depth water capacity from maximum-depth liner sizing', () => {
  const example = calculatePond({ shape: 'rectangle', length: 5, width: 3, dimensionUnit: 'm', averageDepth: 0.6, maximumDepth: 0.8, edgeOverlap: 0.3, fillPercent: 90 });
  assert.equal(example.footprintM2, 15);
  assert.equal(example.geometricCapacityM3, 9);
  assert.equal(example.filledVolumeM3, 8.1);
  assert.equal(example.liters, 8100);
  assert.ok(Math.abs(example.linerLength - 7.2) < 1e-12);
  assert.ok(Math.abs(example.linerWidth - 5.2) < 1e-12);
  assert.ok(Math.abs(example.linerArea - 37.44) < 1e-12);
  const deeperWater = calculatePond({ shape: 'rectangle', length: 5, width: 3, dimensionUnit: 'm', averageDepth: 1, maximumDepth: 1, edgeOverlap: 0.3 });
  assert.ok(deeperWater.filledVolumeM3 > example.filledVolumeM3);
  const deeperLiner = calculatePond({ shape: 'rectangle', length: 5, width: 3, dimensionUnit: 'm', averageDepth: 0.6, maximumDepth: 1, edgeOverlap: 0.3, fillPercent: 90 });
  assert.ok(deeperLiner.linerLength > example.linerLength);
  const circle = calculatePond({ shape: 'circle', diameter: 4, dimensionUnit: 'm', averageDepth: 1, maximumDepth: 1.5, edgeOverlap: 0.25 });
  assert.ok(Math.abs(circle.footprintM2 - Math.PI * 4) < 1e-12);
  assert.equal(circle.linerLength, 7.5);
  const oval = calculatePond({ shape: 'oval', length: 10, width: 4, dimensionUnit: 'm', averageDepth: 1, maximumDepth: 1, edgeOverlap: 0 });
  assert.ok(Math.abs(oval.footprintM2 - Math.PI * 10) < 1e-12);
  assert.throws(() => calculatePond({ shape: 'rectangle', length: 5, width: 3, dimensionUnit: 'm', averageDepth: 1, maximumDepth: 0.8 }), /cannot be less/u);
  assert.throws(() => calculatePond({ shape: 'triangle', dimensionUnit: 'm' }), /Choose a rectangular/u);
  assert.throws(() => calculatePond({ shape: 'circle', diameter: 4, dimensionUnit: 'yd', averageDepth: 1, maximumDepth: 1 }), /Choose meters/u);
});
