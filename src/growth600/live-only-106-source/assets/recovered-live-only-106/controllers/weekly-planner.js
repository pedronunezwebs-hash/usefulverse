(() => {
  function f(e, t, r = 'info') {
    let n = e.querySelector('[data-status]');
    n && ((n.textContent = t), (n.dataset.kind = r));
  }
  var W = Object.freeze([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]),
    h = Object.freeze({
      maxBlocks: 100,
      maxTitleLength: 120,
      maxDurationMinutes: 1080,
      schemaVersion: 1,
    }),
    T = new Set(['work', 'personal', 'study', 'health', 'other']),
    y = 1440,
    I = y * 7;
  function R(e) {
    let t = /^(\d{2}):(\d{2})$/u.exec(String(e ?? ''));
    if (!t) throw new RangeError('Enter a valid 24-hour time.');
    let r = Number(t[1]),
      n = Number(t[2]);
    if (r > 23 || n > 59) throw new RangeError('Enter a valid 24-hour time.');
    return r * 60 + n;
  }
  function v(e, t) {
    let r = Number(e?.day),
      n = String(e?.title ?? '').trim(),
      s = String(e?.category ?? 'other');
    if (!Number.isInteger(r) || r < 0 || r > 6) throw new RangeError('Choose a day of the week.');
    if (!n || n.length > h.maxTitleLength)
      throw new RangeError('Enter a title within the supported length.');
    if (!T.has(s)) throw new RangeError('Choose a supported block category.');
    let o = R(e?.start),
      c = R(e?.end),
      u = (c - o + y) % y;
    if (u === 0 || u > h.maxDurationMinutes)
      throw new RangeError('A block must last from 1 minute to 18 hours.');
    let a = String(t ?? e?.id ?? '').trim();
    if (!a || a.length > 80) throw new RangeError('A valid block ID is required.');
    return Object.freeze({
      id: a,
      day: r,
      title: n,
      category: s,
      start: e.start,
      end: e.end,
      startMinutes: o,
      endMinutes: c,
      durationMinutes: u,
      overnight: c <= o,
    });
  }
  function M(e, t) {
    if (!Array.isArray(e) || e.length >= h.maxBlocks)
      throw new RangeError('Keep up to 100 weekly blocks.');
    let r = new Set(e.map((s) => s.id)),
      n = e.length + 1;
    for (; r.has(`block-${n}`);) n += 1;
    return Object.freeze([...e, v(t, `block-${n}`)]);
  }
  function q(e, t) {
    if (!Array.isArray(e)) throw new TypeError('A block list is required.');
    return Object.freeze(e.filter((r) => r.id !== t));
  }
  function C(e) {
    let t = e.day * y + e.startMinutes,
      r = t + e.durationMinutes,
      n = [];
    for (let s of [-I, 0, I]) {
      let o = t + s,
        c = r + s,
        u = Math.floor(o / y),
        a = Math.floor((c - 1) / y);
      for (let l = u; l <= a; l += 1) {
        let d = l * y,
          g = Math.max(o, d) - d,
          p = Math.min(c, d + y) - d;
        p > g && n.push({ day: (l + 7) % 7, start: g, end: p });
      }
    }
    return n;
  }
  function E(e) {
    if (!Array.isArray(e)) throw new TypeError('A block list is required.');
    let t = new Map(),
      r = e.map((n) => ({ block: n, segments: C(n) }));
    for (let n = 0; n < r.length; n += 1)
      for (let s = n + 1; s < r.length; s += 1)
        for (let o of r[n].segments)
          for (let c of r[s].segments) {
            if (o.day !== c.day || o.start >= c.end || c.start >= o.end) continue;
            let u = [r[n].block.id, r[s].block.id].sort(),
              a = `${u.join('|')}:${o.day}`;
            t.set(
              a,
              Object.freeze({
                blockIds: Object.freeze(u),
                day: o.day,
                start: Math.max(o.start, c.start),
                end: Math.min(o.end, c.end),
              }),
            );
          }
    return Object.freeze([...t.values()].sort((n, s) => n.day - s.day || n.start - s.start));
  }
  function A(e) {
    if (!Array.isArray(e) || e.length > h.maxBlocks) throw new RangeError('Invalid weekly plan.');
    let t = e.map((r) => v(r, r.id));
    if (new Set(t.map((r) => r.id)).size !== t.length)
      throw new RangeError('Block IDs must be unique.');
    return JSON.stringify(
      {
        schema: 'usefulverse-weekly-plan',
        version: h.schemaVersion,
        blocks: t.map(({ id: r, day: n, title: s, category: o, start: c, end: u }) => ({
          id: r,
          day: n,
          title: s,
          category: o,
          start: c,
          end: u,
        })),
      },
      null,
      2,
    );
  }
  function O(e) {
    if (typeof e != 'string' || e.length > 1e5)
      throw new RangeError('The backup file is too large.');
    let t;
    try {
      t = JSON.parse(e);
    } catch {
      throw new SyntaxError('The backup is not valid JSON.');
    }
    if (
      t?.schema !== 'usefulverse-weekly-plan' ||
      t?.version !== h.schemaVersion ||
      !Array.isArray(t.blocks) ||
      t.blocks.length > h.maxBlocks
    )
      throw new RangeError('This is not a supported weekly plan backup.');
    let r = t.blocks.map((n) => v(n, n.id));
    if (new Set(r.map((n) => n.id)).size !== r.length)
      throw new RangeError('Block IDs must be unique.');
    return Object.freeze(r);
  }
  var i = document.querySelector('[data-tool="weekly-planner"]');
  if (i) {
    let c = function () {
        if ((n.replaceChildren(), !o.length)) {
          let d = document.createElement('p');
          ((d.textContent = t.fields.empty), n.append(d));
          return;
        }
        let a = E(o),
          l = new Set(a.flatMap(({ blockIds: d }) => d));
        for (let d = 0; d < 7; d += 1) {
          let g = o.filter((m) => m.day === d).sort((m, w) => m.startMinutes - w.startMinutes);
          if (!g.length) continue;
          let p = document.createElement('section');
          p.className = 'weekly-planner__day';
          let b = document.createElement('h3');
          ((b.textContent =
            t.fields[
              ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][d]
            ]),
            p.append(b));
          let x = document.createElement('ul');
          for (let m of g) {
            let w = document.createElement('li');
            w.dataset.overlap = String(l.has(m.id));
            let S = document.createElement('span'),
              N = t.fields[m.category] ?? t.fields.other;
            S.textContent = `${m.start}\u2013${m.end}${m.overnight ? ` \xB7 ${t.fields.overnight}` : ''} \xB7 ${m.title} \xB7 ${N}${l.has(m.id) ? ` \xB7 ${t.fields.overlap}` : ''}`;
            let k = document.createElement('button');
            ((k.type = 'button'),
              (k.dataset.removeId = m.id),
              (k.textContent = t.actions.removeBlock),
              w.append(S, k),
              x.append(w));
          }
          (p.append(x), n.append(p));
        }
      },
      u = function () {
        let a = E(o).length > 0;
        f(i, a ? t.messages.overlapFound : t.messages.noOverlap, a ? 'warning' : 'success');
      },
      e = i.querySelector('#tool-form'),
      t = JSON.parse(i.querySelector('[data-tool-copy]').textContent),
      r = i.querySelector('[data-status]'),
      n = i.querySelector('[data-weekly-blocks]'),
      s = e.elements.namedItem('backupFile'),
      o = [];
    (e.addEventListener('submit', (a) => {
      a.preventDefault();
      try {
        ((o = [
          ...M(o, {
            day: e.elements.namedItem('day').value,
            title: e.elements.namedItem('title').value,
            start: e.elements.namedItem('start').value,
            end: e.elements.namedItem('end').value,
            category: e.elements.namedItem('category').value,
          }),
        ]),
          (e.elements.namedItem('title').value = ''),
          c(),
          u());
      } catch {
        f(i, t.messages.checkInputs, 'error');
      }
    }),
      n.addEventListener('click', (a) => {
        let l = a.target.closest('[data-remove-id]');
        l && ((o = [...q(o, l.dataset.removeId)]), c(), f(i, t.messages.removed, 'success'));
      }),
      i.querySelector('[data-action="download"]')?.addEventListener('click', () => {
        try {
          let a = URL.createObjectURL(new Blob([A(o)], { type: 'application/json;charset=utf-8' })),
            l = document.createElement('a');
          ((l.href = a),
            (l.download = 'usefulverse-weekly-plan.json'),
            l.click(),
            setTimeout(() => URL.revokeObjectURL(a), 0),
            f(i, t.messages.downloaded, 'success'));
        } catch {
          f(i, t.messages.checkInputs, 'error');
        }
      }),
      i.querySelector('[data-action="import"]')?.addEventListener('click', () => s.click()),
      s.addEventListener('change', async () => {
        let a = s.files?.[0];
        if (a)
          try {
            if (a.size > 1e5) throw new RangeError('large');
            ((o = [...O(await a.text())]), c(), f(i, t.messages.imported, 'success'));
          } catch {
            f(i, t.messages.importFailed, 'error');
          } finally {
            s.value = '';
          }
      }),
      i.querySelector('[data-action="print"]')?.addEventListener('click', () => window.print()),
      i.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
        ((o = []), c(), f(i, t.messages.cleared, 'success'));
      }),
      c());
  }
})();
