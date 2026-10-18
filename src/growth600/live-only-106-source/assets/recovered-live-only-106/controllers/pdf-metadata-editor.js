(() => {
  function L(a, e, u = 'info') {
    let d = a.querySelector('[data-status]');
    d && ((d.textContent = e), (d.dataset.kind = u));
  }
  var y = document.querySelector('[data-tool="pdf-metadata-editor"]');
  if (y) {
    let a = y.querySelector('#tool-form'),
      e = JSON.parse(y.querySelector('[data-tool-copy]').textContent),
      u = a.elements.pdfFile,
      d = a.querySelector('[data-action="read"]'),
      w = a.querySelector('[data-action="clear"]'),
      b = a.querySelector('[data-action="save"]'),
      p = a.querySelector('[data-metadata-fields]'),
      h = a.querySelector('[data-metadata-result]'),
      S = a.querySelector('[data-pages]'),
      i = a.querySelector('[data-download]'),
      n = null,
      o = 0,
      l = '',
      f = !1,
      r = (t, s = 'info') => L(y, t, s),
      x = () => {
        (l && URL.revokeObjectURL(l), (l = ''));
      },
      m = () => {
        (x(),
          (h.hidden = !0),
          (S.textContent = ''),
          (i.hidden = !0),
          i.removeAttribute('href'),
          i.removeAttribute('download'));
      },
      c = (t) => {
        ((f = t),
          (d.disabled = t || !n),
          (w.disabled = t || !o),
          (b.disabled = t || !o),
          (a.querySelector('[data-action="reset"]').disabled = t));
      },
      q = async () =>
        import(new URL('/assets/recovered-live-only-106/published/assets/vendor/pdf-metadata-editor-engine.mjs', location.origin)),
      v = () =>
        Object.fromEntries(
          [
            'title',
            'author',
            'subject',
            'keywords',
            'creator',
            'producer',
            'creationDate',
            'modificationDate',
          ].map((t) => [t, a.elements.namedItem(t).value]),
        );
    (u.addEventListener('change', () => {
      ((n = u.files?.[0] ?? null), (o = 0), (p.hidden = !0), m());
      for (let t of Object.keys(v())) a.elements.namedItem(t).value = '';
      if ((r(''), c(!1), !!n)) {
        if (n.size > 25 * 1024 * 1024)
          return ((n = null), (u.value = ''), c(!1), r(e.messages.tooLarge, 'error'));
        r(`${e.messages.fileReady}: ${n.name}`, 'success');
      }
    }),
      d.addEventListener('click', async () => {
        if (!f) {
          if (!n) return r(e.messages.noFile, 'error');
          if (n.size > 25 * 1024 * 1024) return r(e.messages.tooLarge, 'error');
          (c(!0), m(), r(e.messages.reading, 'polite'));
          try {
            let { readPdfMetadata: t } = await q(),
              s = await t(new Uint8Array(await n.arrayBuffer()));
            o = s.pages;
            for (let [g, k] of Object.entries(s.metadata)) a.elements.namedItem(g).value = k;
            ((p.hidden = !1),
              (w.disabled = !1),
              (b.disabled = !1),
              r(e.messages.readSuccess, 'success'));
          } catch (t) {
            ((o = 0), (p.hidden = !0));
            let s = String(t?.message ?? ''),
              g = /25 MiB|50 MiB/u.test(s)
                ? e.messages.tooLarge
                : /between 1 and 300 pages/u.test(s)
                  ? e.messages.tooManyPages
                  : /does not appear to be a PDF/u.test(s)
                    ? e.messages.invalid
                    : e.messages.readFailed;
            r(g, 'error');
          } finally {
            c(!1);
          }
        }
      }),
      w.addEventListener('click', () => {
        if (!(f || !o)) {
          for (let t of Object.keys(v())) a.elements.namedItem(t).value = '';
          (m(), r(e.messages.cleared, 'success'));
        }
      }),
      b.addEventListener('click', async () => {
        if (!f) {
          if (!n || !o) return r(e.messages.noFile, 'error');
          if (n.size > 25 * 1024 * 1024) return r(e.messages.tooLarge, 'error');
          (c(!0), m(), r(e.messages.saving, 'polite'));
          try {
            let { updatePdfMetadata: t } = await q(),
              s = await t(new Uint8Array(await n.arrayBuffer()), v());
            l = URL.createObjectURL(new Blob([s.bytes], { type: 'application/pdf' }));
            let g =
              n.name
                .replace(/\.pdf$/iu, '')
                .replace(/[\\/:*?"<>|\u0000-\u001f]/gu, '_')
                .slice(0, 100) || 'document';
            ((i.href = l),
              (i.download = `${g}-metadata-edited.pdf`),
              (i.hidden = !1),
              (S.textContent = `${e.fields.pages}: ${s.pages}`),
              (h.hidden = !1),
              r(e.messages.saved, 'success'));
          } catch (t) {
            let s = String(t?.message ?? '');
            r(
              /25 MiB|50 MiB/u.test(s)
                ? e.messages.tooLarge
                : /exceeds its local text limit|valid date and time/u.test(s)
                  ? e.messages.invalid
                  : e.messages.saveFailed,
              'error',
            );
          } finally {
            c(!1);
          }
        }
      }),
      i.addEventListener('click', () => {
        l && r(e.messages.downloadReady, 'success');
      }),
      a.querySelector('[data-action="reset"]').addEventListener('click', () => {
        f || (a.reset(), (n = null), (o = 0), (p.hidden = !0), m(), r(''), c(!1));
      }),
      window.addEventListener('pagehide', x, { once: !0 }));
  }
})();
