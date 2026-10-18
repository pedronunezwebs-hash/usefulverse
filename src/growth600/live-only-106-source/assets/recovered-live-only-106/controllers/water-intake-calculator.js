(() => {
  var f = 236.5882365,
    $ = 29.5735295625,
    m = 2e4;
  function R(t, r) {
    let e = typeof t == 'string' && t.trim() === '' ? NaN : Number(t);
    if (!Number.isFinite(e) || e < 0 || e > m) throw new RangeError(`${r} must be from 0 to ${m}.`);
    return e;
  }
  function E(t, r, e) {
    let s = R(t, e),
      i = { ml: 1, l: 1e3, cup: f, floz: $ }[r];
    if (!i) throw new RangeError('Choose a supported volume unit.');
    let n = s * i;
    if (!Number.isFinite(n) || n > m)
      throw new RangeError(`${e} exceeds the supported daily volume.`);
    return n;
  }
  function y(t) {
    let r = t.referenceGroup,
      e = { women: 2.7, men: 3.7 }[r];
    if (!e) throw new RangeError('Choose a supported adult reference group.');
    let s = t.unit,
      i = E(t.beverages, s, 'Beverages'),
      n =
        t.foodWater == null || (typeof t.foodWater == 'string' && t.foodWater.trim() === '')
          ? 0
          : E(t.foodWater, s, 'Food water'),
      o = i + n;
    if (o > m) throw new RangeError('The combined daily volume exceeds the supported range.');
    let u = e * 1e3;
    return Object.freeze({
      referenceGroup: r,
      referenceLiters: e,
      referenceMl: u,
      referenceCups: u / f,
      beverageLiters: i / 1e3,
      foodWaterLiters: n / 1e3,
      totalLiters: o / 1e3,
      totalCups: o / f,
      percentOfReference: (o / u) * 100,
      unit: s,
    });
  }
  var F = Object.freeze({ maxFieldUnits: 100, maxCombinedMilliliters: m, usCupMilliliters: f });
  var q = Object.freeze({
    'A+': 4,
    A: 4,
    'A-': 3.7,
    'B+': 3.3,
    B: 3,
    'B-': 2.7,
    'C+': 2.3,
    C: 2,
    'C-': 1.7,
    'D+': 1.3,
    D: 1,
    'D-': 0.7,
    F: 0,
  });
  function p(t, r = 'en') {
    let e = String(t)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (o) => String(o.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (o) => String(o.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (o) => String(o.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (o) => String(o.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let s = new Intl.NumberFormat(r).formatToParts(12345.6),
      i = s.find((o) => o.type === 'decimal')?.value ?? '.',
      n = s.find((o) => o.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      i === ','
        ? e.includes(',')
          ? (e = e.replaceAll(n, '').replace(',', '.'))
          : n === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : i === '.'
          ? e.includes('.')
            ? ((n === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (n !== ',' && e.includes(n))) &&
              (e = e.replaceAll(n, ''))
            : e.includes(n) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(n, '')
                  : e.replace(n, '.'))
          : e.includes(i) && (e = e.replaceAll(n, '').replace(i, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var A = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function C(t = document) {
    let r = t.querySelector('[data-tool-copy]');
    if (!r) throw new Error('Localized tool copy is missing.');
    return JSON.parse(r.textContent);
  }
  function c(t, r, e = 'info') {
    let s = t.querySelector('[data-status]');
    s && ((s.textContent = r), (s.dataset.kind = e));
  }
  function S(t) {
    let r = t.querySelector('[data-result]'),
      e = t.querySelector('[data-result-content]');
    (r && (r.hidden = !0), e && e.replaceChildren());
  }
  function N(t, r, e = 2) {
    return new Intl.NumberFormat(t, { maximumFractionDigits: e }).format(r);
  }
  async function v(t, r, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(r), c(t, e.messages.copied, 'success'));
    } catch {
      c(t, e.messages.copyUnavailable, 'error');
    }
  }
  var a = document.querySelector('[data-tool="water-intake-calculator"]');
  if (a) {
    let o = function () {
        (S(a), (e.hidden = !0));
        for (let d of a.querySelectorAll(
          '[data-water-reference], [data-water-reference-cups], [data-water-total], [data-water-total-cups], [data-water-percent]',
        ))
          d.textContent = '';
        n = '';
      },
      u = function (d) {
        (d?.preventDefault(), o());
        try {
          let l = y({
              referenceGroup: t.elements.namedItem('referenceGroup').value,
              beverages: p(t.elements.namedItem('beverages').value, s()),
              foodWater:
                t.elements.namedItem('foodWater').value.trim() === ''
                  ? null
                  : p(t.elements.namedItem('foodWater').value, s()),
              unit: t.elements.namedItem('unit').value,
            }),
            h = `${i(l.referenceLiters)} L`,
            g = `${i(l.referenceCups, 1)} ${r.fields.usCups}`,
            w = `${i(l.totalLiters)} L`,
            b = `${i(l.totalCups, 1)} ${r.fields.usCups}`,
            x = `${i(l.percentOfReference, 1)}%`;
          ((a.querySelector('[data-water-reference]').textContent = h),
            (a.querySelector('[data-water-reference-cups]').textContent = g),
            (a.querySelector('[data-water-total]').textContent = w),
            (a.querySelector('[data-water-total-cups]').textContent = b),
            (a.querySelector('[data-water-percent]').textContent = x),
            (n = `${r.fields.resultSummary}
${r.fields.totalWaterReference}: ${h} (${g})
${r.fields.enteredTotal}: ${w} (${b})
${r.fields.percentOfReference}: ${x}`),
            (e.hidden = !1),
            c(a, r.messages.calculated, 'success'));
        } catch {
          c(a, r.messages.checkInputs, 'error');
        }
      },
      t = a.querySelector('#tool-form'),
      r = C(a),
      e = a.querySelector('[data-water-results]'),
      s = () => document.documentElement.lang || 'en',
      i = (d, l = 2) => N(s(), d, l),
      n = '';
    (t.addEventListener('input', () => {
      (o(), c(a, ''));
    }),
      t.addEventListener('change', () => {
        (o(), c(a, ''));
      }),
      t.addEventListener('submit', u),
      t.addEventListener('reset', () =>
        queueMicrotask(() => {
          (o(), c(a, ''));
        }),
      ),
      a.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('referenceGroup').value = 'women'),
          (t.elements.namedItem('beverages').value = '2.2'),
          (t.elements.namedItem('foodWater').value = '0.5'),
          (t.elements.namedItem('unit').value = 'l'),
          u(),
          c(a, r.messages.exampleLoaded, 'success'));
      }),
      a.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        n && v(a, n, r);
      }));
  }
})();
