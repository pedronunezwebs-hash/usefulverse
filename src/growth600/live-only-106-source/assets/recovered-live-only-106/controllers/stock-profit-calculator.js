(() => {
  var T = Object.freeze({
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
  function R(t, r = 'en') {
    let e = String(t)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (n) => String(n.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (n) => String(n.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (n) => String(n.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (n) => String(n.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let i = new Intl.NumberFormat(r).formatToParts(12345.6),
      o = i.find((n) => n.type === 'decimal')?.value ?? '.',
      a = i.find((n) => n.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      o === ','
        ? e.includes(',')
          ? (e = e.replaceAll(a, '').replace(',', '.'))
          : a === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : o === '.'
          ? e.includes('.')
            ? ((a === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (a !== ',' && e.includes(a))) &&
              (e = e.replaceAll(a, ''))
            : e.includes(a) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(a, '')
                  : e.replace(a, '.'))
          : e.includes(o) && (e = e.replaceAll(a, '').replace(o, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var P = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function $(t = document) {
    let r = t.querySelector('[data-tool-copy]');
    if (!r) throw new Error('Localized tool copy is missing.');
    return JSON.parse(r.textContent);
  }
  function b(t, r, e = 'info') {
    let i = t.querySelector('[data-status]');
    i && ((i.textContent = r), (i.dataset.kind = e));
  }
  function q(t) {
    let r = t.querySelector('[data-result]'),
      e = t.querySelector('[data-result-content]');
    (r && (r.hidden = !0), e && e.replaceChildren());
  }
  function _(t, r) {
    let e = t.querySelector('[data-result]'),
      i = t.querySelector('[data-result-content]');
    if (!e || !i) return;
    let o = document.createElement('dl');
    for (let [a, n] of r) {
      let h = document.createElement('dt'),
        p = document.createElement('dd');
      ((h.textContent = a), (p.textContent = n), o.append(h, p));
    }
    (i.replaceChildren(o), (e.hidden = !1));
  }
  function L(t, r, e = 2) {
    return new Intl.NumberFormat(t, { maximumFractionDigits: e }).format(r);
  }
  async function I(t, r, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(r), b(t, e.messages.copied, 'success'));
    } catch {
      b(t, e.messages.copyUnavailable, 'error');
    }
  }
  function x(t, r, e = 0, i = 1e9) {
    let o = typeof t == 'string' && t.trim() === '' ? NaN : Number(t);
    if (!Number.isFinite(o) || o < e || o > i)
      throw new RangeError(`${r} is outside the supported range.`);
    return o;
  }
  function M(t) {
    let r = Array.isArray(t?.lots) ? t.lots : [];
    if (!r.length || r.length > 20) throw new RangeError('Enter between 1 and 20 purchase lots.');
    let e = String(t.currency ?? 'USD')
      .trim()
      .toUpperCase();
    if (!/^[A-Z]{3}$/u.test(e)) throw new RangeError('Enter a three-letter currency code.');
    let i = r.map((u, f) => {
        let F = x(u?.quantity, `Lot ${f + 1} shares`, 1e-8, 1e9),
          v = x(u?.price, `Lot ${f + 1} purchase price`),
          N = x(u?.fee ?? 0, `Lot ${f + 1} purchase fee`, 0, 1e9),
          A = F * v;
        if (!Number.isFinite(A) || A + N > 1e9)
          throw new RangeError(`Lot ${f + 1} cost exceeds the supported range.`);
        return { quantity: F, price: v, fee: N, grossCost: A, totalCost: A + N };
      }),
      o = i.reduce((u, f) => u + f.quantity, 0),
      a = i.reduce((u, f) => u + f.totalCost, 0);
    if (!Number.isFinite(o) || o > 1e9 || !Number.isFinite(a) || a > 1e9)
      throw new RangeError('Combined purchases exceed the supported range.');
    let n = x(t.sharesSold, 'Shares to sell', 1e-8, o),
      h = x(t.salePrice, 'Sale price'),
      p = x(t.saleFee ?? 0, 'Sale fee', 0, 1e9),
      E = t.method ?? 'average';
    if (!['average', 'fifo'].includes(E)) throw new RangeError('Choose average cost or FIFO.');
    let g;
    if (E === 'fifo') {
      let u = n;
      g = 0;
      for (let f of i) {
        let F = Math.min(u, f.quantity);
        if (((g += F * (f.totalCost / f.quantity)), (u -= F), u <= Math.max(1, n) * 1e-12)) break;
      }
    } else g = a * (n / o);
    let S = n * h,
      m = S - p,
      y = m - g,
      d = Math.max(0, o - n),
      s = Math.max(0, a - g),
      l = a / o,
      w = (g + p) / n,
      C = g <= 1e-12 ? null : (y / g) * 100;
    for (let u of [S, m, y, s, l, w, ...(C === null ? [] : [C])])
      if (!Number.isFinite(u) || Math.abs(u) > 1e9)
        throw new RangeError('The result exceeds the supported range.');
    return Object.freeze({
      currency: e,
      method: E,
      sharesOwned: o,
      sharesSold: n,
      remainingShares: d,
      totalCost: a,
      costBasis: g,
      grossProceeds: S,
      saleFee: p,
      netProceeds: m,
      profit: y,
      returnPercent: C,
      averageCostPerShare: l,
      remainingCostBasis: s,
      breakevenSalePrice: w,
    });
  }
  var z = Object.freeze({ maxLots: 20, maxShares: 1e9, maxPrice: 1e9, maxFee: 1e9 });
  var c = document.querySelector('[data-tool="stock-profit-calculator"]');
  if (c) {
    let p = function () {
        (q(c), i.replaceChildren(), (a = ''));
      },
      E = function () {
        let d = Number(o.value);
        for (let s of c.querySelectorAll('[data-stock-lot]')) {
          let l = Number(s.dataset.index) > d;
          s.hidden = l;
          for (let w of s.querySelectorAll('input')) w.disabled = l;
        }
      },
      g = function () {
        return {
          lots: Array.from({ length: Number(o.value) }, (s, l) => {
            let w = l + 1;
            return {
              quantity: h(`quantity${w}`),
              price: h(`purchasePrice${w}`),
              fee: h(`purchaseFee${w}`),
            };
          }),
          sharesSold: h('sharesSold'),
          salePrice: h('salePrice'),
          saleFee: h('saleFee'),
          method: t.elements.namedItem('method').value,
          currency: t.elements.namedItem('currencyCode').value,
        };
      },
      m = function (d, s) {
        try {
          return new Intl.NumberFormat(n(), {
            style: 'currency',
            currency: s,
            currencyDisplay: 'code',
            maximumFractionDigits: 2,
          }).format(d);
        } catch {
          return `${S(d)} ${s}`;
        }
      },
      y = function (d) {
        (d?.preventDefault(), p());
        try {
          let s = M(g()),
            l = s.currency,
            w = [
              [r.fields.sharesOwned, S(s.sharesOwned)],
              [r.fields.sharesRemaining, S(s.remainingShares)],
              [r.fields.purchaseCost, m(s.totalCost, l)],
              [r.fields.costBasis, m(s.costBasis, l)],
              [r.fields.grossProceeds, m(s.grossProceeds, l)],
              [r.fields.netProceeds, m(s.netProceeds, l)],
              [r.fields.realizedProfit, m(s.profit, l)],
              ...(s.returnPercent === null
                ? []
                : [[r.fields.returnPercent, `${S(s.returnPercent)}%`]]),
              [r.fields.averageCostPerShare, m(s.averageCostPerShare, l)],
              [r.fields.remainingBasis, m(s.remainingCostBasis, l)],
              [r.fields.breakevenSalePrice, m(s.breakevenSalePrice, l)],
            ];
          (_(c, w),
            (a = w.map(([C, u]) => `${C}: ${u}`).join(`
`)),
            (e.hidden = !1),
            b(c, r.messages.calculated, 'success'));
        } catch {
          b(c, r.messages.checkInputs, 'error');
        }
      },
      t = c.querySelector('#tool-form'),
      r = $(c),
      e = c.querySelector('[data-result]'),
      i = c.querySelector('[data-result-content]'),
      o = t.elements.namedItem('lotCount'),
      a = '',
      n = () => document.documentElement.lang || 'en',
      h = (d) => R(t.elements.namedItem(d).value, n()),
      S = (d) => L(n(), d, 2);
    (o.addEventListener('change', () => {
      (E(), p(), b(c, ''));
    }),
      t.addEventListener('input', () => {
        (p(), b(c, ''));
      }),
      t.addEventListener('submit', y),
      t.addEventListener('reset', () =>
        queueMicrotask(() => {
          (E(), p(), b(c, ''));
        }),
      ),
      c.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((o.value = '1'),
          (t.elements.namedItem('currencyCode').value = 'USD'),
          (t.elements.namedItem('method').value = 'average'),
          (t.elements.namedItem('sharesSold').value = '10'),
          (t.elements.namedItem('salePrice').value = '30'),
          (t.elements.namedItem('saleFee').value = '0'),
          (t.elements.namedItem('quantity1').value = '10'),
          (t.elements.namedItem('purchasePrice1').value = '20'),
          (t.elements.namedItem('purchaseFee1').value = '0'),
          E(),
          y(),
          b(c, r.messages.exampleLoaded, 'success'));
      }),
      c.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        a && I(c, a, r);
      }),
      E());
  }
})();
