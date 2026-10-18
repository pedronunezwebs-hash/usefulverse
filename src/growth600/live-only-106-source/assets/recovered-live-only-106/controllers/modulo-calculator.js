(() => {
  function E(t = document) {
    let e = t.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function h(t, e, n = 'info') {
    let o = t.querySelector('[data-status]');
    o && ((o.textContent = e), (o.dataset.kind = n));
  }
  async function S(t, e, n) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(e), h(t, n.messages.copied, 'success'));
    } catch {
      h(t, n.messages.copyUnavailable, 'error');
    }
  }
  var C = 10n ** 50n;
  function v(t, e) {
    let n = String(t ?? '').trim();
    if (!n || n.length > 52 || !/^[+-]?\d+$/u.test(n))
      throw new RangeError(`${e} must be a whole number with at most 50 digits.`);
    let o = BigInt(n);
    if (o > C || o < -C) throw new RangeError(`${e} must be between \u221210^50 and 10^50.`);
    return o;
  }
  function q({ dividend: t, divisor: e, compare: n = '' }) {
    let o = v(t, 'Dividend'),
      c = v(e, 'Divisor');
    if (c === 0n) throw new RangeError('The divisor cannot be zero.');
    let a = c < 0n ? -c : c,
      s = ((o % a) + a) % a,
      l = (o - s) / c,
      d = String(n ?? '').trim(),
      r = d ? v(d, 'Comparison value') : null;
    return Object.freeze({
      dividend: o.toString(),
      divisor: c.toString(),
      modulus: a.toString(),
      quotient: l.toString(),
      remainder: s.toString(),
      identity: `${o} = ${l} \xD7 (${c}) + ${s}`,
      range: `0 \u2264 ${s} < ${a}`,
      comparison:
        r === null ? null : Object.freeze({ value: r.toString(), congruent: (o - r) % a === 0n }),
    });
  }
  var i = document.querySelector('[data-tool="modulo-calculator"]');
  if (i) {
    let s = function () {
        ((o.hidden = !0), c.replaceChildren(), (a = ''));
      },
      l = function (d) {
        (d?.preventDefault(), s());
        try {
          let r = q({
              dividend: t.elements.namedItem('dividend').value,
              divisor: t.elements.namedItem('divisor').value,
              compare: t.elements.namedItem('compare').value,
            }),
            m = [
              [e.fields.quotient, r.quotient],
              [e.fields.remainder, r.remainder],
              [e.fields.identity, r.identity],
              [e.fields.range, r.range],
            ];
          r.comparison &&
            m.push([
              e.fields.congruence,
              `${r.dividend} ${r.comparison.congruent ? '\u2261' : '\u2262'} ${r.comparison.value} (mod ${r.modulus}) \xB7 ${r.comparison.congruent ? '\u2713' : '\u2717'}`,
            ]);
          let u = document.createElement('table');
          u.className = 'modulo-calculator__table';
          let x = document.createElement('caption');
          ((x.textContent = e.fields.tableCaption), u.append(x));
          let y = document.createElement('tbody');
          for (let [p, f] of m) {
            let b = document.createElement('tr'),
              g = document.createElement('th'),
              w = document.createElement('td');
            ((g.scope = 'row'),
              (g.textContent = p),
              (w.textContent = f),
              b.append(g, w),
              y.append(b));
          }
          (u.append(y),
            c.replaceChildren(u),
            (o.hidden = !1),
            (a = m.map(([p, f]) => `${p}: ${f}`).join(`
`)),
            (n.textContent = e.messages.calculated));
        } catch {
          n.textContent = e.messages.checkInputs;
        }
      },
      t = i.querySelector('#tool-form'),
      e = E(i),
      n = i.querySelector('[data-status]'),
      o = i.querySelector('[data-result]'),
      c = i.querySelector('[data-result-content]'),
      a = '';
    (t.addEventListener('input', () => {
      (s(), (n.textContent = ''));
    }),
      t.addEventListener('submit', l),
      t.addEventListener('reset', () => {
        (s(), (n.textContent = ''));
      }),
      i.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('dividend').value = '-7'),
          (t.elements.namedItem('divisor').value = '3'),
          (t.elements.namedItem('compare').value = '2'),
          l(),
          (n.textContent = e.messages.exampleLoaded));
      }),
      i.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        a && S(i, a, e);
      }));
  }
})();
