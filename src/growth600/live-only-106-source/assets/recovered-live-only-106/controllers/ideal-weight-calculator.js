(() => {
  var R = 0.39370078740157477,
    E = 0.45359237;
  function $(n, t, e, o) {
    let s = typeof n == 'string' && n.trim() === '' ? NaN : Number(n);
    if (!Number.isFinite(s) || s < e || s > o)
      throw new RangeError(`${t} must be between ${e} and ${o}.`);
    return s;
  }
  function S({ height: n, heightUnit: t = 'cm', equationSet: e }) {
    let o = t === 'cm' || t === 'in' ? t : null;
    if (!o) throw new RangeError('Choose cm or in for height.');
    if (e !== 'male' && e !== 'female') throw new RangeError('Choose a historical equation set.');
    let s = $(n, 'Height', o === 'cm' ? 120 : 47.24, o === 'cm' ? 230 : 90.55),
      i = o === 'cm' ? s : s * 2.54,
      r = i / 100,
      f = i * R,
      g = f - 60,
      b = Object.fromEntries(
        Object.entries(
          e === 'male'
            ? {
                devine: [50, 2.3],
                robinson: [51.65, 1.85],
                miller: [56.2, 1.41],
                hamwi: [106, 6, 'lb'],
              }
            : {
                devine: [45.5, 2.3],
                robinson: [48.67, 1.65],
                miller: [53.1, 1.36],
                hamwi: [100, 5, 'lb'],
              },
        ).map(([m, [l, c, h]]) => {
          let w = l + c * g,
            u = h === 'lb' ? w * E : w;
          return [
            m,
            Object.freeze({ kilograms: u, pounds: u / E, extrapolatedBelowFiveFeet: f < 60 }),
          ];
        }),
      );
    return Object.freeze({
      enteredHeight: s,
      heightUnit: o,
      heightCm: i,
      heightInches: f,
      equationSet: e,
      bmiReference: Object.freeze({
        minimumBmi: 18.5,
        maximumBmi: 24.9,
        minimumKg: 18.5 * r ** 2,
        maximumKg: 24.9 * r ** 2,
      }),
      formulas: Object.freeze(b),
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
  function x(n, t = 'en') {
    let e = String(n)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (r) => String(r.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (r) => String(r.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (r) => String(r.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (r) => String(r.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let o = new Intl.NumberFormat(t).formatToParts(12345.6),
      s = o.find((r) => r.type === 'decimal')?.value ?? '.',
      i = o.find((r) => r.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      s === ','
        ? e.includes(',')
          ? (e = e.replaceAll(i, '').replace(',', '.'))
          : i === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : s === '.'
          ? e.includes('.')
            ? ((i === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (i !== ',' && e.includes(i))) &&
              (e = e.replaceAll(i, ''))
            : e.includes(i) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(i, '')
                  : e.replace(i, '.'))
          : e.includes(s) && (e = e.replaceAll(i, '').replace(s, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var A = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function y(n = document) {
    let t = n.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function d(n, t, e = 'info') {
    let o = n.querySelector('[data-status]');
    o && ((o.textContent = t), (o.dataset.kind = e));
  }
  function C(n) {
    let t = n.querySelector('[data-result]'),
      e = n.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  function N(n, t, e = 2) {
    return new Intl.NumberFormat(n, { maximumFractionDigits: e }).format(t);
  }
  async function v(n, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), d(n, e.messages.copied, 'success'));
    } catch {
      d(n, e.messages.copyUnavailable, 'error');
    }
  }
  var a = document.querySelector('[data-tool="ideal-weight-calculator"]');
  if (a) {
    let g = function () {
        (C(a),
          (e.hidden = !0),
          a.querySelectorAll('[data-ideal-result]').forEach((m) => {
            m.textContent = '';
          }),
          (a.querySelector('[data-ideal-set]').textContent = ''),
          (a.querySelector('[data-ideal-extrapolation]').hidden = !0),
          (f = ''));
      },
      p = function (m = !0) {
        let l = o.dataset.unit || 'cm',
          c = s.value,
          h = x(o.value, i());
        (m &&
          Number.isFinite(h) &&
          l !== c &&
          (o.value = (l === 'cm' ? h / 2.54 : h * 2.54).toFixed(c === 'cm' ? 1 : 2)),
          (o.min = c === 'cm' ? '120' : '47.24'),
          (o.max = c === 'cm' ? '230' : '90.55'),
          (o.dataset.unit = c));
      },
      b = function (m) {
        (m?.preventDefault(), g());
        try {
          let l = S({
              height: x(o.value, i()),
              heightUnit: s.value,
              equationSet: n.elements.namedItem('equationSet').value,
            }),
            c = ['devine', 'robinson', 'miller', 'hamwi'],
            h = { devine: 'Devine', robinson: 'Robinson', miller: 'Miller', hamwi: 'Hamwi' };
          for (let u of c)
            a.querySelector(`[data-ideal-result="${u}"]`).textContent =
              `${r(l.formulas[u].kilograms)} kg (${r(l.formulas[u].pounds)} lb)`;
          ((a.querySelector('[data-ideal-result="bmi-min"]').textContent =
            `${r(l.bmiReference.minimumKg)} kg (${r(l.bmiReference.minimumKg / 0.45359237)} lb)`),
            (a.querySelector('[data-ideal-result="bmi-max"]').textContent =
              `${r(l.bmiReference.maximumKg)} kg (${r(l.bmiReference.maximumKg / 0.45359237)} lb)`));
          let w = l.equationSet === 'male' ? t.fields.maleSet : t.fields.femaleSet;
          ((a.querySelector('[data-ideal-set]').textContent = `${t.fields.equationSet}: ${w}`),
            (a.querySelector('[data-ideal-extrapolation]').hidden =
              !l.formulas.devine.extrapolatedBelowFiveFeet),
            (f = `${t.fields.resultSummary}
${t.fields.equationSet}: ${w}
${c.map((u) => `${h[u]}: ${r(l.formulas[u].kilograms)} kg (${r(l.formulas[u].pounds)} lb)`).join(`
`)}
${t.fields.bmiMinimum}: ${r(l.bmiReference.minimumKg)} kg
${t.fields.bmiMaximum}: ${r(l.bmiReference.maximumKg)} kg`),
            (e.hidden = !1),
            d(a, t.messages.calculated, 'success'));
        } catch {
          d(a, t.messages.checkInputs, 'error');
        }
      },
      n = a.querySelector('#tool-form'),
      t = y(a),
      e = a.querySelector('[data-ideal-results]'),
      o = n.elements.namedItem('height'),
      s = n.elements.namedItem('heightUnit'),
      i = () => document.documentElement.lang || 'en',
      r = (m) => N(i(), m, 1),
      f = '';
    (s.addEventListener('change', () => {
      (p(), g(), d(a, ''));
    }),
      n.addEventListener('input', () => {
        (g(), d(a, ''));
      }),
      n.addEventListener('submit', b),
      n.addEventListener('reset', () =>
        queueMicrotask(() => {
          (p(!1), g(), d(a, ''));
        }),
      ),
      a.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((s.value = 'in'),
          (o.value = '70'),
          p(!1),
          (n.elements.namedItem('equationSet').value = 'male'),
          b(),
          d(a, t.messages.exampleLoaded, 'success'));
      }),
      a.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        f && v(a, f, t);
      }),
      p(!1));
  }
})();
