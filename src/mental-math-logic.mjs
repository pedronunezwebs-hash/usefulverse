const integer = (value, name, min, max) => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new RangeError(`${name} must be an integer from ${min} to ${max}.`);
  return number;
};

export function createMentalMathProblem({ operation = 'mixed', difficulty = 'easy' } = {}, random = Math.random) {
  if (!['mixed', 'addition', 'subtraction', 'multiplication', 'division'].includes(operation)) throw new TypeError('Choose a supported operation.');
  if (!['easy', 'medium', 'hard'].includes(difficulty)) throw new TypeError('Choose a supported difficulty.');
  const ops = operation === 'mixed' ? ['addition', 'subtraction', 'multiplication', 'division'] : [operation];
  const selected = ops[Math.floor(random() * ops.length)];
  const randInt = (min, max) => Math.floor(random() * (max - min + 1)) + min;
  const bounds = { easy: { add: 20, mult: 10 }, medium: { add: 100, mult: 15 }, hard: { add: 1000, mult: 25 } }[difficulty];
  let a; let b; let answer; let symbol;
  if (selected === 'addition') {
    a = randInt(0, bounds.add); b = randInt(0, bounds.add); answer = a + b; symbol = '+';
  } else if (selected === 'subtraction') {
    a = randInt(0, bounds.add); b = randInt(0, bounds.add); if (b > a) [a, b] = [b, a]; answer = a - b; symbol = '−';
  } else if (selected === 'multiplication') {
    const min = difficulty === 'easy' ? 0 : difficulty === 'medium' ? 2 : 10;
    a = randInt(min, bounds.mult); b = randInt(min, bounds.mult); answer = a * b; symbol = '×';
  } else {
    const max = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 50;
    b = randInt(1, max); answer = randInt(0, max); a = b * answer; symbol = '÷';
  }
  return { a, b, symbol, answer };
}

export function validateMentalMathSettings({ operation, difficulty, questions }) {
  if (!['mixed', 'addition', 'subtraction', 'multiplication', 'division'].includes(operation)) throw new TypeError('Choose a supported operation.');
  if (!['easy', 'medium', 'hard'].includes(difficulty)) throw new TypeError('Choose a supported difficulty.');
  return { operation, difficulty, questions: integer(questions, 'Questions', 5, 20) };
}

export function parseMentalMathAnswer(value) {
  const text = String(value ?? '').trim();
  if (!/^-?\d{1,7}$/u.test(text)) throw new TypeError('Enter a whole-number answer.');
  return Number(text);
}
