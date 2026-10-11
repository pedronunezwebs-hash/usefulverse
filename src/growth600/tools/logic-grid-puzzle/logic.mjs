const GROUP_COUNT = 4;
const VALUE_COUNT = 4;
const PAIRS = Object.freeze([[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].map(Object.freeze));
const PERMUTATIONS = (() => {
  const results = [];
  function visit(prefix, remaining) {
    if (!remaining.length) { results.push(Object.freeze(prefix)); return; }
    for (let index = 0; index < remaining.length; index += 1) visit([...prefix, remaining[index]], [...remaining.slice(0, index), ...remaining.slice(index + 1)]);
  }
  visit([], [0, 1, 2, 3]);
  return Object.freeze(results);
})();
const MIN_CLUES = Object.freeze({ easy: 12, medium: 9, hard: 7 });

function checkRandom(random) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 inclusive to 1 exclusive.');
  return value;
}

function shuffle(items, random) {
  const result = items.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(checkRandom(random) * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function inverse(permutation) {
  const result = Array(VALUE_COUNT);
  permutation.forEach((value, owner) => { result[value] = owner; });
  return result;
}

function clueMatches(clue, owners) {
  return (owners[clue.groupA][clue.valueA] === owners[clue.groupB][clue.valueB]) === (clue.relation === 'same');
}

export function solveLogicGrid(clues, { limit = 2 } = {}) {
  if (!Array.isArray(clues) || clues.length > 96 || !Number.isInteger(limit) || limit < 1 || limit > 2) throw new RangeError('Puzzle and solution limit are outside supported bounds.');
  for (const clue of clues) {
    if (!clue || !Number.isInteger(clue.groupA) || !Number.isInteger(clue.groupB) || clue.groupA < 0 || clue.groupA >= GROUP_COUNT || clue.groupB < 0 || clue.groupB >= GROUP_COUNT || clue.groupA === clue.groupB || !Number.isInteger(clue.valueA) || !Number.isInteger(clue.valueB) || clue.valueA < 0 || clue.valueA >= VALUE_COUNT || clue.valueB < 0 || clue.valueB >= VALUE_COUNT || !['same', 'different'].includes(clue.relation)) throw new RangeError('Puzzle contains an invalid clue.');
  }
  const solutions = [];
  outer: for (const first of PERMUTATIONS) for (const second of PERMUTATIONS) for (const third of PERMUTATIONS) {
    const ownerByValue = [[0, 1, 2, 3], inverse(first), inverse(second), inverse(third)];
    if (clues.every((clue) => clueMatches(clue, ownerByValue))) {
      solutions.push(Object.freeze([Object.freeze([0, 1, 2, 3]), first, second, third]));
      if (solutions.length >= limit) break outer;
    }
  }
  return Object.freeze(solutions);
}

export function createLogicGridPuzzle({ difficulty = 'medium', random = Math.random, maxChecks = 96 } = {}) {
  if (!Object.hasOwn(MIN_CLUES, difficulty)) throw new RangeError('Choose easy, medium or hard difficulty.');
  if (!Number.isInteger(maxChecks) || maxChecks < 1 || maxChecks > 96) throw new RangeError('Generation check limit must be from 1 to 96.');
  const solution = [
    [0, 1, 2, 3],
    shuffle([0, 1, 2, 3], random),
    shuffle([0, 1, 2, 3], random),
    shuffle([0, 1, 2, 3], random),
  ].map(Object.freeze);
  const owners = solution.map(inverse);
  const candidates = [];
  for (const [groupA, groupB] of PAIRS) for (let valueA = 0; valueA < VALUE_COUNT; valueA += 1) for (let valueB = 0; valueB < VALUE_COUNT; valueB += 1) {
    const same = owners[groupA][valueA] === owners[groupB][valueB];
    candidates.push(Object.freeze({ groupA, valueA, groupB, valueB, relation: same ? 'same' : 'different' }));
  }
  const clues = [];
  const ordered = shuffle(candidates, random);
  for (const clue of ordered.slice(0, maxChecks)) {
    clues.push(clue);
    if (clues.length >= MIN_CLUES[difficulty] && solveLogicGrid(clues).length === 1) {
      return Object.freeze({ solution: Object.freeze(solution), clues: Object.freeze(clues.slice()), difficulty });
    }
  }
  throw new Error('A unique puzzle could not be proven within the local generation budget.');
}

export function checkLogicGridMarks(puzzle, marks) {
  if (!puzzle || !Array.isArray(puzzle.solution) || puzzle.solution.length !== GROUP_COUNT || !Array.isArray(marks) || marks.length > 96) throw new TypeError('A valid puzzle and bounded set of marks are required.');
  const owners = puzzle.solution.map(inverse);
  const seen = new Set();
  const selectedMatches = new Map(PAIRS.map((_, pairIndex) => [pairIndex, []]));
  for (const mark of marks) {
    if (!mark || !Number.isInteger(mark.pair) || mark.pair < 0 || mark.pair >= PAIRS.length || !Number.isInteger(mark.row) || mark.row < 0 || mark.row >= VALUE_COUNT || !Number.isInteger(mark.column) || mark.column < 0 || mark.column >= VALUE_COUNT || !['same', 'different'].includes(mark.relation)) throw new RangeError('A mark is outside the supported grid.');
    const key = `${mark.pair}:${mark.row}:${mark.column}`;
    if (seen.has(key)) throw new RangeError('A grid cell cannot have multiple marks.');
    seen.add(key);
    if (mark.relation === 'same') selectedMatches.get(mark.pair).push(mark);
  }
  if ([...selectedMatches.values()].some((cells) => cells.some((mark, index) => cells.slice(index + 1).some((other) => mark.row === other.row || mark.column === other.column)))) return Object.freeze({ status: 'conflict' });
  if ([...selectedMatches.values()].some((cells) => cells.length > VALUE_COUNT)) return Object.freeze({ status: 'conflict' });
  if ([...selectedMatches.values()].some((cells) => cells.length < VALUE_COUNT)) return Object.freeze({ status: 'incomplete' });
  for (const [pairIndex, [groupA, groupB]] of PAIRS.entries()) {
    const selected = new Set(selectedMatches.get(pairIndex).map((mark) => `${mark.row}:${mark.column}`));
    for (let row = 0; row < VALUE_COUNT; row += 1) for (let column = 0; column < VALUE_COUNT; column += 1) {
      const expected = owners[groupA][row] === owners[groupB][column];
      if (selected.has(`${row}:${column}`) !== expected) return Object.freeze({ status: 'incorrect' });
    }
  }
  return Object.freeze({ status: 'solved' });
}

export function logicGridHint(puzzle, marks) {
  const checked = checkLogicGridMarks(puzzle, marks);
  if (checked.status === 'solved') return null;
  const marked = new Set(marks.map((mark) => `${mark.pair}:${mark.row}:${mark.column}`));
  const owners = puzzle.solution.map(inverse);
  for (const [pair, [groupA, groupB]] of PAIRS.entries()) for (let row = 0; row < VALUE_COUNT; row += 1) for (let column = 0; column < VALUE_COUNT; column += 1) {
    if (marked.has(`${pair}:${row}:${column}`)) continue;
    return Object.freeze({ pair, row, column, relation: owners[groupA][row] === owners[groupB][column] ? 'same' : 'different' });
  }
  return null;
}

export const logicGridPairGroups = PAIRS;
