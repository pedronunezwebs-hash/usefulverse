(() => {
  function U(e = document) {
    let r = e.querySelector('[data-tool-copy]');
    if (!r) throw new Error('Localized tool copy is missing.');
    return JSON.parse(r.textContent);
  }
  function q(e, r, t = 'info') {
    let n = e.querySelector('[data-status]');
    n && ((n.textContent = r), (n.dataset.kind = t));
  }
  var W = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades']),
    I = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  function M(e, r, t) {
    if (!Array.isArray(e) || e.length !== r) throw new RangeError(`${t} must contain ${r} cards.`);
    let n = new Set();
    for (let o of e) {
      if (!o || !I.includes(o.rank) || !W.includes(o.suit))
        throw new TypeError(`Invalid ${t.toLowerCase()} card.`);
      let c = o.id ?? `${o.rank}-${o.suit}`;
      if (n.has(c)) throw new RangeError(`${t} cannot contain duplicate cards.`);
      n.add(c);
    }
  }
  function S(e) {
    if (!I.includes(e)) throw new RangeError('Card rank must be 1\u201313.');
    return Math.min(e, 10);
  }
  function se(e) {
    let r = 0;
    for (let t = 1; t < 1 << e.length; t += 1) {
      let n = 0;
      for (let o = 0; o < e.length; o += 1) t & (1 << o) && (n += S(e[o].rank));
      n === 15 && (r += 2);
    }
    return r;
  }
  function ce(e) {
    let r = new Map();
    for (let { rank: c } of e) r.set(c, (r.get(c) ?? 0) + 1);
    let t = [...r.keys()].sort((c, s) => c - s),
      n = 0,
      o = 0;
    for (let c = 0; c < t.length;) {
      let s = c + 1;
      for (; s < t.length && t[s] === t[s - 1] + 1;) s += 1;
      let u = s - c;
      if (u >= 3) {
        let d = t.slice(c, s).reduce((f, g) => f * r.get(g), 1);
        u > n ? ((n = u), (o = d)) : u === n && (o += d);
      }
      c = s;
    }
    return n * o;
  }
  function R(e, r, { crib: t = !1 } = {}) {
    if (
      (M(e, 4, t ? 'Crib' : 'Hand'),
      M([r], 1, 'Starter'),
      e.some((a) => (a.id ?? `${a.rank}-${a.suit}`) === (r.id ?? `${r.rank}-${r.suit}`)))
    )
      throw new RangeError('Starter must be a different card.');
    let o = [...e, r],
      c = se(o),
      s = 0;
    for (let a = 0; a < o.length; a += 1)
      for (let p = a + 1; p < o.length; p += 1) o[a].rank === o[p].rank && (s += 2);
    let u = ce(o),
      d = e.every(({ suit: a }) => a === e[0].suit)
        ? r.suit === e[0].suit
          ? e.length + 1
          : t
            ? 0
            : e.length
        : 0,
      f = e.some(({ rank: a, suit: p }) => a === 11 && p === r.suit) ? 1 : 0,
      g = c + s + u + d + f;
    return Object.freeze({ total: g, fifteens: c, pairs: s, runs: u, flush: d, nobs: f });
  }
  function $() {
    return W.flatMap((e) => I.map((r) => Object.freeze({ id: `${r}-${e}`, rank: r, suit: e })));
  }
  function ie(e = Math.random) {
    if (typeof e != 'function') throw new TypeError('Random source must be a function.');
    let r = $();
    for (let t = r.length - 1; t > 0; t -= 1) {
      let n = e();
      if (!Number.isFinite(n) || n < 0 || n >= 1)
        throw new RangeError(
          'Random source must return values from 0 up to (but not including) 1.',
        );
      let o = Math.floor(n * (t + 1));
      [r[t], r[o]] = [r[o], r[t]];
    }
    return r;
  }
  function J(e = Math.random, r = 1) {
    if (!Number.isInteger(r) || r < 0 || r > 1)
      throw new RangeError('Dealer must be player 0 or 1.');
    let t = ie(e),
      n = [[], []],
      o = 1 - r;
    for (let c = 0; c < 12; c += 1) n[c % 2 === 0 ? o : r].push(t[c]);
    return Object.freeze({
      dealer: r,
      hands: Object.freeze(n.map((c) => Object.freeze(c))),
      crib: Object.freeze([]),
      starter: t[12],
      remaining: Object.freeze(t.slice(13)),
    });
  }
  function le(e) {
    if (!Array.isArray(e) || e.length !== 2) throw new TypeError('Pegging needs two player hands.');
    let r = new Set();
    for (let t of e) {
      if (!Array.isArray(t) || t.length !== 4)
        throw new RangeError('Each pegging hand must contain four cards.');
      M(t, 4, 'Hand');
      for (let n of t) {
        let o = n.id ?? `${n.rank}-${n.suit}`;
        if (r.has(o)) throw new RangeError('The two hands cannot share a physical card.');
        r.add(o);
      }
    }
  }
  function K(e) {
    if (!Array.isArray(e) || e.length < 1 || e.length > 31)
      throw new RangeError('A pegging sequence must contain 1\u201331 cards.');
    M(e, e.length, 'Sequence');
    let r = e.reduce((s, u) => s + S(u.rank), 0);
    if (r > 31) throw new RangeError('A pegging sequence cannot exceed 31.');
    let t = e.at(-1).rank,
      n = 0;
    for (let s = e.length - 1; s >= 0 && e[s].rank === t; s -= 1) n += 1;
    let o = n >= 2 ? [0, 0, 2, 6, 12][n] : 0,
      c = 0;
    for (let s = Math.min(e.length, 7); s >= 3; s -= 1) {
      let u = e.slice(-s).map(({ rank: d }) => d);
      if (new Set(u).size === s && Math.max(...u) - Math.min(...u) === s - 1) {
        c = s;
        break;
      }
    }
    return Object.freeze({
      count: r,
      fifteens: r === 15 ? 2 : 0,
      pairs: o,
      runs: c,
      thirtyOne: r === 31 ? 2 : 0,
      total: (r === 15 ? 2 : 0) + o + c + (r === 31 ? 2 : 0),
    });
  }
  function X(e, r, { scores: t = [0, 0], targetScore: n = 121 } = {}) {
    if ((le(e), !Number.isInteger(r) || r < 0 || r > 1))
      throw new RangeError('Dealer must be player 0 or 1.');
    if (
      !Array.isArray(t) ||
      t.length !== 2 ||
      t.some((o) => !Number.isInteger(o) || o < 0 || o >= n)
    )
      throw new RangeError('Match scores must be non-negative integers below the target.');
    if (!Number.isInteger(n) || n < 1 || n > 1e4)
      throw new RangeError('Target score must be an integer from 1 to 10,000.');
    return Object.freeze({
      hands: Object.freeze(e.map((o) => Object.freeze(o.map((c) => Object.freeze({ ...c }))))),
      dealer: r,
      scores: Object.freeze([...t]),
      targetScore: n,
      winner: null,
      sequence: Object.freeze([]),
      count: 0,
      currentPlayer: 1 - r,
      lastPlayer: null,
      passed: Object.freeze([!1, !1]),
      finished: !1,
      lastAward: null,
    });
  }
  function A(e) {
    return Object.freeze({
      ...e,
      hands: Object.freeze(
        e.hands.map((r) => Object.freeze(r.map((t) => Object.freeze({ ...t })))),
      ),
      scores: Object.freeze([...e.scores]),
      sequence: Object.freeze(e.sequence.map((r) => Object.freeze({ ...r }))),
      passed: Object.freeze([...e.passed]),
      lastAward: e.lastAward ? Object.freeze({ ...e.lastAward }) : null,
    });
  }
  function D(e, r, t, n) {
    let o = [...e.scores];
    return (
      (o[r] += t),
      {
        ...e,
        scores: o,
        winner: o[r] >= e.targetScore ? r : null,
        lastAward: { player: r, points: t, reason: n },
      }
    );
  }
  function H(e, r) {
    return e.some((t) => r + S(t.rank) <= 31);
  }
  function _(e) {
    return A({ ...e, finished: !0, sequence: [], count: 0, passed: [!1, !1] });
  }
  function T(e, r, t) {
    let n = e;
    return (
      t && n.lastPlayer !== null && (n = D(n, n.lastPlayer, 1, 'last-card')),
      n.hands.every((o) => o.length === 0)
        ? _(n)
        : A({ ...n, sequence: [], count: 0, currentPlayer: r, passed: [!1, !1], lastPlayer: null })
    );
  }
  function L(e, r) {
    if (!e || e.finished) throw new RangeError('Pegging is already finished.');
    let t = e.currentPlayer,
      n = e.hands[t];
    if (!Number.isInteger(r) || r < 0 || r >= n.length)
      throw new RangeError('Choose a card in the current hand.');
    let o = n[r],
      c = e.count + S(o.rank);
    if (c > 31) throw new RangeError('That card would take the count above 31.');
    let s = e.hands.map((a, p) => (p === t ? a.filter((E, x) => x !== r) : [...a])),
      u = [...e.sequence, o],
      d = K(u),
      f = D(
        {
          ...e,
          hands: s,
          sequence: u,
          count: c,
          lastPlayer: t,
          passed: e.passed.map((a, p) => (p === t ? !1 : a)),
        },
        t,
        d.total,
        d.thirtyOne ? '31' : d.total ? 'pegging' : null,
      );
    if (f.winner !== null) return _(f);
    if (c === 31) return T(f, t, !1);
    if (s.every((a) => a.length === 0)) return T(f, t, !0);
    let g = 1 - t;
    return f.passed[g] || !H(s[g], c)
      ? ((f = { ...f, passed: f.passed.map((a, p) => (p === g ? !0 : a)) }),
        !f.passed[t] && H(s[t], c)
          ? A({ ...f, currentPlayer: t, lastAward: d.total ? f.lastAward : null })
          : T(f, t, !0))
      : A({ ...f, currentPlayer: g, lastAward: d.total ? f.lastAward : null });
  }
  function Q(e) {
    if (!e || e.finished) throw new RangeError('Pegging is already finished.');
    let r = e.currentPlayer;
    if (H(e.hands[r], e.count))
      throw new RangeError('A legal card remains; the player cannot say go yet.');
    let t = [...e.passed];
    t[r] = !0;
    let n = 1 - r;
    if (t[n] || !H(e.hands[n], e.count)) {
      let o =
        e.lastPlayer === null
          ? { ...e, passed: t }
          : D({ ...e, passed: t }, e.lastPlayer, 1, 'last-card');
      return o.winner !== null ? _(o) : T(o, e.lastPlayer ?? n, !1);
    }
    return A({ ...e, passed: t, currentPlayer: n, lastAward: null });
  }
  function ue(e) {
    if (!e || e.finished) return null;
    let t = e.hands[e.currentPlayer]
      .map((n, o) => ({ card: n, index: o }))
      .filter(({ card: n }) => e.count + S(n.rank) <= 31)
      .map(({ card: n, index: o }) => ({ card: n, index: o, score: K([...e.sequence, n]) }))
      .sort(
        (n, o) =>
          o.score.total - n.score.total || S(o.card.rank) - S(n.card.rank) || n.index - o.index,
      );
    return t.length
      ? Object.freeze({
          index: t[0].index,
          card: Object.freeze({ ...t[0].card }),
          points: t[0].score.total,
        })
      : null;
  }
  function Y(e) {
    let r = ue(e);
    return r ? L(e, r.index) : Q(e);
  }
  function O(e) {
    return Object.freeze({
      ...e,
      hands: Object.freeze(
        e.hands.map((r) => Object.freeze(r.map((t) => Object.freeze({ ...t })))),
      ),
      countHands: e.countHands
        ? Object.freeze(
            e.countHands.map((r) => Object.freeze(r.map((t) => Object.freeze({ ...t })))),
          )
        : null,
      crib: Object.freeze(e.crib.map((r) => Object.freeze({ ...r }))),
      scores: Object.freeze([...e.scores]),
      countQueue: Object.freeze([...(e.countQueue ?? [])]),
      scoreHistory: Object.freeze([...(e.scoreHistory ?? [])].map((r) => Object.freeze({ ...r }))),
      lastScoring: e.lastScoring ? Object.freeze({ ...e.lastScoring }) : null,
    });
  }
  function de({ scores: e, targetScore: r, dealer: t }) {
    if (
      !Array.isArray(e) ||
      e.length !== 2 ||
      e.some((n) => !Number.isInteger(n) || n < 0 || n >= r)
    )
      throw new RangeError('Match scores must be non-negative integers below the target.');
    if (!Number.isInteger(r) || r < 1 || r > 121)
      throw new RangeError('Cribbage target score must be from 1 to 121.');
    if (!Number.isInteger(t) || t < 0 || t > 1)
      throw new RangeError('Dealer must be player 0 or 1.');
  }
  function Z({ random: e, dealer: r, scores: t, targetScore: n, scoreHistory: o = [] }) {
    de({ scores: t, targetScore: n, dealer: r });
    let c = J(e, r),
      s = c.starter.rank === 11 ? 2 : 0,
      u = [...t];
    s && (u[r] += s);
    let d = u[r] >= n ? r : null;
    return O({
      ...c,
      phase: d === null ? 'discard' : 'finished',
      hands: c.hands,
      countHands: null,
      crib: [],
      scores: u,
      targetScore: n,
      winner: d,
      heels: s,
      countQueue: [],
      scoreHistory: [...o, ...(s ? [{ phase: 'heels', player: r, points: s }] : [])],
      sequence: [],
      count: 0,
      currentPlayer: null,
      lastPlayer: null,
      passed: [!1, !1],
      lastAward: s ? { player: r, points: s, reason: 'heels' } : null,
    });
  }
  function B({ random: e = Math.random, dealer: r = 1, targetScore: t = 121 } = {}) {
    if (typeof e != 'function') throw new TypeError('Random source must be a function.');
    return Z({ random: e, dealer: r, scores: [0, 0], targetScore: t });
  }
  function fe(e, r) {
    if (!Array.isArray(e) || e.length !== 6)
      throw new RangeError('The computer needs six cards to choose discards.');
    if (!Number.isInteger(r) || r < 0 || r > 1)
      throw new RangeError('Dealer must be player 0 or 1.');
    let t = $(),
      n = new Set(e.map(({ id: s, rank: u, suit: d }) => s ?? `${u}-${d}`)),
      o = t.filter(({ id: s }) => !n.has(s)),
      c = null;
    for (let s = 0; s < e.length; s += 1)
      for (let u = s + 1; u < e.length; u += 1) {
        let d = e.filter((j, k) => k !== s && k !== u),
          f = o.reduce((j, k) => j + R(d, k).total, 0) / o.length,
          g = [e[s], e[u]],
          a = g[0].rank === g[1].rank ? 2 : 0,
          p = g.filter(({ rank: j }) => j === 5).length * 0.7,
          E = Math.abs(g[0].rank - g[1].rank) === 1 ? 0.8 : 0,
          x = r === 1 ? a + p + E : -(a + p + E) * 0.45,
          m = f + x;
        (!c || m > c.value) && (c = { indices: [s, u], value: m });
      }
    return Object.freeze({
      indices: Object.freeze(c.indices),
      cards: Object.freeze(c.indices.map((s) => Object.freeze({ ...e[s] }))),
    });
  }
  function ee(e, r) {
    if (!e || e.phase !== 'discard')
      throw new RangeError('The match is not waiting for crib discards.');
    if (
      !Array.isArray(r) ||
      r.length !== 2 ||
      r.some((d) => !Number.isInteger(d) || d < 0 || d >= 6) ||
      r[0] === r[1]
    )
      throw new RangeError('Select exactly two different cards for the crib.');
    let t = fe(e.hands[1], e.dealer),
      n = r.map((d) => e.hands[0][d]),
      o = e.hands[0].filter((d, f) => !r.includes(f)),
      c = e.hands[1].filter((d, f) => !t.indices.includes(f)),
      s = [...n, ...t.cards],
      u = X([o, c], e.dealer, { scores: e.scores, targetScore: e.targetScore });
    return O({
      ...e,
      ...u,
      phase: 'pegging',
      hands: [o, c],
      countHands: [o, c],
      crib: s,
      countQueue: [],
      scoreHistory: e.scoreHistory,
    });
  }
  function F(e, r) {
    return r.winner !== null
      ? O({ ...e, ...r, phase: 'finished', winner: r.winner, countQueue: [] })
      : r.finished
        ? O({
            ...e,
            ...r,
            phase: 'count',
            countQueue: [1 - e.dealer, e.dealer, 'crib'],
            winner: null,
          })
        : O({ ...e, ...r, phase: 'pegging' });
  }
  function re(e, r) {
    if (!e || e.phase !== 'pegging') throw new RangeError('The match is not in the pegging phase.');
    return F(e, L(e, r));
  }
  function te(e) {
    if (!e || e.phase !== 'pegging') throw new RangeError('The match is not in the pegging phase.');
    return F(e, Q(e));
  }
  function ne(e) {
    if (!e || e.phase !== 'pegging' || e.currentPlayer !== 1)
      throw new RangeError('It is not the computer pegging turn.');
    return F(e, Y(e));
  }
  function ae(e, r = Math.random) {
    if (!e || e.phase !== 'count' || e.countQueue.length === 0)
      throw new RangeError('There is no hand waiting to be counted.');
    let [t, ...n] = e.countQueue,
      o = t === 'crib',
      c = o ? e.dealer : t,
      s = R(o ? e.crib : e.countHands[c], e.starter, { crib: o }),
      u = [...e.scores];
    u[c] += s.total;
    let d = [...e.scoreHistory, { phase: o ? 'crib' : 'hand', player: c, points: s.total }];
    return u[c] >= e.targetScore
      ? O({
          ...e,
          scores: u,
          scoreHistory: d,
          countQueue: [],
          phase: 'finished',
          winner: c,
          lastScoring: { phase: o ? 'crib' : 'hand', player: c, ...s },
        })
      : n.length
        ? O({
            ...e,
            scores: u,
            scoreHistory: d,
            countQueue: n,
            lastScoring: { phase: o ? 'crib' : 'hand', player: c, ...s },
          })
        : Z({
            random: r,
            dealer: 1 - e.dealer,
            scores: u,
            targetScore: e.targetScore,
            scoreHistory: d,
          });
  }
  function oe(e, r) {
    return !e || e.phase !== 'pegging' || !Number.isInteger(r) || r < 0 || r > 1
      ? !1
      : e.hands[r].some((t) => e.count + S(t.rank) <= 31);
  }
  var l = document.querySelector('[data-tool="cribbage"]');
  if (l) {
    let p = function (i) {
        return i === 1
          ? e.fields.ace
          : i === 11
            ? e.fields.jack
            : i === 12
              ? e.fields.queen
              : i === 13
                ? e.fields.king
                : String(i);
      },
      E = function (i) {
        return `${p(i.rank)} ${e.fields[i.suit]}`;
      },
      x = function (i, h) {
        return Object.entries(h).reduce((C, [b, y]) => C.replaceAll(`{${b}}`, String(y)), i);
      },
      m = function (i, h = 'info') {
        ((c.textContent = i), q(l, i, h));
      },
      j = function () {
        ((a = null),
          g.clear(),
          (o.hidden = !0),
          (l.querySelector('[data-action="start-match"]').hidden = !1),
          (l.querySelector('[data-action="new-match"]').hidden = !0),
          m(''));
      },
      k = function (i, h, C, b = 0) {
        (i.replaceChildren(),
          h.forEach((y, P) => {
            if (C === 'computer') {
              let z = document.createElement('span');
              ((z.className = 'cribbage-match__card cribbage-match__card--back'),
                (z.textContent = '\u25C6'),
                z.setAttribute('aria-label', e.fields.hiddenCard ?? e.fields.computerCards),
                i.append(z));
              return;
            }
            let w = document.createElement('button');
            if (
              ((w.type = 'button'),
              (w.className = 'cribbage-match__card'),
              (w.textContent = E(y)),
              w.setAttribute('aria-label', E(y)),
              C === 'discard')
            )
              (w.setAttribute('aria-pressed', String(g.has(P))),
                w.addEventListener('click', () => {
                  (g.has(P) ? g.delete(P) : g.size < 2 && g.add(P), v());
                }));
            else {
              let z =
                b === 0 &&
                a.currentPlayer === 0 &&
                a.phase === 'pegging' &&
                !a.passed[0] &&
                a.count + S(y.rank) <= 31;
              ((w.disabled = !z),
                w.addEventListener('click', () => {
                  z && G(() => re(a, P));
                }));
            }
            i.append(w);
          }));
      },
      N = function () {
        let i = a?.scoreHistory.length ?? 0;
        for (; a?.phase === 'count';) a = ae(a);
        let h = a?.lastScoring,
          C = a?.scoreHistory.slice(i) ?? [];
        if (a?.phase === 'finished')
          m(
            x(e.messages.matchWon, {
              who: a.winner === 0 ? e.fields.you : e.fields.computer,
              points: a.scores[a.winner],
            }),
            'success',
          );
        else if (h)
          m(
            x(e.messages.handCount, {
              who: h.player === 0 ? e.fields.you : e.fields.computer,
              points: h.total,
              kind: h.phase === 'crib' ? e.fields.crib : e.fields.hand,
            }),
            'success',
          );
        else {
          let b = C.map((y) =>
            x(e.messages.handCount, {
              who: y.player === 0 ? e.fields.you : e.fields.computer,
              points: y.points,
              kind: y.phase === 'crib' ? e.fields.crib : e.fields.hand,
            }),
          );
          m(b.length ? b.join(' ') : e.messages.roundReady, 'success');
        }
      },
      V = function () {
        let i = 0;
        for (; a?.phase === 'pegging' && a.currentPlayer === 1 && i < 8;) ((a = ne(a)), (i += 1));
        a?.phase === 'count' && N();
      },
      v = function () {
        if (!a) return;
        ((o.hidden = !1),
          (l.querySelector('[data-action="start-match"]').hidden = !0),
          (l.querySelector('[data-action="new-match"]').hidden = a.phase !== 'finished'),
          (l.querySelector('[data-player-score]').textContent = String(a.scores[0])),
          (l.querySelector('[data-computer-score]').textContent = String(a.scores[1])),
          (l.querySelector('[data-dealer]').textContent =
            a.dealer === 0 ? e.fields.you : e.fields.computer),
          (l.querySelector('[data-starter]').textContent = E(a.starter)),
          (l.querySelector('[data-pegging-count]').textContent = String(a.count ?? 0)),
          (l.querySelector('[data-turn]').textContent =
            a.phase === 'pegging'
              ? a.currentPlayer === 0
                ? e.fields.you
                : e.fields.computer
              : a.phase === 'discard'
                ? e.fields.you
                : a.phase));
        let i = l.querySelector('[data-phase-instruction]');
        i.textContent =
          a.phase === 'discard'
            ? e.fields.selectDiscards
            : a.phase === 'pegging'
              ? a.currentPlayer === 0
                ? e.messages.playerPegging
                : e.messages.computerPegging
              : a.phase === 'count'
                ? e.messages.handCount
                : x(e.messages.matchWon, {
                    who: a.winner === 0 ? e.fields.you : e.fields.computer,
                    points: a.scores[a.winner],
                  });
        let h = a.phase === 'discard';
        (k(s, a.hands[0], h ? 'discard' : 'play'), k(u, a.hands[1], 'computer', 1));
        let C = l.querySelector('[data-action="send-discards"]'),
          b = l.querySelector('[data-action="say-go"]');
        ((C.hidden = !h),
          (C.disabled = g.size !== 2),
          (b.hidden = a.phase !== 'pegging'),
          (b.disabled = a.currentPlayer !== 0 || oe(a, 0)));
      },
      G = function (i) {
        try {
          ((a = i()),
            v(),
            a.phase === 'pegging' && a.currentPlayer === 1 ? V() : a.phase === 'count' && N(),
            v());
        } catch {
          m(e.messages.invalidMove, 'error');
        }
      },
      e = U(l),
      r = l.querySelector('[data-result]'),
      t = l.querySelector('[data-total]'),
      n = l.querySelector('[data-breakdown]'),
      o = l.querySelector('[data-match-board]'),
      c = l.querySelector('[data-match-status]'),
      s = l.querySelector('[data-match-hand]'),
      u = l.querySelector('[data-computer-hand]'),
      d = ['fifteens', 'pairs', 'runs', 'flush', 'nobs'],
      f = Object.fromEntries(d.map((i) => [i, e.fields[i] ?? i])),
      g = new Set(),
      a = null;
    (l.querySelector('[data-action="score-hand"]').addEventListener('click', () => {
      let i = [...l.querySelectorAll('.cribbage-card')]
          .slice(0, 4)
          .map((b) => ({
            rank: Number(b.querySelector('[data-rank]').value),
            suit: b.querySelector('[data-suit]').value,
          })),
        h = l.querySelectorAll('.cribbage-card')[4],
        C = {
          rank: Number(h.querySelector('[data-rank]').value),
          suit: h.querySelector('[data-suit]').value,
        };
      try {
        let b = R(i, C, { crib: l.querySelector('[data-mode]').value === 'crib' });
        ((t.textContent = e.messages.scored.replace('{total}', String(b.total))),
          n.replaceChildren());
        for (let y of d) {
          let P = document.createElement('dt'),
            w = document.createElement('dd');
          ((P.textContent = f[y]), (w.textContent = String(b[y])), n.append(P, w));
        }
        ((r.hidden = !1), q(l, t.textContent, 'success'));
      } catch {
        ((r.hidden = !0), q(l, e.messages.invalidCards, 'error'));
      }
    }),
      l.querySelector('[data-action="start-match"]').addEventListener('click', () => {
        let i = Number(l.querySelector('[data-target]').value);
        try {
          ((a = B({ targetScore: i })),
            g.clear(),
            m(a.heels ? e.messages.heels : e.messages.matchStarted, 'success'),
            v());
        } catch {
          m(e.messages.invalidMove, 'error');
        }
      }),
      l.querySelector('[data-action="send-discards"]').addEventListener('click', () => {
        if (g.size !== 2) {
          m(e.messages.selectTwo, 'error');
          return;
        }
        try {
          ((a = ee(a, [...g])),
            g.clear(),
            v(),
            a.phase === 'pegging' && a.currentPlayer === 1 && V(),
            a.phase === 'count' && N(),
            v());
        } catch {
          m(e.messages.invalidMove, 'error');
        }
      }),
      l.querySelector('[data-action="say-go"]').addEventListener('click', () => G(() => te(a))),
      l.querySelector('[data-action="new-match"]').addEventListener('click', () => {
        let i = Number(l.querySelector('[data-target]').value);
        try {
          ((a = B({ targetScore: i })),
            g.clear(),
            m(a.heels ? e.messages.heels : e.messages.matchStarted, 'success'),
            v());
        } catch {
          m(e.messages.invalidMove, 'error');
        }
      }),
      l.querySelector('[data-action="reset"]').addEventListener('click', () => {
        (l.querySelectorAll('.cribbage-card').forEach((i, h) => {
          ((i.querySelector('[data-rank]').value = String(h < 4 ? h + 1 : 5)),
            (i.querySelector('[data-suit]').value = 'clubs'));
        }),
          (l.querySelector('[data-mode]').value = 'hand'),
          (r.hidden = !0),
          j(),
          q(l, '', 'info'));
      }));
  }
})();
