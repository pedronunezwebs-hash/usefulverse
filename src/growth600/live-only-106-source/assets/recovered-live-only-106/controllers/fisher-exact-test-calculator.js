(() => {
  function C(e, t) {
    let n = typeof e == 'string' && e.trim() === '' ? NaN : Number(e);
    if (!Number.isSafeInteger(n) || n < 0 || n > 1e4)
      throw Object.assign(new RangeError(`${t} must be a whole count from 0 to 10000.`), {
        code: 'cellRange',
      });
    return n;
  }
  function q(e) {
    let t = new Float64Array(e + 1);
    for (let n = 2; n <= e; n += 1) t[n] = t[n - 1] + Math.log(n);
    return t;
  }
  function R(e, t, n) {
    return n < 0 || n > t ? -1 / 0 : e[t] - e[n] - e[t - n];
  }
  function O({ a: e, b: t, c: n, d: f, alternative: E = 'two-sided' }) {
    if (!['two-sided', 'greater', 'less'].includes(E))
      throw Object.assign(new RangeError('Choose a supported alternative.'), {
        code: 'alternative',
      });
    let o = { a: C(e, 'a'), b: C(t, 'b'), c: C(n, 'c'), d: C(f, 'd') },
      d = o.a + o.b + o.c + o.d;
    if (!Number.isSafeInteger(d) || d < 1 || d > 2e4)
      throw Object.assign(new RangeError('The table total must be from 1 to 20000.'), {
        code: 'totalRange',
      });
    let y = o.a + o.b,
      s = o.c + o.d,
      p = o.a + o.c,
      h = Math.max(0, p - s),
      l = Math.min(y, p),
      r = q(d),
      u = R(r, d, p),
      w = [];
    for (let a = h; a <= l; a += 1) w.push({ x: a, logP: R(r, y, a) + R(r, s, p - a) - u });
    let I = w.reduce((a, { logP: i }) => Math.max(a, i), -1 / 0),
      x = w.map(({ x: a, logP: i }) => ({ x: a, weight: Math.exp(i - I) })),
      L = x.reduce((a, i) => a + i.weight, 0),
      T = x.map(({ x: a, weight: i }) => ({ x: a, probability: i / L })),
      g = T.find(({ x: a }) => a === o.a)?.probability,
      v = Math.max(1e-12, g * 1e-10),
      m;
    E === 'greater'
      ? (m = T.filter(({ x: a }) => a >= o.a).reduce((a, i) => a + i.probability, 0))
      : E === 'less'
        ? (m = T.filter(({ x: a }) => a <= o.a).reduce((a, i) => a + i.probability, 0))
        : (m = T.filter(({ probability: a }) => a <= g + v).reduce((a, i) => a + i.probability, 0));
    let _ = o.b * o.c === 0 ? (o.a * o.d === 0 ? null : 1 / 0) : (o.a * o.d) / (o.b * o.c);
    return Object.freeze({
      cells: Object.freeze(o),
      alternative: E,
      total: d,
      rowTotals: Object.freeze([y, s]),
      columnTotals: Object.freeze([p, d - p]),
      supportRange: Object.freeze([h, l]),
      observedProbability: g,
      pValue: m > 1 - 1e-14 ? 1 : Math.min(1, Math.max(0, m)),
      oddsRatio: _,
      method: 'Fisher exact conditional test with fixed margins',
    });
  }
  var N = Object.freeze({ maxCell: 1e4, maxTotal: 2e4 });
  function S(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function b(e, t, n = 'info') {
    let f = e.querySelector('[data-status]');
    f && ((f.textContent = t), (f.dataset.kind = n));
  }
  function A(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  function M(e, t, n = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
  }
  async function $(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), b(e, n.messages.copied, 'success'));
    } catch {
      b(e, n.messages.copyUnavailable, 'error');
    }
  }
  var c = document.querySelector('[data-tool="fisher-exact-test-calculator"]');
  if (c) {
    let y = function () {
        (A(c), (n.hidden = !0), f.replaceChildren(), (d = ''));
      },
      s = function (h, l, r) {
        let u = document.createElement(l);
        return ((u.textContent = r), h.append(u), u);
      },
      p = function (h) {
        (h?.preventDefault(), y(), b(c, ''));
        try {
          let l = new FormData(t),
            r = O({
              a: l.get('a'),
              b: l.get('b'),
              c: l.get('c'),
              d: l.get('d'),
              alternative: l.get('alternative'),
            }),
            u = document.createElement('table');
          ((u.className = 'data-table'), s(u.createCaption(), 'span', e.fields.tableCaption));
          let w = u.createTHead().insertRow();
          ((s(w, 'th', e.fields.rowLabel).scope = 'col'),
            (s(w, 'th', e.fields.outcomeOne).scope = 'col'),
            (s(w, 'th', e.fields.outcomeTwo).scope = 'col'),
            (s(w, 'th', e.fields.rowTotals).scope = 'col'));
          let I = u.createTBody();
          for (let [g, v] of [
            [0, [r.cells.a, r.cells.b]],
            [1, [r.cells.c, r.cells.d]],
          ]) {
            let m = I.insertRow();
            (m.append(document.createElement('th')),
              (m.cells[0].scope = 'row'),
              (m.cells[0].textContent = g === 0 ? e.fields.rowOne : e.fields.rowTwo),
              s(m, 'td', o(v[0], 0)),
              s(m, 'td', o(v[1], 0)),
              s(m, 'td', o(r.rowTotals[g], 0)));
          }
          let x = u.createTFoot().insertRow();
          (s(x, 'th', e.fields.columnTotals),
            s(x, 'td', `${o(r.columnTotals[0], 0)} \xB7 ${e.fields.total} ${o(r.total, 0)}`),
            s(x, 'td', o(r.columnTotals[1], 0)),
            s(x, 'td', o(r.total, 0)),
            f.append(u));
          let L = document.createElement('dl'),
            T =
              r.oddsRatio === null
                ? e.fields.notEstimable
                : r.oddsRatio === 1 / 0
                  ? '\u221E'
                  : o(r.oddsRatio, 6);
          for (let [g, v] of [
            [e.fields.pValue, o(r.pValue, 8)],
            [e.fields.oddsRatio, T],
            [e.fields.method, r.method],
          ])
            (s(L, 'dt', g), s(L, 'dd', v));
          (f.append(L),
            (n.hidden = !1),
            (d = `${e.fields.pValue}: ${o(r.pValue, 8)}
${e.fields.oddsRatio}: ${T}
${e.fields.method}: ${r.method}
${e.fields.rowTotals}: ${r.rowTotals.join(', ')}
${e.fields.columnTotals}: ${r.columnTotals.join(', ')}`),
            b(c, e.messages.calculated, 'success'));
        } catch (l) {
          b(c, e.messages[l?.code] ?? e.messages.checkInputs, 'error');
        }
      },
      e = S(c),
      t = c.querySelector('#tool-form'),
      n = c.querySelector('[data-fisher-results]'),
      f = c.querySelector('[data-fisher-output]'),
      E = e.copyLanguage === 'zh_tw' ? 'zh-TW' : e.copyLanguage,
      o = (h, l = 4) => M(E, h, l),
      d = '';
    (t.addEventListener('submit', p),
      t.addEventListener('input', () => {
        (y(), b(c, ''));
      }),
      c.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('a').value = '1'),
          (t.elements.namedItem('b').value = '9'),
          (t.elements.namedItem('c').value = '11'),
          (t.elements.namedItem('d').value = '3'),
          (t.elements.namedItem('alternative').value = 'two-sided'),
          p(),
          b(c, e.messages.exampleLoaded, 'success'));
      }),
      c.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        d && $(c, d, e);
      }),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          (y(), b(c, ''));
        }, 0),
      ));
  }
})();
