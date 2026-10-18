(() => {
  var D = Object.freeze(['digits', 'pattern']),
    S = 3,
    q = 12;
  function P(t) {
    if (typeof t != 'function') throw new TypeError('A random-number function is required.');
  }
  function _({ mode: t = 'digits', length: a = S, rng: i = Math.random } = {}) {
    if ((P(i), !D.includes(t))) throw new RangeError('Choose a supported memory mode.');
    if (!Number.isInteger(a) || a < S || a > q)
      throw new RangeError(`Sequence length must be ${S}\u2013${q}.`);
    let o = t === 'digits' ? 10 : 9;
    return Array.from({ length: a }, () => {
      let n = i();
      if (!Number.isFinite(n) || n < 0 || n >= 1)
        throw new RangeError(
          'Random source must return a value from 0 up to (but not including) 1.',
        );
      return Math.floor(n * o);
    });
  }
  function X(t, a, i = 'digits') {
    if (!D.includes(i) || !Array.isArray(t) || !Array.isArray(a) || t.length < S || t.length > q)
      return !1;
    let o = i === 'digits' ? 10 : 9;
    return t.some((n) => !Number.isInteger(n) || n < 0 || n >= o) ||
      a.some((n) => !Number.isInteger(n) || n < 0 || n >= o)
      ? !1
      : a.length === t.length && a.every((n, f) => n === t[f]);
  }
  function v({
    expected: t,
    answer: a,
    mode: i = 'digits',
    level: o = S,
    roundsCompleted: n = 0,
  } = {}) {
    if (!Number.isInteger(o) || o < S || o > q || !Number.isInteger(n) || n < 0)
      throw new RangeError('Memory-test progress is outside its supported range.');
    let f = X(t, a, i);
    return Object.freeze({
      correct: f,
      level: f ? Math.min(q, o + 1) : o,
      roundsCompleted: n + (f ? 1 : 0),
      complete: f && o === q,
    });
  }
  var s = document.querySelector('[data-tool="memory-test"]');
  if (s) {
    let x = function () {
        ((z.textContent = h(t.fields.level, { length: w })),
          (G.textContent = h(t.fields.rounds, { rounds: m })));
      },
      p = function () {
        let e = d.length
          ? d.map((r) => (l === 'digits' ? r : r + 1)).join(' \xB7 ')
          : t.fields.emptyAnswer;
        ((B.textContent = e),
          (s.querySelector('[data-action="backspace"]').disabled = c || d.length === 0),
          (s.querySelector('[data-action="clearAnswer"]').disabled = c || d.length === 0),
          (s.querySelector('[data-action="submit"]').disabled = c),
          O.forEach((r) => {
            r.disabled = c || d.length >= u.length;
          }));
      },
      Q = function () {
        ((c = !1),
          (o.textContent = `${t.fields.display}: \u2014`),
          (s.querySelector('[data-action="start"]').disabled = !0),
          (N.hidden = !1),
          (n.hidden = l !== 'pattern'),
          (f.hidden = l !== 'digits'),
          n.querySelectorAll('[data-cell]').forEach((e) => {
            ((e.disabled = !1), e.classList.remove('is-lit'));
          }),
          (y.textContent = t.messages.recall),
          p(),
          s.querySelector(l === 'digits' ? '[data-digit="0"]' : '[data-cell="0"]')?.focus());
      },
      I = function (e, r) {
        if (e >= u.length) {
          Q();
          return;
        }
        ((o.textContent = `${t.fields.display}: ${l === 'digits' ? u[e] : e + 1}`),
          l === 'pattern' && n.querySelector(`[data-cell="${u[e]}"]`)?.classList.add('is-lit'),
          k.push(
            setTimeout(() => {
              ((o.textContent = `${t.fields.display}: \u2014`),
                n.querySelectorAll('.is-lit').forEach((b) => b.classList.remove('is-lit')),
                k.push(setTimeout(() => I(e + 1, r), Math.min(220, r / 3))));
            }, r),
          ));
      },
      $ = function () {
        (M(),
          (l = a.value),
          (u = _({ mode: l, length: w })),
          (d = []),
          (g = !0),
          (c = !0),
          (E.disabled = !0),
          (a.disabled = !0),
          (i.disabled = !0),
          (C.hidden = !0),
          (A.hidden = !0),
          (N.hidden = !0),
          (n.hidden = l !== 'pattern'),
          (f.hidden = l !== 'digits'),
          (y.textContent = t.messages.showing),
          x(),
          I(0, Number(i.value)));
      },
      U = function (e = !1) {
        (M(),
          (u = []),
          (d = []),
          (w = 3),
          (m = 0),
          (a.disabled = !1),
          (i.disabled = !1),
          (g = !1),
          (c = !0),
          (E.disabled = !1),
          (A.hidden = !0),
          (N.hidden = !0),
          (n.hidden = !0),
          (C.hidden = !0),
          (o.textContent = `${t.fields.display}: \u2014`),
          n.querySelectorAll('.is-lit').forEach((r) => r.classList.remove('is-lit')),
          (y.textContent = t.messages.ready),
          p(),
          x(),
          e && $());
      },
      L = function (e) {
        c || d.length >= u.length || (d.push(e), p());
      },
      j = function () {
        if (c || !g) return;
        if (d.length !== u.length) {
          y.textContent = h(t.messages.answerComplete, { length: u.length });
          return;
        }
        let e = v({ expected: u, answer: d, mode: l, level: w, roundsCompleted: m });
        if (((c = !0), T(!0), e.correct))
          ((m = e.roundsCompleted),
            (w = e.level),
            (a.disabled = !0),
            (i.disabled = !0),
            x(),
            e.complete
              ? ((g = !1),
                (E.disabled = !0),
                (a.disabled = !1),
                (i.disabled = !1),
                (y.textContent = h(t.messages.finished, { rounds: m })),
                (R.textContent = h(t.messages.finished, { rounds: m })),
                (C.hidden = !1))
              : ((y.textContent = h(t.messages.correct, { rounds: m })),
                (A.hidden = !1),
                A.focus()));
        else {
          ((g = !1), (E.disabled = !0), (a.disabled = !1), (i.disabled = !1));
          let r = u.map((b) => (l === 'digits' ? b : b + 1)).join(' \xB7 ');
          ((y.textContent = h(t.messages.incorrect, { sequence: r, rounds: m })),
            (R.textContent = `${t.fields.correctSequence}: ${r}. ${h(t.messages.incorrect, { sequence: r, rounds: m })}`),
            (C.hidden = !1));
        }
      },
      t = JSON.parse(s.querySelector('[data-tool-copy]')?.textContent ?? '{}'),
      a = s.querySelector('[data-mode]'),
      i = s.querySelector('[data-speed]'),
      o = s.querySelector('[data-display]'),
      n = s.querySelector('[data-pattern]'),
      f = s.querySelector('[data-digits]'),
      N = s.querySelector('[data-input]'),
      B = s.querySelector('[data-answer]'),
      y = s.querySelector('[data-status]'),
      z = s.querySelector('[data-level]'),
      G = s.querySelector('[data-rounds]'),
      E = s.querySelector('[data-action="start"]'),
      A = s.querySelector('[data-action="nextRound"]'),
      C = s.querySelector('[data-result]'),
      R = s.querySelector('[data-result-content]'),
      O = [...s.querySelectorAll('[data-digit], [data-cell]')],
      H = [
        ...s.querySelectorAll(
          '[data-action="backspace"], [data-action="clearAnswer"], [data-action="submit"]',
        ),
      ],
      u = [],
      d = [],
      l = 'digits',
      w = 3,
      m = 0,
      c = !0,
      g = !1,
      k = [],
      h = (e, r) => Object.entries(r).reduce((b, [F, J]) => b.replaceAll(`{${F}}`, String(J)), e),
      M = () => {
        (k.forEach(clearTimeout), (k = []));
      },
      T = (e) => {
        (O.forEach((r) => {
          r.disabled = e;
        }),
          H.forEach((r) => {
            r.disabled = e;
          }));
      };
    (s.addEventListener('click', (e) => {
      let r = e.target.closest('button');
      if (!(!r || !s.contains(r))) {
        if (r.matches('[data-digit]')) {
          L(Number(r.dataset.digit));
          return;
        }
        if (r.matches('[data-cell]')) {
          L(Number(r.dataset.cell));
          return;
        }
        switch (r.dataset.action) {
          case 'start':
            g || $();
            break;
          case 'nextRound':
            g && c && $();
            break;
          case 'newTest':
            U(!0);
            break;
          case 'backspace':
            c || (d.pop(), p());
            break;
          case 'clearAnswer':
            c || ((d = []), p());
            break;
          case 'submit':
            j();
            break;
          default:
            break;
        }
      }
    }),
      s.addEventListener('keydown', (e) => {
        l !== 'digits' ||
          c ||
          !g ||
          (/^[0-9]$/u.test(e.key)
            ? (e.preventDefault(), L(Number(e.key)))
            : e.key === 'Backspace'
              ? (e.preventDefault(), d.pop(), p())
              : e.key === 'Enter' && (e.preventDefault(), j()));
      }),
      a.addEventListener('change', () => {
        l = a.value;
      }),
      s.addEventListener('growth600:dispose', () => {
        M();
      }),
      T(!0),
      x());
  }
})();
