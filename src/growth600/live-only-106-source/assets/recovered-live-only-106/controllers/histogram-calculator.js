(() => {
  var ee = Object.freeze({
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
  function X(n, e = 'en') {
    let r = String(n)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (s) => String(s.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (s) => String(s.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (s) => String(s.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (s) => String(s.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!r) return Number.NaN;
    let t = new Intl.NumberFormat(e).formatToParts(12345.6),
      i = t.find((s) => s.type === 'decimal')?.value ?? '.',
      a = t.find((s) => s.type === 'group')?.value ?? ',';
    return (
      (r = r.replace(/[\s\u00a0\u202f]/gu, '')),
      i === ','
        ? r.includes(',')
          ? (r = r.replaceAll(a, '').replace(',', '.'))
          : a === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(r) && (r = r.replaceAll('.', ''))
        : i === '.'
          ? r.includes('.')
            ? ((a === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(r) ||
                (a !== ',' && r.includes(a))) &&
              (r = r.replaceAll(a, ''))
            : r.includes(a) &&
              (r =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(r) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(r)
                  ? r.replaceAll(a, '')
                  : r.replace(a, '.'))
          : r.includes(i) && (r = r.replaceAll(a, '').replace(i, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(r) ? Number(r) : Number.NaN
    );
  }
  var te = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function V(n = document) {
    let e = n.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function N(n, e, r = 'info') {
    let t = n.querySelector('[data-status]');
    t && ((t.textContent = e), (t.dataset.kind = r));
  }
  function H(n) {
    let e = n.querySelector('[data-result]'),
      r = n.querySelector('[data-result-content]');
    (e && (e.hidden = !0), r && r.replaceChildren());
  }
  function W(n, e) {
    let r = n.querySelector('[data-result]'),
      t = n.querySelector('[data-result-content]');
    if (!r || !t) return;
    let i = document.createElement('dl');
    for (let [a, s] of e) {
      let v = document.createElement('dt'),
        m = document.createElement('dd');
      ((v.textContent = a), (m.textContent = s), i.append(v, m));
    }
    (t.replaceChildren(i), (r.hidden = !1));
  }
  function G(n, e, r = 2) {
    return new Intl.NumberFormat(n, { maximumFractionDigits: r }).format(e);
  }
  async function K(n, e, r) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(e), N(n, r.messages.copied, 'success'));
    } catch {
      N(n, r.messages.copyUnavailable, 'error');
    }
  }
  var Q = new Set(['sturges', 'square-root', 'freedman-diaconis', 'custom']),
    Y = new Set(['count', 'relative', 'density']);
  function J(n, e) {
    if (n.length === 1) return n[0];
    let r = (n.length - 1) * e,
      t = Math.floor(r),
      i = r - t;
    return n[t] + (n[Math.min(t + 1, n.length - 1)] - n[t]) * i;
  }
  function P(n, e, r) {
    if (!Q.has(n)) throw new RangeError('Choose a supported binning method.');
    if (n === 'custom') {
      let t = Number(r);
      if (!Number.isInteger(t) || t < 1 || t > 50)
        throw new RangeError('Choose between 1 and 50 bins.');
      return { count: t, applied: 'custom' };
    }
    if (n === 'square-root')
      return {
        count: Math.max(1, Math.min(50, Math.ceil(Math.sqrt(e.length)))),
        applied: 'square-root',
      };
    if (n === 'freedman-diaconis') {
      let t = J(e, 0.75) - J(e, 0.25),
        i = t > 0 ? (2 * t) / Math.cbrt(e.length) : 0,
        a = e.at(-1) - e[0];
      if (i > 0 && a > 0)
        return { count: Math.max(1, Math.min(50, Math.ceil(a / i))), applied: 'freedman-diaconis' };
    }
    return {
      count: Math.max(1, Math.min(50, Math.ceil(1 + Math.log2(e.length)))),
      applied: n === 'freedman-diaconis' ? 'sturges-fallback' : 'sturges',
    };
  }
  function Z(n, { method: e = 'sturges', customBins: r = 10, heightMode: t = 'count' } = {}) {
    if (!Array.isArray(n) || n.length < 1 || n.length > 5e3)
      throw new RangeError('Enter between 1 and 5000 values.');
    if (!Y.has(t)) throw new RangeError('Choose a supported bar-height mode.');
    let i = n.map((h) => {
        let g = Number(h);
        if (!Number.isFinite(g) || Math.abs(g) > 1e9)
          throw new RangeError('Values must be finite and within \xB11000000000.');
        return g;
      }),
      a = [...i].sort((h, g) => h - g),
      { count: s, applied: v } = P(e, a, r),
      m = a[0],
      b = a.at(-1);
    if (m === b) {
      let h = Math.max(1, Math.abs(m) * 0.01);
      ((m -= h / 2), (b += h / 2));
    }
    let x = (b - m) / s,
      q = Array(s).fill(0);
    for (let h of i) {
      let g = Math.min(s - 1, Math.max(0, Math.floor((h - m) / x)));
      q[g] += 1;
    }
    let M = 0,
      F = q.map((h, g) => {
        let D = m + g * x,
          L = g === s - 1 ? b : m + (g + 1) * x;
        M += h;
        let I = h / i.length,
          A = I / x,
          o = t === 'relative' ? I * 100 : t === 'density' ? A : h;
        return Object.freeze({
          index: g,
          lower: D,
          upper: L,
          count: h,
          relativeFrequency: I,
          density: A,
          cumulativeCount: M,
          height: o,
        });
      });
    return Object.freeze({
      values: Object.freeze(i),
      count: i.length,
      minimum: a[0],
      maximum: a.at(-1),
      method: e,
      methodApplied: v,
      heightMode: t,
      binCount: s,
      rangeMinimum: m,
      rangeMaximum: b,
      binWidth: x,
      equalValues: a[0] === a.at(-1),
      bins: Object.freeze(F),
    });
  }
  var oe = Object.freeze({
    maxValues: 5e3,
    maxBins: 50,
    maxMagnitude: 1e9,
    methods: Object.freeze([...Q]),
    heightModes: Object.freeze([...Y]),
  });
  var f = document.querySelector('[data-tool="histogram-calculator"]');
  if (f) {
    let M = function () {
        let o = n.elements.namedItem('method').value === 'custom';
        ((i.hidden = !o), (a.disabled = !o));
      },
      F = function () {
        (H(f),
          s.replaceChildren(),
          (b = null),
          (x = ''),
          (q = ''),
          (v.disabled = !0),
          (m.disabled = !0),
          N(f, ''));
      },
      h = function (o) {
        let c = o
          .trim()
          .split(/[\s;|]+/u)
          .filter(Boolean);
        if (!c.length || c.length > 5e3) throw new RangeError('Invalid dataset size.');
        return c.map((l) => X(l, r()));
      },
      g = function (o) {
        let c = 'http://www.w3.org/2000/svg',
          d = Math.max(...o.bins.map((S) => S.height), 0) || 1,
          w = document.createElementNS(c, 'svg');
        (w.setAttribute('viewBox', '0 0 720 360'),
          w.setAttribute('role', 'img'),
          w.setAttribute('aria-labelledby', 'histogram-svg-title histogram-svg-description'),
          w.setAttribute('class', 'histogram-chart'));
        let E = (S, $, T) => {
          let C = document.createElementNS(c, S);
          for (let [z, j] of Object.entries($)) C.setAttribute(z, String(j));
          return (T !== void 0 && (C.textContent = T), w.append(C), C);
        };
        (E('title', { id: 'histogram-svg-title' }, e.fields.chartDescription),
          E(
            'desc',
            { id: 'histogram-svg-description' },
            `${e.fields.resultCount}: ${t(o.count)}; ${e.fields.resultBinCount}: ${t(o.binCount)}.`,
          ),
          E('line', { x1: 58, y1: 38, x2: 58, y2: 290, class: 'histogram-axis' }),
          E('line', { x1: 58, y1: 290, x2: 702, y2: 290, class: 'histogram-axis' }));
        let _ = Math.min(8, 644 / (o.binCount * 5)),
          y = (644 - (o.binCount - 1) * _) / o.binCount;
        return (
          o.bins.forEach((S, $) => {
            let T = Math.max(0, (S.height / d) * 252),
              C = 58 + $ * (y + _),
              z = 290 - T;
            E('rect', { x: C, y: z, width: y, height: T, rx: 2, class: 'histogram-bar' });
            let j = Math.max(1, Math.ceil(o.binCount / 10));
            ((o.binCount <= 12 || $ % j === 0 || $ === o.binCount - 1) &&
              E(
                'text',
                { x: C + y / 2, y: 312, 'text-anchor': 'middle', class: 'histogram-label' },
                `${t(S.lower, 3)}\u2013${t(S.upper, 3)}${$ === o.binCount - 1 ? ']' : ')'}`,
              ),
              y >= 24 &&
                E(
                  'text',
                  {
                    x: C + y / 2,
                    y: Math.max(52, z - 6),
                    'text-anchor': 'middle',
                    class: 'histogram-value',
                  },
                  t(S.height, 3),
                ));
          }),
          E(
            'text',
            { x: 58, y: 22, class: 'histogram-title' },
            e.fields[
              o.heightMode === 'count'
                ? 'counts'
                : o.heightMode === 'relative'
                  ? 'relative'
                  : 'density'
            ],
          ),
          new XMLSerializer().serializeToString(w)
        );
      },
      D = function (o) {
        let c = document.createElement('table');
        c.className = 'data-table histogram-table';
        let l = document.createElement('caption');
        ((l.textContent = e.fields.tableCaption), c.append(l));
        let u = [
            e.fields.bin,
            e.fields.lowerBound,
            e.fields.upperBound,
            e.fields.frequency,
            e.fields.percent,
            e.fields.densityValue,
            e.fields.cumulative,
          ],
          p = document.createElement('thead'),
          O = document.createElement('tr');
        for (let d of u) {
          let w = document.createElement('th');
          ((w.scope = 'col'), (w.textContent = d), O.append(w));
        }
        (p.append(O), c.append(p));
        let U = document.createElement('tbody');
        for (let d of o.bins) {
          let w = document.createElement('tr'),
            E = [
              t(d.index + 1),
              t(d.lower),
              t(d.upper),
              t(d.count),
              t(d.relativeFrequency * 100, 2),
              t(d.density, 6),
              t(d.cumulativeCount),
            ];
          for (let _ of E) {
            let y = document.createElement('td');
            ((y.textContent = _), w.append(y));
          }
          U.append(w);
        }
        (c.append(U), s.replaceChildren());
        let B = document.createElement('figure');
        B.className = 'histogram-figure';
        let k = new DOMParser().parseFromString(x, 'image/svg+xml').documentElement;
        B.append(document.importNode(k, !0));
        let R = document.createElement('div');
        ((R.className = 'histogram-table-scroll'),
          (R.tabIndex = 0),
          R.setAttribute('role', 'region'),
          R.setAttribute('aria-label', e.fields.tableCaption),
          R.append(c),
          s.append(B, R),
          (q = [
            u.join('	'),
            ...o.bins.map((d) =>
              [
                t(d.index + 1),
                t(d.lower),
                t(d.upper),
                t(d.count),
                t(d.relativeFrequency * 100, 2),
                t(d.density, 6),
                t(d.cumulativeCount),
              ].join('	'),
            ),
          ].join(`
`)));
      },
      L = function (o) {
        (o?.preventDefault(), F());
        try {
          let c = h(n.elements.namedItem('dataInput').value),
            l = n.elements.namedItem('method').value,
            u = Z(c, {
              method: l,
              customBins: a.value,
              heightMode: n.elements.namedItem('heightMode').value,
            });
          b = u;
          let p = [
            [e.fields.resultCount, t(u.count)],
            [e.fields.resultMinimum, t(u.minimum)],
            [e.fields.resultMaximum, t(u.maximum)],
            [e.fields.resultBinCount, t(u.binCount)],
            [e.fields.resultBinWidth, t(u.binWidth)],
          ];
          (u.equalValues && p.push([e.fields.equalValuesNote, '']),
            u.methodApplied === 'sturges-fallback' && p.push([e.fields.freedmanFallbackNote, '']),
            W(f, p),
            (x = g(u)),
            D(u),
            (v.disabled = !1),
            (m.disabled = !1),
            N(f, e.messages.calculated, 'success'));
        } catch {
          N(f, e.messages.checkInputs, 'error');
        }
      },
      I = function (o, c, l) {
        let u = URL.createObjectURL(new Blob([o], { type: c })),
          p = document.createElement('a');
        ((p.href = u),
          (p.download = l),
          (p.hidden = !0),
          document.body.append(p),
          p.click(),
          p.remove(),
          setTimeout(() => URL.revokeObjectURL(u), 1e3));
      },
      A = function (o) {
        return Number(Number(o).toPrecision(12)).toString();
      },
      n = f.querySelector('#tool-form'),
      e = V(f),
      r = () => document.documentElement.lang || 'en',
      t = (o, c = 4) => G(r(), o, c),
      i = n.querySelector('[data-histogram-custom]'),
      a = n.elements.namedItem('customBins'),
      s = n.querySelector('[data-histogram-output]'),
      v = f.querySelector('[data-action="download-csv"]'),
      m = f.querySelector('[data-action="download-svg"]'),
      b = null,
      x = '',
      q = '';
    (n.elements.namedItem('method').addEventListener('change', () => {
      (M(), F());
    }),
      n.addEventListener('input', F),
      n.addEventListener('submit', L),
      n.addEventListener('reset', () =>
        setTimeout(() => {
          (M(), F());
        }, 0),
      ),
      f.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((n.elements.namedItem('dataInput').value = '1; 2; 2; 3; 4'),
          (n.elements.namedItem('method').value = 'custom'),
          (a.value = '2'),
          (n.elements.namedItem('heightMode').value = 'count'),
          M(),
          L());
      }),
      f.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        b && K(f, q, e);
      }),
      v.addEventListener('click', () => {
        if (!b) return;
        let c = [
          [
            e.fields.bin,
            e.fields.lowerBound,
            e.fields.upperBound,
            e.fields.frequency,
            e.fields.percent,
            e.fields.densityValue,
            e.fields.cumulative,
          ],
          ...b.bins.map((l) => [
            l.index + 1,
            A(l.lower),
            A(l.upper),
            l.count,
            A(l.relativeFrequency * 100),
            A(l.density),
            l.cumulativeCount,
          ]),
        ].map((l) => l.map((u) => `"${String(u).replaceAll('"', '""')}"`).join(',')).join(`\r
`);
        (I(`\uFEFF${c}`, 'text/csv;charset=utf-8', 'histogram-frequency-table.csv'),
          N(f, e.messages.downloadedCsv, 'success'));
      }),
      m.addEventListener('click', () => {
        x &&
          (I(x, 'image/svg+xml;charset=utf-8', 'histogram.svg'),
          N(f, e.messages.downloadedSvg, 'success'));
      }),
      M());
  }
})();
