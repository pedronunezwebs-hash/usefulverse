(() => {
  var u = (n, t, e, s) => {
    if (!Number.isFinite(n) || n < e || n > s)
      throw new RangeError(`${t} must be between ${e} and ${s}.`);
    return n;
  };
  function z({
    grossMonthlyIncome: n,
    monthlyDebts: t = 0,
    maxDebtToIncomePercent: e = 36,
    downPaymentPercent: s = 20,
    annualRatePercent: l,
    termYears: a,
    propertyTaxPercent: o = 0,
    annualHomeInsurance: f = 0,
    monthlyHoa: m = 0,
    monthlyMortgageInsurance: c = 0,
  }) {
    let r = u(n, 'Gross monthly income', 1, 1e7),
      g = u(t, 'Monthly debts', 0, 1e7),
      p = u(e, 'Debt-to-income limit', 1, 60),
      h = u(s, 'Down payment percentage', 0, 99),
      w = u(l, 'Annual interest rate', 0, 50),
      k = u(a, 'Term in years', 1, 50),
      C = u(o, 'Annual property tax percentage', 0, 20),
      N = u(f, 'Annual homeowners insurance', 0, 1e6),
      A = u(m, 'Monthly HOA', 0, 1e6),
      I = u(c, 'Monthly mortgage insurance', 0, 1e6),
      F = (r * p) / 100 - g,
      R = N / 12 + A + I,
      P = F - R;
    if (P <= 0)
      throw new RangeError('Entered debts and fixed housing costs use the full monthly budget.');
    let b = Math.round(k * 12),
      x = w / 1200,
      T = x === 0 ? 1 / b : x / (1 - (1 + x) ** -b),
      E = h / 100,
      $ = C / 1200,
      S = T * (1 - E) + $;
    if (!Number.isFinite(S) || S <= 0)
      throw new RangeError('Could not calculate a finite home-price estimate.');
    let y = P / S,
      D = y * (1 - E),
      V = y * E,
      M = D * T,
      v = y * $,
      q = M + v + R,
      L = g + q,
      H = {
        grossMonthlyIncome: r,
        monthlyDebts: g,
        maxDebtToIncomePercent: p,
        housingBudget: F,
        affordableHomePrice: y,
        estimatedLoanAmount: D,
        estimatedDownPayment: V,
        monthlyPrincipalAndInterest: M,
        monthlyPropertyTax: v,
        monthlyHomeInsurance: N / 12,
        monthlyHoa: A,
        monthlyMortgageInsurance: I,
        totalMonthlyHousing: q,
        estimatedTotalMonthlyDebt: L,
        projectedDebtToIncomePercent: (L / r) * 100,
        termMonths: b,
        assumptions: { annualRatePercent: w, downPaymentPercent: h, propertyTaxPercent: C },
      };
    if (Object.values(H).some((_) => typeof _ == 'number' && !Number.isFinite(_)))
      throw new RangeError('The estimate is outside the supported numeric range.');
    return H;
  }
  var Y = Object.freeze({
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
  function B(n, t = 'en') {
    let e = String(n)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (o) => String(o.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (o) => String(o.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (o) => String(o.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (o) => String(o.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let s = new Intl.NumberFormat(t).formatToParts(12345.6),
      l = s.find((o) => o.type === 'decimal')?.value ?? '.',
      a = s.find((o) => o.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      l === ','
        ? e.includes(',')
          ? (e = e.replaceAll(a, '').replace(',', '.'))
          : a === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : l === '.'
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
          : e.includes(l) && (e = e.replaceAll(a, '').replace(l, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var K = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function U(n = document) {
    let t = n.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function d(n, t, e = 'info') {
    let s = n.querySelector('[data-status]');
    s && ((s.textContent = t), (s.dataset.kind = e));
  }
  function O(n) {
    let t = n.querySelector('[data-result]'),
      e = n.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  async function j(n, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), d(n, e.messages.copied, 'success'));
    } catch {
      d(n, e.messages.copyUnavailable, 'error');
    }
  }
  var i = document.querySelector('[data-tool="mortgage-affordability-calculator"]');
  if (i) {
    let o = function () {
        (O(i), (e.hidden = !0));
        for (let m of i.querySelectorAll(
          '[data-mortgage-home-price], [data-mortgage-loan], [data-mortgage-down], [data-mortgage-budget], [data-mortgage-pi], [data-mortgage-tax], [data-mortgage-insurance], [data-mortgage-hoa], [data-mortgage-mi], [data-mortgage-total], [data-mortgage-dti]',
        ))
          m.textContent = '';
        a = '';
      },
      f = function (m) {
        (m?.preventDefault(), o());
        try {
          let c = (h) => B(n.elements.namedItem(h).value, s()),
            r = z({
              grossMonthlyIncome: c('grossMonthlyIncome'),
              monthlyDebts: c('monthlyDebts'),
              maxDebtToIncomePercent: c('maxDebtToIncomePercent'),
              downPaymentPercent: c('downPaymentPercent'),
              annualRatePercent: c('annualRatePercent'),
              termYears: c('termYears'),
              propertyTaxPercent: c('propertyTaxPercent'),
              annualHomeInsurance: c('annualHomeInsurance'),
              monthlyHoa: c('monthlyHoa'),
              monthlyMortgageInsurance: c('monthlyMortgageInsurance'),
            }),
            g = [
              ['homePrice', r.affordableHomePrice],
              ['loanAmount', r.estimatedLoanAmount],
              ['downPaymentAmount', r.estimatedDownPayment],
              ['monthlyBudget', r.housingBudget],
              ['principalInterest', r.monthlyPrincipalAndInterest],
              ['propertyTaxMonthly', r.monthlyPropertyTax],
              ['homeInsuranceMonthly', r.monthlyHomeInsurance],
              ['hoaMonthly', r.monthlyHoa],
              ['mortgageInsuranceMonthly', r.monthlyMortgageInsurance],
              ['monthlyHousing', r.totalMonthlyHousing],
            ],
            p = [
              'home-price',
              'loan',
              'down',
              'budget',
              'pi',
              'tax',
              'insurance',
              'hoa',
              'mi',
              'total',
            ];
          (g.forEach(([, h], w) => {
            i.querySelector(`[data-mortgage-${p[w]}]`).textContent = l(h);
          }),
            (i.querySelector('[data-mortgage-dti]').textContent =
              `${new Intl.NumberFormat(s(), { maximumFractionDigits: 1 }).format(r.projectedDebtToIncomePercent)}%`),
            (a = `${t.fields.resultSummary}
${t.fields.homePrice}: ${l(r.affordableHomePrice)}
${t.fields.loanAmount}: ${l(r.estimatedLoanAmount)}
${t.fields.downPaymentAmount}: ${l(r.estimatedDownPayment)}
${t.fields.monthlyHousing}: ${l(r.totalMonthlyHousing)}
${t.fields.dtiResult}: ${new Intl.NumberFormat(s(), { maximumFractionDigits: 1 }).format(r.projectedDebtToIncomePercent)}%`),
            (e.hidden = !1),
            d(i, t.messages.calculated, 'success'));
        } catch {
          d(i, t.messages.checkInputs, 'error');
        }
      },
      n = i.querySelector('#tool-form'),
      t = U(i),
      e = i.querySelector('[data-mortgage-afford-results]'),
      s = () => document.documentElement.lang || 'en',
      l = (m) =>
        new Intl.NumberFormat(s(), {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(m),
      a = '';
    (n.addEventListener('input', () => {
      (o(), d(i, ''));
    }),
      n.addEventListener('submit', f),
      n.addEventListener('reset', () =>
        queueMicrotask(() => {
          (o(), d(i, ''));
        }),
      ),
      i.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        (Object.entries({
          grossMonthlyIncome: '10000',
          monthlyDebts: '600',
          maxDebtToIncomePercent: '36',
          downPaymentPercent: '20',
          annualRatePercent: '6.5',
          termYears: '30',
          propertyTaxPercent: '1.2',
          annualHomeInsurance: '1800',
          monthlyHoa: '150',
          monthlyMortgageInsurance: '80',
        }).forEach(([c, r]) => {
          n.elements.namedItem(c).value = r;
        }),
          f(),
          d(i, t.messages.exampleLoaded, 'success'));
      }),
      i.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        a && j(i, a, t);
      }));
  }
})();
