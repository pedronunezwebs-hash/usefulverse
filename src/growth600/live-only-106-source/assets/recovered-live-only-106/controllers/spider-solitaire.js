(() => {
  function v(e, t, n = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = t), (r.dataset.kind = n));
  }
  var H = Object.freeze(['spades', 'hearts', 'clubs', 'diamonds']),
    Q = Object.freeze(['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']),
    k = 10,
    L = 100;
  function j(e) {
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
  function R(e) {
    return Object.freeze({ id: e.id, suit: e.suit, rank: e.rank, faceUp: !!e.faceUp });
  }
  function z(e) {
    return Object.freeze({
      suits: e.suits,
      columns: Object.freeze(e.columns.map((t) => Object.freeze(t.map(R)))),
      stock: Object.freeze(e.stock.map(R)),
      completedRuns: e.completedRuns,
      moves: e.moves,
      status: e.status,
    });
  }
  function q(e) {
    return Object.freeze({
      ...e,
      columns: Object.freeze(e.columns.map((t) => Object.freeze(t.map(R)))),
      stock: Object.freeze(e.stock.map(R)),
      history: Object.freeze((e.history ?? []).map((t) => (t.columns ? z(t) : t))),
    });
  }
  function I(e, t) {
    let n = [...e.history, z(e)].slice(-L);
    return q({ ...e, ...t, history: n });
  }
  function J(e) {
    let t = Number(e());
    if (!Number.isFinite(t) || t < 0 || t >= 1)
      throw new RangeError('Random source must return a value from 0 up to 1.');
    return t;
  }
  function K(e, t) {
    let n = H.slice(0, e),
      r = 8 / e,
      o = [];
    for (let s of n)
      for (let c = 0; c < r; c += 1)
        for (let h = 1; h <= 13; h += 1)
          o.push({ id: `${s}-${c}-${h}`, suit: s, rank: h, faceUp: !1 });
    for (let s = o.length - 1; s > 0; s -= 1) {
      let c = Math.floor(J(t) * (s + 1));
      [o[s], o[c]] = [o[c], o[s]];
    }
    return o;
  }
  function O({ suits: e = 1, random: t = Math.random } = {}) {
    if (![1, 2, 4].includes(Number(e)))
      throw new RangeError('Spider Solitaire supports 1, 2 or 4 suits.');
    if (typeof t != 'function') throw new TypeError('Provide a random number function.');
    let n = K(Number(e), t),
      r = Array.from({ length: k }, () => []);
    for (let o = 0; o < 6; o += 1)
      for (let s = 0; s < k; s += 1) (o < 5 || s < 4) && r[s].push(n.pop());
    for (let o of r) o.at(-1).faceUp = !0;
    return q({
      suits: Number(e),
      columns: r,
      stock: n,
      completedRuns: 0,
      moves: 0,
      status: 'playing',
      history: [],
    });
  }
  function E(e) {
    if (!Array.isArray(e) || e.length < 1 || e.some((t) => !t.faceUp)) return !1;
    for (let t = 1; t < e.length; t += 1)
      if (e[t - 1].rank !== e[t].rank + 1 || e[t - 1].suit !== e[t].suit) return !1;
    return !0;
  }
  function T(e) {
    let t = 0;
    for (; e.length >= 13;) {
      let n = e.slice(-13);
      if (
        n[0].rank !== 13 ||
        n[12].rank !== 1 ||
        n.some((r, o) => !r.faceUp || r.suit !== n[0].suit || r.rank !== 13 - o)
      )
        break;
      (e.splice(-13, 13), (t += 1));
    }
    return (e.length && !e.at(-1).faceUp && (e.at(-1).faceUp = !0), t);
  }
  function M(e, { from: t, startIndex: n, to: r } = {}) {
    if (!e || e.status !== 'playing') throw new RangeError('This Spider game is not active.');
    if (
      ![t, n, r].every(Number.isInteger) ||
      t < 0 ||
      t >= k ||
      r < 0 ||
      r >= k ||
      n < 0 ||
      n >= (e.columns[t]?.length ?? 0) ||
      t === r
    )
      throw new RangeError('Choose a valid source card and a different destination column.');
    let o = e.columns[t],
      s = e.columns[r],
      c = o.slice(n);
    if (!E(c))
      throw new RangeError('Only face-up descending runs of the same suit can move together.');
    let h = s.at(-1);
    if (h && h.rank !== c[0].rank + 1)
      throw new RangeError('Place a card or run on the next higher rank, or on an empty column.');
    let y = e.columns.map((_) => _.map((C) => ({ ...C }))),
      N = y[t].splice(n);
    (y[r].push(...N), y[t].length && !y[t].at(-1).faceUp && (y[t].at(-1).faceUp = !0));
    let m = T(y[t]) + T(y[r]),
      g = e.completedRuns + m;
    return I(e, {
      columns: y,
      completedRuns: g,
      moves: e.moves + 1,
      status: g === 8 ? 'won' : 'playing',
    });
  }
  function D(e) {
    if (!e || e.status !== 'playing') throw new RangeError('This Spider game is not active.');
    if (e.stock.length < k) throw new RangeError('No stock deal remains.');
    if (e.columns.some((r) => r.length === 0))
      throw new RangeError('Fill every empty column before dealing from the stock.');
    let t = e.stock.map((r) => ({ ...r })),
      n = e.columns.map((r) => r.map((o) => ({ ...o })));
    for (let r of n) {
      let o = t.pop();
      ((o.faceUp = !0), r.push(o));
    }
    return I(e, { columns: n, stock: t, moves: e.moves + 1 });
  }
  function P(e) {
    if (!e?.history?.length) return e;
    let t = e.history.slice(),
      n = t.pop();
    return q({ ...n, history: t });
  }
  function F(e) {
    if (!e || e.status !== 'playing') return null;
    let t = [];
    for (let n = 0; n < k; n += 1) {
      let r = e.columns[n];
      for (let o = 0; o < r.length; o += 1) {
        let s = r.slice(o);
        if (E(s))
          for (let c = 0; c < k; c += 1) {
            if (n === c) continue;
            let h = e.columns[c].at(-1);
            (!h || h.rank === s[0].rank + 1) &&
              t.push({
                from: n,
                startIndex: o,
                to: c,
                count: s.length,
                rank: s[0].rank,
                suit: s[0].suit,
              });
          }
      }
    }
    return (
      t.sort(
        (n, r) =>
          r.count - n.count ||
          +(r.rank === 13) - +(n.rank === 13) ||
          n.to - r.to ||
          n.from - r.from,
      ),
      t[0] ? Object.freeze(t[0]) : null
    );
  }
  var l = document.querySelector('[data-tool="spider-solitaire"]');
  if (l) {
    let g = function (i = '') {
        (t.replaceChildren(),
          o.columns.forEach((u, d) => {
            let p = document.createElement('section');
            p.className = 'spider-solitaire__column';
            let f = document.createElement('button');
            ((f.type = 'button'),
              (f.className = 'spider-solitaire__column-target'),
              (f.dataset.columnTarget = String(d)),
              (f.textContent = `${e.fields.column} ${d + 1}`),
              f.setAttribute('aria-label', `${e.fields.column} ${d + 1}. ${e.fields.dropHere}`),
              p.append(f));
            let a = document.createElement('div');
            ((a.className = 'spider-solitaire__pile'),
              a.setAttribute('role', 'list'),
              u.forEach((b, $) => {
                let w = document.createElement('div');
                if (
                  ((w.className = 'spider-solitaire__card-item'),
                  w.setAttribute('role', 'listitem'),
                  !b.faceUp)
                ) {
                  let x = document.createElement('span');
                  ((x.className = 'spider-solitaire__card spider-solitaire__card--back'),
                    x.setAttribute('role', 'img'),
                    x.setAttribute('aria-label', e.fields.faceDown),
                    w.append(x),
                    a.append(w));
                  return;
                }
                let S = document.createElement('button');
                ((S.type = 'button'),
                  (S.className = 'spider-solitaire__card'),
                  (S.dataset.column = String(d)),
                  (S.dataset.cardIndex = String($)),
                  s?.from === d && $ >= s.startIndex && S.classList.add('is-selected'));
                let B = `${N(b.rank)} ${h[b.suit]}. ${e.fields.column} ${d + 1}. ${e.fields.selectCard}`;
                (S.setAttribute('aria-label', B),
                  S.setAttribute('aria-pressed', String(s?.from === d && $ >= s.startIndex)));
                let U = document.createElement('span');
                U.textContent =
                  b.rank === 1
                    ? 'A'
                    : b.rank === 11
                      ? 'J'
                      : b.rank === 12
                        ? 'Q'
                        : b.rank === 13
                          ? 'K'
                          : String(b.rank);
                let A = document.createElement('span');
                ((A.textContent = c[b.suit]),
                  A.setAttribute('aria-hidden', 'true'),
                  S.append(U, A),
                  (b.suit === 'hearts' || b.suit === 'diamonds') && S.classList.add('is-red'),
                  w.append(S),
                  a.append(w));
              }),
              p.append(a),
              t.append(p));
          }),
          (l.querySelector('[data-spider-stock-count]').textContent =
            `${o.stock.length} ${e.fields.stockCount}`),
          (l.querySelector('[data-spider-runs]').textContent = `${o.completedRuns}/8`),
          (l.querySelector('[data-spider-moves]').textContent = String(o.moves)),
          (r.disabled =
            o.stock.length < 10 || o.columns.some((u) => u.length === 0) || o.status === 'won'));
        for (let u of ['undo', 'hint', 'cancelSelection'])
          l.querySelector(`[data-action="${u}"]`).disabled =
            u === 'undo'
              ? o.history.length === 0
              : u === 'cancelSelection'
                ? !s
                : o.status === 'won';
        i && l.querySelector(i)?.focus();
      },
      _ = function (i) {
        let u = Number(i.dataset.column),
          d = Number(i.dataset.cardIndex),
          p = o.columns[u].slice(d);
        if (!E(p)) {
          m('invalidMove', {}, 'error');
          return;
        }
        ((s = { from: u, startIndex: d, count: p.length }),
          g(`[data-column="${u}"][data-card-index="${d}"]`),
          m('selected', { count: p.length, column: u + 1 }));
      },
      C = function (i) {
        if (!s) {
          v(l, e.fields.emptySelection, 'error');
          return;
        }
        try {
          ((o = M(o, { from: s.from, startIndex: s.startIndex, to: i })),
            (s = null),
            g(`[data-column-target="${i}"]`),
            o.status === 'won' ? m('won') : m('moved'));
        } catch {
          m('invalidMove', {}, 'error');
        }
      },
      e = JSON.parse(l.querySelector('[data-tool-copy]').textContent),
      t = l.querySelector('[data-spider-columns]'),
      n = l.querySelector('[data-status]'),
      r = l.querySelector('[data-action="drawStock"]'),
      o = O(),
      s = null,
      c = { spades: '\u2660', hearts: '\u2665', clubs: '\u2663', diamonds: '\u2666' },
      h = {
        spades: e.fields.spades,
        hearts: e.fields.hearts,
        clubs: e.fields.clubs,
        diamonds: e.fields.diamonds,
      },
      y = { 1: e.fields.ace, 11: e.fields.jack, 12: e.fields.queen, 13: e.fields.king },
      N = (i) => y[i] ?? String(i),
      m = (i, u = {}, d = 'success') =>
        v(
          l,
          Object.entries(u).reduce((p, [f, a]) => p.replaceAll(`{${f}}`, String(a)), e.messages[i]),
          d,
        );
    (l.addEventListener('click', (i) => {
      let u = i.target.closest('[data-action]'),
        d = i.target.closest('[data-card-index]'),
        p = i.target.closest('[data-column-target]');
      if (d) {
        _(d);
        return;
      }
      if (p) {
        C(Number(p.dataset.columnTarget));
        return;
      }
      if (!u) return;
      let f = u.dataset.action;
      if (f === 'newDeal') {
        let a = l.querySelector('[name="seed"]').value.trim();
        try {
          ((o = O({
            suits: Number(l.querySelector('[name="suitCount"]').value),
            ...(a ? { random: j(a) } : {}),
          })),
            (s = null),
            g('[data-action="newDeal"]'),
            m('newDeal'));
        } catch {
          v(l, e.fields.seedHint, 'error');
        }
      }
      if (f === 'drawStock')
        try {
          ((o = D(o)), (s = null), g('[data-action="drawStock"]'), m('stockDealt'));
        } catch {
          m(o.columns.some((a) => !a.length) ? 'emptyColumn' : 'stockUnavailable', {}, 'error');
        }
      if (f === 'undo') {
        let a = P(o);
        a === o
          ? m('nothingToUndo', {}, 'error')
          : ((o = a), (s = null), g('[data-action="undo"]'), m('undone'));
      }
      if (f === 'hint') {
        let a = F(o);
        a
          ? ((s = { from: a.from, startIndex: a.startIndex, count: a.count }),
            g(`[data-column="${a.from}"][data-card-index="${a.startIndex}"]`),
            m('hint', { count: a.count, from: a.from + 1, to: a.to + 1 }))
          : m('noHint', {}, 'error');
      }
      f === 'cancelSelection' &&
        ((s = null),
        g('[data-action="cancelSelection"]'),
        v(l, e.fields.emptySelection, 'success'));
    }),
      g(),
      m('ready'));
  }
})();
