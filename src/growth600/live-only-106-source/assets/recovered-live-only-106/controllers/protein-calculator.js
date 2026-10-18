(() => {
  var F = 0.45359237;
  function y(t, r, e, c) {
    let a = typeof t == 'string' && t.trim() === '' ? NaN : Number(t);
    if (!Number.isFinite(a) || a < e || a > c)
      throw new RangeError(`${r} is outside the supported range.`);
    return a;
  }
  function E(t) {
    let r = t.weightUnit === 'lb' ? 'lb' : t.weightUnit === 'kg' ? 'kg' : null;
    if (!r) throw new RangeError('Choose kg or lb for body weight.');
    let e = y(t.bodyWeight, 'Body weight', r === 'kg' ? 20 : 44, r === 'kg' ? 500 : 1102),
      c = r === 'kg' ? e : e * F,
      a = y(t.gramsPerKg, 'Protein factor', 0.1, 2.5),
      o = y(t.mealsPerDay, 'Meals per day', 1, 12);
    if (!Number.isInteger(o)) throw new RangeError('Meals per day must be a whole number.');
    let s = t.currentIntakeGrams,
      l =
        s == null || (typeof s == 'string' && s.trim() === '')
          ? null
          : y(s, 'Current intake', 0, 1e3),
      u = c * a;
    if (!Number.isFinite(u)) throw new RangeError('The result exceeds the supported range.');
    return Object.freeze({
      weightUnit: r,
      bodyWeight: e,
      weightKg: c,
      gramsPerKg: a,
      mealsPerDay: o,
      dailyGrams: u,
      gramsPerMeal: u / o,
      currentIntakeGrams: l,
      differenceGrams: l === null ? null : u - l,
    });
  }
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
  function g(t, r = 'en') {
    let e = String(t)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (s) => String(s.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (s) => String(s.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (s) => String(s.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (s) => String(s.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let c = new Intl.NumberFormat(r).formatToParts(12345.6),
      a = c.find((s) => s.type === 'decimal')?.value ?? '.',
      o = c.find((s) => s.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      a === ','
        ? e.includes(',')
          ? (e = e.replaceAll(o, '').replace(',', '.'))
          : o === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : a === '.'
          ? e.includes('.')
            ? ((o === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (o !== ',' && e.includes(o))) &&
              (e = e.replaceAll(o, ''))
            : e.includes(o) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(o, '')
                  : e.replace(o, '.'))
          : e.includes(a) && (e = e.replaceAll(o, '').replace(a, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var I = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function S(t = document) {
    let r = t.querySelector('[data-tool-copy]');
    if (!r) throw new Error('Localized tool copy is missing.');
    return JSON.parse(r.textContent);
  }
  function m(t, r, e = 'info') {
    let c = t.querySelector('[data-status]');
    c && ((c.textContent = r), (c.dataset.kind = e));
  }
  function N(t) {
    let r = t.querySelector('[data-result]'),
      e = t.querySelector('[data-result-content]');
    (r && (r.hidden = !0), e && e.replaceChildren());
  }
  function C(t, r, e = 2) {
    return new Intl.NumberFormat(t, { maximumFractionDigits: e }).format(r);
  }
  async function v(t, r, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(r), m(t, e.messages.copied, 'success'));
    } catch {
      m(t, e.messages.copyUnavailable, 'error');
    }
  }
  var n = document.querySelector('[data-tool="protein-calculator"]');
  if (n) {
    let p = function () {
        (N(n), (e.hidden = !0));
        for (let d of n.querySelectorAll(
          '[data-protein-daily], [data-protein-meal], [data-protein-factor], [data-protein-intake], [data-protein-difference]',
        ))
          d.textContent = '';
        ((n.querySelector('[data-protein-intake-row]').hidden = !0),
          (n.querySelector('[data-protein-difference-row]').hidden = !0),
          (u = ''));
      },
      w = function (d = !0) {
        let i = c.value,
          f = g(a.value, o()),
          h = a.dataset.unit || 'kg';
        if (d && Number.isFinite(f) && f > 0 && h !== i) {
          let b = h === 'kg' ? f / 0.45359237 : f * 0.45359237;
          a.value = b.toFixed(i === 'kg' ? 2 : 1);
        }
        ((a.min = i === 'kg' ? '20' : '44'),
          (a.max = i === 'kg' ? '500' : '1102'),
          (a.dataset.unit = i));
      },
      x = function (d) {
        (d?.preventDefault(), p());
        try {
          let i = E({
              bodyWeight: g(a.value, o()),
              weightUnit: c.value,
              gramsPerKg: g(t.elements.namedItem('gramsPerKg').value, o()),
              mealsPerDay: g(t.elements.namedItem('mealsPerDay').value, o()),
              currentIntakeGrams:
                t.elements.namedItem('currentIntakeGrams').value.trim() === ''
                  ? null
                  : g(t.elements.namedItem('currentIntakeGrams').value, o()),
            }),
            f = l(i.dailyGrams),
            h = l(i.gramsPerMeal),
            b = `${s(i.gramsPerKg, 2)} g/kg/day`;
          ((n.querySelector('[data-protein-daily]').textContent = f),
            (n.querySelector('[data-protein-meal]').textContent = h),
            (n.querySelector('[data-protein-factor]').textContent = b));
          let R = n.querySelector('[data-protein-intake-row]'),
            k = n.querySelector('[data-protein-difference-row]');
          (i.currentIntakeGrams !== null &&
            ((R.hidden = !1),
            (k.hidden = !1),
            (n.querySelector('[data-protein-intake]').textContent = l(i.currentIntakeGrams)),
            (n.querySelector('[data-protein-difference]').textContent = l(i.differenceGrams))),
            (u = `${r.fields.resultSummary}
${r.fields.dailyTarget}: ${f}
${r.fields.perMeal}: ${h}
${r.fields.selectedFactor}: ${b}`),
            i.currentIntakeGrams !== null &&
              (u += `
${r.fields.currentIntake}: ${l(i.currentIntakeGrams)}
${r.fields.difference}: ${l(i.differenceGrams)}`),
            (e.hidden = !1),
            m(n, r.messages.calculated, 'success'));
        } catch {
          m(n, r.messages.checkInputs, 'error');
        }
      },
      t = n.querySelector('#tool-form'),
      r = S(n),
      e = n.querySelector('[data-protein-results]'),
      c = t.elements.namedItem('weightUnit'),
      a = t.elements.namedItem('bodyWeight'),
      o = () => document.documentElement.lang || 'en',
      s = (d, i = 1) => C(o(), d, i),
      l = (d) => `${s(d, 1)} g`,
      u = '';
    (c.addEventListener('change', () => {
      (w(), p(), m(n, ''));
    }),
      t.addEventListener('input', () => {
        (p(), m(n, ''));
      }),
      t.addEventListener('submit', x),
      t.addEventListener('reset', () =>
        queueMicrotask(() => {
          (w(!1), p(), m(n, ''));
        }),
      ),
      n.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((c.value = 'kg'),
          (a.value = '70'),
          w(!1),
          (t.elements.namedItem('gramsPerKg').value = '1.2'),
          (t.elements.namedItem('mealsPerDay').value = '3'),
          (t.elements.namedItem('currentIntakeGrams').value = '80'),
          x(),
          m(n, r.messages.exampleLoaded, 'success'));
      }),
      n.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        u && v(n, u, r);
      }),
      w(!1));
  }
})();
