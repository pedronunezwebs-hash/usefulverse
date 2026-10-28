// Run through Chrome DevTools evaluate_script on the local composed site.
async () => {
  if (location.hostname !== '127.0.0.1') throw Error('Local QA only');
  const rows = [], tasks = [];
  for (const prefix of ['', 'es/', 'de/', 'ar/', 'ja/', 'hi/', 'nb/']) {
    const frame = document.createElement('iframe');
    Object.assign(frame.style, { position: 'fixed', top: '0', left: '0', width: '320px', height: '900px', border: '0', zIndex: '10000' });
    const ready = new Promise((resolve, reject) => { frame.onload = resolve; frame.onerror = reject; });
    frame.src = '/' + prefix; document.body.append(frame);
    try {
      await ready; const win = frame.contentWindow, doc = win.document;
      for (const width of [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920]) {
        frame.style.width = width + 'px'; await new Promise(r => win.requestAnimationFrame(() => win.requestAnimationFrame(r)));
        const container = doc.querySelector('.page-container') ?? doc.querySelector('main');
        const bounds = container.getBoundingClientRect(), style = win.getComputedStyle(container);
        const left = bounds.left + parseFloat(style.paddingLeft), right = bounds.right - parseFloat(style.paddingRight);
        const controls = [...doc.querySelectorAll('[data-directory-pages] a')].every(a => { const r = a.getBoundingClientRect(); return r.width >= 44 && r.height >= 44; });
        rows.push({ prefix, width, scrollWidth: doc.documentElement.scrollWidth, left, right, controls,
          pass: doc.documentElement.scrollWidth <= width && left >= 15.9 && right <= width - 15.9 && controls });
      }
      const route = '/' + prefix + 'directory/2/';
      const page = new DOMParser().parseFromString(await (await fetch(route)).text(), 'text/html');
      tasks.push({ prefix, type: 'static-pagination', pass: /noindex/.test(page.querySelector('[name="robots"]')?.content) && page.querySelector('[rel="canonical"]')?.href === 'https://usefulverse.com' + route && !page.querySelector('link[rel="alternate"][hreflang]') && page.querySelectorAll('.tool-card, .tool-directory li').length === 100 });
      const search = doc.querySelector('#tool-search');
      if (search) {
        const indexRequests = () => win.performance.getEntriesByType('resource').filter(r => r.name.includes('/assets/search-index-')).length;
        const before = indexRequests();
        search.value = 'fancy-text-generator'; search.dispatchEvent(new win.Event('input', { bubbles: true }));
        for (let i = 0; i < 80 && !doc.querySelector(`.tool-card[href="/${prefix}tools/fancy-text-generator/"]`); i++) await new Promise(r => setTimeout(r, 25));
        tasks.push({ prefix, type: 'complete-search', pass: before === 0 && indexRequests() === 1 && !!doc.querySelector(`.tool-card[href="/${prefix}tools/fancy-text-generator/"]`) && doc.querySelector('[data-directory-pages]').hidden });
        search.value = 'zzzz-no-such-tool-zzz'; search.dispatchEvent(new win.Event('input', { bubbles: true }));
        await new Promise(r => setTimeout(r, 30));
        tasks.push({ prefix, type: 'empty-search', pass: doc.querySelectorAll('.tool-card').length === 0 && !doc.querySelector('#empty-state').hidden });
        search.value = ''; search.dispatchEvent(new win.Event('input', { bubbles: true }));
        await new Promise(r => setTimeout(r, 30));
        tasks.push({ prefix, type: 'reset-search', pass: doc.querySelectorAll('.tool-card').length === 100 && !doc.querySelector('[data-directory-pages]').hidden && doc.querySelector('#empty-state').hidden && indexRequests() === 1 });
      }
      const failures = win.performance.getEntriesByType('resource').filter(r => r.responseStatus >= 400).map(r => ({ url: r.name, status: r.responseStatus }));
      tasks.push({ prefix, type: 'resources', failures, pass: failures.length === 0 });
    } finally { frame.remove(); }
  }
  return { scope: 'composed-directory-seven-locales-not-full-tool-quality-gate', rows, tasks, pass: rows.every(r => r.pass) && tasks.every(t => t.pass) };
}
