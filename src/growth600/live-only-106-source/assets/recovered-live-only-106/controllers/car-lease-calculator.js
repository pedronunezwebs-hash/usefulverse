(() => {
  function N(r = document) {
    let t = r.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function d(r, t, e = 'info') {
    let o = r.querySelector('[data-status]');
    o && ((o.textContent = t), (o.dataset.kind = e));
  }
  function y(r) {
    let t = r.querySelector('[data-result]'),
      e = r.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  function F(r, t) {
    let e = r.querySelector('[data-result]'),
      o = r.querySelector('[data-result-content]');
    if (!e || !o) return;
    let s = document.createElement('dl');
    for (let [a, n] of t) {
      let i = document.createElement('dt'),
        c = document.createElement('dd');
      ((i.textContent = a), (c.textContent = n), s.append(i, c));
    }
    (o.replaceChildren(s), (e.hidden = !1));
  }
  function v(r, t, e = 2) {
    return new Intl.NumberFormat(r, { maximumFractionDigits: e }).format(t);
  }
  async function A(r, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), d(r, e.messages.copied, 'success'));
    } catch {
      d(r, e.messages.copyUnavailable, 'error');
    }
  }
  var z = Object.freeze({
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
  function T(r, t = 'en') {
    let e = String(r)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (n) => String(n.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (n) => String(n.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (n) => String(n.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (n) => String(n.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let o = new Intl.NumberFormat(t).formatToParts(12345.6),
      s = o.find((n) => n.type === 'decimal')?.value ?? '.',
      a = o.find((n) => n.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      s === ','
        ? e.includes(',')
          ? (e = e.replaceAll(a, '').replace(',', '.'))
          : a === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : s === '.'
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
          : e.includes(s) && (e = e.replaceAll(a, '').replace(s, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var M = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  var p = Object.freeze({
    maxAmount: 1e9,
    maxTermMonths: 120,
    maxMoneyFactor: 1,
    maxTaxPercent: 100,
  });
  function L({
    capitalizedCost: r,
    residualValue: t,
    termMonths: e,
    moneyFactor: o,
    capCostReduction: s = 0,
    taxPercent: a = 0,
  }) {
    let n = {
      capitalizedCost: r,
      residualValue: t,
      termMonths: e,
      moneyFactor: o,
      capCostReduction: s,
      taxPercent: a,
    };
    if (Object.values(n).some((f) => typeof f == 'string' && !f.trim()))
      throw new RangeError('Enter a value for every field, or enter zero where appropriate.');
    let i = Object.fromEntries(Object.entries(n).map(([f, $]) => [f, Number($)]));
    if (Object.values(i).some((f) => !Number.isFinite(f)))
      throw new RangeError('Enter finite numbers.');
    let {
      capitalizedCost: c,
      residualValue: m,
      termMonths: u,
      moneyFactor: h,
      capCostReduction: g,
      taxPercent: w,
    } = i;
    if (c < 0 || c > p.maxAmount || m < 0 || m > p.maxAmount || g < 0 || g > p.maxAmount)
      throw new RangeError('Lease amounts must be non-negative and within the supported range.');
    if (!Number.isInteger(u) || u < 1 || u > p.maxTermMonths)
      throw new RangeError('Enter a lease term from 1 to 120 whole months.');
    if (h < 0 || h > p.maxMoneyFactor) throw new RangeError('Enter a money factor from 0 to 1.');
    if (w < 0 || w > p.maxTaxPercent) throw new RangeError('Enter a tax rate from 0% to 100%.');
    let x = c - g;
    if (m > x)
      throw new RangeError(
        'Residual value cannot exceed the adjusted capitalized cost in this estimate.',
      );
    let E = (x - m) / u,
      C = (x + m) * h,
      b = E + C,
      R = (b * w) / 100,
      S = b + R;
    return Object.freeze({
      capitalizedCost: c,
      residualValue: m,
      termMonths: u,
      moneyFactor: h,
      capCostReduction: g,
      taxPercent: w,
      adjustedCapitalizedCost: x,
      monthlyDepreciation: E,
      monthlyRentCharge: C,
      monthlyPretaxPayment: b,
      estimatedMonthlyTax: R,
      estimatedMonthlyPayment: S,
      estimatedPaymentsPlusCapReduction: S * u + g,
    });
  }
  var l = document.querySelector('[data-tool="car-lease-calculator"]');
  if (l) {
    let r = l.querySelector('#tool-form'),
      t = N(l),
      e = () => document.documentElement.lang || 'en',
      o = '',
      s = (n) => v(e(), n, 2),
      a = (n) => {
        (n?.preventDefault(), y(l), (o = ''));
        try {
          let i = (u) => T(r.elements.namedItem(u).value, e()),
            c = L({
              capitalizedCost: i('capitalizedCost'),
              residualValue: i('residualValue'),
              termMonths: i('termMonths'),
              moneyFactor: i('moneyFactor'),
              capCostReduction: i('capCostReduction'),
              taxPercent: i('taxPercent'),
            }),
            m = [
              [t.fields.monthlyDepreciation, s(c.monthlyDepreciation)],
              [t.fields.monthlyRentCharge, s(c.monthlyRentCharge)],
              [t.fields.monthlyPretaxPayment, s(c.monthlyPretaxPayment)],
              [t.fields.estimatedMonthlyTax, s(c.estimatedMonthlyTax)],
              [t.fields.estimatedMonthlyPayment, s(c.estimatedMonthlyPayment)],
              [t.fields.estimatedPaymentsPlusCapReduction, s(c.estimatedPaymentsPlusCapReduction)],
            ];
          (F(l, m),
            (o = m.map(([u, h]) => `${u}: ${h}`).join(`
`)),
            d(l, t.messages.calculated, 'success'));
        } catch {
          d(l, t.messages.checkInputs, 'error');
        }
      };
    (r.addEventListener('submit', a),
      r.addEventListener('input', () => {
        (y(l), (o = ''), d(l, ''));
      }),
      r.addEventListener('reset', () =>
        setTimeout(() => {
          (y(l), (o = ''), d(l, ''));
        }, 0),
      ),
      l.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        for (let [n, i] of Object.entries({
          capitalizedCost: '30000',
          residualValue: '18000',
          termMonths: '36',
          moneyFactor: '0.002',
          capCostReduction: '2000',
          taxPercent: '8',
        }))
          r.elements.namedItem(n).value = i;
        a();
      }),
      l.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && A(l, o, t);
      }));
  }
})();
