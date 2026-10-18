(() => {
  var P = Object.freeze({
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
  function y(r, n = 'en') {
    let e = String(r)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (i) => String(i.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (i) => String(i.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (i) => String(i.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (i) => String(i.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let o = new Intl.NumberFormat(n).formatToParts(12345.6),
      t = o.find((i) => i.type === 'decimal')?.value ?? '.',
      s = o.find((i) => i.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      t === ','
        ? e.includes(',')
          ? (e = e.replaceAll(s, '').replace(',', '.'))
          : s === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : t === '.'
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
          : e.includes(t) && (e = e.replaceAll(s, '').replace(t, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var B = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function N(r = document) {
    let n = r.querySelector('[data-tool-copy]');
    if (!n) throw new Error('Localized tool copy is missing.');
    return JSON.parse(n.textContent);
  }
  function d(r, n, e = 'info') {
    let o = r.querySelector('[data-status]');
    o && ((o.textContent = n), (o.dataset.kind = e));
  }
  function E(r) {
    let n = r.querySelector('[data-result]'),
      e = r.querySelector('[data-result-content]');
    (n && (n.hidden = !0), e && e.replaceChildren());
  }
  function C(r, n) {
    let e = r.querySelector('[data-result]'),
      o = r.querySelector('[data-result-content]');
    if (!e || !o) return;
    let t = document.createElement('dl');
    for (let [s, i] of n) {
      let l = document.createElement('dt'),
        c = document.createElement('dd');
      ((l.textContent = s), (c.textContent = i), t.append(l, c));
    }
    (o.replaceChildren(t), (e.hidden = !1));
  }
  function M(r, n, e = 2) {
    return new Intl.NumberFormat(r, { maximumFractionDigits: e }).format(n);
  }
  async function R(r, n, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(n), d(r, e.messages.copied, 'success'));
    } catch {
      d(r, e.messages.copyUnavailable, 'error');
    }
  }
  var T = Object.freeze({
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    sqrt: Math.sqrt,
    abs: Math.abs,
    exp: Math.exp,
    ln: Math.log,
    log: Math.log10,
  });
  function _(r) {
    let n = String(r ?? '')
      .trim()
      .toLowerCase()
      .replaceAll('\u03C0', 'pi')
      .replace(/[٠-٩۰-۹]/gu, (t) => {
        let s = t.codePointAt(0);
        return String(s - (s >= 1776 ? 1776 : 1632));
      })
      .replace(/[−–]/gu, '-');
    if (!n || n.length > 120) throw new RangeError('Enter an expression up to 120 characters.');
    let e = [],
      o = 0;
    for (; o < n.length;) {
      if (/\s/u.test(n[o])) {
        o += 1;
        continue;
      }
      let t = n.slice(o),
        s = /^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/u.exec(t),
        i = /^[a-z]+/u.exec(t),
        l = /^[+*/^()-]/u.exec(t),
        c = s ?? i ?? l;
      if (!c)
        throw new SyntaxError(
          'Only numbers, t, pi, e, arithmetic and supported functions are allowed.',
        );
      let u = c[0];
      if (
        (e.push(
          s
            ? { type: 'number', value: Number(u) }
            : i
              ? { type: 'name', value: u }
              : { type: 'operator', value: u },
        ),
        (o += u.length),
        e.length > 80)
      )
        throw new RangeError('The expression has too many parts.');
    }
    return e;
  }
  function D(r) {
    let n = _(r),
      e = 0,
      o = 0,
      t = () => n[e],
      s = (a) => {
        if (t()?.value !== a) throw new SyntaxError(`Expected ${a}.`);
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
    function l() {
      return i(() => {
        let a = t();
        if (!a) throw new SyntaxError('An expression is incomplete.');
        if (a.type === 'number') return ((e += 1), { type: 'number', value: a.value });
        if (a.value === '(') {
          e += 1;
          let m = g();
          return (s(')'), m);
        }
        if (a.type === 'name') {
          if (((e += 1), a.value === 't')) return { type: 'variable' };
          if (a.value === 'pi' || a.value === 'e')
            return { type: 'number', value: a.value === 'pi' ? Math.PI : Math.E };
          if (!Object.hasOwn(T, a.value)) throw new SyntaxError(`Unsupported name: ${a.value}.`);
          s('(');
          let m = g();
          return (s(')'), { type: 'call', name: a.value, argument: m });
        }
        throw new SyntaxError('Expected a number, t, function or parenthesis.');
      });
    }
    function c() {
      let a = l();
      return (
        t()?.value === '^' && ((e += 1), (a = { type: 'binary', op: '^', left: a, right: u() })),
        a
      );
    }
    function u() {
      if (t()?.value === '+' || t()?.value === '-') {
        let a = t().value;
        return ((e += 1), { type: 'unary', op: a, argument: u() });
      }
      return c();
    }
    function h() {
      let a = u();
      for (; t()?.value === '*' || t()?.value === '/';) {
        let m = t().value;
        ((e += 1), (a = { type: 'binary', op: m, left: a, right: u() }));
      }
      return a;
    }
    function g() {
      let a = h();
      for (; t()?.value === '+' || t()?.value === '-';) {
        let m = t().value;
        ((e += 1), (a = { type: 'binary', op: m, left: a, right: h() }));
      }
      return a;
    }
    let b = g();
    if (e !== n.length)
      throw new SyntaxError('Check the operator or parentheses in the expression.');
    return b;
  }
  function w(r, n, e = 'radians') {
    switch (r.type) {
      case 'number':
        return r.value;
      case 'variable':
        return n;
      case 'unary':
        return r.op === '-' ? -w(r.argument, n, e) : w(r.argument, n, e);
      case 'call': {
        let o = w(r.argument, n, e);
        return T[r.name](
          e === 'degrees' && ['sin', 'cos', 'tan'].includes(r.name) ? (o * Math.PI) / 180 : o,
        );
      }
      case 'binary': {
        let o = w(r.left, n, e),
          t = w(r.right, n, e);
        return r.op === '+'
          ? o + t
          : r.op === '-'
            ? o - t
            : r.op === '*'
              ? o * t
              : r.op === '/'
                ? t === 0
                  ? Number.NaN
                  : o / t
                : o ** t;
      }
      default:
        throw new TypeError('Invalid expression tree.');
    }
  }
  function A(r, { angleUnit: n = 'radians' } = {}) {
    if (!['radians', 'degrees'].includes(n)) throw new RangeError('Choose radians or degrees.');
    let e = D(r);
    return (o) => {
      let t = Number(o);
      if (!Number.isFinite(t) || Math.abs(t) > 1e4)
        throw new RangeError('The parameter must be finite and within the supported range.');
      return w(e, t, n);
    };
  }
  var U = Object.freeze({
    maxLength: 120,
    maxTokens: 80,
    maxDepth: 20,
    minSamples: 50,
    maxSamples: 1500,
  });
  var L = 1e6,
    v = [0.1, 0.01, 0.001, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12],
    S = [100, 1e3, 1e4];
  function X(r) {
    let n = String(r ?? '')
      .trim()
      .replace(/\bx\b/giu, 't');
    if (!n || n.length > 120)
      throw new RangeError('Enter a supported expression up to 120 characters.');
    return A(n, { angleUnit: 'radians' });
  }
  function I(r, n, e) {
    return Math.abs(r - n) <= e * Math.max(1, Math.abs(r), Math.abs(n));
  }
  function k(r, n, e = 1e6) {
    let o = r.filter(Number.isFinite);
    if (o.length < 3) return { kind: 'undefined' };
    let t = o.slice(-4);
    if (
      t.length >= 3 &&
      t.every((i) => i > 0) &&
      t.at(-1) > e &&
      t.at(-1) > t.at(-2) * 5 &&
      t.at(-2) > t.at(-3) * 5
    )
      return { kind: 'infinity', sign: 1 };
    if (
      t.length >= 3 &&
      t.every((i) => i < 0) &&
      Math.abs(t.at(-1)) > e &&
      Math.abs(t.at(-1)) > Math.abs(t.at(-2)) * 5 &&
      Math.abs(t.at(-2)) > Math.abs(t.at(-3)) * 5
    )
      return { kind: 'infinity', sign: -1 };
    let s = o.at(-1);
    return t.slice(-3).every((i) => I(i, s, n))
      ? { kind: 'finite', value: s }
      : { kind: 'unstable', value: s };
  }
  function F(r, n, e, o) {
    let t = v.map((s) => r(n + e * Math.max(1, Math.abs(n)) * s));
    return k(t, o);
  }
  function j(r, n, e) {
    let o = S.map((c) => r(n * c)),
      t = k(o, e, 1e3);
    if (t.kind !== 'unstable') return t;
    let s = o.slice(1).map((c, u) => Math.abs(c - o[u])),
      [i, l] = s.slice(-2);
    if (Number.isFinite(i) && Number.isFinite(l) && i > 0 && l / i < 0.2) {
      let c = l / i,
        u = o.at(-1) + ((o.at(-1) - o.at(-2)) * c) / (1 - c);
      if (Number.isFinite(u))
        return { kind: 'finite', value: Math.abs(u) < e ? 0 : u, approximate: !0 };
    }
    return t;
  }
  function O({ expression: r, point: n = 0, direction: e = 'both', tolerance: o = 1e-5 }) {
    if (!['both', 'left', 'right', 'positive-infinity', 'negative-infinity'].includes(e))
      throw new RangeError('Choose a supported limit direction.');
    let t = Number(o);
    if (!Number.isFinite(t) || t < 1e-10 || t > 0.01)
      throw new RangeError('Choose a tolerance from 0.0000000001 to 0.01.');
    let s = X(r);
    if (e === 'positive-infinity' || e === 'negative-infinity') {
      let h = j(s, e === 'positive-infinity' ? 1 : -1, t);
      return Object.freeze({
        direction: e,
        point: e === 'positive-infinity' ? 1 / 0 : -1 / 0,
        result: h,
        expression: String(r).trim(),
        samples: S.length,
      });
    }
    let i = Number(n);
    if (!Number.isFinite(i) || Math.abs(i) > L)
      throw new RangeError('Enter a finite target from \u22121,000,000 to 1,000,000.');
    let l = e === 'right' ? null : F(s, i, -1, t),
      c = e === 'left' ? null : F(s, i, 1, t),
      u;
    return (
      e === 'left'
        ? (u = l)
        : e === 'right'
          ? (u = c)
          : l.kind === 'finite' && c.kind === 'finite' && I(l.value, c.value, t * 5)
            ? (u = { kind: 'finite', value: (l.value + c.value) / 2 })
            : l.kind === 'infinity' && c.kind === 'infinity' && l.sign === c.sign
              ? (u = l)
              : (u = { kind: 'does-not-exist' }),
      Object.freeze({
        direction: e,
        point: i,
        left: l,
        right: c,
        result: u,
        expression: String(r).trim(),
        samples: v.length,
      })
    );
  }
  var Q = Object.freeze({
    maxExpressionLength: 120,
    maxTargetMagnitude: L,
    toleranceMin: 1e-10,
    toleranceMax: 0.01,
    nearPointSamples: v.length,
    infinitySampleMax: S.at(-1),
  });
  var f = document.querySelector('[data-tool="limit-calculator"]');
  if (f) {
    let u = function (a) {
        return !a || a.kind === 'undefined'
          ? n.fields.undefinedResult
          : a.kind === 'does-not-exist'
            ? n.fields.noLimit
            : a.kind === 'unstable'
              ? n.fields.notConverged
              : a.kind === 'infinity'
                ? a.sign < 0
                  ? '\u2212\u221E'
                  : '\u221E'
                : t(a.value);
      },
      h = function () {
        let a = l.value.endsWith('infinity');
        ((i.disabled = a), c?.classList.toggle('is-disabled', a));
      },
      g = function (a) {
        (a?.preventDefault(), E(f), (o = ''));
        try {
          let m = l.value,
            p = O({
              expression: s.value,
              point: m.endsWith('infinity') ? 0 : y(i.value, e()),
              direction: m,
              tolerance: y(r.elements.namedItem('tolerance').value, e()),
            }),
            $ = p.point === 1 / 0 ? '+\u221E' : p.point === -1 / 0 ? '\u2212\u221E' : t(p.point),
            x = [
              [n.fields.expression, p.expression],
              [n.fields.target, $],
              [n.fields.resultLimit, u(p.result)],
            ];
          (p.left && x.push([n.fields.leftLimit, u(p.left)]),
            p.right && x.push([n.fields.rightLimit, u(p.right)]),
            x.push([n.fields.methodNote, n.fields.sampledNote]),
            C(f, x),
            (o = x.map(([q, z]) => `${q}: ${z}`).join(`
`)),
            d(
              f,
              p.result.kind === 'unstable' ? n.messages.notConverged : n.messages.calculated,
              p.result.kind === 'unstable' ? 'error' : 'success',
            ));
        } catch {
          d(f, n.messages.checkInputs, 'error');
        }
      },
      b = function () {
        (E(f), (o = ''), d(f, ''));
      },
      r = f.querySelector('#tool-form'),
      n = N(f),
      e = () => document.documentElement.lang || 'en',
      o = '',
      t = (a) => M(e(), a, 8),
      s = r.elements.namedItem('expression'),
      i = r.elements.namedItem('point'),
      l = r.elements.namedItem('direction'),
      c = f.querySelector('[data-target-label]');
    (l.addEventListener('change', () => {
      (h(), b());
    }),
      r.addEventListener('input', b),
      r.addEventListener('submit', g),
      r.addEventListener('reset', () =>
        setTimeout(() => {
          (h(), b());
        }, 0),
      ),
      f.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((s.value = 'sin(x)/x'),
          (i.value = '0'),
          (l.value = 'both'),
          h(),
          g(),
          d(f, n.messages.exampleLoaded, 'success'));
      }),
      f.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && R(f, o, n);
      }),
      h());
  }
})();
