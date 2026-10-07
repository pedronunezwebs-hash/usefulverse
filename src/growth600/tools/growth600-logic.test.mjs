import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCircularArea, calculateGravel, calculateRectangularArea, calculateTriangularArea } from './gravel-calculator/logic.mjs';
import { calculateMolarMass, parseChemicalFormula } from './molar-mass-calculator/logic.mjs';
import { compareAutoLoanRefinance, monthlyLoanPayment } from './auto-loan-refinance-calculator/logic.mjs';
import { assignSecretSanta } from './secret-santa-generator/logic.mjs';
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
