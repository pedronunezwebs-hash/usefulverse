const MAX_EXPRESSION_LENGTH = 120;
const MAX_TOKENS = 80;
const MAX_DEPTH = 20;
const FUNCTIONS = Object.freeze({
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp,
  ln: Math.log, log: Math.log10,
});

function tokenize(expression) {
  const source = String(expression ?? '').trim().toLowerCase().replaceAll('π', 'pi').replace(/[٠-٩۰-۹]/gu, (digit) => {
    const code = digit.codePointAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  }).replace(/[−–]/gu, '-');
  if (!source || source.length > MAX_EXPRESSION_LENGTH) throw new RangeError('Enter an expression up to 120 characters.');
  const tokens = [];
  let offset = 0;
  while (offset < source.length) {
    if (/\s/u.test(source[offset])) { offset += 1; continue; }
    const rest = source.slice(offset);
    const number = /^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/u.exec(rest);
    const identifier = /^[a-z]+/u.exec(rest);
    const operator = /^[+*/^()-]/u.exec(rest);
    const match = number ?? identifier ?? operator;
    if (!match) throw new SyntaxError('Only numbers, t, pi, e, arithmetic and supported functions are allowed.');
    const value = match[0];
    tokens.push(number ? { type: 'number', value: Number(value) } : identifier ? { type: 'name', value } : { type: 'operator', value });
    offset += value.length;
    if (tokens.length > MAX_TOKENS) throw new RangeError('The expression has too many parts.');
  }
  return tokens;
}

function parse(expression) {
  const tokens = tokenize(expression);
  let cursor = 0;
  let depth = 0;
  const peek = () => tokens[cursor];
  const take = (value) => {
    if (peek()?.value !== value) throw new SyntaxError(`Expected ${value}.`);
    cursor += 1;
  };
  const enter = (fn) => {
    depth += 1;
    if (depth > MAX_DEPTH) throw new RangeError('The expression is nested too deeply.');
    try { return fn(); } finally { depth -= 1; }
  };
  function primary() {
    return enter(() => {
      const token = peek();
      if (!token) throw new SyntaxError('An expression is incomplete.');
      if (token.type === 'number') { cursor += 1; return { type: 'number', value: token.value }; }
      if (token.value === '(') {
        cursor += 1;
        const value = sum();
        take(')');
        return value;
      }
      if (token.type === 'name') {
        cursor += 1;
        if (token.value === 't') return { type: 'variable' };
        if (token.value === 'pi' || token.value === 'e') return { type: 'number', value: token.value === 'pi' ? Math.PI : Math.E };
        if (!Object.hasOwn(FUNCTIONS, token.value)) throw new SyntaxError(`Unsupported name: ${token.value}.`);
        take('(');
        const argument = sum();
        take(')');
        return { type: 'call', name: token.value, argument };
      }
      throw new SyntaxError('Expected a number, t, function or parenthesis.');
    });
  }
  function power() {
    let left = primary();
    if (peek()?.value === '^') { cursor += 1; left = { type: 'binary', op: '^', left, right: unary() }; }
    return left;
  }
  function unary() {
    if (peek()?.value === '+' || peek()?.value === '-') {
      const op = peek().value; cursor += 1;
      return { type: 'unary', op, argument: unary() };
    }
    return power();
  }
  function product() {
    let left = unary();
    while (peek()?.value === '*' || peek()?.value === '/') {
      const op = peek().value; cursor += 1;
      left = { type: 'binary', op, left, right: unary() };
    }
    return left;
  }
  function sum() {
    let left = product();
    while (peek()?.value === '+' || peek()?.value === '-') {
      const op = peek().value; cursor += 1;
      left = { type: 'binary', op, left, right: product() };
    }
    return left;
  }
  const ast = sum();
  if (cursor !== tokens.length) throw new SyntaxError('Check the operator or parentheses in the expression.');
  return ast;
}

function evaluate(node, t) {
  switch (node.type) {
    case 'number': return node.value;
    case 'variable': return t;
    case 'unary': return node.op === '-' ? -evaluate(node.argument, t) : evaluate(node.argument, t);
    case 'call': return FUNCTIONS[node.name](evaluate(node.argument, t));
    case 'binary': {
      const left = evaluate(node.left, t);
      const right = evaluate(node.right, t);
      if (node.op === '+') return left + right;
      if (node.op === '-') return left - right;
      if (node.op === '*') return left * right;
      if (node.op === '/') return right === 0 ? Number.NaN : left / right;
      return left ** right;
    }
    default: throw new TypeError('Invalid expression tree.');
  }
}

export function calculateParametricCurve({ xExpression, yExpression, tMin, tMax, samples }) {
  const start = Number(tMin);
  const end = Number(tMax);
  const count = Number(samples);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < -10000 || end > 10000 || end <= start) throw new RangeError('The parameter range must increase and stay between −10,000 and 10,000.');
  if (end - start > 10000) throw new RangeError('The parameter interval is too wide.');
  if (!Number.isInteger(count) || count < 50 || count > 1500) throw new RangeError('Choose between 50 and 1,500 samples.');
  const xTree = parse(xExpression);
  const yTree = parse(yExpression);
  const points = [];
  for (let index = 0; index < count; index += 1) {
    const t = start + (end - start) * index / (count - 1);
    const x = evaluate(xTree, t);
    const y = evaluate(yTree, t);
    points.push(Object.freeze({ t, x, y, valid: Number.isFinite(x) && Number.isFinite(y) && Math.abs(x) <= 1e9 && Math.abs(y) <= 1e9 }));
  }
  if (points.filter(({ valid }) => valid).length < 2) throw new RangeError('The expressions did not produce enough finite points in this range.');
  return Object.freeze({ points: Object.freeze(points), validCount: points.filter(({ valid }) => valid).length, start, end, xExpression: String(xExpression).trim(), yExpression: String(yExpression).trim() });
}

export const PARAMETRIC_EXPRESSION_LIMITS = Object.freeze({ maxLength: MAX_EXPRESSION_LENGTH, maxTokens: MAX_TOKENS, maxDepth: MAX_DEPTH, minSamples: 50, maxSamples: 1500 });
