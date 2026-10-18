(() => {
  var L = Object.freeze({
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
  function S(n, t = 'en') {
    let e = String(n)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (o) => String(o.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (o) => String(o.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (o) => String(o.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (o) => String(o.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let i = new Intl.NumberFormat(t).formatToParts(12345.6),
      s = i.find((o) => o.type === 'decimal')?.value ?? '.',
      r = i.find((o) => o.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      s === ','
        ? e.includes(',')
          ? (e = e.replaceAll(r, '').replace(',', '.'))
          : r === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : s === '.'
          ? e.includes('.')
            ? ((r === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (r !== ',' && e.includes(r))) &&
              (e = e.replaceAll(r, ''))
            : e.includes(r) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(r, '')
                  : e.replace(r, '.'))
          : e.includes(s) && (e = e.replaceAll(r, '').replace(s, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var q = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function v(n = document) {
    let t = n.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function b(n, t, e = 'info') {
    let i = n.querySelector('[data-status]');
    i && ((i.textContent = t), (i.dataset.kind = e));
  }
  function x(n) {
    let t = n.querySelector('[data-result]'),
      e = n.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  function N(n, t) {
    let e = n.querySelector('[data-result]'),
      i = n.querySelector('[data-result-content]');
    if (!e || !i) return;
    let s = document.createElement('dl');
    for (let [r, o] of t) {
      let u = document.createElement('dt'),
        c = document.createElement('dd');
      ((u.textContent = r), (c.textContent = o), s.append(u, c));
    }
    (i.replaceChildren(s), (e.hidden = !1));
  }
  function R(n, t, e = 2) {
    return new Intl.NumberFormat(n, { maximumFractionDigits: e }).format(t);
  }
  async function I(n, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), b(n, e.messages.copied, 'success'));
    } catch {
      b(n, e.messages.copyUnavailable, 'error');
    }
  }
  function C(n, t) {
    let e = Number(n);
    if (!Number.isFinite(e) || Math.abs(e) > 1e9)
      throw new RangeError(`${t} must be finite and between \u221210\u2079 and 10\u2079.`);
    return e;
  }
  function m(n, t, e = !1, i = !1) {
    return Object.freeze({ left: n, right: t, leftClosed: e, rightClosed: i });
  }
  function $(n, t) {
    return t === 'lt' ? n < 0 : t === 'le' ? n <= 0 : t === 'gt' ? n > 0 : n >= 0;
  }
  function F(n, t, e) {
    let s = (e === 'lt' || e === 'le') === t > 0,
      r = e === 'le' || e === 'ge';
    return {
      intervals: [s ? m(-1 / 0, n, !1, r) : m(n, 1 / 0, r, !1)],
      allReal: !1,
      noSolution: !1,
    };
  }
  function T({ a: n, roots: t, discriminantSign: e, relation: i }) {
    let s = n > 0,
      r = i === 'lt' || i === 'le',
      o = i === 'le' || i === 'ge';
    if (e < 0) {
      let d = !s === r;
      return { intervals: d ? [m(-1 / 0, 1 / 0)] : [], allReal: d, noSolution: !d };
    }
    if (e === 0) {
      let l = t[0];
      return r === !s
        ? o
          ? { intervals: [m(-1 / 0, 1 / 0)], allReal: !0, noSolution: !1 }
          : { intervals: [m(-1 / 0, l, !1, !1), m(l, 1 / 0, !1, !1)], allReal: !1, noSolution: !1 }
        : o
          ? { intervals: [m(l, l, !0, !0)], allReal: !1, noSolution: !1 }
          : { intervals: [], allReal: !1, noSolution: !0 };
    }
    let [u, c] = t;
    return r === s
      ? { intervals: [m(u, c, o, o)], allReal: !1, noSolution: !1 }
      : { intervals: [m(-1 / 0, u, !1, o), m(c, 1 / 0, o, !1)], allReal: !1, noSolution: !1 };
  }
  function A({ a: n, b: t, c: e, relation: i = 'gt' }) {
    let s = { a: C(n, 'a'), b: C(t, 'b'), c: C(e, 'c') };
    if (!['lt', 'le', 'gt', 'ge'].includes(i))
      throw new RangeError('Choose <, \u2264, >, or \u2265.');
    let { a: r, b: o, c: u } = s;
    if (r === 0 && o === 0) {
      let g = $(u, i);
      return Object.freeze({
        ...s,
        relation: i,
        degree: 0,
        roots: Object.freeze([]),
        intervals: Object.freeze(g ? [m(-1 / 0, 1 / 0)] : []),
        allReal: g,
        noSolution: !g,
      });
    }
    if (r === 0) {
      let g = -u / o,
        h = F(g, o, i);
      return Object.freeze({
        ...s,
        relation: i,
        degree: 1,
        roots: Object.freeze([g]),
        ...h,
        intervals: Object.freeze(h.intervals),
      });
    }
    let c = o * o - 4 * r * u,
      p = Math.max(o * o, Math.abs(4 * r * u)),
      l = p > 0 && Math.abs(c) <= p * 1e-12 ? 0 : c,
      d = Math.sign(l),
      w = [];
    if (d === 0) w = [-o / (2 * r)];
    else if (d > 0) {
      let g = Math.sqrt(l),
        h = -0.5 * (o + Math.sign(o || 1) * g),
        a = h / r,
        E = u / h;
      w = [Math.min(a, E), Math.max(a, E)];
    }
    let y = T({ a: r, roots: w, discriminantSign: d, relation: i });
    return Object.freeze({
      ...s,
      relation: i,
      degree: 2,
      discriminant: l,
      roots: Object.freeze(w),
      ...y,
      intervals: Object.freeze(y.intervals),
    });
  }
  var M = Object.freeze({
    maxCoefficient: 1e9,
    supportedDegrees: Object.freeze([0, 1, 2]),
    supportedRelations: Object.freeze(['lt', 'le', 'gt', 'ge']),
  });
  var f = document.querySelector('[data-tool="inequality-calculator"]');
  if (f) {
    let o = function (c) {
        (c?.preventDefault(), x(f), (s = ''));
        try {
          let p = (a) => S(n.elements.namedItem(a).value, e()),
            l = A({
              a: p('coefficientA'),
              b: p('coefficientB'),
              c: p('coefficientC'),
              relation: n.elements.namedItem('relation').value,
            }),
            d = l.allReal
              ? '\u211D'
              : l.noSolution
                ? '\u2205'
                : l.intervals
                    .map(
                      (a) =>
                        `${a.leftClosed ? '[' : '('}${r(a.left)}; ${r(a.right)}${a.rightClosed ? ']' : ')'}`,
                    )
                    .join(' \u222A '),
            w = l.allReal
              ? `${t.fields.leftArrow}\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501${t.fields.rightArrow}`
              : l.noSolution
                ? '\u2205'
                : l.intervals
                    .map((a) =>
                      a.left === -1 / 0 && a.right === 1 / 0
                        ? `${t.fields.leftArrow}\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501${t.fields.rightArrow}`
                        : a.left === a.right
                          ? `${r(a.left)} ${a.leftClosed ? '\u25CF' : '\u25CB'}`
                          : a.left === -1 / 0
                            ? `${t.fields.leftArrow}\u2501\u2501\u2501\u2501 ${a.rightClosed ? '\u25CF' : '\u25CB'} ${r(a.right)}`
                            : a.right === 1 / 0
                              ? `${r(a.left)} ${a.leftClosed ? '\u25CF' : '\u25CB'} \u2501\u2501\u2501\u2501${t.fields.rightArrow}`
                              : `${r(a.left)} ${a.leftClosed ? '\u25CF' : '\u25CB'}\u2501\u2501\u2501\u2501${a.rightClosed ? '\u25CF' : '\u25CB'} ${r(a.right)}`,
                    )
                    .join(' \u222A '),
            y = l.roots.length ? l.roots.map(i).join(', ') : t.fields.none,
            g = l.allReal ? t.fields.allRealNumbers : l.noSolution ? t.fields.noRealSolution : d,
            h = [
              [t.fields.resultSolution, g],
              [t.fields.resultCriticalPoints, y],
              [t.fields.resultInterval, d],
              [t.fields.resultNumberLine, w],
              [t.fields.resultDegree, i(l.degree)],
            ];
          (N(f, h),
            (s = h.map(([a, E]) => `${a}: ${E}`).join(`
`)),
            b(f, t.messages.calculated, 'success'));
        } catch {
          b(f, t.messages.checkInputs, 'error');
        }
      },
      u = function () {
        (x(f), (s = ''), b(f, ''));
      },
      n = f.querySelector('#tool-form'),
      t = v(f),
      e = () => document.documentElement.lang || 'en',
      i = (c) => R(e(), c, 8),
      s = '',
      r = (c) =>
        c === -1 / 0 ? t.fields.negativeInfinity : c === 1 / 0 ? t.fields.positiveInfinity : i(c);
    (n.addEventListener('input', u),
      n.addEventListener('submit', o),
      n.addEventListener('reset', () => setTimeout(u, 0)),
      f.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((n.elements.namedItem('coefficientA').value = '0'),
          (n.elements.namedItem('coefficientB').value = '2'),
          (n.elements.namedItem('coefficientC').value = '-6'),
          (n.elements.namedItem('relation').value = 'gt'),
          o());
      }),
      f.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        s && I(f, s, t);
      }));
  }
})();
