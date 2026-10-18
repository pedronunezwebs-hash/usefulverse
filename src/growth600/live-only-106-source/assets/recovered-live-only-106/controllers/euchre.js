(() => {
  var ce = Object.freeze(['North', 'East', 'South', 'West']),
    A = Object.freeze(['clubs', 'diamonds', 'hearts', 'spades']),
    F = Object.freeze(['9', '10', 'J', 'Q', 'K', 'A']);
  function B(e) {
    if (!A.includes(e)) throw new RangeError('Choose a valid suit.');
  }
  function te() {
    return A.flatMap((e) => F.map((t) => Object.freeze({ rank: t, suit: e, id: `${t}-${e}` })));
  }
  function y(e, t) {
    if ((B(t), !e || !A.includes(e.suit) || !F.includes(e.rank)))
      throw new TypeError('Choose a valid card.');
    return e.rank !== 'J'
      ? e.suit
      : e.suit === t ||
          (t === 'hearts' && e.suit === 'diamonds') ||
          (t === 'diamonds' && e.suit === 'hearts') ||
          (t === 'clubs' && e.suit === 'spades') ||
          (t === 'spades' && e.suit === 'clubs')
        ? t
        : e.suit;
  }
  function m(e, t) {
    return y(e, t) === t
      ? e.rank === 'J' && e.suit === t
        ? 100
        : e.rank === 'J'
          ? 99
          : 95 - ['A', 'K', 'Q', '10', '9'].indexOf(e.rank)
      : 6 - ['A', 'K', 'Q', 'J', '10', '9'].indexOf(e.rank);
  }
  function L(e, t, n) {
    if (!Array.isArray(e) || e.length === 0) return [];
    if ((B(n), !t)) return [...e];
    B(t);
    let i = e.filter((s) => y(s, n) === t);
    return i.length ? i : [...e];
  }
  function re(e, t) {
    if ((B(t), !Array.isArray(e) || e.length !== 4))
      throw new RangeError('A trick needs exactly four cards.');
    let n = new Set();
    for (let o of e) {
      if (!Number.isInteger(o.player) || o.player < 0 || o.player > 3 || !o.card)
        throw new TypeError('A trick contains an invalid play.');
      if (n.has(o.card.id)) throw new RangeError('A card cannot be played twice in one trick.');
      n.add(o.card.id);
    }
    let i = y(e[0].card, t),
      s = e[0];
    for (let o of e.slice(1)) {
      let h = y(o.card, t),
        f = y(s.card, t);
      ((h === t && f !== t) || (h === f && m(o.card, t) > m(s.card, t))) && (s = o);
    }
    return Object.freeze({ winner: s.player, team: s.player % 2, ledSuit: i, winningCard: s.card });
  }
  function ne({ makerTeam: e, makerTricks: t, alone: n = !1 }) {
    if (![0, 1].includes(e) || !Number.isInteger(t) || t < 0 || t > 5)
      throw new RangeError('Invalid Euchre hand score.');
    return t < 3
      ? Object.freeze({ team: 1 - e, points: 2, outcome: 'euchred' })
      : Object.freeze(
          t === 5
            ? { team: e, points: n ? 4 : 2, outcome: 'march' }
            : { team: e, points: 1, outcome: 'made' },
        );
  }
  function se(e) {
    let t = te();
    for (let n = t.length - 1; n > 0; n -= 1) {
      let i = e();
      if (!Number.isFinite(i) || i < 0 || i >= 1)
        throw new RangeError('Random source must return values from 0 up to 1.');
      let s = Math.floor(i * (n + 1));
      [t[n], t[s]] = [t[s], t[n]];
    }
    return t;
  }
  function ie({ random: e = Math.random, dealer: t = 3 } = {}) {
    if (typeof e != 'function') throw new TypeError('Random source must be a function.');
    if (!Number.isInteger(t) || t < 0 || t > 3)
      throw new RangeError('Dealer seat must be 0\u20133.');
    let n = se(e),
      i = [0, 1, 2, 3].map((s) => n.slice(s * 5, s * 5 + 5));
    return Object.freeze({
      hands: Object.freeze(i.map((s) => Object.freeze(s))),
      kitty: Object.freeze(n.slice(20)),
      upcard: n[20],
      dealer: t,
      firstBidder: (t + 1) % 4,
    });
  }
  function oe(e, t = 10) {
    if (
      !Array.isArray(e) ||
      e.length !== 2 ||
      e.some((n) => !Number.isInteger(n) || n < 0) ||
      !Number.isInteger(t) ||
      t < 1
    )
      throw new RangeError('Invalid score or target.');
    return e.findIndex((n) => n >= t);
  }
  function C(e, t) {
    return { ...e, ...t };
  }
  function _(e, t, n, i) {
    let s = ie({ random: n, dealer: t });
    return {
      scores: [...e],
      target: i,
      dealer: t,
      hands: s.hands.map((o) => [...o]),
      kitty: [...s.kitty.slice(1)],
      upcard: s.upcard,
      firstBidder: s.firstBidder,
      bidRound: 1,
      bidPasses: 0,
      phase: 'bidding',
      currentPlayer: s.firstBidder,
      trump: null,
      makerTeam: null,
      maker: null,
      tricks: [0, 0],
      trick: [],
      handNumber: 1,
      lastHand: null,
      winner: null,
    };
  }
  function D({ random: e = Math.random, target: t = 10, dealer: n = 3 } = {}) {
    if (typeof e != 'function') throw new TypeError('Random source must be a function.');
    if (!Number.isInteger(t) || t < 5 || t > 15)
      throw new RangeError('Target score must be from 5 to 15.');
    if (!Number.isInteger(n) || n < 0 || n > 3)
      throw new RangeError('Dealer seat must be 0\u20133.');
    return _([0, 0], n, e, t);
  }
  function O(e) {
    return (e + 1) % 4;
  }
  function U(e, t, n) {
    let i = e.hands.map((s) => [...s]);
    return (
      i[n].some(({ id: s }) => s === e.upcard.id) || i[n].push(e.upcard),
      C(e, {
        hands: i,
        trump: t,
        maker: n,
        makerTeam: n % 2,
        currentPlayer: n,
        phase: 'discard',
        bidPasses: 0,
      })
    );
  }
  function ae(e, t) {
    return { ..._(e.scores, O(e.dealer), t, e.target), handNumber: e.handNumber + 1 };
  }
  function H(e, { type: t, suit: n } = {}, { random: i = Math.random } = {}) {
    if (
      !e ||
      e.phase !== 'bidding' ||
      !['pass', 'order-up', 'name-trump'].includes(t) ||
      (t === 'order-up' && e.bidRound !== 1) ||
      (t === 'name-trump' && (e.bidRound !== 2 || !A.includes(n) || n === e.upcard.suit))
    )
      return null;
    let s = e.currentPlayer;
    if (t === 'order-up') return U(e, e.upcard.suit, s);
    if (t === 'name-trump') return U(e, n, s);
    let o = e.bidPasses + 1;
    return o < 4
      ? C(e, { bidPasses: o, currentPlayer: O(s) })
      : e.bidRound === 1
        ? C(e, { bidRound: 2, bidPasses: 0, currentPlayer: e.firstBidder })
        : ae(e, i);
  }
  function J(e, t) {
    if (
      !e ||
      e.phase !== 'discard' ||
      e.currentPlayer !== e.maker ||
      !e.hands[e.maker].some(({ id: i }) => i === t)
    )
      return null;
    let n = e.hands.map((i, s) => (s === e.maker ? i.filter(({ id: o }) => o !== t) : [...i]));
    return C(e, {
      hands: n,
      phase: 'play',
      currentPlayer: e.firstBidder,
      trick: [],
      tricks: [0, 0],
    });
  }
  function M(e, t, { random: n = Math.random } = {}) {
    if (!e || e.phase !== 'play') return null;
    let i = e.currentPlayer,
      s = e.hands[i],
      o = s.find(({ id: x }) => x === t);
    if (
      !o ||
      !L(s, e.trick.length ? y(e.trick[0].card, e.trump) : null, e.trump).some(
        ({ id: x }) => x === t,
      )
    )
      return null;
    let f = e.hands.map((x, q) => (q === i ? x.filter(({ id: r }) => r !== t) : [...x])),
      k = [...e.trick, { player: i, card: o }];
    if (k.length < 4) return C(e, { hands: f, trick: k, currentPlayer: O(i) });
    let v = re(k, e.trump),
      p = [...e.tricks];
    if (((p[v.team] += 1), p[0] + p[1] < 5))
      return C(e, { hands: f, trick: [], tricks: p, currentPlayer: v.winner, lastTrick: v });
    let E = ne({ makerTeam: e.makerTeam, makerTricks: p[e.makerTeam] }),
      R = [...e.scores];
    R[E.team] += E.points;
    let g = oe(R, e.target);
    return g !== -1
      ? C(e, {
          hands: f,
          tricks: p,
          scores: R,
          trick: [],
          phase: 'over',
          winner: g,
          lastHand: { ...E, tricks: [...p] },
        })
      : {
          ..._(R, O(e.dealer), n, e.target),
          handNumber: e.handNumber + 1,
          lastHand: { ...E, tricks: [...p] },
        };
  }
  function G(e, t) {
    return e.filter((n) => y(n, t) === t).length;
  }
  function K(e) {
    if (!e || e.phase !== 'bidding') return null;
    let t = e.hands[e.currentPlayer];
    if (e.bidRound === 1) {
      let s = e.upcard.suit,
        o = G(t, s) + (t.some(({ id: h }) => h === e.upcard.id) ? 1 : 0);
      return o >= 3 || (o >= 2 && t.some((h) => h.rank === 'J' && h.suit === s))
        ? { type: 'order-up' }
        : { type: 'pass' };
    }
    let i = A.filter((s) => s !== e.upcard.suit)
      .map((s) => ({
        suit: s,
        count: G(t, s),
        hasRight: t.some((o) => o.rank === 'J' && o.suit === s),
      }))
      .sort((s, o) => o.count - s.count || Number(o.hasRight) - Number(s.hasRight))[0];
    return i.count >= 3 || (i.count >= 2 && i.hasRight)
      ? { type: 'name-trump', suit: i.suit }
      : { type: 'pass' };
  }
  function W(e) {
    if (!e || e.phase !== 'play') return null;
    let t = e.trick.length ? y(e.trick[0].card, e.trump) : null,
      n = L(e.hands[e.currentPlayer], t, e.trump);
    return n.length ? n.slice().sort((i, s) => m(i, e.trump) - m(s, e.trump))[0].id : null;
  }
  function Q(e) {
    return !e || e.phase !== 'discard'
      ? null
      : (e.hands[e.maker].slice().sort((n, i) => m(n, e.trump) - m(i, e.trump))[0]?.id ?? null);
  }
  function V(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function N(e, t, n = 'info') {
    let i = e.querySelector('[data-status]');
    i && ((i.textContent = t), (i.dataset.kind = n));
  }
  var u = document.querySelector('[data-tool="euchre"]');
  if (u) {
    let I = function (a, d = {}) {
        return a.replace(/\{([a-zA-Z]+)\}/gu, (l, w) => String(d[w] ?? ''));
      },
      z = function (a) {
        return `${a.rank} ${$[a.suit]}`;
      },
      Z = function (a) {
        return `${a.rank}${x[a.suit]}`;
      },
      X = function (a, { playable: d = !1, discardable: l = !1 } = {}) {
        let w = document.createElement('li');
        w.className = `euchre-card euchre-card--${a.suit}`;
        let c = document.createElement('button');
        return (
          (c.type = 'button'),
          (c.className = 'button button--secondary euchre-card__button'),
          (c.dataset.cardId = a.id),
          (c.textContent = Z(a)),
          c.setAttribute('aria-label', `${d ? e.actions.play : e.actions.discard}: ${z(a)}`),
          (c.disabled = !d && !l),
          c.setAttribute('aria-pressed', String(l && b === a.id)),
          l && b === a.id && c.classList.add('is-selected'),
          w.append(c),
          w
        );
      },
      Y = function () {
        let a = r.phase === 'bidding' && r.currentPlayer === 0;
        if (((s.hidden = r.phase !== 'bidding'), !a)) return;
        o.textContent = e.fields[`round${r.bidRound === 1 ? 'One' : 'Two'}`];
        let d = r.bidRound === 1;
        ((k.hidden = !d),
          (v.hidden = d),
          (p.hidden = !1),
          (h.hidden = d),
          [...f.options].forEach((l) => {
            ((l.disabled = l.value === r.upcard.suit), (l.hidden = l.disabled));
          }),
          f.selectedOptions[0]?.disabled &&
            (f.value = [...f.options].find((l) => !l.disabled)?.value ?? 'clubs'));
      },
      S = function () {
        for (let c of [0, 1])
          u.querySelector(`[data-score="${c}"]`).textContent = String(r.scores[c]);
        ((u.querySelector('[data-dealer]').textContent = q[r.dealer]),
          (u.querySelector('[data-upcard]').textContent = z(r.upcard)),
          (u.querySelector('[data-trump]').textContent = r.trump ? $[r.trump] : e.messages.noTrump),
          (u.querySelector('[data-tricks]').textContent = `${r.tricks[0]}\u2013${r.tricks[1]}`),
          i.replaceChildren());
        for (let c of r.trick) {
          let T = document.createElement('li');
          ((T.className = `euchre-trick__play euchre-card--${c.card.suit}`),
            (T.textContent = `${q[c.player]}: ${z(c.card)}`),
            i.append(T));
        }
        n.replaceChildren();
        let a =
            r.phase === 'play' && r.currentPlayer === 0
              ? L(r.hands[0], r.trick.length ? y(r.trick[0].card, r.trump) : null, r.trump)
              : [],
          d = new Set(a.map(({ id: c }) => c)),
          l = r.phase === 'discard' && r.maker === 0,
          w = r.hands[0]
            .slice()
            .sort((c, T) => m(T, r.trump ?? r.upcard.suit) - m(c, r.trump ?? r.upcard.suit));
        for (let c of w) n.append(X(c, { playable: d.has(c.id), discardable: l }));
        if (
          ((E.hidden = !l),
          (E.disabled = !b || !w.some(({ id: c }) => c === b)),
          Y(),
          (R.hidden = r.phase !== 'over'),
          r.phase === 'over')
        ) {
          let c = r.winner === 0 ? e.messages.southTeam : e.messages.northTeam;
          ((g.textContent = I(e.messages.teamWins, { team: c, score: r.scores[r.winner] })),
            N(u, g.textContent, 'success'));
        }
      },
      ee = function () {
        if (r.phase === 'over') return '';
        if (r.phase === 'bidding' && r.currentPlayer === 0)
          return I(e.messages.bidding, { round: r.bidRound, player: e.fields.playerSouth });
        if (r.phase === 'discard' && r.maker === 0) return e.messages.chooseDiscard;
        if (r.phase === 'play' && r.currentPlayer === 0) return e.messages.chooseCard;
        let a = q[r.currentPlayer];
        return r.phase === 'bidding'
          ? I(e.messages.bidding, { round: r.bidRound, player: a })
          : I(e.messages.botTurn, { player: a });
      },
      P = function () {
        let a = 0;
        for (; r.phase !== 'over' && r.currentPlayer !== 0 && a < 40;) {
          if (((a += 1), r.phase === 'bidding')) r = H(r, K(r));
          else if (r.phase === 'discard') r = J(r, Q(r));
          else if (r.phase === 'play') r = M(r, W(r));
          else break;
          if (!r) break;
        }
        (S(), N(u, ee(), 'info'));
      },
      j = function (a) {
        let d = H(r, a);
        if (!d) return N(u, e.messages.invalidAction, 'error');
        ((r = d), (b = ''), S(), P());
      },
      e = V(u),
      t = u.querySelector('[data-target]'),
      n = u.querySelector('[data-hand]'),
      i = u.querySelector('[data-trick]'),
      s = u.querySelector('[data-bidding]'),
      o = u.querySelector('[data-bidding-title]'),
      h = u.querySelector('[data-trump-choice]'),
      f = u.querySelector('[data-trump-choice-select]'),
      k = u.querySelector('[data-action="order-up"]'),
      v = u.querySelector('[data-action="name-trump"]'),
      p = u.querySelector('[data-action="pass"]'),
      E = u.querySelector('[data-action="discard"]'),
      R = u.querySelector('[data-result]'),
      g = u.querySelector('[data-result-content]'),
      $ = {
        clubs: e.fields.clubs,
        diamonds: e.fields.diamonds,
        hearts: e.fields.hearts,
        spades: e.fields.spades,
      },
      x = { clubs: '\u2663', diamonds: '\u2666', hearts: '\u2665', spades: '\u2660' },
      q = [e.fields.playerSouth, e.fields.seatWest, e.fields.seatNorth, e.fields.seatEast],
      r = D({ target: Number(t.value) }),
      b = '';
    (n.addEventListener('click', (a) => {
      let d = a.target.closest('button[data-card-id]');
      if (!d || !n.contains(d)) return;
      if (r.phase === 'discard' && r.maker === 0) {
        ((b = d.dataset.cardId), S());
        return;
      }
      if (r.phase !== 'play' || r.currentPlayer !== 0) return;
      let l = M(r, d.dataset.cardId);
      if (!l) return N(u, e.messages.invalidAction, 'error');
      ((r = l), (b = ''), S(), P());
    }),
      k.addEventListener('click', () => j({ type: 'order-up' })),
      v.addEventListener('click', () => j({ type: 'name-trump', suit: f.value })),
      p.addEventListener('click', () => j({ type: 'pass' })),
      E.addEventListener('click', () => {
        let a = J(r, b);
        if (!a) return N(u, e.messages.invalidAction, 'error');
        ((r = a), (b = ''), S(), P());
      }),
      u.querySelector('[data-action="new-game"]').addEventListener('click', () => {
        ((r = D({ target: Number(t.value) })), (b = ''), S(), P());
      }),
      t.addEventListener('change', () => {
        (!Number.isInteger(Number(t.value)) || Number(t.value) < 5 || Number(t.value) > 10) &&
          (t.value = '10');
      }),
      S(),
      P());
  }
})();
