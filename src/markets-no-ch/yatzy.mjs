export const YATZY_CATEGORIES = Object.freeze([
  'ones1', 'ones2', 'ones3', 'ones4', 'ones5', 'ones6', 'onePair', 'twoPairs',
  'threeKind', 'fourKind', 'smallStraight', 'largeStraight', 'fullHouse', 'chance', 'yatzy',
]);

export function scoreYatzyCategory(dice, key) {
  if (!Array.isArray(dice) || dice.length !== 5 || dice.some((die) => !Number.isInteger(die) || die < 1 || die > 6)) {
    throw new TypeError('Yatzy needs five dice with faces from 1 through 6.');
  }
  if (!YATZY_CATEGORIES.includes(key)) throw new RangeError('Unknown Yatzy score category.');
  const counts = Array(7).fill(0);
  dice.forEach((die) => { counts[die] += 1; });
  if (/^ones[1-6]$/u.test(key)) {
    const face = Number(key.at(-1));
    return counts[face] * face;
  }
  const groups = counts.slice(1).sort((a, b) => b - a);
  const total = dice.reduce((sum, die) => sum + die, 0);
  if (key === 'onePair') {
    for (let face = 6; face >= 1; face -= 1) if (counts[face] >= 2) return face * 2;
    return 0;
  }
  if (key === 'twoPairs') {
    const faces = counts.map((count, face) => count === 2 ? face : 0).filter(Boolean);
    return faces.length === 2 ? (faces[0] + faces[1]) * 2 : 0;
  }
  if (key === 'threeKind') return groups[0] >= 3 ? total : 0;
  if (key === 'fourKind') return groups[0] >= 4 ? total : 0;
  if (key === 'fullHouse') return groups.includes(3) && groups.includes(2) ? total : 0;
  if (key === 'smallStraight') return [1, 2, 3, 4, 5].every((face) => counts[face] > 0) ? 15 : 0;
  if (key === 'largeStraight') return [2, 3, 4, 5, 6].every((face) => counts[face] > 0) ? 20 : 0;
  if (key === 'chance') return total;
  if (key === 'yatzy') return groups[0] === 5 ? 50 : 0;
  return 0;
}

export function calculateYatzyTotals(scores) {
  if (!scores || typeof scores !== 'object' || Array.isArray(scores)) throw new TypeError('Yatzy scores must be an object.');
  const upperKeys = YATZY_CATEGORIES.filter((key) => /^ones[1-6]$/u.test(key));
  const lowerKeys = YATZY_CATEGORIES.filter((key) => !upperKeys.includes(key));
  for (const [key, value] of Object.entries(scores)) {
    if (!YATZY_CATEGORIES.includes(key) || !Number.isInteger(value) || value < 0) throw new RangeError('Yatzy score sheet contains an invalid category or score.');
  }
  const upperSubtotal = upperKeys.reduce((sum, key) => sum + (scores[key] ?? 0), 0);
  const lowerSubtotal = lowerKeys.reduce((sum, key) => sum + (scores[key] ?? 0), 0);
  const bonus = upperKeys.every((key) => key in scores) && upperSubtotal >= 63 ? 50 : 0;
  return { upperSubtotal, bonus, lowerSubtotal, total: upperSubtotal + bonus + lowerSubtotal };
}
