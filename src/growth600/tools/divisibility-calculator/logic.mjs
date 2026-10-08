const MAX_INTEGER_DIGITS = 150;
const MAX_DIVISORS = 30;
const COMMON_DIVISORS = Object.freeze([2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n, 13n, 25n, 100n, 1_000n]);

function parseSignedInteger(value, name) {
  const text = String(value ?? '').trim();
  if (!/^-?\d+$/u.test(text)) throw new RangeError(`${name} must be a whole integer.`);
  const digits = text.startsWith('-') ? text.slice(1) : text;
  if (digits.length > MAX_INTEGER_DIGITS) throw new RangeError(`${name} supports at most ${MAX_INTEGER_DIGITS} digits.`);
  return BigInt(text);
}

function parseDivisors(value) {
  const tokens = String(value ?? '').trim().split(/[\s,;]+/u).filter(Boolean);
  if (tokens.length === 0) throw new RangeError('Enter at least one positive divisor.');
  const unique = new Map();
  for (const token of tokens) {
    if (!/^\+?\d+$/u.test(token)) throw new RangeError('Divisors must be positive whole integers separated by commas or spaces.');
    const digits = token.startsWith('+') ? token.slice(1) : token;
    if (digits.length > MAX_INTEGER_DIGITS) throw new RangeError(`Each divisor supports at most ${MAX_INTEGER_DIGITS} digits.`);
    const divisor = BigInt(token);
    if (divisor <= 0n) throw new RangeError('Divisors must be greater than zero.');
    unique.set(divisor.toString(), divisor);
  }
  if (unique.size > MAX_DIVISORS) throw new RangeError(`Check no more than ${MAX_DIVISORS} different divisors at once.`);
  return [...unique.values()];
}

function ruleFor(divisor) {
  if (divisor === 1n) return 'rule1';
  if (divisor >= 2n && divisor <= 13n) return `rule${divisor}`;
  if (divisor === 25n || divisor === 100n || divisor === 1_000n) return `rule${divisor}`;
  return 'ruleGeneric';
}

function positiveRemainder(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

export function checkDivisibility({ integer, divisors }) {
  const number = parseSignedInteger(integer, 'Number');
  const testedDivisors = parseDivisors(divisors);
  const results = testedDivisors.map((divisor) => {
    const remainder = positiveRemainder(number, divisor);
    return {
      divisor: divisor.toString(),
      divisible: remainder === 0n,
      remainder: remainder.toString(),
      quotient: remainder === 0n ? (number / divisor).toString() : null,
      ruleKey: ruleFor(divisor),
    };
  });
  return {
    integer: number.toString(),
    results,
    divisibleCount: results.filter(({ divisible }) => divisible).length,
  };
}

export function commonDivisorList() {
  return COMMON_DIVISORS.map(String).join(', ');
}
