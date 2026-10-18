(() => {
  function $(n = document) {
    let e = n.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function c(n, e, t = 'info') {
    let a = n.querySelector('[data-status]');
    a && ((a.textContent = e), (a.dataset.kind = t));
  }
  var h = Object.freeze({ maxTextLength: 120, maxWebsiteLength: 500, maxLogoBytes: 524288 }),
    m = (n) =>
      String(n ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
  function p(n, e, { required: t = !1 } = {}) {
    let a = String(n ?? '').trim();
    if (t && !a) throw new RangeError(`${e} is required.`);
    if (a.length > h.maxTextLength) throw new RangeError(`${e} is too long.`);
    return a;
  }
  function B(n) {
    let e = String(n ?? '').trim();
    if (!e) return '';
    if (e.length > h.maxWebsiteLength) throw new RangeError('Website is too long.');
    let t;
    try {
      t = new URL(/^https:\/\//iu.test(e) ? e : ['https:', e].join('//'));
    } catch {
      throw new RangeError('Enter a valid HTTPS website.');
    }
    if (t.protocol !== 'https:' || !t.hostname || t.username || t.password)
      throw new RangeError('Website links must use HTTPS and cannot contain login details.');
    return t.href;
  }
  function H(n) {
    let e = String(n ?? '');
    if (!e) return '';
    if (e.length > Math.ceil((h.maxLogoBytes * 4) / 3) + 128)
      throw new RangeError('Logo must be 512 KiB or smaller.');
    let t = e.match(/^data:image\/(png|jpeg|gif);base64,([A-Za-z0-9+/]+={0,2})$/u);
    if (!t) throw new RangeError('Logo must be a PNG, JPEG, or GIF image.');
    if (
      Math.floor((t[2].length * 3) / 4) - (t[2].endsWith('==') ? 2 : t[2].endsWith('=') ? 1 : 0) >
      h.maxLogoBytes
    )
      throw new RangeError('Logo must be 512 KiB or smaller.');
    return e;
  }
  function R({
    fullName: n,
    jobTitle: e = '',
    organization: t = '',
    email: a = '',
    phone: x = '',
    website: o = '',
    location: f = '',
    accentColor: w = '#3157d5',
    logoDataUrl: E = '',
    logoAlt: L = '',
  }) {
    let i = p(n, 'Name', { required: !0 }),
      d = p(e, 'Job title'),
      l = p(t, 'Organization'),
      u = p(f, 'Location'),
      S = p(L || i, 'Logo alternative text'),
      s = p(a, 'Email');
    if (s && (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/u.test(s) || s.length > h.maxTextLength))
      throw new RangeError('Enter a valid email address.');
    let g = p(x, 'Phone');
    if (g && !/^[+\d().\s-]{3,32}$/u.test(g))
      throw new RangeError('Enter a phone number using digits and common phone symbols only.');
    let I = g ? g.replace(/[^+\d]/gu, '') : '',
      v = B(o),
      y = String(w ?? '');
    if (!/^#[\da-f]{6}$/iu.test(y)) throw new RangeError('Choose a six-digit HEX accent color.');
    let T = H(E),
      A = [d, l, u].filter(Boolean).map(m),
      b = [];
    (s &&
      b.push(`<a href="mailto:${m(s)}" style="color:${y};text-decoration:underline">${m(s)}</a>`),
      g && b.push(`<a href="tel:${m(I)}" style="color:${y};text-decoration:underline">${m(g)}</a>`),
      v &&
        b.push(
          `<a href="${m(v)}" style="color:${y};text-decoration:underline">${m(new URL(v).hostname)}</a>`,
        ));
    let U = T
        ? `<td style="padding:0 14px 0 0;vertical-align:top"><img src="${T}" alt="${m(S)}" width="72" style="display:block;width:72px;max-width:72px;height:auto;border:0"></td>`
        : '',
      q = `<td style="border-left:3px solid ${y};padding:2px 0 2px 14px;font-family:Arial,Helvetica,sans-serif;color:#202124;vertical-align:top"><div style="font-size:16px;line-height:1.35;font-weight:700">${m(i)}</div>${A.map((N) => `<div style="font-size:13px;line-height:1.5;color:#50545a">${N}</div>`).join('')}${b.length ? `<div style="font-size:13px;line-height:1.7;margin-top:6px">${b.join(' <span style="color:#9aa0a6">|</span> ')}</div>` : ''}</td>`,
      C = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tbody><tr>${U}${q}</tr></tbody></table>`,
      j = [i, ...[d, l, u].filter(Boolean), ...[s, g, v].filter(Boolean)].join(`
`);
    return Object.freeze({ html: C, plainText: j });
  }
  var r = document.querySelector('[data-tool="email-signature-generator"]');
  if (r) {
    let n = r.querySelector('#tool-form'),
      e = $(r),
      t = r.querySelector('[data-signature-result]'),
      a = r.querySelector('[data-signature-preview]'),
      x = r.querySelector('[data-signature-html]'),
      o = null,
      f = '',
      w = () => Object.assign(new RangeError(e.messages.logoUnavailable), { code: 'INVALID_LOGO' }),
      E = async (i) => {
        if (!i) return '';
        if (!['image/png', 'image/jpeg', 'image/gif'].includes(i.type) || i.size > h.maxLogoBytes)
          throw w();
        let d = await new Promise((u, S) => {
            let s = new FileReader();
            (s.addEventListener('load', () => u(String(s.result || ''))),
              s.addEventListener('error', S),
              s.readAsDataURL(i));
          }),
          l = new Image();
        l.src = d;
        try {
          await l.decode();
        } catch {
          throw w();
        }
        if (l.naturalWidth > 1600 || l.naturalHeight > 1600) throw w();
        return d;
      },
      L = async (i) => {
        (i?.preventDefault(), (o = null), (t.hidden = !0));
        try {
          let d = Object.fromEntries(
              [
                'fullName',
                'jobTitle',
                'organization',
                'email',
                'phone',
                'website',
                'location',
                'accentColor',
                'logoAlt',
              ].map((u) => [u, n.elements.namedItem(u).value]),
            ),
            l = n.elements.namedItem('logoFile').files?.[0];
          ((f = await E(l)),
            (o = R({ ...d, logoDataUrl: f })),
            (a.innerHTML = o.html),
            (x.value = o.html),
            (t.hidden = !1),
            c(r, e.messages.generated, 'success'));
        } catch (d) {
          c(
            r,
            d?.code === 'INVALID_LOGO' ? e.messages.logoUnavailable : e.messages.checkInputs,
            'error',
          );
        }
      };
    (n.addEventListener('submit', L),
      n.addEventListener('input', () => {
        ((o = null), (t.hidden = !0), c(r, ''));
      }),
      n.addEventListener('change', () => {
        ((o = null), (t.hidden = !0), c(r, ''));
      }),
      n.addEventListener('reset', () => {
        ((o = null), (f = ''), (t.hidden = !0), a.replaceChildren(), (x.value = ''), c(r, ''));
      }),
      r.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
        if (o)
          try {
            navigator.clipboard?.write && globalThis.ClipboardItem
              ? (await navigator.clipboard.write([
                  new ClipboardItem({
                    'text/html': new Blob([o.html], { type: 'text/html' }),
                    'text/plain': new Blob([o.plainText], { type: 'text/plain' }),
                  }),
                ]),
                c(r, e.messages.copied, 'success'))
              : (a.focus?.(), c(r, e.messages.copyUnavailable, 'error'));
          } catch {
            c(r, e.messages.copyUnavailable, 'error');
          }
      }),
      r.querySelector('[data-action="copyHtml"]')?.addEventListener('click', async () => {
        if (o)
          try {
            if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
            (await navigator.clipboard.writeText(o.html), c(r, e.messages.copiedHtml, 'success'));
          } catch {
            c(r, e.messages.copyUnavailable, 'error');
          }
      }),
      r.querySelector('[data-action="download"]')?.addEventListener('click', () => {
        if (!o) return;
        let i = o.plainText
            .split(
              `
`,
            )[0]
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;'),
          d = `<!doctype html><html lang="${(document.documentElement.lang || 'en').replace(/[^a-z0-9-]/giu, '')}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${i}</title><body>${o.html}</body></html>`,
          l = URL.createObjectURL(new Blob([d], { type: 'text/html;charset=utf-8' })),
          u = document.createElement('a');
        ((u.href = l),
          (u.download = 'email-signature.html'),
          u.click(),
          setTimeout(() => URL.revokeObjectURL(l), 0),
          c(r, e.messages.downloaded, 'success'));
      }));
  }
})();
