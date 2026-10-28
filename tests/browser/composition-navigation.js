// Chrome DevTools evaluate_script function (this file's contents), on the local
// build-composition-smoke server. No production or external endpoints are used.
async () => {
  if (location.hostname !== '127.0.0.1') throw Error('Run only on the local partial composition');
  const widths = [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920];
  const rows = [], tasks = [];
  for (const prefix of ['', 'es/', 'ar/']) for (const route of ['', 'tools/word-counter/', 'tools/markdown-editor/', 'tools/grammar-checker/']) {
    const frame = document.createElement('iframe');
    Object.assign(frame.style, { position: 'fixed', left: '0', top: '0', width: '320px', height: '844px', border: '0', zIndex: '10000' });
    const ready = new Promise((resolve, reject) => { frame.onload = resolve; frame.onerror = reject; });
    frame.src = '/' + prefix + route; document.body.append(frame);
    try {
      await ready;
      const win = frame.contentWindow, doc = win.document;
      if (!doc.querySelector('h1')) throw Error('Page did not render');
      const noindex = /noindex/i.test(doc.querySelector('meta[name="robots"]')?.content ?? '');
      const expectedNoindex = route.includes('grammar-checker');
      const metaOK = noindex === expectedNoindex && doc.querySelector('link[rel="canonical"]')?.href === 'https://usefulverse.com/' + prefix + route;
      for (const width of widths) {
        frame.style.width = width + 'px';
        await new Promise(r => win.requestAnimationFrame(() => win.requestAnimationFrame(r)));
        const containers = [...doc.querySelectorAll('.page-container, .page-shell')].filter(el => el.getBoundingClientRect().width);
        const marginsOK = containers.length > 0 && containers.every(el => { const b = el.getBoundingClientRect(); return b.left >= 15.9 && b.right <= width - 15.9; });
        rows.push({ route: '/' + prefix + route, width, scrollWidth: doc.documentElement.scrollWidth, metaOK, marginsOK,
          pass: metaOK && marginsOK && doc.documentElement.scrollWidth <= width });
      }
      if (!route) {
        const search = doc.querySelector('#tool-search'), cards = [...doc.querySelectorAll('#tool-grid .tool-card')];
        const grid = doc.querySelector('#tool-grid');
        const requests = () => win.performance.getEntriesByType('resource').filter(r => r.name.includes('/assets/search-index-')).length;
        const beforeQueries = requests();
        search.value = 'grammar-checker'; search.dispatchEvent(new win.Event('input', { bubbles: true }));
        for (let tick = 0; grid.hasAttribute('aria-busy') && tick < 120; tick++) await new Promise(r => win.requestAnimationFrame(r));
        const found = cards.filter(a => !a.hidden).map(a => a.getAttribute('href'));
        search.value = 'no-such-tool-xxxx'; search.dispatchEvent(new win.Event('input', { bubbles: true }));
        const emptyOK = cards.every(a => a.hidden) && !doc.querySelector('#empty-state').hidden;
        search.value = ''; search.dispatchEvent(new win.Event('input', { bubbles: true }));
        tasks.push({ route: '/' + prefix, type: 'directory-search', cards: cards.length, found, emptyOK,
          pass: cards.length === 3 && found.length === 1 && found[0] === '/' + prefix + 'tools/grammar-checker/' && emptyOK && cards.every(a => !a.hidden) });
        const afterQueries = requests();
        tasks.push({ route: '/' + prefix, type: 'search-index-on-demand', beforeQueries, afterQueries,
          pass: beforeQueries === 0 && afterQueries === 1 && !grid.hasAttribute('aria-busy') });
        if (!prefix) {
          search.value = 'letter counter'; search.dispatchEvent(new win.Event('input', { bubbles: true }));
          const vocabulary = cards.filter(a => !a.hidden).map(a => a.getAttribute('href'));
          tasks.push({ route: '/', type: 'retained-search-keywords', vocabulary, pass: vocabulary.length === 1 && vocabulary[0] === '/tools/word-counter/' });
        }
      }
      if (route.includes('word-counter')) {
        const input = doc.querySelector('textarea'); input.value = 'one two three'; input.dispatchEvent(new win.Event('input', { bubbles: true }));
        const words = doc.querySelector('#metric-words')?.textContent;
        const characters = doc.querySelector('#metric-characters')?.textContent;
        tasks.push({ route: '/' + prefix + route, type: 'primary-count', words, characters, pass: words === '3' && characters === '13' });
      }
      if (route.includes('grammar-checker')) {
        const input = doc.querySelector('textarea'); input.value = 'hello hello  world!!';
        doc.querySelector('input[name="language"]').value = 'en';
        doc.querySelector('form').requestSubmit();
        await new Promise(r => win.requestAnimationFrame(() => win.requestAnimationFrame(r)));
        const findings = doc.querySelectorAll('.pending-text-review-list li').length;
        tasks.push({ route: '/' + prefix + route, type: 'draft-mechanical-review', findings, pass: findings === 3 && input.spellcheck });
      }
      const failedAssets = win.performance.getEntriesByType('resource').filter(r => r.responseStatus >= 400).map(r => ({ url: r.name, status: r.responseStatus }));
      tasks.push({ route: '/' + prefix + route, type: 'initial-resource-status', failedAssets, pass: failedAssets.length === 0 });
    } finally { frame.remove(); }
  }
  return { scope: 'partial-composition-not-full-gate', rows, tasks, pass: rows.every(r => r.pass) && tasks.every(t => t.pass) };
}
