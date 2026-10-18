(() => {
  var R = new Set(['exp', 'sin', 'cos', 'ln', 'reciprocal', 'sqrt']);
  function E(e, t) {
    let o = typeof e == 'string' && e.trim() === '' ? NaN : Number(e);
    if (!Number.isFinite(o) || Math.abs(o) > 50)
      throw Object.assign(new RangeError(`${t} must be finite and within \xB150.`), {
        code: 'inputRange',
      });
    return o;
  }
  function A(e, t) {
    return e === 'exp'
      ? Math.exp(t)
      : e === 'sin'
        ? Math.sin(t)
        : e === 'cos'
          ? Math.cos(t)
          : e === 'ln'
            ? t > 0
              ? Math.log(t)
              : NaN
            : e === 'reciprocal'
              ? t === 0
                ? NaN
                : 1 / t
              : e === 'sqrt'
                ? t >= 0
                  ? Math.sqrt(t)
                  : NaN
                : NaN;
  }
  function _(e, t, o) {
    let i = [],
      l = 1,
      s = 1,
      u =
        e === 'sin'
          ? [Math.sin(t), Math.cos(t), -Math.sin(t), -Math.cos(t)]
          : [Math.cos(t), -Math.sin(t), -Math.cos(t), Math.sin(t)];
    for (let n = 0; n <= o; n += 1) {
      n > 0 && (l *= n);
      let a;
      (e === 'exp'
        ? (a = Math.exp(t) / l)
        : e === 'sin' || e === 'cos'
          ? (a = u[n % 4] / l)
          : e === 'ln'
            ? (a = n === 0 ? Math.log(t) : (n % 2 ? 1 : -1) / (n * t ** n))
            : e === 'reciprocal'
              ? (a = (n % 2 ? -1 : 1) / t ** (n + 1))
              : (n > 0 && (s *= (0.5 - (n - 1)) / n), (a = s * t ** (0.5 - n))),
        i.push(Object.is(a, -0) ? 0 : a));
    }
    return i;
  }
  function N({ functionType: e = 'exp', center: t = 0, x: o = 1, order: i = 2 }) {
    if (!R.has(e))
      throw Object.assign(new RangeError('Choose a supported function.'), { code: 'functionType' });
    let l = E(t, 'Center'),
      s = E(o, 'Evaluation point'),
      u = Number(i);
    if (!Number.isInteger(u) || u < 0 || u > 30)
      throw Object.assign(new RangeError('Order must be a whole number from 0 to 30.'), {
        code: 'orderRange',
      });
    if (['ln', 'sqrt'].includes(e) && l <= 0)
      throw Object.assign(
        new RangeError('The expansion center must be positive for this function.'),
        { code: 'centerDomain' },
      );
    if (e === 'reciprocal' && l === 0)
      throw Object.assign(new RangeError('The expansion center cannot be zero for 1/x.'), {
        code: 'centerDomain',
      });
    let n = A(e, s);
    if (!Number.isFinite(n))
      throw Object.assign(
        new RangeError('The evaluation point is outside the real-valued domain.'),
        { code: 'pointDomain' },
      );
    let a = _(e, l, u),
      g = s - l,
      d = 0;
    for (let r = a.length - 1; r >= 0; r -= 1) d = d * g + a[r];
    if (!Number.isFinite(d))
      throw Object.assign(
        new RangeError('The polynomial result exceeds the supported numeric range.'),
        { code: 'resultRange' },
      );
    let f = ['ln', 'sqrt', 'reciprocal'].includes(e) && Math.abs(g) >= Math.abs(l);
    return Object.freeze({
      functionType: e,
      center: l,
      x: s,
      order: u,
      coefficients: Object.freeze(a),
      approximation: d,
      actual: n,
      absoluteError: Math.abs(n - d),
      outsideRadius: f,
    });
  }
  var C = Object.freeze({ maxOrder: 30, maxAbsInput: 50, functionTypes: Object.freeze([...R]) });
  function M(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function p(e, t, o = 'info') {
    let i = e.querySelector('[data-status]');
    i && ((i.textContent = t), (i.dataset.kind = o));
  }
  function v(e) {
    let t = e.querySelector('[data-result]'),
      o = e.querySelector('[data-result-content]');
    (t && (t.hidden = !0), o && o.replaceChildren());
  }
  function S(e, t, o = 2) {
    return new Intl.NumberFormat(e, { maximumFractionDigits: o }).format(t);
  }
  async function T(e, t, o) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      (await navigator.clipboard.writeText(t), p(e, o.messages.copied, 'success'));
    } catch {
      p(e, o.messages.copyUnavailable, 'error');
    }
  }
  var c = document.querySelector('[data-tool="taylor-series-calculator"]');
  if (c) {
    let n = function () {
        (v(c), (o.hidden = !0), i.replaceChildren(), (u = ''));
      },
      a = function (d, f, r) {
        let m = document.createElement(f);
        return ((m.textContent = r), d.append(m), m);
      },
      g = function (d) {
        (d?.preventDefault(), n(), p(c, ''));
        try {
          let f = new FormData(t),
            r = N({
              functionType: f.get('functionType'),
              center: f.get('center'),
              x: f.get('x'),
              order: f.get('order'),
            }),
            m = document.createElement('table');
          ((m.className = 'data-table'), a(m.createCaption(), 'span', e.fields.coefficientTable));
          let O = m.createTHead().insertRow();
          for (let h of [e.fields.degree, e.fields.coefficient, e.fields.contribution])
            a(O, 'th', h).scope = 'col';
          let I = m.createTBody(),
            q = r.x - r.center;
          (r.coefficients.forEach((h, b) => {
            let y = I.insertRow();
            ((a(y, 'th', s(b)).scope = 'row'), a(y, 'td', s(h)), a(y, 'td', s(h * q ** b)));
          }),
            i.append(m));
          let x = document.createElement('dl');
          for (let [h, b] of [
            ['approximation', s(r.approximation)],
            ['actualValue', s(r.actual)],
            ['absoluteError', s(r.absoluteError)],
          ])
            (a(x, 'dt', e.fields[h]), a(x, 'dd', b));
          i.append(x);
          let w = document.createElement('p');
          ((w.className = 'hint'),
            (w.textContent = r.outsideRadius
              ? (e.fields.outsideRadiusNote ?? e.fields.convergenceNote)
              : ''),
            r.outsideRadius && i.append(w),
            (o.hidden = !1),
            (u = `${e.fields.approximation}: ${s(r.approximation)}
${e.fields.actualValue}: ${s(r.actual)}
${e.fields.absoluteError}: ${s(r.absoluteError)}
P${r.order}(x), center ${s(r.center)}: ${r.coefficients.map((h, b) => `${s(h)}\xB7(x\u2212a)^${b}`).join(' + ')}`),
            p(c, e.messages.calculated, 'success'));
        } catch (f) {
          p(c, e.messages[f?.code] ?? e.messages.checkInputs, 'error');
        }
      },
      e = M(c),
      t = c.querySelector('#tool-form'),
      o = c.querySelector('[data-taylor-results]'),
      i = c.querySelector('[data-taylor-output]'),
      l = e.copyLanguage === 'zh_tw' ? 'zh-TW' : e.copyLanguage,
      s = (d) => S(l, d, 10),
      u = '';
    (t.addEventListener('submit', g),
      t.addEventListener('input', () => {
        (n(), p(c, ''));
      }),
      c.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((t.elements.namedItem('functionType').value = 'exp'),
          (t.elements.namedItem('center').value = '0'),
          (t.elements.namedItem('x').value = '1'),
          (t.elements.namedItem('order').value = '2'),
          g(),
          p(c, e.messages.exampleLoaded, 'success'));
      }),
      c.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
        u && T(c, u, e);
      }),
      t.addEventListener('reset', () =>
        setTimeout(() => {
          (n(), p(c, ''));
        }, 0),
      ));
  }
})();
