(() => {
  function f(a, r, o = 'info') {
    let e = a.querySelector('[data-status]');
    e && ((e.textContent = r), (e.dataset.kind = o));
  }
  var v = Object.freeze([
      9.9, 10, 10.1, 10.9, 12.8, 15.1, 17.3, 20, 17.9, 16.8, 17.1, 17.1, 17.5, 17.7, 17.4, 17.1,
      17.1, 16.7, 15.2, 13.7, 13, 13.4, 13.7, 13.9, 14.4, 14.1, 13.9, 14, 14.7, 16.3, 17.3, 17.6,
      18, 19.5, 22.3, 24.1, 23.8, 24.1, 26, 26.5, 26.7, 26.9, 26.8, 27.2, 28.1, 28.9, 29.1, 29.6,
      29.9, 30.2, 30.6, 31, 31.5, 32.4, 33.4, 34.8, 36.7, 38.8, 40.5, 41.8, 44.4, 49.3, 53.8, 56.9,
      60.6, 65.2, 72.6, 82.4, 90.9, 96.5, 99.6, 103.9, 107.6, 109.6, 113.6, 118.3, 124, 130.7,
      136.2, 140.3, 144.5, 148.2, 152.4, 156.9, 160.5, 163, 166.6, 172.2, 177.1, 179.9, 184, 188.9,
      195.3, 201.6, 207.342, 215.303, 214.537, 218.056, 224.939, 229.594, 232.957, 236.736, 237.017,
      240.007, 245.12, 251.107, 255.657, 258.811, 270.97, 292.655, 304.702, 313.689, 321.943,
    ]),
    b = Object.freeze(Object.fromEntries(v.map((a, r) => [1913 + r, a])));
  function x({ amount: a, startIndex: r, endIndex: o }) {
    let e = Number(a),
      t = Number(r),
      i = Number(o);
    if (![e, t, i].every(Number.isFinite) || e <= 0 || t <= 0 || i <= 0)
      throw new RangeError('Amount and indexes must be finite positive numbers.');
    if (e > 1e12 || t > 1e9 || i > 1e9)
      throw new RangeError('An input exceeds the supported range.');
    let d = i / t,
      u = e * d;
    if (!Number.isFinite(u) || u > 1e300)
      throw new RangeError('The adjusted amount exceeds the supported range.');
    return Object.freeze({
      adjustedAmount: u,
      cumulativeChangePercent: (d - 1) * 100,
      priceLevelRatio: d,
    });
  }
  function S({ amount: a, startYear: r, endYear: o }) {
    let e = Number(r),
      t = Number(o);
    if (!Number.isInteger(e) || !Number.isInteger(t) || e < 1913 || t > 2025 || t <= e)
      throw new RangeError(
        'Choose two whole years from 1913 to 2025, with the end year later than the start year.',
      );
    return Object.freeze({
      ...x({ amount: a, startIndex: b[e], endIndex: b[t] }),
      startYear: e,
      endYear: t,
      years: t - e,
      dataset: 'us-cpi-u-annual',
    });
  }
  function h({ amount: a, annualRatePercent: r, years: o }) {
    let e = Number(r),
      t = Number(o);
    if (!Number.isFinite(e) || e <= -99.99 || e > 1e3)
      throw new RangeError('Annual rate must be greater than -99.99% and no more than 1,000%.');
    if (!Number.isInteger(t) || t < 1 || t > 200)
      throw new RangeError('Years must be a whole number from 1 to 200.');
    let i = x({ amount: a, startIndex: 1, endIndex: (1 + e / 100) ** t });
    return Object.freeze({ ...i, annualizedRatePercent: e, years: t, dataset: 'user-rate' });
  }
  var n = document.querySelector('[data-tool="inflation-calculator"]');
  if (n) {
    let m = function () {
        let l = o.value === 'custom-rate';
        ((e.hidden = l), (t.hidden = !l));
        for (let s of t.querySelectorAll('input')) s.disabled = !l;
        for (let s of e.querySelectorAll('input')) s.disabled = l;
        i.hidden = !0;
      },
      a = n.querySelector('#tool-form'),
      r = JSON.parse(n.querySelector('[data-tool-copy]').textContent),
      o = n.querySelector('#inflation-mode'),
      e = n.querySelector('[data-inflation-cpi-fields]'),
      t = n.querySelector('[data-inflation-custom-fields]'),
      i = n.querySelector('[data-inflation-results]'),
      d = n.querySelector('#inflation-amount'),
      u = n.querySelector('[data-status]'),
      p = r.copyLanguage.replace('_', '-'),
      y = new Intl.NumberFormat(p, { maximumFractionDigits: 2 }),
      g = new Intl.NumberFormat(p, { maximumFractionDigits: 2, signDisplay: 'always' });
    (o.addEventListener('change', m),
      a.addEventListener('submit', (l) => {
        (l.preventDefault(), (u.textContent = ''));
        try {
          let s = new FormData(a),
            c =
              o.value === 'custom-rate'
                ? h({
                    amount: s.get('amount'),
                    annualRatePercent: s.get('annualRatePercent'),
                    years: s.get('years'),
                  })
                : S({
                    amount: s.get('amount'),
                    startYear: s.get('startYear'),
                    endYear: s.get('endYear'),
                  }),
            w =
              c.dataset === 'user-rate'
                ? c.annualizedRatePercent
                : (c.priceLevelRatio ** (1 / c.years) - 1) * 100;
          ((n.querySelector('[data-inflation-summary]').textContent =
            o.value === 'custom-rate'
              ? r.messages.customSummary.replace('{years}', y.format(c.years))
              : r.messages.cpiSummary
                  .replace('{start}', String(c.startYear))
                  .replace('{end}', String(c.endYear))),
            (n.querySelector('[data-inflation-adjusted]').textContent = y.format(c.adjustedAmount)),
            (n.querySelector('[data-inflation-cumulative]').textContent =
              `${g.format(c.cumulativeChangePercent)}%`),
            (n.querySelector('[data-inflation-annualized]').textContent = `${g.format(w)}%`),
            (i.hidden = !1),
            f(n, r.messages.calculated, 'success'));
        } catch (s) {
          ((i.hidden = !0), f(n, (s instanceof RangeError, r.messages.invalid), 'error'));
        }
      }),
      n.querySelector('[data-action="example"]').addEventListener('click', () => {
        ((o.value = 'us-cpi'),
          (n.querySelector('#inflation-start-year').value = '2020'),
          (n.querySelector('#inflation-end-year').value = '2025'),
          (d.value = '100'),
          m(),
          a.requestSubmit());
      }),
      n.querySelector('[data-action="reset"]').addEventListener('click', () => {
        (a.reset(), m(), (i.hidden = !0), (u.textContent = ''));
      }),
      m());
  }
})();
