(() => {
  var q = Object.freeze(['km', 'mi']),
    k = Object.freeze(['L', 'us-gal', 'imp-gal']),
    R = 100,
    C = 1.609344,
    U = 3.785411784,
    K = 4.54609;
  function D(e, o) {
    if (!Number.isFinite(e) || e <= 0) throw new RangeError(`${o} must be greater than zero.`);
    return e;
  }
  function A(e, o) {
    if (!q.includes(o)) throw new RangeError('Choose km or miles.');
    return o === 'mi' ? e * C : e;
  }
  function _(e, o) {
    if (!k.includes(o)) throw new RangeError('Choose a supported fuel-volume unit.');
    return o === 'us-gal' ? e * U : o === 'imp-gal' ? e * K : e;
  }
  function $(e, o, a = null) {
    let r = e / C,
      s = o / U,
      l = o / K;
    return Object.freeze({
      litersPer100Km: (o / e) * 100,
      kmPerLiter: e / o,
      usMpg: r / s,
      imperialMpg: r / l,
      costPerKm: a === null ? null : a / e,
      costPerMile: a === null ? null : a / r,
    });
  }
  function j({
    distance: e,
    distanceUnit: o = 'km',
    fuel: a,
    volumeUnit: r = 'L',
    cost: s = null,
  } = {}) {
    if ((D(e, 'Distance'), D(a, 'Fuel'), !q.includes(o)))
      throw new RangeError('Choose km or miles.');
    if (!k.includes(r)) throw new RangeError('Choose a supported fuel-volume unit.');
    if (s !== null && (!Number.isFinite(s) || s < 0))
      throw new RangeError('Cost must be zero or greater.');
    let l = A(e, o),
      i = _(a, r),
      v = $(l, i, s);
    if (
      Object.entries(v).some(
        ([m, d]) =>
          d !== null && (!Number.isFinite(d) || (m.startsWith('costPer') ? d < 0 : d <= 0)),
      )
    )
      throw new RangeError('The values are outside the supported calculation range.');
    return Object.freeze({ distanceKm: l, distanceMiles: l / C, fuelLiters: i, ...v });
  }
  function N(
    e,
    {
      distance: o,
      distanceUnit: a = 'km',
      fuel: r,
      volumeUnit: s = 'L',
      cost: l = 0,
      currency: i = 'USD',
      date: v = '',
    } = {},
  ) {
    if (!Array.isArray(e)) throw new TypeError('Fuel log must be an array.');
    if (e.length >= R) throw new RangeError(`The log is limited to ${R} entries.`);
    if (typeof i != 'string' || !/^[A-Z]{3}$/u.test(i))
      throw new RangeError('Choose a valid currency code.');
    if (e.length && e.some((f) => (f.currency ?? 'USD') !== i))
      throw new RangeError('Use the same currency for every log entry.');
    let m = j({ distance: o, distanceUnit: a, fuel: r, volumeUnit: s, cost: l }),
      d = v || new Date().toISOString().slice(0, 10);
    if (typeof d != 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(d))
      throw new RangeError('Enter a valid date.');
    let [w, E, F] = d.split('-').map(Number),
      L = new Date(Date.UTC(w, E - 1, F));
    if (L.getUTCFullYear() !== w || L.getUTCMonth() !== E - 1 || L.getUTCDate() !== F)
      throw new RangeError('Enter a valid date.');
    let u = Object.freeze({
      id: `${d}-${e.length + 1}-${Math.random().toString(36).slice(2, 9)}`,
      date: d,
      distanceUnit: a,
      volumeUnit: s,
      originalDistance: o,
      originalFuel: r,
      distanceKm: m.distanceKm,
      distanceMiles: m.distanceMiles,
      fuelLiters: m.fuelLiters,
      cost: l,
      currency: i,
      ...$(m.distanceKm, m.fuelLiters, l),
    });
    return Object.freeze([...e, u]);
  }
  function T(e) {
    if (!Array.isArray(e)) throw new TypeError('Fuel log must be an array.');
    if (e.length === 0) return null;
    let o = e[0]?.currency ?? 'USD';
    if (e.some((r) => (r.currency ?? 'USD') !== o))
      throw new RangeError('Fuel log contains mixed currencies.');
    let a = e.reduce(
      (r, s) => {
        for (let l of ['distanceKm', 'distanceMiles', 'fuelLiters', 'cost']) {
          if (!Number.isFinite(s?.[l]) || s[l] < 0 || (l !== 'cost' && s[l] === 0))
            throw new RangeError('Fuel log contains an invalid entry.');
          r[l] += s[l];
        }
        return r;
      },
      { distanceKm: 0, distanceMiles: 0, fuelLiters: 0, cost: 0 },
    );
    if (a.distanceKm <= 0 || a.distanceMiles <= 0 || a.fuelLiters <= 0)
      throw new RangeError('Fuel log totals must be greater than zero.');
    return Object.freeze({
      entries: e.length,
      currency: o,
      ...a,
      ...$(a.distanceKm, a.fuelLiters, a.cost),
    });
  }
  function G(e) {
    return `"${String(e ?? '').replaceAll('"', '""')}"`;
  }
  function O(e) {
    if (!Array.isArray(e)) throw new TypeError('Fuel log must be an array.');
    let o = [
        'Date',
        'Distance km',
        'Fuel L',
        'Cost',
        'Currency',
        'L/100 km',
        'km/L',
        'US MPG',
        'Imperial MPG',
        'Cost/km',
        'Cost/mile',
      ],
      a = e.map((r) => [
        r.date,
        r.distanceKm,
        r.fuelLiters,
        r.cost,
        r.currency ?? 'USD',
        r.litersPer100Km,
        r.kmPerLiter,
        r.usMpg,
        r.imperialMpg,
        r.costPerKm,
        r.costPerMile,
      ]);
    return `\uFEFF${[o, ...a].map((r) => r.map(G).join(',')).join(`\r
`)}`;
  }
  var c = document.querySelector('[data-tool="fuel-economy-calculator"]');
  if (c) {
    let b = function () {
        let t = T(u);
        if (
          (E.replaceChildren(),
          (F.hidden = u.length > 0),
          (L.disabled = u.length === 0),
          (m.disabled = u.length > 0),
          !t)
        ) {
          w.hidden = !0;
          return;
        }
        ((w.hidden = !1),
          I(c.querySelector('[data-summary-metrics]'), t, t.cost, 'weighted'),
          M('totalDistance', `${f(t.distanceKm / (s.value === 'mi' ? 1.609344 : 1))} ${s.value}`),
          M(
            'totalFuel',
            `${f(t.fuelLiters / (i.value === 'us-gal' ? 3.785411784 : i.value === 'imp-gal' ? 4.54609 : 1))} ${i.value}`,
          ),
          M('totalCost', S(t.cost)));
        for (let n of u) {
          let g = document.createElement('tr');
          for (let z of [
            n.date,
            `${f(n.distanceKm / (s.value === 'mi' ? 1.609344 : 1))} ${s.value}`,
            `${f(n.fuelLiters / (i.value === 'us-gal' ? 3.785411784 : i.value === 'imp-gal' ? 4.54609 : 1))} ${i.value}`,
            S(n.cost),
            f(n.litersPer100Km),
            `${S(s.value === 'mi' ? n.costPerMile : n.costPerKm)} / ${s.value}`,
          ]) {
            let P = document.createElement('td');
            ((P.textContent = z), g.append(P));
          }
          let h = document.createElement('td'),
            p = document.createElement('button');
          ((p.type = 'button'),
            (p.className = 'button button--secondary'),
            (p.dataset.removeId = n.id),
            (p.textContent = e.actions.remove),
            h.append(p),
            g.append(h),
            E.append(g));
        }
      },
      e = JSON.parse(c.querySelector('[data-tool-copy]')?.textContent ?? '{}'),
      o = c.querySelector('[data-fuel-form]'),
      a = c.querySelector('[data-date]'),
      r = c.querySelector('[data-distance]'),
      s = c.querySelector('[data-distance-unit]'),
      l = c.querySelector('[data-fuel]'),
      i = c.querySelector('[data-volume-unit]'),
      v = c.querySelector('[data-cost]'),
      m = c.querySelector('[data-currency]'),
      d = c.querySelector('[data-status]'),
      w = c.querySelector('[data-results]'),
      E = c.querySelector('[data-history-body]'),
      F = c.querySelector('[data-history-empty]'),
      L = c.querySelector('[data-action="export"]'),
      u = [],
      f = (t) => new Intl.NumberFormat(void 0, { maximumFractionDigits: 2 }).format(t),
      S = (t) => {
        try {
          return new Intl.NumberFormat(void 0, {
            style: 'currency',
            currency: m.value,
            maximumFractionDigits: 3,
          }).format(t);
        } catch {
          return `${f(t)} ${m.value}`;
        }
      },
      y = (t) => {
        d.textContent = t;
      },
      M = (t, n) => {
        let g = c.querySelector(`[data-output="${t}"]`);
        g && (g.textContent = n);
      },
      x = () => {
        let t = new Date();
        return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
      },
      I = (t, n, g, h) => {
        ((t.querySelector('[data-metric="litersPer100Km"]').textContent =
          `${f(n.litersPer100Km)} L/100 km`),
          (t.querySelector('[data-metric="kmPerLiter"]').textContent = `${f(n.kmPerLiter)} km/L`),
          (t.querySelector('[data-metric="usMpg"]').textContent = `${f(n.usMpg)} MPG`),
          (t.querySelector('[data-metric="imperialMpg"]').textContent = `${f(n.imperialMpg)} MPG`),
          (t.querySelector('[data-metric="costPerDistance"]').textContent =
            g === null ? '\u2014' : `${S(n.costPerKm)} / km \xB7 ${S(n.costPerMile)} / mi`),
          (t.dataset.distanceLabel = h));
      };
    (o.addEventListener('submit', (t) => {
      t.preventDefault();
      try {
        ((u = N(u, {
          date: a.value,
          distance: Number(r.value),
          distanceUnit: s.value,
          fuel: Number(l.value),
          volumeUnit: i.value,
          cost: Number(v.value),
          currency: m.value,
        })),
          o.reset(),
          (a.value = x()),
          (m.value = u[0].currency),
          b(),
          y(e.messages.added),
          r.focus());
      } catch (n) {
        y(
          n instanceof RangeError && /limited/u.test(n.message)
            ? e.messages.maximum
            : e.messages.invalid,
        );
      }
    }),
      c.addEventListener('click', (t) => {
        let n = t.target.closest('button');
        if (!(!n || !c.contains(n))) {
          if (n.dataset.removeId) {
            ((u = u.filter(({ id: g }) => g !== n.dataset.removeId)), b(), y(e.messages.removed));
            return;
          }
          if (n.matches('[data-action="clear"]')) {
            ((u = []), b(), y(e.messages.cleared));
            return;
          }
          if (n.matches('[data-action="export"]')) {
            if (!u.length) {
              y(e.messages.emptyExport);
              return;
            }
            try {
              let g = new Blob([O(u)], { type: 'text/csv;charset=utf-8' }),
                h = URL.createObjectURL(g),
                p = document.createElement('a');
              ((p.href = h),
                (p.download = 'fuel-economy-log.csv'),
                p.click(),
                setTimeout(() => URL.revokeObjectURL(h), 0),
                y(e.messages.exported));
            } catch {
              y(e.messages.exportUnavailable);
            }
          }
        }
      }));
    for (let t of [s, i, m]) t.addEventListener('change', b);
    ((a.value = x()), b());
  }
})();
