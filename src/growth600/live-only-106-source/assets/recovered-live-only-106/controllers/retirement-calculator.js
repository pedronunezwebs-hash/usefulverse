(() => {
  function v(e, r, n = 'info') {
    let c = e.querySelector('[data-status]');
    c && ((c.textContent = r), (c.dataset.kind = n));
  }
  function f(e, r, n, c) {
    let t = Number(e);
    if (!Number.isFinite(t) || t < r || t > n)
      throw new RangeError(`${c} is outside the supported range.`);
    return t;
  }
  function h({
    startingBalance: e,
    monthlyContribution: r,
    yearsToRetirement: n,
    yearsInRetirement: c,
    annualReturnPercent: t,
    annualWithdrawal: a,
    annualInflationPercent: g,
  }) {
    let l = t / 1200,
      o = 1 + g / 100,
      i = e,
      m = n * 12;
    for (let s = 0; s < m; s += 1)
      if (((i = i * (1 + l) + r), !Number.isFinite(i) || i > 1e12 * 1e100))
        throw new RangeError('The projection exceeds the supported numeric range.');
    let u = i,
      b = u <= 0 ? 0 : null;
    for (let s = 0; s < c * 12 && b === null; s += 1) {
      u *= 1 + l;
      let p = a * o ** Math.floor(s / 12);
      if (((u -= p / 12), !Number.isFinite(u)))
        throw new RangeError('The projection exceeds the supported numeric range.');
      if (u <= 0) {
        ((u = 0), (b = (s + 1) / 12));
        break;
      }
    }
    return Object.freeze({ balanceAtRetirement: i, endingBalance: u, depletedAtAge: b });
  }
  function y(e) {
    let r = f(e.currentAge, 18, 99, 'Current age'),
      n = f(e.retirementAge, r + 1, 100, 'Retirement age'),
      c = f(e.planThroughAge, n + 1, 110, 'Planning age');
    if (![r, n, c].every(Number.isInteger)) throw new RangeError('Ages must be whole numbers.');
    let t = f(e.currentSavings, 0, 1e12, 'Current savings'),
      a = f(e.monthlyContribution, 0, 1e12, 'Monthly contribution'),
      g = f(e.annualWithdrawal, 0, 1e12, 'Annual withdrawal'),
      l = f(e.annualInflationPercent, -20, 100, 'Inflation assumption'),
      o = f(e.annualReturnPercent, -99.99, 100, 'Expected return'),
      i = f(e.conservativeReturnPercent, -99.99, 100, 'Conservative return');
    if (i > o) throw new RangeError('The conservative return cannot exceed the base return.');
    let m = n - r,
      u = c - n,
      b = {
        startingBalance: t,
        monthlyContribution: a,
        yearsToRetirement: m,
        yearsInRetirement: u,
        annualWithdrawal: g,
        annualInflationPercent: l,
      },
      s = h({ ...b, annualReturnPercent: o }),
      p = h({ ...b, annualReturnPercent: i }),
      A = (1 + l / 100) ** m;
    return Object.freeze({
      currentAge: r,
      retirementAge: n,
      planThroughAge: c,
      yearsToRetirement: m,
      yearsInRetirement: u,
      totalContributions: t + a * m * 12,
      annualWithdrawal: g,
      annualInflationPercent: l,
      annualReturnPercent: o,
      conservativeReturnPercent: i,
      purchasingPowerFactor: A,
      base: Object.freeze({
        ...s,
        balanceAtRetirementInTodayMoney: s.balanceAtRetirement / A,
        depletedAtAge: s.depletedAtAge === null ? null : n + s.depletedAtAge,
      }),
      conservative: Object.freeze({
        ...p,
        balanceAtRetirementInTodayMoney: p.balanceAtRetirement / A,
        depletedAtAge: p.depletedAtAge === null ? null : n + p.depletedAtAge,
      }),
    });
  }
  var d = document.querySelector('[data-tool="retirement-calculator"]');
  if (d) {
    let e = d.querySelector('#tool-form'),
      r = JSON.parse(d.querySelector('[data-tool-copy]').textContent),
      n = d.querySelector('[data-retirement-results]'),
      c = d.querySelector('[data-status]'),
      t = new Intl.NumberFormat(r.copyLanguage.replace('_', '-'), { maximumFractionDigits: 2 }),
      a = (g, l) => {
        d.querySelector(g).textContent = l;
      };
    (e.addEventListener('submit', (g) => {
      (g.preventDefault(), (c.textContent = ''));
      try {
        let l = new FormData(e),
          o = y(Object.fromEntries(l.entries())),
          i = (m) =>
            m === null ? r.fields.noDepletion : r.messages.depletion.replace('{age}', t.format(m));
        (a('[data-retirement-contributions]', t.format(o.totalContributions)),
          a('[data-retirement-conservative-contributions]', t.format(o.totalContributions)),
          a('[data-retirement-at-age]', t.format(o.base.balanceAtRetirement)),
          a('[data-retirement-conservative-at-age]', t.format(o.conservative.balanceAtRetirement)),
          a('[data-retirement-today]', t.format(o.base.balanceAtRetirementInTodayMoney)),
          a(
            '[data-retirement-conservative-today]',
            t.format(o.conservative.balanceAtRetirementInTodayMoney),
          ),
          a('[data-retirement-ending]', t.format(o.base.endingBalance)),
          a('[data-retirement-conservative-ending]', t.format(o.conservative.endingBalance)),
          a('[data-retirement-depletion]', i(o.base.depletedAtAge)),
          a('[data-retirement-conservative-depletion]', i(o.conservative.depletedAtAge)),
          (n.hidden = !1),
          v(d, r.messages.calculated, 'success'));
      } catch {
        ((n.hidden = !0), v(d, r.messages.invalid, 'error'));
      }
    }),
      d.querySelector('[data-action="example"]').addEventListener('click', () => {
        (e.reset(), e.requestSubmit());
      }),
      d.querySelector('[data-action="reset"]').addEventListener('click', () => {
        (e.reset(), (n.hidden = !0), (c.textContent = ''));
      }));
  }
})();
