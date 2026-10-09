const MAX_INPUT = 1_000_000_000_000;

function integer(value, label, { minimum, maximum } = {}) {
  if (typeof value === 'string' && !value.trim()) throw new RangeError(`${label} is required.`);
  const number = Number(value);
  if (!Number.isSafeInteger(number) || Math.abs(number) > MAX_INPUT || (minimum !== undefined && number < minimum) || (maximum !== undefined && number > maximum)) {
    throw new RangeError(`${label} must be an integer within the supported range.`);
  }
  return BigInt(number);
}

export function calculateModularInverse(rawA, rawModulus) {
  const input = integer(rawA, 'a');
  const modulus = integer(rawModulus, 'Modulus', { minimum: 2n, maximum: BigInt(MAX_INPUT) });
  const residue = ((input % modulus) + modulus) % modulus;
  let oldR = modulus;
  let r = residue;
  let oldS = 0n;
  let s = 1n;
  let oldT = 1n;
  let t = 0n;
  const steps = [];

  while (r !== 0n) {
    const quotient = oldR / r;
    const nextR = oldR - quotient * r;
    const nextS = oldS - quotient * s;
    const nextT = oldT - quotient * t;
    steps.push(Object.freeze({ quotient: Number(quotient), dividend: Number(oldR), divisor: Number(r), remainder: Number(nextR), coefficientA: Number(nextS), coefficientModulus: Number(nextT) }));
    [oldR, r] = [r, nextR];
    [oldS, s] = [s, nextS];
    [oldT, t] = [t, nextT];
  }

  const exists = oldR === 1n;
  const inverse = exists ? Number(((oldS % modulus) + modulus) % modulus) : null;
  return Object.freeze({ input: Number(input), modulus: Number(modulus), residue: Number(residue), gcd: Number(oldR), exists, inverse, bezoutA: Number(oldS), bezoutModulus: Number(oldT), steps: Object.freeze(steps) });
}

export const MODULAR_INVERSE_LIMITS = Object.freeze({ maxAbsoluteInput: MAX_INPUT, minModulus: 2, maxModulus: MAX_INPUT });
