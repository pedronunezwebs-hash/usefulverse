const MAX_PAIRS = 500;
const MAX_ABSOLUTE_VALUE = 1e12;
const EXACT_MAX_NONZERO = 25;

function parseNumber(token) {
  const normalized = token.replace(/[٠-٩۰-۹]/gu, (digit) => {
    const code = digit.codePointAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  }).replace(/[−–]/gu, '-').replace(/٫/gu, '.');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/iu.test(normalized)) throw new SyntaxError('Enter finite decimal values separated by a comma, semicolon or space.');
  const value = Number(normalized);
  if (!Number.isFinite(value) || Math.abs(value) > MAX_ABSOLUTE_VALUE) throw new RangeError('Each paired value must be within ±1,000,000,000,000.');
  return value;
}

export function parseWilcoxonPairs(source) {
  const text = String(source ?? '').trim();
  if (!text) throw new RangeError('Enter paired before and after values, one pair per line.');
  const lines = text.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2 || lines.length > MAX_PAIRS) throw new RangeError(`Enter between 2 and ${MAX_PAIRS} pairs.`);
  return lines.map((line, index) => {
    const values = line.split(/[\s,;،؛]+/u).filter(Boolean);
    if (values.length !== 2) throw new SyntaxError(`Line ${index + 1} must contain exactly two values.`);
    return Object.freeze({ before: parseNumber(values[0]), after: parseNumber(values[1]), index });
  });
}

export function averageAbsoluteRanks(differences) {
  const nonzero = differences.map((difference, index) => ({ difference, index, magnitude: Math.abs(difference) })).filter(({ difference }) => difference !== 0);
  const ordered = [...nonzero].sort((a, b) => a.magnitude - b.magnitude || a.index - b.index);
  const ranks = Array(differences.length).fill(null);
  const ties = [];
  for (let start = 0; start < ordered.length;) {
    let end = start + 1;
    while (end < ordered.length && ordered[end].magnitude === ordered[start].magnitude) end += 1;
    const rank = ((start + 1) + end) / 2;
    for (let cursor = start; cursor < end; cursor += 1) ranks[ordered[cursor].index] = rank;
    if (end - start > 1) ties.push(Object.freeze({ magnitude: ordered[start].magnitude, count: end - start, rank }));
    start = end;
  }
  return Object.freeze({ ranks: Object.freeze(ranks), ties: Object.freeze(ties), nonzeroCount: nonzero.length });
}

function normalCdf(value) {
  const x = Math.abs(value);
  const t = 1 / (1 + 0.2316419 * x);
  const density = 0.3989422804014327 * Math.exp(-0.5 * x * x);
  const tail = density * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return value >= 0 ? 1 - tail : tail;
}

function exactTwoSidedP(ranks, positiveRankSum) {
  const units = ranks.map((rank) => Math.round(rank * 2));
  const total = units.reduce((sum, rank) => sum + rank, 0);
  const observedDistance = Math.abs(2 * Math.round(positiveRankSum * 2) - total);
  const distribution = Array(total + 1).fill(0n);
  distribution[0] = 1n;
  let reached = 0;
  for (const rank of units) {
    for (let sum = reached; sum >= 0; sum -= 1) {
      if (distribution[sum]) distribution[sum + rank] += distribution[sum];
    }
    reached += rank;
  }
  let extreme = 0n;
  for (let sum = 0; sum <= total; sum += 1) {
    if (Math.abs(2 * sum - total) >= observedDistance) extreme += distribution[sum];
  }
  return Number(extreme) / (2 ** units.length);
}

function normalApproximation(ranks, positiveRankSum) {
  const total = ranks.reduce((sum, rank) => sum + rank, 0);
  const mean = total / 2;
  const variance = ranks.reduce((sum, rank) => sum + rank * rank, 0) / 4;
  const distance = Math.max(0, Math.abs(positiveRankSum - mean) - 0.5);
  const z = variance === 0 ? 0 : distance / Math.sqrt(variance);
  return Object.freeze({ pValue: Math.min(1, 2 * normalCdf(-z)), zStatistic: z });
}

export function calculateWilcoxonSignedRank(source) {
  const pairs = Array.isArray(source) ? source : parseWilcoxonPairs(source);
  if (pairs.length < 2 || pairs.length > MAX_PAIRS || pairs.some(({ before, after }) => !Number.isFinite(before) || !Number.isFinite(after) || Math.abs(before) > MAX_ABSOLUTE_VALUE || Math.abs(after) > MAX_ABSOLUTE_VALUE)) throw new RangeError(`Use between 2 and ${MAX_PAIRS} finite before/after pairs within the stated limit.`);
  const differences = pairs.map(({ before, after }) => after - before);
  const ranking = averageAbsoluteRanks(differences);
  const zeroDifferenceCount = differences.length - ranking.nonzeroCount;
  if (ranking.nonzeroCount === 0) {
    return Object.freeze({ status: 'all-zero', methodKey: 'unavailable', count: pairs.length, nonzeroCount: 0, zeroDifferenceCount, positiveRankSum: 0, negativeRankSum: 0, pValue: null, method: 'No nonzero paired differences' });
  }
  const positiveRankSum = differences.reduce((sum, difference, index) => sum + (difference > 0 ? ranking.ranks[index] : 0), 0);
  const totalRankSum = ranking.ranks.reduce((sum, rank) => sum + (rank ?? 0), 0);
  const negativeRankSum = totalRankSum - positiveRankSum;
  const exact = ranking.nonzeroCount <= EXACT_MAX_NONZERO;
  const approximation = exact ? null : normalApproximation(ranking.ranks.filter((rank) => rank !== null), positiveRankSum);
  const pValue = exact
    ? exactTwoSidedP(ranking.ranks.filter((rank) => rank !== null), positiveRankSum)
    : approximation.pValue;
  return Object.freeze({
    status: 'calculated', count: pairs.length, nonzeroCount: ranking.nonzeroCount, zeroDifferenceCount,
    methodKey: exact ? 'exact' : 'approximation',
    positiveRankSum, negativeRankSum, pValue,
    method: exact ? 'Exact two-sided sign-flip distribution using average ranks' : 'Two-sided normal approximation with continuity correction',
    zStatistic: approximation?.zStatistic ?? null,
    tiedGroups: ranking.ties,
    pairs: Object.freeze(pairs.map(({ before, after }, index) => Object.freeze({ before, after, difference: differences[index], absoluteRank: ranking.ranks[index], signedRank: ranking.ranks[index] === null ? 0 : Math.sign(differences[index]) * ranking.ranks[index] }))),
  });
}

export const WILCOXON_LIMITS = Object.freeze({ maxPairs: MAX_PAIRS, maxAbsoluteValue: MAX_ABSOLUTE_VALUE, exactMaxNonzero: EXACT_MAX_NONZERO });
