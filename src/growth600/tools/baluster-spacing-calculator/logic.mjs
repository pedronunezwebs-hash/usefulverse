export const BALUSTER_LENGTH_TO_MM = Object.freeze({ mm: 1, cm: 10, m: 1000, in: 25.4, ft: 304.8 });

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

function cleanRound(value) {
  return Math.round((value + Number.EPSILON) * 1e9) / 1e9;
}

export function calculateBalusterSpacing({ mode = 'max-gap', openingWidth, balusterWidth, unit = 'in', balusterCount, maximumGap } = {}) {
  const factor = BALUSTER_LENGTH_TO_MM[unit];
  if (!factor) throw new TypeError('Choose a supported length unit.');
  const openingMm = bounded('Clear opening width', openingWidth, 0.1, 1_000_000) * factor;
  const balusterMm = bounded('Baluster width', balusterWidth, 0.01, 100_000) * factor;
  if (balusterMm >= openingMm) throw new RangeError('A baluster must be narrower than the clear opening.');

  let count;
  if (mode === 'max-gap') {
    const gapMm = bounded('Maximum clear gap', maximumGap, 0.01, 1_000_000) * factor;
    count = Math.max(1, Math.ceil((openingMm - gapMm) / (balusterMm + gapMm) - 1e-12));
    while ((openingMm - count * balusterMm) / (count + 1) > gapMm + 1e-9) count += 1;
    if (count > 1000) throw new RangeError('The requested maximum gap requires more than 1,000 balusters.');
  } else if (mode === 'count') {
    if (!Number.isInteger(balusterCount) || balusterCount < 1 || balusterCount > 1000) throw new RangeError('Baluster count must be a whole number from 1 to 1,000.');
    count = balusterCount;
  } else {
    throw new TypeError('Choose maximum-gap or fixed-count mode.');
  }

  const remainingMm = openingMm - count * balusterMm;
  if (remainingMm < -1e-9) throw new RangeError('The selected balusters do not fit inside the clear opening.');
  const gapMm = Math.max(0, remainingMm) / (count + 1);
  return Object.freeze({
    mode, unit, openingWidth, balusterWidth, openingMm, balusterMm,
    balusterCount: count, gapCount: count + 1,
    clearGap: cleanRound(gapMm / factor), clearGapMm: cleanRound(gapMm),
    totalBalusterWidth: cleanRound((count * balusterMm) / factor),
    totalClearGap: cleanRound(((count + 1) * gapMm) / factor),
    maximumGap: mode === 'max-gap' ? maximumGap : null,
  });
}
