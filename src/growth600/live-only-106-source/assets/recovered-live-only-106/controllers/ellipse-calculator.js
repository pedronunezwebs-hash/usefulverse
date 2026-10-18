(() => {
  function g(e, t) {
    let n = typeof e == 'string' && e.trim() === '' ? NaN : Number(e);
    if (!Number.isFinite(n) || n <= 0 || n > 1e9)
      throw Object.assign(new RangeError(`${t} must be positive and no greater than 1000000000.`), {
        code: 'axisRange',
      });
    return n;
  }
  function h({ semiAxisA: e, semiAxisB: t }) {
    let n = g(e, 'Semiaxis a'),
      o = g(t, 'Semiaxis b'),
      a = Math.max(n, o),
      s = Math.min(n, o),
      l = Math.sqrt(Math.max(0, a ** 2 - s ** 2)),
      d = l / a,
      x = Math.PI * a * s,
      m = ((a - s) / (a + s)) ** 2,
      u = Math.PI * (a + s) * (1 + (3 * m) / (10 + Math.sqrt(4 - 3 * m)));
    if (![l, d, x, u].every(Number.isFinite))
      throw Object.assign(new RangeError('The result exceeds the supported numeric range.'), {
        code: 'resultRange',
      });
    return Object.freeze({
      inputA: n,
      inputB: o,
      semiMajor: a,
      semiMinor: s,
      focusDistance: l,
      eccentricity: d,
      area: x,
      perimeterApproximation: u,
      h: m,
    });
  }
  var v = Object.freeze({ maxSemiaxis: 1e9 });
  function S(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function c(e, t, n = 'info') {
    let o = e.querySelector('[data-status]');
    o && ((o.textContent = t), (o.dataset.kind = n));
  }
  function b(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  function A(e, t, n = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
  }
  async function E(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), c(e, n.messages.copied, 'success'));
    } catch {
      c(e, n.messages.copyUnavailable, 'error');
    }
  }
  var r = document.querySelector('[data-tool="ellipse-calculator"]');
  if (r) {
    let d = function () {
        (b(r), (n.hidden = !0), o.replaceChildren(), (l = ''));
      },
      x = function (u, p) {
        let i = document.createElement('dt');
        i.textContent = u;
        let f = document.createElement('dd');
        ((f.textContent = p), o.append(i, f));
      },
      m = function (u) {
        (u?.preventDefault(), d(), c(r, ''));
        try {
          let p = new FormData(t),
            i = h({ semiAxisA: p.get('semiAxisA'), semiAxisB: p.get('semiAxisB') });
          for (let [f, y] of [
            ['semiMajor', i.semiMajor],
            ['semiMinor', i.semiMinor],
            ['area', i.area],
            ['focusDistance', i.focusDistance],
            ['eccentricity', i.eccentricity],
            ['perimeterApproximation', i.perimeterApproximation],
          ])
            x(e.fields[f], s(y));
          ((n.hidden = !1),
            (l = [...o.querySelectorAll('dt')].map(
              (f, y) => `${f.textContent}: ${o.querySelectorAll('dd')[y].textContent}`,
            ).join(`
`)),
            c(r, e.messages.calculated, 'success'));
        } catch (p) {
          c(r, e.messages[p?.code] ?? e.messages.checkInputs, 'error');
        }
      },
      e = S(r),
      t = r.querySelector('#tool-form'),
      n = r.querySelector('[data-ellipse-results]'),
      o = r.querySelector('[data-ellipse-values]'),
      a = e.copyLanguage === 'zh_tw' ? 'zh-TW' : e.copyLanguage,
      s = (u) => A(a, u, 8),
      l = '';
    (t.addEventListener('submit', m),
      t.addEventListener('input', () => {
        (d(), c(r, ''));
      }),
      r.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('semiAxisA').value = '3'),
          (t.elements.namedItem('semiAxisB').value = '2'),
          m(),
          c(r, e.messages.exampleLoaded, 'success'));
      }),
      r.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        l && E(r, l, e);
      }),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          (d(), c(r, ''));
        }, 0),
      ));
  }
})();
