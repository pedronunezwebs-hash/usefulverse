(() => {
  function u(o, t, n = 'info') {
    let e = o.querySelector('[data-status]');
    e && ((e.textContent = t), (e.dataset.kind = n));
  }
  var b = Object.freeze({
    2025: Object.freeze({ first: 1226, second: 7391, fullRetirementAge: 67 }),
    2026: Object.freeze({ first: 1286, second: 7749, fullRetirementAge: 67 }),
  });
  function h(o, t, n) {
    let e = typeof o == 'string' && o.trim() === '' ? NaN : Number(o);
    if (!Number.isFinite(e) || e < t || e > n)
      throw new RangeError('Input is outside the supported range.');
    return e;
  }
  function p(o, t) {
    return Math.floor((o + Number.EPSILON) / t) * t;
  }
  function f(o) {
    let t = Number(o?.eligibilityYear),
      n = b[t];
    if (!n) throw new RangeError('Choose an eligibility year supported by this estimate.');
    let e = h(o?.aime, 0, 2e5);
    if (!Number.isInteger(e))
      throw new RangeError('AIME must be entered as a whole dollar amount.');
    let c = h(o?.claimAge, 62, 70);
    if (!Number.isInteger(c))
      throw new RangeError('Claiming age must be a whole age from 62 through 70.');
    let d = Math.min(e, n.first) * 0.9,
      m = Math.max(0, Math.min(e, n.second) - n.first) * 0.32,
      r = Math.max(0, e - n.second) * 0.15,
      s = p(d + m + r, 0.1),
      l = (c - n.fullRetirementAge) * 12,
      a = 1;
    if (l < 0) {
      let y = Math.abs(l);
      ((a -= Math.min(y, 36) * (5 / 9 / 100)), (a -= Math.max(0, y - 36) * (5 / 12 / 100)));
    } else l > 0 && (a += Math.min(l, 36) * (2 / 3 / 100));
    a = Math.round(a * 1e10) / 1e10;
    let g = Math.floor(s * a + Number.EPSILON);
    if (![s, a, g].every(Number.isFinite))
      throw new RangeError('The estimate is outside the supported range.');
    return Object.freeze({
      aime: e,
      eligibilityYear: t,
      firstBendPoint: n.first,
      secondBendPoint: n.second,
      fullRetirementAge: n.fullRetirementAge,
      claimingAge: c,
      firstPortion: d,
      secondPortion: m,
      thirdPortion: r,
      primaryInsuranceAmount: s,
      claimingFactor: a,
      estimatedMonthlyBenefit: g,
    });
  }
  var i = document.querySelector('[data-tool="social-security-calculator"]');
  if (i) {
    let o = JSON.parse(i.querySelector('[data-tool-copy]').textContent),
      t = i.querySelector('[data-social-security-form]'),
      n = i.querySelector('[data-results]'),
      e = document.documentElement.lang || 'en',
      c = (r) =>
        new Intl.NumberFormat(e, {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(r),
      d = (r) =>
        new Intl.NumberFormat(e, {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(r),
      m = (r) => {
        let s = {
          year: new Intl.NumberFormat(e, { useGrouping: !1 }).format(r.eligibilityYear),
          aime: c(r.aime),
          firstBend: c(r.firstBendPoint),
          secondBend: c(r.secondBendPoint),
          pia: c(r.primaryInsuranceAmount),
          claimAge: new Intl.NumberFormat(e, { maximumFractionDigits: 0 }).format(r.claimingAge),
          factor: new Intl.NumberFormat(e, { style: 'percent', maximumFractionDigits: 2 }).format(
            r.claimingFactor,
          ),
          monthly: d(r.estimatedMonthlyBenefit),
        };
        for (let [l, a] of Object.entries(s))
          i.querySelector(`[data-result="${l}"]`).textContent = a;
        n.hidden = !1;
      };
    (t.addEventListener('submit', (r) => {
      r.preventDefault();
      try {
        let s = f({
          aime: t.elements.namedItem('aime').value,
          eligibilityYear: t.elements.namedItem('eligibilityYear').value,
          claimAge: t.elements.namedItem('claimAge').value,
        });
        (m(s), u(i, o.messages.calculated, 'success'));
      } catch {
        ((n.hidden = !0), u(i, o.messages.checkInputs, 'error'));
      }
    }),
      i.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('aime').value = '5825'),
          (t.elements.namedItem('eligibilityYear').value = '2026'),
          (t.elements.namedItem('claimAge').value = '67'),
          m(f({ aime: 5825, eligibilityYear: 2026, claimAge: 67 })),
          u(i, o.messages.exampleLoaded, 'success'));
      }),
      i.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
        (t.reset(), (n.hidden = !0), u(i, '', 'info'));
      }));
  }
})();
