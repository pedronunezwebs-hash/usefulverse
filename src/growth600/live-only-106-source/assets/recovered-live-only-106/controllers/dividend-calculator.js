(() => {
  var k = Object.freeze({
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
  function D(r, t = 'en') {
    let e = String(r)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (o) => String(o.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (o) => String(o.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (o) => String(o.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (o) => String(o.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let a = new Intl.NumberFormat(t).formatToParts(12345.6),
      s = a.find((o) => o.type === 'decimal')?.value ?? '.',
      n = a.find((o) => o.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      s === ','
        ? e.includes(',')
          ? (e = e.replaceAll(n, '').replace(',', '.'))
          : n === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : s === '.'
          ? e.includes('.')
            ? ((n === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (n !== ',' && e.includes(n))) &&
              (e = e.replaceAll(n, ''))
            : e.includes(n) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(n, '')
                  : e.replace(n, '.'))
          : e.includes(s) && (e = e.replaceAll(n, '').replace(s, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var U = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function _(r = document) {
    let t = r.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function p(r, t, e = 'info') {
    let a = r.querySelector('[data-status]');
    a && ((a.textContent = t), (a.dataset.kind = e));
  }
  function j(r) {
    let t = r.querySelector('[data-result]'),
      e = r.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  function q(r, t) {
    let e = r.querySelector('[data-result]'),
      a = r.querySelector('[data-result-content]');
    if (!e || !a) return;
    let s = document.createElement('dl');
    for (let [n, o] of t) {
      let m = document.createElement('dt'),
        l = document.createElement('dd');
      ((m.textContent = n), (l.textContent = o), s.append(m, l));
    }
    (a.replaceChildren(s), (e.hidden = !1));
  }
  function b(r, t, e = 2) {
    return new Intl.NumberFormat(r, { maximumFractionDigits: e }).format(t);
  }
  async function M(r, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), p(r, e.messages.copied, 'success'));
    } catch {
      p(r, e.messages.copyUnavailable, 'error');
    }
  }
  function A(r, t, e, a, { exclusiveMin: s = !1 } = {}) {
    let n = Number(r);
    if (!Number.isFinite(n) || (s ? n <= e : n < e) || n > a)
      throw new RangeError(`${t} must be between ${e} and ${a}.`);
    return n;
  }
  function L(r, t, e = -99) {
    let a = Number(r);
    if (!Number.isFinite(a) || a <= e || a > 1e3)
      throw new RangeError(`${t} must be greater than ${e}% and no more than 1000%.`);
    return a / 100;
  }
  function z({
    shares: r,
    sharePrice: t,
    annualDividendPerShare: e,
    paymentsPerYear: a = 4,
    dividendGrowthPercent: s = 0,
    priceGrowthPercent: n = 0,
    years: o = 10,
    reinvestDividends: m = !1,
  } = {}) {
    let l = A(r, 'Shares', 0, 1e9, { exclusiveMin: !0 }),
      w = A(t, 'Share price', 0, 1e9, { exclusiveMin: !0 }),
      d = A(e, 'Annual dividend per share', 0, 1e9),
      i = Number(a);
    if (![1, 2, 4, 12].includes(i))
      throw new RangeError('Choose annual, semiannual, quarterly or monthly payments.');
    let c = L(s, 'Dividend growth'),
      g = L(n, 'Share-price growth'),
      x = A(o, 'Projection years', 1, 50);
    if (!Number.isInteger(x)) throw new RangeError('Projection years must be a whole number.');
    let h = l * w,
      f = l * d;
    if (![h, f].every(Number.isFinite))
      throw new RangeError('The entered values are too large to calculate safely.');
    let E = l,
      S = 0,
      C = [];
    for (let y = 1; y <= x; y += 1) {
      let X = d * (1 + c) ** (y - 1),
        V = w * (1 + g) ** (y - 1),
        O = (1 + g) ** (1 / i),
        $ = 0;
      for (let I = 0; I < i; I += 1) {
        let P = V * O ** I,
          R = (E * X) / i;
        if (![P, R].every(Number.isFinite) || P <= 0)
          throw new RangeError('The projection is outside the safe calculation range.');
        m ? ((E += R / P), (S += R)) : ($ += R);
      }
      let N = w * (1 + g) ** y,
        Y = d * (1 + c) ** y,
        F = E * Y,
        T = E * N;
      if (![N, F, T, E, S].every(Number.isFinite))
        throw new RangeError('The projection is outside the safe calculation range.');
      C.push(
        Object.freeze({
          year: y,
          shares: E,
          sharePrice: N,
          annualIncome: F,
          incomePaid: $,
          portfolioValue: T,
          totalReinvested: S,
        }),
      );
    }
    let v = C.at(-1);
    return Object.freeze({
      startingInvestment: h,
      currentAnnualIncome: f,
      currentIncomePerPayment: f / i,
      currentYield: (d / w) * 100,
      yieldOnCost: (f / h) * 100,
      paymentsPerYear: i,
      reinvestDividends: !!m,
      projectedShares: v.shares,
      projectedSharePrice: v.sharePrice,
      projectedAnnualIncome: v.annualIncome,
      projectedPortfolioValue: v.portfolioValue,
      totalReinvested: S,
      years: x,
      annualRows: Object.freeze(C),
    });
  }
  var H = Object.freeze({
    maxShares: 1e9,
    maxSharePrice: 1e9,
    maxYears: 50,
    maxGrowthPercent: 1e3,
  });
  var u = document.querySelector('[data-tool="dividend-calculator"]');
  if (u) {
    let m = function () {
        (j(u), a.replaceChildren(), (o = ''));
      },
      l = function (d, i) {
        try {
          return new Intl.NumberFormat(s(), {
            style: 'currency',
            currency: i,
            maximumFractionDigits: 2,
          }).format(d);
        } catch {
          return `${b(s(), d, 2)} ${i}`;
        }
      },
      w = function (d) {
        (d?.preventDefault(), m());
        try {
          let i = r.elements.namedItem('currencyCode').value.trim().toUpperCase();
          if (!/^[A-Z]{3}$/u.test(i)) throw new RangeError('currency');
          let c = z({
              shares: n('shares'),
              sharePrice: n('sharePrice'),
              annualDividendPerShare: n('annualDividendPerShare'),
              paymentsPerYear: n('paymentsPerYear'),
              dividendGrowthPercent: n('dividendGrowthPercent'),
              priceGrowthPercent: n('priceGrowthPercent'),
              years: n('years'),
              reinvestDividends: r.elements.namedItem('reinvestDividends').checked,
            }),
            g = [
              [t.fields.startingInvestment, l(c.startingInvestment, i)],
              [t.fields.currentAnnualIncome, l(c.currentAnnualIncome, i)],
              [t.fields.currentIncomePerPayment, l(c.currentIncomePerPayment, i)],
              [t.fields.currentYield, `${b(s(), c.currentYield, 2)}%`],
              [t.fields.yieldOnCost, `${b(s(), c.yieldOnCost, 2)}%`],
              [t.fields.projectedShares, b(s(), c.projectedShares, 4)],
              [t.fields.projectedSharePrice, l(c.projectedSharePrice, i)],
              [t.fields.projectedAnnualIncome, l(c.projectedAnnualIncome, i)],
              [t.fields.projectedPortfolioValue, l(c.projectedPortfolioValue, i)],
              ...(c.reinvestDividends ? [[t.fields.totalReinvested, l(c.totalReinvested, i)]] : []),
            ],
            x = [...new Set([1, Math.min(5, c.years), Math.min(10, c.years), c.years])];
          for (let h of x) {
            let f = c.annualRows[h - 1];
            (g.push([
              `${t.fields.year} ${b(s(), h, 0)} \xB7 ${t.fields.projectedAnnualIncome}`,
              l(f.annualIncome, i),
            ]),
              g.push([
                `${t.fields.year} ${b(s(), h, 0)} \xB7 ${t.fields.projectedPortfolioValue}`,
                l(f.portfolioValue, i),
              ]));
          }
          (q(u, g),
            (o = g.map(([h, f]) => `${h}: ${f}`).join(`
`)),
            (e.hidden = !1),
            p(u, t.messages.calculated, 'success'));
        } catch {
          p(u, t.messages.checkInputs, 'error');
        }
      },
      r = u.querySelector('#tool-form'),
      t = _(u),
      e = u.querySelector('[data-result]'),
      a = u.querySelector('[data-result-content]'),
      s = () => document.documentElement.lang || 'en',
      n = (d) => D(r.elements.namedItem(d).value, s()),
      o = '';
    (r.addEventListener('input', () => {
      (m(), p(u, ''));
    }),
      r.addEventListener('change', () => {
        (m(), p(u, ''));
      }),
      r.addEventListener('submit', w),
      r.addEventListener('reset', () =>
        queueMicrotask(() => {
          (m(), p(u, ''));
        }),
      ),
      u.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((r.elements.namedItem('shares').value = '100'),
          (r.elements.namedItem('sharePrice').value = '40'),
          (r.elements.namedItem('annualDividendPerShare').value = '2'),
          (r.elements.namedItem('paymentsPerYear').value = '4'),
          (r.elements.namedItem('dividendGrowthPercent').value = '0'),
          (r.elements.namedItem('priceGrowthPercent').value = '0'),
          (r.elements.namedItem('years').value = '10'),
          (r.elements.namedItem('reinvestDividends').checked = !1),
          (r.elements.namedItem('currencyCode').value = 'USD'),
          w(),
          p(u, t.messages.exampleLoaded, 'success'));
      }),
      u.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && M(u, o, t);
      }));
  }
})();
