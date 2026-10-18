(() => {
  var N = Object.freeze({
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
  function w(n, t = 'en') {
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
    let a = new Intl.NumberFormat(t).formatToParts(12345.6),
      s = a.find((r) => r.type === 'decimal')?.value ?? '.',
      o = a.find((r) => r.type === 'group')?.value ?? ',';
    return (
      (e = e.replace(/[\s\u00a0\u202f]/gu, '')),
      s === ','
        ? e.includes(',')
          ? (e = e.replaceAll(o, '').replace(',', '.'))
          : o === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(e) && (e = e.replaceAll('.', ''))
        : s === '.'
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
          : e.includes(s) && (e = e.replaceAll(o, '').replace(s, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(e) ? Number(e) : Number.NaN
    );
  }
  var S = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function b(n = document) {
    let t = n.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function c(n, t, e = 'info') {
    let a = n.querySelector('[data-status]');
    a && ((a.textContent = t), (a.dataset.kind = e));
  }
  function f(n) {
    let t = n.querySelector('[data-result]'),
      e = n.querySelector('[data-result-content]');
    (t && (t.hidden = !0), e && e.replaceChildren());
  }
  function x(n, t) {
    let e = n.querySelector('[data-result]'),
      a = n.querySelector('[data-result-content]');
    if (!e || !a) return;
    let s = document.createElement('dl');
    for (let [o, r] of t) {
      let i = document.createElement('dt'),
        l = document.createElement('dd');
      ((i.textContent = o), (l.textContent = r), s.append(i, l));
    }
    (a.replaceChildren(s), (e.hidden = !1));
  }
  function y(n, t, e = 2) {
    return new Intl.NumberFormat(n, { maximumFractionDigits: e }).format(t);
  }
  async function E(n, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), c(n, e.messages.copied, 'success'));
    } catch {
      c(n, e.messages.copyUnavailable, 'error');
    }
  }
  var p = Object.freeze({
    maxWeeklyHours: 168,
    maxThresholdHours: 168,
    maxHourlyRate: 1e6,
    maxMultiplier: 5,
  });
  function R({ totalHours: n, hourlyRate: t, thresholdHours: e, overtimeMultiplier: a }) {
    let s = {
      totalHours: Number(n),
      hourlyRate: Number(t),
      thresholdHours: Number(e),
      overtimeMultiplier: Number(a),
    };
    if (Object.values(s).some((v) => !Number.isFinite(v)))
      throw new RangeError('Enter finite numbers.');
    let { totalHours: o, hourlyRate: r, thresholdHours: i, overtimeMultiplier: l } = s;
    if (o < 0 || o > p.maxWeeklyHours)
      throw new RangeError('Weekly hours must be between 0 and 168.');
    if (i < 0 || i > p.maxThresholdHours)
      throw new RangeError('The user-entered threshold must be between 0 and 168 hours.');
    if (r < 0 || r > p.maxHourlyRate)
      throw new RangeError('Hourly rate is outside the supported range.');
    if (l < 1 || l > p.maxMultiplier) throw new RangeError('The multiplier must be from 1 to 5.');
    let m = Math.min(o, i),
      d = Math.max(0, o - i),
      h = m * r,
      g = d * r * l;
    return Object.freeze({
      totalHours: o,
      regularHours: m,
      overtimeHours: d,
      hourlyRate: r,
      thresholdHours: i,
      overtimeMultiplier: l,
      regularPay: h,
      overtimePay: g,
      totalPay: h + g,
      blendedHourlyRate: o === 0 ? null : (h + g) / o,
    });
  }
  var u = document.querySelector('[data-tool="overtime-calculator"]');
  if (u) {
    let o = function (r) {
        (r?.preventDefault(), f(u), (a = ''));
        try {
          let i = (d) => w(n.elements.namedItem(d).value, e()),
            l = R({
              totalHours: i('totalHours'),
              hourlyRate: i('hourlyRate'),
              thresholdHours: i('thresholdHours'),
              overtimeMultiplier: i('overtimeMultiplier'),
            }),
            m = [
              [t.fields.regularHours, `${s(l.regularHours)} h`],
              [t.fields.overtimeHours, `${s(l.overtimeHours)} h`],
              [t.fields.regularPay, s(l.regularPay)],
              [t.fields.overtimePay, s(l.overtimePay)],
              [t.fields.totalPay, s(l.totalPay)],
            ];
          (l.blendedHourlyRate !== null &&
            m.push([t.fields.blendedHourlyRate, s(l.blendedHourlyRate)]),
            x(u, m),
            (a = m.map(([d, h]) => `${d}: ${h}`).join(`
`)),
            c(u, t.messages.calculated, 'success'));
        } catch {
          c(u, t.messages.checkInputs, 'error');
        }
      },
      n = u.querySelector('#tool-form'),
      t = b(u),
      e = () => document.documentElement.lang || 'en',
      a = '',
      s = (r) => y(e(), r, 2);
    (n.addEventListener('submit', o),
      n.addEventListener('input', () => {
        (f(u), (a = ''), c(u, ''));
      }),
      n.addEventListener('reset', () =>
        setTimeout(() => {
          (f(u), (a = ''), c(u, ''));
        }, 0),
      ),
      u.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        for (let [r, i] of Object.entries({
          totalHours: '45',
          hourlyRate: '20',
          thresholdHours: '40',
          overtimeMultiplier: '1.5',
        }))
          n.elements.namedItem(r).value = i;
        o();
      }),
      u.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        a && E(u, a, t);
      }));
  }
})();
