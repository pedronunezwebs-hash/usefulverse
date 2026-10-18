(() => {
  function w(e = document) {
    let t = e.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function c(e, t, s = 'info') {
    let o = e.querySelector('[data-status]');
    o && ((o.textContent = t), (o.dataset.kind = s));
  }
  var m = Object.freeze({
    address: 900,
    subject: 180,
    salutation: 160,
    body: 12e3,
    closing: 160,
    signature: 240,
  });
  function p(e, t, s, { required: o = !1 } = {}) {
    let a = String(e ?? '')
      .replace(
        /\r\n?/gu,
        `
`,
      )
      .trim();
    if (o && !a) throw new TypeError(`${t} is required.`);
    if (Array.from(a).length > s) throw new RangeError(`${t} is too long.`);
    return a;
  }
  function S(e, t, s) {
    let o = p(e, t, m.address, { required: s });
    if (
      o.split(`
`).length > 12
    )
      throw new RangeError(`${t} must contain at most 12 lines.`);
    return o;
  }
  function f(e) {
    if (!e || typeof e != 'object') throw new TypeError('Enter the letter details.');
    let t = String(e.date ?? '').trim(),
      s = new Date(`${t}T00:00:00.000Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/u.test(t) ||
      Number.isNaN(s.valueOf()) ||
      s.toISOString().slice(0, 10) !== t
    )
      throw new TypeError('Enter a valid date.');
    let o = String(e.paper ?? 'letter'),
      a = String(e.style ?? 'classic');
    if (!['letter', 'a4'].includes(o)) throw new RangeError('Choose Letter or A4 paper.');
    if (!['classic', 'compact', 'modern'].includes(a))
      throw new RangeError('Choose a supported letter style.');
    let r = p(e.body, 'Letter body', m.body, { required: !0 });
    if (
      r.split(`
`).length > 100
    )
      throw new RangeError('The letter body must contain at most 100 lines.');
    return Object.freeze({
      sender: S(e.sender, 'Sender address', !0),
      recipient: S(e.recipient, 'Recipient address', !0),
      date: t,
      subject: p(e.subject, 'Subject', m.subject),
      salutation: p(e.salutation, 'Salutation', m.salutation, { required: !0 }),
      body: r,
      closing: p(e.closing, 'Closing', m.closing, { required: !0 }),
      signature: p(e.signature, 'Signature', m.signature, { required: !0 }),
      paper: o,
      style: a,
    });
  }
  function h(e, { locale: t = 'en', dateLabel: s = 'Date', subjectLabel: o = 'Subject' } = {}) {
    let a = f(e),
      r = new Intl.DateTimeFormat(t, { dateStyle: 'long', timeZone: 'UTC' }).format(
        new Date(`${a.date}T00:00:00.000Z`),
      );
    return [
      a.sender,
      '',
      a.recipient,
      '',
      `${s}: ${r}`,
      ...(a.subject ? [`${o}: ${a.subject}`] : []),
      '',
      a.salutation,
      '',
      a.body,
      '',
      a.closing,
      '',
      a.signature,
    ].join(`
`);
  }
  var n = document.querySelector('[data-tool="business-letter-generator"]');
  if (n) {
    let u = function (d, i, v) {
        let y = document.createElement(d);
        return ((y.className = v), (y.textContent = i), y);
      },
      g = function (d) {
        d?.preventDefault();
        try {
          ((r = f({
            sender: l('sender'),
            recipient: l('recipient'),
            date: l('date'),
            subject: l('subject'),
            salutation: l('salutation'),
            body: l('body'),
            closing: l('closing'),
            signature: l('signature'),
            paper: l('paper'),
            style: l('style'),
          })),
            (o.dataset.style = r.style),
            (o.dataset.paper = r.paper));
          let i = document.querySelector('[data-business-letter-print-style]');
          return (
            i ||
              ((i = document.createElement('style')),
              (i.dataset.businessLetterPrintStyle = ''),
              document.head.append(i)),
            (i.textContent = `@media print{@page{size:${r.paper === 'a4' ? 'A4' : 'letter'};margin:18mm}}`),
            s.replaceChildren(
              u('div', r.sender, 'business-letter-generator__sender'),
              u('div', r.recipient, 'business-letter-generator__recipient'),
              u(
                'p',
                new Intl.DateTimeFormat(a, { dateStyle: 'long', timeZone: 'UTC' }).format(
                  new Date(`${r.date}T00:00:00.000Z`),
                ),
                'business-letter-generator__date',
              ),
            ),
            r.subject &&
              s.append(
                u('p', `${t.fields.subject}: ${r.subject}`, 'business-letter-generator__subject'),
              ),
            s.append(u('p', r.salutation, 'business-letter-generator__salutation')),
            s.append(u('p', r.body, 'business-letter-generator__body')),
            s.append(
              u(
                'p',
                `${r.closing}

${r.signature}`,
                'business-letter-generator__signature',
              ),
            ),
            (n.querySelector('[data-letter-result]').hidden = !1),
            c(n, t.messages.ready, 'success'),
            !0
          );
        } catch {
          return (
            (r = null),
            (n.querySelector('[data-letter-result]').hidden = !0),
            c(n, t.messages.invalid, 'error'),
            !1
          );
        }
      },
      e = n.querySelector('#tool-form'),
      t = w(n),
      s = n.querySelector('[data-letter-preview]'),
      o = n.querySelector('[data-letter-paper]'),
      a = document.documentElement.lang || 'en',
      r = null,
      l = (d) => e.elements.namedItem(d)?.value ?? '',
      b = () => h(r, { locale: a, dateLabel: t.fields.date, subjectLabel: t.fields.subject });
    ((e.elements.namedItem('date').value =
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`),
      e.addEventListener('submit', g),
      n.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        ((e.elements.namedItem('sender').value = `Alex Example
42 Main Street
Springfield, IL 62701`),
          (e.elements.namedItem('recipient').value = `Jordan Client
8 Market Road
Springfield, IL 62702`),
          (e.elements.namedItem('subject').value = 'Project update'),
          (e.elements.namedItem('salutation').value = 'Dear Jordan,'),
          (e.elements.namedItem('body').value = `I am writing to share the latest project update.
The delivery is scheduled for Friday.`),
          (e.elements.namedItem('closing').value = 'Sincerely,'),
          (e.elements.namedItem('signature').value = 'Alex Example'),
          g(),
          c(n, t.messages.exampleLoaded, 'success'));
      }),
      n.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
        if (!(!r && !g()))
          try {
            (await navigator.clipboard.writeText(b()), c(n, t.messages.copied, 'success'));
          } catch {
            c(n, t.messages.copyUnavailable, 'error');
          }
      }),
      n.querySelector('[data-action="download"]')?.addEventListener('click', () => {
        if (!r && !g()) return;
        let d = URL.createObjectURL(new Blob([b()], { type: 'text/plain;charset=utf-8' })),
          i = document.createElement('a');
        ((i.href = d),
          (i.download = 'business-letter.txt'),
          i.click(),
          setTimeout(() => URL.revokeObjectURL(d), 1e3),
          c(n, t.messages.downloaded, 'success'));
      }),
      n.querySelector('[data-action="print"]')?.addEventListener('click', () => {
        (!r && !g()) || window.print();
      }),
      n.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
        setTimeout(() => {
          ((r = null),
            (n.querySelector('[data-letter-result]').hidden = !0),
            s.replaceChildren(),
            c(n, t.messages.cleared));
        }, 0);
      }),
      e.addEventListener('input', () => {
        ((r = null),
          (n.querySelector('[data-letter-result]').hidden = !0),
          s.replaceChildren(),
          c(n, ''));
      }));
  }
})();
