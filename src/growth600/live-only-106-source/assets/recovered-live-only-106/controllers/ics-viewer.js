(() => {
  function Y(t, e, a = 'info') {
    let o = t.querySelector('[data-status]');
    o && ((o.textContent = e), (o.dataset.kind = a));
  }
  var S = Object.freeze({
      maxBytes: 5242880,
      maxEvents: 2e3,
      maxOccurrences: 1e4,
      maxRangeDays: 366,
      maxScanDays: 1e6,
    }),
    b = 864e5,
    U = Object.freeze({ SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 }),
    E = (t) => Date.UTC(t.y, t.m - 1, t.d, t.h ?? 0, t.i ?? 0, t.s ?? 0);
  function L(t, e) {
    if (!e || e === 'floating')
      return new Date(t.y, t.m - 1, t.d, t.h ?? 0, t.i ?? 0, t.s ?? 0).getTime();
    if (['UTC', 'Etc/UTC', 'GMT'].includes(e)) return E(t);
    let a = E(t);
    for (let s = 0; s < 3; s += 1) {
      let c = Object.fromEntries(
          new Intl.DateTimeFormat('en-US-u-ca-gregory-nu-latn', {
            timeZone: e,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23',
          })
            .formatToParts(a)
            .map((i) => [i.type, Number(i.value)]),
        ),
        u = Date.UTC(c.year, c.month - 1, c.day, c.hour, c.minute, c.second),
        d = a + E(t) - u;
      if (d === a) break;
      a = d;
    }
    let o = new Intl.DateTimeFormat('en-US-u-ca-gregory-nu-latn', {
        timeZone: e,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(a),
      n = Object.fromEntries(o.map((s) => [s.type, Number(s.value)]));
    if (E({ y: n.year, m: n.month, d: n.day, h: n.hour, i: n.minute, s: n.second }) !== E(t))
      throw new TypeError(`A calendar time does not exist in ${e} because of a clock change.`);
    return a;
  }
  function O(t, e = {}) {
    let a = /^\d{8}$/u.test(t) || e.VALUE === 'DATE',
      o = a
        ? /^(\d{4})(\d{2})(\d{2})$/u.exec(t)
        : /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/u.exec(t);
    if (!o) throw new TypeError('The calendar contains an unsupported date format.');
    let n = {
        y: Number(o[1]),
        m: Number(o[2]),
        d: Number(o[3]),
        h: Number(o[4] ?? 0),
        i: Number(o[5] ?? 0),
        s: Number(o[6] ?? 0),
      },
      s = new Date(E(n));
    if (
      s.getUTCFullYear() !== n.y ||
      s.getUTCMonth() + 1 !== n.m ||
      s.getUTCDate() !== n.d ||
      n.h > 23 ||
      n.i > 59 ||
      n.s > 60
    )
      throw new TypeError('The calendar contains an invalid date.');
    let c = o[7] ? 'UTC' : e.TZID || 'floating';
    if (c !== 'floating')
      try {
        new Intl.DateTimeFormat('en', { timeZone: c });
      } catch {
        throw new TypeError(`Unsupported calendar time zone: ${c}.`);
      }
    return { wall: n, at: L(n, c), allDay: a, zone: c };
  }
  function B(t) {
    let e = new Map();
    for (let a of t) {
      let o = a.indexOf(':');
      if (o < 1) continue;
      let [n, ...s] = a.slice(0, o).split(';'),
        c = Object.fromEntries(
          s.map((d) => {
            let i = d.indexOf('=');
            return i < 0
              ? [d.toUpperCase(), '']
              : [d.slice(0, i).toUpperCase(), d.slice(i + 1).replace(/^"|"$/gu, '')];
          }),
        ),
        u = n.toUpperCase();
      e.set(u, [...(e.get(u) ?? []), { value: a.slice(o + 1), params: c }]);
    }
    return e;
  }
  function F(t, e, a) {
    if (!a) return E(t) === E(e);
    let o = a.FREQ,
      n = Number(a.INTERVAL ?? 1),
      s = Math.floor((E({ ...t, h: 0, i: 0, s: 0 }) - E({ ...e, h: 0, i: 0, s: 0 })) / b);
    if (s < 0) return !1;
    let c = new Date(E(t)).getUTCDay();
    if (a.BYMONTH && !a.BYMONTH.split(',').map(Number).includes(t.m)) return !1;
    if (a.BYMONTHDAY) {
      let d = new Date(Date.UTC(t.y, t.m, 0)).getUTCDate();
      if (
        !a.BYMONTHDAY.split(',')
          .map(Number)
          .map((i) => (i > 0 ? i : d + i + 1))
          .includes(t.d)
      )
        return !1;
    }
    if (
      a.BYDAY &&
      !a.BYDAY.split(',').some((i) => {
        let g = /^([+-]?\d+)?(SU|MO|TU|WE|TH|FR|SA)$/u.exec(i);
        return !g || U[g[2]] !== c
          ? !1
          : !g[1] ||
              (Number(g[1]) > 0
                ? Math.floor((t.d - 1) / 7) + 1
                : -(Math.floor((new Date(Date.UTC(t.y, t.m, 0)).getUTCDate() - t.d) / 7) + 1)) ===
                Number(g[1]);
      })
    )
      return !1;
    if (o === 'DAILY') return s % n === 0;
    if (o === 'WEEKLY') {
      let d = a.BYDAY
          ? a.BYDAY.split(',').map((h) => U[h.slice(-2)])
          : [new Date(E(e)).getUTCDay()],
        i = new Date(E({ ...e, h: 0, i: 0, s: 0 })),
        g = new Date(E({ ...t, h: 0, i: 0, s: 0 })),
        D = U[a.WKST ?? 'MO'],
        r = i.getTime() - ((i.getUTCDay() - D + 7) % 7) * b,
        m = g.getTime() - ((g.getUTCDay() - D + 7) % 7) * b;
      return Math.floor((m - r) / (7 * b)) % n === 0 && d.includes(c);
    }
    let u = (t.y - e.y) * 12 + t.m - e.m;
    return o === 'MONTHLY'
      ? u >= 0 && u % n === 0 && (a.BYDAY || a.BYMONTHDAY || t.d === e.d)
      : o === 'YEARLY'
        ? t.y - e.y >= 0 &&
          (t.y - e.y) % n === 0 &&
          (a.BYDAY || a.BYMONTHDAY || (t.m === e.m && t.d === e.d))
        : !1;
  }
  function k(t) {
    if (!t) return null;
    let e = Object.fromEntries(
        t.split(';').map((n) => {
          let s = n.indexOf('=');
          return [n.slice(0, s).toUpperCase(), n.slice(s + 1).toUpperCase()];
        }),
      ),
      a = new Set(['FREQ', 'INTERVAL', 'COUNT', 'UNTIL', 'BYDAY', 'BYMONTHDAY', 'BYMONTH', 'WKST']),
      o = Object.keys(e).find((n) => !a.has(n));
    if (o) throw new TypeError(`Unsupported recurrence option: ${o}.`);
    if (!['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(e.FREQ))
      throw new TypeError('Only daily, weekly, monthly and yearly recurrences are supported.');
    if (e.COUNT && (!/^\d+$/u.test(e.COUNT) || Number(e.COUNT) < 1))
      throw new TypeError('The recurrence count is invalid.');
    if (e.INTERVAL && (!/^\d+$/u.test(e.INTERVAL) || Number(e.INTERVAL) < 1))
      throw new TypeError('The recurrence interval is invalid.');
    if (
      e.BYDAY &&
      e.BYDAY.split(',').some((n) => !/^(?:[+-]?\d{1,2})?(?:SU|MO|TU|WE|TH|FR|SA)$/u.test(n))
    )
      throw new TypeError('This recurrence has an unsupported weekday.');
    if (
      e.BYMONTHDAY &&
      e.BYMONTHDAY.split(',').some(
        (n) => !/^-?\d{1,2}$/u.test(n) || Number(n) === 0 || Math.abs(Number(n)) > 31,
      )
    )
      throw new TypeError('This recurrence has an unsupported month day.');
    if (
      e.BYMONTH &&
      e.BYMONTH.split(',').some((n) => !/^\d{1,2}$/u.test(n) || Number(n) < 1 || Number(n) > 12)
    )
      throw new TypeError('This recurrence has an unsupported month.');
    if (e.WKST && !(e.WKST in U))
      throw new TypeError('This recurrence has an unsupported week start.');
    return e;
  }
  function V(t) {
    let e = /^P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/u.exec(t ?? '');
    if (!e) throw new TypeError('This calendar uses an unsupported event duration.');
    return (
      (((Number(e[1] ?? 0) * 7 + Number(e[2] ?? 0)) * 24 + Number(e[3] ?? 0)) * 60 +
        Number(e[4] ?? 0)) *
        6e4 +
      Number(e[5] ?? 0) * 1e3
    );
  }
  function q(t) {
    if (typeof t != 'string' || new TextEncoder().encode(t).byteLength > S.maxBytes)
      throw new RangeError('Choose an ICS calendar under the local 5 MiB limit.');
    let e = t.replace(/\r?\n[ \t]/gu, '').split(/\r?\n/u);
    if (!e.some((n) => n.trim().toUpperCase() === 'BEGIN:VCALENDAR'))
      throw new TypeError('This is not an iCalendar VCALENDAR file.');
    let a = [],
      o = null;
    for (let n of e)
      /^BEGIN:VEVENT\s*$/iu.test(n)
        ? (o = [])
        : /^END:VEVENT\s*$/iu.test(n)
          ? (o && a.push(o), (o = null))
          : o && o.push(n);
    if (!a.length || a.length > S.maxEvents)
      throw new RangeError(`Choose between 1 and ${S.maxEvents} events.`);
    return a.map((n, s) => {
      let c = B(n),
        u = (y) => c.get(y)?.[0],
        d = u('DTSTART');
      if (!d) throw new TypeError(`Event ${s + 1} has no start time.`);
      let i = O(d.value, d.params),
        g = u('DTEND'),
        D = u('DURATION');
      if (g && D) throw new TypeError(`Event ${s + 1} contains both DTEND and DURATION.`);
      let r = g ? O(g.value, g.params).at - i.at : D ? V(D.value) : i.allDay ? b : 0;
      if (r < 0) throw new TypeError(`Event ${s + 1} ends before it starts.`);
      let m = c.get('RRULE') ?? [];
      if (m.length > 1) throw new TypeError(`Event ${s + 1} has multiple recurrence rules.`);
      let h = k(m[0]?.value),
        w = new Set(
          (c.get('EXDATE') ?? []).flatMap((y) => y.value.split(',').map((v) => O(v, y.params).at)),
        ),
        T = (y) =>
          (u(y)?.value ?? '')
            .replace(
              /\\[nN]/gu,
              `
`,
            )
            .replace(/\\([\\,;])/gu, '$1');
      return {
        uid: T('UID') || `event-${s + 1}`,
        title: T('SUMMARY') || 'Untitled event',
        description: T('DESCRIPTION'),
        location: T('LOCATION'),
        start: i,
        duration: r,
        rule: h,
        exdates: w,
        cancelled: u('STATUS')?.value.toUpperCase() === 'CANCELLED',
      };
    });
  }
  function R(
    t,
    {
      from: e,
      to: a,
      displayTimeZone: o = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    } = {},
  ) {
    let n = new Date(`${e}T00:00:00`),
      s = new Date(`${a}T23:59:59`);
    if (
      !Number.isFinite(n.getTime()) ||
      !Number.isFinite(s.getTime()) ||
      s < n ||
      s - n > S.maxRangeDays * b
    )
      throw new RangeError('Choose a valid date range of no more than 366 days.');
    let c = n.getTime(),
      u = s.getTime(),
      d = q(t),
      i = [],
      g = 0;
    for (let r of d) {
      if (r.cancelled) continue;
      if (!r.rule) {
        r.start.at <= u &&
          r.start.at + r.duration >= c &&
          !r.exdates.has(r.start.at) &&
          i.push({ ...r, at: r.start.at });
        continue;
      }
      let m = 0,
        h = r.rule.UNTIL ? O(r.rule.UNTIL, {}).at : 1 / 0;
      for (
        let w = new Date(Date.UTC(r.start.wall.y, r.start.wall.m - 1, r.start.wall.d));
        w <= new Date(Date.UTC(s.getFullYear(), s.getMonth(), s.getDate())) && w.getTime() <= h;
        w = new Date(w.getTime() + b)
      ) {
        if (++g > S.maxScanDays)
          throw new RangeError(
            'These recurring events span too much history for a fast local preview. Export a shorter calendar range.',
          );
        let T = {
          ...r.start.wall,
          y: w.getUTCFullYear(),
          m: w.getUTCMonth() + 1,
          d: w.getUTCDate(),
        };
        if (!F(T, r.start.wall, r.rule)) continue;
        if (((m += 1), r.rule.COUNT && m > Number(r.rule.COUNT))) break;
        let y = L(T, r.start.zone);
        if (y > h) break;
        if (
          (y <= u && y + r.duration >= c && !r.exdates.has(y) && i.push({ ...r, at: y }),
          i.length > S.maxOccurrences)
        )
          throw new RangeError('More than 10,000 occurrences match. Choose a shorter date range.');
      }
    }
    i.sort((r, m) => r.at - m.at || r.title.localeCompare(m.title));
    let D = new Intl.DateTimeFormat(void 0, {
      timeZone: o,
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    return Object.freeze({
      eventCount: d.length,
      timeZone: o,
      occurrences: Object.freeze(
        i.map((r) =>
          Object.freeze({
            uid: r.uid,
            title: r.title,
            description: r.description,
            location: r.location,
            allDay: r.start.allDay,
            recurring: !!r.rule,
            start: r.at,
            end: r.at + r.duration,
            displayStart: r.start.allDay
              ? new Intl.DateTimeFormat(void 0, { timeZone: o, dateStyle: 'medium' }).format(r.at)
              : D.format(r.at),
          }),
        ),
      ),
    });
  }
  function $() {
    let t = new Date(Date.now() + 36e5),
      e = new Date(t.getTime() + 30 * 6e4),
      a = (o) =>
        o
          .toISOString()
          .replace(/[-:]/gu, '')
          .replace(/\.\d{3}/u, '');
    return `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//UsefulVerse//ICS Example//EN\r
BEGIN:VEVENT\r
UID:weekly-example@usefulverse.local\r
DTSTART:${a(t)}\r
DTEND:${a(e)}\r
RRULE:FREQ=WEEKLY;COUNT=4\r
EXDATE:${a(new Date(t.getTime() + 7 * b))}\r
SUMMARY:Weekly planning\r
LOCATION:Home\r
END:VEVENT\r
END:VCALENDAR\r
`;
  }
  var p = document.querySelector('#tool-form');
  if (p?.classList.contains('ics-viewer')) {
    let I = function () {
        d.replaceChildren();
        let l = c.value.trim().toLocaleLowerCase();
        h = (m?.occurrences ?? []).filter(
          (f) => !l || `${f.title} ${f.location} ${f.description}`.toLocaleLowerCase().includes(l),
        );
        for (let f of h) {
          let C = document.createElement('tr');
          for (let N of [
            f.title,
            new Intl.DateTimeFormat(void 0, {
              dateStyle: 'medium',
              timeStyle: f.allDay ? void 0 : 'short',
            }).format(f.start),
            new Intl.DateTimeFormat(void 0, {
              dateStyle: 'medium',
              timeStyle: f.allDay ? void 0 : 'short',
            }).format(f.end),
            f.location,
          ]) {
            let A = document.createElement('td');
            ((A.textContent = N), C.append(A));
          }
          d.append(C);
        }
        ((i.hidden = h.length > 0),
          (r.disabled = w || h.length === 0),
          m &&
            T(
              h.length
                ? e.messages.success
                    .replace('{visible}', String(h.length))
                    .replace('{events}', String(m.occurrences.length))
                    .replace('{zone}', m.timeZone)
                : e.messages.noResults,
              h.length ? 'success' : 'info',
            ));
      },
      t = p.closest('[data-page]') ?? document,
      e = JSON.parse(p.parentElement.querySelector('[data-tool-copy]').textContent),
      a = p.elements.calendarFile,
      o = p.elements.calendarText,
      n = p.elements.fromDate,
      s = p.elements.toDate,
      c = p.elements.search,
      u = p.querySelector('[data-ics-results]'),
      d = p.querySelector('[data-ics-rows]'),
      i = p.querySelector('[data-ics-empty]'),
      g = p.querySelector('[data-ics-time-zone]'),
      D = p.querySelector('[data-status]'),
      r = p.querySelector('[data-action="export"]'),
      m = null,
      h = [],
      w = !1,
      T = (l, f = 'info') => Y(t, l, f),
      y = (l) =>
        `${l.getFullYear()}-${String(l.getMonth() + 1).padStart(2, '0')}-${String(l.getDate()).padStart(2, '0')}`,
      v = new Date(),
      x = new Date(v);
    (x.setDate(x.getDate() + 90), n.value || (n.value = y(v)), s.value || (s.value = y(x)));
    let M = (l) => {
      let f = String(l ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/gu, '');
      return `"${(/^[=+@\-\t\r]/u.test(f) ? `'${f}` : f).replace(/"/gu, '""')}"`;
    };
    (a.addEventListener('change', async () => {
      ((m = null), (u.hidden = !0), (r.disabled = !0), (D.textContent = ''));
      let l = a.files?.[0];
      if (l) {
        if (l.size > 5 * 1024 * 1024) return ((a.value = ''), T(e.messages.tooLarge, 'error'));
        try {
          ((o.value = await l.text()), T(`${e.messages.fileReady}: ${l.name}`, 'success'));
        } catch {
          ((a.value = ''), T(e.messages.invalid, 'error'));
        }
      }
    }),
      p.querySelector('[data-action="view"]').addEventListener('click', () => {
        if (w) return;
        let l = o.value.trim();
        if (!l) return T(e.messages.noCalendar, 'error');
        ((w = !0),
          (p.querySelector('[data-action="view"]').disabled = !0),
          T(e.messages.loading, 'polite'));
        try {
          ((m = R(l, { from: n.value, to: s.value })),
            (g.textContent = `${e.fields.timeZone}: ${m.timeZone}`),
            (u.hidden = !1),
            I());
        } catch (f) {
          ((m = null), (u.hidden = !0), (r.disabled = !0));
          let C = /5 MiB/u.test(String(f?.message))
            ? e.messages.tooLarge
            : /occurrences|recurring|events|366 days|span too much/u.test(String(f?.message))
              ? e.messages.tooMany
              : e.messages.invalid;
          T(C, 'error');
        } finally {
          ((w = !1),
            (p.querySelector('[data-action="view"]').disabled = !1),
            (r.disabled = h.length === 0));
        }
      }),
      c.addEventListener('input', () => {
        m && I();
      }));
    for (let l of [n, s])
      l.addEventListener('change', () => {
        ((m = null), (u.hidden = !0), (r.disabled = !0));
      });
    (p.querySelector('[data-action="example"]').addEventListener('click', () => {
      ((o.value = $()),
        (m = null),
        (u.hidden = !0),
        (r.disabled = !0),
        T(e.messages.example, 'success'));
    }),
      r.addEventListener('click', () => {
        if (!h.length) return T(e.messages.exportEmpty, 'error');
        let l = [
            [e.fields.event, e.fields.starts, e.fields.ends, e.fields.location, 'UID'],
            ...h.map((N) => [
              N.title,
              new Date(N.start).toISOString(),
              new Date(N.end).toISOString(),
              N.location,
              N.uid,
            ]),
          ].map((N) => N.map(M).join(',')).join(`\r
`),
          f = document.createElement('a'),
          C = URL.createObjectURL(new Blob([`\uFEFF${l}`], { type: 'text/csv;charset=utf-8' }));
        ((f.href = C),
          (f.download = 'calendar-events.csv'),
          f.click(),
          setTimeout(() => URL.revokeObjectURL(C), 0),
          T(e.messages.exported, 'success'));
      }),
      p.querySelector('[data-action="clear"]').addEventListener('click', () => {
        (p.reset(),
          (m = null),
          (h = []),
          (u.hidden = !0),
          d.replaceChildren(),
          (i.hidden = !0),
          (r.disabled = !0),
          (n.value = y(new Date())));
        let l = new Date();
        (l.setDate(l.getDate() + 90),
          (s.value = y(l)),
          (D.textContent = ''),
          T(e.messages.cleared, 'success'));
      }));
  }
})();
