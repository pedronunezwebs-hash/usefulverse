(() => {
  function S(e, t, n = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = t), (r.dataset.kind = n));
  }
  var N = Object.freeze(['spades', 'hearts', 'clubs', 'diamonds']),
    E = 8,
    $ = 4,
    G = 100;
  function M(e) {
    if (typeof e != 'string' || !e.trim() || Array.from(e).length > 48)
      throw new RangeError('Enter a replay seed containing 1 to 48 characters.');
    let t = 2166136261;
    for (let n of e) ((t ^= n.codePointAt(0)), (t = Math.imul(t, 16777619)));
    return () => {
      let n = (t += 1831565813);
      return (
        (n = Math.imul(n ^ (n >>> 15), n | 1)),
        (n ^= n + Math.imul(n ^ (n >>> 7), n | 61)),
        ((n ^ (n >>> 14)) >>> 0) / 4294967296
      );
    };
  }
  var v = (e) => (e === 'hearts' || e === 'diamonds' ? 'red' : 'black'),
    _ = (e) => e && Object.freeze({ id: e.id, suit: e.suit, rank: e.rank });
  function V(e) {
    return Object.freeze({
      tableau: Object.freeze(e.tableau.map((t) => Object.freeze(t.map(_)))),
      freeCells: Object.freeze(e.freeCells.map(_)),
      foundations: Object.freeze({ ...e.foundations }),
      moves: e.moves,
      status: e.status,
    });
  }
  function T(e) {
    return Object.freeze({
      ...e,
      tableau: Object.freeze(e.tableau.map((t) => Object.freeze(t.map(_)))),
      freeCells: Object.freeze(e.freeCells.map(_)),
      foundations: Object.freeze({ ...e.foundations }),
      history: Object.freeze(e.history ?? []),
    });
  }
  function F(e, t) {
    return T({ ...e, ...t, history: [...e.history, V(e)].slice(-G) });
  }
  function O({ freeCells: e, tableau: t, from: n, to: r }) {
    if (
      !Array.isArray(e) ||
      !Array.isArray(t) ||
      !Number.isInteger(n) ||
      !Number.isInteger(r) ||
      n < 0 ||
      n >= t.length ||
      r < 0 ||
      r >= t.length ||
      n === r
    )
      throw new RangeError('Choose two different valid tableau columns.');
    let l = e.filter((f) => f === null).length,
      s = t.reduce((f, a, o) => f + (o !== n && o !== r && a.length === 0 ? 1 : 0), 0);
    return (l + 1) * 2 ** s;
  }
  function j({ random: e = Math.random } = {}) {
    if (typeof e != 'function') throw new TypeError('Provide a random number function.');
    let t = [];
    for (let r of N) for (let l = 1; l <= 13; l += 1) t.push({ id: `${r}-${l}`, suit: r, rank: l });
    for (let r = t.length - 1; r > 0; r -= 1) {
      let l = Number(e());
      if (!Number.isFinite(l) || l < 0 || l >= 1)
        throw new RangeError('Random source must return a value from 0 up to 1.');
      let s = Math.floor(l * (r + 1));
      [t[r], t[s]] = [t[s], t[r]];
    }
    let n = Array.from({ length: E }, () => []);
    return (
      t.forEach((r, l) => n[l % E].push(r)),
      T({
        tableau: n,
        freeCells: Array($).fill(null),
        foundations: Object.fromEntries(N.map((r) => [r, 0])),
        moves: 0,
        status: 'playing',
        history: [],
      })
    );
  }
  function A(e) {
    if (!Array.isArray(e) || e.length < 1) return !1;
    for (let t = 1; t < e.length; t += 1)
      if (e[t - 1].rank !== e[t].rank + 1 || v(e[t - 1].suit) === v(e[t].suit)) return !1;
    return !0;
  }
  function q(e, { from: t, startIndex: n, to: r } = {}) {
    if (!e || e.status !== 'playing') throw new RangeError('This FreeCell game is not active.');
    if (
      ![t, n, r].every(Number.isInteger) ||
      t < 0 ||
      t >= E ||
      r < 0 ||
      r >= E ||
      t === r ||
      n < 0 ||
      n >= (e.tableau[t]?.length ?? 0)
    )
      throw new RangeError('Choose a valid source card and a different destination column.');
    let l = e.tableau[t],
      s = e.tableau[r],
      f = l.slice(n);
    if (!A(f))
      throw new RangeError(
        'Only descending runs with alternating red and black cards can move together.',
      );
    let a = s.at(-1);
    if (a && (a.rank !== f[0].rank + 1 || v(a.suit) === v(f[0].suit)))
      throw new RangeError(
        'Place a card on the next higher rank of the opposite color, or use an empty column.',
      );
    if (f.length > O({ ...e, from: t, to: r }))
      throw new RangeError(
        'That run is larger than the current supermove capacity. Free empty cells or columns first.',
      );
    let o = e.tableau.map((x) => x.map((k) => ({ ...k })));
    return (o[r].push(...o[t].splice(n)), F(e, { tableau: o, moves: e.moves + 1 }));
  }
  function z(e, { from: t, cardIndex: n, cell: r } = {}) {
    if (!e || e.status !== 'playing') throw new RangeError('This FreeCell game is not active.');
    if (!Number.isInteger(r) || r < 0 || r >= $ || e.freeCells[r])
      throw new RangeError('Choose an empty free cell.');
    if (t === 'cell') {
      if (!Number.isInteger(n) || n < 0 || n >= $ || !e.freeCells[n])
        throw new RangeError('Choose an occupied free cell.');
      let f = [...e.freeCells];
      return ((f[r] = f[n]), (f[n] = null), F(e, { freeCells: f, moves: e.moves + 1 }));
    }
    if (!Number.isInteger(t) || t < 0 || t >= E || e.tableau[t].length - 1 !== n)
      throw new RangeError('Only the top card of a tableau column can move to a free cell.');
    let l = e.tableau.map((f) => f.map((a) => ({ ...a }))),
      s = [...e.freeCells];
    return ((s[r] = l[t].pop()), F(e, { tableau: l, freeCells: s, moves: e.moves + 1 }));
  }
  function I(e, { from: t, cardIndex: n, to: r } = {}) {
    if (!e || e.status !== 'playing' || !Number.isInteger(r) || r < 0 || r >= E)
      throw new RangeError('Choose a valid destination column.');
    let l = t === 'cell' ? e.freeCells[n] : e.tableau[t]?.[n];
    if (!l || (t !== 'cell' && e.tableau[t].length - 1 !== n))
      throw new RangeError('Only an exposed card can move to a tableau column.');
    if (t === r) throw new RangeError('Choose a different destination column.');
    let s = e.tableau[r].at(-1);
    if (s && (s.rank !== l.rank + 1 || v(s.suit) === v(l.suit)))
      throw new RangeError(
        'Place a card on the next higher rank of the opposite color, or use an empty column.',
      );
    let f = e.tableau.map((o) => o.map((x) => ({ ...x }))),
      a = [...e.freeCells];
    return (
      t === 'cell' ? (a[n] = null) : f[t].pop(),
      f[r].push(l),
      F(e, { tableau: f, freeCells: a, moves: e.moves + 1 })
    );
  }
  function U(e, { from: t, cardIndex: n } = {}) {
    if (!e || e.status !== 'playing') throw new RangeError('This FreeCell game is not active.');
    let r = t === 'cell' ? e.freeCells[n] : e.tableau[t]?.[n];
    if (!r || (t !== 'cell' && e.tableau[t].length - 1 !== n))
      throw new RangeError('Only an exposed card can move to a foundation.');
    if (r.rank !== e.foundations[r.suit] + 1)
      throw new RangeError('A foundation must build up in the same suit, starting with Ace.');
    let l = e.tableau.map((o) => o.map((x) => ({ ...x }))),
      s = [...e.freeCells],
      f = { ...e.foundations };
    (t === 'cell' ? (s[n] = null) : l[t].pop(), (f[r.suit] = r.rank));
    let a = N.every((o) => f[o] === 13) ? 'won' : 'playing';
    return F(e, { tableau: l, freeCells: s, foundations: f, moves: e.moves + 1, status: a });
  }
  function H(e) {
    if (!e?.history?.length) return e;
    let t = [...e.history],
      n = t.pop();
    return T({ ...n, history: t });
  }
  function J(e) {
    if (!e || e.status !== 'playing') return null;
    for (let t of N) {
      let n = e.foundations[t] + 1,
        r = e.freeCells.findIndex((s) => s?.suit === t && s.rank === n);
      if (r >= 0) return Object.freeze({ from: 'cell', cardIndex: r, to: 'foundation', suit: t });
      let l = e.tableau.findIndex((s) => s.at(-1)?.suit === t && s.at(-1).rank === n);
      if (l >= 0)
        return Object.freeze({
          from: l,
          cardIndex: e.tableau[l].length - 1,
          to: 'foundation',
          suit: t,
        });
    }
    for (let t = 0; t < $; t += 1) {
      let n = e.freeCells[t];
      if (!n) continue;
      let r = e.tableau.findIndex(
        (l) => !l.length || (l.at(-1).rank === n.rank + 1 && v(l.at(-1).suit) !== v(n.suit)),
      );
      if (r >= 0) return Object.freeze({ from: 'cell', cardIndex: t, to: r, count: 1 });
    }
    for (let t = 0; t < E; t += 1) {
      let n = e.tableau[t];
      for (let r = 0; r < n.length; r += 1) {
        let l = n.slice(r);
        if (!(!A(l) || l.length > O(e)))
          for (let s = 0; s < E; s += 1) {
            if (t === s) continue;
            let f = e.tableau[s].at(-1);
            if (!f || (f.rank === l[0].rank + 1 && v(f.suit) !== v(l[0].suit)))
              return Object.freeze({
                from: t,
                startIndex: r,
                to: s,
                count: l.length,
                rank: l[0].rank,
              });
          }
      }
    }
    for (let t = 0; t < $; t += 1)
      if (!e.freeCells[t]) {
        let n = e.tableau.findIndex((r) => r.length > 1);
        if (n >= 0)
          return Object.freeze({
            from: n,
            cardIndex: e.tableau[n].length - 1,
            to: 'cell',
            cell: t,
          });
      }
    return null;
  }
  var b = document.querySelector('[data-tool="freecell"]');
  if (b) {
    let y = function (d = '') {
        (t.replaceChildren(),
          n.replaceChildren(),
          r.replaceChildren(),
          a.freeCells.forEach((c, m) => {
            let u = document.createElement('button');
            ((u.type = 'button'),
              (u.className = `freecell__slot${c ? ' freecell__card' : ''}`),
              (u.dataset.freecell = String(m)),
              u.setAttribute(
                'aria-label',
                c
                  ? `${e.fields.freeCells}, ${k(c)}. ${e.fields.selectCard}`
                  : `${e.fields.emptyCell} ${m + 1}`,
              ),
              c &&
                ((u.textContent = `${c.rank === 1 ? 'A' : c.rank === 11 ? 'J' : c.rank === 12 ? 'Q' : c.rank === 13 ? 'K' : c.rank} ${l[c.suit]}`),
                (c.suit === 'hearts' || c.suit === 'diamonds') && u.classList.add('is-red')),
              o?.from === 'cell' && o.index === m && u.classList.add('is-selected'),
              n.append(u));
          }),
          s.forEach((c) => {
            let m = document.createElement('button');
            ((m.type = 'button'),
              (m.className = 'freecell__slot freecell__foundation'),
              (m.dataset.foundation = c));
            let u = a.foundations[c];
            ((m.textContent = u
              ? `${u === 1 ? 'A' : u === 11 ? 'J' : u === 12 ? 'Q' : u === 13 ? 'K' : u} ${l[c]}`
              : l[c]),
              m.setAttribute(
                'aria-label',
                u
                  ? `${e.fields.foundations}, ${k({ suit: c, rank: u })}`
                  : e.fields.emptyFoundation + ': ' + e.fields[c],
              ),
              (c === 'hearts' || c === 'diamonds') && m.classList.add('is-red'),
              r.append(m));
          }),
          a.tableau.forEach((c, m) => {
            let u = document.createElement('section');
            u.className = 'freecell__column';
            let g = document.createElement('button');
            ((g.type = 'button'),
              (g.className = 'freecell__target'),
              (g.dataset.columnTarget = String(m)),
              (g.textContent = `${e.fields.column} ${m + 1}`),
              g.setAttribute('aria-label', `${e.fields.column} ${m + 1}. ${e.fields.dropHere}`),
              u.append(g));
            let i = document.createElement('div');
            ((i.className = 'freecell__pile'),
              i.setAttribute('role', 'list'),
              c.forEach((w, R) => {
                let C = document.createElement('button');
                ((C.type = 'button'),
                  (C.className = 'freecell__card'),
                  (C.dataset.column = String(m)),
                  (C.dataset.cardIndex = String(R)));
                let K = c.slice(R),
                  Q = A(K);
                ((C.textContent = `${w.rank === 1 ? 'A' : w.rank === 11 ? 'J' : w.rank === 12 ? 'Q' : w.rank === 13 ? 'K' : w.rank} ${l[w.suit]}`),
                  C.setAttribute(
                    'aria-label',
                    `${k(w)}. ${e.fields.column} ${m + 1}. ${Q ? e.fields.selectCard : ''}`,
                  ),
                  C.setAttribute(
                    'aria-pressed',
                    String(o?.from === 'tableau' && o.column === m && R >= o.index),
                  ),
                  o?.from === 'tableau' &&
                    o.column === m &&
                    R >= o.index &&
                    C.classList.add('is-selected'),
                  (w.suit === 'hearts' || w.suit === 'diamonds') && C.classList.add('is-red'),
                  i.append(C));
              }),
              u.append(i),
              t.append(u));
          }),
          (b.querySelector('[data-freecell-moves]').textContent = String(a.moves)));
        let h = Math.max(
          ...a.tableau.flatMap((c, m) =>
            c.length ? a.tableau.map((u, g) => (g === m ? 0 : O({ ...a, from: m, to: g }))) : [0],
          ),
        );
        b.querySelector('[data-freecell-capacity]').textContent = e.fields.capacityValue.replace(
          '{count}',
          String(h),
        );
        for (let c of ['undo', 'hint', 'cancelSelection'])
          b.querySelector(`[data-action="${c}"]`).disabled =
            c === 'undo'
              ? a.history.length === 0
              : c === 'cancelSelection'
                ? !o
                : a.status === 'won';
        (a.status === 'won' && p('won'), d && b.querySelector(d)?.focus());
      },
      L = function (d, h, c = -1) {
        if (!(d === 'cell' ? a.freeCells[h] : a.tableau[c]?.[h])) return;
        ((o = { from: d, index: h, column: c }),
          y(
            d === 'cell'
              ? `[data-freecell="${h}"]`
              : `[data-column="${c}"][data-card-index="${h}"]`,
          ));
        let u = d === 'tableau' ? a.tableau[c].length - h : 1;
        p('selected', { count: u, column: c + 1 });
      },
      D = function (d) {
        if (!o) {
          S(b, e.fields.emptySelection, 'error');
          return;
        }
        try {
          ((a =
            o.from === 'cell'
              ? I(a, { from: 'cell', cardIndex: o.index, to: d })
              : q(a, { from: o.column, startIndex: o.index, to: d })),
            (o = null),
            y(`[data-column-target="${d}"]`),
            p('moved'));
        } catch {
          p('invalidMove', {}, 'error');
        }
      },
      P = function (d) {
        if (!o) {
          S(b, e.fields.emptySelection, 'error');
          return;
        }
        try {
          if ((o.from === 'cell' ? a.freeCells[o.index] : a.tableau[o.column][o.index])?.suit !== d)
            throw new RangeError('Choose the foundation that matches the selected card suit.');
          ((a = U(a, { from: o.from === 'cell' ? 'cell' : o.column, cardIndex: o.index })),
            (o = null),
            y(`[data-foundation="${d}"]`),
            a.status !== 'won' && p('moved'));
        } catch {
          p('invalidMove', {}, 'error');
        }
      },
      e = JSON.parse(b.querySelector('[data-tool-copy]').textContent),
      t = b.querySelector('[data-freecell-columns]'),
      n = b.querySelector('[data-freecell-cells]'),
      r = b.querySelector('[data-freecell-foundations]'),
      l = { spades: '\u2660', hearts: '\u2665', clubs: '\u2663', diamonds: '\u2666' },
      s = ['spades', 'hearts', 'clubs', 'diamonds'],
      f = { 1: e.fields.ace, 11: e.fields.jack, 12: e.fields.queen, 13: e.fields.king },
      a = j(),
      o = null,
      x = (d) => f[d] ?? String(d),
      k = (d) => `${x(d.rank)} ${e.fields[d.suit]}`,
      p = (d, h = {}, c = 'success') =>
        S(
          b,
          Object.entries(h).reduce((m, [u, g]) => m.replaceAll(`{${u}}`, String(g)), e.messages[d]),
          c,
        );
    (b.addEventListener('click', (d) => {
      let h = d.target.closest('[data-action]'),
        c = d.target.closest('[data-card-index]'),
        m = d.target.closest('[data-freecell]'),
        u = d.target.closest('[data-foundation]'),
        g = d.target.closest('[data-column-target]');
      if (h) {
        if (h.dataset.action === 'newDeal') {
          let i = b.querySelector('[name="seed"]').value.trim();
          try {
            ((a = j(i ? { random: M(i) } : {})),
              (o = null),
              y('[data-action="newDeal"]'),
              p('newDeal'));
          } catch {
            S(b, e.messages.seedError, 'error');
          }
        }
        if (h.dataset.action === 'undo') {
          let i = H(a);
          i === a
            ? p('nothingToUndo', {}, 'error')
            : ((a = i), (o = null), y('[data-action="undo"]'), p('undone'));
        }
        if (h.dataset.action === 'hint') {
          let i = J(a);
          i
            ? i.to === 'foundation'
              ? ((o = {
                  from: i.from,
                  index: i.cardIndex,
                  column: i.from === 'cell' ? -1 : i.from,
                }),
                y(),
                p('foundationHint', { suit: e.fields[i.suit] }))
              : i.from === 'cell'
                ? ((o = { from: 'cell', index: i.cardIndex, column: -1 }),
                  y(),
                  p('hint', { count: 1, from: e.fields.freeCells, to: i.to + 1 }))
                : ((o = { from: 'tableau', index: i.startIndex, column: i.from }),
                  y(),
                  p('hint', { count: i.count, from: i.from + 1, to: i.to + 1 }))
            : p('noHint', {}, 'error');
        }
        h.dataset.action === 'cancelSelection' &&
          ((o = null),
          y('[data-action="cancelSelection"]'),
          S(b, e.fields.emptySelection, 'success'));
        return;
      }
      if (c) {
        L('tableau', Number(c.dataset.cardIndex), Number(c.dataset.column));
        return;
      }
      if (m) {
        let i = Number(m.dataset.freecell);
        if (o) {
          if (o.from === 'tableau')
            try {
              ((a = z(a, { from: o.column, cardIndex: o.index, cell: i })),
                (o = null),
                y(`[data-freecell="${i}"]`),
                p('moved'));
            } catch {
              p('invalidMove', {}, 'error');
            }
          else if (o.index !== i)
            try {
              ((a = z(a, { from: 'cell', cardIndex: o.index, cell: i })),
                (o = null),
                y(`[data-freecell="${i}"]`),
                p('moved'));
            } catch {
              p('invalidMove', {}, 'error');
            }
        } else a.freeCells[i] && L('cell', i);
        return;
      }
      if (u) {
        P(u.dataset.foundation);
        return;
      }
      g && D(Number(g.dataset.columnTarget));
    }),
      y(),
      p('ready'));
  }
})();
