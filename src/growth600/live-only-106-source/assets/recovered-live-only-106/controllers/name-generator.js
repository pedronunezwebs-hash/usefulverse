(() => {
  var T = [
      'br',
      'c',
      'd',
      'dr',
      'f',
      'g',
      'gr',
      'k',
      'l',
      'm',
      'n',
      'r',
      's',
      'sh',
      'th',
      'v',
      'w',
      'z',
    ],
    R = ['a', 'ae', 'e', 'ia', 'i', 'o', 'ou', 'u'],
    C = ['', 'n', 'r', 's', 'th', 'l', 'm'],
    N = [
      'bright',
      'calm',
      'clear',
      'clever',
      'ember',
      'fresh',
      'golden',
      'kind',
      'little',
      'northern',
      'open',
      'swift',
      'true',
      'wild',
    ],
    b = [
      'anchor',
      'arc',
      'bloom',
      'bridge',
      'field',
      'forge',
      'grove',
      'harbor',
      'maple',
      'meadow',
      'orbit',
      'path',
      'signal',
      'spark',
      'stone',
      'summit',
      'thread',
      'willow',
    ],
    $ = ['co', 'collective', 'company', 'craft', 'works', 'studio', 'supply', 'house', 'lab'],
    M = [
      'amber',
      'blue',
      'comet',
      'copper',
      'dawn',
      'echo',
      'fern',
      'fox',
      'jade',
      'lunar',
      'moss',
      'nova',
      'pixel',
      'river',
      'solar',
      'sparrow',
      'violet',
      'wolf',
    ],
    h = class extends RangeError {
      constructor(e) {
        (super(e), (this.name = 'NameGeneratorInputError'), (this.code = e));
      }
    };
  function k(n) {
    let e = 2166136261;
    for (let t of n) ((e ^= t.codePointAt(0)), (e = Math.imul(e, 16777619)));
    return e >>> 0 || 2654435769;
  }
  function q(n) {
    let e = k(n);
    return () => {
      e += 1831565813;
      let t = e;
      return (
        (t = Math.imul(t ^ (t >>> 15), t | 1)),
        (t ^= t + Math.imul(t ^ (t >>> 7), t | 61)),
        ((t ^ (t >>> 14)) >>> 0) / 4294967296
      );
    };
  }
  function l(n, e) {
    return n[Math.floor(e() * n.length)];
  }
  function D({ type: n = 'fantasy', count: e = 10, keyword: t = '', seed: r } = {}) {
    if (!['fantasy', 'business', 'username'].includes(n)) throw new h('invalid-type');
    if (!Number.isInteger(e) || e < 1 || e > 20) throw new h('invalid-count');
    if (typeof t != 'string' || t.trim().length > 40 || /[\u0000-\u001f\u007f]/u.test(t))
      throw new h('invalid-keyword');
    if (typeof r != 'string' || !r.trim() || r.length > 80 || /[\u0000-\u001f\u007f]/u.test(r))
      throw new h('invalid-seed');
    return { type: n, count: e, keyword: t.trim().replace(/\s+/gu, ' '), seed: r.trim() };
  }
  function U(n) {
    let e = () => `${l(T, n)}${l(R, n)}${l(C, n)}`,
      t = `${e()}${e()}`;
    return `${t[0].toLocaleUpperCase()}${t.slice(1)}`;
  }
  function O(n, e, t, r) {
    if (n === 'fantasy') return U(t);
    if (n === 'business') {
      let s = e ? `${e} ` : '',
        f = Math.floor(t() * 3);
      return f === 0
        ? `${s}${l(N, t)} ${l(b, t)}`.trim()
        : f === 1
          ? `${s}${l(b, t)} ${l($, t)}`.trim()
          : `${s}${l(N, t)} ${l(b, t)} ${l($, t)}`.trim();
    }
    let i = l(M, t),
      a = Math.floor(t() * 3),
      u = e ? `${e.replace(/\s+/gu, '')}` : '';
    return a === 0
      ? `${u}${i}`
      : a === 1
        ? `${i}${u}`
        : `${u}${i}${String(10 + Math.floor(t() * 990))}`;
  }
  function A(n = {}) {
    let e = D(n),
      t = q(e.seed),
      r = [],
      i = new Set(),
      a = e.count * 100;
    for (let u = 0; u < a && r.length < e.count; u += 1) {
      let s = O(e.type, e.keyword, t, r.length);
      e.type === 'username' && s.length > 24 && (s = s.slice(0, 24));
      let f = s.toLocaleLowerCase();
      !s || i.has(f) || (i.add(f), r.push(s));
    }
    return { type: e.type, seed: e.seed, names: r };
  }
  function v(n = globalThis.crypto) {
    if (!n || typeof n.getRandomValues != 'function') throw new Error('secure-random-unavailable');
    let e = new Uint32Array(2);
    return (n.getRandomValues(e), [...e].map((t) => t.toString(16).padStart(8, '0')).join(''));
  }
  function _(n = document) {
    let e = n.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function d(n, e, t = 'info') {
    let r = n.querySelector('[data-status]');
    r && ((r.textContent = e), (r.dataset.kind = t));
  }
  var o = document.querySelector('[data-tool="name-generator"]');
  if (o) {
    let g = function () {
        s.replaceChildren();
        for (let m of c?.names ?? []) {
          let p = document.createElement('li');
          ((p.textContent = m), s.append(p));
        }
        ((f.textContent = `${n.fields.seed}: ${c?.seed ?? ''}`),
          (u.hidden = !c),
          (w.disabled = !c?.names.length),
          (S.disabled = !c?.names.length));
      },
      x = function () {
        try {
          return (
            a.value.trim() || (a.value = v()),
            (c = A({ type: t.value, count: Number(r.value), keyword: i.value, seed: a.value })),
            g(),
            d(o, n.messages.generated.replace('{count}', String(c.names.length)), 'success'),
            !0
          );
        } catch (m) {
          ((c = null), g());
          let p =
            m.message === 'secure-random-unavailable'
              ? n.messages.seedUnavailable
              : n.messages.checkInputs;
          return (d(o, p, 'error'), !1);
        }
      },
      L = function (m) {
        if (!c?.names.length) return;
        let p = new Blob(
            [
              c.names.join(`
`),
            ],
            { type: 'text/plain;charset=utf-8' },
          ),
          E = URL.createObjectURL(p),
          y = document.createElement('a');
        ((y.href = E), (y.download = m), y.click(), setTimeout(() => URL.revokeObjectURL(E), 1e3));
      },
      n = _(o),
      e = o.querySelector('#tool-form'),
      t = e.elements.type,
      r = e.elements.count,
      i = e.elements.keyword,
      a = e.elements.seed,
      u = o.querySelector('[data-result]'),
      s = o.querySelector('[data-name-results]'),
      f = o.querySelector('[data-name-seed]'),
      w = o.querySelector('[data-action="copy"]'),
      S = o.querySelector('[data-action="download"]'),
      c = null;
    (e.addEventListener('submit', (m) => {
      (m.preventDefault(), x());
    }),
      e.addEventListener('reset', () => {
        ((c = null),
          setTimeout(() => {
            ((t.value = 'fantasy'), (r.value = '10'), (i.value = ''));
            try {
              a.value = v();
            } catch {
              a.value = '';
            }
            (g(), d(o, '', 'info'));
          }, 0));
      }),
      o.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.value = 'business'),
          (r.value = '10'),
          (i.value = 'Copper & Pine'),
          (a.value = 'example-brand-2026'),
          x(),
          d(o, n.messages.exampleLoaded, 'info'));
      }),
      w.addEventListener('click', async () => {
        if (c?.names.length)
          try {
            (await navigator.clipboard.writeText(
              c.names.join(`
`),
            ),
              d(o, n.messages.copied, 'success'));
          } catch {
            d(o, n.messages.copyUnavailable, 'error');
          }
      }),
      S.addEventListener('click', () => {
        (L('usefulverse-name-ideas.txt'), d(o, n.messages.downloaded, 'success'));
      }));
    try {
      a.value = v();
    } catch {
      a.value = '';
    }
    g();
  }
})();
