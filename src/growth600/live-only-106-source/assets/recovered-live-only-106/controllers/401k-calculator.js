(() => {
  function v(e, r, o = 'info') {
    let a = e.querySelector('[data-status]');
    a && ((a.textContent = r), (a.dataset.kind = o));
  }
  function u(e, r, o, a) {
    let l = Number(e);
    if (!Number.isFinite(l) || l < r || l > o)
      throw new RangeError(`${a} is outside the supported range.`);
    return l;
  }
  function M(e) {
    let r = u(e.annualSalary, 0, 1e12, 'Annual salary'),
      o = u(e.currentBalance, 0, 1e12, 'Current balance'),
      a = u(e.employeeContributionPercent, 0, 100, 'Employee contribution'),
      l = u(e.employerMatchPercent, 0, 500, 'Employer match'),
      c = u(e.matchLimitPercent, 0, 100, 'Match limit'),
      i = u(e.vestingPercent, 0, 100, 'Vesting'),
      s = u(e.years, 0, 60, 'Projection years'),
      t = u(e.annualReturnPercent, -99.99, 100, 'Annual return');
    if (!Number.isInteger(s)) throw new RangeError('Projection years must be a whole number.');
    let C = Math.min(a, c),
      y = (r * a) / 100,
      m = (((r * C) / 100) * l) / 100,
      f = (m * i) / 100,
      p = t / 1200,
      b = y / 12,
      h = m / 12,
      N = f / 12,
      d = o,
      g = o,
      E = 0,
      x = 0,
      S = [];
    if (s * 12 > 720) throw new RangeError('Projection is too long.');
    for (let w = 1; w <= s * 12; w += 1) {
      if (
        ((d = d * (1 + p) + b + h),
        (g = g * (1 + p) + b + N),
        (E += b),
        (x += h),
        ![d, g, E, x].every(Number.isFinite) || d > 1e12 * 1e100)
      )
        throw new RangeError('The projection exceeds the supported numeric range.');
      w % 12 === 0 && S.push(Object.freeze({ year: w / 12, accountBalance: d, vestedBalance: g }));
    }
    return Object.freeze({
      annualEmployeeContribution: y,
      annualEmployerMatch: m,
      annualVestedMatch: f,
      totalAnnualContribution: y + m,
      employeeContributions: E,
      employerContributions: x,
      vestedEmployerContributions: f * s,
      accountBalance: d,
      vestedBalance: g,
      yearly: Object.freeze(S),
    });
  }
  var n = document.querySelector('[data-tool="401k-calculator"]');
  if (n) {
    let e = n.querySelector('#tool-form'),
      r = JSON.parse(n.querySelector('[data-tool-copy]').textContent),
      o = n.querySelector('[data-401k-results]'),
      a = n.querySelector('[data-status]'),
      l = new Intl.NumberFormat(r.copyLanguage.replace('_', '-'), { maximumFractionDigits: 2 }),
      c = (s) => l.format(s),
      i = (s, t) => {
        n.querySelector(s).textContent = t;
      };
    (e.addEventListener('submit', (s) => {
      s.preventDefault();
      try {
        let t = M(Object.fromEntries(new FormData(e).entries()));
        (i('[data-401k-employee]', c(t.annualEmployeeContribution)),
          i('[data-401k-match]', c(t.annualEmployerMatch)),
          i('[data-401k-vested-match]', c(t.annualVestedMatch)),
          i('[data-401k-total]', c(t.totalAnnualContribution)),
          i('[data-401k-balance]', c(t.accountBalance)),
          i('[data-401k-vested-balance]', c(t.vestedBalance)),
          n.querySelector('[data-401k-years]').replaceChildren(
            ...t.yearly.map(({ year: y, accountBalance: m, vestedBalance: f }) => {
              let p = document.createElement('tr');
              for (let b of [l.format(y), c(m), c(f)]) {
                let h = document.createElement('td');
                ((h.textContent = b), p.append(h));
              }
              return p;
            }),
          ),
          (o.hidden = !1),
          v(n, r.messages.calculated, 'success'));
      } catch {
        ((o.hidden = !0), v(n, r.messages.invalid, 'error'));
      }
    }),
      n.querySelector('[data-action="example"]').addEventListener('click', () => {
        (e.reset(), e.requestSubmit());
      }),
      n.querySelector('[data-action="reset"]').addEventListener('click', () => {
        (e.reset(), (o.hidden = !0), (a.textContent = ''));
      }));
  }
})();
