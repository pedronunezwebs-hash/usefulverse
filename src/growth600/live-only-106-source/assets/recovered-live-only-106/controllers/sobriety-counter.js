(() => {
  function q(n = document) {
    let e = n.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function m(n, e, r = 'info') {
    let s = n.querySelector('[data-status]');
    s && ((s.textContent = e), (s.dataset.kind = r));
  }
  function M(n) {
    let e = n.querySelector('[data-result]'),
      r = n.querySelector('[data-result-content]');
    (e && (e.hidden = !0), r && r.replaceChildren());
  }
  function x(n, e, r = 2) {
    return new Intl.NumberFormat(n, { maximumFractionDigits: r }).format(e);
  }
  async function L(n, e, r) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(e), m(n, r.messages.copied, 'success'));
    } catch {
      m(n, r.messages.copyUnavailable, 'error');
    }
  }
  var _ = Object.freeze([1, 7, 30, 60, 90, 180, 365, 500, 1e3, 1825, 3650]);
  function S(n) {
    if (typeof n != 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(n)) return !1;
    let [e, r, s] = n.split('-').map(Number);
    if (e < 1970 || e > 2100) return !1;
    let i = new Date(Date.UTC(e, r - 1, s));
    return i.getUTCFullYear() === e && i.getUTCMonth() === r - 1 && i.getUTCDate() === s;
  }
  function A(n, e = new Date().toISOString().slice(0, 10), r = _) {
    if (!S(n) || !S(e)) throw new RangeError('Enter valid calendar dates.');
    let s = Date.parse(`${n}T00:00:00.000Z`),
      i = Date.parse(`${e}T00:00:00.000Z`);
    if (s > i) throw new RangeError('The start date cannot be in the future.');
    if (
      !Array.isArray(r) ||
      r.length > 50 ||
      r.some((c) => !Number.isInteger(c) || c < 1 || c > 1e5)
    )
      throw new RangeError('Milestones must be whole days from 1 to 100,000.');
    let f = Math.floor((i - s) / 864e5),
      u = [...new Set(r)].sort((c, y) => c - y).find((c) => c > f) ?? null;
    return Object.freeze({
      startDate: n,
      today: e,
      days: f,
      nextMilestone: u,
      daysToNextMilestone: u === null ? null : u - f,
      milestones: Object.freeze(
        [...new Set(r)]
          .sort((c, y) => c - y)
          .map((c) =>
            Object.freeze({
              day: c,
              reached: c <= f,
              date: new Date(s + c * 864e5).toISOString().slice(0, 10),
            }),
          ),
      ),
    });
  }
  var z = Object.freeze({ minYear: 1970, maxYear: 2100, maxNoteLength: 280, maxSavedEntries: 30 });
  var o = document.querySelector('[data-tool="sobriety-counter"]');
  if (o) {
    let v = function (a = new Date()) {
        return `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, '0')}-${String(a.getDate()).padStart(2, '0')}`;
      },
      T = function (a) {
        let [t, d, p] = a.split('-').map(Number);
        return new Intl.DateTimeFormat(g(), {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        }).format(new Date(Date.UTC(t, d - 1, p)));
      },
      C = function () {
        if ((s.querySelector('[data-history]')?.remove(), !i.checked)) return;
        let a;
        try {
          a = JSON.parse(localStorage.getItem(y) ?? '[]');
        } catch {
          return;
        }
        if (!Array.isArray(a) || !a.length) return;
        let t = document.createElement('section');
        t.dataset.history = '';
        let d = document.createElement('h3');
        ((d.textContent = e.fields.history), t.append(d));
        let p = document.createElement('ul');
        for (let l of a.slice(0, 30)) {
          if (
            !l ||
            !S(l.startDate) ||
            !S(l.throughDate) ||
            typeof l.note != 'string' ||
            l.note.length > 280
          )
            continue;
          let E = document.createElement('li');
          ((E.textContent = `${T(l.startDate)} \u2014 ${e.fields.days}: ${x(g(), A(l.startDate, l.throughDate).days, 0)}${l.note ? ` \u2014 ${l.note}` : ''}`),
            p.append(E));
        }
        (t.append(p), s.append(t));
      },
      N = function () {
        if (!i.checked) return;
        let a = { startDate: f.value, throughDate: u.value, note: c.value.trim() };
        try {
          let t = JSON.parse(localStorage.getItem(y) ?? '[]'),
            d = Array.isArray(t) ? t.filter((p) => p?.startDate !== a.startDate) : [];
          (localStorage.setItem(y, JSON.stringify([a, ...d].slice(0, 30))),
            C(),
            m(o, e.messages.saved, 'success'));
        } catch {
          m(o, e.messages.saveUnavailable, 'error');
        }
      },
      k = function (a) {
        let t = document.createElement('div');
        ((t.className = 'sobriety-table-scroll'),
          (t.tabIndex = 0),
          t.setAttribute('role', 'region'),
          t.setAttribute('aria-label', e.fields.tableCaption));
        let d = document.createElement('table'),
          p = document.createElement('caption');
        ((p.textContent = e.fields.tableCaption), d.append(p));
        let l = document.createElement('thead'),
          E = document.createElement('tr');
        for (let h of [e.fields.milestone, e.fields.milestoneDate, e.fields.status]) {
          let w = document.createElement('th');
          ((w.scope = 'col'), (w.textContent = h), E.append(w));
        }
        (l.append(E), d.append(l));
        let I = document.createElement('tbody');
        for (let h of a.milestones) {
          let w = document.createElement('tr'),
            R = document.createElement('th');
          ((R.scope = 'row'), (R.textContent = `${x(g(), h.day, 0)} ${e.fields.days}`));
          let O = document.createElement('td');
          O.textContent = T(h.date);
          let Y = document.createElement('td');
          ((Y.textContent = h.reached ? e.fields.reached : e.fields.upcoming),
            w.append(R, O, Y),
            I.append(w));
        }
        (d.append(I), t.append(d), s.append(t));
      },
      $ = function (a) {
        (a?.preventDefault(), M(o), s.replaceChildren(), (b = ''), (D = null));
        try {
          if (!S(f.value) || !S(u.value) || c.value.length > 280)
            throw new RangeError('Check the dates and note.');
          let t = A(f.value, u.value, _);
          D = t;
          let d = document.createElement('dl'),
            p = [
              [e.fields.elapsedDays, x(g(), t.days, 0)],
              [
                e.fields.nextMilestone,
                t.nextMilestone === null
                  ? e.fields.reached
                  : `${x(g(), t.nextMilestone, 0)} ${t.nextMilestone === 1 ? e.fields.day : e.fields.days}`,
              ],
              [
                e.fields.daysRemaining,
                t.daysToNextMilestone === null ? '\u2014' : x(g(), t.daysToNextMilestone, 0),
              ],
            ];
          for (let [l, E] of p) {
            let I = document.createElement('dt');
            I.textContent = l;
            let h = document.createElement('dd');
            ((h.textContent = E), d.append(I, h));
          }
          (s.append(d),
            k(t),
            C(),
            (r.hidden = !1),
            (b = `${e.fields.startDate}: ${T(t.startDate)}
${e.fields.elapsedDays}: ${x(g(), t.days, 0)}
${e.fields.nextMilestone}: ${t.nextMilestone ?? e.fields.reached}`),
            N(),
            i.checked || m(o, e.messages.calculated, 'success'));
        } catch {
          m(o, e.messages.checkInputs, 'error');
        }
      },
      U = function () {
        let a = v();
        ((u.max = a), (f.max = a));
      },
      n = o.querySelector('#tool-form'),
      e = q(o),
      r = o.querySelector('[data-result]'),
      s = o.querySelector('[data-result-content]'),
      i = n.elements.namedItem('saveConsent'),
      f = n.elements.namedItem('startDate'),
      u = n.elements.namedItem('throughDate'),
      c = n.elements.namedItem('note'),
      y = 'usefulverse:sobriety-counter:v1',
      g = () => document.documentElement.lang || 'en',
      D = null,
      b = '';
    (U(),
      (u.value = v()),
      n.addEventListener('submit', $),
      n.addEventListener('input', (a) => {
        a.target !== i && (M(o), s.replaceChildren(), (b = ''), (D = null), m(o, ''));
      }),
      n.addEventListener('reset', () => {
        (M(o),
          s.replaceChildren(),
          (b = ''),
          (D = null),
          m(o, ''),
          setTimeout(() => {
            ((u.value = v()), (f.max = u.max = v()));
          }, 0));
      }),
      o.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        let a = new Date();
        (a.setDate(a.getDate() - 30),
          (f.value = v(a)),
          (u.value = v()),
          $(),
          m(o, e.messages.exampleLoaded, 'success'));
      }),
      i.addEventListener('change', () => {
        i.checked && D ? N() : C();
      }),
      o.querySelector('[data-action="clearSaved"]')?.addEventListener('click', () => {
        try {
          (localStorage.removeItem(y), (i.checked = !1), C(), m(o, e.messages.deleted, 'success'));
        } catch {
          m(o, e.messages.saveUnavailable, 'error');
        }
      }),
      o.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        b && L(o, b, e);
      }));
  }
})();
