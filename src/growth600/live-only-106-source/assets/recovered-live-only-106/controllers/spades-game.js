(() => {
  function B(t, r, s = 'info') {
    let e = t.querySelector('[data-status]');
    e && ((e.textContent = r), (e.dataset.kind = s));
  }
  var C = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades']),
    x = Object.freeze(['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']),
    _ = Object.freeze(['North', 'East', 'South', 'West']);
  function g(t) {
    return Number.isInteger(t) && t >= 0 && t < 4;
  }
  function A(t) {
    return t && C.includes(t.suit) && x.includes(t.rank) && t.id === `${t.rank}-${t.suit}`;
  }
  function z() {
    return C.flatMap((t) => x.map((r) => Object.freeze({ rank: r, suit: t, id: `${r}-${t}` })));
  }
  function W(t) {
    if (typeof t != 'function') throw new TypeError('Random source must be a function.');
    let r = z();
    for (let s = r.length - 1; s > 0; s -= 1) {
      let e = t();
      if (!Number.isFinite(e) || e < 0 || e >= 1)
        throw new RangeError('Random source must return values from 0 up to 1.');
      let n = Math.floor(e * (s + 1));
      [r[s], r[n]] = [r[n], r[s]];
    }
    return r;
  }
  function L({ random: t = Math.random, dealer: r = 0 } = {}) {
    if (!g(r)) throw new RangeError('Dealer seat must be 0\u20133.');
    let s = W(t),
      e = [0, 1, 2, 3].map((n) => s.slice(n * 13, n * 13 + 13));
    return Object.freeze({
      hands: Object.freeze(e.map((n) => Object.freeze(n))),
      dealer: r,
      firstBidder: (r + 1) % 4,
      firstLeader: (r + 1) % 4,
    });
  }
  function E(t, r = null, { spadesBroken: s = !1 } = {}) {
    if (!Array.isArray(t) || t.some((n) => !A(n))) throw new TypeError('Choose a valid hand.');
    if (r !== null && !C.includes(r)) throw new RangeError('Choose a valid suit.');
    if (!r) {
      let n = t.filter((o) => o.suit !== 'spades');
      return !s && n.length ? n : [...t];
    }
    let e = t.filter((n) => n.suit === r);
    return e.length ? e : [...t];
  }
  function M(t) {
    if (!Array.isArray(t) || t.length !== 4)
      throw new RangeError('A trick needs exactly four cards.');
    let r = new Set(),
      s = new Set();
    for (let a of t) {
      if (!g(a?.player) || !A(a.card) || r.has(a.player) || s.has(a.card.id))
        throw new TypeError('A trick contains an invalid or repeated play.');
      (r.add(a.player), s.add(a.card.id));
    }
    let e = t[0].card.suit,
      n = t.some(({ card: a }) => a.suit === 'spades'),
      o = n ? 'spades' : e,
      p = t
        .filter(({ card: a }) => a.suit === o)
        .reduce((a, b) => (x.indexOf(b.card.rank) > x.indexOf(a.card.rank) ? b : a));
    return Object.freeze({
      winner: p.player,
      team: p.player % 2,
      ledSuit: e,
      winningCard: p.card,
      trumped: n,
    });
  }
  function D(t, r, s, e) {
    if (
      !Array.isArray(t) ||
      t.length !== 4 ||
      t.some((n) => !Number.isInteger(n) || n < 0 || n > 13)
    )
      throw new RangeError('Each of four bids must be from 0 to 13.');
    if (
      !Array.isArray(r) ||
      r.length !== 4 ||
      r.some((n) => !Number.isInteger(n) || n < 0 || n > 13) ||
      r.reduce((n, o) => n + o, 0) !== 13
    )
      throw new RangeError('Trick wins must total 13 across four seats.');
    if (!Array.isArray(s) || s.length !== 2 || s.some((n) => !Number.isSafeInteger(n)))
      throw new RangeError('Two valid team scores are required.');
    if (
      !Array.isArray(e) ||
      e.length !== 2 ||
      e.some((n) => !Number.isInteger(n) || n < 0 || n > 9)
    )
      throw new RangeError('Each team must carry zero to nine bags into a hand.');
  }
  function K({ bids: t, tricks: r, scores: s = [0, 0], bags: e = [0, 0] } = {}) {
    D(t, r, s, e);
    let n = [...s],
      o = [...e],
      p = [];
    for (let a of [0, 1]) {
      let b = a === 0 ? [0, 2] : [1, 3],
        m = b.reduce((d, w) => d + t[w], 0),
        S = b.reduce((d, w) => d + r[w], 0),
        f = b.filter((d) => t[d] === 0),
        k = S >= m,
        h = k ? m * 10 + S - m : -m * 10;
      for (let d of f) h += r[d] === 0 ? 100 : -100;
      let c = k ? o[a] + S - m : o[a],
        y = Math.floor(c / 10);
      ((n[a] += h - y * 100),
        (o[a] = c - y * 10),
        p.push(
          Object.freeze({
            team: a,
            contract: m,
            tricks: S,
            made: k,
            handPoints: h,
            bags: o[a],
            bagPenalty: y * 100,
            nil: f.length,
          }),
        ));
    }
    return Object.freeze({
      scores: Object.freeze(n),
      bags: Object.freeze(o),
      teams: Object.freeze(p),
    });
  }
  function T(t, r, s, e, n = Math.random) {
    let o = L({ random: n, dealer: e });
    return {
      scores: [...t],
      bags: [...r],
      target: s,
      dealer: e,
      hands: o.hands.map((p) => [...p]),
      bids: [null, null, null, null],
      trickWins: [0, 0, 0, 0],
      trick: [],
      spadesBroken: !1,
      phase: 'bidding',
      currentPlayer: o.firstBidder,
      firstLeader: o.firstLeader,
      lastTrick: null,
      lastHand: null,
      winner: null,
      handNumber: 1,
    };
  }
  function I({ random: t = Math.random, target: r = 250, dealer: s = 0 } = {}) {
    if (!Number.isInteger(r) || ![250, 500].includes(r))
      throw new RangeError('Choose a 250 or 500 point match.');
    if (!g(s)) throw new RangeError('Dealer seat must be 0\u20133.');
    return T([0, 0], [0, 0], r, s, t);
  }
  function v(t) {
    return (t + 1) % 4;
  }
  function N(t, r) {
    if (
      !t ||
      t.phase !== 'bidding' ||
      !Number.isInteger(r) ||
      r < 0 ||
      r > 13 ||
      t.bids[t.currentPlayer] !== null
    )
      return null;
    let s = [...t.bids];
    s[t.currentPlayer] = r;
    let e = v(t.currentPlayer);
    return s.every((n) => n !== null)
      ? {
          ...t,
          bids: s,
          phase: 'play',
          currentPlayer: t.firstLeader,
          trick: [],
          trickWins: [0, 0, 0, 0],
        }
      : { ...t, bids: s, currentPlayer: e };
  }
  function P(t, r) {
    if (!t || t.phase !== 'play' || !g(t.currentPlayer)) return null;
    let s = t.currentPlayer,
      e = t.hands[s],
      n = e.find((h) => h.id === r);
    if (!n) return null;
    let o = t.trick.length ? t.trick[0].card.suit : null;
    if (!E(e, o, { spadesBroken: t.spadesBroken }).some((h) => h.id === r)) return null;
    let p = t.spadesBroken || n.suit === 'spades',
      a = t.hands.map((h, c) => (c === s ? h.filter((y) => y.id !== r) : [...h])),
      b = [...t.trick, Object.freeze({ player: s, card: n })];
    if (b.length < 4) return { ...t, hands: a, trick: b, spadesBroken: p, currentPlayer: v(s) };
    let m = M(b),
      S = [...t.trickWins];
    if (((S[m.winner] += 1), S.reduce((h, c) => h + c, 0) < 13))
      return {
        ...t,
        hands: a,
        trick: [],
        trickWins: S,
        spadesBroken: p,
        currentPlayer: m.winner,
        lastTrick: m,
      };
    let f = K({ bids: t.bids, tricks: S, scores: t.scores, bags: t.bags }),
      k = f.scores.findIndex((h) => h >= t.target);
    return {
      ...t,
      hands: a,
      trick: [],
      trickWins: S,
      spadesBroken: p,
      scores: [...f.scores],
      bags: [...f.bags],
      phase: k >= 0 ? 'over' : 'between-hands',
      winner: k >= 0 ? k : null,
      lastTrick: m,
      lastHand: {
        bids: [...t.bids],
        tricks: [...S],
        teams: [...f.teams],
        scores: [...f.scores],
        bags: [...f.bags],
      },
    };
  }
  function R(t, { random: r = Math.random } = {}) {
    if (!t || t.phase !== 'between-hands') return null;
    let s = T(t.scores, t.bags, t.target, v(t.dealer), r);
    return ((s.handNumber = t.handNumber + 1), (s.lastHand = t.lastHand), s);
  }
  function j(t) {
    if (!Array.isArray(t) || t.some((e) => !A(e))) throw new TypeError('Choose a valid hand.');
    let r = t.filter((e) => e.suit === 'spades'),
      s = 0;
    for (let e of t)
      e.suit === 'spades'
        ? (s +=
            e.rank === 'A'
              ? 1.35
              : e.rank === 'K'
                ? r.length >= 2
                  ? 0.9
                  : 0.55
                : e.rank === 'Q' && r.length >= 3
                  ? 0.55
                  : 0)
        : e.rank === 'A'
          ? (s += 0.95)
          : e.rank === 'K' && t.filter((n) => n.suit === e.suit).length >= 2 && (s += 0.4);
    return Math.min(13, Math.max(0, Math.round(s)));
  }
  function H(t) {
    if (!t || t.phase !== 'play') return null;
    let r = t.hands[t.currentPlayer],
      s = t.trick.length ? t.trick[0].card.suit : null,
      e = E(r, s, { spadesBroken: t.spadesBroken });
    return e.length
      ? e.slice().sort((n, o) => {
          let p = n.suit === 'spades',
            a = o.suit === 'spades';
          return (!s && p !== a) || p !== a ? (p ? 1 : -1) : x.indexOf(n.rank) - x.indexOf(o.rank);
        })[0].id
      : null;
  }
  var u = document.querySelector('[data-tool="spades-game"]');
  if (u) {
    let f = function () {
        if (!e) return;
        (u.querySelectorAll('[data-score]').forEach((i) => {
          i.textContent = String(e.scores[Number(i.dataset.score)]);
        }),
          u.querySelectorAll('[data-bags]').forEach((i) => {
            i.textContent = String(e.bags[Number(i.dataset.bags)]);
          }),
          (u.querySelector('[data-dealer]').textContent = a[e.dealer]),
          (u.querySelector('[data-tricks]').textContent =
            `${e.trickWins[0] + e.trickWins[2]} \u2013 ${e.trickWins[1] + e.trickWins[3]}`),
          (u.querySelector('[data-bids]').textContent = e.bids
            .map((i, l) => `${a[l]}: ${i === null ? '\u2014' : i}`)
            .join(' \xB7 ')));
        let c = u.querySelector('[data-bidding]');
        c.hidden = e.phase !== 'bidding' || e.currentPlayer !== 2 || o;
        let y = u.querySelector('[data-hand]');
        y.replaceChildren();
        let d =
          e.phase === 'play' && e.currentPlayer === 2
            ? new Set(
                E(e.hands[2], e.trick.length ? e.trick[0].card.suit : null, {
                  spadesBroken: e.spadesBroken,
                }).map((i) => i.id),
              )
            : null;
        (e.hands[2] ?? [])
          .slice()
          .sort(
            (i, l) =>
              ['clubs', 'diamonds', 'hearts', 'spades'].indexOf(i.suit) -
                ['clubs', 'diamonds', 'hearts', 'spades'].indexOf(l.suit) ||
              ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].indexOf(i.rank) -
                ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].indexOf(l.rank),
          )
          .forEach((i) => {
            let l = document.createElement('button');
            ((l.type = 'button'),
              (l.className = 'spades-card'),
              (l.dataset.cardId = i.id),
              (l.textContent = `${i.rank}${p[i.suit]}`),
              l.setAttribute('aria-label', S(i)),
              l.setAttribute('aria-pressed', String(n === i.id)),
              n === i.id && l.classList.add('is-selected'),
              (i.suit === 'hearts' || i.suit === 'diamonds') && l.classList.add('is-red'),
              (l.disabled = e.phase !== 'play' || e.currentPlayer !== 2 || o),
              d && !d.has(i.id) && (l.disabled = !0),
              y.append(l));
          });
        let w = u.querySelector('[data-trick]');
        (w.replaceChildren(),
          e.trick.forEach(({ player: i, card: l }) => {
            let q = document.createElement('li'),
              O = document.createElement('span'),
              $ = document.createElement('span');
            ((O.textContent = a[i]),
              ($.textContent = `${l.rank}${p[l.suit]}`),
              q.append(O, $),
              w.append(q));
          }),
          (u.querySelector('[data-empty-trick]').hidden = e.trick.length > 0),
          (m('play').disabled = e.phase !== 'play' || e.currentPlayer !== 2 || !n || o),
          (m('next-hand').hidden = e.phase !== 'between-hands'),
          (u.querySelector('[data-result]').hidden = !['between-hands', 'over'].includes(e.phase)),
          e.phase === 'between-hands' &&
            e.lastHand &&
            (u.querySelector('[data-result-content]').textContent =
              `${s.handScored.replace('{ns}', String(e.lastHand.tricks[0] + e.lastHand.tricks[2])).replace('{ew}', String(e.lastHand.tricks[1] + e.lastHand.tricks[3]))} ${r.teamNorthSouth}: ${e.scores[0]} (${r.bags}: ${e.bags[0]}) \xB7 ${r.teamEastWest}: ${e.scores[1]} (${r.bags}: ${e.bags[1]}).`),
          e.phase === 'over' &&
            (u.querySelector('[data-result-content]').textContent = s.teamWins
              .replace('{team}', e.winner === 0 ? r.teamNorthSouth : r.teamEastWest)
              .replace('{score}', String(e.scores[e.winner]))));
      },
      t = JSON.parse(u.querySelector('[data-tool-copy]').textContent),
      r = t.fields,
      s = t.messages,
      e = null,
      n = null,
      o = !1,
      p = { clubs: '\u2663', diamonds: '\u2666', hearts: '\u2665', spades: '\u2660' },
      a = [r.seatNorth, r.seatEast, r.you, r.seatWest],
      b = (c, y = {}, d = 'success') =>
        B(
          u,
          Object.entries(y).reduce((w, [i, l]) => w.replaceAll(`{${i}}`, String(l)), s[c]),
          d,
        ),
      m = (c) => u.querySelector(`[data-action="${c}"]`),
      S = (c) => `${c.rank} ${r[c.suit]}`,
      k = () => new Promise((c) => setTimeout(c, 90));
    async function h() {
      if (!(o || !e)) {
        for (
          o = !0, f();
          e &&
          ((e.phase === 'bidding' && e.currentPlayer !== 2) ||
            (e.phase === 'play' && e.currentPlayer !== 2));
        )
          if ((await k(), e.phase === 'bidding')) {
            let c = e.currentPlayer,
              y = j(e.hands[c]);
            ((e = N(e, y)),
              f(),
              (u.querySelector('[data-status]').textContent = s.botBid
                .replace('{player}', a[c])
                .replace('{bid}', String(y))));
          } else if (e.phase === 'play') {
            let c = e.currentPlayer,
              y = H(e),
              d = e.hands[c].find((w) => w.id === y);
            ((e = P(e, y)),
              f(),
              d &&
                (u.querySelector('[data-status]').textContent = s.cardPlayed
                  .replace('{player}', a[c])
                  .replace('{card}', S(d))));
          }
        ((o = !1),
          f(),
          e.phase === 'bidding' && e.currentPlayer === 2
            ? b('chooseBid')
            : e.phase === 'play' && e.currentPlayer === 2
              ? b('chooseCard')
              : e.phase === 'between-hands' &&
                b('handScored', {
                  ns: e.lastHand.tricks[0] + e.lastHand.tricks[2],
                  ew: e.lastHand.tricks[1] + e.lastHand.tricks[3],
                }));
      }
    }
    (u.addEventListener('click', (c) => {
      let y = c.target.closest('[data-card-id]');
      if (y && e?.phase === 'play' && e.currentPlayer === 2 && !o) {
        ((n = y.dataset.cardId), f());
        return;
      }
      let d = c.target.closest('[data-action]');
      if (d) {
        if (
          (d.dataset.action === 'new-game' &&
            ((e = I({ target: Number(u.querySelector('[data-target]').value) })),
            (n = null),
            (o = !1),
            f(),
            h()),
          d.dataset.action === 'bid' &&
            e?.phase === 'bidding' &&
            e.currentPlayer === 2 &&
            !o &&
            ((e = N(e, Number(u.querySelector('[data-bid]').value))), (n = null), f(), h()),
          d.dataset.action === 'play' && n && e?.phase === 'play' && e.currentPlayer === 2 && !o)
        ) {
          let w = P(e, n);
          if (!w) {
            b('invalidAction', {}, 'error');
            return;
          }
          ((e = w), (n = null), f(), h());
        }
        d.dataset.action === 'next-hand' &&
          e?.phase === 'between-hands' &&
          !o &&
          ((e = R(e)), (n = null), f(), h());
      }
    }),
      b('ready'));
  }
})();
