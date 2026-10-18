(() => {
  function g(e, n, s = 'info') {
    let i = e.querySelector('[data-status]');
    i && ((i.textContent = n), (i.dataset.kind = s));
  }
  var N = /^\d{4}-\d{2}-\d{2}$/u;
  function b(e, n, s, i = !1) {
    let p = String(e ?? '').trim();
    if (i && !p) throw new RangeError(`${s} is required.`);
    if (p.length > n) throw new RangeError(`${s} is too long.`);
    return p;
  }
  function T(e, n) {
    let s = String(e ?? '').trim();
    if (!s) return '';
    if (!N.test(s)) throw new RangeError(`${n} must use YYYY-MM-DD.`);
    let i = new Date(`${s}T00:00:00.000Z`);
    if (Number.isNaN(i.valueOf()) || i.toISOString().slice(0, 10) !== s)
      throw new RangeError(`${n} is not a valid calendar date.`);
    return s;
  }
  function $(e) {
    if (!e || !Array.isArray(e.people) || !Array.isArray(e.parentChild))
      throw new TypeError('A family tree is required.');
    return e;
  }
  function S() {
    return { people: [], parentChild: [] };
  }
  function I(e, { id: n, name: s, birthDate: i = '', deathDate: p = '', notes: l = '' } = {}) {
    if (($(e), e.people.length >= 200))
      throw new RangeError('A tree can contain up to 200 people.');
    let c = b(n, 40, 'Person ID', !0);
    if (e.people.some((a) => a.id === c)) throw new RangeError('Person IDs must be unique.');
    let r = T(i, 'Birth date'),
      o = T(p, 'Death date');
    if (r && o && o < r) throw new RangeError('Death date cannot be earlier than birth date.');
    let t = Object.freeze({
      id: c,
      name: b(s, 100, 'Name', !0),
      birthDate: r,
      deathDate: o,
      notes: b(l, 500, 'Notes'),
    });
    return (e.people.push(t), t);
  }
  function P(e, n, s) {
    let i = [n],
      p = new Set();
    for (; i.length;) {
      let l = i.pop();
      if (l === s) return !0;
      if (!p.has(l)) {
        p.add(l);
        for (let [c, r] of e) c === l && i.push(r);
      }
    }
    return !1;
  }
  function F(e, n, s, i = 'biological') {
    if (($(e), !['biological', 'adoptive', 'foster'].includes(i)))
      throw new RangeError('Choose a supported parent relationship.');
    if (n === s) throw new RangeError('A person cannot be their own parent.');
    if (!e.people.some(({ id: c }) => c === n) || !e.people.some(({ id: c }) => c === s))
      throw new RangeError('Choose two people in this tree.');
    if (e.parentChild.some(([c, r]) => c === n && r === s))
      throw new RangeError('This parent link already exists.');
    if (e.parentChild.filter(([, c]) => c === s).length >= 2)
      throw new RangeError('A person can have at most two listed parents.');
    if (P(e.parentChild, s, n)) throw new RangeError('This link would create a family-tree cycle.');
    let l = Object.freeze([n, s, i]);
    return (e.parentChild.push(l), l);
  }
  function A(e, { horizontalGap: n = 220, verticalGap: s = 140 } = {}) {
    if (($(e), !Number.isFinite(n) || n < 80 || !Number.isFinite(s) || s < 80))
      throw new RangeError('Layout spacing must be at least 80 pixels.');
    let i = new Map(e.people.map(({ id: t }) => [t, []])),
      p = new Map(e.people.map(({ id: t }) => [t, []]));
    for (let [t, a] of e.parentChild) (i.get(a)?.push(t), p.get(t)?.push(a));
    let l = new Map(),
      c = (t, a = new Set()) => {
        if (l.has(t)) return l.get(t);
        if (a.has(t)) throw new RangeError('The family links contain a cycle.');
        a.add(t);
        let u = i.get(t) ?? [],
          h = u.length ? Math.max(...u.map((m) => c(m, a))) + 1 : 0;
        return (a.delete(t), l.set(t, h), h);
      };
    for (let { id: t } of e.people) c(t);
    let r = new Map();
    for (let t of e.people) {
      let a = l.get(t.id),
        u = r.get(a) ?? [];
      (u.push(t), r.set(a, u));
    }
    let o = [];
    for (let [t, a] of r)
      a.forEach((u, h) =>
        o.push(Object.freeze({ person: u, x: h * n + n / 2, y: t * s + s / 2, generation: t })),
      );
    return Object.freeze(o);
  }
  function q(e) {
    return String(e)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  }
  function R(e) {
    let n = A(e),
      s = Math.max(440, ...n.map(({ x: r }) => r + 180)),
      i = Math.max(180, ...n.map(({ y: r }) => r + 80)),
      p = new Map(n.map(({ person: r, x: o, y: t }) => [r.id, { x: o, y: t }])),
      l = e.parentChild
        .map(([r, o]) => {
          let t = p.get(r),
            a = p.get(o);
          return `<path d="M ${t.x} ${t.y + 24} C ${t.x} ${(t.y + a.y) / 2}, ${a.x} ${(t.y + a.y) / 2}, ${a.x} ${a.y - 24}" fill="none" stroke="#64748b" stroke-width="2"/>`;
        })
        .join(''),
      c = n
        .map(
          ({ person: r, x: o, y: t }) =>
            `<g><rect x="${o - 84}" y="${t - 24}" width="168" height="48" rx="10" fill="#fff" stroke="#475569"/><text x="${o}" y="${t + 5}" text-anchor="middle" font-family="sans-serif" font-size="14">${q(r.name)}</text></g>`,
        )
        .join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Family tree" width="${s}" height="${i}" viewBox="0 0 ${s} ${i}">${l}${c}</svg>`;
  }
  function C(e) {
    return String(e)
      .replace(/[\r\n/]/gu, ' ')
      .trim();
  }
  function D(e) {
    if (!e) return '';
    let [n, s, i] = e.split('-'),
      p = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${Number(i)} ${p[Number(s) - 1]} ${n}`;
  }
  function M(e) {
    $(e);
    let n = [
        '0 HEAD',
        '1 SOUR UsefulVerse',
        '1 GEDC',
        '2 VERS 5.5.1',
        '2 FORM LINEAGE-LINKED',
        '1 CHAR UTF-8',
      ],
      s = new Map(e.people.map((r, o) => [r.id, { person: r, xref: `@I${o + 1}@` }])),
      i = new Map();
    for (let [, r] of e.parentChild) {
      let o = e.parentChild
          .filter(([, u]) => u === r)
          .map(([u]) => u)
          .sort(),
        t = `${o.join('|')}=>${r}`;
      i.has(t) || i.set(t, { parents: o, children: [] });
      let a = i.get(t);
      a.children.includes(r) || a.children.push(r);
    }
    let p = [...i.values()],
      l = new Map(),
      c = new Map();
    p.forEach((r, o) => {
      let t = `@F${o + 1}@`;
      for (let a of r.parents) l.set(`${a}:child`, [...(l.get(`${a}:child`) ?? []), t]);
      for (let a of r.children) c.set(a, [...(c.get(a) ?? []), { xref: t, family: r }]);
    });
    for (let { person: r, xref: o } of s.values()) {
      (n.push(`0 ${o} INDI`, `1 NAME ${C(r.name).replace(/\s+/gu, ' /')}/`),
        r.birthDate && n.push('1 BIRT', `2 DATE ${D(r.birthDate)}`),
        r.deathDate && n.push('1 DEAT', `2 DATE ${D(r.deathDate)}`),
        r.notes && n.push(`1 NOTE ${C(r.notes)}`));
      for (let t of l.get(`${r.id}:child`) ?? []) n.push(`1 FAMS ${t}`);
      for (let { xref: t } of c.get(r.id) ?? []) {
        let a = e.parentChild.filter(([, m]) => m === r.id).map(([, , m]) => m),
          u = new Set(a).size === 1 ? a[0] : 'other',
          h = { biological: 'BIRTH', adoptive: 'ADOPTED', foster: 'FOSTER', other: 'OTHER' }[u];
        n.push(`1 FAMC ${t}`, `2 PEDI ${h}`);
      }
    }
    return (
      p.forEach((r, o) => {
        (n.push(`0 @F${o + 1}@ FAM`),
          r.parents
            .slice(0, 2)
            .forEach((t, a) => n.push(`1 ${a === 0 ? 'HUSB' : 'WIFE'} ${s.get(t).xref}`)));
        for (let t of r.children) n.push(`1 CHIL ${s.get(t).xref}`);
      }),
      n.push('0 TRLR'),
      `${n.join(`\r
`)}\r
`
    );
  }
  var O = Object.freeze({ maxPeople: 200 });
  var d = document.querySelector('[data-tool="family-tree-maker"]');
  if (d) {
    let a = function (m, E, x, y = '') {
        m.replaceChildren();
        let f = document.createElement('option');
        ((f.value = ''), (f.textContent = E), m.append(f));
        for (let v of x) {
          let w = document.createElement('option');
          ((w.value = v.id), (w.textContent = v.name), m.append(w));
        }
        m.value = y;
      },
      u = function () {
        ((i.hidden = o.people.length === 0), p.replaceChildren());
        for (let f of o.people) {
          let v = document.createElement('li'),
            w = [f.birthDate, f.deathDate].filter(Boolean).join(' \u2013 ');
          ((v.textContent = w ? `${f.name} (${w})` : f.name), p.append(v));
        }
        let m = c.value,
          E = r.value;
        if (
          (a(c, n.fields.parent, o.people, m), a(r, n.fields.child, o.people, E), !o.people.length)
        ) {
          l.replaceChildren();
          return;
        }
        let x = A(o),
          y = Math.max(440, ...x.map(({ x: f }) => f + 180));
        ((l.style.overflowX = 'auto'),
          (l.innerHTML = R(o)),
          l.querySelector('svg')?.setAttribute('aria-label', n.actions.result),
          l.querySelector('svg')?.setAttribute('role', 'img'),
          (l.style.maxWidth = `${y}px`));
      },
      h = function (m, E, x) {
        let y = URL.createObjectURL(new Blob([E], { type: x })),
          f = document.createElement('a');
        ((f.href = y),
          (f.download = m),
          f.click(),
          setTimeout(() => URL.revokeObjectURL(y), 0),
          g(d, n.messages.exported, 'success'));
      },
      e = d.querySelector('#tool-form'),
      n = JSON.parse(d.querySelector('[data-tool-copy]').textContent),
      s = d.querySelector('[data-status]'),
      i = d.querySelector('[data-result]'),
      p = d.querySelector('[data-family-people]'),
      l = d.querySelector('[data-family-svg]'),
      c = e.elements.namedItem('parentId'),
      r = e.elements.namedItem('childId'),
      o = S(),
      t = 1;
    (d.querySelector('[data-action="addPerson"]')?.addEventListener('click', () => {
      try {
        (I(o, {
          id: `P${t++}`,
          name: e.elements.namedItem('personName').value,
          birthDate: e.elements.namedItem('birthDate').value,
          deathDate: e.elements.namedItem('deathDate').value,
          notes: e.elements.namedItem('notes').value,
        }),
          (e.elements.namedItem('personName').value = ''),
          (e.elements.namedItem('birthDate').value = ''),
          (e.elements.namedItem('deathDate').value = ''),
          (e.elements.namedItem('notes').value = ''),
          u(),
          g(d, n.messages.personAdded, 'success'));
      } catch {
        g(d, n.messages.invalidEntry, 'error');
      }
    }),
      d.querySelector('[data-action="linkPeople"]')?.addEventListener('click', () => {
        try {
          (F(o, c.value, r.value, e.elements.namedItem('relationship').value),
            u(),
            g(d, n.messages.linkAdded, 'success'));
        } catch {
          g(d, n.messages.invalidEntry, 'error');
        }
      }),
      d.querySelector('[data-action="exportSvg"]')?.addEventListener('click', () => {
        if (!o.people.length) return g(d, n.messages.emptyTree, 'error');
        h('family-tree.svg', R(o), 'image/svg+xml;charset=utf-8');
      }),
      d.querySelector('[data-action="exportGedcom"]')?.addEventListener('click', () => {
        if (!o.people.length) return g(d, n.messages.emptyTree, 'error');
        h('family-tree.ged', M(o), 'text/plain;charset=utf-8');
      }),
      d.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
        ((o = S()), (t = 1), e.reset(), u(), g(d, ''));
      }),
      u());
  }
})();
