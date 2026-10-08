const MAX_INTERVALS = 20;
const MAX_ABSOLUTE_ENDPOINT = 1_000_000_000;

function endpointValue(input, side) {
  const text = String(input ?? '').trim().replaceAll('−', '-');
  if (/^(?:-?∞|-?infinity)$/iu.test(text)) {
    if (side === 'left' && /^-?(?:∞|infinity)$/iu.test(text) && text.startsWith('-')) return -Infinity;
    if (side === 'right' && /^(?:∞|infinity)$/iu.test(text)) return Infinity;
    throw new RangeError('Infinity is only valid at the outside end of an interval.');
  }
  const fraction = text.match(/^([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)$/u);
  const value = fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(text);
  if (!text || !Number.isFinite(value) || Math.abs(value) > MAX_ABSOLUTE_ENDPOINT || (fraction && Number(fraction[2]) === 0)) {
    throw new RangeError('Enter a finite number or a fraction with a non-zero denominator.');
  }
  return value;
}

function parseInterval(line, index) {
  const text = String(line).trim().replaceAll('−', '-');
  const point = text.match(/^([+-]?\d+(?:\.\d+)?|[+-]?\d+\s*\/\s*[+-]?\d+)$/u);
  if (point) {
    const value = endpointValue(point[1], 'point');
    return Object.freeze({ lower: value, upper: value, lowerClosed: true, upperClosed: true, point: true, source: text });
  }
  const match = text.match(/^([[(])\s*([^,]+)\s*,\s*([^\])]+)\s*([\])])$/u);
  if (!match) throw new RangeError(`Interval ${index + 1} must look like (1, 3] or [1/2, 2).`);
  const [, leftMark, leftText, rightText, rightMark] = match;
  const lower = endpointValue(leftText, 'left');
  const upper = endpointValue(rightText, 'right');
  const lowerClosed = leftMark === '[';
  const upperClosed = rightMark === ']';
  if (lower === -Infinity && lowerClosed || upper === Infinity && upperClosed) throw new RangeError('Infinite endpoints must be open.');
  if (!(lower < upper) && !(lower === upper && lowerClosed && upperClosed)) throw new RangeError(`Interval ${index + 1} is empty or reversed.`);
  return Object.freeze({ lower, upper, lowerClosed, upperClosed, point: lower === upper, source: text });
}

export function parseNumberLineIntervals(input) {
  const lines = String(input ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) throw new RangeError('Enter at least one interval or point.');
  if (lines.length > MAX_INTERVALS) throw new RangeError(`Plot no more than ${MAX_INTERVALS} intervals at once.`);
  const intervals = lines.map(parseInterval);
  const finite = intervals.flatMap(({ lower, upper }) => [lower, upper].filter(Number.isFinite));
  const low = finite.length ? Math.min(...finite) : -1;
  const high = finite.length ? Math.max(...finite) : 1;
  const span = Math.max(high - low, Math.abs(high) * 0.2, Math.abs(low) * 0.2, 2);
  const padding = span * 0.12;
  const plotMin = Math.min(low - padding, intervals.some(({ lower }) => lower === -Infinity) ? low - span * 0.4 : Infinity);
  const plotMax = Math.max(high + padding, intervals.some(({ upper }) => upper === Infinity) ? high + span * 0.4 : -Infinity);
  return Object.freeze({ intervals: Object.freeze(intervals), plotMin, plotMax });
}
