(() => {
  function C(t = document) {
    let e = t.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function w(t, e, n = 'info') {
    let r = t.querySelector('[data-status]');
    r && ((r.textContent = e), (r.dataset.kind = n));
  }
  function k(t) {
    let e = t.querySelector('[data-result]'),
      n = t.querySelector('[data-result-content]');
    (e && (e.hidden = !0), n && n.replaceChildren());
  }
  async function A(t, e, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(e), w(t, n.messages.copied, 'success'));
    } catch {
      w(t, n.messages.copyUnavailable, 'error');
    }
  }
  var T = 1000000000n;
  var _ = new Set([1, 2, 5]),
    M = new Set([0, 1, 2, 3]);
  function R(t, e) {
    let n = t.trim();
    if (n.length > 16 || !/^[+-]?\d+(?:\.\d+)?$/u.test(n))
      throw new RangeError('Enter valid decimal numbers using a period as the decimal mark.');
    let r = n.startsWith('-'),
      i = /^[+-]/u.test(n) ? n.slice(1) : n,
      [m, d = ''] = i.split('.');
    if (d.length > e) throw new RangeError(`Values may have at most ${e} decimal places.`);
    let f = 10n ** BigInt(e),
      p = BigInt((d + '0'.repeat(e)).slice(0, e) || '0'),
      g = BigInt(m) * f + p;
    if (BigInt(m) > T) throw new RangeError('Values must be within \xB11,000,000,000.');
    return r ? -g : g;
  }
  function q(t, e) {
    let n = t / e;
    return (t < 0n && t % e !== 0n && (n -= 1n), n);
  }
  function L(t, e) {
    let n = t < 0n,
      r = n ? -t : t,
      i = 10n ** BigInt(e),
      m = r / i;
    if (!e) return `${n ? '\u2212' : ''}${m}`;
    let d = String(r % i)
      .padStart(e, '0')
      .replace(/0+$/u, '');
    return `${n ? '\u2212' : ''}${m}${d ? `.${d}` : ''}`;
  }
  function N(t, { decimalPlaces: e = 0, split: n = 1 } = {}) {
    if (typeof t != 'string' || t.length > 8e3)
      throw new RangeError('Enter a data list within the text limit.');
    if (!M.has(Number(e))) throw new RangeError('Choose 0\u20133 decimal places.');
    if (!_.has(Number(n))) throw new RangeError('Choose one, two or five rows per stem.');
    let r = Number(e),
      i = Number(n),
      m = t
        .trim()
        .split(/[\s,;|]+/u)
        .filter(Boolean);
    if (m.length < 1 || m.length > 250) throw new RangeError('Enter between 1 and 250 values.');
    let d = 10n ** BigInt(r),
      f = m.map((a) => R(a, r)),
      p = new Map();
    for (let a of f) {
      let l = q(a, 10n),
        E = Number(a - l * 10n),
        S = Math.floor(E / (10 / i)),
        h = l.toString();
      (p.has(h) ||
        p.set(
          h,
          Array.from({ length: i }, () => []),
        ),
        p.get(h)[S].push(E));
    }
    let g = [...p.keys()].map(BigInt).sort((a, l) => (a < l ? -1 : a > l ? 1 : 0)),
      o = [];
    for (let a of g)
      p.get(a.toString()).forEach((E, S) => {
        E.sort((u, x) => u - x);
        let h = S * (10 / i),
          c = h + 10 / i - 1;
        o.push(
          Object.freeze({
            stem: a.toString(),
            group: S,
            minimumLeaf: h,
            maximumLeaf: c,
            leaves: Object.freeze(E),
            leafText: E.join(' '),
          }),
        );
      });
    let y = [...f].sort((a, l) => (a < l ? -1 : a > l ? 1 : 0)),
      v = o.find(({ stem: a, leaves: l }) => a === g[0].toString() && l.length)?.leaves[0] ?? 0,
      b = L(g[0] * 10n + BigInt(v), r);
    return Object.freeze({
      count: f.length,
      minimum: L(y[0], r),
      maximum: L(y.at(-1), r),
      decimalPlaces: r,
      split: i,
      keyStem: g[0].toString(),
      keyLeaf: v,
      keyValue: b,
      rows: Object.freeze(o),
      stems: Object.freeze(g.map(String)),
    });
  }
  var j = Object.freeze({
    maxValues: 250,
    maxText: 8e3,
    maxAbsInteger: '1000000000',
    decimalPlaces: Object.freeze([0, 1, 2, 3]),
    splits: Object.freeze([1, 2, 5]),
  });
  var s = document.querySelector('[data-tool="stem-and-leaf-plot-generator"]');
  if (s) {
    let f = function () {
        (k(s), m.replaceChildren(), (d = ''));
      },
      p = function (g) {
        (g?.preventDefault(), f());
        try {
          let o = N(t.elements.namedItem('dataInput').value, {
              decimalPlaces: Number(t.elements.namedItem('decimalPlaces').value),
              split: Number(t.elements.namedItem('split').value),
            }),
            y = (c) =>
              new Intl.NumberFormat(n(), { maximumFractionDigits: 0, useGrouping: !1 }).format(
                BigInt(c),
              ),
            v = document.createElement('dl');
          v.className = 'stem-leaf-summary';
          for (let [c, u] of [
            [e.fields.resultCount, y(o.count)],
            [e.fields.resultMinimum, o.minimum],
            [e.fields.resultMaximum, o.maximum],
          ]) {
            let x = document.createElement('dt');
            x.textContent = c;
            let I = document.createElement('dd');
            ((I.textContent = u), v.append(x, I));
          }
          let b = document.createElement('table');
          b.className = 'stem-leaf-table';
          let a = document.createElement('caption');
          ((a.textContent = e.fields.tableCaption), b.append(a));
          let l = document.createElement('thead'),
            E = document.createElement('tr');
          for (let c of [e.fields.stem, e.fields.leafRange, e.fields.leaves]) {
            let u = document.createElement('th');
            ((u.scope = 'col'), (u.textContent = c), E.append(u));
          }
          (l.append(E), b.append(l));
          let S = document.createElement('tbody');
          for (let c of o.rows) {
            let u = document.createElement('tr'),
              x = document.createElement('th');
            ((x.scope = 'row'), (x.textContent = y(c.stem)));
            let I = document.createElement('td');
            I.textContent = `${y(c.minimumLeaf)}\u2013${y(c.maximumLeaf)}`;
            let $ = document.createElement('td');
            (($.className = 'stem-leaf-digits'),
              ($.textContent = c.leaves.length ? c.leaves.map(y).join(' ') : e.fields.emptyLeaves),
              u.append(x, I, $),
              S.append(u));
          }
          b.append(S);
          let h = document.createElement('p');
          ((h.className = 'stem-leaf-key'),
            (h.textContent = `${e.fields.key}: ${y(o.keyStem)} | ${y(o.keyLeaf)} = ${o.keyValue}`),
            m.append(v, h, b),
            (i.hidden = !1),
            (d = [
              e.fields.tableCaption,
              `${e.fields.resultCount}: ${o.count}`,
              `${e.fields.resultMinimum}: ${o.minimum}`,
              `${e.fields.resultMaximum}: ${o.maximum}`,
              `${e.fields.key}: ${o.keyStem} | ${o.keyLeaf} = ${o.keyValue}`,
              `${e.fields.stem}	${e.fields.leaves}`,
              ...o.rows.map(({ stem: c, leafText: u }) => `${c}	${u || e.fields.emptyLeaves}`),
            ].join(`
`)),
            w(s, e.messages.calculated, 'success'));
        } catch {
          w(s, e.messages.checkInputs, 'error');
        }
      },
      t = s.querySelector('#tool-form'),
      e = C(s),
      n = () => document.documentElement.lang || 'en',
      r = s.querySelector('[data-status]'),
      i = s.querySelector('[data-result]'),
      m = s.querySelector('[data-result-content]'),
      d = '';
    (t.addEventListener('input', () => {
      (f(), w(s, ''));
    }),
      t.addEventListener('change', () => {
        (f(), w(s, ''));
      }),
      t.addEventListener('submit', p),
      t.addEventListener('reset', () => {
        (f(), w(s, ''));
      }),
      s.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('dataInput').value = '12, 13, 21, 12, 15, 18, 24, 27, 31'),
          (t.elements.namedItem('decimalPlaces').value = '0'),
          (t.elements.namedItem('split').value = '2'),
          p(),
          w(s, e.messages.exampleLoaded, 'success'));
      }),
      s.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        d && A(s, d, e);
      }));
  }
})();
