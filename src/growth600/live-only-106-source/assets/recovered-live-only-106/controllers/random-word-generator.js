(() => {
  function x(t = document) {
    let e = t.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function d(t, e, n = 'info') {
    let i = t.querySelector('[data-status]');
    i && ((i.textContent = e), (i.dataset.kind = n));
  }
  var h = class extends RangeError {
    constructor(e) {
      (super(e), (this.name = 'RandomWordInputError'), (this.code = e));
    }
  };
  function R(t) {
    let e = 2166136261;
    for (let n of t) ((e ^= n.codePointAt(0)), (e = Math.imul(e, 16777619)));
    return e >>> 0 || 2654435769;
  }
  function _(t) {
    let e = R(t);
    return () => {
      e += 1831565813;
      let n = e;
      return (
        (n = Math.imul(n ^ (n >>> 15), n | 1)),
        (n ^= n + Math.imul(n ^ (n >>> 7), n | 61)),
        ((n ^ (n >>> 14)) >>> 0) / 4294967296
      );
    };
  }
  function I({
    words: t,
    count: e = 10,
    minLength: n = 1,
    maxLength: i = 64,
    category: c = 'all',
    seed: u = '',
    locale: l = 'en',
  } = {}) {
    if (!Array.isArray(t) || t.length === 0) throw new h('dictionary-unavailable');
    if (!Number.isInteger(e) || e < 1 || e > 100) throw new h('invalid-count');
    if (!Number.isInteger(n) || !Number.isInteger(i) || n < 1 || i > 64 || n > i)
      throw new h('invalid-length-range');
    if (typeof c != 'string' || !c.trim()) throw new h('invalid-category');
    if (typeof u != 'string' || u.length > 80 || /[\u0000-\u001f\u007f]/u.test(u))
      throw new h('invalid-seed');
    if (typeof l != 'string' || !l.trim()) throw new h('invalid-locale');
    let a;
    try {
      [a] = Intl.getCanonicalLocales(l.replaceAll('_', '-'));
    } catch {
      throw new h('invalid-locale');
    }
    let m = [],
      f = new Set();
    for (let p of t) {
      if (!p || typeof p.word != 'string' || typeof p.category != 'string') continue;
      let g = p.word.normalize('NFC').trim(),
        w = p.category.trim();
      if (!g || [...g].length > 64 || !w) continue;
      let o = g.toLocaleLowerCase(a);
      if (f.has(o) || (f.add(o), c !== 'all' && w !== c)) continue;
      let s = [...g].length;
      s >= n && s <= i && m.push(Object.freeze({ word: g, category: w }));
    }
    if (m.length < e) throw new h('not-enough-matches');
    return { pool: m, count: e, category: c, seed: u.trim() };
  }
  function E(t = {}) {
    let { pool: e, count: n, category: i, seed: c } = I(t),
      u = _(c || 'usefulverse-random-word-generator'),
      l = [...e];
    for (let a = l.length - 1; a > 0; a -= 1) {
      let m = Math.floor(u() * (a + 1));
      [l[a], l[m]] = [l[m], l[a]];
    }
    return Object.freeze({
      seed: c,
      category: i,
      words: Object.freeze(l.slice(0, n).map(({ word: a }) => a)),
      available: e.length,
    });
  }
  function S(t = globalThis.crypto) {
    if (!t || typeof t.getRandomValues != 'function') throw new Error('secure-random-unavailable');
    let e = new Uint32Array(2);
    return (t.getRandomValues(e), [...e].map((n) => n.toString(16).padStart(8, '0')).join(''));
  }
  var A = Object.freeze({ maxWords: 100, maxSeedLength: 80, maxWordLength: 64 });
  var r = document.querySelector('[data-tool="random-word-generator"]');
  if (r) {
    let p = function () {
        return a
          ? Promise.resolve(a)
          : (m ||
              (m = import(
                new URL('/assets/recovered-live-only-106/published/assets/vendor/random-word-generator-dictionaries.mjs', location.origin)
                  .href
              ).then(({ RANDOM_WORD_DICTIONARIES: o }) => ((a = o[l] ?? null), a))),
            m);
      },
      g = function () {
        ((f = []), n.replaceChildren(), (i.hidden = !0), (c.disabled = !0), (u.disabled = !0));
      },
      t = x(r),
      e = r.querySelector('#tool-form'),
      n = r.querySelector('[data-word-results]'),
      i = r.querySelector('[data-result]'),
      c = r.querySelector('[data-action="copy"]'),
      u = r.querySelector('[data-action="download"]'),
      l = document.documentElement.lang,
      a,
      m,
      f = [];
    async function w(o) {
      (o?.preventDefault(), g());
      try {
        let s = await p();
        if (!s) return d(r, t.messages.localeUnavailable, 'error');
        let y = e.elements.namedItem('seed'),
          v = y.value.trim() || S();
        ((y.value = v),
          (f = E({
            words: s,
            category: e.elements.namedItem('category').value,
            minLength: Number(e.elements.namedItem('minLength').value),
            maxLength: Number(e.elements.namedItem('maxLength').value),
            count: Number(e.elements.namedItem('count').value),
            seed: v,
            locale: l,
          }).words),
          n.replaceChildren(
            ...f.map((L) => {
              let b = document.createElement('li');
              return ((b.textContent = L), b);
            }),
          ),
          (i.hidden = !1),
          (c.disabled = !1),
          (u.disabled = !1),
          d(r, t.messages.generated, 'success'));
      } catch (s) {
        s.code === 'not-enough-matches'
          ? d(r, t.messages.notEnoughWords, 'error')
          : s.message === 'secure-random-unavailable'
            ? d(r, t.messages.seedUnavailable, 'error')
            : s.message === 'dictionary-unavailable' || s instanceof TypeError
              ? d(r, t.messages.localeUnavailable, 'error')
              : d(r, t.messages.checkInputs, 'error');
      }
    }
    (e.addEventListener('submit', w),
      e.addEventListener('reset', () =>
        setTimeout(() => {
          (g(), d(r, ''));
        }, 0),
      ),
      e.addEventListener('input', (o) => {
        o.target.matches('input, select') && (g(), d(r, ''));
      }),
      r.querySelector('[data-action="example"]').addEventListener('click', () => {
        let o = t.example;
        ((e.elements.namedItem('category').value = o.category),
          (e.elements.namedItem('minLength').value = String(o.minLength)),
          (e.elements.namedItem('maxLength').value = String(o.maxLength)),
          (e.elements.namedItem('count').value = String(o.count)),
          (e.elements.namedItem('seed').value = ''),
          w());
      }),
      c.addEventListener('click', async () => {
        if (f.length)
          try {
            (await navigator.clipboard.writeText(
              f.join(`
`),
            ),
              d(r, t.messages.copied, 'success'));
          } catch {
            d(r, t.messages.copyUnavailable, 'error');
          }
      }),
      u.addEventListener('click', () => {
        if (!f.length) return;
        let o = URL.createObjectURL(
            new Blob(
              [
                `${f.join(`
`)}
`,
              ],
              { type: 'text/plain;charset=utf-8' },
            ),
          ),
          s = document.createElement('a');
        ((s.href = o),
          (s.download = 'random-words.txt'),
          s.click(),
          setTimeout(() => URL.revokeObjectURL(o), 1e3),
          d(r, t.messages.downloaded, 'success'));
      }),
      g());
  }
})();
