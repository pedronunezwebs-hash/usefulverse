(() => {
  var R = Object.freeze({
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
  function w(t, n = 'en') {
    let e = String(t)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (o) => String(o.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (o) => String(o.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (o) => String(o.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (o) => String(o.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let s = new Intl.NumberFormat(n).formatToParts(12345.6),
      a = s.find((o) => o.type === 'decimal')?.value ?? '.',
      r = s.find((o) => o.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      a === ','
        ? e.includes(',')
          ? (e = e.replaceAll(r, '').replace(',', '.'))
          : r === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : a === '.'
          ? e.includes('.')
            ? ((r === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (r !== ',' && e.includes(r))) &&
              (e = e.replaceAll(r, ''))
            : e.includes(r) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(r, '')
                  : e.replace(r, '.'))
          : e.includes(a) && (e = e.replaceAll(r, '').replace(a, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var F = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function b(t = document) {
    let n = t.querySelector('[data-tool-copy]');
    if (!n) throw new Error('Localized tool copy is missing.');
    return JSON.parse(n.textContent);
  }
  function m(t, n, e = 'info') {
    let s = t.querySelector('[data-status]');
    s && ((s.textContent = n), (s.dataset.kind = e));
  }
  function x(t) {
    let n = t.querySelector('[data-result]'),
      e = t.querySelector('[data-result-content]');
    (n && (n.hidden = !0), e && e.replaceChildren());
  }
  function y(t, n) {
    let e = t.querySelector('[data-result]'),
      s = t.querySelector('[data-result-content]');
    if (!e || !s) return;
    let a = document.createElement('dl');
    for (let [r, o] of n) {
      let l = document.createElement('dt'),
        u = document.createElement('dd');
      ((l.textContent = r), (u.textContent = o), a.append(l, u));
    }
    (s.replaceChildren(a), (e.hidden = !1));
  }
  function S(t, n, e = 2) {
    return new Intl.NumberFormat(t, { maximumFractionDigits: e }).format(n);
  }
  async function A(t, n, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(n), m(t, e.messages.copied, 'success'));
    } catch {
      m(t, e.messages.copyUnavailable, 'error');
    }
  }
  function p(t, n, e, s) {
    let a = t?.[n],
      r = typeof a == 'string' && a.trim() === '' ? NaN : Number(a);
    if (!Number.isFinite(r) || r < e || r > s)
      throw new RangeError(`${n} is outside the supported range.`);
    return r;
  }
  function E(t) {
    let n = p(t, 'finalSalary', 0, 1e9),
      e = p(t, 'yearsOfService', 0, 80),
      s = p(t, 'accrualPercent', 0, 100),
      a = p(t, 'commutationPercent', 0, 100),
      r = p(t, 'commutationFactor', 0, 100),
      o = (n * e * s) / 100,
      l = (o * a) / 100,
      u = l * r,
      f = o - l;
    if ([o, l, u, f].some((c) => !Number.isFinite(c) || c > 1e9 * 80))
      throw new RangeError('The result exceeds the supported range.');
    return Object.freeze({
      finalSalary: n,
      yearsOfService: e,
      accrualPercent: s,
      commutationPercent: a,
      commutationFactor: r,
      annualPension: o,
      convertedAnnualPension: l,
      lumpSum: u,
      remainingAnnualPension: f,
      monthlyPension: f / 12,
    });
  }
  var $ = Object.freeze({
    maxSalary: 1e9,
    maxYears: 80,
    maxPercent: 100,
    maxCommutationPercent: 100,
    maxCommutationFactor: 100,
  });
  var i = document.querySelector('[data-tool="pension-calculator"]');
  if (i) {
    let l = function () {
        (x(i), s.replaceChildren(), (o = ''));
      },
      u = function (d, c) {
        try {
          return new Intl.NumberFormat(a(), {
            style: 'currency',
            currency: c,
            currencyDisplay: 'code',
            maximumFractionDigits: 2,
          }).format(d);
        } catch {
          return `${S(a(), d, 2)} ${c}`;
        }
      },
      f = function (d) {
        (d?.preventDefault(), l());
        try {
          let c = t.elements.namedItem('currencyCode').value.trim().toUpperCase();
          if (!/^[A-Z]{3}$/u.test(c)) throw new RangeError('currency');
          let h = E({
              finalSalary: r('finalSalary'),
              yearsOfService: r('yearsOfService'),
              accrualPercent: r('accrualPercent'),
              commutationPercent: r('commutationPercent'),
              commutationFactor: r('commutationFactor'),
            }),
            g = [
              [n.fields.annualPension, u(h.annualPension, c)],
              [n.fields.monthlyPension, u(h.monthlyPension, c)],
              [n.fields.convertedAnnualPension, u(h.convertedAnnualPension, c)],
              [n.fields.lumpSum, u(h.lumpSum, c)],
              [n.fields.remainingAnnualPension, u(h.remainingAnnualPension, c)],
            ];
          (y(i, g),
            (o = g.map(([C, N]) => `${C}: ${N}`).join(`
`)),
            (e.hidden = !1),
            m(i, n.messages.calculated, 'success'));
        } catch {
          m(i, n.messages.checkInputs, 'error');
        }
      },
      t = i.querySelector('#tool-form'),
      n = b(i),
      e = i.querySelector('[data-result]'),
      s = i.querySelector('[data-result-content]'),
      a = () => document.documentElement.lang || 'en',
      r = (d) => w(t.elements.namedItem(d).value, a()),
      o = '';
    (t.addEventListener('input', () => {
      (l(), m(i, ''));
    }),
      t.addEventListener('submit', f),
      t.addEventListener('reset', () =>
        queueMicrotask(() => {
          (l(), m(i, ''));
        }),
      ),
      i.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('finalSalary').value = '50000'),
          (t.elements.namedItem('yearsOfService').value = '30'),
          (t.elements.namedItem('accrualPercent').value = '2'),
          (t.elements.namedItem('commutationPercent').value = '0'),
          (t.elements.namedItem('commutationFactor').value = '12'),
          (t.elements.namedItem('currencyCode').value = 'USD'),
          f(),
          m(i, n.messages.exampleLoaded, 'success'));
      }),
      i.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && A(i, o, n);
      }));
  }
})();
