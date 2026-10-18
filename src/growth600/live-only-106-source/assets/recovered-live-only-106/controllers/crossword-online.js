(() => {
  function G(i, u, d = 'info') {
    let r = i.querySelector('[data-status]');
    r && ((r.textContent = u), (r.dataset.kind = d));
  }
  var O =
      typeof Intl.Segmenter == 'function'
        ? new Intl.Segmenter(void 0, { granularity: 'grapheme' })
        : null,
    R = class extends Error {
      constructor(u) {
        (super(u), (this.name = 'CrosswordError'), (this.code = u));
      }
    };
  function j(i) {
    return String(i ?? '')
      .normalize('NFC')
      .toLocaleUpperCase()
      .replace(/[^\p{L}\p{M}\p{N}]/gu, '');
  }
  function b(i) {
    let u = j(i);
    return O ? [...O.segment(u)].map(({ segment: d }) => d) : Array.from(u);
  }
  function H(i, u) {
    let d = [...i];
    for (let r = d.length - 1; r > 0; r -= 1) {
      let a = Number(u()),
        s = Math.min(r, Math.max(0, Math.floor((Number.isFinite(a) ? a : 0) * (r + 1))));
      [d[r], d[s]] = [d[s], d[r]];
    }
    return d;
  }
  function q(i, u) {
    return `${i},${u}`;
  }
  function V(i, u, d, r, a) {
    let s = r === 'down' ? 1 : 0,
      l = r === 'across' ? 1 : 0,
      m = 0;
    for (let p = 0; p < i.length; p += 1) {
      let w = u + s * p,
        v = d + l * p,
        g = a.get(q(w, v));
      if (g) {
        if (g.letter !== i[p] || ((m += 1), m > 1)) return null;
      } else if (
        (r === 'across'
          ? [
              [w - 1, v],
              [w + 1, v],
            ]
          : [
              [w, v - 1],
              [w, v + 1],
            ]
        ).some(([L, A]) => a.has(q(L, A)))
      )
        return null;
    }
    if (m !== 1) return null;
    let E = q(u - s, d - l),
      f = q(u + s * i.length, d + l * i.length);
    return a.has(E) || a.has(f) ? null : !0;
  }
  function W(i, u, d) {
    let r = new Map(),
      a = [],
      s = i[0];
    if (!s) return null;
    let l = b(s.answer),
      m = 15,
      E = m,
      f = m - Math.floor(l.length / 2);
    (l.forEach((e, t) => r.set(q(E, f + t), { letter: e })),
      a.push({ ...s, letters: l, row: E, col: f, direction: 'across' }));
    for (let e of i.slice(1)) {
      if (a.length >= d) break;
      let t = b(e.answer);
      if (t.length < 2 || t.length > 15 || a.some((h) => h.answer === e.answer)) continue;
      let n = [];
      for (let h of a) {
        let N = h.direction === 'across' ? 'down' : 'across',
          x = N === 'down' ? 1 : 0,
          _ = N === 'across' ? 1 : 0;
        for (let M = 0; M < h.letters.length; M += 1)
          for (let k = 0; k < t.length; k += 1) {
            if (h.letters[M] !== t[k]) continue;
            let J = h.row + (h.direction === 'down' ? M : 0),
              K = h.col + (h.direction === 'across' ? M : 0),
              P = J - x * k,
              T = K - _ * k;
            V(t, P, T, N, r) && n.push({ row: P, col: T, direction: N, w: k });
          }
      }
      if (!n.length) continue;
      let o = n[Math.floor(Math.min(0.999999, Math.max(0, Number(u()) || 0)) * n.length)],
        c = o.direction === 'down' ? 1 : 0,
        S = o.direction === 'across' ? 1 : 0;
      (t.forEach((h, N) => {
        let x = q(o.row + c * N, o.col + S * N);
        r.has(x) || r.set(x, { letter: h });
      }),
        a.push({ ...e, letters: t, row: o.row, col: o.col, direction: o.direction }));
    }
    if (a.length < 4) return null;
    let p = Math.min(...[...r.keys()].map((e) => Number(e.split(',')[0]))),
      w = Math.max(...[...r.keys()].map((e) => Number(e.split(',')[0]))),
      v = Math.min(...[...r.keys()].map((e) => Number(e.split(',')[1]))),
      g = Math.max(...[...r.keys()].map((e) => Number(e.split(',')[1]))),
      y = 1 - p,
      L = 1 - v,
      A = Array.from({ length: w - p + 3 }, () => Array.from({ length: g - v + 3 }, () => null));
    for (let [e, t] of r) {
      let [n, o] = e.split(',').map(Number);
      A[n + y][o + L] = t.letter;
    }
    let I = a.map((e) => ({
        id: e.id,
        clue: String(e.clue),
        answer: e.letters.join(''),
        direction: e.direction,
        row: e.row + y,
        col: e.col + L,
      })),
      $ = new Map();
    for (let e of I) $.set(q(e.row, e.col), !0);
    return (
      [...$.keys()]
        .sort((e, t) => {
          let [n, o] = e.split(',').map(Number),
            [c, S] = t.split(',').map(Number);
          return n - c || o - S;
        })
        .forEach((e, t) => {
          $.set(e, t + 1);
        }),
      I.forEach((e) => {
        e.number = $.get(q(e.row, e.col));
      }),
      { grid: A, entries: I, rows: A.length, cols: A[0].length }
    );
  }
  function U(i, { random: u = Math.random, maxEntries: d = 10 } = {}) {
    if (!Array.isArray(i)) throw new R('invalid-bank');
    let r = i
      .map((s) => ({ ...s, answer: j(s?.answer), clue: String(s?.clue ?? '').trim() }))
      .filter(
        (s) =>
          typeof s.id == 'string' &&
          s.id &&
          s.answer.length >= 2 &&
          s.answer.length <= 15 &&
          s.clue,
      )
      .filter((s, l, m) => m.findIndex((E) => E.answer === s.answer) === l);
    if (r.length < 4) throw new R('not-enough-words');
    let a = null;
    for (let s = 0; s < 30; s += 1) {
      let l = W(H(r, u), u, Math.min(d, r.length));
      if (
        (l && (!a || l.entries.length > a.entries.length) && (a = l),
        a?.entries.length >= Math.min(d, r.length))
      )
        break;
    }
    if (!a) throw new R('could-not-build');
    return a;
  }
  function z(i, u) {
    return j(u) === i.answer;
  }
  function D(i, u) {
    let d = i.entries.map((r) => ({ id: r.id, correct: z(r, u?.[r.id] ?? '') }));
    return {
      entries: d,
      correct: d.every(({ correct: r }) => r),
      solvedCount: d.filter(({ correct: r }) => r).length,
    };
  }
  function B(i, u) {
    let d = b(u),
      r = b(i.answer),
      a = r.findIndex((s, l) => d[l] !== s);
    return a < 0 ? null : { index: a, letter: r[a] };
  }
  var C = document.querySelector('[data-tool="crossword-online"]');
  if (C) {
    let w = function () {
        return l?.entries.find((e) => e.id === E) ?? null;
      },
      v = function (e) {
        return `${e.number}. ${e.clue}`;
      },
      g = function (e) {
        return b(e.answer).map(
          (t, n) =>
            `${e.row + (e.direction === 'down' ? n : 0)},${e.col + (e.direction === 'across' ? n : 0)}`,
        );
      },
      y = function () {
        if (!l) return;
        let e = new Map();
        for (let t of l.entries) {
          let n = b(m[t.id] ?? '');
          g(t).forEach((o, c) => {
            if (!n[c]) return;
            let S = e.get(o) ?? [];
            (S.push(n[c]), e.set(o, S));
          });
        }
        for (let [t, n] of p) {
          let o = e.get(t) ?? [],
            c = new Set(o).size > 1;
          ((n.querySelector('[data-cell-letter]').textContent = c ? '!' : (o[0] ?? '')),
            n.classList.toggle('is-conflict', c),
            n.classList.toggle('is-active', !!(w() && g(w())[f] === t)),
            n.setAttribute('aria-pressed', String(!!(w() && g(w())[f] === t))));
        }
        C.querySelector('[data-crossword-progress]').textContent = i.fields.progress
          .replace('{solved}', String(D(l, m).solvedCount))
          .replace('{total}', String(l.entries.length));
      },
      L = function (e, t = 0, n = !1) {
        let o = l.entries.find((c) => c.id === e);
        o &&
          ((E = e),
          (f = Math.max(0, Math.min(t, b(o.answer).length - 1))),
          (C.querySelector('[data-selected-clue]').textContent = i.fields.selected + ': ' + v(o)),
          (a.value = m[e] ?? ''),
          C.querySelectorAll('[data-clue-id]').forEach((c) =>
            c.setAttribute('aria-pressed', String(c.dataset.clueId === e)),
          ),
          y(),
          n && p.get(g(o)[f])?.focus());
      },
      A = function (e, t) {
        (e.replaceChildren(),
          l.entries
            .filter((n) => n.direction === t)
            .forEach((n) => {
              let o = document.createElement('li'),
                c = document.createElement('button');
              ((c.type = 'button'),
                (c.className = 'crossword-online__clue'),
                (c.dataset.clueId = n.id),
                (c.textContent = v(n)),
                c.setAttribute('aria-pressed', 'false'),
                c.addEventListener('click', () => L(n.id, 0, !0)),
                o.append(c),
                e.append(o));
            }));
      },
      I = function () {
        try {
          ((l = U(i.puzzles, { maxEntries: 10 })),
            (m = {}),
            (E = null),
            (f = 0),
            (p = new Map()),
            u.replaceChildren(),
            u.style.setProperty('--crossword-columns', String(l.cols)),
            u.setAttribute('aria-label', i.fields.board));
          for (let t = 0; t < l.rows; t += 1)
            for (let n = 0; n < l.cols; n += 1) {
              if (l.grid[t][n] === null) {
                let x = document.createElement('span');
                ((x.className = 'crossword-online__blank'),
                  x.setAttribute('aria-label', i.fields.blank),
                  u.append(x));
                continue;
              }
              let c = document.createElement('button');
              ((c.type = 'button'),
                (c.className = 'crossword-online__cell'),
                (c.dataset.row = String(t)),
                (c.dataset.col = String(n)));
              let S = document.createElement('small');
              S.className = 'crossword-online__number';
              let h = l.entries.find((x) => x.row === t && x.col === n);
              S.textContent = h ? String(h.number) : '';
              let N = document.createElement('span');
              ((N.dataset.cellLetter = ''),
                c.append(S, N),
                c.setAttribute(
                  'aria-label',
                  i.fields.number.replace('{number}', h?.number ?? '') + (h ? `: ${h.clue}` : ''),
                ),
                c.addEventListener('click', () => {
                  let x = `${t},${n}`,
                    _ = l.entries.filter((k) => g(k).includes(x)),
                    M = _.find((k) => k.id === E);
                  (M || (M = _.find((k) => k.direction === w()?.direction) ?? _[0]),
                    M && L(M.id, g(M).indexOf(x)));
                }),
                p.set(`${t},${n}`, c),
                u.append(c));
            }
          (A(d, 'across'),
            A(r, 'down'),
            (C.querySelector('[data-selected-clue]').textContent = i.fields.selected),
            s('newGame', {}, 'info'),
            y());
          let e = l.entries[0];
          e && L(e.id, 0);
        } catch {
          ((l = null),
            u.replaceChildren(),
            d.replaceChildren(),
            r.replaceChildren(),
            s('buildFailed', {}, 'error'));
        }
      },
      $ = function (e) {
        let t = w();
        if (!t) return;
        let n = b(j(e));
        if (!n.length) return;
        let o = b(m[t.id] ?? Array.from({ length: b(t.answer).length }, () => ' ').join(''));
        ((o[f] = n.at(-1)),
          (m[t.id] = o.join('').replace(/\s+$/u, '')),
          (a.value = m[t.id]),
          f < b(t.answer).length - 1 && (f += 1),
          y(),
          p.get(g(t)[f])?.focus());
      },
      F = function (e) {
        if (
          e.target === a ||
          e.isComposing ||
          e.target.closest('button[data-action],button[data-clue-id]')
        )
          return;
        let t = w();
        if (t)
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
            (e.preventDefault(),
              (f = Math.min(b(t.answer).length - 1, f + 1)),
              y(),
              p.get(g(t)[f])?.focus());
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
            (e.preventDefault(), (f = Math.max(0, f - 1)), y(), p.get(g(t)[f])?.focus());
          else if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            let n = b(m[t.id] ?? '');
            (n[f] ? (n[f] = '') : (f = Math.max(0, f - 1)),
              (m[t.id] = n.join('')),
              y(),
              p.get(g(t)[f])?.focus(),
              s('cleared', {}, 'info'));
          } else
            e.key.length === 1 &&
              /[\p{L}\p{M}\p{N}]/u.test(e.key) &&
              (e.preventDefault(), $(e.key));
      },
      i = JSON.parse(C.querySelector('[data-tool-copy]').textContent),
      u = C.querySelector('[data-crossword-grid]'),
      d = C.querySelector('[data-across-clues]'),
      r = C.querySelector('[data-down-clues]'),
      a = C.querySelector('[data-entry-answer]'),
      s = (e, t = {}, n = 'success') =>
        G(
          C,
          Object.entries(t).reduce((o, [c, S]) => o.replaceAll(`{${c}}`, String(S)), i.messages[e]),
          n,
        ),
      l,
      m = {},
      E = null,
      f = 0,
      p = new Map();
    (C.addEventListener('keydown', F),
      a.addEventListener('input', () => {
        let e = w();
        e && ((m[e.id] = a.value), y());
      }),
      C.addEventListener('click', (e) => {
        let t = e.target.closest('[data-action]')?.dataset.action;
        if (!t) return;
        if (t === 'newGame') {
          I();
          return;
        }
        let n = w();
        if (!n) {
          s('noSelection', {}, 'error');
          return;
        }
        if (t === 'checkWord') {
          s(
            D(l, m).entries.find((o) => o.id === n.id)?.correct ? 'entryCorrect' : 'entryIncorrect',
            {},
            'info',
          );
          return;
        }
        if (t === 'check') {
          let o = D(l, m);
          (y(),
            s(
              o.correct ? 'puzzleCorrect' : 'puzzleProgress',
              { solved: o.solvedCount, total: l.entries.length },
              o.correct ? 'success' : 'info',
            ));
          return;
        }
        if (t === 'hint') {
          let o = B(n, m[n.id] ?? '');
          if (!o) {
            s('noHint', {}, 'info');
            return;
          }
          let c = b(m[n.id] ?? Array.from({ length: b(n.answer).length }, () => ' ').join(''));
          ((c[o.index] = o.letter),
            (m[n.id] = c.join('').replace(/\s+$/u, '')),
            (f = o.index),
            (a.value = m[n.id]),
            y(),
            p.get(g(n)[f])?.focus(),
            s('hint', { number: n.number }));
          return;
        }
        t === 'reveal' &&
          ((m[n.id] = n.answer),
          (a.value = n.answer),
          y(),
          s('revealed', { number: n.number }, 'info'));
      }),
      I());
  }
})();
