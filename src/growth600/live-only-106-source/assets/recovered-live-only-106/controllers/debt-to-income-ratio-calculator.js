(() => {
  function y(r, s, e = 'info') {
    let a = r.querySelector('[data-status]');
    a && ((a.textContent = s), (a.dataset.kind = e));
  }
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
  function x(r, s = 'en') {
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
    let a = new Intl.NumberFormat(s).formatToParts(12345.6),
      i = a.find((n) => n.type === 'decimal')?.value ?? '.',
      t = a.find((n) => n.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      i === ','
        ? e.includes(',')
          ? (e = e.replaceAll(t, '').replace(',', '.'))
          : t === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : i === '.'
          ? e.includes('.')
            ? ((t === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (t !== ',' && e.includes(t))) &&
              (e = e.replaceAll(t, ''))
            : e.includes(t) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(t, '')
                  : e.replace(t, '.'))
          : e.includes(i) && (e = e.replaceAll(t, '').replace(i, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var C = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function g({ grossMonthlyIncome: r, housingPayment: s = 0, monthlyDebts: e = [] }) {
    let a = Number(r),
      i = Number(s);
    if (!Number.isFinite(a) || a <= 0 || a > 1e12)
      throw new RangeError('Enter a gross monthly income greater than zero.');
    if (!Number.isFinite(i) || i < 0 || i > 1e12)
      throw new RangeError('Housing costs must be a non-negative monthly amount.');
    if (!Array.isArray(e) || e.length > 20)
      throw new RangeError('Enter up to 20 monthly debt payments.');
    if (e.some((c) => typeof c == 'string' && !c.trim()))
      throw new RangeError('Enter a monthly amount for each debt field, or enter zero.');
    let t = e.map(Number);
    if (t.some((c) => !Number.isFinite(c) || c < 0 || c > 1e12))
      throw new RangeError('Debt payments must be non-negative monthly amounts.');
    let n = t.reduce((c, m) => c + m, 0),
      u = i + n;
    return Object.freeze({
      grossMonthlyIncome: a,
      housingPayment: i,
      otherDebtTotal: n,
      totalMonthlyDebt: u,
      housingRatio: (i / a) * 100,
      totalRatio: (u / a) * 100,
    });
  }
  var l = document.querySelector('[data-tool="debt-to-income-ratio-calculator"]');
  if (l) {
    let h = function (o, d = '') {
        ((i.textContent = o), y(l, o, d));
      },
      p = function (o) {
        t = o;
        let d = [
          [r.fields.housingRatio, m(o.housingRatio)],
          [r.fields.totalRatio, m(o.totalRatio)],
          [r.fields.totalDebt, c(o.totalMonthlyDebt)],
        ];
        a.replaceChildren();
        for (let [f, E] of d) {
          let w = document.createElement('dt');
          w.textContent = f;
          let b = document.createElement('dd');
          ((b.textContent = E), a.append(w, b));
        }
        ((e.hidden = !1), h(r.messages.calculated, 'success'));
      },
      r = JSON.parse(l.querySelector('[data-tool-copy]').textContent),
      s = l.querySelector('#tool-form'),
      e = l.querySelector('[data-dti-result]'),
      a = l.querySelector('[data-dti-values]'),
      i = l.querySelector('[data-status]'),
      t = null,
      n = () => document.documentElement.lang || 'en',
      u = (o) => x(s.elements.namedItem(o).value, n()),
      c = (o) => new Intl.NumberFormat(n(), { maximumFractionDigits: 2 }).format(o),
      m = (o) => `${new Intl.NumberFormat(n(), { maximumFractionDigits: 2 }).format(o)}%`;
    (s.addEventListener('submit', (o) => {
      o.preventDefault();
      try {
        p(
          g({
            grossMonthlyIncome: u('grossMonthlyIncome'),
            housingPayment: u('housingPayment'),
            monthlyDebts: ['debt1', 'debt2', 'debt3', 'debt4'].map(u),
          }),
        );
      } catch {
        ((t = null), (e.hidden = !0), h(r.messages.checkInputs, 'error'));
      }
    }),
      l.addEventListener('click', async (o) => {
        let d = o.target.closest('[data-action]')?.dataset.action;
        if (d === 'example') {
          ((s.elements.namedItem('grossMonthlyIncome').value = '5000'),
            (s.elements.namedItem('housingPayment').value = '1200'),
            (s.elements.namedItem('debt1').value = '500'),
            (s.elements.namedItem('debt2').value = '300'),
            (s.elements.namedItem('debt3').value = '0'),
            (s.elements.namedItem('debt4').value = '0'));
          try {
            p(g({ grossMonthlyIncome: 5e3, housingPayment: 1200, monthlyDebts: [500, 300] }));
          } catch {
            h(r.messages.checkInputs, 'error');
          }
        } else if (d === 'copy' && t) {
          let f = `${r.fields.housingRatio}: ${m(t.housingRatio)}
${r.fields.totalRatio}: ${m(t.totalRatio)}
${r.fields.totalDebt}: ${c(t.totalMonthlyDebt)}`;
          try {
            (await navigator.clipboard.writeText(f), h(r.messages.copied, 'success'));
          } catch {
            h(r.messages.copyUnavailable, 'error');
          }
        }
      }),
      s.addEventListener('reset', () => {
        setTimeout(() => {
          ((t = null), (e.hidden = !0), (i.textContent = ''));
        }, 0);
      }));
  }
})();
