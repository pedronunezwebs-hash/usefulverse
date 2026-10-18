(() => {
  var v = Object.freeze({
      72: 27.4,
      73: 26.5,
      74: 25.5,
      75: 24.6,
      76: 23.7,
      77: 22.9,
      78: 22,
      79: 21.1,
      80: 20.2,
      81: 19.4,
      82: 18.5,
      83: 17.7,
      84: 16.8,
      85: 16,
      86: 15.2,
      87: 14.4,
      88: 13.7,
      89: 12.9,
      90: 12.2,
      91: 11.5,
      92: 10.8,
      93: 10.1,
      94: 9.5,
      95: 8.9,
      96: 8.4,
      97: 7.8,
      98: 7.3,
      99: 6.8,
      100: 6.4,
      101: 6,
      102: 5.6,
      103: 5.2,
      104: 4.9,
      105: 4.6,
      106: 4.3,
      107: 4.1,
      108: 3.9,
      109: 3.7,
      110: 3.5,
      111: 3.4,
      112: 3.3,
      113: 3.1,
      114: 3,
      115: 2.9,
      116: 2.8,
      117: 2.7,
      118: 2.5,
      119: 2.3,
      120: 2,
    }),
    F = 1e12;
  function b(r, t, e, i) {
    let s = r?.[t],
      n = typeof s == 'string' && s.trim() === '' ? NaN : Number(s);
    if (!Number.isFinite(n) || n < e || n > i)
      throw new RangeError(`${t} is outside the supported range.`);
    return n;
  }
  function x(r) {
    let t = b(r, 'priorYearEndBalance', 0, F),
      e = b(r, 'ageInDistributionYear', 72, 120);
    if (!Number.isInteger(e)) throw new RangeError('ageInDistributionYear must be a whole number.');
    let i = v[e];
    if (!i) throw new RangeError('No Uniform Lifetime Table divisor is available for this age.');
    let s = t / i;
    if (!Number.isFinite(s)) throw new RangeError('The result exceeds the supported range.');
    return Object.freeze({
      distributionYear: 2026,
      balanceYear: 2025,
      priorYearEndBalance: t,
      ageInDistributionYear: e,
      divisor: i,
      estimatedDistribution: s,
    });
  }
  var D = Object.freeze({
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
  function E(r, t = 'en') {
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
    let i = new Intl.NumberFormat(t).formatToParts(12345.6),
      s = i.find((o) => o.type === 'decimal')?.value ?? '.',
      n = i.find((o) => o.type === 'group')?.value ?? ',';
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
  var I = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function N(r = document) {
    let t = r.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function c(r, t, e = 'info') {
    let i = r.querySelector('[data-status]');
    i && ((i.textContent = t), (i.dataset.kind = e));
  }
  function y(r) {
    let t = r.querySelector('[data-result]'),
      e = r.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  function S(r, t, e = 2) {
    return new Intl.NumberFormat(r, { maximumFractionDigits: e }).format(t);
  }
  async function C(r, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), c(r, e.messages.copied, 'success'));
    } catch {
      c(r, e.messages.copyUnavailable, 'error');
    }
  }
  var a = document.querySelector('[data-tool="required-minimum-distribution-calculator"]');
  if (a) {
    let m = function () {
        (y(a),
          (e.hidden = !0),
          (i.textContent = ''),
          (s.textContent = ''),
          (n.textContent = ''),
          (o = ''));
      },
      g = function (l) {
        (l?.preventDefault(), m());
        try {
          let u = x({
              priorYearEndBalance: E(r.elements.namedItem('accountBalance').value, d()),
              ageInDistributionYear: Number(r.elements.namedItem('ageIn2026').value),
            }),
            f = h(u.estimatedDistribution),
            A = h(u.priorYearEndBalance),
            p = R(u.divisor, 1),
            w = `${A} \xF7 ${p} = ${f}`;
          ((i.textContent = f),
            (s.textContent = p),
            (n.textContent = w),
            (o = `${t.fields.resultSummary}
${t.fields.distributionAmount}: ${f}
${t.fields.tableDivisor}: ${p}
${t.fields.formula}: ${w}
${t.fields.balanceDateNote} ${u.balanceYear}; ${t.fields.ageDateNote} ${u.distributionYear}.`),
            (e.hidden = !1),
            c(a, t.messages.calculated, 'success'));
        } catch {
          c(a, t.messages.checkInputs, 'error');
        }
      },
      r = a.querySelector('#tool-form'),
      t = N(a),
      e = a.querySelector('[data-rmd-results]'),
      i = a.querySelector('[data-rmd-amount]'),
      s = a.querySelector('[data-rmd-divisor]'),
      n = a.querySelector('[data-rmd-formula]'),
      o = '',
      d = () => document.documentElement.lang || 'en',
      h = (l) =>
        new Intl.NumberFormat(d(), {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(l),
      R = (l, u = 1) => S(d(), l, u);
    (r.addEventListener('input', () => {
      (m(), c(a, ''));
    }),
      r.addEventListener('submit', g),
      r.addEventListener('reset', () =>
        queueMicrotask(() => {
          (m(), c(a, ''));
        }),
      ),
      a.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((r.elements.namedItem('accountBalance').value = '100000'),
          (r.elements.namedItem('ageIn2026').value = '75'),
          g(),
          c(a, t.messages.exampleLoaded, 'success'));
      }),
      a.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && C(a, o, t);
      }));
  }
})();
