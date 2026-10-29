// Pass this function's contents to Chrome DevTools evaluate_script on a local
// serve-packed-build page. No live services or file/hardware APIs are invoked.
async () => {
  if (location.hostname !== '127.0.0.1') throw Error('Local QA only');
  const rows = [], tasks = [];
  for (const prefix of ['', 'es/', 'de/', 'ar/', 'ja/', 'hi/', 'nb/']) for (const id of ['grammar-checker', 'fancy-text-generator']) {
    const frame = document.createElement('iframe');
    Object.assign(frame.style, { position: 'fixed', top: '0', left: '0', width: '320px', height: '844px', border: '0', zIndex: '10000' });
    const ready = new Promise((resolve, reject) => { frame.onload = resolve; frame.onerror = reject; });
    const route = '/' + prefix + 'tools/' + id + '/'; frame.src = route; document.body.append(frame);
    try {
      await ready; const win = frame.contentWindow, doc = win.document;
      const copy = JSON.parse(doc.querySelector('[data-tool-copy]').textContent);
      const fallbackOK = prefix !== 'nb/' || (doc.documentElement.lang === 'en' && copy.copyLanguage === 'en' && copy.previewFallbackFor === 'nb' && copy.releaseApproved === false);
      const metaOK = /noindex/.test(doc.querySelector('meta[name="robots"]').content) && !doc.querySelector('[hreflang]') && doc.querySelector('[rel="canonical"]').href.endsWith(route);
      for (const width of [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920]) {
        frame.style.width = width + 'px'; await new Promise(r => win.requestAnimationFrame(() => win.requestAnimationFrame(r)));
        const bounds = doc.querySelector('.page-shell').getBoundingClientRect();
        rows.push({ route, width, scrollWidth: doc.documentElement.scrollWidth, left: bounds.left, right: bounds.right, metaOK, fallbackOK,
          pass: metaOK && fallbackOK && doc.documentElement.scrollWidth <= width && bounds.left >= 15.9 && bounds.right <= width - 15.9 });
      }
      if (id === 'grammar-checker') {
        doc.querySelector('textarea').value = 'hello hello  world!!'; doc.querySelector('input[name="language"]').value = 'en';
        doc.querySelector('form').requestSubmit(); await new Promise(r => win.requestAnimationFrame(() => win.requestAnimationFrame(r)));
        const findings = doc.querySelectorAll('.pending-text-review-list li').length;
        tasks.push({ route, findings, pass: findings === 3 });
      }
      const failures = win.performance.getEntriesByType('resource').filter(r => r.responseStatus >= 400).map(r => ({ url: r.name, status: r.responseStatus }));
      tasks.push({ route, type: 'resources', failures, pass: failures.length === 0 });
    } finally { frame.remove(); }
  }
  return { scope: 'two-draft-tools-seven-locales-not-full-quality-gate', rows, tasks, pass: rows.every(r => r.pass) && tasks.every(t => t.pass) };
}
