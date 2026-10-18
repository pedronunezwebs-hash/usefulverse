(() => {
  var F = Object.freeze({
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
  function A(r, t = 'en') {
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
    let n = new Intl.NumberFormat(t).formatToParts(12345.6),
      a = n.find((i) => i.type === 'decimal')?.value ?? '.',
      o = n.find((i) => i.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      a === ','
        ? e.includes(',')
          ? (e = e.replaceAll(o, '').replace(',', '.'))
          : o === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : a === '.'
          ? e.includes('.')
            ? ((o === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (o !== ',' && e.includes(o))) &&
              (e = e.replaceAll(o, ''))
            : e.includes(o) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(o, '')
                  : e.replace(o, '.'))
          : e.includes(a) && (e = e.replaceAll(o, '').replace(a, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var $ = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function y(r = document) {
    let t = r.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function w(r, t, e = 'info') {
    let n = r.querySelector('[data-status]');
    n && ((n.textContent = t), (n.dataset.kind = e));
  }
  function E(r) {
    let t = r.querySelector('[data-result]'),
      e = r.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  function C(r, t) {
    let e = r.querySelector('[data-result]'),
      n = r.querySelector('[data-result-content]');
    if (!e || !n) return;
    let a = document.createElement('dl');
    for (let [o, i] of t) {
      let h = document.createElement('dt'),
        c = document.createElement('dd');
      ((h.textContent = o), (c.textContent = i), a.append(h, c));
    }
    (n.replaceChildren(a), (e.hidden = !1));
  }
  function N(r, t, e = 2) {
    return new Intl.NumberFormat(r, { maximumFractionDigits: e }).format(t);
  }
  async function R(r, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), w(r, e.messages.copied, 'success'));
    } catch {
      w(r, e.messages.copyUnavailable, 'error');
    }
  }
  var M = new Set([1e-6, 1e-8, 1e-10, 1e-12]);
  function L(r) {
    if (!Array.isArray(r) || r.length < 1 || r.length > 12 || !Array.isArray(r[0]))
      throw new RangeError('Enter a matrix with 1 to 12 rows.');
    let t = r[0].length;
    if (t < 1 || t > 12 || r.some((n) => !Array.isArray(n) || n.length !== t))
      throw new RangeError('Use a rectangular matrix with 1 to 12 columns.');
    return {
      matrix: r.map((n) =>
        n.map((a) => {
          let o = Number(a);
          if (!Number.isFinite(o) || Math.abs(o) > 1e9)
            throw new RangeError(
              'Every entry must be finite and between \u22121000000000 and 1000000000.',
            );
          return o;
        }),
      ),
      columns: t,
    };
  }
  function S(r, t) {
    return Math.abs(r) <= t ? 0 : Math.abs(r - 1) <= t ? 1 : Math.abs(r + 1) <= t ? -1 : r;
  }
  function v(r, { tolerance: t = 1e-10 } = {}) {
    if (!M.has(Number(t)))
      throw new RangeError(
        'Choose a supported tolerance: 10\u207B\u2076, 10\u207B\u2078, 10\u207B\xB9\u2070 or 10\u207B\xB9\xB2.',
      );
    let { matrix: e, columns: n } = L(r),
      a = Number(t),
      o = [],
      i = (s) => {
        o.length < 256 && o.push(s);
      },
      h = e.map((s) => [...s]),
      c = 0,
      l = [];
    for (let s = 0; s < n && c < e.length; s += 1) {
      let f = c;
      for (let m = c + 1; m < e.length; m += 1) Math.abs(e[m][s]) > Math.abs(e[f][s]) && (f = m);
      if (Math.abs(e[f][s]) <= a) continue;
      f !== c && (([e[c], e[f]] = [e[f], e[c]]), i({ type: 'swap', first: c, second: f }));
      let b = e[c][s];
      Math.abs(b - 1) > a &&
        ((e[c] = e[c].map((m) => S(m / b, a))), i({ type: 'scale', row: c, factor: 1 / b }));
      for (let m = 0; m < e.length; m += 1) {
        if (m === c) continue;
        let p = e[m][s];
        if (Math.abs(p) <= a) {
          e[m][s] = 0;
          continue;
        }
        ((e[m] = e[m].map((x, T) => S(x - p * e[c][T], a))),
          i({ type: 'add', target: m, source: c, factor: -p }));
      }
      (l.push(s), (c += 1));
    }
    let u = e.map((s) => s.map((f) => S(f, a))),
      g = Math.max(
        0,
        ...h.map((s) => Math.max(...s.map((f) => Math.abs(f)))),
        ...u.map((s) => Math.max(...s.map((f) => Math.abs(f)))),
      );
    return Object.freeze({
      matrix: u,
      rank: l.length,
      pivotColumns: Object.freeze(l),
      steps: Object.freeze(o),
      stepsTruncated: o.length >= 256,
      rows: e.length,
      columns: n,
      tolerance: a,
      residualScale: g,
    });
  }
  var O = Object.freeze({
    maxRows: 12,
    maxColumns: 12,
    maxAbsEntry: 1e9,
    maxSteps: 256,
    tolerances: Object.freeze([...M]),
  });
  var d = document.querySelector('[data-tool="rref-calculator"]');
  if (d) {
    let o = function () {
        let l = r.elements
          .namedItem('matrix')
          .value.trim()
          .split(/\r?\n/u)
          .filter((u) => u.trim());
        if (!l.length) throw new RangeError(t.messages.checkInputs);
        return l.map((u) => {
          let g = u
            .trim()
            .split(/[;\s]+/u)
            .filter(Boolean);
          if (!g.length) throw new RangeError(t.messages.checkInputs);
          return g.map((s) => A(s, e()));
        });
      },
      i = function (l) {
        let u = t.fields;
        return l.type === 'swap'
          ? u.stepSwap.replace('{first}', n(l.first + 1)).replace('{second}', n(l.second + 1))
          : l.type === 'scale'
            ? u.stepScale.replace('{row}', n(l.row + 1)).replace('{factor}', n(l.factor))
            : u.stepAdd
                .replace('{factor}', n(l.factor))
                .replace('{source}', n(l.source + 1))
                .replace('{target}', n(l.target + 1));
      },
      h = function (l) {
        (l?.preventDefault(), E(d), (a = ''));
        try {
          let u = v(o(), { tolerance: Number(r.elements.namedItem('tolerance').value) }),
            g = u.matrix.map((p) => `[${p.map(n).join(', ')}]`).join(' ; '),
            s = u.pivotColumns.length ? u.pivotColumns.map((p) => n(p + 1)).join(', ') : '\u2014',
            f = u.steps.length
              ? u.steps.map((p, x) => `${n(x + 1)}. ${i(p)}`).join(`
`)
              : t.fields.noOperations,
            b = u.stepsTruncated
              ? `${f}
${t.fields.stepsLimited}`
              : f,
            m = [
              [t.fields.resultMatrix, g],
              [t.fields.resultRank, n(u.rank)],
              [t.fields.pivotColumns, s],
              [t.fields.operations, b],
            ];
          (C(d, m),
            (a = m.map(
              ([p, x]) => `${p}:
${x}`,
            ).join(`

`)),
            w(d, t.messages.calculated, 'success'));
        } catch {
          w(d, t.messages.checkInputs, 'error');
        }
      },
      c = function () {
        (E(d), (a = ''), w(d, ''));
      },
      r = d.querySelector('#tool-form'),
      t = y(d),
      e = () => document.documentElement.lang || 'en',
      n = (l) => N(e(), l, 8),
      a = '';
    (r.addEventListener('input', c),
      r.addEventListener('submit', h),
      r.addEventListener('reset', () => setTimeout(c, 0)),
      d.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((r.elements.namedItem('matrix').value = `0 2 4
1 1 3`),
          (r.elements.namedItem('tolerance').value = '0.0000000001'),
          h());
      }),
      d.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        a && R(d, a, t);
      }));
  }
})();
