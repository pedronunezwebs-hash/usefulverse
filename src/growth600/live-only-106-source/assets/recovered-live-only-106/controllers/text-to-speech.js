(() => {
  function C(r) {
    return Array.from(String(r ?? '')).length;
  }
  function O(r, e = 3e4) {
    if (!Number.isInteger(e) || e < 0)
      throw new RangeError('Speech text limit must be a non-negative integer.');
    return Array.from(String(r ?? ''))
      .slice(0, e)
      .join('');
  }
  function M(r, e) {
    if (e > 0 && e < r.length) {
      let t = r.charCodeAt(e - 1),
        s = r.charCodeAt(e);
      if (t >= 55296 && t <= 56319 && s >= 56320 && s <= 57343) return e - 1;
    }
    return e;
  }
  function X(r, e, t) {
    let s = r.slice(e, t),
      c = -1;
    for (let y of s.matchAll(/[.!?。！？](?:[”’"')\]]*)\s+/gu)) c = e + y.index + y[0].length;
    if (c > e) return c;
    let a = r.lastIndexOf(
      `
`,
      t - 1,
    );
    if (a > e) return a + 1;
    let x = Math.max(r.lastIndexOf(' ', t - 1), r.lastIndexOf('	', t - 1));
    return x > e ? x + 1 : t;
  }
  function R(r, e = 1200) {
    let t = String(r ?? '');
    if (!Number.isInteger(e) || e < 2)
      throw new RangeError(
        'Speech chunk size must be an integer of at least two UTF-16 code units.',
      );
    let s = [],
      c = 0;
    for (; c < t.length;) {
      let a = Math.min(t.length, c + e);
      if (
        (a < t.length && (a = X(t, c, a)),
        (a = M(t, a)),
        a <= c && (a = M(t, Math.min(t.length, c + e))),
        a <= c)
      )
        throw new Error('Could not create a safe speech chunk.');
      (s.push(t.slice(c, a)), (c = a));
    }
    return s;
  }
  function D(r = document) {
    let e = r.querySelector('[data-tool-copy]');
    if (!e) throw new Error('Localized tool copy is missing.');
    return JSON.parse(e.textContent);
  }
  function i(r, e, t = 'info') {
    let s = r.querySelector('[data-status]');
    s && ((s.textContent = e), (s.dataset.kind = t));
  }
  var o = document.querySelector('[data-tool="text-to-speech"]');
  if (o) {
    let S = function (n) {
        ((p.play.hidden = n === 'playing' || n === 'paused'),
          (p.pause.hidden = n !== 'playing'),
          (p.resume.hidden = n !== 'paused'),
          (p.stop.hidden = n === 'idle'),
          (P.hidden = n === 'idle'));
      },
      b = function (n) {
        U.value = Math.max(0, Math.min(100, n));
      },
      A = function () {
        a.textContent = new Intl.NumberFormat(document.documentElement.lang || 'en').format(
          C(t.value),
        );
      },
      T = function () {
        let n = h[Number(s.selectedOptions[0]?.dataset.originalIndex)]?.voiceURI;
        h = m?.getVoices?.() ?? [];
        let d = h.filter((f) => f.localService === !0 || c.checked);
        s.replaceChildren(new Option(e.fields.browserDefault, ''));
        for (let [f, l] of d.entries()) {
          let L = l.localService === !0 ? e.fields.localVoice : e.fields.remoteVoice,
            F = new Option(
              `${l.name || l.lang || e.fields.voiceLabel} (${l.lang || '\u2014'}) \u2014 ${L}`,
              String(f),
            );
          ((F.dataset.originalIndex = String(h.indexOf(l))), s.add(F));
        }
        let u = [...s.options].find((f) => h[Number(f.dataset.originalIndex)]?.voiceURI === n);
        s.value = u?.value ?? '';
      },
      _ = function () {
        return s.value
          ? h[Number(s.selectedOptions[0]?.dataset.originalIndex)]
          : (h.find((n) => n.default) ?? null);
      },
      N = function (n = e.messages.stopped, d = !0) {
        ((v += 1),
          (g = !1),
          (I = []),
          (w = 0),
          (E = 0),
          (k = 0),
          m?.cancel?.(),
          S('idle'),
          b(0),
          d && i(o, n, 'success'));
      },
      q = function (n) {
        if (!g || n !== v) return;
        if (w >= I.length) {
          ((g = !1), S('idle'), b(100), i(o, e.messages.finished, 'success'));
          return;
        }
        let d = I[w],
          u = new SpeechSynthesisUtterance(d),
          f = _();
        (f && (u.voice = f),
          (u.rate = Number(x.value)),
          (u.pitch = Number(y.value)),
          (u.onboundary = (l) => {
            if (n !== v) return;
            let L = E + Math.min(d.length, Math.max(0, l.charIndex || 0));
            b((L / Math.max(1, k)) * 100);
          }),
          (u.onend = () => {
            n === v && ((E += d.length), (w += 1), b((E / Math.max(1, k)) * 100), q(n));
          }),
          (u.onerror = (l) => {
            n !== v ||
              l.error === 'canceled' ||
              l.error === 'interrupted' ||
              ((g = !1), S('idle'), i(o, e.messages.playbackError, 'error'));
          }),
          m.speak(u));
      },
      $ = function () {
        if (!m || !V) return i(o, e.messages.unsupported, 'error');
        let n = t.value.trim();
        if (!n) return i(o, e.messages.emptyText, 'error');
        if (C(n) > 3e4) return i(o, e.messages.tooLong, 'error');
        let d = _();
        if (!h.length) return i(o, e.messages.noVoices, 'error');
        if (d?.localService !== !0) {
          if (!c.checked) return i(o, e.messages.selectVoice, 'error');
          if (!window.confirm(e.messages.remoteConfirm)) return;
        }
        (m.cancel(),
          (I = R(n)),
          (k = n.length),
          (w = 0),
          (E = 0),
          (g = !0),
          (v += 1),
          b(0),
          S('playing'),
          i(o, e.messages.playbackStarted, 'success'),
          q(v));
      },
      r = o.querySelector('#tool-form'),
      e = D(o),
      t = r.elements.namedItem('text'),
      s = r.elements.namedItem('voice'),
      c = r.elements.namedItem('showRemote'),
      a = o.querySelector('[data-character-count]'),
      x = r.elements.namedItem('rate'),
      y = r.elements.namedItem('pitch'),
      P = o.querySelector('[data-speech-progress]'),
      U = o.querySelector('#speech-progress'),
      p = Object.fromEntries(
        ['play', 'pause', 'resume', 'stop'].map((n) => [
          n,
          o.querySelector(`[data-action="${n}"]`),
        ]),
      ),
      m = window.speechSynthesis,
      V = typeof window.SpeechSynthesisUtterance == 'function',
      h = [],
      I = [],
      w = 0,
      E = 0,
      k = 0,
      g = !1,
      v = 0;
    (c.addEventListener('change', T),
      m?.addEventListener?.('voiceschanged', T),
      T(),
      S('idle'),
      A(),
      t.addEventListener('input', () => {
        if (C(t.value) > 3e4) {
          let n = t.selectionStart;
          if (n > 0 && n < t.value.length) {
            let f = t.value.charCodeAt(n - 1),
              l = t.value.charCodeAt(n);
            f >= 55296 && f <= 56319 && l >= 56320 && l <= 57343 && (n -= 1);
          }
          let d = C(t.value.slice(0, n));
          t.value = O(t.value);
          let u = Array.from(t.value).slice(0, d).join('').length;
          (t.setSelectionRange(u, u), i(o, e.messages.tooLong, 'error'));
        }
        A();
      }),
      x.addEventListener('input', () => {
        o.querySelector('[data-rate-value]').value = `${x.value}\xD7`;
      }),
      y.addEventListener('input', () => {
        o.querySelector('[data-pitch-value]').value = `${y.value}\xD7`;
      }),
      p.play.addEventListener('click', $),
      p.pause.addEventListener('click', () => {
        g && (m.pause(), S('paused'), i(o, e.messages.paused, 'success'));
      }),
      p.resume.addEventListener('click', () => {
        g && (m.resume(), S('playing'), i(o, e.messages.resumed, 'success'));
      }),
      p.stop.addEventListener('click', () => N()),
      o.querySelector('[data-action="example"]')?.addEventListener('click', () => {
        (N('', !1), (t.value = e.example.text), A(), i(o, e.messages.exampleLoaded, 'success'));
      }),
      o.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
        (N('', !1), (t.value = ''), A(), t.focus(), i(o, e.messages.textCleared, 'success'));
      }),
      r.addEventListener('reset', () => N('', !1)),
      window.addEventListener('pagehide', () => m?.cancel?.(), { once: !0 }));
  }
})();
