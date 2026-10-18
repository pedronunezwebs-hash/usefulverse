(() => {
  var C = new Set(['clubs', 'diamonds', 'hearts', 'spades']),
    z = new Set(Array.from({ length: 13 }, (e, n) => n + 1));
  function b(e) {
    return `${e.rank}:${e.suit}`;
  }
  function E(e) {
    return Math.min(e, 10);
  }
  function v(e, n = 10) {
    if (!Array.isArray(e) || e.length !== n)
      throw new RangeError(`A Gin Rummy hand must contain exactly ${n} cards.`);
    let r = new Set();
    for (let t of e) {
      if (!t || !z.has(t.rank) || !C.has(t.suit))
        throw new RangeError('Each card must use a standard rank (1\u201313) and suit.');
      let o = b(t);
      if (r.has(o)) throw new RangeError('A physical card cannot appear twice.');
      r.add(o);
    }
  }
  function G(e, n, r = 0, t = [], o = []) {
    if (t.length === n) return (o.push(t), o);
    for (let s = r; s <= e.length - (n - t.length); s += 1) G(e, n, s + 1, [...t, e[s]], o);
    return o;
  }
  function T(e) {
    let n = new Map();
    for (let r of [3, 4])
      for (let t of G(e, r)) {
        let o = t.every(({ rank: d }) => d === t[0].rank),
          s = t.every(({ suit: d }) => d === t[0].suit),
          a = t.map(({ rank: d }) => d).sort((d, f) => d - f),
          i = s && a.every((d, f) => f === 0 || d === a[f - 1] + 1);
        if (!o && !i) continue;
        let l = t.map((d) => e.indexOf(d)).sort((d, f) => d - f),
          w = l.join(',');
        n.set(w, {
          indices: l,
          cards: t,
          points: t.reduce((d, f) => d + E(f.rank), 0),
          type: o ? 'set' : 'run',
        });
      }
    return [...n.values()];
  }
  function y(e) {
    v(e);
    let n = T(e),
      r = { covered: 0, melds: [], mask: 0 },
      t = (s, a, i, l) => {
        l > r.covered && (r = { covered: l, melds: i, mask: a });
        for (let w = s; w < n.length; w += 1) {
          let d = n[w],
            f = d.indices.reduce((P, c) => P | (1 << c), 0);
          (a & f) === 0 && t(w + 1, a | f, [...i, d], l + d.points);
        }
      };
    t(0, 0, [], 0);
    let o = e.filter((s, a) => (r.mask & (1 << a)) === 0);
    return Object.freeze({
      melds: Object.freeze(
        r.melds.map(({ type: s, cards: a, points: i }) =>
          Object.freeze({
            type: s,
            cards: Object.freeze(a.map((l) => Object.freeze({ ...l }))),
            points: i,
          }),
        ),
      ),
      deadwood: Object.freeze(o.map((s) => Object.freeze({ ...s }))),
      deadwoodPoints: o.reduce((s, a) => s + E(a.rank), 0),
      gin: o.length === 0,
      knockEligible: o.length > 0 && o.reduce((s, a) => s + E(a.rank), 0) <= 10,
    });
  }
  function D(e = Math.random) {
    if (typeof e != 'function') throw new TypeError('random must be a function.');
    let n = [...C].flatMap((r) => Array.from(z, (t) => ({ rank: t, suit: r })));
    for (let r = n.length - 1; r > 0; r -= 1) {
      let t = e();
      if (!Number.isFinite(t) || t < 0 || t >= 1)
        throw new RangeError('random must return a value from 0 inclusive to 1 exclusive.');
      let o = Math.floor(t * (r + 1));
      [n[r], n[o]] = [n[o], n[r]];
    }
    return n;
  }
  function S(e = Math.random) {
    let n = D(e),
      r = [[], []];
    for (let t = 0; t < 20; t += 1) r[t % 2].push(n[t]);
    return R({
      hands: r,
      stock: n.slice(21),
      discardPile: [n[20]],
      scores: [0, 0],
      currentPlayer: 0,
      phase: 'draw',
      drawnCard: null,
      roundResult: null,
    });
  }
  function O(e, n) {
    if ((x(e, 'draw'), !['stock', 'discard'].includes(n)))
      throw new RangeError('Draw from stock or discard pile.');
    if (n === 'stock' && e.stock.length === 0)
      throw new RangeError('The stock is empty; end this hand as a draw.');
    if (n === 'discard' && e.discardPile.length === 0)
      throw new RangeError('The discard pile is empty.');
    let r = n === 'stock' ? e.stock[e.stock.length - 1] : e.discardPile[e.discardPile.length - 1],
      t = n === 'stock' ? e.stock.slice(0, -1) : e.stock,
      o = n === 'discard' ? e.discardPile.slice(0, -1) : e.discardPile,
      s = e.hands.map((a, i) => (i === e.currentPlayer ? [...a, r] : a));
    return R({
      ...e,
      hands: s,
      stock: t,
      discardPile: o,
      drawnCard: { card: r, source: n },
      phase: 'discard',
    });
  }
  function j(e, n, { knock: r = !1 } = {}) {
    x(e, 'discard');
    let t = e.hands[e.currentPlayer];
    if (!Number.isInteger(n) || n < 0 || n >= t.length)
      throw new RangeError('Choose a card in your hand to discard.');
    let o = t[n];
    if (e.drawnCard?.source === 'discard' && b(o) === b(e.drawnCard.card))
      throw new RangeError(
        'You cannot immediately discard the card just taken from the discard pile.',
      );
    let s = t.filter((w, d) => d !== n);
    if (s.length !== 10) throw new RangeError('A turn must end with exactly 10 cards.');
    let a = e.hands.map((w, d) => (d === e.currentPlayer ? s : w)),
      i = [...e.discardPile, o],
      l = y(s);
    if (l.gin)
      return q(
        { ...e, hands: a, discardPile: i, phase: 'finished', drawnCard: null },
        e.currentPlayer,
      );
    if (r) {
      if (!l.knockEligible)
        throw new RangeError('Knock is allowed only with 10 or fewer deadwood points.');
      return $(
        { ...e, hands: a, discardPile: i, phase: 'finished', drawnCard: null },
        e.currentPlayer,
      );
    }
    return R({
      ...e,
      hands: a,
      discardPile: i,
      currentPlayer: 1 - e.currentPlayer,
      phase: 'draw',
      drawnCard: null,
    });
  }
  function A(e) {
    if ((x(e, 'draw'), e.currentPlayer !== 1))
      throw new RangeError('The local opponent can act only on its turn.');
    let n = [];
    if ((e.stock.length && n.push('stock'), e.discardPile.length && n.push('discard'), !n.length))
      throw new RangeError('The stock and discard pile are empty.');
    let r = null;
    for (let o of n) {
      let s = o === 'stock' ? e.stock.at(-1) : e.discardPile.at(-1),
        a = [...e.hands[1], s];
      for (let i = 0; i < a.length; i += 1) {
        if (o === 'discard' && b(a[i]) === b(s)) continue;
        let l = a.filter((f, P) => P !== i),
          w = y(l),
          d = { source: o, discardIndex: i, deadwoodPoints: w.deadwoodPoints };
        (!r ||
          d.deadwoodPoints < r.deadwoodPoints ||
          (d.deadwoodPoints === r.deadwoodPoints && o === 'discard' && r.source === 'stock')) &&
          (r = d);
      }
    }
    let t = O(e, r.source);
    return j(t, r.discardIndex, { knock: r.deadwoodPoints <= 10 });
  }
  function q(e, n) {
    let r = 1 - n,
      t = y(e.hands[r]).deadwoodPoints,
      o = 25 + t,
      s = e.scores.map((a, i) => a + (i === n ? o : 0));
    return R({
      ...e,
      scores: s,
      roundResult: {
        type: 'gin',
        winner: n,
        points: o,
        opponentDeadwood: t,
        scoringVariant: 'no-layoff',
      },
    });
  }
  function $(e, n) {
    let r = 1 - n,
      t = y(e.hands[n]).deadwoodPoints,
      o = y(e.hands[r]).deadwoodPoints,
      s = o <= t,
      a = s ? r : n,
      i = s ? 25 + t - o : o - t,
      l = e.scores.map((w, d) => w + (d === a ? i : 0));
    return R({
      ...e,
      scores: l,
      roundResult: {
        type: s ? 'undercut' : 'knock',
        winner: a,
        knocker: n,
        points: i,
        knockerDeadwood: t,
        opponentDeadwood: o,
        scoringVariant: 'no-layoff',
      },
    });
  }
  function x(e, n) {
    if (!e || e.phase !== n || !Array.isArray(e.hands) || e.hands.length !== 2)
      throw new RangeError(`A valid active game in the ${n} phase is required.`);
  }
  function R(e) {
    return Object.freeze({
      ...e,
      hands: Object.freeze(
        e.hands.map((n) => Object.freeze(n.map((r) => Object.freeze({ ...r })))),
      ),
      stock: Object.freeze(e.stock.map((n) => Object.freeze({ ...n }))),
      discardPile: Object.freeze(e.discardPile.map((n) => Object.freeze({ ...n }))),
      scores: Object.freeze([...e.scores]),
      drawnCard: e.drawnCard
        ? Object.freeze({
            card: Object.freeze({ ...e.drawnCard.card }),
            source: e.drawnCard.source,
          })
        : null,
      roundResult: e.roundResult ? Object.freeze({ ...e.roundResult }) : null,
    });
  }
  var m = document.querySelector('[data-tool="gin-rummy"]');
  if (m) {
    let e = JSON.parse(m.querySelector('[data-tool-copy]')?.textContent ?? '{}'),
      n = e.fields ?? {},
      r = e.actions ?? {},
      t = S(),
      o = 0,
      s = (c) =>
        c === 1 ? n.ace : c === 11 ? n.jack : c === 12 ? n.queen : c === 13 ? n.king : String(c),
      a = (c) => ({ clubs: '\u2663', diamonds: '\u2666', hearts: '\u2665', spades: '\u2660' })[c],
      i = (c, u) => {
        let p = m.querySelector(c);
        p && (p.textContent = u);
      },
      l = (c) => i('[data-status]', c),
      w = () => {
        let c = t.roundResult;
        if (!c) return '';
        let u;
        return (
          c.type === 'gin'
            ? (u = c.winner === 0 ? e.messages.roundGinYou : e.messages.roundGinOpponent)
            : c.type === 'undercut'
              ? (u = c.winner === 0 ? e.messages.undercutOpponent : e.messages.undercutYou)
              : (u = c.winner === 0 ? e.messages.roundKnockYou : e.messages.roundKnockOpponent),
          u.replaceAll('{points}', String(c.points))
        );
      },
      d = () => {
        let c = m.querySelector('[data-hand]');
        if (!c) return;
        c.replaceChildren();
        let u = t.phase === 'discard' && t.currentPlayer === 0;
        (t.hands[0].forEach((h, g) => {
          let k = document.createElement('button');
          ((k.type = 'button'),
            (k.className = 'gin-rummy__card'),
            (k.dataset.cardIndex = String(g)),
            (k.disabled = !u),
            (k.textContent = `${s(h.rank)} ${a(h.suit)}`),
            k.setAttribute('aria-label', `${r.discard}: ${s(h.rank)} ${n[h.suit]}`),
            c.append(k));
        }),
          m.querySelector('[data-opponent-hand]')?.replaceChildren(
            ...t.hands[1].map(() => {
              let h = document.createElement('span');
              return (
                (h.className = 'gin-rummy__card gin-rummy__card--back'),
                h.setAttribute('role', 'img'),
                h.setAttribute('aria-label', n.hiddenCard),
                (h.textContent = '\u25A7'),
                h
              );
            }),
          ));
      },
      f = () => {
        let c = t.phase === 'discard' && t.currentPlayer === 0,
          u = t.phase === 'draw' && t.currentPlayer === 0;
        m.querySelectorAll('[data-action="draw-stock"], [data-action="draw-discard"]').forEach(
          (g) => {
            g.disabled = !u;
          },
        );
        let p = t.discardPile.at(-1);
        (i('[data-stock-count]', String(t.stock.length)),
          i('[data-discard-top]', p ? `${s(p.rank)} ${a(p.suit)} \u2014 ${n[p.suit]}` : '\u2014'),
          i('[data-score]', String(t.scores[0])),
          i('[data-opponent-score]', String(t.scores[1])),
          i('[data-deadwood]', String(y(t.hands[0]).deadwoodPoints)));
        let h = m.querySelector('[data-knock]');
        (h && (h.disabled = !c),
          d(),
          t.phase === 'finished'
            ? l(w())
            : t.phase === 'discard' && t.currentPlayer === 0
              ? l(e.messages.chooseDiscard)
              : t.phase === 'draw' && t.currentPlayer === 0 && l(e.messages.chooseDraw));
      },
      P = () => {
        t.phase !== 'draw' ||
          t.currentPlayer !== 1 ||
          (l(e.messages.opponentThinking),
          m.querySelectorAll('button').forEach((c) => {
            c.disabled = !0;
          }),
          clearTimeout(o),
          (o = setTimeout(() => {
            if (!(!m.isConnected || t.phase !== 'draw' || t.currentPlayer !== 1))
              try {
                ((t = A(t)), f());
              } catch {
                l(e.messages.stockEmpty);
              }
          }, 180)));
      };
    (m.addEventListener('click', (c) => {
      let u = c.target.closest('button');
      if (!(!u || !m.contains(u)))
        try {
          if (u.dataset.action === 'new-game') {
            (clearTimeout(o), (t = S()), f(), l(e.messages.gameStarted));
            return;
          }
          if (u.dataset.action === 'draw-stock' || u.dataset.action === 'draw-discard') {
            let p = u.dataset.action === 'draw-stock' ? 'stock' : 'discard';
            ((t = O(t, p)), f(), l(p === 'stock' ? e.messages.drewStock : e.messages.drewDiscard));
            return;
          }
          if (u.hasAttribute('data-card-index')) {
            let p = !!m.querySelector('[data-knock]')?.checked;
            t = j(t, Number(u.dataset.cardIndex), { knock: p });
            let h = m.querySelector('[data-knock]');
            (h && (h.checked = !1), f(), P());
          }
        } catch (p) {
          l(
            p instanceof RangeError && p.message.includes('Knock')
              ? e.messages.invalidKnock
              : e.messages.stockEmpty,
          );
        }
    }),
      f());
  }
})();
