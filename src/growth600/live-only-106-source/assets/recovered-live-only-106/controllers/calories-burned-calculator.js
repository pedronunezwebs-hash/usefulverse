(() => {
  var M = Object.freeze({
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
  function x(r, e = 'en') {
    let t = String(r)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (a) => String(a.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (a) => String(a.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (a) => String(a.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (a) => String(a.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!t) return Number.NaN;
    let n = new Intl.NumberFormat(e).formatToParts(12345.6),
      s = n.find((a) => a.type === 'decimal')?.value ?? '.',
      o = n.find((a) => a.type === 'group')?.value ?? ',';
    return (
      (t = t.replace(/[\s\u00a0\u202f]/gu, '')),
      s === ','
        ? t.includes(',')
          ? (t = t.replaceAll(o, '').replace(',', '.'))
          : o === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(t) && (t = t.replaceAll('.', ''))
        : s === '.'
          ? t.includes('.')
            ? ((o === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(t) ||
                (o !== ',' && t.includes(o))) &&
              (t = t.replaceAll(o, ''))
            : t.includes(o) &&
              (t =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(t) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(t)
                  ? t.replaceAll(o, '')
                  : t.replace(o, '.'))
          : t.includes(s) && (t = t.replaceAll(o, '').replace(s, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(t) ? Number(t) : Number.NaN
    );
  }
  var I = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  var T = 0.45359237,
    L = 1,
    q = Object.freeze([
      { id: 'walk-slow', met: 2.8, sourceCode: '17152', labelKey: 'walkSlow' },
      { id: 'walk-normal', met: 3, sourceCode: '17170', labelKey: 'walkNormal' },
      { id: 'walk-moderate', met: 3.8, sourceCode: '17190', labelKey: 'walkModerate' },
      { id: 'walk-brisk', met: 4.8, sourceCode: '17200', labelKey: 'walkBrisk' },
      { id: 'jog-general', met: 7.5, sourceCode: '12020', labelKey: 'jogGeneral' },
      { id: 'run-5mph', met: 8.5, sourceCode: '12030', labelKey: 'run5mph' },
      { id: 'run-6mph', met: 9.3, sourceCode: '12050', labelKey: 'run6mph' },
      { id: 'cycle-leisure', met: 4, sourceCode: '01010', labelKey: 'cycleLeisure' },
      { id: 'cycle-moderate', met: 8, sourceCode: '01030', labelKey: 'cycleModerate' },
      { id: 'stationary-bike', met: 6.8, sourceCode: '01200', labelKey: 'stationaryBike' },
      { id: 'aerobic-general', met: 7.3, sourceCode: '02000', labelKey: 'aerobicGeneral' },
      { id: 'weights-general', met: 3.5, sourceCode: '02054', labelKey: 'weightsGeneral' },
      { id: 'yoga-hatha', met: 2.3, sourceCode: '02150', labelKey: 'yogaHatha' },
      { id: 'jump-rope', met: 11, sourceCode: '02068', labelKey: 'jumpRope' },
    ]);
  function v(r, e, t, n) {
    let s = typeof r == 'string' && r.trim() === '' ? NaN : Number(r);
    if (!Number.isFinite(s) || s < t || s > n)
      throw new RangeError(`${e} is outside the supported range.`);
    return s;
  }
  function S({ weight: r, weightUnit: e, durationMinutes: t, activityId: n, customMet: s }) {
    if (!['kg', 'lb'].includes(e)) throw new RangeError('Choose kg or lb.');
    let o = v(r, 'Weight', e === 'kg' ? 20 : 44, e === 'kg' ? 500 : 1102),
      a = v(t, 'Duration', 1, 1440);
    if (!Number.isInteger(a)) throw new RangeError('Duration must be a whole number of minutes.');
    let c, u;
    if (n === 'custom') ((c = v(s, 'MET value', 1, 20)), (u = null));
    else {
      if (((u = q.find((b) => b.id === n)), !u))
        throw new RangeError('Choose a listed activity or a custom MET value.');
      c = u.met;
    }
    let y = e === 'kg' ? o : o * T,
      f = ((y * a) / 60) * L,
      d = f * c,
      h = Math.max(0, d - f);
    if (![y, d, h].every(Number.isFinite))
      throw new RangeError('The result is outside the supported range.');
    return Object.freeze({
      activityId: n,
      activity: u,
      met: c,
      bodyWeight: o,
      weightUnit: e,
      weightKg: y,
      durationMinutes: a,
      grossCalories: d,
      activeCalories: h,
      restingCalories: f,
    });
  }
  function k(r = document) {
    let e = r.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function g(r, e, t = 'info') {
    let n = r.querySelector('[data-status]');
    n && ((n.textContent = e), (n.dataset.kind = t));
  }
  function R(r) {
    let e = r.querySelector('[data-result]'),
      t = r.querySelector('[data-result-content]');
    (e && (e.hidden = !0), t && t.replaceChildren());
  }
  function $(r, e, t = 2) {
    return new Intl.NumberFormat(r, { maximumFractionDigits: t }).format(e);
  }
  async function F(r, e, t) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(e), g(r, t.messages.copied, 'success'));
    } catch {
      g(r, t.messages.copyUnavailable, 'error');
    }
  }
  var l = document.querySelector('[data-tool="calories-burned-calculator"]');
  if (l) {
    let d = function () {
        (R(l), (t.hidden = !0));
        for (let p of l.querySelectorAll(
          '[data-gross-calories], [data-active-calories], [data-resting-calories], [data-selected-activity], [data-selected-met]',
        ))
          p.textContent = '';
        f = '';
      },
      h = function (p = !0) {
        let i = s.value,
          m = n.dataset.unit || 'kg',
          w = x(n.value, c());
        if (p && Number.isFinite(w) && w > 0 && m !== i) {
          let C = m === 'kg' ? w / 0.45359237 : w * 0.45359237;
          n.value = C.toFixed(i === 'kg' ? 2 : 1);
        }
        ((n.min = i === 'kg' ? '20' : '44'),
          (n.max = i === 'kg' ? '500' : '1102'),
          (n.dataset.unit = i));
      },
      b = function () {
        a.hidden = o.value !== 'custom';
      },
      N = function (p) {
        (p?.preventDefault(), d());
        try {
          let i = S({
              weight: x(n.value, c()),
              weightUnit: s.value,
              durationMinutes: x(r.elements.namedItem('durationMinutes').value, c()),
              activityId: o.value,
              customMet:
                o.value === 'custom' ? x(r.elements.namedItem('customMet').value, c()) : void 0,
            }),
            m = (E) => `${u(E)} kcal`,
            w = i.activity ? y[i.activityId] : e.fields.customActivity,
            C = [
              ['[data-gross-calories]', m(i.grossCalories)],
              ['[data-active-calories]', m(i.activeCalories)],
              ['[data-resting-calories]', m(i.restingCalories)],
              ['[data-selected-activity]', w],
              ['[data-selected-met]', `${u(i.met)} MET`],
            ];
          for (let [E, A] of C) l.querySelector(E).textContent = A;
          ((f = `${e.fields.resultSummary}
${e.fields.grossCalories}: ${m(i.grossCalories)}
${e.fields.activeCalories}: ${m(i.activeCalories)}
${e.fields.restingCalories}: ${m(i.restingCalories)}
${e.fields.selectedActivity}: ${w}
${e.fields.selectedMet}: ${u(i.met)} MET
${e.fields.formula}: ${e.fields.formulaText}`),
            (t.hidden = !1),
            g(l, e.messages.calculated, 'success'));
        } catch {
          g(l, e.messages.checkInputs, 'error');
        }
      },
      r = l.querySelector('#tool-form'),
      e = k(l),
      t = l.querySelector('[data-calories-results]'),
      n = r.elements.namedItem('weight'),
      s = r.elements.namedItem('weightUnit'),
      o = r.elements.namedItem('activityId'),
      a = l.querySelector('[data-custom-met]'),
      c = () => document.documentElement.lang || 'en',
      u = (p) => $(c(), p, 1),
      y = {
        'walk-slow': e.fields.walkSlow,
        'walk-normal': e.fields.walkNormal,
        'walk-moderate': e.fields.walkModerate,
        'walk-brisk': e.fields.walkBrisk,
        'jog-general': e.fields.jogGeneral,
        'run-5mph': e.fields.run5mph,
        'run-6mph': e.fields.run6mph,
        'cycle-leisure': e.fields.cycleLeisure,
        'cycle-moderate': e.fields.cycleModerate,
        'stationary-bike': e.fields.stationaryBike,
        'aerobic-general': e.fields.aerobicGeneral,
        'weights-general': e.fields.weightsGeneral,
        'yoga-hatha': e.fields.yogaHatha,
        'jump-rope': e.fields.jumpRope,
      },
      f = '';
    (s.addEventListener('change', () => {
      (h(), d());
    }),
      o.addEventListener('change', () => {
        (b(), d());
      }),
      r.addEventListener('input', () => {
        (d(), g(l, ''));
      }),
      r.addEventListener('submit', N),
      r.addEventListener('reset', () =>
        queueMicrotask(() => {
          (h(!1), b(), d(), g(l, ''));
        }),
      ),
      l.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((n.value = '70'),
          (s.value = 'kg'),
          (o.value = 'walk-normal'),
          (r.elements.namedItem('durationMinutes').value = '30'),
          h(!1),
          b(),
          N(),
          g(l, e.messages.exampleLoaded, 'success'));
      }),
      l.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        f && F(l, f, e);
      }),
      h(!1),
      b());
  }
})();
