const MAX_EXPRESSION = 180;
const MAX_TOKENS = 100;
const MAX_VARIABLES = 6;
const QMC_NODE_LIMIT = 200_000;

function tokenize(input) {
  let source = String(input ?? '').toUpperCase().replaceAll('¬', '!').replaceAll('∧', '&').replaceAll('∨', '|').replaceAll('⊕', '^');
  source = source.replace(/\bAND\b/gu, '&').replace(/\bOR\b/gu, '|').replace(/\bNOT\b/gu, '!').replace(/\bXOR\b/gu, '^');
  if (!source.trim() || source.length > MAX_EXPRESSION) throw new RangeError('Enter a Boolean expression up to 180 characters.');
  const tokens = [];
  for (let index = 0; index < source.length;) {
    if (/\s/u.test(source[index])) { index += 1; continue; }
    const char = source[index];
    if (/[A-F]/u.test(char)) { tokens.push({ type: 'variable', value: char }); index += 1; }
    else if (char === '0' || char === '1') { tokens.push({ type: 'constant', value: char === '1' }); index += 1; }
    else if ('!~&*|+^()'.includes(char)) {
      const value = char === '~' ? '!' : ['*'].includes(char) ? '&' : ['+'].includes(char) ? '|' : char;
      tokens.push({ type: 'operator', value }); index += 1;
    } else throw new SyntaxError('Use variables A–F, 0/1, NOT (!), AND (&), XOR (^) and OR (|).');
    if (tokens.length > MAX_TOKENS) throw new RangeError('The expression has too many parts.');
  }
  const expanded = [];
  const endsAtom = (token) => token?.type === 'variable' || token?.type === 'constant' || token?.value === ')';
  const beginsAtom = (token) => token?.type === 'variable' || token?.type === 'constant' || token?.value === '(' || token?.value === '!';
  for (const token of tokens) {
    if (endsAtom(expanded.at(-1)) && beginsAtom(token)) expanded.push({ type: 'operator', value: '&' });
    expanded.push(token);
  }
  return expanded;
}

function parse(source) {
  const tokens = tokenize(source);
  const variables = [...new Set(tokens.filter(({ type }) => type === 'variable').map(({ value }) => value))].sort();
  if (!variables.length) throw new SyntaxError('Include at least one variable A–F.');
  if (variables.length > MAX_VARIABLES) throw new RangeError('Use at most six variables (A–F).');
  let cursor = 0;
  const peek = () => tokens[cursor];
  function primary() {
    const token = peek();
    if (!token) throw new SyntaxError('The expression is incomplete.');
    if (token.value === '!') { cursor += 1; return { type: 'not', value: primary() }; }
    if (token.value === '(') { cursor += 1; const node = disjunction(); if (peek()?.value !== ')') throw new SyntaxError('Check the parentheses.'); cursor += 1; return node; }
    if (token.type === 'variable') { cursor += 1; return { type: 'variable', value: token.value }; }
    if (token.type === 'constant') { cursor += 1; return { type: 'constant', value: token.value }; }
    throw new SyntaxError('Expected a variable, constant, NOT or parenthesis.');
  }
  function conjunction() {
    let node = primary();
    while (peek()?.value === '&') { cursor += 1; node = { type: 'binary', op: '&', left: node, right: primary() }; }
    return node;
  }
  function exclusiveOr() {
    let node = conjunction();
    while (peek()?.value === '^') { cursor += 1; node = { type: 'binary', op: '^', left: node, right: conjunction() }; }
    return node;
  }
  function disjunction() {
    let node = exclusiveOr();
    while (peek()?.value === '|') { cursor += 1; node = { type: 'binary', op: '|', left: node, right: exclusiveOr() }; }
    return node;
  }
  const ast = disjunction();
  if (cursor !== tokens.length) throw new SyntaxError('Check the operators and parentheses.');
  return { ast, variables };
}

function evaluate(node, assignment) {
  if (node.type === 'constant') return node.value;
  if (node.type === 'variable') return assignment[node.value];
  if (node.type === 'not') return !evaluate(node.value, assignment);
  const left = evaluate(node.left, assignment), right = evaluate(node.right, assignment);
  if (node.op === '&') return left && right;
  if (node.op === '|') return left || right;
  return left !== right;
}

function mintermsToSop(minterms, variableCount) {
  const bitWidth = variableCount;
  let terms = minterms.map((index) => ({ bits: index.toString(2).padStart(bitWidth, '0'), covers: [index], used: false }));
  const primes = new Map();
  while (terms.length) {
    const combined = new Map();
    for (let left = 0; left < terms.length; left += 1) for (let right = left + 1; right < terms.length; right += 1) {
      const a = terms[left], b = terms[right];
      if ((a.bits.match(/-/gu)?.length ?? 0) !== (b.bits.match(/-/gu)?.length ?? 0)) continue;
      const differences = [];
      for (let bit = 0; bit < bitWidth; bit += 1) if (a.bits[bit] !== b.bits[bit]) differences.push(bit);
      if (differences.length !== 1) continue;
      const index = differences[0];
      const bits = `${a.bits.slice(0, index)}-${a.bits.slice(index + 1)}`;
      a.used = true; b.used = true;
      const covers = [...new Set([...a.covers, ...b.covers])].sort((x, y) => x - y);
      const key = `${bits}:${covers.join(',')}`;
      combined.set(key, { bits, covers, used: false });
    }
    for (const term of terms) if (!term.used) primes.set(`${term.bits}:${term.covers.join(',')}`, { bits: term.bits, covers: term.covers });
    terms = [...combined.values()];
  }
  const implicants = [...primes.values()].sort((a, b) => literals(b.bits) - literals(a.bits) || a.bits.localeCompare(b.bits));
  if (implicants.length > 256) throw new RangeError('This expression produces too many implicants to simplify safely.');
  const candidates = new Map();
  for (const minterm of minterms) candidates.set(minterm, implicants.filter((term) => term.covers.includes(minterm)));
  const chosen = new Set();
  const uncovered = new Set(minterms);
  for (const options of candidates.values()) if (options.length === 1) chosen.add(options[0]);
  for (const term of chosen) for (const minterm of term.covers) uncovered.delete(minterm);
  let best;
  let visited = 0;
  function search(remaining, selection) {
    visited += 1;
    if (visited > QMC_NODE_LIMIT) throw new RangeError('The exact simplifier reached its safety limit; reduce the number of variables.');
    if (!remaining.size) {
      const score = [selection.size, [...selection].reduce((sum, term) => sum + literals(term.bits), 0)];
      if (!best || score[0] < best.score[0] || (score[0] === best.score[0] && score[1] < best.score[1])) best = { terms: new Set(selection), score };
      return;
    }
    if (best && selection.size >= best.score[0]) return;
    let target, options;
    for (const minterm of remaining) {
      const available = candidates.get(minterm).filter((term) => !selection.has(term));
      if (!options || available.length < options.length) { target = minterm; options = available; }
    }
    if (!options?.length) return;
    for (const term of options) {
      const nextRemaining = new Set(remaining);
      for (const minterm of term.covers) nextRemaining.delete(minterm);
      const next = new Set(selection); next.add(term);
      search(nextRemaining, next);
    }
  }
  if (uncovered.size) search(uncovered, new Set(chosen));
  const selected = best?.terms ?? chosen;
  return [...selected].sort((a, b) => a.bits.localeCompare(b.bits)).map(({ bits }) => bits);
}

function literals(bits) { return [...bits].filter((bit) => bit !== '-').length; }
function formatSop(terms, variables) {
  if (!terms.length) return '0';
  if (terms.some((term) => term === '-'.repeat(variables.length))) return '1';
  return terms.map((term) => [...term].map((bit, index) => bit === '-' ? '' : bit === '1' ? variables[index] : `!${variables[index]}`).filter(Boolean).join(' & ')).join(' | ');
}

function formatPos(offTerms, variables) {
  if (!offTerms.length) return '1';
  if (offTerms.some((term) => term === '-'.repeat(variables.length))) return '0';
  return offTerms.map((term) => {
    const literals = [...term].map((bit, index) => bit === '-' ? '' : bit === '1' ? `!${variables[index]}` : variables[index]).filter(Boolean);
    return literals.length === 1 ? literals[0] : `(${literals.join(' | ')})`;
  }).join(' & ');
}

function gray(index) { return index ^ (index >> 1); }

export function calculateBooleanAlgebra({ expression }) {
  const { ast, variables } = parse(expression);
  const rowCount = 2 ** variables.length;
  const rows = Array.from({ length: rowCount }, (_, index) => {
    const assignment = Object.fromEntries(variables.map((variable, bit) => [variable, Boolean((index >> (variables.length - bit - 1)) & 1)]));
    return Object.freeze({ index, assignment: Object.freeze(assignment), result: evaluate(ast, assignment) });
  });
  const minterms = rows.filter(({ result }) => result).map(({ index }) => index);
  const onTerms = mintermsToSop(minterms, variables.length);
  const offTerms = mintermsToSop(rows.filter(({ result }) => !result).map(({ index }) => index), variables.length);
  const sop = formatSop(onTerms, variables);
  const pos = formatPos(offTerms, variables);
  const grayRows = Array.from({ length: 2 ** Math.floor(variables.length / 2) }, (_, index) => gray(index));
  const grayColumns = Array.from({ length: 2 ** Math.ceil(variables.length / 2) }, (_, index) => gray(index));
  const rowVariables = variables.slice(0, Math.floor(variables.length / 2));
  const columnVariables = variables.slice(rowVariables.length);
  const kmap = variables.length >= 2 && variables.length <= 4 ? Object.freeze({
    rowVariables, columnVariables, rowLabels: grayRows.map((index) => index.toString(2).padStart(rowVariables.length, '0')),
    columnLabels: grayColumns.map((index) => index.toString(2).padStart(columnVariables.length, '0')),
    cells: Object.freeze(grayRows.map((row) => grayColumns.map((column) => {
      const bits = `${row.toString(2).padStart(rowVariables.length, '0')}${column.toString(2).padStart(columnVariables.length, '0')}`;
      return rows[Number.parseInt(bits, 2)].result;
    }))),
  }) : null;
  return Object.freeze({ variables: Object.freeze(variables), rows: Object.freeze(rows), minterms: Object.freeze(minterms), sop, pos, kmap, expression: String(expression).trim() });
}

export const BOOLEAN_ALGEBRA_LIMITS = Object.freeze({ maxExpressionCharacters: MAX_EXPRESSION, maxTokens: MAX_TOKENS, maxVariables: MAX_VARIABLES, maxTruthTableRows: 2 ** MAX_VARIABLES });
