import { generateSudokuPuzzle } from '../../../local-planners-logic.mjs';

const FULL = (1 << 9) - 1;
const box = (row, column) => Math.floor(row / 3) * 3 + Math.floor(column / 3);

function randomIndex(random, length) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a value from 0 inclusive to 1 exclusive.');
  return Math.floor(value * length);
}

function shuffle(values, random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomIndex(random, i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function neighbors(index) {
  const row = Math.floor(index / 9); const column = index % 9;
  return [row ? index - 9 : -1, row < 8 ? index + 9 : -1, column ? index - 1 : -1, column < 8 ? index + 1 : -1].filter((item) => item >= 0);
}

function validateCages(cages) {
  if (!Array.isArray(cages) || cages.length < 1 || cages.length > 81) throw new RangeError('Killer Sudoku needs 1–81 cages.');
  const seen = new Set();
  for (const cage of cages) {
    if (!cage || !Array.isArray(cage.cells) || cage.cells.length < 1 || cage.cells.length > 9 || !Number.isInteger(cage.sum) || cage.sum < 1 || cage.sum > 405) throw new RangeError('Each cage needs a positive target and 1–9 cells.');
    for (const cell of cage.cells) {
      if (!Number.isInteger(cell) || cell < 0 || cell >= 81 || seen.has(cell)) throw new RangeError('Cages must contain unique cells from the 9×9 board.');
      seen.add(cell);
    }
    const digits = cage.cells.length;
    if (cage.sum < digits * (digits + 1) / 2 || cage.sum > digits * (19 - digits) / 2) throw new RangeError('A cage target is impossible for its number of distinct digits.');
    const group = new Set(cage.cells); const reached = new Set([cage.cells[0]]); const todo = [cage.cells[0]];
    while (todo.length) for (const next of neighbors(todo.pop())) if (group.has(next) && !reached.has(next)) { reached.add(next); todo.push(next); }
    if (reached.size !== group.size) throw new RangeError('Every cage must be orthogonally connected.');
  }
  if (seen.size !== 81) throw new RangeError('Cages must cover all 81 cells exactly once.');
}

function possibleCageSum(cage, entries) {
  const values = cage.cells.map((index) => entries[index]);
  const used = values.filter(Boolean);
  if (new Set(used).size !== used.length) return false;
  const remaining = cage.sum - used.reduce((sum, value) => sum + value, 0);
  const slots = values.length - used.length;
  if (!slots) return remaining === 0;
  const available = Array.from({ length: 9 }, (_, index) => index + 1).filter((value) => !used.includes(value));
  return remaining >= available.slice(0, slots).reduce((sum, value) => sum + value, 0)
    && remaining <= available.slice(-slots).reduce((sum, value) => sum + value, 0);
}

export function countKillerSudokuSolutions(cages, { limit = 2, maxNodes = 100_000 } = {}) {
  validateCages(cages);
  if (!Number.isInteger(limit) || limit < 1 || limit > 2 || !Number.isInteger(maxNodes) || maxNodes < 1 || maxNodes > 500_000) throw new RangeError('Solver bounds are outside the supported range.');
  const cageAt = Array(81); const cageUsed = Array(cages.length).fill(0); const cageRemaining = cages.map((cage) => cage.cells.length); const cageSums = cages.map((cage) => cage.sum);
  cages.forEach((cage, index) => cage.cells.forEach((cell) => { cageAt[cell] = index; }));
  const board = Array(81).fill(0); const rows = Array(9).fill(0); const columns = Array(9).fill(0); const boxes = Array(9).fill(0);
  let count = 0; let nodes = 0; let firstSolution = null; let complete = true;
  function search() {
    if (count >= limit || nodes >= maxNodes) { complete = false; return; }
    nodes += 1;
    let best = -1; let options = 10; let bestMask = 0;
    for (let index = 0; index < 81; index += 1) {
      if (board[index]) continue;
      const row = Math.floor(index / 9); const column = index % 9; const cageId = cageAt[index];
      let mask = FULL & ~(rows[row] | columns[column] | boxes[box(row, column)] | cageUsed[cageId]);
      let localCount = 0;
      for (let bit = 1; bit <= 1 << 8; bit <<= 1) if (mask & bit) {
        const value = Math.log2(bit) + 1;
        cageSums[cageId] -= value; cageRemaining[cageId] -= 1;
        const slots = cageRemaining[cageId];
        let feasible = cageSums[cageId] >= slots * (slots + 1) / 2 && cageSums[cageId] <= slots * (19 - slots) / 2;
        if (!slots) feasible &&= cageSums[cageId] === 0;
        cageSums[cageId] += value; cageRemaining[cageId] += 1;
        if (feasible) localCount += 1; else mask &= ~bit;
      }
      if (localCount < options) { best = index; options = localCount; bestMask = mask; if (options <= 1) break; }
      if (!localCount) return;
    }
    if (best < 0) { count += 1; if (!firstSolution) firstSolution = [...board]; return; }
    const row = Math.floor(best / 9); const column = best % 9; const cageId = cageAt[best]; const boxId = box(row, column);
    for (let bit = 1; bit <= 1 << 8; bit <<= 1) if (bestMask & bit) {
      const value = Math.log2(bit) + 1;
      board[best] = value; rows[row] |= bit; columns[column] |= bit; boxes[boxId] |= bit; cageUsed[cageId] |= bit; cageSums[cageId] -= value; cageRemaining[cageId] -= 1;
      search();
      board[best] = 0; rows[row] ^= bit; columns[column] ^= bit; boxes[boxId] ^= bit; cageUsed[cageId] ^= bit; cageSums[cageId] += value; cageRemaining[cageId] += 1;
      if (count >= limit || nodes >= maxNodes) { complete = false; return; }
    }
  }
  search();
  return Object.freeze({ count, complete, nodes, solution: firstSolution && Object.freeze(firstSolution) });
}

export function validateKillerSolution(solution, cages) {
  validateCages(cages);
  if (!Array.isArray(solution) || solution.length !== 81 || solution.some((value) => !Number.isInteger(value) || value < 1 || value > 9)) return false;
  for (let i = 0; i < 9; i += 1) {
    const row = solution.slice(i * 9, i * 9 + 9);
    const column = solution.filter((_, index) => index % 9 === i);
    if (new Set(row).size !== 9 || new Set(column).size !== 9) return false;
  }
  for (let boxRow = 0; boxRow < 3; boxRow += 1) for (let boxColumn = 0; boxColumn < 3; boxColumn += 1) {
    const values = [];
    for (let row = 0; row < 3; row += 1) for (let column = 0; column < 3; column += 1) values.push(solution[(boxRow * 3 + row) * 9 + boxColumn * 3 + column]);
    if (new Set(values).size !== 9) return false;
  }
  return cages.every((cage) => cage.cells.reduce((sum, index) => sum + solution[index], 0) === cage.sum && new Set(cage.cells.map((index) => solution[index])).size === cage.cells.length);
}

export function checkKillerSudoku(cages, entries) {
  validateCages(cages);
  if (!Array.isArray(entries) || entries.length !== 81 || entries.some((value) => !Number.isInteger(value) || value < 0 || value > 9)) throw new RangeError('Enter a grid of 81 cells from blank to 9.');
  const errors = new Set();
  const markDuplicates = (cells) => {
    const used = new Map();
    for (const index of cells) if (entries[index]) { const previous = used.get(entries[index]); if (previous !== undefined) { errors.add(index); errors.add(previous); } else used.set(entries[index], index); }
  };
  for (let i = 0; i < 9; i += 1) {
    markDuplicates(Array.from({ length: 9 }, (_, column) => i * 9 + column));
    markDuplicates(Array.from({ length: 9 }, (_, row) => row * 9 + i));
  }
  for (let row = 0; row < 9; row += 3) for (let column = 0; column < 9; column += 3) markDuplicates(Array.from({ length: 9 }, (_, offset) => (row + Math.floor(offset / 3)) * 9 + column + offset % 3));
  const cageStates = cages.map((cage) => {
    const values = cage.cells.map((index) => entries[index]); const used = values.filter(Boolean); const sum = used.reduce((total, value) => total + value, 0);
    if (new Set(used).size !== used.length || sum > cage.sum || !possibleCageSum(cage, entries)) cage.cells.filter((index) => entries[index]).forEach((index) => errors.add(index));
    return { sum, remaining: values.filter((value) => !value).length, target: cage.sum };
  });
  const complete = entries.every(Boolean);
  const solved = complete && errors.size === 0 && cageStates.every(({ sum, remaining, target }) => sum === target && remaining === 0);
  return Object.freeze({ solved, complete, errors: Object.freeze([...errors]), cageStates: Object.freeze(cageStates.map(Object.freeze)) });
}

export function generateKillerSudoku({ random = Math.random, targetCages = 62, maxMergeAttempts = 420, maxSolverNodes = 30_000 } = {}) {
  if (!Number.isInteger(targetCages) || targetCages < 45 || targetCages > 80 || !Number.isInteger(maxMergeAttempts) || maxMergeAttempts < 1 || maxMergeAttempts > 2_000) throw new RangeError('Choose a target of 45–80 cages and at most 2,000 merge attempts.');
  const solution = generateSudokuPuzzle('hard', random).solution;
  let cages = solution.map((value, cell) => ({ cells: [cell], sum: value }));
  let attempts = 0; let uniquenessChecks = 0; let nodesUsed = 0;
  while (cages.length > targetCages && attempts < maxMergeAttempts) {
    attempts += 1;
    const pairs = [];
    const owner = new Int16Array(81);
    cages.forEach((cage, id) => cage.cells.forEach((cell) => { owner[cell] = id; }));
    for (let cell = 0; cell < 81; cell += 1) for (const neighbor of neighbors(cell)) {
      const a = owner[cell]; const b = owner[neighbor];
      if (a < b && cages[a].cells.length + cages[b].cells.length <= 5) pairs.push([a, b]);
    }
    if (!pairs.length) break;
    const [a, b] = pairs[randomIndex(random, pairs.length)];
    const first = cages[a]; const second = cages[b];
    const cells = [...first.cells, ...second.cells];
    const values = cells.map((index) => solution[index]);
    if (new Set(values).size !== values.length) continue;
    const combined = { cells, sum: first.sum + second.sum };
    const candidate = cages.filter((_, id) => id !== a && id !== b).concat(combined);
    const check = countKillerSudokuSolutions(candidate, { limit: 2, maxNodes: maxSolverNodes });
    uniquenessChecks += 1; nodesUsed += check.nodes;
    if (check.count === 1 && check.complete) cages = candidate;
  }
  cages = cages.map((cage) => Object.freeze({ cells: Object.freeze([...cage.cells].sort((a, b) => a - b)), sum: cage.sum })).sort((a, b) => a.cells[0] - b.cells[0]);
  const uniqueness = countKillerSudokuSolutions(cages, { limit: 2, maxNodes: maxSolverNodes });
  if (uniqueness.count !== 1 || !uniqueness.complete || !validateKillerSolution(solution, cages)) throw new Error('Could not generate a bounded, uniquely solvable Killer Sudoku puzzle. Try another puzzle.');
  return Object.freeze({ cages: Object.freeze(cages), solution: Object.freeze(solution), targetCages, attempts, uniquenessChecks, solverNodes: nodesUsed + uniqueness.nodes, unique: true });
}
