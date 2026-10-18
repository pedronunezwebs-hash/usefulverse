(() => {
  function y(c, e, t = 'info') {
    let n = c.querySelector('[data-status]');
    n && ((n.textContent = e), (n.dataset.kind = t));
  }
  var m = Object.freeze({ firstYear: 1900, lastYear: 2100, lunationDays: 29.530588853 }),
    x = 864e5,
    g = Date.UTC(2e3, 0, 6, 18, 14),
    T = Object.freeze([
      'new',
      'waxing-crescent',
      'first-quarter',
      'waxing-gibbous',
      'full',
      'waning-gibbous',
      'last-quarter',
      'waning-crescent',
    ]),
    M = Object.freeze([
      { offset: 0, key: 'new' },
      { offset: 0.25, key: 'first-quarter' },
      { offset: 0.5, key: 'full' },
      { offset: 0.75, key: 'last-quarter' },
    ]);
  function O(c) {
    let e = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(String(c ?? ''));
    if (!e) throw new TypeError('Enter a valid calendar date.');
    let [, t, n, o] = e,
      r = Number(t),
      a = Number(n),
      i = Number(o);
    if (r < m.firstYear || r > m.lastYear)
      throw new RangeError(`Choose a date from ${m.firstYear} through ${m.lastYear}.`);
    let u = Date.UTC(r, a - 1, i, 12),
      l = new Date(u);
    if (l.getUTCFullYear() !== r || l.getUTCMonth() + 1 !== a || l.getUTCDate() !== i)
      throw new TypeError('Enter a valid calendar date.');
    return { year: r, month: a, timestamp: u };
  }
  function E(c, e) {
    let t = m.lunationDays * x,
      n = Math.floor((c - g) / t) - 1,
      o = Math.ceil((e - g) / t) + 1,
      r = [];
    for (let a = n; a <= o; a += 1)
      for (let i of M) {
        let u = g + (a + i.offset) * t;
        u >= c && u < e && r.push({ phase: i.key, at: u });
      }
    return r.sort((a, i) => a.at - i.at);
  }
  function v(c) {
    let { year: e, month: t, timestamp: n } = O(c),
      o = m.lunationDays * x,
      r = (((n - g) % o) + o) % o,
      a = r / o,
      i = Math.round(a * 8) % 8,
      u = Math.round((1 - Math.cos(2 * Math.PI * a)) * 50 * 10) / 10,
      l = Date.UTC(e, t - 1, 1),
      f = Date.UTC(e, t, 1),
      h = E(n, n + o).find((p) => p.at > n) ?? null;
    return Object.freeze({
      date: c,
      phase: T[i],
      illumination: u,
      ageDays: Math.round((r / x) * 10) / 10,
      monthEvents: Object.freeze(E(l, f)),
      nextPhase: h ? Object.freeze(h) : null,
      method: 'mean-synodic-cycle',
    });
  }
  var s = document.querySelector('#tool-form');
  if (s?.classList.contains('moon-phase-calculator')) {
    let c = s.closest('[data-page]') ?? document,
      e = JSON.parse(s.parentElement.querySelector('[data-tool-copy]').textContent),
      t = s.elements.date,
      n = s.querySelector('[data-status]'),
      o = s.querySelector('[data-moon-results]'),
      r = s.querySelector('[data-moon-phase]'),
      a = s.querySelector('[data-moon-illumination]'),
      i = s.querySelector('[data-moon-age]'),
      u = s.querySelector('[data-moon-next]'),
      l = s.querySelector('[data-moon-events]'),
      f = {
        new: e.messages.phaseNew,
        'waxing-crescent': e.messages.phaseWaxingCrescent,
        'first-quarter': e.messages.phaseFirstQuarter,
        'waxing-gibbous': e.messages.phaseWaxingGibbous,
        full: e.messages.phaseFull,
        'waning-gibbous': e.messages.phaseWaningGibbous,
        'last-quarter': e.messages.phaseLastQuarter,
        'waning-crescent': e.messages.phaseWaningCrescent,
      },
      h = (d) =>
        new Intl.DateTimeFormat(void 0, {
          timeZone: 'UTC',
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(d),
      p = () => {
        try {
          let d = v(t.value);
          ((r.textContent = f[d.phase]),
            (a.textContent = e.messages.illuminationValue.replace(
              '{value}',
              String(d.illumination),
            )),
            (i.textContent = e.messages.ageValue.replace('{value}', String(d.ageDays))),
            (u.textContent = d.nextPhase
              ? `${f[d.nextPhase.phase]} \u2014 ${h(d.nextPhase.at)} UTC`
              : e.messages.noNextPhase),
            l.replaceChildren());
          for (let w of d.monthEvents) {
            let b = document.createElement('tr'),
              C = document.createElement('td');
            C.textContent = f[w.phase];
            let S = document.createElement('td');
            ((S.textContent = `${h(w.at)} UTC`), b.append(C, S), l.append(b));
          }
          ((o.hidden = !1), y(c, e.messages.calculated, 'success'));
        } catch {
          ((o.hidden = !0), l.replaceChildren(), y(c, e.messages.invalid, 'error'));
        }
      },
      q = new Date().toISOString().slice(0, 10);
    ((t.value = q),
      s.querySelector('[data-action="calculate"]').addEventListener('click', p),
      s.querySelector('[data-action="today"]').addEventListener('click', () => {
        ((t.value = new Date().toISOString().slice(0, 10)), p());
      }),
      t.addEventListener('change', () => {
        ((o.hidden = !0), (n.textContent = ''));
      }));
  }
})();
