(() => {
  function q(c = document) {
    let o = c.querySelector('[data-tool-copy]');
    if (!o) throw new Error('Localized tool copy is missing.');
    return JSON.parse(o.textContent);
  }
  function a(c, o, v = 'info') {
    let p = c.querySelector('[data-status]');
    p && ((p.textContent = o), (p.dataset.kind = v));
  }
  var r = document.querySelector('[data-tool="docx-editor"]');
  if (r) {
    let y = function () {
        (d?.terminate(), (d = null));
        for (let e of f.values()) e(new Error('Local document processing stopped.'));
        f.clear();
      },
      T = function () {
        if (d) return d;
        if (!c.dataset.workerSrc || c.dataset.workerSrc.includes('__WORKER_'))
          throw new Error('The local DOCX worker is unavailable.');
        return (
          (d = new Worker(c.dataset.workerSrc, {
            type: 'module',
            name: 'UsefulVerse local DOCX editor',
          })),
          (d.onmessage = ({ data: e }) => {
            let n = f.get(e?.id);
            if (n)
              if ((f.delete(e.id), e.ok)) n(null, e);
              else {
                let t = new Error(e.error?.message || 'DOCX processing failed.');
                ((t.code = e.error?.code), n(t));
              }
          }),
          (d.onerror = () => {
            for (let e of f.values()) e(new Error('The local DOCX worker stopped unexpectedly.'));
            (f.clear(), y());
          }),
          d
        );
      },
      C = function (e, n = {}, t = []) {
        let i = T(),
          s = ++L;
        return new Promise((u, m) => {
          f.set(s, (g, O) => (g ? m(g) : u(O)));
          try {
            i.postMessage({ id: s, type: e, ...n }, t);
          } catch (g) {
            (f.delete(s), m(g));
          }
        });
      },
      k = function (e) {
        let n = new Map();
        e.forEach((i, s) => n.set(l[s].paragraph, (n.get(l[s].paragraph) ?? '') + i));
        let t = [...n].map(([i, s]) => {
          let u = document.createElement('p');
          return ((u.dataset.paragraph = String(i)), (u.textContent = s), u);
        });
        E.replaceChildren(...t);
      },
      I = function () {
        let e = document.createDocumentFragment(),
          n = 0,
          t = null,
          i = 0;
        for (let s of l) {
          if (s.paragraph !== n) {
            t = document.createElement('fieldset');
            let g = document.createElement('legend');
            ((g.textContent = o.fields.paragraph.replace('{paragraph}', String(s.paragraph))),
              t.append(g),
              e.append(t),
              (n = s.paragraph),
              (i = 0));
          }
          i += 1;
          let u = document.createElement('label'),
            m = document.createElement('input');
          ((m.type = 'text'),
            (m.value = s.text),
            (m.maxLength = 25e4),
            (m.dataset.docxRun = String(s.index)),
            (u.textContent = o.fields.segment.replace('{segment}', String(i))),
            u.append(m),
            t.append(u));
        }
        (h.replaceChildren(e),
          (h.hidden = !1),
          (p.hidden = !1),
          (w.disabled = !1),
          (x.disabled = !1),
          k(b()));
      },
      c = r.querySelector('#tool-form'),
      o = q(r),
      v = c.elements.namedItem('file'),
      p = r.querySelector('[data-docx-workspace]'),
      h = r.querySelector('[data-docx-editor]'),
      E = r.querySelector('[data-docx-preview]'),
      w = r.querySelector('[data-action="save"]'),
      x = r.querySelector('[data-action="copy"]'),
      d = null,
      L = 0,
      l = [],
      S = '',
      f = new Map(),
      R = (e) =>
        (e
          .replace(/\.docx$/iu, '')
          .replace(/[\u0000-\u001f\\/:*?"<>|]/gu, '-')
          .slice(0, 100) || 'document') + '-edited.docx',
      b = () => [...h.querySelectorAll('[data-docx-run]')].map((e) => e.value);
    async function N(e) {
      e.preventDefault();
      let n = v.files?.[0];
      if (!n) {
        a(r, o.messages.noFile, 'error');
        return;
      }
      if (n.size > 25 * 1024 * 1024) {
        a(r, o.messages.tooLarge, 'error');
        return;
      }
      (y(),
        (l = []),
        (S = n.name),
        (c.querySelector('[data-action="open"]').disabled = !0),
        (p.hidden = !0),
        E.replaceChildren(),
        a(r, o.messages.loading));
      try {
        let t = await n.arrayBuffer();
        ((l = [...(await C('open', { buffer: t }, [t])).report.runs]),
          I(),
          a(r, o.messages.ready, 'success'));
      } catch (t) {
        ((l = []),
          h.replaceChildren(),
          (p.hidden = !0),
          y(),
          t?.code === 'no-text'
            ? a(r, o.messages.noText, 'error')
            : t?.code?.includes('limit') || t?.code === 'document-limit'
              ? a(r, o.messages.tooLarge, 'error')
              : t?.code === 'tracked-changes'
                ? a(r, o.messages.unsupported, 'error')
                : a(r, o.messages.invalid, 'error'));
      } finally {
        c.querySelector('[data-action="open"]').disabled = !1;
      }
    }
    (c.addEventListener('submit', N),
      h.addEventListener('input', () => {
        (k(b()), a(r, o.messages.changed));
      }),
      (w.disabled = !0),
      (x.disabled = !0),
      w.addEventListener('click', async () => {
        if (!(!d || !l.length)) {
          w.disabled = !0;
          try {
            let { result: e } = await C('save', { values: b() }),
              n = URL.createObjectURL(
                new Blob([e.buffer], {
                  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                }),
              ),
              t = document.createElement('a');
            ((t.href = n),
              (t.download = R(S)),
              t.click(),
              setTimeout(() => URL.revokeObjectURL(n), 1e3),
              a(r, o.messages.downloaded, 'success'));
          } catch {
            a(r, o.messages.failed, 'error');
          } finally {
            w.disabled = !1;
          }
        }
      }),
      x.addEventListener('click', async () => {
        if (l.length)
          try {
            let e = new Map();
            (b().forEach((n, t) => e.set(l[t].paragraph, (e.get(l[t].paragraph) ?? '') + n)),
              await navigator.clipboard.writeText(
                [...e.values()].join(`
`),
              ),
              a(r, o.messages.copied, 'success'));
          } catch {
            a(r, o.messages.copyUnavailable, 'error');
          }
      }),
      r.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
        (y(),
          (v.value = ''),
          (l = []),
          (S = ''),
          h.replaceChildren(),
          (p.hidden = !0),
          E.replaceChildren(),
          (w.disabled = !0),
          (x.disabled = !0),
          a(r, o.messages.cleared, 'success'));
      }),
      window.addEventListener('pagehide', y, { once: !0 }));
  }
})();
