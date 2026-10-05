const SIZE = 4;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function randomIndex(random, max) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return Math.floor(value * max);
}

function shuffled(values, random) {
  const output = [...values];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const target = randomIndex(random, index + 1);
    [output[index], output[target]] = [output[target], output[index]];
  }
  return output;
}

function permutations(values, random) {
  const output = [];
  const visit = (prefix, remaining) => {
    if (prefix.length === SIZE) { output.push(prefix); return; }
    for (const digit of shuffled(remaining, random)) visit([...prefix, digit], remaining.filter((value) => value !== digit));
  };
  visit([], values);
  return output;
}

export function createKakuroPuzzle(random = Math.random) {
  if (typeof random !== 'function') throw new TypeError('Provide a random function.');
  const rows = [];
  const columns = Array.from({ length: SIZE }, () => new Set());
  const fill = (rowIndex) => {
    if (rowIndex === SIZE) return true;
    for (const row of permutations(DIGITS, random)) {
      if (row.some((digit, column) => columns[column].has(digit))) continue;
      row.forEach((digit, column) => columns[column].add(digit));
      rows.push(row);
      if (fill(rowIndex + 1)) return true;
      rows.pop();
      row.forEach((digit, column) => columns[column].delete(digit));
    }
    return false;
  };
  if (!fill(0)) throw new Error('Could not generate a valid Kakuro grid.');
  return {
    size: SIZE,
    solution: rows.map((row) => [...row]),
    rowSums: rows.map((row) => row.reduce((sum, digit) => sum + digit, 0)),
    columnSums: columns.map((_, column) => rows.reduce((sum, row) => sum + row[column], 0)),
  };
}

export function isValidKakuroEntry(value) {
  return Number.isInteger(value) && value >= 1 && value <= 9;
}

export function normalizeKakuroDigit(value) {
  const character = String(value ?? '').normalize('NFKC').match(/\p{Nd}/u)?.[0];
  if (!character) return '';
  const codePoint = character.codePointAt(0);
  const zeroes = [0x0030, 0x0660, 0x06f0, 0x0966, 0x09e6, 0x0a66, 0x0ae6, 0x0b66, 0x0be6, 0x0c66, 0x0ce6, 0x0d66, 0x0e50, 0x0ed0, 0x0f20, 0x1040, 0x17e0, 0x1810];
  const zero = zeroes.find((start) => codePoint >= start && codePoint < start + 10);
  return zero === undefined ? '' : String(codePoint - zero);
}

export function checkKakuroSolution(puzzle, entries) {
  if (!puzzle || puzzle.size !== SIZE || !Array.isArray(entries) || entries.length !== SIZE || entries.some((row) => !Array.isArray(row) || row.length !== SIZE)) return false;
  if (entries.some((row) => row.some((value) => !isValidKakuroEntry(value)) || new Set(row).size !== SIZE)) return false;
  for (let column = 0; column < SIZE; column += 1) {
    const digits = entries.map((row) => row[column]);
    if (new Set(digits).size !== SIZE) return false;
    if (digits.reduce((sum, digit) => sum + digit, 0) !== puzzle.columnSums[column]) return false;
  }
  return entries.every((row, index) => row.reduce((sum, digit) => sum + digit, 0) === puzzle.rowSums[index]);
}

export function getKakuroHint(puzzle, entries) {
  if (!puzzle || !Array.isArray(entries)) return null;
  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      if (!entries[row]?.[column]) return { row, column, value: puzzle.solution[row][column] };
    }
  }
  return null;
}

export const KAKURO_SIZE = SIZE;
