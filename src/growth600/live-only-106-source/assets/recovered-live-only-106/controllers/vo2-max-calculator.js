(() => {
  function b(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function l(e, t, n = 'info') {
    let a = e.querySelector('[data-status]');
    a && ((a.textContent = t), (a.dataset.kind = n));
  }
  var h = 2.20462262185,
    i = Object.freeze({
      cooperDistanceMeters: Object.freeze([100, 1e5]),
      rockportAge: Object.freeze([30, 69]),
      rockportWeightKg: Object.freeze([30, 300]),
      rockportMinutes: Object.freeze([8, 30]),
      heartRateBpm: Object.freeze([40, 220]),
    });
  function d(e, [t, n], a, { integer: c = !1 } = {}) {
    let o = Number(e);
    if (!Number.isFinite(o) || o < t || o > n || (c && !Number.isInteger(o)))
      throw new RangeError(`${a} must be ${c ? 'a whole number ' : ''}from ${t} to ${n}.`);
    return o;
  }
  function I({ distance: e, unit: t = 'm' }) {
    let n = { m: 1, km: 1e3, mi: 1609.344 }[t];
    if (!n) throw new RangeError('Choose meters, kilometers, or miles.');
    let c = d(e, [i.cooperDistanceMeters[0] / n, i.cooperDistanceMeters[1] / n], 'Distance') * n,
      o = (c / 1e3) * 22.351 - 11.288;
    return Object.freeze({
      method: 'cooper-12-minute-run',
      distanceMeters: c,
      vo2Max: o,
      unit: 'mL/kg/min',
    });
  }
  function M({
    age: e,
    weight: t,
    weightUnit: n = 'kg',
    sexCoefficient: a,
    minutes: c,
    seconds: o = 0,
    finishHeartRate: p,
  }) {
    if (!['male', 'female'].includes(a))
      throw new RangeError('Choose the equation coefficient shown for the original model.');
    let f = d(e, i.rockportAge, 'Age', { integer: !0 }),
      m = { kg: h, lb: 1 }[n];
    if (!m) throw new RangeError('Choose kilograms or pounds.');
    let u = d(
        t,
        n === 'kg' ? i.rockportWeightKg : [i.rockportWeightKg[0] * h, i.rockportWeightKg[1] * h],
        'Weight',
      ),
      s = d(c, i.rockportMinutes, 'Walk time'),
      g = d(o, [0, 59], 'Seconds', { integer: !0 }),
      v = s + g / 60;
    if (v > i.rockportMinutes[1])
      throw new RangeError('Walk time must be no more than 30 minutes.');
    let k = d(p, i.heartRateBpm, 'Finishing heart rate', { integer: !0 }),
      x = a === 'male' ? 1 : 0,
      y = 132.853 - 0.0769 * (u * m) - 0.3877 * f + 6.315 * x - 3.2649 * v - 0.1565 * k;
    return Object.freeze({
      method: 'rockport-one-mile-walk',
      age: f,
      weightKg: n === 'kg' ? u : u / h,
      walkMinutes: v,
      finishHeartRate: k,
      equationSexCoefficient: x,
      vo2Max: y,
      unit: 'mL/kg/min',
    });
  }
  function w(e) {
    if (e?.method === 'cooper') return I(e);
    if (e?.method === 'rockport') return M(e);
    throw new RangeError('Choose the Cooper 12-minute run or Rockport one-mile walk.');
  }
  var r = document.querySelector('[data-tool="vo2-max-calculator"]');
  if (r) {
    let e = r.querySelector('#tool-form'),
      t = b(r),
      n = e.elements.namedItem('method'),
      a = r.querySelector('[data-vo2-cooper]'),
      c = r.querySelector('[data-vo2-rockport]'),
      o = r.querySelector('[data-vo2-result]'),
      p = r.querySelector('[data-vo2-value]'),
      f = r.querySelector('[data-vo2-method]'),
      m = () => {
        let s = n.value === 'cooper';
        ((a.hidden = !s),
          (a.disabled = !s),
          (c.hidden = s),
          (c.disabled = s),
          (o.hidden = !0),
          l(r, ''));
      },
      u = (s) => {
        (s?.preventDefault(), (o.hidden = !0));
        try {
          let g =
            n.value === 'cooper'
              ? w({
                  method: 'cooper',
                  distance: e.elements.namedItem('distance').value,
                  unit: e.elements.namedItem('distanceUnit').value,
                })
              : w({
                  method: 'rockport',
                  age: e.elements.namedItem('age').value,
                  weight: e.elements.namedItem('weight').value,
                  weightUnit: e.elements.namedItem('weightUnit').value,
                  sexCoefficient: e.elements.namedItem('equationSex').value,
                  minutes: e.elements.namedItem('walkMinutes').value,
                  seconds: e.elements.namedItem('walkSeconds').value,
                  finishHeartRate: e.elements.namedItem('finishHeartRate').value,
                });
          ((p.textContent = new Intl.NumberFormat(document.documentElement.lang || 'en', {
            maximumFractionDigits: 1,
          }).format(g.vo2Max)),
            (f.textContent =
              n.value === 'cooper' ? t.fields.resultCooper : t.fields.resultRockport),
            (o.hidden = !1),
            l(r, t.messages.calculated, 'success'));
        } catch {
          l(r, t.messages.checkInputs, 'error');
        }
      };
    (n.addEventListener('change', m),
      e.addEventListener('submit', u),
      e.addEventListener('input', () => {
        ((o.hidden = !0), l(r, ''));
      }),
      e.addEventListener('reset', () => {
        ((o.hidden = !0), requestAnimationFrame(m));
      }),
      r.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        (n.value === 'cooper'
          ? ((e.elements.namedItem('distance').value = '2400'),
            (e.elements.namedItem('distanceUnit').value = 'm'))
          : ((e.elements.namedItem('age').value = '30'),
            (e.elements.namedItem('weight').value = '70'),
            (e.elements.namedItem('weightUnit').value = 'kg'),
            (e.elements.namedItem('equationSex').value = 'male'),
            (e.elements.namedItem('walkMinutes').value = '15'),
            (e.elements.namedItem('walkSeconds').value = '0'),
            (e.elements.namedItem('finishHeartRate').value = '150')),
          u());
      }),
      r.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
        if (!o.hidden)
          try {
            (await navigator.clipboard.writeText(
              `${p.textContent} ${t.fields.unitLabel} \u2014 ${f.textContent}`,
            ),
              l(r, t.messages.copied, 'success'));
          } catch {
            l(r, t.messages.copyUnavailable, 'error');
          }
      }),
      m());
  }
})();
