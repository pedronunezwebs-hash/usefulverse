(() => {
  function g(a, e, s = 'info') {
    let i = a.querySelector('[data-status]');
    i && ((i.textContent = e), (i.dataset.kind = s));
  }
  var r = document.querySelector('[data-tool="extract-images-from-pdf"]');
  if (r) {
    let a = r.querySelector('#tool-form'),
      e = JSON.parse(r.querySelector('[data-tool-copy]').textContent),
      s = a.elements.pdfFile,
      i = r.querySelector('[data-status]'),
      c = r.querySelector('[data-extraction-progress]'),
      L = r.querySelector('[data-extraction-results]'),
      C = r.querySelector('[data-extracted-images]'),
      d = r.querySelector('[data-download-zip]'),
      k = r.querySelector('[data-image-summary]'),
      z = a.querySelector('[data-action="extract"]'),
      v = a.querySelector('[data-action="cancel"]'),
      o = null,
      b = [],
      q = !1,
      E = () => {
        for (let t of b) URL.revokeObjectURL(t);
        b = [];
      },
      w = () => {
        (E(),
          (L.hidden = !0),
          C.replaceChildren(),
          (d.hidden = !0),
          d.removeAttribute('href'),
          d.removeAttribute('download'),
          (c.hidden = !0),
          c.removeAttribute('value'));
      },
      x = (t) => g(r, t, 'error'),
      A = (t) =>
        t
          .replace(/\.pdf$/iu, '')
          .replace(/[\\/:*?"<>|\u0000-\u001f]/gu, '_')
          .slice(0, 80) || 'pdf-images',
      R = (t) => {
        ((q = t), (z.disabled = t), (v.hidden = !t), (s.disabled = t), t || (v.hidden = !0));
      };
    (s.addEventListener('change', () => {
      (w(), (i.textContent = ''));
      let t = s.files?.[0];
      if (t) {
        if (t.size > 25 * 1024 * 1024) return ((s.value = ''), x(e.messages.tooLarge));
        g(r, `${e.messages.fileReady}: ${t.name}`, 'success');
      }
    }),
      a.addEventListener('submit', async (t) => {
        if ((t.preventDefault(), q)) return;
        let h = s.files?.[0];
        if (!h) return x(e.messages.noFile);
        if (h.size > 25 * 1024 * 1024) return x(e.messages.tooLarge);
        (R(!0),
          w(),
          (c.hidden = !1),
          (c.max = 1),
          (c.value = 0),
          (o = new AbortController()),
          g(r, e.messages.working, 'polite'));
        try {
          let S = new Uint8Array(await h.arrayBuffer());
          if (o.signal.aborted) return;
          let { extractPdfImages: u } = await import(
              new URL('/assets/recovered-live-only-106/published/assets/vendor/extract-images-pdf-engine.mjs', location.origin)
            ),
            m = await u(S, {
              signal: o.signal,
              onProgress: ({ pageNumber: n, totalPages: p, imageCount: l }) => {
                ((c.max = p),
                  (c.value = n),
                  (i.textContent = e.messages.progress
                    .replace('{page}', String(n))
                    .replace('{pages}', String(p))
                    .replace('{images}', String(l))));
              },
            });
          if (o.signal.aborted) return;
          let I = A(h.name),
            U = URL.createObjectURL(m.zip);
          (b.push(U),
            (d.href = U),
            (d.download = `${I}-images.zip`),
            (d.hidden = !1),
            (k.textContent = e.fields.imageCount
              .replace('{count}', String(m.images.length))
              .replace('{pages}', String(m.pages))),
            m.images.forEach((n, p) => {
              let l = document.createElement('li');
              if (((l.className = 'extract-images-pdf__item'), p < 12)) {
                let y = document.createElement('img');
                y.className = 'extract-images-pdf__preview';
                let N = URL.createObjectURL(n.blob);
                (b.push(N),
                  (y.src = N),
                  (y.alt = `${e.fields.previewLabel} ${p + 1}`),
                  (y.loading = 'lazy'),
                  l.append(y));
              }
              let $ = document.createElement('p');
              (($.textContent = `${n.name} \xB7 ${e.fields.pageLabel} ${n.pageNumber} \xB7 ${n.width} \xD7 ${n.height}`),
                l.append($));
              let f = document.createElement('a');
              ((f.className = 'button button--secondary'),
                (f.href = URL.createObjectURL(n.blob)),
                b.push(f.href),
                (f.download = n.name),
                (f.textContent = `${e.actions.downloadImage} ${p + 1}`),
                l.append(f),
                C.append(l));
            }),
            (L.hidden = !1),
            g(
              r,
              e.messages.success
                .replace('{count}', String(m.images.length))
                .replace('{pages}', String(m.pages)),
              'success',
            ));
        } catch (S) {
          if (S?.name === 'AbortError' || o.signal.aborted) g(r, e.messages.cancelled, 'info');
          else {
            let u = String(S?.message ?? '');
            x(
              /password|encrypted/iu.test(u)
                ? e.messages.password
                : /invalid pdf|does not appear to be a pdf|missing pdf|not a readable pdf|pdf structure/iu.test(
                      u,
                    )
                  ? e.messages.invalidPdf
                  : /25 MiB|300 pages|200 extractable|8 million|16 million|local per-image|total pixel/iu.test(
                        u,
                      )
                    ? e.messages.limits
                    : /No extractable raster image/iu.test(u)
                      ? e.messages.noImages
                      : e.messages.failed,
            );
          }
          w();
        } finally {
          ((o = null), R(!1));
        }
      }),
      v.addEventListener('click', () => o?.abort()),
      a.querySelector('[data-action="reset"]').addEventListener('click', () => {
        (o?.abort(), a.reset(), w(), (i.textContent = ''));
      }),
      window.addEventListener('pagehide', E, { once: !0 }));
  }
})();
