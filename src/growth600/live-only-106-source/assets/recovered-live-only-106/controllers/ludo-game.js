(() => {
  var A = Object.freeze([
      Object.freeze({ id: 'red', start: 0 }),
      Object.freeze({ id: 'green', start: 13 }),
      Object.freeze({ id: 'yellow', start: 26 }),
      Object.freeze({ id: 'blue', start: 39 }),
    ]),
    H = 52,
    S = 50,
    C = 6,
    M = new Set([0, 8, 13, 21, 26, 34, 39, 47]),
    K = new Set(['base', 'track', 'home', 'finished']);
  function V(e) {
    return Number.isInteger(e) && e >= 2 && e <= 4;
  }
  function J(e) {
    return Number.isInteger(e) && e >= 1 && e <= 6;
  }
  function G({ players: e = 2, bots: s = e - 1 } = {}) {
    if (!V(e) || !Number.isInteger(s) || s < 0 || s >= e)
      throw new RangeError('Ludo needs 2\u20134 players and at least one human player.');
    return {
      players: A.slice(0, e).map((t, n) => ({
        ...t,
        bot: n >= e - s,
        tokens: Array.from({ length: 4 }, (d, E) => ({ id: E, state: 'base', step: -1 })),
      })),
      currentPlayer: 0,
      die: null,
      extraRoll: !1,
      status: 'playing',
      winner: null,
      turn: 'roll',
      lastEvent: null,
      movesThisTurn: 0,
    };
  }
  function $(e, s = e?.die) {
    if (!e || e.status !== 'playing' || !J(s) || e.turn !== 'move') return [];
    let o = e.players[e.currentPlayer],
      t = [];
    for (let n of o.tokens) {
      if (n.state === 'base') {
        s === 6 && t.push({ tokenId: n.id, from: 'base', to: 'track', step: 0 });
        continue;
      }
      if (n.state === 'track') {
        let d = n.step + s;
        d <= S
          ? t.push({ tokenId: n.id, from: 'track', to: 'track', step: d })
          : d <= S + C &&
            t.push({
              tokenId: n.id,
              from: 'track',
              to: d === S + C ? 'finished' : 'home',
              step: d,
            });
        continue;
      }
      if (n.state === 'home') {
        let d = n.step + s;
        d < S + C
          ? t.push({ tokenId: n.id, from: 'home', to: 'home', step: d })
          : d === S + C && t.push({ tokenId: n.id, from: 'home', to: 'finished', step: d });
      }
    }
    return t;
  }
  function _(e, s) {
    let o = A.find((t) => t.id === e);
    return !o || !Number.isInteger(s) || s < 0 || s > S ? null : (o.start + s) % H;
  }
  function q(e) {
    if (!e || e.status !== 'playing' || !Array.isArray(e.players) || !e.players.length)
      throw new TypeError('Ludo game is not active.');
    if (!Number.isInteger(e.currentPlayer) || !e.players[e.currentPlayer])
      throw new TypeError('Ludo turn is invalid.');
    if (
      new Set(e.players.map(({ id: o }) => o)).size !== e.players.length ||
      e.players.some(
        ({ id: o, tokens: t }) => !A.some((n) => n.id === o) || !Array.isArray(t) || t.length !== 4,
      )
    )
      throw new TypeError('Ludo board is invalid.');
    for (let o of e.players) {
      if (new Set(o.tokens.map(({ id: t }) => t)).size !== 4)
        throw new TypeError('Ludo token IDs must be unique.');
      for (let t of o.tokens) {
        let n =
          t.state === 'base'
            ? t.step === -1
            : t.state === 'track'
              ? t.step >= 0 && t.step <= S
              : t.state === 'home'
                ? t.step > S && t.step < S + C
                : t.state === 'finished' && t.step === S + C;
        if (
          !K.has(t.state) ||
          !Number.isInteger(t.step) ||
          !n ||
          !Number.isInteger(t.id) ||
          t.id < 0 ||
          t.id > 3
        )
          throw new TypeError('Ludo token state is invalid.');
      }
    }
  }
  function O(e, s = Math.random) {
    if ((q(e), e.turn !== 'roll'))
      throw new Error('Move or finish the current roll before rolling again.');
    let o = Number(s());
    if (!Number.isFinite(o) || o < 0 || o >= 1)
      throw new RangeError('Random source must return a number from 0 inclusive to 1 exclusive.');
    let t = Math.floor(o * 6) + 1,
      n = {
        ...e,
        die: t,
        turn: 'move',
        lastEvent: { type: 'roll', playerId: e.players[e.currentPlayer].id, die: t },
      };
    return $(n).length
      ? { game: n, result: 'rolled', die: t }
      : {
          game: { ...n, turn: 'roll', extraRoll: t === 6, movesThisTurn: 0 },
          result: 'no-move',
          die: t,
        };
  }
  function z(e, s) {
    q(e);
    let o = $(e).find((p) => p.tokenId === s);
    if (!o) throw new Error('That token cannot make a legal move with the current die.');
    let t = e.players[e.currentPlayer],
      n = t.tokens.map((p) => (p.id === s ? { ...p, state: o.to, step: o.step } : p)),
      d = { ...t, tokens: n },
      E = e.players.map((p, N) => (N === e.currentPlayer ? d : p)),
      v = [],
      r = null;
    if (o.to === 'track' && ((r = _(t.id, o.step)), !M.has(r))) {
      v = [];
      for (let p = 0; p < E.length; p += 1) {
        if (p === e.currentPlayer) continue;
        let N = E[p],
          a = N.tokens.map((i) =>
            i.state !== 'track' || _(N.id, i.step) !== r
              ? i
              : (v.push({ playerId: N.id, tokenId: i.id }), { ...i, state: 'base', step: -1 }),
          );
        E[p] = { ...N, tokens: a };
      }
    }
    let w = n.every((p) => p.state === 'finished'),
      k = e.die === 6 || v.length > 0 || o.to === 'finished',
      L = !w && k;
    return {
      game: {
        ...e,
        players: E,
        die: null,
        extraRoll: L,
        status: w ? 'complete' : 'playing',
        winner: w ? t.id : null,
        turn: w ? 'complete' : 'roll',
        movesThisTurn: L ? e.movesThisTurn + 1 : 0,
        lastEvent: {
          type: w ? 'win' : 'move',
          playerId: t.id,
          tokenId: s,
          from: o.from,
          to: o.to,
          square: r,
          captured: v.length,
          extraRoll: L,
        },
      },
      result: w ? 'won' : v.length ? 'captured' : L ? 'extra-roll' : 'moved',
      move: o,
      captured: v,
    };
  }
  function U(e) {
    if ((q(e), !e.players[e.currentPlayer].bot || e.turn !== 'move')) return null;
    let s = $(e);
    if (!s.length) return null;
    let o = new Set();
    for (let [t, n] of e.players.entries())
      if (t !== e.currentPlayer)
        for (let d of n.tokens) d.state === 'track' && o.add(_(n.id, d.step));
    return s
      .map((t) => {
        let n = t.to === 'track' ? _(e.players[e.currentPlayer].id, t.step) : null,
          d =
            t.to === 'finished'
              ? 1e3
              : t.to === 'home'
                ? 50 + t.step
                : t.from === 'base'
                  ? 40
                  : n !== null && !M.has(n) && o.has(n)
                    ? 100
                    : t.step;
        return { move: t, score: d };
      })
      .sort((t, n) => n.score - t.score || t.move.tokenId - n.move.tokenId)[0].move.tokenId;
  }
  function B(e) {
    if ((q(e), e.turn !== 'roll' || e.extraRoll))
      throw new Error('The current player must take the extra roll before passing the turn.');
    return {
      ...e,
      currentPlayer: (e.currentPlayer + 1) % e.players.length,
      die: null,
      extraRoll: !1,
      turn: 'roll',
      movesThisTurn: 0,
    };
  }
  function j(e) {
    return Number.isInteger(e) && M.has(e);
  }
  function D(e = document) {
    let s = e.querySelector('[data-tool-copy]');
    if (!s) throw new Error('Localized tool copy is missing.');
    return JSON.parse(s.textContent);
  }
  function m(e, s, o = 'info') {
    let t = e.querySelector('[data-status]');
    t && ((t.textContent = s), (t.dataset.kind = o));
  }
  var c = document.querySelector('[data-tool="ludo-game"]');
  if (c) {
    let P = function () {
        if (!r) return;
        let a = r.status === 'playing',
          i = r.players[r.currentPlayer],
          T = new Set($(r).map(({ tokenId: l }) => l));
        ((d.disabled = !a || i.bot || r.turn !== 'roll'),
          (E.disabled = !a || i.bot || r.turn !== 'roll' || r.extraRoll),
          (n.textContent = `${e.fields.die}: ${r.die ?? '\u2014'}${r.extraRoll ? ` \xB7 ${e.messages.extraRoll.replace('{player}', k(i))}` : ''}`),
          t.replaceChildren());
        let y = document.createElement('div');
        ((y.className = 'ludo-game__track'), y.setAttribute('aria-hidden', 'true'));
        let b = new Map();
        for (let l of r.players)
          for (let u of l.tokens) {
            if (u.state !== 'track') continue;
            let h = _(l.id, u.step),
              f = b.get(h) ?? [];
            (f.push({ player: l, token: u }), b.set(h, f));
          }
        for (let l = 0; l < 52; l += 1) {
          let u, h;
          l < 14
            ? ((u = 1), (h = l + 1))
            : l < 27
              ? ((u = l - 12), (h = 14))
              : l < 40
                ? ((u = 14), (h = 39 - l))
                : ((u = 53 - l), (h = 1));
          let f = document.createElement('div');
          ((f.className = `ludo-game__square${j(l) ? ' is-safe' : ''}`),
            (f.style.gridRow = String(u)),
            (f.style.gridColumn = String(h)),
            (f.textContent = String(l + 1)));
          for (let { player: I, token: g } of b.get(l) ?? []) {
            let R = document.createElement('span');
            ((R.className = 'ludo-game__marker'),
              R.style.setProperty('--player-color', v[I.id]),
              (R.textContent = I.id[0].toUpperCase() + String(g.id + 1)),
              f.append(R));
          }
          y.append(f);
        }
        let F = { red: [4, 4], green: [9, 4], yellow: [9, 9], blue: [4, 9] };
        for (let l of r.players) {
          let [u, h] = F[l.id],
            f = document.createElement('div');
          ((f.className = `ludo-game__home ludo-game__home--${l.id}`),
            (f.style.gridColumn = `${u} / span 3`),
            (f.style.gridRow = `${h} / span 3`),
            f.style.setProperty('--player-color', v[l.id]));
          let I = l.tokens.filter(({ state: g }) => g === 'base').length;
          ((f.textContent = `${k(l)} \xB7 ${e.fields.base}: ${I}`), y.append(f));
        }
        t.append(y);
        for (let [l, u] of r.players.entries()) {
          let h = document.createElement('section');
          ((h.className = `ludo-game__player${l === r.currentPlayer && a ? ' is-current' : ''}`),
            h.style.setProperty('--player-color', v[u.id]));
          let f = document.createElement('h3');
          ((f.textContent = `${k(u)}${u.bot ? ` \xB7 ${e.fields.bots}` : ''}${l === r.currentPlayer && a ? ` \xB7 ${e.fields.currentPlayer}` : ''}`),
            h.append(f));
          let I = document.createElement('div');
          I.className = 'ludo-game__tokens';
          for (let g of u.tokens) {
            let R = e.fields.token
                .replace('{player}', k(u))
                .replace('{token}', String(g.id + 1))
                .replace('{state}', L(u, g)),
              x = document.createElement('button');
            ((x.type = 'button'),
              (x.dataset.action = 'move'),
              (x.className = `ludo-game__token ludo-game__token--${u.id}`),
              (x.dataset.token = String(g.id)),
              (x.dataset.player = u.id),
              (x.textContent = `${g.id + 1} \xB7 ${L(u, g)}`),
              x.setAttribute('aria-label', R),
              x.setAttribute('aria-pressed', String(l === r.currentPlayer && T.has(g.id))),
              (x.disabled = !a || l !== r.currentPlayer || !T.has(g.id) || u.bot),
              I.append(x));
          }
          (h.append(I), t.append(h));
        }
      },
      N = function () {
        let a = Number(s.value);
        (Number(o.value) >= a && (o.value = String(a - 1)),
          (r = G({ players: a, bots: Math.min(Number(o.value), a - 1) })),
          P(),
          m(c, e.messages.started.replace('{player}', k(r.players[0])), 'success'),
          p());
      },
      e = D(c),
      s = c.querySelector('[data-players]'),
      o = c.querySelector('[data-bots]'),
      t = c.querySelector('[data-ludo-board]'),
      n = c.querySelector('[data-die]'),
      d = c.querySelector('[data-action="roll"]'),
      E = c.querySelector('[data-action="pass"]'),
      v = { red: '#b42318', green: '#16803c', yellow: '#a15c00', blue: '#175cd3' },
      r = null,
      w = !1,
      k = (a) => a.id[0].toUpperCase() + a.id.slice(1),
      L = (a, i) =>
        i.state === 'base'
          ? e.fields.base
          : i.state === 'finished'
            ? e.fields.finished
            : i.state === 'home'
              ? `${e.fields.homeLane} ${i.step - 50}/6`
              : `${e.fields.track} ${_(a.id, i.step) + 1}`;
    async function p() {
      if (!(w || !r)) {
        w = !0;
        try {
          let a = 0;
          for (; r.status === 'playing' && r.players[r.currentPlayer].bot && a < 120;) {
            ((a += 1),
              r.turn === 'roll' && a === 1 && m(c, e.fields.botTurn, 'polite'),
              await new Promise((y) => setTimeout(y, 280)),
              r.turn === 'roll' && (r = O(r).game));
            let i = U(r);
            if (i === null) {
              (r.extraRoll || (r = B(r)), P());
              continue;
            }
            let T = z(r, i);
            ((r = T.game),
              P(),
              T.result === 'won'
                ? m(c, e.messages.won.replace('{player}', k(r.players[r.currentPlayer])), 'success')
                : m(c, e.messages.botMoved, 'polite'));
          }
          a >= 120 &&
            r.status === 'playing' &&
            r.players[r.currentPlayer].bot &&
            m(c, e.messages.ready, 'error');
        } finally {
          ((w = !1), P());
        }
      }
    }
    (c.addEventListener('click', (a) => {
      let i = a.target.closest('[data-action]')?.dataset.action;
      if (i === 'start' || i === 'newGame') {
        N();
        return;
      }
      if (!r || r.status !== 'playing') return;
      if (i === 'roll') {
        try {
          let y = O(r);
          ((r = y.game), P());
          let b = k(r.players[r.currentPlayer]);
          (m(
            c,
            y.result === 'no-move'
              ? e.messages.noMove.replace('{player}', b)
              : e.messages.rolled.replace('{player}', b).replace('{die}', String(y.die)),
            y.result === 'no-move' ? 'info' : 'polite',
          ),
            p());
        } catch {
          m(c, e.messages.invalidMove, 'error');
        }
        return;
      }
      if (i === 'pass') {
        try {
          if ($(r).length) return m(c, e.messages.chooseMove, 'info');
          ((r = B(r)), P(), m(c, e.messages.passed, 'polite'), p());
        } catch {
          m(c, e.messages.invalidMove, 'error');
        }
        return;
      }
      let T = a.target.closest('[data-token]');
      if (!(!T || T.dataset.player !== r.players[r.currentPlayer].id))
        try {
          let y = z(r, Number(T.dataset.token));
          ((r = y.game), P());
          let b = k(r.players[r.currentPlayer]);
          (y.result === 'won'
            ? m(c, e.messages.won.replace('{player}', b), 'success')
            : y.result === 'captured'
              ? m(
                  c,
                  e.messages.captured
                    .replace('{player}', b)
                    .replace('{count}', String(y.captured.length)),
                  'success',
                )
              : y.result === 'extra-roll'
                ? m(c, e.messages.extraRoll.replace('{player}', b), 'polite')
                : m(c, e.messages.moved.replace('{player}', b), 'polite'),
            p());
        } catch {
          m(c, e.messages.invalidMove, 'error');
        }
    }),
      s.addEventListener('change', () => {
        let a = Number(s.value) - 1;
        for (let i of o.options) i.disabled = Number(i.value) > a;
        Number(o.value) > a && (o.value = String(a));
      }),
      m(c, e.messages.ready, 'polite'));
  }
})();
