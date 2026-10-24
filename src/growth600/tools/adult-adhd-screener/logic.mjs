export const ASRS_ITEM_COUNT = 6;
export const ASRS_MAX_SCORE = 24;

export function scoreAsrsV11(answers) {
  if (!Array.isArray(answers) || answers.length !== ASRS_ITEM_COUNT) throw new Error('incomplete-answers');
  if (answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 4)) throw new Error('invalid-answer');
  const total = answers.reduce((sum, answer) => sum + answer, 0);
  const band = total < 10 ? 'low-negative' : total < 14 ? 'high-negative' : total < 18 ? 'low-positive' : 'high-positive';
  return { total, band, screenPositive: total >= 14 };
}
