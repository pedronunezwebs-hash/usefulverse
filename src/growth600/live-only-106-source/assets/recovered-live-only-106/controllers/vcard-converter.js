(() => {
  function A(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function y(e, t, n = 'info') {
    let o = e.querySelector('[data-status]');
    o && ((o.textContent = t), (o.dataset.kind = n));
  }
  function R(e) {
    let t = e.querySelector('[data-result]'),
      n = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), n && n.replaceChildren());
  }
  async function T(e, t, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), y(e, n.messages.copied, 'success'));
    } catch {
      y(e, n.messages.copyUnavailable, 'error');
    }
  }
  var E = Object.freeze({
      inputBytes: 5242880,
      contacts: 5e3,
      physicalLines: 15e4,
      propertyCharacters: 2e4,
      valuesPerField: 100,
      outputBytes: 20971520,
    }),
    L = Object.freeze([
      'name',
      'givenName',
      'familyName',
      'organization',
      'department',
      'title',
      'phones',
      'emails',
      'websites',
      'street',
      'locality',
      'region',
      'postalCode',
      'country',
      'notes',
    ]),
    x = new TextEncoder(),
    c = (e) => {
      throw Object.assign(new Error(e), { code: e });
    },
    V = 5e3;
  function N(e, t) {
    let n = [],
      o = '',
      a = !1;
    for (let r of e)
      a
        ? ((o += `\\${r}`), (a = !1))
        : r === '\\'
          ? (a = !0)
          : r === t
            ? (n.push(o), (o = ''))
            : (o += r);
    return (a && (o += '\\\\'), n.push(o), n);
  }
  function m(e) {
    return e
      .replace(/\\([nN,;\\])/gu, (t, n) =>
        n === 'n' || n === 'N'
          ? `
`
          : n,
      )
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/gu, '');
  }
  function b(e) {
    let t = e.trim();
    return t.startsWith('"') && t.endsWith('"') ? t.slice(1, -1).replaceAll('\\"', '"') : t;
  }
  function w(e) {
    let t = [],
      n = '',
      o = !1,
      a = !1;
    for (let r of e)
      a
        ? ((n += r), (a = !1))
        : r === '\\'
          ? ((n += r), (a = !0))
          : r === '"'
            ? ((n += r), (o = !o))
            : r === ';' && !o
              ? (t.push(n), (n = ''))
              : (n += r);
    return (o && c('invalid'), t.push(n), t);
  }
  function _(e) {
    let t = -1,
      n = !1,
      o = !1;
    for (let l = 0; l < e.length; l += 1) {
      let g = e[l];
      if (o) {
        o = !1;
        continue;
      }
      if (g === '\\') {
        o = !0;
        continue;
      }
      if (g === '"') n = !n;
      else if (g === ':' && !n) {
        t = l;
        break;
      }
    }
    t <= 0 && c('invalid');
    let [a, ...r] = w(e.slice(0, t)),
      i = a.trim().split('.').at(-1)?.toUpperCase();
    /^[A-Z0-9-]{1,64}$/u.test(i ?? '') || c('invalid');
    let f = new Map();
    for (let l of r) {
      let g = l.indexOf('=');
      if (g < 0) f.set('TYPE', [...(f.get('TYPE') ?? []), b(l).toUpperCase()]);
      else {
        let s = l.slice(0, g).trim().toUpperCase();
        /^[A-Z0-9-]{1,64}$/u.test(s) || c('invalid');
        let v = w(l.slice(g + 1).replaceAll(',', ';')).map((C) => b(C).toUpperCase());
        f.set(s, [...(f.get(s) ?? []), ...v]);
      }
    }
    return (
      (f.get('ENCODING') ?? []).some((l) => ['QUOTED-PRINTABLE', 'QP'].includes(l)) &&
        c('unsupportedEncoding'),
      (f.get('CHARSET') ?? []).some((l) => !['UTF-8', 'UTF8', 'US-ASCII', 'ASCII'].includes(l)) &&
        c('unsupportedEncoding'),
      { name: i, parameters: f, value: e.slice(t + 1) }
    );
  }
  function q() {
    return { ...Object.fromEntries(L.map((e) => [e, []])), _explicitName: !1 };
  }
  function p(e, t, n) {
    let o = String(n ?? '').trim();
    o &&
      (o.length > V && c('propertyTooLong'),
      e[t].length >= E.valuesPerField && c('tooManyValues'),
      e[t].push(o));
  }
  function F(e, t) {
    let { name: n, parameters: o, value: a } = t;
    if (
      ![
        'PHOTO',
        'LOGO',
        'SOUND',
        'KEY',
        'UID',
        'REV',
        'PRODID',
        'CLASS',
        'CATEGORIES',
        'BDAY',
        'ANNIVERSARY',
        'GEO',
        'TZ',
        'RELATED',
        'KIND',
        'XML',
      ].includes(n) &&
      !(
        (o.get('VALUE') ?? []).includes('BINARY') ||
        (o.get('ENCODING') ?? []).some((r) => ['B', 'BASE64'].includes(r))
      )
    ) {
      if (n === 'FN') {
        let r = m(a).trim();
        r && ((e.name = []), p(e, 'name', r), (e._explicitName = !0));
        return;
      }
      if (n === 'N') {
        let [r = '', i = ''] = N(a, ';'),
          [, , , f = '', d = ''] = N(a, ';');
        (p(e, 'familyName', m(r)),
          p(e, 'givenName', m(i)),
          (e._fallbackName = [m(f), m(i), m(r), m(d)].filter(Boolean).join(' ')));
        return;
      }
      if (n === 'ORG') {
        let r = N(a, ';').map(m);
        (p(e, 'organization', r[0]), p(e, 'department', r.slice(1).filter(Boolean).join(' / ')));
        return;
      }
      if (n === 'TITLE') {
        p(e, 'title', m(a));
        return;
      }
      if (n === 'TEL') {
        p(e, 'phones', m(a.replace(/^tel:/iu, '')));
        return;
      }
      if (n === 'EMAIL') {
        p(e, 'emails', m(a));
        return;
      }
      if (n === 'URL') {
        p(e, 'websites', m(a));
        return;
      }
      if (n === 'NOTE') {
        p(e, 'notes', m(a));
        return;
      }
      if (n === 'ADR') {
        let r = N(a, ';').map(m);
        (p(e, 'street', r[2]),
          p(e, 'locality', r[3]),
          p(e, 'region', r[4]),
          p(e, 'postalCode', r[5]),
          p(e, 'country', r[6]));
      }
    }
  }
  function O(e) {
    let t = String(e ?? ''),
      n = t.replace(/^[\u0000-\u0020\uFEFF]+/u, '');
    return /^[=+@]/u.test(n) ||
      (n.startsWith('-') && !/^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/iu.test(n))
      ? `'${t}`
      : t;
  }
  function U(e) {
    let t = O(e);
    return /[",\r\n]/u.test(t) || /^\s|\s$/u.test(t) ? `"${t.replaceAll('"', '""')}"` : t;
  }
  function D(e, { selectedFields: t = L, labels: n = {} } = {}) {
    ((typeof e != 'string' || !e.trim()) && c('emptyInput'),
      x.encode(e).byteLength > E.inputBytes && c('fileTooLarge'),
      (!Array.isArray(t) ||
        !t.length ||
        t.some((s) => !L.includes(s)) ||
        new Set(t).size !== t.length) &&
        c('invalidFields'));
    let o = e.replace(/^\uFEFF/u, '').replace(
      /\r\n?/gu,
      `
`,
    ).split(`
`);
    o.length > E.physicalLines && c('tooManyLines');
    let a = [];
    for (let s of o)
      /^[ \t]/u.test(s)
        ? (a.length || c('invalid'), (a[a.length - 1] += s.slice(1)))
        : s.endsWith('=') && a.length
          ? c('unsupportedEncoding')
          : a.push(s);
    let r = [],
      i = null,
      f = '';
    for (let s of a) {
      if (!s.trim()) continue;
      if (s.toUpperCase() === 'BEGIN:VCARD') {
        (i && c('invalid'), r.length >= E.contacts && c('tooManyContacts'), (i = q()), (f = ''));
        continue;
      }
      if (s.toUpperCase() === 'END:VCARD') {
        (i || c('invalid'),
          ['', '2.1', '3.0', '4.0'].includes(f) || c('unsupportedVersion'),
          !i.name.length && !i.givenName.length && !i.familyName.length && c('missingName'),
          i.name.length ||
            i.name.push(
              i._fallbackName || [i.givenName[0], i.familyName[0]].filter(Boolean).join(' '),
            ),
          r.push(i),
          (i = null));
        continue;
      }
      i || c('invalid');
      let v = _(s);
      if (v.name === 'VERSION') {
        f = v.value.trim();
        continue;
      }
      F(i, v);
    }
    (i || !r.length) && c('invalid');
    let d = t.map((s) => String(n[s] ?? s));
    (d.some((s) => !s.trim() || s.length > 100) || new Set(d).size !== d.length) &&
      c('invalidFields');
    let l = r.map((s) => t.map((v) => s[v].join('; '))),
      g = `\uFEFF${[d, ...l].map((s) => s.map(U).join(',')).join(`\r
`)}\r
`;
    return (
      x.encode(g).byteLength > E.outputBytes && c('outputTooLarge'),
      Object.freeze({
        csv: g,
        contacts: r.length,
        fields: t.length,
        formulaCells: l.flat().filter((s) => O(s) !== s).length,
      })
    );
  }
  var u = document.querySelector('[data-tool="vcard-converter"]');
  if (u) {
    let f = function () {
        ((i = ''), (a.value = ''), R(u), (r.hidden = !0));
      },
      e = u.querySelector('#tool-form'),
      t = A(u),
      n = e.elements.namedItem('file'),
      o = e.elements.namedItem('paste'),
      a = u.querySelector('[data-vcard-converter-output]'),
      r = u.querySelector('[data-result]'),
      i = '';
    (e.addEventListener('submit', async (d) => {
      (d.preventDefault(), f());
      let l = n.files?.[0];
      if (l && o.value.trim()) return y(u, t.messages.chooseOne, 'error');
      if (!l && !o.value.trim()) return y(u, t.messages.emptyInput, 'error');
      if (l && l.size > E.inputBytes) return y(u, t.messages.fileTooLarge, 'error');
      let g = e.querySelector('[data-action="convert"]');
      g.disabled = !0;
      try {
        let s = l ? await l.text() : o.value,
          v = [...e.querySelectorAll('input[name="selectedFields"]:checked')].map((h) => h.value),
          C = Object.fromEntries(L.map((h) => [h, t.fields[h]])),
          I = D(s, { selectedFields: v, labels: C });
        ((i = I.csv), (a.value = i));
        let S = (h) => {
          try {
            return new Intl.NumberFormat(t.copyLanguage.replace('_', '-')).format(h);
          } catch {
            return String(h);
          }
        };
        ((u.querySelector('[data-result] h2').textContent =
          `${S(I.contacts)} ${t.messages.contacts} \xB7 ${S(I.fields)} ${t.messages.columns}`),
          (r.hidden = !1),
          y(u, t.messages.converted, 'success'));
      } catch (s) {
        let v = [
          'emptyInput',
          'fileTooLarge',
          'invalid',
          'invalidFields',
          'unsupportedEncoding',
          'unsupportedVersion',
          'missingName',
          'tooManyContacts',
          'tooManyLines',
          'tooManyValues',
          'propertyTooLong',
          'outputTooLarge',
        ].includes(s?.code)
          ? s.code
          : 'invalid';
        y(u, t.messages[v] ?? t.messages.invalid, 'error');
      } finally {
        g.disabled = !1;
      }
    }),
      u.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        (f(),
          (n.value = ''),
          (o.value = `BEGIN:VCARD
VERSION:3.0
N:Lovelace;Ada;;;
FN:Ada Lovelace
ORG:Analytical;Research
TEL;TYPE=CELL:+1-555-0100
TEL;TYPE=WORK:+1-555-0101
EMAIL:ada@example.org
END:VCARD
BEGIN:VCARD
VERSION:4.0
FN:Lin \u674E
EMAIL:lin@example.jp
END:VCARD`),
          y(u, t.messages.exampleLoaded, 'success'));
      }),
      e.addEventListener('input', (d) => {
        d.target !== a && f();
      }),
      n.addEventListener('change', () => {
        (n.files?.length && (o.value = ''), f());
      }),
      e.addEventListener('reset', () =>
        queueMicrotask(() => {
          ((n.value = ''), f());
        }),
      ),
      u
        .querySelector('[data-action="copy"]')
        ?.addEventListener('click', () => (i ? T(u, i, t) : y(u, t.messages.emptyInput, 'error'))),
      u.querySelector('[data-action="download"]')?.addEventListener('click', () => {
        if (!i) return y(u, t.messages.emptyInput, 'error');
        let d = URL.createObjectURL(new Blob([i], { type: 'text/csv;charset=utf-8' })),
          l = document.createElement('a');
        ((l.href = d),
          (l.download = 'contacts.csv'),
          l.click(),
          setTimeout(() => URL.revokeObjectURL(d), 1e3),
          y(u, t.messages.downloaded, 'success'));
      }));
  }
})();
