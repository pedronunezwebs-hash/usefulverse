const MAX_DB = 3000;
const MAX_RATIO = 1e300;
const MIN_RATIO = 1e-300;

function number(value, name, { min = -MAX_DB, max = MAX_DB } = {}) {
  const parsed = typeof value === 'number' ? value : Number(String(value).trim().replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) throw new RangeError(`${name} is outside the supported range.`);
  return parsed;
}

function ratioForDb(db, divisor) {
  const ratio = 10 ** (db / divisor);
  if (!Number.isFinite(ratio) || ratio > MAX_RATIO) throw new RangeError('The ratio is outside the supported range.');
  return ratio;
}

export function calculateDecibels({ mode, ratio = '', inputDb = '', levels = '', inputLevel = '', gainDb = '' } = {}) {
  if (mode === 'power-ratio' || mode === 'amplitude-ratio') {
    const value = number(ratio, 'Ratio', { min: MIN_RATIO, max: MAX_RATIO });
    const divisor = mode === 'power-ratio' ? 10 : 20;
    return Object.freeze({ mode, db: divisor * Math.log10(value), ratio: value, formula: `${divisor} log10(ratio)` });
  }
  if (mode === 'db-to-power' || mode === 'db-to-amplitude') {
    const db = number(inputDb, 'Decibels');
    const divisor = mode === 'db-to-power' ? 10 : 20;
    return Object.freeze({ mode, db, ratio: ratioForDb(db, divisor), formula: `10^(dB/${divisor})` });
  }
  if (mode === 'sum-levels') {
    const parts = String(levels).split(/[\n;]+/u).map((part) => part.trim()).filter(Boolean);
    if (parts.length < 2 || parts.length > 20) throw new RangeError('Enter between 2 and 20 levels, one per line.');
    const values = parts.map((part) => number(part, 'Level'));
    const peak = Math.max(...values);
    const db = peak + 10 * Math.log10(values.reduce((sum, value) => sum + 10 ** ((value - peak) / 10), 0));
    return Object.freeze({ mode, db, count: values.length, formula: '10 log10(sum(10^(level/10)))' });
  }
  if (mode === 'apply-gain') {
    const sourceDb = number(inputLevel, 'Input level');
    const gain = number(gainDb, 'Gain');
    return Object.freeze({ mode, db: sourceDb + gain, inputLevel: sourceDb, gainDb: gain, formula: 'input level + gain' });
  }
  throw new TypeError('Choose a supported decibel calculation.');
}
