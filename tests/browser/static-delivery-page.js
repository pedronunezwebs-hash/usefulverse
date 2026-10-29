// Evaluate on each top-level local page. Security headers intentionally block
// iframe-based navigation probes. This is a delivery sample, not a tool gate.
async () => {
  if (location.hostname !== '127.0.0.1') throw Error('Local QA only');
  const path = location.pathname, checks = [], input = document.querySelector('textarea');
  const check = (name, pass, details = {}) => checks.push({ name, pass, ...details });
  if (path.includes('/tools/word-counter/')) {
    input.value = 'one two three'; input.dispatchEvent(new Event('input', { bubbles: true }));
    check('reference-count', document.querySelector('#metric-words').textContent === '3' && document.querySelector('#metric-characters').textContent === '13');
  } else if (path.includes('/tools/grammar-checker/')) {
    input.value = 'hello hello  world!!'; document.querySelector('input[name="language"]').value = 'en'; document.querySelector('form').requestSubmit();
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    check('mechanical-findings', document.querySelectorAll('.pending-text-review-list li').length === 3);
  } else if (path.includes('/tools/fancy-text-generator/')) {
    document.querySelector('form').elements.text.value = 'Hello123'; document.querySelector('form').requestSubmit();
    check('unicode-bold-reference', [...document.querySelectorAll('.pending-fancy-text-output')].some(t => t.value === '𝐇𝐞𝐥𝐥𝐨𝟏𝟐𝟑'));
  } else if (path.includes('/tools/markdown-editor/')) {
    const save = document.querySelector('[data-autosave]'); save.checked = false; save.dispatchEvent(new Event('change', { bubbles: true }));
    input.value = '# Local QA\n\n**Safe preview**\n\n<img src=x onerror=alert(1)><script>alert(1)</script>'; input.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-action="preview"]').click(); const preview = document.querySelector('[data-preview]');
    for (let n = 0; n < 100 && preview.hidden; n++) await new Promise(r => setTimeout(r, 20));
    check('sanitized-preview', !preview.hidden && preview.srcdoc.includes('<strong>Safe preview</strong>') && !/<script|<img|onerror=/u.test(preview.srcdoc) && globalThis.DOMPurify?.version === '3.4.17');
  } else {
    const search = document.querySelector('#tool-search'); search.value = 'grammar-checker'; search.dispatchEvent(new Event('input', { bubbles: true }));
    for (let n = 0; n < 100 && document.querySelector('#tool-grid').hasAttribute('aria-busy'); n++) await new Promise(r => setTimeout(r, 20));
    check('complete-directory-search', document.querySelectorAll('#tool-grid .tool-card').length === 1 && document.querySelector('#tool-grid .tool-card').getAttribute('href').endsWith('/tools/grammar-checker/'));
    search.value = ''; search.dispatchEvent(new Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 20));
    check('directory-reset', document.querySelectorAll('#tool-grid .tool-card').length === 4);
  }
  if (path.startsWith('/nb/')) {
    const copy = JSON.parse(document.querySelector('[data-tool-copy]').textContent);
    check('declared-english-fallback', document.documentElement.lang === 'en' && copy.copyLanguage === 'en' && copy.previewFallbackFor === 'nb' && copy.releaseApproved === false);
  }
  check('no-horizontal-overflow', document.documentElement.scrollWidth <= innerWidth);
  check('no-failed-resources', !performance.getEntriesByType('resource').some(r => r.responseStatus >= 400));
  return { path, checks, pass: checks.every(c => c.pass) };
}
