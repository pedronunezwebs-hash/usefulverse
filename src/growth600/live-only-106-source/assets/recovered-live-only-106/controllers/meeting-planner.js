(() => {
  function L(n, t, e = 'info') {
    let r = n.querySelector('[data-status]');
    r && ((r.textContent = t), (r.dataset.kind = e));
  }
  var b = Object.freeze({ maxZones: 8, maxDays: 14, maxResults: 100, stepMinutes: 15 }),
    _ = 864e5,
    M = new Map();
  function z(n) {
    if (!M.has(n))
      try {
        M.set(
          n,
          new Intl.DateTimeFormat('en-CA-u-ca-gregory-nu-latn', {
            timeZone: n,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23',
            weekday: 'short',
          }),
        );
      } catch {
        throw new TypeError(`Unsupported IANA time zone: ${n}.`);
      }
    return M.get(n);
  }
  function R(n, t) {
    let e = Object.fromEntries(
      z(t)
        .formatToParts(n)
        .map(({ type: r, value: i }) => [r, i]),
    );
    return {
      year: Number(e.year),
      month: Number(e.month),
      day: Number(e.day),
      hour: Number(e.hour),
      minute: Number(e.minute),
      second: Number(e.second),
      weekday: e.weekday,
    };
  }
  function V(n) {
    let t = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(String(n ?? ''));
    if (!t) throw new TypeError('Enter a valid calendar date.');
    let [e, r, i] = t.slice(1).map(Number);
    if (e < 2020 || e > 2100) throw new RangeError('Choose a start date from 2020 through 2100.');
    let S = Date.UTC(e, r - 1, i),
      l = new Date(S);
    if (l.getUTCFullYear() !== e || l.getUTCMonth() + 1 !== r || l.getUTCDate() !== i)
      throw new TypeError('Enter a real calendar date.');
    return {
      year: e,
      month: r,
      day: i,
      at: S,
      key: `${String(e).padStart(4, '0')}-${String(r).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
    };
  }
  function k(n) {
    let t = /^(\d{2}):(\d{2})$/u.exec(String(n ?? ''));
    if (!t) throw new TypeError('Enter a valid local time in 24-hour HH:MM format.');
    let e = Number(t[1]),
      r = Number(t[2]);
    if (e > 23 || r > 59) throw new TypeError('Enter a valid local time in 24-hour HH:MM format.');
    return e * 60 + r;
  }
  function P(n) {
    let t = new Date(n);
    return `${String(t.getUTCFullYear()).padStart(4, '0')}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`;
  }
  function O(n) {
    let [t, e, r] = n.split('-').map(Number);
    return { year: t, month: e, day: r, at: Date.UTC(t, e - 1, r) };
  }
  function q(n, t, e) {
    let r = O(n),
      i = Math.floor(t / 1440),
      S = ((t % 1440) + 1440) % 1440,
      l = r.at + i * _ + S * 6e4,
      y = new Date(l),
      o = {
        year: y.getUTCFullYear(),
        month: y.getUTCMonth() + 1,
        day: y.getUTCDate(),
        hour: y.getUTCHours(),
        minute: y.getUTCMinutes(),
        second: 0,
      },
      u = new Set();
    for (let s = -36; s <= 36; s += 12) {
      let c = l + s * 36e5,
        h = R(c, e),
        f =
          Date.UTC(h.year, h.month - 1, h.day, h.hour, h.minute, h.second) -
          Math.floor(c / 1e3) * 1e3;
      u.add(f);
    }
    return (
      [...u]
        .map((s) => l - s)
        .filter((s) => {
          let c = R(s, e);
          return (
            c.year === o.year &&
            c.month === o.month &&
            c.day === o.day &&
            c.hour === o.hour &&
            c.minute === o.minute
          );
        })
        .sort((s, c) => s - c)[0] ?? null
    );
  }
  function N(n, t) {
    return P(O(n).at + t * _);
  }
  function F(n, t, e, r, i, S = !1) {
    let l = [];
    for (let y = S ? -1 : 0, o = N(r, y); o <= i; y += 1, o = N(r, y)) {
      let u = q(o, t, n),
        d = q(o, e <= t ? e + 1440 : e, n);
      u !== null && d !== null && d > u && l.push({ start: u, end: d });
    }
    return l;
  }
  function A(n) {
    let t = new Date(n);
    return `${String(t.getUTCFullYear()).padStart(4, '0')}${String(t.getUTCMonth() + 1).padStart(2, '0')}${String(t.getUTCDate()).padStart(2, '0')}T${String(t.getUTCHours()).padStart(2, '0')}${String(t.getUTCMinutes()).padStart(2, '0')}${String(t.getUTCSeconds()).padStart(2, '0')}Z`;
  }
  function Z({
    startDate: n,
    days: t = 7,
    organizerZone: e,
    zones: r,
    dayStart: i = '09:00',
    dayEnd: S = '17:00',
    durationMinutes: l = 60,
    maxResults: y = 100,
  } = {}) {
    let o = V(n),
      u = Number(t),
      d = Number(l),
      s = Number(y);
    if (!Number.isInteger(u) || u < 1 || u > b.maxDays)
      throw new RangeError(`Search from 1 to ${b.maxDays} days.`);
    if (!Number.isInteger(d) || d < 15 || d > 480 || d % 15)
      throw new RangeError('Meeting length must be 15\u2013480 minutes in 15-minute steps.');
    if (!Number.isInteger(s) || s < 1 || s > b.maxResults)
      throw new RangeError(`Show from 1 to ${b.maxResults} results.`);
    if (!Array.isArray(r)) throw new TypeError('Add at least one participant time zone.');
    let c = [...new Set([e, ...r].map((p) => String(p ?? '').trim()).filter(Boolean))];
    if (!e) throw new TypeError('Choose the organizer time zone.');
    if (c.length < 2)
      throw new RangeError('Add at least one participant time zone besides the organizer.');
    if (c.length > b.maxZones)
      throw new RangeError(`Use no more than ${b.maxZones} time zones, including the organizer.`);
    c.forEach(z);
    let h = k(i),
      f = k(S);
    if (h === f) throw new RangeError('Start and end of availability cannot be the same.');
    let m = new Map(),
      g = N(o.key, -2),
      w = N(o.key, u + 2),
      D = N(o.key, u - 1);
    for (let p of c) m.set(p, p === e ? F(p, h, f, o.key, D) : F(p, h, f, g, w, !0));
    let $ = m.get(e),
      E = [],
      U = b.stepMinutes * 6e4;
    for (let p of $)
      for (let T = p.start; T + d * 6e4 <= p.end; T += U) {
        let v = T + d * 6e4;
        if (
          c.every((C) => m.get(C).some((I) => T >= I.start && v <= I.end)) &&
          (E.push(
            Object.freeze({
              start: T,
              end: v,
              durationMinutes: d,
              localTimes: Object.freeze(
                c.map((C) => Object.freeze({ timeZone: C, start: x(T, C), end: x(v, C) })),
              ),
            }),
          ),
          E.length >= s)
        )
          return Object.freeze(E);
      }
    return Object.freeze(E);
  }
  function x(n, t) {
    if (!Number.isFinite(n)) throw new TypeError('A finite meeting timestamp is required.');
    let e = R(n, t);
    return `${String(e.year).padStart(4, '0')}-${String(e.month).padStart(2, '0')}-${String(e.day).padStart(2, '0')} ${String(e.hour).padStart(2, '0')}:${String(e.minute).padStart(2, '0')}`;
  }
  function j({ start: n, durationMinutes: t, summary: e = 'Meeting' } = {}) {
    if (!Number.isFinite(n) || !Number.isInteger(t) || t < 15 || t > 480)
      throw new TypeError('Choose a valid meeting slot before exporting.');
    let r =
        String(e)
          .replace(/[\r\n\u0000-\u001f]/gu, ' ')
          .trim()
          .slice(0, 120)
          .replace(/\\/gu, '\\\\')
          .replace(/,/gu, '\\,')
          .replace(/;/gu, '\\;') || 'Meeting',
      i = n + t * 6e4;
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UsefulVerse//Meeting Planner//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:meeting-${n}@usefulverse.local`,
      `DTSTAMP:${A(n)}`,
      `DTSTART:${A(n)}`,
      `DTEND:${A(i)}`,
      `SUMMARY:${r}`,
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join(`\r
`);
  }
  var a = document.querySelector('#tool-form');
  if (a?.classList.contains('meeting-planner')) {
    let c = function (f) {
        let m = j({
            start: f.start,
            durationMinutes: f.durationMinutes,
            summary: a.elements.meetingTitle.value,
          }),
          g = URL.createObjectURL(new Blob([m], { type: 'text/calendar;charset=utf-8' })),
          w = document.createElement('a');
        ((w.href = g),
          (w.download = 'meeting-invite.ics'),
          w.click(),
          setTimeout(() => URL.revokeObjectURL(g), 0),
          u(t.messages.downloaded, 'success'));
      },
      h = function () {
        try {
          let f = r.value
            .split(/[\n,;]+/u)
            .map((m) => m.trim())
            .filter(Boolean);
          ((o = Z({
            startDate: a.elements.startDate.value,
            days: Number(a.elements.days.value),
            organizerZone: e.value.trim(),
            zones: f,
            dayStart: a.elements.availabilityStart.value,
            dayEnd: a.elements.availabilityEnd.value,
            durationMinutes: Number(a.elements.durationMinutes.value),
          })),
            l.replaceChildren());
          for (let [m, g] of o.entries()) {
            let w = document.createElement('tr'),
              D = document.createElement('td');
            D.textContent = `${x(g.start, g.localTimes[0].timeZone)} \u2013 ${x(g.end, g.localTimes[0].timeZone)} (${g.localTimes[0].timeZone})`;
            let $ = document.createElement('td'),
              E = document.createElement('ul');
            E.className = 'meeting-planner__zone-list';
            for (let T of g.localTimes.slice(1)) {
              let v = document.createElement('li');
              ((v.textContent = `${T.timeZone}: ${T.start}\u2013${T.end}`), E.append(v));
            }
            $.append(E);
            let U = document.createElement('td'),
              p = document.createElement('button');
            ((p.type = 'button'),
              (p.className = 'button button--secondary'),
              (p.textContent = t.actions.downloadIcs),
              p.addEventListener('click', () => c(g)),
              U.append(p),
              w.append(D, $, U),
              (w.dataset.slot = String(m)),
              l.append(w));
          }
          ((i.hidden = !1),
            (S.hidden = o.length > 0),
            u(
              o.length
                ? t.messages.found.replace('{count}', String(o.length))
                : t.messages.noResults,
              o.length ? 'success' : 'info',
            ));
        } catch {
          ((o = []), (i.hidden = !0), l.replaceChildren(), u(t.messages.invalid, 'error'));
        }
      },
      n = a.closest('[data-page]') ?? document,
      t = JSON.parse(a.parentElement.querySelector('[data-tool-copy]').textContent),
      e = a.elements.organizerZone,
      r = a.elements.participantZones,
      i = a.querySelector('[data-meeting-results]'),
      S = a.querySelector('[data-meeting-empty]'),
      l = a.querySelector('[data-meeting-rows]'),
      y = a.querySelector('[data-status]'),
      o = [],
      u = (f, m = 'info') => L(n, f, m),
      d = (f) => {
        let m = Object.fromEntries(
          new Intl.DateTimeFormat('en-CA-u-ca-gregory-nu-latn', {
            timeZone: f,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
            .formatToParts(new Date())
            .map(({ type: g, value: w }) => [g, w]),
        );
        return `${m.year}-${m.month}-${m.day}`;
      },
      s = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    try {
      (new Intl.DateTimeFormat('en', { timeZone: s }), (e.value = s));
    } catch {
      e.value = 'UTC';
    }
    ((r.value = `Europe/London
Asia/Tokyo`),
      (a.elements.startDate.value = d(e.value)),
      a.querySelector('[data-action="find"]').addEventListener('click', h),
      a.querySelector('[data-action="example"]').addEventListener('click', () => {
        ((e.value = 'America/New_York'),
          (r.value = `Europe/London
Asia/Tokyo`),
          (a.elements.startDate.value = '2026-03-08'),
          (a.elements.days.value = '7'),
          (a.elements.availabilityStart.value = '07:00'),
          (a.elements.availabilityEnd.value = '23:00'),
          (a.elements.durationMinutes.value = '60'),
          (i.hidden = !0),
          l.replaceChildren(),
          u(t.messages.exampleLoaded, 'success'));
      }),
      a.addEventListener('reset', () =>
        setTimeout(() => {
          ((e.value = s),
            (r.value = `Europe/London
Asia/Tokyo`),
            (a.elements.startDate.value = d(s)),
            (o = []),
            (i.hidden = !0),
            l.replaceChildren(),
            (y.textContent = ''));
        }, 0),
      ));
  }
})();
