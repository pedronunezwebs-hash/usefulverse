(() => {
  function C(n = document) {
    let t = n.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function h(n, t, e = 'info') {
    let o = n.querySelector('[data-status]');
    o && ((o.textContent = t), (o.dataset.kind = e));
  }
  function E(n) {
    let t = n.querySelector('[data-result]'),
      e = n.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  function N(n, t) {
    let e = n.querySelector('[data-result]'),
      o = n.querySelector('[data-result-content]');
    if (!e || !o) return;
    let i = document.createElement('dl');
    for (let [a, r] of t) {
      let s = document.createElement('dt'),
        c = document.createElement('dd');
      ((s.textContent = a), (c.textContent = r), i.append(s, c));
    }
    (o.replaceChildren(i), (e.hidden = !1));
  }
  function T(n, t, e = 2) {
    return new Intl.NumberFormat(n, { maximumFractionDigits: e }).format(t);
  }
  async function A(n, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), h(n, e.messages.copied, 'success'));
    } catch {
      h(n, e.messages.copyUnavailable, 'error');
    }
  }
  var q = Object.freeze({
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
  function v(n, t = 'en') {
    let e = String(n)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (r) => String(r.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (r) => String(r.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (r) => String(r.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (r) => String(r.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let o = new Intl.NumberFormat(t).formatToParts(12345.6),
      i = o.find((r) => r.type === 'decimal')?.value ?? '.',
      a = o.find((r) => r.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      i === ','
        ? e.includes(',')
          ? (e = e.replaceAll(a, '').replace(',', '.'))
          : a === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : i === '.'
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
          : e.includes(i) && (e = e.replaceAll(a, '').replace(i, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var L = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  var p = Object.freeze({ maxAmount: 1e12, maxPercent: 100, maxMonths: 1200, maxBalance: 1e15 });
  function F({
    annualSpending: n,
    withdrawalRatePercent: t,
    currentPortfolio: e = 0,
    monthlyContribution: o = 0,
    expectedAnnualReturnPercent: i = 0,
    inflationPercent: a = 0,
  }) {
    let r = {
      annualSpending: n,
      withdrawalRatePercent: t,
      currentPortfolio: e,
      monthlyContribution: o,
      expectedAnnualReturnPercent: i,
      inflationPercent: a,
    };
    if (Object.values(r).some((u) => typeof u == 'string' && !u.trim()))
      throw new RangeError('Enter a value for every field, or enter zero where appropriate.');
    let s = Object.fromEntries(Object.entries(r).map(([u, $]) => [u, Number($)]));
    if (Object.values(s).some((u) => !Number.isFinite(u)))
      throw new RangeError('Enter finite numbers.');
    let {
      annualSpending: c,
      withdrawalRatePercent: m,
      currentPortfolio: d,
      monthlyContribution: g,
      expectedAnnualReturnPercent: b,
      inflationPercent: x,
    } = s;
    for (let u of [c, d, g])
      if (u < 0 || u > p.maxAmount)
        throw new RangeError('Money amounts must be non-negative and within the supported range.');
    if (m <= 0 || m > p.maxPercent)
      throw new RangeError('Withdrawal rate must be greater than 0% and at most 100%.');
    if (b < -100 || b > p.maxPercent || x <= -100 || x > p.maxPercent)
      throw new RangeError(
        'Return must be from -100% to 100%, and inflation must be greater than -100% and at most 100%.',
      );
    let y = c / (m / 100),
      R = (1 + b / 100) / (1 + x / 100) - 1,
      S = R <= -1 ? -1 : (1 + R) ** (1 / 12) - 1,
      f = d,
      w = f >= y ? 0 : null;
    for (let u = 1; w === null && u <= p.maxMonths; u += 1) {
      if (((f = f * (1 + S) + g), !Number.isFinite(f) || f > p.maxBalance))
        throw new RangeError('Projection exceeds the supported numeric range.');
      f >= y && (w = u);
    }
    return Object.freeze({
      annualSpending: c,
      withdrawalRatePercent: m,
      targetAmount: y,
      currentPortfolio: d,
      monthlyContribution: g,
      expectedAnnualReturnPercent: b,
      inflationPercent: x,
      realAnnualGrowthPercent: R * 100,
      monthlyRealGrowthPercent: S * 100,
      monthsToTarget: w,
      yearsToTarget: w === null ? null : w / 12,
      projectedBalance: f,
    });
  }
  var l = document.querySelector('[data-tool="fire-calculator"]');
  if (l) {
    let n = l.querySelector('#tool-form'),
      t = C(l),
      e = () => document.documentElement.lang || 'en',
      o = '',
      i = (r) => T(e(), r, 2),
      a = (r) => {
        (r?.preventDefault(), E(l), (o = ''));
        try {
          let s = (d) => v(n.elements.namedItem(d).value, e()),
            c = F({
              annualSpending: s('annualSpending'),
              withdrawalRatePercent: s('withdrawalRatePercent'),
              currentPortfolio: s('currentPortfolio'),
              monthlyContribution: s('monthlyContribution'),
              expectedAnnualReturnPercent: s('expectedAnnualReturnPercent'),
              inflationPercent: s('inflationPercent'),
            }),
            m = [
              [t.fields.targetAmount, i(c.targetAmount)],
              [t.fields.realAnnualGrowthPercent, `${i(c.realAnnualGrowthPercent)}%`],
              [
                t.fields.monthsToTarget,
                c.monthsToTarget === null ? t.fields.unreachable : String(c.monthsToTarget),
              ],
              [
                t.fields.yearsToTarget,
                c.yearsToTarget === null ? t.fields.unreachable : i(c.yearsToTarget),
              ],
              [t.fields.projectedBalance, i(c.projectedBalance)],
            ];
          (N(l, m),
            (o = m.map(([d, g]) => `${d}: ${g}`).join(`
`)),
            h(l, t.messages.calculated, 'success'));
        } catch {
          h(l, t.messages.checkInputs, 'error');
        }
      };
    (n.addEventListener('submit', a),
      n.addEventListener('input', () => {
        (E(l), (o = ''), h(l, ''));
      }),
      n.addEventListener('reset', () =>
        setTimeout(() => {
          (E(l), (o = ''), h(l, ''));
        }, 0),
      ),
      l.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        for (let [r, s] of Object.entries({
          annualSpending: '40000',
          withdrawalRatePercent: '4',
          currentPortfolio: '100000',
          monthlyContribution: '1000',
          expectedAnnualReturnPercent: '6',
          inflationPercent: '2',
        }))
          n.elements.namedItem(r).value = s;
        a();
      }),
      l.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && A(l, o, t);
      }));
  }
})();
