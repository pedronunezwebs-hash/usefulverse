(() => {
  function p(e, t, { min: n = -1e9, max: a = 1e9 } = {}) {
    let i = typeof e == 'string' && e.trim() === '' ? NaN : Number(e);
    if (!Number.isFinite(i) || i < n || i > a)
      throw Object.assign(new RangeError(`${t} is outside the supported range.`), {
        code: 'inputRange',
      });
    return i;
  }
  function A(e) {
    let t = [
      676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406,
      12.507343278686905, -0.13857109526572012, 9984369578019572e-21, 15056327351493116e-23,
    ];
    if (e < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * e)) - A(1 - e);
    let n = e - 1,
      a = 0.9999999999998099;
    for (let s = 0; s < t.length; s += 1) a += t[s] / (n + s + 1);
    let i = n + t.length - 0.5;
    return 0.9189385332046727 + (n + 0.5) * Math.log(i) - i + Math.log(a);
  }
  function w({ mean1: e, sd1: t, n1: n, mean2: a, sd2: i, n2: s }) {
    let m = p(e, 'Group 1 mean'),
      g = p(a, 'Group 2 mean'),
      l = p(t, 'Group 1 standard deviation', { min: 0, max: 1e9 }),
      h = p(i, 'Group 2 standard deviation', { min: 0, max: 1e9 }),
      d = p(n, 'Group 1 sample size', { min: 2, max: 1e6 }),
      o = p(s, 'Group 2 sample size', { min: 2, max: 1e6 });
    if (![d, o].every(Number.isSafeInteger))
      throw Object.assign(new RangeError('Sample sizes must be whole numbers.'), {
        code: 'sampleSize',
      });
    if (l === 0 && h === 0)
      throw Object.assign(
        new RangeError('At least one group must have a non-zero standard deviation.'),
        { code: 'zeroVariance' },
      );
    let r = d + o - 2,
      f = ((d - 1) * l ** 2 + (o - 1) * h ** 2) / r,
      S = Math.sqrt(f),
      x = m - g,
      y = x / S,
      b = Math.exp(A(r / 2) - 0.5 * Math.log(r / 2) - A((r - 1) / 2)),
      E = b * y;
    if (![S, y, b, E].every(Number.isFinite))
      throw Object.assign(new RangeError('The result exceeds the supported numeric range.'), {
        code: 'resultRange',
      });
    return Object.freeze({
      meanDifference: x,
      degreesOfFreedom: r,
      pooledSd: S,
      cohensD: y,
      hedgesG: E,
      correctionJ: b,
      direction: x === 0 ? 'equal' : x > 0 ? 'group1-higher' : 'group2-higher',
    });
  }
  var q = Object.freeze({ maxAbsValue: 1e9, minSampleSize: 2, maxSampleSize: 1e6 });
  function _(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function u(e, t, n = 'info') {
    let a = e.querySelector('[data-status]');
    a && ((a.textContent = t), (a.dataset.kind = n));
  }
  function v(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  function M(e, t, n = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
  }
  async function N(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), u(e, n.messages.copied, 'success'));
    } catch {
      u(e, n.messages.copyUnavailable, 'error');
    }
  }
  var c = document.querySelector('[data-tool="effect-size-calculator"]');
  if (c) {
    let g = function () {
        (v(c), (n.hidden = !0), a.replaceChildren(), (m = ''));
      },
      l = function (d, o) {
        let r = document.createElement('dt');
        r.textContent = d;
        let f = document.createElement('dd');
        ((f.textContent = o), a.append(r, f));
      },
      h = function (d) {
        (d?.preventDefault(), g(), u(c, ''));
        try {
          let o = new FormData(t),
            r = w({
              mean1: o.get('mean1'),
              sd1: o.get('sd1'),
              n1: o.get('n1'),
              mean2: o.get('mean2'),
              sd2: o.get('sd2'),
              n2: o.get('n2'),
            });
          (l(e.fields.meanDifference, s(r.meanDifference)),
            l(e.fields.pooledSd, s(r.pooledSd)),
            l(e.fields.degreesOfFreedom, s(r.degreesOfFreedom)),
            l(e.fields.cohensD, s(r.cohensD)),
            l(e.fields.hedgesG, s(r.hedgesG)),
            l(e.fields.correctionJ, s(r.correctionJ)),
            l(e.fields.direction, e.fields[r.direction]),
            (n.hidden = !1),
            (m = [...a.querySelectorAll('dt')].map(
              (f, S) => `${f.textContent}: ${a.querySelectorAll('dd')[S].textContent}`,
            ).join(`
`)),
            u(c, e.messages.calculated, 'success'));
        } catch (o) {
          u(c, e.messages[o?.code] ?? e.messages.checkInputs, 'error');
        }
      },
      e = _(c),
      t = c.querySelector('#tool-form'),
      n = c.querySelector('[data-effect-results]'),
      a = c.querySelector('[data-effect-values]'),
      i = e.copyLanguage === 'zh_tw' ? 'zh-TW' : e.copyLanguage,
      s = (d) => M(i, d, 6),
      m = '';
    (t.addEventListener('submit', h),
      t.addEventListener('input', () => {
        (g(), u(c, ''));
      }),
      c.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        for (let [d, o] of Object.entries({
          mean1: 105,
          sd1: 10,
          n1: 25,
          mean2: 100,
          sd2: 10,
          n2: 25,
        }))
          t.elements.namedItem(d).value = String(o);
        (h(), u(c, e.messages.exampleLoaded, 'success'));
      }),
      c.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        m && N(c, m, e);
      }),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          (g(), u(c, ''));
        }, 0),
      ));
  }
})();
