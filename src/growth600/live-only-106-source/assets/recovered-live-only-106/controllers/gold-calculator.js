(() => {
  var h = Object.freeze({ g: 1, kg: 1e3, oz: 28.349523125, ozt: 31.1034768 });
  function p(e, t, n, r) {
    let a = Number(e);
    if (!Number.isFinite(a) || a < n || a > r)
      throw new RangeError(`${t} must be between ${n} and ${r}.`);
    return a;
  }
  function b({
    weight: e,
    unit: t = 'g',
    purityPercent: n,
    karat: r,
    pricePerGram: a,
    adjustmentPercent: m = 0,
  }) {
    let c = p(e, 'Weight', Number.MIN_VALUE, 1e6);
    if (!Object.hasOwn(h, t)) throw new RangeError('Choose a supported weight unit.');
    let s =
        n === '' || n == null ? (p(r, 'Karat', 0.01, 24) / 24) * 100 : p(n, 'Purity', 0.01, 100),
      u = p(m, 'Adjustment', -100, 100),
      g = c * h[t],
      w = (g * s) / 100,
      i = {
        weight: c,
        unit: t,
        weightGrams: g,
        purityPercent: s,
        fineGoldGrams: w,
        adjustmentPercent: u,
      };
    if (a !== '' && a != null) {
      let f = p(a, 'Price per gram', 0, 1e6);
      ((i.pricePerGram = f),
        (i.metalValue = w * f),
        (i.adjustedValue = i.metalValue * (1 + u / 100)));
    }
    if (Object.values(i).some((f) => typeof f == 'number' && !Number.isFinite(f)))
      throw new RangeError('The result is outside the supported numeric range.');
    return i;
  }
  function v(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function l(e, t, n = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = t), (r.dataset.kind = n));
  }
  function y(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  function x(e, t) {
    let n = e.querySelector('[data-result]'),
      r = e.querySelector('[data-result-content]');
    if (!n || !r) return;
    let a = document.createElement('dl');
    for (let [m, c] of t) {
      let s = document.createElement('dt'),
        u = document.createElement('dd');
      ((s.textContent = m), (u.textContent = c), a.append(s, u));
    }
    (r.replaceChildren(a), (n.hidden = !1));
  }
  function d(e, t, n = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
  }
  async function E(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), l(e, n.messages.copied, 'success'));
    } catch {
      l(e, n.messages.copyUnavailable, 'error');
    }
  }
  var o = document.querySelector('[data-tool="gold-calculator"]');
  if (o) {
    let a = function (m) {
        (m?.preventDefault(), y(o));
        try {
          let c = new FormData(t),
            s = b({
              weight: c.get('weight'),
              unit: c.get('unit'),
              purityPercent: c.get('purityPercent') || null,
              karat: c.get('karat'),
              pricePerGram: c.get('pricePerGram') || null,
              adjustmentPercent: c.get('adjustmentPercent'),
            }),
            u = [
              [e.fields.weightGrams, `${d(n, s.weightGrams, 4)} g`],
              [e.fields.purityResult, `${d(n, s.purityPercent, 3)}%`],
              [e.fields.fineGold, `${d(n, s.fineGoldGrams, 4)} g`],
            ];
          (s.metalValue !== void 0
            ? (u.push([e.fields.metalValue, `${d(n, s.metalValue, 2)} USD`]),
              u.push([e.fields.adjustedValue, `${d(n, s.adjustedValue, 2)} USD`]))
            : u.push([e.fields.valueUnavailable, e.fields.enterPrice]),
            x(o, u),
            (r = u.map(([g, w]) => `${g}: ${w}`).join(`
`)),
            l(o, e.messages.calculated, 'success'));
        } catch {
          ((r = ''), l(o, e.messages.checkInputs, 'error'));
        }
      },
      e = v(o),
      t = o.querySelector('#tool-form'),
      n = document.documentElement.lang || 'en',
      r = '';
    (t.addEventListener('submit', a),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          ((r = ''), y(o), l(o, ''));
        }, 0),
      ),
      o.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('weight').value = '10'),
          (t.elements.namedItem('unit').value = 'g'),
          (t.elements.namedItem('karat').value = '18'),
          (t.elements.namedItem('purityPercent').value = ''),
          (t.elements.namedItem('pricePerGram').value = ''),
          (t.elements.namedItem('adjustmentPercent').value = '0'),
          a(),
          l(o, e.messages.exampleLoaded, 'success'));
      }),
      o.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        r && E(o, r, e);
      }));
  }
})();
