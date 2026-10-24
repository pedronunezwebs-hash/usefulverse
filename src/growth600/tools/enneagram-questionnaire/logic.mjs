export const ENNEAGRAM_QUESTION_THEMES = Object.freeze([
  1,1,1, 2,2,2, 3,3,3, 4,4,4, 5,5,5, 6,6,6, 7,7,7, 8,8,8, 9,9,9,
]);

export function scoreEnneagramReflection(responses, questionThemes = ENNEAGRAM_QUESTION_THEMES) {
  if (!Array.isArray(responses) || responses.length !== 27 || !Array.isArray(questionThemes) || questionThemes.length !== 27) {
    throw new RangeError('Answer all 27 reflection questions.');
  }
  const totals = Array(9).fill(0);
  const counts = Array(9).fill(0);
  responses.forEach((response, index) => {
    const value = typeof response === 'number' ? response : typeof response === 'string' && /^[1-5]$/u.test(response) ? Number(response) : NaN;
    const theme = Number(questionThemes[index]);
    if (!Number.isInteger(value) || value < 1 || value > 5 || !Number.isInteger(theme) || theme < 1 || theme > 9) {
      throw new RangeError('Choose one response from 1 to 5 for every question.');
    }
    totals[theme - 1] += value;
    counts[theme - 1] += 1;
  });
  if (counts.some((count) => count !== 3)) throw new RangeError('Each reflection theme must have exactly three questions.');
  const ranking = totals.map((points, index) => Object.freeze({ theme: index + 1, points, outOf: 15 })).sort((a, b) => b.points - a.points || a.theme - b.theme);
  const highest = ranking[0].points;
  const next = ranking.find(({ points }) => points < highest)?.points;
  return Object.freeze({
    leaders: Object.freeze(ranking.filter(({ points }) => points === highest)),
    closeMatches: Object.freeze(next === undefined ? [] : ranking.filter(({ points }) => points === next)),
    ranking: Object.freeze(ranking),
  });
}
