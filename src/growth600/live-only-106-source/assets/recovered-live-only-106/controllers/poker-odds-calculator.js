(() => {
  var R = '23456789TJQKA',
    T = 'shdc',
    S = Object.freeze(Object.fromEntries([...R].map((e, t) => [e, t + 2]))),
    j = 7,
    P = 8,
    N = 25e3,
    p = (e, t) => Object.assign(new RangeError(t), { code: e });
  function O(e, t = 'cards') {
    let o = String(e ?? '').trim();
    return o
      ? o
          .split(/[\s,;]+/u)
          .filter(Boolean)
          .map((a) => {
            let c = /^(10|[2-9TJQKA])([SHDC])$/iu.exec(a);
            if (!c) throw p('cardFormat', `Enter ${t} as rank plus suit, such as As Kd 10h.`);
            let n = c[1].toUpperCase() === '10' ? 'T' : c[1].toUpperCase(),
              s = c[2].toLowerCase();
            return Object.freeze({ rank: n, suit: s, value: S[n], code: `${n}${s}` });
          })
      : [];
  }
  function F() {
    return Object.freeze(
      [...R].flatMap((e) =>
        [...T].map((t) => Object.freeze({ rank: e, suit: t, value: S[e], code: `${e}${t}` })),
      ),
    );
  }
  function B(e) {
    let t = [...new Set(e)].sort((o, r) => r - o);
    t.includes(14) && t.push(1);
    for (let o = 0; o <= t.length - 5; o += 1) if (t[o] - t[o + 4] === 4) return t[o];
    return 0;
  }
  function D(e) {
    if (
      !Array.isArray(e) ||
      e.length !== 5 ||
      e.some((n) => !n || !S[n.rank] || !T.includes(n.suit))
    )
      throw new RangeError('A poker hand score needs five valid cards.');
    let t = e.map(({ value: n, rank: s }) => n ?? S[s]),
      o = e.every(({ suit: n }) => n === e[0].suit),
      r = [...t.reduce((n, s) => n.set(s, (n.get(s) ?? 0) + 1), new Map()).entries()].sort(
        (n, s) => s[1] - n[1] || s[0] - n[0],
      ),
      a = B(t);
    if (o && a) return [8, a];
    if (r[0][1] === 4) return [7, r[0][0], r[1][0]];
    if (r[0][1] === 3 && r[1][1] === 2) return [6, r[0][0], r[1][0]];
    if (o) return [5, ...t.sort((n, s) => s - n)];
    if (a) return [4, a];
    if (r[0][1] === 3)
      return [
        3,
        r[0][0],
        ...r
          .slice(1)
          .map(([n]) => n)
          .sort((n, s) => s - n),
      ];
    let c = r
      .filter(([, n]) => n === 2)
      .map(([n]) => n)
      .sort((n, s) => s - n);
    return c.length === 2
      ? [2, ...c, r.find(([, n]) => n === 1)[0]]
      : c.length === 1
        ? [
            1,
            c[0],
            ...r
              .filter(([, n]) => n === 1)
              .map(([n]) => n)
              .sort((n, s) => s - n),
          ]
        : [0, ...t.sort((n, s) => s - n)];
  }
  function v(e, t) {
    for (let o = 0; o < Math.max(e.length, t.length); o += 1) {
      let r = (e[o] ?? 0) - (t[o] ?? 0);
      if (r) return Math.sign(r);
    }
    return 0;
  }
  function C(e) {
    if (!Array.isArray(e) || e.length !== j)
      throw new RangeError('Best-hand evaluation needs seven cards.');
    let t = null;
    for (let o = 0; o < e.length - 4; o += 1)
      for (let r = o + 1; r < e.length - 3; r += 1)
        for (let a = r + 1; a < e.length - 2; a += 1)
          for (let c = a + 1; c < e.length - 1; c += 1)
            for (let n = c + 1; n < e.length; n += 1) {
              let s = D([e[o], e[r], e[a], e[c], e[n]]);
              (!t || v(s, t) > 0) && (t = s);
            }
    return t;
  }
  function U(e) {
    let t = e >>> 0;
    return (
      t || (t = 1831565813),
      () => ((t ^= t << 13), (t ^= t >>> 17), (t ^= t << 5), (t >>> 0) / 4294967296)
    );
  }
  function $(e, t) {
    let o = t.reduce((a, c) => (v(c, a) > 0 ? c : a)),
      r = t.filter((a) => v(a, o) === 0);
    (v(t[0], o) !== 0 ? (e.losses += 1) : r.length === 1 ? (e.wins += 1) : (e.ties += 1),
      (e.share += r.some((a) => a === t[0]) ? 1 / r.length : 0));
  }
  function _(e, t, o, r = null) {
    let a = (n) => (n / t) * 100,
      c = a(e.share);
    return Object.freeze({
      method: o,
      total: t,
      wins: e.wins,
      ties: e.ties,
      losses: e.losses,
      winPercent: a(e.wins),
      tiePercent: a(e.ties),
      lossPercent: a(e.losses),
      equityPercent: c,
      standardErrorPercent: o === 'exact' ? 0 : Math.sqrt(((c / 100) * (1 - c / 100)) / t) * 100,
      seed: r,
    });
  }
  function K({ hero: e, board: t, opponents: o, trials: r, seed: a }) {
    let c = O(e, 'your two hole cards'),
      n = O(t, 'community cards');
    if (c.length !== 2) throw p('exactTwoCards', 'Enter exactly two hole cards.');
    if (n.length > 5) throw p('tooManyBoardCards', 'Enter no more than five community cards.');
    let s = [...c, ...n];
    if (new Set(s.map(({ code: l }) => l)).size !== s.length)
      throw p('duplicateCards', 'A card cannot appear more than once.');
    if (!Number.isInteger(o) || o < 1 || o > P)
      throw p('opponentsRange', `Choose between 1 and ${P} opponents.`);
    if (!Number.isInteger(r) || r < 1e3 || r > N)
      throw p('trialsRange', `Choose between 1,000 and ${N.toLocaleString('en-US')} simulations.`);
    if (!Number.isInteger(a) || a < 1 || a > 4294967295)
      throw p('seedRange', 'Choose a whole-number seed from 1 to 4,294,967,295.');
    if (s.length + o * 2 + (5 - n.length) > 52)
      throw p('notEnoughCards', 'There are not enough cards for that scenario.');
    return { holeCards: c, community: n, known: s };
  }
  function H(e, t, o) {
    let r = { wins: 0, ties: 0, losses: 0, share: 0 },
      a = C([...e, ...t]),
      c = 0;
    for (let n = 0; n < o.length - 1; n += 1)
      for (let s = n + 1; s < o.length; s += 1) ($(r, [a, C([o[n], o[s], ...t])]), (c += 1));
    return _(r, c, 'exact');
  }
  async function M({
    hero: e,
    board: t = '',
    opponents: o = 1,
    trials: r = 1e4,
    seed: a = 20261014,
    signal: c,
    onProgress: n = () => {},
  }) {
    let {
        holeCards: s,
        community: l,
        known: b,
      } = K({ hero: e, board: t, opponents: o, trials: r, seed: a }),
      E = new Set(b.map(({ code: u }) => u)),
      y = F().filter(({ code: u }) => !E.has(u));
    if (l.length === 5 && o === 1) return H(s, l, y);
    let k = U(a),
      i = 5 - l.length + 2 * o,
      m = { wins: 0, ties: 0, losses: 0, share: 0 },
      h = 500;
    for (let u = 0; u < r; u += h) {
      if (c?.aborted) {
        let w = new Error('The simulation was canceled.');
        throw ((w.name = 'AbortError'), w);
      }
      let g = Math.min(u + h, r);
      for (let w = u; w < g; w += 1) {
        let x = y.slice();
        for (let f = 0; f < i; f += 1) {
          let I = f + Math.floor(k() * (x.length - f));
          [x[f], x[I]] = [x[I], x[f]];
        }
        let q = [...l, ...x.slice(2 * o, i)],
          A = [C([...s, ...q])];
        for (let f = 0; f < o; f += 1) A.push(C([...x.slice(f * 2, f * 2 + 2), ...q]));
        $(m, A);
      }
      (n(Object.freeze({ completed: g, total: r })),
        g < r && (await new Promise((w) => setTimeout(w, 0))));
    }
    return _(m, r, 'monte-carlo', a);
  }
  function z(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function L(e, t, o = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = t), (r.dataset.kind = o));
  }
  var d = document.querySelector('[data-tool="poker-odds-calculator"]');
  if (d) {
    let l = function (i, m = '') {
        ((o.textContent = i), L(d, i, m));
      },
      b = function (i) {
        (t.querySelector('[data-action="calculate"]')?.toggleAttribute('disabled', i),
          (a.hidden = !i),
          t.setAttribute('aria-busy', String(i)));
      },
      E = function () {
        let i = new FormData(t);
        return {
          hero: i.get('hero'),
          board: i.get('board'),
          opponents: Number(i.get('opponents')),
          trials: Number(i.get('trials')),
          seed: Number(i.get('seed')),
        };
      },
      y = function (i) {
        let m = {
          win: `${n.format(i.winPercent)}%`,
          tie: `${n.format(i.tiePercent)}%`,
          loss: `${n.format(i.lossPercent)}%`,
          equity: `${n.format(i.equityPercent)}%`,
        };
        for (let [u, g] of Object.entries(m))
          d.querySelector(`[data-poker-value="${u}"]`).textContent = g;
        d.querySelector('[data-poker-method]').textContent =
          i.method === 'exact' ? e.fields.exactMethod : e.fields.simulationMethod;
        let h = i.method === 'exact' ? 0 : 1.96 * i.standardErrorPercent;
        ((d.querySelector('[data-poker-uncertainty]').textContent =
          i.method === 'exact'
            ? `${e.fields.uncertainty}: \xB10% (${e.fields.exactMethod})`
            : `${e.fields.uncertainty}: \xB1${n.format(h)} percentage points`),
          (r.hidden = !1));
      },
      k = function () {
        for (let [i, m] of Object.entries(e.example.values)) t.elements.namedItem(i).value = m;
        ((r.hidden = !0), l(e.messages.exampleLoaded));
      },
      e = z(d),
      t = d.querySelector('#tool-form'),
      o = d.querySelector('[data-poker-status]'),
      r = d.querySelector('[data-poker-results]'),
      a = d.querySelector('[data-action="cancel"]'),
      c = e.copyLanguage === 'zh_tw' ? 'zh-TW' : e.copyLanguage,
      n = new Intl.NumberFormat(c, { maximumFractionDigits: 2 }),
      s = null;
    (t.addEventListener('submit', async (i) => {
      if ((i.preventDefault(), s)) return;
      let m = E();
      ((s = new AbortController()), b(!0), (r.hidden = !0));
      try {
        let h = await M({
          ...m,
          signal: s.signal,
          onProgress: ({ completed: u, total: g }) => {
            o.textContent = e.messages.progress
              .replace('{done}', n.format(u))
              .replace('{total}', n.format(g));
          },
        });
        (y(h), l(e.messages.calculated, 'success'));
      } catch (h) {
        h.name === 'AbortError'
          ? l(e.messages.cancelled)
          : l(
              h instanceof RangeError
                ? (e.messages[h.code] ?? e.messages.checkInputs)
                : e.messages.checkInputs,
              'error',
            );
      } finally {
        ((s = null), b(!1));
      }
    }),
      a.addEventListener('click', () => s?.abort()),
      d.querySelector('[data-action="example"]')?.addEventListener('click', k),
      t.addEventListener('reset', (i) => {
        (i.preventDefault(),
          s?.abort(),
          (r.hidden = !0),
          (t.elements.namedItem('hero').value = ''),
          (t.elements.namedItem('board').value = ''),
          (t.elements.namedItem('opponents').value = '1'),
          (t.elements.namedItem('trials').value = '10000'),
          (t.elements.namedItem('seed').value = '20261014'),
          l(e.messages.checkInputs));
      }));
  }
})();
