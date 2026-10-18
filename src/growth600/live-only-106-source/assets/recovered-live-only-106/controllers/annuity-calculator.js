(() => {
  var q = Object.freeze({ annual: 1, semiannual: 2, quarterly: 4, monthly: 12 });
  function p(e, n, { min: t = 0, max: r = 1e12 } = {}) {
    let a = typeof e == 'string' && e.trim() === '' ? NaN : Number(e);
    if (!Number.isFinite(a) || a < t || a > r)
      throw new RangeError(`${n} is outside the supported range.`);
    return a;
  }
  function N(e) {
    let n = q[e.frequency];
    if (!n) throw new RangeError('Choose a supported payment frequency.');
    let t = p(e.years, 'Years', { min: 1, max: 100 });
    if (!Number.isInteger(t)) throw new RangeError('Years must be a whole number.');
    let r = t * n;
    if (r > 1200) throw new RangeError('The number of payments exceeds the supported range.');
    let a = p(e.annualRatePercent, 'Annual rate', { min: -99, max: 1e3 }),
      o = a / 100 / n,
      c = e.timing;
    if (!['ordinary', 'due'].includes(c))
      throw new RangeError('Choose ordinary or due payment timing.');
    let s = (1 + o) ** r,
      i = c === 'due' ? 1 + o : 1;
    if (![s, i].every(Number.isFinite))
      throw new RangeError('The estimate exceeds the supported numeric range.');
    let m = o === 0 ? r : (s - 1) / o,
      y = o === 0 ? r : (1 - (1 + o) ** -r) / o;
    return {
      frequency: n,
      years: t,
      periods: r,
      annualRatePercent: a,
      rate: o,
      timing: c,
      growth: s,
      futureFactor: m * i,
      presentFactor: y * i,
    };
  }
  function x(e, n) {
    if (!Number.isFinite(e) || e < 0 || e > 1e15)
      throw new RangeError(`${n} is outside the supported result range.`);
    return e;
  }
  function I(e) {
    let n = e.mode;
    if (!['future', 'present', 'payment'].includes(n))
      throw new TypeError('Choose a supported calculation mode.');
    let t = N(e);
    if (n === 'future') {
      let i = p(e.initial, 'Initial amount'),
        m = p(e.payment, 'Periodic payment');
      return Object.freeze({
        mode: n,
        ...t,
        initial: i,
        payment: m,
        value: x(i * t.growth + m * t.futureFactor, 'Future value'),
        targetAlreadyReached: !1,
      });
    }
    if (n === 'present') {
      let i = p(e.payment, 'Periodic payment');
      return Object.freeze({
        mode: n,
        ...t,
        payment: i,
        value: x(i * t.presentFactor, 'Present value'),
        targetAlreadyReached: !1,
      });
    }
    let r = p(e.initial, 'Initial amount'),
      a = p(e.target, 'Target future value'),
      o = r * t.growth,
      c = o >= a,
      s = c ? 0 : (a - o) / t.futureFactor;
    return Object.freeze({
      mode: n,
      ...t,
      initial: r,
      target: a,
      futureFromInitial: o,
      payment: x(s, 'Periodic payment'),
      targetAlreadyReached: c,
    });
  }
  var F = Object.freeze({ maxInput: 1e12, maxOutput: 1e15, maxPeriods: 1200 });
  function b(e = document) {
    let n = e.querySelector('[data-tool-copy]');
    if (!n) throw new Error('Localized tool copy is missing.');
    return JSON.parse(n.textContent);
  }
  function f(e, n, t = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = n), (r.dataset.kind = t));
  }
  function _(e) {
    let n = e.querySelector('[data-result]'),
      t = e.querySelector('[data-result-content]');
    (n && (n.hidden = !0), t && t.replaceChildren());
  }
  function E(e, n) {
    let t = e.querySelector('[data-result]'),
      r = e.querySelector('[data-result-content]');
    if (!t || !r) return;
    let a = document.createElement('dl');
    for (let [o, c] of n) {
      let s = document.createElement('dt'),
        i = document.createElement('dd');
      ((s.textContent = o), (i.textContent = c), a.append(s, i));
    }
    (r.replaceChildren(a), (t.hidden = !1));
  }
  function v(e, n, { optional: t = !1, min: r = -1 / 0, max: a = 1 / 0, integer: o = !1 } = {}) {
    let c = e.elements.namedItem(n),
      s = c?.value?.trim() ?? '';
    if (t && s === '') return null;
    let i = Number(s);
    if (s === '' || !Number.isFinite(i) || i < r || i > a || (o && !Number.isInteger(i)))
      throw (c?.setAttribute('aria-invalid', 'true'), c?.focus(), new RangeError());
    return (c.removeAttribute('aria-invalid'), i);
  }
  function R(e, n, t = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: t }).format(n);
  }
  async function T(e, n, t) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(n), f(e, t.messages.copied, 'success'));
    } catch {
      f(e, t.messages.copyUnavailable, 'error');
    }
  }
  var u = document.querySelector('[data-tool="annuity-calculator"]');
  if (u) {
    let c = function () {
        let m = e.elements.namedItem('mode').value,
          y =
            m === 'future'
              ? ['initial', 'payment']
              : m === 'present'
                ? ['payment']
                : ['initial', 'target'];
        for (let d of ['initial', 'payment', 'target']) {
          let l = e.elements.namedItem(d),
            g = y.includes(d);
          ((l.disabled = !g), (l.required = g), (l.closest('.field').hidden = !g));
        }
      },
      s = function () {
        (_(u), (o = ''));
      },
      i = function (m) {
        (m?.preventDefault(), s());
        try {
          let y = (h, w = 1e12) => v(e, h, { min: 0, max: w }),
            d = e.elements.namedItem('mode').value,
            l = I({
              mode: d,
              ...(d !== 'present' ? { initial: y('initial') } : {}),
              ...(d === 'present' || d === 'future' ? { payment: y('payment') } : {}),
              ...(d === 'payment' ? { target: y('target') } : {}),
              annualRatePercent: v(e, 'annualRate', { min: -99, max: 1e3 }),
              years: v(e, 'years', { min: 1, max: 100 }),
              frequency: e.elements.namedItem('frequency').value,
              timing: e.elements.namedItem('timing').value,
            }),
            g =
              d === 'future'
                ? [
                    [t.futureValue, a(l.value)],
                    [t.initialGrowth, a(l.initial * l.growth)],
                    [t.formula, 'initial \xD7 (1 + r)\u207F + payment \xD7 annuity factor'],
                  ]
                : d === 'present'
                  ? [
                      [t.presentValue, a(l.value)],
                      [t.formula, 'payment \xD7 present-value annuity factor'],
                    ]
                  : [
                      [t.requiredPayment, a(l.payment)],
                      [t.initialGrowth, a(l.futureFromInitial)],
                      ...(l.targetAlreadyReached ? [[t.targetAlreadyReached, '']] : []),
                      [
                        t.formula,
                        'max(0, target \u2212 initial \xD7 (1 + r)\u207F) \xF7 annuity factor',
                      ],
                    ];
          (E(u, g),
            (o = `${t.resultSummary}
${g.map(([h, w]) => (w ? `${h}: ${w}` : h)).join(`
`)}`),
            f(u, n.messages.calculated, 'success'));
        } catch {
          f(u, n.messages.checkInputs, 'error');
        }
      },
      e = u.querySelector('#tool-form'),
      n = b(u),
      t = n.fields,
      r = () => document.documentElement.lang || 'en',
      a = (m) => R(r(), m, 2),
      o = '';
    (e.elements.namedItem('mode').addEventListener('change', () => {
      (c(), s(), f(u, ''));
    }),
      e.addEventListener('input', () => {
        (s(), f(u, ''));
      }),
      e.addEventListener('submit', i),
      e.addEventListener('reset', () =>
        queueMicrotask(() => {
          (c(), s(), f(u, ''));
        }),
      ),
      u.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((e.elements.namedItem('mode').value = 'future'),
          (e.elements.namedItem('initial').value = '1000'),
          (e.elements.namedItem('payment').value = '100'),
          (e.elements.namedItem('annualRate').value = '0'),
          (e.elements.namedItem('years').value = '1'),
          (e.elements.namedItem('frequency').value = 'monthly'),
          (e.elements.namedItem('timing').value = 'ordinary'),
          c(),
          i(),
          f(u, n.messages.exampleLoaded, 'success'));
      }),
      u.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && T(u, o, n);
      }),
      c());
  }
})();
