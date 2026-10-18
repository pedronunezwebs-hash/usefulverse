(() => {
  function z(o = document) {
    let e = o.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function f(o, e, a = 'info') {
    let r = o.querySelector('[data-status]');
    r && ((r.textContent = e), (r.dataset.kind = a));
  }
  function U(o, e = Date.now()) {
    let a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(o));
    if (!a) throw new RangeError('Choose a local date and time.');
    let [, r, h, w, x, p] = a.map(Number),
      c = new Date(r, h - 1, w, x, p, 0, 0);
    if (
      c.getFullYear() !== r ||
      c.getMonth() !== h - 1 ||
      c.getDate() !== w ||
      c.getHours() !== x ||
      c.getMinutes() !== p
    )
      throw new RangeError('That local time does not exist. Choose another time.');
    let y = c.getTime();
    if (!Number.isFinite(e) || !Number.isFinite(y) || y <= e)
      throw new RangeError('Choose a future time.');
    if (y - e > 6048e5) throw new RangeError('Choose a time within the next seven days.');
    return y;
  }
  function $(o, e = Date.now()) {
    let a = Number(o),
      r = Number(e);
    if (!Number.isFinite(a) || !Number.isFinite(r) || a < 0 || r < 0)
      throw new RangeError('Alarm timestamps must be finite non-negative milliseconds.');
    let h = Math.max(0, a - r);
    return Object.freeze({
      phase: h === 0 ? 'ringing' : 'waiting',
      remainingMs: h,
      remainingSeconds: Math.ceil(h / 1e3),
    });
  }
  function V(o = Date.now()) {
    let e = Number(o);
    if (!Number.isFinite(e) || e < 0)
      throw new RangeError('Current time must be finite non-negative milliseconds.');
    return e + 3e5;
  }
  function D(o = new Date()) {
    let e = (a) => String(a).padStart(2, '0');
    return `${o.getFullYear()}-${e(o.getMonth() + 1)}-${e(o.getDate())}T${e(o.getHours())}:${e(o.getMinutes())}`;
  }
  var J = Object.freeze({ maxScheduleMs: 6048e5, snoozeMs: 3e5 });
  var t = document.querySelector('[data-tool="alarm-clock"]');
  if (t) {
    let k = function (n) {
        return new Intl.DateTimeFormat(N, { dateStyle: 'medium', timeStyle: 'short' }).format(n);
      },
      v = function (n = 740, s = 0.32) {
        if (!i || i.state !== 'running') return;
        let d = i.createOscillator(),
          u = i.createGain(),
          m = i.currentTime;
        ((d.type = 'sine'),
          d.frequency.setValueAtTime(n, m),
          u.gain.setValueAtTime(1e-4, m),
          u.gain.exponentialRampToValueAtTime(0.075, m + 0.025),
          u.gain.exponentialRampToValueAtTime(1e-4, m + s),
          d.connect(u),
          u.connect(i.destination),
          d.start(m),
          d.stop(m + s + 0.02));
      },
      X = function () {
        g ||
          l === null ||
          ((g = !0),
          (C = Date.now()),
          (p.hidden = !1),
          (b.hidden = !1),
          (S.hidden = !1),
          (c.disabled = !1),
          f(t, e.messages.ringing, 'success'),
          r.checked && i?.state === 'running'
            ? (v(740),
              window.setTimeout(() => {
                g && r.checked && v(988);
              }, 360))
            : r.checked && !_ && ((_ = !0), f(t, e.messages.soundUnavailable, 'error')));
      },
      I = function () {
        if (l === null) return;
        let n = $(l, Date.now());
        ((x.textContent = B(n.remainingSeconds)), n.phase === 'ringing' && X());
        let s = Date.now();
        g &&
          r.checked &&
          i?.state === 'running' &&
          s - C >= 1200 &&
          ((C = s), v(Math.floor(s / 1200) % 2 ? 988 : 740, 0.22));
      },
      L = function () {
        (window.clearInterval(M), (M = 0));
      },
      O = function () {
        (L(), (M = window.setInterval(I, 500)), I());
      },
      F = function (n) {
        ((A += 1),
          L(),
          (l = null),
          (g = !1),
          (w.textContent = '\u2014'),
          (x.textContent = '\u2014'),
          (p.hidden = !0),
          (b.hidden = !0),
          (S.hidden = !0),
          (T.disabled = !0),
          (c.disabled = !1),
          f(t, n, 'status'));
      },
      R = function () {
        let n = Date.now();
        ((a.min = D(new Date(n))), (a.max = D(new Date(n + 10080 * 60 * 1e3))));
      },
      o = t.querySelector('#tool-form'),
      e = z(t),
      a = o.elements.namedItem('alarmTime'),
      r = o.elements.namedItem('sound'),
      h = t.querySelector('[data-status]'),
      w = t.querySelector('[data-alarm-target]'),
      x = t.querySelector('[data-alarm-remaining]'),
      p = t.querySelector('[data-alarm-ringing]'),
      c = t.querySelector('[data-action="schedule"]'),
      y = t.querySelector('[data-action="testSound"]'),
      T = t.querySelector('[data-action="cancel"]'),
      b = t.querySelector('[data-action="snooze"]'),
      S = t.querySelector('[data-action="stop"]'),
      N = document.documentElement.lang || 'en',
      l = null,
      g = !1,
      M = 0,
      i = null,
      _ = !1,
      A = 0,
      C = 0,
      B = (n) => {
        let s = Math.max(0, Math.ceil(n)),
          d = Math.floor(s / 3600),
          u = Math.floor((s % 3600) / 60),
          m = s % 60,
          E = (G) =>
            new Intl.NumberFormat(N, { minimumIntegerDigits: 2, useGrouping: !1 }).format(G);
        return `${E(d)}:${E(u)}:${E(m)}`;
      };
    async function q() {
      let n = window.AudioContext || window.webkitAudioContext;
      if (!n) throw new Error('Audio is unavailable.');
      if (
        (i ?? (i = new n()), i.state === 'suspended' && (await i.resume()), i.state !== 'running')
      )
        throw new Error('Audio is unavailable.');
    }
    async function H() {
      try {
        (await q(),
          v(740, 0.24),
          window.setTimeout(() => v(988, 0.3), 180),
          f(t, e.messages.soundTested, 'success'));
      } catch {
        f(t, e.messages.soundUnavailable, 'error');
      }
    }
    async function Z(n) {
      n?.preventDefault();
      let s = ++A,
        d;
      try {
        d = U(a.value);
      } catch (m) {
        let E = /clock change|does not exist/u.test(m.message)
          ? e.messages.invalidTime
          : e.messages.checkTime;
        (f(t, E, 'error'), a.focus());
        return;
      }
      let u = !1;
      if (r.checked)
        try {
          await q();
        } catch {
          u = !0;
        }
      s === A &&
        ((_ = u),
        u && f(t, e.messages.soundUnavailable, 'error'),
        (l = d),
        (g = !1),
        (C = 0),
        (p.hidden = !0),
        (b.hidden = !0),
        (S.hidden = !0),
        (w.textContent = k(l)),
        (T.disabled = !1),
        (c.disabled = !1),
        f(t, e.messages.scheduled.replace('{time}', k(l)), 'success'),
        O());
    }
    async function j() {
      g &&
        ((A += 1),
        (l = V(Date.now())),
        (g = !1),
        (p.hidden = !0),
        (b.hidden = !0),
        (S.hidden = !0),
        (w.textContent = k(l)),
        (T.disabled = !1),
        f(t, e.messages.snoozed, 'success'),
        O());
    }
    (o.addEventListener('submit', (n) => {
      n.preventDefault();
    }),
      c.addEventListener('click', Z),
      y.addEventListener('click', H),
      T.addEventListener('click', () => {
        l !== null && F(e.messages.cancelled);
      }),
      b.addEventListener('click', j),
      S.addEventListener('click', () => {
        g && F(e.messages.stopped);
      }),
      a.addEventListener('focus', R),
      document.addEventListener('visibilitychange', () => {
        document.hidden || I();
      }),
      (T.disabled = !0),
      (b.hidden = !0),
      (S.hidden = !0),
      R(),
      (a.value = D(new Date(Date.now() + 300 * 1e3))));
  }
})();
