(() => {
  function _(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function C(e, t, n = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = t), (r.dataset.kind = n));
  }
  var E = Object.freeze([
    Object.freeze({ id: 'America/Los_Angeles', city: 'Los Angeles', country: 'US' }),
    Object.freeze({ id: 'America/Denver', city: 'Denver', country: 'US' }),
    Object.freeze({ id: 'America/Chicago', city: 'Chicago', country: 'US' }),
    Object.freeze({ id: 'America/New_York', city: 'New York', country: 'US' }),
    Object.freeze({ id: 'America/Toronto', city: 'Toronto', country: 'CA' }),
    Object.freeze({ id: 'America/Vancouver', city: 'Vancouver', country: 'CA' }),
    Object.freeze({ id: 'America/Mexico_City', city: 'Mexico City', country: 'MX' }),
    Object.freeze({ id: 'America/Sao_Paulo', city: 'S\xE3o Paulo', country: 'BR' }),
    Object.freeze({ id: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires', country: 'AR' }),
    Object.freeze({ id: 'Europe/London', city: 'London', country: 'GB' }),
    Object.freeze({ id: 'Europe/Paris', city: 'Paris', country: 'FR' }),
    Object.freeze({ id: 'Europe/Berlin', city: 'Berlin', country: 'DE' }),
    Object.freeze({ id: 'Europe/Madrid', city: 'Madrid', country: 'ES' }),
    Object.freeze({ id: 'Europe/Rome', city: 'Rome', country: 'IT' }),
    Object.freeze({ id: 'Europe/Istanbul', city: 'Istanbul', country: 'TR' }),
    Object.freeze({ id: 'Africa/Johannesburg', city: 'Johannesburg', country: 'ZA' }),
    Object.freeze({ id: 'Africa/Lagos', city: 'Lagos', country: 'NG' }),
    Object.freeze({ id: 'Asia/Dubai', city: 'Dubai', country: 'AE' }),
    Object.freeze({ id: 'Asia/Karachi', city: 'Karachi', country: 'PK' }),
    Object.freeze({ id: 'Asia/Kolkata', city: 'New Delhi', country: 'IN' }),
    Object.freeze({ id: 'Asia/Dhaka', city: 'Dhaka', country: 'BD' }),
    Object.freeze({ id: 'Asia/Bangkok', city: 'Bangkok', country: 'TH' }),
    Object.freeze({ id: 'Asia/Singapore', city: 'Singapore', country: 'SG' }),
    Object.freeze({ id: 'Asia/Shanghai', city: 'Shanghai', country: 'CN' }),
    Object.freeze({ id: 'Asia/Tokyo', city: 'Tokyo', country: 'JP' }),
    Object.freeze({ id: 'Asia/Seoul', city: 'Seoul', country: 'KR' }),
    Object.freeze({ id: 'Australia/Sydney', city: 'Sydney', country: 'AU' }),
    Object.freeze({ id: 'Pacific/Auckland', city: 'Auckland', country: 'NZ' }),
    Object.freeze({ id: 'UTC', city: 'UTC', country: '' }),
  ]);
  function A(e) {
    if (typeof e != 'string' || !e.trim()) return !1;
    try {
      return (new Intl.DateTimeFormat('en', { timeZone: e }).format(0), !0);
    } catch {
      return !1;
    }
  }
  function S(e, t = 'UTC') {
    if (!Array.isArray(e)) throw new TypeError('World-clock zones must be an array.');
    A(t) || (t = 'UTC');
    let n = [t];
    for (let r of e) {
      if (typeof r != 'string' || !A(r)) throw new RangeError('Choose a supported time zone.');
      if ((n.includes(r) || n.push(r), n.length > 8))
        throw new RangeError('Choose no more than 8 clocks.');
    }
    return Object.freeze(n);
  }
  function v(e = 'UTC') {
    return S(['America/New_York', 'Europe/London', 'Asia/Tokyo'], e);
  }
  function R(e, t, n, r) {
    let i = new Intl.DateTimeFormat(n, {
      timeZone: t,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: r,
    });
    return Object.fromEntries(
      i
        .formatToParts(e)
        .filter(({ type: c }) => c !== 'literal')
        .map(({ type: c, value: s }) => [c, s]),
    );
  }
  function I(e, t) {
    let n = e instanceof Date ? e : new Date(e);
    if (!Number.isFinite(n.getTime())) throw new RangeError('Choose a valid instant.');
    if (!A(t)) throw new RangeError('Choose a supported time zone.');
    let r = R(n, t, 'en-US', !1),
      i = Number(r.hour);
    i === 24 && (i = 0);
    let c = Date.UTC(
      Number(r.year),
      Number(r.month) - 1,
      Number(r.day),
      i,
      Number(r.minute),
      Number(r.second),
    );
    return Math.round((c - n.getTime()) / 6e4);
  }
  function F(e) {
    if (!Number.isInteger(e) || Math.abs(e) > 840)
      throw new RangeError('UTC offset is outside the supported range.');
    let t = e < 0 ? '\u2212' : '+',
      n = Math.abs(e);
    return `UTC${t}${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  }
  function $(e, t, n = 'en') {
    let r = e - t;
    if (r === 0) return new Intl.NumberFormat(n, { signDisplay: 'always' }).format(0) + ' min';
    let i = r < 0 ? '\u2212' : '+',
      c = Math.abs(r),
      s = Math.floor(c / 60),
      y = c % 60,
      d = new Intl.NumberFormat(n, { maximumFractionDigits: 0 });
    return `${i}${s ? `${d.format(s)} h` : ''}${s && y ? ' ' : ''}${y ? `${d.format(y)} min` : ''}`;
  }
  function U({
    date: e = new Date(),
    zones: t,
    localZone: n = 'UTC',
    locale: r = 'en',
    hour12: i = !1,
  } = {}) {
    let c = e instanceof Date ? e : new Date(e);
    if (!Number.isFinite(c.getTime())) throw new RangeError('Choose a valid instant.');
    let s = S(t ?? [], n),
      y = I(c, n),
      d = s.map((l) => {
        let O = R(c, l, r, i),
          w = I(c, l),
          p = new Intl.DateTimeFormat(r, {
            timeZone: l,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: i,
          }).format(c),
          h = new Intl.DateTimeFormat(r, {
            timeZone: l,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(c);
        return Object.freeze({
          timeZone: l,
          time: p,
          date: h,
          parts: Object.freeze(O),
          offsetMinutes: w,
          utcOffset: F(w),
          difference: l === n ? '\u2014' : $(w, y, r),
          isLocal: l === n,
        });
      });
    return Object.freeze({ instant: c.toISOString(), localZone: n, clocks: Object.freeze(d) });
  }
  var f = document.querySelector('[data-tool="world-clock"]');
  if (f) {
    let O = function (a) {
        if (a === s) return t.fields.yourLocalTime;
        let o = E.find(({ id: u }) => u === a);
        if (!o) return a;
        if (!o.country) return o.city;
        try {
          let u = new Intl.DisplayNames([y], { type: 'region' }).of(o.country);
          return `${o.city}, ${u}`;
        } catch {
          return `${o.city}, ${o.country}`;
        }
      },
      w = function () {
        let a = E.filter(({ id: o }) => !d.includes(o));
        n.replaceChildren();
        for (let o of a) n.add(new Option(O(o.id), o.id));
        ((n.disabled = a.length === 0 || d.length >= 8), (c.disabled = n.disabled));
      },
      p = function () {
        i.replaceChildren();
        for (let a of d) {
          let o = document.createElement('li');
          ((o.className = 'world-clock__item'), (o.dataset.zone = a));
          let u = document.createElement('article'),
            m = document.createElement('div');
          m.className = 'world-clock__header';
          let g = document.createElement('h3');
          g.dataset.city = '';
          let b = document.createElement('button');
          ((b.type = 'button'),
            (b.className = 'button button--secondary world-clock__remove'),
            (b.dataset.action = 'remove'),
            (b.textContent = t.actions.remove),
            b.setAttribute('aria-label', `${t.actions.remove}: ${O(a)}`),
            (b.disabled = a === s),
            m.append(g, b));
          let k = document.createElement('time');
          ((k.className = 'world-clock__time'), (k.dataset.clockTime = ''));
          let x = document.createElement('p');
          x.dataset.clockDate = '';
          let z = document.createElement('dl');
          z.className = 'world-clock__details';
          let j = document.createElement('dt');
          j.textContent = t.fields.utcOffset;
          let D = document.createElement('dd');
          D.dataset.utcOffset = '';
          let N = document.createElement('dt');
          N.textContent = t.fields.difference;
          let L = document.createElement('dd');
          ((L.dataset.clockDifference = ''),
            z.append(j, D, N, L),
            u.append(m, k, x, z),
            o.append(u),
            i.append(o));
        }
        (w(), h());
      },
      h = function () {
        let a = U({
          date: new Date(),
          zones: d,
          localZone: s,
          locale: y,
          hour12: r.value === '12',
        });
        for (let o of a.clocks) {
          let u = [...i.children].find((g) => g.dataset.zone === o.timeZone);
          if (!u) continue;
          u.querySelector('[data-city]').textContent = O(o.timeZone);
          let m = u.querySelector('[data-clock-time]');
          ((m.textContent = o.time),
            (m.dateTime = a.instant),
            (u.querySelector('[data-clock-date]').textContent = o.date),
            (u.querySelector('[data-utc-offset]').textContent = o.utcOffset),
            (u.querySelector('[data-clock-difference]').textContent = o.isLocal
              ? '\u2014'
              : o.difference));
        }
      },
      T = function () {
        (clearInterval(l), (l = 0), document.hidden || (h(), (l = setInterval(h, 1e3))));
      },
      e = f.querySelector('#tool-form'),
      t = _(f),
      n = e.elements.namedItem('zone'),
      r = e.elements.namedItem('hourFormat'),
      i = f.querySelector('[data-world-clocks]'),
      c = f.querySelector('[data-action="add"]'),
      s = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      y = document.documentElement.lang || 'en',
      d = v(s),
      l = 0;
    (c.addEventListener('click', () => {
      if (d.length >= 8) return C(f, t.messages.maxReached, 'error');
      let a = n.value;
      try {
        ((d = S([...d, a], s)), p(), C(f, t.messages.added, 'success'));
      } catch {
        C(f, t.messages.invalidZone, 'error');
      }
    }),
      i.addEventListener('click', (a) => {
        let o = a.target.closest('[data-action="remove"]');
        if (!o) return;
        let m = o.closest('[data-zone]')?.dataset.zone;
        !m || m === s || ((d = d.filter((g) => g !== m)), p(), C(f, t.messages.removed, 'success'));
      }),
      r.addEventListener('change', h),
      f.querySelector('[data-action="reset"]').addEventListener('click', () => {
        ((d = v(s)), (r.value = '24'), p(), C(f, t.messages.reset, 'success'));
      }),
      document.addEventListener('visibilitychange', T),
      p(),
      T());
  }
})();
