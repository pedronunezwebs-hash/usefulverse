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
  function R(t, n = 'en') {
    let e = String(t)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (i) => String(i.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (i) => String(i.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (i) => String(i.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (i) => String(i.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let r = new Intl.NumberFormat(n).formatToParts(12345.6),
      a = r.find((i) => i.type === 'decimal')?.value ?? '.',
      o = r.find((i) => i.type === 'group')?.value ?? ',';
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
  var D = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function x(t, n, { min: e = -1e12, max: r = 1e12 } = {}) {
    let a = Number(t);
    if (!Number.isSafeInteger(a) || a < e || a > r)
      throw new RangeError(`${n} must be a safe integer in range.`);
    return a;
  }
  function F(t, n) {
    let e = BigInt(t),
      r = 1n,
      a = 1n;
    for (let o = 2n; o * o <= e; o = o === 2n ? 3n : o + 2n) {
      if (e % o !== 0n) continue;
      let i = 0;
      for (; e % o === 0n;) ((e /= o), (i += 1));
      ((r *= o ** BigInt(Math.floor(i / n))), (a *= o ** BigInt(i % n)));
    }
    return (e > 1n && (a *= e), Object.freeze({ outside: Number(r), inside: Number(a) }));
  }
  function T(t, n) {
    let e = t < 0n ? -t : t,
      r = n < 0n ? -n : n;
    for (; r;) [e, r] = [r, e % r];
    return e || 1n;
  }
  function I({ radicand: t, index: n = 2 }) {
    let e = x(t, 'Radicand', { min: -1e12, max: 1e12 }),
      r = x(n, 'Root index', { min: 2, max: 12 });
    if (e < 0 && r % 2 === 0)
      throw new RangeError('An even-index real root cannot have a negative radicand.');
    if (e === 0) return Object.freeze({ coefficient: 0, radicand: 1, index: r });
    let a = F(Math.abs(e), r);
    return Object.freeze({ coefficient: Math.sign(e) * a.outside, radicand: a.inside, index: r });
  }
  function v({ numerator: t, denominatorCoefficient: n = 1, radicand: e }) {
    let r = x(t, 'Numerator'),
      a = x(n, 'Denominator coefficient', { min: -1e12, max: 1e12 }),
      o = x(e, 'Radicand', { min: 1, max: 1e12 });
    if (a === 0) throw new RangeError('Denominator coefficient cannot be zero.');
    if (r === 0) return Object.freeze({ numerator: 0n, denominator: 1n, radicand: 1 });
    let { outside: i, inside: f } = F(o, 2),
      u = BigInt(r) * BigInt(Math.sign(a)),
      p = BigInt(Math.abs(a)) * BigInt(i) * BigInt(f),
      b = T(u, p);
    return ((u /= b), (p /= b), Object.freeze({ numerator: u, denominator: p, radicand: f }));
  }
  function A(t = document) {
    let n = t.querySelector('[data-tool-copy]');
    if (!n) throw new Error('Localized tool copy is missing.');
    return JSON.parse(n.textContent);
  }
  function h(t, n, e = 'info') {
    let r = t.querySelector('[data-status]');
    r && ((r.textContent = n), (r.dataset.kind = e));
  }
  function N(t) {
    let n = t.querySelector('[data-result]'),
      e = t.querySelector('[data-result-content]');
    (n && (n.hidden = !0), e && e.replaceChildren());
  }
  function C(t, n) {
    let e = t.querySelector('[data-result]'),
      r = t.querySelector('[data-result-content]');
    if (!e || !r) return;
    let a = document.createElement('dl');
    for (let [o, i] of n) {
      let f = document.createElement('dt'),
        u = document.createElement('dd');
      ((f.textContent = o), (u.textContent = i), a.append(f, u));
    }
    (r.replaceChildren(a), (e.hidden = !1));
  }
  function $(t, n, e = 2) {
    return new Intl.NumberFormat(t, { maximumFractionDigits: e }).format(n);
  }
  async function z(t, n, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(n), h(t, e.messages.copied, 'success'));
    } catch {
      h(t, e.messages.copyUnavailable, 'error');
    }
  }
  var l = document.querySelector('[data-tool="radical-calculator"]');
  if (l) {
    let p = function () {
        let s = t.elements.namedItem('mode').value === 'rationalize';
        ((i.hidden = s), (f.hidden = !s));
      },
      b = function (s, d, g) {
        if (s === 0) return '0';
        let c = g === 2 ? '\u221A' : `${o(g)}\u221A`,
          m = s === 1 ? '' : s === -1 ? '\u2212' : r(s);
        return d === 1 ? `${m || '1'}` : `${m}${c}${d === 1 ? '' : d}`;
      },
      y = function (s) {
        (s?.preventDefault(), N(l), (u = ''));
        let d = (g) => R(t.elements.namedItem(g).value, e());
        try {
          let g = t.elements.namedItem('mode').value;
          if (g === 'simplify') {
            let c = I({ radicand: d('radicand'), index: d('index') }),
              m = `${c.index === 2 ? '\u221A' : `${o(c.index)}\u221A`}(${r(d('radicand'))})`,
              w = b(c.coefficient, c.radicand, c.index);
            (C(l, [
              [n.fields.simplified, w],
              [n.fields.original, m],
            ]),
              (u = `${n.fields.simplified}: ${w}
${m} = ${w}`));
          } else if (g === 'rationalize') {
            let c = v({
                numerator: d('numerator'),
                denominatorCoefficient: d('denominatorCoefficient'),
                radicand: d('rationalizeRadicand'),
              }),
              m = c.numerator === 1n ? '' : c.numerator === -1n ? '\u2212' : r(Number(c.numerator)),
              w = c.radicand === 1 ? m || '1' : `${m}\u221A${r(c.radicand)}`,
              S = c.denominator === 1n ? w : `${w} / ${a(c.denominator)}`;
            (C(l, [
              [n.fields.rationalized, S],
              [n.fields.rationalizationStep, n.fields.rationalizationExplanation],
            ]),
              (u = `${n.fields.rationalized}: ${S}`));
          } else throw new RangeError('Choose a supported mode.');
          h(l, n.messages.calculated, 'success');
        } catch {
          h(l, n.messages.checkInputs, 'error');
        }
      },
      E = function () {
        (N(l), (u = ''), h(l, ''));
      },
      t = l.querySelector('#tool-form'),
      n = A(l),
      e = () => document.documentElement.lang || 'en',
      r = (s) => $(e(), s, 0),
      a = (s) =>
        new Intl.NumberFormat(e(), { maximumFractionDigits: 0, useGrouping: !0 }).format(s),
      o = (s) =>
        String(s).replace(
          /[0-9]/gu,
          (d) => '\u2070\xB9\xB2\xB3\u2074\u2075\u2076\u2077\u2078\u2079'[Number(d)],
        ),
      i = t.querySelector('[data-radical-simplify-fields]'),
      f = t.querySelector('[data-radical-rationalize-fields]'),
      u = '';
    (t.addEventListener('input', E),
      t.addEventListener('change', (s) => {
        (s.target.name === 'mode' && p(), E());
      }),
      t.addEventListener('submit', y),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          (p(), E());
        }, 0),
      ),
      l.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        (t.elements.namedItem('mode').value === 'rationalize'
          ? ((t.elements.namedItem('numerator').value = '1'),
            (t.elements.namedItem('denominatorCoefficient').value = '1'),
            (t.elements.namedItem('rationalizeRadicand').value = '72'))
          : ((t.elements.namedItem('radicand').value = '72'),
            (t.elements.namedItem('index').value = '2')),
          y(),
          h(l, n.messages.exampleLoaded, 'success'));
      }),
      l.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        u && z(l, u, n);
      }),
      p());
  }
})();
