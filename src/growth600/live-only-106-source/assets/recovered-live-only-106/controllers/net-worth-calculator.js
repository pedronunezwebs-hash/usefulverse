(() => {
  var U = Object.freeze({
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
  function F(n, e = 'en') {
    let t = String(n)
      .normalize('NFKC')
      .replace(/[०-९]/gu, (o) => String(o.codePointAt(0) - 2406))
      .replace(/[০-৯]/gu, (o) => String(o.codePointAt(0) - 2534))
      .replace(/[٠-٩]/gu, (o) => String(o.codePointAt(0) - 1632))
      .replace(/[۰-۹]/gu, (o) => String(o.codePointAt(0) - 1776))
      .replace(/\u066b/gu, '.')
      .replace(/\u066c/gu, '')
      .trim();
    if (!t) return Number.NaN;
    let a = new Intl.NumberFormat(e).formatToParts(12345.6),
      l = a.find((o) => o.type === 'decimal')?.value ?? '.',
      i = a.find((o) => o.type === 'group')?.value ?? ',';
    return (
      (t = t.replace(/[\s\u00a0\u202f]/gu, '')),
      l === ','
        ? t.includes(',')
          ? (t = t.replaceAll(i, '').replace(',', '.'))
          : i === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(t) && (t = t.replaceAll('.', ''))
        : l === '.'
          ? t.includes('.')
            ? ((i === ','
                ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u
                : null
              )?.test(t) ||
                (i !== ',' && t.includes(i))) &&
              (t = t.replaceAll(i, ''))
            : t.includes(i) &&
              (t =
                /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(t) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(t)
                  ? t.replaceAll(i, '')
                  : t.replace(i, '.'))
          : t.includes(l) && (t = t.replaceAll(i, '').replace(l, '.')),
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(t) ? Number(t) : Number.NaN
    );
  }
  var W = Object.freeze({ ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 1 / 30.48 });
  var k = new Set(['asset', 'liability']);
  function N(n = []) {
    if (!Array.isArray(n) || n.length > 100)
      throw new RangeError('Enter no more than 100 balance items.');
    let e = n.map((c) => {
        let u = String(c?.type ?? ''),
          f = String(c?.category ?? '').trim(),
          b = Number(c?.amount);
        if (!k.has(u) || !f || f.length > 80 || !Number.isFinite(b) || b < 0 || b > 1e12)
          throw new RangeError(
            'Check each balance item. Amounts must be non-negative and within the supported range.',
          );
        return Object.freeze({ type: u, category: f, amount: b });
      }),
      t = e.filter(({ type: c }) => c === 'asset').reduce((c, { amount: u }) => c + u, 0),
      a = e.filter(({ type: c }) => c === 'liability').reduce((c, { amount: u }) => c + u, 0),
      l = t - a;
    if (![t, a, l].every(Number.isFinite))
      throw new RangeError('The totals exceed the safe calculation range.');
    let i = O(e, 'asset'),
      o = O(e, 'liability');
    return Object.freeze({
      items: Object.freeze(e),
      totalAssets: t,
      totalLiabilities: a,
      netWorth: l,
      debtToAssetPercent: t > 0 ? (a / t) * 100 : null,
      assetCategories: i,
      liabilityCategories: o,
    });
  }
  function O(n, e) {
    let t = new Map();
    for (let a of n) a.type === e && t.set(a.category, (t.get(a.category) ?? 0) + a.amount);
    return Object.freeze([...t].map(([a, l]) => Object.freeze({ category: a, amount: l })));
  }
  function C(n, e) {
    if (!Array.isArray(n) || n.length > 120) throw new RangeError('Keep up to 120 snapshots.');
    let t = String(e?.date ?? '');
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(t)) throw new RangeError('Choose a valid snapshot date.');
    let a = new Date(`${t}T00:00:00.000Z`);
    if (Number.isNaN(a.valueOf()) || a.toISOString().slice(0, 10) !== t)
      throw new RangeError('Choose a valid snapshot date.');
    let l = String(e?.currency ?? '').toUpperCase();
    if (!/^[A-Z]{3}$/u.test(l)) throw new RangeError('Use a three-letter currency code.');
    let i = N(e?.items),
      o = Object.freeze({
        date: t,
        currency: l,
        items: i.items,
        totalAssets: i.totalAssets,
        totalLiabilities: i.totalLiabilities,
        netWorth: i.netWorth,
      }),
      c = n
        .filter((u) => u.date !== t)
        .concat(o)
        .sort((u, f) => u.date.localeCompare(f.date));
    return (c.length > 120 && c.splice(0, c.length - 120), Object.freeze(c));
  }
  function I(n, e) {
    if (!n || !e || n.currency !== e.currency) return null;
    let t = n.netWorth - e.netWorth;
    return Object.freeze({
      change: t,
      percentChange: e.netWorth === 0 ? null : (t / Math.abs(e.netWorth)) * 100,
    });
  }
  function D(n) {
    let e = String(n ?? '');
    return (/^[\s]*[=+@\-]/u.test(e) && (e = `'${e}`), `"${e.replaceAll('"', '""')}"`);
  }
  function q(n) {
    if (!Array.isArray(n) || n.length > 120) throw new RangeError('Invalid snapshot list.');
    let e = [
      [
        'Date',
        'Currency',
        'Type',
        'Category',
        'Amount',
        'Total assets',
        'Total liabilities',
        'Net worth',
      ],
    ];
    for (let t of n) {
      let a = C([], t)[0];
      for (let l of a.items)
        e.push([
          a.date,
          a.currency,
          l.type,
          l.category,
          l.amount,
          a.totalAssets,
          a.totalLiabilities,
          a.netWorth,
        ]);
    }
    return `${e.map((t) => t.map(D).join(',')).join(`\r
`)}\r
`;
  }
  var X = Object.freeze({ maxAmount: 1e12, maxItems: 100, maxSnapshots: 120 });
  var h = document.querySelector('[data-tool="net-worth-calculator"]');
  if (h) {
    let d = function (r, s = 'info') {
        ((t.textContent = r), (t.dataset.kind = s));
      },
      R = function (r) {
        return new Intl.NumberFormat(u(), { maximumFractionDigits: 2 }).format(r);
      },
      y = function (r, s) {
        try {
          return new Intl.NumberFormat(u(), {
            style: 'currency',
            currency: s,
            maximumFractionDigits: 2,
          }).format(r);
        } catch {
          return `${R(r)} ${s}`;
        }
      },
      z = function () {
        let r = n.elements.namedItem('currencyCode').value.trim().toUpperCase();
        if (!/^[A-Z]{3}$/u.test(r)) throw new RangeError('currency');
        let s = b.map(([g, , E], w) => ({
          type: g,
          category: M[w],
          amount: F(n.elements.namedItem(E).value, u()),
        }));
        return { currency: r, items: s };
      },
      T = function () {
        try {
          let r = JSON.parse(localStorage.getItem(f) ?? '[]');
          if (!Array.isArray(r) || r.length > 120) throw new Error('bad');
          return ((m = r.reduce((s, g) => C(s, g), [])), !0);
        } catch {
          return ((m = []), !1);
        }
      },
      S = function () {
        i.replaceChildren();
        for (let r of m) {
          let s = document.createElement('li');
          ((s.textContent = `${r.date} \xB7 ${y(r.netWorth, r.currency)}`), i.append(s));
        }
        if (!m.length) {
          let r = document.createElement('li');
          ((r.textContent = e.fields.noSnapshots), i.append(r));
        }
      },
      $ = function (r, s) {
        let g = [
          [e.fields.totalAssets, y(r.totalAssets, s)],
          [e.fields.totalLiabilities, y(r.totalLiabilities, s)],
          [e.fields.netWorth, y(r.netWorth, s)],
          [
            e.fields.debtToAsset,
            r.debtToAssetPercent === null ? '\u2014' : `${R(r.debtToAssetPercent)}%`,
          ],
        ];
        if (o.checked && m.length) {
          let w = [...m].reverse().find((A) => A.currency === s),
            x = w && I({ ...r, currency: s }, w);
          x && g.push([`${w.date} comparison`, y(x.change, s)]);
        }
        l.replaceChildren();
        let E = document.createElement('dl');
        for (let [w, x] of g) {
          let A = document.createElement('dt');
          A.textContent = w;
          let L = document.createElement('dd');
          ((L.textContent = x), E.append(A, L));
        }
        (l.append(E), (a.hidden = !1), (c.disabled = !o.checked));
      },
      _ = function (r) {
        r?.preventDefault();
        try {
          let { currency: s, items: g } = z();
          ((p = N(g)),
            (v = g),
            o.checked && T(),
            $(p, s),
            S(),
            d(e.messages.calculated, 'success'));
        } catch {
          ((p = null), (c.disabled = !0), d(e.messages.checkInputs, 'error'));
        }
      },
      n = h.querySelector('#tool-form'),
      e = JSON.parse(h.querySelector('[data-tool-copy]').textContent),
      t = h.querySelector('[data-status]'),
      a = h.querySelector('[data-result]'),
      l = h.querySelector('[data-net-worth-results]'),
      i = h.querySelector('[data-net-worth-history]'),
      o = n.elements.namedItem('consent'),
      c = h.querySelector('[data-action="saveSnapshot"]'),
      u = () => document.documentElement.lang || 'en',
      f = 'usefulverse-net-worth-snapshots-v1',
      b = [
        ['asset', 'Cash and savings', 'asset-cash'],
        ['asset', 'Investments', 'asset-investments'],
        ['asset', 'Property estimate', 'asset-property'],
        ['asset', 'Vehicles and valuables', 'asset-vehicles'],
        ['asset', 'Other assets', 'asset-other'],
        ['liability', 'Credit cards', 'liability-creditCards'],
        ['liability', 'Mortgage', 'liability-mortgage'],
        ['liability', 'Student loans', 'liability-studentLoans'],
        ['liability', 'Auto loans', 'liability-autoLoans'],
        ['liability', 'Other liabilities', 'liability-other'],
      ],
      M = [
        e.fields.assetCash,
        e.fields.assetInvestments,
        e.fields.assetProperty,
        e.fields.assetVehicles,
        e.fields.assetOther,
        e.fields.liabilityCreditCards,
        e.fields.liabilityMortgage,
        e.fields.liabilityStudentLoans,
        e.fields.liabilityAutoLoans,
        e.fields.liabilityOther,
      ],
      p = null,
      v = [],
      m = [];
    if (
      (n.addEventListener('submit', _),
      n.addEventListener('input', () => {
        ((p = null), (c.disabled = !0));
      }),
      o.addEventListener('change', () => {
        ((c.disabled = !o.checked || !p),
          o.checked && !T() && d(e.messages.storageUnavailable, 'error'),
          p && $(p, n.elements.namedItem('currencyCode').value.trim().toUpperCase()),
          S());
      }),
      !n.elements.namedItem('date').value)
    ) {
      let r = new Date();
      n.elements.namedItem('date').value =
        `${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, '0')}-${String(r.getDate()).padStart(2, '0')}`;
    }
    (c.addEventListener('click', () => {
      if (!o.checked) return d(e.messages.consentRequired, 'error');
      if (!p) return d(e.messages.checkInputs, 'error');
      try {
        let r = n.elements.namedItem('date').value,
          s = n.elements.namedItem('currencyCode').value.trim().toUpperCase();
        ((m = C(m, { date: r, currency: s, items: v })),
          localStorage.setItem(f, JSON.stringify(m)),
          S(),
          d(e.messages.saved, 'success'));
      } catch {
        d(e.messages.storageUnavailable, 'error');
      }
    }),
      h.querySelector('[data-action="deleteHistory"]')?.addEventListener('click', () => {
        if (!o.checked) return d(e.messages.consentRequired, 'error');
        try {
          (localStorage.removeItem(f), (m = []), S(), d(e.messages.deleted, 'success'));
        } catch {
          d(e.messages.storageUnavailable, 'error');
        }
      }),
      h.querySelector('[data-action="exportCsv"]')?.addEventListener('click', () => {
        if (!o.checked) return d(e.messages.consentRequired, 'error');
        if (!m.length) return d(e.messages.nothingToExport, 'error');
        let r = URL.createObjectURL(new Blob([q(m)], { type: 'text/csv;charset=utf-8' })),
          s = document.createElement('a');
        ((s.href = r),
          (s.download = 'net-worth-history.csv'),
          s.click(),
          setTimeout(() => URL.revokeObjectURL(r), 0),
          d(e.messages.exported ?? e.messages.saved, 'success'));
      }),
      S());
  }
})();
