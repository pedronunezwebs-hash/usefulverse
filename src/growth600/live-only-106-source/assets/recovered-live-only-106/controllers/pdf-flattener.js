(() => {
  function l(n, e, o = 'info') {
    let a = n.querySelector('[data-status]');
    a && ((a.textContent = e), (a.dataset.kind = o));
  }
  var t = document.querySelector('[data-tool="pdf-flattener"]');
  if (t) {
    let n = t.querySelector('#tool-form'),
      e = JSON.parse(t.querySelector('[data-tool-copy]').textContent),
      o = n.elements.pdfFile,
      a = t.querySelector('[data-status]'),
      y = t.querySelector('[data-pdf-flattener-result]'),
      s = t.querySelector('[data-pdf-flattener-output]'),
      c = '',
      p = !1,
      w = () => {
        (c && URL.revokeObjectURL(c), (c = ''));
      },
      u = () => {
        (w(),
          (s.hidden = !0),
          s.removeAttribute('href'),
          s.removeAttribute('download'),
          (y.hidden = !0));
      },
      b = async () => import(new URL('/assets/recovered-live-only-106/published/assets/vendor/pdf-flattener-engine.mjs', location.origin)),
      d = (r) => l(t, r, 'error');
    (o.addEventListener('change', () => {
      (u(), (a.textContent = ''));
      let r = o.files?.[0];
      if (r) {
        if (r.size > 25 * 1024 * 1024) return ((o.value = ''), d(e.messages.tooLarge));
        l(
          t,
          `${e.messages.fileReady}: ${r.name} (${new Intl.NumberFormat(e.copyLanguage.replace('_', '-')).format(r.size)} bytes).`,
          'success',
        );
      }
    }),
      n.addEventListener('submit', async (r) => {
        if ((r.preventDefault(), p)) return;
        let f = o.files?.[0];
        if (!f) return d(e.messages.noFile);
        if (f.size > 25 * 1024 * 1024) return d(e.messages.tooLarge);
        ((p = !0),
          u(),
          (n.querySelector('[data-action="flatten"]').disabled = !0),
          l(t, e.messages.working, 'polite'));
        try {
          let m = new Uint8Array(await f.arrayBuffer()),
            { flattenPdfForm: i } = await b(),
            { bytes: g, pages: v, fieldCount: x } = await i(m);
          c = URL.createObjectURL(new Blob([g], { type: 'application/pdf' }));
          let S =
            f.name
              .replace(/\.pdf$/iu, '')
              .replace(/[\\/:*?"<>|\u0000-\u001f]/gu, '_')
              .slice(0, 100) || 'document';
          ((s.href = c),
            (s.download = `${S}-flattened.pdf`),
            (s.hidden = !1),
            (y.hidden = !1),
            l(
              t,
              e.messages.success.replace('{pages}', String(v)).replace('{fields}', String(x)),
              'success',
            ));
        } catch (m) {
          u();
          let i = String(m?.message ?? ''),
            g = /no supported interactive form fields/iu.test(i)
              ? e.messages.noFields
              : /XFA|encrypted|password/iu.test(i)
                ? e.messages.unsupported
                : /300 pages|no pages|too many form fields/iu.test(i)
                  ? e.messages.tooManyPages
                  : /25 MiB|50 MiB/iu.test(i)
                    ? e.messages.tooLarge
                    : e.messages.flattenFailed;
          d(g);
        } finally {
          ((p = !1), (n.querySelector('[data-action="flatten"]').disabled = !1));
        }
      }),
      n.querySelector('[data-action="reset"]').addEventListener('click', () => {
        (n.reset(), u(), (a.textContent = ''));
      }),
      window.addEventListener('pagehide', w, { once: !0 }));
  }
})();
