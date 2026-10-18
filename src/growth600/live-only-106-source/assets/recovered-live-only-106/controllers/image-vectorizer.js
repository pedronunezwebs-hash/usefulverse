(() => {
  function N(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function I(e, t, d = 'info') {
    let m = e.querySelector('[data-status]');
    m && ((m.textContent = t), (m.dataset.kind = d));
  }
  var R = Object.freeze({ maxDimension: 256, maxPixels: 65536, maxColors: 16, maxPaths: 32768 });
  function T({ width: e, height: t, data: d, colorCount: m, alphaThreshold: g }) {
    if (
      !Number.isInteger(e) ||
      !Number.isInteger(t) ||
      e < 1 ||
      t < 1 ||
      e > R.maxDimension ||
      t > R.maxDimension ||
      e * t > R.maxPixels
    )
      throw new RangeError('Raster dimensions exceed the supported limit.');
    if (!d || d.length !== e * t * 4) throw new RangeError('Raster pixel data is invalid.');
    if (!Number.isInteger(m) || m < 2 || m > R.maxColors)
      throw new RangeError('Choose 2 to 16 colors.');
    if (!Number.isInteger(g) || g < 0 || g > 255)
      throw new RangeError('Transparency threshold must be from 0 to 255.');
  }
  function _(e, t, d) {
    let m = new Map();
    for (let s = 0; s < e.length; s += 4) {
      let o = e[s + 3];
      if (o < t || o === 0) continue;
      let r = (255 - o) / 255,
        a = Math.round(e[s] + 255 * r),
        b = Math.round(e[s + 1] + 255 * r),
        h = Math.round(e[s + 2] + 255 * r),
        c = (a << 16) | (b << 8) | h,
        f = m.get(c) ?? { red: a, green: b, blue: h, count: 0 };
      ((f.count += 1), m.set(c, f));
    }
    if (m.size === 0) return [];
    let g = [[...m.values()]];
    for (; g.length < d;) {
      let s = -1,
        o = 'red',
        r = 0;
      for (let f = 0; f < g.length; f += 1) {
        let n = g[f];
        if (!(n.length < 2))
          for (let p of ['red', 'green', 'blue']) {
            let u = 255,
              i = 0;
            for (let w of n) ((u = Math.min(u, w[p])), (i = Math.max(i, w[p])));
            let l = i - u;
            l > r && ((r = l), (s = f), (o = p));
          }
      }
      if (s < 0 || r === 0) break;
      let a = g[s].slice().sort((f, n) => f[o] - n[o]),
        b = a.reduce((f, n) => f + n.count, 0) / 2,
        h = 0,
        c = 1;
      for (; c < a.length && ((h += a[c - 1].count), !(h >= b)); c += 1);
      g.splice(s, 1, a.slice(0, c), a.slice(c));
    }
    return g
      .map((s) => {
        let o = s.reduce((r, a) => r + a.count, 0);
        return s.reduce(
          (r, a) => ({
            red: r.red + (a.red * a.count) / o,
            green: r.green + (a.green * a.count) / o,
            blue: r.blue + (a.blue * a.count) / o,
          }),
          { red: 0, green: 0, blue: 0 },
        );
      })
      .map(({ red: s, green: o, blue: r }) => ({
        red: Math.round(s),
        green: Math.round(o),
        blue: Math.round(r),
      }));
  }
  var A = ({ red: e, green: t, blue: d }) =>
    `#${[e, t, d].map((m) => m.toString(16).padStart(2, '0')).join('')}`;
  function O({
    width: e,
    height: t,
    data: d,
    colorCount: m = 8,
    alphaThreshold: g = 128,
    mergeRuns: s = !0,
  }) {
    T({ width: e, height: t, data: d, colorCount: m, alphaThreshold: g });
    let o = _(d, g, m);
    if (o.length === 0)
      throw new RangeError('No visible pixels remain. Lower the transparency threshold.');
    let r = new Int16Array(e * t).fill(-1);
    for (let n = 0; n < r.length; n += 1) {
      let p = n * 4,
        u = d[p + 3];
      if (u < g || u === 0) continue;
      let i = (255 - u) / 255,
        l = d[p] + 255 * i,
        w = d[p + 1] + 255 * i,
        x = d[p + 2] + 255 * i,
        C = 0,
        E = 1 / 0;
      for (let y = 0; y < o.length; y += 1) {
        let L = l - o[y].red,
          $ = w - o[y].green,
          M = x - o[y].blue,
          S = L * L + $ * $ + M * M;
        S < E && ((E = S), (C = y));
      }
      r[n] = C;
    }
    let a = o.map(() => []),
      b = new Map(),
      h = 0;
    for (let n = 0; n < t; n += 1) {
      let p = new Map(),
        u = 0;
      for (; u < e;) {
        let i = r[n * e + u];
        if (i < 0) {
          u += 1;
          continue;
        }
        let l = u + 1;
        for (; l < e && r[n * e + l] === i;) l += 1;
        let w = s ? `${i}:${u}:${l}` : `${i}:${u}:${l}:${n}`,
          x = s ? b.get(w) : null;
        (x
          ? ((x.height += 1), p.set(w, x))
          : p.set(w, { color: i, x: u, y: n, width: l - u, height: 1 }),
          (u = l));
      }
      for (let [i, l] of b)
        if (!p.has(i) && (a[l.color].push(l), (h += 1), h > R.maxPaths))
          throw new RangeError(
            'This image creates too many path sections. Reduce the detail or use simpler artwork.',
          );
      b = p;
    }
    for (let n of b.values())
      if ((a[n.color].push(n), (h += 1), h > R.maxPaths))
        throw new RangeError(
          'This image creates too many path sections. Reduce the detail or use simpler artwork.',
        );
    let c = a
        .map((n, p) => {
          if (!n.length) return '';
          let u = n
            .map(({ x: i, y: l, width: w, height: x }) => `M${i} ${l}h${w}v${x}h-${w}Z`)
            .join('');
          return `<path fill="${A(o[p])}" d="${u}"/>`;
        })
        .filter(Boolean),
      f = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}" width="${e}" height="${t}" shape-rendering="crispEdges">${c.join('')}</svg>`;
    return Object.freeze({
      svg: f,
      width: e,
      height: t,
      colorCount: c.length,
      pathCount: h,
      palette: Object.freeze(o.map(A)),
    });
  }
  var v = document.querySelector('[data-tool="image-vectorizer"]');
  if (v) {
    let e = v.querySelector('#tool-form'),
      t = N(v),
      d = v.querySelector('[data-vector-result]'),
      m = v.querySelector('[data-vector-preview]'),
      g = v.querySelector('[data-vector-stats]'),
      s = e.elements.namedItem('alphaThreshold'),
      o = v.querySelector('[data-alpha-value]'),
      r = '',
      a = () => {
        (r && URL.revokeObjectURL(r), (r = ''), m.removeAttribute('src'));
      },
      b = async (h) => {
        (h?.preventDefault(), (d.hidden = !0), a(), g.replaceChildren());
        try {
          let c = e.elements.namedItem('imageFile').files?.[0];
          if (!c) throw Object.assign(new RangeError(), { code: 'SELECT_IMAGE' });
          if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(c.type))
            throw Object.assign(new RangeError(), { code: 'INVALID_IMAGE' });
          if (c.size > 5 * 1024 * 1024)
            throw Object.assign(new RangeError(), { code: 'IMAGE_TOO_LARGE' });
          let f = URL.createObjectURL(c);
          try {
            let n = new Image();
            n.src = f;
            try {
              await n.decode();
            } catch {
              throw Object.assign(new RangeError(), { code: 'INVALID_IMAGE' });
            }
            if (n.naturalWidth * n.naturalHeight > 32e6)
              throw Object.assign(new RangeError(), { code: 'IMAGE_DIMENSIONS' });
            let p = Number(e.elements.namedItem('detail').value),
              u = Math.min(1, p / Math.max(n.naturalWidth, n.naturalHeight)),
              i = Math.max(1, Math.round(n.naturalWidth * u)),
              l = Math.max(1, Math.round(n.naturalHeight * u)),
              w = document.createElement('canvas');
            ((w.width = i), (w.height = l));
            let x = w.getContext('2d', { willReadFrequently: !0 });
            if (!x) throw new Error('Canvas is unavailable.');
            (x.clearRect(0, 0, i, l), x.drawImage(n, 0, 0, i, l));
            let C = x.getImageData(0, 0, i, l).data,
              E = O({
                width: i,
                height: l,
                data: C,
                colorCount: Number(e.elements.namedItem('paletteCount').value),
                alphaThreshold: Number(s.value),
                mergeRuns: e.elements.namedItem('mergeRuns').checked,
              }),
              y = new Blob([E.svg], { type: 'image/svg+xml;charset=utf-8' });
            ((r = URL.createObjectURL(y)),
              (m.src = r),
              (m.alt = `${t.fields.resultTitle}, ${E.width} by ${E.height}`));
            for (let [L, $] of [
              [t.fields.dimensions, `${E.width} \xD7 ${E.height} px`],
              [t.fields.colorsUsed, String(E.colorCount)],
              [t.fields.pathSections, String(E.pathCount)],
            ]) {
              let M = document.createElement('dt'),
                S = document.createElement('dd');
              ((M.textContent = L), (S.textContent = $), g.append(M, S));
            }
            ((d.hidden = !1), I(v, t.messages.generated, 'success'));
          } finally {
            URL.revokeObjectURL(f);
          }
        } catch (c) {
          let f =
            c?.code === 'SELECT_IMAGE'
              ? t.messages.selectImage
              : c?.code === 'INVALID_IMAGE'
                ? t.messages.invalidImage
                : c?.code === 'IMAGE_TOO_LARGE'
                  ? t.messages.imageTooLarge
                  : c?.code === 'IMAGE_DIMENSIONS'
                    ? t.messages.imageDimensions
                    : /No visible pixels/u.test(c?.message ?? '')
                      ? t.messages.noVisiblePixels
                      : /too many path sections/u.test(c?.message ?? '')
                        ? t.messages.tooManyPaths
                        : t.messages.traceFailed;
          I(v, f, 'error');
        }
      };
    (e.addEventListener('submit', b),
      e.addEventListener('input', () => {
        ((d.hidden = !0), a(), I(v, ''));
      }),
      e.addEventListener('change', () => {
        ((d.hidden = !0), a(), I(v, ''));
      }),
      s.addEventListener('input', () => {
        ((o.value = s.value), (o.textContent = s.value));
      }),
      e.addEventListener('reset', () => {
        ((d.hidden = !0),
          g.replaceChildren(),
          a(),
          (o.value = '128'),
          (o.textContent = '128'),
          I(v, ''));
      }),
      v.querySelector('[data-action="download"]')?.addEventListener('click', () => {
        if (!r) return;
        let h = document.createElement('a');
        ((h.href = r),
          (h.download = 'vectorized-image.svg'),
          h.click(),
          I(v, t.messages.downloaded, 'success'));
      }));
  }
})();
