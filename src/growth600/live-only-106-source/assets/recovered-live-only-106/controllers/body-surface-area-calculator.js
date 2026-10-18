(() => {
  var y = Object.freeze({
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
  function f(t, r = 'en') {
    let e = String(t)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (n) => String(n.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (n) => String(n.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (n) => String(n.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (n) => String(n.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let s = new Intl.NumberFormat(r).formatToParts(12345.6),
      o = s.find((n) => n.type === 'decimal')?.value ?? '.',
      a = s.find((n) => n.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      o === ','
        ? e.includes(',')
          ? (e = e.replaceAll(a, '').replace(',', '.'))
          : a === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : o === '.'
          ? e.includes('.')
            ? ((a === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(e) ||
                (a !== ',' && e.includes(a))) &&
              (e = e.replaceAll(a, ''))
            : e.includes(a) &&
              (e =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(e) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(e)
                  ? e.replaceAll(a, '')
                  : e.replace(a, '.'))
          : e.includes(o) && (e = e.replaceAll(a, '').replace(o, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var S = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function g(t = document) {
    let r = t.querySelector('[data-tool-copy]');
    if (!r) throw new Error('Localized tool copy is missing.');
    return JSON.parse(r.textContent);
  }
  function u(t, r, e = 'info') {
    let s = t.querySelector('[data-status]');
    s && ((s.textContent = r), (s.dataset.kind = e));
  }
  function m(t) {
    let r = t.querySelector('[data-result]'),
      e = t.querySelector('[data-result-content]');
    (r && (r.hidden = !0), e && e.replaceChildren());
  }
  function p(t, r) {
    let e = t.querySelector('[data-result]'),
      s = t.querySelector('[data-result-content]');
    if (!e || !s) return;
    let o = document.createElement('dl');
    for (let [a, n] of r) {
      let c = document.createElement('dt'),
        l = document.createElement('dd');
      ((c.textContent = a), (l.textContent = n), o.append(c, l));
    }
    (s.replaceChildren(o), (e.hidden = !1));
  }
  function w(t, r, e = 2) {
    return new Intl.NumberFormat(t, { maximumFractionDigits: e }).format(r);
  }
  async function b(t, r, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(r), u(t, e.messages.copied, 'success'));
    } catch {
      u(t, e.messages.copyUnavailable, 'error');
    }
  }
  var N = 0.45359237;
  function E(t, r, e, s) {
    let o = Number(t);
    if (!Number.isFinite(o) || o < r || o > e)
      throw new RangeError(`${s} is outside the supported range.`);
    return o;
  }
  function x({ height: t, heightUnit: r = 'cm', weight: e, weightUnit: s = 'kg' } = {}) {
    if (!['cm', 'in'].includes(r) || !['kg', 'lb'].includes(s))
      throw new RangeError('Choose supported height and weight units.');
    let o = E(t, 1, 1e3, 'Height'),
      a = E(e, 1, 2e3, 'Weight'),
      n = r === 'in' ? o * 2.54 : o,
      c = s === 'lb' ? a * N : a;
    if (n < 50 || n > 250 || c < 10 || c > 500)
      throw new RangeError(
        'Converted measurements are outside the supported adult estimate range.',
      );
    let l = Math.sqrt((n * c) / 3600),
      d = 0.007184 * c ** 0.425 * n ** 0.725;
    if (![l, d].every(Number.isFinite))
      throw new RangeError('Could not calculate an estimate from these measurements.');
    return Object.freeze({ heightCm: n, weightKg: c, mosteller: l, duBois: d, difference: l - d });
  }
  var A = Object.freeze({ minHeightCm: 50, maxHeightCm: 250, minWeightKg: 10, maxWeightKg: 500 });
  var i = document.querySelector('[data-tool="body-surface-area-calculator"]');
  if (i) {
    let a = function (n) {
        (n?.preventDefault(), m(i), (o = ''));
        try {
          let c = (h) => f(t.elements.namedItem(h).value, e()),
            l = x({
              height: c('height'),
              heightUnit: t.elements.namedItem('heightUnit').value,
              weight: c('weight'),
              weightUnit: t.elements.namedItem('weightUnit').value,
            }),
            d = [
              [r.fields.mosteller, `${s(l.mosteller)} m\xB2`],
              [r.fields.duBois, `${s(l.duBois)} m\xB2`],
              [r.fields.difference, `${s(Math.abs(l.difference))} m\xB2`],
            ];
          (p(i, d),
            (o = `${d.map(([h, C]) => `${h}: ${C}`).join(`
`)}

${r.fields.formulaNote}
${r.fields.safetyNote}`),
            u(i, r.messages.calculated, 'success'));
        } catch {
          u(i, r.messages.checkInputs, 'error');
        }
      },
      t = i.querySelector('#tool-form'),
      r = g(i),
      e = () => document.documentElement.lang || 'en',
      s = (n) => w(e(), n, 3),
      o = '';
    (t.addEventListener('input', () => {
      (m(i), (o = ''), u(i, ''));
    }),
      t.addEventListener('change', () => {
        (m(i), (o = ''), u(i, ''));
      }),
      t.addEventListener('submit', a),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          (m(i), (o = ''), u(i, ''));
        }, 0),
      ),
      i.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        for (let [n, c] of Object.entries({
          height: '170',
          heightUnit: 'cm',
          weight: '70',
          weightUnit: 'kg',
        }))
          t.elements.namedItem(n).value = c;
        a();
      }),
      i.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && b(i, o, r);
      }));
  }
})();
