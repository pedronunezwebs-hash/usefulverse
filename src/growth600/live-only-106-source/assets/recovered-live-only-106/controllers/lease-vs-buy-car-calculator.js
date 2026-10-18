(() => {
  function c(e, t, n = 0, a = 1e9) {
    let s = Number(e);
    if (!Number.isFinite(s) || s < n || s > a) throw new RangeError(`${t} is out of range.`);
    return s;
  }
  function C({
    months: e,
    annualMiles: t,
    leaseMonthlyPayment: n,
    leaseDueAtStart: a,
    leaseEndFees: s,
    leaseMileageAllowance: i,
    excessPerMileFee: u,
    leaseMaintenance: r,
    purchasePrice: l,
    purchaseTaxesFees: y,
    buyMaintenance: p,
    resaleValue: f,
  }) {
    let m = c(e, 'Months', 1, 120);
    if (!Number.isInteger(m)) throw new RangeError('Months must be a whole number.');
    let I = c(t, 'Annual miles', 0, 1e6),
      O = c(n, 'Lease payment'),
      _ = c(a, 'Lease due at start'),
      A = c(s, 'Lease end fees'),
      P = c(i, 'Annual mileage allowance', 0, 1e6),
      j = c(u, 'Excess-mile fee'),
      k = c(r, 'Lease maintenance'),
      x = c(l, 'Purchase price', 0.01),
      v = c(y, 'Purchase taxes and fees'),
      V = c(p, 'Ownership maintenance'),
      E = c(f, 'Expected resale value');
    if (E > x + v)
      throw new RangeError('Resale value cannot exceed the entered purchase price plus fees.');
    let D = m / 12,
      M = Math.max(0, I - P) * D,
      S = M * j,
      h = _ + O * m + A + S + k,
      b = x + v + V - E,
      $ = h / m,
      z = b / m,
      g = h - b,
      T = {
        leaseTotal: h,
        buyTotal: b,
        leaseMonthlyEquivalent: $,
        buyMonthlyEquivalent: z,
        difference: g,
        cheaperOption: g < 0 ? 'lease' : g > 0 ? 'buy' : 'tie',
        excessMiles: M,
        mileageCharge: S,
      };
    if (Object.values(T).some((q) => typeof q == 'number' && !Number.isFinite(q)))
      throw new RangeError('The result is outside the supported range.');
    return Object.freeze(T);
  }
  function L(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function d(e, t, n = 'info') {
    let a = e.querySelector('[data-status]');
    a && ((a.textContent = t), (a.dataset.kind = n));
  }
  function w(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  function F(e, t) {
    let n = e.querySelector('[data-result]'),
      a = e.querySelector('[data-result-content]');
    if (!n || !a) return;
    let s = document.createElement('dl');
    for (let [i, u] of t) {
      let r = document.createElement('dt'),
        l = document.createElement('dd');
      ((r.textContent = i), (l.textContent = u), s.append(r, l));
    }
    (a.replaceChildren(s), (n.hidden = !1));
  }
  function R(e, t, n = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
  }
  async function N(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), d(e, n.messages.copied, 'success'));
    } catch {
      d(e, n.messages.copyUnavailable, 'error');
    }
  }
  var o = document.querySelector('[data-tool="lease-vs-buy-car-calculator"]');
  if (o) {
    let s = function (i) {
        (i?.preventDefault(), w(o));
        try {
          let u = new FormData(t),
            r = C(Object.fromEntries(u.entries())),
            l = (f) => R(n, f, 2),
            y = r.cheaperOption === 'tie' ? e.fields.tie : e.messages[r.cheaperOption],
            p = [
              [e.fields.leaseTotal, l(r.leaseTotal)],
              [e.fields.buyTotal, l(r.buyTotal)],
              [e.fields.leaseMonthly, l(r.leaseMonthlyEquivalent)],
              [e.fields.buyMonthly, l(r.buyMonthlyEquivalent)],
              [e.fields.mileageCharge, l(r.mileageCharge)],
              [e.fields.cheaper, y],
              [e.fields.difference, l(Math.abs(r.difference))],
            ];
          (F(o, p),
            (a = p.map(([f, m]) => `${f}: ${m}`).join(`
`)),
            d(o, e.messages.calculated, 'success'));
        } catch {
          ((a = ''), d(o, e.messages.checkInputs, 'error'));
        }
      },
      e = L(o),
      t = o.querySelector('#tool-form'),
      n = document.documentElement.lang || 'en',
      a = '';
    (t.addEventListener('submit', s),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          ((a = ''), w(o), d(o, ''));
        }, 0),
      ),
      o.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        a && N(o, a, e);
      }),
      o.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        let i = {
          months: '36',
          annualMiles: '15000',
          leaseMonthlyPayment: '300',
          leaseDueAtStart: '2000',
          leaseEndFees: '500',
          leaseMileageAllowance: '12000',
          excessPerMileFee: '0.20',
          leaseMaintenance: '600',
          purchasePrice: '30000',
          purchaseTaxesFees: '2000',
          buyMaintenance: '1800',
          resaleValue: '18000',
        };
        for (let [u, r] of Object.entries(i)) t.elements.namedItem(u).value = r;
        (s(), d(o, e.messages.exampleLoaded, 'success'));
      }));
  }
})();
