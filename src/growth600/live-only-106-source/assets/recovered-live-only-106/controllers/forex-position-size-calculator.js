(() => {
  function f(e, t, o, n) {
    let s = Number(e);
    if (!Number.isFinite(s) || s < o || s > n) throw new RangeError(`${t} is out of range.`);
    return s;
  }
  function x({ accountBalance: e, riskPercent: t, stopLossPips: o, pipValuePerStandardLot: n }) {
    let s = f(e, 'Account balance', 0.01, 1e12),
      u = f(t, 'Risk percent', 0.01, 100),
      c = f(o, 'Stop-loss pips', 0.01, 1e5),
      i = f(n, 'Pip value per standard lot', 1e-6, 1e6),
      a = (s * u) / 100,
      d = c * i,
      l = a / d,
      p = l * 1e5,
      g = l * 100;
    if (![a, d, l, p, g].every(Number.isFinite))
      throw new RangeError('The result is outside the supported numeric range.');
    return Object.freeze({
      riskAmount: a,
      lossPerStandardLot: d,
      standardLots: l,
      units: p,
      microLots: g,
      modeledLoss: l * d,
    });
  }
  function b(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function m(e, t, o = 'info') {
    let n = e.querySelector('[data-status]');
    n && ((n.textContent = t), (n.dataset.kind = o));
  }
  function y(e) {
    let t = e.querySelector('[data-result]'),
      o = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), o && o.replaceChildren());
  }
  function w(e, t) {
    let o = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    if (!o || !n) return;
    let s = document.createElement('dl');
    for (let [u, c] of t) {
      let i = document.createElement('dt'),
        a = document.createElement('dd');
      ((i.textContent = u), (a.textContent = c), s.append(i, a));
    }
    (n.replaceChildren(s), (o.hidden = !1));
  }
  function L(e, t, o = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: o }).format(t);
  }
  async function S(e, t, o) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), m(e, o.messages.copied, 'success'));
    } catch {
      m(e, o.messages.copyUnavailable, 'error');
    }
  }
  var r = document.querySelector('[data-tool="forex-position-size-calculator"]');
  if (r) {
    let s = function (u) {
        (u?.preventDefault(), y(r));
        try {
          let c = new FormData(t),
            i = x({
              accountBalance: c.get('accountBalance'),
              riskPercent: c.get('riskPercent'),
              stopLossPips: c.get('stopLossPips'),
              pipValuePerStandardLot: c.get('pipValuePerStandardLot'),
            }),
            a = (l) => L(o, l, 4),
            d = [
              [e.fields.riskAmount, a(i.riskAmount)],
              [e.fields.lossPerLot, a(i.lossPerStandardLot)],
              [e.fields.standardLots, a(i.standardLots)],
              [e.fields.microLots, a(i.microLots)],
              [e.fields.units, a(i.units)],
            ];
          (w(r, d),
            (n = d.map(([l, p]) => `${l}: ${p}`).join(`
`)),
            m(r, e.messages.calculated, 'success'));
        } catch {
          ((n = ''), m(r, e.messages.checkInputs, 'error'));
        }
      },
      e = b(r),
      t = r.querySelector('#tool-form'),
      o = document.documentElement.lang || 'en',
      n = '';
    (t.addEventListener('submit', s),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          ((n = ''), y(r), m(r, ''));
        }, 0),
      ),
      r.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        n && S(r, n, e);
      }),
      r.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        for (let [u, c] of Object.entries({
          accountBalance: '10000',
          riskPercent: '1',
          stopLossPips: '10',
          pipValuePerStandardLot: '10',
        }))
          t.elements.namedItem(u).value = c;
        (s(), m(r, e.messages.exampleLoaded, 'success'));
      }));
  }
})();
