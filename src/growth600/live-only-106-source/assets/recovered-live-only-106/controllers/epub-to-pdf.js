(() => {
  var x = Uint8Array,
    D = Uint16Array,
    Dt = Int32Array,
    vt = new x([
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0,
      0,
    ]),
    pt = new x([
      0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13,
      13, 0, 0,
    ]),
    Ft = new x([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
    gt = function (t, e) {
      for (var r = new D(31), n = 0; n < 31; ++n) r[n] = e += 1 << t[n - 1];
      for (var i = new Dt(r[30]), n = 1; n < 30; ++n)
        for (var o = r[n]; o < r[n + 1]; ++o) i[o] = ((o - r[n]) << 5) | n;
      return { b: r, r: i };
    },
    mt = gt(vt, 2),
    yt = mt.b,
    qt = mt.r;
  ((yt[28] = 258), (qt[258] = 28));
  var dt = gt(pt, 0),
    Nt = dt.b,
    ne = dt.r,
    _ = new D(32768);
  for (c = 0; c < 32768; ++c)
    ((b = ((c & 43690) >> 1) | ((c & 21845) << 1)),
      (b = ((b & 52428) >> 2) | ((b & 13107) << 2)),
      (b = ((b & 61680) >> 4) | ((b & 3855) << 4)),
      (_[c] = (((b & 65280) >> 8) | ((b & 255) << 8)) >> 1));
  var b,
    c,
    L = function (t, e, r) {
      for (var n = t.length, i = 0, o = new D(e); i < n; ++i) t[i] && ++o[t[i] - 1];
      var s = new D(e);
      for (i = 1; i < e; ++i) s[i] = (s[i - 1] + o[i - 1]) << 1;
      var l;
      if (r) {
        l = new D(1 << e);
        var u = 15 - e;
        for (i = 0; i < n; ++i)
          if (t[i])
            for (
              var v = (i << 4) | t[i], h = e - t[i], a = s[t[i] - 1]++ << h, f = a | ((1 << h) - 1);
              a <= f;
              ++a
            )
              l[_[a] >> u] = v;
      } else for (l = new D(n), i = 0; i < n; ++i) t[i] && (l[i] = _[s[t[i] - 1]++] >> (15 - t[i]));
      return l;
    },
    Z = new x(288);
  for (c = 0; c < 144; ++c) Z[c] = 8;
  var c;
  for (c = 144; c < 256; ++c) Z[c] = 9;
  var c;
  for (c = 256; c < 280; ++c) Z[c] = 7;
  var c;
  for (c = 280; c < 288; ++c) Z[c] = 8;
  var c,
    wt = new x(32);
  for (c = 0; c < 32; ++c) wt[c] = 5;
  var c;
  var $t = L(Z, 9, 1);
  var kt = L(wt, 5, 1),
    Y = function (t) {
      for (var e = t[0], r = 1; r < t.length; ++r) t[r] > e && (e = t[r]);
      return e;
    },
    S = function (t, e, r) {
      var n = (e / 8) | 0;
      return ((t[n] | (t[n + 1] << 8)) >> (e & 7)) & r;
    },
    K = function (t, e) {
      var r = (e / 8) | 0;
      return (t[r] | (t[r + 1] << 8) | (t[r + 2] << 16)) >> (e & 7);
    },
    Lt = function (t) {
      return ((t + 7) / 8) | 0;
    },
    et = function (t, e, r) {
      return (
        (e == null || e < 0) && (e = 0),
        (r == null || r > t.length) && (r = t.length),
        new x(t.subarray(e, r))
      );
    };
  var Zt = [
      'unexpected EOF',
      'invalid block type',
      'invalid length/literal',
      'invalid distance',
      'stream finished',
      'no stream handler',
      ,
      'no callback',
      'invalid UTF-8 data',
      'extra field too long',
      'date not in range 1980-2099',
      'filename too long',
      'stream finishing',
      'invalid zip data',
    ],
    w = function (t, e, r) {
      var n = new Error(e || Zt[t]);
      if (((n.code = t), Error.captureStackTrace && Error.captureStackTrace(n, w), !r)) throw n;
      return n;
    },
    Ot = function (t, e, r, n) {
      var i = t.length,
        o = n ? n.length : 0;
      if (!i || (e.f && !e.l)) return r || new x(0);
      var s = !r,
        l = s || e.i != 2,
        u = e.i;
      s && (r = new x(i * 3));
      var v = function (ut) {
          var ht = r.length;
          if (ut > ht) {
            var ct = new x(Math.max(ht * 2, ut));
            (ct.set(r), (r = ct));
          }
        },
        h = e.f || 0,
        a = e.p || 0,
        f = e.b || 0,
        g = e.l,
        m = e.d,
        y = e.m,
        p = e.n,
        M = i * 8;
      do {
        if (!g) {
          h = S(t, a, 1);
          var R = S(t, a + 1, 3);
          if (((a += 3), R))
            if (R == 1) ((g = $t), (m = kt), (y = 9), (p = 5));
            else if (R == 2) {
              var X = S(t, a, 31) + 257,
                rt = S(t, a + 10, 15) + 4,
                nt = X + S(t, a + 5, 31) + 1;
              a += 14;
              for (var $ = new x(nt), H = new x(19), z = 0; z < rt; ++z)
                H[Ft[z]] = S(t, a + z * 3, 7);
              a += rt * 3;
              for (var it = Y(H), Ct = (1 << it) - 1, Mt = L(H, it, 1), z = 0; z < nt;) {
                var at = Mt[S(t, a, Ct)];
                a += at & 15;
                var T = at >> 4;
                if (T < 16) $[z++] = T;
                else {
                  var P = 0,
                    O = 0;
                  for (
                    T == 16
                      ? ((O = 3 + S(t, a, 3)), (a += 2), (P = $[z - 1]))
                      : T == 17
                        ? ((O = 3 + S(t, a, 7)), (a += 3))
                        : T == 18 && ((O = 11 + S(t, a, 127)), (a += 7));
                    O--;
                  )
                    $[z++] = P;
                }
              }
              var ot = $.subarray(0, X),
                B = $.subarray(X);
              ((y = Y(ot)), (p = Y(B)), (g = L(ot, y, 1)), (m = L(B, p, 1)));
            } else w(1);
          else {
            var T = Lt(a) + 4,
              G = t[T - 4] | (t[T - 3] << 8),
              j = T + G;
            if (j > i) {
              u && w(0);
              break;
            }
            (l && v(f + G),
              r.set(t.subarray(T, j), f),
              (e.b = f += G),
              (e.p = a = j * 8),
              (e.f = h));
            continue;
          }
          if (a > M) {
            u && w(0);
            break;
          }
        }
        l && v(f + 131072);
        for (var Bt = (1 << y) - 1, Pt = (1 << p) - 1, V = a; ; V = a) {
          var P = g[K(t, a) & Bt],
            I = P >> 4;
          if (((a += P & 15), a > M)) {
            u && w(0);
            break;
          }
          if ((P || w(2), I < 256)) r[f++] = I;
          else if (I == 256) {
            ((V = a), (g = null));
            break;
          } else {
            var st = I - 254;
            if (I > 264) {
              var z = I - 257,
                k = vt[z];
              ((st = S(t, a, (1 << k) - 1) + yt[z]), (a += k));
            }
            var W = m[K(t, a) & Pt],
              J = W >> 4;
            (W || w(3), (a += W & 15));
            var B = Nt[J];
            if (J > 3) {
              var k = pt[J];
              ((B += K(t, a) & ((1 << k) - 1)), (a += k));
            }
            if (a > M) {
              u && w(0);
              break;
            }
            l && v(f + 131072);
            var lt = f + st;
            if (f < B) {
              var ft = o - B,
                It = Math.min(B, lt);
              for (ft + f < 0 && w(3); f < It; ++f) r[f] = n[ft + f];
            }
            for (; f < lt; ++f) r[f] = r[f - B];
          }
        }
        ((e.l = g),
          (e.p = V),
          (e.b = f),
          (e.f = h),
          g && ((h = 1), (e.m = y), (e.d = m), (e.n = p)));
      } while (!h);
      return f != r.length && s ? et(r, 0, f) : r.subarray(0, f);
    };
  var Rt = new x(0);
  var A = function (t, e) {
      return t[e] | (t[e + 1] << 8);
    },
    E = function (t, e) {
      return (t[e] | (t[e + 1] << 8) | (t[e + 2] << 16) | (t[e + 3] << 24)) >>> 0;
    },
    Q = function (t, e) {
      return E(t, e) + E(t, e + 4) * 4294967296;
    };
  function Gt(t, e) {
    return Ot(t, { i: 2 }, e && e.out, e && e.dictionary);
  }
  var tt = typeof TextDecoder < 'u' && new TextDecoder(),
    jt = 0;
  try {
    (tt.decode(Rt, { stream: !0 }), (jt = 1));
  } catch {}
  var Xt = function (t) {
    for (var e = '', r = 0; ;) {
      var n = t[r++],
        i = (n > 127) + (n > 223) + (n > 239);
      if (r + i > t.length) return { s: e, r: et(t, r - 1) };
      i
        ? i == 3
          ? ((n =
              (((n & 15) << 18) | ((t[r++] & 63) << 12) | ((t[r++] & 63) << 6) | (t[r++] & 63)) -
              65536),
            (e += String.fromCharCode(55296 | (n >> 10), 56320 | (n & 1023))))
          : i & 1
            ? (e += String.fromCharCode(((n & 31) << 6) | (t[r++] & 63)))
            : (e += String.fromCharCode(((n & 15) << 12) | ((t[r++] & 63) << 6) | (t[r++] & 63)))
        : (e += String.fromCharCode(n));
    }
  };
  function F(t, e) {
    if (e) {
      for (var r = '', n = 0; n < t.length; n += 16384)
        r += String.fromCharCode.apply(null, t.subarray(n, n + 16384));
      return r;
    } else {
      if (tt) return tt.decode(t);
      var i = Xt(t),
        o = i.s,
        r = i.r;
      return (r.length && w(8), o);
    }
  }
  var Ht = function (t, e) {
      return e + 30 + A(t, e + 26) + A(t, e + 28);
    },
    Vt = function (t, e, r) {
      var n = A(t, e + 28),
        i = A(t, e + 30),
        o = F(t.subarray(e + 46, e + 46 + n), !(A(t, e + 8) & 2048)),
        s = e + 46 + n,
        l = Wt(t, s, i, r, E(t, e + 20), E(t, e + 24), E(t, e + 42)),
        u = l[0],
        v = l[1],
        h = l[2];
      return [A(t, e + 10), u, v, o, s + i + A(t, e + 32), h];
    },
    Wt = function (t, e, r, n, i, o, s) {
      var l = i == 4294967295,
        u = o == 4294967295,
        v = s == 4294967295,
        h = e + r,
        a = l + u + v;
      if (n && a) {
        for (; e + 4 < h; e += 4 + A(t, e + 2))
          if (A(t, e) == 1)
            return [
              l ? Q(t, e + 4 + 8 * u) : i,
              u ? Q(t, e + 4) : o,
              v ? Q(t, e + 4 + 8 * (u + l)) : s,
              1,
            ];
        n < 2 && w(13);
      }
      return [i, o, s, 0];
    };
  function xt(t, e) {
    for (var r = {}, n = t.length - 22; E(t, n) != 101010256; --n)
      (!n || t.length - n > 65558) && w(13);
    var i = A(t, n + 8);
    if (!i) return {};
    var o = E(t, n + 16),
      s = E(t, n - 20) == 117853008;
    if (s) {
      var l = E(t, n - 12);
      ((s = E(t, l) == 101075792), s && ((i = E(t, l + 32)), (o = E(t, l + 48))));
    }
    for (var u = e && e.filter, v = 0; v < i; ++v) {
      var h = Vt(t, o, s),
        a = h[0],
        f = h[1],
        g = h[2],
        m = h[3],
        y = h[4],
        p = h[5],
        M = Ht(t, p);
      ((o = y),
        (!u || u({ name: m, size: f, originalSize: g, compression: a })) &&
          (a
            ? a == 8
              ? (r[m] = Gt(t.subarray(M, M + f), { out: new x(g) }))
              : w(14, 'unknown compression type ' + a)
            : (r[m] = et(t, M, M + f))));
    }
    return r;
  }
  var Jt = 25 * 1024 * 1024,
    Yt = 70 * 1024 * 1024,
    Kt = 1200;
  function q(t, e) {
    return t.getUint16(e, !0);
  }
  function N(t, e) {
    return t.getUint32(e, !0);
  }
  function Qt(t) {
    if (!(t instanceof Uint8Array) || t.byteLength < 22 || t.byteLength > Jt)
      throw new RangeError('Choose an EPUB file no larger than 25 MiB.');
    let e = new DataView(t.buffer, t.byteOffset, t.byteLength),
      r = -1;
    for (let u = Math.max(0, t.length - 65557); u <= t.length - 22; u += 1)
      N(e, u) === 101010256 && (r = u);
    if (r < 0) throw new TypeError('The ZIP directory is missing.');
    let n = q(e, r + 10),
      i = N(e, r + 12),
      o = N(e, r + 16);
    if (n < 1 || n > Kt || n === 65535 || o + i > r)
      throw new RangeError('The EPUB archive has unsupported ZIP limits.');
    let s = 0,
      l = new Set();
    for (let u = 0; u < n; u += 1) {
      if (N(e, o) !== 33639248) throw new TypeError('The EPUB ZIP directory is invalid.');
      let v = q(e, o + 8),
        h = q(e, o + 10),
        a = N(e, o + 20),
        f = N(e, o + 24),
        g = q(e, o + 28),
        m = q(e, o + 30),
        y = q(e, o + 32),
        p = new TextDecoder().decode(t.subarray(o + 46, o + 46 + g));
      if (
        v & 1 ||
        !p ||
        p.startsWith('/') ||
        p.includes('\\') ||
        p.split('/').includes('..') ||
        l.has(p)
      )
        throw new TypeError('The EPUB archive contains an unsafe or encrypted entry.');
      if (![0, 8].includes(h))
        throw new TypeError('This EPUB uses an unsupported compression method.');
      if (f > 25 * 1024 * 1024 || (a === 0 ? f > 0 : f / a > 150))
        throw new RangeError('The EPUB contains an oversized compressed entry.');
      if (((s += f), s > Yt))
        throw new RangeError('The EPUB expanded content exceeds the 70 MiB memory limit.');
      (l.add(p), (o += 46 + g + m + y));
    }
    if (o > r + i || !l.has('mimetype') || !l.has('META-INF/container.xml'))
      throw new TypeError('This archive does not appear to be a valid EPUB.');
    return { count: n, expandedBytes: s, paths: l };
  }
  function zt(t) {
    let e = decodeURIComponent(String(t).split(/[?#]/u, 1)[0]),
      r = [];
    for (let n of e.split('/'))
      if (!(!n || n === '.'))
        if (n === '..') {
          if (!r.length) throw new TypeError('An EPUB reference leaves the archive.');
          r.pop();
        } else r.push(n);
    return r.join('/');
  }
  function Et(t) {
    let e = new DOMParser().parseFromString(F(t), 'application/xml');
    if (e.querySelector('parsererror')) throw new TypeError('The EPUB XML is invalid.');
    return e;
  }
  function St(t) {
    let e = t.mimetype;
    if (!e || F(e) !== 'application/epub+zip') throw new TypeError('The EPUB mimetype is invalid.');
    let n = Et(t['META-INF/container.xml']).querySelector('rootfile[full-path]');
    if (!n) throw new TypeError('The EPUB package file is missing.');
    let i = zt(n.getAttribute('full-path')),
      o = t[i];
    if (!o) throw new TypeError('The EPUB package file is missing.');
    let s = Et(o),
      l = new Map();
    for (let h of s.querySelectorAll('manifest item[id][href]'))
      l.set(h.getAttribute('id'), {
        href: h.getAttribute('href'),
        properties: h.getAttribute('properties') ?? '',
      });
    let u = i.includes('/') ? i.slice(0, i.lastIndexOf('/') + 1) : '',
      v = [...s.querySelectorAll('spine itemref[idref]')]
        .map((h, a) => {
          let f = l.get(h.getAttribute('idref'));
          if (!f) return null;
          let g = zt(u + f.href),
            m = t[g];
          if (!m) return null;
          let y = new DOMParser().parseFromString(F(m), 'text/html'),
            p = y.body?.innerText ?? y.body?.textContent ?? '';
          return {
            index: a,
            path: g,
            title: y.querySelector('title')?.textContent?.trim() || '',
            text: p.replace(/\s+/gu, ' ').trim().slice(0, 25e4),
          };
        })
        .filter((h) => h?.text);
    return { document: s, packagePath: i, packageBytes: o, chapters: v };
  }
  function _t(t) {
    Qt(t);
    let e = xt(t, { filter: (r) => !r.name.endsWith('/') });
    return (St(e), e);
  }
  var te = new Set([
      'p',
      'div',
      'section',
      'article',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'em',
      'strong',
      'b',
      'i',
      'u',
      's',
      'del',
      'ins',
      'ul',
      'ol',
      'li',
      'blockquote',
      'br',
      'hr',
      'pre',
      'code',
      'sub',
      'sup',
      'table',
      'thead',
      'tbody',
      'tfoot',
      'tr',
      'th',
      'td',
      'caption',
    ]),
    ee = new Set([
      'script',
      'style',
      'iframe',
      'object',
      'embed',
      'svg',
      'math',
      'form',
      'input',
      'textarea',
      'button',
      'link',
      'meta',
      'base',
      'template',
      'img',
      'audio',
      'video',
      'canvas',
    ]);
  function re(t) {
    return String(t).replace(
      /[&<>"']/gu,
      (e) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[e],
    );
  }
  function Tt(t) {
    if (t.nodeType === 3) return re(t.nodeValue ?? '');
    if (t.nodeType !== 1) return '';
    let e = t.localName?.toLowerCase();
    if (ee.has(e)) return '';
    let r = [...t.childNodes].map(Tt).join('');
    return te.has(e) ? (e === 'br' || e === 'hr' ? `<${e}>` : `<${e}>${r}</${e}>`) : r;
  }
  function At(t) {
    let e = _t(t),
      { document: r, chapters: n } = St(e),
      i =
        r.querySelector('metadata title, metadata > *[localName="title"]')?.textContent?.trim() ||
        '',
      o =
        r
          .querySelector('metadata creator, metadata > *[localName="creator"]')
          ?.textContent?.trim() || '',
      s = n
        .map((l) => {
          let v = new DOMParser().parseFromString(F(e[l.path]), 'text/html').body,
            h = v ? [...v.childNodes].map(Tt).join('') : '',
            a = new DOMParser().parseFromString(h, 'text/html'),
            f = (a.body?.innerText ?? a.body?.textContent ?? '')
              .replace(/\s+/gu, ' ')
              .trim()
              .slice(0, 25e4);
          return { ...l, text: f, html: h };
        })
        .filter((l) => l.html);
    if (!s.length) throw new TypeError('No readable EPUB chapters were found.');
    return { title: i, author: o, chapters: s };
  }
  function bt(t, { extractor: e = At } = {}) {
    let r = e(t);
    if (!Array.isArray(r.chapters) || !r.chapters.length)
      throw new TypeError('No readable EPUB chapters were found.');
    let n = r.chapters
      .map((i) => ({
        title: String(i.title ?? '').trim(),
        text: String(i.text ?? '').trim(),
        html: String(i.html ?? ''),
      }))
      .filter((i) => i.text);
    if (!n.length) throw new TypeError('No readable EPUB chapters were found.');
    return {
      title: String(r.title ?? '').trim(),
      author: String(r.author ?? '').trim(),
      chapters: n,
    };
  }
  function U(t) {
    return String(t).replace(
      /[&<>"']/gu,
      (e) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[e],
    );
  }
  function Ut(t = document) {
    let e = t.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function C(t, e, r = 'info') {
    let n = t.querySelector('[data-status]');
    n && ((n.textContent = e), (n.dataset.kind = r));
  }
  var d = document.querySelector('[data-tool="epub-to-pdf"]');
  if (d) {
    let t = Ut(d),
      e = d.querySelector('[data-epub-file]'),
      r = d.querySelector('[data-epub-preview]'),
      n = d.querySelector('[data-action="print"]'),
      i = null,
      o = 0;
    (e.addEventListener('change', async () => {
      let s = ++o;
      ((i = null), (r.hidden = !0), r.replaceChildren(), (n.disabled = !0));
      let l = e.files?.[0];
      if (l) {
        if (l.size > 25 * 1024 * 1024)
          return ((e.value = ''), C(d, t.messages.fileTooLarge, 'error'));
        C(d, t.messages.reading, 'info');
        try {
          let u = bt(new Uint8Array(await l.arrayBuffer()));
          if (s !== o) return;
          i = u;
          let v = document.createElement('h2');
          if (((v.textContent = u.title || l.name), r.append(v), u.author)) {
            let f = document.createElement('p');
            ((f.textContent = `${t.fields.author}: ${u.author}`), r.append(f));
          }
          let h = document.createElement('p');
          ((h.textContent = t.messages.chapterCount.replace('{count}', String(u.chapters.length))),
            r.append(h));
          let a = document.createElement('ol');
          for (let [f, g] of u.chapters.entries()) {
            let m = document.createElement('li'),
              y = document.createElement('h3');
            y.textContent = g.title || `${t.fields.chapter} ${f + 1}`;
            let p = document.createElement('p');
            ((p.className = 'epub-to-pdf__chapter-text'),
              (p.textContent = g.text),
              m.append(y, p),
              a.append(m));
          }
          (r.append(a), (r.hidden = !1), (n.disabled = !1), C(d, t.messages.ready, 'success'));
        } catch {
          s === o && ((e.value = ''), C(d, t.messages.invalid, 'error'));
        }
      }
    }),
      n.addEventListener('click', () => {
        if (!i) return C(d, t.messages.chooseFile, 'error');
        let s = window.open('', '_blank');
        if (!s) return C(d, t.messages.popupBlocked, 'error');
        let l = i.chapters
            .map(
              (v, h) =>
                `<section><h2>${U(v.title || `${t.fields.chapter} ${h + 1}`)}</h2>${v.html || `<p>${U(v.text)}</p>`}</section>`,
            )
            .join(''),
          u = i.title || t.name;
        (s.document.open(),
          s.document.write(
            `<!doctype html><html lang="${U(document.documentElement.lang || 'en')}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${U(u)}</title><style>body{max-width:42rem;margin:2rem auto;padding:0 1rem;font:12pt/1.65 Georgia,serif;color:#171717}h1,h2,h3,h4,h5,h6{font-family:Arial,sans-serif;line-height:1.25}h1{font-size:22pt}h2{font-size:16pt;break-after:avoid}section{break-before:page}section:first-of-type{break-before:auto}p{white-space:pre-wrap;overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{border:1px solid #999;padding:.25rem;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere}blockquote{border-left:3px solid #bbb;margin-left:0;padding-left:1rem}@page{margin:18mm}@media screen{body{max-width:48rem}}</style></head><body><h1>${U(u)}</h1>${i.author ? `<p>${U(t.fields.author)}: ${U(i.author)}</p>` : ''}<p>${U(t.messages.printNote)}</p>${l}</body></html>`,
          ),
          s.document.close(),
          s.focus(),
          s.addEventListener('afterprint', () => s.close(), { once: !0 }),
          setTimeout(() => {
            s.closed || s.print();
          }, 500),
          C(d, t.messages.printOpened, 'success'));
      }),
      d.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
        ((o += 1),
          (i = null),
          (e.value = ''),
          r.replaceChildren(),
          (r.hidden = !0),
          (n.disabled = !0),
          C(d, t.messages.cleared, 'success'));
      }));
  }
})();
