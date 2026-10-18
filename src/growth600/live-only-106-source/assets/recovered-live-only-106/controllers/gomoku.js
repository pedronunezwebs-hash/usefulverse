(() => {
  var _ = Object.freeze([
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]);
  function G(e) {
    if (
      !e ||
      e.size !== 15 ||
      !Array.isArray(e.board) ||
      e.board.length !== 15 ** 2 ||
      e.board.some((o) => o !== null && o !== 'black' && o !== 'white') ||
      !['black', 'white'].includes(e.currentPlayer) ||
      !['playing', 'won', 'draw'].includes(e.status)
    )
      throw new RangeError('The Gomoku game state is invalid.');
    if (!['computer', 'two-player'].includes(e.mode))
      throw new RangeError('Choose a supported game mode.');
  }
  function v(e = 'computer') {
    if (!['computer', 'two-player'].includes(e))
      throw new RangeError('Choose computer or two-player mode.');
    return Object.freeze({
      size: 15,
      mode: e,
      board: Object.freeze(Array(15 ** 2).fill(null)),
      currentPlayer: 'black',
      status: 'playing',
      winner: null,
      moves: 0,
      lastMove: null,
    });
  }
  function I(e, o, n, r, s, t) {
    let l = 0,
      i = o + r,
      c = n + s;
    for (; i >= 0 && i < 15 && c >= 0 && c < 15 && e[i * 15 + c] === t;)
      ((l += 1), (i += r), (c += s));
    return { count: l, open: i >= 0 && i < 15 && c >= 0 && c < 15 && e[i * 15 + c] === null };
  }
  function Z(e, o, n, r, [s, t]) {
    return !Array.isArray(e) ||
      e.length !== 15 ** 2 ||
      !['black', 'white'].includes(r) ||
      !Number.isInteger(o) ||
      o < 0 ||
      o >= 15 ||
      !Number.isInteger(n) ||
      n < 0 ||
      n >= 15 ||
      e[o * 15 + n] !== r
      ? 0
      : 1 + I(e, o, n, s, t, r).count + I(e, o, n, -s, -t, r).count;
  }
  function U(e, o, n, r = e?.currentPlayer) {
    if (
      !e ||
      !Number.isInteger(o) ||
      !Number.isInteger(n) ||
      o < 0 ||
      o >= 15 ||
      n < 0 ||
      n >= 15 ||
      !['black', 'white'].includes(r)
    )
      return !1;
    let s = o * 15 + n;
    if (e.board?.[s] !== null) return !1;
    let t = e.board.slice();
    return ((t[s] = r), _.some((l) => Z(t, o, n, r, l) >= 5));
  }
  function L(e) {
    if ((G(e), e.status !== 'playing')) return [];
    let o = e.board.flatMap((r, s) => (r ? [s] : []));
    if (!o.length) return [{ row: 7, column: 7 }];
    let n = new Set();
    for (let r of o) {
      let s = Math.floor(r / 15),
        t = r % 15;
      for (let l = -2; l <= 2; l += 1)
        for (let i = -2; i <= 2; i += 1) {
          let c = s + l,
            f = t + i;
          c >= 0 && c < 15 && f >= 0 && f < 15 && e.board[c * 15 + f] === null && n.add(c * 15 + f);
        }
    }
    return [...n].sort((r, s) => r - s).map((r) => ({ row: Math.floor(r / 15), column: r % 15 }));
  }
  function z(e, o, n) {
    if (
      (G(e),
      e.status !== 'playing' ||
        !Number.isInteger(o) ||
        !Number.isInteger(n) ||
        o < 0 ||
        o >= 15 ||
        n < 0 ||
        n >= 15)
    )
      throw new RangeError('Choose an empty point on the board.');
    let r = o * 15 + n;
    if (e.board[r] !== null) throw new RangeError('That point is already occupied.');
    let s = e.board.slice();
    s[r] = e.currentPlayer;
    let t = e.moves + 1,
      l = _.some((c) => Z(s, o, n, e.currentPlayer, c) >= 5),
      i = l ? 'won' : t === s.length ? 'draw' : 'playing';
    return Object.freeze({
      ...e,
      board: Object.freeze(s),
      moves: t,
      status: i,
      winner: l ? e.currentPlayer : null,
      currentPlayer:
        l || i === 'draw' ? e.currentPlayer : e.currentPlayer === 'black' ? 'white' : 'black',
      lastMove: Object.freeze({ row: o, column: n, player: e.currentPlayer }),
    });
  }
  function K(e, o, n, r) {
    let s = e.board.slice();
    s[o * 15 + n] = r;
    let t = 0;
    for (let [l, i] of _) {
      let c = I(s, o, n, l, i, r),
        f = I(s, o, n, -l, -i, r),
        h = 1 + c.count + f.count,
        p = Number(c.open) + Number(f.open);
      h >= 5
        ? (t += 1e7)
        : h === 4
          ? (t += p === 2 ? 1e6 : p === 1 ? 1e5 : 0)
          : h === 3
            ? (t += p === 2 ? 1e4 : p === 1 ? 1e3 : 0)
            : h === 2 && (t += p === 2 ? 100 : p === 1 ? 10 : 0);
    }
    return t;
  }
  function P(e) {
    if ((G(e), e.status !== 'playing')) throw new RangeError('The game is over.');
    let o = L(e);
    if (!o.length) throw new RangeError('No empty points remain.');
    let n = e.currentPlayer === 'black' ? 'white' : 'black';
    for (let r of o) if (U(e, r.row, r.column, e.currentPlayer)) return r;
    for (let r of o) if (U(e, r.row, r.column, n)) return r;
    return o
      .map((r) => ({
        move: r,
        score:
          K(e, r.row, r.column, e.currentPlayer) * 1.05 +
          K(e, r.row, r.column, n) +
          (14 - Math.abs(r.row - 7) - Math.abs(r.column - 7)) / 100,
      }))
      .sort(
        (r, s) => s.score - r.score || r.move.row - s.move.row || r.move.column - s.move.column,
      )[0].move;
  }
  function A(e = document) {
    let o = e.querySelector('[data-tool-copy]');
    if (!o) throw new Error('Localized tool copy is missing.');
    return JSON.parse(o.textContent);
  }
  function N(e, o, n = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = o), (r.dataset.kind = n));
  }
  var m = document.querySelector('[data-tool="gomoku"]');
  if (m) {
    let f = function (a, u = '') {
        ((r.textContent = a), N(m, a, u));
      },
      h = function (a) {
        return a === 'black'
          ? e.fields.blackStone
          : a === 'white'
            ? e.fields.whiteStone
            : e.fields.emptyPoint;
      },
      p = function (a, u, d) {
        return e.fields.cellLabel
          .replace('{row}', String(a + 1))
          .replace('{column}', String(u + 1))
          .replace('{stone}', h(d));
      },
      q = function (a) {
        for (let u = 1; u <= t.board.length; u += 1) {
          let d = (a + u + t.board.length) % t.board.length;
          if (t.board[d] === null) return d;
        }
        return -1;
      },
      S = function () {
        ((n.innerHTML = Array.from(
          { length: t.size },
          (u, d) =>
            `<div role="row" class="gomoku__row">${Array.from({ length: t.size }, (M, O) => {
              let E = d * t.size + O,
                w = t.board[E],
                y = t.lastMove?.row === d && t.lastMove?.column === O,
                b =
                  t.status !== 'playing' ||
                  l ||
                  (t.mode === 'computer' && t.currentPlayer === 'white') ||
                  w !== null,
                $ = E === c && !b ? 0 : -1;
              return `<button type="button" class="gomoku__point${w ? ` gomoku__point--${w}` : ''}${y ? ' is-last-move' : ''}" role="gridcell" data-cell="${E}" aria-label="${p(d, O, w)}" aria-disabled="${b}" ${b ? 'disabled' : ''} tabindex="${$}">${w === 'black' ? '\u25CF' : w === 'white' ? '\u25CB' : ''}</button>`;
            }).join('')}</div>`,
        ).join('')),
          n.setAttribute('aria-label', e.fields.boardLabel));
        let a = t.currentPlayer === 'black' ? e.fields.blackPlayer : e.fields.whitePlayer;
        s.textContent = `${e.fields.currentPlayer}: ${a} \xB7 ${e.fields.moveCount}: ${t.moves}`;
      },
      g = function () {
        t.status === 'won'
          ? f(t.winner === 'black' ? e.messages.blackWon : e.messages.whiteWon, 'success')
          : t.status === 'draw'
            ? f(e.messages.draw, 'success')
            : t.mode === 'computer' && t.currentPlayer === 'white'
              ? f(e.messages.botThinking)
              : f(t.currentPlayer === 'black' ? e.messages.blackTurn : e.messages.whiteTurn);
      },
      x = function (a, u, { keepFocus: d = !1 } = {}) {
        ((t = z(t, a, u)), d || (c = q(a * t.size + u)), S(), g());
      },
      C = function () {
        if (t.mode !== 'computer' || t.currentPlayer !== 'white' || t.status !== 'playing' || l)
          return;
        let a = i;
        ((l = !0),
          S(),
          g(),
          window.setTimeout(() => {
            if (a === i)
              try {
                let u = P(t);
                x(u.row, u.column, { keepFocus: !0 });
              } catch {
                f(e.messages.invalidMove, 'error');
              } finally {
                ((l = !1),
                  S(),
                  t.status === 'playing'
                    ? n.querySelector(`[data-cell="${c}"]:not(:disabled)`)?.focus()
                    : m.querySelector('[data-action="new-game"]')?.focus());
              }
          }, 120));
      },
      k = function () {
        ((i += 1),
          (l = !1),
          (c = 112),
          (t = v(o.elements.namedItem('mode').value)),
          S(),
          f(e.messages.newGame));
      },
      e = A(m),
      o = m.querySelector('#tool-form'),
      n = m.querySelector('[data-gomoku-board]'),
      r = m.querySelector('[data-gomoku-status]'),
      s = m.querySelector('[data-gomoku-stats]'),
      t = v(o.elements.namedItem('mode').value),
      l = !1,
      i = 0,
      c = 112;
    (n.addEventListener('click', (a) => {
      let u = a.target.closest('button[data-cell]');
      if (!u || !n.contains(u) || l) return;
      let d = Number(u.dataset.cell);
      try {
        (x(Math.floor(d / t.size), d % t.size),
          t.mode === 'two-player' &&
            t.status === 'playing' &&
            n.querySelector(`[data-cell="${c}"]:not(:disabled)`)?.focus(),
          C(),
          t.status !== 'playing' && m.querySelector('[data-action="new-game"]')?.focus());
      } catch {
        f(e.messages.invalidMove, 'error');
      }
    }),
      n.addEventListener('keydown', (a) => {
        let u = a.target.closest('button[data-cell]');
        if (!u || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(a.key)) return;
        a.preventDefault();
        let d = Number(u.dataset.cell),
          M = Math.floor(d / t.size),
          O = d % t.size,
          [E, w] =
            a.key === 'ArrowUp'
              ? [-1, 0]
              : a.key === 'ArrowDown'
                ? [1, 0]
                : a.key === 'ArrowLeft'
                  ? [0, -1]
                  : [0, 1],
          y = M,
          b = O;
        do ((y += E), (b += w));
        while (y >= 0 && y < t.size && b >= 0 && b < t.size && t.board[y * t.size + b] !== null);
        (y >= 0 && y < t.size && b >= 0 && b < t.size && ((M = y), (O = b)),
          (c = M * t.size + O),
          S(),
          n.querySelector(`[data-cell="${c}"]:not(:disabled)`)?.focus());
      }),
      m.querySelector('[data-action="new-game"]')?.addEventListener('click', k),
      o.elements.namedItem('mode').addEventListener('change', k),
      o.addEventListener('reset', (a) => {
        (a.preventDefault(), k());
      }),
      S(),
      g());
  }
})();
