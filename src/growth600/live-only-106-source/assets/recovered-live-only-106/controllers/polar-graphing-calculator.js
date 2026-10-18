(() => {
  var J = Object.freeze({
    'A+': 4,
    A: 4,
    'A-': 3.7,
    'B+': 3.3,
    B: 3,
    'B-': 2.7,
    'C+': 2.3,
    C: 2,
    'C-': 1.7,
    'D+': 1.3,
    D: 1,
    'D-': 0.7,
    F: 0,
  });
  function O(t, r = 'en') {
    let e = String(t)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (i) => String(i.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (i) => String(i.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (i) => String(i.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (i) => String(i.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let o = new Intl.NumberFormat(r).formatToParts(12345.6),
      n = o.find((i) => i.type === 'decimal')?.value ?? '.',
      s = o.find((i) => i.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      n === ','
        ? e.includes(',')
          ? (e = e.replaceAll(s, '').replace(',', '.'))
          : s === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : n === '.'
          ? e.includes('.')
            ? ((s === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (s !== ',' && e.includes(s))) &&
              (e = e.replaceAll(s, ''))
            : e.includes(s) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(s, '')
                  : e.replace(s, '.'))
          : e.includes(n) && (e = e.replaceAll(s, '').replace(n, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var Q = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function _(t = document) {
    let r = t.querySelector('[data-tool-copy]');
    if (!r) throw new Error('Localized tool copy is missing.');
    return JSON.parse(r.textContent);
  }
  function g(t, r, e = 'info') {
    let o = t.querySelector('[data-status]');
    o && ((o.textContent = r), (o.dataset.kind = e));
  }
  function z(t) {
    let r = t.querySelector('[data-result]'),
      e = t.querySelector('[data-result-content]');
    (r && (r.hidden = !0), e && e.replaceChildren());
  }
  function k(t, r, e = 2) {
    return new Intl.NumberFormat(t, { maximumFractionDigits: e }).format(r);
  }
  async function j(t, r, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(r), g(t, e.messages.copied, 'success'));
    } catch {
      g(t, e.messages.copyUnavailable, 'error');
    }
  }
  var D = Object.freeze({
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    sqrt: Math.sqrt,
    abs: Math.abs,
    exp: Math.exp,
    ln: Math.log,
    log: Math.log10,
  });
  function K(t) {
    let r = String(t ?? '')
      .trim()
      .toLowerCase()
      .replaceAll('\u03C0', 'pi')
      .replace(/[٠-٩۰-۹]/gu, (n) => {
        let s = n.codePointAt(0);
        return String(s - (s >= 1776 ? 1776 : 1632));
      })
      .replace(/[−–]/gu, '-');
    if (!r || r.length > 120) throw new RangeError('Enter an expression up to 120 characters.');
    let e = [],
      o = 0;
    for (; o < r.length;) {
      if (/\s/u.test(r[o])) {
        o += 1;
        continue;
      }
      let n = r.slice(o),
        s = /^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/u.exec(n),
        i = /^[a-z]+/u.exec(n),
        f = /^[+*/^()-]/u.exec(n),
        u = s ?? i ?? f;
      if (!u)
        throw new SyntaxError(
          'Only numbers, t, pi, e, arithmetic and supported functions are allowed.',
        );
      let l = u[0];
      if (
        (e.push(
          s
            ? { type: 'number', value: Number(l) }
            : i
              ? { type: 'name', value: l }
              : { type: 'operator', value: l },
        ),
        (o += l.length),
        e.length > 80)
      )
        throw new RangeError('The expression has too many parts.');
    }
    return e;
  }
  function G(t) {
    let r = K(t),
      e = 0,
      o = 0,
      n = () => r[e],
      s = (a) => {
        if (n()?.value !== a) throw new SyntaxError(`Expected ${a}.`);
        e += 1;
      },
      i = (a) => {
        if (((o += 1), o > 20)) throw new RangeError('The expression is nested too deeply.');
        try {
          return a();
        } finally {
          o -= 1;
        }
      };
    function f() {
      return i(() => {
        let a = n();
        if (!a) throw new SyntaxError('An expression is incomplete.');
        if (a.type === 'number') return ((e += 1), { type: 'number', value: a.value });
        if (a.value === '(') {
          e += 1;
          let c = b();
          return (s(')'), c);
        }
        if (a.type === 'name') {
          if (((e += 1), a.value === 't')) return { type: 'variable' };
          if (a.value === 'pi' || a.value === 'e')
            return { type: 'number', value: a.value === 'pi' ? Math.PI : Math.E };
          if (!Object.hasOwn(D, a.value)) throw new SyntaxError(`Unsupported name: ${a.value}.`);
          s('(');
          let c = b();
          return (s(')'), { type: 'call', name: a.value, argument: c });
        }
        throw new SyntaxError('Expected a number, t, function or parenthesis.');
      });
    }
    function u() {
      let a = f();
      return (
        n()?.value === '^' && ((e += 1), (a = { type: 'binary', op: '^', left: a, right: l() })),
        a
      );
    }
    function l() {
      if (n()?.value === '+' || n()?.value === '-') {
        let a = n().value;
        return ((e += 1), { type: 'unary', op: a, argument: l() });
      }
      return u();
    }
    function x() {
      let a = l();
      for (; n()?.value === '*' || n()?.value === '/';) {
        let c = n().value;
        ((e += 1), (a = { type: 'binary', op: c, left: a, right: l() }));
      }
      return a;
    }
    function b() {
      let a = x();
      for (; n()?.value === '+' || n()?.value === '-';) {
        let c = n().value;
        ((e += 1), (a = { type: 'binary', op: c, left: a, right: x() }));
      }
      return a;
    }
    let E = b();
    if (e !== r.length)
      throw new SyntaxError('Check the operator or parentheses in the expression.');
    return E;
  }
  function R(t, r, e = 'radians') {
    switch (t.type) {
      case 'number':
        return t.value;
      case 'variable':
        return r;
      case 'unary':
        return t.op === '-' ? -R(t.argument, r, e) : R(t.argument, r, e);
      case 'call': {
        let o = R(t.argument, r, e);
        return D[t.name](
          e === 'degrees' && ['sin', 'cos', 'tan'].includes(t.name) ? (o * Math.PI) / 180 : o,
        );
      }
      case 'binary': {
        let o = R(t.left, r, e),
          n = R(t.right, r, e);
        return t.op === '+'
          ? o + n
          : t.op === '-'
            ? o - n
            : t.op === '*'
              ? o * n
              : t.op === '/'
                ? n === 0
                  ? Number.NaN
                  : o / n
                : o ** n;
      }
      default:
        throw new TypeError('Invalid expression tree.');
    }
  }
  function P(t, { angleUnit: r = 'radians' } = {}) {
    if (!['radians', 'degrees'].includes(r)) throw new RangeError('Choose radians or degrees.');
    let e = G(t);
    return (o) => {
      let n = Number(o);
      if (!Number.isFinite(n) || Math.abs(n) > 1e4)
        throw new RangeError('The parameter must be finite and within the supported range.');
      return R(e, n, r);
    };
  }
  var W = Object.freeze({
    maxLength: 120,
    maxTokens: 80,
    maxDepth: 20,
    minSamples: 50,
    maxSamples: 1500,
  });
  var L = 1e9;
  function X({
    radiusExpression: t,
    angleMin: r,
    angleMax: e,
    angleUnit: o = 'radians',
    samples: n,
  }) {
    let s = Number(r),
      i = Number(e),
      f = Number(n);
    if (
      !Number.isFinite(s) ||
      !Number.isFinite(i) ||
      i <= s ||
      Math.abs(s) > 1e4 ||
      Math.abs(i) > 1e4
    )
      throw new RangeError('Enter an increasing, bounded angle interval.');
    if (!['radians', 'degrees'].includes(o)) throw new RangeError('Choose radians or degrees.');
    if (!Number.isInteger(f) || f < 50 || f > 1500)
      throw new RangeError('Choose between 50 and 1,500 points.');
    let u = String(t ?? '').replace(/[θϑ]/gu, 't'),
      l = P(u, { angleUnit: o }),
      x = o === 'degrees' ? Math.PI / 180 : 1,
      b = [];
    for (let a = 0; a < f; a += 1) {
      let c = s + ((i - s) * a) / (f - 1),
        p = c * x,
        m = l(c),
        w = m * Math.cos(p),
        y = m * Math.sin(p),
        S =
          Number.isFinite(m) &&
          Math.abs(m) <= L &&
          Number.isFinite(w) &&
          Number.isFinite(y) &&
          Math.abs(w) <= L &&
          Math.abs(y) <= L;
      b.push(Object.freeze({ angle: c, theta: p, radius: m, x: w, y, valid: S }));
    }
    let E = b.filter(({ valid: a }) => a).length;
    if (E < 2) throw new RangeError('The expression did not produce enough finite points.');
    return Object.freeze({
      points: Object.freeze(b),
      validCount: E,
      angleUnit: o,
      minimum: s,
      maximum: i,
      radiusExpression: String(t).trim(),
    });
  }
  var re = Object.freeze({ minSamples: 50, maxSamples: 1500, maxMagnitude: L, maxAngle: 1e4 });
  var d = document.querySelector('[data-tool="polar-graphing-calculator"]');
  if (d) {
    let x = function () {
        (z(d),
          o.replaceChildren(),
          (n.textContent = ''),
          (u = void 0),
          l && URL.revokeObjectURL(l),
          (l = void 0));
      },
      b = function (c) {
        let p = 'http://www.w3.org/2000/svg',
          m = document.createElementNS(p, 'svg');
        (m.setAttribute('viewBox', '0 0 640 420'),
          m.setAttribute('role', 'img'),
          m.setAttribute('aria-label', r.fields.chartLabel),
          m.classList.add('polar-graph-chart'));
        let w = document.createElementNS(p, 'title');
        ((w.textContent = r.fields.chartLabel), m.append(w));
        let y = c.filter((h) => h.valid),
          S = Math.max(1, ...y.map(({ x: h, y: V }) => Math.max(Math.abs(h), Math.abs(V)))),
          v = 28,
          M = 364,
          N = v + M / 2,
          I = M / (2 * S),
          U = (h) => N + h * I,
          B = (h) => N - h * I,
          T = document.createElementNS(p, 'path');
        (T.setAttribute('d', `M${v},${N}H${v + M}M${N},${v}V${v + M}`),
          T.classList.add('polar-graph-chart__axes'),
          m.append(T));
        let C = document.createElementNS(p, 'circle');
        (C.setAttribute('cx', String(N)),
          C.setAttribute('cy', String(N)),
          C.setAttribute('r', String(M / 2)),
          C.classList.add('polar-graph-chart__frame'),
          m.append(C));
        let q = '',
          $ = !1,
          A,
          H = S * 0.25;
        for (let h of c)
          ((!h.valid || (A && Math.hypot(h.x - A.x, h.y - A.y) > H)) && ($ = !1),
            h.valid
              ? ((q += `${$ ? 'L' : 'M'}${U(h.x).toFixed(2)},${B(h.y).toFixed(2)}`),
                ($ = !0),
                (A = h))
              : (A = void 0));
        let F = document.createElementNS(p, 'path');
        return (
          F.setAttribute('d', q),
          F.setAttribute('fill', 'none'),
          F.classList.add('polar-graph-chart__curve'),
          m.append(F),
          m
        );
      },
      E = function (c) {
        (c?.preventDefault(), x());
        try {
          ((u = X({
            radiusExpression: t.elements.namedItem('radiusExpression').value,
            angleMin: i('angleMin'),
            angleMax: i('angleMax'),
            angleUnit: t.elements.namedItem('angleUnit').value,
            samples: i('samples'),
          })),
            o.append(b(u.points)),
            (n.textContent = `${r.fields.resultCount}: ${u.validCount} / ${u.points.length}`),
            (e.hidden = !1),
            g(d, r.messages.calculated, 'success'));
        } catch {
          g(d, r.messages.checkInputs, 'error');
        }
      },
      a = function () {
        return u
          ? [u.points[0], u.points[Math.floor((u.points.length - 1) / 2)], u.points.at(-1)]
              .filter((p) => p?.valid)
              .map(
                (p) =>
                  `\u03B8=${f(p.angle)} ${u.angleUnit}; r=${f(p.radius)}; x=${f(p.x)}; y=${f(p.y)}`,
              ).join(`
`)
          : '';
      },
      t = d.querySelector('#tool-form'),
      r = _(d),
      e = d.querySelector('[data-result]'),
      o = d.querySelector('[data-result-content]'),
      n = d.querySelector('[data-result-count]'),
      s = () => document.documentElement.lang || 'en',
      i = (c) => O(t.elements.namedItem(c).value, s()),
      f = (c) => k(s(), c, 5),
      u,
      l;
    (t.addEventListener('submit', E),
      t.addEventListener('input', () => {
        (x(), g(d, ''));
      }),
      t.addEventListener('reset', () =>
        queueMicrotask(() => {
          (x(), g(d, ''));
        }),
      ),
      d.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('radiusExpression').value = '1'),
          (t.elements.namedItem('angleMin').value = '0'),
          (t.elements.namedItem('angleMax').value = '360'),
          (t.elements.namedItem('angleUnit').value = 'degrees'),
          (t.elements.namedItem('samples').value = '361'),
          E(),
          g(d, r.messages.exampleLoaded, 'success'));
      }),
      d.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        u && j(d, a(), r);
      }),
      d.querySelector('[data-action="downloadCsv"]')?.addEventListener('click', () => {
        if (!u) return g(d, r.messages.checkInputs, 'error');
        try {
          let c = [
              'angle,radius,x,y',
              ...u.points
                .filter(({ valid: w }) => w)
                .map(({ angle: w, radius: y, x: S, y: v }) => [w, y, S, v].join(',')),
            ],
            p = new Blob(
              [
                `\uFEFF${c.join(`\r
`)}`,
              ],
              { type: 'text/csv;charset=utf-8' },
            );
          (l && URL.revokeObjectURL(l), (l = URL.createObjectURL(p)));
          let m = document.createElement('a');
          ((m.href = l),
            (m.download = 'polar-graph-points.csv'),
            m.click(),
            g(d, r.messages.downloaded, 'success'));
        } catch {
          g(d, r.messages.downloadUnavailable, 'error');
        }
      }),
      window.addEventListener(
        'pagehide',
        () => {
          l && URL.revokeObjectURL(l);
        },
        { once: !0 },
      ));
  }
})();
