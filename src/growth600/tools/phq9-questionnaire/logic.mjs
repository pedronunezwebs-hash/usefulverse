export const PHQ9_MAX_SCORE = 27;
export const PHQ9_ITEM_COUNT = 9;
export const PHQ9_OPTIONS = Object.freeze([0, 1, 2, 3]);

export function scorePhq9(answers) {
  if (!Array.isArray(answers) || answers.length !== PHQ9_ITEM_COUNT) throw new Error('incomplete-answers');
  if (answers.some((answer) => !PHQ9_OPTIONS.includes(answer))) throw new Error('invalid-answer');
  const total = answers.reduce((sum, answer) => sum + answer, 0);
  const severity = total < 5 ? 'minimal' : total < 10 ? 'mild' : total < 15 ? 'moderate' : total < 20 ? 'moderately-severe' : 'severe';
  return { total, severity, selfHarmItemPositive: answers[8] > 0 };
}

export function validateDifficulty(value) {
  const difficulty = Number(value);
  if (!Number.isInteger(difficulty) || difficulty < 0 || difficulty > 3) throw new Error('invalid-difficulty');
  return difficulty;
}
