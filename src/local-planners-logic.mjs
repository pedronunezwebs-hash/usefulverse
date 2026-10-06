export const packingEssentials = [
  ['Travel documents', 'Documents'], ['Phone charger', 'Electronics'], ['Medication', 'Toiletries'],
];

export function normalizeDecisionMatrix(optionsText, criteriaText) {
  const options = String(optionsText ?? '').split(/\r?\n/u).map((value) => value.trim()).filter(Boolean);
  const criteria = String(criteriaText ?? '').split(/\r?\n/u).map((line) => {
    const [name, weightRaw] = line.split('|').map((part) => part.trim());
    return { name, weight: Number(weightRaw) };
  }).filter((item) => item.name || Number.isFinite(item.weight));
  if (options.length < 2 || options.length > 12 || options.some((name) => [...name].length > 80)) throw new RangeError('Enter 2 to 12 options, each no longer than 80 characters.');
  if (new Set(options.map((name) => name.toLocaleLowerCase())).size !== options.length) throw new TypeError('Option names must be unique.');
  if (criteria.length < 1 || criteria.length > 12 || criteria.some(({ name, weight }) => !name || [...name].length > 80 || !Number.isInteger(weight) || weight < 1 || weight > 10)) throw new TypeError('Each criterion needs a name and a whole-number weight from 1 to 10, separated by |.');
  if (new Set(criteria.map(({ name }) => name.toLocaleLowerCase())).size !== criteria.length) throw new TypeError('Criterion names must be unique.');
  return { options, criteria, scores: options.map(() => criteria.map(() => 5)) };
}

export function decisionTotals(matrix) {
  const totalWeight = matrix.criteria.reduce((sum, item) => sum + item.weight, 0);
  return matrix.scores.map((scores) => {
    if (scores.length !== matrix.criteria.length || scores.some((score) => !Number.isFinite(score) || score < 0 || score > 10)) throw new RangeError('Every score must be from 0 to 10.');
    const weighted = scores.reduce((sum, score, index) => sum + score * matrix.criteria[index].weight, 0);
    return totalWeight ? weighted / totalWeight : 0;
  });
}

export function csvCell(value) {
  const text = String(value ?? '');
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function validateWorkoutExercise({ name, sets, reps, rest }) {
  const cleanName = String(name ?? '').trim();
  const values = [Number(sets), Number(reps), Number(rest)];
  if (!cleanName || [...cleanName].length > 100) throw new TypeError('Enter an exercise name up to 100 characters.');
  if (!Number.isInteger(values[0]) || values[0] < 1 || values[0] > 30) throw new RangeError('Sets must be a whole number from 1 to 30.');
  if (!Number.isInteger(values[1]) || values[1] < 1 || values[1] > 500) throw new RangeError('Reps must be a whole number from 1 to 500.');
  if (!Number.isInteger(values[2]) || values[2] < 0 || values[2] > 3600) throw new RangeError('Rest must be a whole number from 0 to 3600 seconds.');
  return { name: cleanName, sets: values[0], reps: values[1], rest: values[2] };
}

export function normalizeQuizQuestion(question, answers) {
  const cleanQuestion = String(question ?? '').trim();
  const cleanAnswers = Array.isArray(answers) ? answers.map((answer) => String(answer ?? '').trim()) : [];
  if (!cleanQuestion || [...cleanQuestion].length > 240) throw new TypeError('Enter a question up to 240 characters.');
  if (cleanAnswers.length !== 4 || cleanAnswers.some((answer) => !answer || [...answer].length > 160)) throw new TypeError('Fill in all four answers, up to 160 characters each.');
  if (new Set(cleanAnswers.map((answer) => answer.toLocaleLowerCase())).size !== 4) throw new TypeError('All four answers must be different.');
  return { question: cleanQuestion, answers: cleanAnswers, correct: 0 };
}

export function shuffleItems(items, random = Math.random) {
  if (!Array.isArray(items) || items.length > 100 || typeof random !== 'function') throw new TypeError('Provide a list of at most 100 items and a random function.');
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
    const target = Math.floor(sample * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function makeMemoryDeck(cardCount, random = Math.random) {
  const pairs = Number(cardCount) / 2;
  if (![8, 12, 18].includes(pairs)) throw new RangeError('Choose a board with 8, 12 or 18 pairs.');
  const symbols = ['🍎', '🚀', '🐳', '🌻', '🎈', '🍉', '🦊', '🎸', '🌈', '⚽', '🧩', '🐢', '🍄', '🚲', '⭐', '🦋', '🎨', '🐙'];
  return shuffleItems(symbols.slice(0, pairs).flatMap((symbol, pair) => [{ symbol, pair }, { symbol, pair }]), random);
}

const basicKana = [
  ['あ', 'ア', 'a'], ['い', 'イ', 'i'], ['う', 'ウ', 'u'], ['え', 'エ', 'e'], ['お', 'オ', 'o'],
  ['か', 'カ', 'ka'], ['き', 'キ', 'ki'], ['く', 'ク', 'ku'], ['け', 'ケ', 'ke'], ['こ', 'コ', 'ko'],
  ['さ', 'サ', 'sa'], ['し', 'シ', 'shi'], ['す', 'ス', 'su'], ['せ', 'セ', 'se'], ['そ', 'ソ', 'so'],
  ['た', 'タ', 'ta'], ['ち', 'チ', 'chi'], ['つ', 'ツ', 'tsu'], ['て', 'テ', 'te'], ['と', 'ト', 'to'],
  ['な', 'ナ', 'na'], ['に', 'ニ', 'ni'], ['ぬ', 'ヌ', 'nu'], ['ね', 'ネ', 'ne'], ['の', 'ノ', 'no'],
  ['は', 'ハ', 'ha'], ['ひ', 'ヒ', 'hi'], ['ふ', 'フ', 'fu'], ['へ', 'ヘ', 'he'], ['ほ', 'ホ', 'ho'],
  ['ま', 'マ', 'ma'], ['み', 'ミ', 'mi'], ['む', 'ム', 'mu'], ['め', 'メ', 'me'], ['も', 'モ', 'mo'],
  ['や', 'ヤ', 'ya'], ['ゆ', 'ユ', 'yu'], ['よ', 'ヨ', 'yo'],
  ['ら', 'ラ', 'ra'], ['り', 'リ', 'ri'], ['る', 'ル', 'ru'], ['れ', 'レ', 're'], ['ろ', 'ロ', 'ro'],
  ['わ', 'ワ', 'wa'], ['を', 'ヲ', 'wo'], ['ん', 'ン', 'n'],
];

export function makeKanaRound(script, count, random = Math.random) {
  if (!['hiragana', 'katakana'].includes(script)) throw new TypeError('Choose hiragana or katakana.');
  if (![5, 10, 20].includes(Number(count))) throw new RangeError('Choose 5, 10 or 20 questions.');
  const rows = shuffleItems(basicKana, random).slice(0, Number(count));
  return rows.map((row) => ({ symbol: row[script === 'hiragana' ? 0 : 1], answer: row[2] }));
}

export function kanaChoices(answer, random = Math.random) {
  const answers = basicKana.map((row) => row[2]);
  if (!answers.includes(answer)) throw new TypeError('Choose a basic kana answer.');
  const others = shuffleItems(answers.filter((item) => item !== answer), random).slice(0, 3);
  return shuffleItems([answer, ...others], random);
}

const basicHangul = [
  ['ㄱ', 'g'], ['ㄴ', 'n'], ['ㄷ', 'd'], ['ㄹ', 'r'], ['ㅁ', 'm'], ['ㅂ', 'b'], ['ㅅ', 's'], ['ㅇ', 'ng'], ['ㅈ', 'j'], ['ㅊ', 'ch'], ['ㅋ', 'k'], ['ㅌ', 't'], ['ㅍ', 'p'], ['ㅎ', 'h'],
  ['ㅏ', 'a'], ['ㅑ', 'ya'], ['ㅓ', 'eo'], ['ㅕ', 'yeo'], ['ㅗ', 'o'], ['ㅛ', 'yo'], ['ㅜ', 'u'], ['ㅠ', 'yu'], ['ㅡ', 'eu'], ['ㅣ', 'i'],
];

export function makeHangulRound(group, count, random = Math.random) {
  if (!['all', 'consonants', 'vowels'].includes(group)) throw new TypeError('Choose all, consonants or vowels.');
  if (![5, 10, 20].includes(Number(count))) throw new RangeError('Choose 5, 10 or 20 questions.');
  const items = group === 'all' ? basicHangul : basicHangul.filter(([symbol]) => group === 'consonants' ? /[ㄱ-ㅎ]/u.test(symbol) : /[ㅏ-ㅣ]/u.test(symbol));
  if (Number(count) > items.length) throw new RangeError('There are not enough symbols for that round.');
  return shuffleItems(items, random).slice(0, Number(count)).map(([symbol, answer]) => ({ symbol, answer }));
}

export function hangulChoices(answer, random = Math.random) {
  const answers = basicHangul.map(([, value]) => value);
  if (!answers.includes(answer)) throw new TypeError('Choose a basic Hangul reading.');
  return shuffleItems([answer, ...shuffleItems(answers.filter((item) => item !== answer), random).slice(0, 3)], random);
}

const gridSize = 4;
const validate2048Board = (board) => {
  if (!Array.isArray(board) || board.length !== gridSize * gridSize || board.some((value) => !Number.isSafeInteger(value) || value < 0 || (value && !Number.isInteger(Math.log2(value))))) throw new TypeError('Use a 4 by 4 board with non-negative powers of two.');
};

export function create2048Board(random = Math.random) {
  const board = Array(16).fill(0);
  return spawn2048Tile(spawn2048Tile(board, random), random);
}

export function spawn2048Tile(board, random = Math.random) {
  validate2048Board(board);
  if (typeof random !== 'function') throw new TypeError('Provide a random function.');
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  const empty = board.flatMap((tile, index) => tile === 0 ? [index] : []);
  if (!empty.length) return [...board];
  const position = Math.floor(value * empty.length);
  return board.map((tile, index) => index === empty[position] ? (random() >= 0.9 ? 4 : 2) : tile);
}

export function move2048(board, direction) {
  validate2048Board(board);
  if (!['left', 'right', 'up', 'down'].includes(direction)) throw new TypeError('Choose left, right, up or down.');
  const next = [...board];
  let score = 0;
  const lines = Array.from({ length: 4 }, (_, line) => Array.from({ length: 4 }, (_, offset) => {
    const step = direction === 'left' || direction === 'right' ? offset : offset * 4;
    const base = direction === 'left' || direction === 'up' ? 0 : 3;
    const origin = direction === 'left' || direction === 'right' ? line * 4 : line;
    const sign = direction === 'left' || direction === 'up' ? 1 : -1;
    return origin + base * (direction === 'left' || direction === 'right' ? 1 : 4) + sign * step;
  }));
  for (const indexes of lines) {
    const values = indexes.map((index) => board[index]).filter(Boolean);
    const merged = [];
    for (let index = 0; index < values.length; index += 1) {
      if (values[index] === values[index + 1]) {
        const value = values[index] * 2;
        if (!Number.isSafeInteger(value) || !Number.isSafeInteger(score + value)) throw new RangeError('The score exceeds the safe integer limit.');
        merged.push(value); score += value; index += 1;
      } else merged.push(values[index]);
    }
    while (merged.length < 4) merged.push(0);
    indexes.forEach((boardIndex, index) => { next[boardIndex] = merged[index]; });
  }
  return { board: next, score, changed: next.some((value, index) => value !== board[index]) };
}

export function canMove2048(board) {
  validate2048Board(board);
  if (board.includes(0)) return true;
  return board.some((value, index) => (index % 4 < 3 && value === board[index + 1]) || (index < 12 && value === board[index + 4]));
}

const sudokuFullMask = (1 << 9) - 1;
const sudokuBox = (row, column) => Math.floor(row / 3) * 3 + Math.floor(column / 3);

function sudokuMasks(board) {
  if (!Array.isArray(board) || board.length !== 81 || board.some((value) => !Number.isInteger(value) || value < 0 || value > 9)) throw new TypeError('Use a Sudoku board with 81 cells from 0 to 9.');
  const rows = Array(9).fill(0); const columns = Array(9).fill(0); const boxes = Array(9).fill(0);
  for (let index = 0; index < 81; index += 1) {
    const value = board[index];
    if (!value) continue;
    const row = Math.floor(index / 9); const column = index % 9; const box = sudokuBox(row, column); const bit = 1 << (value - 1);
    if ((rows[row] | columns[column] | boxes[box]) & bit) throw new TypeError('The starting Sudoku clues conflict.');
    rows[row] |= bit; columns[column] |= bit; boxes[box] |= bit;
  }
  return { rows, columns, boxes };
}

export function countSudokuSolutions(source, limit = 2) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 2) throw new RangeError('Solution limit must be 1 or 2.');
  const board = [...source];
  const { rows, columns, boxes } = sudokuMasks(board);
  let count = 0;
  const search = () => {
    if (count >= limit) return;
    let bestIndex = -1; let bestMask = 0; let bestCount = 10;
    for (let index = 0; index < 81; index += 1) {
      if (board[index]) continue;
      const row = Math.floor(index / 9); const column = index % 9; const box = sudokuBox(row, column);
      const mask = sudokuFullMask & ~(rows[row] | columns[column] | boxes[box]);
      const options = mask.toString(2).replaceAll('0', '').length;
      if (options < bestCount) { bestIndex = index; bestMask = mask; bestCount = options; if (options <= 1) break; }
    }
    if (bestIndex < 0) { count += 1; return; }
    if (!bestMask) return;
    const row = Math.floor(bestIndex / 9); const column = bestIndex % 9; const box = sudokuBox(row, column);
    for (let bit = 1; bit <= 1 << 8; bit <<= 1) {
      if (!(bestMask & bit)) continue;
      board[bestIndex] = Math.log2(bit) + 1; rows[row] |= bit; columns[column] |= bit; boxes[box] |= bit;
      search();
      board[bestIndex] = 0; rows[row] ^= bit; columns[column] ^= bit; boxes[box] ^= bit;
      if (count >= limit) return;
    }
  };
  search();
  return count;
}

function shuffledSudokuSolution(random) {
  const bands = shuffleItems([0, 1, 2], random).flatMap((band) => shuffleItems([0, 1, 2], random).map((row) => band * 3 + row));
  const stacks = shuffleItems([0, 1, 2], random).flatMap((stack) => shuffleItems([0, 1, 2], random).map((column) => stack * 3 + column));
  const digits = shuffleItems([1, 2, 3, 4, 5, 6, 7, 8, 9], random);
  const transpose = random();
  if (!Number.isFinite(transpose) || transpose < 0 || transpose >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return Array.from({ length: 9 }, (_, row) => Array.from({ length: 9 }, (_, column) => {
    const sourceRow = bands[row]; const sourceColumn = stacks[column];
    const raw = ((sourceRow * 3 + Math.floor(sourceRow / 3) + sourceColumn) % 9) + 1;
    return digits[raw - 1];
  })).flat().map((value, index, board) => {
    if (transpose < 0.5) return value;
    return board[(index % 9) * 9 + Math.floor(index / 9)];
  });
}

export function generateSudokuPuzzle(difficulty = 'medium', random = Math.random) {
  const targets = { easy: 36, medium: 44, hard: 50 };
  const blanksTarget = targets[difficulty];
  if (!blanksTarget) throw new TypeError('Choose easy, medium or hard Sudoku difficulty.');
  if (typeof random !== 'function') throw new TypeError('Provide a random function.');
  const solution = shuffledSudokuSolution(random);
  const puzzle = [...solution];
  let blanks = 0;
  for (const index of shuffleItems(Array.from({ length: 81 }, (_, value) => value), random)) {
    if (blanks >= blanksTarget) break;
    const clue = puzzle[index]; puzzle[index] = 0;
    if (countSudokuSolutions(puzzle, 2) === 1) blanks += 1;
    else puzzle[index] = clue;
  }
  if (countSudokuSolutions(puzzle, 2) !== 1) throw new Error('Could not create a unique Sudoku puzzle.');
  return { puzzle, solution, difficulty, blanks };
}

export function makeAbacusProblem(random = Math.random) {
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  const sample = () => {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
    return Math.floor(value * 9900) + 100;
  };
  const left = sample(); const right = sample();
  return { left, right, sum: left + right };
}

export function abacusValue(digits) {
  if (!Array.isArray(digits) || digits.length !== 5 || digits.some((digit) => !Number.isInteger(digit) || digit < 0 || digit > 9)) throw new RangeError('Use five abacus rods with values from 0 to 9.');
  return digits.reduce((total, digit, index) => total + digit * (10 ** index), 0);
}

export function changeAbacusRod(digits, place, delta) {
  abacusValue(digits);
  if (!Number.isInteger(place) || place < 0 || place >= digits.length || ![-1, 1].includes(delta)) throw new RangeError('Choose an abacus rod and a one-step change.');
  const next = [...digits];
  next[place] = Math.max(0, Math.min(9, next[place] + delta));
  return next;
}

export function parseSpellingWords(source) {
  const lines = String(source ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2 || lines.length > 100) throw new RangeError('Enter between 2 and 100 non-empty word | hint lines.');
  const entries = lines.map((line) => {
    const separator = line.indexOf('|');
    const word = (separator < 0 ? '' : line.slice(0, separator)).trim().normalize('NFC');
    const hint = (separator < 0 ? '' : line.slice(separator + 1)).trim().normalize('NFC');
    if ([...word].length < 1 || [...word].length > 64 || !hint || [...hint].length > 160) throw new TypeError('Each line needs a word and a hint separated by |.');
    return { word, hint };
  });
  if (new Set(entries.map(({ word }) => word.toLowerCase())).size !== entries.length) throw new TypeError('Words must be unique.');
  return entries;
}

export function checkSpelling(guess, target) {
  const answer = String(target ?? '').normalize('NFC').trim();
  const value = String(guess ?? '').normalize('NFC').trim();
  if (!answer) throw new TypeError('Choose a word to practice.');
  return Boolean(value) && value.toLowerCase() === answer.toLowerCase();
}
