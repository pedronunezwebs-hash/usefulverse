(() => {
  function w(e, t) {
    let o = typeof e == 'string' && e.trim() === '' ? NaN : Number(e);
    if (!Number.isFinite(o) || Math.abs(o) > 1e6)
      throw Object.assign(new RangeError(`${t} must be finite and within the supported range.`), {
        code: 'inputRange',
      });
    return o;
  }
  function _(e) {
    if (typeof e != 'string')
      throw Object.assign(new TypeError('Constraints must be text.'), { code: 'constraintFormat' });
    let t = e
      .split(/\r?\n/u)
      .map((o) => o.trim())
      .filter(Boolean);
    if (t.length < 1 || t.length > 8)
      throw Object.assign(new RangeError('Enter 1\u20138 constraints.'), {
        code: 'constraintCount',
      });
    return t.map((o, d) => {
      let p = o.match(
        /^\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*,\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*(<=|>=|=)\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*$/iu,
      );
      if (!p)
        throw Object.assign(
          new RangeError(`Constraint ${d + 1} must use a,b <= rhs, >= rhs or = rhs.`),
          { code: 'constraintFormat' },
        );
      return {
        a: w(p[1], 'Constraint coefficient'),
        b: w(p[2], 'Constraint coefficient'),
        relation: p[3],
        rhs: w(p[4], 'Right-hand side'),
        originalRelation: p[3],
      };
    });
  }
  function $(e) {
    let t = ['x', 'y'],
      o = new Set(),
      d = [],
      p = [];
    for (let c of e) {
      let { a: l, b: h, rhs: n, relation: s } = c;
      n < 0 && ((l = -l), (h = -h), (n = -n), (s = s === '<=' ? '>=' : s === '>=' ? '<=' : '='));
      let a = { a: l, b: h, rhs: n, relation: s, original: c };
      (s === '<='
        ? ((a.slack = t.length), t.push(`s${d.length + 1}`), p.push(a.slack))
        : s === '>='
          ? ((a.surplus = t.length),
            t.push(`u${d.length + 1}`),
            (a.artificial = t.length),
            t.push(`a${d.length + 1}`),
            o.add(a.artificial),
            p.push(a.artificial))
          : ((a.artificial = t.length),
            t.push(`a${d.length + 1}`),
            o.add(a.artificial),
            p.push(a.artificial)),
        d.push(a));
    }
    let v = d.map((c) => {
      let l = Array(t.length + 1).fill(0);
      return (
        (l[0] = c.a),
        (l[1] = c.b),
        c.slack !== void 0 && (l[c.slack] = 1),
        c.surplus !== void 0 && (l[c.surplus] = -1),
        c.artificial !== void 0 && (l[c.artificial] = 1),
        (l[t.length] = c.rhs),
        l
      );
    });
    return { names: t, artificial: o, matrix: v, basis: p, rowMetadata: d };
  }
  function O(e, t, o, d, p) {
    let c = [];
    for (let l = 0; l <= 500; l += 1) {
      let h = o.length,
        n = o.map((u, b) => u - e.reduce((r, I, E) => r + o[t[E]] * I[b], 0)),
        s = -1;
      for (let u = 0; u < o.length; u += 1)
        if (n[u] > 1e-9) {
          s = u;
          break;
        }
      let a = e.reduce((u, b, r) => u + o[t[r]] * b[h], 0);
      if (s < 0) return { status: 'optimal', objective: a, steps: c };
      if (l === 500) return { status: 'iteration-limit', objective: a, steps: c };
      let i = -1,
        f = 1 / 0;
      for (let u = 0; u < e.length; u += 1) {
        let b = e[u][s];
        if (b <= 1e-9) continue;
        let r = Math.max(0, e[u][h]) / b;
        (r < f - 1e-9 || (Math.abs(r - f) <= 1e-9 && (i < 0 || t[u] < t[i]))) && ((f = r), (i = u));
      }
      if (i < 0) return { status: 'unbounded', objective: a, steps: c };
      let m = e[i][s];
      for (let u = 0; u <= h; u += 1) e[i][u] /= m;
      for (let u = 0; u < e.length; u += 1) {
        if (u === i) continue;
        let b = e[u][s];
        if (!(Math.abs(b) <= 1e-9)) for (let r = 0; r <= h; r += 1) e[u][r] -= b * e[i][r];
      }
      let C = d[t[i]],
        S = d[s];
      t[i] = s;
      let x = e.reduce((u, b, r) => u + o[t[r]] * b[h], 0);
      c.push(Object.freeze({ phase: p, iteration: l + 1, entering: S, leaving: C, objective: x }));
    }
    return { status: 'iteration-limit', objective: 0, steps: c };
  }
  function P(e, t, o, d) {
    let p = o.length,
      v = p;
    for (let n = 0; n < e.length;) {
      if (!d.has(t[n])) {
        n += 1;
        continue;
      }
      if (Math.abs(e[n][v]) > 1e-7)
        throw new Error('Phase I ended with a nonzero artificial basic value.');
      let s = -1;
      for (let i = 0; i < p; i += 1)
        if (!d.has(i) && Math.abs(e[n][i]) > 1e-9) {
          s = i;
          break;
        }
      if (s < 0) {
        (e.splice(n, 1), t.splice(n, 1));
        continue;
      }
      let a = e[n][s];
      for (let i = 0; i <= v; i += 1) e[n][i] /= a;
      for (let i = 0; i < e.length; i += 1) {
        if (i === n) continue;
        let f = e[i][s];
        if (!(Math.abs(f) <= 1e-9)) for (let m = 0; m <= v; m += 1) e[i][m] -= f * e[n][m];
      }
      ((t[n] = s), (n += 1));
    }
    let c = o.map((n, s) => s).filter((n) => !d.has(n)),
      l = new Map(c.map((n, s) => [n, s]));
    return {
      matrix: e.map((n) => [...c.map((s) => n[s]), n[p]]),
      basis: t.map((n) => l.get(n)),
      names: c.map((n) => o[n]),
    };
  }
  function T({ objectiveX: e, objectiveY: t, direction: o = 'max', constraints: d }) {
    if (!['max', 'min'].includes(o))
      throw Object.assign(new RangeError('Choose max or min.'), { code: 'direction' });
    let p = w(e, 'Objective coefficient'),
      v = w(t, 'Objective coefficient'),
      c = _(d),
      l = $(c),
      { matrix: h, basis: n, names: s } = l,
      a = [];
    if (l.artificial.size) {
      let r = s.map((E, j) => (l.artificial.has(j) ? -1 : 0)),
        I = O(h, n, r, s, 1);
      if ((a.push(...I.steps), I.status === 'iteration-limit'))
        return Object.freeze({ status: 'iteration-limit', steps: a, pivotCount: a.length });
      if (I.status !== 'optimal' || I.objective < -1e-7)
        return Object.freeze({ status: 'infeasible', steps: a, pivotCount: a.length });
      ({ matrix: h, basis: n, names: s } = P(h, n, s, l.artificial));
    }
    let i = o === 'max' ? 1 : -1,
      f = s.map((r) => (r === 'x' ? i * p : r === 'y' ? i * v : 0)),
      m = O(h, n, f, s, 2);
    if ((a.push(...m.steps), m.status !== 'optimal'))
      return Object.freeze({ status: m.status, steps: a, pivotCount: a.length });
    let C = [0, 0];
    for (let r = 0; r < n.length; r += 1)
      n[r] === s.indexOf('x')
        ? (C[0] = h[r][s.length])
        : n[r] === s.indexOf('y') && (C[1] = h[r][s.length]);
    let [S, x] = C.map((r) => (Math.abs(r) < 1e-9 ? 0 : r)),
      u = p * S + v * x;
    if (![S, x, u].every(Number.isFinite))
      throw Object.assign(new RangeError('The solution exceeds the supported numeric range.'), {
        code: 'resultRange',
      });
    let b = c
      .map((r, I) => {
        let E = r.a * S + r.b * x,
          j = 1e-7 * Math.max(1, Math.abs(E), Math.abs(r.rhs));
        return Math.abs(E - r.rhs) <= j ? I + 1 : 0;
      })
      .filter(Boolean);
    return Object.freeze({
      status: 'optimal',
      x: S,
      y: x,
      objectiveValue: u,
      direction: o,
      activeConstraints: Object.freeze(b),
      steps: Object.freeze(a),
      pivotCount: a.length,
    });
  }
  var q = Object.freeze({
    maxConstraints: 8,
    maxAbsoluteInput: 1e6,
    maxPivots: 500,
    nonnegativeVariables: !0,
  });
  function M(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function y(e, t, o = 'info') {
    let d = e.querySelector('[data-status]');
    d && ((d.textContent = t), (d.dataset.kind = o));
  }
  function A(e) {
    let t = e.querySelector('[data-result]'),
      o = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), o && o.replaceChildren());
  }
  function N(e, t, o = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: o }).format(t);
  }
  async function R(e, t, o) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), y(e, o.messages.copied, 'success'));
    } catch {
      y(e, o.messages.copyUnavailable, 'error');
    }
  }
  var g = document.querySelector('[data-tool="linear-programming-calculator"]');
  if (g) {
    let h = function () {
        (A(g), (o.hidden = !0), d.replaceChildren(), p.replaceChildren(), (l = ''));
      },
      n = function (a, i) {
        let f = document.createElement('dt');
        f.textContent = a;
        let m = document.createElement('dd');
        ((m.textContent = i), d.append(f, m));
      },
      s = function (a) {
        (a?.preventDefault(), h(), y(g, ''));
        try {
          let i = new FormData(t),
            f = T({
              objectiveX: i.get('objectiveX'),
              objectiveY: i.get('objectiveY'),
              direction: i.get('direction'),
              constraints: i.get('constraints'),
            });
          if (f.status !== 'optimal') {
            (n(e.fields.status, e.messages[f.status]),
              (o.hidden = !1),
              (l = `${e.fields.status}: ${e.messages[f.status]}`),
              y(g, e.messages[f.status], f.status === 'iteration-limit' ? 'error' : 'success'));
            return;
          }
          (n(e.fields.status, e.messages.calculated),
            n(e.fields.optimum, c(f.objectiveValue)),
            n(e.fields.solutionX, c(f.x)),
            n(e.fields.solutionY, c(f.y)),
            n(
              e.fields.activeConstraints,
              f.activeConstraints.length ? f.activeConstraints.join(', ') : e.fields.none,
            ),
            n(e.fields.pivotCount, c(f.pivotCount)));
          for (let m of f.steps) {
            let C = document.createElement('li');
            ((C.textContent = `${c(m.iteration)}: ${m.entering} ${e.fields.pivotStep}; ${m.leaving} ${e.fields.leaving}. Z = ${c(m.objective)}`),
              p.append(C));
          }
          ((o.hidden = !1),
            (l = [...d.querySelectorAll('dt')].map(
              (m, C) => `${m.textContent}: ${d.querySelectorAll('dd')[C].textContent}`,
            ).join(`
`)),
            f.steps.length &&
              (l += `
${e.fields.pivotSteps}:
${[...p.querySelectorAll('li')].map((m) => m.textContent).join(`
`)}`),
            y(g, e.messages.calculated, 'success'));
        } catch (i) {
          y(g, e.messages[i?.code] ?? e.messages.checkInputs, 'error');
        }
      },
      e = M(g),
      t = g.querySelector('#tool-form'),
      o = g.querySelector('[data-lp-results]'),
      d = g.querySelector('[data-lp-values]'),
      p = g.querySelector('[data-lp-steps]'),
      v = e.copyLanguage === 'zh_tw' ? 'zh-TW' : e.copyLanguage,
      c = (a) => N(v, a, 8),
      l = '';
    (t.addEventListener('submit', s),
      t.addEventListener('input', () => {
        (h(), y(g, ''));
      }),
      g.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('objectiveX').value = '1'),
          (t.elements.namedItem('objectiveY').value = '1'),
          (t.elements.namedItem('direction').value = 'max'),
          (t.elements.namedItem('constraints').value = '1,1 <= 5'),
          s());
      }),
      g.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        l && R(g, l, e);
      }),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          (h(), y(g, ''));
        }, 0),
      ));
  }
})();
