(() => {
  var S = Object.freeze({
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
  function y(t, r = 'en') {
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
    let s = new Intl.NumberFormat(r).formatToParts(12345.6),
      o = s.find((n) => n.type === 'decimal')?.value ?? '.',
      a = s.find((n) => n.type === 'group')?.value ?? ',';
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
  var M = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function b(t = document) {
    let r = t.querySelector('[data-tool-copy]');
    if (!r) throw new Error('Localized tool copy is missing.');
    return JSON.parse(r.textContent);
  }
  function d(t, r, e = 'info') {
    let s = t.querySelector('[data-status]');
    s && ((s.textContent = r), (s.dataset.kind = e));
  }
  function x(t) {
    let r = t.querySelector('[data-result]'),
      e = t.querySelector('[data-result-content]');
    (r && (r.hidden = !0), e && e.replaceChildren());
  }
  function E(t, r) {
    let e = t.querySelector('[data-result]'),
      s = t.querySelector('[data-result-content]');
    if (!e || !s) return;
    let o = document.createElement('dl');
    for (let [a, n] of r) {
      let c = document.createElement('dt'),
        m = document.createElement('dd');
      ((c.textContent = a), (m.textContent = n), o.append(c, m));
    }
    (s.replaceChildren(o), (e.hidden = !1));
  }
  function p(t, r, e = 2) {
    return new Intl.NumberFormat(t, { maximumFractionDigits: e }).format(r);
  }
  async function C(t, r, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(r), d(t, e.messages.copied, 'success'));
    } catch {
      d(t, e.messages.copyUnavailable, 'error');
    }
  }
  function g(t, r, e, s) {
    let o = typeof t == 'string' && t.trim() === '' ? NaN : Number(t);
    if (!Number.isFinite(o) || o < e || o > s)
      throw new RangeError(`${r} is outside the supported range.`);
    return o;
  }
  function N(t) {
    let r = g(t?.monthlyRevenue, 'Monthly revenue per customer', Number.MIN_VALUE, 1e9),
      e = g(t?.grossMarginPercent, 'Gross margin', 0, 100),
      s = g(t?.monthlyChurnPercent, 'Monthly churn', Number.MIN_VALUE, 100),
      o = g(t?.customerAcquisitionCost ?? 0, 'Customer acquisition cost', 0, 1e9),
      a = String(t?.currency ?? 'USD')
        .trim()
        .toUpperCase();
    if (!/^[A-Z]{3}$/u.test(a)) throw new RangeError('Enter a three-letter currency code.');
    let n = (r * e) / 100,
      c = 100 / s,
      m = n * c,
      h = n > 0 ? o / n : null,
      l = o > 0 ? m / o : null;
    if (
      [n, c, m, ...(h === null ? [] : [h]), ...(l === null ? [] : [l])].some(
        (u) => !Number.isFinite(u) || u > 1e15,
      )
    )
      throw new RangeError('The result exceeds the supported range.');
    return Object.freeze({
      currency: a,
      monthlyRevenue: r,
      grossMarginPercent: e,
      monthlyChurnPercent: s,
      customerAcquisitionCost: o,
      monthlyGrossProfit: n,
      expectedLifetimeMonths: c,
      lifetimeValue: m,
      cacPaybackMonths: h,
      lifetimeValueToCac: l,
    });
  }
  var _ = Object.freeze({
    maxMonthlyRevenue: 1e9,
    maxMonthlyChurnPercent: 100,
    maxGrossMarginPercent: 100,
    maxCAC: 1e9,
  });
  var i = document.querySelector('[data-tool="lifetime-value-calculator"]');
  if (i) {
    let c = function () {
        (x(i), s.replaceChildren(), (n = ''));
      },
      m = function (l, u) {
        try {
          return new Intl.NumberFormat(o(), {
            style: 'currency',
            currency: u,
            currencyDisplay: 'code',
            maximumFractionDigits: 2,
          }).format(l);
        } catch {
          return `${p(o(), l, 2)} ${u}`;
        }
      },
      h = function (l) {
        (l?.preventDefault(), c());
        try {
          let u = t.elements.namedItem('currencyCode').value.trim().toUpperCase();
          if (!/^[A-Z]{3}$/u.test(u)) throw new RangeError('currency');
          let f = N({
              monthlyRevenue: a('monthlyRevenue'),
              grossMarginPercent: a('grossMarginPercent'),
              monthlyChurnPercent: a('monthlyChurnPercent'),
              customerAcquisitionCost: a('customerAcquisitionCost'),
              currency: u,
            }),
            w = [
              [r.fields.monthlyGrossProfit, m(f.monthlyGrossProfit, u)],
              [r.fields.expectedLifetimeMonths, p(o(), f.expectedLifetimeMonths, 2)],
              [r.fields.lifetimeValue, m(f.lifetimeValue, u)],
              ...(f.cacPaybackMonths === null
                ? []
                : [[r.fields.cacPaybackMonths, p(o(), f.cacPaybackMonths, 2)]]),
              ...(f.lifetimeValueToCac === null
                ? []
                : [[r.fields.lifetimeValueToCac, `${p(o(), f.lifetimeValueToCac, 2)}\xD7`]]),
            ];
          (E(i, w),
            (n = w.map(([A, R]) => `${A}: ${R}`).join(`
`)),
            (e.hidden = !1),
            d(i, r.messages.calculated, 'success'));
        } catch {
          d(i, r.messages.checkInputs, 'error');
        }
      },
      t = i.querySelector('#tool-form'),
      r = b(i),
      e = i.querySelector('[data-result]'),
      s = i.querySelector('[data-result-content]'),
      o = () => document.documentElement.lang || 'en',
      a = (l) => y(t.elements.namedItem(l).value, o()),
      n = '';
    (t.addEventListener('input', () => {
      (c(), d(i, ''));
    }),
      t.addEventListener('submit', h),
      t.addEventListener('reset', () =>
        queueMicrotask(() => {
          (c(), d(i, ''));
        }),
      ),
      i.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('monthlyRevenue').value = '100'),
          (t.elements.namedItem('grossMarginPercent').value = '50'),
          (t.elements.namedItem('monthlyChurnPercent').value = '5'),
          (t.elements.namedItem('customerAcquisitionCost').value = '0'),
          (t.elements.namedItem('currencyCode').value = 'USD'),
          h(),
          d(i, r.messages.exampleLoaded, 'success'));
      }),
      i.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        n && C(i, n, r);
      }));
  }
})();
