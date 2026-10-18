(() => {
  function p(e, t, n, r) {
    let s = Number(e);
    if (!Number.isFinite(s) || s < n || s > r)
      throw new RangeError(`${t} must be between ${n} and ${r}.`);
    return s;
  }
  function S(e, t, n) {
    let r = t / 1200;
    return r === 0 ? e / n : (e * r) / (1 - (1 + r) ** -n);
  }
  function M({
    balance: e,
    currentApr: t,
    currentMonths: n,
    newApr: r,
    newMonths: s,
    closingCosts: g = 0,
    feeTreatment: o = 'upfront',
  }) {
    let a = p(e, 'Balance', 0.01, 1e9),
      l = p(t, 'Current APR', 0, 100),
      m = p(n, 'Current term', 1, 600),
      w = p(r, 'New APR', 0, 100),
      i = p(s, 'New term', 1, 600),
      f = p(g, 'Closing costs', 0, 1e7);
    if (!Number.isInteger(m) || !Number.isInteger(i))
      throw new RangeError('Terms must be whole months.');
    if (!['upfront', 'financed'].includes(o))
      throw new RangeError('Choose upfront or financed closing costs.');
    let y = S(a, l, m),
      C = a + (o === 'financed' ? f : 0),
      h = S(C, w, i),
      T = y * m,
      I = h * i + (o === 'upfront' ? f : 0),
      A = T - I,
      q = y - h,
      b = o === 'upfront' ? -f : 0,
      v = f === 0 ? 0 : null;
    for (let u = 1; u <= Math.max(m, i); u += 1)
      (u <= m && (b += y), u <= i && (b -= h), v === null && b >= 0 && (v = u));
    let R = {
      currentPayment: y,
      newPayment: h,
      monthlyPaymentChange: q,
      currentTotal: T,
      newTotal: I,
      totalSavings: A,
      breakEvenMonth: v,
      newPrincipal: C,
      feeTreatment: o,
    };
    if (Object.values(R).some((u) => typeof u == 'number' && !Number.isFinite(u)))
      throw new RangeError('The result is outside the supported numeric range.');
    return R;
  }
  function N(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function d(e, t, n = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = t), (r.dataset.kind = n));
  }
  function x(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  function P(e, t) {
    let n = e.querySelector('[data-result]'),
      r = e.querySelector('[data-result-content]');
    if (!n || !r) return;
    let s = document.createElement('dl');
    for (let [g, o] of t) {
      let a = document.createElement('dt'),
        l = document.createElement('dd');
      ((a.textContent = g), (l.textContent = o), s.append(a, l));
    }
    (r.replaceChildren(s), (n.hidden = !1));
  }
  function E(e, t, n = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
  }
  async function k(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), d(e, n.messages.copied, 'success'));
    } catch {
      d(e, n.messages.copyUnavailable, 'error');
    }
  }
  var c = document.querySelector('[data-tool="mortgage-refinance-calculator"]');
  if (c) {
    let s = function (g) {
        (g?.preventDefault(), x(c));
        try {
          let o = new FormData(t),
            a = M({
              balance: o.get('balance'),
              currentApr: o.get('currentApr'),
              currentMonths: o.get('currentMonths'),
              newApr: o.get('newApr'),
              newMonths: o.get('newMonths'),
              closingCosts: o.get('closingCosts'),
              feeTreatment: o.get('feeTreatment'),
            }),
            l = (i) => E(n, i, 2),
            m =
              a.breakEvenMonth === null
                ? e.fields.noBreakEven
                : a.breakEvenMonth === 0
                  ? e.fields.noFees
                  : e.messages.monthCount.replace('{count}', E(n, a.breakEvenMonth, 0)),
            w = [
              [e.fields.currentPayment, l(a.currentPayment)],
              [e.fields.newPayment, l(a.newPayment)],
              [e.fields.paymentDifference, l(a.monthlyPaymentChange)],
              [e.fields.currentTotal, l(a.currentTotal)],
              [e.fields.newTotal, l(a.newTotal)],
              [e.fields.totalSavings, l(a.totalSavings)],
              [e.fields.breakEven, m],
            ];
          (P(c, w),
            (r = w.map(([i, f]) => `${i}: ${f}`).join(`
`)),
            d(c, e.messages.calculated, 'success'));
        } catch {
          ((r = ''), d(c, e.messages.checkInputs, 'error'));
        }
      },
      e = N(c),
      t = c.querySelector('#tool-form'),
      n = document.documentElement.lang || 'en',
      r = '';
    (t.addEventListener('submit', s),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          ((r = ''), x(c), d(c, ''));
        }, 0),
      ),
      c.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        r && k(c, r, e);
      }),
      c.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('balance').value = '300000'),
          (t.elements.namedItem('currentApr').value = '7'),
          (t.elements.namedItem('currentMonths').value = '240'),
          (t.elements.namedItem('newApr').value = '6'),
          (t.elements.namedItem('newMonths').value = '240'),
          (t.elements.namedItem('closingCosts').value = '3000'),
          (t.elements.namedItem('feeTreatment').value = 'upfront'),
          s(),
          d(c, e.messages.exampleLoaded, 'success'));
      }));
  }
})();
