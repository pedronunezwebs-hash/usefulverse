(() => {
  var J = Object.freeze({
    'A+': 4,
    A: 4,
    'A-': 3.7,
    'B+': 3.3,
    B: 3,
    'B-': 2.7,
    'C+': 2.3,
    C: 2,
    'C-': 1.7,
    'D+': 1.3,
    D: 1,
    'D-': 0.7,
    F: 0,
  });
  function _(o, e = 'en') {
    let t = String(o)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (r) => String(r.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (r) => String(r.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (r) => String(r.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (r) => String(r.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!t) return Number.NaN;
    let u = new Intl.NumberFormat(e).formatToParts(12345.6),
      f = u.find((r) => r.type === 'decimal')?.value ?? '.',
      s = u.find((r) => r.type === 'group')?.value ?? ',';
    return (
      (t = t.replace(/[\s\u00a0\u202f]/gu, '')),
      f === ','
        ? t.includes(',')
          ? (t = t.replaceAll(s, '').replace(',', '.'))
          : s === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(t) && (t = t.replaceAll('.', ''))
        : f === '.'
          ? t.includes('.')
            ? ((s === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(t) ||
                (s !== ',' && t.includes(s))) &&
              (t = t.replaceAll(s, ''))
            : t.includes(s) &&
              (t =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(t) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(t)
                  ? t.replaceAll(s, '')
                  : t.replace(s, '.'))
          : t.includes(f) && (t = t.replaceAll(s, '').replace(f, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(t) ? Number(t) : Number.NaN
    );
  }
  var K = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  function U(o = document) {
    let e = o.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function h(o, e, t = 'info') {
    let u = o.querySelector('[data-status]');
    u && ((u.textContent = e), (u.dataset.kind = t));
  }
  function T(o) {
    let e = o.querySelector('[data-result]'),
      t = o.querySelector('[data-result-content]');
    (e && (e.hidden = !0), t && t.replaceChildren());
  }
  function v(o, e, t = 2) {
    return new Intl.NumberFormat(o, { maximumFractionDigits: t }).format(e);
  }
  async function z(o, e, t) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(e), h(o, t.messages.copied, 'success'));
    } catch {
      h(o, t.messages.copyUnavailable, 'error');
    }
  }
  function k(o, { targetMinutes: e = 480 } = {}) {
    if (!Array.isArray(o) || o.length < 1 || o.length > 14)
      throw new RangeError('Enter 1 to 14 nights.');
    if (!Number.isInteger(e) || e < 180 || e > 720)
      throw new RangeError('Choose a reference between 3 and 12 hours.');
    let t = o.map((r, d) => {
        let l = Number(r);
        if (!Number.isInteger(l) || l < 0 || l > 1440)
          throw new RangeError(`Night ${d + 1} must be between 0 and 1,440 minutes.`);
        let C = Math.max(0, e - l),
          I = Math.max(0, l - e);
        return Object.freeze({
          index: d + 1,
          sleepMinutes: l,
          shortfallMinutes: C,
          aboveReferenceMinutes: I,
        });
      }),
      u = t.reduce((r, d) => r + d.shortfallMinutes, 0),
      f = t.reduce((r, d) => r + d.aboveReferenceMinutes, 0),
      s = t.reduce((r, d) => r + d.sleepMinutes, 0);
    return Object.freeze({
      targetMinutes: e,
      count: t.length,
      totalSleepMinutes: s,
      averageSleepMinutes: s / t.length,
      shortfallMinutes: u,
      aboveReferenceMinutes: f,
      nightsBelowReference: t.filter(({ shortfallMinutes: r }) => r > 0).length,
      nightsAtOrAboveReference: t.filter(({ shortfallMinutes: r }) => r === 0).length,
      largestShortfallMinutes: Math.max(0, ...t.map(({ shortfallMinutes: r }) => r)),
      entries: Object.freeze(t),
    });
  }
  var Z = Object.freeze({
    minNights: 1,
    maxNights: 14,
    minTargetMinutes: 180,
    maxTargetMinutes: 720,
    maxSleepMinutesPerNight: 1440,
  });
  var i = document.querySelector('[data-tool="sleep-debt-calculator"]');
  if (i) {
    let l = function (n) {
        return `${v(s(), n / 60, 2)} h`;
      },
      C = function () {
        let n = o.elements.namedItem('sleepInput').value.trim();
        if (!n || n.length > 1e3) throw new RangeError('Enter the sleep hours.');
        let a = n.split(/[\s;|]+/u).filter(Boolean);
        if (a.length < 1 || a.length > 14) throw new RangeError('Enter 1 to 14 nights.');
        return a.map((m) => {
          let c = _(m, s());
          if (!Number.isFinite(c) || c < 0 || c > 24)
            throw new RangeError('Sleep hours must be between 0 and 24.');
          return Math.round(c * 60);
        });
      },
      I = function () {
        let n = _(o.elements.namedItem('targetHours').value, s());
        if (!Number.isFinite(n) || n < 3 || n > 12)
          throw new RangeError('Choose a reference between 3 and 12 hours.');
        return Math.round(n * 60);
      },
      O = function (n) {
        let a = [
            [e.fields.summaryShortfall, l(n.shortfallMinutes)],
            [e.fields.summaryAverage, l(n.averageSleepMinutes)],
            [e.fields.summaryNightsBelow, v(s(), n.nightsBelowReference, 0)],
            [e.fields.summaryAbove, l(n.aboveReferenceMinutes)],
            [e.fields.targetReference, l(n.targetMinutes)],
          ],
          m = document.createElement('dl');
        for (let [c, b] of a) {
          let g = document.createElement('dt');
          g.textContent = c;
          let M = document.createElement('dd');
          ((M.textContent = b), m.append(g, M));
        }
        u.append(m);
      },
      B = function (n) {
        let a = 'http://www.w3.org/2000/svg',
          N = Math.max(8, n.targetMinutes / 60, ...n.entries.map(({ sleepMinutes: S }) => S / 60)),
          x = document.createElementNS(a, 'svg');
        (x.setAttribute('viewBox', '0 0 720 250'),
          x.setAttribute('role', 'img'),
          x.setAttribute('aria-labelledby', 'sleep-debt-chart-title sleep-debt-chart-desc'),
          x.classList.add('sleep-debt-chart'));
        let p = (S, A, R) => {
          let y = document.createElementNS(a, S);
          for (let [G, Y] of Object.entries(A)) y.setAttribute(G, String(Y));
          return (R !== void 0 && (y.textContent = R), x.append(y), y);
        };
        (p('title', { id: 'sleep-debt-chart-title' }, e.fields.chartDescription),
          p(
            'desc',
            { id: 'sleep-debt-chart-desc' },
            `${e.fields.summaryShortfall}: ${l(n.shortfallMinutes)}. ${e.fields.summaryAbove}: ${l(n.aboveReferenceMinutes)}.`,
          ));
        let q = (S) => 196 - (S / N) * 172;
        (p('line', { x1: 44, y1: 24, x2: 44, y2: 196, class: 'sleep-debt-axis' }),
          p('line', { x1: 44, y1: 196, x2: 704, y2: 196, class: 'sleep-debt-axis' }));
        let L = q(n.targetMinutes / 60);
        (p('line', { x1: 44, y1: L, x2: 704, y2: L, class: 'sleep-debt-target' }),
          p(
            'text',
            { x: 704, y: Math.max(14, L - 6), 'text-anchor': 'end', class: 'sleep-debt-label' },
            `${e.fields.targetReference}: ${l(n.targetMinutes)}`,
          ));
        let D = 660 / n.entries.length,
          H = Math.min(30, D * 0.56);
        return (
          n.entries.forEach((S, A) => {
            let R = 44 + D * (A + 0.5),
              y = q(S.sleepMinutes / 60);
            (p('rect', {
              x: R - H / 2,
              y,
              width: H,
              height: Math.max(1, 196 - y),
              rx: 3,
              class: 'sleep-debt-bar',
            }),
              p(
                'text',
                { x: R, y: 216, 'text-anchor': 'middle', class: 'sleep-debt-tick' },
                v(s(), A + 1, 0),
              ));
          }),
          p(
            'text',
            { x: 36, y: 236, 'text-anchor': 'end', class: 'sleep-debt-label' },
            e.fields.night,
          ),
          x
        );
      },
      j = function (n) {
        let a = document.createElement('div');
        ((a.className = 'sleep-debt-table-scroll'),
          (a.tabIndex = 0),
          a.setAttribute('role', 'region'),
          a.setAttribute('aria-label', e.fields.tableCaption));
        let m = document.createElement('table');
        m.className = 'sleep-debt-table';
        let c = document.createElement('caption');
        ((c.textContent = e.fields.tableCaption), m.append(c));
        let b = [e.fields.night, e.fields.sleep, e.fields.shortfall, e.fields.aboveReference],
          g = document.createElement('thead'),
          M = document.createElement('tr');
        (b.forEach((E) => {
          let w = document.createElement('th');
          ((w.scope = 'col'), (w.textContent = E), M.append(w));
        }),
          g.append(M),
          m.append(g));
        let F = document.createElement('tbody');
        (n.entries.forEach((E) => {
          let w = document.createElement('tr'),
            N = document.createElement('th');
          ((N.scope = 'row'),
            (N.textContent = `${e.fields.night} ${v(s(), E.index, 0)}`),
            w.append(N));
          for (let x of [E.sleepMinutes, E.shortfallMinutes, E.aboveReferenceMinutes]) {
            let p = document.createElement('td');
            ((p.textContent = l(x)), w.append(p));
          }
          F.append(w);
        }),
          m.append(F),
          a.append(m),
          u.append(a));
      },
      X = function (n, a) {
        if (f.checked)
          try {
            (localStorage.setItem(r, JSON.stringify({ version: 1, entries: n, targetMinutes: a })),
              h(i, e.messages.saved, 'success'));
          } catch {
            h(i, e.messages.saveUnavailable, 'error');
          }
      },
      $ = function (n) {
        (n?.preventDefault(), T(i), u.replaceChildren(), (d = ''));
        try {
          let a = C(),
            m = I(),
            c = k(a, { targetMinutes: m }),
            b = document.createElement('figure');
          ((b.className = 'sleep-debt-figure'),
            b.append(B(c)),
            u.append(b),
            O(c),
            j(c),
            (t.hidden = !1),
            (d = [
              `${e.fields.targetReference}: ${l(c.targetMinutes)}`,
              `${e.fields.summaryShortfall}: ${l(c.shortfallMinutes)}`,
              `${e.fields.summaryAbove}: ${l(c.aboveReferenceMinutes)}`,
              `${e.fields.night}	${e.fields.sleep}	${e.fields.shortfall}	${e.fields.aboveReference}`,
              ...c.entries.map((g) =>
                [
                  g.index,
                  l(g.sleepMinutes),
                  l(g.shortfallMinutes),
                  l(g.aboveReferenceMinutes),
                ].join('	'),
              ),
            ].join(`
`)),
            X(a, m),
            f.checked || h(i, e.messages.calculated, 'success'));
        } catch {
          h(i, e.messages.checkInputs, 'error');
        }
      },
      V = function () {
        try {
          let n = JSON.parse(localStorage.getItem(r) ?? 'null');
          if (!n) return !1;
          if (
            n.version !== 1 ||
            !Array.isArray(n.entries) ||
            n.entries.length < 1 ||
            n.entries.length > 14 ||
            !Number.isInteger(n.targetMinutes) ||
            n.targetMinutes < 180 ||
            n.targetMinutes > 720 ||
            n.entries.some((a) => !Number.isInteger(a) || a < 0 || a > 1440)
          )
            throw new Error('Invalid saved log.');
          return (
            (o.elements.namedItem('sleepInput').value = n.entries
              .map((a) => v(s(), a / 60, 2))
              .join('; ')),
            (o.elements.namedItem('targetHours').value = v(s(), n.targetMinutes / 60, 2)),
            $(),
            !0
          );
        } catch {
          return (h(i, e.messages.saveUnavailable, 'error'), !1);
        }
      },
      o = i.querySelector('#tool-form'),
      e = U(i),
      t = i.querySelector('[data-result]'),
      u = i.querySelector('[data-result-content]'),
      f = o.elements.namedItem('saveConsent'),
      s = () => document.documentElement.lang || 'en',
      r = 'usefulverse:sleep-debt-log:v1',
      d = '';
    (o.addEventListener('submit', $),
      o.addEventListener('input', () => {
        (T(i), u.replaceChildren(), (d = ''), h(i, ''));
      }),
      o.addEventListener('reset', () => {
        (T(i), u.replaceChildren(), (d = ''), h(i, ''));
      }),
      i.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((o.elements.namedItem('sleepInput').value = Array(7).fill('7').join('; ')),
          (o.elements.namedItem('targetHours').value = '8'),
          $(),
          h(i, e.messages.exampleLoaded, 'success'));
      }),
      f.addEventListener('change', () => {
        f.checked && V() && h(i, e.messages.saved, 'success');
      }),
      i.querySelector('[data-action="clearSaved"]')?.addEventListener('click', () => {
        try {
          (localStorage.removeItem(r), (f.checked = !1), h(i, e.messages.deleted, 'success'));
        } catch {
          h(i, e.messages.saveUnavailable, 'error');
        }
      }),
      i.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        d && z(i, d, e);
      }));
  }
})();
