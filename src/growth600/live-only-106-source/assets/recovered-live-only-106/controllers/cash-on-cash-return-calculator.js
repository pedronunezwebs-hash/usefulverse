(() => {
  function m(e, t, { min: n = 0, max: o = 1e9 } = {}) {
    let a = Number(e);
    if (!Number.isFinite(a) || a < n || a > o) throw new RangeError(`${t} is out of range.`);
    return a;
  }
  function v({
    monthlyRent: e,
    monthlyOperatingCosts: t,
    monthlyDebtService: n,
    downPayment: o,
    closingCosts: a = 0,
    initialRepairs: l = 0,
  }) {
    let s = m(e, 'Monthly rent', { min: 0.01 }),
      c = m(t, 'Monthly operating costs'),
      i = m(n, 'Monthly debt service'),
      f = m(o, 'Down payment', { min: 0.01 }),
      d = m(a, 'Closing costs'),
      p = m(l, 'Initial repairs'),
      b = s - c - i,
      h = b * 12,
      y = f + d + p,
      g = (h / y) * 100;
    if (![h, y, g].every(Number.isFinite))
      throw new RangeError('The result is outside the supported range.');
    return Object.freeze({
      monthlyNet: b,
      annualCashFlow: h,
      cashInvested: y,
      ratePercent: g,
      cashOnCash: g / 100,
    });
  }
  function C(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function u(e, t, n = 'info') {
    let o = e.querySelector('[data-status]');
    o && ((o.textContent = t), (o.dataset.kind = n));
  }
  function w(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  function x(e, t) {
    let n = e.querySelector('[data-result]'),
      o = e.querySelector('[data-result-content]');
    if (!n || !o) return;
    let a = document.createElement('dl');
    for (let [l, s] of t) {
      let c = document.createElement('dt'),
        i = document.createElement('dd');
      ((c.textContent = l), (i.textContent = s), a.append(c, i));
    }
    (o.replaceChildren(a), (n.hidden = !1));
  }
  function R(e, t, n = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
  }
  async function S(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), u(e, n.messages.copied, 'success'));
    } catch {
      u(e, n.messages.copyUnavailable, 'error');
    }
  }
  var r = document.querySelector('[data-tool="cash-on-cash-return-calculator"]');
  if (r) {
    let a = function (l) {
        (l?.preventDefault(), w(r));
        try {
          let s = new FormData(t),
            c = v({
              monthlyRent: s.get('monthlyRent'),
              monthlyOperatingCosts: s.get('monthlyOperatingCosts'),
              monthlyDebtService: s.get('monthlyDebtService'),
              downPayment: s.get('downPayment'),
              closingCosts: s.get('closingCosts'),
              initialRepairs: s.get('initialRepairs'),
            }),
            i = (d) => R(n, d, 2),
            f = [
              [e.fields.monthlyNet, i(c.monthlyNet)],
              [e.fields.annualCashFlow, i(c.annualCashFlow)],
              [e.fields.cashInvested, i(c.cashInvested)],
              [e.fields.returnPercent, `${i(c.ratePercent)}%`],
            ];
          (x(r, f),
            (o = f.map(([d, p]) => `${d}: ${p}`).join(`
`)),
            u(r, e.messages.calculated, 'success'));
        } catch {
          ((o = ''), u(r, e.messages.checkInputs, 'error'));
        }
      },
      e = C(r),
      t = r.querySelector('#tool-form'),
      n = document.documentElement.lang || 'en',
      o = '';
    (t.addEventListener('submit', a),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          ((o = ''), w(r), u(r, ''));
        }, 0),
      ),
      r.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && S(r, o, e);
      }),
      r.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        let l = {
          monthlyRent: '2000',
          monthlyOperatingCosts: '1000',
          monthlyDebtService: '500',
          downPayment: '50000',
          closingCosts: '5000',
          initialRepairs: '5000',
        };
        for (let [s, c] of Object.entries(l)) t.elements.namedItem(s).value = c;
        (a(), u(r, e.messages.exampleLoaded, 'success'));
      }));
  }
})();
