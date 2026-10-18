(() => {
  var $ = Object.freeze({
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
  function T(t, n = 'en') {
    let e = String(t)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (r) => String(r.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (r) => String(r.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (r) => String(r.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (r) => String(r.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!e) return Number.NaN;
    let s = new Intl.NumberFormat(n).formatToParts(12345.6),
      c = s.find((r) => r.type === 'decimal')?.value ?? '.',
      o = s.find((r) => r.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      c === ','
        ? e.includes(',')
          ? (e = e.replaceAll(o, '').replace(',', '.'))
          : o === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : c === '.'
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
          : e.includes(c) && (e = e.replaceAll(o, '').replace(c, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var q = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function F(t = document) {
    let n = t.querySelector('[data-tool-copy]');
    if (!n) throw new Error('Localized tool copy is missing.');
    return JSON.parse(n.textContent);
  }
  function u(t, n, e = 'info') {
    let s = t.querySelector('[data-status]');
    s && ((s.textContent = n), (s.dataset.kind = e));
  }
  function w(t) {
    let n = t.querySelector('[data-result]'),
      e = t.querySelector('[data-result-content]');
    (n && (n.hidden = !0), e && e.replaceChildren());
  }
  async function I(t, n, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(n), u(t, e.messages.copied, 'success'));
    } catch {
      u(t, e.messages.copyUnavailable, 'error');
    }
  }
  function M({
    distanceKm: t,
    ascentMeters: n,
    paceKmh: e,
    climbMinutesPer100m: s,
    breakMinutesPerHour: c = 0,
  }) {
    let o = [t, n, e, s, c].map(Number),
      [r, m, l, i, d] = o;
    if (o.some((f) => !Number.isFinite(f)))
      throw new RangeError('All values must be finite numbers.');
    if (r < 0.1 || r > 500) throw new RangeError('Route distance must be 0.1 to 500 km.');
    if (m < 0 || m > 3e4) throw new RangeError('Total ascent must be 0 to 30,000 m.');
    if (l < 0.5 || l > 12) throw new RangeError('Walking pace must be 0.5 to 12 km/h.');
    if (i < 0 || i > 120)
      throw new RangeError('Climb allowance must be 0 to 120 minutes per 100 m.');
    if (d < 0 || d > 60)
      throw new RangeError('Break allowance must be 0 to 60 minutes per hiking hour.');
    let h = r / l,
      b = ((m / 100) * i) / 60,
      p = (h * d) / 60;
    return Object.freeze({
      distanceKm: r,
      ascentMeters: m,
      paceKmh: l,
      climbMinutesPer100m: i,
      breakMinutesPerHour: d,
      movingHours: h,
      climbHours: b,
      breakHours: p,
      totalHours: h + b + p,
    });
  }
  var _ = Object.freeze({
    maxDistanceKm: 500,
    maxAscentMeters: 3e4,
    minPaceKmh: 0.5,
    maxPaceKmh: 12,
    maxClimbMinutesPer100m: 120,
    maxBreakMinutesPerHour: 60,
  });
  var a = document.querySelector('[data-tool="hiking-time-calculator"]');
  if (a) {
    let r = function () {
        let l = t.elements.namedItem('method').value === 'custom';
        ((c.hidden = !l), (c.disabled = !l));
        for (let i of c.querySelectorAll('input, select')) i.disabled = !l;
        (w(a), s.replaceChildren(), (o = ''));
      },
      m = function (l) {
        (l?.preventDefault(), w(a), s.replaceChildren(), (o = ''));
        try {
          let i = (g) => T(t.elements.namedItem(g).value, document.documentElement.lang || 'en'),
            d = t.elements.namedItem('distanceUnit').value === 'mi' ? 1.609344 : 1,
            h = t.elements.namedItem('ascentUnit').value === 'ft' ? 0.3048 : 1,
            b = t.elements.namedItem('paceUnit').value === 'mph' ? 1.609344 : 1,
            p = t.elements.namedItem('method').value,
            f = M({
              distanceKm: i('distance') * d,
              ascentMeters: i('ascent') * h,
              paceKmh: p === 'naismith' ? 5 : i('pace') * b,
              climbMinutesPer100m: p === 'naismith' ? 10 : i('climbRate'),
              breakMinutesPerHour: i('breakRate'),
            }),
            y = new Intl.NumberFormat(document.documentElement.lang || 'en', {
              maximumFractionDigits: 2,
            }),
            C = [
              [n.fields.movingTime, f.movingHours],
              [n.fields.climbTime, f.climbHours],
              [n.fields.breakTime, f.breakHours],
              [n.fields.totalTime, f.totalHours],
            ],
            E = document.createElement('table'),
            N = document.createElement('caption');
          ((N.textContent = n.fields.tableCaption), E.append(N));
          let v = document.createElement('tbody');
          for (let [g, x] of C) {
            let R = document.createElement('tr'),
              S = document.createElement('th');
            ((S.scope = 'row'), (S.textContent = g));
            let A = document.createElement('td');
            ((A.textContent = `${y.format(x)} ${n.fields.hours}`), R.append(S, A), v.append(R));
          }
          (E.append(v),
            s.append(E),
            (e.hidden = !1),
            (o = `${C.map(([g, x]) => `${g}: ${y.format(x)} ${n.fields.hours}`).join(`
`)}

${n.fields.accuracyNote}`),
            u(a, n.messages.calculated, 'success'));
        } catch {
          u(a, n.messages.checkInputs, 'error');
        }
      },
      t = a.querySelector('#tool-form'),
      n = F(a),
      e = a.querySelector('[data-result]'),
      s = a.querySelector('[data-result-content]'),
      c = a.querySelector('[data-hiking-custom]'),
      o = '';
    (t.addEventListener('submit', m),
      t.addEventListener('input', () => {
        (w(a), s.replaceChildren(), (o = ''), u(a, ''));
      }),
      t.elements.namedItem('method').addEventListener('change', r),
      t.addEventListener('reset', () => {
        (w(a), s.replaceChildren(), (o = ''), u(a, ''), setTimeout(r, 0));
      }),
      a.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('distance').value = '10'),
          (t.elements.namedItem('distanceUnit').value = 'km'),
          (t.elements.namedItem('ascent').value = '600'),
          (t.elements.namedItem('ascentUnit').value = 'm'),
          (t.elements.namedItem('method').value = 'naismith'),
          (t.elements.namedItem('breakRate').value = '10'),
          r(),
          m(),
          u(a, n.messages.exampleLoaded, 'success'));
      }),
      a.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        o && I(a, o, n);
      }),
      r());
  }
})();
