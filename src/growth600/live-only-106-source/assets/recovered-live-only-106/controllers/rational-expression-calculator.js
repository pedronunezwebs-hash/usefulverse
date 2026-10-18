(() => {
  function $(o = document) {
    let t = o.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function T(o, t, e = 'info') {
    let n = o.querySelector('[data-status]');
    n && ((n.textContent = t), (n.dataset.kind = e));
  }
  async function S(o, t, e) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), T(o, e.messages.copied, 'success'));
    } catch {
      T(o, e.messages.copyUnavailable, 'error');
    }
  }
  var g = 1000000n;
  function x(o) {
    let t = Array.from(o, (e) => e ?? 0n);
    for (; t.length > 1 && t.at(-1) === 0n;) t.pop();
    return t;
  }
  function I(o) {
    let t = String(o ?? '').replace(/\s+/gu, '');
    if (!t || t.length > 120) throw new RangeError('Enter a polynomial up to 120 characters.');
    let e = [0n],
      n = /([+-]?)(\d*)(x)?(?:\^(\d+))?/gy,
      r = 0;
    for (; r < t.length;) {
      if (r > 0 && t[r] !== '+' && t[r] !== '-')
        throw new SyntaxError(`Separate polynomial terms with + or \u2212 at position ${r + 1}.`);
      n.lastIndex = r;
      let a = n.exec(t);
      if (!a || !a[0] || (!a[2] && !a[3]))
        throw new SyntaxError(`Unsupported polynomial syntax at position ${r + 1}.`);
      let [, d, p, i, l] = a,
        s = i ? (l === void 0 ? 1 : Number(l)) : 0;
      if (!Number.isInteger(s) || s < 0 || s > 8 || (!i && l !== void 0))
        throw new RangeError('Use polynomial powers from 0 to 8.');
      let m = i && p === '' ? 1n : BigInt(p),
        u = d === '-' ? -m : m;
      if (u > g || u < -g) throw new RangeError(`Each coefficient must be between \xB1${g}.`);
      ((e[s] = (e[s] ?? 0n) + u), (r = n.lastIndex));
    }
    let c = x(e);
    if (c.some((a) => a > g || a < -g))
      throw new RangeError(`Combined coefficients must be between \xB1${g}.`);
    return c;
  }
  function R(o, t) {
    let e = o < 0n ? -o : o,
      n = t < 0n ? -t : t;
    for (; n;) [e, n] = [n, e % n];
    return e;
  }
  function y(o) {
    let t = Array.from(o, (r) => r ?? 0n),
      e = t.reduce((r, c) => R(r, c), 0n);
    if (e === 0n) return { content: 0n, primitive: [0n] };
    let n = t.at(-1) < 0n ? -1n : 1n;
    return { content: e * n, primitive: x(t.map((r) => r / (e * n))) };
  }
  function A(o, t) {
    let e = x(o),
      n = t.at(-1);
    for (; e.length >= t.length && !(e.length === 1 && e[0] === 0n);) {
      let r = e.length - t.length,
        c = e.at(-1);
      ((e = x(e.map((a, d) => a * n - (d >= r ? c * (t[d - r] ?? 0n) : 0n)))),
        (e.length === 1 && e[0] === 0n) || (e = y(e).primitive));
    }
    return e;
  }
  function _(o, t) {
    let e = y(o).primitive,
      n = y(t).primitive;
    for (; !(n.length === 1 && n[0] === 0n);) [e, n] = [n, A(e, n)];
    return y(e).primitive;
  }
  function N(o, t) {
    let e = x(o),
      n = Array(Math.max(1, e.length - t.length + 1)).fill(0n);
    for (; !(e.length === 1 && e[0] === 0n) && e.length >= t.length;) {
      let r = e.length - t.length,
        c = e.at(-1);
      if (c % t.at(-1) !== 0n)
        throw new Error('The common polynomial factor did not divide exactly.');
      let a = c / t.at(-1);
      ((n[r] = a), (e = x(e.map((d, p) => d - (p >= r ? a * (t[p - r] ?? 0n) : 0n)))));
    }
    if (!(e.length === 1 && e[0] === 0n))
      throw new Error('The polynomial division left a remainder.');
    return x(n);
  }
  function b(o) {
    let t = [];
    for (let e = o.length - 1; e >= 0; e -= 1) {
      let n = o[e];
      if (n === 0n) continue;
      let r = n < 0n,
        c = r ? -n : n,
        a = e === 0 ? c.toString() : `${c === 1n ? '' : c}x${e === 1 ? '' : `^${e}`}`;
      t.push({ negative: r, body: a });
    }
    return t.length
      ? t
          .map(
            ({ negative: e, body: n }, r) =>
              `${r === 0 ? (e ? '\u2212' : '') : e ? ' \u2212 ' : ' + '}${n}`,
          )
          .join('')
      : '0';
  }
  function q({ numerator: o, denominator: t }) {
    let e = I(o),
      n = I(t);
    if (n.length === 1 && n[0] === 0n)
      throw new RangeError('The denominator polynomial cannot be zero.');
    let r = y(e),
      c = y(n),
      a = _(r.primitive, c.primitive),
      d = N(r.primitive, a),
      p = N(c.primitive, a),
      i = r.content,
      l = c.content,
      s = R(i, l) || 1n;
    ((i /= s), (l /= s), l < 0n && ((i = -i), (l = -l)));
    let m = b(d),
      u = b(p),
      w = b(a),
      h = l === 1n ? i.toString() : `${i}/${l}`,
      E =
        m === '0'
          ? '0'
          : u === '1' && (m === '1' || m === '0')
            ? h
            : h === '1'
              ? u === '1'
                ? `(${m})`
                : `(${m}) / (${u})`
              : `${h} \xD7 (${m})${u === '1' ? '' : ` / (${u})`}`;
    return Object.freeze({
      numerator: Object.freeze(d),
      denominator: Object.freeze(p),
      reducedNumerator: m,
      reducedDenominator: u,
      commonFactor: w,
      cancelled: !(a.length === 1 && a[0] === 1n) || s > 1n,
      scalar: h,
      expression: E,
      restriction: `${b(n)} \u2260 0`,
    });
  }
  var f = document.querySelector('[data-tool="rational-expression-calculator"]');
  if (f) {
    let a = function () {
        ((n.hidden = !0), r.replaceChildren(), (c = ''));
      },
      d = function (p) {
        (p?.preventDefault(), a());
        try {
          let i = q({
              numerator: o.elements.namedItem('numerator').value,
              denominator: o.elements.namedItem('denominator').value,
            }),
            l = [
              [t.fields.expression, i.expression],
              [t.fields.commonFactor, i.commonFactor],
              [t.fields.restriction, i.restriction],
            ],
            s = document.createElement('table');
          s.className = 'rational-expression-calculator__table';
          let m = document.createElement('caption');
          ((m.textContent = t.fields.tableCaption), s.append(m));
          let u = document.createElement('tbody');
          for (let [w, h] of l) {
            let E = document.createElement('tr'),
              v = document.createElement('th'),
              C = document.createElement('td');
            ((v.scope = 'row'),
              (v.textContent = w),
              (C.textContent = h),
              E.append(v, C),
              u.append(E));
          }
          (s.append(u),
            r.replaceChildren(s),
            (n.hidden = !1),
            (c = l.map(([w, h]) => `${w}: ${h}`).join(`
`)),
            (e.textContent = t.messages.calculated));
        } catch {
          e.textContent = t.messages.checkInputs;
        }
      },
      o = f.querySelector('#tool-form'),
      t = $(f),
      e = f.querySelector('[data-status]'),
      n = f.querySelector('[data-result]'),
      r = f.querySelector('[data-result-content]'),
      c = '';
    (o.addEventListener('input', () => {
      (a(), (e.textContent = ''));
    }),
      o.addEventListener('submit', d),
      o.addEventListener('reset', () => {
        (a(), (e.textContent = ''));
      }),
      f.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((o.elements.namedItem('numerator').value = 'x^2-1'),
          (o.elements.namedItem('denominator').value = 'x-1'),
          d(),
          (e.textContent = t.messages.exampleLoaded));
      }),
      f.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        c && S(f, c, t);
      }));
  }
})();
