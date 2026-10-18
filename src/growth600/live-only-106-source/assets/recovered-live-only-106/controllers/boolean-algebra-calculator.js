(() => {
  function N(t = document) {
    let e = t.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function E(t, e, n = 'info') {
    let r = t.querySelector('[data-status]');
    r && ((r.textContent = e), (r.dataset.kind = n));
  }
  function R(t) {
    let e = t.querySelector('[data-result]'),
      n = t.querySelector('[data-result-content]');
    (e && (e.hidden = !0), n && n.replaceChildren());
  }
  async function j(t, e, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(e), E(t, n.messages.copied, 'success'));
    } catch {
      E(t, n.messages.copyUnavailable, 'error');
    }
  }
  function L(t) {
    let e = String(t ?? '')
      .toUpperCase()
      .replaceAll('\xAC', '!')
      .replaceAll('\u2227', '&')
      .replaceAll('\u2228', '|')
      .replaceAll('\u2295', '^');
    if (
      ((e = e
        .replace(/\bAND\b/gu, '&')
        .replace(/\bOR\b/gu, '|')
        .replace(/\bNOT\b/gu, '!')
        .replace(/\bXOR\b/gu, '^')),
      !e.trim() || e.length > 180)
    )
      throw new RangeError('Enter a Boolean expression up to 180 characters.');
    let n = [];
    for (let s = 0; s < e.length;) {
      if (/\s/u.test(e[s])) {
        s += 1;
        continue;
      }
      let f = e[s];
      if (/[A-F]/u.test(f)) (n.push({ type: 'variable', value: f }), (s += 1));
      else if (f === '0' || f === '1') (n.push({ type: 'constant', value: f === '1' }), (s += 1));
      else if ('!~&*|+^()'.includes(f)) {
        let w = f === '~' ? '!' : ['*'].includes(f) ? '&' : ['+'].includes(f) ? '|' : f;
        (n.push({ type: 'operator', value: w }), (s += 1));
      } else
        throw new SyntaxError('Use variables A\u2013F, 0/1, NOT (!), AND (&), XOR (^) and OR (|).');
      if (n.length > 100) throw new RangeError('The expression has too many parts.');
    }
    let r = [],
      o = (s) => s?.type === 'variable' || s?.type === 'constant' || s?.value === ')',
      h = (s) =>
        s?.type === 'variable' || s?.type === 'constant' || s?.value === '(' || s?.value === '!';
    for (let s of n) (o(r.at(-1)) && h(s) && r.push({ type: 'operator', value: '&' }), r.push(s));
    return r;
  }
  function $(t) {
    let e = L(t),
      n = [...new Set(e.filter(({ type: c }) => c === 'variable').map(({ value: c }) => c))].sort();
    if (!n.length) throw new SyntaxError('Include at least one variable A\u2013F.');
    if (n.length > 6) throw new RangeError('Use at most six variables (A\u2013F).');
    let r = 0,
      o = () => e[r];
    function h() {
      let c = o();
      if (!c) throw new SyntaxError('The expression is incomplete.');
      if (c.value === '!') return ((r += 1), { type: 'not', value: h() });
      if (c.value === '(') {
        r += 1;
        let d = w();
        if (o()?.value !== ')') throw new SyntaxError('Check the parentheses.');
        return ((r += 1), d);
      }
      if (c.type === 'variable') return ((r += 1), { type: 'variable', value: c.value });
      if (c.type === 'constant') return ((r += 1), { type: 'constant', value: c.value });
      throw new SyntaxError('Expected a variable, constant, NOT or parenthesis.');
    }
    function s() {
      let c = h();
      for (; o()?.value === '&';)
        ((r += 1), (c = { type: 'binary', op: '&', left: c, right: h() }));
      return c;
    }
    function f() {
      let c = s();
      for (; o()?.value === '^';)
        ((r += 1), (c = { type: 'binary', op: '^', left: c, right: s() }));
      return c;
    }
    function w() {
      let c = f();
      for (; o()?.value === '|';)
        ((r += 1), (c = { type: 'binary', op: '|', left: c, right: f() }));
      return c;
    }
    let g = w();
    if (r !== e.length) throw new SyntaxError('Check the operators and parentheses.');
    return { ast: g, variables: n };
  }
  function A(t, e) {
    if (t.type === 'constant') return t.value;
    if (t.type === 'variable') return e[t.value];
    if (t.type === 'not') return !A(t.value, e);
    let n = A(t.left, e),
      r = A(t.right, e);
    return t.op === '&' ? n && r : t.op === '|' ? n || r : n !== r;
  }
  function I(t, e) {
    let n = e,
      r = t.map((a) => ({ bits: a.toString(2).padStart(n, '0'), covers: [a], used: !1 })),
      o = new Map();
    for (; r.length;) {
      let a = new Map();
      for (let l = 0; l < r.length; l += 1)
        for (let i = l + 1; i < r.length; i += 1) {
          let u = r[l],
            p = r[i];
          if ((u.bits.match(/-/gu)?.length ?? 0) !== (p.bits.match(/-/gu)?.length ?? 0)) continue;
          let b = [];
          for (let S = 0; S < n; S += 1) u.bits[S] !== p.bits[S] && b.push(S);
          if (b.length !== 1) continue;
          let v = b[0],
            x = `${u.bits.slice(0, v)}-${u.bits.slice(v + 1)}`;
          ((u.used = !0), (p.used = !0));
          let T = [...new Set([...u.covers, ...p.covers])].sort((S, C) => S - C),
            k = `${x}:${T.join(',')}`;
          a.set(k, { bits: x, covers: T, used: !1 });
        }
      for (let l of r)
        l.used || o.set(`${l.bits}:${l.covers.join(',')}`, { bits: l.bits, covers: l.covers });
      r = [...a.values()];
    }
    let h = [...o.values()].sort((a, l) => O(l.bits) - O(a.bits) || a.bits.localeCompare(l.bits));
    if (h.length > 256)
      throw new RangeError('This expression produces too many implicants to simplify safely.');
    let s = new Map();
    for (let a of t)
      s.set(
        a,
        h.filter((l) => l.covers.includes(a)),
      );
    let f = new Set(),
      w = new Set(t);
    for (let a of s.values()) a.length === 1 && f.add(a[0]);
    for (let a of f) for (let l of a.covers) w.delete(l);
    let g,
      c = 0;
    function d(a, l) {
      if (((c += 1), c > 2e5))
        throw new RangeError(
          'The exact simplifier reached its safety limit; reduce the number of variables.',
        );
      if (!a.size) {
        let p = [l.size, [...l].reduce((b, v) => b + O(v.bits), 0)];
        (!g || p[0] < g.score[0] || (p[0] === g.score[0] && p[1] < g.score[1])) &&
          (g = { terms: new Set(l), score: p });
        return;
      }
      if (g && l.size >= g.score[0]) return;
      let i, u;
      for (let p of a) {
        let b = s.get(p).filter((v) => !l.has(v));
        (!u || b.length < u.length) && ((i = p), (u = b));
      }
      if (u?.length)
        for (let p of u) {
          let b = new Set(a);
          for (let x of p.covers) b.delete(x);
          let v = new Set(l);
          (v.add(p), d(b, v));
        }
    }
    return (
      w.size && d(w, new Set(f)),
      [...(g?.terms ?? f)].sort((a, l) => a.bits.localeCompare(l.bits)).map(({ bits: a }) => a)
    );
  }
  function O(t) {
    return [...t].filter((e) => e !== '-').length;
  }
  function z(t, e) {
    return t.length
      ? t.some((n) => n === '-'.repeat(e.length))
        ? '1'
        : t
            .map((n) =>
              [...n]
                .map((r, o) => (r === '-' ? '' : r === '1' ? e[o] : `!${e[o]}`))
                .filter(Boolean)
                .join(' & '),
            )
            .join(' | ')
      : '0';
  }
  function X(t, e) {
    return t.length
      ? t.some((n) => n === '-'.repeat(e.length))
        ? '0'
        : t
            .map((n) => {
              let r = [...n]
                .map((o, h) => (o === '-' ? '' : o === '1' ? `!${e[h]}` : e[h]))
                .filter(Boolean);
              return r.length === 1 ? r[0] : `(${r.join(' | ')})`;
            })
            .join(' & ')
      : '1';
  }
  function M(t) {
    return t ^ (t >> 1);
  }
  function _({ expression: t }) {
    let { ast: e, variables: n } = $(t),
      r = 2 ** n.length,
      o = Array.from({ length: r }, (i, u) => {
        let p = Object.fromEntries(n.map((b, v) => [b, !!((u >> (n.length - v - 1)) & 1)]));
        return Object.freeze({ index: u, assignment: Object.freeze(p), result: A(e, p) });
      }),
      h = o.filter(({ result: i }) => i).map(({ index: i }) => i),
      s = I(h, n.length),
      f = I(
        o.filter(({ result: i }) => !i).map(({ index: i }) => i),
        n.length,
      ),
      w = z(s, n),
      g = X(f, n),
      c = Array.from({ length: 2 ** Math.floor(n.length / 2) }, (i, u) => M(u)),
      d = Array.from({ length: 2 ** Math.ceil(n.length / 2) }, (i, u) => M(u)),
      m = n.slice(0, Math.floor(n.length / 2)),
      a = n.slice(m.length),
      l =
        n.length >= 2 && n.length <= 4
          ? Object.freeze({
              rowVariables: m,
              columnVariables: a,
              rowLabels: c.map((i) => i.toString(2).padStart(m.length, '0')),
              columnLabels: d.map((i) => i.toString(2).padStart(a.length, '0')),
              cells: Object.freeze(
                c.map((i) =>
                  d.map((u) => {
                    let p = `${i.toString(2).padStart(m.length, '0')}${u.toString(2).padStart(a.length, '0')}`;
                    return o[Number.parseInt(p, 2)].result;
                  }),
                ),
              ),
            })
          : null;
    return Object.freeze({
      variables: Object.freeze(n),
      rows: Object.freeze(o),
      minterms: Object.freeze(h),
      sop: w,
      pos: g,
      kmap: l,
      expression: String(t).trim(),
    });
  }
  var B = Object.freeze({
    maxExpressionCharacters: 180,
    maxTokens: 100,
    maxVariables: 6,
    maxTruthTableRows: 2 ** 6,
  });
  var y = document.querySelector('[data-tool="boolean-algebra-calculator"]');
  if (y) {
    let h = function () {
        (R(y), r.replaceChildren(), (o = void 0));
      },
      s = function (d, m) {
        let a = document.createElement(d);
        return ((a.textContent = m), a);
      },
      f = function () {
        let d = document.createElement('div');
        d.className = 'boolean-algebra-table-wrap';
        let m = document.createElement('table');
        ((m.className = 'boolean-algebra-table'),
          m.setAttribute('aria-label', e.fields.truthTableLabel));
        let a = document.createElement('thead'),
          l = document.createElement('tr');
        for (let u of o.variables) l.append(s('th', u));
        (l.append(s('th', e.fields.result)), a.append(l), m.append(a));
        let i = document.createElement('tbody');
        for (let u of o.rows) {
          let p = document.createElement('tr');
          for (let b of o.variables) p.append(s('td', u.assignment[b] ? '1' : '0'));
          (p.append(s('td', u.result ? '1' : '0')), i.append(p));
        }
        return (m.append(i), d.append(m), d);
      },
      w = function () {
        if (!o.kmap) return null;
        let d = document.createElement('section');
        d.className = 'boolean-algebra-kmap';
        let m = s('h3', e.fields.kmapTitle);
        d.append(m);
        let a = document.createElement('table');
        a.setAttribute('aria-label', e.fields.kmapTitle);
        let l = document.createElement('thead'),
          i = document.createElement('tr');
        i.append(s('th', `${o.kmap.rowVariables.join('')} / ${o.kmap.columnVariables.join('')}`));
        for (let p of o.kmap.columnLabels) i.append(s('th', p));
        (l.append(i), a.append(l));
        let u = document.createElement('tbody');
        return (
          o.kmap.cells.forEach((p, b) => {
            let v = document.createElement('tr');
            (v.append(s('th', o.kmap.rowLabels[b])),
              p.forEach((x) => v.append(s('td', x ? '1' : '0'))),
              u.append(v));
          }),
          a.append(u),
          d.append(a),
          d
        );
      },
      g = function (d) {
        (d?.preventDefault(), h());
        try {
          o = _({ expression: t.elements.namedItem('expression').value });
          let m = document.createElement('dl');
          m.className = 'boolean-algebra-summary';
          for (let [l, i] of [
            [e.fields.simplifiedSop, o.sop],
            [e.fields.simplifiedPos, o.pos],
            [e.fields.variables, o.variables.join(', ')],
            [e.fields.minterms, o.minterms.join(', ') || '\u2014'],
          ])
            m.append(s('dt', l), s('dd', i));
          r.append(m, f());
          let a = w();
          (a && r.append(a), (n.hidden = !1), E(y, e.messages.calculated, 'success'));
        } catch {
          E(y, e.messages.checkInputs, 'error');
        }
      },
      c = function () {
        return o
          ? `${e.fields.simplifiedSop}: ${o.sop}
${e.fields.simplifiedPos}: ${o.pos}
${e.fields.variables}: ${o.variables.join(', ')}
${e.fields.minterms}: ${o.minterms.join(', ') || '\u2014'}`
          : '';
      },
      t = y.querySelector('#tool-form'),
      e = N(y),
      n = y.querySelector('[data-result]'),
      r = y.querySelector('[data-result-content]'),
      o;
    (t.addEventListener('submit', g),
      t.addEventListener('input', () => {
        (h(), E(y, ''));
      }),
      t.addEventListener('reset', () =>
        queueMicrotask(() => {
          (h(), E(y, ''));
        }),
      ),
      y.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('expression').value = 'A OR NOT A'),
          g(),
          E(y, e.messages.exampleLoaded, 'success'));
      }),
      y.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && j(y, c(), e);
      }));
  }
})();
