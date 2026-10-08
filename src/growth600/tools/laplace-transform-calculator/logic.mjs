const MAX_INPUT = 500;
const MAX_TERMS = 12;
const MAX_POWER = 8;

function numberText(value) {
  if (!Number.isFinite(value)) throw new RangeError('The expression is outside the supported numeric range.');
  return Number(value.toPrecision(10)).toString();
}

function splitTerms(source) {
  const text = String(source ?? '').trim().replaceAll('−', '-');
  if (!text || text.length > MAX_INPUT) throw new RangeError(`Enter an expression of 1–${MAX_INPUT} characters.`);
  const terms = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (depth < 0) throw new RangeError('Check the parentheses.');
    if (depth === 0 && index > start && (char === '+' || char === '-')) {
      const prior = text[index - 1];
      if (prior === 'e' || prior === 'E') continue;
      terms.push(text.slice(start, index).trim());
      start = index;
    }
  }
  if (depth !== 0) throw new RangeError('Check the parentheses.');
  terms.push(text.slice(start).trim());
  if (terms.length > MAX_TERMS) throw new RangeError(`Use no more than ${MAX_TERMS} terms.`);
  return terms;
}

function splitFactors(term) {
  const factors = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < term.length; index += 1) {
    if (term[index] === '(') depth += 1;
    if (term[index] === ')') depth -= 1;
    if (term[index] === '*' && depth === 0) {
      factors.push(term.slice(start, index).trim());
      start = index + 1;
    }
  }
  factors.push(term.slice(start).trim());
  if (factors.some((factor) => !factor)) throw new RangeError('Use * between factors, for example 2*t^2.');
  return factors;
}

function parseForwardTerm(source) {
  const normalized = source.trim();
  const sign = normalized.startsWith('-') ? -1 : 1;
  const unsigned = /^[+-]/u.test(normalized) ? normalized.slice(1).trim() : normalized;
  const factors = splitFactors(unsigned);
  let coefficient = sign;
  let power = 0;
  let exponentialRate = 0;
  let trig = null;
  let sawT = false;
  let sawExp = false;
  for (const factor of factors) {
    if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(factor)) {
      coefficient *= Number(factor);
      continue;
    }
    const polynomial = factor.match(/^t(?:\^(\d+))?$/u);
    if (polynomial && !sawT) {
      power = Number(polynomial[1] ?? 1);
      if (power > MAX_POWER) throw new RangeError(`Powers of t are limited to ${MAX_POWER}.`);
      sawT = true;
      continue;
    }
    const exponential = factor.match(/^exp\(([+-]?(?:\d+(?:\.\d*)?|\.\d+))\*t\)$/u);
    if (exponential && !sawExp) {
      exponentialRate = Number(exponential[1]);
      sawExp = true;
      continue;
    }
    const trigonometric = factor.match(/^(sin|cos)\(([+-]?(?:\d+(?:\.\d*)?|\.\d+))\*t\)$/u);
    if (trigonometric && !trig) {
      trig = { kind: trigonometric[1], frequency: Number(trigonometric[2]) };
      continue;
    }
    throw new RangeError(`Unsupported factor “${factor}”. Use the examples and supported forms shown.`);
  }
  if (!Number.isFinite(coefficient) || Math.abs(coefficient) > 1e12 || Math.abs(exponentialRate) > 1e6 || (trig && Math.abs(trig.frequency) > 1e6)) {
    throw new RangeError('A coefficient, exponential rate or frequency is outside the supported range.');
  }
  if (trig && power > 0) throw new RangeError('Combine t powers only with a polynomial or exp(a*t), not with sine or cosine.');
  return { coefficient, power, exponentialRate, trig };
}

function shiftText(rate) {
  if (rate === 0) return 's';
  return rate > 0 ? `(s - ${numberText(rate)})` : `(s + ${numberText(Math.abs(rate))})`;
}

function powerText(value, power) {
  return power === 1 ? value : `${value}^${power}`;
}

function multiplyText(coefficient, expression) {
  if (coefficient === 1) return expression;
  if (coefficient === -1) return `-${expression}`;
  return `${numberText(coefficient)}*${expression}`;
}

function forwardTerm(term) {
  const { coefficient, power, exponentialRate, trig } = term;
  const shifted = shiftText(exponentialRate);
  if (trig) {
    const frequency = Math.abs(trig.frequency);
    if (trig.kind === 'sin' && frequency === 0) return { expression: '0', region: 'all s' };
    if (trig.kind === 'cos' && frequency === 0) return { expression: `${numberText(coefficient)}/${shifted}`, region: `Re(s) > ${numberText(exponentialRate)}` };
    const denominator = `(${shifted}^2 + ${numberText(frequency ** 2)})`;
    const numerator = trig.kind === 'cos' ? multiplyText(coefficient, shifted) : numberText(coefficient * trig.frequency);
    const expression = `${numerator}/${denominator}`;
    return { expression, region: `Re(s) > ${numberText(exponentialRate)}` };
  }
  let factorial = 1;
  for (let number = 2; number <= power; number += 1) factorial *= number;
  const resultCoefficient = coefficient * factorial;
  return { expression: `${numberText(resultCoefficient)}/${powerText(shifted, power + 1)}`, region: `Re(s) > ${numberText(exponentialRate)}` };
}

function parseInverseTerm(source) {
  const compact = source.replaceAll(' ', '').replaceAll('²', '^2');
  const coefficientMatch = compact.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))?\*?(.*)$/u);
  const coefficient = coefficientMatch[1] === undefined || coefficientMatch[1] === '' ? 1 : Number(coefficientMatch[1]);
  const form = coefficientMatch[2];
  if (!Number.isFinite(coefficient) || Math.abs(coefficient) > 1e12) throw new RangeError('The coefficient is outside the supported range.');

  let match = form.match(/^\/s(?:\^(\d+))?$/u);
  if (match) {
    const power = Number(match[1] ?? 1);
    if (power > MAX_POWER + 1) throw new RangeError(`Denominator powers are limited to ${MAX_POWER + 1}.`);
    return { kind: 'power', coefficient, power, rate: 0 };
  }
  match = form.match(/^\/\(s([+-](?:\d+(?:\.\d*)?|\.\d+))?\)(?:\^(\d+))?$/u);
  if (match) {
    const rate = match[1] ? -Number(match[1]) : 0;
    const power = Number(match[2] ?? 1);
    if (power > MAX_POWER + 1) throw new RangeError(`Denominator powers are limited to ${MAX_POWER + 1}.`);
    return { kind: 'power', coefficient, power, rate };
  }
  match = form.match(/^s\/\(s\^2\+(\d+(?:\.\d*)?|\.\d+)\)$/u);
  if (match) return { kind: 'cos', coefficient, frequencySquared: Number(match[1]) };
  match = form.match(/^\/\(s\^2\+(\d+(?:\.\d*)?|\.\d+)\)$/u);
  if (match) return { kind: 'sin', coefficient, frequencySquared: Number(match[1]) };
  throw new RangeError(`Unsupported inverse term “${source}”. Use c/s^n, c/(s-a)^n, c*s/(s^2+b^2), or c/(s^2+b^2).`);
}

function inverseTerm(term) {
  if (term.kind === 'power') {
    const degree = term.power - 1;
    let factorial = 1;
    for (let number = 2; number <= degree; number += 1) factorial *= number;
    const coefficient = term.coefficient / factorial;
    const polynomial = degree === 0 ? '' : `${powerText('t', degree)}*`;
    const exponential = term.rate === 0 ? '' : `exp(${numberText(term.rate)}*t)*`;
    return `${multiplyText(coefficient, `${exponential}${polynomial}1`).replace(/\*1$/u, '')}` || '0';
  }
  if (!(term.frequencySquared > 0) || !Number.isFinite(term.frequencySquared)) throw new RangeError('Use a positive finite value for b² in s²+b².');
  const frequency = Math.sqrt(term.frequencySquared);
  return term.kind === 'cos'
    ? multiplyText(term.coefficient, `cos(${numberText(frequency)}*t)`)
    : multiplyText(term.coefficient / frequency, `sin(${numberText(frequency)}*t)`);
}

export function calculateLaplaceTransform(input, mode = 'forward') {
  if (mode !== 'forward' && mode !== 'inverse') throw new RangeError('Choose a supported transform direction.');
  if (mode === 'forward') {
    const terms = splitTerms(input).map(parseForwardTerm);
    const output = terms.map(forwardTerm);
    return Object.freeze({ mode, terms: Object.freeze(output), result: output.map(({ expression }) => expression).join(' + ').replaceAll('+ -', '- ') });
  }
  const lines = String(input ?? '').trim().split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || lines.length > MAX_TERMS || String(input).length > MAX_INPUT) throw new RangeError(`Enter 1–${MAX_TERMS} inverse terms, one per line, within ${MAX_INPUT} characters.`);
  const terms = lines.map((line) => inverseTerm(parseInverseTerm(line)));
  return Object.freeze({ mode, terms: Object.freeze(terms), result: terms.join(' + ').replaceAll('+ -', '- ') });
}
