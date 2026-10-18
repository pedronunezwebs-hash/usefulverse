(() => {
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
  function v(r, t = 'en') {
    let e = String(r)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (o) => String(o.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (o) => String(o.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (o) => String(o.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (o) => String(o.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let s = new Intl.NumberFormat(t).formatToParts(12345.6),
      a = s.find((o) => o.type === 'decimal')?.value ?? '.',
      n = s.find((o) => o.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      a === ','
        ? e.includes(',')
          ? (e = e.replaceAll(n, '').replace(',', '.'))
          : n === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : a === '.'
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
          : e.includes(a) && (e = e.replaceAll(n, '').replace(a, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var z = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function R(r = document) {
    let t = r.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function c(r, t, e = 'info') {
    let s = r.querySelector('[data-status]');
    s && ((s.textContent = t), (s.dataset.kind = e));
  }
  function f(r) {
    let t = r.querySelector('[data-result]'),
      e = r.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  async function F(r, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), c(r, e.messages.copied, 'success'));
    } catch {
      c(r, e.messages.copyUnavailable, 'error');
    }
  }
  var $ = Object.freeze({
      wilks: Object.freeze({
        men: [-1291e-11, 701863e-11, -0.00113732, -0.002388645, 16.2606339, -216.0475144],
        women: [
          -9054e-11, 4731582e-11, -0.00930733913, 0.82112226871, -27.23842536447, 594.31747775582,
        ],
        powers: [5, 4, 3, 2, 1, 0],
        divisor: 500,
      }),
      'wilks-2': Object.freeze({
        men: [
          -120804336482315e-22, 707665973070743e-20, -0.00139583381094385, 0.073694103462609,
          8.47206137941125, 47.4617885411949,
        ],
        women: [
          -23334613884954e-21, 938773881462799e-20, -0.0010504000506583, -0.0330725063103405,
          13.7121941940668, -125.425539779509,
        ],
        powers: [5, 4, 3, 2, 1, 0],
        divisor: 600,
      }),
      dots: Object.freeze({
        men: [1093e-9, 0.0007391293, 0.1918759221, 24.0900756, 307.75076],
        women: [-10706e-10, 0.0005158568, -0.1126655495, 13.6175032, -57.96288],
        powers: [4, 3, 2, 1, 0],
        divisor: 500,
      }),
    }),
    A = 40,
    T = 205,
    I = 2e3;
  function L({ bodyweightKg: r, liftKg: t, coefficientGroup: e, formula: s }) {
    let a = Number(r),
      n = Number(t);
    if (![a, n].every(Number.isFinite))
      throw new RangeError('Enter finite bodyweight and lift values.');
    if (a < A || a > T)
      throw new RangeError('Bodyweight must be 40 to 205 kg for the displayed models.');
    if (n <= 0 || n > I)
      throw new RangeError('Lift total must be greater than 0 and no more than 2,000 kg.');
    if (!['men', 'women'].includes(e)) throw new RangeError('Choose a coefficient group.');
    let o = $[s];
    if (!o) throw new RangeError('Choose Wilks, Wilks-2 or DOTS.');
    let l = o[e].reduce((h, g, u) => h + g * a ** o.powers[u], 0);
    if (!Number.isFinite(l) || l <= 0)
      throw new RangeError('This formula is not defined for the entered values.');
    let d = (n * o.divisor) / l;
    if (!Number.isFinite(d) || d <= 0) throw new RangeError('The score could not be calculated.');
    return Object.freeze({
      bodyweightKg: a,
      liftKg: n,
      coefficientGroup: e,
      formula: s,
      denominator: l,
      score: d,
    });
  }
  var D = Object.freeze({
    minBodyweightKg: A,
    maxBodyweightKg: T,
    maxLiftKg: I,
    formulas: Object.freeze(Object.keys($)),
  });
  var i = document.querySelector('[data-tool="wilks-calculator"]');
  if (i) {
    let n = function (o) {
        (o?.preventDefault(), f(i), s.replaceChildren(), (a = ''));
        try {
          let l = (m) => v(r.elements.namedItem(m).value, document.documentElement.lang || 'en'),
            d = r.elements.namedItem('weightUnit').value === 'lb' ? 0.45359237 : 1,
            h = l('bodyweight') * d,
            g = l('lift') * d,
            u = L({
              bodyweightKg: h,
              liftKg: g,
              coefficientGroup: r.elements.namedItem('coefficientGroup').value,
              formula: r.elements.namedItem('formula').value,
            }),
            p = new Intl.NumberFormat(document.documentElement.lang || 'en', {
              maximumFractionDigits: 2,
            }),
            E = [
              [t.fields.formula, t.fields[u.formula]],
              [t.fields.coefficientGroup, t.fields[u.coefficientGroup]],
              [t.fields.bodyweight, `${p.format(u.bodyweightKg)} ${t.fields.kg}`],
              [t.fields.lift, `${p.format(u.liftKg)} ${t.fields.kg}`],
              [t.fields.score, p.format(u.score)],
            ],
            w = document.createElement('table'),
            y = document.createElement('caption');
          ((y.textContent = t.fields.tableCaption), w.append(y));
          let S = document.createElement('tbody');
          for (let [m, b] of E) {
            let C = document.createElement('tr'),
              x = document.createElement('th');
            ((x.scope = 'row'), (x.textContent = m));
            let N = document.createElement('td');
            ((N.textContent = b), C.append(x, N), S.append(C));
          }
          (w.append(S),
            s.append(w),
            (e.hidden = !1),
            (a = `${E.map(([m, b]) => `${m}: ${b}`).join(`
`)}

${t.fields.modelNote}`),
            c(i, t.messages.calculated, 'success'));
        } catch {
          c(i, t.messages.checkInputs, 'error');
        }
      },
      r = i.querySelector('#tool-form'),
      t = R(i),
      e = i.querySelector('[data-result]'),
      s = i.querySelector('[data-result-content]'),
      a = '';
    (r.addEventListener('submit', n),
      r.addEventListener('input', () => {
        (f(i), s.replaceChildren(), (a = ''), c(i, ''));
      }),
      r.addEventListener('reset', () => {
        (f(i), s.replaceChildren(), (a = ''), c(i, ''));
      }),
      i.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((r.elements.namedItem('bodyweight').value = '69.3'),
          (r.elements.namedItem('lift').value = '500'),
          (r.elements.namedItem('weightUnit').value = 'kg'),
          (r.elements.namedItem('coefficientGroup').value = 'men'),
          (r.elements.namedItem('formula').value = 'wilks'),
          n(),
          c(i, t.messages.exampleLoaded, 'success'));
      }),
      i.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        a && F(i, a, t);
      }));
  }
})();
