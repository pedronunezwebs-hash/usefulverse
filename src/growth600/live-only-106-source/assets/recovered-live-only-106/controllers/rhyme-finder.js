(() => {
  function S(t, r) {
    return typeof Intl.Segmenter == 'function'
      ? [...new Intl.Segmenter(r, { granularity: 'grapheme' }).segment(t)].map(
          ({ segment: c }) => c,
        )
      : [...t];
  }
  function h(t, { locale: r = 'en', ignoreDiacritics: c = !1 } = {}) {
    let o = t.normalize('NFC').toLocaleLowerCase(r);
    return c ? o.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC') : o;
  }
  function x(t) {
    let r = String(t ?? '');
    if (r.length > 5e4) throw new RangeError('Text is limited to 50000 characters.');
    let c = r.match(/[\p{L}\p{M}]+/gu) ?? [];
    if (c.length > 5e3) throw new RangeError('Text is limited to 5000 words.');
    return c;
  }
  function y(t, { suffixLength: r = 3, ignoreDiacritics: c = !1, locale: o = 'en' } = {}) {
    if (!Number.isInteger(r) || r < 1 || r > 8)
      throw new RangeError('Ending length must be from 1 to 8 letters.');
    let i = x(t);
    if (!i.length)
      return Object.freeze({
        words: Object.freeze([]),
        groups: Object.freeze([]),
        unmatchedCount: 0,
      });
    let l = new Map();
    for (let e of i) {
      let a = h(e, { locale: o });
      l.has(a) || l.set(a, e.normalize('NFC'));
    }
    let u = new Map();
    for (let e of l.values()) {
      let a = S(h(e, { locale: o, ignoreDiacritics: c }), o)
        .slice(-r)
        .join('');
      a && (u.has(a) || u.set(a, []), u.get(a).push(e));
    }
    let m = new Intl.Collator(o, { sensitivity: 'base' }),
      d = [...u.entries()]
        .filter(([, e]) => e.length > 1)
        .map(([e, a]) => Object.freeze({ ending: e, words: Object.freeze(a.sort(m.compare)) }))
        .sort((e, a) => m.compare(e.ending, a.ending));
    return Object.freeze({
      words: Object.freeze([...l.values()].sort(m.compare)),
      groups: Object.freeze(d),
      unmatchedCount: [...u.values()].filter((e) => e.length === 1).length,
    });
  }
  var b = Object.freeze({ maxTextLength: 5e4, maxWords: 5e3, maxSuffixLength: 8 });
  function w(t = document) {
    let r = t.querySelector('[data-tool-copy]');
    if (!r) throw new Error('Localized tool copy is missing.');
    return JSON.parse(r.textContent);
  }
  function s(t, r, c = 'info') {
    let o = t.querySelector('[data-status]');
    o && ((o.textContent = r), (o.dataset.kind = c));
  }
  var n = document.querySelector('[data-tool="rhyme-finder"]');
  if (n) {
    let m = function () {
        (c.reset(),
          i.replaceChildren(),
          (n.querySelector('[data-results-panel]').hidden = !0),
          s(n, t.messages.cleared, 'info'),
          o.focus());
      },
      t = w(n),
      r = t.copyLanguage || document.documentElement.lang || 'en',
      c = n.querySelector('[data-rhyme-form]'),
      o = n.querySelector('[data-rhyme-input]'),
      i = n.querySelector('[data-rhyme-results]'),
      l = n.querySelector('[data-group-count]'),
      u = n.querySelector('[data-unmatched-count]');
    (c.addEventListener('submit', (d) => {
      d.preventDefault();
      try {
        let e = y(o.value, {
          suffixLength: Number(n.querySelector('[data-suffix-length]').value),
          ignoreDiacritics: n.querySelector('[data-ignore-diacritics]').checked,
          locale: r,
        });
        if (!e.words.length) {
          (s(n, t.messages.emptyInput, 'error'), o.focus());
          return;
        }
        i.replaceChildren();
        for (let a of e.groups) {
          let p = document.createElement('section');
          p.className = 'rhyme-finder__group';
          let f = document.createElement('h3');
          f.textContent = `${t.fields.ending}: \u201C${a.ending}\u201D`;
          let g = document.createElement('p');
          ((g.textContent = a.words.join(', ')), p.append(f, g), i.append(p));
        }
        ((n.querySelector('[data-results-panel]').hidden = !1),
          (l.textContent = String(e.groups.length)),
          (u.textContent = String(e.unmatchedCount)),
          s(
            n,
            t.messages.analyzed
              .replace('{groups}', String(e.groups.length))
              .replace('{words}', String(e.words.length)),
            'success',
          ));
      } catch (e) {
        s(n, e instanceof RangeError ? t.messages.inputLimit : t.messages.invalidInput, 'error');
      }
    }),
      n.querySelector('[data-action="clear"]')?.addEventListener('click', m),
      n.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
        let d = [...i.querySelectorAll('.rhyme-finder__group')].map(
          (e) => `${e.querySelector('h3').textContent}
${e.querySelector('p').textContent}`,
        ).join(`

`);
        if (!d) {
          s(n, t.messages.emptyResults, 'error');
          return;
        }
        try {
          (await navigator.clipboard.writeText(d), s(n, t.messages.copied, 'success'));
        } catch {
          s(n, t.messages.copyUnavailable, 'error');
        }
      }));
  }
})();
