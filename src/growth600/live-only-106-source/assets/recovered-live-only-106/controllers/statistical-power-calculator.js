(() => {
  var P = Object.freeze({
    nPerGroup: [2, 1e6],
    effectSize: [0.01, 5],
    alpha: [0.001, 0.2],
    targetPower: [0.5, 0.99],
    attritionPercent: [0, 80],
  });
  function y(e, t, [r, o]) {
    let a = typeof e == 'string' && e.trim() === '' ? NaN : Number(e);
    if (!Number.isFinite(a) || a < r || a > o)
      throw Object.assign(new RangeError(`${t} must be from ${r} to ${o}.`), { code: `${t}Range` });
    return a;
  }
  function v(e) {
    if (!(e > 0 && e < 1)) throw new RangeError('Probability must be between zero and one.');
    let t = [
        -39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472,
        2.50662827745924,
      ],
      r = [
        -54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857,
      ],
      o = [
        -0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373,
        4.37466414146497, 2.93816398269878,
      ],
      a = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742],
      s = 0.02425,
      g = 1 - s;
    if (e < s || e > g) {
      let l = Math.sqrt(-2 * Math.log(e < s ? e : 1 - e)),
        f =
          (((((o[0] * l + o[1]) * l + o[2]) * l + o[3]) * l + o[4]) * l + o[5]) /
          ((((a[0] * l + a[1]) * l + a[2]) * l + a[3]) * l + 1);
      return e < s ? f : -f;
    }
    let m = e - 0.5,
      n = m * m;
    return (
      ((((((t[0] * n + t[1]) * n + t[2]) * n + t[3]) * n + t[4]) * n + t[5]) * m) /
      (((((r[0] * n + r[1]) * n + r[2]) * n + r[3]) * n + r[4]) * n + 1)
    );
  }
  function x(e) {
    let t = e < 0 ? -1 : 1,
      r = Math.abs(e) / Math.SQRT2,
      o = 1 / (1 + 0.3275911 * r),
      a =
        1 -
        ((((1.061405429 * o - 1.453152027) * o + 1.421413741) * o - 0.284496736) * o +
          0.254829592) *
          o *
          Math.exp(-r * r);
    return Math.max(0, Math.min(1, 0.5 * (1 + t * a)));
  }
  function G({ nPerGroup: e, effectSize: t, alpha: r, alternative: o }) {
    let a = v(o === 'two-sided' ? 1 - r / 2 : 1 - r),
      s = t * Math.sqrt(e / 2);
    return Math.max(0, Math.min(1, o === 'two-sided' ? x(-a - s) + 1 - x(a - s) : 1 - x(a - s)));
  }
  function R({
    mode: e = 'power',
    nPerGroup: t,
    effectSize: r,
    alpha: o = 0.05,
    targetPower: a = 0.8,
    alternative: s = 'two-sided',
    attritionPercent: g = 0,
  }) {
    if (!['power', 'sample-size'].includes(e))
      throw Object.assign(new RangeError('Choose power or sample-size mode.'), { code: 'mode' });
    if (!['two-sided', 'one-sided'].includes(s))
      throw Object.assign(new RangeError('Choose a supported alternative.'), {
        code: 'alternative',
      });
    let m = y(r, 'effectSize', P.effectSize),
      n = y(o, 'alpha', P.alpha),
      l = y(g, 'attritionPercent', P.attritionPercent);
    if (e === 'power') {
      let w = y(t, 'nPerGroup', P.nPerGroup);
      if (!Number.isInteger(w))
        throw Object.assign(new RangeError('Sample size per group must be a whole number.'), {
          code: 'sampleSizeInteger',
        });
      return Object.freeze({
        mode: e,
        alternative: s,
        effectSize: m,
        alpha: n,
        nPerGroup: w,
        totalAnalyzed: 2 * w,
        power: G({ nPerGroup: w, effectSize: m, alpha: n, alternative: s }),
        attritionPercent: 0,
        recruitedPerGroup: w,
        totalRecruitment: 2 * w,
      });
    }
    let f = y(a, 'targetPower', P.targetPower),
      h = v(s === 'two-sided' ? 1 - n / 2 : 1 - n),
      b = v(f),
      u = Math.ceil((2 * (h + b) ** 2) / m ** 2);
    if (u > P.nPerGroup[1])
      throw Object.assign(new RangeError('The required sample exceeds the calculator limit.'), {
        code: 'sampleSizeTooLarge',
      });
    let i = Math.ceil(u / (1 - l / 100));
    return Object.freeze({
      mode: e,
      alternative: s,
      effectSize: m,
      alpha: n,
      targetPower: f,
      nPerGroup: u,
      totalAnalyzed: 2 * u,
      power: G({ nPerGroup: u, effectSize: m, alpha: n, alternative: s }),
      attritionPercent: l,
      recruitedPerGroup: i,
      totalRecruitment: 2 * i,
    });
  }
  function C(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function p(e, t, r = 'info') {
    let o = e.querySelector('[data-status]');
    o && ((o.textContent = t), (o.dataset.kind = r));
  }
  function T(e) {
    let t = e.querySelector('[data-result]'),
      r = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), r && r.replaceChildren());
  }
  function M(e, t, r = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: r }).format(t);
  }
  async function A(e, t, r) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), p(e, r.messages.copied, 'success'));
    } catch {
      p(e, r.messages.copyUnavailable, 'error');
    }
  }
  var c = document.querySelector('[data-tool="statistical-power-calculator"]');
  if (c) {
    let f = function () {
        (T(c), (r.hidden = !0), (o.textContent = ''), a.replaceChildren(), (l = ''));
      },
      h = function () {
        let u = t.elements.namedItem('mode').value === 'sample-size';
        ((s.hidden = !u),
          (g.hidden = u),
          s.querySelectorAll('input').forEach((i) => {
            i.disabled = !u;
          }),
          g.querySelectorAll('input').forEach((i) => {
            i.disabled = u;
          }));
      },
      b = function (u) {
        (u?.preventDefault(), f(), p(c, ''));
        try {
          let i = new FormData(t),
            w = i.get('mode'),
            d = R({
              mode: w,
              nPerGroup: i.get('nPerGroup'),
              effectSize: i.get('effectSize'),
              alpha: Number(i.get('alphaPercent')) / 100,
              targetPower: Number(i.get('targetPowerPercent')) / 100,
              alternative: i.get('alternative'),
              attritionPercent: i.get('attritionPercent') || 0,
            }),
            q =
              w === 'sample-size'
                ? [
                    [e.fields.nPerGroupResult, n(d.nPerGroup)],
                    [e.fields.totalAnalyzed, n(d.totalAnalyzed)],
                    [e.fields.estimatedPower, `${n(d.power * 100, 1)}%`],
                    [e.fields.targetPower, `${n(d.targetPower * 100, 1)}%`],
                    [e.fields.recruitedPerGroup, n(d.recruitedPerGroup)],
                    [e.fields.totalRecruitment, n(d.totalRecruitment)],
                  ]
                : [
                    [e.fields.nPerGroupResult, n(d.nPerGroup)],
                    [e.fields.totalAnalyzed, n(d.totalAnalyzed)],
                    [e.fields.estimatedPower, `${n(d.power * 100, 1)}%`],
                  ];
          o.textContent = `${e.fields.effectSize}: ${n(d.effectSize, 2)}; \u03B1: ${n(d.alpha * 100, 2)}%; ${d.alternative === 'two-sided' ? e.fields.twoSided : e.fields.oneSided}`;
          for (let [S, z] of q) {
            let E = document.createElement('dt');
            E.textContent = S;
            let I = document.createElement('dd');
            ((I.textContent = z), a.append(E, I));
          }
          ((r.hidden = !1),
            (l = [o.textContent, ...q.map(([S, z]) => `${S}: ${z}`)].join(`
`)),
            p(c, e.messages.calculated, 'success'));
        } catch (i) {
          p(c, e.messages[i?.code] ?? e.messages.checkInputs, 'error');
        }
      },
      e = C(c),
      t = c.querySelector('#tool-form'),
      r = c.querySelector('[data-stat-results]'),
      o = c.querySelector('[data-stat-summary]'),
      a = c.querySelector('[data-stat-values]'),
      s = c.querySelector('[data-stat-sample-size]'),
      g = c.querySelector('[data-stat-power]'),
      m = e.copyLanguage === 'zh_tw' ? 'zh-TW' : e.copyLanguage,
      n = (u, i = 0) => M(m, u, i),
      l = '';
    (t.addEventListener('submit', b),
      t.elements.namedItem('mode').addEventListener('change', () => {
        (h(), f(), p(c, ''));
      }),
      t.addEventListener('input', () => {
        (f(), p(c, ''));
      }),
      c.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('mode').value = 'sample-size'),
          (t.elements.namedItem('targetPowerPercent').value = '80'),
          (t.elements.namedItem('attritionPercent').value = '0'),
          (t.elements.namedItem('effectSize').value = '0.5'),
          (t.elements.namedItem('alphaPercent').value = '5'),
          (t.elements.namedItem('alternative').value = 'two-sided'),
          h(),
          b(),
          p(c, e.messages.exampleLoaded, 'success'));
      }),
      c.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        l && A(c, l, e);
      }),
      t.addEventListener('reset', () => {
        setTimeout(() => {
          (h(), f(), p(c, ''));
        }, 0);
      }),
      h());
  }
})();
