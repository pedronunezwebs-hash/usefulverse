(() => {
  function f(e, t, { min: n = 0, max: r = 1e12 } = {}) {
    let o = typeof e == 'string' && e.trim() === '' ? NaN : Number(e);
    if (!Number.isFinite(o) || o < n || o > r)
      throw new RangeError(`${t} is outside the supported range.`);
    return o;
  }
  function w(e) {
    let t = e.mode;
    if (!['cpm', 'spend', 'impressions'].includes(t))
      throw new TypeError('Choose a supported calculation mode.');
    let n, r, o;
    if (
      (t === 'cpm'
        ? ((n = f(e.spend, 'Spend', { max: 1e9 })),
          (r = f(e.impressions, 'Impressions', { min: 1, max: 1e12 })),
          (o = (n / r) * 1e3))
        : t === 'spend'
          ? ((r = f(e.impressions, 'Impressions', { min: 1, max: 1e12 })),
            (o = f(e.cpm, 'CPM', { max: 1e9 })),
            (n = (r / 1e3) * o))
          : ((n = f(e.spend, 'Spend', { max: 1e9 })),
            (o = f(e.cpm, 'CPM', { min: Number.MIN_VALUE, max: 1e9 })),
            (r = (n / o) * 1e3)),
      ![n, r, o].every(Number.isFinite))
    )
      throw new RangeError('The result is outside the supported range.');
    return Object.freeze({
      mode: t,
      spend: n,
      impressions: r,
      cpm: o,
      formula: 'spend \xF7 impressions \xD7 1,000',
    });
  }
  var N = Object.freeze({ maxSpend: 1e9, maxImpressions: 1e12, maxCpm: 1e9 });
  function g(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function l(e, t, n = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = t), (r.dataset.kind = n));
  }
  function h(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  function E(e, t) {
    let n = e.querySelector('[data-result]'),
      r = e.querySelector('[data-result-content]');
    if (!n || !r) return;
    let o = document.createElement('dl');
    for (let [u, c] of t) {
      let a = document.createElement('dt'),
        i = document.createElement('dd');
      ((a.textContent = u), (i.textContent = c), o.append(a, i));
    }
    (r.replaceChildren(o), (n.hidden = !1));
  }
  function I(e, t, { optional: n = !1, min: r = -1 / 0, max: o = 1 / 0, integer: u = !1 } = {}) {
    let c = e.elements.namedItem(t),
      a = c?.value?.trim() ?? '';
    if (n && a === '') return null;
    let i = Number(a);
    if (a === '' || !Number.isFinite(i) || i < r || i > o || (u && !Number.isInteger(i)))
      throw (c?.setAttribute('aria-invalid', 'true'), c?.focus(), new RangeError());
    return (c.removeAttribute('aria-invalid'), i);
  }
  function S(e, t, n = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
  }
  async function C(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), l(e, n.messages.copied, 'success'));
    } catch {
      l(e, n.messages.copyUnavailable, 'error');
    }
  }
  var s = document.querySelector('[data-tool="cpm-calculator"]');
  if (s) {
    let a = function () {
        let _ =
          r.value === 'cpm'
            ? ['spend', 'impressions']
            : r.value === 'spend'
              ? ['impressions', 'cpm']
              : ['spend', 'cpm'];
        for (let p of ['spend', 'impressions', 'cpm']) {
          let d = e.elements.namedItem(p),
            m = _.includes(p);
          ((d.disabled = !m),
            (d.required = m),
            (d.closest('.field').hidden = !m),
            m || d.removeAttribute('aria-invalid'));
        }
      },
      i = function () {
        (h(s), (c = ''));
      },
      b = function (_) {
        (_?.preventDefault(), i());
        try {
          let p = r.value,
            d = (x, y) => I(e, x, { min: 0, max: y }),
            m = w({
              mode: p,
              ...(p !== 'spend' ? { spend: d('spend', 1e9) } : {}),
              ...(p !== 'impressions' ? { impressions: d('impressions', 1e12) } : {}),
              ...(p !== 'cpm' ? { cpm: d('cpm', 1e9) } : {}),
            }),
            v = [
              [n.spend, u(m.spend)],
              [n.impressions, u(m.impressions)],
              [n.cpm, u(m.cpm)],
              [n.formula, m.formula],
            ];
          (E(s, v),
            (c = `${t.fields.resultSummary}
${v.map(([x, y]) => `${x}: ${y}`).join(`
`)}`),
            l(s, t.messages.calculated, 'success'));
        } catch {
          l(s, t.messages.checkInputs, 'error');
        }
      },
      e = s.querySelector('#tool-form'),
      t = g(s),
      n = t.fields,
      r = e.elements.namedItem('mode'),
      o = () => document.documentElement.lang || 'en',
      u = (_) => S(o(), _, 2),
      c = '';
    (r.addEventListener('change', () => {
      (a(), i(), l(s, ''));
    }),
      e.addEventListener('input', () => {
        (i(), l(s, ''));
      }),
      e.addEventListener('submit', b),
      e.addEventListener('reset', () =>
        queueMicrotask(() => {
          (a(), i(), l(s, ''));
        }),
      ),
      s.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((r.value = 'cpm'),
          (e.elements.namedItem('spend').value = '10'),
          (e.elements.namedItem('impressions').value = '1000'),
          a(),
          b(),
          l(s, t.messages.exampleLoaded, 'success'));
      }),
      s.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        c && C(s, c, t);
      }),
      a());
  }
})();
