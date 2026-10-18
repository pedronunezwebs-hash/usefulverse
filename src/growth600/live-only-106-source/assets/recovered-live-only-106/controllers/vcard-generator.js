(() => {
  function O(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function h(e, t, o = 'info') {
    let r = e.querySelector('[data-status]');
    r && ((r.textContent = t), (r.dataset.kind = o));
  }
  var b = Object.freeze({
      fields: 40,
      fieldCharacters: 500,
      listEntries: 5,
      photoBytes: 131072,
      outputBytes: 1048576,
    }),
    P = new TextEncoder(),
    S = (e) => P.encode(e).byteLength,
    i = (e, t, o = b.fieldCharacters) => {
      if (typeof e != 'string') throw new TypeError(`${t} must be text.`);
      let r = e.trim();
      if (r.length > o || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(r))
        throw new RangeError(`${t} exceeds its size or character limit.`);
      return r;
    },
    y = (e) =>
      e
        .replaceAll('\\', '\\\\')
        .replaceAll(
          `\r
`,
          `
`,
        )
        .replaceAll(
          '\r',
          `
`,
        )
        .replaceAll(
          `
`,
          '\\n',
        )
        .replaceAll(',', '\\,')
        .replaceAll(';', '\\;');
  function A(e, t, o) {
    let r = i(e ?? '', t, 2e3)
      .split(/\r?\n/u)
      .map((a) => a.trim())
      .filter(Boolean);
    if (r.length > b.listEntries) throw new RangeError(`${t} allows at most five lines.`);
    return r.map((a) => {
      let c = i(a, t, 254);
      if (!o(c)) throw new TypeError(`${t} contains an invalid entry.`);
      return c;
    });
  }
  function U(e) {
    let t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      o = '';
    for (let r = 0; r < e.length; r += 3) {
      let a = e[r],
        c = r + 1 < e.length,
        p = r + 2 < e.length,
        l = c ? e[r + 1] : 0,
        s = p ? e[r + 2] : 0;
      o +=
        t[a >> 2] +
        t[((a & 3) << 4) | (l >> 4)] +
        (c ? t[((l & 15) << 2) | (s >> 6)] : '=') +
        (p ? t[s & 63] : '=');
    }
    return o;
  }
  function j(e, t) {
    if (!e) return '';
    let o = e.bytes instanceof Uint8Array ? e.bytes : new Uint8Array(e.bytes ?? 0);
    if (!o.length || o.length > b.photoBytes)
      throw new RangeError('The optional photo must be between 1 byte and 128 KiB.');
    let r =
        e.type === 'image/jpeg' &&
        o[0] === 255 &&
        o[1] === 216 &&
        o.at(-2) === 255 &&
        o.at(-1) === 217,
      a =
        e.type === 'image/png' &&
        o.length >= 45 &&
        [137, 80, 78, 71, 13, 10, 26, 10].every((l, s) => o[s] === l) &&
        [73, 69, 78, 68, 174, 66, 96, 130].every((l, s) => o[o.length - 8 + s] === l);
    if (!r && !a) throw new TypeError('The optional photo must be a matching JPEG or PNG file.');
    let c = U(o);
    return t === '3.0'
      ? `PHOTO;ENCODING=b;TYPE=${r ? 'JPEG' : 'PNG'}:${c}`
      : `PHOTO:data:${e.type};base64,${c}`;
  }
  function q(e) {
    if (typeof e != 'string' || /[\r\n]/u.test(e))
      throw new TypeError('A vCard property must be a single logical line.');
    let t = '',
      o = 0;
    for (let r of e) {
      let a = S(r);
      (o &&
        o + a > 75 &&
        ((t += `\r
 `),
        (o = 1)),
        (t += r),
        (o += a));
    }
    return t;
  }
  function I(e) {
    if (!e || typeof e != 'object') throw new TypeError('Enter contact details first.');
    let t = e.version === '4.0' ? '4.0' : e.version === '3.0' ? '3.0' : null;
    if (!t) throw new TypeError('Choose vCard version 3.0 or 4.0.');
    let o = i(e.firstName ?? '', 'First name'),
      r = i(e.lastName ?? '', 'Last name'),
      a = i(e.middleName ?? '', 'Middle name'),
      c = i(e.prefix ?? '', 'Name prefix', 100),
      p = i(e.suffix ?? '', 'Name suffix', 100),
      l = i(e.formattedName ?? '', 'Display name'),
      s = [c, o, a, r, p].filter(Boolean).join(' '),
      g = l || s;
    if (!g) throw new TypeError('Enter a display name or at least a first or last name.');
    let w = A(
        e.phones,
        'Phone number',
        (n) => /^[+0-9(). -]{3,40}$/u.test(n) && (n.match(/\d/gu)?.length ?? 0) >= 3,
      ),
      d = A(
        e.emails,
        'Email',
        (n) => n.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/u.test(n),
      );
    if (
      !['CELL', 'WORK', 'HOME'].includes(e.phoneType ?? 'CELL') ||
      !['WORK', 'HOME'].includes(e.emailType ?? 'HOME')
    )
      throw new TypeError('Choose a supported phone and email type.');
    let m = e.phoneType ?? 'CELL',
      x = e.emailType ?? 'HOME',
      T = i(e.website ?? '', 'Website', 2048);
    if (T) {
      let n;
      try {
        n = new URL(T);
      } catch {
        throw new TypeError('Enter a complete website URL using the secure HTTPS scheme.');
      }
      if (n.protocol !== 'https:' || n.username || n.password || n.hash)
        throw new TypeError('Website must be a clean HTTPS URL without credentials or a fragment.');
      T = n.href;
    }
    let E = Object.fromEntries(
        ['poBox', 'extendedAddress', 'street', 'locality', 'region', 'postalCode', 'country'].map(
          (n) => [n, i(e[n] ?? '', `Address ${n}`, 200)],
        ),
      ),
      C = i(e.organization ?? '', 'Organization'),
      L = i(e.department ?? '', 'Department'),
      N = i(e.title ?? '', 'Job title'),
      R = i(e.note ?? '', 'Note', 1e3),
      f = ['BEGIN:VCARD', `VERSION:${t}`, `N:${[r, o, a, c, p].map(y).join(';')}`, `FN:${y(g)}`];
    ((C || L) && f.push(`ORG:${[C, L].filter(Boolean).map(y).join(';')}`),
      N && f.push(`TITLE:${y(N)}`));
    for (let n of w)
      t === '3.0'
        ? f.push(`TEL;TYPE=${m},VOICE:${y(n)}`)
        : f.push(`TEL;TYPE=${m.toLowerCase()};VALUE=uri:tel:${n.replace(/[ ().]/gu, '')}`);
    for (let n of d) f.push(`EMAIL;TYPE=${t === '3.0' ? x : x.toLowerCase()}:${y(n)}`);
    T && f.push(`URL:${T}`);
    let $ = [E.poBox, E.extendedAddress, E.street, E.locality, E.region, E.postalCode, E.country];
    ($.some(Boolean) && f.push(`ADR;TYPE=${t === '3.0' ? 'HOME' : 'home'}:${$.map(y).join(';')}`),
      R && f.push(`NOTE:${y(R)}`));
    let v = j(e.photo, t);
    (v && f.push(v), f.push('END:VCARD'));
    let B = `${f.map(q).join(`\r
`)}\r
`;
    if (S(B) > b.outputBytes)
      throw new RangeError('The generated vCard exceeds the 1 MiB output limit.');
    return Object.freeze({
      text: B,
      version: t,
      name: g,
      phones: w.length,
      emails: d.length,
      hasPhoto: !!v,
    });
  }
  var u = document.querySelector('[data-tool="vcard-generator"]');
  if (u) {
    let e = u.querySelector('#tool-form'),
      t = O(u),
      o = e.elements.namedItem('photo'),
      r = u.querySelector('[data-vcard-result]'),
      a = u.querySelector('[data-vcard-preview]'),
      c = e.querySelector('[data-action="generate"]'),
      p = e.querySelector('[data-action="copy"]'),
      l = e.querySelector('[data-action="download"]'),
      s = '',
      g = () => {
        ((p.disabled = !s), (l.disabled = !s));
      };
    (e.addEventListener('submit', async (w) => {
      (w.preventDefault(),
        (c.disabled = !0),
        (s = ''),
        g(),
        h(u, t.messages.loading ?? t.messages.created));
      try {
        let d = Object.fromEntries(new FormData(e).entries()),
          m = o.files?.[0];
        if (m && m.size > b.photoBytes)
          throw new RangeError('The optional photo must be between 1 byte and 128 KiB.');
        ((d.photo = m ? { type: m.type, bytes: new Uint8Array(await m.arrayBuffer()) } : null),
          (s = I(d).text),
          (a.textContent = s),
          (r.hidden = !1),
          g(),
          h(u, t.messages.created, 'success'));
      } catch (d) {
        r.hidden = !0;
        let m = /display name/u.test(d?.message ?? '')
          ? t.messages.requiredName
          : d instanceof RangeError
            ? t.messages.limits
            : t.messages.invalid;
        h(u, m, 'error');
      } finally {
        c.disabled = !1;
      }
    }),
      (p.disabled = !0),
      (l.disabled = !0),
      p.addEventListener('click', async () => {
        if (s)
          try {
            (await navigator.clipboard.writeText(s), h(u, t.messages.copied, 'success'));
          } catch {
            h(u, t.messages.copyUnavailable, 'error');
          }
      }),
      l.addEventListener('click', () => {
        if (!s) return;
        let w = URL.createObjectURL(new Blob([s], { type: 'text/vcard;charset=utf-8' })),
          d = document.createElement('a');
        ((d.href = w),
          (d.download = 'contact.vcf'),
          d.click(),
          setTimeout(() => URL.revokeObjectURL(w), 1e3),
          h(u, t.messages.downloaded, 'success'));
      }),
      e.addEventListener('reset', () => {
        ((s = ''), (a.textContent = ''), (r.hidden = !0), g(), h(u, t.messages.cleared, 'success'));
      }));
  }
})();
