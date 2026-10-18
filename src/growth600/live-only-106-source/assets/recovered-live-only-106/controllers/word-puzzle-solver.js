(() => {
  function E(t, e, n = 'info') {
    let l = t.querySelector('[data-status]');
    l && ((l.textContent = e), (l.dataset.kind = n));
  }
  var p = Object.freeze({ queryLength: 32, customListChars: 25e4, customWords: 5e4, results: 500 }),
    d = class extends RangeError {
      constructor(e) {
        (super(e), (this.name = 'WordPuzzleInputError'), (this.code = e));
      }
    };
  function N(t) {
    try {
      return Intl.getCanonicalLocales(String(t ?? 'en').replaceAll('_', '-'))[0];
    } catch {
      throw new d('invalid-locale');
    }
  }
  function y(t, e) {
    let n = String(t).normalize('NFC').toLocaleLowerCase(e);
    return typeof Intl.Segmenter == 'function'
      ? [...new Intl.Segmenter(e, { granularity: 'grapheme' }).segment(n)].map(
          ({ segment: l }) => l,
        )
      : Array.from(n);
  }
  function z(t, e) {
    let n = String(t ?? '')
      .normalize('NFC')
      .trim();
    return !n ||
      Array.from(n).length > p.queryLength ||
      !/[\p{L}]/u.test(n) ||
      /[^\p{L}\p{M}]/u.test(n)
      ? null
      : { word: n, key: y(n, e).join('') };
  }
  function A(t, e = 'en') {
    let n = N(e);
    if (typeof t != 'string' || t.length > p.customListChars) throw new d('list-too-large');
    let l = [],
      i = new Set(),
      c = 0;
    for (let o of t.split(/\r?\n/u)) {
      let f = z(o, n);
      if (!f) {
        o.trim() && (c += 1);
        continue;
      }
      if (!i.has(f.key) && (i.add(f.key), l.push(f.word), l.length > p.customWords))
        throw new d('too-many-words');
    }
    return Object.freeze({ words: Object.freeze(l), ignored: c });
  }
  function M(t, e) {
    if (!Array.isArray(t) || t.length === 0) throw new d('dictionary-unavailable');
    let n = [],
      l = new Set();
    for (let i of t) {
      let c = typeof i == 'string' ? i : i?.word,
        o = z(c, e);
      if (!(!o || l.has(o.key)) && (l.add(o.key), n.push(o), n.length >= p.customWords)) break;
    }
    if (!n.length) throw new d('dictionary-unavailable');
    return n;
  }
  function W(t, e) {
    let n = String(t ?? '')
      .normalize('NFC')
      .trim();
    if (n.length > p.queryLength || /[^\p{L}\p{M}\s]/u.test(n)) throw new d('invalid-excluded');
    return new Set(y(n.replace(/\s/gu, ''), e));
  }
  function j(t, e, n, l) {
    let i = y(t, l),
      c = new Map(),
      o = 0;
    for (let h of e) h === '?' ? (o += 1) : c.set(h, (c.get(h) ?? 0) + 1);
    if ((n && i.length !== e.length) || i.length > e.length) return !1;
    let f = 0;
    for (let h of i) {
      let b = c.get(h) ?? 0;
      if ((b ? c.set(h, b - 1) : (f += 1), f > o)) return !1;
    }
    return !0;
  }
  function F(t, e, n) {
    let l = y(t, n);
    return l.length !== e.length ? !1 : e.every((i, c) => i === '?' || i === '.' || i === l[c]);
  }
  function I({
    mode: t = 'anagram',
    letters: e = '',
    pattern: n = '',
    dictionary: l,
    customWords: i = '',
    includeBuiltIn: c = !0,
    minLength: o = 2,
    maxLength: f = 32,
    excluded: h = '',
    mustUseAll: b = !1,
    locale: L = 'en',
    resultLimit: r = p.results,
  } = {}) {
    let a = N(L);
    if (!['anagram', 'pattern'].includes(t)) throw new d('invalid-mode');
    if (!Number.isInteger(o) || !Number.isInteger(f) || o < 1 || f > p.queryLength || o > f)
      throw new d('invalid-length-range');
    if (!Number.isInteger(r) || r < 1 || r > p.results) throw new d('invalid-result-limit');
    let u = String(t === 'pattern' ? n : e)
      .normalize('NFC')
      .trim();
    if (!u || Array.from(u).length > p.queryLength) throw new d('invalid-query');
    let g = y(u, a);
    if (t === 'anagram' ? /[^\p{L}?]/u.test(u) : /[^\p{L}?.]/u.test(u))
      throw new d('invalid-query');
    if (t === 'anagram' && !g.some((s) => s !== '?')) throw new d('invalid-query');
    if (t === 'pattern' && g.every((s) => s === '?' || s === '.')) throw new d('invalid-query');
    let v = W(h, a),
      w = c ? M(l, a) : [],
      S = i.trim() ? A(i, a).words.map((s) => z(s, a)) : [];
    if (!w.length && !S.length) throw new d('dictionary-unavailable');
    let C = new Map();
    for (let s of [...w, ...S]) s && !C.has(s.key) && C.set(s.key, s);
    let x = [];
    for (let s of C.values()) {
      let q = y(s.word, a).length;
      q < o ||
        q > f ||
        (v.size && y(s.word, a).some((k) => v.has(k))) ||
        ((t === 'anagram' ? j(s.word, g, b, a) : F(s.word, g, a)) && x.push(s.word));
    }
    return (
      x.sort((s, q) => y(q, a).length - y(s, a).length || s.localeCompare(q, a)),
      Object.freeze({
        mode: t,
        query: u,
        matches: Object.freeze(x.slice(0, r)),
        totalMatches: x.length,
        truncated: x.length > r,
        customWordCount: S.length,
        builtInWordCount: w.length,
      })
    );
  }
  var m = document.querySelector('[data-tool="word-puzzle-solver"]');
  if (m) {
    let f = function () {
        return l
          ? Promise.resolve(l)
          : (i ||
              (i = fetch(
                new URL('/assets/recovered-live-only-106/published/assets/vendor/random-word-generator-dictionaries.json', location.origin),
                { credentials: 'same-origin' },
              )
                .then((r) => {
                  if (!r.ok) throw new Error('dictionary-load-failed');
                  return r.json();
                })
                .then((r) => ((l = r[n] ?? null), l))
                .catch(() => null)),
            i);
      },
      h = function () {
        let r = e.elements.mode.value === 'pattern';
        ((m.querySelector('[data-word-letters]').hidden = r),
          (m.querySelector('[data-word-pattern]').hidden = !r));
      },
      b = function (r) {
        let a = m.querySelector('[data-word-results]'),
          u = m.querySelector('[data-word-list]');
        (u.replaceChildren(),
          r.matches.forEach((g) => {
            let v = document.createElement('li'),
              w = document.createElement('span'),
              S = document.createElement('span');
            ((w.textContent = g),
              (S.textContent = String(Array.from(g).length)),
              v.append(w, S),
              u.append(v));
          }),
          (m.querySelector('[data-word-count]').textContent = t.fields.resultCount.replace(
            '{count}',
            String(r.totalMatches),
          )),
          (m.querySelector('[data-word-truncated]').hidden = !r.truncated),
          r.truncated &&
            (m.querySelector('[data-word-truncated]').textContent = t.fields.truncated.replace(
              '{count}',
              String(r.matches.length),
            )),
          (c = [...r.matches]),
          (m.querySelector('[data-action="copy"]').disabled = c.length === 0),
          (a.hidden = !1));
      },
      t = JSON.parse(m.querySelector('[data-tool-copy]').textContent),
      e = m.querySelector('[data-word-form]'),
      n = (document.documentElement.lang || 'en').toLowerCase().replaceAll('-', '_'),
      l,
      i,
      c = [],
      o = (r, a = {}, u = 'success') =>
        E(
          m,
          Object.entries(a).reduce((g, [v, w]) => g.replaceAll(`{${v}}`, String(w)), t.messages[r]),
          u,
        );
    async function L() {
      let r = e.elements.source.value,
        a = null;
      if (r !== 'custom' && (o('dictionaryLoading', {}, 'info'), (a = await f()), !a)) {
        o('dictionaryUnavailable', {}, 'error');
        return;
      }
      try {
        let u = I({
          mode: e.elements.mode.value,
          letters: e.elements.letters.value,
          pattern: e.elements.pattern.value,
          dictionary: a,
          includeBuiltIn: r !== 'custom',
          customWords: r === 'builtin' ? '' : e.elements.wordList.value,
          minLength: Number(e.elements.minLength.value),
          maxLength: Number(e.elements.maxLength.value),
          excluded: e.elements.excluded.value,
          mustUseAll: e.elements.mustUseAll.checked,
          locale: n,
          resultLimit: Number(e.elements.resultLimit.value),
        });
        (b(u),
          u.totalMatches ? o('solved', { count: u.totalMatches }) : o('noResults', {}, 'info'));
      } catch (u) {
        let g =
          u instanceof d
            ? ({
                'invalid-query': 'invalidQuery',
                'invalid-length-range': 'invalidFilters',
                'invalid-excluded': 'invalidFilters',
                'list-too-large': 'listTooLarge',
                'too-many-words': 'tooManyWords',
                'dictionary-unavailable': 'dictionaryUnavailable',
              }[u.code] ?? 'invalidQuery')
            : 'invalidQuery';
        o(g, {}, 'error');
      }
    }
    (e.addEventListener('submit', (r) => {
      (r.preventDefault(), L());
    }),
      e.elements.mode.addEventListener('change', h),
      m.addEventListener('click', async (r) => {
        let a = r.target.closest('[data-action]');
        if (
          a &&
          (a.dataset.action === 'example' &&
            (e.reset(),
            (e.elements.mode.value = 'anagram'),
            (e.elements.source.value = 'custom'),
            (e.elements.letters.value = 'listen'),
            (e.elements.minLength.value = '3'),
            (e.elements.maxLength.value = '6'),
            (e.elements.mustUseAll.checked = !0),
            (e.elements.wordList.value = `listen
silent
enlist
tinsel
stone
`),
            h(),
            (m.querySelector('[data-word-results]').hidden = !0),
            (c = []),
            o('exampleLoaded')),
          a.dataset.action === 'clear' &&
            (e.reset(),
            h(),
            (m.querySelector('[data-word-results]').hidden = !0),
            (c = []),
            (m.querySelector('[data-action="copy"]').disabled = !0),
            o('ready')),
          a.dataset.action === 'copy')
        )
          try {
            (await navigator.clipboard.writeText(
              c.join(`
`),
            ),
              o('copied'));
          } catch {
            o('copyFailed', {}, 'error');
          }
      }),
      h(),
      o('ready'));
  }
})();
