(() => {
  function F(e) {
    if (typeof e != 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(e))
      throw new RangeError('Enter a valid calendar date.');
    let [f, s, h] = e.split('-').map(Number),
      n = new Date(0);
    if (
      (n.setUTCHours(0, 0, 0, 0),
      n.setUTCFullYear(f, s - 1, h),
      n.getUTCFullYear() !== f || n.getUTCMonth() !== s - 1 || n.getUTCDate() !== h)
    )
      throw new RangeError('Enter a valid calendar date.');
    return n.getTime();
  }
  function L(e, { zoom: f = 1 } = {}) {
    if (!Array.isArray(e)) throw new TypeError('Timeline events must be a list.');
    if (e.length < 2) throw new RangeError('Enter at least two events.');
    if (e.length > 80) throw new RangeError('The timeline is limited to 80 events.');
    if (![0.75, 1, 1.5, 2].includes(Number(f)))
      throw new RangeError('Choose a supported zoom level.');
    let s = e
        .map((r, g) => {
          let a = typeof r?.name == 'string' ? r.name.trim() : '';
          if (!a || Array.from(a).length > 100)
            throw new RangeError(`Event ${g + 1} needs a name of 1\u2013100 characters.`);
          let d = typeof r.start == 'string' ? r.start : '',
            $ = typeof r.end == 'string' && r.end ? r.end : d,
            c = F(d),
            u = F($);
          if (u < c) throw new RangeError(`Event ${g + 1} ends before it starts.`);
          return Object.freeze({ name: a, start: d, end: $, startMs: c, endMs: u, order: g });
        })
        .sort((r, g) => r.startMs - g.startMs || r.order - g.order),
      h = Math.min(...s.map(({ startMs: r }) => r)),
      n = Math.max(...s.map(({ endMs: r }) => r)),
      b = Math.round((n - h) / 864e5) + 1;
    if (b > 36525) throw new RangeError('The timeline cannot span more than 100 years.');
    let x = s.map((r) =>
      Object.freeze({
        ...r,
        startDay: Math.round((r.startMs - h) / 864e5),
        durationDays: Math.round((r.endMs - r.startMs) / 864e5) + 1,
        leftPercent: ((r.startMs - h) / (b * 864e5)) * 100,
        widthPercent: ((r.endMs - r.startMs + 864e5) / (b * 864e5)) * 100,
      }),
    );
    return Object.freeze({
      events: Object.freeze(x),
      firstMs: h,
      lastMs: n,
      totalDays: b,
      zoom: Number(f),
    });
  }
  function B(e) {
    let f = String(e ?? '');
    return `"${(/^[\t\r ]*[=+@-]/u.test(f) ? `'${f}` : f).replaceAll('"', '""')}"`;
  }
  function W(e) {
    if (!e || !Array.isArray(e.events)) throw new TypeError('Create a timeline before exporting.');
    return `\uFEFF${[
      ['Event', 'Start date', 'End date'],
      ...e.events.map(({ name: s, start: h, end: n }) => [s, h, n]),
    ].map((s) => s.map(B).join(',')).join(`\r
`)}`;
  }
  function R(e) {
    return String(e)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  }
  function Y(e, { title: f = 'Timeline' } = {}) {
    if (!e || !Array.isArray(e.events)) throw new TypeError('Create a timeline before exporting.');
    let s = 260,
      h = 900 * e.zoom,
      n = 42,
      b = 42,
      x = s + h + 24,
      r = b + e.events.length * n + 20,
      g = ['#6a8f00', '#2264aa', '#9a4f00', '#7252a8', '#007c78', '#b13e59'],
      a = e.events
        .map((d, $) => {
          let c = b + $ * n,
            u = s + (d.leftPercent / 100) * h,
            M = Math.max(3, (d.widthPercent / 100) * h),
            w = `${Array.from(d.name).slice(0, 28).join('')}${Array.from(d.name).length > 28 ? '\u2026' : ''}`;
          return `<g><title>${R(d.name)}</title><text x="12" y="${c + 17}" font-size="14">${R(w)}</text><text x="12" y="${c + 33}" font-size="11" fill="#555">${d.start}${d.end !== d.start ? ` \u2013 ${d.end}` : ''}</text><rect x="${u.toFixed(2)}" y="${c + 3}" width="${M.toFixed(2)}" height="22" rx="6" fill="${g[$ % g.length]}"/></g>`;
        })
        .join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title description" width="${x}" height="${r}" viewBox="0 0 ${x} ${r}"><title id="title">${R(f)}</title><desc id="description">${e.events.length} chronologically ordered events from ${new Date(e.firstMs).toISOString().slice(0, 10)} to ${new Date(e.lastMs).toISOString().slice(0, 10)}.</desc><rect width="100%" height="100%" fill="#fff"/><line x1="${s}" y1="24" x2="${s}" y2="${r - 8}" stroke="#bbb"/>${a}</svg>`;
  }
  var S = document.querySelector('[data-tool="timeline-maker"]');
  if (S) {
    let P = function () {
        if (u().length >= 80) {
          c('maximum');
          return;
        }
        let t = u()[0].cloneNode(!0),
          o = u().length + 1,
          i = d++;
        t.querySelector('[data-event-legend]').textContent = e.fields.eventLegend.replace(
          '{number}',
          String(o),
        );
        for (let [m, p] of [
          ['[data-event-name]', 'name'],
          ['[data-event-start]', 'start'],
          ['[data-event-end]', 'end'],
        ]) {
          let T = t.querySelector(m);
          ((T.value = ''), (T.id = `timeline-event-${p}-${i}`), T.removeAttribute('aria-invalid'));
        }
        for (let m of t.querySelectorAll('label[for]')) {
          let p = m.querySelector('input');
          p && (m.htmlFor = p.id);
        }
        let y = t.querySelector('[data-action="removeEvent"]');
        ((y.hidden = !1),
          s.append(t),
          t.querySelector('[data-event-name]').focus(),
          M(),
          (a = null),
          (n.hidden = !0),
          c('added'));
      },
      I = function (t) {
        let i = 720 * t.zoom,
          y = 42,
          m = 38,
          p = 260 + i + 24,
          T = m + t.events.length * y + 18,
          q = 'http://www.w3.org/2000/svg',
          v = document.createElementNS(q, 'svg');
        (v.classList.add('timeline-maker__chart'),
          v.setAttribute('viewBox', `0 0 ${p} ${T}`),
          v.setAttribute('width', String(p)),
          v.setAttribute('height', String(T)),
          v.setAttribute('role', 'img'),
          v.setAttribute('aria-label', e.fields.chartLabel));
        let U = ['#6a8f00', '#2264aa', '#9a4f00', '#7252a8', '#007c78', '#b13e59'],
          C = document.createElementNS(q, 'line');
        (C.setAttribute('x1', String(260)),
          C.setAttribute('x2', String(260)),
          C.setAttribute('y1', '22'),
          C.setAttribute('y2', String(T - 8)),
          C.setAttribute('stroke', '#9aa0a6'),
          v.append(C),
          t.events.forEach((l, _) => {
            let D = m + _ * y,
              E = document.createElementNS(q, 'text'),
              X = Array.from(l.name).slice(0, 28).join('');
            (E.setAttribute('x', '12'),
              E.setAttribute('y', String(D + 16)),
              E.setAttribute('font-size', '14'),
              E.setAttribute('aria-label', l.name),
              (E.textContent = `${X}${Array.from(l.name).length > 28 ? '\u2026' : ''}`));
            let N = document.createElementNS(q, 'text');
            (N.setAttribute('x', '12'),
              N.setAttribute('y', String(D + 32)),
              N.setAttribute('font-size', '11'),
              N.setAttribute('fill', '#555'),
              (N.textContent =
                l.start === l.end ? w(l.start) : `${w(l.start)} \u2013 ${w(l.end)}`));
            let A = document.createElementNS(q, 'rect');
            (A.setAttribute('x', String(260 + (l.leftPercent / 100) * i)),
              A.setAttribute('y', String(D + 3)),
              A.setAttribute('width', String(Math.max(3, (l.widthPercent / 100) * i))),
              A.setAttribute('height', '22'),
              A.setAttribute('rx', '6'),
              A.setAttribute('fill', U[_ % U.length]));
            let O = document.createElementNS(q, 'title');
            ((O.textContent = `${l.name}: ${l.start} \u2013 ${l.end}`),
              A.append(O),
              v.append(E, N, A));
          }),
          b.replaceChildren(v),
          (r.textContent = `${e.fields.dateRange}: ${w(new Date(t.firstMs).toISOString().slice(0, 10))} \u2013 ${w(new Date(t.lastMs).toISOString().slice(0, 10))} \xB7 ${e.fields.totalEvents}: ${t.events.length}`),
          x.replaceChildren());
        for (let l of t.events) {
          let _ = document.createElement('tr');
          for (let D of [l.name, w(l.start), w(l.end)]) {
            let E = document.createElement('td');
            ((E.textContent = D), _.append(E));
          }
          x.append(_);
        }
        n.hidden = !1;
        for (let l of ['downloadSvg', 'downloadCsv'])
          S.querySelector(`[data-action="${l}"]`).disabled = !1;
      },
      j = function (t, o, i, y) {
        try {
          let m = URL.createObjectURL(new Blob([t], { type: o })),
            p = document.createElement('a');
          ((p.href = m),
            (p.download = i),
            p.click(),
            setTimeout(() => URL.revokeObjectURL(m), 1e4),
            c(y));
        } catch {
          c('exportUnavailable');
        }
      },
      e = JSON.parse(S.querySelector('[data-tool-copy]')?.textContent ?? '{}'),
      f = S.querySelector('[data-timeline-form]'),
      s = S.querySelector('[data-events]'),
      h = S.querySelector('[data-status]'),
      n = S.querySelector('[data-results]'),
      b = S.querySelector('[data-chart]'),
      x = S.querySelector('[data-timeline-table]'),
      r = S.querySelector('[data-range]'),
      g = S.querySelector('[data-zoom]'),
      a = null,
      d = 3,
      $ = (t) => e.messages[t] ?? '',
      c = (t) => {
        h.textContent = $(t);
      },
      u = () => [...s.querySelectorAll('[data-event-row]')],
      M = () => {
        let t = u();
        for (let o of t) o.querySelector('[data-action="removeEvent"]').hidden = t.length <= 2;
        S.querySelector('[data-action="addEvent"]').disabled = t.length >= 80;
      },
      z = () =>
        u().map((t) => ({
          name: t.querySelector('[data-event-name]').value,
          start: t.querySelector('[data-event-start]').value,
          end: t.querySelector('[data-event-end]').value,
        })),
      w = (t) =>
        new Intl.DateTimeFormat(document.documentElement.lang || void 0, {
          dateStyle: 'medium',
          timeZone: 'UTC',
        }).format(new Date(`${t}T00:00:00Z`));
    (f.addEventListener('submit', (t) => {
      t.preventDefault();
      try {
        ((a = L(z(), { zoom: Number(g.value) })), I(a), c('created'));
      } catch (o) {
        c(
          o instanceof RangeError && /limited to 80 events/u.test(o.message)
            ? 'maximum'
            : 'invalid',
        );
      }
    }),
      f.addEventListener('input', () => {
        a && ((a = null), (n.hidden = !0));
      }),
      g.addEventListener('change', () => {
        a &&
          ((a = L(
            a.events.map(({ name: t, start: o, end: i }) => ({ name: t, start: o, end: i })),
            { zoom: Number(g.value) },
          )),
          I(a));
      }),
      S.addEventListener('click', (t) => {
        let o = t.target.closest('button[data-action]');
        if (!(!o || !S.contains(o))) {
          if (o.matches('[data-action="addEvent"]')) {
            P();
            return;
          }
          if (o.matches('[data-action="example"]')) {
            let i = e.example.values;
            if (Array.isArray(i) && i.length >= 2) {
              for (let m of u().slice(2)) m.remove();
              let y = u();
              (i.slice(0, 2).forEach((m, p) => {
                ((y[p].querySelector('[data-event-name]').value = m.name),
                  (y[p].querySelector('[data-event-start]').value = m.start),
                  (y[p].querySelector('[data-event-end]').value = m.end));
              }),
                (g.value = '1'),
                (a = null),
                (n.hidden = !0),
                M(),
                c('exampleLoaded'));
            }
            return;
          }
          if (o.matches('[data-action="removeEvent"]')) {
            if (u().length <= 2) return;
            (o.closest('[data-event-row]').remove(),
              u().forEach((i, y) => {
                i.querySelector('[data-event-legend]').textContent = e.fields.eventLegend.replace(
                  '{number}',
                  String(y + 1),
                );
              }),
              M(),
              (a = null),
              (n.hidden = !0),
              c('removed'));
            return;
          }
          if (o.matches('[data-action="reset"]')) {
            for (let i of u())
              i.querySelectorAll('input').forEach((y) => {
                y.value = '';
              });
            for (let i of u().slice(2)) i.remove();
            ((g.value = '1'), (d = 3), M(), (a = null), (n.hidden = !0), c('cleared'));
            return;
          }
          if (!a) {
            c('emptyExport');
            return;
          }
          (o.matches('[data-action="downloadSvg"]') &&
            j(
              Y(a, { title: e.name }),
              'image/svg+xml;charset=utf-8',
              'usefulverse-timeline.svg',
              'exportedSvg',
            ),
            o.matches('[data-action="downloadCsv"]') &&
              j(W(a), 'text/csv;charset=utf-8', 'usefulverse-timeline.csv', 'exportedCsv'));
        }
      }),
      M());
  }
})();
