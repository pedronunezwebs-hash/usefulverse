(() => {
  function A(o, e, r = 'info') {
    let n = o.querySelector('[data-status]');
    n && ((n.textContent = e), (n.dataset.kind = r));
  }
  var v = Object.freeze({ minColors: 2, maxColors: 8, maxWeight: 1e3, minSteps: 2, maxSteps: 16 });
  function S(o) {
    let e = String(o ?? '').trim(),
      r = /^#?([\da-f]{3}|[\da-f]{6})$/iu.exec(e);
    if (!r) throw new RangeError('Enter a 3- or 6-digit hexadecimal color.');
    let n = r[1].length === 3 ? [...r[1]].map((h) => h + h).join('') : r[1];
    return Object.freeze({
      hex: `#${n.toUpperCase()}`,
      r: Number.parseInt(n.slice(0, 2), 16),
      g: Number.parseInt(n.slice(2, 4), 16),
      b: Number.parseInt(n.slice(4, 6), 16),
    });
  }
  function M(o) {
    let e = o / 255;
    return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
  }
  function $(o) {
    let e = o <= 0.0031308 ? 12.92 * o : 1.055 * o ** 0.4166666666666667 - 0.055;
    return Math.round(Math.min(1, Math.max(0, e)) * 255);
  }
  function L({ r: o, g: e, b: r }) {
    return `#${[o, e, r]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()}`;
  }
  function F({ r: o, g: e, b: r }) {
    let n = o / 255,
      h = e / 255,
      l = r / 255,
      p = Math.max(n, h, l),
      a = Math.min(n, h, l),
      i = p - a,
      u = 0,
      g = (p + a) / 2,
      w = 0;
    return (
      i &&
        ((w = i / (1 - Math.abs(2 * g - 1))),
        p === n ? (u = ((h - l) / i) % 6) : p === h ? (u = (l - n) / i + 2) : (u = (n - h) / i + 4),
        (u *= 60),
        u < 0 && (u += 360)),
      Object.freeze({ h: Math.round(u), s: Math.round(w * 100), l: Math.round(g * 100) })
    );
  }
  function E(o, e = 'linear') {
    if (!Array.isArray(o) || o.length < v.minColors || o.length > v.maxColors)
      throw new RangeError('Mix between 2 and 8 colors.');
    if (!['linear', 'srgb'].includes(e))
      throw new RangeError('Choose sRGB or linear-light mixing.');
    let r = o.map((p) => {
        let a = S(p?.hex),
          i = Number(p?.weight);
        if (!Number.isFinite(i) || i < 0 || i > v.maxWeight)
          throw new RangeError('Each weight must be from 0 to 1000.');
        return { color: a, weight: i };
      }),
      n = r.reduce((p, a) => p + a.weight, 0);
    if (!n) throw new RangeError('At least one color needs a weight above zero.');
    let h = ['r', 'g', 'b'].map((p) => {
        let a = r.reduce((i, u) => {
          let g = e === 'linear' ? M(u.color[p]) : u.color[p] / 255;
          return i + g * (u.weight / n);
        }, 0);
        return e === 'linear' ? $(a) : Math.round(a * 255);
      }),
      l = Object.freeze({ r: h[0], g: h[1], b: h[2] });
    return Object.freeze({ hex: L(l), ...l, hsl: F(l), space: e, totalWeight: n });
  }
  function R(o, e, r, n = 'srgb') {
    if (!Number.isInteger(r) || r < v.minSteps || r > v.maxSteps)
      throw new RangeError('Choose from 2 to 16 swatches.');
    let h = S(o),
      l = S(e);
    return Object.freeze(
      Array.from({ length: r }, (p, a) => {
        let i = a / (r - 1);
        return E(
          [
            { hex: h.hex, weight: 1 - i },
            { hex: l.hex, weight: i },
          ],
          n,
        ).hex;
      }),
    );
  }
  var f = document.querySelector('[data-tool="color-mixer"]');
  if (f) {
    let a = function (t, c = '') {
        ((h.textContent = t), A(f, t, c));
      },
      i = function (t, c, s, d, m, x = {}) {
        let y = document.createElement('div');
        y.className = 'field';
        let q = document.createElement('label');
        ((q.htmlFor = `color-mixer-${s}-${t}`), (q.textContent = c));
        let b = document.createElement('input');
        ((b.id = q.htmlFor), (b.name = `${s}-${t}`), (b.type = d), (b.value = m));
        for (let [I, N] of Object.entries(x)) b.setAttribute(I, N);
        return (y.append(q, b), y);
      },
      u = function () {
        let t = [...r.querySelectorAll('[data-color-row]')];
        for (let c of t) c.querySelector('[data-action="removeColor"]').disabled = t.length <= 2;
      },
      g = function (t = '#00AA66', c = 50) {
        let s = r.querySelectorAll('[data-color-row]').length,
          d = document.createElement('div');
        ((d.className = 'color-mixer__row'),
          (d.dataset.colorRow = ''),
          (d.dataset.index = String(s)));
        let m = document.createElement('div');
        ((m.className = 'color-mixer__sample'),
          m.append(
            i(s, e.fields.color, 'color', 'color', t),
            i(s, e.fields.colorHex, 'hex', 'text', t, {
              maxlength: '7',
              pattern: '#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?',
              required: '',
            }),
          ),
          d.append(
            m,
            i(s, e.fields.weight, 'weight', 'number', String(c), {
              min: '0',
              max: '1000',
              step: 'any',
              required: '',
            }),
          ));
        let x = document.createElement('button');
        ((x.type = 'button'),
          (x.className = 'button button--secondary'),
          (x.dataset.action = 'removeColor'),
          (x.textContent = e.actions.removeColor),
          x.setAttribute('aria-label', e.actions.removeColor),
          d.append(x),
          r.append(d),
          u());
      },
      w = function () {
        return [...r.querySelectorAll('[data-color-row]')].map((t) => ({
          hex: t.querySelector('input[name^="color-hex-"]').value,
          weight: t.querySelector('input[name^="weight-"]').value,
        }));
      },
      C = function () {
        let t = E(w(), o.elements.namedItem('space').value),
          c = R(
            w()[0].hex,
            w()[1].hex,
            Number(o.elements.namedItem('steps').value),
            o.elements.namedItem('space').value,
          );
        ((l = t),
          (p = c),
          (f.querySelector('[data-color-swatch]').style.backgroundColor = t.hex),
          (f.querySelector('[data-mixed-hex]').textContent = t.hex),
          (f.querySelector('[data-mixed-rgb]').textContent = `rgb(${t.r}, ${t.g}, ${t.b})`),
          (f.querySelector('[data-mixed-hsl]').textContent =
            `hsl(${t.hsl.h} ${t.hsl.s}% ${t.hsl.l}%)`));
        let s = f.querySelector('[data-color-ramp]');
        s.replaceChildren();
        for (let d of c) {
          let m = document.createElement('span');
          ((m.className = 'color-mixer__ramp-swatch'),
            (m.style.backgroundColor = d),
            m.setAttribute('role', 'img'),
            m.setAttribute('aria-label', d),
            s.append(m));
        }
        ((n.hidden = !1), a(e.messages.calculated, 'success'));
      },
      o = f.querySelector('#tool-form'),
      e = JSON.parse(f.querySelector('[data-tool-copy]').textContent),
      r = f.querySelector('[data-color-list]'),
      n = f.querySelector('[data-color-result]'),
      h = f.querySelector('[data-status]'),
      l = null,
      p = [];
    (f.addEventListener('click', async (t) => {
      let c = t.target.closest('[data-action]')?.dataset.action;
      if (c === 'addColor') {
        if (r.querySelectorAll('[data-color-row]').length >= 8) {
          a(e.messages.colorLimit, 'error');
          return;
        }
        (g(), a(e.messages.colorAdded, 'success'));
      } else if (c === 'removeColor') {
        if (r.querySelectorAll('[data-color-row]').length <= 2) {
          a(e.messages.colorMinimum, 'error');
          return;
        }
        (t.target.closest('[data-color-row]')?.remove(),
          u(),
          (l = null),
          (n.hidden = !0),
          a(e.messages.colorRemoved, 'success'));
      } else if (c === 'example') {
        for (; r.querySelectorAll('[data-color-row]').length > 2;) r.lastElementChild.remove();
        let s = [...r.querySelectorAll('[data-color-row]')];
        for (let [d, m] of ['#FF0000', '#0000FF'].entries())
          ((s[d].querySelector('input[type="color"]').value = m),
            (s[d].querySelector('input[name^="color-hex-"]').value = m),
            (s[d].querySelector('input[name^="weight-"]').value = '50'));
        ((o.elements.namedItem('space').value = 'srgb'),
          (o.elements.namedItem('steps').value = '5'),
          u());
        try {
          C();
        } catch {
          a(e.messages.checkInputs, 'error');
        }
      } else if (c === 'copy') {
        if (!l)
          try {
            C();
          } catch {
            a(e.messages.checkInputs, 'error');
            return;
          }
        try {
          (await navigator.clipboard.writeText(l.hex), a(e.messages.copied, 'success'));
        } catch {
          a(e.messages.copyUnavailable, 'error');
        }
      } else if (c === 'download') {
        if (!l)
          try {
            C();
          } catch {
            a(e.messages.checkInputs, 'error');
            return;
          }
        let s = `:root {
${p.map((x, y) => `  --uv-color-${y + 1}: ${x};`).join(`
`)}
}
`,
          d = URL.createObjectURL(new Blob([s], { type: 'text/css;charset=utf-8' })),
          m = document.createElement('a');
        ((m.href = d),
          (m.download = 'color-palette.css'),
          m.click(),
          setTimeout(() => URL.revokeObjectURL(d), 0),
          a(e.messages.downloaded, 'success'));
      }
    }),
      r.addEventListener('input', (t) => {
        let c = t.target,
          s = c.closest('[data-color-row]');
        if (s) {
          if (c.type === 'color')
            s.querySelector('input[name^="color-hex-"]').value = c.value.toUpperCase();
          else if (c.name.startsWith('color-hex-'))
            try {
              s.querySelector('input[type="color"]').value = S(c.value).hex;
            } catch {}
          ((l = null), (n.hidden = !0), (h.textContent = ''));
        }
      }),
      o.addEventListener('submit', (t) => {
        t.preventDefault();
        try {
          C();
        } catch {
          ((l = null), (n.hidden = !0), a(e.messages.checkInputs, 'error'));
        }
      }),
      o.addEventListener('reset', () =>
        setTimeout(() => {
          for (; r.querySelectorAll('[data-color-row]').length > 2;) r.lastElementChild.remove();
          (u(), (l = null), (p = []), (n.hidden = !0), a(e.messages.reset));
        }, 0),
      ),
      o.addEventListener('change', (t) => {
        ['space', 'steps'].includes(t.target.name) && ((l = null), (n.hidden = !0));
      }),
      u());
  }
})();
