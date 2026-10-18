(() => {
  function A(o = document) {
    let e = o.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function b(o, e, n = 'info') {
    let i = o.querySelector('[data-status]');
    i && ((i.textContent = e), (i.dataset.kind = n));
  }
  var S = Object.freeze({ rows: 100, columns: 20, characters: 25e4 }),
    m = class extends Error {
      constructor(e) {
        (super(e), (this.name = 'MarkdownTableError'), (this.code = e));
      }
    };
  function k(o) {
    if (!Array.isArray(o) || o.length < 1) throw new m('empty-grid');
    if (o.length > S.rows) throw new m('too-many-rows');
    let e = Math.max(0, ...o.map((a) => (Array.isArray(a) ? a.length : 0)));
    if (e < 1) throw new m('empty-grid');
    if (e > S.columns) throw new m('too-many-columns');
    let n = o.map((a) => Array.from({ length: e }, (l, t) => String(a?.[t] ?? '')));
    if (n.reduce((a, l) => a + l.reduce((t, c) => t + c.length, 0), 0) > S.characters)
      throw new m('too-large');
    return n;
  }
  function D(o) {
    return String(o ?? '')
      .replace(/\\/gu, '\\\\')
      .replace(/\|/gu, '\\|')
      .replace(/\r\n?|\n/gu, '<br>')
      .trim();
  }
  function T(o, e = []) {
    let n = k(o),
      i = n[0].length,
      a = Array.from({ length: i }, (t, c) => {
        let f = e[c] ?? 'left';
        if (!['left', 'center', 'right'].includes(f)) throw new m('invalid-alignment');
        return f === 'center' ? ':---:' : f === 'right' ? '---:' : ':---';
      }),
      l = (t) => `| ${t.map(D).join(' | ')} |`;
    return [l(n[0]), l(a), ...n.slice(1).map(l)].join(`
`);
  }
  function R(o, e = 'auto') {
    let n = String(o ?? '');
    if (!n.trim()) throw new m('empty-import');
    if (n.length > S.characters) throw new m('too-large');
    let i = e === 'auto' ? _(n) : e;
    if (![',', '	', ';'].includes(i)) throw new m('invalid-delimiter');
    let a = [],
      l = [],
      t = '',
      c = !1;
    for (let f = 0; f < n.length; f += 1) {
      let y = n[f];
      if (y === '"') c && n[f + 1] === '"' ? ((t += '"'), (f += 1)) : (c = !c);
      else if (!c && y === i) (l.push(t), (t = ''));
      else if (
        !c &&
        (y ===
          `
` ||
          y === '\r')
      ) {
        if (
          (y === '\r' &&
            n[f + 1] ===
              `
` &&
            (f += 1),
          l.push(t),
          a.push(l),
          (l = []),
          (t = ''),
          a.length > S.rows)
        )
          throw new m('too-many-rows');
      } else t += y;
    }
    if (c) throw new m('unclosed-quote');
    return (l.push(t), (l.some((f) => f !== '') || a.length === 0) && a.push(l), k(a));
  }
  function _(o) {
    let e = o.split(/\r\n?|\n/u, 1)[0],
      n = new Map([
        [',', 0],
        [';', 0],
        ['	', 0],
      ]),
      i = !1;
    for (let a = 0; a < e.length; a += 1) {
      let l = e[a];
      l === '"'
        ? i && e[a + 1] === '"'
          ? (a += 1)
          : (i = !i)
        : !i && n.has(l) && n.set(l, n.get(l) + 1);
    }
    return [...n].sort((a, l) => l[1] - a[1])[0][0];
  }
  function q(o, e, n) {
    if (
      !Number.isInteger(e) ||
      e < 1 ||
      e > S.rows ||
      !Number.isInteger(n) ||
      n < 1 ||
      n > S.columns
    )
      throw new m('invalid-size');
    let i = k(o);
    return Array.from({ length: e }, (a, l) =>
      Array.from({ length: n }, (t, c) => i[l]?.[c] ?? ''),
    );
  }
  var r = document.querySelector('[data-tool="markdown-table-generator"]');
  if (r) {
    let f = function (s, p, d) {
        return s.replace('{row}', String(p + 1)).replace('{column}', String(d + 1));
      },
      y = function () {
        let s = document.createElement('table');
        (t.forEach((p, d) => {
          let w = document.createElement('tr');
          if (
            (p.forEach((u, h) => {
              let v = document.createElement(d === 0 ? 'th' : 'td');
              ((v.textContent = u), (v.style.textAlign = c[h] || 'left'), w.append(v));
            }),
            d === 0)
          ) {
            let u = document.createElement('thead');
            (u.append(w), s.append(u));
          } else {
            let u = s.querySelector('tbody');
            (u || ((u = document.createElement('tbody')), s.append(u)), u.append(w));
          }
        }),
          l.replaceChildren(s));
      },
      L = function () {
        (n.replaceChildren(), i.replaceChildren());
        let s = document.createElement('tr');
        (t[0].forEach((p, d) => {
          let w = document.createElement('th');
          w.scope = 'col';
          let u = document.createElement('label');
          ((u.className = 'field-label'),
            (u.htmlFor = `markdown-table-alignment-${d}`),
            (u.textContent = `${e.fields.alignment} ${d + 1}`));
          let h = document.createElement('select');
          ((h.id = u.htmlFor), (h.dataset.column = String(d)));
          for (let [v, g] of [
            ['left', e.fields.left],
            ['center', e.fields.center],
            ['right', e.fields.right],
          ]) {
            let E = document.createElement('option');
            ((E.value = v),
              (E.textContent = g),
              (E.selected = (c[d] || 'left') === v),
              h.append(E));
          }
          (h.addEventListener('change', () => {
            ((c[d] = h.value), y());
          }),
            w.append(u, h),
            s.append(w));
        }),
          n.append(s),
          t.forEach((p, d) => {
            let w = document.createElement('tr');
            (p.forEach((u, h) => {
              let v = document.createElement('td'),
                g = document.createElement('input');
              ((g.type = 'text'),
                (g.maxLength = 1e4),
                (g.value = u),
                g.setAttribute('aria-label', f(e.fields.cellLabel, d, h)),
                (g.dataset.row = String(d)),
                (g.dataset.column = String(h)),
                g.addEventListener('input', () => {
                  ((t[d][h] = g.value),
                    (a.value = ''),
                    (r.querySelector('[data-result]').hidden = !0),
                    y());
                }),
                v.append(g),
                w.append(v));
            }),
              i.append(w));
          }),
          (r.querySelector('[data-action="removeRow"]').disabled = t.length <= 1),
          (r.querySelector('[data-action="removeColumn"]').disabled = t[0].length <= 1),
          (r.querySelector('[data-action="addRow"]').disabled = t.length >= 100),
          (r.querySelector('[data-action="addColumn"]').disabled = t[0].length >= 20),
          y());
      },
      C = function () {
        try {
          return (
            (a.value = T(t, c)),
            (r.querySelector('[data-result]').hidden = !1),
            b(r, e.messages.ready, 'success'),
            !0
          );
        } catch (s) {
          let p =
            s instanceof m &&
            ['too-large', 'too-many-rows', 'too-many-columns', 'invalid-size'].includes(s.code);
          return (b(r, p ? e.messages.limit : e.messages.emptyGrid, 'error'), !1);
        }
      },
      x = function (s) {
        ((t = s),
          (c = Array.from({ length: t[0].length }, (p, d) => c[d] || 'left')),
          (a.value = ''),
          (r.querySelector('[data-result]').hidden = !0),
          L());
      },
      o = r.querySelector('#tool-form'),
      e = A(r),
      n = r.querySelector('[data-markdown-table-head]'),
      i = r.querySelector('[data-markdown-table-body]'),
      a = r.querySelector('[data-markdown-table-output]'),
      l = r.querySelector('[data-markdown-table-preview]'),
      t = [
        [e.fields.exampleHeader, e.fields.exampleColumn],
        [e.fields.exampleValue, e.fields.exampleDone],
      ],
      c = ['left', 'left'];
    (L(),
      o.addEventListener('submit', (s) => {
        (s.preventDefault(), C());
      }),
      r.querySelector('[data-action="import"]')?.addEventListener('click', () => {
        let s = o.elements.namedItem('importData').value;
        if (!s.trim()) {
          b(r, e.messages.emptyImport, 'error');
          return;
        }
        try {
          (x(R(s, o.elements.namedItem('delimiter').value)), b(r, e.messages.imported, 'success'));
        } catch (p) {
          let d =
            p instanceof m && ['too-large', 'too-many-rows', 'too-many-columns'].includes(p.code);
          b(r, d ? e.messages.limit : e.messages.invalidImport, 'error');
        }
      }),
      r.querySelector('[data-action="addRow"]')?.addEventListener('click', () => {
        t.length < 100 && x(q(t, t.length + 1, t[0].length));
      }),
      r.querySelector('[data-action="removeRow"]')?.addEventListener('click', () => {
        t.length > 1 && x(t.slice(0, -1));
      }),
      r.querySelector('[data-action="addColumn"]')?.addEventListener('click', () => {
        t[0].length < 20 && x(q(t, t.length, t[0].length + 1));
      }),
      r.querySelector('[data-action="removeColumn"]')?.addEventListener('click', () => {
        t[0].length > 1 && x(q(t, t.length, t[0].length - 1));
      }),
      r.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((o.elements.namedItem('importData').value =
          `${e.fields.exampleHeader},${e.fields.exampleColumn}
${e.fields.exampleValue},${e.fields.exampleDone}`),
          (c = ['left', 'center']),
          x([
            [e.fields.exampleHeader, e.fields.exampleColumn],
            [e.fields.exampleValue, e.fields.exampleDone],
          ]),
          b(r, e.messages.exampleLoaded, 'success'));
      }),
      r.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
        if (!(!a.value && !C()))
          try {
            (await navigator.clipboard.writeText(a.value), b(r, e.messages.copied, 'success'));
          } catch {
            b(r, e.messages.copyUnavailable, 'error');
          }
      }),
      r.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
        (o.reset(),
          (o.elements.namedItem('importData').value = ''),
          (c = ['left', 'left']),
          x([
            ['', ''],
            ['', ''],
          ]),
          b(r, e.messages.cleared, 'success'));
      }));
  }
})();
