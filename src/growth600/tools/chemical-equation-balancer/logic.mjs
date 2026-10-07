import { parseChemicalFormula } from '../molar-mass-calculator/logic.mjs';

const MAX_COEFFICIENT = 1_000_000n;
const MAX_TERMS = 16;
const MAX_FORMULA_CHARS = 160;

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a || 1n;
}

function lcm(a, b) { return (a / gcd(a, b)) * b; }
function fraction(n, d = 1n) {
  if (d === 0n) throw new RangeError('Invalid exact fraction.');
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  return { n: n / divisor, d: d / divisor };
}
function subtract(a, b) { return fraction(a.n * b.d - b.n * a.d, a.d * b.d); }
function multiply(a, b) { return fraction(a.n * b.n, a.d * b.d); }
function divide(a, b) {
  if (b.n === 0n) throw new RangeError('Cannot divide by zero in the balancing matrix.');
  return fraction(a.n * b.d, a.d * b.n);
}

function parseEquation(source) {
  if (typeof source !== 'string' || !source.trim() || source.length > 500) throw new TypeError('Enter one equation of up to 500 characters.');
  const equation = source.trim();
  const arrows = [...equation.matchAll(/->|→|=/gu)];
  if (arrows.length !== 1) throw new SyntaxError('Use exactly one arrow: ->, → or =.');
  const arrow = arrows[0];
  const leftText = equation.slice(0, arrow.index).trim();
  const rightText = equation.slice(arrow.index + arrow[0].length).trim();
  if (!leftText || !rightText) throw new SyntaxError('Enter reactants and products on both sides of the arrow.');
  const splitSide = (text) => text.split('+').map((formula) => formula.trim());
  const reactantFormulas = splitSide(leftText);
  const productFormulas = splitSide(rightText);
  const formulas = [...reactantFormulas, ...productFormulas];
  if (formulas.some((formula) => !formula)) throw new SyntaxError('A plus sign must separate complete neutral formulas; ionic charges are not supported.');
  if (formulas.length > MAX_TERMS || reactantFormulas.length < 1 || productFormulas.length < 1) throw new RangeError(`Enter 1 to ${MAX_TERMS} species total.`);
  if (new Set(formulas).size !== formulas.length) throw new SyntaxError('Do not repeat the same species on both sides or multiple times.');
  const compositions = formulas.map((formula) => {
    if (formula.length > MAX_FORMULA_CHARS) throw new RangeError('Each formula must be 160 characters or fewer.');
    return parseChemicalFormula(formula);
  });
  return { equation, reactantFormulas, productFormulas, formulas, compositions };
}

function reducedRowEchelon(matrix) {
  let pivotRow = 0;
  const pivotColumns = [];
  for (let column = 0; column < matrix[0].length && pivotRow < matrix.length; column += 1) {
    const found = matrix.findIndex((row, index) => index >= pivotRow && row[column].n !== 0n);
    if (found < 0) continue;
    [matrix[pivotRow], matrix[found]] = [matrix[found], matrix[pivotRow]];
    const pivot = matrix[pivotRow][column];
    matrix[pivotRow] = matrix[pivotRow].map((value) => divide(value, pivot));
    for (let row = 0; row < matrix.length; row += 1) {
      if (row === pivotRow || matrix[row][column].n === 0n) continue;
      const factor = matrix[row][column];
      matrix[row] = matrix[row].map((value, index) => subtract(value, multiply(factor, matrix[pivotRow][index])));
    }
    pivotColumns.push(column);
    pivotRow += 1;
  }
  return { matrix, pivotColumns };
}

function vectorForFreeValues(rref, pivotColumns, freeColumns, freeValues) {
  const vector = Array.from({ length: rref[0].length }, () => fraction(0n));
  freeColumns.forEach((column, index) => { vector[column] = fraction(BigInt(freeValues[index])); });
  pivotColumns.forEach((column, row) => {
    vector[column] = freeColumns.reduce((sum, freeColumn, index) => subtract(sum, multiply(rref[row][freeColumn], vector[freeColumn])), fraction(0n));
  });
  const denominator = vector.reduce((result, value) => lcm(result, value.d), 1n);
  let integers = vector.map(({ n, d }) => n * (denominator / d));
  if (integers.every((value) => value < 0n)) integers = integers.map((value) => -value);
  if (integers.some((value) => value <= 0n)) return null;
  const divisor = integers.reduce((result, value) => gcd(result, value), 0n);
  integers = integers.map((value) => value / divisor);
  if (integers.some((value) => value > MAX_COEFFICIENT)) return null;
  return integers;
}

function findSmallestPositiveCoefficients(rows, speciesCount) {
  const matrix = rows.map((row) => row.map((value) => fraction(BigInt(value))));
  const { matrix: rref, pivotColumns } = reducedRowEchelon(matrix);
  const pivotSet = new Set(pivotColumns);
  const freeColumns = Array.from({ length: speciesCount }, (_, index) => index).filter((index) => !pivotSet.has(index));
  if (!freeColumns.length) throw new RangeError('No non-zero balance satisfies atom conservation.');
  if (freeColumns.length > 3) throw new RangeError('This equation has too many independent solutions for the bounded local solver.');

  let best = null;
  const limit = freeColumns.length === 1 ? 1 : 20;
  const values = Array.from({ length: freeColumns.length }, () => 1);
  function search(depth = 0) {
    if (depth === values.length) {
      const candidate = vectorForFreeValues(rref, pivotColumns, freeColumns, values);
      if (!candidate) return;
      const total = candidate.reduce((sum, coefficient) => sum + coefficient, 0n);
      const firstDifference = best && total === best.total ? candidate.findIndex((value, index) => value !== best.coefficients[index]) : -1;
      const lexicallySmaller = firstDifference >= 0 && candidate[firstDifference] < best.coefficients[firstDifference];
      if (!best || total < best.total || lexicallySmaller) {
        best = { coefficients: candidate, total };
      }
      return;
    }
    for (let value = 1; value <= limit; value += 1) {
      values[depth] = value;
      search(depth + 1);
    }
  }
  search();
  if (!best) throw new RangeError('No small positive-integer balance found; the reaction may need ionic/electron terms or more context.');
  return { coefficients: best.coefficients.map(Number), multipleSolutions: freeColumns.length > 1 };
}

export function balanceChemicalEquation(source) {
  const parsed = parseEquation(source);
  const elements = [...new Set(parsed.compositions.flatMap((composition) => Object.keys(composition)))].sort();
  const rows = elements.map((element) => parsed.compositions.map((composition, index) => (index < parsed.reactantFormulas.length ? 1 : -1) * (composition[element] ?? 0)));
  const { coefficients, multipleSolutions } = findSmallestPositiveCoefficients(rows, parsed.formulas.length);
  const atomCounts = elements.map((element) => {
    const reactants = parsed.compositions.slice(0, parsed.reactantFormulas.length).reduce((sum, composition, index) => sum + (composition[element] ?? 0) * coefficients[index], 0);
    const products = parsed.compositions.slice(parsed.reactantFormulas.length).reduce((sum, composition, index) => sum + (composition[element] ?? 0) * coefficients[parsed.reactantFormulas.length + index], 0);
    if (reactants !== products) throw new Error(`Internal atom-conservation check failed for ${element}.`);
    return Object.freeze({ element, reactants, products });
  });
  const terms = parsed.formulas.map((formula, index) => ({ formula, coefficient: coefficients[index] }));
  const balancedEquation = `${terms.slice(0, parsed.reactantFormulas.length).map(formatTerm).join(' + ')} → ${terms.slice(parsed.reactantFormulas.length).map(formatTerm).join(' + ')}`;
  return Object.freeze({ equation: parsed.equation, balancedEquation, multipleSolutions, coefficients: Object.freeze(coefficients), elements: Object.freeze(elements), atomCounts: Object.freeze(atomCounts), reactants: Object.freeze(terms.slice(0, parsed.reactantFormulas.length)), products: Object.freeze(terms.slice(parsed.reactantFormulas.length)) });
}

function formatTerm({ formula, coefficient }) { return `${coefficient === 1 ? '' : coefficient}${formula}`; }
