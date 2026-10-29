const FN = Object.freeze({ sin: Math.sin, cos: Math.cos, tan: Math.tan, sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp, ln: Math.log, log: Math.log10 });
const LIM = Object.freeze({ expression: 120, tokens: 80, min: -20, max: 20, grid: 50 });

function parse(source) {
  const text = String(source ?? '').trim().toLowerCase().replaceAll('π', 'pi').replace(/[−–]/gu, '-');
  if (!text || text.length > LIM.expression) throw new RangeError('Enter an expression up to 120 characters.');
  const tokens = text.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-z]+|[()+\-*/^]/gu) ?? [];
  if (tokens.join('') !== text.replace(/\s/gu, '') || tokens.length > LIM.tokens) throw new SyntaxError('Expression contains unsupported characters or is too long.');
  let i = 0, depth = 0;
  const peek = () => tokens[i];
  const take = (expected) => { if (peek() !== expected) throw new SyntaxError(`Expected ${expected}.`); i++; };
  function primary() {
    if (++depth > 20) throw new RangeError('Expression is nested too deeply.');
    try {
      const t = peek();
      if (t === '(') { i++; const n = sum(); take(')'); return n; }
      if (t && /^(?:\d|\.)/u.test(t)) { i++; const n = Number(t); if (!Number.isFinite(n)) throw new RangeError('Number is not finite.'); return { k: 'n', v: n }; }
      if (t) {
        i++;
        if (t === 'x' || t === 'y') return { k: 'v', v: t };
        if (t === 'pi' || t === 'e') return { k: 'n', v: t === 'pi' ? Math.PI : Math.E };
        if (Object.hasOwn(FN, t)) { take('('); const arg = sum(); take(')'); return { k: 'f', v: t, a: arg }; }
      }
      throw new SyntaxError('Expected a number, x, y, function or parenthesis.');
    } finally { depth--; }
  }
  function power() { let n = primary(); if (peek() === '^') { i++; n = { k: '^', l: n, r: unary() }; } return n; }
  function unary() { if (peek() === '+' || peek() === '-') { const op = tokens[i++]; return { k: op, a: unary() }; } return power(); }
  function product() { let n = unary(); while (peek() === '*' || peek() === '/') { const op = tokens[i++]; n = { k: op, l: n, r: unary() }; } return n; }
  function sum() { let n = product(); while (peek() === '+' || peek() === '-') { const op = tokens[i++]; n = { k: op, l: n, r: product() }; } return n; }
  const ast = sum();
  if (i !== tokens.length) throw new SyntaxError('Check operators and parentheses.');
  return ast;
}

function evalNode(n, x, y) {
  if (n.k === 'n') return n.v;
  if (n.k === 'v') return n.v === 'x' ? x : y;
  if (n.k === 'f') return FN[n.v](evalNode(n.a, x, y));
  if (n.k === '+') return n.a ? evalNode(n.a, x, y) : evalNode(n.l, x, y) + evalNode(n.r, x, y);
  if (n.k === '-') return n.a ? -evalNode(n.a, x, y) : evalNode(n.l, x, y) - evalNode(n.r, x, y);
  if (n.k === '*') return evalNode(n.l, x, y) * evalNode(n.r, x, y);
  if (n.k === '/') { const d = evalNode(n.r, x, y); return d === 0 ? NaN : evalNode(n.l, x, y) / d; }
  return evalNode(n.l, x, y) ** evalNode(n.r, x, y);
}

export function sampleHeightField({ expression, minimum, maximum, grid } = {}) {
  const lo = Number(minimum), hi = Number(maximum), count = Number(grid);
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo < LIM.min || hi > LIM.max || hi <= lo) throw new RangeError('Range must increase between −20 and 20.');
  if (!Number.isInteger(count) || count < 4 || count > LIM.grid) throw new RangeError('Grid must contain 4–50 points per side.');
  const ast = parse(expression), vertices = [];
  for (let row = 0; row < count; row++) for (let col = 0; col < count; col++) {
    const x = lo + (hi - lo) * col / (count - 1), y = hi - (hi - lo) * row / (count - 1);
    let z; try { z = evalNode(ast, x, y); } catch { z = NaN; }
    vertices.push(Object.freeze({ x, y, z: Number.isFinite(z) && Math.abs(z) <= 1e6 ? z : null }));
  }
  const faces = [];
  for (let row = 0; row < count - 1; row++) for (let col = 0; col < count - 1; col++) {
    const a = row * count + col, b = a + 1, c = a + count, d = c + 1;
    if ([a,b,d].every((id) => vertices[id].z !== null)) faces.push(Object.freeze([a,b,d]));
    if ([a,d,c].every((id) => vertices[id].z !== null)) faces.push(Object.freeze([a,d,c]));
  }
  if (!faces.length) throw new RangeError('The expression did not produce a finite surface in this range.');
  return Object.freeze({ vertices: Object.freeze(vertices), faces: Object.freeze(faces), grid: count, expression: String(expression) });
}

export function exportSurfaceObj(mesh) {
  if (!mesh || !Array.isArray(mesh.vertices) || !Array.isArray(mesh.faces)) throw new TypeError('A sampled surface is required.');
  const rows = ['# UsefulVerse sampled height field'];
  for (const v of mesh.vertices) rows.push(`v ${v.x} ${v.y} ${v.z ?? 0}`);
  for (const f of mesh.faces) {
    if (f.length !== 3 || f.some((i) => !Number.isInteger(i) || i < 0 || i >= mesh.vertices.length)) throw new RangeError('Mesh contains an invalid face.');
    rows.push(`f ${f[0]+1} ${f[1]+1} ${f[2]+1}`);
  }
  return `${rows.join('\n')}\n`;
}
