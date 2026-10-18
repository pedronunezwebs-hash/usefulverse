(() => {
  function w(t, n, { min: e = 0, max: r = 1e6 } = {}) {
    let o = typeof t == 'string' && t.trim() === '' ? NaN : Number(t);
    if (!Number.isFinite(o) || o < e || o > r)
      throw new RangeError(`${n} must be between ${e} and ${r}.`);
    return o;
  }
  function y(t) {
    let n = t.optionType,
      e = t.position;
    if (!['call', 'put'].includes(n)) throw new RangeError('Choose call or put.');
    if (!['long', 'short'].includes(e)) throw new RangeError('Choose buy or sell.');
    let r = w(t.strike, 'Strike', { min: Number.MIN_VALUE }),
      o = w(t.premium, 'Premium'),
      s = w(t.expirationPrice, 'Underlying price at expiration');
    if (n === 'put' && o > r)
      throw new RangeError('A standard put premium cannot exceed its strike in this model.');
    let a = w(t.contracts, 'Contracts', { min: 1, max: 1e4 });
    if (!Number.isInteger(a)) throw new RangeError('Contracts must be a whole number.');
    let c = w(t.multiplier, 'Contract multiplier', { min: 1, max: 1e4 });
    if (!Number.isInteger(c)) throw new RangeError('Contract multiplier must be a whole number.');
    let m = Math.max(n === 'call' ? s - r : r - s, 0),
      f = (e === 'long' ? 1 : -1) * (m - o),
      d = o * c * a,
      x = f * c * a,
      h = n === 'call' ? r + o : r - o,
      g = h >= 0 ? h : null;
    return Object.freeze({
      optionType: n,
      position: e,
      strike: r,
      premium: o,
      expirationPrice: s,
      contracts: a,
      multiplier: c,
      intrinsicPerUnit: m,
      profitPerUnit: f,
      totalPremium: d,
      totalProfit: x,
      breakEvenPrice: g,
      breakEvenCanBeReached: g !== null,
      maxProfit:
        n === 'call' && e === 'long' ? null : n === 'put' && e === 'long' ? (r - o) * c * a : d,
      maxLoss:
        n === 'call' && e === 'short' ? null : n === 'put' && e === 'short' ? (r - o) * c * a : d,
      hasUnlimitedPotentialLoss: n === 'call' && e === 'short',
    });
  }
  var $ = Object.freeze({ maxContracts: 1e4, maxMultiplier: 1e4, maxAmount: 1e6 });
  var F = Object.freeze({
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
  function p(t, n = 'en') {
    let e = String(t)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (a) => String(a.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (a) => String(a.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (a) => String(a.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (a) => String(a.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let r = new Intl.NumberFormat(n).formatToParts(12345.6),
      o = r.find((a) => a.type === 'decimal')?.value ?? '.',
      s = r.find((a) => a.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      o === ','
        ? e.includes(',')
          ? (e = e.replaceAll(s, '').replace(',', '.'))
          : s === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : o === '.'
          ? e.includes('.')
            ? ((s === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (s !== ',' && e.includes(s))) &&
              (e = e.replaceAll(s, ''))
            : e.includes(s) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(s, '')
                  : e.replace(s, '.'))
          : e.includes(o) && (e = e.replaceAll(s, '').replace(o, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var q = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function C(t = document) {
    let n = t.querySelector('[data-tool-copy]');
    if (!n) throw new Error('Localized tool copy is missing.');
    return JSON.parse(n.textContent);
  }
  function u(t, n, e = 'info') {
    let r = t.querySelector('[data-status]');
    r && ((r.textContent = n), (r.dataset.kind = e));
  }
  function S(t) {
    let n = t.querySelector('[data-result]'),
      e = t.querySelector('[data-result-content]');
    (n && (n.hidden = !0), e && e.replaceChildren());
  }
  function v(t, n, e = 2) {
    return new Intl.NumberFormat(t, { maximumFractionDigits: e }).format(n);
  }
  async function N(t, n, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(n), u(t, e.messages.copied, 'success'));
    } catch {
      u(t, e.messages.copyUnavailable, 'error');
    }
  }
  var i = document.querySelector('[data-tool="options-profit-calculator"]');
  if (i) {
    let a = function () {
        (S(i), (e.hidden = !0));
        for (let m of i.querySelectorAll(
          '[data-option-profit], [data-option-per-unit], [data-option-intrinsic], [data-option-break-even], [data-option-max-profit], [data-option-max-loss], [data-option-risk]',
        ))
          m.textContent = '';
        s = '';
      },
      c = function (m) {
        (m?.preventDefault(), a());
        try {
          let l = y({
              optionType: t.elements.namedItem('optionType').value,
              position: t.elements.namedItem('position').value,
              strike: p(t.elements.namedItem('strike').value, r()),
              expirationPrice: p(t.elements.namedItem('expirationPrice').value, r()),
              premium: p(t.elements.namedItem('premium').value, r()),
              contracts: p(t.elements.namedItem('contracts').value, r()),
              multiplier: p(t.elements.namedItem('multiplier').value, r()),
            }),
            f = l.totalProfit > 0 ? '+' : '',
            d = `${f}${o(l.totalProfit)}`,
            x = `${f}${o(l.profitPerUnit)}`,
            h = o(l.intrinsicPerUnit),
            g = l.breakEvenCanBeReached ? o(l.breakEvenPrice) : n.fields.noBreakEven,
            b = l.maxProfit === null ? n.fields.unlimited : o(l.maxProfit),
            E = l.maxLoss === null ? n.fields.unlimited : o(l.maxLoss);
          ((i.querySelector('[data-option-profit]').textContent = d),
            (i.querySelector('[data-option-per-unit]').textContent = x),
            (i.querySelector('[data-option-intrinsic]').textContent = h),
            (i.querySelector('[data-option-break-even]').textContent = g),
            (i.querySelector('[data-option-max-profit]').textContent = b),
            (i.querySelector('[data-option-max-loss]').textContent = E),
            (i.querySelector('[data-option-risk]').textContent = l.hasUnlimitedPotentialLoss
              ? n.fields.shortCallRisk
              : n.fields.riskBoundary),
            (s = `${n.fields.resultSummary}
${n.fields.totalProfit}: ${d}
${n.fields.profitPerUnit}: ${x}
${n.fields.intrinsicValue}: ${h}
${n.fields.breakEven}: ${g}
${n.fields.maxProfit}: ${b}
${n.fields.maxLoss}: ${E}`),
            (e.hidden = !1),
            u(i, n.messages.calculated, 'success'));
        } catch {
          u(i, n.messages.checkInputs, 'error');
        }
      },
      t = i.querySelector('#tool-form'),
      n = C(i),
      e = i.querySelector('[data-option-results]'),
      r = () => document.documentElement.lang || 'en',
      o = (m) => v(r(), m, 2),
      s = '';
    (t.addEventListener('input', () => {
      (a(), u(i, ''));
    }),
      t.addEventListener('change', () => {
        (a(), u(i, ''));
      }),
      t.addEventListener('submit', c),
      t.addEventListener('reset', () =>
        queueMicrotask(() => {
          (a(), u(i, ''));
        }),
      ),
      i.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('optionType').value = 'call'),
          (t.elements.namedItem('position').value = 'long'),
          (t.elements.namedItem('strike').value = '100'),
          (t.elements.namedItem('expirationPrice').value = '120'),
          (t.elements.namedItem('premium').value = '5'),
          (t.elements.namedItem('contracts').value = '1'),
          (t.elements.namedItem('multiplier').value = '100'),
          c(),
          u(i, n.messages.exampleLoaded, 'success'));
      }),
      i.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        s && N(i, s, n);
      }));
  }
})();
