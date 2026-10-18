(() => {
  var y = Object.freeze({ sunday: 0, monday: 1, saturday: 6 });
  function S(e) {
    if (typeof e != 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(e))
      throw new TypeError('Enter a valid calendar date.');
    let [t, r, n] = e.split('-').map(Number),
      a = new Date(0);
    if (
      (a.setUTCHours(0, 0, 0, 0),
      a.setUTCFullYear(t, r - 1, n),
      a.getUTCFullYear() !== t || a.getUTCMonth() !== r - 1 || a.getUTCDate() !== n)
    )
      throw new RangeError('Enter a valid calendar date.');
    return a;
  }
  function f(e, t) {
    let r = new Date(e),
      n = (e.getUTCDay() - t + 7) % 7;
    return (r.setUTCDate(r.getUTCDate() - n), r);
  }
  function U(e) {
    let t = new Date(e);
    t.setUTCDate(e.getUTCDate() + 3 - ((e.getUTCDay() + 6) % 7));
    let r = t.getUTCFullYear(),
      n = new Date(0);
    (n.setUTCHours(0, 0, 0, 0), n.setUTCFullYear(r, 0, 4));
    let a = f(n, 1),
      l = f(e, 1);
    return { week: Math.floor((l - a) / 6048e5) + 1, weekYear: r, weekStart: l };
  }
  function p({ date: e, mode: t = 'iso', weekStart: r = 'sunday' } = {}) {
    let n = S(e);
    if (t === 'iso') {
      let m = U(n),
        i = new Date(m.weekStart);
      return (
        i.setUTCDate(i.getUTCDate() + 6),
        Object.freeze({
          ...m,
          weekEnd: i,
          mode: 'iso',
          calendarYear: n.getUTCFullYear(),
          weekStartDay: 'monday',
        })
      );
    }
    if (t !== 'custom') throw new TypeError('Choose ISO 8601 or a supported calendar-week system.');
    if (!Object.hasOwn(y, r))
      throw new TypeError('Choose Sunday, Monday, or Saturday as the first day of the week.');
    let a = y[r],
      l = f(n, a),
      u = new Date(0);
    (u.setUTCHours(0, 0, 0, 0), u.setUTCFullYear(n.getUTCFullYear(), 0, 1));
    let c = f(u, a),
      o = new Date(l);
    return (
      o.setUTCDate(o.getUTCDate() + 6),
      Object.freeze({
        week: Math.floor((l - c) / 6048e5) + 1,
        weekYear: n.getUTCFullYear(),
        calendarYear: n.getUTCFullYear(),
        weekStart: l,
        weekEnd: o,
        mode: 'custom',
        weekStartDay: r,
      })
    );
  }
  function g(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function d(e, t, r = 'info') {
    let n = e.querySelector('[data-status]');
    n && ((n.textContent = t), (n.dataset.kind = r));
  }
  function w(e) {
    let t = e.querySelector('[data-result]'),
      r = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), r && r.replaceChildren());
  }
  function T(e, t) {
    let r = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    if (!r || !n) return;
    let a = document.createElement('dl');
    for (let [l, u] of t) {
      let c = document.createElement('dt'),
        o = document.createElement('dd');
      ((c.textContent = l), (o.textContent = u), a.append(c, o));
    }
    (n.replaceChildren(a), (r.hidden = !1));
  }
  async function C(e, t, r) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), d(e, r.messages.copied, 'success'));
    } catch {
      d(e, r.messages.copyUnavailable, 'error');
    }
  }
  var s = document.querySelector('[data-tool="week-number-calculator"]');
  if (s) {
    let l = function (c) {
        (c?.preventDefault(), w(s), (n = ''));
        try {
          let o = p({
              date: e.elements.namedItem('date').value,
              mode: e.elements.namedItem('mode').value,
              weekStart: e.elements.namedItem('weekStart').value,
            }),
            m = o.mode === 'iso' ? o.weekYear : o.calendarYear,
            i = [
              [t.messages.weekNumber, String(o.week)],
              [t.messages.weekYear, String(m)],
              [t.messages.weekStarts, a(o.weekStart)],
              [t.messages.weekEnds, a(o.weekEnd)],
            ];
          (T(s, i),
            (n = i.map(([k, h]) => `${k}: ${h}`).join(`
`)),
            d(s, t.messages.calculated, 'success'));
        } catch {
          d(s, t.messages.checkInputs, 'error');
        }
      },
      u = function () {
        let c = e.elements.namedItem('mode').value === 'custom',
          o = s.querySelector('[data-week-input="custom"]');
        o && (o.hidden = !c);
      },
      e = s.querySelector('#tool-form'),
      t = g(s),
      r = document.documentElement.lang || 'en',
      n = '',
      a = (c) => new Intl.DateTimeFormat(r, { dateStyle: 'long', timeZone: 'UTC' }).format(c);
    (e.addEventListener('change', (c) => {
      c.target?.name === 'mode' && u();
    }),
      e.addEventListener('submit', l),
      s.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((e.elements.namedItem('date').value = '2021-01-01'),
          (e.elements.namedItem('mode').value = 'iso'),
          u(),
          l());
      }),
      e.addEventListener('reset', () =>
        setTimeout(() => {
          ((n = ''), w(s), d(s, ''));
        }, 0),
      ),
      s.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        n && C(s, n, t);
      }),
      u());
  }
})();
