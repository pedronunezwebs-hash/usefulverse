export const GAD7_ITEM_COUNT = 7;
export const GAD7_MAX_SCORE = 21;
export const GAD7_OPTIONS = Object.freeze([0, 1, 2, 3]);

export function scoreGad7(answers) {
  if (!Array.isArray(answers) || answers.length !== GAD7_ITEM_COUNT) throw new Error('incomplete-answers');
  if (answers.some((answer) => !GAD7_OPTIONS.includes(answer))) throw new Error('invalid-answer');
  const total = answers.reduce((sum, answer) => sum + answer, 0);
  const severity = total < 5 ? 'minimal' : total < 10 ? 'mild' : total < 15 ? 'moderate' : 'severe';
  return { total, severity, furtherEvaluationCutpointMet: total >= 10 };
}

export function validateGad7Difficulty(value) {
  const difficulty = Number(value);
  if (!Number.isInteger(difficulty) || difficulty < 0 || difficulty > 3) throw new Error('invalid-difficulty');
  return difficulty;
}
