(() => {
  function C(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function g(e, t, n = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = t), (r.dataset.kind = n));
  }
  function S(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  async function E(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), g(e, n.messages.copied, 'success'));
    } catch {
      g(e, n.messages.copyUnavailable, 'error');
    }
  }
  var T = Object.freeze({ characters: 2e5, nodes: 2e4, depth: 64, arrayItems: 5e3 });
  var p = Object.freeze({ characters: 2e5, rows: 5e3, columns: 64, cells: 2e4, depth: T.depth }),
    x = /^[A-Za-z_][A-Za-z0-9_.-]*$/u;
  function i(e) {
    throw Object.assign(new Error(e), { code: e });
  }
  function N(e, t = !1) {
    let n = String(e);
    for (let r of n) {
      let o = r.codePointAt(0);
      o === 9 ||
        o === 10 ||
        o === 13 ||
        (o >= 32 && o <= 55295) ||
        (o >= 57344 && o <= 65533) ||
        (o >= 65536 && o <= 1114111) ||
        i('invalid-xml-character');
    }
    return n
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', t ? '&quot;' : '"')
      .replaceAll("'", t ? '&apos;' : "'");
  }
  function q(e) {
    let t = e.replace(/^[\u0000-\u0020]+/u, '');
    return (
      /^[=+@]/u.test(t) ||
      (t.startsWith('-') && !/^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/iu.test(t))
    );
  }
  function F(e, { protectFormula: t = !0 } = {}) {
    let n = String(e ?? ''),
      r = t && q(n) ? "'" + n : n;
    return /[",\r\n]/u.test(r) ? '"' + r.replaceAll('"', '""') + '"' : r;
  }
  function j(e) {
    return e == null
      ? ''
      : ['string', 'number', 'boolean'].includes(typeof e)
        ? String(e)
        : i('nested-xml-structure');
  }
  function L(e) {
    return [...(e?.getElementsByTagName?.('parsererror') ?? [])].some(
      (t) =>
        t.namespaceURI?.endsWith('mozilla.org/newlayout/xml/parsererror.xml') ||
        t.textContent?.includes('XML Parsing Error:') ||
        t.textContent?.includes('This page contains the following errors:'),
    );
  }
  function b(e) {
    return [...(e.childNodes ?? [])].filter((t) => t.nodeType === 1);
  }
  function $(e) {
    return [...(e.childNodes ?? [])]
      .filter((t) => t.nodeType === 3 || t.nodeType === 4)
      .map((t) => t.nodeValue ?? t.textContent ?? '')
      .join('');
  }
  function X(e) {
    let t = [{ element: e, depth: 0 }],
      n = 0;
    for (; t.length;) {
      let { element: r, depth: o } = t.pop();
      ((n += 1),
        n > T.nodes && i('too-many-nodes'),
        o > p.depth && i('too-deep'),
        x.test(r.nodeName) || i('invalid-xml-name'));
      for (let d of [...(r.attributes ?? [])]) x.test(d.name) || i('invalid-xml-name');
      for (let d of b(r)) t.push({ element: d, depth: o + 1 });
    }
  }
  function A(e) {
    let t = b(e),
      n = $(e);
    t.length && n.trim() && i('mixed-xml-content');
    let r = {};
    for (let o of [...(e.attributes ?? [])]) r[`@${o.name}`] = o.value;
    n && !t.length && (r['#text'] = n);
    for (let o of t) {
      (b(o).length || [...(o.attributes ?? [])].length) && i('nested-xml-structure');
      let d = $(o);
      (Object.hasOwn(r, o.nodeName) && i('repeated-fields-unsupported'),
        Object.defineProperty(r, o.nodeName, {
          value: d,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        }));
    }
    return r;
  }
  function _(e) {
    let t = b(e),
      n = t.map((c) => c.nodeName),
      r = n.length > 0 && n.every((c) => c === n[0]),
      o = t.some((c) => b(c).length || [...(c.attributes ?? [])].length);
    return (
      r && t.length > 1 && !o && i('xml-ambiguous-records'),
      r && o
        ? (([...(e.attributes ?? [])].length || $(e).trim()) && i('xml-root-metadata-unsupported'),
          { rootName: e.nodeName, recordName: n[0], records: t.map(A) })
        : (o && i('xml-ambiguous-records'),
          { rootName: e.nodeName, recordName: e.nodeName, records: [A(e)] })
    );
  }
  function I(e, { DOMParserImpl: t = globalThis.DOMParser } = {}) {
    ((typeof e != 'string' || !e.trim()) && i('empty-input'),
      e.length > p.characters && i('too-large'),
      /<!\s*(?:DOCTYPE|ENTITY)\b/iu.test(e) && i('doctype-blocked'),
      typeof t != 'function' && i('xml-parser-unavailable'));
    let n = new t().parseFromString(e, 'application/xml');
    L(n) && i('invalid-xml');
    let r = n?.documentElement;
    ((!r || r.nodeType !== 1) && i('invalid-xml'), X(r));
    let { rootName: o, recordName: d, records: c } = _(r);
    c.length > p.rows && i('too-many-rows');
    let f = [],
      a = new Set();
    for (let m of c)
      for (let s of Object.keys(m))
        s === '#text' || s.startsWith('@')
          ? a.has(s) || (a.add(s), f.push(s))
          : x.test(s) && !a.has(s)
            ? (a.add(s), f.push(s))
            : x.test(s) || i('invalid-xml-name');
    f.length > p.columns && i('too-many-columns');
    let l = [f, ...c.map((m) => f.map((s) => (Object.hasOwn(m, s) ? j(m[s]) : '')))];
    l.length * Math.max(1, f.length) > p.cells && i('too-many-cells');
    let h = l.map((m, s) => m.map((v) => F(v, { protectFormula: s !== 0 })).join(',')).join(`\r
`);
    return Object.freeze({
      csv: h,
      columns: Object.freeze(f),
      rowCount: c.length,
      rootName: o,
      recordName: d,
    });
  }
  function k(e) {
    ((typeof e != 'string' || !e.trim()) && i('empty-input'),
      e.length > p.characters && i('too-large'));
    let t = [],
      n = [],
      r = '',
      o = !1,
      d = !1;
    for (let a = 0; a < e.length; a += 1) {
      let l = e[a];
      o
        ? l === '"' && e[a + 1] === '"'
          ? ((r += '"'), (a += 1))
          : l === '"'
            ? ((o = !1), (d = !0))
            : (r += l)
        : d &&
            l !== ',' &&
            l !==
              `
` &&
            l !== '\r'
          ? i('invalid-csv')
          : l === '"'
            ? (r && i('invalid-csv'), (o = !0))
            : l === ','
              ? (n.push(r), (r = ''), (d = !1))
              : l ===
                    `
` || l === '\r'
                ? (l === '\r' &&
                    e[a + 1] ===
                      `
` &&
                    (a += 1),
                  n.push(r),
                  (r = ''),
                  (n.some((h) => h !== '') || t.length) && t.push(n),
                  (n = []),
                  (d = !1),
                  t.length > p.rows + 1 && i('too-many-rows'))
                : (r += l);
    }
    for (
      o && i('invalid-csv'), n.push(r), (n.some((a) => a !== '') || !t.length) && t.push(n);
      t.at(-1)?.every((a) => a === '');
    )
      t.pop();
    t.length || i('empty-input');
    let [c, ...f] = t;
    return (
      (!c.length ||
        c.length > p.columns ||
        c.some((a) => !x.test(a) && a !== '#text' && !(a.startsWith('@') && x.test(a.slice(1))))) &&
        i('invalid-headers'),
      new Set(c).size !== c.length && i('duplicate-headers'),
      f.some((a) => a.length !== c.length) && i('row-width'),
      (f.length > p.rows || (f.length + 1) * c.length > p.cells) && i('too-many-rows'),
      Object.freeze({
        headers: Object.freeze(c),
        rows: Object.freeze(f.map((a) => Object.freeze(a))),
      })
    );
  }
  function w(e) {
    return ((typeof e != 'string' || !x.test(e)) && i('invalid-xml-name'), e);
  }
  function O(e, { rootName: t = 'rows', recordName: n = 'row' } = {}) {
    let { headers: r, rows: o } = k(e);
    (w(t), w(n));
    let d = o.map((f) => {
        let a = [],
          l = [],
          h = '';
        return (
          r.forEach((s, v) => {
            let y = f[v];
            s.startsWith('@')
              ? a.push(`${w(s.slice(1))}="${N(y, !0)}"`)
              : s === '#text'
                ? (h = N(y))
                : l.push(`<${w(s)}>${N(y)}</${s}>`);
          }),
          `${`<${n}${a.length ? ` ${a.join(' ')}` : ''}>`}${h}${l.join('')}</${n}>`
        );
      }).join(`
  `),
      c = `<?xml version="1.0" encoding="UTF-8"?>
<${t}>${
        d
          ? `
  ${d}
`
          : ''
      }</${t}>`;
    return (c.length > p.characters * 5 && i('output-too-large'), c);
  }
  var u = document.querySelector('[data-tool="xml-to-csv-converter"]');
  if (u) {
    let h = function () {
        (S(u), (a.value = ''), (l = ''));
      },
      m = function () {
        let s = n.value === 'xmlToCsv';
        ((d.hidden = !s),
          (c.hidden = s),
          (f.hidden = s),
          (r.disabled = !s),
          (r.required = s),
          (o.disabled = s),
          (o.required = !s),
          h(),
          g(u, ''));
      },
      e = u.querySelector('#tool-form'),
      t = C(u),
      n = e.elements.namedItem('mode'),
      r = e.elements.namedItem('xmlInput'),
      o = e.elements.namedItem('csvInput'),
      d = u.querySelector('[data-xml-input]'),
      c = u.querySelector('[data-csv-input]'),
      f = u.querySelector('[data-xml-names]'),
      a = u.querySelector('[data-xml-csv-output]'),
      l = '';
    (e.addEventListener('submit', (s) => {
      (s.preventDefault(), h());
      try {
        ((l =
          n.value === 'xmlToCsv'
            ? I(r.value).csv
            : O(o.value, {
                rootName: e.elements.namedItem('rootName').value || 'rows',
                recordName: e.elements.namedItem('recordName').value || 'row',
              })),
          (a.value = l),
          (u.querySelector('[data-result]').hidden = !1),
          g(u, t.messages.converted, 'success'));
      } catch (v) {
        g(u, t.messages[v.code ?? v.message] ?? t.messages.invalid, 'error');
      }
    }),
      e.addEventListener('input', () => {
        (h(), g(u, ''));
      }),
      n.addEventListener('change', m),
      e.addEventListener('reset', () =>
        queueMicrotask(() => {
          ((n.value = 'xmlToCsv'),
            (e.elements.namedItem('rootName').value = 'rows'),
            (e.elements.namedItem('recordName').value = 'row'),
            (r.value = t.exampleXml),
            (o.value = t.exampleCsv),
            m());
        }),
      ),
      u.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        (n.value === 'xmlToCsv' ? (r.value = t.exampleXml) : (o.value = t.exampleCsv),
          e.requestSubmit());
      }),
      u.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        l ? E(u, l, t) : g(u, t.messages.invalid, 'error');
      }),
      u.querySelector('[data-action="download"]')?.addEventListener('click', () => {
        if (!l) return g(u, t.messages.invalid, 'error');
        let s = n.value === 'xmlToCsv',
          v = URL.createObjectURL(
            new Blob([l], { type: s ? 'text/csv;charset=utf-8' : 'application/xml;charset=utf-8' }),
          ),
          y = document.createElement('a');
        ((y.href = v),
          (y.download = s ? 'converted.csv' : 'converted.xml'),
          y.click(),
          setTimeout(() => URL.revokeObjectURL(v), 1e3),
          g(u, t.messages.downloaded, 'success'));
      }),
      m(),
      (r.value = t.exampleXml),
      (o.value = t.exampleCsv));
  }
})();
