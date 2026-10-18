(() => {
  var ne = Object.freeze({
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
  function I(o, t = 'en') {
    let e = String(o)
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
      p = n.find((i) => i.type === 'decimal')?.value ?? '.',
      s = n.find((i) => i.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      p === ','
        ? e.includes(',')
          ? (e = e.replaceAll(s, '').replace(',', '.'))
          : s === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : p === '.'
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
          : e.includes(p) && (e = e.replaceAll(s, '').replace(p, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var re = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function U(o = document) {
    let t = o.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function _(o, t, e = 'info') {
    let n = o.querySelector('[data-status]');
    n && ((n.textContent = t), (n.dataset.kind = e));
  }
  function V(o) {
    let t = o.querySelector('[data-result]'),
      e = o.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  function H(o, t) {
    let e = o.querySelector('[data-result]'),
      n = o.querySelector('[data-result-content]');
    if (!e || !n) return;
    let p = document.createElement('dl');
    for (let [s, i] of t) {
      let m = document.createElement('dt'),
        u = document.createElement('dd');
      ((m.textContent = s), (u.textContent = i), p.append(m, u));
    }
    (n.replaceChildren(p), (e.hidden = !1));
  }
  function Y(o, t, e = 2) {
    return new Intl.NumberFormat(o, { maximumFractionDigits: e }).format(t);
  }
  async function P(o, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), _(o, e.messages.copied, 'success'));
    } catch {
      _(o, e.messages.copyUnavailable, 'error');
    }
  }
  var K = Object.freeze({
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    exp: Math.exp,
    ln: Math.log,
    log: Math.log10,
    sqrt: Math.sqrt,
    abs: Math.abs,
  });
  function Z(o) {
    let t = String(o ?? '').trim();
    if (!t || t.length > 180)
      throw new RangeError('Enter a derivative expression up to 180 characters.');
    let e = [],
      n = 0;
    for (; n < t.length;) {
      if (/\s/u.test(t[n])) {
        n += 1;
        continue;
      }
      let p = t.slice(n),
        s = p.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/iu),
        i = p.match(/^[a-z]+/iu);
      if (s) (e.push({ type: 'number', value: Number(s[0]) }), (n += s[0].length));
      else if (i) (e.push({ type: 'identifier', value: i[0].toLowerCase() }), (n += i[0].length));
      else if ('+-*/^()'.includes(t[n])) (e.push({ type: t[n], value: t[n] }), (n += 1));
      else throw new SyntaxError(`Unsupported character at position ${n + 1}.`);
      if (e.length > 128) throw new RangeError('Use at most 128 expression tokens.');
    }
    return e;
  }
  function ee(o) {
    let t = Z(o),
      e = 0,
      n = () => t[e],
      p = (a) => {
        if (n()?.type !== a) throw new SyntaxError(`Expected ${a}.`);
        return t[e++];
      };
    function s() {
      let a = n();
      if (!a) throw new SyntaxError('Expression ended unexpectedly.');
      if (a.type === 'number') return ((e += 1), () => a.value);
      if (a.type === '+' || a.type === '-') {
        e += 1;
        let l = m();
        return a.type === '-' ? (c, r) => -l(c, r) : l;
      }
      if (a.type === '(') {
        e += 1;
        let l = y();
        return (p(')'), l);
      }
      if (a.type !== 'identifier')
        throw new SyntaxError('Expected a number, variable, function or parenthesis.');
      if (((e += 1), a.value === 'x')) return (l) => l;
      if (a.value === 'y') return (l, c) => c;
      if (a.value === 'pi') return () => Math.PI;
      if (a.value === 'e') return () => Math.E;
      let g = K[a.value];
      if (!g) throw new SyntaxError(`Unsupported variable or function: ${a.value}.`);
      p('(');
      let d = y();
      return (p(')'), (l, c) => g(d(l, c)));
    }
    function i() {
      let a = s();
      if (n()?.type !== '^') return a;
      e += 1;
      let g = m();
      return (d, l) => a(d, l) ** g(d, l);
    }
    function m() {
      return i();
    }
    function u() {
      let a = m();
      for (; n()?.type === '*' || n()?.type === '/';) {
        let g = t[e++].type,
          d = m(),
          l = a;
        a = g === '*' ? (c, r) => l(c, r) * d(c, r) : (c, r) => l(c, r) / d(c, r);
      }
      return a;
    }
    function y() {
      let a = u();
      for (; n()?.type === '+' || n()?.type === '-';) {
        let g = t[e++].type,
          d = u(),
          l = a;
        a = g === '+' ? (c, r) => l(c, r) + d(c, r) : (c, r) => l(c, r) - d(c, r);
      }
      return a;
    }
    let h = y();
    if (e !== t.length) throw new SyntaxError('Unexpected text after the expression.');
    return (a, g) => {
      let d = h(a, g);
      if (!Number.isFinite(d))
        throw new RangeError('The derivative is undefined or non-finite for these values.');
      return d;
    };
  }
  function te(o, t) {
    if (!Number.isFinite(o) || Math.abs(o) > 1e6)
      throw new RangeError('x must stay within \xB11000000.');
    if (!Number.isFinite(t) || Math.abs(t) > 1e12)
      throw new RangeError(`The solution exceeded the supported y range of \xB1${1e12}.`);
  }
  function Q({ expression: o, x0: t, y0: e, xEnd: n, steps: p = 100 }) {
    let s = Number(t),
      i = Number(e),
      m = Number(n),
      u = Number(p);
    if (![s, i, m].every(Number.isFinite))
      throw new RangeError('Initial values and endpoint must be finite numbers.');
    if (Math.abs(s) > 1e6 || Math.abs(m) > 1e6)
      throw new RangeError('x values must stay within \xB11000000.');
    if (Math.abs(i) > 1e12) throw new RangeError(`y\u2080 must stay within \xB1${1e12}.`);
    if (!Number.isInteger(u) || u < 1 || u > 1e4)
      throw new RangeError('Choose between 1 and 10000 steps.');
    let y = ee(o);
    if (s === m) {
      let c = Object.freeze({ x: s, y: i });
      return Object.freeze({
        expression: String(o).trim(),
        x0: s,
        y0: i,
        xEnd: m,
        steps: u,
        stepSize: 0,
        sampleStride: u,
        points: Object.freeze([c]),
        finalValue: i,
      });
    }
    let h = (m - s) / u,
      a = Math.max(1, Math.ceil(u / 100)),
      g = [{ x: s, y: i }],
      d = s,
      l = i;
    for (let c = 0; c < u; c += 1) {
      let r = y(d, l),
        f = y(d + h / 2, l + (h * r) / 2),
        b = y(d + h / 2, l + (h * f) / 2),
        S = y(d + h, l + h * b),
        E = l + (h * (r + 2 * f + 2 * b + S)) / 6,
        $ = c === u - 1 ? m : s + (c + 1) * h;
      (te($, E), (d = $), (l = E), ((c + 1) % a === 0 || c === u - 1) && g.push({ x: d, y: l }));
    }
    return Object.freeze({
      expression: String(o).trim(),
      x0: s,
      y0: i,
      xEnd: m,
      steps: u,
      stepSize: h,
      sampleStride: a,
      points: Object.freeze(g.map((c) => Object.freeze(c))),
      finalValue: l,
    });
  }
  var se = Object.freeze({
    maxExpressionLength: 180,
    maxTokens: 128,
    maxSteps: 1e4,
    maxAbsX: 1e6,
    maxAbsY: 1e12,
    functions: Object.freeze(Object.keys(K)),
  });
  var x = document.querySelector('[data-tool="differential-equation-solver"]');
  if (x) {
    let h = function () {
        (V(x),
          p.replaceChildren(),
          (m = null),
          (u = ''),
          (y = ''),
          (s.disabled = !0),
          (i.disabled = !0),
          _(x, ''));
      },
      a = function (r) {
        let f = 'http://www.w3.org/2000/svg',
          A = r.points.map((w) => w.x),
          N = r.points.map((w) => w.y),
          R = Math.min(...A),
          X = Math.max(...A),
          M = Math.min(...N),
          T = Math.max(...N);
        if ((R === X && ((R -= 1), (X += 1)), M === T)) {
          let w = Math.max(1, Math.abs(M) * 0.05);
          ((M -= w), (T += w));
        }
        let k = (w) => 68 + ((w - R) / (X - R)) * 628,
          B = (w) => 312 - ((w - M) / (T - M)) * 280,
          F = document.createElementNS(f, 'svg');
        (F.setAttribute('viewBox', '0 0 720 360'),
          F.setAttribute('role', 'img'),
          F.setAttribute('aria-labelledby', 'ode-chart-title ode-chart-description'),
          F.setAttribute('class', 'ode-chart'));
        let v = (w, j, D) => {
          let L = document.createElementNS(f, w);
          for (let [J, G] of Object.entries(j)) L.setAttribute(J, String(G));
          return (D !== void 0 && (L.textContent = D), F.append(L), L);
        };
        (v('title', { id: 'ode-chart-title' }, t.fields.chartDescription),
          v(
            'desc',
            { id: 'ode-chart-description' },
            `y\u2032=${r.expression}; ${t.fields.initialX}: ${n(r.x0)}; ${t.fields.initialY}: ${n(r.y0)}; ${t.fields.endX}: ${n(r.xEnd)}.`,
          ),
          v('line', { x1: 68, y1: 312, x2: 696, y2: 312, class: 'ode-axis' }),
          v('line', { x1: 68, y1: 32, x2: 68, y2: 312, class: 'ode-axis' }));
        let W = r.points
          .map((w, j) => `${j ? 'L' : 'M'}${k(w.x).toFixed(2)},${B(w.y).toFixed(2)}`)
          .join(' ');
        return (
          v('path', { d: W, class: 'ode-line' }),
          v('circle', { cx: k(r.x0), cy: B(r.y0), r: 5, class: 'ode-start' }),
          v('circle', { cx: k(r.xEnd), cy: B(r.finalValue), r: 5, class: 'ode-end' }),
          v('text', { x: 68 + 628 / 2, y: 350, 'text-anchor': 'middle', class: 'ode-label' }, 'x'),
          v(
            'text',
            {
              x: 18,
              y: 32 + 280 / 2,
              'text-anchor': 'middle',
              class: 'ode-label',
              transform: `rotate(-90 18 ${32 + 280 / 2})`,
            },
            'y',
          ),
          v('text', { x: 68, y: 46, class: 'ode-label' }, n(T, 4)),
          v('text', { x: 68, y: 307, class: 'ode-label' }, n(M, 4)),
          new XMLSerializer().serializeToString(F)
        );
      },
      g = function (r) {
        let f = [
          [t.fields.resultFinalX, n(r.xEnd)],
          [t.fields.resultFinalY, n(r.finalValue)],
          [t.fields.resultStepSize, n(r.stepSize, 10)],
          [t.fields.resultSamples, n(r.points.length)],
        ];
        (H(x, f), (u = a(r)));
        let b = document.createElement('figure');
        ((b.className = 'ode-figure'),
          b.append(
            document.importNode(
              new DOMParser().parseFromString(u, 'image/svg+xml').documentElement,
              !0,
            ),
          ));
        let S = document.createElement('table');
        S.className = 'data-table ode-table';
        let E = document.createElement('caption');
        ((E.textContent = t.fields.tableCaption), S.append(E));
        let $ = [t.fields.sample, t.fields.xValue, t.fields.yValue],
          q = document.createElement('thead'),
          z = document.createElement('tr');
        for (let A of $) {
          let N = document.createElement('th');
          ((N.scope = 'col'), (N.textContent = A), z.append(N));
        }
        (q.append(z), S.append(q));
        let O = document.createElement('tbody');
        (r.points.forEach((A, N) => {
          let R = document.createElement('tr');
          for (let X of [n(N), n(A.x), n(A.y)]) {
            let M = document.createElement('td');
            ((M.textContent = X), R.append(M));
          }
          O.append(R);
        }),
          S.append(O));
        let C = document.createElement('div');
        ((C.className = 'ode-table-scroll'),
          (C.tabIndex = 0),
          C.setAttribute('role', 'region'),
          C.setAttribute('aria-label', t.fields.tableCaption),
          C.append(S),
          p.replaceChildren(b, C),
          (y = [$.join('	'), ...r.points.map((A, N) => [n(N), n(A.x), n(A.y)].join('	'))].join(`
`)),
          (s.disabled = !1),
          (i.disabled = !1));
      },
      d = function (r) {
        (r?.preventDefault(), h());
        try {
          let f = Q({
            expression: o.elements.namedItem('derivative').value,
            x0: I(o.elements.namedItem('initialX').value, e()),
            y0: I(o.elements.namedItem('initialY').value, e()),
            xEnd: I(o.elements.namedItem('endX').value, e()),
            steps: o.elements.namedItem('steps').value,
          });
          ((m = f), g(f), _(x, t.messages.calculated, 'success'));
        } catch {
          _(x, t.messages.checkInputs, 'error');
        }
      },
      l = function (r, f, b) {
        let S = URL.createObjectURL(new Blob([r], { type: f })),
          E = document.createElement('a');
        ((E.href = S),
          (E.download = b),
          (E.hidden = !0),
          document.body.append(E),
          E.click(),
          E.remove(),
          setTimeout(() => URL.revokeObjectURL(S), 1e3));
      },
      c = function (r) {
        return Number(Number(r).toPrecision(14)).toString();
      },
      o = x.querySelector('#tool-form'),
      t = U(x),
      e = () => document.documentElement.lang || 'en',
      n = (r, f = 8) => Y(e(), r, f),
      p = o.querySelector('[data-ode-output]'),
      s = x.querySelector('[data-action="download-csv"]'),
      i = x.querySelector('[data-action="download-svg"]'),
      m = null,
      u = '',
      y = '';
    (o.addEventListener('input', h),
      o.addEventListener('submit', d),
      o.addEventListener('reset', () => setTimeout(h, 0)),
      x.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((o.elements.namedItem('derivative').value = 'y'),
          (o.elements.namedItem('initialX').value = '0'),
          (o.elements.namedItem('initialY').value = '1'),
          (o.elements.namedItem('endX').value = '1'),
          (o.elements.namedItem('steps').value = '100'),
          d());
      }),
      x.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        m && P(x, y, t);
      }),
      s.addEventListener('click', () => {
        if (!m) return;
        let r = [
          [t.fields.sample, t.fields.xValue, t.fields.yValue],
          ...m.points.map((f, b) => [b, c(f.x), c(f.y)]),
        ];
        (l(
          `\uFEFF${r.map((f) => f.map((b) => `"${String(b).replaceAll('"', '""')}"`).join(','))
            .join(`\r
`)}`,
          'text/csv;charset=utf-8',
          'differential-equation-samples.csv',
        ),
          _(x, t.messages.downloadedCsv, 'success'));
      }),
      i.addEventListener('click', () => {
        u &&
          (l(u, 'image/svg+xml;charset=utf-8', 'differential-equation-solution.svg'),
          _(x, t.messages.downloadedSvg, 'success'));
      }));
  }
})();
