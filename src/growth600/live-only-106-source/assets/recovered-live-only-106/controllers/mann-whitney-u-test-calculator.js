(() => {
  function A(e, o) {
    if (typeof e != 'string')
      throw Object.assign(new TypeError(`${o} must be text.`), { code: 'sampleFormat' });
    let t = e
      .trim()
      .split(/[,;\s]+/u)
      .filter(Boolean);
    if (t.length < 2 || t.length > 500)
      throw Object.assign(new RangeError(`${o} must contain 2 to 500 numeric observations.`), {
        code: 'sampleSize',
      });
    let l = t.map((r) => Number(r));
    if (l.some((r) => !Number.isFinite(r) || Math.abs(r) > 1e12))
      throw Object.assign(new RangeError(`${o} values must be finite and within \xB1${1e12}.`), {
        code: 'valueRange',
      });
    return l;
  }
  function k(e, o) {
    let t = [
        ...e.map((n, a) => ({ value: n, group: 1, index: a })),
        ...o.map((n, a) => ({ value: n, group: 2, index: a })),
      ].sort((n, a) => n.value - a.value),
      l = [[], []],
      r = [];
    for (let n = 0; n < t.length;) {
      let a = n + 1;
      for (; a < t.length && t[a].value === t[n].value;) a += 1;
      let f = (n + 1 + a) / 2;
      for (let s = n; s < a; s += 1) l[t[s].group - 1][t[s].index] = f;
      (a - n > 1 && r.push(a - n), (n = a));
    }
    return { ranks: l, tieSizes: r, rows: t };
  }
  function L(e, o, t) {
    let l = e + o,
      r = Math.min(e, o),
      n = (r * (2 * l - r + 1)) / 2,
      a = Array.from({ length: r + 1 }, () => Array(n + 1).fill(0n));
    a[0][0] = 1n;
    for (let c = 1; c <= l; c += 1) {
      let i = Math.min(c, r);
      for (let m = i; m >= 1; m -= 1) for (let g = n; g >= c; g -= 1) a[m][g] += a[m - 1][g - c];
    }
    let f = (r * (r + 1)) / 2,
      s = a[r],
      p = 0n,
      d = 0n;
    for (let c = f; c < s.length; c += 1) {
      let i = s[c];
      if (!i) continue;
      ((p += i), c - f <= t + 1e-12 && (d += i));
    }
    if (p === 0n) throw new Error('Exact rank distribution could not be constructed.');
    return Math.min(1, Number((2n * d * 1000000000000n) / p) / 1e12);
  }
  function N(e) {
    let o = Math.abs(e),
      t = 1 / (1 + 0.2316419 * o),
      r =
        0.3989422804014327 *
        Math.exp(-0.5 * o * o) *
        t *
        (0.31938153 +
          t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return e >= 0 ? 1 - r : r;
  }
  function v({ sample1: e, sample2: o }) {
    let t = A(e, 'Sample 1'),
      l = A(o, 'Sample 2'),
      r = t.length,
      n = l.length,
      a = r + n,
      { ranks: f, tieSizes: s } = k(t, l),
      p = f[0].reduce((y, x) => y + x, 0),
      d = p - (r * (r + 1)) / 2,
      c = r * n - d,
      i = Math.min(d, c),
      m = (r * n) / 2,
      g = s.reduce((y, x) => y + x ** 3 - x, 0),
      _ = ((r * n) / 12) * (a + 1 - g / (a * (a - 1))),
      S = (2 * d) / (r * n) - 1,
      b,
      w;
    if (_ === 0) ((b = 1), (w = 'Degenerate all-ties case; no rank variation'));
    else if (s.length === 0 && a <= 40)
      ((b = L(r, n, i)), (w = 'Exact two-sided permutation distribution (no tied observations)'));
    else {
      let y = Math.abs(d - m);
      if (y === 0) b = 1;
      else {
        let x = Math.max(0, (y - 0.5) / Math.sqrt(_));
        b = Math.min(1, Math.max(0, 2 * (1 - N(x))));
      }
      w = 'Two-sided normal approximation with tie correction and continuity correction';
    }
    return Object.freeze({
      n1: r,
      n2: n,
      total: a,
      rankSum1: p,
      u1: d,
      u2: c,
      minimumU: i,
      pValue: b,
      method: w,
      tieGroupCount: s.length,
      tiedObservationCount: s.reduce((y, x) => y + x, 0),
      rankBiserial: S,
      direction: S > 0 ? 'group1-higher' : S < 0 ? 'group2-higher' : 'no-rank-difference',
    });
  }
  var q = Object.freeze({
    minPerSample: 2,
    maxPerSample: 500,
    maxAbsoluteValue: 1e12,
    exactMaxTotal: 40,
  });
  function M(e = document) {
    let o = e.querySelector('[data-tool-copy]');
    if (!o) throw new Error('Localized tool copy is missing.');
    return JSON.parse(o.textContent);
  }
  function h(e, o, t = 'info') {
    let l = e.querySelector('[data-status]');
    l && ((l.textContent = o), (l.dataset.kind = t));
  }
  function E(e) {
    let o = e.querySelector('[data-result]'),
      t = e.querySelector('[data-result-content]');
    (o && (o.hidden = !0), t && t.replaceChildren());
  }
  function T(e, o, t = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: t }).format(o);
  }
  async function C(e, o, t) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(o), h(e, t.messages.copied, 'success'));
    } catch {
      h(e, t.messages.copyUnavailable, 'error');
    }
  }
  var u = document.querySelector('[data-tool="mann-whitney-u-test-calculator"]');
  if (u) {
    let f = function () {
        (E(u), (t.hidden = !0), l.replaceChildren(), (a = ''));
      },
      s = function (d, c) {
        let i = document.createElement('dt');
        i.textContent = d;
        let m = document.createElement('dd');
        ((m.textContent = c), l.append(i, m));
      },
      p = function (d) {
        (d?.preventDefault(), f(), h(u, ''));
        try {
          let c = new FormData(o),
            i = v({ sample1: c.get('sample1'), sample2: c.get('sample2') });
          (s(e.fields.sampleSize1, n(i.n1, 0)),
            s(e.fields.sampleSize2, n(i.n2, 0)),
            s(e.fields.rankSum1, n(i.rankSum1)),
            s(e.fields.u1, n(i.u1)),
            s(e.fields.u2, n(i.u2)),
            s(e.fields.pValue, n(i.pValue, 8)),
            s(e.fields.rankBiserial, n(i.rankBiserial)),
            s(e.fields.direction, e.fields[i.direction]),
            s(
              e.fields.tieSummary,
              `${n(i.tiedObservationCount, 0)} \xB7 ${e.fields.tieGroups}: ${n(i.tieGroupCount, 0)}`,
            ),
            s(e.fields.method, i.method),
            (t.hidden = !1),
            (a = [...l.querySelectorAll('dt')].map(
              (m, g) => `${m.textContent}: ${l.querySelectorAll('dd')[g].textContent}`,
            ).join(`
`)),
            h(u, e.messages.calculated, 'success'));
        } catch (c) {
          h(u, e.messages[c?.code] ?? e.messages.checkInputs, 'error');
        }
      },
      e = M(u),
      o = u.querySelector('#tool-form'),
      t = u.querySelector('[data-mann-whitney-results]'),
      l = u.querySelector('[data-mann-whitney-values]'),
      r = e.copyLanguage === 'zh_tw' ? 'zh-TW' : e.copyLanguage,
      n = (d, c = 4) => T(r, d, c),
      a = '';
    (o.addEventListener('submit', p),
      o.addEventListener('input', () => {
        (f(), h(u, ''));
      }),
      u.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((o.elements.namedItem('sample1').value = '1, 2, 3'),
          (o.elements.namedItem('sample2').value = '4, 5, 6'),
          p(),
          h(u, e.messages.exampleLoaded, 'success'));
      }),
      u.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        a && C(u, a, e);
      }),
      o.addEventListener('reset', () =>
        setTimeout(() => {
          (f(), h(u, ''));
        }, 0),
      ));
  }
})();
