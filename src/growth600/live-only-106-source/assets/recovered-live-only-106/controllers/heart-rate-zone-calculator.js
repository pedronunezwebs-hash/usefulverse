(() => {
  var I = Object.freeze({ age: [18, 100], maximum: [80, 240], resting: [30, 120] }),
    q = Object.freeze([50, 60, 70, 80, 90, 100]);
  function $(t, [e, n], m) {
    let u = Number(t);
    if (!Number.isInteger(u) || u < e || u > n)
      throw Object.assign(new RangeError(`${m} must be a whole number from ${e} to ${n}.`), {
        code: `${m}Range`,
      });
    return u;
  }
  function O({
    method: t = 'max',
    maxSource: e = 'estimated',
    age: n,
    knownMaximum: m,
    restingHeartRate: u,
    boundaries: h = q,
  }) {
    if (!['max', 'karvonen'].includes(t))
      throw Object.assign(new RangeError('Choose a supported zone method.'), { code: 'method' });
    if (!['estimated', 'known'].includes(e))
      throw Object.assign(new RangeError('Choose estimated or measured maximum heart rate.'), {
        code: 'maxSource',
      });
    let x = e === 'estimated' ? 220 - $(n, I.age, 'age') : $(m, I.maximum, 'maximum'),
      o = null;
    if (t === 'karvonen' && ((o = $(u, I.resting, 'resting')), x <= o))
      throw Object.assign(new RangeError('Maximum heart rate must exceed resting heart rate.'), {
        code: 'maxMustExceedRest',
      });
    if (!Array.isArray(h) || h.length !== 6)
      throw Object.assign(new RangeError('Enter six zone boundary percentages.'), {
        code: 'boundariesCount',
      });
    let i = h.map((p) => {
      let r = Number(p);
      if (!Number.isInteger(r) || r < 0 || r > 100)
        throw Object.assign(
          new RangeError('Zone percentages must be whole numbers from 0 to 100.'),
          { code: 'boundaryRange' },
        );
      return r;
    });
    if (i.some((p, r) => r > 0 && p <= i[r - 1]))
      throw Object.assign(new RangeError('Zone boundaries must increase from left to right.'), {
        code: 'boundaryOrder',
      });
    let g = x - (o ?? 0),
      b = i.slice(0, -1).map((p, r) => {
        let a = i[r + 1],
          w = (l) => (t === 'karvonen' ? o + (g * l) / 100 : (x * l) / 100);
        return Object.freeze({
          number: r + 1,
          lowerPercent: p,
          upperPercent: a,
          lowerBpm: w(p),
          upperBpm: w(a),
        });
      });
    return Object.freeze({
      method: t,
      maxSource: e,
      maxHeartRate: x,
      age: e === 'estimated' ? Number(n) : null,
      restingHeartRate: o,
      reserve: t === 'karvonen' ? g : null,
      boundaries: Object.freeze(i),
      zones: Object.freeze(b),
    });
  }
  function T(t = document) {
    let e = t.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function f(t, e, n = 'info') {
    let m = t.querySelector('[data-status]');
    m && ((m.textContent = e), (m.dataset.kind = n));
  }
  function j(t) {
    let e = t.querySelector('[data-result]'),
      n = t.querySelector('[data-result-content]');
    (e && (e.hidden = !0), n && n.replaceChildren());
  }
  async function L(t, e, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(e), f(t, n.messages.copied, 'success'));
    } catch {
      f(t, n.messages.copyUnavailable, 'error');
    }
  }
  var c = document.querySelector('[data-tool="heart-rate-zone-calculator"]');
  if (c) {
    let g = function () {
        let r = t.elements.namedItem('maxSource').value === 'known';
        ((m.hidden = r),
          (m.querySelector('input').disabled = r),
          (u.hidden = !r),
          (u.querySelector('input').disabled = !r));
        let a = t.elements.namedItem('method').value === 'karvonen';
        ((h.hidden = !a), (h.querySelector('input').disabled = !a));
      },
      b = function () {
        (j(c), (n.hidden = !0), n.replaceChildren(), (i = ''));
      },
      p = function (r) {
        (r?.preventDefault(), b(), f(c, ''));
        try {
          let a = new FormData(t),
            w = Array.from({ length: 6 }, (s, d) => Number(a.get(`boundary${d}`))),
            l = O({
              method: a.get('method'),
              maxSource: a.get('maxSource'),
              age: a.get('age'),
              knownMaximum: a.get('knownMaximum'),
              restingHeartRate: a.get('restingHeartRate'),
              boundaries: w,
            }),
            C = document.createElement('caption');
          C.textContent = e.fields.tableCaption;
          let E = document.createElement('table');
          E.append(C);
          let N = document.createElement('thead'),
            S = document.createElement('tr');
          for (let s of [e.fields.zone, e.fields.intensity, e.fields.heartRate]) {
            let d = document.createElement('th');
            ((d.scope = 'col'), (d.textContent = s), S.append(d));
          }
          (N.append(S), E.append(N));
          let v = document.createElement('tbody');
          for (let s of l.zones) {
            let d = document.createElement('tr'),
              R = document.createElement('th');
            ((R.scope = 'row'), (R.textContent = `${e.fields.zone} ${s.number}`));
            let z = document.createElement('td');
            z.textContent = `${o.format(s.lowerPercent)}\u2013${o.format(s.upperPercent)}%`;
            let k = document.createElement('td');
            ((k.textContent = `${o.format(s.lowerBpm)}\u2013${o.format(s.upperBpm)} ${e.fields.bpm}`),
              d.append(R, z, k),
              v.append(d));
          }
          E.append(v);
          let y = document.createElement('p');
          if (
            ((y.className = 'hint'),
            (y.textContent = `${e.fields.maximum}: ${o.format(l.maxHeartRate)} ${e.fields.bpm}${l.age === null ? '' : ` (${e.fields.age}: ${o.format(l.age)})`}`),
            n.append(y),
            l.method === 'karvonen')
          ) {
            let s = document.createElement('p');
            ((s.className = 'hint'),
              (s.textContent = `${e.fields.restingHeartRate}: ${o.format(l.restingHeartRate)} ${e.fields.bpm}; ${e.fields.reserve}: ${o.format(l.reserve)} ${e.fields.bpm}`),
              n.append(s));
          }
          (n.append(E),
            (n.hidden = !1),
            (i = `${y.textContent}
${[...v.rows].map((s) => [...s.cells].map((d) => d.textContent).join('	')).join(`
`)}

${e.fields.safetyNote}`),
            f(c, e.messages.calculated, 'success'));
        } catch (a) {
          f(c, e.messages[a?.code] ?? e.messages.checkInputs, 'error');
        }
      },
      t = c.querySelector('#tool-form'),
      e = T(c),
      n = c.querySelector('[data-zone-results]'),
      m = t.elements.namedItem('age').closest('.field'),
      u = t.elements.namedItem('knownMaximum').closest('.field'),
      h = t.elements.namedItem('restingHeartRate').closest('.field'),
      x = e.copyLanguage === 'zh_tw' ? 'zh-TW' : e.copyLanguage,
      o = new Intl.NumberFormat(x, { maximumFractionDigits: 1 }),
      i = '';
    (t.addEventListener('submit', p),
      t.addEventListener('input', () => {
        (b(), f(c, ''));
      }),
      t.elements.namedItem('method').addEventListener('change', () => {
        (g(), b());
      }),
      t.elements.namedItem('maxSource').addEventListener('change', () => {
        (g(), b());
      }),
      c.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('method').value = 'karvonen'),
          (t.elements.namedItem('maxSource').value = 'known'),
          (t.elements.namedItem('knownMaximum').value = '180'),
          (t.elements.namedItem('restingHeartRate').value = '60'),
          g(),
          p(),
          f(c, e.messages.exampleLoaded, 'success'));
      }),
      c.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        i && L(c, i, e);
      }),
      t.addEventListener('reset', () => {
        setTimeout(() => {
          (g(), b(), f(c, ''));
        }, 0);
      }),
      g());
  }
})();
