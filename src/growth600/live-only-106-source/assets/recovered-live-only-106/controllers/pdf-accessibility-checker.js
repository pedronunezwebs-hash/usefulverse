(() => {
  function S(u = document) {
    let e = u.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function s(u, e, m = 'info') {
    let o = u.querySelector('[data-status]');
    o && ((o.textContent = e), (o.dataset.kind = m));
  }
  var w = Object.freeze({ maxInputBytes: 26214400, maxPages: 300, maxTextCharacters: 2e6 });
  var t = document.querySelector('[data-tool="pdf-accessibility-checker"]');
  if (t) {
    let A = function (r) {
        let a = [
            n('h3', e.fields.reportTitle),
            n('p', `${e.fields.title}: ${r.title || e.fields.signalMissing}`),
            n('p', `${e.fields.language}: ${r.language || e.fields.signalMissing}`),
            n('p', `${e.fields.pages}: ${r.pageCount}`),
            n('p', `${e.fields.textCharacters}: ${r.textCharacters}`),
            n('p', `${e.fields.figures}: ${r.figureCount}`),
            n('p', `${e.fields.figuresWithoutAlt}: ${r.figuresWithoutAlt}`),
            n('p', `${e.fields.headingJumps}: ${r.headingLevelJumps}`),
          ],
          i = document.createElement('ul');
        for (let [l, g] of v) {
          let b = r.signals.find((q) => q.key === l),
            L = b?.present ? e.fields.signalPresent : e.fields.signalMissing,
            x = n('li', `${e.fields[g]}: ${L}`);
          ((x.dataset.signal = l), (x.dataset.present = String(!!b?.present)), i.append(x));
        }
        let c = document.createElement('div');
        c.append(n('h3', e.fields.manualTitle), n('ul', ''));
        let y = c.querySelector('ul');
        for (let l of ['manualOrder', 'manualAlt', 'manualContrast'])
          y.append(n('li', e.fields[l]));
        (a.push(i, n('p', e.fields.scopeNote, 'hint'), c),
          o.replaceChildren(...a),
          (o.hidden = !1),
          (h.disabled = !1),
          (f = [
            e.actions.result,
            ...a.flatMap((l) =>
              l.tagName === 'UL' ? [...l.children].map((g) => g.textContent) : [l.textContent],
            ),
          ].join(`
`)));
      },
      C = function (r, a) {
        s(t, e.messages.progress.replace('{page}', String(r)).replace('{pages}', String(a)));
      },
      u = t.querySelector('#tool-form'),
      e = S(t),
      m = u.elements.namedItem('file'),
      o = t.querySelector('[data-pdf-a11y-result]'),
      p = t.querySelector('[data-action="cancel"]'),
      h = t.querySelector('[data-action="copy"]'),
      d = null,
      f = '';
    ((p.hidden = !0), (h.disabled = !0));
    let v = [
        ['title', 'title'],
        ['language', 'language'],
        ['taggedStructure', 'tagged'],
        ['extractableText', 'text'],
        ['figureAlternatives', 'figureAlt'],
        ['headingSequence', 'headingSequence'],
      ],
      n = (r, a, i = '') => {
        let c = document.createElement(r);
        return ((c.textContent = a), i && (c.className = i), c);
      };
    async function I(r) {
      if ((r?.preventDefault(), d)) return;
      let a = m.files?.[0];
      if (!a) {
        s(t, e.messages.noFile, 'error');
        return;
      }
      if (a.size > w.maxInputBytes) {
        s(t, e.messages.tooLarge, 'error');
        return;
      }
      ((d = new AbortController()),
        (t.querySelector('[data-action="inspect"]').disabled = !0),
        (p.hidden = !1),
        (p.disabled = !1),
        (h.disabled = !0),
        (o.hidden = !0),
        (f = ''));
      try {
        let i = new Uint8Array(await a.arrayBuffer()),
          { inspectPdfAccessibility: c } = await import(
            new URL('/assets/recovered-live-only-106/published/assets/vendor/extract-images-pdf-engine.mjs', location.origin).href
          ),
          y = await c(i, {
            signal: d.signal,
            onProgress: ({ pageNumber: l, totalPages: g }) => C(l, g),
          });
        (A(y), s(t, e.messages.success, 'success'));
      } catch (i) {
        ((o.hidden = !0),
          i?.name === 'AbortError'
            ? s(t, e.messages.cancelled, 'info')
            : i?.message?.includes('25 MiB') || i?.message?.includes('between 1 and 300 pages')
              ? s(t, e.messages.tooLarge, 'error')
              : i?.message?.includes('2,000,000-character')
                ? s(t, e.messages.textLimit, 'error')
                : i?.code === 'invalid-file'
                  ? s(t, e.messages.invalid, 'error')
                  : s(t, e.messages.failed, 'error'));
      } finally {
        ((d = null), (t.querySelector('[data-action="inspect"]').disabled = !1), (p.hidden = !0));
      }
    }
    (u.addEventListener('submit', I),
      t.querySelector('[data-action="cancel"]')?.addEventListener('click', () => d?.abort()),
      t.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
        if (f)
          try {
            (await navigator.clipboard.writeText(f), s(t, e.messages.copied, 'success'));
          } catch {
            s(t, e.messages.copyUnavailable, 'error');
          }
      }),
      t.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
        (d?.abort(),
          (m.value = ''),
          o.replaceChildren(),
          (o.hidden = !0),
          (f = ''),
          (h.disabled = !0),
          s(t, e.messages.cleared, 'success'));
      }));
  }
})();
