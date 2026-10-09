const MAX_INTEGER_DIGITS = 12;
const MAX_NONREPEATING_DIGITS = 18;
const MAX_REPEATING_DIGITS = 18;

function gcd(a, b) {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) [left, right] = [right, left % right];
  return left;
}

function normalizeDigits(value) {
  return value.replace(/[٠-٩۰-۹]/gu, (digit) => {
    const code = digit.codePointAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });
}

export function parseRepeatingDecimal(input) {
  const value = normalizeDigits(String(input ?? '').trim().replace(/[−–]/gu, '-'));
  const match = /^([+-]?)(\d+)\.(\d*)\((\d+)\)$/u.exec(value);
  if (!match) throw new RangeError('Use repeating notation such as 0.(3) or 1.2(34).');

  const [, signText, integerText, prefix, repeat] = match;
  if (integerText.length > MAX_INTEGER_DIGITS) throw new RangeError('The whole-number part is too long.');
  if (prefix.length > MAX_NONREPEATING_DIGITS) throw new RangeError('The non-repeating part is too long.');
  if (repeat.length > MAX_REPEATING_DIGITS) throw new RangeError('The repeating period must contain 1–18 digits.');

  const prefixValue = BigInt(prefix || '0');
  const repeatValue = BigInt(repeat);
  const repeatScale = 10n ** BigInt(repeat.length);
  const prefixScale = 10n ** BigInt(prefix.length);
  const upper = BigInt(integerText) * prefixScale * repeatScale + prefixValue * repeatScale + repeatValue;
  const lower = BigInt(integerText) * prefixScale + prefixValue;
  const sign = signText === '-' ? -1n : 1n;
  const rawNumerator = sign * (upper - lower);
  const rawDenominator = prefixScale * (repeatScale - 1n);
  const divisor = gcd(rawNumerator, rawDenominator);
  const numerator = rawNumerator / divisor;
  const denominator = rawDenominator / divisor;
  const magnitude = numerator < 0n ? -numerator : numerator;
  const whole = magnitude / denominator;
  const remainder = magnitude % denominator;

  return Object.freeze({
    input: value,
    numerator: numerator.toString(),
    denominator: denominator.toString(),
    rawNumerator: rawNumerator.toString(),
    rawDenominator: rawDenominator.toString(),
    upper: upper.toString(),
    lower: lower.toString(),
    nonrepeatingDigits: prefix.length,
    repeatingDigits: repeat.length,
    isNegative: numerator < 0n,
    whole: whole.toString(),
    remainder: remainder.toString(),
    isInteger: remainder === 0n,
  });
}

export const REPEATING_DECIMAL_LIMITS = Object.freeze({
  maxIntegerDigits: MAX_INTEGER_DIGITS,
  maxNonrepeatingDigits: MAX_NONREPEATING_DIGITS,
  maxRepeatingDigits: MAX_REPEATING_DIGITS,
});
