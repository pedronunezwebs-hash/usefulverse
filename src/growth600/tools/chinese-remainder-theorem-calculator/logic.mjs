const MAX_INPUT = 1_000_000_000_000n;
const MAX_ROWS = 20;

const DIGITS = Object.freeze({
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
});

function normalizeDigits(value) {
  return String(value).replace(/[٠-٩۰-۹]/gu, (digit) => DIGITS[digit]).replace(/[−﹣－]/gu, '-');
}

function positiveModulo(value, modulus) {
  return ((value % modulus) + modulus) % modulus;
}

function extendedGcd(left, right) {
  let oldR = left; let r = right;
  let oldS = 1n; let s = 0n;
  let oldT = 0n; let t = 1n;
  while (r !== 0n) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
    [oldT, t] = [t, oldT - quotient * t];
  }
  return { gcd: oldR, coefficientLeft: oldS, coefficientRight: oldT };
}

function parseInteger(raw, row, name) {
  const value = normalizeDigits(raw).trim();
  if (!/^[+-]?\d+$/u.test(value)) throw new RangeError(`Row ${row}: ${name} must be a whole number.`);
  const integer = BigInt(value);
  if (integer < -MAX_INPUT || integer > MAX_INPUT) throw new RangeError(`Row ${row}: ${name} is outside the supported range.`);
  return integer;
}

function parseCongruences(input) {
  const lines = String(input ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2 || lines.length > MAX_ROWS) throw new RangeError(`Enter 2–${MAX_ROWS} congruences, one per line.`);
  return lines.map((line, index) => {
    const row = index + 1;
    const normalized = normalizeDigits(line);
    let match = normalized.match(/^\s*([+-]?\d+)\s*[,;،]\s*([+-]?\d+)\s*$/u);
    if (!match) match = normalized.match(/^\s*([+-]?\d+)\s+([+-]?\d+)\s*$/u);
    if (!match) match = normalized.match(/^\s*x\s*(?:≡|=)\s*([+-]?\d+)\s*\(\s*mod\s+([+-]?\d+)\s*\)\s*$/iu);
    if (!match) throw new RangeError(`Row ${row}: enter a remainder and modulus, such as 2, 3.`);
    const remainder = parseInteger(match[1], row, 'Remainder');
    const modulus = parseInteger(match[2], row, 'Modulus');
    if (modulus < 2n) throw new RangeError(`Row ${row}: modulus must be at least 2.`);
    return Object.freeze({ remainder: positiveModulo(remainder, modulus), modulus, originalRemainder: remainder });
  });
}

/** Solve a generalized system x ≡ a (mod m) with exact BigInt arithmetic. */
export function calculateChineseRemainder(input) {
  const congruences = parseCongruences(input);
  let residue = congruences[0].remainder;
  let modulus = congruences[0].modulus;
  const steps = [];

  for (let index = 1; index < congruences.length; index += 1) {
    const next = congruences[index];
    const { remainder, modulus: nextModulus } = next;
    const { gcd, coefficientLeft } = extendedGcd(modulus, nextModulus);
    const difference = remainder - residue;
    if (difference % gcd !== 0n) {
      return Object.freeze({
        status: 'incompatible',
        congruences,
        conflictIndex: index,
        conflictGcd: gcd,
        difference,
        steps: Object.freeze(steps),
      });
    }

    const reducedNextModulus = nextModulus / gcd;
    const multiplier = reducedNextModulus === 1n
      ? 0n
      : positiveModulo((difference / gcd) * positiveModulo(coefficientLeft, reducedNextModulus), reducedNextModulus);
    const combinedModulus = modulus * reducedNextModulus;
    const combinedResidue = positiveModulo(residue + (modulus * multiplier), combinedModulus);
    steps.push(Object.freeze({
      leftResidue: residue,
      leftModulus: modulus,
      rightResidue: remainder,
      rightModulus: nextModulus,
      gcd,
      resultResidue: combinedResidue,
      resultModulus: combinedModulus,
    }));
    residue = combinedResidue;
    modulus = combinedModulus;
  }

  return Object.freeze({ status: 'solved', residue, modulus, congruences, steps: Object.freeze(steps) });
}

export const CHINESE_REMAINDER_LIMITS = Object.freeze({ maxAbsoluteInput: Number(MAX_INPUT), minModulus: 2, maxRows: MAX_ROWS });
