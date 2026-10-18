(() => {
  function p(e, n, a = 'info') {
    let o = e.querySelector('[data-status]');
    o && ((o.textContent = n), (o.dataset.kind = a));
  }
  var v = Object.freeze({
      up: Object.freeze({ x: 0, y: -1 }),
      right: Object.freeze({ x: 1, y: 0 }),
      down: Object.freeze({ x: 0, y: 1 }),
      left: Object.freeze({ x: -1, y: 0 }),
    }),
    z = Object.freeze({ up: 'down', down: 'up', left: 'right', right: 'left' });
  function y(e) {
    return Object.freeze({
      ...e,
      snake: Object.freeze(e.snake.map((n) => Object.freeze({ ...n }))),
      food: e.food ? Object.freeze({ ...e.food }) : null,
    });
  }
  function E(e, n, a) {
    let o = new Set(e.map(({ x: c, y: t }) => `${c},${t}`)),
      m = [];
    for (let c = 0; c < n; c += 1)
      for (let t = 0; t < n; t += 1) o.has(`${t},${c}`) || m.push({ x: t, y: c });
    if (!m.length) return null;
    let d = Number(a());
    if (!Number.isFinite(d) || d < 0 || d >= 1)
      throw new RangeError('Random source must return a value from 0 up to 1.');
    return m[Math.floor(d * m.length)];
  }
  function S({ size: e = 20, random: n = Math.random } = {}) {
    if (!Number.isInteger(e) || e < 10 || e > 40)
      throw new RangeError('Board size must be 10\u201340.');
    if (typeof n != 'function') throw new TypeError('Provide a random number function.');
    let a = Math.floor(e / 2),
      o = [
        { x: a, y: a },
        { x: a - 1, y: a },
        { x: a - 2, y: a },
      ];
    return y({
      size: e,
      snake: o,
      direction: 'right',
      food: E(o, e, n),
      score: 0,
      status: 'ready',
    });
  }
  function O(e) {
    if (!e || !['ready', 'paused', 'running', 'won', 'over'].includes(e.status))
      throw new TypeError('Create a valid game before starting.');
    return e.status === 'won' || e.status === 'over' ? e : y({ ...e, status: 'running' });
  }
  function N(e, n) {
    return !e || !Object.hasOwn(v, n) || n === z[e.direction] ? e : y({ ...e, direction: n });
  }
  function q(e, { random: n = Math.random } = {}) {
    if (!e || e.status !== 'running') return e;
    let a = v[e.direction],
      o = { x: e.snake[0].x + a.x, y: e.snake[0].y + a.y };
    if (o.x < 0 || o.y < 0 || o.x >= e.size || o.y >= e.size) return y({ ...e, status: 'over' });
    let d = !!(e.food && o.x === e.food.x && o.y === e.food.y);
    if ((d ? e.snake : e.snake.slice(0, -1)).some((l) => l.x === o.x && l.y === o.y))
      return y({ ...e, status: 'over' });
    let t = d ? [o, ...e.snake] : [o, ...e.snake.slice(0, -1)],
      f = d ? E(t, e.size, n) : e.food;
    return y({
      ...e,
      snake: t,
      food: f,
      score: e.score + Number(d),
      status: f ? 'running' : 'won',
    });
  }
  var i = document.querySelector('[data-tool="snake-game"]');
  if (i) {
    let x = function (r, s = {}) {
        return Object.entries(s).reduce(
          (u, [A, T]) => u.replaceAll(`{${A}}`, String(T)),
          a.messages[r],
        );
      },
      C = function () {
        let r = e.width / t.size;
        ((n.fillStyle = '#101827'),
          n.fillRect(0, 0, e.width, e.height),
          (n.strokeStyle = '#25334a'),
          (n.lineWidth = 1));
        for (let s = 1; s < t.size; s += 1) {
          let u = s * r;
          (n.beginPath(),
            n.moveTo(u, 0),
            n.lineTo(u, e.height),
            n.moveTo(0, u),
            n.lineTo(e.width, u),
            n.stroke());
        }
        (t.food &&
          ((n.fillStyle = '#ff6b6b'),
          n.beginPath(),
          n.arc((t.food.x + 0.5) * r, (t.food.y + 0.5) * r, r * 0.34, 0, Math.PI * 2),
          n.fill()),
          t.snake.forEach((s, u) => {
            ((n.fillStyle = u === 0 ? '#d7f45a' : '#9ec33b'),
              n.fillRect(s.x * r + 1, s.y * r + 1, r - 2, r - 2));
          }));
      },
      g = function () {
        (C(),
          (o.textContent = String(t.score)),
          (m.textContent = String(f)),
          (c.start.hidden = t.status !== 'ready'),
          (c.pause.hidden = t.status !== 'running'),
          (c.resume.hidden = t.status !== 'paused'),
          (c.newGame.hidden = !1),
          (d.hidden = t.status !== 'ready'));
      },
      h = function () {
        (clearInterval(w), (w = 0));
      },
      I = function () {
        return t.status === 'over' || t.status === 'won'
          ? (h(),
            (f = Math.max(f, t.score)),
            g(),
            p(
              i,
              x(t.status === 'won' ? 'won' : 'gameOver', { score: t.score }),
              t.status === 'won' ? 'success' : 'error',
            ),
            !0)
          : !1;
      },
      j = function () {
        l && ((t = N(t, l)), (l = null));
        let r = t.score;
        ((t = q(t)),
          (f = Math.max(f, t.score)),
          g(),
          t.score > r && p(i, x('score', { score: t.score }), 'success'),
          I());
      },
      b = function () {
        if (t.status === 'over' || t.status === 'won') return;
        let r = t.status;
        ((t = O(t)), h());
        let s = i.querySelector('[name="speed"]').value;
        ((w = window.setInterval(j, Number(s))),
          g(),
          r !== 'running' && p(i, x(r === 'paused' ? 'resumed' : 'started'), 'success'));
      },
      k = function (r) {
        if (t.status !== 'running') return;
        let s = { up: 'down', down: 'up', left: 'right', right: 'left' },
          u = l ?? t.direction;
        r !== s[u] && (l = r);
      },
      e = i.querySelector('canvas[data-snake-board]'),
      n = e.getContext('2d'),
      a = JSON.parse(i.querySelector('[data-tool-copy]').textContent),
      o = i.querySelector('[data-snake-score]'),
      m = i.querySelector('[data-snake-best]'),
      d = i.querySelector('[data-snake-hint]'),
      c = Object.fromEntries(
        ['start', 'pause', 'resume', 'newGame'].map((r) => [
          r,
          i.querySelector(`[data-action="${r}"]`),
        ]),
      ),
      t = S(),
      f = 0,
      l = null,
      w = 0;
    (i.addEventListener('click', (r) => {
      let s = r.target.closest('[data-action]')?.dataset.action;
      (s === 'start' && b(),
        s === 'pause' &&
          t.status === 'running' &&
          (h(),
          (t = Object.freeze({ ...t, status: 'paused' })),
          g(),
          p(i, a.messages.paused, 'success')),
        s === 'resume' && b(),
        s === 'newGame' && (h(), (t = S()), (l = null), g(), p(i, a.messages.newGame, 'success')),
        ['up', 'right', 'down', 'left'].includes(s) && k(s));
    }),
      i.addEventListener('keydown', (r) => {
        if (r.target.matches('input, select, textarea, button')) return;
        let u = {
          ArrowUp: 'up',
          w: 'up',
          W: 'up',
          ArrowRight: 'right',
          d: 'right',
          D: 'right',
          ArrowDown: 'down',
          s: 'down',
          S: 'down',
          ArrowLeft: 'left',
          a: 'left',
          A: 'left',
        };
        (u[r.key] && (r.preventDefault(), k(u[r.key])),
          r.code === 'Space' &&
            ['running', 'paused'].includes(t.status) &&
            (r.preventDefault(), t.status === 'running' ? c.pause.click() : c.resume.click()));
      }),
      i.querySelector('[name="speed"]').addEventListener('change', () => {
        t.status === 'running' && b();
      }),
      document.addEventListener('visibilitychange', () => {
        document.hidden && t.status === 'running' && c.pause.click();
      }),
      g(),
      p(i, a.messages.ready, 'success'));
  }
})();
