(() => {
  function p(r, a, e = 'info') {
    let n = r.querySelector('[data-status]');
    n && ((n.textContent = a), (n.dataset.kind = e));
  }
  function h(r, a, e, n) {
    if (r == null || String(r).trim() === '') throw new RangeError(`${a} is required.`);
    let c = Number(r);
    if (!Number.isFinite(c) || c < e || c > n)
      throw new RangeError(`${a} must be from ${e} to ${n}.`);
    return c;
  }
  function S({ weightKg: r, hoursSinceStart: a, drinks: e }) {
    let n = h(r, 'Weight', 20, 350),
      c = h(a, 'Elapsed time', 0, 24);
    if (!Array.isArray(e) || e.length < 1 || e.length > 8)
      throw new RangeError('Enter 1 to 8 drink rows.');
    let i = 0;
    for (let l of e) {
      let m = h(l?.count, 'Drink count', 0, 30),
        f = h(l?.volumeMl, 'Serving volume', 0, 2e3),
        u = h(l?.abvPercent, 'Alcohol by volume', 0, 100);
      i += m * f * (u / 100) * 0.789;
    }
    if (i > 2e3)
      throw new RangeError('The entered pure alcohol amount exceeds the supported scenario range.');
    if (i === 0)
      return Object.freeze({
        ethanolGrams: 0,
        bacLowPercent: 0,
        bacHighPercent: 0,
        hours: c,
        zeroAlcohol: !0,
      });
    let d = (i * 100) / (n * 1e3 * 0.8),
      v = (i * 100) / (n * 1e3 * 0.45),
      s = Math.max(0, d - 0.03 * c),
      t = Math.max(0, v - 0.01 * c);
    return Object.freeze({
      ethanolGrams: i,
      bacLowPercent: s,
      bacHighPercent: Math.max(s, t),
      hours: c,
      zeroAlcohol: !1,
    });
  }
  var q = Object.freeze({
    maxDrinks: 8,
    weightKg: [20, 350],
    hoursSinceStart: [0, 24],
    count: [0, 30],
    volumeMl: [0, 2e3],
    abvPercent: [0, 100],
  });
  var o = document.querySelector('[data-tool="bac-calculator"]');
  if (o) {
    let s = function () {
        [...e.querySelectorAll('[data-bac-drink]')].forEach((t, l) => {
          t.querySelector('[data-bac-drink-title]').textContent = a.messages.drinkType.replace(
            '{number}',
            String(l + 1),
          );
          for (let [f, u] of [
            ['[data-bac-count]', 'count'],
            ['[data-bac-volume]', 'volume'],
            ['[data-bac-abv]', 'abv'],
          ]) {
            let b = t.querySelector(f),
              y = u === 'count' ? 'count' : u === 'volume' ? 'volume' : 'abv';
            ((b.id = `bac-${y}-${l + 1}`),
              (t.querySelector(`label[for^="bac-${y}-"]`).htmlFor = b.id));
          }
          let m = t.querySelector('[data-action="removeDrink"]');
          m && (m.disabled = e.children.length <= 1);
        });
      },
      r = o.querySelector('#tool-form'),
      a = JSON.parse(o.querySelector('[data-tool-copy]').textContent),
      e = o.querySelector('[data-bac-drink-list]'),
      n = o.querySelector('[data-bac-results]'),
      c = o.querySelector('[data-status]'),
      i = new Intl.NumberFormat(a.copyLanguage.replace('_', '-'), { maximumFractionDigits: 3 }),
      d = (t) =>
        String(t)
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#39;'),
      v = (
        t,
      ) => `<div class="bac-calculator__drink" data-bac-drink><h3 data-bac-drink-title>${d(a.messages.drinkType.replace('{number}', String(t)))}</h3>
    <div class="field"><label for="bac-count-${t}">${d(a.fields.count)}</label><input id="bac-count-${t}" data-bac-count type="number" min="0" max="30" step="any" value="0" required inputmode="decimal"></div>
    <div class="field"><label for="bac-volume-${t}">${d(a.fields.volumeMl)}</label><input id="bac-volume-${t}" data-bac-volume type="number" min="0" max="2000" step="any" value="150" required inputmode="decimal"></div>
    <div class="field"><label for="bac-abv-${t}">${d(a.fields.abvPercent)}</label><input id="bac-abv-${t}" data-bac-abv type="number" min="0" max="100" step="any" value="12" required inputmode="decimal"></div>
    <button type="button" class="button button--secondary" data-action="removeDrink">${d(a.actions.removeDrink)}</button></div>`;
    (e.addEventListener('click', (t) => {
      let l = t.target.closest('[data-action]');
      l?.dataset.action === 'removeDrink' &&
        (l.closest('[data-bac-drink]').remove(), s(), (n.hidden = !0));
    }),
      o.querySelector('[data-action="addDrink"]').addEventListener('click', () => {
        e.children.length >= 8 ||
          (e.insertAdjacentHTML('beforeend', v(e.children.length + 1)), s(), (n.hidden = !0));
      }),
      r.addEventListener('submit', (t) => {
        (t.preventDefault(), (c.textContent = ''));
        try {
          let l = Number(r.elements.weight.value),
            m = r.elements.weightUnit.value === 'lb' ? l / 2.2046226218 : l,
            f = [...e.querySelectorAll('[data-bac-drink]')].map((b) => ({
              count: b.querySelector('[data-bac-count]').value,
              volumeMl: b.querySelector('[data-bac-volume]').value,
              abvPercent: b.querySelector('[data-bac-abv]').value,
            })),
            u = S({ weightKg: m, hoursSinceStart: r.elements.hoursSinceStart.value, drinks: f });
          ((o.querySelector('[data-bac-ethanol]').textContent = `${i.format(u.ethanolGrams)} g`),
            (o.querySelector('[data-bac-low]').textContent = `${i.format(u.bacLowPercent)}%`),
            (o.querySelector('[data-bac-high]').textContent = `${i.format(u.bacHighPercent)}%`),
            (n.hidden = !1),
            p(o, u.zeroAlcohol ? a.messages.zeroAlcohol : a.messages.calculated, 'success'));
        } catch {
          ((n.hidden = !0), p(o, a.messages.invalid, 'error'));
        }
      }),
      o.querySelector('[data-action="example"]').addEventListener('click', () => {
        ((r.elements.weight.value = '70'),
          (r.elements.weightUnit.value = 'kg'),
          (r.elements.hoursSinceStart.value = '1'),
          (e.innerHTML = v(1)),
          (e.querySelector('[data-bac-count]').value = '2'),
          (e.querySelector('[data-bac-volume]').value = '355'),
          (e.querySelector('[data-bac-abv]').value = '5'),
          s(),
          r.requestSubmit());
      }),
      o.querySelector('[data-action="reset"]').addEventListener('click', () => {
        (r.reset(),
          (e.innerHTML = v(1)),
          (e.querySelector('[data-bac-count]').value = '1'),
          (e.querySelector('[data-bac-volume]').value = '355'),
          (e.querySelector('[data-bac-abv]').value = '5'),
          s(),
          (n.hidden = !0),
          (c.textContent = ''));
      }),
      s());
  }
})();
