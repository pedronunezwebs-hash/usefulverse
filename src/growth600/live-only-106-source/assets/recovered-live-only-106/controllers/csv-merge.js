(() => {
  function M(t = document) {
    let e = t.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function v(t, e, n = 'info') {
    let s = t.querySelector('[data-status]');
    s && ((s.textContent = e), (s.dataset.kind = n));
  }
  function L(t) {
    let e = t.querySelector('[data-result]'),
      n = t.querySelector('[data-result-content]');
    (e && (e.hidden = !0), n && n.replaceChildren());
  }
  async function A(t, e, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(e), v(t, n.messages.copied, 'success'));
    } catch {
      v(t, n.messages.copyUnavailable, 'error');
    }
  }
  var I = Object.freeze({
      fileBytes: 5242880,
      rows: 5e3,
      columns: 80,
      cells: 8e4,
      cellChars: 2e4,
      history: 50,
    }),
    S = [',', ';', '	', '|'];
  function C(t) {
    throw new Error(t);
  }
  function _(t) {
    return new TextEncoder().encode(t).byteLength;
  }
  function F(t) {
    let e = String(t).replace(/^\uFEFF/u, ''),
      n = [],
      s = !1,
      f = Object.fromEntries(S.map((o) => [o, 0]));
    for (let o = 0; o < e.length && n.length < 12; o += 1) {
      let l = e[o];
      l === '"'
        ? s && e[o + 1] === '"'
          ? (o += 1)
          : (s = !s)
        : !s && S.includes(l)
          ? (f[l] += 1)
          : !s &&
            (l ===
              `
` ||
              l === '\r') &&
            (Object.values(f).some(Boolean) && n.push(f),
            (f = Object.fromEntries(S.map((c) => [c, 0]))),
            l === '\r' &&
              e[o + 1] ===
                `
` &&
              (o += 1));
    }
    if ((Object.values(f).some(Boolean) && n.length < 12 && n.push(f), !n.length)) return ',';
    let h = (o) => {
      let c = n.map((d) => d[o]).filter((d) => d > 0);
      if (!c.length) return 0;
      let a = c.reduce((d, r) => d + r, 0) / c.length,
        i = c.filter((d) => d === Math.round(a)).length / n.length;
      return a * i;
    };
    return S.reduce((o, l) => (h(l) > h(o) ? l : o), ',');
  }
  function $(t, { delimiter: e = 'auto', hasHeader: n = !0, limits: s = I } = {}) {
    ((typeof t != 'string' || !t.trim()) && C('emptyInput'), _(t) > s.fileBytes && C('tooLarge'));
    let f = t.replace(/^\uFEFF/u, ''),
      h = e === 'auto' ? F(f) : e;
    S.includes(h) || C('invalidDelimiter');
    let o = [],
      l = [],
      c = '',
      a = !1,
      i = !1,
      d = 0,
      r = () => {
        ((d += 1), d > s.cells && C('tooManyCells'), l.push(c), (c = ''), (i = !1));
      },
      u = () => {
        (r(), o.length >= s.rows + (n ? 1 : 0) && C('tooManyRows'), o.push(l), (l = []));
      };
    for (let p = 0; p < f.length; p += 1) {
      let w = f[p];
      if (a) {
        (w === '"' && f[p + 1] === '"'
          ? ((c += '"'), (p += 1))
          : w === '"'
            ? ((a = !1), (i = !0))
            : (c += w),
          c.length > s.cellChars && C('cellTooLong'));
        continue;
      }
      if (w === '"' && c.length === 0 && !i) {
        a = !0;
        continue;
      }
      if ((w === '"' && c.length && C('unexpectedQuote'), w === h)) {
        r();
        continue;
      }
      if (
        w ===
          `
` ||
        w === '\r'
      ) {
        (w === '\r' &&
          f[p + 1] ===
            `
` &&
          (p += 1),
          u());
        continue;
      }
      (i && /\s/u.test(w)) ||
        (i && C('textAfterQuote'), (c += w), c.length > s.cellChars && C('cellTooLong'));
    }
    for (
      a && C('unclosedQuote'), (c.length || l.length || (f.length && !/[\r\n]$/u.test(f))) && u();
      o.length && o.at(-1).every((p) => p === '');
    )
      o.pop();
    o.length || C('emptyInput');
    let g = Math.max(...o.map((p) => p.length));
    g > s.columns && C('tooManyColumns');
    let E = o.map((p) => Array.from({ length: g }, (w, O) => p[O] ?? '')),
      T = n ? E.shift() : Array.from({ length: g }, (p, w) => `Column ${w + 1}`),
      b = E;
    return (
      (b.length > s.rows || b.length * g > s.cells) && C('tooManyCells'),
      { headers: T, rows: b, columnTypes: Array(g).fill('text'), delimiter: h, hasHeader: !!n }
    );
  }
  var y = Object.freeze({
      files: 20,
      fileBytes: 2 * 1024 * 1024,
      totalBytes: 8 * 1024 * 1024,
      rows: 2e4,
      columns: 100,
      cells: 2e5,
      cellChars: 2e4,
    }),
    q = Object.freeze({ comma: ',', semicolon: ';', tab: '	', pipe: '|' });
  function x(t) {
    throw Object.assign(new Error(t), { code: t });
  }
  function j(t) {
    let e = String(t ?? ''),
      n = e.replace(/^[\u0000-\u0020]+/u, '');
    return /^[=+@]/u.test(n)
      ? `'${e}`
      : n.startsWith('-') && !/^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/iu.test(n)
        ? `'${e}`
        : e;
  }
  function B(t, e) {
    let n = String(t ?? '');
    return n.includes('"') || n.includes(e) || /[\r\n]/u.test(n) || /^\s|\s$/u.test(n)
      ? `"${n.replaceAll('"', '""')}"`
      : n;
  }
  function R(t, { delimiter: e = 'auto', hasHeader: n = !0, outputDelimiter: s = ',' } = {}) {
    ((!Array.isArray(t) || t.length < 2) && x('select-two-files'),
      t.length > y.files && x('too-many-files'),
      e !== 'auto' && !Object.values(q).includes(e) && x('invalid-delimiter'),
      Object.values(q).includes(s) || x('invalid-delimiter'));
    let f = 0,
      h = t.map((r) => {
        (!r || typeof r.text != 'string' || !r.text.trim()) && x('empty-input');
        let u = new TextEncoder().encode(r.text).byteLength;
        (u > y.fileBytes && x('file-too-large'),
          (f += u),
          f > y.totalBytes && x('total-too-large'));
        let g = $(r.text, {
          delimiter: e === 'auto' ? 'auto' : e,
          hasHeader: !!n,
          limits: {
            ...I,
            fileBytes: y.fileBytes,
            rows: y.rows,
            columns: y.columns,
            cells: y.cells,
            cellChars: y.cellChars,
          },
        });
        return (
          n &&
            (g.headers.some((E) => !E.trim()) && x('empty-header'),
            new Set(g.headers).size !== g.headers.length && x('duplicate-headers')),
          { name: typeof r.name == 'string' ? r.name : '', table: g }
        );
      }),
      o;
    if (n) o = [...new Set(h.flatMap(({ table: r }) => r.headers))];
    else {
      let r = Math.max(...h.map(({ table: u }) => u.headers.length));
      o = Array.from({ length: r }, (u, g) => `Column ${g + 1}`);
    }
    (!o.length || o.length > y.columns) && x('too-many-columns');
    let l = [],
      c = [];
    for (let { name: r, table: u } of h) {
      (l.length + u.rows.length > y.rows && x('too-many-rows'),
        (l.length + u.rows.length + 1) * o.length > y.cells && x('too-many-cells'));
      let g = n ? u.headers.map((E) => o.indexOf(E)) : o.map((E, T) => T);
      for (let E of u.rows) {
        let T = Array(o.length).fill('');
        (E.forEach((b, p) => {
          T[g[p]] = b;
        }),
          l.push(T));
      }
      c.push(Object.freeze({ name: r, rows: u.rows.length, columns: u.headers.length }));
    }
    let a = 0,
      d = [o, ...l].map((r, u) =>
        r
          .map((g) => {
            let E = j(g);
            return (E !== String(g ?? '') && (a += 1), B(E, s));
          })
          .join(s),
      ).join(`\r
`);
    return (
      new TextEncoder().encode(d).byteLength > y.totalBytes * 2 && x('output-too-large'),
      Object.freeze({
        csv: d,
        headers: Object.freeze(o),
        rowCount: l.length,
        fileCount: t.length,
        protectedCells: a,
        files: Object.freeze(c),
      })
    );
  }
  var m = document.querySelector('[data-tool="csv-merge"]');
  if (m) {
    let o = function () {
        (L(m),
          (s.value = ''),
          (f.textContent = ''),
          (h = ''),
          (m.querySelector('[data-result]').hidden = !0));
      },
      l = function (a) {
        ((h = a.csv), (s.value = a.csv));
        let i = (d) => {
          try {
            return new Intl.NumberFormat(e.copyLanguage.replace('_', '-')).format(d);
          } catch {
            return String(d);
          }
        };
        ((f.textContent = `${i(a.fileCount)} ${e.fields.filesMerged} \xB7 ${i(a.rowCount)} ${e.fields.rowsMerged} \xB7 ${i(a.headers.length)} ${e.fields.columnsMerged} \xB7 ${i(a.protectedCells)} ${e.fields.formulaCells}`),
          (m.querySelector('[data-result]').hidden = !1),
          v(m, e.messages.merged, 'success'));
      },
      c = function () {
        return {
          delimiter: t.elements.namedItem('inputDelimiter').value,
          hasHeader: t.elements.namedItem('hasHeader').checked,
          outputDelimiter: t.elements.namedItem('outputDelimiter').value,
        };
      },
      t = m.querySelector('#tool-form'),
      e = M(m),
      n = t.elements.namedItem('files'),
      s = m.querySelector('[data-csv-merge-output]'),
      f = m.querySelector('[data-csv-merge-summary]'),
      h = '';
    (t.addEventListener('submit', async (a) => {
      (a.preventDefault(), o());
      let i = [...(n.files ?? [])];
      if (i.length < 2) return v(m, e.messages['select-two-files'], 'error');
      if (i.length > y.files) return v(m, e.messages['too-many-files'], 'error');
      if (i.some((r) => r.size > y.fileBytes)) return v(m, e.messages['file-too-large'], 'error');
      if (i.reduce((r, u) => r + u.size, 0) > y.totalBytes)
        return v(m, e.messages['total-too-large'], 'error');
      let d = t.querySelector('[data-action="merge"]');
      d.disabled = !0;
      try {
        let r = await Promise.all(
          i.map(async (u) => {
            try {
              return { name: u.name, text: await u.text() };
            } catch {
              throw new Error('fileReadError');
            }
          }),
        );
        l(R(r, c()));
      } catch (r) {
        let u = [
          'select-two-files',
          'too-many-files',
          'file-too-large',
          'total-too-large',
          'empty-input',
          'invalid-delimiter',
          'empty-header',
          'duplicate-headers',
          'too-many-rows',
          'too-many-columns',
          'too-many-cells',
          'output-too-large',
          'invalidTable',
          'emptyInput',
          'tooLarge',
          'tooManyRows',
          'tooManyColumns',
          'tooManyCells',
          'cellTooLong',
          'invalidDelimiter',
          'unclosedQuote',
          'unexpectedQuote',
          'textAfterQuote',
          'fileReadError',
        ].includes(r.code ?? r.message)
          ? (r.code ?? r.message)
          : 'invalid';
        v(m, e.messages[u] ?? e.messages.invalid, 'error');
      } finally {
        d.disabled = !1;
      }
    }),
      m.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        o();
        try {
          (l(
            R(
              [
                {
                  name: 'first.csv',
                  text: `id,name
001,Ada`,
                },
                {
                  name: 'second.csv',
                  text: `name,score,id
Lin,9,002`,
                },
              ],
              c(),
            ),
          ),
            (n.value = ''));
        } catch {
          v(m, e.messages.invalid, 'error');
        }
      }),
      t.addEventListener('reset', () =>
        queueMicrotask(() => {
          ((n.value = ''), o());
        }),
      ),
      t.addEventListener('input', (a) => {
        a.target !== s && o();
      }),
      m.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        h ? A(m, h, e) : v(m, e.messages.invalid, 'error');
      }),
      m.querySelector('[data-action="download"]')?.addEventListener('click', () => {
        if (!h) return v(m, e.messages.invalid, 'error');
        let a = URL.createObjectURL(new Blob([h], { type: 'text/csv;charset=utf-8' })),
          i = document.createElement('a');
        ((i.href = a),
          (i.download = 'merged.csv'),
          i.click(),
          setTimeout(() => URL.revokeObjectURL(a), 1e3),
          v(m, e.messages.downloaded, 'success'));
      }));
  }
})();
