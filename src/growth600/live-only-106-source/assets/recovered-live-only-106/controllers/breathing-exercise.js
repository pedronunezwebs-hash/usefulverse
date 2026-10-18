(() => {
  function _(s = document) {
    let a = s.querySelector('[data-tool-copy]');
    if (!a) throw new Error('Localized tool copy is missing.');
    return JSON.parse(a.textContent);
  }
  function h(s, a, e = 'info') {
    let t = s.querySelector('[data-status]');
    t && ((t.textContent = a), (t.dataset.kind = e));
  }
  function y(s, a, e, t) {
    let d = Number(s);
    if (!Number.isInteger(d) || d < e || d > t)
      throw new RangeError(`${a} must be an integer from ${e} to ${t}.`);
    return d;
  }
  function A({
    inhaleSeconds: s,
    holdAfterInhaleSeconds: a = 0,
    exhaleSeconds: e,
    holdAfterExhaleSeconds: t = 0,
    durationSeconds: d,
  } = {}) {
    let f = y(s, 'Inhale', 1, 30),
      r = y(a, 'Hold after inhale', 0, 30),
      l = y(e, 'Exhale', 1, 30),
      i = y(t, 'Hold after exhale', 0, 30),
      b = y(d, 'Session duration', 30, 3600),
      p = f + r + l + i;
    return Object.freeze({
      inhaleSeconds: f,
      holdAfterInhaleSeconds: r,
      exhaleSeconds: l,
      holdAfterExhaleSeconds: i,
      durationSeconds: b,
      cycleSeconds: p,
    });
  }
  var H = (s) => [
    { phase: 'inhale', seconds: s.inhaleSeconds },
    ...(s.holdAfterInhaleSeconds ? [{ phase: 'hold', seconds: s.holdAfterInhaleSeconds }] : []),
    { phase: 'exhale', seconds: s.exhaleSeconds },
    ...(s.holdAfterExhaleSeconds ? [{ phase: 'hold', seconds: s.holdAfterExhaleSeconds }] : []),
  ];
  function O(s, a) {
    let e = A(s),
      t = Number(a);
    if (!Number.isFinite(t) || t < 0)
      throw new RangeError('Elapsed time must be a non-negative finite number.');
    if (t >= e.durationSeconds)
      return Object.freeze({
        phase: 'complete',
        phaseElapsedSeconds: 0,
        phaseRemainingSeconds: 0,
        elapsedSeconds: e.durationSeconds,
        remainingSeconds: 0,
        cycle: Math.ceil(e.durationSeconds / e.cycleSeconds),
        progress: 1,
      });
    let d = Math.floor(t / e.cycleSeconds) + 1,
      f = t % e.cycleSeconds,
      r = 0;
    for (let { phase: l, seconds: i } of H(e)) {
      if (f < r + i) {
        let b = f - r;
        return Object.freeze({
          phase: l,
          phaseElapsedSeconds: b,
          phaseRemainingSeconds: r + i - f,
          elapsedSeconds: t,
          remainingSeconds: Math.ceil(e.durationSeconds - t),
          cycle: d,
          progress: t / e.durationSeconds,
        });
      }
      r += i;
    }
    throw new RangeError('Breathing cycle configuration is invalid.');
  }
  var F = Object.freeze({ minSessionSeconds: 30, maxSessionSeconds: 3600, maxPhaseSeconds: 30 });
  var o = document.querySelector('[data-tool="breathing-exercise"]');
  if (o) {
    let q = function (n) {
        let c =
          n === 'inhale'
            ? a.messages.inhaleCue
            : n === 'exhale'
              ? a.messages.exhaleCue
              : a.messages.holdCue;
        h(o, c, 'status');
      },
      D = function (n) {
        if (!(!e('sound').checked || !u || u.state !== 'running'))
          try {
            let c = u.createOscillator(),
              S = u.createGain(),
              E = u.currentTime;
            ((c.type = 'sine'),
              (c.frequency.value = n === 'inhale' ? 660 : n === 'exhale' ? 440 : 550),
              S.gain.setValueAtTime(1e-4, E),
              S.gain.exponentialRampToValueAtTime(0.065, E + 0.025),
              S.gain.exponentialRampToValueAtTime(1e-4, E + 0.18),
              c.connect(S),
              S.connect(u.destination),
              c.start(E),
              c.stop(E + 0.2));
          } catch {}
      },
      v = function () {
        return A({
          inhaleSeconds: e('inhaleSeconds').value,
          holdAfterInhaleSeconds: e('holdAfterInhaleSeconds').value,
          exhaleSeconds: e('exhaleSeconds').value,
          holdAfterExhaleSeconds: e('holdAfterExhaleSeconds').value,
          durationSeconds: e('durationSeconds').value,
        });
      },
      g = function () {
        if (!r) return;
        let n = O(r, I()),
          c =
            n.phase === 'inhale'
              ? a.fields.inhaleCue
              : n.phase === 'exhale'
                ? a.fields.exhaleCue
                : n.phase === 'hold'
                  ? a.fields.holdCue
                  : a.fields.complete;
        ((t.phase.textContent = c),
          (t.cycle.textContent =
            n.phase === 'complete' ? '\u2014' : new Intl.NumberFormat(f).format(n.cycle)),
          (t.remaining.textContent = M(n.remainingSeconds)),
          (t.progress.value = n.progress),
          t.orb.classList.toggle('is-inhale', n.phase === 'inhale'),
          t.orb.classList.toggle('is-exhale', n.phase === 'exhale'),
          (t.orb.dataset.phase = n.phase),
          x !== null &&
            n.phase !== x &&
            (n.phase === 'complete'
              ? ((l = !1),
                (i = !0),
                clearInterval(m),
                (m = 0),
                (t.start.disabled = !1),
                (t.pause.disabled = !0),
                (t.resume.disabled = !0),
                d.forEach((S) => {
                  S.disabled = !1;
                }),
                h(o, a.messages.finished, 'success'))
              : (D(n.phase), q(n.phase))),
          (x = n.phase));
      },
      C = function () {
        (clearInterval(m), (m = setInterval(g, 150)), g());
      },
      P = function () {
        l &&
          ((p = I()),
          (l = !1),
          clearInterval(m),
          (m = 0),
          (t.start.disabled = !0),
          (t.pause.disabled = !0),
          (t.resume.disabled = !1),
          h(o, a.messages.paused, 'status'),
          g());
      },
      L = function () {
        ((l = !1),
          (i = !1),
          clearInterval(m),
          (m = 0),
          (p = 0),
          (x = null),
          (e('pattern').value = 'box'),
          (e('inhaleSeconds').value = '4'),
          (e('holdAfterInhaleSeconds').value = '4'),
          (e('exhaleSeconds').value = '4'),
          (e('holdAfterExhaleSeconds').value = '4'),
          (e('durationSeconds').value = '60'),
          (e('sound').checked = !1),
          d.forEach((n) => {
            n.disabled = !1;
          }),
          (t.start.disabled = !1),
          (t.pause.disabled = !0),
          (t.resume.disabled = !0));
        try {
          ((r = v()), g());
        } catch {
          r = null;
        }
        h(o, a.messages.reset, 'status');
      },
      k = function () {
        if (l) return;
        let n = e('pattern').value;
        (n === 'balanced' &&
          ((e('inhaleSeconds').value = '4'),
          (e('holdAfterInhaleSeconds').value = '0'),
          (e('exhaleSeconds').value = '6'),
          (e('holdAfterExhaleSeconds').value = '0')),
          n === 'box' &&
            ((e('inhaleSeconds').value = '4'),
            (e('holdAfterInhaleSeconds').value = '4'),
            (e('exhaleSeconds').value = '4'),
            (e('holdAfterExhaleSeconds').value = '4')),
          n === '478' &&
            ((e('inhaleSeconds').value = '4'),
            (e('holdAfterInhaleSeconds').value = '7'),
            (e('exhaleSeconds').value = '8'),
            (e('holdAfterExhaleSeconds').value = '0')),
          n !== 'custom' && ((p = 0), (i = !1), (x = null)));
        try {
          ((r = v()), g());
        } catch {
          r = null;
        }
      },
      s = o.querySelector('#tool-form'),
      a = _(o),
      e = (n) => s.elements.namedItem(n),
      t = {
        phase: o.querySelector('[data-breathing-phase]'),
        cycle: o.querySelector('[data-breathing-cycle]'),
        remaining: o.querySelector('[data-breathing-remaining]'),
        progress: o.querySelector('[data-breathing-progress]'),
        orb: o.querySelector('[data-breathing-orb]'),
        start: o.querySelector('[data-action="start"]'),
        pause: o.querySelector('[data-action="pause"]'),
        resume: o.querySelector('[data-action="resume"]'),
      },
      d = [
        'pattern',
        'inhaleSeconds',
        'holdAfterInhaleSeconds',
        'exhaleSeconds',
        'holdAfterExhaleSeconds',
        'durationSeconds',
      ].map(e),
      f = document.documentElement.lang || 'en',
      r = null,
      l = !1,
      i = !1,
      b = 0,
      p = 0,
      x = null,
      m = 0,
      u = null,
      M = (n) => {
        let c = Math.max(0, Math.ceil(n)),
          S = Math.floor(c / 60),
          E = c % 60,
          N = (X) =>
            new Intl.NumberFormat(f, { minimumIntegerDigits: 2, useGrouping: !1 }).format(X);
        return `${N(S)}:${N(E)}`;
      },
      I = () => p + (l ? Math.max(0, performance.now() - b) / 1e3 : 0);
    async function w() {
      if (e('sound').checked)
        try {
          let n = window.AudioContext || window.webkitAudioContext;
          if (!n) throw new Error('AudioContext unavailable');
          (u ?? (u = new n()), u.state === 'suspended' && (await u.resume()));
        } catch {
          h(o, a.messages.soundUnavailable, 'status');
        }
    }
    async function T(n) {
      n?.preventDefault();
      try {
        r = v();
      } catch {
        h(o, a.messages.checkInputs, 'error');
        return;
      }
      (await w(),
        (p = 0),
        (b = performance.now()),
        (l = !0),
        (i = !1),
        (x = null),
        (t.start.disabled = !0),
        (t.pause.disabled = !1),
        (t.resume.disabled = !0),
        d.forEach((c) => {
          c.disabled = !0;
        }),
        h(o, a.messages.started, 'success'),
        C());
    }
    async function R() {
      !r ||
        l ||
        i ||
        (await w(),
        (b = performance.now()),
        (l = !0),
        (t.start.disabled = !0),
        (t.pause.disabled = !1),
        (t.resume.disabled = !0),
        h(o, a.messages.resumed, 'status'),
        C());
    }
    (t.start.addEventListener('click', T),
      t.pause.addEventListener('click', P),
      t.resume.addEventListener('click', R),
      s.addEventListener('reset', (n) => {
        (n.preventDefault(), L());
      }),
      e('pattern').addEventListener('change', k),
      s.addEventListener('input', (n) => {
        if (!l) {
          (n.target !== e('sound') && (e('pattern').value = 'custom'),
            (i = !1),
            (p = 0),
            (x = null),
            h(o, '', 'status'));
          try {
            ((r = v()), g());
          } catch {
            r = null;
          }
        }
      }),
      document.addEventListener('visibilitychange', () => {
        !document.hidden && l && g();
      }),
      (t.pause.disabled = !0),
      (t.resume.disabled = !0));
    try {
      ((r = v()), g());
    } catch {}
  }
})();
