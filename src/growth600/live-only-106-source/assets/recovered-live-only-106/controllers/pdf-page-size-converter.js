(() => {
  function B(L, n, f = 'info') {
    let l = L.querySelector('[data-status]');
    l && ((l.textContent = n), (l.dataset.kind = f));
  }
  var t = document.querySelector('#tool-form');
  if (t?.classList.contains('pdf-page-size-converter')) {
    let p = function (e = null) {
        if (r)
          try {
            let s = e ?? U(),
              i =
                s.preset === 'a4'
                  ? [210, 297]
                  : s.preset === 'letter'
                    ? [215.9, 279.4]
                    : s.preset === 'legal'
                      ? [215.9, 355.6]
                      : [
                          s.width * (s.unit === 'in' ? 25.4 : 1),
                          s.height * (s.unit === 'in' ? 25.4 : 1),
                        ];
            s.orientation === 'landscape' && i.reverse();
            let x = (o) => (o / 25.4) * 72;
            if (i.some((o) => !Number.isFinite(o) || o < 25 || o > 2e3))
              throw new RangeError('size');
            let k = r.pages.map((o) =>
              s.mode === 'fit' ? Math.min(x(i[0]) / o.widthPt, x(i[1]) / o.heightPt) : 1,
            );
            (s.mode === 'actual' &&
            r.pages.some((o) => o.widthPt > x(i[0]) + 0.01 || o.heightPt > x(i[1]) + 0.01)
              ? ((q.textContent = n.messages.actualTooLarge), (h.disabled = !0))
              : ((q.textContent = n.messages.preview
                  .replace('{pages}', String(r.count))
                  .replace('{width}', `${i[0].toFixed(1)} mm`)
                  .replace('{height}', `${i[1].toFixed(1)} mm`)
                  .replace('{scale}', `${(Math.min(...k) * 100).toFixed(1)}%`)),
                (h.disabled = b)),
              (u.hidden = !1));
          } catch {
            ((q.textContent = n.messages.invalidSize), (u.hidden = !1), (h.disabled = !0));
          }
      },
      L = t.closest('[data-page]') ?? document,
      n = JSON.parse(t.parentElement.querySelector('[data-tool-copy]').textContent),
      f = t.elements.pdfFile,
      l = t.elements.preset,
      z = t.elements.orientation,
      w = t.elements.width,
      v = t.elements.height,
      g = t.elements.unit,
      C = t.elements.mode,
      u = t.querySelector('[data-page-size-preview]'),
      q = t.querySelector('[data-page-size-summary]'),
      I = t.querySelector('[data-page-size-result]'),
      d = t.querySelector('[data-page-size-download]'),
      R = t.querySelector('[data-action="inspect"]'),
      h = t.querySelector('[data-action="convert"]'),
      F = t.querySelector('[data-status]'),
      a = null,
      r = null,
      b = !1,
      y = '',
      c = (e, s = 'info') => B(L, e, s),
      N = () => {
        (y && URL.revokeObjectURL(y), (y = ''));
      },
      S = () => {
        (N(),
          (I.hidden = !0),
          (d.hidden = !0),
          d.removeAttribute('href'),
          d.removeAttribute('download'));
      },
      m = (e) => {
        ((b = e),
          (R.disabled = e || !a),
          (h.disabled = e || !r),
          (t.querySelector('[data-action="reset"]').disabled = e));
      },
      P = () =>
        import(new URL('/assets/recovered-live-only-106/published/assets/vendor/pdf-page-size-converter-engine.mjs', location.origin)),
      U = () => ({
        preset: l.value,
        orientation: z.value,
        width: Number(w.value),
        height: Number(v.value),
        unit: g.value,
        mode: C.value,
      }),
      E = () => {
        let e = l.value === 'custom';
        ((w.disabled = v.disabled = g.disabled = !e),
          e &&
            ((w.value = g.value === 'mm' ? '210' : '8.27'),
            (v.value = g.value === 'mm' ? '297' : '11.69')),
          r && p());
      };
    (l.addEventListener('change', E),
      z.addEventListener('change', () => p()),
      C.addEventListener('change', () => p()));
    for (let e of [w, v, g]) e.addEventListener('input', () => p());
    (f.addEventListener('change', () => {
      if (
        ((a = f.files?.[0] ?? null),
        (r = null),
        S(),
        (u.hidden = !0),
        (F.textContent = ''),
        m(!1),
        !!a)
      ) {
        if (a.size > 25 * 1024 * 1024)
          return ((a = null), (f.value = ''), c(n.messages.tooLarge, 'error'));
        c(`${n.messages.fileReady}: ${a.name}`, 'success');
      }
    }),
      R.addEventListener('click', async () => {
        if (!b) {
          if (!a) return c(n.messages.noFile, 'error');
          (m(!0), (r = null), (u.hidden = !0), S(), c(n.messages.inspecting, 'polite'));
          try {
            let { inspectPdfPageSizes: e } = await P();
            ((r = await e(new Uint8Array(await a.arrayBuffer()))),
              p(),
              c(n.messages.inspected.replace('{pages}', String(r.count)), 'success'));
          } catch (e) {
            ((u.hidden = !0),
              c(
                /25 MiB/u.test(String(e?.message))
                  ? n.messages.tooLarge
                  : /1–300 pages/u.test(String(e?.message))
                    ? n.messages.tooManyPages
                    : n.messages.unsupported,
                'error',
              ));
          } finally {
            (m(!1), r && p());
          }
        }
      }),
      h.addEventListener('click', async () => {
        if (!(b || !a || !r)) {
          (m(!0), S(), c(n.messages.working, 'polite'));
          try {
            let { resizePdfPageSize: e } = await P(),
              s = await e(new Uint8Array(await a.arrayBuffer()), U());
            y = URL.createObjectURL(new Blob([s.bytes], { type: 'application/pdf' }));
            let i =
              a.name
                .replace(/\.pdf$/iu, '')
                .replace(/[\\/:*?"<>|\u0000-\u001f]/gu, '_')
                .slice(0, 100) || 'document';
            ((d.href = y),
              (d.download = `${i}-resized.pdf`),
              (d.hidden = !1),
              (I.hidden = !1),
              c(n.messages.success.replace('{pages}', String(s.pages)), 'success'));
          } catch (e) {
            let s = String(e?.message ?? '');
            c(
              /actual size|larger than the selected/iu.test(s)
                ? n.messages.actualTooLarge
                : /25 MiB|50 MiB/iu.test(s)
                  ? n.messages.tooLarge
                  : n.messages.convertFailed,
              'error',
            );
          } finally {
            m(!1);
          }
        }
      }),
      t.querySelector('[data-action="reset"]').addEventListener('click', () => {
        (t.reset(), (a = null), (r = null), S(), (u.hidden = !0), (F.textContent = ''), E(), m(!1));
      }),
      E(),
      window.addEventListener('pagehide', N, { once: !0 }));
  }
})();
