(() => {
  function O(t = document) {
    let e = t.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function b(t, e, n = 'info') {
    let o = t.querySelector('[data-status]');
    o && ((o.textContent = e), (o.dataset.kind = n));
  }
  function P(t) {
    let e = t.querySelector('[data-result]'),
      n = t.querySelector('[data-result-content]');
    (e && (e.hidden = !0), n && n.replaceChildren());
  }
  function v(t, e, n = 2) {
    return new Intl.NumberFormat(t, { maximumFractionDigits: n }).format(e);
  }
  async function L(t, e, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(e), b(t, n.messages.copied, 'success'));
    } catch {
      b(t, n.messages.copyUnavailable, 'error');
    }
  }
  function j(t) {
    if (typeof t != 'string' || t.length > 2e3)
      throw new RangeError('Set input is required and limited to 2,000 characters.');
    let e = t
      .split(/\r?\n/u)
      .map((n) => n.trim())
      .filter(Boolean);
    if (e.length < 1 || e.length > 20) throw new RangeError('Enter 1 to 20 non-empty sets.');
    return Object.freeze(
      e.map((n, o) => {
        if (!/^\d{1,3}$/u.test(n))
          throw new RangeError(`Set ${o + 1} must be a whole-number repetition count.`);
        let c = Number(n);
        if (c < 0 || c > 500)
          throw new RangeError(`Set ${o + 1} must be between 0 and 500 repetitions.`);
        return c;
      }),
    );
  }
  function F(t, e = 0) {
    if (!Array.isArray(t) || t.length < 1 || t.length > 20)
      throw new RangeError('Enter 1 to 20 sets.');
    let n = Number(e);
    if (!Number.isInteger(n) || n < 0 || n > 3600)
      throw new RangeError('Rest must be 0 to 3600 whole seconds.');
    let o = t.map((S, x) => {
        let p = Number(S);
        if (!Number.isInteger(p) || p < 0 || p > 500)
          throw new RangeError(`Set ${x + 1} repetitions must be 0 to 500.`);
        return p;
      }),
      c = o.reduce((S, x) => S + x, 0);
    return Object.freeze({
      sets: Object.freeze(o),
      setCount: o.length,
      totalReps: c,
      bestSet: Math.max(...o),
      averageReps: c / o.length,
      restSeconds: n,
      totalRestSeconds: n * Math.max(0, o.length - 1),
      zeroRepSets: o.filter((S) => S === 0).length,
    });
  }
  function z(t) {
    if (
      typeof t != 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/u.test(t) ||
      t < '1970-01-01' ||
      t > '2100-12-31'
    )
      return !1;
    let [e, n, o] = t.split('-').map(Number),
      c = new Date(Date.UTC(e, n - 1, o));
    return (
      Number.isFinite(c.valueOf()) &&
      c.getUTCFullYear() === e &&
      c.getUTCMonth() === n - 1 &&
      c.getUTCDate() === o
    );
  }
  var K = Object.freeze({
    maxSets: 20,
    maxRepsPerSet: 500,
    maxRestSeconds: 3600,
    maxInputCharacters: 2e3,
  });
  var l = document.querySelector('[data-tool="push-up-test"]');
  if (l) {
    let X = function () {
        let s = localStorage.getItem(x);
        if (!s) return [];
        let m = JSON.parse(s);
        if (
          !Array.isArray(m) ||
          m.length > 30 ||
          m.some(
            (r) =>
              !r ||
              !/^\d{4}-\d{2}-\d{2}$/u.test(r.date) ||
              !Array.isArray(r.sets) ||
              r.sets.length < 1 ||
              r.sets.length > 20 ||
              r.sets.some((a) => !Number.isInteger(a) || a < 0 || a > 500) ||
              (r.notes !== void 0 && (typeof r.notes != 'string' || r.notes.length > 280)) ||
              !Number.isInteger(r.totalReps) ||
              r.totalReps !== r.sets.reduce((a, h) => a + h, 0),
          )
        )
          throw new Error('Invalid saved history.');
        return m;
      },
      g = function (s, m, r, a) {
        let h = document.createElement(m);
        return ((h.textContent = r), a && (h.className = a), s.append(h), h);
      },
      B = function (s) {
        let m = 'http://www.w3.org/2000/svg',
          r = s.slice(-12),
          a = document.createElementNS(m, 'svg');
        (a.setAttribute('viewBox', '0 0 640 190'),
          a.setAttribute('role', 'img'),
          a.setAttribute('aria-labelledby', 'push-up-history-title push-up-history-desc'),
          a.classList.add('push-up-chart'));
        let h = (R, i, d) => {
          let u = document.createElementNS(m, R);
          for (let [C, N] of Object.entries(i)) u.setAttribute(C, String(N));
          return (d !== void 0 && (u.textContent = d), a.append(u), u);
        };
        if (
          (h('title', { id: 'push-up-history-title' }, e.fields.chartDescription),
          h(
            'desc',
            { id: 'push-up-history-desc' },
            `${e.fields.historyTotal}: ${r.map((R) => R.totalReps).join(', ')}`,
          ),
          !r.length)
        )
          return a;
        let E = Math.max(1, ...r.map((R) => R.totalReps)),
          y = 34,
          w = 150,
          $ = 600 / r.length,
          T = Math.min(28, $ * 0.56);
        return (
          h('line', { x1: y, y1: w, x2: 630, y2: w, class: 'push-up-axis' }),
          r.forEach((R, i) => {
            let d = y + $ * i + ($ - T) / 2,
              u = Math.max(R.totalReps ? 2 : 0, (106 * R.totalReps) / E);
            (h('rect', { x: d, y: w - u, width: T, height: u, rx: 3, class: 'push-up-bar' }),
              h(
                'text',
                { x: d + T / 2, y: 174, 'text-anchor': 'middle', class: 'push-up-tick' },
                v(S(), i + 1, 0),
              ));
          }),
          a
        );
      },
      I = function (s, m, r) {
        ((f = { report: s, date: m, notes: r }), o.replaceChildren(), (_ = ''));
        let a = document.createElement('dl');
        a.className = 'push-up-summary';
        let h = [
          [e.fields.totalReps, s.totalReps],
          [e.fields.setCount, s.setCount],
          [e.fields.bestSet, s.bestSet],
          [e.fields.average, v(S(), s.averageReps, 1)],
          [e.fields.totalRest, `${v(S(), s.totalRestSeconds / 60, 1)} min`],
        ];
        for (let [i, d] of h) (g(a, 'dt', i), g(a, 'dd', String(d)));
        (o.append(a), r && g(o, 'p', `${e.fields.notes}: ${r}`, 'push-up-note'));
        let E = document.createElement('div');
        ((E.className = 'push-up-table-scroll'),
          (E.tabIndex = 0),
          E.setAttribute('role', 'region'),
          E.setAttribute('aria-label', e.actions.result));
        let y = document.createElement('table'),
          w = g(y, 'caption', `${e.actions.result} \xB7 ${m}`);
        y.append(w);
        let U = document.createElement('thead'),
          $ = document.createElement('tr');
        for (let i of [e.fields.set, e.fields.reps, e.fields.rest]) {
          let d = g($, 'th', i);
          d.scope = 'col';
        }
        (U.append($), y.append(U));
        let T = document.createElement('tbody');
        (s.sets.forEach((i, d) => {
          let u = document.createElement('tr'),
            C = g(u, 'th', `${e.fields.set} ${v(S(), d + 1, 0)}`);
          ((C.scope = 'row'),
            g(u, 'td', v(S(), i, 0)),
            g(u, 'td', d < s.sets.length - 1 ? `${v(S(), s.restSeconds, 0)} s` : '\u2014'),
            T.append(u));
        }),
          y.append(T),
          E.append(y),
          o.append(E));
        let R = c.checked ? p.slice(-12) : [];
        if (c.checked) {
          let i = document.createElement('section');
          if (((i.className = 'push-up-history'), g(i, 'h3', e.fields.history), !p.length))
            g(i, 'p', e.fields.historyEmpty);
          else {
            let d = document.createElement('figure');
            (d.append(B(R)), i.append(d));
            let u = document.createElement('table'),
              C = g(u, 'caption', e.fields.history);
            u.append(C);
            let N = document.createElement('thead'),
              q = document.createElement('tr');
            for (let M of [e.fields.historyDate, e.fields.historyTotal]) {
              let A = g(q, 'th', M);
              A.scope = 'col';
            }
            (N.append(q), u.append(N));
            let D = document.createElement('tbody');
            (R.forEach((M) => {
              let A = document.createElement('tr'),
                J = g(A, 'th', M.date);
              ((J.scope = 'row'), g(A, 'td', v(S(), M.totalReps, 0)), D.append(A));
            }),
              u.append(D),
              i.append(u));
          }
          o.append(i);
        }
        ((_ = [
          `${e.actions.result}: ${m}`,
          `${e.fields.totalReps}: ${s.totalReps}`,
          `${e.fields.setCount}: ${s.setCount}`,
          `${e.fields.bestSet}: ${s.bestSet}`,
          `${e.fields.totalRest}: ${s.totalRestSeconds} s`,
          ...(r ? [`${e.fields.notes}: ${r}`] : []),
          `${e.fields.set}	${e.fields.reps}	${e.fields.rest}`,
          ...s.sets.map((i, d) => [d + 1, i, d < s.sets.length - 1 ? s.restSeconds : 0].join('	')),
        ].join(`
`)),
          (n.hidden = !1));
      },
      k = function (s) {
        (s?.preventDefault(), P(l), (n.hidden = !0), o.replaceChildren(), (_ = ''));
        let m = 'inputs';
        try {
          let r = j(t.elements.namedItem('repsInput').value),
            a = t.elements.namedItem('restSeconds').value,
            h = a === '' ? 0 : Number(a),
            E = F(r, h),
            y = t.elements.namedItem('date').value;
          if (!z(y)) throw new RangeError('Enter a valid date from 1970 to 2100.');
          let w = t.elements.namedItem('notes').value.trim();
          if (w.length > 280) throw new RangeError('Notes are limited to 280 characters.');
          (c.checked &&
            ((m = 'storage'),
            (p = X()),
            p.push({ date: y, sets: [...E.sets], totalReps: E.totalReps, notes: w }),
            (p = p.slice(-30)),
            localStorage.setItem(x, JSON.stringify(p))),
            (m = 'render'),
            I(E, y, w),
            b(l, c.checked ? e.messages.saved : e.messages.calculated, 'success'));
        } catch {
          b(l, m === 'storage' ? e.messages.saveUnavailable : e.messages.checkInputs, 'error');
        }
      },
      t = l.querySelector('#tool-form'),
      e = O(l),
      n = l.querySelector('[data-result]'),
      o = l.querySelector('[data-result-content]'),
      c = t.elements.namedItem('saveConsent'),
      S = () => document.documentElement.lang || 'en',
      x = 'usefulverse:push-up-test-history:v1',
      p = [],
      _ = '',
      f = null,
      H = () => {
        let s = new Date();
        return `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, '0')}-${String(s.getDate()).padStart(2, '0')}`;
      };
    ((t.elements.namedItem('date').value = H()),
      t.addEventListener('submit', k),
      t.addEventListener('input', (s) => {
        s.target !== c &&
          (P(l), o.replaceChildren(), (n.hidden = !0), (_ = ''), (f = null), b(l, ''));
      }),
      t.addEventListener('reset', () => {
        (P(l), o.replaceChildren(), (n.hidden = !0), (_ = ''), (f = null), b(l, ''));
      }),
      l.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('repsInput').value = `12
10
8`),
          (t.elements.namedItem('restSeconds').value = '60'),
          k(),
          b(l, e.messages.exampleLoaded, 'success'));
      }),
      c.addEventListener('change', () => {
        if (!c.checked) {
          ((p = []), f && I(f.report, f.date, f.notes));
          return;
        }
        try {
          ((p = X()),
            f && I(f.report, f.date, f.notes),
            b(l, p.length ? e.messages.saved : e.fields.historyEmpty, 'status'));
        } catch {
          ((c.checked = !1), (p = []), b(l, e.messages.saveUnavailable, 'error'));
        }
      }),
      l.querySelector('[data-action="clearSaved"]')?.addEventListener('click', () => {
        try {
          (localStorage.removeItem(x),
            (p = []),
            (c.checked = !1),
            f && I(f.report, f.date, f.notes),
            b(l, e.messages.deleted, 'success'));
        } catch {
          b(l, e.messages.saveUnavailable, 'error');
        }
      }),
      l.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        _ && L(l, _, e);
      }));
  }
})();
