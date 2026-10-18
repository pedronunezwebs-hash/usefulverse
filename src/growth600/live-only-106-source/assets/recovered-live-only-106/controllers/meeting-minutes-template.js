(() => {
  function l(e, t, o = 'info') {
    let n = e.querySelector('[data-status]');
    n && ((n.textContent = t), (n.dataset.kind = o));
  }
  var d = Object.freeze({
    maxTitle: 160,
    maxPerson: 120,
    maxAttendees: 80,
    maxAgenda: 40,
    maxDecisions: 80,
    maxActions: 80,
    maxLine: 240,
  });
  function f(e, t, o) {
    let n = String(e ?? '')
      .split(/\r?\n/u)
      .map((s) => s.trim())
      .filter(Boolean);
    if (n.length > t || n.some((s) => s.length > d.maxLine))
      throw new RangeError(`${o} is outside the supported limits.`);
    return n;
  }
  function g(e, t, o = !1) {
    let n = String(e ?? '').trim();
    if ((!o && !n) || n.length > d.maxPerson)
      throw new RangeError(`${t} is required and must fit the supported length.`);
    return n;
  }
  function x(e) {
    if (!e) return '';
    let t = String(e);
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(t)) throw new RangeError('Use a valid YYYY-MM-DD date.');
    let o = new Date(`${t}T00:00:00.000Z`);
    if (!Number.isFinite(o.valueOf()) || o.toISOString().slice(0, 10) !== t)
      throw new RangeError('Use a valid calendar date.');
    return t;
  }
  function w(e) {
    let t = String(e?.title ?? '').trim();
    if (!t || t.length > d.maxTitle)
      throw new RangeError('Enter a meeting title within the supported length.');
    let o = f(e?.attendees, d.maxAttendees, 'Attendees').map((u) => g(u, 'Attendee'));
    if (new Set(o.map((u) => u.toLocaleLowerCase('en'))).size !== o.length)
      throw new RangeError('Attendee names must be unique.');
    let s = f(e?.agenda, d.maxAgenda, 'Agenda'),
      a = f(e?.decisions, d.maxDecisions, 'Decisions'),
      c = f(e?.actions, d.maxActions, 'Actions').map((u) => {
        let m = u.split('|').map((p) => p.trim());
        if (m.length !== 3 || m.some((p) => !p))
          throw new RangeError('Each action must use: task | owner | due date (YYYY-MM-DD).');
        let y = g(m[0], 'Action'),
          b = g(m[1], 'Action owner'),
          h = x(m[2]);
        if (!h) throw new RangeError('Every action needs a due date.');
        return Object.freeze({ task: y, owner: b, dueDate: h });
      });
    return Object.freeze({
      title: t,
      date: x(e?.date),
      facilitator: g(e?.facilitator, 'Facilitator', !0),
      attendees: Object.freeze(o),
      agenda: Object.freeze(s),
      decisions: Object.freeze(a),
      actions: Object.freeze(c),
    });
  }
  function v(e) {
    let t = w({
        ...e,
        attendees: (e.attendees ?? []).join(`
`),
        agenda: (e.agenda ?? []).join(`
`),
        decisions: (e.decisions ?? []).join(`
`),
        actions: (e.actions ?? []).map(({ task: a, owner: r, dueDate: c }) => `${a} | ${r} | ${c}`)
          .join(`
`),
      }),
      o = (a, r) => `## ${a}
${
  r.length
    ? r.map((c) => `- ${c}`).join(`
`)
    : '- \u2014'
}`,
      n = [
        `Date: ${t.date || '\u2014'}`,
        `Facilitator: ${t.facilitator || '\u2014'}`,
        `Attendees: ${t.attendees.length ? t.attendees.join(', ') : '\u2014'}`,
      ].join(`
`),
      s = t.actions.length
        ? t.actions.map(
            ({ task: a, owner: r, dueDate: c }) => `- [ ] ${a} \u2014 Owner: ${r} \u2014 Due: ${c}`,
          ).join(`
`)
        : '- \u2014';
    return `# ${t.title}

${n}

${o('Agenda', t.agenda)}

${o('Decisions', t.decisions)}

## Action items
${s}
`;
  }
  var i = document.querySelector('[data-tool="meeting-minutes-template"]');
  if (i) {
    let s = function (a) {
        a?.preventDefault();
        try {
          let r = w({
            title: e.elements.namedItem('title').value,
            date: e.elements.namedItem('date').value,
            facilitator: e.elements.namedItem('facilitator').value,
            attendees: e.elements.namedItem('attendees').value,
            agenda: e.elements.namedItem('agenda').value,
            decisions: e.elements.namedItem('decisions').value,
            actions: e.elements.namedItem('actions').value,
          });
          ((n = v(r)),
            (o.textContent = n),
            (o.hidden = !1),
            l(i, t.messages.previewReady, 'success'));
        } catch {
          ((n = ''), (o.textContent = ''), (o.hidden = !0), l(i, t.messages.checkInputs, 'error'));
        }
      },
      e = i.querySelector('#tool-form'),
      t = JSON.parse(i.querySelector('[data-tool-copy]').textContent),
      o = i.querySelector('[data-minutes-preview]'),
      n = '';
    (e.addEventListener('submit', s),
      i.querySelector('[data-action="download"]')?.addEventListener('click', () => {
        if ((n || s(), !n)) return;
        let a = URL.createObjectURL(new Blob([n], { type: 'text/markdown;charset=utf-8' })),
          r = document.createElement('a');
        ((r.href = a),
          (r.download = 'meeting-minutes.md'),
          r.click(),
          setTimeout(() => URL.revokeObjectURL(a), 0),
          l(i, t.messages.downloaded, 'success'));
      }),
      i.querySelector('[data-action="print"]')?.addEventListener('click', () => {
        (n || s(), n && window.print());
      }),
      i.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
        ((n = ''), (o.textContent = ''), (o.hidden = !0), l(i, t.messages.cleared, 'success'));
      }),
      e.addEventListener('input', () => {
        ((n = ''), (o.textContent = ''), (o.hidden = !0), l(i, ''));
      }));
  }
})();
