(() => {
  var L = Object.freeze({
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
  function b(n, r = 'en') {
    let e = String(n)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (o) => String(o.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (o) => String(o.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (o) => String(o.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (o) => String(o.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let t = new Intl.NumberFormat(r).formatToParts(12345.6),
      s = t.find((o) => o.type === 'decimal')?.value ?? '.',
      i = t.find((o) => o.type === 'group')?.value ?? ',';
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
  var F = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function x(n = document) {
    let r = n.querySelector('[data-tool-copy]');
    if (!r) throw new Error('Localized tool copy is missing.');
    return JSON.parse(r.textContent);
  }
  function u(n, r, e = 'info') {
    let t = n.querySelector('[data-status]');
    t && ((t.textContent = r), (t.dataset.kind = e));
  }
  function g(n) {
    let r = n.querySelector('[data-result]'),
      e = n.querySelector('[data-result-content]');
    (r && (r.hidden = !0), e && e.replaceChildren());
  }
  function E(n, r) {
    let e = n.querySelector('[data-result]'),
      t = n.querySelector('[data-result-content]');
    if (!e || !t) return;
    let s = document.createElement('dl');
    for (let [i, o] of r) {
      let d = document.createElement('dt'),
        l = document.createElement('dd');
      ((d.textContent = i), (l.textContent = o), s.append(d, l));
    }
    (t.replaceChildren(s), (e.hidden = !1));
  }
  function C(n, r, e = 2) {
    return new Intl.NumberFormat(n, { maximumFractionDigits: e }).format(r);
  }
  async function S(n, r, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(r), u(n, e.messages.copied, 'success'));
    } catch {
      u(n, e.messages.copyUnavailable, 'error');
    }
  }
  var y = 2 * Math.PI,
    A = 1e12;
  function h(n, r, { allowZero: e = !1 } = {}) {
    let t = Number(n);
    if (!Number.isFinite(t) || t < (e ? 0 : Number.EPSILON) || t > A)
      throw new RangeError(`${r} must be ${e ? 'nonnegative' : 'positive'} and at most 10^12.`);
    return t;
  }
  function N({ knownMeasure: n = 'radius', value: r }) {
    let e = h(r, 'Circle measure'),
      t;
    if (n === 'radius') t = e;
    else if (n === 'diameter') t = e / 2;
    else if (n === 'area') t = Math.sqrt(e / Math.PI);
    else if (n === 'circumference') t = e / y;
    else throw new RangeError('Choose radius, diameter, area, or circumference.');
    return Object.freeze({
      radius: t,
      diameter: t * 2,
      area: Math.PI * t ** 2,
      circumference: y * t,
    });
  }
  function p({ radius: n, angleDegrees: r }) {
    let e = h(n, 'Radius'),
      t = h(r, 'Angle', { allowZero: !0 });
    if (t > 360) throw new RangeError('Central angle must be from 0 to 360 degrees.');
    let s = (t * Math.PI) / 180;
    return Object.freeze({
      radius: e,
      angleDegrees: t,
      angleRadians: s,
      arcLength: e * s,
      sectorArea: 0.5 * e ** 2 * s,
    });
  }
  function R({ radius: n, angleDegrees: r }) {
    let e = p({ radius: n, angleDegrees: r }),
      t = e.angleRadians / 2;
    return Object.freeze({
      ...e,
      chordLength: 2 * e.radius * Math.sin(t),
      sagitta: e.radius * (1 - Math.cos(t)),
      segmentArea: 0.5 * e.radius ** 2 * (e.angleRadians - Math.sin(e.angleRadians)),
    });
  }
  var q = Object.freeze({ maxInput: A, minAngleDegrees: 0, maxAngleDegrees: 360 });
  var c = document.querySelector('[data-tool="circle-calculator"]');
  if (c) {
    let i = function () {
        let l = n.elements.namedItem('mode').value;
        ((c.querySelector('[data-circle-measure-fields]').hidden = l !== 'circle'),
          (c.querySelector('[data-circle-radius-fields]').hidden = l === 'circle'));
      },
      o = function (l) {
        (l?.preventDefault(), g(c), (s = ''));
        try {
          let m = (a) => b(n.elements.namedItem(a).value, e()),
            w = n.elements.namedItem('mode').value,
            f;
          if (w === 'circle') {
            let a = N({
              knownMeasure: n.elements.namedItem('knownMeasure').value,
              value: m('measureValue'),
            });
            f = [
              [r.fields.resultRadius, t(a.radius)],
              [r.fields.resultDiameter, t(a.diameter)],
              [r.fields.resultArea, t(a.area)],
              [r.fields.resultCircumference, t(a.circumference)],
            ];
          } else if (w === 'arc') {
            let a = p({ radius: m('radius'), angleDegrees: m('angleDegrees') });
            f = [
              [r.fields.radius, t(a.radius)],
              [r.fields.centralAngle, `${t(a.angleDegrees)}\xB0 (${t(a.angleRadians)} rad)`],
              [r.fields.resultArc, t(a.arcLength)],
              [r.fields.resultSector, t(a.sectorArea)],
            ];
          } else {
            let a = R({ radius: m('radius'), angleDegrees: m('angleDegrees') });
            f = [
              [r.fields.radius, t(a.radius)],
              [r.fields.centralAngle, `${t(a.angleDegrees)}\xB0`],
              [r.fields.resultArc, t(a.arcLength)],
              [r.fields.resultChord, t(a.chordLength)],
              [r.fields.resultSagitta, t(a.sagitta)],
              [r.fields.resultSegment, t(a.segmentArea)],
            ];
          }
          (E(c, f),
            (s = f.map(([a, v]) => `${a}: ${v}`).join(`
`)),
            u(c, r.messages.calculated, 'success'));
        } catch {
          u(c, r.messages.checkInputs, 'error');
        }
      },
      d = function () {
        (g(c), (s = ''), u(c, ''));
      },
      n = c.querySelector('#tool-form'),
      r = x(c),
      e = () => document.documentElement.lang || 'en',
      t = (l) => C(e(), l, 8),
      s = '';
    (n.elements.namedItem('mode').addEventListener('change', () => {
      (i(), d());
    }),
      n.addEventListener('input', d),
      n.addEventListener('submit', o),
      n.addEventListener('reset', () =>
        setTimeout(() => {
          (i(), d());
        }, 0),
      ),
      c.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        (n.elements.namedItem('mode').value === 'circle'
          ? ((n.elements.namedItem('knownMeasure').value = 'radius'),
            (n.elements.namedItem('measureValue').value = '1'))
          : ((n.elements.namedItem('radius').value = '1'),
            (n.elements.namedItem('angleDegrees').value = '90')),
          o(),
          u(c, r.messages.exampleLoaded, 'success'));
      }),
      c.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        s && S(c, s, r);
      }),
      i());
  }
})();
