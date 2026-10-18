(() => {
  function k(a = document) {
    let t = a.querySelector('[data-tool-copy]');
    if (!t) throw new Error('Localized tool copy is missing.');
    return JSON.parse(t.textContent);
  }
  function s(a, t, o = 'info') {
    let c = a.querySelector('[data-status]');
    c && ((c.textContent = t), (c.dataset.kind = o));
  }
  var e = document.querySelector('[data-tool="bcrypt-generator"]');
  if (e) {
    let l = function () {
        (i?.terminate(),
          (i = null),
          (x.hidden = !0),
          (p.hidden = !0),
          (p.disabled = !0),
          S.filter((r) => r.dataset.action !== 'cancel').forEach((r) => {
            r.disabled = !1;
          }));
      },
      u = function () {
        ((g.hidden = !0), (m.value = ''), (b.textContent = ''), (v.value = 0));
      },
      d = function () {
        o.value = '';
      },
      y = function (r) {
        (l(), d(), u(), s(e, t.messages[r] ?? t.messages['hash-failed'], 'error'));
      },
      I = function (r) {
        u();
        let f = o.value,
          w = h.value.trim();
        if (!f) return s(e, t.messages['password-empty'], 'error');
        if (r === 'verify' && !/^\$2[abxy]\$\d{2}\$[./A-Za-z0-9]{53}$/u.test(w))
          return s(e, t.messages['invalid-hash'], 'error');
        let q = a.dataset.workerSrc;
        if (!q || typeof Worker != 'function') return y('worker-unavailable');
        try {
          i = new Worker(q, { type: 'module', name: 'usefulverse-bcrypt' });
        } catch {
          return y('worker-unavailable');
        }
        let E = ++C;
        ((x.hidden = !1),
          (v.value = 0),
          (p.hidden = !1),
          (p.disabled = !1),
          S.filter((n) => n.dataset.action !== 'cancel').forEach((n) => {
            n.disabled = !0;
          }),
          s(e, r === 'verify' ? t.messages.verifying : t.messages.hashing, 'info'),
          i.addEventListener('message', ({ data: n }) => {
            n?.id === E &&
              (n.type === 'progress'
                ? (v.value = Math.min(1, Math.max(0, Number(n.progress) || 0)))
                : n.type === 'hash-result'
                  ? (l(),
                    d(),
                    (m.value = n.value),
                    (b.textContent = ''),
                    (g.hidden = !1),
                    s(e, t.messages.hashReady, 'success'))
                  : n.type === 'verify-result'
                    ? (l(),
                      d(),
                      (m.value = w),
                      (b.textContent = n.matches ? t.messages.matched : t.messages.mismatch),
                      (g.hidden = !1),
                      s(
                        e,
                        n.matches ? t.messages.matched : t.messages.mismatch,
                        n.matches ? 'success' : 'error',
                      ))
                    : n.type === 'error' && y(n.code));
          }),
          i.addEventListener('error', () => y('hash-failed'), { once: !0 }),
          i.postMessage({
            id: E,
            action: r === 'verify' ? 'verify' : 'hash',
            password: f,
            cost: Number(c.value),
            hash: w,
          }));
      },
      a = e.querySelector('#tool-form'),
      t = k(e),
      o = a.elements.namedItem('password'),
      c = a.elements.namedItem('cost'),
      h = a.elements.namedItem('hashToVerify'),
      x = e.querySelector('[data-progress-label]'),
      v = e.querySelector('[data-progress]'),
      g = e.querySelector('[data-result]'),
      m = e.querySelector('[data-bcrypt-hash-output]'),
      b = e.querySelector('[data-bcrypt-verification]'),
      p = e.querySelector('[data-action="cancel"]'),
      S = [...a.querySelectorAll('button')],
      i = null,
      C = 0;
    (a.addEventListener('submit', (r) => {
      r.preventDefault();
      let f = r.submitter?.dataset.action;
      (f === 'generate' || f === 'verify') && I(f);
    }),
      e.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        (u(),
          (o.value = 'usefulverse-demo-only-2026'),
          (h.value = ''),
          o.focus(),
          s(e, t.fields.demoOnly, 'info'));
      }),
      p.addEventListener('click', () => {
        i && (l(), d(), u(), s(e, t.messages.cancelled, 'info'));
      }),
      e.querySelector('[data-action="copyHash"]')?.addEventListener('click', async () => {
        if (m.value)
          try {
            if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
            (await navigator.clipboard.writeText(m.value), s(e, t.messages.copied, 'success'));
          } catch {
            s(e, t.messages.copyFailed, 'error');
          }
      }),
      a.addEventListener('reset', () => {
        (l(),
          queueMicrotask(() => {
            (d(), u(), (h.value = ''), s(e, '', 'info'));
          }));
      }),
      a.addEventListener('input', (r) => {
        (r.target === o || r.target === h || r.target === c) && u();
      }),
      window.addEventListener('pagehide', () => {
        (l(), d());
      }));
  }
})();
