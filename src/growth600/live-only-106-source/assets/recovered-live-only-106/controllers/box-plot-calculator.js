(() => {
  var K = Object.freeze({
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
  function z(e, t = 'en') {
    let n = String(e)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (a) => String(a.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (a) => String(a.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (a) => String(a.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (a) => String(a.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!n) return Number.NaN;
    let l = new Intl.NumberFormat(t).formatToParts(12345.6),
      s = l.find((a) => a.type === 'decimal')?.value ?? '.',
      c = l.find((a) => a.type === 'group')?.value ?? ',';
    return (
      (n = n.replace(/[\s\u00a0\u202f]/gu, '')),
      s === ','
        ? n.includes(',')
          ? (n = n.replaceAll(c, '').replace(',', '.'))
          : c === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(n) && (n = n.replaceAll('.', ''))
        : s === '.'
          ? n.includes('.')
            ? ((c === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(n) ||
                (c !== ',' && n.includes(c))) &&
              (n = n.replaceAll(c, ''))
            : n.includes(c) &&
              (n =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(n) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(n)
                  ? n.replaceAll(c, '')
                  : n.replace(c, '.'))
          : n.includes(s) && (n = n.replaceAll(c, '').replace(s, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(n) ? Number(n) : Number.NaN
    );
  }
  var Q = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function D(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function y(e, t, n = 'info') {
    let l = e.querySelector('[data-status]');
    l && ((l.textContent = t), (l.dataset.kind = n));
  }
  function _(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  function O(e, t, n = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
  }
  async function j(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), y(e, n.messages.copied, 'success'));
    } catch {
      y(e, n.messages.copyUnavailable, 'error');
    }
  }
  var B = new Set(['exclusive', 'inclusive', 'linear']);
  function k(e) {
    let t = Math.floor(e.length / 2);
    return e.length % 2 ? e[t] : (e[t - 1] + e[t]) / 2;
  }
  function U(e, t) {
    let n = (e.length - 1) * t,
      l = Math.floor(n),
      s = n - l;
    return e[l] + (e[Math.min(l + 1, e.length - 1)] - e[l]) * s;
  }
  function H(e, t) {
    let n = Math.floor(e.length / 2);
    if (e.length === 1) return [e[0], e[0]];
    let l = e.slice(0, n + (t && e.length % 2 ? 1 : 0)),
      s = e.slice(n + (t && e.length % 2 ? 0 : e.length % 2), e.length);
    return [k(l), k(s)];
  }
  function X(e, { method: t = 'exclusive', label: n = 'Sample' } = {}) {
    if (!Array.isArray(e) || e.length < 1 || e.length > 2e3)
      throw new RangeError('Enter between 1 and 2000 values for each sample.');
    if (!B.has(t)) throw new RangeError('Choose a supported quartile method.');
    let l = e.map((u) => {
        let p = Number(u);
        if (!Number.isFinite(p) || Math.abs(p) > 1e9)
          throw new RangeError('Values must be finite and within \xB11000000000.');
        return p;
      }),
      s = [...l].sort((u, p) => u - p),
      c = k(s),
      [a, i] = t === 'linear' ? [U(s, 0.25), U(s, 0.75)] : H(s, t === 'inclusive'),
      C = i - a,
      F = a - 1.5 * C,
      v = i + 1.5 * C,
      w = s.filter((u) => u < F || u > v),
      f = s.filter((u) => u >= F && u <= v);
    return Object.freeze({
      label: String(n).trim().slice(0, 60) || 'Sample',
      method: t,
      count: l.length,
      minimum: s[0],
      q1: a,
      median: c,
      q3: i,
      maximum: s.at(-1),
      iqr: C,
      lowerFence: F,
      upperFence: v,
      lowerWhisker: f[0],
      upperWhisker: f.at(-1),
      outliers: Object.freeze(w),
      sorted: Object.freeze(s),
    });
  }
  var Y = Object.freeze({
    maxValuesPerSample: 2e3,
    maxMagnitude: 1e9,
    methods: Object.freeze([...B]),
  });
  var h = document.querySelector('[data-tool="box-plot-calculator"]');
  if (h) {
    let C = function (w) {
        if (w.length > 2e4) throw new RangeError('Sample input is too long.');
        let f = w
          .trim()
          .split(/[\s;|]+/u)
          .filter(Boolean);
        if (!f.length || f.length > 2e3) throw new RangeError('Invalid sample size.');
        return f.map((u) => z(u, s()));
      },
      F = function (w) {
        let f = 'http://www.w3.org/2000/svg',
          p = Math.max(200, 120 + w.length * 76),
          x = 150,
          q = 28,
          R = 30,
          M = 760 - x - q,
          $ = w.flatMap(({ sorted: o }) => o),
          b = Math.min(...$),
          A = Math.max(...$);
        if (b === A) {
          let o = Math.max(1, Math.abs(b) * 0.05);
          ((b -= o), (A += o));
        }
        let r = (o) => x + ((o - b) / (A - b)) * M,
          d = document.createElementNS(f, 'svg');
        (d.setAttribute('viewBox', `0 0 760 ${p}`),
          d.setAttribute('role', 'img'),
          d.setAttribute('aria-labelledby', 'box-plot-chart-title box-plot-chart-desc'),
          d.classList.add('box-plot-chart'));
        let m = (o, N, g) => {
          let S = document.createElementNS(f, o);
          for (let [L, T] of Object.entries(N)) S.setAttribute(L, String(T));
          return (g !== void 0 && (S.textContent = g), d.append(S), S);
        };
        (m('title', { id: 'box-plot-chart-title' }, t.fields.chartDescription),
          m(
            'desc',
            { id: 'box-plot-chart-desc' },
            w
              .map(
                (o) =>
                  `${o.label}: ${t.fields.resultMedian} ${i(o.median)}, ${t.fields.outliers} ${i(o.outliers.length)}.`,
              )
              .join(' '),
          ));
        let E = p - 34;
        (m('line', { x1: x, y1: R, x2: x, y2: E, class: 'box-plot-axis' }),
          m('line', { x1: x, y1: E, x2: 760 - q, y2: E, class: 'box-plot-axis' }));
        for (let o = 0; o <= 4; o++) {
          let N = b + ((A - b) * o) / 4,
            g = r(N);
          (m('line', { x1: g, y1: E, x2: g, y2: E + 5, class: 'box-plot-axis' }),
            m('text', { x: g, y: E + 22, 'text-anchor': 'middle', class: 'box-plot-tick' }, i(N)));
        }
        return (
          w.forEach((o, N) => {
            let g = R + 42 + N * 76,
              S = g - 13,
              L = 26,
              T = Array.from(o.label),
              V = T.length > 22 ? `${T.slice(0, 21).join('')}\u2026` : o.label;
            (m('text', { x: x - 12, y: g + 4, 'text-anchor': 'end', class: 'box-plot-label' }, V),
              m('line', {
                x1: r(o.lowerWhisker),
                y1: g,
                x2: r(o.upperWhisker),
                y2: g,
                class: 'box-plot-whisker',
              }));
            for (let I of [o.lowerWhisker, o.upperWhisker])
              m('line', {
                x1: r(I),
                y1: g - 9,
                x2: r(I),
                y2: g + 9,
                class: 'box-plot-whisker-cap',
              });
            (m('rect', {
              x: r(o.q1),
              y: S,
              width: Math.max(1, r(o.q3) - r(o.q1)),
              height: L,
              rx: 3,
              class: 'box-plot-box',
            }),
              m('line', {
                x1: r(o.median),
                y1: S,
                x2: r(o.median),
                y2: S + L,
                class: 'box-plot-median',
              }),
              o.outliers.forEach((I, W) =>
                m('circle', {
                  cx: r(I),
                  cy: g + ((W % 3) - 1) * 5,
                  r: 4,
                  class: 'box-plot-outlier',
                }),
              ));
          }),
          d
        );
      },
      v = function (w) {
        (w?.preventDefault(), a());
        try {
          let f = [];
          for (let r = 1; r <= 2; r++) {
            let d = e.elements.namedItem(`data${r}`).value;
            if (!d.trim()) continue;
            let m = e.elements.namedItem(`label${r}`).value.trim() || `${t.fields.sample} ${r}`;
            f.push(X(C(d), { method: e.elements.namedItem('method').value, label: m }));
          }
          if (!f.length) throw new RangeError('Enter at least one sample.');
          let u = document.createElement('figure');
          ((u.className = 'box-plot-figure'), u.append(F(f)));
          let p = document.createElement('div');
          ((p.className = 'box-plot-table-scroll'),
            (p.tabIndex = 0),
            p.setAttribute('role', 'region'),
            p.setAttribute('aria-label', t.fields.tableCaption));
          let x = document.createElement('table');
          x.className = 'box-plot-table';
          let q = document.createElement('caption');
          ((q.textContent = t.fields.tableCaption), x.append(q));
          let R = [
              t.fields.sample,
              t.fields.resultCount,
              t.fields.minimum,
              t.fields.q1,
              t.fields.resultMedian,
              t.fields.q3,
              t.fields.maximum,
              t.fields.iqr,
              t.fields.lowerFence,
              t.fields.upperFence,
              t.fields.lowerWhisker,
              t.fields.upperWhisker,
              t.fields.outliers,
            ],
            M = document.createElement('thead'),
            $ = document.createElement('tr');
          (R.forEach((r) => {
            let d = document.createElement('th');
            ((d.scope = 'col'), (d.textContent = r), $.append(d));
          }),
            M.append($),
            x.append(M));
          let b = document.createElement('tbody'),
            A = f.map((r) => [
              r.label,
              i(r.count),
              i(r.minimum),
              i(r.q1),
              i(r.median),
              i(r.q3),
              i(r.maximum),
              i(r.iqr),
              i(r.lowerFence),
              i(r.upperFence),
              i(r.lowerWhisker),
              i(r.upperWhisker),
              r.outliers.length ? r.outliers.map(i).join(', ') : t.fields.none,
            ]);
          (A.forEach((r) => {
            let d = document.createElement('tr');
            (r.forEach((m, E) => {
              let o = document.createElement(E ? 'td' : 'th');
              (E || (o.scope = 'row'), (o.textContent = m), d.append(o));
            }),
              b.append(d));
          }),
            x.append(b),
            p.append(x),
            l.append(u, p),
            (n.hidden = !1),
            (c = [R.join('	'), ...A.map((r) => r.join('	'))].join(`
`)),
            y(h, t.messages.calculated, 'success'));
        } catch {
          y(h, t.messages.checkInputs, 'error');
        }
      },
      e = h.querySelector('#tool-form'),
      t = D(h),
      n = h.querySelector('[data-result]'),
      l = h.querySelector('[data-result-content]'),
      s = () => document.documentElement.lang || 'en',
      c = '',
      a = () => {
        (_(h), l.replaceChildren(), (c = ''));
      },
      i = (w) => O(s(), w, 6);
    (e.addEventListener('input', () => {
      (a(), y(h, ''));
    }),
      e.addEventListener('change', () => {
        (a(), y(h, ''));
      }),
      e.addEventListener('submit', v),
      e.addEventListener('reset', () => {
        (a(), y(h, ''));
      }),
      h.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((e.elements.namedItem('label1').value = t.fields.groupA),
          (e.elements.namedItem('data1').value = '1; 2; 3; 4; 5; 6; 7; 8; 9; 10; 100'),
          (e.elements.namedItem('label2').value = t.fields.groupB),
          (e.elements.namedItem('data2').value = '1; 2; 2; 3; 4; 5; 6; 7; 8'),
          (e.elements.namedItem('method').value = 'exclusive'),
          v(),
          y(h, t.messages.exampleLoaded, 'success'));
      }),
      h.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        c && j(h, c, t);
      }));
  }
})();
