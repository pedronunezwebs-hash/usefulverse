(() => {
  var w = 1000000000000n;
  function v(a) {
    let e = String(a ?? '').trim();
    if (!/^\d+$/u.test(e)) throw new TypeError('Enter a positive whole number.');
    let o = BigInt(e);
    if (o < 1n || o > w) throw new RangeError('Enter a whole number from 1 to 1,000,000,000,000.');
    if (o === 1n)
      return Object.freeze({
        value: o,
        factors: Object.freeze([]),
        divisions: Object.freeze([]),
        divisorCount: 1n,
        expanded: '1',
        powers: '1',
      });
    let i = o,
      r = [],
      d = [];
    for (let t = 2n; t * t <= i; t += t === 2n ? 1n : 2n) {
      if (i % t !== 0n) continue;
      let n = 0;
      for (; i % t === 0n;) {
        let s = i / t;
        (d.push(Object.freeze({ dividend: i, divisor: t, quotient: s })), (i = s), (n += 1));
      }
      r.push(Object.freeze({ prime: t, exponent: n }));
    }
    i > 1n &&
      (d.push(Object.freeze({ dividend: i, divisor: i, quotient: 1n })),
      r.push(Object.freeze({ prime: i, exponent: 1 })));
    let u = r.reduce((t, n) => t * BigInt(n.exponent + 1), 1n),
      f = r.flatMap(({ prime: t, exponent: n }) => Array(n).fill(t.toString())).join(' \xD7 '),
      m = r
        .map(({ prime: t, exponent: n }) => (n === 1 ? t.toString() : `${t}^${n}`))
        .join(' \xD7 ');
    return Object.freeze({
      value: o,
      factors: Object.freeze(r),
      divisions: Object.freeze(d),
      divisorCount: u,
      expanded: f,
      powers: m,
    });
  }
  function b(a = document) {
    let e = a.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  var g = (a) =>
    String(a).replace(
      /[&<>"']/gu,
      (e) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[e],
    );
  function C(a, e) {
    let o = a.querySelector('#tool-form');
    if (!o) return;
    let i = a.querySelector('[data-result]'),
      r = a.querySelector('[data-status]'),
      d = a.querySelector('[data-result-content]'),
      u = '';
    function f() {
      ((i.hidden = !0), d.replaceChildren(), (u = ''));
    }
    function m(t) {
      (t?.preventDefault(), f());
      try {
        let n = v(o.elements.namedItem('integer').value),
          s = [
            [e.fields.primePowers, n.powers],
            [e.fields.expandedFactors, n.expanded],
            [e.fields.distinctPrimeCount, String(n.factors.length)],
            [e.fields.totalPrimeFactors, String(n.factors.reduce((c, l) => c + l.exponent, 0))],
            [e.fields.divisorCount, String(n.divisorCount)],
          ];
        n.divisions.length
          ? s.push([
              e.fields.divisionSteps,
              n.divisions.map(({ dividend: c, divisor: l, quotient: h }) => `${c} \xF7 ${l} = ${h}`)
                .join(`
`),
            ])
          : s.push([e.fields.divisionSteps, e.fields.oneHasNoPrimeFactors]);
        let p = document.createElement('table');
        ((p.className = 'prime-factorization-calculator__table'),
          (p.innerHTML = `<caption>${g(e.fields.tableCaption)}</caption><tbody>${s.map(([c, l]) => `<tr><th scope="row">${g(c)}</th><td>${g(l).replace(/\n/gu, '<br>')}</td></tr>`).join('')}</tbody>`),
          d.replaceChildren(p),
          (u = s.map(([c, l]) => `${c}: ${l}`).join(`
`)),
          (i.hidden = !1),
          (r.textContent = e.messages.calculated));
      } catch {
        r.textContent = e.messages.checkInputs;
      }
    }
    (o.addEventListener('input', () => {
      (f(), (r.textContent = ''));
    }),
      o.addEventListener('submit', m),
      o.addEventListener('reset', () => {
        (f(), (r.textContent = ''));
      }),
      a.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((o.elements.namedItem('integer').value = '360'),
          m(),
          (r.textContent = e.messages.exampleLoaded));
      }),
      a.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
        if (u)
          try {
            (await navigator.clipboard.writeText(u), (r.textContent = e.messages.copied));
          } catch {
            r.textContent = e.messages.copyUnavailable;
          }
      }));
  }
  var x = document.querySelector('[data-tool="prime-factorization-calculator"]');
  x && C(x, b(x));
})();
