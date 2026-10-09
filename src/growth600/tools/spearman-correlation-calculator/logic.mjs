const MAX_POINTS = 500;
const MAX_ABSOLUTE_VALUE = 1e12;

function parseNumber(token) {
  const normalized = token.replace(/[٠-٩۰-۹]/gu, (digit) => {
    const code = digit.codePointAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  }).replace(/[−–]/gu, '-').replace(/٫/gu, '.');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/iu.test(normalized)) throw new SyntaxError('Use finite decimal numbers; separate each x and y with a comma or space.');
  const value = Number(normalized);
  if (!Number.isFinite(value) || Math.abs(value) > MAX_ABSOLUTE_VALUE) throw new RangeError('Values must be finite and no larger than 1,000,000,000,000 in magnitude.');
  return value;
}

export function parseSpearmanPairs(source) {
  const text = String(source ?? '').trim();
  if (!text) throw new RangeError('Enter paired x and y values, one pair per line.');
  const lines = text.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2 || lines.length > MAX_POINTS) throw new RangeError(`Enter between 2 and ${MAX_POINTS} pairs.`);
  return lines.map((line, index) => {
    const values = line.split(/[\s,;،؛]+/u).filter(Boolean);
    if (values.length !== 2) throw new SyntaxError(`Line ${index + 1} must contain exactly two values.`);
    return Object.freeze({ x: parseNumber(values[0]), y: parseNumber(values[1]), index });
  });
}

export function averageRanks(values) {
  if (!Array.isArray(values) || values.length < 2 || values.some((value) => !Number.isFinite(value))) throw new TypeError('Ranks require at least two finite values.');
  const sorted = values.map((value, index) => ({ value, index })).sort((left, right) => left.value - right.value || left.index - right.index);
  const ranks = Array(values.length);
  const tieGroups = [];
  for (let start = 0; start < sorted.length;) {
    let end = start + 1;
    while (end < sorted.length && sorted[end].value === sorted[start].value) end += 1;
    const rank = ((start + 1) + end) / 2;
    for (let cursor = start; cursor < end; cursor += 1) ranks[sorted[cursor].index] = rank;
    if (end - start > 1) tieGroups.push(Object.freeze({ value: sorted[start].value, count: end - start, rank }));
    start = end;
  }
  return Object.freeze({ ranks: Object.freeze(ranks), tieGroups: Object.freeze(tieGroups) });
}

function pearson(left, right) {
  const meanLeft = left.reduce((sum, value) => sum + value, 0) / left.length;
  const meanRight = right.reduce((sum, value) => sum + value, 0) / right.length;
  const centeredLeft = left.map((value) => value - meanLeft);
  const centeredRight = right.map((value) => value - meanRight);
  const denominator = Math.hypot(...centeredLeft) * Math.hypot(...centeredRight);
  if (denominator === 0) throw new RangeError('Spearman rho is undefined when either series has no variation.');
  const correlation = centeredLeft.reduce((sum, value, index) => sum + value * centeredRight[index], 0) / denominator;
  if (Math.abs(1 - Math.abs(correlation)) <= Number.EPSILON * 8) return Math.sign(correlation);
  return Math.max(-1, Math.min(1, correlation));
}

export function calculateSpearman(source) {
  const pairs = Array.isArray(source) ? source : parseSpearmanPairs(source);
  if (pairs.length < 2 || pairs.length > MAX_POINTS || pairs.some(({ x, y }) => !Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > MAX_ABSOLUTE_VALUE || Math.abs(y) > MAX_ABSOLUTE_VALUE)) throw new RangeError(`Use between 2 and ${MAX_POINTS} finite x,y pairs.`);
  const xRanking = averageRanks(pairs.map(({ x }) => x));
  const yRanking = averageRanks(pairs.map(({ y }) => y));
  const rho = pearson(xRanking.ranks, yRanking.ranks);
  return Object.freeze({
    rho,
    count: pairs.length,
    pairs: Object.freeze(pairs.map(({ x, y }, index) => Object.freeze({ x, y, rankX: xRanking.ranks[index], rankY: yRanking.ranks[index] }))),
    tiedX: xRanking.tieGroups,
    tiedY: yRanking.tieGroups,
  });
}

export const SPEARMAN_LIMITS = Object.freeze({ maxPoints: MAX_POINTS, maxAbsoluteValue: MAX_ABSOLUTE_VALUE });
