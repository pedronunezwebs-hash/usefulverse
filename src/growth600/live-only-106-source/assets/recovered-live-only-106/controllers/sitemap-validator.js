(() => {
  function I(t = document) {
    let e = t.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function v(t, e, o = 'info') {
    let r = t.querySelector('[data-status]');
    r && ((r.textContent = e), (r.dataset.kind = o));
  }
  function U(t) {
    let e = t.querySelector('[data-result]'),
      o = t.querySelector('[data-result-content]');
    (e && (e.hidden = !0), o && o.replaceChildren());
  }
  var y = Object.freeze({
      characters: 1e6,
      entries: 5e3,
      nodes: 3e4,
      depth: 8,
      urlCharacters: 2048,
      issues: 200,
    }),
    q = 'http://www.sitemaps.org/schemas/sitemap/0.9',
    R = new Set(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']);
  function p(t) {
    throw Object.assign(new Error(t), { code: t });
  }
  function x(t) {
    return [...(t?.childNodes ?? [])].filter((e) => e.nodeType === 1);
  }
  function _(t) {
    return [...(t?.getElementsByTagName?.('parsererror') ?? [])];
  }
  function $(t) {
    return _(t).length > 0;
  }
  function C(t) {
    return String(t?.localName ?? t?.nodeName ?? '')
      .split(':')
      .at(-1);
  }
  function w(t) {
    return [...(t?.childNodes ?? [])]
      .filter((e) => e.nodeType === 3 || e.nodeType === 4)
      .map((e) => e.nodeValue ?? e.textContent ?? '')
      .join('')
      .trim();
  }
  function D(t) {
    if (/^\d{4}-\d{2}-\d{2}$/u.test(t)) {
      let [S, N, E] = t.split('-').map(Number),
        T = new Date(Date.UTC(S, N - 1, E));
      return T.getUTCFullYear() === S && T.getUTCMonth() === N - 1 && T.getUTCDate() === E;
    }
    let e =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-](\d{2}):(\d{2}))$/iu.exec(
        t,
      );
    if (!e) return !1;
    let [, o, r, d, s, m, i, a, f, c] = e,
      n = Number(o),
      l = Number(r),
      g = Number(d),
      b = new Date(Date.UTC(n, l - 1, g));
    return (
      b.getUTCFullYear() === n &&
      b.getUTCMonth() === l - 1 &&
      b.getUTCDate() === g &&
      Number(s) <= 23 &&
      Number(m) <= 59 &&
      Number(i) <= 59 &&
      (a === 'Z' || (Number(f) <= 23 && Number(c) <= 59))
    );
  }
  function k(t) {
    if (!t) return 'missing-loc';
    if (t.length > y.urlCharacters) return 'url-too-long';
    let e;
    try {
      e = new URL(t);
    } catch {
      return 'invalid-url';
    }
    return !['http:', 'https:'].includes(e.protocol) || !e.hostname
      ? 'invalid-url'
      : e.username || e.password
        ? 'url-credentials'
        : e.hash
          ? 'url-fragment'
          : null;
  }
  function u(t, e, o, r) {
    t.length < y.issues && t.push(Object.freeze({ severity: e, code: o, entry: r }));
  }
  function F(t, e, o, r, d) {
    let s = e === 'urlset' ? 'url' : 'sitemap',
      m = x(t);
    C(t) !== s && u(r, 'error', 'unexpected-entry', o + 1);
    let i = new Map();
    for (let n of m) {
      let l = C(n);
      (i.has(l) || i.set(l, []),
        i.get(l).push(n),
        n.namespaceURI && n.namespaceURI !== q && u(r, 'error', 'invalid-child-namespace', o + 1));
    }
    for (let [n, l] of i)
      l.length > 1 && u(r, 'error', n === 'loc' ? 'duplicate-loc-field' : 'duplicate-field', o + 1);
    let a = w(i.get('loc')?.[0]),
      f = k(a);
    if (f) u(r, 'error', f, o + 1);
    else {
      let n;
      try {
        n = new URL(a).href;
      } catch {
        n = a;
      }
      d.has(n) ? u(r, 'error', 'duplicate-url', o + 1) : d.add(n);
    }
    let c = i.get('lastmod') ?? [];
    if ((c.length && !D(w(c[0])) && u(r, 'error', 'invalid-lastmod', o + 1), e === 'urlset')) {
      let n = i.get('changefreq') ?? [];
      n.length && !R.has(w(n[0]).toLowerCase()) && u(r, 'error', 'invalid-changefreq', o + 1);
      let l = i.get('priority') ?? [];
      if (l.length) {
        let g = w(l[0]);
        /^(?:0(?:\.\d+)?|1(?:\.0+)?)$/u.test(g) || u(r, 'error', 'invalid-priority', o + 1);
      }
    }
    for (let n of i.keys())
      (e === 'urlset'
        ? new Set(['loc', 'lastmod', 'changefreq', 'priority'])
        : new Set(['loc', 'lastmod'])
      ).has(n) || u(r, 'warning', 'unknown-field', o + 1);
  }
  function L(t, { DOMParserImpl: e = globalThis.DOMParser } = {}) {
    ((typeof t != 'string' || !t.trim()) && p('empty-input'),
      t.length > y.characters && p('input-too-large'),
      /<!\s*(?:DOCTYPE|ENTITY)\b/iu.test(t) && p('doctype-blocked'),
      typeof e != 'function' && p('xml-parser-unavailable'));
    let o = new e().parseFromString(t, 'application/xml');
    $(o) && p('invalid-xml');
    let r = o?.documentElement;
    (!r || r.nodeType !== 1) && p('invalid-xml');
    let d = C(r);
    ['urlset', 'sitemapindex'].includes(d) || p('invalid-root');
    let s = [];
    r.namespaceURI && r.namespaceURI !== q
      ? u(s, 'error', 'invalid-namespace', 0)
      : r.namespaceURI || u(s, 'warning', 'missing-namespace', 0);
    let m = [{ node: r, depth: 0 }],
      i = 0;
    for (; m.length;) {
      let c = m.pop();
      ((i += 1), i > y.nodes && p('too-many-nodes'), c.depth > y.depth && p('too-deep'));
      for (let n of x(c.node)) m.push({ node: n, depth: c.depth + 1 });
    }
    let a = x(r);
    (a.length || u(s, 'warning', 'no-entries', 0), a.length > y.entries && p('too-many-entries'));
    let f = new Set();
    return (
      a.forEach((c, n) => F(c, d, n, s, f)),
      Object.freeze({
        kind: d,
        entryCount: a.length,
        valid: !s.some(({ severity: c }) => c === 'error'),
        issues: Object.freeze(s),
        truncatedIssues: s.length >= y.issues,
      })
    );
  }
  var h = document.querySelector('[data-tool="sitemap-validator"]');
  if (h) {
    let m = function () {
        (U(h), (r.hidden = !0), (d.textContent = ''), s.replaceChildren());
      },
      i = function (a) {
        let f = new Intl.NumberFormat(e.copyLanguage.replace('_', '-')),
          c = a.valid ? e.fields.validLabel : e.fields.invalidLabel;
        if (
          ((d.textContent = `${c} \xB7 ${a.kind} \xB7 ${f.format(a.entryCount)} ${e.fields.entryLabel}`),
          a.issues.length)
        ) {
          for (let n of a.issues) {
            let l = document.createElement('li');
            ((l.textContent = `${e.messages[n.code] ?? n.code}${n.entry ? ` (${e.fields.entryLabel} ${f.format(n.entry)})` : ''}`),
              (l.dataset.severity = n.severity),
              s.append(l));
          }
          if (a.truncatedIssues) {
            let n = document.createElement('li');
            ((n.textContent = e.messages['issues-truncated']), s.append(n));
          }
        } else {
          let n = document.createElement('li');
          ((n.textContent = e.fields.noIssues), s.append(n));
        }
        ((r.hidden = !1),
          v(
            h,
            a.valid ? e.messages.validated : e.messages['validation-failed'],
            a.valid ? 'success' : 'error',
          ));
      },
      t = h.querySelector('#tool-form'),
      e = I(h),
      o = t.elements.namedItem('xmlInput'),
      r = h.querySelector('[data-result]'),
      d = h.querySelector('[data-sitemap-summary]'),
      s = h.querySelector('[data-sitemap-issues]');
    (t.addEventListener('submit', (a) => {
      (a.preventDefault(), m());
      try {
        i(L(o.value));
      } catch (f) {
        let c = f.code ?? 'invalid-xml';
        v(h, e.messages[c] ?? e.messages.invalid, 'error');
      }
    }),
      h.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((o.value = e.exampleText), t.requestSubmit());
      }),
      t.addEventListener('reset', () => queueMicrotask(m)),
      o.addEventListener('input', m));
  }
})();
