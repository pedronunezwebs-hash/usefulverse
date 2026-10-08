const MAX_DEGREE = 20;
const MAX_TERMS = 64;
const MAX_EXPRESSION_LENGTH = 256;
const MAX_INTEGER_DIGITS = 12;
const MAX_RATIONAL_DIGITS = 96;

function gcd(a, b) {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right) [left, right] = [right, left % right];
  return left || 1n;
}

function rational(numerator, denominator = 1n) {
  if (denominator === 0n) throw new RangeError('Division by zero.');
  const sign = denominator < 0n ? -1n : 1n;
  const divisor = gcd(numerator, denominator);
  const n = (numerator / divisor) * sign;
  const d = (denominator / divisor) * sign;
  if (n.toString().length > MAX_RATIONAL_DIGITS || d.toString().length > MAX_RATIONAL_DIGITS) throw new RangeError('Intermediate result is too large.');
  return Object.freeze({ n, d });
}

const add = (a, b) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
const subtract = (a, b) => rational(a.n * b.d - b.n * a.d, a.d * b.d);
const multiply = (a, b) => rational(a.n * b.n, a.d * b.d);
const divide = (a, b) => rational(a.n * b.d, a.d * b.n);
const negate = (value) => rational(-value.n, value.d);
const isZero = (value) => value.n === 0n;

function parsePolynomial(source) {
  const raw = String(source ?? '');
  if (raw.length > MAX_EXPRESSION_LENGTH) throw new TypeError('Enter a polynomial no longer than 256 characters.');
  const input = raw.replaceAll('\u2212', '-').replace(/\s+/gu, '');
  if (!input) throw new TypeError('Enter a polynomial no longer than 256 characters.');
  const coefficients = new Map();
  let index = 0;
  let terms = 0;
  while (index < input.length) {
    let sign = 1n;
    if (input[index] === '+' || input[index] === '-') {
      if (input[index] === '-') sign = -1n;
      index += 1;
    } else if (index > 0) throw new TypeError('Separate polynomial terms with + or −.');

    const end = input.slice(index).search(/[+-]/u);
    const term = input.slice(index, end === -1 ? input.length : index + end);
    if (!term) throw new TypeError('A polynomial term is empty.');
    index += term.length;
    terms += 1;
    if (terms > MAX_TERMS) throw new RangeError(`Use no more than ${MAX_TERMS} terms.`);

    let coefficient;
    let exponent;
    const variable = term.match(/^(\d{0,12})\*?x(?:\^(\d{1,2}))?$/iu);
    if (variable) {
      coefficient = variable[1] ? BigInt(variable[1]) : 1n;
      exponent = variable[2] ? Number(variable[2]) : 1;
    } else if (/^\d{1,12}$/u.test(term)) {
      coefficient = BigInt(term);
      exponent = 0;
    } else throw new TypeError('Use integer coefficients and terms such as 2x^2 - x + 1.');
    if (!Number.isSafeInteger(exponent) || exponent < 0 || exponent > MAX_DEGREE) throw new RangeError(`Polynomial degree must be at most ${MAX_DEGREE}.`);
    coefficients.set(exponent, (coefficients.get(exponent) ?? 0n) + sign * coefficient);
  }
  for (const [power, value] of coefficients) if (value === 0n) coefficients.delete(power);
  return coefficients;
}

function degreeOf(polynomial) {
  return polynomial.size ? Math.max(...polynomial.keys()) : -1;
}

function formatRational(value) {
  if (value.d === 1n) return String(value.n);
  return `${value.n}/${value.d}`;
}

function formatPolynomial(polynomial) {
  const terms = [...polynomial.entries()].filter(([, coefficient]) => !isZero(coefficient)).sort(([a], [b]) => b - a);
  if (!terms.length) return '0';
  return terms.map(([power, coefficient], index) => {
    const negative = coefficient.n < 0n;
    const magnitude = rational(negative ? -coefficient.n : coefficient.n, coefficient.d);
    const value = formatRational(magnitude);
    const variable = power === 0 ? '' : power === 1 ? 'x' : `x^${power}`;
    const factor = power && value === '1' ? '' : value;
    const body = `${factor}${variable}`;
    return index === 0 ? `${negative ? '-' : ''}${body}` : `${negative ? ' - ' : ' + '}${body}`;
  }).join('');
}

export function calculatePolynomialLongDivision(dividendExpression, divisorExpression) {
  const dividend = parsePolynomial(dividendExpression);
  const divisor = parsePolynomial(divisorExpression);
  if (degreeOf(divisor) < 0) throw new RangeError('The divisor cannot be zero.');

  const divisorDegree = degreeOf(divisor);
  const divisorLeading = rational(divisor.get(divisorDegree));
  let remainder = new Map([...dividend.entries()].map(([power, coefficient]) => [power, rational(coefficient)]));
  const quotient = new Map();
  const steps = [];
  let iterations = 0;

  while (degreeOf(remainder) >= divisorDegree) {
    if (++iterations > MAX_DEGREE + 1) throw new RangeError('The calculation exceeded its safe step limit.');
    const remainderDegree = degreeOf(remainder);
    const quotientPower = remainderDegree - divisorDegree;
    const quotientCoefficient = divide(remainder.get(remainderDegree), divisorLeading);
    const term = new Map([[quotientPower, quotientCoefficient]]);
    quotient.set(quotientPower, add(quotient.get(quotientPower) ?? rational(0n), quotientCoefficient));
    const subtractTerms = new Map();

    for (const [power, coefficient] of divisor) {
      const targetPower = power + quotientPower;
      const product = multiply(quotientCoefficient, rational(coefficient));
      subtractTerms.set(targetPower, product);
      const updated = subtract(remainder.get(targetPower) ?? rational(0n), product);
      if (isZero(updated)) remainder.delete(targetPower);
      else remainder.set(targetPower, updated);
    }

    steps.push(Object.freeze({
      quotientTerm: formatPolynomial(term),
      subtractTerm: formatPolynomial(subtractTerms),
      remainder: formatPolynomial(remainder),
    }));
  }

  return Object.freeze({
    quotient: formatPolynomial(quotient),
    remainder: formatPolynomial(remainder),
    quotientTerms: Object.freeze([...quotient.entries()].sort(([a], [b]) => b - a).map(([power, coefficient]) => Object.freeze({ power, coefficient: formatRational(coefficient) }))),
    remainderTerms: Object.freeze([...remainder.entries()].sort(([a], [b]) => b - a).map(([power, coefficient]) => Object.freeze({ power, coefficient: formatRational(coefficient) }))),
    steps: Object.freeze(steps),
  });
}
