const DIGIT = Object.freeze({ black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 });
const MULTIPLIER = Object.freeze({ ...DIGIT, gold: -1, silver: -2 });
const TOLERANCE = Object.freeze({ brown: 1, red: 2, green: 0.5, blue: 0.25, violet: 0.1, gray: 0.05, gold: 5, silver: 10, none: 20 });
const TCR = Object.freeze({ black: 250, brown: 100, red: 50, orange: 15, yellow: 25, green: 20, blue: 10, violet: 5, gray: 1 });
const MAX_OHMS = 1e15;

function color(value, table, label) {
  const normalized = String(value ?? '').toLowerCase();
  if (!Object.hasOwn(table, normalized)) throw new TypeError(`Choose a valid ${label} color.`);
  return normalized;
}

function finitePositive(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > MAX_OHMS) throw new RangeError(`${label} must be greater than zero and within the supported range.`);
  return number;
}

export function decodeResistorBands({ bands = 4, colors = [] } = {}) {
  const count = Number(bands);
  if (![4, 5, 6].includes(count)) throw new RangeError('Choose 4, 5 or 6 bands.');
  if (!Array.isArray(colors) || colors.length !== count) throw new TypeError(`Enter exactly ${count} band colors.`);
  const significantCount = count === 4 ? 2 : 3;
  const normalized = colors.map((value, index) => color(value, index < significantCount ? DIGIT : index === significantCount ? MULTIPLIER : index === significantCount + 1 ? TOLERANCE : TCR, 'band'));
  if (normalized[0] === 'black') throw new RangeError('The first significant band cannot be black.');
  const digits = normalized.slice(0, significantCount).map((item) => DIGIT[item]);
  const significant = Number(digits.join(''));
  const exponent = MULTIPLIER[normalized[significantCount]];
  const ohms = significant * (10 ** exponent);
  if (!Number.isFinite(ohms) || ohms <= 0 || ohms > MAX_OHMS) throw new RangeError('Decoded resistance is outside the supported range.');
  const toleranceColor = normalized[significantCount + 1];
  return Object.freeze({ bands: count, colors: Object.freeze(normalized), ohms, tolerancePercent: TOLERANCE[toleranceColor], temperatureCoefficientPpm: count === 6 ? TCR[normalized[5]] : null });
}

function representable(value, significantCount) {
  const candidates = [];
  for (let exponent = -2; exponent <= 9; exponent += 1) {
    const scale = 10 ** exponent;
    const digits = Math.round(value / scale);
    const min = 10 ** (significantCount - 1);
    const max = (10 ** significantCount) - 1;
    if (digits < min || digits > max) continue;
    const nominal = digits * scale;
    candidates.push({ digits, exponent, nominal, relativeError: Math.abs(nominal - value) / value });
  }
  candidates.sort((a, b) => a.relativeError - b.relativeError || a.exponent - b.exponent);
  return candidates[0] ?? null;
}

export function encodeResistorValue({ ohms, bands = 4, tolerancePercent = 5, temperatureCoefficientPpm = 100 } = {}) {
  const value = finitePositive(ohms, 'Resistance');
  const count = Number(bands);
  if (![4, 5, 6].includes(count)) throw new RangeError('Choose 4, 5 or 6 bands.');
  const significantCount = count === 4 ? 2 : 3;
  const candidate = representable(value, significantCount);
  if (!candidate) throw new RangeError('Value is outside the standard digit and multiplier range for these bands.');
  const tolerance = Number(tolerancePercent);
  const toleranceColor = Object.keys(TOLERANCE).find((item) => TOLERANCE[item] === tolerance);
  if (!toleranceColor) throw new RangeError('Choose a supported tolerance.');
  const multiplierColor = Object.keys(MULTIPLIER).find((item) => MULTIPLIER[item] === candidate.exponent);
  if (!multiplierColor) throw new RangeError('Value cannot be represented with the selected band count.');
  const colors = String(candidate.digits).padStart(significantCount, '0').split('').map((digit) => Object.keys(DIGIT).find((item) => DIGIT[item] === Number(digit)));
  colors.push(multiplierColor, toleranceColor);
  let tcrValue = null;
  if (count === 6) {
    tcrValue = Number(temperatureCoefficientPpm);
    const tcrColor = Object.keys(TCR).find((item) => TCR[item] === tcrValue);
    if (!tcrColor) throw new RangeError('Choose a supported temperature coefficient.');
    colors.push(tcrColor);
  }
  return Object.freeze({ bands: count, colors: Object.freeze(colors), requestedOhms: value, nominalOhms: candidate.nominal, tolerancePercent: tolerance, temperatureCoefficientPpm: tcrValue, rounded: candidate.nominal !== value });
}
