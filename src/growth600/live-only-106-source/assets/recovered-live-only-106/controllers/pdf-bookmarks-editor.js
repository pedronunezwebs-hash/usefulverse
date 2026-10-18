(() => {
  function H(R, e, x = 'info') {
    let l = R.querySelector('[data-status]');
    l && ((l.textContent = e), (l.dataset.kind = x));
  }
  var r = document.querySelector('#tool-form');
  if (r?.classList.contains('pdf-bookmarks-editor')) {
    let m = function () {
        (J.replaceChildren(),
          (V.hidden = a.length > 0),
          (G.textContent = `${e.fields.pages}: ${c} \xB7 ${e.fields.bookmarkCount}: ${a.length}`));
        for (let [n, t] of a.entries()) {
          let g = document.createElement('fieldset');
          g.className = 'pdf-bookmarks-editor__row';
          let z = document.createElement('legend');
          ((z.textContent = `${e.fields.bookmarksHeading} ${n + 1}`), g.append(z));
          let C = document.createElement('label');
          ((C.className = 'field'), (C.textContent = e.fields.title));
          let y = document.createElement('input');
          ((y.type = 'text'),
            (y.maxLength = 512),
            (y.required = !0),
            (y.value = t.title),
            (y.autocomplete = 'off'),
            y.addEventListener('input', () => {
              t.title = y.value;
            }),
            C.append(y));
          let I = document.createElement('label');
          ((I.className = 'field'), (I.textContent = e.fields.page));
          let p = document.createElement('input');
          ((p.type = 'number'),
            (p.min = '1'),
            (p.max = String(c)),
            (p.step = '1'),
            (p.required = !0),
            (p.value = String(t.page)),
            p.addEventListener('input', () => {
              t.page = Number(p.value);
            }),
            I.append(p));
          let N = document.createElement('label');
          ((N.className = 'field'), (N.textContent = e.fields.parent));
          let E = document.createElement('select'),
            F = document.createElement('option');
          ((F.value = ''), (F.textContent = e.fields.topLevel), E.append(F));
          let K = (o) => {
            let i = o.parentId,
              b = new Set();
            for (; i && !b.has(i);) {
              if (i === t.id) return !0;
              (b.add(i), (i = a.find(({ id: h }) => h === i)?.parentId ?? ''));
            }
            return !1;
          };
          for (let o of a)
            if (o.id !== t.id && !K(o)) {
              let i = document.createElement('option');
              ((i.value = o.id),
                (i.textContent = o.title),
                (i.selected = t.parentId === o.id),
                E.append(i));
            }
          (E.addEventListener('change', () => {
            ((t.parentId = E.value), m());
          }),
            N.append(E));
          let U = document.createElement('label');
          U.className = 'pdf-bookmarks-editor__closed';
          let L = document.createElement('input');
          ((L.type = 'checkbox'),
            (L.checked = t.open !== !1),
            L.addEventListener('change', () => {
              t.open = L.checked;
            }),
            U.append(L, document.createTextNode(e.fields.closed)));
          let A = document.createElement('div');
          A.className = 'actions';
          let j = (o, i, b, h) => {
              let v = document.createElement('button');
              ((v.type = 'button'),
                (v.className = 'button button--secondary'),
                (v.dataset.action = o),
                (v.textContent = i),
                (v.disabled = b),
                v.addEventListener('click', h),
                A.append(v));
            },
            _ = a
              .map((o, i) => ({ candidate: o, at: i }))
              .filter(({ candidate: o }) => o.parentId === t.parentId),
            $ = _.findIndex(({ candidate: o }) => o.id === t.id),
            D = (o) => {
              let i = _[$ + o];
              if (!i) return;
              let b = a.indexOf(t),
                h = i.at;
              (([a[b], a[h]] = [a[h], a[b]]), m());
            };
          (j('up', e.fields.up, $ <= 0 || u, () => D(-1)),
            j('down', e.fields.down, $ < 0 || $ >= _.length - 1 || u, () => D(1)),
            j('remove', e.fields.remove, u, () => {
              ((a = a.filter((o) => o.id !== t.id)),
                a.forEach((o) => {
                  o.parentId === t.id && (o.parentId = t.parentId);
                }),
                m(),
                s(e.messages.cleared, 'success'));
            }),
            g.append(C, I, N, U, A),
            J.append(g));
        }
        f(u);
      },
      R = r.closest('[data-page]') ?? document,
      e = JSON.parse(r.parentElement.querySelector('[data-tool-copy]').textContent),
      x = r.elements.pdfFile,
      l = r.querySelector('[data-bookmarks-workspace]'),
      J = r.querySelector('[data-bookmark-list]'),
      V = r.querySelector('[data-bookmark-empty]'),
      G = r.querySelector('[data-bookmark-summary]'),
      O = r.querySelector('[data-bookmark-json]'),
      T = r.querySelector('[data-bookmark-result]'),
      M = r.querySelector('[data-bookmark-result-summary]'),
      k = r.querySelector('[data-bookmark-download]'),
      d = null,
      c = 0,
      a = [],
      u = !1,
      w = '',
      S = 0,
      s = (n, t = 'info') => H(R, n, t),
      P = () => {
        (w && URL.revokeObjectURL(w), (w = ''));
      },
      q = () => {
        (P(),
          (T.hidden = !0),
          (M.textContent = ''),
          (k.hidden = !0),
          k.removeAttribute('href'),
          k.removeAttribute('download'));
      },
      f = (n) => {
        ((u = n),
          (r.querySelector('[data-action="read"]').disabled = n || !d),
          (r.querySelector('[data-action="add"]').disabled = n || !c || a.length >= 500),
          (r.querySelector('[data-action="save"]').disabled = n || !c),
          l.querySelectorAll('button,input,select,textarea').forEach((t) => {
            t.disabled = n;
          }));
      },
      B = () => import(new URL('/assets/recovered-live-only-106/published/assets/vendor/pdf-bookmarks-editor-engine.mjs', location.origin));
    (x.addEventListener('change', () => {
      if (
        ((d = x.files?.[0] ?? null),
        (c = 0),
        (a = []),
        (l.hidden = !0),
        q(),
        m(),
        s(''),
        f(!1),
        !!d)
      ) {
        if (d.size > 25 * 1024 * 1024)
          return ((d = null), (x.value = ''), f(!1), s(e.messages.tooLarge, 'error'));
        s(`${e.messages.fileReady}: ${d.name}`, 'success');
      }
    }),
      r.querySelector('[data-action="read"]').addEventListener('click', async () => {
        if (!u) {
          if (!d) return s(e.messages.noFile, 'error');
          (f(!0), q(), s(e.messages.reading, 'polite'));
          try {
            let { readPdfBookmarks: n } = await B(),
              t = await n(new Uint8Array(await d.arrayBuffer()));
            ((c = t.pages),
              (a = t.bookmarks.map((g) => ({ ...g }))),
              (S = a.length),
              (l.hidden = !1),
              m(),
              s(e.messages.readSuccess, 'success'));
          } catch (n) {
            ((c = 0), (a = []), (l.hidden = !0));
            let t = /25 MiB/u.test(String(n?.message))
              ? e.messages.tooLarge
              : /between 1 and 300 pages/u.test(String(n?.message))
                ? e.messages.tooManyPages
                : /valid PDF|does not appear/u.test(String(n?.message))
                  ? e.messages.invalid
                  : e.messages.readFailed;
            s(t, 'error');
          } finally {
            f(!1);
          }
        }
      }),
      r.querySelector('[data-action="add"]').addEventListener('click', () => {
        if (u || !c || a.length >= 500) return;
        let n;
        do ((S += 1), (n = `new-bookmark-${S}`));
        while (a.some((t) => t.id === n));
        (a.push({ id: n, title: `${e.fields.newBookmark} ${S}`, page: 1, parentId: '', open: !0 }),
          m());
      }),
      r.querySelector('[data-action="exportJson"]').addEventListener('click', () => {
        if (!c) return s(e.messages.noFile, 'error');
        ((O.value = JSON.stringify(a, null, 2)), s(e.messages.jsonExported, 'success'));
      }),
      r.querySelector('[data-action="importJson"]').addEventListener('click', async () => {
        if (!c) return s(e.messages.noFile, 'error');
        try {
          let { parseBookmarkJson: n } = await B();
          ((a = n(O.value, c)), (S = a.length), m(), s(e.messages.imported, 'success'));
        } catch {
          s(e.messages.jsonInvalid, 'error');
        }
      }),
      r.querySelector('[data-action="save"]').addEventListener('click', async () => {
        if (!u) {
          if (!d || !c) return s(e.messages.noFile, 'error');
          for (let n of a)
            if (!n.title.trim() || !Number.isInteger(n.page) || n.page < 1 || n.page > c)
              return s(e.messages.invalidBookmarks, 'error');
          (f(!0), q(), s(e.messages.saving, 'polite'));
          try {
            let { updatePdfBookmarks: n } = await B(),
              t = await n(new Uint8Array(await d.arrayBuffer()), a);
            w = URL.createObjectURL(new Blob([t.bytes], { type: 'application/pdf' }));
            let g =
              d.name
                .replace(/\.pdf$/iu, '')
                .replace(/[\\/:*?"<>|\u0000-\u001f]/gu, '_')
                .slice(0, 100) || 'document';
            ((k.href = w),
              (k.download = `${g}-bookmarks.pdf`),
              (k.hidden = !1),
              (M.textContent = `${e.fields.pages}: ${t.pages} \xB7 ${e.fields.bookmarkCount}: ${t.bookmarks}`),
              (T.hidden = !1),
              s(e.messages.saved, 'success'));
          } catch (n) {
            let t = /25 MiB|50 MiB/u.test(String(n?.message))
              ? e.messages.tooLarge
              : /between 1 and 300 pages/u.test(String(n?.message))
                ? e.messages.tooManyPages
                : e.messages.saveFailed;
            s(t, 'error');
          } finally {
            f(!1);
          }
        }
      }),
      k.addEventListener('click', () => {
        w && s(e.messages.downloadReady, 'success');
      }),
      r.querySelector('[data-action="reset"]').addEventListener('click', () => {
        u || (r.reset(), (d = null), (c = 0), (a = []), (l.hidden = !0), q(), m(), s(''), f(!1));
      }),
      window.addEventListener('pagehide', P, { once: !0 }),
      m());
  }
})();
