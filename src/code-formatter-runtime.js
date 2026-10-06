const $ = (selector, root) => root.querySelector(selector);

export function setupCodeFormatter(root) {
  const engine = root.dataset.opEngine;
  const moduleName = {
    'html-format': 'formatter-html-engine.js',
    'css-format': 'formatter-css-engine.js',
    'javascript-format': 'formatter-javascript-engine.js',
  }[engine];
  const bundle = window.usefulverseLocale ?? { runtime: {}, messages: {} };
  const say = (text) => bundle.runtime?.[text] ?? bundle.messages?.[text] ?? text;
  const status = (text, type = '') => {
    const node = $('[role="status"]', root);
    if (node) { node.textContent = say(text); node.className = `tool-status${type ? ` is-${type}` : ''}`; }
  };
  const sourceField = $('[data-op-field="source"]', root);
  const modeField = $('[data-op-field="mode"]', root);
  const output = $('#op-output', root);
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-op-calculate]')) {
      const source = sourceField.value;
      if (!source.trim() || source.length > 200_000) {
        output.textContent = '—'; status('Paste non-empty source under 200,000 characters.', 'error'); return;
      }
      status('Processing locally in this browser…');
      try {
        const version = encodeURIComponent(document.documentElement.dataset.assetVersion || '');
        const { processHtml, processCss, processJavaScript } = await import(`/assets/${moduleName}?v=${version}`);
        const process = processHtml ?? processCss ?? processJavaScript;
        output.textContent = await process(source, modeField.value);
        status('Result ready. This calculation runs locally in your browser.', 'success');
      } catch (error) {
        output.textContent = '—';
        status(error instanceof Error ? error.message : 'Check your source and try again.', 'error');
      }
      return;
    }
    if (event.target.closest('[data-op-clear]')) {
      sourceField.value = ''; modeField.value = 'format'; output.textContent = '—';
      status('Fields cleared.'); sourceField.focus();
      return;
    }
    if (event.target.closest('[data-op-copy]')) {
      const text = output.textContent;
      if (!text || text === '—') { status('There is nothing to copy yet.', 'error'); return; }
      try { await navigator.clipboard.writeText(text); status('Copied to your clipboard.', 'success'); }
      catch { status('Copy was blocked. Select the result and copy it manually.', 'error'); }
    }
  });
}
