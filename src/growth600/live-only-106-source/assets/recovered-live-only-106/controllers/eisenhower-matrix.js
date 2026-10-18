(() => {
  function u(e, t, r = 'info') {
    let n = e.querySelector('[data-status]');
    n && ((n.textContent = t), (n.dataset.kind = r));
  }
  var L = Object.freeze(['do', 'schedule', 'delegate', 'drop']),
    q = 300,
    U = 180,
    j = 800;
  function g() {
    return { version: 1, tasks: [] };
  }
  function z(e) {
    if (!e || typeof e != 'object' || Array.isArray(e)) return { ok: !1, reason: 'invalid' };
    let t = typeof e.id == 'string' ? e.id.trim() : '',
      r = typeof e.title == 'string' ? e.title.trim() : '',
      n = typeof e.notes == 'string' ? e.notes.trim() : '',
      d = typeof e.dueDate == 'string' ? e.dueDate.trim() : '';
    return !/^[\w-]{1,80}$/u.test(t) || !r || Array.from(r).length > U || Array.from(n).length > j
      ? { ok: !1, reason: 'invalid' }
      : L.includes(e.quadrant)
        ? d &&
          (!/^\d{4}-\d{2}-\d{2}$/u.test(d) ||
            Number.isNaN(Date.parse(`${d}T00:00:00Z`)) ||
            new Date(`${d}T00:00:00Z`).toISOString().slice(0, 10) !== d)
          ? { ok: !1, reason: 'date' }
          : e.done !== void 0 && typeof e.done != 'boolean'
            ? { ok: !1, reason: 'invalid' }
            : {
                ok: !0,
                task: {
                  id: t,
                  title: r,
                  notes: n,
                  dueDate: d,
                  quadrant: e.quadrant,
                  done: e.done ?? !1,
                },
              }
        : { ok: !1, reason: 'quadrant' };
  }
  function x(e, t) {
    if (!Array.isArray(e?.tasks) || e.tasks.length >= q) return { ok: !1, reason: 'limit' };
    let r = z(t);
    return r.ok
      ? e.tasks.some(
          ({ id: n, title: d }) =>
            n === r.task.id ||
            d.normalize('NFKC').toLocaleLowerCase() ===
              r.task.title.normalize('NFKC').toLocaleLowerCase(),
        )
        ? { ok: !1, reason: 'duplicate' }
        : { ok: !0, board: { version: 1, tasks: [...e.tasks, r.task] } }
      : r;
  }
  function _(e, t, r) {
    return !L.includes(r) || !Array.isArray(e?.tasks) || !e.tasks.some((n) => n.id === t)
      ? null
      : { ...e, tasks: e.tasks.map((n) => (n.id === t ? { ...n, quadrant: r } : n)) };
  }
  function D(e, t, r) {
    return !Array.isArray(e?.tasks) || typeof r != 'boolean' || !e.tasks.some((n) => n.id === t)
      ? null
      : { ...e, tasks: e.tasks.map((n) => (n.id === t ? { ...n, done: r } : n)) };
  }
  function $(e, t) {
    return !Array.isArray(e?.tasks) || !e.tasks.some((r) => r.id === t)
      ? null
      : { ...e, tasks: e.tasks.filter((r) => r.id !== t) };
  }
  function T(e) {
    if (typeof e != 'string' || e.length > 1e6) return { ok: !1, reason: 'size' };
    let t;
    try {
      t = JSON.parse(e);
    } catch {
      return { ok: !1, reason: 'json' };
    }
    if (!t || t.version !== 1 || !Array.isArray(t.tasks) || t.tasks.length > q)
      return { ok: !1, reason: 'format' };
    let r = g();
    for (let n of t.tasks) {
      let d = x(r, n);
      if (!d.ok) return { ok: !1, reason: d.reason };
      r = d.board;
    }
    return { ok: !0, board: r };
  }
  function R(e) {
    if (!Array.isArray(e?.tasks) || e.tasks.length > q)
      throw new TypeError('Invalid Eisenhower board.');
    let t = T(JSON.stringify({ version: 1, tasks: e.tasks }));
    if (!t.ok) throw new TypeError('Invalid Eisenhower board.');
    return JSON.stringify(t.board, null, 2);
  }
  var o = document.querySelector('[data-tool="eisenhower-matrix"]');
  if (o) {
    let f = function () {
        let i = s.tasks.filter((l) => l.done).length,
          a = s.tasks.length - i;
        o.querySelector('[data-summary]').textContent =
          `${t.fields.activeTasks}: ${a} \xB7 ${t.fields.completedTasks}: ${i}`;
        for (let l of o.querySelectorAll('[data-quadrant]')) {
          let p = l.dataset.quadrant,
            N = s.tasks
              .filter((c) => c.quadrant === p && (d.checked || !c.done))
              .map((c) => {
                let h = document.createElement('li');
                ((h.className = 'eisenhower-matrix__task'), (h.dataset.done = String(c.done)));
                let k = document.createElement('div');
                k.className = 'eisenhower-matrix__task-content';
                let C = document.createElement('strong');
                if (((C.textContent = c.title), k.append(C), c.notes)) {
                  let m = document.createElement('p');
                  ((m.textContent = c.notes), k.append(m));
                }
                if (c.dueDate) {
                  let m = document.createElement('p');
                  ((m.className = 'eisenhower-matrix__due'),
                    (m.textContent = `${t.fields.due}: ${c.dueDate}`),
                    k.append(m));
                }
                let S = document.createElement('div');
                S.className = 'eisenhower-matrix__task-actions';
                let w = document.createElement('select');
                ((w.dataset.moveId = c.id),
                  w.setAttribute('aria-label', `${t.actions.move}: ${c.title}`));
                for (let m of ['do', 'schedule', 'delegate', 'drop']) {
                  let v = document.createElement('option');
                  ((v.value = m),
                    (v.textContent = O(m)),
                    (v.selected = m === c.quadrant),
                    w.append(v));
                }
                let y = document.createElement('button');
                ((y.type = 'button'),
                  (y.dataset.doneId = c.id),
                  (y.textContent = c.done ? t.actions.reopen : t.actions.done));
                let E = document.createElement('button');
                return (
                  (E.type = 'button'),
                  (E.dataset.removeId = c.id),
                  (E.textContent = t.actions.remove),
                  S.append(w, y, E),
                  h.append(k, S),
                  h
                );
              });
          if ((l.replaceChildren(...N), !N.length)) {
            let c = document.createElement('li');
            ((c.className = 'eisenhower-matrix__empty'),
              (c.textContent = t.fields.empty),
              l.append(c));
          }
        }
      },
      I = function () {
        return (
          (b += 1),
          globalThis.crypto?.randomUUID?.() ?? `task-${Date.now().toString(36)}-${b.toString(36)}`
        );
      },
      e = o.querySelector('[data-task-form]'),
      t = JSON.parse(o.querySelector('[data-tool-copy]').textContent),
      r = o.querySelector('[data-status]'),
      n = o.querySelector('[data-import-file]'),
      d = o.querySelector('[data-show-completed]'),
      s = g(),
      b = 0,
      O = (i) => t.fields[`${i}Title`];
    (e.addEventListener('submit', (i) => {
      i.preventDefault();
      let a = x(s, {
        id: I(),
        title: e.elements.namedItem('title').value,
        notes: e.elements.namedItem('notes').value,
        dueDate: e.elements.namedItem('dueDate').value,
        quadrant: e.elements.namedItem('quadrant').value,
      });
      if (!a.ok) {
        let l =
          a.reason === 'duplicate'
            ? t.messages.duplicate
            : a.reason === 'date'
              ? t.messages.date
              : t.messages.invalid;
        u(o, l, 'error');
        return;
      }
      ((s = a.board), e.reset(), f(), u(o, t.messages.added, 'success'));
    }),
      o.addEventListener('change', (i) => {
        if (i.target === d) {
          f();
          return;
        }
        let a = i.target.dataset.moveId;
        if (!a) return;
        let l = _(s, a, i.target.value);
        l && ((s = l), f(), u(o, t.messages.moved, 'success'));
      }),
      o.addEventListener('click', (i) => {
        let a = i.target.closest('[data-done-id]');
        if (a) {
          let p = s.tasks.find(({ id: A }) => A === a.dataset.doneId);
          if (!p) return;
          ((s = D(s, p.id, !p.done) ?? s),
            f(),
            u(o, p.done ? t.messages.reopened : t.messages.completed, 'success'));
          return;
        }
        let l = i.target.closest('[data-remove-id]');
        l && ((s = $(s, l.dataset.removeId) ?? s), f(), u(o, t.messages.removed, 'success'));
      }),
      o.querySelector('[data-action="export"]')?.addEventListener('click', () => {
        if (!s.tasks.length) {
          u(o, t.messages.nothingToExport, 'info');
          return;
        }
        let i = URL.createObjectURL(new Blob([R(s)], { type: 'application/json;charset=utf-8' })),
          a = document.createElement('a');
        ((a.href = i),
          (a.download = 'usefulverse-eisenhower-matrix.json'),
          a.click(),
          setTimeout(() => URL.revokeObjectURL(i), 0),
          u(o, t.messages.exported, 'success'));
      }),
      o.querySelector('[data-action="import"]')?.addEventListener('click', () => n.click()),
      n.addEventListener('change', async () => {
        let i = n.files?.[0];
        if (i)
          try {
            if (i.size > 1e6) throw new RangeError('large');
            if (s.tasks.length && !window.confirm(t.messages.confirmImport)) return;
            let a = T(await i.text());
            if (!a.ok) throw new Error(a.reason);
            ((s = a.board), f(), u(o, t.messages.imported, 'success'));
          } catch (a) {
            u(
              o,
              a instanceof RangeError ? t.messages.importLarge : t.messages.importInvalid,
              'error',
            );
          } finally {
            n.value = '';
          }
      }),
      o.querySelector('[data-action="print"]')?.addEventListener('click', () => window.print()),
      o.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
        !s.tasks.length ||
          !window.confirm(t.messages.confirmClear) ||
          ((s = g()), f(), u(o, t.messages.cleared, 'success'));
      }),
      o.querySelector('[data-action="sample"]')?.addEventListener('click', () => {
        if (s.tasks.length && !window.confirm(t.messages.confirmClear)) return;
        let i = [
          {
            title: 'Finish the project report',
            notes: 'Send it before the client review.',
            dueDate: '',
            quadrant: 'do',
          },
          {
            title: 'Plan next week',
            notes: 'Protect time for the important work.',
            dueDate: '',
            quadrant: 'schedule',
          },
          {
            title: 'Book a routine appointment',
            notes: 'Ask someone to handle the call.',
            dueDate: '',
            quadrant: 'delegate',
          },
          {
            title: 'Check an old newsletter',
            notes: 'Unsubscribe if it is no longer useful.',
            dueDate: '',
            quadrant: 'drop',
          },
        ];
        s = g();
        for (let a of i) s = x(s, { ...a, id: I() }).board;
        (f(), u(o, t.messages.exampleLoaded, 'success'));
      }),
      f());
  }
})();
